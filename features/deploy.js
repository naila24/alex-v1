#!/usr/bin/env node

require('dotenv').config();
const PQueue = require('p-queue');
const toml = require('@iarna/toml');
const fs = require('fs');
const path = require('path');
const { pick, sortBy, groupBy, reduce } = require('lodash');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { toPairs } = require('lodash');
const { sleep } = require('../init-js-tool/utils');
const {
  getDeployerPK,
  network,
  genesis_transfer,
} = require('../init-js-tool/wallet');
const {
  makeContractDeploy,
  broadcastTransaction,
} = require('@stacks/transactions');
const {
  STACKS_API_URL,
  DEPLOYER_ACCOUNT_ADDRESS,
} = require('../init-js-tool/constants');
const { exit } = require('process');
const chalk = require('chalk');

const contract_records = { Contracts: [] };
let VERSION;

const getAllMatches = (source, regex) => {
  const matches = [];
  source.replace(regex, function () {
    matches.push({
      match: arguments[0],
      offset: arguments[arguments.length - 2],
      groups: Array.prototype.slice.call(arguments, 1, -2),
    });
    return arguments[0];
  });
  return matches;
};

async function deployAllContracts() {
  const clarinetConfig = toml.parse(
    fs.readFileSync(
      path.resolve(__dirname, '../clarity/Clarinet.toml'),
      'utf8',
    ),
  );

  const weight = {};

  const contracts = clarinetConfig.contracts;

  function checkDependencies(contractName) {
    const content = fs.readFileSync(
      path.resolve(__dirname, '../clarity/' + contracts[contractName].path),
      'utf8',
    );

    const regex = /contract-call\? \.([\w|-]*) /gm;

    const match = getAllMatches(content, regex);
    const contractCalls = Array.from(new Set(match.map(m => m.groups[0])));

    contractCalls.forEach(calledContract => {
      if (!contracts[contractName].depends_on.includes(calledContract)) {
        console.log(
          `contract: ${chalk.blue(contractName)} called: [${chalk.red(
            calledContract,
          )}] but not in dependencies. fixed in: ${
            contracts[contractName].path
          }`,
        );
      }
    });
  }

  // checkDependencies from clarity code report unresolved dependencies
  Object.keys(contracts).forEach(checkDependencies);

  const rootCounted = new Set();

  const countWeight = (contractName, length) => {
    if (weight[contractName] == null) {
      weight[contractName] = 0;
    }
    weight[contractName] += length;
    contracts[contractName].depends_on.forEach(name => {
      countWeight(name, length + 1);
    });
  };

  const keys = Object.keys(contracts);
  keys.forEach(countWeight);
  keys.reverse().forEach(countWeight);

  weight; /*?*/

  const weightPair = sortBy(
    toPairs(weight),
    ([name, weight]) => weight,
  ).reverse();

  const inQueue = new Set();

  const queue = new PQueue.default({ concurrency: 1 });

  weightPair.forEach((p, index) => {
    const contractName = p[0];
    queue.add(async () => {
      if (inQueue.has(contractName)) {
        return;
      }
      inQueue.add(contractName);

      console.log(
        `Deploying - ${chalk.yellow(
          `${index + 1}/${weightPair.length}`,
        )} - ${contractName} <> ${p[1]}`,
      );
      await deploy(contracts, contractName, p[1]);
    });
  });

  await queue.onIdle();
}

async function deploy(contracts, contractName, weight) {
  const contract = contracts[contractName];
  if (contract == null) {
    throw new Error(`Contract ${contractName} not found`);
  }
  const contractPath = contract.path;

  let privatekey = await getDeployerPK();
  const txOptions = {
    contractName: contractName,
    codeBody: fs
      .readFileSync(path.resolve(__dirname, `../clarity/`, contractPath))
      .toString(),
    senderKey: privatekey,
    network,
  };
  const transaction = await makeContractDeploy(txOptions);
  const broadcast_id = await broadcastTransaction(transaction, network);
  console.log(`${STACKS_API_URL()}/extended/v1/tx/0x${broadcast_id.txid}`);
  let counter = 0;
  while (true) {
    await sleep(2000);
    let truth = await fetch(
      `${STACKS_API_URL()}/extended/v1/tx/${broadcast_id.txid}`,
    );
    let res = await truth.json();
    console.log(
      `[${counter++}][${weight}] Waiting... ${
        broadcast_id.txid
      } - ${contractName}`,
    );
    if (res['tx_status'] === 'success') {
      console.log(
        `Contract ${chalk.blue(contractName)} Deployed ${chalk.green(
          'Successfully',
        )}`,
      );
      contract_records['Contracts'].push({
        name: contractName,
        version: VERSION,
        deployer: DEPLOYER_ACCOUNT_ADDRESS(),
      });
      break;
    } else if (res['tx_status'] === 'abort_by_response') {
      console.log(
        `Contract ${chalk.red(contractName)} - Transaction aborted: `,
        res['tx_result']['repr'],
      );
      break;
    } else if (res.hasOwnProperty('error')) {
      console.log(
        `Contract ${chalk.redBright(contractName)} Transaction error: `,
        res['error'],
      );
      break;
    }
  }
}

const argv = yargs(hideBin(process.argv))
  .option('init', {
    alias: 'i',
    describe: 'genesis transfer',
    type: 'boolean',
    default: false,
  })
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging',
  })
  .parse();

const run = async () => {
  if (argv.init) {
    await genesis_transfer();
  }

  await deployAllContracts();

  fs.writeFile(
    './contract-records.json',
    JSON.stringify(contract_records),
    'utf8',
    function (err) {
      if (err) throw err;
      console.log('File created');
      exit();
    },
  );
};

run().then();
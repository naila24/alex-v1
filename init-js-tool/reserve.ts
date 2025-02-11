import {
  AnchorMode,
  broadcastTransaction,
  callReadOnlyFunction,
  contractPrincipalCV,
  makeContractCall,
  PostConditionMode,
  someCV,
  stringUtf8CV,
  uintCV,
} from '@stacks/transactions';
import { principalCV } from '@stacks/transactions/dist/clarity/types/principalCV';

import { getDeployerPK, network } from './wallet';
import { wait_until_confirmation } from './utils';
import { DEPLOYER_ACCOUNT_ADDRESS, USER_ACCOUNT_ADDRESS } from './constants';

export const reserveAddToken = async (token: string) => {
  console.log(
    '--------------------------------------------------------------------------',
  );
  console.log('[reserve] add-token...', token);
  const privateKey = await getDeployerPK();
  const txOptions = {
    contractAddress: DEPLOYER_ACCOUNT_ADDRESS(),
    contractName: 'alex-reserve-pool',
    functionName: 'add-token',
    functionArgs: [contractPrincipalCV(DEPLOYER_ACCOUNT_ADDRESS(), token)],
    senderKey: privateKey,
    validateWithAbi: true,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
  };
  try {
    const transaction = await makeContractCall(txOptions);
    const broadcastResponse = await broadcastTransaction(transaction, network);
    console.log(broadcastResponse);
    return await wait_until_confirmation(broadcastResponse.txid);
  } catch (error) {
    console.log(error);
  }
};

export const reserveSetActivationThreshold = async (
  activation_threshold: number,
) => {
  console.log(
    '--------------------------------------------------------------------------',
  );
  console.log('[reserve] set-activation-threshold...', activation_threshold);
  const privateKey = await getDeployerPK();
  const txOptions = {
    contractAddress: DEPLOYER_ACCOUNT_ADDRESS(),
    contractName: 'alex-reserve-pool',
    functionName: 'set-activation-threshold',
    functionArgs: [uintCV(activation_threshold)],
    senderKey: privateKey,
    validateWithAbi: true,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
  };
  try {
    const transaction = await makeContractCall(txOptions);
    const broadcastResponse = await broadcastTransaction(transaction, network);
    console.log(broadcastResponse);
    return await wait_until_confirmation(broadcastResponse.txid);
  } catch (error) {
    console.log(error);
  }
};

export const reserveSetActivationDelay = async (activation_delay: number) => {
  console.log(
    '--------------------------------------------------------------------------',
  );
  console.log('[reserve] set-activation-delay...', activation_delay);
  const privateKey = await getDeployerPK();
  const txOptions = {
    contractAddress: DEPLOYER_ACCOUNT_ADDRESS(),
    contractName: 'alex-reserve-pool',
    functionName: 'set-activation-delay',
    functionArgs: [uintCV(activation_delay)],
    senderKey: privateKey,
    validateWithAbi: true,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
  };
  try {
    const transaction = await makeContractCall(txOptions);
    const broadcastResponse = await broadcastTransaction(transaction, network);
    console.log(broadcastResponse);
    return await wait_until_confirmation(broadcastResponse.txid);
  } catch (error) {
    console.log(error);
  }
};

export const reserveRegisterUser = async (token: string) => {
  console.log(
    '--------------------------------------------------------------------------',
  );
  console.log('[reserve] register-user...', token);
  const privateKey = await getDeployerPK();
  const txOptions = {
    contractAddress: DEPLOYER_ACCOUNT_ADDRESS(),
    contractName: 'alex-reserve-pool',
    functionName: 'register-user',
    functionArgs: [
      contractPrincipalCV(DEPLOYER_ACCOUNT_ADDRESS(), token),
      someCV(stringUtf8CV('')),
    ],
    senderKey: privateKey,
    validateWithAbi: true,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
  };
  try {
    const transaction = await makeContractCall(txOptions);
    const broadcastResponse = await broadcastTransaction(transaction, network);
    console.log(broadcastResponse);
    return await wait_until_confirmation(broadcastResponse.txid);
  } catch (error) {
    console.log(error);
  }
};

export const reserveSetCoinbaseAmount = async (
  token: string,
  coinbase1: number,
  coinbase2: number,
  coinbase3: number,
  coinbase4: number,
  coinbase5: number,
) => {
  console.log(
    '--------------------------------------------------------------------------',
  );
  console.log(
    '[reserve] set-coinbase-amount...',
    token,
    coinbase1,
    coinbase2,
    coinbase3,
    coinbase4,
    coinbase5,
  );
  const privateKey = await getDeployerPK();
  const txOptions = {
    contractAddress: DEPLOYER_ACCOUNT_ADDRESS(),
    contractName: 'alex-reserve-pool',
    functionName: 'set-coinbase-amount',
    functionArgs: [
      contractPrincipalCV(DEPLOYER_ACCOUNT_ADDRESS(), token),
      uintCV(coinbase1),
      uintCV(coinbase2),
      uintCV(coinbase3),
      uintCV(coinbase4),
      uintCV(coinbase5),
    ],
    senderKey: privateKey,
    validateWithAbi: true,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
  };
  try {
    const transaction = await makeContractCall(txOptions);
    const broadcastResponse = await broadcastTransaction(transaction, network);
    console.log(broadcastResponse);
    return await wait_until_confirmation(broadcastResponse.txid);
  } catch (error) {
    console.log(error);
  }
};

export const reserveGetUserId = async (token: string, user: string) => {
  console.log(
    '--------------------------------------------------------------------------',
  );
  console.log('[reserve] get-user-id...', token, user);
  const options = {
      contractAddress: DEPLOYER_ACCOUNT_ADDRESS(),
      contractName: 'alex-reserve-pool',
      functionName: 'get-user-id',
      functionArgs: [
        contractPrincipalCV(DEPLOYER_ACCOUNT_ADDRESS(), token),
        principalCV(user)
      ],
      network: network,
      senderAddress: USER_ACCOUNT_ADDRESS(),
    };
    try {
      return callReadOnlyFunction(options);
      
    } catch (error) {
      console.log(error);
    }
  };    

export const reserveGetStakerAtCycleOrDefault = async (
  token: string,
  reward_cycle: number,
  user_id: number,
) => {
  console.log(
    '--------------------------------------------------------------------------',
  );
  console.log(
    '[reserve] get-staker-at-cycle-or-default...',
    token,
    reward_cycle,
    user_id,
  );

  const options = {
    contractAddress: DEPLOYER_ACCOUNT_ADDRESS(),
    contractName: 'alex-reserve-pool',
    functionName: 'get-staker-at-cycle-or-default',
    functionArgs: [
      contractPrincipalCV(DEPLOYER_ACCOUNT_ADDRESS(), token),
      uintCV(reward_cycle),
      uintCV(user_id),
    ],
    network: network,
    senderAddress: USER_ACCOUNT_ADDRESS(),
  };
  try {
    return callReadOnlyFunction(options);
  } catch (error) {
    console.log(error);
  }
};

export const reserveSetRewardCycleLength = async (length: number) => {
  console.log(
    '--------------------------------------------------------------------------',
  );
  console.log('[reserve] set-reward-cycle-length...', length);
  const privateKey = await getDeployerPK();
  const txOptions = {
    contractAddress: DEPLOYER_ACCOUNT_ADDRESS(),
    contractName: 'alex-reserve-pool',
    functionName: 'set-reward-cycle-length',
    functionArgs: [uintCV(length)],
    senderKey: privateKey,
    validateWithAbi: true,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
  };
  try {
    const transaction = await makeContractCall(txOptions);
    const broadcastResponse = await broadcastTransaction(transaction, network);
    console.log(broadcastResponse);
    return await wait_until_confirmation(broadcastResponse.txid);
  } catch (error) {
    console.log(error);
  }
};

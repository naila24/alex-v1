const {
    getPK, network
} = require('./wallet');
const {
    makeContractCall,
    callReadOnlyFunction,
    AnchorMode,
    PostConditionMode,
    uintCV,
    contractPrincipalCV,
    broadcastTransaction,
    ClarityType
} = require('@stacks/transactions');


const flExecuteMarginUsdaWbtc59760 = async(amount) => {
    console.log('[FL] execute-margin-usda-wbtc-59760...', amount);
    const privateKey = await getPK();
    const txOptions = {
        contractAddress: process.env.ACCOUNT_ADDRESS,
        contractName: 'flash-loan-user-margin-usda-wbtc-59760',
        functionName: 'execute-margin-usda-wbtc-59760',
        functionArgs: [
            uintCV(amount),
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
    } catch (error) {
        console.log(error);
    }
}

exports.flExecuteMarginUsdaWbtc59760 = flExecuteMarginUsdaWbtc59760;
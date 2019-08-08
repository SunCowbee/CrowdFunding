const Web3 = require('web3');
const compileContracts = require('./compile');
const HDWalletProvider = require('truffle-hdwallet-provider');
let mnemonic = 'multiply sudden toast dumb border direct follow marriage egg myself idea trash';
const provider = new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/v3/12e8d8b53cee48ef91b8ddaeb116ede3');
const web3 = new Web3(provider);

async function deployContract(compileContract, contractName) {
    console.log('--------------------------------------Start Deploy--------------------------------------')
    const {interface, bytecode} = compileContract;
    let gasEstimate = await web3.eth.estimateGas({data: '0x' + bytecode});
    const accounts = await web3.eth.getAccounts();
    let account = accounts[0];
    console.log('account: ' + account);
    const contract = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: '0x' + bytecode})
        .send({from: account, gas: gasEstimate});
        // .send({
        //     from: account,
        //     gas: gasEstimate,
        //     arguments: [123, 'My String']
        // });
    console.log(contract);
    console.log('--------------------------------------Contract Address--------------------------------------');
    console.log("address: " + contract.options.address + " => " + contractName);
    console.log('--------------------------------------Interface--------------------------------------');
    console.log(interface);
}

deploy = async () => {
    // 部署不需要参数
    await deployContract(compileContracts.FundingFactory, 'FundingFactory');
    // 部署需要参数
    // await deployContract(compileContracts.Funding, 'Funding');
};

deploy();
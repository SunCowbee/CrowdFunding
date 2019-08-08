import web3 from './web3';

const fundingFactoryAddress = '0x195b61e7633d504fe238cd5600b5cd594e739ae3';
const fundingFactoryABI = [{"constant": false, "inputs": [{"name": "_projectName", "type": "string"}, {"name": "_supportMoney", "type": "uint256"}, {"name": "_goalMoney", "type": "uint256"}], "name": "createFunding", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": true, "inputs": [], "name": "getFundings", "outputs": [{"name": "", "type": "address[]"}], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": true, "inputs": [], "name": "getPlayerFoundings", "outputs": [{"name": "", "type": "address[]"}], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": true, "inputs": [{"name": "", "type": "uint256"}], "name": "fundings", "outputs": [{"name": "", "type": "address"}], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": true, "inputs": [], "name": "getCreatorFundings", "outputs": [{"name": "", "type": "address[]"}], "payable": false, "stateMutability": "view", "type": "function"}, {"inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor"}]
const fundingFactory = new web3.eth.Contract(fundingFactoryABI,fundingFactoryAddress);
const fundingABI = [{"constant": false, "inputs": [{"name": "index", "type": "uint256"}], "name": "finalizeRequest", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": false, "inputs": [], "name": "support", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function"}, {"constant": true, "inputs": [], "name": "getTotalBalance", "outputs": [{"name": "", "type": "uint256"}], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": false, "inputs": [], "name": "refundUnreached", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": true, "inputs": [], "name": "endTime", "outputs": [{"name": "", "type": "uint256"}], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": true, "inputs": [], "name": "fundingStatus", " outputs": [{"name": "", "type": "bool"}], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": true, "inputs": [], "name": "manager", "outputs": [{"name": "", "type": "address"}], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": false, "inputs": [], "name": "checkFundingStatus", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": true, "inputs": [{"name": "", "type": "uint256"}], "name": "requests", "outputs": [{"name": "description", "type": "string"}, {"name": "money", "typ e": "uint256"}, {"name": "shopAddress", "type": "address"}, {"name": "complete", "type": "bool"}, {"name": "voteCount", "type": "uint256"}], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": false, "inputs": [{"name": "_desc", "type": "string"}, {"name": "_money ", "type": "uint256"}, {"name": "_shopAddress", "type": "address"}], "name": "createRequest", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": true, "inputs": [], "name": "getPlayers", "outputs": [{"name": "", "type": "address[]"}], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": true, "inputs": [], "name": "projectName", "outputs": [{"name": "", "type": "string"}], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": true, "inputs": [], "name": "goalMoney", "outputs": [{"name": "", "type": "uint256"}], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": true, "inputs": [], "name": "supportMoney", "outputs": [{"name": "", "type": "uint256"}], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": true, "inputs": [], "name": "getPlayersCount", "outputs": [{"name": "", "type": "uint256"}], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": false, "inputs": [{"name": "index", "type": "uint256"}], "name": "approveRequest", "outputs": [], "payable": false, "stateMutabili ty": "nonpayable", "type": "function"}, {"constant": false, "inputs": [], "name": "refundReached", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": true, "inputs": [{"name": "", "type": "uint256"}], "name": "players", "outputs": [{"name": "", "type": "address"}], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": true, "inputs": [], "name": "getRemainTime", "outputs": [{"name": "", "type": "uint256"}], "payable": false, "stateMutability": "view", "type": "function"}, {"inputs": [{"name": "_projectNa me", "type": "string"}, {"name": "_supportMoney", "type": "uint256"}, {"name": "_goalMoney", "type": "uint256"}, {"name": "_p2f", "type": "address"}, {"name": "_address", "type": "address"}], "payable": false, "stateMutability": "nonpayable", "type": "constructor"}]
const funding = new web3.eth.Contract(fundingABI);

const contracts = {
    fundingFactory,
    funding,
    newFunding: () => { return new web3.eth.Contract(fundingABI) }
};

export default contracts;
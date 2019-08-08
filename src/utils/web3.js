import Web3 from 'web3';

let web3;

const getWeb3 = async () => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
        // Modern dapp browsers...
        web3 = new Web3(window.ethereum);
        console.log(web3)
        try {
            // Request account access if needed
            await window.ethereum.enable();
            // Acccounts now exposed
        } catch (error) {
            // User denied account access...
            console.error(error)
        }
        console.log('Injected Modern web3 detected.');
    } else if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
        // Legacy dapp browsers...
        web3 = new Web3(window.web3.currentProvider);
        console.log('Injected Legacy web3 detected.');
    } else {
        // Non-dapp browsers...
        // 如果没有,采用infura的http的web3
        const provider = new Web3.providers.HttpProvider(
            'https://rinkeby.infura.io/v3/12e8d8b53cee48ef91b8ddaeb116ede3'
        );
        web3 = new Web3(provider);
        console.log('No web3 instance injected, using rinkeby web3.');
    }
}

getWeb3();

export default web3;



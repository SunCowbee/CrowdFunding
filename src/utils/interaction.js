/**
 * 写所有和以太坊交互的代码
 */
import web3 from './web3';
import contracts from './contracts';

/**
 * 获取账户
 */
const getAccounts = () => {
    return new Promise((resolve, reject) => {
        web3.eth.getAccounts()
            .then(accounts => {
                const account = accounts[0];
                if (account) {
                    resolve(account);
                } else {
                    reject('no account');
                }
            })
            .catch(e => {
                reject(e);
            });
    })
};

/**
 * 创建合约
 * @param projectName   众筹名称
 * @param supportMoney  参与金额
 * @param goalMoney     目标金额
 * @returns {Promise<any>}
 */
const createFunding = (projectName, supportMoney, goalMoney) => {
    return new Promise(async (resolve, reject) => {
        try {
            const accounts = await web3.eth.getAccounts();
            console.table(accounts);
            console.log(`account:${accounts[0]}`);
            const contract = contracts.fundingFactory;
            const result = contract.methods.createFunding(projectName, supportMoney, goalMoney).send({
                from: accounts[0]
            });
            console.table(result);
            resolve(result);
        } catch (e) {
            console.error(e);
            reject(e);
        }
    })
};


/**
 * 获取众筹项目
 * @param from 0:所有众筹项目,1:查看自己创建的众筹,2: 已参与的众筹项目;
 * @returns {Promise<any>}
 */
const getFundings = (from = 0) => {
    return new Promise(async (resolve, reject) => {
        try {
            const contract = contracts.fundingFactory;
            console.log(`getFundings --> ${from}`);
            const accounts = await web3.eth.getAccounts();
            console.log(`accounts: ${accounts}`);
            const account = accounts[0];

            let fundingAddresses = [];
            if (from === 0) {
                fundingAddresses = await contract.methods.getFundings().call();
            } else if (from === 1) {
                fundingAddresses = await contract.methods.getCreatorFundings().call({from: account});
            } else if (from === 2) {
                fundingAddresses = await contract.methods.getPlayerFoundings().call({from: account});
            } else {
                reject(`非法的from值: ${from}`);
                return;
            }
            console.log(fundingAddresses);
            // 去重复
            fundingAddresses = Array.from(new Set(fundingAddresses));

            const promises = fundingAddresses.map((addr, index) => getFundingDetails(addr));
            // 并行, 把得到的address项目地址的集合, 逐个请求detail详情. 把结果合并成数组
            const fundings = await Promise.all(promises);

            resolve(fundings);
        } catch (e) {
            reject(e);
        }
    });
};

/**
 * 获取众筹项目详情
 * @param address
 * @param index
 * @returns {Promise<any>}
 */
const getFundingDetails = (address, index) => {
    if(!address || address.trim() === ''){
        console.error(`address not null`);
        return;
    }
    return new Promise(async (resolve, reject) => {
        try {
            console.log(`address:${address}-${index}-start`)
            const fundingContract = contracts.newFunding();
            fundingContract.options.address = address;
            // ctrl + d
            // alt + 下
            // 众筹项目名称
            const projectName = await fundingContract.methods.projectName().call();
            // 参与金额
            const supportMoney = await fundingContract.methods.supportMoney().call();
            // 目标金额
            const goalMoney = await fundingContract.methods.goalMoney().call();
            // 已筹金额
            const totalBalance = await fundingContract.methods.getTotalBalance().call();
            // 参与人数
            const playersCount = await fundingContract.methods.getPlayersCount().call();
            // 结束时间
            const endTime = await fundingContract.methods.endTime().call();
            // 发起人address
            const manager = await fundingContract.methods.manager().call();
            console.log(`address:${address}-${index}-end`)
            resolve({
                address,
                projectName,
                supportMoney,
                goalMoney,
                totalBalance,
                playersCount,
                endTime,
                manager
            });
        } catch (e) {
            reject();
        }
    })
};

/**
 * 支付筹款金额
 * @param address
 * @param supportMoney
 * @returns {Promise<any>}
 */
const support = (address, supportMoney) => {
    return new Promise(async (resolve, reject) => {
        try {
            const accounts = await web3.eth.getAccounts();
            console.log(`accounts: ${accounts}`);
            const account = accounts[0];
            const contract = contracts.funding;
            contract.options.address = address;
            const result = await contract.methods.support().send({
                from: account,
                value: supportMoney
            });
            resolve(result);
        } catch (e) {
            reject(e);
        }
    })

};

const Api = {
    getAccounts,
    createFunding,
    getFundings,
    support
}

export {
    getAccounts,
    createFunding,
    getFundings,
    support
}
export default Api;
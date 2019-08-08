pragma solidity ^0.4.24;

// 众筹项目参与人合约
contract PlayerToFundings {

    // mapping(众筹项目参与人账户地址 => address[众筹项目地址])
    mapping(address => address[]) playersFundings;
    // 当前用户加入众筹项目
    function joinFunding(address funding, address sender) public {
        playersFundings[sender].push(funding);
    }
    // 获取当前用户加入的众筹项目
    function getFundings(address sender) public view returns (address[] fundings){
        return playersFundings[sender];
    }

}

// 众筹项目部署合约
contract FundingFactory {

    // 众筹项目地址
    address[] public fundings;

    // 众筹项目参与人合约实例
    PlayerToFundings playerToFundings;

    // mapping(众筹项目发起人账户地址 => address[众筹项目地址])
    mapping(address => address[]) private creatorToFunings;

    // 构造函数
    constructor() public {
        // 获取众筹项目参与人合约地址
        address playerToFundingsAddress = new PlayerToFundings();
        // 获取众筹项目参与人合约对象
        playerToFundings = PlayerToFundings(playerToFundingsAddress);
    }

    // 1. 创建众筹合约函数
    function createFunding(string _projectName, uint _supportMoney, uint _goalMoney) public {
        address funding = new Funding(_projectName, _supportMoney, _goalMoney, playerToFundings, msg.sender);
        fundings.push(funding);
        address[] storage addresses = creatorToFunings[msg.sender];
        addresses.push(funding);
    }

    // 2. 查看所有众筹项目
    function getFundings() public view returns (address[]){
        return fundings;
    }

    // 3. 查看自己创建的众筹项目
    function getCreatorFundings() public view returns (address[]){
        return creatorToFunings[msg.sender];
    }

    // 4. 查看自己参与的众筹项目
    function getPlayerFoundings() public view returns (address[]){
        return playerToFundings.getFundings(msg.sender);
    }
}


contract Funding {

    // 当前众筹项目状态
    // false：众筹发起未成功
    // true：众筹发起成功
    bool public fundingStatus = false;
    // 当前众筹项目发起人
    address public manager;
    // 当前众筹项目名称
    string public projectName;
    // 每笔众筹金额
    uint public supportMoney;
    // 众筹发起结束时间
    uint public endTime;
    // 众筹集资目标金额
    uint public goalMoney;
    // 当前项目众筹参与人地址
    address[] public players;
    // mapping(众筹参与人地址=>参与人支持的supportMoney笔数)
    mapping(address => uint) playersIsJoin;
    // 发起人的付款请求
    Request[] public requests;
    // 众筹项目参与人合约实例
    PlayerToFundings p2f;

    // 付款请求结构
    struct Request {
        // 付款请求描述
        string description;
        // 请求付款的金额
        uint money;
        // 付款的商户地址
        address shopAddress;
        // 付款请求是否完成
        // true：完成
        // false：未完成
        bool complete;
        // mapping( 请求批准人地址=> true：已经批准，false：没有批准)
        mapping(address => bool) votedAddressMap;
        // 付款请求批准人数
        uint voteCount;
    }

    // 初始化众筹项目
    constructor(string _projectName, uint _supportMoney, uint _goalMoney, PlayerToFundings _p2f, address _address) public {
        manager = _address;
        projectName = _projectName;
        supportMoney = _supportMoney;
        goalMoney = _goalMoney;
        p2f = _p2f;
        endTime = now + 4 weeks;
    }

    // 付款申请函数,由众筹发起人调用
    function createRequest(string _desc, uint _money, address _shopAddress) public onlyManagerCanCall {
        // 众筹项目发起成功
        require(fundingStatus);
        // 申请付款金额是否小于众筹合约剩余金额
        require(_money <= address(this).balance);
        Request memory request = Request({
            description : _desc,
            money : _money,
            shopAddress : _shopAddress,
            complete : false,
            voteCount : 0
            });
        requests.push(request);
    }

    // 付款批准函数, 由众筹参与人调用
    function approveRequest(uint index) public {
        // 众筹项目发起成功
        require(fundingStatus);
        // 当前用户是否参与当前众筹项目
        require(playersIsJoin[msg.sender] != 0);
        // 获取需要审批的付款请求
        Request storage request = requests[index];
        // 当前用户是否已对当前付款申请批准
        require(!request.votedAddressMap[msg.sender]);
        // 当前众筹项目批准人数
        request.voteCount += playersIsJoin[msg.sender];
        // 设置当前用户已批准当前付款申请
        request.votedAddressMap[msg.sender] = true;
    }

    // 调用完成付款，众筹发起人调用
    function finalizeRequest(uint index) public onlyManagerCanCall {
        // 众筹项目发起成功
        require(fundingStatus);
        Request storage request = requests[index];
        // 付款请求是否已经完成
        require(!request.complete);
        // 是否超过半数参与人同意付款请求
        require(request.voteCount * 2 > players.length);
        // 转账
        require(address(this).balance >= request.money);
        request.shopAddress.transfer(request.money);
        // 设置付款请求完成
        request.complete = true;
    }

    // 退钱函数, 由众筹发起人调用(用于测试，返回合约中的ether)
    function refundReached() public onlyManagerCanCall {
        if (players.length > 0) {
            uint refundMoney = address(this).balance / players.length;
            uint smallChange = address(this).balance % players.length;
            if (address(this).balance == players.length * refundMoney + smallChange) {
                for (uint i = 0; i < players.length; i++) {
                    if (i == players.length - 1) {
                        players[i].transfer(refundMoney + smallChange);
                    } else {
                        players[i].transfer(refundMoney);
                    }
                }
                players = new address[](0);
            }
        }
    }

    // 退钱函数, 由众筹发起人调用(众筹未成功时调用)
    function refundUnreached() public onlyManagerCanCall {
        // 众筹项目未发起成功
        require(!fundingStatus);
        for (uint i = 0; i < players.length; i++) {
            players[i].transfer(supportMoney);
        }
        players = new address[](0);
    }

    // 用户参与众筹
    function support() public payable {
        require(msg.value == supportMoney);
        players.push(msg.sender);
        // 设置当前用户参与众筹
        playersIsJoin[msg.sender]++;
        // 添加当前合约地址到参与者
        p2f.joinFunding(address(this), msg.sender);
    }

    // 获取当前众筹项目参与人数
    function getPlayersCount() public view returns (uint) {
        return players.length;
    }

    // 获取当前众筹项目所有参与人地址
    function getPlayers() public view returns (address[]){
        return players;
    }

    // 获取当前众筹项目资金余额
    function getTotalBalance() public view returns (uint) {
        return address(this).balance;
    }

    // 获取当前众筹项目发起成功的剩余时间（天）
    function getRemainTime() public view returns (uint){
        return (endTime - now) / 24 / 60 / 60;
    }

    // 当前众筹项目状态
    // false：众筹发起未成功
    // true：众筹发起成功
    function checkFundingStatus() public {
        require(!fundingStatus);
        // 众筹筹款时间：4周
        // 测试时取消
        //require(now > endTime);
        require(address(this).balance >= goalMoney);
        fundingStatus = true;
    }

    // 仅管理员调用
    modifier onlyManagerCanCall(){
        require(msg.sender == manager);
        _;
    }

}
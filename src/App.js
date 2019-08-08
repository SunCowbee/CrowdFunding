import React, {Component} from 'react';
import './App.css';
import {Container} from 'semantic-ui-react';
import TabPanels from './components/TabPanels';
import {getAccounts} from './utils/interaction';

class App extends Component {

    state = {
        // 当前账户
        account: null
    }

    componentDidMount() {
        // 获取当前账户
        getAccounts()
            .then(account => this.setState({account: account}))
            .catch(e => console.error(e));
    }

    render() {
        const {account} = this.state;
        return (
            <Container className="App">
                <header className="App-header">
                    <h1 className="App-title">CrowdFunding</h1>
                    <img src="https://api.gushi.ci/all.svg" alt="poem"/>
                    <br/>
                    <h3>Account Address:</h3>
                    {
                        account && (<p>{account}</p>)
                    }
                </header>
                <br/>
                <TabPanels/>
            </Container>
        );
    }
}

export default App;

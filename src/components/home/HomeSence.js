import React, {Component} from 'react';
import {getFundings, support} from "../../utils/interaction";
import {Form, Segment, Label} from 'semantic-ui-react';
import FundingList from "../common/FundingList";

class HomeSence extends Component {

    state = {
        // 所有众筹项目
        fundings: null,
        // 当前选中的众筹项目
        currentSelect: null
    }

    componentDidMount() {
        this.mounted = true;
        getFundings()
            .then(fundings => {
                console.table(fundings);
                // 如果没有挂载(已卸载), 不执行下边的setState逻辑
                if (!this.mounted) return;
                this.setState({fundings})
            }).catch(e => {
            console.error(e);
            alert('Home - getFundings network error, please try again later!')
        })
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    handleSupport = () => {

        const {currentSelect} = this.state;
        support(currentSelect.address, currentSelect.supportMoney)
            .then(result => {
                console.log(result);
                alert(`Funding ${currentSelect.projectName} Support Successfully!`)
                this.setState({currentSelect: null})
            }).catch(e => {
            console.error(e);
            this.setState({currentSelect: null})
        })
    };

    render() {
        const {currentSelect, fundings} = this.state;
        return (
            <div>
                <FundingList fundings={fundings} onItemClick={(funding) => {
                    console.table(funding);
                    // 参与项目
                    this.setState({
                        currentSelect: funding
                    })
                }}/>
                <br/>
                {
                    currentSelect && (
                        <div>
                            <h3>Support Funding</h3>
                            <Segment>
                                <Form onSubmit={this.handleSupport}>
                                    <Form.Input type="text" required label='Funding Address'
                                                placeholder='0x12345678'
                                                value={currentSelect.address}/>
                                    <Form.Input type='text' required label='Support Money'
                                                labelPosition='left' placeholder='Support Money'
                                                value={currentSelect.supportMoney}>
                                        <Label basic>wei</Label>
                                        <input/>
                                    </Form.Input>
                                    <Form.Button primary content='Support Now'/>
                                </Form>
                            </Segment>
                        </div>
                    )
                }
            </div>
        );
    }
}

export default HomeSence;
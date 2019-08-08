import React, {Component} from 'react';
import {createFunding, getFundings} from '../../utils/interaction';
import FundingList from "../common/FundingList";
import {
    Input,
    Label,
    Button,
    Segment,
    Form,
    Dimmer,
    Loader,
    List,
    TransitionablePortal,
    Header
} from 'semantic-ui-react';

class CreatorSence extends Component {

    state = {
        // 当前用户创建的众筹项目
        fundings: null,
        projectName: '',
        supportMoney: '',
        goalMoney: '',
        active: false
    }

    componentDidMount() {
        getFundings(1)
            .then(fundings => {
                console.table(fundings);
                this.setState({fundings})
            }).catch(e => {
            console.error(e);
            alert('Home - getFundings network error!')
        })
    }

    handleCreate = (e) => {
        e.preventDefault();
        const {projectName, supportMoney, goalMoney} = this.state;
        this.setState({active: true});
        createFunding(projectName, supportMoney, goalMoney)
            .then(result => {
                this.setState({
                    active: false,
                    supportMoney: '',
                    goalMoney: '',
                });
                console.log(result);
                alert(`Funding ${projectName} Create Successfully!`)
            }).catch(e => {
            this.setState({
                active: false,
                supportMoney: '',
                goalMoney: '',
            });
            console.error(e);
        })
    };

    handleChange = (e, {name, value}) => this.setState({[name]: value});

    render() {
        const {fundings, projectName, supportMoney, goalMoney, active} = this.state;
        return (
            <div>
                <FundingList fundings={fundings}/>

                <br/>

                <h3>Launch CrowdFunding</h3>

                <Dimmer.Dimmable as={Segment} dimmed={active}>
                    <Dimmer active={active} inverted>
                        <Loader>Creating Funding...</Loader>
                    </Dimmer>

                    <Form onSubmit={this.handleCreate}>
                        <Form.Input type='text' name='projectName' required value={projectName}
                                    label='Project Name' placeholder='Project Name'
                                    onChange={this.handleChange}/>
                        <Form.Input type='text' name='supportMoney' required value={supportMoney}
                                    label='Support Money' labelPosition='left'
                                    placeholder='Support Money'
                                    onChange={this.handleChange}>
                            <Label basic>wei</Label>
                            <input/>
                        </Form.Input>

                        <Form.Input type='text' name='goalMoney' required value={goalMoney}
                                    label='Goal Money' labelPosition='left' placeholder='Goal Money'
                                    onChange={this.handleChange}>
                            <Label basic>wei</Label>
                            <input/>
                        </Form.Input>

                        <Form.Button primary content='Create Now'/>
                    </Form>

                </Dimmer.Dimmable>
            </div>
        );
    }
}

export default CreatorSence;
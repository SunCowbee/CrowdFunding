import React, {Component} from 'react';
import FundingList from "../common/FundingList";
import {getFundings} from "../../utils/interaction";

class PlayerSence extends Component {

    state = {
        // 当前用户参与的众筹项目
        fundings: null
    }

    componentDidMount() {
        getFundings(2)
            .then(fundings => {
                console.table(fundings);
                this.setState({fundings})
            }).catch(e => {
            console.error(e);
            alert('Home - getFundings network error,please try again later!')
        })
    }


    render() {
        return (
            <div>
                <FundingList fundings={this.state.fundings}/>
            </div>
        );
    }
}

export default PlayerSence;
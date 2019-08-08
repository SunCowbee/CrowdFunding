import React from 'react';
import {Card, Image, List, Progress} from 'semantic-ui-react';

const colorArr = ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey',];

class FundingList extends React.Component {
    render() {
        const {fundings, onItemClick} = this.props;
        const fundingCards = fundings && (
            fundings.map((funding, index) => {
                const {address, projectName, supportMoney, goalMoney, totalBalance, playersCount, endTime, manager} = funding;
                const leftTime = Math.floor((parseInt(endTime, 10) - new Date().getTime() / 1000) / 60 / 60 / 24);
                const percent = Math.floor((parseInt(totalBalance, 10) / parseInt(goalMoney, 10)) * 100);
                return (
                    <Card key={address} color={colorArr[index % colorArr.length]}
                          onClick={() => onItemClick && onItemClick(funding)}>
                        <Image src='/images/elliot.jpg'/>
                        <Card.Content>
                            <Card.Header>{projectName}</Card.Header>
                            <Card.Meta>
                                <span
                                    className='date'>Left Time: {leftTime} Days</span>
                                <Progress percent={percent} indicating progress
                                          size='small'/>
                            </Card.Meta>
                            <Card.Description>
                                Thanks For Your Support: {projectName}
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <List divided horizontal size='small' style={{
                                display: 'flex',
                                justifyContent: 'space-around'
                            }}>
                                <List.Item>
                                    <List.Content>
                                        <List.Header>Arrived:</List.Header>
                                        <List.Description>{percent}%</List.Description>
                                    </List.Content>
                                </List.Item>
                                <List.Item>
                                    <List.Content>
                                        <List.Header>Funded:</List.Header>
                                        <List.Description>{totalBalance} wei</List.Description>
                                    </List.Content>
                                </List.Item>
                                <List.Item>
                                    <List.Content>
                                        <List.Header>Involed:</List.Header>
                                        <List.Description>{playersCount} people</List.Description>
                                    </List.Content>
                                </List.Item>
                            </List>
                        </Card.Content>
                    </Card>
                )
            })
        );

        return (
            <Card.Group itemsPerRow={4}>
                {fundingCards}
            </Card.Group>
        );
    }
}

export default FundingList;

import React from 'react'
import {Tab} from 'semantic-ui-react'
import HomeSence from "./home/HomeSence";
import CreatorSence from "./creator/CreatorSence";
import PlayerSence from "./player/PlayerSence";

const panes = [
    {menuItem: 'Home', render: () => <Tab.Pane><HomeSence/></Tab.Pane>},
    {menuItem: 'Launched', render: () => <Tab.Pane><CreatorSence/></Tab.Pane>},
    {menuItem: 'Involved', render: () => <Tab.Pane><PlayerSence/></Tab.Pane>},
]

const TabPanels = () => <Tab panes={panes}/>

export default TabPanels;

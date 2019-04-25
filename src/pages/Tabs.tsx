import React, { PureComponent } from 'react';
import { Tabs, Tab } from 'react-draggable-tab';
import { Icon } from 'antd';

import ArticleForm from '@/components/Article/ArticleForm';

const tabsClassNames = {
  tabWrapper: 'myWrapper',
  tabBar: 'myTabBar',
  tabBarAfter: 'myTabBarAfter',
  tab:      'myTab',
  tabTitle: 'myTabTitle',
  tabCloseIcon: 'tabCloseIcon',
  tabBefore: 'myTabBefore',
  tabAfter: 'myTabAfter'
};

const tabsStyles = {
  tabWrapper: {marginTop: '10px' },
  tabBar: {},
  tab:{},
  tabTitle: {},
  tabCloseIcon: {},
  tabBefore: {},
  tabAfter: {}
};

export default class TabsPage extends PureComponent {
  constructor(props) {
    super(props);
    let icon = (<Icon type="copy" />);
    let fonticon = (<Icon type="plus-circle" />);

    this.state = {
      tabs:[
        (<Tab key={'tab0'} title={'unclosable tab'} unclosable={true} >
          <div>
            <h1>This tab cannot close</h1>
          </div>
        </Tab>),
        (<Tab key={'tab1'} title={'1stTab'} beforeTitle={icon} >
          <div>
            <h1>This is tab1</h1>
          </div>
        </Tab>),
        (<Tab key={'tab2'} title={'2ndTab Too long Toooooooooooooooooo long'} beforeTitle={fonticon} >
          <div>
            <pre>Lorem ipsum dolor sit amet, consectetur adipisicing elit,
            </pre>
          </div>
        </Tab>)
      ],
      badgeCount: 0
    };
  }

  handleTabSelect(e, key, currentTabs) {
    console.log('handleTabSelect key:', key);
    this.setState({selectedTab: key, tabs: currentTabs});
  }

  handleTabClose(e, key, currentTabs) {
    console.log('tabClosed key:', key);
    this.setState({tabs: currentTabs});
  }

  handleTabPositionChange(e, key, currentTabs) {
    console.log('tabPositionChanged key:', key);
    this.setState({tabs: currentTabs});
  }

  handleTabAddButtonClick(e, currentTabs) {
    // key must be unique
    const key = 'newTab_' + Date.now();
    let newTab = (<Tab key={key} title='untitled'>
                    <div>
                      <ArticleForm />
                    </div>
                  </Tab>);
    let newTabs = currentTabs.concat([newTab]);

    this.setState({
      tabs: newTabs,
      selectedTab: key
    });
  }

  render() {
    return (
      <Tabs
        tabsClassNames={tabsClassNames}
        tabsStyles={tabsStyles}
        selectedTab={this.state.selectedTab ? this.state.selectedTab : "tab2"}
        onTabSelect={this.handleTabSelect.bind(this)}
        onTabClose={this.handleTabClose.bind(this)}
        onTabAddButtonClick={this.handleTabAddButtonClick.bind(this)}
        onTabPositionChange={this.handleTabPositionChange.bind(this)}
        tabs={this.state.tabs}
        // tabs={this.state.tabs}
        shortCutKeys={
          {
            'close': ['alt+command+w', 'alt+ctrl+w'],
            'create': ['alt+command+t', 'alt+ctrl+t'],
            'moveRight': ['alt+command+tab', 'alt+ctrl+tab'],
            'moveLeft': ['shift+alt+command+tab', 'shift+alt+ctrl+tab']
          }
        }
      />
    )
  }
}

import React, { PureComponent } from 'react';
import { Tabs } from 'antd';

import styles from './Setting.less';

import AccountSecurity from '@/components/Account/AccountSecurity';

const TabPane = Tabs.TabPane;

export default class Setting extends PureComponent {
  handleTabChange = (key) => {
    console.log('==handleTabChange==', key);
  }
  render() {
    return (
      <div className={styles.setting}>
        <Tabs onChange={this.handleTabChange} type="card">
          <TabPane tab="基本信息" key="1">Content of Tab Pane 1</TabPane>
          <TabPane tab="账号安全" key="2">
            <AccountSecurity />
          </TabPane>
          <TabPane tab="点卡管理" key="3">Content of Tab Pane 3</TabPane>
        </Tabs>
      </div>
    )
  }
}

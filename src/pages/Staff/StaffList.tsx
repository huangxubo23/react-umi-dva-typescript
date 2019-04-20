import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table } from 'antd';

import StaffSearchFilter from '@/components/Staff/StaffSearchFilter';

import styles from './StaffList.less';

@connect(({ staff }) => ({
  staff,
}))
export default class StaffList extends PureComponent {
  columns = [
    {
      title: '用户名',
      dataIndex: 'userName',
      key: 'userName',
      width: 100,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 100,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 100,
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 200,
      render: (text, record) => (
        <div title={text} style={{ width: 200 }} className="text-overflow-ellipsis">
          {text}
        </div>
      ),
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: '操作',
      key: 'operation',
      width: 150,
      render: (text, record) => (
        <div>
          <span className="common-operation-item">查看</span>
          <span className="common-operation-item">修改</span>
          <span className="common-operation-item">删除</span>
        </div>
      )
    }
  ]

  handleSearch = (value) => {
    console.info('==handleSearch==', value);
  }

  render() {
    const { staff } = this.props;
    return (
      <div className={styles.staffList}>
        <div>员工管理</div>
        <StaffSearchFilter onSearch={this.handleSearch}/>
        <div>
          <Table dataSource={staff.data} columns={this.columns} />
        </div>
      </div>
    )
  }
}

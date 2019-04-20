import React, { PureComponent } from 'react';
import { Form, Input, Icon, Select, Button } from 'antd';

import { FormComponentProps } from 'antd/lib/form';

import styles from './StaffSearchFilter.less';

interface IStaffSearchFormProps extends FormComponentProps {
  onSearch: Function;
}

class StaffSearchForm extends PureComponent<IStaffSearchFormProps> {
  handleSearch = (evt: React.FormEvent) => {
    evt.preventDefault();
    const { form: { getFieldsValue }, onSearch } = this.props;
    const value = getFieldsValue();
    onSearch(value);
  }

  handleReset = (evt: React.FormEvent) => {
    evt.preventDefault();
    this.props.form.resetFields();
  }
  render() {
    const { form: { getFieldDecorator } } = this.props;
    return (
      <Form className={styles.staffSearchFilter} layout="inline" onSubmit={this.handleSearch} onReset={this.handleReset}>
        <Form.Item
          label="用户名"
        >
          {
            getFieldDecorator('userName', {
              initialValue: '',
            })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="查询用户名" />
            )
          }
        </Form.Item>
        <Form.Item
          label="手机号"
        >
          {
            getFieldDecorator('phone', {
              initialValue: '',
            })(
              <Input prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="查询手机号" />
            )
          }
        </Form.Item>
        <Form.Item
          label="ID"
        >
          {
            getFieldDecorator('id', {
              initialValue: '',
            })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户ID" />
            )
          }
        </Form.Item>
        <Form.Item
          label="角色"
        >
          {
            getFieldDecorator('role', {
              initialValue: ''
            })(
              <Select style={{ width: 100 }}>
                <Select.Option value="">全部</Select.Option>
                <Select.Option value="admin">管理员</Select.Option>
                <Select.Option value="staff">员工</Select.Option>
                <Select.Option value="crew">组员</Select.Option>
              </Select>
            )
          }
        </Form.Item>
        <Form.Item>
          <Button type="primary" icon="search" htmlType="submit">查询</Button>
        </Form.Item>
        <Form.Item>
          <Button icon="redo" htmlType="reset">重置</Button>
        </Form.Item>
      </Form>
    )
  }
}

const StaffSearchFilter = Form.create({ name: 'horizontal_login' })(StaffSearchForm);
export default StaffSearchFilter;

import React, { PureComponent } from 'react';
import { Steps, Carousel, Button, Form, Input, Radio, Checkbox, Row, Col, Select, Icon } from 'antd';
import styles from './Register.less';

import { FormComponentProps } from 'antd/lib/form';
interface IRegisterFormProps extends FormComponentProps {

}

class RegisterForm extends PureComponent<IRegisterFormProps> {
  carouselRef;
  registerFormRef;
  formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
    },
  };
  state = {
    current: 0,
    confirmDirty: false,
    agree: false,
    showAgreeTip: false,
  }

  goTo = (current: number) => {
    this.setState({
      current,
    }, () => {
      this.carouselRef.goTo(current);
    });
  }

  handleAgreeChange = (e) => {
    this.setState({
      agree: e.target.checked,
      showAgreeTip: false,
    });
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirmPassword'], { force: true });
    }
    callback();
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('密码校验不一致');
    } else {
      callback();
    }
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      debugger;
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  handleRegister = () => {
    const { form: { validateFields, getFieldValue } } = this.props;
    const type = getFieldValue('type');
    const fieldNames = ['type', 'userName', 'password', 'confirmPassword', ...type === 'organization' ? ['organizationName'] : []];
    validateFields(fieldNames, (errors, values) => {
      if (!errors && this.state.agree) {
        return this.goTo(1);
      } else if (!this.state.agree) {
        this.setState({
          showAgreeTip: true,
        });
      }
    });
  }

  render() {
    const { form: { getFieldDecorator, getFieldValue } } = this.props;
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select style={{ width: 80 }}>
        <Select.Option value="86">+86</Select.Option>
      </Select>
    );

    return (
      <div className={styles.register}>
        <h1 className={styles.title}>注册账号</h1>
        <div className={styles.content}>
          <Form name="registerGlobalForm" {...this.formItemLayout} onSubmit={this.handleSubmit}>
            <Steps current={this.state.current} labelPlacement="vertical">
              <Steps.Step title="填写信息" onClick={() => this.goTo(0)}/>
              <Steps.Step title="验证" onClick={() => this.goTo(1)} />
              <Steps.Step title="完成" />
            </Steps>
            <Carousel dots={false} ref={r => this.carouselRef = r } className={styles.carousel}>
              <div className={styles.carouselCard}>
                <Form.Item
                  label="注册类型"
                >
                  {
                    getFieldDecorator('type', {
                      initialValue: 'personal',
                      validateTrigger: ['onChange'],
                      rules: [{
                        required: true, message: '请选择注册类型',
                      }],
                    })(
                      <Radio.Group>
                        <Radio value="personal">个人</Radio>
                        <Radio value="organization">商家</Radio>
                      </Radio.Group>
                    )
                  }
                </Form.Item>
                <Form.Item
                  label="用户名"
                >
                  {getFieldDecorator('userName', {
                    rules: [{
                      required: true, message: '请输入用户名',
                    }],
                  })(
                    <Input placeholder="请输入用户名" />
                  )}
                </Form.Item>
                <Form.Item
                  label="输入密码"
                >
                  {getFieldDecorator('password', {
                    validateTrigger: ['onBlur'],
                    rules: [{
                      required: true, message: '请输入您的密码',
                    }, {
                      validator: this.validateToNextPassword,
                    }],
                  })(
                    <Input type="password" placeholder="请输入您的密码" />
                  )}
                </Form.Item>
                <Form.Item
                  label="重复密码"
                >
                  {getFieldDecorator('confirmPassword', {
                    validateTrigger: ['onBlur'],
                    rules: [{
                      required: true, message: '请重复您的密码',
                    }, {

                      validator: this.compareToFirstPassword,
                    }],
                  })(
                    <Input type="password" onBlur={this.handleConfirmBlur} placeholder="请重复您的密码" />
                  )}
                </Form.Item>
                {
                  getFieldValue('type') === 'organization' && [
                    <Form.Item
                      key="organizationName"
                      label="组织名称"
                    >
                      {getFieldDecorator('organizationName', {
                        rules: [{
                          required: true, message: '请输入所创建的组织名称',
                        }],
                      })(
                        <Input placeholder="请输入所创建的组织名称" />
                      )}
                    </Form.Item>,
                    <Form.Item
                      key="invitationCode"
                      label="邀请码"
                    >
                      {getFieldDecorator('invitationCode')(
                        <Input placeholder="填写达人邀请码，获取好礼" />
                      )}
                    </Form.Item>
                  ]
                }
                <Form.Item
                  wrapperCol={{ span: 12, offset: 6 }}
                  className={this.state.showAgreeTip ? 'checkboxInvalid' : ''}
                >
                  <Checkbox value={this.state.agree} onChange={this.handleAgreeChange}>已阅读并同意《服务协议》</Checkbox>
                </Form.Item>
                <Form.Item
                  wrapperCol={{ span: 12, offset: 6 }}
                >
                  <Button size="large" type="primary" onClick={this.handleRegister}>立即注册</Button>
                </Form.Item>
              </div>
              <div className={styles.carouselCard}>
                <Form.Item
                  label="图形验证码"
                >
                    <Row gutter={8}>
                      <Col span={16}>
                        {getFieldDecorator('code', {
                          rules: [{ required: true, message: '请输入图形验证码' }],
                        })(
                          <Input placeholder="请输入图形验证码" />
                        )}
                      </Col>
                      <Col span={8}>
                        <Button disabled={true} className={styles.rightBtn}>Xcy8</Button>
                      </Col>
                    </Row>
                </Form.Item>
                <Form.Item
                  label="手机号"
                >
                  {getFieldDecorator('phone', {
                    rules: [{ required: true, message: '请输入手机号' }],
                  })(
                    <Input addonBefore={prefixSelector} placeholder="11位手机号" />
                  )}
                </Form.Item>
                <Form.Item
                  label="验证码"
                >
                  <Row gutter={8}>
                    <Col span={16}>
                      {getFieldDecorator('captcha', {
                        rules: [{ required: true, message: '请输入验证码' }],
                      })(
                        <Input placeholder="请输入验证码" />
                      )}
                    </Col>
                    <Col span={8}>
                      <Button className={styles.rightBtn}>获取验证码</Button>
                    </Col>
                  </Row>
                </Form.Item>
                <Form.Item
                  wrapperCol={{ span: 12, offset: 6 }}
                >
                  <Button size="large" type="primary" onClick={() => this.goTo(2)}>完成</Button>
                </Form.Item>
              </div>
              <div className={styles.carouselCard}>
                <div className={styles.success}>
                  <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" className={styles.successIcon} />
                  <div className={styles.successTitle}>恭喜您成功注册哇掌柜！</div>
                  <Button type="primary" size="large">完成</Button>
                </div>
              </div>
            </Carousel>
          </Form>
        </div>
      </div>
    );
  }
}

const Register = Form.create({ name: 'register'})(RegisterForm);
export default Register;

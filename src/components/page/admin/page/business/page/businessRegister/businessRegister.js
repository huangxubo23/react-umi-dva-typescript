/**
 * Created by linhui.商家注册
 */


import AJAX from '../../../../../../lib/newUtil/AJAX';
import {Alert, Button, Card, Form, Input, Notification, Select, Layout, Radio} from "element-react";
import React from "react";
import ReactChild from "../../../../../../lib/util/ReactChild";

class BusinessRegister extends ReactChild {
    constructor(props) {
        super(props);
        this.state = {
            name: "",//店铺名
            wName: '',//旺旺名
            iocq: "",//qq
            telephone: "",//电话
            mailbox: "",//邮箱
            type: 1,//1达人 2商家 3机构
            verification: '',//手机验证码
            inviteCode: '',//邀请码
        }
    }

    stateChange = ({value, title}) => {//状态事件
        let state = this.state;
        state[title] = value;
        this.setState({state});
    };

    submit = () => {//提交
        let {name, wName, iocq, mailbox, telephone, type, verification} = this.state;
        let str = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/i;//邮箱正则表达式
        if (!name) {
            Notification.error({
                title: '错误',
                message: '组织名称不能为空'
            });

            return false;
        }/* else if (!wName) {
            Notification.error({
                title: '错误',
                message: '旺旺名不能为空'
            });
            return false;

        }*/ else if (!iocq) {
            Notification.error({
                title: '错误',
                message: '联系QQ不能为空'
            });
            return false;
        } else if (!telephone) {
            Notification.error({
                title: '错误',
                message: '联系电话不能为空'
            });
            return false;
        } else if (!mailbox) {
            Notification.error({
                title: '错误',
                message: '联系邮箱不能为空'
            });
            return false;
        } else if (!str.test(mailbox)) {
            Notification.error({
                title: '错误',
                message: '邮箱格式不正确'
            });
            return false;
        } else if (!verification) {
            Notification.error({
                title: '错误',
                message: '请输入验证码'
            });
            return false;
        }
        this.businessRegister.ajax({
            type: 'post',
            url: '/user/admin/visible/userRegister.io',
            data: {
                'name': name,
                'iocq': iocq,
                'telephone': telephone,
                'mailbox': mailbox,
                'type': type,
                code: verification
            },//'wName': wName,
            callback: () => {
                Notification({
                    title: '提示',
                    message: '注册成功',
                    type: 'success'
                });
                if (this.props.callback) {
                    this.props.callback();
                }
                //window.location.href = '/vminssion/vminssion_index.html';
            }
        });

    };
    getVerification = () => {//获取验证码
        let telephone = this.state.telephone;
        if (!/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(telephone)) {
            Notification({
                title: '',
                message: '手机号码错误请重新输入',
                type: 'error'
            });
        } else {
            this.businessRegister.ajax({
                type: 'post',
                url: '/user/sms/sendVerificationCode.io',
                data: {phoneNumber: telephone},
                callback: (json) => {
                    Notification({
                        title: '',
                        message: '验证码已发送到您手机',
                        type: 'success'
                    });
                    this.setState({openVerification: true, verificationDate: 60}, () => {
                        let interval = setInterval(() => {
                            let verificationDate = this.state.verificationDate - 1;
                            this.setState({verificationDate: verificationDate});
                            if (verificationDate <= 0) {
                                clearInterval(interval);
                            }
                        }, 1000)
                    });
                }
            });
        }
    };


    render() {
        let {name, wName, iocq, mailbox, telephone, type, verificationDate, openVerification, verification, telephoneIsVerification, inviteCode} = this.state;
        return (


            <AJAX ref={e => this.businessRegister = e}>
                <Card className='box-Card'>
                    <div style={{textAlign: "left"}}>
                        <Alert title="用戶注册" type="info" closable={false} style={{marginBottom: '20px'}}/>
                        <div style={{width: "500px", margin: "0"}}>
                            <div style={{marginLeft: '50px', marginRight: '50px'}}>
                                <Form model={this.state} labelWidth='80'>
                                    <Form.Item label='用户类型'>
                                        <Radio.Group value={type} onChange={(value) => {
                                            this.stateChange({value: value, title: 'type'})
                                        }}>
                                            <Radio value={1}>达人</Radio>
                                            <Radio value={2}>商家</Radio>
                                            <Radio value={3}>机构</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item label='组织名'>
                                        <Input placeholder='请输入组织名称...' value={name} size='small' onChange={(value) => {
                                            this.stateChange({value: value, title: 'name'})
                                        }}/>
                                    </Form.Item>
                                    {/* <Form.Item label='旺旺名'>
                                <Input placeholder='请输入旺旺名...' value={wName} size='small' onChange={(value) => {
                                    this.stateChange({value: value, title: 'wName'})
                                }}/>
                            </Form.Item>*/}
                                    <Form.Item label='联系QQ'>
                                        <Input placeholder='请输入联系QQ...' value={iocq} size='small' onChange={(value) => {
                                            this.stateChange({value: value, title: 'iocq'})
                                        }}/>
                                    </Form.Item>

                                    <Form.Item label='联系邮箱'>
                                        <Input placeholder='请输入联系邮箱...' value={mailbox} size='small'
                                               onChange={(value) => {
                                                   this.stateChange({value: value, title: 'mailbox'})
                                               }}/>
                                    </Form.Item>
                                    <Form.Item label='邀请码'>
                                        <Input placeholder="邀请码可自行定义,用于邀请别的达人,非必填项" value={inviteCode}
                                               onChange={(value) => {
                                                   this.stateChange({value: value, title: 'inviteCode'})
                                               }}/>
                                    </Form.Item>
                                    <Form.Item label='联系电话'>
                                        <Input placeholder='请输入联系电话...' value={telephone} size='small'
                                               disabled={telephoneIsVerification} onChange={(value) => {
                                            this.stateChange({value: value, title: 'telephone'})
                                        }} append={
                                            telephoneIsVerification ? <Button type="primary" onClick={() => {
                                                    this.setState({telephoneIsVerification: false})
                                                }}>修改号码</Button> :
                                                <Button type="primary" onClick={this.getVerification}
                                                        disabled={verificationDate > 0}>{verificationDate > 0 ? verificationDate + 's' : '获取验证码'}</Button>}/>
                                    </Form.Item>

                                    {openVerification && <Form.Item label='验证码'>
                                        <Input placeholder='请输入验证码' value={verification} size='small'
                                               onChange={(value) => {
                                                   this.stateChange({value: value, title: 'verification'})
                                               }}/>
                                    </Form.Item>}

                                    <Form.Item>
                                        <div style={{textAlign: 'left'}}>
                                            <Button type="primary" onClick={this.submit}>注册提交</Button>
                                        </div>
                                    </Form.Item>
                                </Form>
                            </div>
                        </div>
                    </div>
                </Card>
            </AJAX>
        )
    }
}

export default BusinessRegister;
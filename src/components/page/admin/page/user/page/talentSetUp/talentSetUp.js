/**
 * Created by 薛荣晖 on 2018/9/13 0013下午 2:56.
 */

import ReactChild from "../../../../../../lib/util/ReactChild";
import {Alert, Button, Card, Form, Input, Notification} from "element-react";
import AJAX from "../../../../../../lib/newUtil/AJAX";
import React from "react";

class TalentSetUp extends ReactChild {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            iocq: "",
            telephone: "",
            oldTelephone: '',//原手机号码
            mailbox: "",
            telephoneIsVerification: '',//手机号码是否已验证
            code: '',//验证码
            privateDisable: {
                id: 0,
                disableTerms: "",
            },

        }
    }

    componentDidMount() {
        this.obtain();
    }

    obtain = () => {//拿取达人数据
        if (this.talentSetUpAjax) {
            this.talentSetUpAjax.ajax({
                url: "/user/admin/superManage/getTalentSetUp.io",
                data: {},
                callback: (data) => {
                    let privateDisable = this.state.privateDisable;
                    privateDisable.id = data.disableId ? data.disableId : 0;
                    privateDisable.disableTerms = data.disableTerms ? data.disableTerms : "";
                    this.setState(data);
                }
            });
        }
    };

    talentChange = (env) => {
        let {value, name} = env;
        let state = this.state;
        state[name] = value;
        this.setState(state);
    };

    disableTermsChange = (env) => {//违禁词事件
        let value = env.value;
        let v = value.replace("，", ",");
        let privateDisable = this.state.privateDisable;
        privateDisable.disableTerms = v;
        this.setState({privateDisable: privateDisable});
    };

    submit = () => {//提交
        console.log('state',this.state);
        let {name, iocq, telephone, mailbox, code,openVerification} = this.state;
        let privateDisable = this.state.privateDisable.disableTerms ?
            this.state.privateDisable.disableTerms : "";
        let arr = privateDisable.split(",");

        let str = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/i;
        if (!name) {
            Notification.error({
                title: '错误',
                message: '达人名称不能为空'
            });
            return false;
        } else if (!iocq) {
            Notification.error({
                title: '错误',
                message: '联系QQ不能为空'
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
        } else if (!telephone || !/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(telephone)) {
            Notification({
                title: '',
                message: '手机号码错误请重新输入',
                type: 'error'
            });
            return false;
        } else if (openVerification&&!code) {
            Notification.error({
                title: '错误',
                message: '请输入验证码'
            });
            return false;
        }

        let data = {name: name, iocq: iocq, telephone: telephone, mailbox: mailbox, code: code};
        if (privateDisable) {
            data.privateDisable = JSON.stringify(this.state.privateDisable)
        }

        this.talentSetUpAjax.ajax({
            url: "/user/admin/superManage/upTalentSetUp.io",
            data: data,
            type: "post",
            callback: () => {
                Notification({
                    title: '提示',
                    message: '提交成功',
                    type: 'success'
                });
                this.setState({openVerification:false},()=>{
                    this.obtain();
                });
            }
        });
    };
    getCode = () => {//获取验证码
        let {telephone, oldTelephone} = this.state;
        if (!/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(telephone)) {
            Notification({
                title: '',
                message: '手机号码错误请重新输入',
                type: 'error'
            });
        } else if (oldTelephone == telephone) {//如果新输入的手机号码和旧的一致
            Notification({
                title: '',
                message: '手机号码不可和上次号码一致',
                type: 'error'
            });
        } else {
            this.talentSetUpAjax.ajax({
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
        let {name, iocq, telephone, mailbox, privateDisable, telephoneIsVerification, code, verificationDate, openVerification} = this.state;
        return (
            <AJAX ref={e => this.talentSetUpAjax = e}>
                <Card className="box-card">
                    <div style={{textAlign: "left"}}>
                        <div style={{width: "500px", margin: "0"}}>
                            <div style={{marginLeft: '50px', marginRight: '50px'}}>
                                <Form model={this.state} labelWidth="80">
                                    <Form.Item label='达人名称'>
                                        <Input value={name} placeholder="请输入达人名字..."
                                               onChange={(value) => {
                                                   this.talentChange({value: value, name: 'name'})
                                               }}/>
                                    </Form.Item>
                                    <Form.Item label='联系QQ'>
                                        <Input value={iocq} placeholder="请输入联系QQ..."
                                               onChange={(value) => {
                                                   this.talentChange({value: value, name: 'iocq'})
                                               }}/>
                                    </Form.Item>

                                    <Form.Item label='联系邮箱'>
                                        <Input value={mailbox} placeholder="请输入联系邮箱..."
                                               onChange={(value) => {
                                                   this.talentChange({value: value, name: 'mailbox'})
                                               }}/>
                                    </Form.Item>
                                    <Form.Item label='联系电话'>
                                        <Input value={telephone} placeholder="请输入联系电话..."
                                               disabled={telephoneIsVerification}
                                               onChange={(value) => {
                                                   this.talentChange({value: value, name: 'telephone'})
                                               }}
                                               append={
                                                   telephoneIsVerification ? <Button type="info" onClick={() => {
                                                           this.setState({telephoneIsVerification: false})
                                                       }}>修改号码</Button> :
                                                       <Button type='info' onClick={this.getCode} disabled={verificationDate > 0}>{verificationDate > 0 ? verificationDate + 's' : '获取验证码'}</Button>
                                               }/>
                                    </Form.Item>
                                    {openVerification && <Form.Item label='验证码'>
                                        <Input placeholder='请输入验证码' value={code} size='small' onChange={(value) => {
                                            this.talentChange({value: value, name: 'code'})
                                        }}/>
                                    </Form.Item>}
                                    <Form.Item label='违禁词'>
                                        <Input type="textarea" value={privateDisable.disableTerms ||
                                        ''} placeholder="请输入违禁词以逗号隔开..." onChange={(value) => {
                                            this.disableTermsChange({value: value})
                                        }} rows="5"/>
                                        <Alert title="请输入违禁词以逗号隔开..." type="info"/>
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" onClick={this.submit}>提交修改
                                        </Button>
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

export default TalentSetUp;
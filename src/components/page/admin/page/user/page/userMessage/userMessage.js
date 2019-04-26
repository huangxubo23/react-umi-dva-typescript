/**
 * Created by 薛荣晖 on 2018/9/7 0007下午 3:50. 用户中心
 */

require('../../../../../../../styles/user/content.css');
import React from 'react';
import ReactChild from "../../../../../../lib/util/ReactChild";
import {Card, Notification, Form, Input, DatePicker, Button} from "element-react";
import AJAX from '../../../../../../lib/newUtil/AJAX';
import '../../../../../../lib/util/bootstrap-datetimepicker.min';
import '../../../../../../lib/util/bootstrap-datetimepicker.zh-CN';
import '../../../../../../../styles/content/bootstrap-datetimepicker.min.css';
import {BundleLoading} from '../../../../../../../bundle';
import upImages from 'bundle-loader?lazy&name=pc/trends_asset/lib/sharing/upload/UpImages!../../../../../../lib/sharing/upload/UpImages';
import cropper from 'bundle-loader?lazy&name=pc/trends_asset/lib/sharing/upload/Cropper!../../../../../../lib/sharing/upload/Cropper';
import BindDingTalk from 'bundle-loader?lazy&name=pc/trends_asset/lib/sharing/bindParties/BindDingTalk!../../../../../../lib/sharing/bindParties/BindDingTalk';


class UserMessage extends ReactChild {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                portrait: "",
                name: "",
                birthday: "",
                telephone: "",
                verificationDate: 0
            }
        }
    }

    componentDidMount() {
        this.obtain();
    }

    obtain = () => {
        if (this.userMessageAjax) {
            this.userMessageAjax.ajax({
                url: "/user/admin/user/user.manage.info.io",
                data: {},
                callback: (data) => {
                    let telephoneIsVerification = false;
                    if (data.telephone) {
                        telephoneIsVerification = true
                    }
                    this.setState({
                        data: data,
                        oldTelephone: data.telephone,
                        telephoneIsVerification: telephoneIsVerification
                    });
                }
            });
        }
    };

    nameChange = (env) => {
        let value = env.value;
        let data = this.state.data;
        data.name = value;
        this.setState({data: data});
    };

    birthdayChange = (env) => {
        let arr = env.value;
        let value = arr.getFullYear() + "-" + (arr.getMonth() + 1) + "-" + arr.getDate();
        let data = this.state.data;
        data.date = arr;
        data.birthday = value;
        this.setState({data: data});
    };

    submit = () => {
        let data = this.state.data;
        let code = this.state;
        if (!data.telephone) {
            Notification({
                title: '',
                message: '联系号码不能为空',
                type: 'error'
            });
            return false;
        }else if(!code){
            Notification({
                title: '',
                message: '请输入验证码',
                type: 'error'
            });
            return false;
        }
        this.userMessageAjax.ajax({
            url: "/user/admin/user/upManage.io",
            data: {name: data.name, portrait: data.portrait, birthday: data.birthday, telephone: data.telephone},
            callback: () => {
                Notification({
                    title: '',
                    message: '提交成功',
                    type: 'success'
                });
                this.obtain();
            }
        });
    };
    callback = (url, pa, img) => {
        if (pa.w >= 200&&pa.h >= 200) {
            let {data,isCropper}=this.state;
            if(pa.w == 200&&pa.h == 200){
                data.portrait = img.url;
                this.setState({data: data});
            }else {
                if (isCropper) {
                    this.cropper.jd.open(url, pa, img,false);
                } else {
                    this.setState({isCropper: true}, () => {
                        let crop = setInterval(() => {
                            let cropper = this.cropper;
                            if (cropper&&cropper.jd) {
                                clearInterval(crop);
                                cropper.jd.open(url, pa, img,false);
                            }
                        }, 100);
                    })
                }
            }
        }else {
            Notification({
                title: '警告',
                message: '该图片规格小于200*200',
                type: 'warning'
            });
        }
    };

    upFile = () => {
        this.setState({
            upImages: <BundleLoading ref={e => this.bundleLoading = e} load={upImages} callback={this.callback}/>
        }, () => {
            let upload = setInterval(() => {
                let jd = this.bundleLoading.jd;
                if (jd) {
                    clearInterval(upload);
                    jd.open();
                }
            }, 100);
        })
    };


    bindDingTalkModel = () => {
        this.setState({
            bindDingTalk: <BundleLoading ref={e => this.bindDingTalk = e} load={BindDingTalk}/>
        }, () => {
            let bindDingTalk = setInterval(() => {
                if (this.bindDingTalk && this.bindDingTalk.jd) {
                    clearInterval(bindDingTalk);
                    this.bindDingTalk.jd.open();
                }
            }, 100);
        })
    };


    getVerification = () => {//获取验证码
        let telephone = this.state.data.telephone;
        if (!/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(telephone)) {
            Notification({
                title: '',
                message: '手机号码错误请重新输入',
                type: 'error'
            });
        } else {
            this.userMessageAjax.ajax({
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
        let {telephoneIsVerification, verificationDate, openVerification,code,data,upImages,bindDingTalk,isCropper} = this.state;
        return (
            <AJAX ref={e => this.userMessageAjax = e}>
                <Card className="box-card">
                    <div style={{marginLeft: '150px'}}>
                        <Form model={this.state} labelWidth='80'>
                            <Form.Item label='头像'>
                                <div style={{textAlign: 'left'}}>
                                    <img src={data.portrait} width="202" height="202" alt=""/>
                                </div>
                                <Button type="primary" onClick={this.upFile}
                                        style={{float: 'left', marginTop: '-36px', marginLeft: '212px'}}>上传头像
                                </Button>
                                <h5 style={{color: 'red', float: 'left', marginTop: '20px', marginBottom: '-5px'}}>
                                    注意！头像必须为200×200</h5>
                            </Form.Item>
                            <Form.Item label='姓名'>
                                <Input value={data.name || ''} placeholder='请输入姓名...'
                                       onChange={(value) => this.nameChange({value: value})}/>
                            </Form.Item>
                            <Form.Item label='生日'>
                                <div style={{textAlign: 'left'}}>
                                    <DatePicker align={'left'} format={'yyyy-MM-dd'} value={data.date}
                                                placeholder="请选择出生日期..."
                                                onChange={(value) => {
                                                    this.birthdayChange({value: value})
                                                }}
                                                disabledDate={time => time.getTime() < Date.now() - 8.64e7}
                                    />
                                </div>
                            </Form.Item>
                            <Form.Item label='联系电话'>
                                <Input value={data.telephone} placeholder="请输入联系电话..."
                                       disabled={telephoneIsVerification}
                                       onChange={(value) => {
                                           let data = this.state.data;
                                           data.telephone = value;
                                           this.setState({data: data})
                                       }}
                                       append={
                                           data.telephone && (data.telephone == this.state.oldTelephone ?
                                               <Button type="primary" onClick={() => {this.setState({telephoneIsVerification: false})}}>修改号码</Button> :
                                               <Button type='primary' disabled={verificationDate>0} onClick={this.getVerification}>  {verificationDate > 0 ? verificationDate + 's' : '获取验证码'} </Button>)
                                       }/>
                            </Form.Item>
                            {openVerification && <Form.Item label='验证码'>
                                <Input placeholder='请输入验证码' value={code} size='small' onChange={(value) => {
                                    this.setState({code: value})
                                }}/>
                            </Form.Item>}

                            <Form.Item label=' 绑定钉钉'>
                                <div style={{textAlign: 'left'}}>
                                    {data.users && data.users.dingTalk ?
                                        <div>{"已绑定：" + data.users.dingTalk.nick}</div> :
                                        <div><Button type="primary" size="mini"
                                                     onClick={this.bindDingTalkModel}>绑定钉钉</Button></div>}
                                </div>
                            </Form.Item>

                            <div style={{marginTop: '-10px', float: 'left'}}>
                                <Form.Item>
                                    <Button type="primary" onClick={this.submit}>提交修改</Button>
                                </Form.Item>
                            </div>
                        </Form>
                        {upImages}{bindDingTalk}
                        {isCropper&&<BundleLoading ref={e => this.cropper = e} load={cropper} pixFilter='200x200' callbacks={this.callback}/>}
                    </div>
                </Card>
            </AJAX>
        )
    }
}

export default UserMessage;
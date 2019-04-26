/**
 * Created by linhui on 18-5-18.赏金任务添加店铺模态
 */
import React from 'react';
import AJAX from '../../../../../../components/lib/newUtil/AJAX';
import {Button, Layout, Dialog, Form, Input,Notification} from 'element-react';
import 'element-theme-default';

class BountyTaskNickModal extends React.Component {
    stateValue = () => {
        return {
            nickModal: false,//模态开关
            sellerName: '',//商家名
            sellerLink: '',//卖家链接
            myShop: {
                id: '',
                nick: '',//店铺名
                picPath: '',//店铺链接
                qrcodeUrl: '',//店铺二维码地址
            }
        }
    };

    constructor(props) {
        super(props);
        this.state = this.stateValue();
    }

    sellerNameChange = (env) => {//商家名事件
        let [value] = [env.value];
        this.setState({sellerName: value});
    };
    sellerLinkChange = (env) => {//卖家链接事件
        let [value, bountyTask] = [env.target.value];
        this.setState({sellerLink: value});
    };
    sellerBlur = () => {//查询卖家信息
        let sellerName = this.state.sellerName;
        if (!sellerName) {
            Notification.error({
                title: '错误',
                message: '卖家名称不能为空'
            });
            return false;
        }
        this.bountyTaskNickModalAjax.ajax({
            type: 'post',
            url: '/user/admin/visible/getShopByNick.io',
            data: {nick: sellerName},
            callback: (json) => {
                if (json) {
                    if (json.myShop.picPath) {
                        json.myShop.picPath = "http://logo.taobao.com/shop-logo" + json.myShop.picPath;
                    }
                    this.setState(json);
                }

            }
        });
    };
    addNickClick = () => {//添加商家
        let [bountyTask, myShop] = [this.props.state.bountyTask, this.state.myShop];

        if (!myShop.nick) {
            Notification.error({
                title: '错误',
                message: '没有该卖家或未搜索卖家名称'
            });
            return false;
        } else {
            if (bountyTask.sellerName.indexOf(myShop.nick) > -1) {
                Notification.error({
                    title: '错误',
                    message: '请勿重复添加卖家'
                });
                return false;
            }
        }
        if (!bountyTask.sellerName) {
            bountyTask.sellerName = myShop.nick;
        } else {
            bountyTask.sellerName += ',' + myShop.nick;
        }
        if (!bountyTask.shopLogo) {
            bountyTask.shopLogo = myShop.picPath;
        }
        /* else {
                    bountyTask.shopLogo += ',' + myShop.picPath;
                }*/

        /*bountyTask.myShop.push(myShop);*/
        this.setState({nickModal: false}, () => {
            this.props.setPaState({bountyTask: bountyTask});
        });
    };
    openNickModal = () => {//打开模态
        this.setState({nickModal: true});
    };

    closeNickModal = () => {//关闭模态
        this.setState({nickModal: false});
    };

    render() {
        return (
            <div>
                <AJAX ref={e=>this.bountyTaskNickModalAjax=e}>
                <Dialog title="添加店铺" size="small" visible={this.state.nickModal} onCancel={this.closeNickModal} onOpen={this.stateValue} lockScroll={false}>
                    <Dialog.Body>
                        <Form>
                            <Form.Item label='卖家名称搜索'>
                                <Input placeholder="请输入卖家名称" value={this.state.sellerName} onChange={(value) => {
                                    this.sellerNameChange({value: value})
                                }}
                                       onKeyDown={(event) => {
                                           if (event.keyCode == "13") {
                                               this.sellerBlur();
                                           }
                                       }}
                                       append={<Button type="primary" icon="search" onClick={this.sellerBlur}>搜索</Button>}/>
                            </Form.Item>

                            {this.state.myShop.nick && <Form.Item label='卖家名称'>
                                <Input disabled="true" value={this.state.myShop.nick}/>
                            </Form.Item>}
                            {this.state.myShop.picPath && <Form.Item label='店铺logo'>
                                <img src={this.state.myShop.picPath}/>
                            </Form.Item>}
                        </Form>
                    </Dialog.Body>
                    <Dialog.Footer className="dialog-footer">
                        <Button type='success' onClick={this.addNickClick}>确定添加</Button>
                        <Button type='danger' onClick={this.closeNickModal}>关闭</Button>
                    </Dialog.Footer>
                </Dialog>
                </AJAX>
            </div>
        )
    }

}

export default BountyTaskNickModal;

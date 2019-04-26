/**
 * Created by 薛荣晖 on 2018/9/26 0026下午 6:06.
 */

import React from "react";
import ReactChild from "../../../../../../lib/util/ReactChild";
import {Layout, Card, Button, MessageBox, Message} from "element-react";
import 'element-theme-default';
import AJAX from '../../../../../../lib/newUtil/AJAX';
import {clone} from '../../../../../../lib/util/global';
import addbut from '../../../../../../../images/user/addbut.png';
import {DialogBundle} from '../../../../../../../bundle';
import editManaeItemDialogContainere from 'bundle-loader?lazy&name=pc/trends_asset/components/user/head/app-[name]!./components/EditManaeItemDialog';

class NewHead extends ReactChild {
    constructor(props) {
        super(props);
        this.state = {
            pageNow: 1,
            pageSize: 16,
            count: 0,
            mainMenu: [],//大导航栏数据
            manageItem: [],//所有导航栏数据
            head: 0,
            seedHead: -1,
            dialogVisible: false,
        }
    }

    componentDidMount() {
        this.queryMainMenu(() => {
            this.queryHeadList();
        })
    };

    queryMainMenu = (callback) => { //获取主菜单
        if (this.newHeadAjax) {
            this.newHeadAjax.ajax({
                url: '/user/admin/superOrganization/queryMainMenu.io',
                type: 'post',
                data: {},
                callback: (json) => {
                    this.setState(json, () => {
                        if (callback) {
                            callback();
                        }
                    })
                }
            });
        }
    };

    queryHeadList = () => {
        if (this.newHeadAjax) {
            this.newHeadAjax.ajax({
                type: 'post',
                url: '/user/admin/superOrganization/queryHeadList.io',
                data: {},
                callback: (json) => {
                    this.setState(json);
                }
            });
        }
    };

    editManageItem = (data) => {//打开模态
        let {head, item} = data;
        let manageItem = clone(item);
        let seedHead = this.state.seedHead;
        this.setState({head: head}, () => {
            this.editManaeItemDialog.open({manAgeItem: manageItem, head: head, seedHead: seedHead}, () => {
                if (head === 2) {
                    this.editManaeItemDialog.getBun((gt) => {
                        gt.manageSelectChange({});
                    });
                }
            })
        })
    };

    delManageItem = (id) => {//删除导航栏
        MessageBox.confirm('此操作将删除导航, 是否继续?', '提示', {
            type: 'warning'
        }).then(() => {
            this.newHeadAjax.ajax({
                url: '/user/admin/superOrganization/delManAgeItem.io',
                type: 'post',
                data: {'id': id},
                callback: () => {
                    Message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.queryHeadList();
                }
            })
        }).catch(() => {
            Message({
                type: 'info',
                message: '已取消删除'
            });
        })
    };


    render() {
        let {manageItem, head} = this.state;
        let seedHead = this.state.seedHead ? 0 : '';
        return (
            <AJAX ref={e => {
                this.newHeadAjax = e
            }}>
                <div style={{width: '100%', height: '100%'}}>
                    <Layout.Row gutter="20">
                        <Layout.Col span={4} style={{marginBottom: '20px'}}>
                            <Card bodyStyle={{padding: 0, margin: '10px', backgroundColor: '#f3f3f4'}}>
                                <div>
                                    <img src={addbut} className="image"
                                         style={{borderRadius: '50%', padding: '5px', width: '95%'}}/>
                                </div>
                                <div style={{padding: 9, marginTop: '27px'}}>
                                    <Button plain={true} type="success"
                                            style={{
                                                height: '55px',
                                                width: '100%',
                                                border: '2px solid #E6E6FA',
                                            }} onClick={() => {
                                        this.editManageItem({head: head, item: {id: 0, title: undefined, isPublic: false, rank: 1, type: 1}});
                                    }}>新增导航栏</Button>
                                </div>
                            </Card>
                        </Layout.Col>
                        {manageItem.map((item, i) => {
                            return (
                                <Layout.Col span={4} style={{marginBottom: '20px'}} key={item.id}>
                                    <Card bodyStyle={{padding: 0, margin: '10px'}}>
                                        <div style={{backgroundColor: '#FFFFF0'}}>
                                            <img
                                                src='http://assets.alicdn.com/apps/mytaobao/3.0/profile/defaultAvatar/avatar-160.png'
                                                className="image"
                                                style={{borderRadius: '50%', padding: '5px', width: '95%'}}/>
                                        </div>
                                        <div style={{padding: 10}}>
                                            <div style={{textAlign: 'left'}}>
                                            <span style={{
                                                fontWeight: 'bold',
                                                color: 'rgb(130, 130, 130)'
                                            }}>导航排序：</span>{item.rank}
                                            </div>
                                            <div style={{textAlign: 'left'}}>
                                            <span style={{
                                                fontWeight: 'bold',
                                                color: 'rgb(130, 130, 130)'
                                            }}>导航名称：</span>{item.title}
                                            </div>
                                            <div style={{textAlign: 'left'}}>
                                            <span style={{
                                                fontWeight: 'bold',
                                                color: 'rgb(130, 130, 130)'
                                            }}>是否公开：</span>{item.isPublic == true ? '是' : '否'}
                                            </div>
                                        </div>
                                        <div>
                                            <Button.Group>
                                                <Button type='info' size='mini'
                                                        onClick={() => {
                                                            this.editManageItem({head: 2, item});
                                                        }}>查看</Button>
                                                <Button type='success' size='mini'
                                                        onClick={() => {
                                                            this.editManageItem({head: 1, item});
                                                        }}>编辑</Button>
                                                <Button type='danger' size='mini'
                                                        onClick={() => {
                                                            this.delManageItem(item.id)
                                                        }}>删除</Button>
                                            </Button.Group>
                                        </div>
                                    </Card>
                                </Layout.Col>
                            )
                        })}
                    </Layout.Row>
                </div>
                <DialogBundle ref={e => this.editManaeItemDialog = e} dialogProps={{title: head === 0 ? '新建主导航栏' : head === 1 ? '编辑主导航栏' : '查看主导航栏 ', size: "tiny"}}
                              bundleProps={{
                                  load: editManaeItemDialogContainere, queryHeadList: this.queryHeadList, cloneModal: () => {
                                      this.editManaeItemDialog.setState({dialogVisible: false})
                                  }
                              }}
                              dialogFooter={<div>
                                  <Button type="primary" onClick={() => {
                                      this.editManaeItemDialog.setState({dialogVisible: false})
                                  }}>取消</Button>
                                  {head === 0 ? <Button type="primary" onClick={() => {
                                      this.editManaeItemDialog.getBun((gb) => {
                                          gb.addmanAgeItem()
                                      });
                                  }}>新增</Button> : head === 2 && seedHead === 0 ? <Button type="primary" onClick={() => {
                                      this.editManaeItemDialog.getBun((gb) => {
                                          gb.addManAgePage()
                                      });
                                  }}>提交</Button> : head === 2 ? <Button type="primary" onClick={() => {
                                      this.editManaeItemDialog.setState({dialogVisible: false})
                                  }}>确定</Button> : <Button type="primary" onClick={() => {
                                      this.editManaeItemDialog.getBun((gb) => {
                                          gb.editNavigation()
                                      });
                                  }}>修改</Button>}
                              </div>}>
                </DialogBundle>
            </AJAX>
        )
    }
}

export default NewHead;
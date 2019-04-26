/**
 * Created by 石英 on 2018/10/29 0029下午 2:33.
 */

import React from 'react';
import {Dialog, Layout, Button, Progress, Notification, Message, Select, Form} from 'element-react';
import 'element-theme-default';
import {ThousandsOfCall} from "../../../../../../../lib/util/ThousandsOfCall";
import AJAX from '../../../../../../../../components/lib/newUtil/AJAX.js';

class AddTaskGroupModel extends React.Component {
    constructor(props) {
        super(props);
        this.open = this._open.bind(this);
        this.close = this._close.bind(this);
        this.state = {
            dialogVisible: false,
            name: '添加任务组',
            accountId: '',
            total: 1,
            daren_list: [],
            daren_id: 0,
            collectList: []
        };
    }

    _open({name}) {
        this.setState({dialogVisible: true, name}, this.daren_list)
    }

    _close() {
        this.setState({dialogVisible: false});
    }

    daren_list = (callback) => {//获取授权达人列表
        ThousandsOfCall.acoustic(
            {}, "requestTanleList", (msg) => {
                if (msg.success) {
                    this.setState({daren_list: msg.data}, callback);
                } else {
                    Message.error('获取达人列表失败');
                    currencyNoty('获取失败', 'warning')
                }
            }
        )
    };

    // getAccountId = () => {
    //     ThousandsOfCall.acoustic({
    //             agreement: "https",
    //             hostname: "v.taobao.com",
    //             path: "/micromission/check_identity.do",
    //             data: {
    //                 callback: 'jsonp46',
    //             },
    //             method: "GET",
    //             referer: "https://v.taobao.com/"
    //         }, 'requestRelyTB', (msg) => {
    //             if (msg.success) {
    //                 let object = this.retrieval({data: msg.data});
    //                 if (object.msg == '成功') {
    //                     console.log(object.data);
    //                     this.setState({accountId: object.data.userId});
    //                 } else {
    //                     Notification.error({
    //                         title: '错误',
    //                         message: `获取失败${object.msg}`
    //                     });
    //                 }
    //             } else {
    //                 Notification.error({
    //                     title: '错误',
    //                     message: `获取失败`
    //                 });
    //             }
    //         }
    //     );
    // };


    startCollect = () => {
        let collectList = [];
        for (let d in this.state.daren_list) {
            if ((this.state.daren_id == 0 || this.state.daren_list[d].id == this.state.daren_id) && this.state.daren_list[d].cookieIsFailure) {
                collectList.push(this.state.daren_list[d]);
            }
        }
        this.setState({collectList: collectList});

    }

    render() {
        let {dialogVisible, name, accountId} = this.state;
        return (
            <Dialog title={name} size="small" visible={dialogVisible}
                    onCancel={() => this.setState({dialogVisible: false})}
                    lockScroll={false}>
                <Dialog.Body>
                    <AJAX ref={e => this.addTask = e}>
                        <Form labelWidth="150" onSubmit={e => {
                        }}>
                            <Form.Item label="同步达人后台的v任务" style={{textAlign: "left"}}>
                                <Select value={this.state.daren_id} placeholder="请选择一个账号" onChange={(v) => {
                                    this.setState({daren_id: v})
                                }}>
                                    <Select.Option key={0} label="全部账号" value={0}/>
                                    {this.state.daren_list.map(el => {
                                        return <Select.Option key={el.id}
                                                              label={el.title + (el.cookieIsFailure ? "" : '-未授权')}
                                                              value={el.id}
                                                              disabled={!el.cookieIsFailure}/>
                                    })}
                                </Select>
                            </Form.Item>
                            {this.state.collectList.map((item) => {
                                return <CollectTaskGroup accountId={item.accountId} title={item.title}
                                                         ajax={this.addTask}
                                                         talentId={item.id}/>
                            })}

                        </Form>
                        {this.state.collectList.length == 0 ?
                            <Button type='info' onClick={this.startCollect} style={{width: '100%'}}
                                    disabled={this.state.daren_list.length == 0}>同步V任务平台待交付订单到软件</Button> :
                            <Button type='info' onClick={() => {
                                this.setState({collectList: []}, this.startCollect);
                            }} style={{width: '100%'}}
                                    disabled={this.state.daren_list.length == 0}>重新同步</Button>}

                    </AJAX>
                </Dialog.Body>
            </Dialog>
        )
    }
}


class CollectTaskGroup extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            accountId: '',
            total: 0,
            current: 0,
            isEnd: false
        }
        ;
    }

    componentDidMount() {
        this.getV_mission();
    }

    getV_mission = () => {
        this.getV_missionData(1, (array) => {
            this.getV_missionDetails({array, index: 0}, () => {
                this.setState({isEnd: true});
            });
        })
    };

    getV_missionData = (currentPage, callback, array = []) => {
        let page_size = 30;
        ThousandsOfCall.acoustic({//获取V任务列表
                talentId: this.props.talentId,
                agreement: "https",
                hostname: "v.taobao.com",
                path: "/micromission/daren/list/getDarenSubmissionByStatusV3.do",
                data: {
                    currentPage: currentPage,
                    sub_mission_status: 1,//正式1，测试-1
                    page_size: page_size,
                    mission_type: -1,
                    _output_charset: 'UTF-8',
                    _input_charset: 'UTF-8',
                    callback: 'jsonp102',
                },
                method: "GET",
                referer: "https://v.taobao.com/"
            }, 'requestRelyAgentTB', (msg) => {
                if (msg.success) {
                    let object = this.retrieval({data: msg.data});
                    if (object.data && object.data.dataList) {
                        let pageCount = Math.floor((object.data.total - 1) / page_size) + 1;
                        array.push(...object.data.dataList);
                        debugger;
                        this.setState({total: object.data.total}, () => {
                            if (currentPage < pageCount) {
                                this.getV_missionData(currentPage + 1, callback, array)
                            } else {
                                callback(array);
                            }
                        })
                    } else {
                        Notification.error({
                            title: '错误',
                            message: '获取失败,请检查登录是否中断！'
                        });
                    }
                } else {
                    Notification.error({
                        title: '错误',
                        message: `获取失败`
                    });
                }
            }
        );
    };

    getV_missionDetails = ({array, index}, callback) => {
        if (index < array.length) {
            ThousandsOfCall.acoustic({//任务详情
                    talentId: this.props.talentId,
                    agreement: "https",
                    hostname: "v.taobao.com",
                    path: "/micromission/get_mission_detail_info.do",
                    data: {
                        mission_id: array[index].id,
                        callback: 'jsonp18',
                    },
                    method: "GET",
                    referer: "https://v.taobao.com/"
                }, 'requestRelyAgentTB', (msg) => {
                    if (msg.success) {
                        let object = this.retrieval({data: msg.data});
                        if ((!object.msg) && object.data) {
                            let data = Object.assign(array[index++], object.data);
                            this.addV_mission(data, () => {
                                this.setState({current: this.state.current + 1}, () => {
                                    this.getV_missionDetails({array, index}, callback);
                                })
                            });
                        } else {
                            Notification.error({
                                title: '错误',
                                message: `获取失败${object.msg}`
                            });
                        }
                    } else {
                        Notification.error({
                            title: '错误',
                            message: `获取失败`
                        });
                    }
                }
            );
        } else {
            callback();
        }
    };

    addV_mission = (data, callback) => {
        let {contact, contentRequire, itemUrls} = data.detail.reqInfo;
        let setData = {
            accountId: this.props.accountId,
            shopNick: data.subject,
            items: itemUrls,
            detailed: contentRequire,
            title: data.priceTitle,
            vTaskId: data.detail.publicData.missionId,
            vTaskContact: contact,
            price: data.detail.publicData.fee
        };
        this.props.ajax.ajax({
            type: 'post',
            url: `/mission/admin/taskGroup/domain.taskGroup.add.io`,
            isCloseMask: true,
            data: {data: JSON.stringify(setData)},
            callback: () => {
                setTimeout(() => {
                    callback();
                }, 600);
            }
        });
    };

    retrieval = ({data}) => {//返回数据转换
        let index = data.indexOf('('), lastIndex = data.lastIndexOf(')');
        return JSON.parse(data.substring(index + 1, lastIndex));
    };


    render() {
        let {total, current, isEnd} = this.state;

        return (
            <Form.Item label={this.props.title}>
                <Progress strokeWidth={20} percentage={total == 0 ? 100 : Math.floor(current / total * 100)}
                          status={isEnd ? "success" : ""}
                          textInside/>
            </Form.Item>);
    }
}

export default AddTaskGroupModel;
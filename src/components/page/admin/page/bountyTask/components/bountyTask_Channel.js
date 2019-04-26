/**
 * Created by linhui on 18-2-2.赏金任务渠道
 */

import React from 'react';
import $ from 'jquery';
import AJAX from '../../../../../../components/lib/newUtil/AJAX';
import {clone} from '../../../../../../components/lib/util/global';
import {Button, Layout, Form, Dialog, Select, Input, Checkbox,Notification} from 'element-react';
import 'element-theme-default';

class BountyTaskChannel extends React.Component {
    stateValue = () => {
        return {
            channelModal: false,//模板模态
            adoptChannels: [],//收录渠道
            conditions: {type: '', wTincluded: []},//条件规则
            channelStr: '',//所有渠道
            mainChannelList: [],//渠道1数据
            mainChannel: '',//渠道1id
            activityList: [],//渠道2数据
            columnName: '',//某一条渠道2值
            activityId: '',//渠道2id
            channelList: [],//渠道3数据
            entryValue: '',//某一条渠道3全部值
            entryId: '',//渠道3Id
            channelId: '',
            from: undefined,//是否微淘
            columnNameDisabled: true,//渠道搜索是否禁用
            mainChannelDisabled: true,//渠道2选择是否禁用
            channelDisabled: true,//渠道3选择是否禁用
            typeDisabled: true,//选择类型是否禁用}
        }
    };

    constructor(props) {
        super(props);
        this.state = this.stateValue();
    }

    openChannelModal = () => {//打开渠道修改模态
        this.setState({channelModal: true});
    };
    closeChannelModal = () => {//关闭渠道修改模态
        this.setState({channelModal: false});
    };

    componentDidMount() {

    }

    getActivityList = (value) => {//获取渠道2数据
        let activityId = this.state.activityId;
        this.bountyTaskChannelAjax.ajax({
            type: 'post',
            url: '/user/admin/superManage/queryByMainChannel.io',//获取渠道2数据
            data: {'mainChannel': value, 'activityId': '', columnName: ''},
            callback: (json) => {
                this.setState({activityList: json, mainChannelDisabled: false}, () => {
                    if (activityId) {
                        this.getChannelList(activityId);//渠道3数据
                    }
                });
            }
        });
    };
    getChannelList = (value) => {//获取渠道3数据
        this.bountyTaskChannelAjax.ajax({
            type: 'post',
            url: '/user/admin/superManage/queryByActivityId.io',//获取渠道3
            data: {'activityId': value},
            callback: (json) => {
                this.setState({channelList: json.channel, channelDisabled: false});
            }
        });
    };
    queryTitleAndMainChannel = (callback) => {//拿取渠道1数据
        this.bountyTaskChannelAjax.ajax({
            type: 'post',
            url: '/user/admin/superManage/queryTitleAndMainChannel.io',
            data: {},
            callback: (json) => {
                this.setState({mainChannelList: json}, () => {//渠道1数据
                    let [mainChannel] = [this.state.mainChannel];
                    if (mainChannel) {
                        this.getActivityList(mainChannel);//渠道2数据
                    }
                });
            }
        });
    };

    mainChannelChange = (env) => {//根据渠道1id获取渠道2
        let zujian = this;
        let [value, conditions] = [env.value, {}];
        conditions.wTincluded = [];
        conditions.type = '';
        if (!value) {
            Notification.error({
                title: '错误',
                message: '请选择一个渠道'
            });
            this.setState({
                columnNameDisabled: true,
                mainChannelDisabled: true,
                channelDisabled: true,
                activityList: [],
                channelList: [],
                mainChannel: value,
                typeDisabled: true
            });
            return false;
        }
        let activityId = '';
        if (value !== '' || value !== null || value !== undefined) {
            let columnName = '';
            if (value < -100) {//如果是搜索清空除渠道1外的所有渠道值并禁用
                zujian.setState({
                    mainChannelDisabled: true,
                    activityList: [],
                    channelDisabled: true,
                    channelList: [],
                    conditions: conditions,
                    typeDisabled: true,
                    mainChannel: value
                }, () => {
                    $('#columnNameChange').focus();
                });
            } else {
                w();
            }

            function w() {
                this.bountyTaskChannelAjax.ajax({
                    type: 'post',
                    url: '/user/admin/superManage/queryByMainChannel.io',//获取渠道2数据
                    data: {'mainChannel': value, 'activityId': activityId, columnName: columnName},
                    callback: (json) => {
                        zujian.setState({
                            activityId: '',
                            activityList: json,
                            mainChannelDisabled: false,
                            channelDisabled: true,
                            conditions: conditions,
                            typeDisabled: true,
                            mainChannel: value,
                            channelList: [],

                        }, () => {
                            $('#activityChange').focus();
                        });
                    }
                });
            }
        }
    };

    activityChange = (env) => {//根据渠道2获取渠道3
        let [value, conditions] = [env.value, {}];
        conditions.wTincluded = [];
        conditions.type = '';
        if (value != '' || value != null || value != undefined) {
            this.bountyTaskChannelAjax.ajax({
                type: 'post',
                url: '/user/admin/superManage/queryByActivityId.io',//获取渠道3
                data: {'activityId': value},
                callback: (json) => {
                    this.setState({
                        channelList: json.channel,
                        channelDisabled: false,
                        activityId: value,
                        conditions: conditions,
                        typeDisabled: true
                    }, () => {
                        $('#channelChange').focus();
                    });
                }
            });
        }
    };
    columnNameChange = (env) => {//改变渠道2(渠道2搜索text)
        let columnName = env.value;
        this.setState({columnName: columnName});
    };

    columnNameClick = (env) => {////id值-100以下搜索渠道2
        let [columnName, mainChannel] = [this.state.columnName, this.state.mainChannel];
        if (!columnName) {
            Notification.error({
                title: '错误',
                message: '请输入渠道名后再进行搜索'
            });
            return false;
        }
        this.bountyTaskChannelAjax.ajax({
            type: 'post',
            url: '/user/admin/superManage/queryByMainChannel.io',
            data: {'mainChannel': mainChannel, 'activityId': '', columnName: columnName},
            callback: (json) => {
                this.setState({
                    activityList: json,
                    mainChannelDisabled: false,
                }, () => {
                    $('#activityChange').focus();
                });
            }
        });
    };
    channelChange = (env) => {//把渠道3的值赋值到外层
        let [value, channelList] = [env.value, this.state.channelList];
        let from;
        let entryId;
        for (let i = 0; i < channelList.length; i++) {
            if (channelList[i].id == value) {
                entryId = channelList[i].entryId;
                if (channelList[i].from) {
                    from = channelList[i].from;
                    break;
                }
            }
        }
        if (!value) {
            Notification.error({
                title: '错误',
                message: '请选择一个渠道'
            });
            this.setState({conditions: conditions, typeDisabled: true, entryValue: ''});
            return false;
        }
        this.setState({channelId: value, entryId: entryId, from: from, typeDisabled: false});
    };

    typeChange = (env) => {//类型事件
        let [value, conditions] = [env.value, this.state.conditions];
        conditions.type = value;
        this.setState({conditions: conditions});
    };

    adoptChannelsChange = (env) => {//收录改变事件
        let [value, , conditions] = [env.value, env.target.checked, this.state.conditions];
        let wTincluded = conditions.wTincluded;
        let index = $.inArray(value, wTincluded);
        if (index >= 0) {
            wTincluded.splice(index, 1);
        } else {
            wTincluded.push(value);
        }
        conditions.wTincluded = wTincluded;
        this.setState({conditions: conditions});

    };
    addChannelClick = () => {//添加渠道
        let [bountyTask, conditions, channelStr, mainChannel, activityId, entryId] = [this.props.state.bountyTask, this.state.conditions, this.state.channelStr, this.state.mainChannel, this.state.activityId, this.state.entryId];
        let obj = {};
        if (!conditions || !conditions.type) {
            Notification.error({
                title: '错误',
                message: '请选择渠道类型'
            });
            return false;
        } else if (conditions.type == 3) {
            if (conditions.wTincluded.length <= 0) {
                Notification.error({
                    title: '错误',
                    message: '选择指定微淘后请添加指定的微淘渠道'
                });
                return false;
            }
        }
        for (let y = 0; y < this.state.mainChannelList.length; y++) {//判断获取渠道1
            if (this.state.mainChannelList[y].mainChannel == mainChannel) {
                [obj.mainChannel, obj.title] = [parseInt(mainChannel), this.state.mainChannelList[y].title];
            }
        }
        for (let x = 0; x < this.state.activityList.length; x++) {//判断获取渠道2
            if (this.state.activityList[x].activityId == activityId) {
                [obj.activityId, obj.columnName] = [parseInt(activityId), this.state.activityList[x].columnName];
            }
        }

        for (let i = 0; i < this.state.channelList.length; i++) {//获取渠道3
            if (this.state.channelList[i].entryId == entryId) {
                [obj.entryId, obj.entryName, obj.channelId] = [parseInt(entryId), this.state.channelList[i].entryName, this.state.channelList[i].id];
            }
        }
        obj.from = this.state.from;
        obj.conditions = conditions;
        obj.channelId = this.state.channelId;
        if (bountyTask.channelStr.length == 0) {
            let c = clone(obj);
            bountyTask.channelStr.push(c);
        } else {
            let ens = bountyTask.channelStr.map((item) => {
                return item.channelId;
            });

            let index = $.inArray(obj.channelId, ens);
            if (index >= 0) {
                bountyTask.channelStr[index] = obj;
            } else {
                bountyTask.channelStr.push(obj);
            }
        }

        this.props.setPaState({bountyTask: bountyTask}, () => {
            this.closeChannelModal();
        });
    };
    exitClick = () => {//
        this.state = this.stateValue();
    };

    render() {
        let wTincludedArray = [{value: '淘宝头条', name: '淘宝头条'}, {value: '必买清单', name: '必买清单'},
            {value: '有好货', name: '有好货'}, {value: '微淘发现', name: '微淘发现'}, {value: '淘宝短视频', name: '淘宝短视频'}];
        let bountyTask = this.props.state.bountyTask;
        return (
            <div>
                <AJAX ref={e => this.bountyTaskChannelAjax = e}>
                    <Dialog title={bountyTask.id ? '赏金任务详情' : '添加赏金任务'} size="small" visible={this.state.channelModal} onCancel={this.closeChannelModal} onClose={this.exitClick} lockScroll={false}>
                        <Dialog.Body>
                            <Form>
                                <Form.Item label='选择渠道'>
                                    {/*渠道1选择开始*/}
                                    <Layout.Col sm={8}>
                                        <Select value={this.state.mainChannel} placeholder="请选择" disabled={this.props.disbaled} onChange={(value)=>{this.mainChannelChange({value:value})}}>
                                            <Select.Option value="" label='请选择'/>
                                            {this.state.mainChannelList.map((item, i) => {
                                                if (item.mainChannel) {
                                                    return (
                                                        <Select.Option key={item.mainChannel} value={item.mainChannel} label={item.title}/>
                                                    )
                                                }
                                            })}
                                        </Select>
                                    </Layout.Col>
                                    {/*渠道1选择结束*/}

                                    {/*渠道2搜索开始*/}
                                    <Layout.Col sm={8}>
                                        <Input placeholder="请输入渠道名字" onChange={(value)=>{this.columnNameChange({value:value})}} value={this.state.columnName} disabled={this.state.mainChannel < -100 ? false : true}/>
                                    </Layout.Col>
                                    <Layout.Col sm={6}>
                                        <Button disabled={this.state.mainChannel < -100 ? false : true} icon="search"
                                                onKeyDown={(event) => {
                                                    if (event.keyCode == "13") {
                                                        this.columnNameClick();
                                                    }
                                                }}
                                                onClick={this.columnNameClick}>搜索</Button>
                                    </Layout.Col>
                                    {/*渠道2搜索结束*/}
                                </Form.Item>
                                <Form.Item label=' '>
                                    {/*渠道2选择开始*/}
                                    <Layout.Col sm={8}>
                                        <Select value={this.state.activityId} placeholder="请选择" disabled={this.state.mainChannelDisabled} onChange={(value)=>{this.activityChange({value:value})}}>
                                            <Select.Option label='请选择' value=''/>
                                            {this.state.activityList.map((item, i) => {
                                                return (
                                                    <Select.Option key={i} value={item.activityId} label={item.columnName}/>
                                                )
                                            })}
                                        </Select>
                                    </Layout.Col>
                                    {/*渠道2选择结束*/}

                                    {/*渠道3选择开始*/}
                                    <Layout.Col sm={8}>
                                        <Select disabled={this.state.channelDisabled} value={this.state.channelId} onChange={(value)=>{this.channelChange({value:value})}}>
                                            <Select.Option value="" label='请选择'/>
                                            {this.state.channelList.map((item, i) => {
                                                let from = item.from ? item.from : '';
                                                return (
                                                    <Select.Option key={item.entryId + "_" + item.entryName} value={item.id} label={item.entryName}/>
                                                )
                                            })}
                                        </Select>
                                    </Layout.Col>
                                    {/*渠道3选择结束*/}

                                    {/*规则条件类型选择开始*/}
                                    <Layout.Col sm={6}>
                                        <Select onChange={(value)=>{this.typeChange({value:value})}} value={this.state.conditions.type} disabled={this.state.typeDisabled}>
                                            <Select.Option value='' label='请选择类型'/>
                                            {!this.state.from && <Select.Option value="1" label='渠道审核通过'/>}
                                            <Select.Option value="2" label='不需要通过'/>
                                            {this.state.from && <Select.Option value="3" lable='指定微淘收录'/>}
                                        </Select>
                                    </Layout.Col>
                                    {/*规则条件类型选择结束*/}
                                </Form.Item>

                                {/*条件类型是3指定微淘收录*/}
                                {this.state.conditions.type == 3 && <Form.Item label='收录渠道'>
                                    <Checkbox.Group value={this.state.wTincludedArray}>
                                        {wTincludedArray.map((item, i) => {
                                            let conditions = this.state.conditions;
                                            return (
                                                <Checkbox inline disabled={this.state.disbaled} key={i + "_" + item.name} value={item.value} label={item.name}
                                                          onChange={(value)=>{this.adoptChannelsChange({value:value})}}/>
                                            )
                                        })}
                                    </Checkbox.Group>
                                    {/*  {wTincludedArray.map((item, i) => {
                                        let conditions = this.state.conditions;
                                        return (
                                            <Checkbox inline disabled={this.state.disbaled} key={i + "_" + item.name}
                                                      checked={conditions.wTincluded ? (!conditions.wTincluded instanceof Array ? conditions.wTincluded.join().indexOf(item.value) : conditions.wTincluded.indexOf(item.value)) > -1 ? "checked" : '' : ''}
                                                      value={item.value}
                                                      onChange={this.adoptChannelsChange}>{item.name}</Checkbox>
                                        )
                                    })}*/}
                                </Form.Item>}
                            </Form>
                        </Dialog.Body>
                        <Dialog.Footer className="dialog-footer">
                            <Button type='success' onClick={this.addChannelClick}>确定</Button>
                            <Button type='danger' onClick={this.closeChannelModal}>关闭</Button>
                        </Dialog.Footer>
                    </Dialog>
                </AJAX>
            </div>
        )
    }
}

export default BountyTaskChannel;

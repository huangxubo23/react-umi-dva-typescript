/**
 * Created by linhui on 18-1-31.赏金任务模态
 */
import React from 'react';
import EditBox from '../../../../../lib/sharing/editBox/EditBox';
import {Button, Layout, Input, Pagination, Message, Dialog, Form, Alert, Select, InputNumber, DatePicker, Radio, Tag,} from 'element-react';
import 'element-theme-default';
import $ from 'jquery';
import { clone, getManage} from '../../../../../lib/util/global';
import AJAX from '../../../../../lib/newUtil/AJAX';
import BountyTaskChannel from './bountyTask_Channel';
import BountyTaskNickModal from './bountyTaskNickModal';

class AddBountyTaskModal extends React.Component {//赏金任务模态
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            editChannelModal: false,//修改渠道模态是否打开
            disbaled: this.props.disbaled,//是否可修改
            talent: false,//达人创建内容是否显示,true:不显示
            seller: '',//卖家店铺信息
            type: '',//条件类型：1 、渠道审核通过  2、不需要通过   3、指定微淘收录
            bountyTask: {
                id: 0,
                title: '',//标题
                sellerName: '',// 卖家名称
                sellerLink: '',//卖家链接
                sendOrgId: '',//派任务组织ID
                number: '',//任务数量
                price: '',//任务价格
                details: '',//详情
                state: '',//任务状态
                startDate: '',//开始时间
                endDate: '',//结束时间
                isDel: '',//是否删除
                typeTab: '',//行业分类
                isPayment: '',//是否付款
                channelStr: [],//多个渠道id
                shopLogo: '',//店铺logo
                myShop: [],//卖家信息
                talentGrade: '',//达人等级
                numberLimit: '',//达人条数限制
                todayNumberLimit: '',//达人当天可做条数限制
            }
        }
    }

    setThisState = (state, callback) => {
        this.setState(state, function () {
            if (callback && (typeof callback) == "function") {
                callback();
            }
        });
    };

    initial = () => {//时间插件
     /*   if (!this.state.disbaled) {
            let {bountyTask} = this.state;
            let startDate = bountyTask.startDate;
            bountyTask.startDate = startDate.split(" ")[0];
            let endDate = bountyTask.endDate;
            bountyTask.endDate = endDate.split(" ")[0];
            this.setState({bountyTask: bountyTask})
        }*/
     this.setState({showModal:true});
    };

    componentDidMount() {
        getManage((data) => {
            if (this.props.bountyTask) {
                this.setState({currentLogin: data, bountyTask: this.props.bountyTask});
            } else {
                this.setState({currentLogin: data});
            }

        });
    }

    addTask = () => {//新增赏金任务
        let bountyTask = {
            id: 0,
            title: '',//标题
            sellerName: '',// 卖家名称
            sellerLink: '',//卖家链接
            sendOrgId: '',//派任务组织ID
            number: '',//任务数量
            price: '',//任务价格
            details: '',//详情
            state: '',//任务状态
            startDate: '',//开始时间
            endDate: '',//结束时间
            isDel: '',//是否删除
            typeTab: '',//行业分类
            isPayment: '',//是否付款
            channelStr: [],//多个渠道id和名字
            myShop: [],//卖家信息
            shopLogo: '',//日志
            talentGrade: '',//达人等级
            numberLimit: '',//达人条数限制
            todayNumberLimit: '',//达人当天可做条数限制
        };
        this.setState({bountyTask: bountyTask, disbaled: false, showModal: true}, () => {
            this.initial();
        });
    };

    closeModal = () => {//关闭模态
        this.setState({showModal: false});
    };

    openModal = () => {//打开模态
        this.setState({bountyTask: this.props.bountyTask, disbaled: this.props.disbaled, showModal: true}, () => {
            this.initial()
        });
    };

    bountyTask = (env) => {//赏金任务改变事件
        let [name, value, bountyTask] = [env.name, env.value, this.state.bountyTask];
        bountyTask[name] = value;
        this.setState({bountyTask: bountyTask});
    };

    /* sellerBlur = () => {//查询卖家信息
         let sellerName = this.state.bountyTask.sellerName;
         if (!sellerName) {
             infoNoty('卖家名称不能为空', 'error');
             return false;
         }
         this.addBountyTaskModalAjax.ajax({
             type: 'post',
             url: '/user/admin/visible/getShopByNick.io',
             data: {nick: sellerName},
             callback: (json) => {
                 let bountyTask = this.state.bountyTask;
                 bountyTask.sellerName = json.myShop.nick;
                 bountyTask.shopLogo ="http://logo.taobao.com/shop-logo"+json.myShop.picPath;//http://img.alicdn.com/tfs"+json.myShop.picPath;
                 this.setState({seller: json.myShop, bountyTask: bountyTask});
             }
         });
     };*/

    addAndUpBountyTask = () => {//新增or修改赏金任务
        let data = this.state.bountyTask;
        data.details = this.refs.editBox.getContent();
        let flag = true;
        if (data.channelStr.length <= 0) {
            Message.error('请选择一个渠道');
            return false;
        } else if (data.channelStr.length > 0) {//判断类型与收录渠道
            for (let i = 0; i < data.channelStr.length; i++) {
                if (!data.channelStr[i].conditions || !data.channelStr[i].conditions.type) {
                    Message.error('请选择' + data.channelStr[i].title + '-' + data.channelStr[i].columnName + '-' + data.channelStr[i].entryName + '的类型');
                    flag = false;
                    break;
                } else if (data.channelStr[i].conditions.type == 3) {
                    if (data.channelStr[i].conditions.wTincluded.length <= 0) {
                        Message.error('请勾选' + data.channelStr[i].title + '-' + data.channelStr[i].columnName + '-' + data.channelStr[i].entryName + '收录渠道');
                        flag = false;
                        break;
                    }
                }
            }
            if (!flag) {
                return false;
            }
        }
        if (!data.talentGrade) {
            Message.error('请选择达人等级');
            return false;
        } else if (!data.title) {
            Message.error('标题不能为空');
            return false;
        } else if (!data.sellerName) {
            Message.error('卖家名称不能为空');
            return false;
        } else if (!data.sellerLink) {
            Message.error('卖家链接不能为空');
            return false;
        } else if (!data.number) {
            Message.error('数量不能为空');
            return false;
        } else if (!data.price) {
            Message.error('价格不能为空');
            return false;
        } else if (!data.typeTab) {
            Message.error('行业分类不能为空');
            return false;
        }
        if (!data.startDate) {
            Message.error('开始时间不能为空');
            return false;
        } else if (typeof (data.startDate) != 'string') {
             data.startDate = data.startDate.getFullYear() + "-" + (data.startDate.getMonth() + 1) + "-" + (data.startDate.getDate());
        }
        if (!data.endDate) {
            Message.error('结束时间不能为空');
            return false;
        }else if(typeof (data.endDate)!='string'){
             data.endDate = data.endDate.getFullYear() + "-" + (data.endDate.getMonth() + 1) + "-" + (data.endDate.getDate());
        }
        data.shopLogo = this.state.seller.qrcodeUrl ? this.state.seller.qrcodeUrl : '';

        //新增拿取渠道id
        let entry = '';
        for (let i = 0; i < data.channelStr.length; i++) {
            entry += data.channelStr[i].entryId + ',';
        }
        data.newEntryId = entry;//多个渠道id以逗号分割

        this.addBountyTaskModalAjax.ajax({
            type: 'post',
            url: '/mission/admin/supOrgTask/addAndUpBountyTask.io',//'/mission/admin/supOrgTask/addAndUpBountyTask.io',
            data: {data: JSON.stringify(data)},
            callback: (json) => {
                let text = data.id ? '修改赏金任务成功' : '添加赏金任务成功';
                Message.error(text, 'success');
                this.setState({showModal: false}, () => {
                    this.props.goPage();
                });
            }
        });
    };
    deleteidClick = (env) => {//删除已选渠道
        let [value, bountyTask] = [$(env.target).data('i'), this.state.bountyTask];
        let channelStr = bountyTask.channelStr;
        channelStr.splice(value, 1);
        bountyTask.channelStr = channelStr;
        this.setState({bountyTask: bountyTask});
    };
    editchannelClick = (env) => {//修改已选渠道
        let [i, channelStr] = [$(env.target).data('i'), this.state.bountyTask.channelStr];
        let dataobj = this.state.bountyTask.channelStr[i];
        let {activityId, entryId, mainChannel, conditions, entryName, from} = dataobj;
        let [type, wTincluded] = ['', []];
        if (!entryId) {//判断是否旧数据，是的话删除渠道
            Message.error('本条渠道是旧数据，请先删除再添加');
            //  return false;
        }

        if (!conditions) {//判断有没有匹配规则in
            conditions = {type: type, wTincluded: wTincluded};
        }
        let typeDisabled = true;
        if (conditions.type) {//判断规则类型
            typeDisabled = false;
        }
        this.openChannelModal();
        this.bountyTaskChannel.setState({mainChannel: mainChannel, activityId: activityId, entryId: entryId, conditions: conditions, typeDisabled: typeDisabled}, () => {
            this.bountyTaskChannel.queryTitleAndMainChannel();
        });

    };

    talentGradeChange = (env) => {//达人等级事件
        let [value, bountyTask] = [env, this.state.bountyTask];
        bountyTask.talentGrade = value;
        this.setState({bountyTask: bountyTask});
    };
    openChannelModal = () => {//打开渠道模态
        this.bountyTaskChannel.openChannelModal();
    };
    openNickModal = () => {//打开商家模态
        this.bountyTaskNickModal.openNickModal();
    };

    render() {
        let [bountyTask, typeTab1, typeTab5] = [this.state.bountyTask, ["潮女", "潮男", "美妆", "母婴", "户外",], ["数码", "家居", "文体", "汽车", "美食"]];
        let talentGrade = [{grade: 'L0', value: 0}, {grade: 'L1', value: 1}, {grade: 'L2', value: 2}, {grade: 'L3', value: 3}, {grade: 'L4', value: 4}, {grade: 'L5', value: 5}, {
            grade: 'L6',
            value: 6
        }];
        let sellerName = '';
        if (bountyTask.sellerName) {
            sellerName = bountyTask.sellerName.split(',');
        }
        if (bountyTask.shopLogo) {
            if (!bountyTask.shopLogo.startsWith("http")) {
                bountyTask.shopLogo = "http://logo.taobao.com/shop-logo" + bountyTask.shopLogo;
            }

        }
        let currentLogin = this.state.currentLogin;
        let permissions = currentLogin ? currentLogin.loginManage.permissions : '';
        let [startDate, endDate] = [bountyTask.startDate, bountyTask.endDate];
        if (typeof(startDate) == 'string') {
            startDate = new Date(bountyTask.startDate.replace(/-/g, '/'));
        }

        if (typeof(endDate) == 'string') {
            endDate = new Date(bountyTask.endDate.replace(/-/g, '/'));
        }

        return (
            <div>
                <AJAX ref={e=>this.addBountyTaskModalAjax=e}>
                <Dialog title={bountyTask.id ? '赏金任务详情' : '添加赏金任务'} size="small" visible={this.state.showModal} onCancel={this.closeModal} lockScroll={false}>

                    <Dialog.Body>
                        {!this.state.disbaled && <Button bsStyle='success' onClick={this.openChannelModal}>添加渠道</Button>}
                        <Form labelWidth="100">
                            <Form.Item label={this.state.talent ? "投稿渠道" : "已选渠道"}>
                                {(this.state.bountyTask.channelStr ? this.state.bountyTask.channelStr : []).map((item, i) => {
                                    return (
                                        <Alert type='info' key={item.entryId} title={<p>
                                            {item.title + '-' + item.columnName + '-' + item.entryName}
                                            <p><b style={{color: 'orange'}}>要求：
                                                {item.conditions ? item.conditions.type ? '' + item.conditions.type == 1 ? '(需要渠道审核通过)' : item.conditions.type == 2 ? '(不需要审核通过)' : '' : '' : ''}
                                                {item.conditions ? item.conditions.type == 3 ? item.conditions.wTincluded ? <span>微淘需要指定渠道收录:{item.conditions.wTincluded.map((wd, w) => {
                                                    return (<Tag key={wd}
                                                                 type={w == 0 ? 'gray' : w == 1 ? 'primary' : w == 2 ? 'success' : w == 3 ? 'info' : w == 4 ? 'warning' : w == 5 ? 'danger' : ''}>{wd}</Tag>)
                                                })}</span> : '' : '' : ''}
                                            </b></p>
                                            {!this.state.disbaled && <Tag data-i={i} onClick={this.deleteidClick} style={{cursor: 'pointer'}} bsStyle="danger">删除</Tag>}
                                            {!this.state.disbaled && <Tag data-i={i} onClick={this.editchannelClick} style={{cursor: 'pointer'}} bsStyle="warning">修改</Tag>}
                                        </p>} closable={false}/>
                                    )
                                })}
                            </Form.Item>
                            {!this.state.disbaled && <Button type='success' onClick={this.openNickModal}>添加商家</Button>}
                            <Form.Item label='已添加卖家'>
                                {(sellerName ? sellerName : []).map((item, i) => {
                                    return (
                                        <Alert type='info' closable={false} key={i + item} title={<p><span>卖家名称:{item}</span></p>}/>
                                    )
                                })}
                            </Form.Item>
                            {bountyTask.shopLogo && <Form.Item label='店铺logo'>
                                <img src={bountyTask.shopLogo}/>
                            </Form.Item>}

                            <Form.Item label='卖家链接'>
                                <Input value={bountyTask.sellerLink} disabled={this.state.disbaled} placeholder="请输入卖家链接" onChange={(value) => {
                                    this.bountyTask({value: value, name: 'sellerLink'})
                                }}/>
                            </Form.Item>

                            <Form.Item label='达人等级至少L几'>
                                <Select value={bountyTask.talentGrade} placeholder="请选择" disabled={this.state.disbaled} onChange={this.talentGradeChange}>
                                    <Select.Option label="请选择" value=""/>
                                    {talentGrade.map((item, i) => {
                                        return (<Select.Option disabled={this.state.disbaled} label={item.grade} key={i + "_" + item.grade} value={item.value}/>
                                        )
                                    })}
                                </Select>
                            </Form.Item>
                            <Form.Item label='每个达人可做条数'>
                                    <InputNumber defaultValue={bountyTask.numberLimit} value={bountyTask.numberLimit} onChange={(value) => {
                                        this.bountyTask({name: 'numberLimit', value: value})
                                    }} disabled={this.state.disbaled}/>
                            </Form.Item>
                            <Form.Item label='当天达人可做条数'>
                                <InputNumber defaultValue={bountyTask.todayNumberLimit} value={bountyTask.todayNumberLimit} onChange={(value) => {
                                    this.bountyTask({value: value, name: 'todayNumberLimit'})
                                }} disabled={this.state.disbaled}/>
                            </Form.Item>

                            <Form.Item label='标题'>
                                <Input value={bountyTask.title} onChange={(value) => {
                                    this.bountyTask({name: 'title', value: value})
                                }} disabled={this.state.disbaled} placeholder="请输入标题"/>
                            </Form.Item>

                            <Form.Item label='任务数量'>
                                <InputNumber value={bountyTask.number} disabled={this.state.disbaled} placeholder="任务数量"
                                             onChange={(value) => {
                                                 this.bountyTask({nameL: 'number', value: value})
                                             }}/>
                            </Form.Item>

                            <Form.Item label='任务价格'>
                                <InputNumber value={(currentLogin && currentLogin.loginManage.grade == 0 || (permissions ? permissions.indexOf('查看赏金金额') > -1 : false)) ? bountyTask.price : '**'}
                                             onChange={(value) => {
                                                 this.bountyTask({value: value, name: 'price'})
                                             }} disabled={bountyTask.id ? true : this.state.disbaled} placeholder="任务价格"/>
                            </Form.Item>

                            <Form.Item label='详情'>
                                <EditBox readOnly={this.state.disbaled} imgDisabled={true} ref="editBox"
                                         content={bountyTask.details} data-name="details"/>
                            </Form.Item>

                            <Form.Item label='开始时间'>
                                <DatePicker value={startDate} placeholder="开始时间"
                                            disabledDate={() => {
                                                return this.state.disbaled
                                            }}
                                            onChange={(value) => {
                                                let bountyTask = this.state.bountyTask;
                                                bountyTask.startDate = value;
                                                this.setState({bountyTask: bountyTask});
                                            }}/>
                            </Form.Item>

                            <Form.Item label='结束时间'>
                                <DatePicker value={endDate} placeholder="结束时间"
                                            disabledDate={() => {
                                                return this.state.disbaled
                                            }}
                                            onChange={(value) => {
                                                let bountyTask = this.state.bountyTask;
                                                bountyTask.endDate = value;
                                                this.setState({bountyTask: bountyTask});
                                            }}/>
                            </Form.Item>

                            <Form.Item label='行业分类'>
                                {typeTab1.map((item, i) => {
                                    return (
                                        <Layout.Col sm={4} key={item}>
                                            <Radio name="typeTab" data-name="typeTab"
                                                   checked={bountyTask.typeTab == item ? 'checked' : ''} value={item}
                                                   disabled={this.state.disbaled} onChange={this.bountyTask}
                                                   inline>{item}</Radio>
                                        </Layout.Col>
                                    )
                                })}
                            </Form.Item>
                            <Form.Item label=' '>
                                {typeTab5.map((item, i) => {
                                    return (
                                        <Layout.Col sm={4} key={item}>
                                            <Radio name="typeTab" data-name="typeTab"
                                                   checked={bountyTask.typeTab == item ? 'checked' : ''} value={item}
                                                   disabled={this.state.disbaled} onChange={this.bountyTask}
                                                   inline>{item}</Radio>
                                        </Layout.Col>
                                    )
                                })}
                            </Form.Item>
                            <Form.Item label='日志'>
                                {bountyTask.log && bountyTask.log.split('\n\r').map((item, i) => {
                                    return (<div key={i}>{item}</div>)
                                })}
                            </Form.Item>
                        </Form>
                    </Dialog.Body>
                    <Dialog.Footer className="dialog-footer">
                        {!this.state.disbaled && <Button type='primary' onClick={this.addAndUpBountyTask}>{bountyTask.id == 0 ? '新增' : '修改'}</Button>}
                        <Button type='danger' onClick={this.closeModal}>关闭</Button>
                    </Dialog.Footer>
                </Dialog>
                    <BountyTaskChannel ref={e => this.bountyTaskChannel = e} setPaState={this.setThisState} disbaled={this.state.disbaled} state={this.state}/>{/*渠道模态*/}
                    <BountyTaskNickModal ref={s => this.bountyTaskNickModal = s} setPaState={this.setThisState} state={this.state}/>{/*商家店铺模态*/}
                </AJAX>
            </div>
        );
    }
}

export default AddBountyTaskModal;

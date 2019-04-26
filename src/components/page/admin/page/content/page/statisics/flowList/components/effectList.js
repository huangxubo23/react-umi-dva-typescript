/**
 * Created by shiying on 18-9-15.
 */

import $ from 'jquery';
import React from 'react';

require("../../../../../../../../lib/util/jquery-ui.min");
import {getTypeName} from "../../../../../../../../lib/util/global";
import {PersonSelection, NewPersonSelection} from "../../../../../../components/PersonSelection";
import {Pagination, Loading, Layout, Radio, DatePicker, Input, Button, Select, Table} from 'element-react';
import AJAX from '../../../../../../../../lib/newUtil/AJAX.js';
import 'element-theme-default';

var QRCode = require('qrcode.react');

class EffectList extends React.Component {
    constructor(props) {
        super(props);
        let date = new Date();
        date.setDate(date.getDate() - 2);
        this.state = {
            date: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate()),
            manageId: 0,
            pageNow: 1,
            pageSize: 20,
            count: 0,
            effectAnalyse: [],
            list: '奖励排序',
            talentTitle: 0,
            channeId: 0,
            title: '',
            bonusTypes: [],
            bonusType: undefined,
            columns: [
                {
                    label: "编号",
                    prop: "number",
                    minWidth: "40px",
                }, {
                    label: "统计日期",
                    prop: "date",
                    minWidth: "90px",
                }, {
                    label: "图片",
                    prop: "feedPicUrl",
                    minWidth: "180px",
                    render: (data) => {
                        if (data['feedPicUrl']) {
                            return <img src={data['feedPicUrl']} style={{maxWidth: "180px", maxHeight: "150px"}}/>
                        }
                    }
                }, {
                    label: '标题',
                    prop: 'creator',
                    minWidth: "110px",
                    render: (data) => {
                        return (
                            <div>
                                <a href="javascript:void(0)" onClick={() => {
                                    //ipcRenderer.send("addTab", `https://market.m.taobao.com/apps/market/content/index.html?contentId=${data.feedId}`);
                                    this.getProp(data.feedId);
                                }}>{data.feedTitle}</a>
                            </div>
                        )
                    }
                }, {
                    label: "添加时间",
                    prop: "addTime",
                    minWidth: "90px",
                }, {
                    label: '流量',
                    prop: 'pv',
                    minWidth: "60px",
                }, {
                    label: "动态奖励",
                    prop: "publicFee",
                    minWidth: "60px",
                    render: (data) => {
                        let fee = (str = '') => {
                            return str.indexOf('.') == 0 ? `0${str}` : str;
                        };
                        return fee(data.publicFee);
                    }
                }, {
                    label: '渠道',
                    prop: 'channeNames',
                    minWidth: "60px",
                }, {
                    label: "分享者",
                    prop: "sharer",
                    minWidth: "80px",
                    render: (data) => {
                        let m = PersonSelection.getManage(data['sharer'], () => {
                            this.forceUpdate();
                        });
                        return <div>{m && m.name}</div>
                    }
                }, {
                    label: "类型",
                    prop: "bonusType",
                    minWidth: "50px"
                }, {
                    label: "达人号",
                    prop: "userId",
                    minWidth: "80px",
                    render: (data) => {
                        let {talent = []} = this.props;
                        return talent.map(item => {
                            if (item.accountId == data.userId) {
                                return (
                                    <div key={item.accountId}>{item.title}</div>
                                );
                            }
                        })
                    }
                }, {
                    label: '二维码',
                    prop: 'creator',
                    minWidth: "110px",
                    render: (data) => {
                        return <QRCode
                            value={"https://market.m.taobao.com/apps/market/content/index.html?wh_weex=true&contentId=" + data.feedId}/>
                    }
                }, {
                    label: '操作',
                    prop: 'feedId',
                    minWidth: "60px",
                    render: (data) => <Button plain={true} type="info" onClick={() => this.clickMovements(data.feedId)}
                                              size="mini">走势图</Button>
                }
            ]
        }
    }

    getProp = (feedId) => {
        this.effectListSeeAJAX.ajax({
            url: `/content/admin/post/domain.content.find.io`,
            data: {feedId},
            callback: (data) => {
                this.effectListSeeAJAX.ajax({
                    url: "/content/decrypt.io",
                    data: {"id": data.id, "encryptTime": ''},
                    callback: (encrypt) => {
                        if (encrypt.type == 'encryptTime') {
                            this.effectListSeeAJAX.ajax({
                                url: "/content/decrypt.io",
                                data: {"id": data.id, "encryptTime": encrypt.encryptTime},
                                callback: (item) => {
                                    this.props.newSeeContent({
                                        contentMode: item.data.contentMode.constraint,
                                        showContent: data
                                    })
                                }
                            });
                        }
                    }
                });
            }
        })
    };

    componentDidMount() {
        this.queryBonusType(this.getList);
        this.props.channelChange(this.state.date);
    }

    getList = (pageNow = 1) => {
        let {list, bonusType, date, manageId, talentTitle, channeId, title} = this.state;
        this.effectListAJAX.ajax({
            url: "/message/admin/effectAnalyse/domain.effectAnalyse.list.new.io",
            data: {
                bonusType: bonusType,
                date: date,
                manageId: manageId,
                pageNow: pageNow,
                userId: talentTitle,
                channeId: channeId,
                title: title,
                pUv: list === '奖励排序' ? 1 : 0,
            },
            callback: (data) => {
                let {effectAnalyse} = data;
                for (let i = 0; i < effectAnalyse.length; i++) {
                    effectAnalyse[i].number = i + 1;
                }
                data.effectAnalyse = effectAnalyse;
                this.setState(data);
            }
        })
    };

    queryBonusType = (callback) => {
        this.effectListAJAX.ajax({
            url: "/message/admin/effectAnalyse/queryBonusType.io",
            data: {
                date: this.state.date,
            },
            callback: (data) => {
                this.setState({bonusTypes: data}, callback)
            }
        })
    }


    componentDidUpdate() {
    }

    selectType = (bonusType) => {
        this.setState({bonusType}, this.getList);
    };

    selectTalent = (talentTitle) => {
        this.setState({talentTitle}, this.getList);
    };

    selectChannel = (channeId) => {
        this.setState({channeId}, this.getList);
    };

    clickMovements = (feedId) => {//转走势图
        this.props.toMovements(feedId);
    };

    titleChange = (title) => {//标题搜索改变
        this.setState({title});
    };

    cleanSeek = () => {//标题搜索值清空
        this.setState({title: ''});
    };

    patternChange = (value) => {//排序选择
        this.setState({list: value}, this.getList)
    };

    bz_time = (date, F, str = '') => {//时间转换器
        if (F) {
            let strs = date.split('-');
            str = new Date(strs[0], strs[1] - 1, strs[2]);
        } else {
            str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        }
        return str;
    };

    dateRangePickerChange = ({newDate}) => {//时间改变步骤简写
        this.setState({date: newDate}, () => {
            this.queryBonusType(this.getList);
            this.props.channelChange(newDate);
        })
    };

    render() {

        let {list, date, title, channelId, bonusTypes, bonusType, talentTitle, effectAnalyse, columns, count, pageSize, pageNow} = this.state;
        let {channel = [], talent = []} = this.props;
        let timeValue = this.bz_time(date, true);
        return (
            <div>
                <Layout.Row gutter="10" style={{margin: "8px 0"}}>
                    <Layout.Col span="6">
                        <Radio.Group value={list} onChange={this.patternChange}>
                            <Radio.Button value="奖励排序"/>
                            <Radio.Button value="流量排序"/>
                        </Radio.Group>
                    </Layout.Col>
                    <Layout.Col span="6">
                        日期:{' '}
                        <DatePicker
                            value={timeValue}
                            align="right"
                            placeholder="选择日期"
                            onChange={date => {
                                let newDate = this.bz_time(date);
                                this.dateRangePickerChange({newDate});
                            }}
                        />
                    </Layout.Col>
                    <Layout.Col span="12">
                        <Input placeholder="请输入关键字搜索内容" value={title} onChange={this.titleChange} prepend={
                            <Button type="primary" onClick={this.cleanSeek}>清空</Button>
                        } append={<Button type="primary" icon="search" onClick={() => this.getList()}>搜索</Button>}/>
                    </Layout.Col>
                </Layout.Row>
                <Layout.Row gutter="10" style={{margin: "8px 0 20px"}}>
                    <Layout.Col span="6">
                        渠道:{' '}
                        <Select value={channelId} onChange={this.selectChannel}>
                            <Select.Option label='全部' value='0'/>
                            {channel.map(item => {
                                return (
                                    <Select.Option label={item.channelName} value={item.id} key={item.id}/>
                                )
                            })}
                        </Select>
                    </Layout.Col>
                    <Layout.Col span="6">
                        人员:{' '}
                        <NewPersonSelection callback={(manageId) => this.setState({manageId}, this.getList)} type={1}
                                            classNum={1}/>
                    </Layout.Col>
                    <Layout.Col span="6">
                        类型:{' '}
                        <Select value={bonusType} onChange={this.selectType}>
                            <Select.Option label={"全部"} value={undefined} key={"全部"}/>
                            {bonusTypes.map(item => {
                                return (
                                    <Select.Option label={item} value={item} key={item}/>
                                )
                            })}
                        </Select>
                    </Layout.Col>
                    <Layout.Col span="6">
                        达人号:{' '}
                        <Select value={talentTitle} onChange={this.selectTalent}>
                            <Select.Option label='全部' value='0'/>
                            {talent.map(item => {
                                return (
                                    <Select.Option label={item.title} value={item.accountId} key={item.accountId}/>
                                )
                            })}
                        </Select>
                    </Layout.Col>
                </Layout.Row>
                <AJAX ref={e => this.effectListAJAX = e}>
                    <div>
                        <Table style={{width: '100%'}} columns={columns} data={effectAnalyse} border={true}/>
                    </div>
                </AJAX>
                <AJAX ref={e => this.effectListSeeAJAX = e}>
                </AJAX>
                <div style={{margin: '16px 0 10px'}}>
                    <Pagination layout="total, prev, pager, next, jumper" total={count} pageSize={pageSize}
                                currentPage={pageNow} onCurrentChange={this.getList}/>
                </div>
            </div>
        )
    }
}

export default EffectList;
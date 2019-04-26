/**
 * Created by shiying on 18-9-15.
 */

import $ from 'jquery';
import React from 'react';

require("../../../../../../../../lib/util/jquery-ui.min");
import {NewPersonSelection} from '../../../../../../components/PersonSelection';
import '../../../../../../../../lib/util/jquery.qrcode.min'
import {getTypeName} from "../../../../../../../../lib/util/global";
import AJAX from '../../../../../../../../lib/newUtil/AJAX.js';
import {Pagination, Loading, Layout, DatePicker, Input, Button, Select, Table} from 'element-react';
import 'element-theme-default';

var QRCode = require('qrcode.react');

class Shortlisted extends React.Component {
    constructor(props) {
        super(props);
        let date = new Date();
        date.setDate(date.getDate() - 1);
        this.state = {
            date: date.getFullYear() + "-" + (date.getMonth() + 1),
            manageId: 0,
            pageNow: 1,
            pageSize: 20,
            count: 0,
            title: '',
            effectAnalyse: [],
            mixUv: 1000,
            stateAddDate: "1997-01-01",
            endAddDate: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate() + 1),
            talentTitle: 0,
            channeId: 0,
            type: 0,
            bonusType: undefined,
            bonusTypes: [],
            columns: [
                {
                    label: "编号",
                    prop: "number",
                    minWidth: "40px",
                }, {
                    label: "统计日期",
                    prop: "date",
                    minWidth: "80px",
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
                    label: '奖励天数',
                    prop: 'uv',
                    minWidth: "60px",
                    render: (data) => {
                        return (
                            <div
                                style={{color: (data.c >= 7 ? data.c >= 15 ? "purple" : "red" : "green")}}>{data.c}</div>
                        )
                    },
                }, {
                    label: "累计奖励",
                    prop: "sumFee",
                    minWidth: "60px",
                    render: (data) => {
                        let fee = (str = '') => {
                            return str.indexOf('.') == 0 ? `0${str}` : str;
                        };
                        return fee(data.sumFee);
                    }
                }, {
                    label: '渠道',
                    prop: 'channeNames',
                    minWidth: "60px",
                }, {
                    label: "分享者",
                    prop: "manage",
                    minWidth: "80px",
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
        this.shortListSeeAJAX.ajax({
            url: `/content/admin/post/domain.content.find.io`,
            data: {feedId},
            callback: (data) => {
                this.shortListSeeAJAX.ajax({
                    url: "/content/decrypt.io",
                    data: {"id": data.id, "encryptTime": ''},
                    callback: (encrypt) => {
                        if (encrypt.type == 'encryptTime') {
                            this.shortListSeeAJAX.ajax({
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
        this.queryBonusType(this.getData);
        this.props.channelChange(this.state.date);
    }

    jump = ({manageId, name}) => {
        this.newPersonSelection.setState({value: name});
        this.setState({manageId}, this.getData)
    };

    selectTalent = (talentTitle) => {
        this.setState({talentTitle}, this.getData);
    };
    selectChannel = (channeId) => {
        this.setState({channeId}, this.queryBonusType(this.getData));
    };
    selectType = (bonusType) => {
        this.setState({bonusType}, this.getData);
    };
    getData = (pageNow = 1) => {
        let {date, manageId, stateAddDate, endAddDate, mixUv, talentTitle, channeId, title, type, bonusType} = this.state;
        this.shortListAJAX.ajax({
            url: "/message/admin/effectAnalyse/domain.effectAnalyse.list.by.shortlisted.new.io",
            data: {
                date,
                manageId,
                pageNow,
                stateAddDate,
                endAddDate,
                mixUv,
                userId: talentTitle,
                channeId,
                title,
                type,
                bonusType
            },
            callback: (data) => {
                let {effectAnalyse} = data;
                for (let i = 0; i < effectAnalyse.length; i++) {
                    effectAnalyse[i].number = i + 1;
                }
                data.effectAnalyse = effectAnalyse;
                setTimeout(() => {
                    this.setState(data)
                }, 100);
            }
        })
    };

    componentDidUpdate() {
    }

    queryBonusType = (callback) => {
        this.shortListAJAX.ajax({
            url: "/message/admin/effectAnalyse/queryBonusType.io",
            data: {
                date: this.state.date,
            },
            callback: (data) => {
                this.setState({bonusTypes: data}, callback)
            }
        })
    }


    clickMovements = (feedId) => {
        this.props.toMovements(feedId);
    };

    titleChange = (title) => {
        this.setState({title});
    };

    cleanSeek = () => {
        this.setState({title: ''});
    };

    bz_time = (date, F, str = '') => {//时间转换器
        if (F) {
            let strs = date.split('-');
            str = new Date(strs[0], strs[1] - 1);
        } else {
            str = date.getFullYear() + "-" + (date.getMonth() + 1);
        }
        return str;
    };

    render() {

        let {date, title, channelId, bonusType, bonusTypes, talentTitle, effectAnalyse = [], columns, count, pageSize, pageNow} = this.state;
        let {talent = [], channel = []} = this.props;
        let timeValue = this.bz_time(date, true);
        return (
            <div>
                <Layout.Row gutter="10" style={{margin: "8px 0"}}>
                    <Layout.Col span="7">
                        月份:{' '}
                        <DatePicker
                            value={timeValue}
                            placeholder="选择月"
                            onChange={date => {
                                let newDate = this.bz_time(date);
                                this.setState({date: newDate},()=>{
                                    this.getData();
                                    this.props.channelChange(newDate);
                                })
                            }}
                            selectionMode="month"
                        />
                    </Layout.Col>
                    <Layout.Col span="9">
                        <Input placeholder="请输入关键字搜索内容" value={title} onChange={this.titleChange} prepend={
                            <Button type="primary" onClick={this.cleanSeek}>清空</Button>
                        } append={<Button type="primary" icon="search" onClick={() => this.getData()}>搜索</Button>}/>
                    </Layout.Col>
                    <Layout.Col span="8">
                        分享者:{' '}
                        <NewPersonSelection ref={e => this.newPersonSelection = e}
                                            callback={(manageId) => this.setState({manageId}, this.getData)} type={1}
                                            classNum={1}/>
                    </Layout.Col>
                </Layout.Row>
                <Layout.Row gutter="10" style={{margin: "8px 0 20px"}}>
                    <Layout.Col span="8">
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
                    <Layout.Col span="8">
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
                    <Layout.Col span="8">
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
                <AJAX ref={e => this.shortListAJAX = e}>
                    <div>
                        <Table style={{width: '100%'}} columns={columns} data={effectAnalyse} border={true}/>
                    </div>
                </AJAX>
                <AJAX ref={e => this.shortListSeeAJAX = e}>
                </AJAX>
                <div style={{margin: '16px 0 10px'}}>
                    <Pagination layout="total, prev, pager, next, jumper" total={count}
                                pageSize={pageSize} currentPage={pageNow} onCurrentChange={this.getData}/>
                </div>
            </div>
        )
    }
}

export default Shortlisted;
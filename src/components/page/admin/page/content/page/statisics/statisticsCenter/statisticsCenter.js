import testDialog from "../../../../test/TestDialog";

/**
 * Created by linhui on 17-10-23.唯一负责人军机处
 */
require("../../../../../../../../styles/content/statisticsCenter.css");
import React from 'react';
import AJAX from '../../../../../../../lib/newUtil/AJAX';
import Capture from 'bundle-loader?lazy&name=pc/trends_asset/admin/content/app-[name]!./page/Capture/Capture';
import AllBonusChart from 'bundle-loader?lazy&name=pc/trends_asset/admin/content/app-[name]!./page/allBonusChart/allBonusChart';
import {Tabs, Layout, Button, DatePicker, Input, Pagination, Alert} from 'element-react';
import 'element-theme-default';
import StatisticsCenterTalent from '../../../../../components/statistics/statisticsCenterTalent';
import {BundleLoading, DialogBundle} from '../../../../../../../../bundle';

class StatisticsCenter extends React.Component {
    constructor(props) {
        super(props);
        let date = new Date();
        date.setDate(date.getDate() - 2);

        this.state = {
            count: 0,
            pageNow: 1,
            pageSize: 6,
            talentTitle: '',//达人名
            startDate: date,//日期
            talent: [],//达人数据id:'',headPortrait:'',//头像    effectChanne:'',//奖金流量数据
            tabKey: 1,//选项卡当前值
        }
    }

    componentDidMount() {
        let tabKey = this.state.tabKey;
        if (tabKey == 1) {
            // let jd = this.allBonusChart;
            // if(jd){
            // jd.getSumInPondNum();
            // }
        } else if (tabKey == 2) {
            this.goPage(1);
        }
        this.goPage(1);
    }

    talentTitleChange = (env) => {//改变达人名
        let value = env.value;
        this.setState({talentTitle: value});
    };
    goPage = (pageNow) => {/*点击分页*/
        // d=d?d: zujian.state;
        pageNow = pageNow ? pageNow : this.state.pageNow;
        this.statisticsCenter({
            pageNow: pageNow,
            pageSize: this.state.pageSize,
            talentTitle: this.state.talentTitle,
        });
    };

    statisticsCenter = (data) => {//查询列表数据
        let zujian = this;
        let talents = '';
        let i = 0;
        this.statisticsCenterAjax.ajax({
            type: 'post',
            url: '/user/admin/topManage/getTalentMessageByOrgIdPage.io',//查询达人
            isCloseMask: true,
            data: data,
            callback: (talentData) => {
                talents = talentData.talent;
                this.setState(talentData, () => {
                    this.getStatisticsCenter(talents, i);
                });

            }
        });
    };
    getStatisticsCenter = (talents, i, refresh) => {//查询总奖金总流量数据
        let talent = talents[i];
        let startDate = this.state.startDate.getFullYear() + "-" + (this.state.startDate.getMonth() + 1) + "-" + (this.state.startDate.getDate());
        if (talents.length > i) {
            this.statisticsCenterAjax.ajax({
                type: 'post',
                url: '/message/admin/topManage/statisticsCenter.io',
                data: {startDate: startDate, talentIds: talent.accountId},
                isCloseMask: true,
                callback: (data) => {
                    this.statisticsCenterAjax.ajax({
                        type: 'post',
                        url: '/message/admin/topManage/getTheFirstTen.io',//查询流量
                        isCloseMask: true,
                        data: {startDate: startDate, talentIds: talent.accountId},
                        callback: (maxUv) => {
                            talent.effectChanne = data;//渠道
                            talent.maxUv = maxUv;//流量
                            talents[i] = talent;
                            this.setState({talent: talents}, () => {
                                if (!refresh) {
                                    i++;
                                    this.getStatisticsCenter(talents, i);
                                }
                            });
                        },
                    });
                },
                error: () => {
                    if (!refresh) {
                        i++;
                        this.getStatisticsCenter(talents, i);
                    }
                }
            });
        }
    };
    openCapture = () => {//打开奖励设置
        this.capture.open('', () => {
            this.capture.getBun((gb) => {
                gb.set();
            })
        });

    };
    tabsSelect = (env) => {//选项卡事件
        this.setState({tabKey: env});
    };

    render() {
        let {tabKey, startDate, talentTitle, talent, pageNow, pageSize, count} = this.state;
        return (
            <div>
                <AJAX ref={e => this.statisticsCenterAjax = e}>
                    {window.currentLogin && window.currentLogin.loginManage && window.currentLogin.loginManage.isOwnerManage ?
                        <div>
                            <Tabs type="card" value={1} id="uncontrolled-tab-example">
                                <Tabs.Pane name={1} label="总预览">
                                    {tabKey == 1 &&
                                    <BundleLoading load={AllBonusChart} ref={e => this.allBonusChart = e}
                                                   startDate={startDate}/>}{/*奖金数饼状图*/}
                                </Tabs.Pane>
                                <Tabs.Pane name={2} label="所有达人">
                                    <DialogBundle ref={e => this.capture = e} bundleProps={{load: Capture}} dialogProps={{title: "奖励设置", size: "small", lockScroll: false}} dialogFooter={<div>
                                        <Button style={{marginLeft: "440px"}} type="primary" onClick={()=>{this.capture.getBun((gb)=>{gb.submit()})}}>确定</Button>
                                        <Button type="error" style={{marginLeft: "10px"}} onClick={() => {
                                            this.capture.setState({dialogVisible: false});
                                        }}>取消</Button>
                                    </div>}/>{/*奖励设置模态*/}
                                    <Layout.Row style={{marginBottom: '20px'}}>
                                        <Layout.Col sm={8}>
                                            <Button type="info" onClick={this.openCapture}>奖励设置</Button>
                                        </Layout.Col>

                                        <Layout.Col sm={8}>
                                            <DatePicker value={startDate} placeholder="请选择要查询的日期" onChange={date => {
                                                this.setState({startDate: date}, () => {
                                                    this.goPage(1);
                                                })
                                            }}/>
                                        </Layout.Col>

                                        <Layout.Col sm={8}>
                                            <Input placeholder="请输入要查询的达人" value={talentTitle} onChange={(value) => {
                                                this.talentTitleChange({value: value})
                                            }}
                                                   onKeyDown={(event) => {
                                                       if (event.keyCode == "13") {
                                                           this.goPage(1)
                                                       }
                                                   }}
                                                   append={<Button type="primary" onClick={() => {
                                                       this.goPage(1)
                                                   }} icon="search">搜索</Button>}/>
                                        </Layout.Col>
                                    </Layout.Row>

                                    <StatisticsCenterTalent talent={talent} url="admin/topManage" goPage={this.goPage} getStatisticsCenter={this.getStatisticsCenter}/>
                                    <Pagination onSizeChange={(pageSize) => {
                                        this.setState({pageSize: pageSize}, () => {
                                            this.goPage(1)
                                        })
                                    }} onCurrentChange={this.goPage} layout="total, sizes, prev, pager, next, jumper" total={count} pageSizes={[16, 20, 30, 40]} pageSize={pageSize} currentPage={pageNow}/>

                                </Tabs.Pane>
                            </Tabs>

                        </div> : <Alert type="warning" title={'警告:您不是唯一负责人，不可使用军机处功能！'}/>}
                </AJAX>
            </div>
        )
    }
}

export default StatisticsCenter;
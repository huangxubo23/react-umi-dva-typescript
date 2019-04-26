/**
 * Created by linhui on 17-10-30.老板军机处
 */
require("../../../../../styles/superManage/statisticsCenter.css");
import ReactChild from "../../../../lib/util/ReactChild";
import React from 'react';
import AJAX from '../../../../lib/newUtil/AJAX';
import {DatePicker, Pagination, Form, Button, Input} from 'element-react';
import 'element-theme-default';
import StatisticsCenterTalent from '../../components/statistics/statisticsCenterTalent';

class StatisticsAllTalent extends ReactChild {
    constructor(props) {
        super(props);
        let date = new Date();
        date.setDate(date.getDate() - 2);

        this.state = {
            count: 0,
            pageNow: 1,
            pageSize: 6,
            startDate: date,//日期
            talentTitle: '',//达人名
            talent: [],//达人数据id:'',headPortrait:'',//头像    effectChanne:'',//奖金流量数据
            //  isLogin:false,//是否当前登录人
        }
    }

    componentDidMount() {
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
        let talents = '';
        let i = 0;
        this.statisticsAllTalentAjax.ajax({
            type: 'post',
            url: '/user/admin/military/adminNoOneGetTalent.io',//查询达人
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
        let date = this.state.startDate;
        let startDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate());
        if (talents.length > i) {
            //if (!talent.effectChanne || !talent.maxUv) {
            this.statisticsAllTalentAjax.ajax({
                type: 'post',
                url: '/message/admin/military/statisticsCenter.io',
                data: {startDate: startDate, talentIds: talent.accountId},
                isCloseMask: true,
                callback: (data) => {
                    this.statisticsAllTalentAjax.ajax({
                        type: 'post',
                        url: '/message/admin/military/getTheFirstTen.io',//查询流量
                        isCloseMask: true,
                        data: {startDate: startDate, talentIds: talent.accountId},
                        callback: (maxUv) => {
                            talent.maxUv = maxUv;//流量
                        }, complete: () => {
                            talent.effectChanne = data;//渠道
                            talents[i] = talent;
                            this.setState({talent: talents}, () => {
                                if (!refresh) {
                                    i++;
                                    this.getStatisticsCenter(talents, i);
                                }
                            });
                        }
                    });
                }, error: () => {
                    if (!refresh) {
                        i++;
                        this.getStatisticsCenter(talents, i);
                    }
                }
            });
            // }
        }
    };

    render() {
        let {startDate, talentTitle, c, talent, pageNow, pageSize, count} = this.state;
        return (
            <AJAX ref={e => this.statisticsAllTalentAjax = e}>
                {/*{this.state.isLogin?*/}
                <div>
                    <Form>
                        <Form.Item label="日期选择">
                            <DatePicker value={startDate} placeholder="请选择要查询的日期" onChange={date => {
                                this.setState({startDate: date}, () => {
                                    this.goPage(1)
                                })
                            }}/>
                        </Form.Item>

                        <Form.Item>
                            <Input value={talentTitle} placeholder="请输入达人名称" onChange={(value) => {
                                this.talentTitleChange({value: value})
                            }} onKeyDown={(event) => {
                                if (event.keyCode == "13") {
                                    this.goPage(1)
                                }
                            }}
                                   append={<Button type="primary" icon="search" onClick={() => {
                                       this.goPage(1)
                                   }}>搜索</Button>}/>
                        </Form.Item>
                    </Form>
                    <StatisticsCenterTalent talent={talent} url='admin/military'
                                            getStatisticsCenter={this.getStatisticsCenter}/>
                    <Pagination onCurrentChange={this.goPage} onSizeChange={(pageSize) => {
                        this.setState({pageSize: pageSize}, () => {
                            this.goPage(1)
                        })
                    }}
                                layout="total, sizes, prev, pager, next, jumper" total={count}
                                pageSizes={[16, 20, 30, 40]} pageSize={pageSize} currentPage={pageNow}/>
                </div>
                {/*:  <Alert bsStyle="warning">
                    <strong>警告</strong>您不是顶级管理员，不可使用网站设置军机处功能！
                </Alert>}*/}
            </AJAX>
        )
    }
}

export default StatisticsAllTalent;
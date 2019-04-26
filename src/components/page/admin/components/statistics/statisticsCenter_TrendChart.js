/**
 * Created by linhui on 17-10-25. 统计中心好货入库走势图与流量走势图
 */
import AJAX from "../../../../lib/newUtil/AJAX";

require("../../../../lib/util/jquery-ui.min");
import React from 'react';
import $ from 'jquery';
import echarts from 'echarts';
import {Layout, Dialog, DateRangePicker, Input, Pagination, Alert, Button, Select} from 'element-react';
import 'element-theme-default';

class TrendChart extends React.Component {
    constructor(props) {
        super(props);
        let [startDate, endDate] = [new Date(), new Date()];
        endDate.setDate(endDate.getDate() - 2);
        startDate.setDate(startDate.getDate() - 7);
        this.state = {
            trendChartSwitch: false,
            startDate: startDate,
            endDate: endDate,
            data: '',
            chartData: '',//父组件传进来的数据
            channeId: undefined,

        }
    }

    componentDidMount() {

    }

    getDateTime = () => {//打开模态之后初始化时间插件
        this.setState({width: $("#effectaAnalyseTab").width()});
    };
    uplineChart = () => {
        let effectAnalyse = this.state.data[0].effectAnalyse;
        let title = this.state.chartData.title;
        let series = [];
        let chartType = this.state.chartData.type;
        let yAxis = [];
        let legendData = [];
        let dataName = [];//名字
        if (effectAnalyse.length > 0) {
            if (chartType == 0) {
                foreffectAnalyse('uv', 'uv', 'left', 0, 'uv', () => {
                    foreffectAnalyse('c', '当天渠道条数', 'right', 1, '当天渠道条数',);
                });
            } else if (chartType == 1) {
                foreffectAnalyse('commissionFee', '动态奖金', 'left', 0, '奖金', () => {
                    foreffectAnalyse('commissionFeec', '动态奖金当天渠道条数', 'right', 1, '当天渠道条数', () => {
                        foreffectAnalyse('fixedIncome', '固定奖励', 'left', 0, '', () => {
                            foreffectAnalyse('fixedIncomec', '固定奖励当天渠道条数', 'right', 1, '');
                        })
                    })
                })
            } else if (chartType == 2) {
                foreffectAnalyse('shu', '好货量', 'left', 0, '好货量');
            }
        }

        function foreffectAnalyse(string, name, position, yAxisIndex, axis, callback) {
            let da = [];
            let seriesobj = {type: 'line', smooth: true, yAxisIndex: yAxisIndex};
            let date = [];
            let yAxisobj = {type: 'value', name: axis, position: position,};
            let legendDataobj = {name: name, icon: 'circle',};
            for (let i = 0; i < effectAnalyse.length; i++) {
                da.push(effectAnalyse[i][string]);
                date.push(effectAnalyse[i].date);
            }
            seriesobj.data = da;
            seriesobj.name = name;
            legendData.push(legendDataobj);
            dataName.push(name);
            if (axis) {
                yAxis.push(yAxisobj);
            }
            series.push(seriesobj);
            if (callback && typeof callback == 'function') {
                callback();
            } else {
                let lineChart = echarts.init(document.getElementById('movementsChart'));
                let option = {
                    title: {
                        text: title
                    },
                    tooltip: {trigger: 'axis'},
                    legend: {
                        data: legendData,
                    },
                    xAxis: {
                        data: date,//['周一','周二','周三','周四','周五','周六','周日']
                    },
                    yAxis: yAxis,
                    series: series,
                };
                if (lineChart) {
                    lineChart.clear();
                    lineChart.setOption(option);
                }
            }
        }
    };
    clickQuery = () => {
        this.queryDate();
    };
    effectChanneChange = (env) => {
        let channeId = env.target.value;
        this.setState({channeId: channeId}, () => {
            this.queryDate();
        });
    };
    queryDate = () => {
        let channeId = this.state.channeId;
        let data = '';
        let startDate = this.state.startDate.getFullYear() + "-" + (this.state.startDate.getMonth() + 1) + "-" + (this.state.startDate.getDate());
        let endDate = this.state.endDate.getFullYear() + "-" + (this.state.endDate.getMonth() + 1) + "-" + (this.state.endDate.getDate());
        if (channeId) {
            data = {startDate: startDate, endDate: endDate, talentIds: this.state.chartData.talentIds, channeId: channeId};
        } else {
            data = {startDate: startDate, endDate: endDate, talentIds: this.state.chartData.talentIds};
        }
        this.trendChartAjax.ajax({
            url: this.state.chartData.url,//要访问的后台地址
            data: data,
            callback: (data) => {
                console.log('data',data);
                this.setState({data: data}, () => {
                    this.uplineChart();
                });
            }
        });
    };

    queryBonusTypeGroup=(callback)=>{//获取奖励类型
        let startDate = this.state.startDate.getFullYear() + "-" + (this.state.startDate.getMonth() + 1) + "-" + (this.state.startDate.getDate());
        let endDate = this.state.endDate.getFullYear() + "-" + (this.state.endDate.getMonth() + 1) + "-" + (this.state.endDate.getDate());
        //let userId = this.props.talentIds;
        let userId = this.state.chartData.talentIds;
        this.trendChartAjax.ajax({
            type:'post',
            url:'/message/'+this.state.chartData.urlType+'/queryBonusTypeGroup.io',
            data:{startDate:startDate,endDate:endDate,userId:userId},
            callback:(json)=>{
                this.setState({bonusTypeList:json},callback);
            }
        });
    };

    changeFeedIds = (env) => {
        let v = env.target.value;
        this.setState({"feedIds": v});
    };
    openTrendChart = (data) => {//打开走势图
        let chartData = data;
        this.setState({trendChartSwitch: true, chartData: chartData}, () => {
            this.queryBonusTypeGroup(()=>{
                this.clickQuery();
            });
        });
    };
    closeTrendChart = () => {//关闭走势图
        this.setState({trendChartSwitch: false});
    };

    dateRange = (date) => {//时间范围选择
        let startDate = date[0];
        let endDate = date[1];
        this.setState({startDate: startDate, endDate: endDate}, () => {
            this.queryDate();
        });
    };

    render() {
        let style = {height: 400, marginTop: '50px'};
        let {trendChartSwitch, startDate, endDate, chartData, channeId,bonusType} = this.state;
        let date = [startDate, endDate];
        let chartType = chartData.type;

        return (
            <div>
                <AJAX ref={e => this.trendChartAjax = e}>
                    <Dialog title={chartData.title} size="small" visible={trendChartSwitch} onCancel={this.closeTrendChart} lockScroll={false}>
                        <Dialog.Body>
                            <Layout.Row>
                                <Layout.Col sm={8}>
                                    <DateRangePicker value={date} placeholder="选择日期范围" onChange={(date) => {
                                        this.dateRange(date)
                                    }}/>
                                </Layout.Col>
                                <Layout.Col sm={8}>
                                    <Select value={channeId} placeholder="请选择渠道">
                                        <Select.Option value="">全部</Select.Option>
                                        {(chartData.effectChanne ? chartData.effectChanne : []).map((channe, x) => {
                                            if (channe.effectChanneName) {
                                                return (
                                                    <Select.Option key={channe.effectChanneName.id} label={channe.effectChanneName.channelName} value={channe.effectChanneName.id}/>

                                                )
                                            }
                                        })}
                                    </Select>
                                </Layout.Col>
                                <Layout.Col sm={8}>
                                    <Select value={bonusType} placeholder="请选择奖励类型">
                                        <Select.Option value="">全部</Select.Option>
                                        {(chartData.effectChanne ? chartData.effectChanne : []).map((channe, x) => {
                                            if (channe.effectChanneName) {
                                                return (
                                                    <Select.Option key={channe.effectChanneName.id} label={channe.effectChanneName.channelName} value={channe.effectChanneName.id}/>

                                                )
                                            }
                                        })}
                                    </Select>
                                </Layout.Col>
                            </Layout.Row>
                            <div id="movementsChart" style={style} className="Combined_bt"/>
                        </Dialog.Body>
                        <Dialog.Footer className="dialog-footer">
                            <Button onClick={this.closeTrendChart}>关闭</Button>
                        </Dialog.Footer>
                    </Dialog>
                </AJAX>
            </div>
        )
    }
}

export default TrendChart;

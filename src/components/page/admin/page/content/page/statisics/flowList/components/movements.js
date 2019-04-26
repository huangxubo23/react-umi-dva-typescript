

import $ from 'jquery';
import React from 'react';
import echarts from 'echarts';
require("../../../../../../../../../styles/addList/content.css");
import AJAX from '../../../../../../../../lib/newUtil/AJAX.js';
import {Pagination,Loading,Layout,DateRangePicker,Input,Button,Message} from 'element-react';
import 'element-theme-default';


class Movements extends React.Component {
    constructor(props) {
        super(props);
        let date = new Date();
        date.setDate(date.getDate() - 1);
        let endTime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate());
        date.setDate(date.getDate() - 7);
        let startTime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate());
        this.state = {
            startDate: startTime,
            endDate: endTime,
            feedIds: "",
            data: [],
            seriesData: [],
        }
    }

    componentDidMount() {
        this.setState({width: $(".movementsWidth").width()});
    }

    clickQuery = () => {
        let {feedIds}=this.state;
        if(feedIds){
            this.queryDate(feedIds);
        }else {
            Message({
                message: 'feedId为空',
                type: 'warning'
            });
        }
    };

    parentQueryDate=(feedId)=>{
        let feedIds=feedId+'';
        this.setState({feedIds},()=>this.queryDate(feedIds))
    };

    queryDate = (feedId) => {
        let {startDate,endDate,feedIds}=this.state;
        this.movementsAJAX.ajax({
            url: "/message/admin/effectAnalyse/domain.effectAnalyse.list.by.movements.new.io",//要访问的后台地址
            data: {
                startDate, endDate, feedIds: feedId ? feedId : feedIds
            },
            callback: (data) => {
                this.setState({data},this.upLineChart)
            }
        });
    };

    upLineChart = () => {
        let {data} = this.state;
        let legend = [];
        let xAxis = [];
        let seriesData = [];
        for (let i = 0; i < data.length; i++) {
            legend.push(data[i].feedTitle);
            let ser = {name: '流量', type: "line", smooth: true, yAxisIndex: 0};
            let serAs = {name: '奖励', type: "line", smooth: true, yAxisIndex: 1};
            let serDataAs = [];
            let serData = [];
            ser.data = serData;
            serAs.data = serDataAs;
            let effectAnalyse = data[i].effectAnalyse;
            for (let j = 0; j < effectAnalyse.length; j++) {
                if (i == 0) {
                    xAxis.push(effectAnalyse[j].date);
                }
                serData.push(effectAnalyse[j].uv);
                serDataAs.push(effectAnalyse[j].xx);
            }
            let series = [];
            series.push(ser);
            series.push(serAs);
            seriesData.push(series);
        }
        this.setState({seriesData}, () => {
            for (let i in seriesData) {
                let lineChart = echarts.init(document.getElementById('movementsChart' + i));
                let option = {
                    title: {
                        text: '流量奖励走势图                      标题:' + legend[i],
                    },
                    tooltip: {
                        trigger: 'axis',
                    },
                    legend: {
                        data: [
                            {
                                name: '流量',
                                icon: 'circle',
                                textStyle: {
                                    color: 'red'
                                }
                            },
                            {
                                name: '奖励',
                                icon: 'circle',
                                textStyle: {
                                    color: '#2e6da4'
                                }
                            },
                        ]
                    },
                    xAxis: {
                        data: xAxis,
                    },
                    yAxis: [
                        {
                            type: 'value',
                            name: '流量',
                            position: 'left',
                        },
                        {
                            type: 'value',
                            name: '奖励',
                            position: 'right',
                        }
                    ],
                    series: seriesData[i]
                };
                if (lineChart) {// 使用刚指定的配置项和数据显示图表。
                    lineChart.clear();
                    lineChart.setOption(option);
                }
            }
        });

    };
    changeFeedIds = (feedIds) => {
        this.setState({feedIds});
    };

    cleanSeek=()=>{
        this.setState({feedIds:''});
    };

    bz_time=(arr,F,arr1=[])=>{//时间转换器
        if(F){
            for(let a in arr){
                let str=arr[a].split('-');
                arr1.push(new Date(str[0], str[1] - 1, str[2]));
            }
            return arr1;
        }else {
            for(let a in arr){
                let str=arr[a].getFullYear()+ "-" +(arr[a].getMonth() + 1) + "-" + arr[a].getDate();
                arr1.push(str);
            }
            return arr1;
        }
    };

    render(){
        let style = {height: 400};
        let {width,startDate,endDate,feedIds,seriesData,data}=this.state;
        if (width) {
            style.width = width;
        }
        let timeValue=this.bz_time([startDate,endDate],true);
        return(
            <div>
                <Layout.Row gutter="10" style={{margin: "8px 0"}}>
                    <Layout.Col span="8">
                        统计时间:{' '}
                        <DateRangePicker
                            value={timeValue}
                            placeholder="选择日期范围"
                            align="left"
                            ref={e=>this.dateRangePicker = e}
                            onChange={date=>{
                                let newDate=this.bz_time(date);
                                this.setState({startDate: newDate[0], endDate: newDate[1]});
                            }}
                            shortcuts={[{
                                text: '本月',
                                onClick: ()=> {
                                    let start =new Date();
                                    start.setDate(1);
                                    let end = new Date();
                                    end.setTime(end.getTime() - 3600 * 1000 * 24 );
                                    let newDate=this.bz_time([start,end]);
                                    this.setState({startDate: newDate[0], endDate: newDate[1]});
                                    this.dateRangePicker.togglePickerVisible();
                                }
                            },{
                                text: '上一月',
                                onClick: ()=> {
                                    let end = new Date();
                                    end.setDate(1);
                                    let start = new Date();
                                    start.setDate(1);
                                    start.setMonth(start.getMonth()-1);
                                    let newDate=this.bz_time([start,end]);
                                    this.setState({startDate: newDate[0], endDate: newDate[1]});
                                    this.dateRangePicker.togglePickerVisible();
                                }
                            }]}
                        />
                    </Layout.Col>
                    <Layout.Col span="16">
                        <Input placeholder="请输入feedId,多个以逗号隔开" value={feedIds} onChange={this.changeFeedIds} prepend={
                            <Button type="primary" onClick={this.cleanSeek}>清空</Button>
                        } append={<Button type="primary" icon="search" onClick={this.clickQuery}>查询</Button>}/>
                    </Layout.Col>
                </Layout.Row>
                <AJAX ref={e => this.movementsAJAX = e}>
                    <div>

                    </div>
                </AJAX>
                {seriesData.map((item, i) => {
                    let jl=item[1].data.reduce((x = 0, y = 0) => x + y);
                    return (
                        <div key={i}>
                            <div id={"movementsChart" + i} style={style} className="Combined_bt"/>
                            <div style={{fontSize: "16px",fontWeight:'bold'}}>
                                <span style={{marginRight:'20px'}}>
                                    走势图流量和:{item[0].data.reduce((x = 0, y = 0) => x + y)}
                                </span>
                                <span style={{marginRight:'20px'}}>
                                    走势图奖励和:{jl ? jl.toFixed(1) : "0"}
                                </span>
                                {data[i].countUv&&
                                <span style={{marginRight:'20px'}}>
                                    内容总流量:{data[i].countUv}
                                </span>}
                                {data[i].countPublicFee&&
                                <span style={{marginRight:'20px'}}>
                                    内容总奖励:{data[i].countPublicFee.toFixed(1)}
                                </span>}
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default Movements;
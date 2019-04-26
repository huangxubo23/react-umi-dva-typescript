/**
 * Created by linhui on 17-10-27.首页饼状图
 */
require("../../../../styles/component/react_assembly/workload.css");
import React from 'react';
import echarts from 'echarts';
import {ajax} from '../../util/ajax';
import {Layout} from 'element-react';
import 'element-theme-default';


class Workload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            yesterdaypieChart: [],//昨日数据
            todaypieChart: [],//今日数据
            lately30daypieChart: [],//最近30天数据
            all: [],
        }
    }

    componentDidMount() {
        this.colleagues((json)=> {
            this.setState({all: json}, ()=> {
                this.queryYesterdayWorkEfficiency();
            })
        });


    }

    colleagues = (callback,pageNow=1,talent=[])=> {//拿取所有同事
        ajax.ajax({
            type: 'post',
            url: '/user/admin/user/queryManageList.io',//'/user/admin/user/user.colleagues.list.io',
            data: {pageNow:pageNow,pageSize:50,type:0},
            isCloseMask: true,
            callback: (json)=> {
                for(let i=0;i<json.talent.length;i++){
                    talent.push(json.talent[i]);
                }
                if(json.count>talent.length){
                    this.colleagues(callback,pageNow+1,talent);
                }else{
                    callback(talent);
                }
            }
        });
    };
    manageInfo = (id, callback)=> {//拿取当个员工
        ajax.ajax({
            type: 'post',
            url: '/user/admin/user/user.manage.info.io',
            data: {id: id},
            isCloseMask: true,
            callback: (json)=> {
                callback(json);
            }
        });
    };
    getempbayId = (id, callback)=> {
        let findemp = ()=> {
            let {all} = this.state;
            for (let i = 0; i < all.length; i++) {
                if (all[i].id == id) {
                    callback(all[i]);
                    return;
                }
            }
            this.manageInfo(id, (json20)=> {
                all.push(json20);
                this.setState({all: all});
                callback(json20);
            });
        };
        findemp();
    };

    queryYesterdayWorkEfficiency = () => {
        let {contentType}=this.props;
        let forChart=(json, post1, list2, item3, collection4, struct7, chart, callback)=> {
            if(json.length<=0){
                json.push({data:[],type:contentType});
            }else{
                json = [{data:json,type:contentType}]
            }
            for (let i = 0; i < json.length; i++) {
                let data = json[i].data;
                if (!data||data.length <= 0) {
                    data = [{
                        value: 0,
                        name: '暂无',
                    }]
                } else {
                    for (let y = 0; y < data.length; y++) {
                        if(data[y].creator){
                            this.getempbayId(data[y].creator, (json20)=> {
                                data[y].name = json20.name;
                            });
                        }
                    }
                }
                json[i].data = data;
                switch (json[i].type) {
                    case 1:
                        json[i].name = post1;
                        json[i].title = '图文';
                        break;
                    case 2:
                        json[i].name = list2;
                        json[i].title = '清单';
                        break;
                    case 3:
                        json[i].name = item3;
                        json[i].title = '好货';
                        break;
                    case 4:
                        json[i].name = collection4;
                        json[i].title = '搭配';
                        break;
                    case 7:
                        json[i].name = struct7;
                        json[i].title = '结构体';
                }
            }
            let date = setInterval(()=> {
                for (let x = 0; x < json.length; x++) {
                    let data = json[x].data;
                    for (let n = 0; n < data.length; n++) {
                        if (!data[n].name) {
                            return;
                        }
                    }
                }
                window.clearInterval(date);
                let state = this.state;
                state[chart] = json;
                this.setState({state: state}, () => {
                    this.getEChart(json, callback);
                });
            }, 500);
        };
        ajax.ajax({
            type: 'post',
            url: '/content/admin/effectAnalyse/queryThirtydayWorkEfficiency.io',//queryThirtydayWorkEfficiency
            data: {type:contentType},
            isCloseMask: true,
            callback: (lately30day) => {//lately30day
                if (lately30day) {
                    forChart(lately30day, 'lately30dayPost1', 'lately30dayList2', 'lately30dayItem3', 'lately30dayCollection4', 'lately30dayStruct7', 'lately30daypieChart', () => {
                        ajax.ajax({
                            type: 'post',
                            url: '/content/admin/effectAnalyse/queryYesterdayWorkEfficiency.io',//queryYesterdayWorkEfficiency
                            isCloseMask: true,
                            data: {type:contentType},
                            callback: (yesterday) => {//yesterday
                                if (yesterday) {
                                    forChart(yesterday, 'yesterdayPost1', 'yesterdayList2', 'yesterdayItem3', 'yesterdayCollection4', 'yesterdayStruct7', 'yesterdaypieChart', () => {//yesterday, 'yesterdayPost1', 'yesterdayList2', 'yesterdayItem3', 'yesterdayCollection4', 'yesterdayStruct7','yesterdaypieChart
                                        ajax.ajax({
                                            type: 'post',
                                            url: '/content/admin/effectAnalyse/queryTodayWorkEfficiency.io',//queryTodayWorkEfficiency
                                            isCloseMask: true,
                                            data: {type:contentType},
                                            callback: (today) => {//today
                                                forChart(today, 'todayPost1', 'todayList2', 'todayItem3', 'todayCollection4', 'todayStruct7', 'todaypieChart');//today, 'todayPost1', 'todayList2', 'todayItem3', 'todayCollection4', 'todayStruct7','todaypieChart'
                                            }
                                        });
                                    });
                                }
                            }
                        });
                    });
                }
            }
        });
    };

    getEChart = (chart, callback) => {//list:2、清单 post:1、帖子 item:3单品||好货 collection：4 搭配 struct:7结构体 item2:7种草单品
        let forpieChart=(pieChart)=> {
            for (let i = 0; i < pieChart.length; i++) {
                let lineChart = echarts.init(document.getElementById(pieChart[i].name));
                let option = {
                    color:['#675aa0','#f05f5a','#f16122','#ffb701','#6dc066','#63c8d0'],
                    title: {
                        text: pieChart[i].title,
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} "
                    },
                    series: [
                        {
                            name: '工作量',
                            type: 'pie',
                            radius: '50%',
                            center: ['40%', '50%'],
                            data: pieChart[i].data,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
                if (lineChart) {
                    lineChart.clear();
                    lineChart.setOption(option);
                }
            }
            if (callback && (typeof callback) == 'function') {
                callback();
            }
        };
        if (chart) {
            forpieChart(chart);
        }
    };

    render() {
        let {yesterdaypieChart,todaypieChart,lately30daypieChart} = this.state;
        return (
            <div>
                <Layout.Row gutter="2">
                    <Layout.Col span="8">
                        <p><strong>最近30天工作量</strong></p>
                        <Layout.Row>
                            {lately30daypieChart.length > 0 ? lately30daypieChart.map((item, i) => {
                                return (
                                    <Layout.Col span="24" key={i}>
                                        <div id={item.name} style={{height: '300px'}}/>
                                        <div className="workloadNumber">
                                            <div style={{overflow: "auto", width: "100%", height: "200px", border: "1px"}}>
                                                {(item.data ? item.data : []).map((data, i) => {
                                                    return (
                                                        <p key={data.name + i} className={item.type == 0 ? 'JournalColor' : 'messageColor'}>{data.name + ':' + data.value + '条'}</p>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </Layout.Col>
                                )
                            }) : <Layout.Col span="24">加载中</Layout.Col>}
                        </Layout.Row>
                    </Layout.Col>
                    <Layout.Col span="8">
                        <p><strong>昨日工作量</strong></p>
                        <Layout.Row>
                            {yesterdaypieChart.length > 0 ? yesterdaypieChart.map((item, i) => {
                                return (
                                    <Layout.Col span="24" key={i}>
                                        <div className="position" id={item.name} style={{height: '300px'}}/>
                                        <div className="workloadNumber">
                                            <div style={{overflow: "auto", width: "100%", height: "200px", border: "1px"}}>
                                                {(item.data ? item.data : []).map((data, i) => {
                                                    return (
                                                        <p key={i} className={item.type == 0 ? 'JournalColor' : 'messageColor'}>{data.name + ':' + data.value + '条'}</p>
                                                    )
                                                })}
                                            </div>

                                        </div>
                                    </Layout.Col>
                                )
                            }) :<Layout.Col span="24">加载中</Layout.Col>}
                        </Layout.Row>
                    </Layout.Col>
                    <Layout.Col span="8">
                        <p><strong>今日工作量</strong></p>
                        <Layout.Row>
                            {todaypieChart.length > 0 ? todaypieChart.map((item, i) => {
                                return (
                                    <Layout.Col span="24" key={i}>
                                        <div id={item.name} style={{height: '300px'}}/>
                                        <div className="workloadNumber">
                                            <div style={{overflow: "auto", width: "100%", height: "200px", border: "1px"}}>
                                                {(item.data ? item.data : []).map((data, i) => {
                                                    return (
                                                        <p key={i} className={item.type == 0 ? 'JournalColor' : 'messageColor'}>{data.name + ':' + data.value + '条'}</p>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </Layout.Col>
                                )
                            }) : <Layout.Col span="24">加载中</Layout.Col>}
                        </Layout.Row>
                    </Layout.Col>
                </Layout.Row>
            </div>
        )
    }
}


export default Workload;
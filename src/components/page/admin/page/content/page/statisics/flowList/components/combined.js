/**
 * Created by shiying on 18-9-15.
 */

import $ from 'jquery';
import React from 'react';
import echarts from 'echarts';
require("../../../../../../../../../styles/addList/content.css");
import {PersonSelection,NewPersonSelection} from '../../../../../../components/PersonSelection';
import {BundleLoading} from '../../../../../../../../../bundle';
import rewardCountDetailsModal from 'bundle-loader?lazy&name=pc/trends_asset/admin/content/statisices/flowList/app-[name]!./rewardCountDetailsModal';
import {Pagination,Loading,Layout,DateRangePicker,Input,Button,Select,Table,Radio} from 'element-react';
import 'element-theme-default';
import AJAX from '../../../../../../../../lib/newUtil/AJAX.js';


class Combined extends React.Component {
    constructor(props) {
        super(props);
        let date = new Date();
        date.setDate(date.getDate() - 1);
        let [endTime,startTime] = [date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate()),date.getFullYear() + "-" + (date.getMonth() + 1) + "-01"];
        this.state = {
            startDate: startTime,
            endDate: endTime,
            addStartDate: '',
            addEndDate: '',
            addTimeBegin: "1997-01-01",
            addTimeFinish: endTime,
            manageId: 0,
            type: 0,
            talentTitle: 0,
            channeId: 0,
            flowIt: [],
            rewardIt: [],
            all: [],//所有员工
            rank: 0,//排行榜
            statisticalForm:'饼图',
            columns: [
                {
                    label: "编号",
                    prop: "number",
                    minWidth:"40px",
                },{
                    label: "人员",
                    prop: "name",
                    minWidth:"120px",
                },{
                    label: "流量数",
                    prop: "cf",
                    minWidth:"90px",
                    render:(data)=>{
                        return(
                            <div style={{color: (this.state.rank === "5" ? "red" : "")}}>{data.cf}</div>
                        )
                    }
                },{
                    label: "流量总和",
                    prop: "sf",
                    minWidth:"90px",
                    render:(data)=>{
                        return(
                            <div style={{color: (this.state.rank === "1" ? "red" : "")}}>{data.sf}</div>
                        )
                    }
                },{
                    label: "流量平均值",
                    prop: "tf",
                    minWidth:"90px",
                    render:(data)=>{
                        return(
                            <div style={{color: (this.state.rank === "3" ? "red" : "")}}>{data.tf ? data.tf : ""}</div>
                        )
                    }
                },{
                    label: "奖励数",
                    prop: "cr",
                    minWidth:"90px",
                    render:(data)=>{
                        return(
                            <div style={{color: (this.state.rank === "6" ? "red" : "")}}>{data.cr}</div>
                        )
                    }
                },{
                    label: "奖励总和",
                    prop: "sr",
                    minWidth:"90px",
                    render:(data)=>{
                        return(
                            <div style={{color: (this.state.rank === "2" ? "red" : "")}}>
                                {data.sr}
                            </div>
                        )
                    }
                },{
                    label: "奖励平均值",
                    prop: "date",
                    minWidth:"90px",
                    render:(data)=>{
                        return(
                            <div style={{color: (this.state.rank === "4" ? "red" : "")}}>{data.tr ? data.tr : ""}</div>
                        )
                    }
                },{
                    label: "操作",
                    prop: "sr",
                    minWidth:"90px",
                    render:(data)=>{
                        if(data.sr){
                            return(
                                <Button type='info' size="small" onClick={()=>{
                                    //this.RewardClick(data.manageId)
                                    this.props.rewardDetails({manageId:data.manageId,name:data.name});
                                }}>奖励详情</Button>
                            )
                        }
                    }
                }
            ]
        }
    }

    componentDidMount() {
        this.setState({width: $(".combinedWidth").width()}, () => {
            let combinedChart = echarts.init(document.getElementById('combinedChart'));
            let rewardChart = echarts.init(document.getElementById('rewardChart'));
            this.setState({combinedChart,rewardChart},this.change);
        });
    }

    uplineChart = () => {
        let {data,combinedChart} = this.state;
        let cs = [],ss = [];
        let t = [0, 0],tt = [];
        for (let i = 0; i < data.length; i++) {
            let c = {name: data[i].name, value: data[i].c};
            let s = {name: data[i].name, value: data[i].s};
            let it = {name: data[i].name, sf: data[i].s, cf: data[i].c};
            tt.push(it);
            t.push(Number(data[i].s));
            if (c.value > 100) {
                cs.push(c);
            }

            if (s.value > 200) {
                ss.push(s);
            }
        }
        let option = {
            title: {
                text: '流量合计' + ' '.repeat(15) + '总流量' + (t.reduce((x, y) => {
                    return x + y;
                })).toFixed(2),
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)",
            },
            series: [
                {
                    name: '内容数',
                    type: 'pie',
                    selectedMode: 'single',
                    radius: [0, '50%'],
                    label: {
                        normal: {
                            position: 'inner'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: cs
                },
                {
                    name: '流量总和',
                    type: 'pie',
                    radius: ['55%', '70%'],
                    data: ss
                }
            ]
        };// 使用刚指定的配置项和数据显示图表。
        combinedChart.clear();
        combinedChart.setOption(option);
        this.setState({flowIt: tt});
    };
    queryDate = () => {
        let {startDate,endDate,addStartDate,addEndDate,addTimeBegin,addTimeFinish,manageId,type,talentTitle,channeId}=this.state;
        this.combinedAJAX.ajax({
            url: "/message/admin/effectAnalyse/domain.effectAnalyse.combined.new.io",
            data: {
                startDate, endDate, addStartDate, addEndDate, addTimeBegin, addTimeFinish, manageId, type, userId: talentTitle, channeId,
            },
            callback: (data) => {
                this.getUser((arrs) => {
                    let ar = [];
                    for (let a in arrs) {
                        for (let d in data) {
                            if (arrs[a].id === data[d].id) {
                                ar.push(data[d]);
                            }
                        }
                    }
                    data = ar;
                    let arr = [];
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].id) {
                            arr.push(data[i].id);
                        }
                    }
                    PersonSelection.getManageList(arr, (json) => {
                        for (let i = 0; i < data.length; i++) {
                            if (data[i].id) {
                                data[i].name = json[i].name;
                            }
                        }
                        let sss = setInterval(() => {
                            clearInterval(sss);
                            this.setState({data: data, rank: 0}, () => {
                                this.uplineChart();
                                this.rewardDate();
                            });
                        }, 1000);
                    });
                }, 1, [], 1);
            }
        });

    };
    upRewardChart = () => {
        let data = this.state.dataReward;
        let cs = [];
        let ss = [];
        let t = [0, 0];
        let tt = [];
        for (let i = 0; i < data.length; i++) {
            let c = {name: data[i].name, value: data[i].c};
            let s = {name: data[i].name, value: data[i].s};
            let it = {name: data[i].name, sr: data[i].s, cr: data[i].c,manageId:data[i].id};
            tt.push(it);
            t.push(Number(data[i].s));
            if (c.value > 10) {//设置内容数范围
                cs.push(c);
            }

            if (s.value > 0) {//设置奖励值范围
                ss.push(s);
            }
        }
        let {rewardChart} = this.state;
        let option = {
            title: {
                text: '奖励合计' + ' '.repeat(15) + '总奖励' + (t.reduce((x, y) => {
                    return x + y;
                })).toFixed(2),
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            series: [
                {
                    name: '内容数',
                    type: 'pie',
                    selectedMode: 'single',
                    radius: [0, '50%'],

                    label: {
                        normal: {
                            position: 'inner'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: cs
                },
                {
                    name: '奖励总和',
                    type: 'pie',
                    radius: ['55%', '70%'],
                    data: ss
                }
            ]
        };// 使用刚指定的配置项和数据显示图表。
        rewardChart.clear();
        rewardChart.setOption(option);
        this.setState({rewardIt: tt});
    };
    getUser = (callback, num = 1, arr = [], type = 0) => {
        this.combinedAJAX.ajax({
            url: '/user/admin/user/queryManageList.io',
            data: {name: '', pageNow: num, pageSize: 100, type: type},
            callback: (json) => {
                let n = Math.ceil((json.count) / 100);
                arr = arr.concat(json.talent);
                if (n > num) {
                    num++;
                    this.getUser(callback, num, arr);
                } else {
                    callback(arr);
                }
            }
        });
    };

    rewardDate = () => {
        let {startDate,endDate,addStartDate,addEndDate,addTimeBegin,addTimeFinish,manageId,type,talentTitle,channeId}=this.state;
        this.combinedAJAX.ajax({
            url: "/message/admin/effectAnalyse/getPublicFee.io",
            data: {
                startDate, endDate, addStartDate, addEndDate, addTimeBegin, addTimeFinish, manageId, type, userId: talentTitle, channeId,
            },
            callback: (data) => {
                this.getUser((arrs) => {
                    let ar = [];
                    for (let a in arrs) {
                        for (let d in data) {
                            if (arrs[a].id === data[d].id) {
                                ar.push(data[d]);
                            }
                        }
                    }
                    data = ar;
                    let arr = [];
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].id) {
                            arr.push(data[i].id);
                        }
                    }
                    PersonSelection.getManageList(arr, (json) => {
                        for (let i = 0; i < data.length; i++) {
                            if (data[i].id) {
                                data[i].name = json[i].name;
                            }
                        }
                        let sss = setInterval(() => {
                            clearInterval(sss);
                            this.setState({dataReward: data}, () => {
                                this.upRewardChart();
                            });
                        }, 1000);
                    });
                }, 1, [], 1);
            }
        })
    };

    selectType = (type) => {
        this.setState({type}, this.change);
    };

    selectTalent = (talentTitle) => {
        this.setState({talentTitle}, this.change);
    };

    selectChannel = (channeId) => {
        this.setState({channeId}, this.change);
    };

    change = () => {
        this.queryDate();
    };

    flowCharts = (name, item) => {
        return item.sort((a, b) => {
            return a[name] - b[name]
        })
    };

    RewardClick=(manageId)=>{//打开奖励详情
        let {startDate,endDate,modal}=this.state;
        if(modal){
            let jd = this.rewardCountDetailsModal.jd;
            jd.setState({startDate:startDate,endDate:endDate,manageId:manageId,dialogVisible:true},()=>{
                jd.goPage(1);
            });
        }else {
            this.setState({modal:true},()=>{
                setTimeout(()=>{
                    let jd = this.rewardCountDetailsModal.jd;
                    if(jd){
                        jd.setState({startDate:startDate,endDate:endDate,manageId:manageId,dialogVisible:true},()=>{
                            jd.goPage(1);
                        });
                    }else {
                        setTimeout(arguments.callee,100);
                    }
                },100);
            });
        }
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

    dateRangePickerChange=(date)=>{//时间改变步骤简写
        this.setState(date,this.queryDate);
    };

    render() {
        let style = {height: 400};
        let {width,rank,rewardIt,startDate,endDate,addStartDate,addEndDate,statisticalForm,channelId,type,talentTitle,columns}=this.state;
        if (width) {
            style.width = ((width) * 0.96) / 2;
            style.height = width * 0.4;
            style.float = "left";
        }
        let feedType = [
            {name: "全部", type: 0}, {name: "清单", type: 503},
            {name: "帖子", type: 500}, {name: "单品", type: 502},
            {name: "搭配", type: 504}, {name: "视频", type: 506}
        ];
        let flowId = this.state.flowIt;
        let item = [];
        for (let i in flowId) {
            for (let t in rewardIt) {
                if (flowId && rewardIt) {
                    if (flowId[i].name == rewardIt[t].name) {
                        item.push($.extend(flowId[i], rewardIt[t]));
                    }
                } else {
                    if (flowId) {
                        item.push(flowId[i]);
                    } else if (rewardIt) {
                        item.push(rewardIt[i]);
                    }
                }
            }
        }
        for (let i in item) {
            if (item[i].sf && item[i].cf) {
                item[i].tf = ((item[i].sf) / (item[i].cf)).toFixed(2)
            } else {
                item[i].tf = 0;
            }
            if (item[i].sr && item[i].cr) {
                item[i].tr = ((item[i].sr) / (item[i].cr)).toFixed(2)
            } else {
                item[i].tr = 0;
            }
        }
        for(let i=0;i<item.length;i++){
            item[i].number=i+1;
        }
        let arr = ["", "sf", "sr", "tf", "tr", "cf", "cr"];
        if (rank != 0) {
            this.flowCharts(arr[rank], item).reverse();
        }
        let timeValue=this.bz_time([startDate,endDate],true);
        let timeValue2=addStartDate?this.bz_time([addStartDate,addEndDate],true):null;
        let {channel=[],talent=[]}=this.props;
        return (
            <div>
                <Layout.Row gutter="10" style={{margin: "8px 0"}}>
                        <Layout.Col span="4">
                        <Radio.Group value={statisticalForm} onChange={(value)=>this.setState({statisticalForm:value})}>
                            <Radio.Button value="饼图" />
                            <Radio.Button value="表格" />
                        </Radio.Group>
                    </Layout.Col>
                    {statisticalForm!=='饼图'&&<Layout.Col span="4">
                        <Select value={rank} onChange={(rank)=>this.setState({rank})}>
                            <Select.Option label='默认排行' value={0}/>
                            <Select.Option label='流量总和排行' value={'1'}/>
                            <Select.Option label='奖励总和排行' value={'2'}/>
                            <Select.Option label='流量平均值排行' value={'3'}/>
                            <Select.Option label='奖励平均值排行' value={'4'}/>
                            <Select.Option label='流量数排行' value={'5'}/>
                            <Select.Option label='奖励数排行' value={'6'}/>
                        </Select>
                    </Layout.Col>}
                    <Layout.Col span="8">
                        统计时间:{' '}
                        <DateRangePicker
                            value={timeValue}
                            placeholder="选择日期范围"
                            align="left"
                            ref={e=>this.dateRangePicker = e}
                            onChange={date=>{
                                let newDate=this.bz_time(date);
                                this.dateRangePickerChange({startDate: newDate[0], endDate: newDate[1]});
                            }}
                            shortcuts={[{
                                text: '本月',
                                onClick: ()=> {
                                    let start =new Date();
                                    start.setDate(1);
                                    let end = new Date();
                                    end.setTime(end.getTime() - 3600 * 1000 * 24 );
                                    let newDate=this.bz_time([start,end]);
                                    this.dateRangePickerChange({startDate: newDate[0], endDate: newDate[1]});
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
                                    this.dateRangePickerChange({startDate: newDate[0], endDate: newDate[1]});
                                    this.dateRangePicker.togglePickerVisible();
                                }
                            }]}
                        />
                    </Layout.Col>
                    <Layout.Col span="8">
                        添加时间:{' '}
                        <DateRangePicker
                            value={timeValue2}
                            placeholder="选择日期范围"
                            align="left"
                            ref={e=>this.addDateRangePicker = e}
                            onChange={date=>{
                                let newDate=this.bz_time(date);
                                this.dateRangePickerChange({addStartDate: newDate[0], addEndDate: newDate[1]});
                            }}
                            shortcuts={[{
                                text: '本月',
                                onClick: ()=> {
                                    let start =new Date();
                                    start.setDate(1);
                                    let end = new Date();
                                    end.setTime(end.getTime() - 3600 * 1000 * 24 );
                                    let newDate=this.bz_time([start,end]);
                                    this.dateRangePickerChange({addStartDate: newDate[0], addEndDate: newDate[1]});
                                    this.addDateRangePicker.togglePickerVisible();
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
                                    this.dateRangePickerChange({addStartDate: newDate[0], addEndDate: newDate[1]});
                                    this.addDateRangePicker.togglePickerVisible();
                                }
                            }]}
                        />
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
                        分享者:{' '}
                        <NewPersonSelection callback={(manageId) => this.setState({manageId},this.change)} type={1} classNum={1}/>
                    </Layout.Col>
                    <Layout.Col span="6">
                        类型:{' '}
                        <Select value={type} onChange={this.selectType}>
                            {feedType.map(item => {
                                return (
                                    <Select.Option label={item.name} value={item.type} key={item.type}/>
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
                <AJAX ref={e => this.combinedAJAX = e}>
                    <div> </div>
                </AJAX>
                <div style={{display:statisticalForm==='饼图'?'':'none'}}>
                    <div id="combinedChart" style={style} className="Combined_bts"/>
                    <div id="rewardChart" style={style} className="Combined_bts"/>
                </div>
                {statisticalForm!=='饼图'&&<div>
                    <Table style={{width: '96%',left:'2%'}} columns={columns} data={item} border={true}/>
                </div>}
                {this.state.modal&&<BundleLoading ref={e=>this.rewardCountDetailsModal=e} load={rewardCountDetailsModal} refresh={this.getData}/>}
            </div>
        )
    }
}

export default Combined;
import ReactChild from "../../../../../../lib/util/ReactChild";

/**
 * Created by linhui on 18-2-2.赏金任务流量总表
 */
require('../../../../../../../styles/bountyTask/bountyStatistics.css');
import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import echarts from 'echarts';
import {ajax} from '../../../../../../../components/lib/util/ajax';
import {getUrlPat,infoNoty} from '../../../../../../../components/lib/util/global';
import {Paging3, PagingReply} from '../../../../../../../components/lib/util/Paging';
import   '../../../../../../../components/lib/util/jquery.qrcode.min'
/*import  '../../../../../../../components/lib/util/bootstrap-datetimepicker.zh-CN'*/
import  '../../../../../../../components/lib/util/bootstrap-datetimepicker.min'
import  '../../../../../../../styles/content/bootstrap-datetimepicker.min.css'
import  {
    ButtonGroup,
    Button,
    Table,
    FormGroup,
    FormControl,
    Col,
    Panel,
    Row,
} from 'react-bootstrap'


class StatisticsTable extends React.Component{//流量列表
    constructor(props) {
        super(props);
        let date = new Date();
        date.setDate(date.getDate() - 2);
        let dates = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate());
        this.state = {
            date: dates,
            type: 0,
            manageId: 0,
            pageNow: 1,
            pageSize: 20,
            count: 0,
            effectAnalyse: [],
        }
    }

    componentDidMount() {
        $("#collects").datetimepicker({
            format: 'yyyy-mm-dd',
            minView: 'month',
            language: 'zh-CN',
            autoclose: true,
        }).on("changeDate", (env) => {
            let d = env.date;
            this.props.setPaState({date: d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + (d.getDate())}, () => {
                this.props.goPage(1);
            });
        }).data('datepicker');
    }

    getVmContents=(env)=>{//拿取走势图数据
        let [url,feedId] = [window.location.href,$(env.target).data('feedid')];
        let contentEncryptTime = getUrlPat(url,'contentTime');
        ajax.ajax({
            type:'post',
            url:'/message/admin/visible/getVmContents.io',
            data:{'feedId':feedId,'encryptTime':contentEncryptTime},
            callback:(json)=>{
                this.props.setPaState({state:2,encryptTime:contentEncryptTime,feedId:feedId,data:json},()=>{
                    this.props.lookImg();
                });
            }
        });
    };
    render() {
        let state = this.props.getState;
        let effectAnalyse = state.effectAnalyse;
        return (
            <div>
                <Table striped bordered condensed hover className="contentList">
                    <thead>
                    <tr>
                        <td width="10%">统计日期:<FormControl value={state.date} id="collects" type="text" onChange={()=>{}}/></td>
                        <td>文章名称</td>
                        <td>达人名称</td>
                        <td>提交时间</td>
                        <td>渠道通过时间</td>
                        <td>单日uv</td>
                        <td>累计uv</td>
                        <td>操作</td>
                    </tr>
                    </thead>
                    <tbody>
                    {effectAnalyse.map((item,i)=>{
                        return(
                            <tr key={+new Date()+i}>
                                <td >{item.date}</td>
                                <td>{item.feedTitle}</td>
                                <td>{item.userName}</td>
                                <td>{item.addTime}</td>
                                <td>{item.passDate}</td>
                                <td>{item.uv}</td>
                                <td>{item.countUv}</td>
                                <td><Button　onClick={this.getVmContents} data-feedid={item.feedId}>查看走势图</Button></td>
                            </tr>
                        )
                    })}
                    </tbody>
                </Table>
                <Paging3 bsSize="large" pageNow={this.state.pageNow} pageSize={this.state.pageSize}
                         count={this.state.count} goPage={this.goPage}/>
            </div>
        )
    }
}
class TrendChart extends React.Component {//走势图
    constructor(props) {
        super(props);
        let date = new Date();
        date.setDate(date.getDate() - 1);
        let endTime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate());
        date.setDate(date.getDate() - 30);
        let startTime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate());
        this.state = {
            startDate: startTime,
            endDate: endTime,
            feedIds: "",
            data: [],
        }
    }
    componentDidMount() {
        $(".datepicker_movementsd").datetimepicker({
            format: 'yyyy-mm-dd',
            minView: 'month',
            language: 'zh-CN',
            autoclose: true,
        }).on("changeDate", (env) => {
            let d = env.date;
            let type = $(env.target).data("type");
            if (type === "start") {
                this.setState({startDate: d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + (d.getDate())}, () => {
                    // this.queryDate();
                });
            } else if (type === "end") {
                this.setState({endDate: d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + (d.getDate())}, () => {
                    // this.queryDate();
                });
            }
        }).data('datepicker');
        this.setState({width: $("#chartWidth").width()}, () => {
            let lineChart = echarts.init(document.getElementById('movementsChart'));
            this.setState({lineChart: lineChart});
        });
    }

    queryDate = (feedId) => {
        if (Boolean(feedId)) {
            this.setState({feedIds: feedId});
        }
        ajax.ajax({
            url: "/message/admin/visible/getVmContents.io",//要访问的后台地址
            data: {
                startDate: this.state.startDate,
                endDate: this.state.endDate,
                feedId: this.props.getState.feedId,
                encryptTime:this.props.getState.encryptTime,
            },
            callback: (data) => {
                this.props.setPaState({data: data}, () => {
                    this.uplineChart();
                });
            }
        });

    };
    uplineChart = () => {
        let data = this.props.getState.data;
        let legend = [];
        let xAxis = [];
        let series = [];
        for (let i = 0; i < data.length; i++) {
            legend.push({name: data[i].feedTitle});
            let ser = {name: data[i].feedTitle, type: "line", smooth: true};
            let serData = [];
            ser.data = serData;
            let effectAnalyse = data[i].effectAnalyse;
            for (let j = 0; j < effectAnalyse.length; j++) {
                if (i == 0) {
                    xAxis.push(effectAnalyse[j].date);
                }
                serData.push(effectAnalyse[j].uv);
            }
            series.push(ser);
        }
        let lineChart = this.state.lineChart;
        let option = {
            title: {
                text: '流量走势图'
            },
            tooltip: {trigger: 'axis'},
            legend: {
                data: legend
            },
            xAxis: {
                data: xAxis
            },
            yAxis: {},
            series: series
        };
        if (lineChart) {// 使用刚指定的配置项和数据显示图表。
            lineChart.clear();
            lineChart.setOption(option);
        }

    };

    render() {
        let style = {height: 400};
        if (this.state.width) {
            style.width = this.state.width;
        }
        return (
            <Row>
                <FormGroup style={{margin: "20px 0 0 0"}}>
                    <Col sm={3}>
                        <FormControl id="stateDate" type="text" value={this.state.startDate} data-type="start"
                                     className="datepicker_movementsd" onChange={()=>{}}
                                     placeholder="开始时间"/>
                    </Col>
                    <Col sm={3}>
                        <FormControl id="endDate" type="text" value={this.state.endDate} data-type="end"
                                     className="datepicker_movementsd" onChange={()=>{}}
                                     placeholder="结束时间"/>
                    </Col>
                    <Col sm={3}>
                        <FormControl type="text" id="feedIds" placeholder="feedId,以逗号隔开" value={this.props.getState.feedId}
                                     disabled onChange={this.changeFeedIds}/>
                    </Col>
                    <Col sm={3}>
                        <Button onClick={this.queryDate} bsStyle="primary" block>查询</Button>
                    </Col>
                </FormGroup>
                <div id="movementsChart" style={style} className="Combined_bt"/>
            </Row>
        )
    }
}

class BountyStatistics extends ReactChild {
    componentDidMount() {
        this.goPage(1);
    }

    constructor(props) {
        super(props);
        let date = new Date();
        date.setDate(date.getDate() - 2);
        let dates = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate());
        this.state = {
            pageNow: 1,
            pageSize: 16,
            count: 0,
            date: dates,
            state:1,
            encryptTime:'',//加密时间
            feedId:'',//
            effectAnalyse:[],//流量内容
            data:'',//走势图数据
        }
    }

    setThisState = (state, callback) => {
        this.setState(state, function () {
            if (callback && (typeof callback) == 'function') {
                callback();
            }
        });
    };
    buttonPresent = (env) => {//按钮当前选项
        let state = $(env.target).data('state');
        this.setState({state: state});
    };

    queryVmissionByFeedId=(data)=>{//拿取流量数据
        ajax.ajax({
            type:'post',
            url:'/message/admin/effectAnalyse/queryVmissionByFeedId.io',
            data:data,
            callback:(json)=>{
                //json.contents = statistics;
                this.setState(json);
               /* let contents = json.contents;
                let effectAnalyse = json.effectAnalyse;
                let statistics = [];
                for(let i=0;i<contents.length;i++){
                    let content = contents[i];
                    for(let y=0;y<effectAnalyse.length;y++){
                        if(contents[i].feedId&&effectAnalyse[y].feedId){
                            if(contents[i].feedId===effectAnalyse[y].feedId){
                                content.date = effectAnalyse[y].date;//统计时间
                                content.addTime = effectAnalyse[y].addTime;//添加时间
                                content.feedPicUrl = effectAnalyse[y].feedPicUrl;//图片
                                content.uv = effectAnalyse[y].uv;//每日uv
                                content.countUv = effectAnalyse[y].countUv;//总uv
                            }
                        }
                    }
                    statistics.push(content);
                }*/

            }
        });
    };
    goPage = (pageNow, callback) => {/*点击分页*/
        let url = window.location.href;
        let [feedId,encryptTime,vMissionId]  = [getUrlPat(url,'feedId'),getUrlPat(url,'encryptTime'),getUrlPat(url,'vMissionId')];

        //d=d?d: zujian.state;
        pageNow = pageNow ? pageNow : this.state.pageNow;
        this.queryVmissionByFeedId({
            pageNow: pageNow,
            pageSize: this.state.pageSize,
            vMissionId:vMissionId, //theRequest.vMissionId,
            encryptTime:encryptTime,//theRequest.encryptTime,
            date: this.state.date,
        }, callback);
    };
    lookChart=()=>{//查看走势图
        this.trendChart.uplineChart();
    };

    render() {
        let state = this.state;
        return (
            <div>
                <Panel header="流量总览" bsStyle="info" id="chartWidth">
                    <ButtonGroup justified className="flowList_ms">
                        <Button href="#" onClick={this.buttonPresent} data-state='1'
                                active={this.state.state == 1 ? true : false} bsSize="large">流量</Button>
                        <Button href="#" onClick={this.buttonPresent} data-state='2'
                                active={this.state.state == 2 ? true : false} bsSize="large">走势图</Button>
                    </ButtonGroup>
                    <div className={state.state == 1 ? '' : 'none'}>
                        <StatisticsTable setPaState={this.setThisState} getState={this.state} goPage={this.goPage} lookImg={this.lookChart}/>{/*流量列表*/}
                    </div>
                    <div className={state.state == 2 ? '' : 'none'}>
                        <TrendChart setPaState={this.setThisState} ref={e=>this.trendChart=e} getState={this.state} goPage={this.goPage} />{/*流量走势图*/}
                    </div>
                </Panel>
            </div>
        )
    }
}


export default BountyStatistics;
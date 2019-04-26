/**
 * Created by linhui on 17-12-12.小组工作统计
 */

import React from 'react';
import ReactChild from "../../../../../../lib/util/ReactChild";
require('../../../../../../../styles/addList/content.css');
import AJAX from '../../../../../../lib/newUtil/AJAX.js';
import {ajax} from '../../../../../../../components/lib/util/ajax';
import {PersonSelection,NewPersonSelection} from '../../../../components/PersonSelection';
import {Pagination,Loading,Layout,Input,Upload,DateRangePicker,Switch,Select,Radio,Alert,Table,Button} from 'element-react';
import 'element-theme-default';
let Ajax=ajax.ajax;

class DateChoose extends React.Component {
    constructor(props) {
        super(props);
        let date = new Date();
        let dateEnd = new Date();
        date.setDate(date.getDate() - 7);
        this.state = {
            largeProcessList: [],//大流程数据
            smallProcessList: [],//步骤数据
            contentMode: [],
            contentModeList: [],//所有模板主题
            dateChooseMode: [
                {name: "步骤提交时间", start: "addTimeStart", end: "addTimeEnd"},
                {name: "提交审核时间", start: "submitDateStart", end: "submitDateEnd"},
                {name: "审核通过时间", start: "auditStart", end: "auditEnd"},
                {name: "平台接收时间", start: "passDateStart", end: "passDateEnd"}],
            present: 0,
            start: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
            end: dateEnd.getFullYear() + "-" + (dateEnd.getMonth() + 1) + "-" + dateEnd.getDate(),
            contentState: [
                {state: '', title: "全部状态"}, {state: 0, title: "草稿箱"},
                {state: 1, title: "待审核"}, {state: 2, title: "审核失败"},
                {state: 3, title: "待发布"}, {state: 4, title: "已发布"},
                {state: 5, title: "待修改"}, {state: 6, title: "通过"},
                {state: 7, title: "已修改"}, {state: 8, title: "待同步"}
            ],
            pattern:'总计',
        }
    }

    componentDidMount() {
        this.queryLargeProcessList();
    }

    selectPresent = (present) => {
        this.setState({present}, this.setPa);
    };
    setPa = () => {
        let {dateChooseMode,present,start,end} = this.state,s = {};
        for (let i = 0; i < dateChooseMode.length; i++) {
            if (i == present) {
                Object.assign(s,{
                    [dateChooseMode[i].start]:start,
                    [dateChooseMode[i].end]:end,
                    name:dateChooseMode[i].name,
                });
            } else {
                Object.assign(s,{
                    [dateChooseMode[i].start]:undefined,
                    [dateChooseMode[i].end]:undefined,
                });
            }
        }
        this.props.setPaDateState(s);
    };

    getListData = (callback) => {
        this.props.workListAJAX.ajax({
            url: "/content/admin/content/getContentModeByCreatorAndType.io",
            data: this.props.getState.parameter,
            async: true,
            callback: (json) => {
                this.setState({contentMode: json}, callback);
            }
        });
    };
    selectContentModeId = (value) => {//渠道搜索
        let {getState,setPaState,listData} = this.props;
        let {parameter}=getState;
        parameter.contentModeId = value;
        setPaState({parameter}, () => listData());
    };

    selectManage = (value) => {
        let {getState,setPaState,listData} = this.props;
        let {parameter}=getState;
        parameter.creator = value;
        parameter.manageId = value;
        setPaState({parameter}, () => {
            if (parameter.type && value) {
                listData(this.getListData());
            } else {
                let {parameter} = this.props.getState;
                parameter.contentModeId = 0;
                setPaState({parameter}, () => listData());
            }
        });
    };

    queryLargeProcessList = () => {//所有工作流程数据
        Ajax({
            type: 'post',
            url: '/content/admin/content/queryLargeProcessList.io',
            data: {},
            isCloseMask: true,
            callback: ({largeProcessList}) => {
                this.setState({largeProcessList});
            }
        });
    };

    selectGroupTalent = (value) => {//小组改变事件
        let {getState,setPaState,listData} = this.props;
        let {parameter}=getState;
        parameter.groupId = value;
        setPaState({parameter},() => listData())
    };

    largeProcessChange = (value) => {//工作流程改变事件
        let {getState,setPaState,listData}=this.props;
        let {parameter} = getState;
        if (value) {
            let {contentModeList,smallProcessList,id} = JSON.parse(value);
            this.setState({smallProcessList, contentModeList}, () => {
                parameter.largeProcessId = id;
                setPaState({parameter}, () => listData());
            });
        } else {
            this.setState({smallProcessList: []}, () => {
                parameter.largeProcessId = '';
                setPaState({parameter}, () => listData())
            });
        }
    };

    smallProcessChange = (value) => {//步骤改变事件
        let {getState,listData,setPaState}=this.props;
        let {parameter} = getState;
        parameter.smallProcessId = value;
        setPaState({parameter}, listData)
    };
    selectState = (value) => {//状态改变事件
        let {getState,listData}=this.props;
        let {parameter} = getState;
        parameter.state = value==-1?undefined:value;
        this.setState({parameter},listData);
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

    dateRangePickerChange=({newDate,getState})=>{//时间改变步骤简写
        this.setState({
            start: newDate[0],
            end: newDate[1]
        },()=>{
            let {type,creator} = getState.parameter;
            if (type && creator) {
                this.getListData(this.setPa());
            } else {
                this.setPa();
            }
        });
    };

    patternChange=(value)=>{
        this.setState({pattern:value},()=>{
            this.props.patternChange(value);
        })
    };

    render() {
        let {dateChooseMode,present,start,end,largeProcessList,smallProcessList,contentModeList=[],pattern}=this.state;
        let {getState}=this.props;
        let {dels,ifInvalid,largeProcessId,state}=getState.parameter;
        let timeValue=this.bz_time([start,end],true);
        return (
            <div>
                <Layout.Row gutter="10" style={{margin: "8px 0"}}>
                    {dateChooseMode.map((item,i) => {
                        return (
                            <Layout.Col span="6" key={item.start}>
                                <Button type="info" onClick={()=>this.selectPresent(i)} style={{width:'100%'}} disabled={present == i}>{item.name}</Button>
                            </Layout.Col>
                        )
                    })}
                </Layout.Row>
                <Layout.Row gutter="10" style={{margin: "8px 0"}}>
                    <Layout.Col span="3">
                        <Radio.Group value={pattern} onChange={this.patternChange}>
                            <Radio.Button value="总计" />
                            <Radio.Button value="内容" />
                        </Radio.Group>
                    </Layout.Col>
                    <Layout.Col span="5">
                        <DateRangePicker
                            value={timeValue}
                            placeholder="选择日期范围"
                            align="left"
                            ref={e=>this.dateRangePicker = e}
                            onChange={date=>{
                                let newDate=this.bz_time(date);
                                this.dateRangePickerChange({newDate,getState});
                            }}
                            shortcuts={[{
                                text: '最近7天',
                                onClick: ()=> {
                                    const end = new Date();
                                    const start = new Date();
                                    end.setTime(end.getTime() + 3600 * 1000 * 24 );
                                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
                                    let newDate=this.bz_time([start,end]);
                                    this.dateRangePickerChange({newDate,getState});
                                    this.dateRangePicker.togglePickerVisible();
                                }
                            },{
                                text: '最近15天',
                                onClick: ()=> {
                                    const end = new Date();
                                    const start = new Date();
                                    end.setTime(end.getTime() + 3600 * 1000 * 24 );
                                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 14);
                                    let newDate=this.bz_time([start,end]);
                                    this.dateRangePickerChange({newDate,getState});
                                    this.dateRangePicker.togglePickerVisible();
                                }
                            }, {
                                text: '最近一个月',
                                onClick: ()=> {
                                    const end = new Date();
                                    const start = new Date();
                                    end.setTime(end.getTime() + 3600 * 1000 * 24 );
                                    start.setTime(start.getTime() + 3600 * 1000 * 24);
                                    start.setMonth(start.getMonth()-1);
                                    let newDate=this.bz_time([start,end]);
                                    this.dateRangePickerChange({newDate,getState});
                                    this.dateRangePicker.togglePickerVisible();
                                }
                            }, {
                                text: '最近三个月',
                                onClick: ()=> {
                                    const end = new Date();
                                    const start = new Date();
                                    end.setTime(end.getTime() + 3600 * 1000 * 24 );
                                    start.setTime(start.getTime() + 3600 * 1000 * 24);
                                    start.setMonth(start.getMonth()-3);
                                    let newDate=this.bz_time([start,end]);
                                    this.dateRangePickerChange({newDate,getState});
                                    this.dateRangePicker.togglePickerVisible();
                                }
                            }]}
                        />
                    </Layout.Col>
                    <Layout.Col span="6">
                        <Select value='' onChange={this.largeProcessChange}>
                            <Select.Option label='全部流程' value=""/>
                            {largeProcessList.map(item=>{
                                return(
                                    <Select.Option label={item.name} value={JSON.stringify(item)} key={item.id}/>
                                )
                            })}
                        </Select>
                    </Layout.Col>
                    <Layout.Col span="3">
                        <Select value='' onChange={this.smallProcessChange}>
                            <Select.Option label='全部步骤' value=""/>
                            {smallProcessList.map(item=>{
                                let {name,id}=item.smallProcess;
                                return(
                                    <Select.Option label={name} value={id} key={id}/>
                                )
                            })}
                        </Select>
                    </Layout.Col>
                    <Layout.Col span="7" style={{margin:'4.5px 0'}}>
                        <Switch
                            width='120'
                            value={dels >0}
                            onText='展示删除内容' offText='隐藏删除内容'
                            onColor="#13ce66" offColor="#ff4949"
                            onChange={this.props.del}>
                        </Switch>{' '}
                        <Switch
                            width='120'
                            value={ifInvalid !=1}
                            onText='展示有效内容' offText='隐藏有效内容'
                            onColor="#13ce66" offColor="#ff4949"
                            onChange={this.props.ifInvalid}>
                        </Switch>
                    </Layout.Col>
                </Layout.Row>
                <Layout.Row gutter="10" style={{margin: "8px 0"}}>
                    <Layout.Col span="6">
                        人员:{' '}
                        <NewPersonSelection pe='统计他人的工作情况' callback={this.selectManage} type={2} classNum={1}/>
                    </Layout.Col>
                    <Layout.Col span="6">
                        小组:{' '}
                        <Select value='' onChange={this.selectGroupTalent}>
                            <Select.Option label='全部' value=""/>
                            {getState.groupTalent.map(item=>{
                                return(
                                    <Select.Option label={item.name} value={item.id} key={item.id}/>
                                )
                            })}
                        </Select>
                    </Layout.Col>
                    <Layout.Col span="6">
                        渠道:
                        <Select value='0' onChange={this.selectContentModeId} disabled={!largeProcessId}>
                            <Select.Option label='全部' value="0"/>
                            {contentModeList.map(item=>{
                                let {name,id}=item.contentMode;
                                return(
                                    <Select.Option label={name} value={id} key={id}/>
                                )
                            })}
                        </Select>
                    </Layout.Col>
                    <Layout.Col span="6">
                        状态:{' '}
                        <Select value={state!==undefined?state:-1} onChange={this.selectState}>
                            {getState.contentState.map(item=>{
                                return(
                                    <Select.Option label={item.title} value={item.state} key={item.state}/>
                                )
                            })}
                        </Select>
                    </Layout.Col>
                </Layout.Row>
            </div>
        )
    }
}

class ListConten extends React.Component {
    constructor(props) {
        super(props);
        let date = new Date();
        let dateEnd = new Date();
        date.setDate(date.getDate() - 7);
        this.state = {
            groupTalent: [],
            parameter: {
                contentModeId: 0,
                pageNow: 1,
                pageSize: 20,
                count: 0,
                state: undefined,
                creator: 0,
                typeTab: undefined,
                addTimeStart: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
                addTimeEnd: dateEnd.getFullYear() + "-" + (dateEnd.getMonth() + 1) + "-" + dateEnd.getDate(),
                auditStart: undefined,
                auditEnd: undefined,
                submitDateStart: undefined,
                submitDateEnd: undefined,
                passDateStart: undefined,
                passDateEnd: undefined,
                auditor: undefined,
                type: undefined,
                dels: 0,
                ifInvalid: 1,//有效无效按钮
                largeProcessId: '',//流程id
                smallProcessId: '',//步骤id
                groupId: '',//小组id
                manageId: 0,//人员或小组id
                model:2,
            },
            timeName: "步骤提交时间",
            dateChooseModes: [
                {name: "步骤提交时间", start: "addTimeStart", end: "addTimeEnd"},
                {name: "提交审核时间", start: "submitDateStart", end: "submitDateEnd"},
                {name: "审核通过时间", start: "auditStart", end: "auditEnd"},
                {name: "平台接收时间", start: "passDateStart", end: "passDateEnd"}],
            contents: [],
            groupEffectAnalyseList: [],//列表数据
            contentState: [
                {state: -1, title: "全部"}, {state: 0, title: "草稿箱"},
                {state: 1, title: "待审核"}, {state: 2, title: "审核失败"},
                {state: 3, title: "待发布"}, {state: 4, title: "已发布"},
                {state: 5, title: "待修改"}, {state: 6, title: "通过"},
                {state: 7, title: "已修改"}, {state: 8, title: "待同步"}
            ],
            FullName: "全部",
            FullNames: "全部",
            columnsTotal:[
                {
                    label: '人员',
                    prop: 'manageId',
                    render: (data)=>this.findManageName(data['manageId'])
                },{
                    label: '文案条数',
                    prop: 'count',
                }
            ],
            columns:[
                {
                    label: "ID",
                    prop: "id",
                    minWidth:"80px",
                },{
                    label: "渠道",
                    prop: "contentModeId",
                    minWidth:"120px",
                    render: (data)=>{
                        if(data.content){
                            return this.findContentModeName(data.content['contentModeId'])
                        }
                    }
                }, {
                    label: "类别",
                    prop: "typeTab",
                    minWidth:"50px",
                    render:(data)=>{
                        if(data.content){
                            return data.content["typeTab"]
                        }
                    }
                },{
                    label: "小组",
                    prop: "creator",
                    minWidth:"80px",
                    render: (data)=>{
                        if(data.content){
                            return this.findManageName(data.content['creator'])
                        }
                    }
                }, {
                    label: '人员',
                    prop: 'manageId',
                    minWidth:"80px",
                    render: (data)=>this.findManageName(data['manageId'])
                }, {
                    label: '封面',
                    prop: 'picUrl',
                    minWidth:"200px",
                    render: (data)=>{
                        if(data.content&&data.content['picUrl']){
                            return <img src={data.content['picUrl']} style={{maxWidth: "200px", maxHeight: "150px"}}/>
                        }
                    }
                }, {
                    label: '标题',
                    prop: 'title',
                    minWidth:"150px",
                    render: (data)=>{
                        if(data.content){
                            return data.content['title']
                        }
                    }
                }, {
                    label: '添加时间',
                    prop: 'addTime',
                    minWidth:"88px",
                    render: (data)=>{
                        if(data.content){
                            return data.content['addTime']
                        }
                    }
                }, {
                    label:'步骤提交时间',
                    prop: 'submitDate',
                    minWidth:"88px",
                    render:(data)=>{
                        let {timeName}=this.state;
                        if(timeName == "步骤提交时间"){
                            return <div>{data.smallProcessDate}</div>;
                        }else if(timeName == "提交审核时间"&&data.content){
                            return <div>{data.content.submitDate}</div>;
                        }else if(timeName == "审核通过时间"&&data.content){
                            return <div>{data.content.auditorPassDate}</div>;
                        }else if(timeName == "平台接收时间"&&data.content){
                            return <div>{data.content.passDate}</div>
                        }else {
                            return '';
                        }
                    }
                }, {
                    label: '审核人员',
                    prop: 'auditor',
                    minWidth:"80px",
                    render:(data)=>{
                        if(data.content){
                            let m=PersonSelection.getManage(data.content['auditor'],()=>{
                                this.forceUpdate();
                            });
                            return <div>{m&&m.name}</div>
                        }
                    }
                }, {
                    label: '工作流程',
                    prop: 'largeProcessName',
                    minWidth:"80px",
                },{
                    label: '步骤',
                    prop: 'smallProcessName',
                    minWidth:"66px",
                },{
                    label: '状态',
                    prop: 'state',
                    minWidth:"66px",
                    render:(data)=>{
                        if(data.content){
                            let st = "";
                            switch (data.content['state']) {
                                case 0 :
                                    st = "草稿箱";
                                    break;
                                case 1 :
                                    st = "待审核";
                                    break;
                                case 2 :
                                    st = "审核失败";
                                    break;
                                case 3 :
                                    st = "待发布";
                                    break;
                                case 4 :
                                    st = "已发布";
                                    break;
                                case 5 :
                                    st = "待修改";
                                    break;
                                case 6 :
                                    st = "通过";
                                    break;
                                case 7 :
                                    st = "已修改";
                                    break;
                                case 8 :
                                    st = "待同步";
                                    break;
                            }
                            return(
                                <div>{st}</div>
                            )
                        }
                    }
                }
            ],
        }
    }

    rowClassName=(row)=> {
        if(row.content){
            let btnClass = "";
            switch (row.content['state']) {
                case 0 :
                    btnClass = "secondary";
                    break;
                case 1 :
                    btnClass = "warning";
                    break;
                case 2 :
                    btnClass = "alert";
                    break;
                case 3 :
                    btnClass = "default";
                    break;
                case 4 :
                    btnClass = "success";
                    break;
                case 5 :
                    btnClass = "info";
                    break;
                case 6 :
                    btnClass = "purple";
                    break;
                case 7 :
                    btnClass = "synchronization";
                    break;
                case 8 :
                    btnClass = "default";
                    break;
            }
            return btnClass;
        }
    };

    setThisState = (state, callback) => {
        this.setState(state,  ()=> {
            if (callback && (typeof callback) == 'function') {
                callback();
            }
        });
    };
    goPage = (pageNow) => {//分页
        let {parameter} = this.state;
        parameter.pageNow = pageNow;
        this.setState({parameter},this.listData)
    };

    goSize=(pageSize)=>{//单页数
        let {parameter} = this.state;
        parameter.pageSize = pageSize;
        this.setState({parameter},this.listData)
    };

    listData = (callback) => {//列表
        this.workListAJAX.ajax({
            url: '/content/admin/content/queryGroupEffectAnalyseList.io',
            data: this.state.parameter,
            callback: ({parameter,groupEffectAnalyseList}) => {
                console.log('parameter',parameter);
                console.log('groupEffectAnalyseList',groupEffectAnalyseList);
                this.setState({parameter, groupEffectAnalyseList}, callback);
            }
        });
    };

    componentDidMount = () => {
        this.queryManageByType(() => {
            let {governmentManage} = this.props;
            let {parameter} = this.state;
            if (governmentManage) {
                if (governmentManage.length < 2) {
                    parameter.creator = governmentManage[0].id;
                    this.setState({parameter}, () => {
                        this.listData();
                    });
                } else {
                    this.listData();
                }
            }
        });
    };

    queryManageByType = (callback) => {//获取所有小组
        this.workListAJAX.ajax({
            type: 'post',
            url: '/user/admin/visible/queryManageByType.io',
            data: {},
            callback: (json) => {
                this.setState({groupTalent: json.talent}, callback);
            }
        });
    };
    setPaDateState = (s) => {
        let {parameter,columns} = this.state;
        this.setState({timeName: s.name},()=>{
            columns[8].label=s.name == "添加时间" ? "" : s.name;
            this.setState({columns},()=>{
                for (let i in s) {
                    parameter[i] = s[i];
                }
                this.setState({parameter: parameter}, this.listData);
            })
        });
    };

    findContentModeName = (id) => {
        let {contentMode} = this.props;
        for (let i in contentMode) {
            let {type,name}=contentMode[i];
            if (contentMode[i].id == id) {
                return (type == 1 ? "帖子" : type == 2 ? "清单" : type == 3 ? "好货" : "") + "-" + name;
            }
        }
        return ''
    };

    findManageName = (id) => {
        let {governmentManage,getGovernmentManage} = this.props;
        if (governmentManage.length > 0) {
            for (let i in governmentManage) {
                if (governmentManage[i].id == id) {
                    return governmentManage[i].name;
                }
            }
            getGovernmentManage(id);
        }
    };

    patternChange=(value)=>{
        let {parameter}=this.state;
        if(value=='总计'){
            parameter.model=2;
        }else if(value=='内容'){
            parameter.model=1;
        }
        this.setState({parameter}, this.listData)
    };

    render() {
        let {governmentManage}=this.props;
        let {parameter,groupEffectAnalyseList,columns,columnsTotal}=this.state;
        return (
            <div>
                <DateChoose setPaDateState={this.setPaDateState} getState={this.state} listData={this.listData} governmentManage={governmentManage}
                            setPaState={this.setThisState} del={(value) => {parameter.dels = (value? 1 : 0);this.setState({parameter}, this.listData)}}
                            ifInvalid={(value) => {parameter.ifInvalid = (value? '' : 1);this.setState({parameter}, this.listData)}}
                            patternChange={this.patternChange} workListAJAX={this.workListAJAX}/>
                <AJAX ref={e => this.workListAJAX = e}>
                    <div>
                        <Alert title={`统计!当前条件共有${parameter.count}条数据`} type="info" />
                        {parameter.model==1?
                        <Table style={{width: '100%'}} rowClassName={this.rowClassName}
                            columns={columns} data={groupEffectAnalyseList}
                            border={true} className="contentList"/>:
                            <Table
                                style={{width: '40%',left:'30%',margin:'10px 0 0'}}
                                columns={columnsTotal} data={groupEffectAnalyseList}
                                border={true}
                            />}
                    </div>
                </AJAX>
                <div style={{marginTop:'10px'}}>
                    <Pagination layout="total, sizes,prev, pager, next, jumper" total={parameter.count} pageSizes={[20, 40, 60]}
                                onSizeChange={this.goSize} pageSize={parameter.pageSize} currentPage={parameter.pageNow} onCurrentChange={this.goPage}/>
                </div>
            </div>
        )
    }
}

class GroupWorkList extends ReactChild {
    constructor(props) {
        super(props);
        this.state = {
            contentMode: [],
            governmentManage: []
        }
    }

    getGovernmentManage = (id, callback) => {
        if (id == 0) return;
        if (id) {
            this.listContent.workListAJAX.ajax({
                url: "/user/admin/user/user.manage.info.io",
                data: {id: id, type: 1},
                callback: (data) => {
                    let {governmentManage} = this.state;
                    governmentManage.push(data);
                    this.setState({governmentManage}, () => {
                        if (callback && typeof callback == "function") {
                            callback();
                        }
                    });
                }
            });
        }
    };
    componentDidMount = () => {
        this.getManage(() => {
            this.getContentMode();
        });
    };

    getUser=(callback,num=1,arr=[])=>{
        Ajax({
            url: '/user/admin/user/queryManageList.io',
            data: {name:'', pageNow: num, pageSize: 100,type:0,pe: "统计他人的工作情况"},
            isCloseMask: true,
            callback: (json)=> {
                let n=Math.ceil((json.count)/json.pageSize);
                arr=arr.concat(json.talent);
                if(n>num){
                    this.getUser(callback,num+1,arr);
                }else {
                    callback(arr);
                }
            }
        });
    };

    getManage = (callback) => {
        this.getUser((talent)=>{
            if (talent.length > 1) {
                talent.unshift({id: 0, name: "全部"});
            }
            this.setState({governmentManage: talent}, callback);
        });
    };
    getContentMode = (callback) => {
        Ajax({
            url: "/content/admin/content/listContentModeByOrgId.io",
            data: {},
            isCloseMask: true,
            callback: (data) => {
                if (data.length > 1) data.unshift({id: 0, name: "全部"});
                this.setState({contentMode: data}, callback);
            }
        });
    };

    render() {
        let {contentMode,governmentManage}=this.state;
        return (
            <div>
                {(contentMode.length > 0 && governmentManage.length > 0) &&
                <ListConten governmentManage={governmentManage} ref={e=>this.listContent=e}
                            getGovernmentManage={this.getGovernmentManage} contentMode={contentMode}/>}
            </div>
        )
    }
}

export default GroupWorkList;
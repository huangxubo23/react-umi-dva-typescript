/**
 * Created by shiying on 18-9-11.
 */

require('../../../../../../../../styles/addList/content.css');
import React from 'react';
import ReactChild from "../../../../../../../lib/util/ReactChild";
import {PersonSelection,NewPersonSelection} from '../../../../../components/PersonSelection';
import { Pagination,Loading,Layout,Input,Upload,DateRangePicker,Switch,Select,Button,Table,Alert,Radio} from 'element-react';
import AJAX from '../../../../../../../lib/newUtil/AJAX.js';
import 'element-theme-default';

class DateChoose extends React.Component {
    constructor(props) {
        super(props);
        let dateStart = new Date();
        let dateEnd = new Date();
        dateStart.setDate(dateStart.getDate() - 7);
        this.state = {
            contentMode: [],
            dateChooseMode: [
                {name: "添加时间", start: "addTimeStart", end: "addTimeEnd"},
                {name: "提交审核时间", start: "submitDateStart", end: "submitDateEnd"},
                {name: "审核通过时间", start: "auditStart", end: "auditEnd"},
                {name: "平台接收时间", start: "passDateStart", end: "passDateEnd"}],
            present: 0,
            start: dateStart.getFullYear() + "-" + (dateStart.getMonth() + 1) + "-" + dateStart.getDate(),
            end: dateEnd.getFullYear() + "-" + (dateEnd.getMonth() + 1) + "-" + dateEnd.getDate(),
            title:"",
            pattern:'总计'
        }
    }

    selectPresent = (i) => {//choose
        this.setState({present: i}, this.setPa);
    };

    setPa = () => {
        let {dateChooseMode,present,start,end,title} = this.state,s = {};
        for (let i = 0; i < dateChooseMode.length; i++) {
            if (i == present) {
                Object.assign(s,{
                    [dateChooseMode[i].start]:start,
                    [dateChooseMode[i].end]:end,
                    name:dateChooseMode[i].name,
                    title
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

    selectTypeContentMode = (value) => {//type搜索
        let {getState,listData,setPaState}=this.props;
        let {parameter}=getState;
        parameter.type = value;
        setPaState({parameter}, () => {
            if (parameter.creator && value) {
                listData(this.getListData());
            } else {
                let {parameter} = this.props.getState;
                parameter.contentModeId = 0;
                setPaState({parameter},() => listData());
            }
        });
    };

    getListData = (callback) => {
        let {parameter} = this.props.getState;
        //提交审核时间
        if (parameter.submitDateStart) {
            parameter.addTimeStart = parameter.submitDateStart;
        }
        if (parameter.submitDateEnd) {
            parameter.addTimeEnd = parameter.submitDateEnd;
        }
        //审核通过时间
        if (parameter.auditStart) {
            parameter.addTimeStart = parameter.auditStart;
        }
        if (parameter.auditEnd) {
            parameter.addTimeEnd = parameter.auditEnd;
        }
        //平台接收时间
        if (parameter.passDateStart) {
            parameter.addTimeStart = parameter.passDateStart;
        }
        if (parameter.passDateEnd) {
            parameter.addTimeEnd = parameter.passDateEnd;
        }
        this.props.workListAJAX.ajax({
            url: "/content/admin/content/getContentModeByCreatorAndType.io",
            data: parameter,
            async: true,
            callback: (json) => {
                this.setState({contentMode: json}, callback);
            }
        });
    };
    selectContentModeId = (value) => {//主题搜索
        let {getState,setPaState,listData} = this.props;
        let {parameter}=getState;
        parameter.contentModeId = value;
        setPaState({parameter},() => listData());
    };
    selectManage = (value) => {//人员改变事件
        let {parameter} = this.props.getState;
        let type = parameter.type;
        parameter.creator = value;
        this.props.setPaState({parameter}, () => {
            if (type && value) {
                this.props.listData(this.getListData());
            } else {
                let {parameter} = this.props.getState;
                parameter.contentModeId = 0;
                this.props.setPaState({parameter}, () => {
                    this.props.listData();
                });
            }
        });
    };
    titleChange=(title)=>{//标题改变事件
        let {parameter} = this.props.getState;
        parameter.title = title;
        this.setState({title},()=>{
            this.props.setPaState({parameter});
        });
    };

    cleanSeek=()=>{//empty search
        let {parameter} = this.props.getState;
        parameter.title = '';
        this.setState({title:''},()=>{
            this.props.setPaState({parameter});
        });
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

    pre=(data,ju)=>{
        let {dateChooseMode}=this.state;
        if(ju){
            return dateChooseMode[data].name;
        }else {
            for (let num=0;dateChooseMode.length>num;num++){
                if(dateChooseMode[num].name==data){
                    return num;
                }
            }
        }
    };

    render() {
        let {getState}=this.props;
        let {dels,type='',creator,contentModeId,state}=getState.parameter;
        let {present,dateChooseMode=[],start,end,title,contentMode=[],pattern}=this.state;
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
                    {/*<Layout.Col span="24">
                        <Radio.Group value={this.pre(present,true)} onChange={(value)=>this.selectPresent(this.pre(value,false))} style={{width:'100%'}}>
                            {dateChooseMode.map((item,i) => {
                                return (
                                    <Radio.Button value={item.name} key={item.start}/>
                                )
                            })}
                        </Radio.Group>
                    </Layout.Col>*/}
                </Layout.Row>
                <Layout.Row gutter="10" style={{margin: "8px 0"}}>
                    <Layout.Col span="4">
                        <Radio.Group value={pattern} onChange={this.patternChange}>
                            <Radio.Button value="总计" />
                            <Radio.Button value="内容" />
                        </Radio.Group>
                    </Layout.Col>
                    <Layout.Col span="4" style={{margin:'4.5px 0'}}>
                        <Switch
                            width='120'
                            value={dels >0}
                            onText='展示删除内容' offText='隐藏删除内容'
                            onColor="#13ce66" offColor="#ff4949"
                            onChange={this.props.del}>
                        </Switch>
                    </Layout.Col>
                    <Layout.Col span="8">
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
                    <Layout.Col span="8">
                        <Input placeholder="请输入关键字搜索内容" value={title} onChange={this.titleChange} prepend={
                            <Button type="primary" onClick={this.cleanSeek}>清空</Button>
                        } append={<Button type="primary" icon="search" onClick={()=>this.props.listData()}>搜索</Button>}/>
                    </Layout.Col>
                </Layout.Row>
                <Layout.Row gutter="10" style={{margin: "8px 0"}}>
                    <Layout.Col span="6">
                        类型:{' '}
                        <Select value={type} onChange={this.selectTypeContentMode}>
                            <Select.Option label='全部' value={''}/>
                            <Select.Option label='帖子' value={1}/>
                            <Select.Option label='清单' value={2}/>
                            <Select.Option label='单品' value={3}/>
                            <Select.Option label='搭配' value={4}/>
                            <Select.Option label='结构体' value={7}/>
                            <Select.Option label='短视频' value={8}/>
                        </Select>
                    </Layout.Col>
                    <Layout.Col span="6">
                        人员:{' '}
                        <NewPersonSelection pe='统计他人的工作情况' callback={this.selectManage} type={1} classNum={1}/>
                    </Layout.Col>
                    <Layout.Col span="6">
                        渠道:{' '}
                        <Select value={contentModeId} onChange={this.selectContentModeId}
                                disabled={!(type && creator != 0)}>
                            <Select.Option label='请选择' value={0} disabled/>
                            {contentMode.map(item => {
                                return (
                                    <Select.Option label={item.name} value={item.id} key={item.id}/>
                                )
                            })}
                        </Select>
                    </Layout.Col>
                    <Layout.Col span="6">
                        状态:{' '}
                        <Select value={state!==undefined?state:-1} onChange={this.props.selectState}>
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

class ListContent extends React.Component {
    constructor(props) {
        super(props);
        let date = new Date();
        let dateEnd = new Date();
        date.setDate(date.getDate() - 7);
        this.state = {
            parameter: {
                contentModeId: 0,
                pageNow: 1,
                pageSize: 20,
                count: 0,
                title:'',
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
                model:2
            },
            timeName: "",
            dateChooseModes: [
                {name: "添加时间", start: "addTimeStart", end: "addTimeEnd"},
                {name: "提交审核时间", start: "submitDateStart", end: "submitDateEnd"},
                {name: "审核通过时间", start: "auditStart", end: "auditEnd"},
                {name: "平台接收时间", start: "passDateStart", end: "passDateEnd"}],
            contents: [],
            contentState: [
                {state: -1, title: "全部"},
                {state: 0, title: "草稿箱"},
                {state: 1, title: "待审核"},
                {state: 2, title: "审核失败"},
                {state: 3, title: "待发布"},
                {state: 4, title: "已发布"},
                {state: 5, title: "待修改"},
                {state: 6, title: "通过"},
                {state: 7, title: "已修改"},
                {state: 8, title: "待同步"}
            ],
            FullName: "全部",
            FullNames: "全部",
            columnsTotal:[{
                label: '人员',
                prop: 'creator',
                render: (data)=>this.findManageName(data['creator'])
            },{
                label: '文案条数',
                prop: 'count',
            }],
            columns: [
                {
                    label: "ID",
                    prop: "id",
                    minWidth:"72px",
                },{
                    label: "渠道",
                    prop: "contentModeId",
                    minWidth:"120px",
                    render: (data)=>this.findContentModeName(data['contentModeId'])
                }, {
                    label: "类别",
                    prop: "typeTab",
                    minWidth:"50px",
                }, {
                    label: '人员',
                    prop: 'creator',
                    minWidth:"80px",
                    render: (data)=>this.findManageName(data['creator'])
                }, {
                    label: '封面',
                    prop: 'picUrl',
                    minWidth:"200px",
                    render: (data)=>{
                        if(data['picUrl']){
                            return <img src={data['picUrl']} style={{maxWidth: "200px", maxHeight: "150px"}}/>
                        }
                    }
                }, {
                    label: '标题',
                    prop: 'title',
                    minWidth:"200px",
                }, {
                    label: '添加时间',
                    prop: 'addTime',
                    minWidth:"100px",
                }, {
                    label: ()=>this.state.timeName == "添加时间" ? "" : this.state.timeName,
                    prop: 'submitDate',
                    minWidth:"100px",
                    render:(data)=>{
                        let {timeName}=this.state;
                        if(timeName == "提交审核时间"){
                            return <div>{data.submitDate}</div>;
                        }else if(timeName == "审核通过时间"){
                            return <div>{data.auditorPassDate}</div>;
                        }else if(timeName == "平台接收时间"){
                            return <div>{data.passDate}</div>;
                        }else {
                            return '';
                        }
                    }
                }, {
                    label: '审核人员',
                    prop: 'auditor',
                    minWidth:"80px",
                    render:(data)=>{
                        let m=PersonSelection.getManage(data['auditor'],()=>{
                            this.forceUpdate();
                        });
                        return <div>{m&&m.name}</div>
                    }
                }, {
                    label: '状态',
                    prop: 'state',
                    minWidth:"100px",
                    render:(data)=>{
                        let st = "";
                        switch (data['state']) {
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
                            <div>
                                <div>{st}</div>
                                {data.isDelete && <span className="label" onClick={()=>this.recover(data.id)}
                                                        style={{cursor: "pointer",color:'#afaf9b'}}>已删除，点击恢复</span>}
                            </div>
                        )
                    }
                }
            ],
        }
    }

    rowClassName=(row)=> {
        let btnClass = "";
        switch (row['state']) {
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
    };

    setThisState = (state, callback) => {//其他组件用的set状态
        this.setState(state, ()=> {
            if (callback && (typeof callback) == 'function') {
                callback();
            }
        })
    };

    goPage = (pageNow) => {
        let {parameter} = this.state;
        parameter.pageNow = pageNow;
        this.setState({parameter}, () => this.listData())
    };

    goSize=(pageSize)=>{
        let {parameter} = this.state;
        parameter.pageSize = pageSize;
        this.setState({parameter}, () => this.listData())
    };

    listData = (callback) => {
        let {parameter}=this.state;
        this.workListAJAX.ajax({
            url: "/content/admin/domain.content.list.work.io",
            data: parameter,
            callback: (json) => {
                this.setState(json, callback);
            }
        });
    };

    componentDidMount (){
        this.listData();
    }

    setPaDateState = (s) => {
        let {parameter,columns} = this.state;
        this.setState({timeName: s.name},()=>{
            columns[7].label=s.name == "添加时间" ? "" : s.name;
            this.setState({columns},()=>{
                for (let i in s) {
                    parameter[i] = s[i];
                }
                this.setState({parameter}, this.listData);
            })
        });
    };
    selectState = (value) => {
        let {parameter} = this.state;
        parameter.state = value==-1?undefined:value;
        this.setState({parameter}, this.listData);
    };
    findContentModeName = (id) => {
        let {contentMode} = this.props;
        for (let i in contentMode) {
            if (contentMode[i].id == id) {
                return (contentMode[i].type == 1 ? "帖子" : contentMode[i].type == 2 ? "清单" : contentMode[i].type == 3 ? "好货" : "") + "-" + contentMode[i].name;
            }
        }
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
    recover = (id) => {
        this.workListAJAX.ajax({
            url: "/content/admin/content/domain.content.recover.io",
            data: {id},
            callback: () => {
                this.listData();
            }
        });
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
        let {parameter,contents,columns,columnsTotal}=this.state;
        return (
            <div>
                <DateChoose setPaDateState={this.setPaDateState} getState={this.state} listData={this.listData} selectState={this.selectState}
                            governmentManage={this.props.governmentManage} workListAJAX={this.workListAJAX}
                            setPaState={this.setThisState} del={(value) => {parameter.dels = (value? 1 : 0);this.setState({parameter}, this.listData)}}
                            patternChange={this.patternChange}/>
                <AJAX ref={e => this.workListAJAX = e}>
                    <div>
                        <Alert title={`统计!当前条件共有${parameter.count}条数据`} type="info" />
                        {parameter.model==1?<Table
                            style={{width: '100%'}}
                            columns={columns} data={contents}
                            rowClassName={this.rowClassName}
                            border={true} className="contentList"
                        />:<Table
                            style={{width: '40%',left:'30%',margin:'10px 0 0'}}
                            columns={columnsTotal} data={contents}
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

class WorkList extends ReactChild{
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
           // this.getContentMode();
        });
    };

    getUser = (callback, num = 1, arr = []) => {
        this.listContent.workListAJAX.ajax({
            url: '/user/admin/user/queryManageList.io',
            data: {name:'', pageNow: num, pageSize: 100,type:0,pe: "统计他人的工作情况"},
            isCloseMask: true,
            callback: (json)=> {
                let page=Math.ceil((json.count)/json.pageSize);
                let newArr=[...arr,...json.talent];
                if(page>num){
                    this.getUser(callback,num+1,newArr);
                }else {
                    callback(newArr);
                }
            }
        });
    };
    getManage = (callback) => {
        this.getUser((talent) => {
            if (talent.length > 1) {
                talent.unshift({id: 0, name: "全部"});
            }
            this.setState({governmentManage: talent}, callback);
        });
    };
    // getContentMode = (callback) => {
    //     this.listContent.workListAJAX.ajax({
    //         url: "/content/admin/listContentModeByOrgId.io",//要访问的后台地址
    //         data: {},//要发送的数据
    //         callback: (data) => {
    //             if (data.length > 1) data.unshift({id: 0, name: "全部"});
    //             this.setState({contentMode: data}, callback);
    //         }
    //     });
    // };
    setThisState1 = (state, callback) => {//其他组件用的set状态
        this.setState(state,()=> {
            if (callback && typeof callback == 'function') {
                callback();
            }
        });
    };

    render() {
        let {contentMode,governmentManage}=this.state;
        return (
            <div>
                <ListContent ref={e=>this.listContent=e} governmentManage={governmentManage} setThisState1={this.setThisState1}
                            getGovernmentManage={this.getGovernmentManage} contentMode={contentMode}/>
            </div>
        )
    }
}

export default WorkList;
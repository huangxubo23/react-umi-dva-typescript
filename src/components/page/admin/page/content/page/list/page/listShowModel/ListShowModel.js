/**
 * Created by shiying on 17-7-26.
 */

import React from 'react';
import {ajax} from '../../../../../../../../lib/util/ajax';
import {Message,Layout,MessageBox,Notification,Dialog} from 'element-react';
import * as ele from 'element-react';
import 'element-theme-default';
import ShowConten from '../../../../../../../../components/ShowConten';
import {getUrlPat} from "../../../../../../../../lib/util/global"
import FlagRemarks from '../../../../../../components/content/flagRemarks';
import {NewPersonSelection} from '../../../../../../components/PersonSelection';
import ReactChild from "../../../../../../../../lib/util/ReactChild";
import AJAX from '../../../../../../../../lib/newUtil/AJAX.js';
import {daren_list, darenId_change, newTemplate} from "../../../release/components/take";
import {dynamicAnalysis} from "../../../components/contentCurrency";
const Ajax = ajax.ajax;

class ListShowModels extends ReactChild {
    constructor(props) {
        super(props);
        this.state = {
            postShow: false,
            message: "",
            groupCrew: [],
            showContent: '',
            comments: [],
            //诊断参数
            authorizedPersonList:[],
            isDiagnosis:false,
            stepNumber:0,
            stepType:'success',
            visible:false
        }
    }

    messageChange = (value) => {
        this.setState({message: value})
    };

    componentDidMount() {

        daren_list((array)=>{
            this.setState({authorizedPersonList:array},()=>{
                if (!this.props.flowList) {
                    let newProps = this.props;
                    if (newProps.showContent) {
                        let feedId = newProps.showContent.feedId;
                        if (feedId) {
                            this.setState({manualReleaseUrl: "http://h5.m.taobao.com/content/detail.html?contentId=" + feedId})
                        }
                    }
                    if (newProps.showContent) {
                        this.getContentMode(newProps.showContent.contentModeId, (contentMode) => {
                            this.setState({contentMode: contentMode});
                        })
                    }
                }
            })
        });


    }

    componentWillReceiveProps(newProps) {
        if (!this.props.flowList) {
            if (newProps.showContent) {
                let feedId = newProps.showContent.feedId;
                if (feedId) {
                    this.setState({manualReleaseUrl: "http://h5.m.taobao.com/content/detail.html?contentId=" + feedId})
                }
            }
            if (newProps.showContent) {
                this.getContentMode(newProps.showContent.contentModeId, (contentMode) => {
                    this.setState({contentMode: contentMode});
                })
            }
        }

    }

    audit = ({state,smallProcess}) => {//内容列表审核
        let {showContent, message} = this.state;
        let data = {id: showContent.id, type: 1, state, message};
        if (smallProcess) {
            data.smallProcess = +smallProcess;
        }
        Ajax({
            url: "/content/admin/content/domain.content.audit.io",
            data: data,
            callback: () => {
                Notification({
                    title: '成功',
                    message: '提交审核成功',
                    type: 'success'
                });
                this.setState({message: ""},()=>{
                    this.close(() => {
                        this.props.getContentStatePreview();
                    });
                });
            }
        })
    };
    groupAudit = ({state,step}) => {//打回步骤||小组已完成
        let {showContent, message} = this.state,{groupId} = this.props;
        let id=showContent.id,data = {};
        if (groupId) {
            Object.assign(data,{contentId: id, step, message})
        } else {
            Object.assign(data,{id, state, message, smallProcess: step})
        }
        Ajax({
            url: `/content/admin/${groupId?'manageGroup/backFunction':'content/domain.content.audit'}.io`,
            data: data,
            callback: () => {
                Notification({
                    title: '成功',
                    message: '数据提交成功',
                    type: 'success'
                });
                this.setState({message: ""},()=>{
                    this.close(() => {
                        this.props.getContentStatePreview();
                    });
                });
            }
        })
    };
    auditTrue = ({state}) => {//小组审核通过
        let {showContent, message} = this.state;
        ajax.ajax({
            type: 'post',
            url: '/content/admin/manageGroup/backFunction.io',
            data: {contentId: showContent.id, step: '', message},
            callback: () => {
                ajax.ajax({
                    type: 'post',
                    url: '/content/admin/content/domain.content.audit.io',
                    data: {id: showContent.id, type: 1, state, message},
                    callback: () => {
                        Notification({
                            title: '成功',
                            message: '数据提交成功',
                            type: 'success'
                        });
                        this.setState({message: ""},()=>{
                            this.close(() => {
                                this.props.getContentStatePreview();
                            });
                        });
                    }
                });
            }
        });
    };

    copyContent = ({id}) => {
        Ajax({
            url: "/content/admin/content/domain.content.copy.io",
            data: {contentModeId: id, type: 1, id: this.state.showContent.id},
            callback: () => {
                this.close(()=>{
                    MessageBox.alert(`拷贝成功，请到草稿箱中查看`, '操作成功');
                    this.props.getContentStatePreview();
                });
            }
        });
    };
    getContentMode = (contentModeId, callback) => {
        let contentMode = this.props.contentMode;
        for (let i in contentMode) {
            if (contentMode[i].id === contentModeId) {
                if (callback) {
                    callback(contentMode[i].constraint);
                }
                return (contentMode[i].constraint);
            }
        }
        Ajax({
            url: "/content/admin/content/contentModeById.io",
            data: {id: contentModeId},
            callback: (data) => {
                if (callback) {
                    callback(data.constraint);
                }

            }
        });


    };
    getClassificationName = (value, contentModeId) => {
        let contentMode = this.getContentMode(contentModeId);
        for (let i in contentMode.classification) {
            for (let z in contentMode.classification[i].value) {
                if (contentMode.classification[i].value[z].value === value) {
                    return {
                        label: contentMode.classification[i].value[z].label,
                        parent: contentMode.classification[i].value[z].parent
                    };
                }
            }
        }
    };
    manualRelease = () => {
        let {manualReleaseUrl,showContent} = this.state;
        let stateFeedId = showContent.feedId;
        if (manualReleaseUrl || stateFeedId) {
            let feedId = manualReleaseUrl ? getUrlPat(manualReleaseUrl, "contentId") : stateFeedId;
            if (feedId) {
                this.showContentAJAX.ajax({
                    url: "/content/admin/content/domain.content.releaseSuccess.io",
                    data: {feedId: feedId, id: this.state.showContent.id},
                    callback: () => {
                        Notification({
                            title: '成功',
                            message: '发布成功',
                            type: 'success'
                        });
                        this.close(() => {
                            this.props.getContentStatePreview();
                        })
                    }
                });
            } else {
                Notification({
                    title: '警告',
                    message: '发布连接有误',
                    type: 'warning'
                });
            }
        } else {
            Notification({
                title: '警告',
                message: '请输入发布的连接',
                type: 'warning'
            });
        }
    };
    manualReleaseUrlChange = (value) => {
        this.setState({manualReleaseUrl:value});
    };

    close = (callback) => {
        this.setState({
            postShow: false,
            message: "",
            groupCrew: [],
            showContent: '',
            comments: [],
            isDiagnosis:false,
            stepNumber:0,
            stepType:'success',
            visible:false,
            authorizedPersonArray:undefined
        }, ()=>{
            if(callback){
                callback()
            }
        });
    };
    open=()=>{
        this.setState({postShow: true},()=>{
            this.showConten.setState({contentMode:this.props.contentMode,contentData:this.props.showContent.contentData,visible:false,diagnosisNumber:0})
            // this.setShowContent(this.props.showContent);
        });
    };

    groupCrewNameChange = (env) => {//组员名字搜索事件
        let name = env.target.value;
        this.setState({name: name});
    };

    groupCrewChange = (env) => {//手动保护选择组员事件
        let id = env.target.value;
        this.setState({manageId: id});

    };

    manualProtection = () => {//手动保护
        let {showContent,manageId}=this.state;
        let contentId = showContent.id;
        if (!manageId) {
            Notification({
                title: '警告',
                message: '手动保护组员不能为空',
                type: 'warning'
            });
            return false;
        }
        ajax.ajax({
            type: 'post',
            url: '/content/admin/manageGroup/manualProtection.io',
            data: {contentId, manageId},
            callback: () => {
                Notification({
                    title: '成功',
                    message: '手动保护成功',
                    type: 'success'
                });
                this.props.getContentStatePreview();
            }
        });
    };

    findContent = (id) => {//获取看数据（新添）
        let data = {id: id}, {groupId, contentType} = this.props;
        if (groupId) {
            Object.assign(data, {groupId});
        }
        let upload = setInterval(() => {
            if (this.showContentAJAX) {
                clearInterval(upload);
                this.showContentAJAX.ajax({
                    type: 'post',
                    url: '/content/admin/contentComments/getContentCommentsByContentId.io',
                    data: {contentId: id},
                    callback: (comments) => {
                        this.showContentAJAX.ajax({
                            url: `/content/admin/${contentType}/domain.content.find.io`,
                            data: data,
                            callback: (json) => {
                                if (json.darenId) {  //根据达人id返回达人名
                                    this.showContentAJAX.ajax({
                                        type: 'post',
                                        url: '/user/admin/visible/querytalentMessageByAccountId.io',
                                        data: {accountId: json.darenId},
                                        callback: (json20) => {
                                            json.darenTitle = json20.title;
                                            this.setState({showContent: json, comments: comments}, this.setShowContent(json))
                                        }
                                    });
                                } else {
                                    this.setState({showContent: json, comments: comments}, this.setShowContent(json))
                                }
                            }
                        });
                    }
                });
            }
        }, 100);
    };

    setShowContent = (json) => {
        let tt = [];
        let nameList=undefined;
        this.props.contentMode.forEach((item) => {
            if (item.id == json.contentModeId) {
                if(item.constraint instanceof Array){
                    tt = item.constraint;
                }else {
                    tt = item.constraint;
                    nameList=item.nameList;
                }
            }
        });
        this.showConten.setState({contentData: json.contentData, contentMode: tt,nameList:nameList,visible:false,diagnosisNumber:0},()=>{
            let number=0;
            let st=setInterval(()=>{
                let {authorizedPersonList,showContent}=this.state,{contentMode}=this.props;
                showContent=showContent?showContent:this.props.showContent;
                number++;
                if(authorizedPersonList.length>0){
                    clearInterval(st);
                    this.setState({authorizedPersonArray:this.takeNew({array:authorizedPersonList,darenIds:this.csObject({showContent,contentMode}).talentMessageIds})});
                }else {
                    if(number>5){
                        clearInterval(st);
                    }
                }
            },500);
        })
    };

    takeNew=({array,darenIds=[]})=>{//诊断&↓
        let authorized=[];
        array.forEach(item=>{
            if(darenIds.indexOf(item.id)>-1){
                authorized.push(item);
            }
        });
        return authorized;
    };

    authorizedPerson(value){
        this.setState({authorizedPerson:value,isDiagnosis:false});
    }

    diagnosisEvent=()=>{//诊断事件
        let {contentMode}=this.props,{showContent,diagnosisNumber=0,authorizedPerson,visible}=this.state;
        if(diagnosisNumber>2){
            Notification({
                title: '警告',
                message: '内容诊断次数过多，请刷新后进行诊断！',
                type: 'warning'
            });
            return false;
        }
        if(visible){
            return false;
        }
        this.diagnosticContent({talentId:authorizedPerson,nowContentMode:contentMode},({type,config,url,talentId})=>{
            if(type==='success'){
                dynamicAnalysis.dataReorganization({config,showContent,accountExec:{talentId},
                    callback:({newConfig,totalMessage})=>{
                        if(totalMessage){
                            this.step({number:2,type:'error'},()=>{
                                Notification({
                                    title: '消息',
                                    message: totalMessage,
                                    type: 'info'
                                });
                            });
                        }else {
                            this.step({number:2,type:'success'},()=>{
                                newTemplate.testingQuality({
                                    url:url,config:newConfig,callback:(array,qualityConfig)=>{
                                        if(array.length>0&&array[0].title=='内容校验失败，无法诊断'){
                                            this.step({number:3,type:'error'},()=>{
                                                Notification({
                                                    title: '警告',
                                                    message: '内容校验失败，请检查创作是否完整',
                                                    type: 'warning'
                                                });
                                            })
                                        }else {
                                            this.step({number:3,type:'success'},()=>{
                                                this.setState({tipsContent:array,visible:true,diagnosisNumber:diagnosisNumber+1},()=>{
                                                    Notification({
                                                        title: '消息',
                                                        message: '删除需要时间，请等待删除完成再关闭窗口！',
                                                        type: 'info'
                                                    });
                                                    setTimeout(()=>{
                                                        let qualityCheckUrl=qualityConfig.formData.qualityCheckUrl;
                                                        dynamicAnalysis.deleteContent({id:this.urlAnalysis(qualityCheckUrl).id},(data)=>{
                                                            this.step(data,()=>{

                                                            })
                                                        });
                                                    },4000)
                                                })
                                            })
                                        }
                                    }
                                })
                            })
                        }
                    }
                })
            }else {
                this.setState({isDiagnosis:true});
            }
        });
    };

    urlAnalysis = (url) => {//达人平台拿取数据参数
        let item = {};
        let arr = (url.split("?")[1]).split("&");
        for (let i in arr) {
            if (((arr[i].split("="))[0]) != "redirectURL") {
                item[((arr[i].split("="))[0])] = (arr[i].split("="))[1];
            }
        }
        return item;
    };

    diagnosticContent=({talentId,nowContentMode},callback)=>{
        if(talentId){
            darenId_change({talentId},()=>{
                let parameter=(url,obj={})=>{
                    let arr=url.split('&');
                    arr.forEach((item)=>{
                        let arr1=item.split('=');
                        if(arr1[0]=='activityId'){
                            obj[arr1[0]]=+arr1[1];
                        }else {
                            obj[arr1[0]]=arr1[1];
                        }
                    });
                    return obj;
                };
                newTemplate.getNewWeiTao(parameter(this.csObject({showContent:this.state.showContent,contentMode:nowContentMode}).url),(config)=>{
                    let qualityUrl='';
                    config.actions.forEach((item)=>{
                        if(item.name=='quality'){
                            qualityUrl=item.url;
                        }
                    });
                    if(qualityUrl){
                        this.step({number:1,type:'success'},()=>{
                            callback({type:'success',config,url:qualityUrl,talentId})
                        })
                    }else {
                        Notification({
                            title: '警告',
                            message: '该渠道或改账号无诊断接口，请勿再次尝试诊断！',
                            type: 'warning'
                        });
                        this.step({number:1,type:'error'},()=>{
                            callback({type:'fail'})
                        })
                    }
                },(isFewerTimes, callback)=>{
                    let text=isFewerTimes?'模板获取失败，是否重新获取？':'多次重新获取数据失败，可以尝试联系负责人重新授权解决';
                    MessageBox.confirm(text, '提示', {
                        type: 'info'
                    }).then(() => {
                        if(isFewerTimes){
                            callback();
                        }
                    }).catch(() => {
                        Notification({
                            title: '消息',
                            message: '已取消关闭标签',
                            type: 'info'
                        });
                    });
                });
            })
        }else {
            Notification({
                title: '警告',
                message: '没有选择达人账号，无法诊断！',
                type: 'warning'
            });
        }
    };

    step=({number,type},callback)=>{
        this.setState({stepNumber:number,stepType:type},callback)
    };

    csObject=({showContent,contentMode,obj={}})=>{
        if(showContent){
            contentMode.forEach((item,index)=>{
                if(showContent.contentModeId==item.id){
                    obj.talentMessageIds=item.talentMessageIds;
                    obj.url=item.url;
                }
            });
        }
        return obj;
    };

    quality=(array)=>{
        let str='';
        array.forEach(item=>{
            let str1='';
            item.value.forEach((img,index)=>{
                str1+=`【图${index+1}:${img}】`
            });
            str+=`${item.title}:${str1}`;
        });
        return str;
    };

    render() {
        let close = () => this.close();
        let {groupId, smallProcessList, contentMode,flowList,contentType} = this.props,
            {showContent, comments,authorizedPersonList,tipsContent,isDiagnosis,visible,stepNumber,stepType,authorizedPersonArray=[]} = this.state;
        showContent=showContent?showContent:this.props.showContent;
        let array = [], str = showContent ? showContent.smallProcessStr : '';
        let list = smallProcessList ? smallProcessList : [];
        if (str && list.length > 0) {//循环判断步骤id获取value
            for (let x = 0; x < list.length; x++) {
                for (let i = 0; i < str.length; i++) {
                    if (list[x].id == str[i].id) {
                        let obj = {};
                        obj.id = list[x].id;
                        obj.name = list[x].name;
                        obj.value = str[i].state;
                        array.push(obj);
                    }
                }
            }
        }
        //let authorizedPersonArray=showContent?this.takeNew({array:authorizedPersonList,darenIds:this.csObject({showContent,contentMode}).talentMessageIds}):authorizedPersonList;
        let columns = [
            {
                label: "名称",
                prop: "name",
                width: "60px",
            }, {
                label: "内容",
                prop: "value",
                render:(item)=>{
                    let {type}=item;
                    if(type=='title'){
                        return(
                            <ele.Input value={showContent[type]}/>
                        )
                    }else if(type=='contentModeName'){
                        return showContent[type];
                    }else if(type=='darenTitle'){
                        return showContent[type]?showContent[type]:'暂无（未发布）';
                    }else if(type=='typeTab'){
                        return <ele.Tag type="primary">{showContent[type]}</ele.Tag>
                    }else if(type=='picUrl'){
                        return showContent.picUrl ? <span><img width="150px" src={showContent.picUrl}/></span> : "无";
                    }else {
                        return '无'
                    }
                }
            }];
        let contents=[
            {name:'标题', type:'title'},
            {name:'模式', type:'contentModeName'},
            {name:'达人', type:'darenTitle'},
            {name:'类别', type:'typeTab'},
            {name:'封面', type:'picUrl'},
        ];
        return (
            <div>
                {/*<Dialog title="" size={this.props.listIdWith>1220?'small':"large"} style={this.props.listIdWith>1020&&this.props.listIdWith<1380?{width:'70%'}:''}
                        visible={this.state.postShow} onCancel={close} lockScroll={false} closeOnClickModal={false}>*/}
                <Dialog title="" size={this.props.listIdWith>1220?'small':"large"} style={{width:'1000px'}}
                        visible={this.state.postShow} onCancel={close} lockScroll={false} closeOnClickModal={false}>
                    <Dialog.Body>
                        <AJAX ref={e => this.showContentAJAX = e}>
                            <Layout.Row className="show-grid">
                                <Layout.Col span="14" className="listShowModelCol">
                                    <ShowConten ref={e => this.showConten = e} showZoom={true}/>
                                </Layout.Col>
                                {showContent&&<Layout.Col span="10" className="listShowModelCol">
                                    <ele.Table columns={columns} data={contents} border={true} stripe={true} style={{margin:'5px 0 5px'}}/>
                                    {(comments && comments.length > 0)&&<NewPanel header="点评" bsStyle="primary">
                                        {comments.map(item=> {
                                            return (
                                                <div key={item.id}>
                                                    <a href={window.location.origin + '/pc/visible/auditOpinion/show/' + item.id} target="_blank">查看点评</a>
                                                    {item.log&&item.log.split("\n\r").map((log, index) => {
                                                        return (
                                                            <div key={item.id+'-'+index}>{log}</div>
                                                        );
                                                    })}
                                                </div>

                                            )
                                        })}
                                    </NewPanel>}
                                    {showContent.message &&<ele.Alert title={showContent.message} type="error" />}
                                    {!flowList&&<div>
                                        {(!groupId && (showContent.audit || showContent.modifierAudit)) || (groupId && showContent.manageGrade) ?
                                            <NewPanel header="审核">
                                                <ele.Input type="textarea" value={this.state.message}
                                                           autosize={{ minRows: 4, maxRows: 6}}
                                                           placeholder="请输入审核理由" onChange={this.messageChange}/>
                                                <Layout.Row gutter="2" style={{margin:"5px 0"}}>{/*诊断*/}
                                                    <Layout.Col span="24">
                                                        <ele.Steps space={66} active={stepNumber} finishStatus={stepType}>
                                                            <ele.Steps.Step title="拿取模板"> </ele.Steps.Step>
                                                            <ele.Steps.Step title="提交数据"> </ele.Steps.Step>
                                                            <ele.Steps.Step title="校验完成"> </ele.Steps.Step>
                                                            <ele.Steps.Step title="删除完成"> </ele.Steps.Step>
                                                        </ele.Steps>
                                                    </Layout.Col>
                                                    <Layout.Col span="12">
                                                        <ele.Select value={this.state.authorizedPerson} placeholder="请选择达人号" onChange={this.authorizedPerson.bind(this)}>
                                                            {(authorizedPersonArray?authorizedPersonArray:[]).map(el => {
                                                                return <ele.Select.Option key={el.id} label={`${el.title}${!el.cookieIsFailure?'(账号不可用)':''}`} value={el.id} disabled={!el.cookieIsFailure}/>
                                                            })}
                                                        </ele.Select>
                                                    </Layout.Col>
                                                    <Layout.Col span="12">
                                                        {visible?
                                                        <ele.Popover placement="left" title={(tipsContent&&tipsContent.length>0)?`${tipsContent.length}个问题待优化`:""} width="400" style={{left:0}}
                                                                     trigger="click" visible={visible} content={(
                                                            <div>
                                                                {(tipsContent&&tipsContent.length>0)?
                                                                    <div>
                                                                        {tipsContent.map((item,index)=>{
                                                                            if(item.type=='picture'){
                                                                                return(
                                                                                    <div key={'tips-'+item.title}>
                                                                                        <span>{item.title}</span>
                                                                                        <Layout.Row gutter="2">
                                                                                            {item.value.map((val,v)=>{
                                                                                                return(
                                                                                                    <Layout.Col span="8" key={'tips-'+item.title+v}>
                                                                                                        <img src={val} style={{width:"100%",maxHeight:'120px'}}/>
                                                                                                    </Layout.Col>
                                                                                                )
                                                                                            })}
                                                                                        </Layout.Row>
                                                                                    </div>
                                                                                )
                                                                            }else {
                                                                                if(typeof item.value=='string'){
                                                                                    return(
                                                                                        <div key={'tips-'+item.title}>
                                                                                            <span>{item.title}</span>
                                                                                            <div>{item.value}</div>
                                                                                        </div>
                                                                                    )
                                                                                }
                                                                            }
                                                                        })}
                                                                        <ele.Button onClick={()=>{
                                                                            if(this.state.message.indexOf('【诊断结果】')<0){
                                                                                this.setState({message:`${this.state.message}【诊断结果】:${this.quality(tipsContent)}`})
                                                                            }else {
                                                                                Notification({
                                                                                    title: '消息',
                                                                                    message: '已经导出到审核理由',
                                                                                    type: 'info'
                                                                                });
                                                                            }
                                                                        }} type="primary">导出到审核理由</ele.Button>
                                                                    </div>:<div style={{fontWeight: 'bold'}}>完美通过</div>}
                                                            </div>
                                                        )}>
                                                            <ele.Button style={{width: '100%'}} type="primary">
                                                                点击查看结果
                                                            </ele.Button>
                                                        </ele.Popover>:
                                                        <ele.Button style={{width: '100%'}} type="primary" onClick={this.diagnosisEvent} disabled={isDiagnosis}>
                                                            {isDiagnosis?'请换达人号':'诊断'}
                                                        </ele.Button>}
                                                    </Layout.Col>
                                                </Layout.Row>
                                                <ele.Button.Group>
                                                    {/*权限审核=>方向②*/}
                                                    {!groupId&&(showContent.audit?
                                                        <ele.Button type="danger" onClick={()=>this.audit({state:2})}>失败</ele.Button>:
                                                        <ele.Button type="warning" onClick={()=>this.audit({state:5})}>需要修改</ele.Button>)}
                                                    {!groupId &&(showContent.audit ?
                                                        <ele.Button onClick={()=>this.audit({state:3})} type="primary">通过(待发布)</ele.Button>
                                                        : showContent.terraceAudit ?
                                                            <ele.Button onClick={()=>this.audit({state:6})} type="primary">平台接收</ele.Button> :
                                                            <ele.Button onClick={()=>this.audit({state:8})} type="primary">通过(待同步)</ele.Button>)}
                                                    {/*小组审核按钮开始②*/}
                                                    {groupId && <ele.Button onClick={this.groupAudit} type="primary">小组确定完成</ele.Button>}
                                                    {groupId && showContent && <ele.Button onClick={()=>this.auditTrue({state:3})} type="info">审核通过</ele.Button>}
                                                </ele.Button.Group>
                                                {/*小组步骤打回*/}
                                                {showContent.smallProcess &&<ele.Dropdown type="danger" onCommand={(id) => {
                                                    let state=showContent.audit ? 2 : showContent.modifierAudit ? 5 : '';
                                                    this.groupAudit({step: id,state});
                                                }} trigger="click" menu={(
                                                    <ele.Dropdown.Menu>
                                                        {(showContent.smallProcess ? showContent.smallProcess : []).map(tab => {
                                                            return (
                                                                <ele.Dropdown.Item key={tab.id} command={tab.id}>
                                                                    {tab.name}
                                                                </ele.Dropdown.Item>
                                                            )
                                                        })}
                                                    </ele.Dropdown.Menu>
                                                )}>
                                                    <ele.Button type="danger" style={{fontSize: '14px'}}>
                                                        打回到<i className="el-icon-caret-bottom el-icon--right"> </i>
                                                    </ele.Button>
                                                </ele.Dropdown>}
                                                {groupId && <div>
                                                    <Layout.Row gutter="2">
                                                        {array.map((item) => {
                                                            return (
                                                                <Layout.Col span="12" key={item.id}>
                                                                    <ele.Tag type={item.value ? "primary" : 'warning'}>
                                                                        {item.name}:{item.value ? '完成' : '未完成'}
                                                                    </ele.Tag>&nbsp;
                                                                </Layout.Col>
                                                            )
                                                        })}
                                                    </Layout.Row>
                                                </div>}
                                            </NewPanel> : ''}

                                        {!groupId && <NewPanel header="操作">
                                            {(!showContent.feedId && showContent.release)&&
                                            <ele.Button type="primary" style={{width:'100%',marginBottom:'10px'}} onClick={() => {
                                                window.open(`${window.location.origin}/pc/adm/content/newRelease/${contentType}/release/${showContent.id}`);
                                            }}>发布至达人</ele.Button>}
                                            {(!showContent.feedId && showContent.release)&&
                                            <ele.Input placeholder="请输入备注" value={this.state.manualReleaseUrl} onChange={this.manualReleaseUrlChange}
                                                       append={<ele.Button type="success" onClick={this.manualRelease}>变绿</ele.Button>}/>}
                                            {(showContent.feedId && showContent.release)&&
                                            <ele.Button type="primary" style={{width:'100%',marginBottom:'10px'}} onClick={() => {
                                                window.open(`${window.location.origin}/pc/adm/content/newRelease/${contentType}/synchronization/${showContent.id}`);
                                            }}>同步至达人</ele.Button>}
                                            {(showContent.feedId && showContent.release)&&<Layout.Row gutter="2">
                                                <Layout.Col span="8">
                                                    <ele.Button type="primary" style={{width:'100%'}} onClick={this.manualRelease}>变绿</ele.Button>
                                                </Layout.Col>
                                                <Layout.Col span="8">
                                                    <ele.Button type="primary" style={{width:'100%'}} onClick={() => {
                                                        window.open(`http://h5.m.taobao.com/content/detail.html?contentId=${showContent.feedId}`);
                                                    }}>查看</ele.Button>
                                                </Layout.Col>
                                                <Layout.Col span="8">
                                                    <ele.Button type="primary" style={{width:'100%'}} onClick={() => {
                                                        window.open(`https://daren.taobao.com/creation/post?id=${showContent.feedId}`);
                                                    }}>编辑</ele.Button>
                                                </Layout.Col>
                                            </Layout.Row>}
                                            {!(showContent.feedId &&showContent.release)&&
                                            <ele.Button type="primary" style={{width:'100%',marginTop:'10px'}} onClick={() => {
                                                window.open(`http://h5.m.taobao.com/content/detail.html?contentId=${showContent.feedId}`);
                                            }}>查看</ele.Button>}
                                            <input id="contentId" type="hidden"
                                                   value={showContent.id}/>
                                            <input id="contentFeedId" type="hidden"
                                                   value={showContent.feedId}/>
                                        </NewPanel>}
                                        {/*小组手动保护开始*/}
                                        {(groupId && showContent.manageGrade )&&
                                            <NewPanel header="手动保护">
                                                <Layout.Row gutter="2">
                                                    <Layout.Col span="16">
                                                        <NewPersonSelection type={2} isWhole={true} callback={(id) => {
                                                            this.setState({manageId: id})
                                                        }}/>
                                                    </Layout.Col>
                                                    <Layout.Col span="8">
                                                        <ele.Button type="primary" onClick={this.manualProtection}>保护此条内容</ele.Button>
                                                    </Layout.Col>
                                                </Layout.Row>
                                            </NewPanel>}
                                        {/*小组手动保护结束*/}
                                        <NewPanel header="标记备注">
                                            <FlagRemarks ref="fremarks" goPage={this.props.goPage}
                                                         pageNow={this.props.pageNow} data={{
                                                id: showContent.id,
                                                remarks: showContent.remarks,
                                                flag: showContent.flag,
                                                submitButton: true
                                            }}/>
                                        </NewPanel>
                                        <NewPanel header="日志">
                                            {showContent.log && showContent.log.split("\n\r").map((item, i) => {
                                                return (
                                                    <div key={i}>{item}</div>
                                                );
                                            })}
                                        </NewPanel>
                                        {!groupId&&
                                        <NewPanel header="拷贝">
                                            <ele.Dropdown type="primary" onCommand={(id) => {
                                            this.copyContent({id});
                                        }} trigger="click" menu={(
                                            <ele.Dropdown.Menu>
                                                {(contentMode ? contentMode : []).map(tab => {
                                                    return (
                                                        <ele.Dropdown.Item key={tab.id} command={tab.id}>
                                                            {tab.name}
                                                        </ele.Dropdown.Item>
                                                    )
                                                })}
                                            </ele.Dropdown.Menu>
                                        )}>
                                            <ele.Button type="primary" style={{fontSize: '14px'}}>
                                                拷贝成一个新的内容<i className="el-icon-caret-top el-icon--right"> </i>
                                            </ele.Button>
                                        </ele.Dropdown>
                                        </NewPanel>}
                                    </div>}
                                </Layout.Col>}
                            </Layout.Row>
                        </AJAX>
                    </Dialog.Body>
                </Dialog>
            </div>
        )
    }
}

class NewPanel extends React.Component{
    render(){
        let {header}=this.props;
        return(
            <div style={{
                marginTop: "10px",
                marginBottom: '12px',
                backgroundColor: '#fff',
                border: '1px solid transparent',
                borderRadius: '4px',
                boxShadow: '0 1px 1px rgba(0, 0, 0, .05)',
                borderColor: '#337ab7'
            }}>
                <div style={{
                    padding: '1px 10px',
                    borderBottom: '1px solid transparent',
                    borderTopLeftRadius: '3px',
                    borderTopRightRadius: '3px',
                    color: '#fff',
                    backgroundColor: '#337ab7',
                    borderColor: '#337ab7',
                }}>
                    <h5>{header}</h5>
                </div>
                <div style={{
                    padding: '10px',
                }}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

ListShowModels.defaultProps = {};

export default ListShowModels;

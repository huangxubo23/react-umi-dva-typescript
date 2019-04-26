/**
 * Created by shiying on 18-5-2.
 */
import React from 'react';
import $ from 'jquery';
import {ThousandsOfCall} from "../../../../../components/lib/util/ThousandsOfCall";
import StringModule from "./StringModule";
import HintShow from './Hint';
import {MyAutoComplete} from '../../components/PersonSelection';
import {Layout,Input,Button,Dialog} from 'element-react';
import 'element-theme-default';

class ForwardModule extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    summaryChange = (value) => {
        let {constraint,onChange}=this.props;
        let titleHint = StringModule.hint(value, constraint.props);
        onChange(constraint, value, titleHint);
    };

    render() {
        let {constraint,value,hint,onChange}=this.props;
        let {minLength,maxLength,title,placeholder}=constraint.props;
        let num=`${value ? value.length : 0}/${minLength ? minLength : 0}/${maxLength ? maxLength : 0}`;
        return(
            <Layout.Row gutter="20" style={{margin:"8px 0"}}>
                <Layout.Col span="2" style={{fontWeight: 'bold'}}>
                    {this.props.modelSet && <Button type="primary" size='mini' onClick={this.props.modelOnChenge}>设置</Button>}
                    {constraint.title?constraint.title:"引导叙述"}
                </Layout.Col>
                <Layout.Col span="22">
                    <div>{title+"  "}<Button type="info" size="small" onClick={()=>{
                        this.topic.open();
                    }}>添加话题</Button></div>
                    <Input type="textarea" placeholder={placeholder} value={value}
                           onChange={this.summaryChange} rows={4}/>
                    <span style={{float: 'right', marginRight: '6px',color: '#e04444'}}> {num} </span>
                    <Topic ref={e=>this.topic=e} change={(data)=>{
                        let newValue = (value?value:"")+data;
                        let titleHint = StringModule.hint(newValue, constraint.props);
                        onChange(constraint, newValue, titleHint);
                    }}/>
                    <HintShow hint={hint}/>
                    {this.props.modelSet && <Button type="primary" onClick={() => {
                        let editPanel = this.props.editPanel;
                        editPanel.tabsName = this.props.tabsName;
                        this.props.modelOnChenge(editPanel);
                    }}>{constraint.title?constraint.title:"引导叙述"}</Button>}
                </Layout.Col>
            </Layout.Row>
        )

    }
}

class Topic extends React.Component{
    constructor(props){
        super(props);
        this.state={
            dialogVisible: false,
            topic:[],
            restaurants:[],
            value:''
        }
    }

    open=()=>{
        this.setState({dialogVisible:true},()=>{
            if(this.state.topic.length<1){
                this.getTopic();
                this.handleIconClick(true);
            }
        });
    };

    close=()=>{
        this.setState({dialogVisible:false});
    };

    getTopic=()=>{
        let data={
            "key":"",
            "pageSize":10,
            "type":2,
            "pageNo":1
        };
        let s = {
            type: "jsonp",
            dataType: "jsonp",
            api: "mtop.taobao.social.scene.query",
            v: "1.0",
            appKey: 12574478,
            t: new Date().getTime(),
            jsv: '2.4.3',
            callback:'mtopjsonp1',
            timeout: 300000
        };

        ThousandsOfCall.acoustic({
            parameters: s,
            requesData: data,
            host: "https://h5api.m.taobao.com/h5",
            ajaxData: {requeryType: "get",referer: "https://h5.m.taobao.com"}
        }, "requestH5", (response)=> {
            this.setState({topic:response.data.result});
        });
    };

    handleSelect(data) {
        this.setState({value: data.value});
    }

    querySearchAsync(queryString) {
        this.setState({value: queryString});
    }

    handleIconClick(judge) {
        let {value}=this.state;
        let data={
            "key":value,
            "pageSize":10,
            "type":3,
            "pageNo":1
        };
        let s = {
            type: "jsonp",
            dataType: "jsonp",
            api: "mtop.taobao.social.scene.query",
            v: "1.0",
            appKey: 12574478,
            t: new Date().getTime(),
            jsv: '2.4.3',
            callback:'mtopjsonp2',
            timeout: 300000,
            timer: 300000
        };

        ThousandsOfCall.acoustic({
            parameters: s,
            requesData: data,
            host: "https://h5api.m.taobao.com/h5",
            ajaxData: {requeryType: "get",referer: "https://h5.m.taobao.com"}
        }, "requestH5", (response)=> {
            this.setState({restaurants:response.data.result.map(item=>{return{value:item.title,id:item.id}})},()=>{
                if(!judge){
                    $(`.my-el-autocomplete1`).find("input").focus();
                }
            });
        });
    };

    render(){
        let {dialogVisible,topic,restaurants,value}=this.state;
        return (
            <Dialog title="添加话题" size="tiny" visible={dialogVisible}
                    onCancel={() =>this.setState({ dialogVisible: false})}
                    lockScroll={false} style={{textAlign:'left'}}>
                <Dialog.Body>
                    <Layout.Row gutter="20" style={{margin:"5px 0"}}>
                        <Layout.Col span="20">
                            <MyAutoComplete data={restaurants} style={{marginLeft: "0",width:'100%'}} width={true}
                                            placeholder="输入字段搜索话题..." value={value} className='auto'
                                            fetchSuggestions={this.querySearchAsync.bind(this)} icon="search" classNum={1}
                                            select={this.handleSelect.bind(this)} iconClick={this.handleIconClick.bind(this)}/>
                        </Layout.Col>
                        <Layout.Col span="4">
                            <Button bsSize="small" onClick={()=>{
                                this.setState({dialogVisible:false},()=>{
                                    this.props.change("#"+value+"#");
                                });
                            }} disabled={!value} type="info">添加话题</Button>
                        </Layout.Col>
                    </Layout.Row>
                    <div>推荐的官方话题：</div>
                    {(topic?topic:[]).map(item=>{
                        return(
                            <Button bsSize="small" key={item.id} onClick={()=>{
                                this.setState({dialogVisible:false},()=>{
                                    this.props.change("#"+item.title+"#");
                                });
                            }} style={{margin:"3px"}}>{item.title}</Button>
                        )
                    })}
                </Dialog.Body>
            </Dialog>
        )
    }
}

export default ForwardModule;
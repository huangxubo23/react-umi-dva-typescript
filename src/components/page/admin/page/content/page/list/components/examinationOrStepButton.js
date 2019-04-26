/**
 * Created by linhui on 18-1-8.审核或步骤按钮
 */

import React from 'react';
import {ajax} from '../../../../../../../../components/lib/util/ajax';
import {Form,Input,Button,Layout,Tooltip,Tabs,Select,DateRangePicker,Dropdown} from 'element-react';
import 'element-theme-default';

class ExaminationOrStepButton extends React.Component{
    constructor(props){
        super(props);
        this.state={
            strCompleteContent:'',
        }
    }

    componentDidMount(){
        let groupId=this.props.params.groupId;
        if(groupId){
            this.queryIsProcessStrCompleteContent();
        }
    }

    selectState = ({state,typeTab}) => {//内容操作事件
        let {setPaState,getContentByState,getContentStatePreview}=this.props;
        if(state>=0){
            setPaState({state, typeTab}, getContentByState);
        }else{
            setPaState({smallProcessId: '', state: '', isProcessStrComplete: '',typeTab:undefined}, getContentStatePreview);
        }
    };

    selectStep = ({id,typeTab}) => {//小组步骤操作事件
        if (id) {
            this.props.setPaState({
                smallProcessId: id,  isProcessStrComplete: '',typeTab:typeTab
            }, this.props.getContentStatePreview);
        } else {
            this.props.setPaState({
                smallProcessId: '', isProcessStrComplete: '',typeTab:undefined,
            }, this.props.getContentStatePreview);
        }
    };

    selectProcessStrComplete = () => {//小组已完成事件
        this.props.setPaState({
            smallProcessId: '', state: '', isProcessStrComplete: true,typeTab:undefined,
        }, this.props.getContentStatePreview);
    };

    selectDropdownButton = ({state}) => {//其他状态事件
        this.props.setPaState({
            state: state,
            smallProcessId: '',
            isProcessStrComplete: ''
        }, this.props.getContentStatePreview);
    };

    queryIsProcessStrCompleteContent=(callback)=>{//小组已完成总数
        let {groupId}= this.props.params;
        if(groupId){
            groupId = groupId.split("#")[0];
        }
        ajax.ajax({
            type:'post',
            url:'/content/admin/manageGroup/queryIsProcessStrCompleteContent.io',
            data:{groupId:groupId,contentModeId:''},
            isCloseMask:true,
            callback:({count})=>{
                this.setState({strCompleteContent:count},callback);
            }
        });
    };

    render(){
        let {smallProcessList,contentStatePreview}=this.props;
        return(
            <div>
                {!smallProcessList||smallProcessList<=0?<React.Fragment>
                    <Layout.Row  gutter="3">
                        {contentStatePreview.map(item => {
                            let bsStyle = undefined;
                            let color = "";
                            switch (item.state) {
                                case 0 :
                                    break;
                                case 1 :
                                    bsStyle = "warning";
                                    break;
                                case 2 :
                                    bsStyle = "danger";
                                    break;
                                case 3 :
                                    bsStyle = "primary";
                                    break;
                                case 4 :
                                    bsStyle = "success";
                                    break;
                                case 5 :
                                    bsStyle = "info";
                                    break;
                                case 7 :
                                    color = "btn-synchronization";
                                    break;
                                case 8 :
                                    bsStyle = "primary";
                                    break;
                                case 6 :
                                    color = "btn-purple";
                                    break;
                            }
                            return (
                                <Layout.Col lg={item.name=='草稿箱'||item.name=='待审核'||item.name=='待发布'?"2":"3"} span={item.name=='草稿箱'||item.name=='待审核'||item.name=='待发布'?"4":"6"} key={item.name}>
                                    <Dropdown type="primary" style={{width:"100%"}} onCommand={(typeTab)=>{
                                        this.selectState({state:item.state,typeTab:typeTab});
                                    }} menu={(
                                        <Dropdown.Menu>
                                            <Dropdown.Item>
                                                全部
                                            </Dropdown.Item>
                                            {item.typeTab.map(tab => {
                                                return (
                                                    <Dropdown.Item key={item.name + tab.name} command={tab.name}>
                                                        {tab.name}({tab.value})
                                                    </Dropdown.Item>
                                                )
                                            })}
                                        </Dropdown.Menu>
                                    )}>
                                        <Button type={bsStyle} className={color} style={{width:"100%",marginBottom:"5px"}}>
                                            {`${item.name}(${item.count})`}<i className="el-icon-caret-bottom el-icon--right"> </i>
                                        </Button>
                                    </Dropdown>
                                </Layout.Col>
                            )
                        })}
                    </Layout.Row>
                    </React.Fragment>:<React.Fragment>
                    <Layout.Row  gutter="3">
                        <Layout.Col span={smallProcessList.length<=3?"4":"3"}>
                            <Button type='primary' style={{width:"100%"}} onClick={()=>{
                                this.selectState({state:undefined});
                            }}>全部</Button>
                        </Layout.Col>
                        {smallProcessList.map((item, i) => {
                            let rgb = this.props.cols[i % 5];
                            return (
                                <Layout.Col span={smallProcessList.length<=3?"4":"3"} key={item.name}>
                                    <Dropdown type="primary" style={{width:"100%"}} onCommand={(typeTab)=>{
                                        this.selectStep({id:item.id,typeTab:typeTab});
                                    }} menu={(
                                        <Dropdown.Menu>
                                            <Dropdown.Item>
                                                全部
                                            </Dropdown.Item>
                                            {item.typeTab.map(tab => {
                                                return (
                                                    <Dropdown.Item key={item.name + tab.name} command={tab.name}>
                                                        {tab.name}({tab.value})
                                                    </Dropdown.Item>
                                                )
                                            })}
                                        </Dropdown.Menu>
                                    )}>
                                        <Button style={{backgroundColor: rgb,width:"100%",marginBottom:"5px"}}>
                                            {`${item.name}(${item.count.count})`}<i className="el-icon-caret-bottom el-icon--right"> </i>
                                        </Button>
                                    </Dropdown>
                                </Layout.Col>
                            )
                        })}
                        <Layout.Col span={smallProcessList.length<=3?"4":"3"}>
                            <Button bsStyle="default" style={{width:"100%"}}
                                    onClick={()=>this.selectProcessStrComplete()}>小组已完成({this.state.strCompleteContent?this.state.strCompleteContent:0})</Button>
                        </Layout.Col>
                        <Layout.Col span={smallProcessList.length<=3?"4":"3"}>
                            <Dropdown type="primary" onCommand={(state)=>{
                                this.selectDropdownButton({state:state});
                            }} style={{width:"100%"}} menu={(
                                <Dropdown.Menu>
                                    {this.props.contentStatePreview.map(tab => {
                                        return (
                                            <Dropdown.Item key={tab.state} command={tab.state}>
                                                {tab.name}({tab.count})
                                            </Dropdown.Item>
                                        )
                                    })}
                                </Dropdown.Menu>
                            )}>
                                <Button bsStyle="info" style={{width:"100%",marginBottom:"5px"}}>
                                    其他状态<i className="el-icon-caret-bottom el-icon--right"> </i>
                                </Button>
                            </Dropdown>
                        </Layout.Col>
                    </Layout.Row>
                    </React.Fragment>}
            </div>
        )
    }
}

export default ExaminationOrStepButton;

/**
 * Created by linhui on 17-12-1.小组内容列表步骤按钮
 */
require("../../../styles/component/react_assembly/listContent.css");
import React from 'react';
import {Button, DropdownButton, ButtonGroup, MenuItem, Row, Col, FormControl} from "react-bootstrap";
import {ajax} from '../../lib/util/ajax';
import {getUrlPat} from '../../lib/util/global';
import $ from 'jquery';
const Ajax = ajax.ajax;
import  '../../lib/util/bootstrap-datetimepicker.min'

class SmallProcessButton extends React.Component {
    constructor(props){
        super(props);
        this.state={
            strCompleteContent:'',
        }
    }
    selectState = (env) => {
        let state = $(env.target).data("state");
        let smallProcessId = $(env.target).data('id');
        let typeTab = $(env.target).data('tab_type');
        if (smallProcessId) {
            this.props.setPaState({
                smallProcessId: smallProcessId, state: '', isProcessStrComplete: '',typeTab:typeTab
            }, this.props.getContentStatePreview);
        } else {
            this.props.setPaState({
                smallProcessId: '', state: '', isProcessStrComplete: '',typeTab:undefined,
            }, this.props.getContentStatePreview);
        }
    };

    selectDropdownButton = (any, Object) => {
        this.props.setPaState({
            state: any,
            smallProcessId: '',
            isProcessStrComplete: ''
        }, this.props.getContentStatePreview);
    };

    selectProcessStrComplete = () => {
        this.props.setPaState({
            smallProcessId: '', state: '', isProcessStrComplete: true,typeTab:undefined,
        }, this.props.getContentStatePreview);
    };

    seekKeyChange = (env) => {
        let value = env.target.value;
        this.props.setPaState({seekKey: value});
    };
    flagChange = (env) => {
        let value = env.target.value;
        this.props.setPaState({flag: value}, () => {
            this.props.goPage(1);
        });
    };
    seek = () => {
        this.props.goPage(1);
    };
    cleanSeek = () => {
        this.props.setPaState({seekKey: ""}, this.props.goPage);
    };
    componentDidMount = () => {
        this.queryIsProcessStrCompleteContent(()=>{
            let startTime = $("#startTime").datetimepicker({
                format: "yyyy-mm-dd",
                language: 'zh-CN',
                minView: 2
            }).on("changeDate", (ev) => {
                startTime.datetimepicker('hide');
                let date = new Date(ev.date.getTime());
                date.setMonth(date.getMonth() + 6);
                this.props.setPaState({
                    startTime: ev.date.getFullYear() + "-" + (ev.date.getMonth() + 1) + "-" + ev.date.getDate(),
                    endTime: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
                }, () => {
                    endTime.datetimepicker('setEndDate', date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate());
                    endTime.datetimepicker('show');
                });
            });

            let endTime = $("#endTime").datetimepicker({
                format: "yyyy-mm-dd",
                language: 'zh-CN',
                minView: 3
            }).on("changeDate", (ev) => {
                endTime.datetimepicker('hide');
                this.props.setPaState({
                    endTime: ev.date.getFullYear() + "-" + (ev.date.getMonth() + 1) + "-" + ev.date.getDate()
                }, () => {
                    this.props.getContentStatePreview(1);
                });
            });
        });

    };
    queryIsProcessStrCompleteContent=(callback)=>{//小组已完成总数
      let url = window.location.href;
      let groupId = getUrlPat(url,'groupId');
      ajax.ajax({
          type:'post',
          url:'/content/admin/manageGroup/queryIsProcessStrCompleteContent.io',
          data:{groupId:groupId,contentModeId:''},
          callback:(json)=>{
              this.setState({strCompleteContent:json.count},callback);

          }
      });
    };
    render() {
        return (
            <div className="step">
                <ButtonGroup justified>
                    <Button href="#" data-id="" onClick={this.selectState}>全部</Button>
                    {this.props.smallProcessList.map((item, i) => {

                        let rgb = this.props.cols[i % 5];
                        return (
                            <DropdownButton key={item.id} style={{backgroundColor: rgb}} title={item.name+ '(' + item.count.count + ')'} id="bg-justified-dropdown">
                                <MenuItem key={item.name + "all"} data-id={item.id} onClick={this.selectState}>
                                    全部
                                </MenuItem>
                                {item.typeTab.map((tab,x)=>{
                                    return(
                                        <MenuItem eventKey={x + 1} key={item.name + tab.name} data-id={item.id} data-tab_type={tab.name} onClick={this.selectState}>
                                            {tab.name}({tab.value})
                                        </MenuItem>
                                    )

                                })}
                           {/* <Button href="#" key={item.id} data-id={item.id} style={{backgroundColor: rgb}}
                                    onClick={this.selectState}>{item.name + '(' + item.count.count + ')'}</Button>*/}
                            </DropdownButton>
                        )
                    })}
                    {/*className={color}*/}
                    <Button href="#" bsStyle="default" data-state="-1"
                            onClick={this.selectProcessStrComplete}>小组已完成({this.state.strCompleteContent?this.state.strCompleteContent:0})</Button>
                    <DropdownButton bsStyle="info" title="其他状态" id="bg-justified-dropdown"
                                    onSelect={this.selectDropdownButton}>
                        {this.props.contentStatePreview.map((item, i) => {
                            return (
                                <MenuItem eventKey={item.state + ""} key={item.state}>
                                    {item.name + '(' + item.count + ')'}
                                </MenuItem>
                            )
                        })}
                    </DropdownButton>
                </ButtonGroup>
                {/*<DropdownButton key={i + "-" + item.name} bsStyle={bsStyle} className={color}
                 title={item.name} id="bg-justified-dropdown">
                 <MenuItem key={item.name + "all"} onClick={this.selectState}>
                 全部
                 </MenuItem>
                 {item.smallProcess.name}
                 {item.typeTab.map((tab, t) => {
                 return (
                 <MenuItem eventKey={t + 1} key={item.name + tab.name} data-state={item.state}
                 data-tab_type={tab.name} onClick={this.selectState}>
                 {tab.name}({tab.value})
                 </MenuItem>
                 )
                 })}
                 </DropdownButton>*/}
                <Row className="show-grid search">
                    <Col md={2} sm={2}>
                        <FormControl componentClass='select' placeholder='选择标题' onChange={this.flagChange}>
                            <option value=''>所有旗帜</option>
                            <option value='1' className="red">红旗</option>
                            <option value='2' className="orange">橙旗</option>
                            <option value='3' className="yellow">黄旗</option>
                            <option value='4' className="green">绿旗</option>
                            <option value='5' className="cyan">青旗</option>
                            <option value='6' className="blue">蓝旗</option>
                            <option value='7' className="violet">紫旗</option>
                            <option value='8' className="white">棕绿旗</option>
                            <option value='9' className="black">黑旗</option>
                            <option value='10' className="deeppink">粉旗</option>
                            <option value='11' className="brown">棕旗</option>
                        </FormControl>
                    </Col>
                    <Col md={2} sm={2}>
                        <FormControl type="text" onChange={()=>{}}
                                     placeholder="开始时间" id="startTime" value={this.props.state.startTime}/>
                    </Col>
                    <Col md={2} sm={2}>
                        <FormControl type="text" onChange={()=>{}}
                                     placeholder="结束时间" id="endTime" value={this.props.state.endTime}/>
                    </Col>
                    <Col md={4} sm={4}>
                        <FormControl type="text" placeholder="请输入搜索关键词，多个词提包空格隔开" value={this.props.seekKey}
                                     onChange={this.seekKeyChange}/>
                    </Col>
                    <Col md={1} sm={1}>
                        <Button onClick={this.seek} bsStyle="info" block>搜索</Button>
                    </Col>
                    <Col md={1} sm={1}>
                        <Button onClick={this.cleanSeek} bsStyle="danger" block>清空</Button>
                    </Col>
                </Row>
            </div>
        )
    }
}
export default SmallProcessButton;
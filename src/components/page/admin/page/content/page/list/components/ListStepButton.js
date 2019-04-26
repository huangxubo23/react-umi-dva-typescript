/**
 * Created by shiying on 17-7-24.
 */

import React from 'react';
import ExaminationOrStepButton from './examinationOrStepButton';
import {Form, Input, Button, Layout, Tooltip, Tabs, Select, DateRangePicker, Radio} from 'element-react';
import 'element-theme-default';
import {PersonSelection, NewPersonSelection} from '../../../../../components/PersonSelection';

class ListStepButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [
                {value: '', label: '所有旗帜', color: ''},
                {value: '1', label: '红旗', color: 'red'},
                {value: '2', label: '橙旗', color: 'orange'},
                {value: '3', label: '黄旗', color: 'yellow'},
                {value: '4', label: '绿旗', color: 'green'},
                {value: '5', label: '青旗', color: 'cyan'},
                {value: '6', label: '蓝旗', color: 'blue'},
                {value: '7', label: '紫旗', color: 'violet'},
                {value: '8', label: '棕绿旗', color: 'white'},
                {value: '9', label: '黑旗', color: 'black'},
                {value: '10', label: '粉旗', color: 'deeppink'},
                {value: '11', label: '棕旗', color: 'brown'}
            ],
            value: ''
        };
    }

    seekKeyChange = (value) => {//搜索字段改变
        this.props.setPaState({seekKey: value});
    };
    idChange=(value)=>{
        this.props.setPaState({contentId:value});
    };
    flagChange = (value) => {//旗帜改变
        this.props.setPaState({flag: value}, () => {
            this.props.goPage(1);
        });
    };
    seek = () => {//搜索
        this.props.goPage(1);
    };
    cleanSeek = () => {//清除搜索字段
        this.props.setPaState({seekKey: ""});
    };

    bz_time = (arr, F, arr1 = []) => {//时间转换器
        if (F) {
            for (let a in arr) {
                let str = arr[a].split('-');
                arr1.push(new Date(str[0], str[1] - 1, str[2]));
            }
            return arr1;
        } else {
            for (let a in arr) {
                let str = arr[a].getFullYear() + "-" + (arr[a].getMonth() + 1) + "-" + arr[a].getDate();
                arr1.push(str);
            }
            return arr1;
        }
    };

    selectManage = (eventKey) => {//人员搜索
        this.props.setPaState({manage: eventKey}, () => {
            this.props.goPage();
        })
    };

    isDateRange=({time,contentHistory})=>{
        let sixMonthAgo = new Date();
        //sixMonthAgo.setTime(sixMonthAgo.getTime() + 3600 * 1000 * 24);
        sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);
        if(contentHistory=='半年之前'){
            return sixMonthAgo.getTime()<time.getTime();
        }else {
            sixMonthAgo.setTime(sixMonthAgo.getTime() - 3600 * 1000 * 24);
            return sixMonthAgo.getTime()>time.getTime()||time.getTime() > Date.now() - 8.64e7 + 3600 * 1000 * 24;
        }
    };

    timeTaking=(value)=>{
        let nowTemp = new Date();
        let endTime = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate() + 1, 0, 0, 0, 0);
        let startTime = new Date(nowTemp.getFullYear(), nowTemp.getMonth() - 6, nowTemp.getDate(), 0, 0, 0, 0);
        let beforeStartTime = new Date(nowTemp.getFullYear()-1, nowTemp.getMonth(), nowTemp.getDate()-1, 0, 0, 0, 0);
        if(value=='半年之前'){
            return{
                contentHistory:'半年之前',
                startTime: beforeStartTime.getFullYear() + "-" + (beforeStartTime.getMonth() + 1) + "-" + (beforeStartTime.getDate()),
                endTime: startTime.getFullYear() + "-" + (startTime.getMonth() + 1) + "-" + (startTime.getDate()),
            }
        }else {
            return{
                contentHistory:'半年以内',
                startTime: startTime.getFullYear() + "-" + (startTime.getMonth() + 1) + "-" + (startTime.getDate()),
                endTime: endTime.getFullYear() + "-" + (endTime.getMonth() + 1) + "-" + (endTime.getDate()),
            }
        }
    };

    render() {
        let {value, options} = this.state;
        let {
            state, contentStatePreview, smallProcessList, cols, params, setPaState, getContentByState,
            getContentStatePreview, manage, contentType, newVersion, contentHistory, defaultSort, contentHistoryChange
        } = this.props;
        let timeValue = this.bz_time([state.startTime, state.endTime], true);
        let pe = contentType == 'album' ? '编辑其他人的清单,审核清单' : contentType == 'cheesy' ? '审核好货,编辑他人的好货' : contentType == 'dap' ? '编辑其他人的搭配,审核搭配' : contentType == 'post' ? '审核帖子,编辑其他人的帖子' : contentType == 'struct' ? '审核结构体,编辑他人的结构体' : '';
        return (
            <div style={{marginTop: '10px'}}>
                <ExaminationOrStepButton contentStatePreview={contentStatePreview} smallProcessList={smallProcessList}
                                         cols={cols} params={params} setPaState={setPaState}
                                         getContentByState={getContentByState}
                                         getContentStatePreview={getContentStatePreview}/>

                <div style={{position: "relative", marginTop: "15px"}}>
                    <div style={{width: "460px"}}>
                        <Layout.Row gutter="20">
                            <Layout.Col span="11">
                                <Radio.Group value={newVersion ? '网格模式' : '表格模式'} onChange={this.props.version}>
                                    <Radio.Button value="网格模式"/>
                                    <Radio.Button value="表格模式"/>
                                </Radio.Group>
                            </Layout.Col>

                            <Layout.Col span="13" style={{textAlign: "left"}}>
                                <Radio.Group value={defaultSort ? '时间排序' : 'ID排序'} onChange={() => {
                                    let name = defaultSort ? 'IDSort' : 'timeSort';
                                    this.props[name]();
                                }}>
                                    <Radio.Button value="时间排序"/>
                                    <Radio.Button value="ID排序"/>
                                </Radio.Group>
                            </Layout.Col>
                        </Layout.Row>

                        <Layout.Row gutter="20" style={{marginTop: "5px"}}>
                            <Layout.Col span="11">
                                <Radio.Group value={contentHistory} onChange={(value)=>contentHistoryChange(this.timeTaking(value))}>
                                    <Radio.Button value="半年之前"/>
                                    <Radio.Button value="半年以内"/>
                                </Radio.Group>
                            </Layout.Col>

                            <Layout.Col span="13" style={{textAlign: "left"}}>
                                <DateRangePicker
                                    value={timeValue}
                                    placeholder="选择日期范围"
                                    align="left"
                                    ref={e => this.dateRangePicker = e}
                                    disabledDate={time => this.isDateRange({time,contentHistory})}
                                    onChange={date => {
                                        let newDate = this.bz_time(date);
                                        this.props.setPaState({
                                            startTime: newDate[0],
                                            endTime: newDate[1]
                                        }, () => {
                                            this.props.getContentStatePreview(1);
                                        });
                                    }}
                                    shortcuts={contentHistory=='半年之前'?[]:[{
                                        text: '最近7天',
                                        onClick: () => {
                                            const end = new Date();
                                            const start = new Date();
                                            end.setTime(end.getTime() + 3600 * 1000 * 24);
                                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
                                            let newDate = this.bz_time([start, end]);
                                            this.props.setPaState({
                                                startTime: newDate[0],
                                                endTime: newDate[1]
                                            }, () => {
                                                this.props.getContentStatePreview(1);
                                            });
                                            this.dateRangePicker.togglePickerVisible();
                                        }
                                    }, {
                                        text: '最近15天',
                                        onClick: () => {
                                            const end = new Date();
                                            const start = new Date();
                                            end.setTime(end.getTime() + 3600 * 1000 * 24);
                                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 14);
                                            let newDate = this.bz_time([start, end]);
                                            this.props.setPaState({
                                                startTime: newDate[0],
                                                endTime: newDate[1]
                                            }, () => {
                                                this.props.getContentStatePreview(1);
                                            });
                                            this.dateRangePicker.togglePickerVisible();
                                        }
                                    }, {
                                        text: '最近一个月',
                                        onClick: () => {
                                            const end = new Date();
                                            const start = new Date();
                                            end.setTime(end.getTime() + 3600 * 1000 * 24);
                                            start.setTime(start.getTime() + 3600 * 1000 * 24);
                                            start.setMonth(start.getMonth() - 1);
                                            let newDate = this.bz_time([start, end]);
                                            this.props.setPaState({
                                                startTime: newDate[0],
                                                endTime: newDate[1]
                                            }, () => {
                                                this.props.getContentStatePreview(1);
                                            });
                                            this.dateRangePicker.togglePickerVisible();
                                        }
                                    }, {
                                        text: '最近三个月',
                                        onClick: () => {
                                            const end = new Date();
                                            const start = new Date();
                                            end.setTime(end.getTime() + 3600 * 1000 * 24);
                                            start.setTime(start.getTime() + 3600 * 1000 * 24);
                                            start.setMonth(start.getMonth() - 3);
                                            let newDate = this.bz_time([start, end]);
                                            this.props.setPaState({
                                                startTime: newDate[0],
                                                endTime: newDate[1]
                                            }, () => {
                                                this.props.getContentStatePreview(1);
                                            });
                                            this.dateRangePicker.togglePickerVisible();
                                        }
                                    }]}
                                />
                            </Layout.Col>
                        </Layout.Row>

                    </div>

                    <div style={{position: "absolute", left: "480px", top: 0, right: 0}}>
                        <Layout.Row gutter="20">
                            <Layout.Col span="12">
                                <NewPersonSelection pe={pe} callback={this.selectManage} type={1} classNum={1}
                                                    style={{width: "100%"}}/>
                            </Layout.Col>
                            <Layout.Col span="12">
                                <Select value={value} onChange={this.flagChange} style={{width: "100%"}}>
                                    {options.map(el => {
                                        return <Select.Option key={el.value} label={el.label} value={el.value}
                                                              className={el.color}/>
                                    })}
                                </Select>
                            </Layout.Col>
                        </Layout.Row>

                        <Layout.Row gutter="20" style={{marginTop: "10px"}}>
                            <Layout.Col span="12">
                                <Input placeholder="请输入内容ID进行搜索" value={this.props.id} onChange={this.idChange}
                                       onKeyDown={(event) => {if (event.keyCode == "13") {this.seek()}}}
                                       append={<Button type="primary" icon="search" onClick={this.seek}>搜索</Button>}/>
                            </Layout.Col>
                            <Layout.Col span="12">
                                <Input placeholder="请输入标题搜索内容" value={this.props.seekKey} onChange={this.seekKeyChange}
                                       onKeyDown={(event) => {if (event.keyCode == "13") {this.seek()}}}
                                       append={<Button type="primary" icon="search" onClick={this.seek}>搜索</Button>}/>
                            </Layout.Col>
                        </Layout.Row>
                    </div>
                </div>


            </div>
        )
    }
}

export default ListStepButton;

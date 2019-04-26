/**
 * Created by 薛荣晖 on 2018/12/15 0015上午 10:38.添加好货模态
 */

import React from "react";
import AJAX from '../../../../../../../lib/newUtil/AJAX';
import {Card, Alert, Radio,Message, Tag} from "element-react";
import 'element-theme-default';

class RapidAddition extends React.Component {

    stateValue = () => {
        return {
            showModal: false,
            contentMode: [],
            radioId: "",
            typeTab: "",
            num: 0,
            form: 0,
            GroupList: {
                count: 20,
                manageList: [],
                pageNow: 1,
                pageSize: 20,
            },
            groupId: "",
            process: "",
        }
    };

    constructor(props) {
        super(props);
        this.state = this.stateValue();
    }

    componentDidMount() {
        this.RapidAdditionAjax.ajax({
            type: "post",
            url: "/user/admin/group/queryGroupList.io",
            data: {pageNow: 1, pageSize: 30},
            callback: (data) => {
                this.setState({GroupList: data});
            }
        });
        this.addition();
    }

    addition = (num = 1) => {
        this.RapidAdditionAjax.ajax({
            url: "/content/admin/cheesy/queryContentOvert.io",//要访问的后台地址
            data: {
                pageNow: num,
                pageSize: 30,
                name: "",
            },
            isCloseMask: true,
            callback: (data) => {
                this.setState({contentMode: data.contentMode});
            }
        })
    };

    additions = (id, num = 1) => {
        this.RapidAdditionAjax.ajax({
            url: "/content/admin/manageGroup/getContentModeByLargeProcess.io",//要访问的后台地址
            data: {
                pageNow: num,
                pageSize: 30,
                name: "",
                groupId: id,
            },
            isCloseMask: true,
            callback: (data) => {
                this.setState({contentMode: data.contentMode});
            }
        })
    };

    selectTypeTab = ({value, i}) => {//选择一个好货渠道
        this.setState({radioId: value, num: i});
    };

    selectForm = (value) => {//选择一个提交对象
        this.setState({form: value}, () => {
            if (value === 0) {
                this.setState({groupId: "", radioId: ""}, () => {
                    this.addition();
                });
            } else {
                this.setState({radioId: ""});
            }
        });
    };

    submit = () => {//确定提交
        let {typeTab, radioId, num, contentMode, form, groupId, process} = this.state;
        if (typeTab && radioId) {
            if (form === 0) {
                this.props.closeModal();
                this.props.callback(radioId, typeTab, contentMode[num], form, groupId, process);
            } else if (form === 1 && groupId) {
                this.props.closeModal();
                this.props.callback(radioId, typeTab, contentMode[num], form, groupId, process);
            } else {
                Message({
                    message: '必选一个小组',
                    type: 'warning'
                });
            }
        } else {
            Message({
                message: '类型渠道必选',
                type: 'warning'
            });
        }
    };

    selectType = (value) => {
        this.setState({typeTab: value});
    };

    selectGroup = ({process, value}) => {//选择小组
        this.setState({groupId: value, process: process}, () => {
            this.additions(value);
        });
    };

    render() {
        let typeTabRadioarr = ["潮女", "潮男", "美妆", "母婴", "户外", "数码", "家居", "文体", "汽车", "美食"];
        let {contentMode, radioId, typeTab, form, GroupList, groupId} = this.state;
        return (
            <AJAX ref={e => {
                this.RapidAdditionAjax = e
            }}>
                <div>
                    <Card className='box-card'>
                        <Alert title='选择一个提交对象' type='info' closable={false}/>
                        <div style={{marginTop: '10px', textAlign: 'left', marginBottom: '10px'}}>
                            <Radio value={0} checked={form === 0 ? "checked" : ""} onChange={(value) => {
                                this.selectForm(value)
                            }}>个人</Radio>
                            <br/>
                            <Radio value={1} checked={form === 1 ? "checked" : ""} onChange={(value) => {
                                this.selectForm(value)
                            }}>小组</Radio>
                        </div>
                        {form === 1 &&
                        <div>
                            <div style={{marginBottom: '15px', textAlign: 'left'}}>
                                <Tag type="warning">选择一个小组(必选)</Tag>
                            </div>
                            {GroupList.manageList.map((item, i) => {
                                return (
                                    <div key={item.id} style={{float: 'left', padding: '5px'}}>
                                        <Radio value={item.id} checked={item.id === groupId} onChange={(value) => {
                                            this.selectGroup({p: item.process, value: value})
                                        }}>{item.name}</Radio>
                                    </div>
                                );
                            })}
                        </div>}
                    </Card>
                    <div style={{marginTop: '30px', marginBottom: '30px'}}>
                        <Card className='box-card'>
                            <Alert title='选择一个类型' type='warning' closable={false}/>
                            <div style={{float: 'left', marginTop: '15px'}}>
                                {typeTabRadioarr.map((item) => {
                                    return (
                                        <Radio key={item} value={item} checked={item === typeTab} onChange={(value) => {
                                            this.selectType(value)
                                        }}>{item}</Radio>
                                    );
                                })}
                            </div>
                        </Card>
                    </div>
                    <Card className='box-card'>
                        <Alert title='选择一个好货渠道' type='success' closable={false}/>
                        <div style={{marginTop: '15px'}}>
                            {(contentMode ? contentMode : []).map((item, i) => {
                                return (
                                    <div style={{float: 'left', marginRight: '2px'}}>
                                        <Radio value={item.id} checked={radioId === item.id} key={item.id} onChange={(value) => {
                                            this.selectTypeTab({value: value, i: i})
                                        }}><span style={{marginRight: '2px'}}>{item.name}</span></Radio>
                                    </div>
                                )
                            })}
                        </div>
                    </Card>

                </div>
            </AJAX>
        );
    }
}

export default RapidAddition;
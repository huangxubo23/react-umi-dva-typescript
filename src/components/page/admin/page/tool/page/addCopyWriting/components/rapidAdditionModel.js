/**
 * Created by 薛荣晖 on 2019/1/26 0026下午 4:20.
 */

import React from "react";
import AJAX from '../../../../../../../lib/newUtil/AJAX';
import {Card, Alert, Radio, Message} from "element-react";
import 'element-theme-default';


class RapidAddition extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
    }

    addition = (num = 1, type = "post", callback) => {
        this.rapidAdditionAjax.ajax({
            url: "/content/admin/" + type + "/queryContentOvert.io",//要访问的后台地址
            data: {
                pageNow: num,
                pageSize: 30,
                name: "",
            },
            isCloseMask: true,
            callback: (data) => {
                this.setState({contentMode: data.contentMode}, () => {
                    if (callback) {
                        callback();
                    }
                });
            }
        })
    };

    additions = (id, num = 1) => {
        this.rapidAdditionAjax.ajax({
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

    open = (type = "post") => {
        this.addition(1, type, () => {
            this.setState({showModal: true});
        });
    };

    selectTypeTab = ({value, i}) => {
        this.setState({radioId: value, num: i});
    };

    submit = () => {
        let {typeTab, radioId, num, contentMode, form, groupId, process} = this.state;
        if (typeTab && radioId) {
            if (form == 0) {
                this.props.closeModal();
                this.props.callback(radioId, typeTab, contentMode[num]);
            } else if (form == 1 && groupId) {
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

    selectGroup = ({value, p}) => {
        let process = p;
        this.setState({groupId: value, process: process}, () => {
            this.additions(value);
        });
    };

    render() {
        let typeTabRadioarr = ["潮女", "潮男", "美妆", "母婴", "户外", "数码", "家居", "文体", "汽车", "美食"];
        let {contentMode, radioId, typeTab, form, GroupList, groupId} = this.state;
        return (
            <AJAX ref={e => {
                this.rapidAdditionAjax = e
            }}>
                <div>
                    <Card className='box-card'>
                        <Alert title='选择一个提交对象' type='info' closable={false}/>
                        <div style={{marginTop: '10px', textAlign: 'left', marginBottom: '10px'}}>
                            <Radio value={0} checked={form == 0 ? "checked" : ""} onChange={this.selectForm}>个人</Radio>
                        </div>
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
                        <Alert title='选择一个渠道' type='success' closable={false}/>
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
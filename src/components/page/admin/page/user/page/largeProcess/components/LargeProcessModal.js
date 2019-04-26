/**
 * Created by 薛荣晖 on 2018/12/18 0018下午 2:46.新增修改工作流程
 */

import React from "react";
import {Button, Dialog, Form, Table, Input, Select, Checkbox, Pagination, Notification} from "element-react";
import 'element-theme-default';
import AJAX from '../../../../../../../lib/newUtil/AJAX';

require('../../../../../../../../styles/content/content_template.css');

class LargeProcessModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 1,
            pageNow: 1,
            pageSize: 10,
            name: '',//模板搜索用名字
            type: '',//0新增,其他修改
            contentMode: [],//模板数据
            contentModeId: [],//已选择的模板
            largeProcess: {//新增修改工作流程
                id: '',
                name: '',
                organization: '',//组织
                type: '',//类型 list:1、帖子 item: 2、清单 post: 3单品||好货 collection：4 搭配 struct:7结构体
            }
        }
    };

    setThisState = (state, callback) => {
        this.setState(state, () => {
            if (callback && (typeof callback) == 'function') {
                callback();
            }
        });
    };

    LargeProcessChange = ({value, name}) => {//工作流程事件
        let largeProcess = this.state.largeProcess;
        largeProcess[name] = value;
        this.setState({largeProcess: largeProcess, contentModeId: []}, () => {
            if (name === 'type') {
                this.queryContentOvert();
            }
        });
    };

    queryContentOvert = (data, callback) => {//获取所有模板
        let type = parseInt(this.state.largeProcess.type);
        let contentType = type === 1 ? 'post' : type === 2 ? 'album' : type === 3 ? 'cheesy' : type === 4 ? 'dap' : type === 7 ? 'struct' : '';
        this.LargeProcessModalAjax.ajax({
            type: 'post',
            url: "/content/admin/" + contentType + "/queryContentOvert.io",
            data: data,
            callback: (json) => {
                this.setState(json, () => {
                    if (callback) {
                        callback();
                    }
                });
            }
        });
    };

    addAndUpLargeProcess = () => {//添加或修改工作流程
        let contentMode = this.state.contentModeId;
        let contentModeId = '';
        for (let i = 0; i < contentMode.length; i++) {
            contentModeId += contentMode[i].id + ',';
        }
        let largeProcess = this.state.largeProcess;
        let type = '';
        if (this.state.type === 0) {
            type = true;
        }
        if (!largeProcess.name) {
            Notification({
                title: '',
                message: '工作流程名不能为空',
                type: 'error'
            });
            return false;
        }
        if (!largeProcess.type) {
            Notification({
                title: '',
                message: '类型不能为空',
                type: 'error'
            });
            return false;
        }
        if (!contentModeId) {
            Notification({
                title: '',
                message: '请选择一个模板',
                type: 'error'
            });
            return false;
        }
        largeProcess.contentModeId = contentModeId;
        this.LargeProcessModalAjax.ajax({
            type: 'post',
            url: '/content/admin/superManage/addAndUpLargeProcess.io',
            data: {largeProcess: JSON.stringify(largeProcess)},
            callback: (json) => {
                if (type) {
                    Notification({
                        title: '',
                        message: '添加工作流程成功',
                        type: 'success'
                    });
                } else {
                    Notification({
                        title: '',
                        message: '修改工作流程成功',
                        type: 'success'
                    });
                }
                this.props.closeModal();
                this.props.goPageNow();
            }
        });
    };

    toPageSize = (pageSize) => {//每页个数
        let state = this.state;
        pageSize = pageSize ? pageSize : state.pageSize;
        this.setState(state, () => {
            this.queryContentOvert({pageSize: pageSize}, () => {
                this.props.newOpen(state.contentMode);
            });
        });
    };

    goPageNow = (pageNow) => {//跳转页
        let state = this.state;
        pageNow = pageNow ? pageNow : state.pageNow;
        this.setState(state, () => {
            this.queryContentOvert({pageNow: pageNow, pageSize: state.pageSize, name: state.name}, () => {
                this.props.newOpen(state.contentMode);
            });
        });
    };

    render() {
        let {largeProcess, pageSize, pageNow, count, contentMode, contentModeId} = this.state;
        return (
            <AJAX ref={e => {
                this.LargeProcessModalAjax = e
            }}>
                <div>
                    <Form model={this.state} labelWidth='100'>
                        <Form.Item label='工作流程名'>
                            <Input placeholder="工作流程名" value={largeProcess.name} size='small' onChange={(value) => {
                                this.LargeProcessChange({value: value, name: 'name'})
                            }}/>
                        </Form.Item>
                        <Form.Item label='类型'>
                            <Select value={JSON.stringify(largeProcess.type)} placeholder="请选择" size='small' style={{float: 'left', width: '100%'}} onChange={(value) => {
                                this.LargeProcessChange({value: value, name: 'type'})
                            }}>
                                <Select.Option label='请选择类型' value=''/>
                                <Select.Option label='帖子' value='1'/>
                                <Select.Option label='清单' value='2'/>
                                <Select.Option label='单品' value='3'/>
                                <Select.Option label='搭配' value='4'/>
                                <Select.Option label='结构体' value='7'/>
                            </Select>
                        </Form.Item>
                        <Form.Item label='模板'>
                            {!largeProcess.type ? <span style={{float: 'Left'}}>请先选择类型</span> :
                                <Button plain={true} type="success" style={{float: 'left'}} onClick={() => {
                                    this.contentModeModal.open({contentMode, type: largeProcess.type});
                                }}>选择模板</Button>}
                        </Form.Item>
                        <Form.Item label='已选择的模板'>
                            {contentModeId.map((item, i) => {
                                return (<p key={i} style={{textAlign: 'left'}}>{item.name}</p>)
                            })}
                        </Form.Item>
                    </Form>
                </div>
                <div>
                    <ContentModeModal count={count} pageNow={pageNow} pageSize={pageSize} contentMode={contentMode} contentModeId={contentModeId} ref={e => {
                        this.contentModeModal = e
                    }} getState={this.state} setPaState={this.setThisState} goPageNow={this.goPageNow} toPageSize={this.toPageSize} queryContentOvert={this.queryContentOvert}/>
                </div>
            </AJAX>
        );
    }
}

class ContentModeModal extends React.Component {//模板模态

    stateValue = () => {
        return {
            showModal: false,//模板模态开关
            contentMode: [],//模板数据
        }
    };

    constructor(props) {
        super(props);
        this.state = this.stateValue();
    }

    open = (data) => {//打开模态
        if (data.contentMode.length > 0) {
            this.setState({contentMode: data.contentMode, showModal: true}, () => {
                this.getTable();
            });
        } else {
            this.props.queryContentOvert(data.type, () => {
                this.setState({contentMode: data.contentMode, showModal: true}, () => {
                    this.getTable();
                });
            })
        }
    };

    close = () => {//关闭模态
        let state = this.stateValue();
        this.setState(state);
    };

    forModelId = (id) => {//checked事件
        let flag = false;
        let contentModeId = this.props.contentModeId;
        for (let i = 0; i < contentModeId.length; i++) {
            if (contentModeId[i].id === id) {
                flag = true;
            }
        }
        return flag;
    };

    contentModeIdChange = ({value, checked}) => {//模板id事件
        let contentModeId = this.props.contentModeId;
        value = JSON.parse(value);
        if (checked) {
            contentModeId.push(value);
        } else {
            let array = [];
            for (let i = 0; i < contentModeId.length; i++) {
                if (contentModeId[i].id != value.id) {
                    array.push(contentModeId[i]);
                }
            }
            contentModeId = array;
        }
        this.props.setPaState({contentModeId: contentModeId});
    };

    getTable = () => {//表格数据
        let contentMode = this.props.contentMode;
        let columns = [
            {label: '模板', prop: 'name'},
            {
                label: '是否添加到工作流程', prop: 'id', render: (item) => {
                    return (
                        <div>
                            <Checkbox value={JSON.stringify(item)} checked={this.forModelId(item.id) ? 'checked' : ''} onChange={(value) => {
                                this.contentModeIdChange({value: JSON.stringify(item), checked: value})
                            }}/>
                        </div>
                    )
                }
            }
        ];
        let array = [];
        if (contentMode.length > 0) {
            {
                (contentMode ? contentMode : []).map((item, i) => {
                    let {id, name} = item;
                    array.push({id: id, name: name})
                })
            }
        }
        return <Table
            style={{width: '100%'}}
            columns={columns}
            data={array}
            stripe={true}
        />
    };

    contentModelChange = (value) => {//模板名字搜索事件
        this.props.setPaState({name: value});
    };

    render() {
        return (
            <div>
                <Dialog
                    title="选择模板"
                    size="full"
                    visible={this.state.showModal}
                    onCancel={this.close}
                    lockScroll={false}
                >
                    <Dialog.Body>
                        <Form model={this.state} labelWidth='80'>
                            <Form.Item label='模板名称'>
                                <Input placeholder="模板名称" value={this.props.getState.name} onChange={(value) => {
                                    this.contentModelChange(value)
                                }} onKeyDown={(event) => {
                                    if (event.keyCode == "13") {
                                        this.props.goPageNow()
                                    }
                                }}
                                       append={<Button type="primary" icon="search" size='small' onClick={() => {
                                           this.props.goPageNow()
                                       }}>搜索</Button>}/>
                                <div style={{marginTop: '15px'}} className='divTable'>
                                    {this.getTable()}
                                </div>
                            </Form.Item>
                        </Form>
                        <div style={{marginTop: '15px'}}>
                            <Pagination layout="total, sizes, prev, pager, next, jumper" total={this.props.count} pageSizes={[10, 20, 40]} pageSize={this.props.pageSize} currentPage={this.props.pageNow}
                                        onSizeChange={(pageSize) => {
                                            this.props.toPageSize(pageSize)
                                        }}
                                        onCurrentChange={(pageNow) => {
                                            this.props.goPageNow(pageNow)
                                        }}/>
                        </div>
                    </Dialog.Body>
                    <Dialog.Footer className="dialog-footer">
                        <Button onClick={this.close} size='small' type="primary">确定</Button>
                    </Dialog.Footer>
                </Dialog>
            </div>
        );
    }
}

export default LargeProcessModal;
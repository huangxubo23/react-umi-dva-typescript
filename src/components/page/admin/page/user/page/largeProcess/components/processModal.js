/**
 * Created by 薛荣晖 on 2018/12/19 0019下午 3:17.工作流程步骤模态
 */

import React from "react";
import {Button, Dialog, Form, Table, Card, Input, InputNumber, Tag, Notification, MessageBox, Message} from "element-react";
import 'element-theme-default';
import AJAX from '../../../../../../../lib/newUtil/AJAX';
import {clone} from "../../../../../../../lib/util/global";

require('../../../../../../../../styles/content/content_template.css');

class ProcessModal extends React.Component {

    stateValue = () => {
        return {
            isAddSmallProcess: false,//是否新增流程步骤
            largeProcessId: '',//工作流程id
            showModal: false,//模态开关
            smallProcessList: [],//某一个流程的所有步骤
            smallProcess: {//新增步骤
                name: '',//步骤名
                sorting: '',//顺序
                ifFirst: false,//是否为第一个小流程
                ifLast: false,//是否为最后一个小流程
            }
        }
    };

    querySmallProcessList = () => {//查询步骤
        this.ProcessModalAjax.ajax({
            type: 'post',
            url: '/content/admin/superManage/querySmallProcessList.io',
            data: {largeProcessId: this.state.largeProcessId},
            callback: (json) => {
                this.setState(json, () => {
                    this.getTable();
                });
            }
        });
    };

    constructor(props) {
        super(props);
        this.state = this.stateValue();
    }

    delsmallProcess = (id) => {//删除步骤
        MessageBox.confirm('您确定要删除当前步骤吗, 是否继续?', '提示', {
            type: 'warning'
        }).then(() => {
            this.ProcessModalAjax.ajax({
                type: 'post',
                url: '/content/admin/superManage/delsmallProcess.io',
                data: {id: id},
                callback: () => {
                    Message({
                        type: 'success',
                        message: '删除步骤成功!'
                    });
                    this.querySmallProcessList();
                }
            });
        }).catch(() => {
            Message({
                type: 'info',
                message: '已取消删除'
            });
        });
    };

    getTable = () => {//表格数据
        let smallProcessList = this.state.smallProcessList;
        let columns = [
            {label: '顺序', prop: 'sorting'},
            {
                label: '名字', prop: 'name', render: (item) => {
                    return (
                        <div>
                            <span>{item.name}{item.ifFirst ? <Tag type="success" style={{marginLeft: '5px'}}>第一步骤</Tag> : item.ifLast ?
                                <Tag type="warning" style={{marginLeft: '5px'}}>最后步骤</Tag> : ''}</span>
                        </div>
                    )
                }
            },
            {
                label: '操作', prop: 'id', render: (item) => {
                    return (
                        <div>
                            <Button.Group>
                                <Button type="primary" size='small' onClick={() => {
                                    let sm = clone(item);
                                    this.processEditModal.open(sm)
                                }}>编辑</Button>
                                <Button type="danger" size='small' onClick={() => {
                                    this.delsmallProcess(item.id)
                                }}>删除</Button>
                            </Button.Group>
                        </div>
                    )
                }
            },
        ];
        let array = [];
        if (smallProcessList.length > 0) {
            smallProcessList.map((item, i) => {
                let {id, sorting, name, ifFirst, ifLast, largeProcess} = item;
                array.push({id: id, sorting: sorting, name: name, ifFirst: ifFirst, ifLast: ifLast, largeProcess: largeProcess})
            })
        }
        return <Table
            style={{width: '100%'}}
            columns={columns}
            data={array}
            stripe={true}
        />
    };

    ProcessModal = ({value, name}) => {//步骤事件
        let smallProcess = this.state.smallProcess;
        smallProcess[name] = value;
        this.setState({smallProcess: smallProcess});
    };

    addAndUpSmallProcess = () => {//新增步骤
        let smallProcess = this.state.smallProcess;
        let smallProcessList = this.state.smallProcessList;
        for (let i = 0; i < smallProcessList.length; i++) {
            if (smallProcessList[i].sorting === smallProcess.sorting) {
                Notification.error({
                    title: '错误',
                    message: '新增的步骤顺序不能与原有步骤顺序相同！'
                });
                return false;
            }
        }
        smallProcess.largeProcessId = this.state.largeProcessId;
        this.ProcessModalAjax.ajax({
            type: 'post',
            url: '/content/admin/superManage/addAndUpSmallProcess.io',
            data: {smallProcess: JSON.stringify(smallProcess)},
            callback: (json) => {
                Notification({
                    title: '成功',
                    message: '新增步骤顺序成功',
                    type: 'success'
                });
                this.props.closeModal();
            }
        });
    };

    render() {
        let {smallProcess, isAddSmallProcess} = this.state;
        return (
            <div>
                <Form>
                    <Form.Item>
                        <Button plain={true} type="info" style={{float: 'left'}} onClick={() => {
                            this.setState({isAddSmallProcess: true})
                        }}>新增步骤</Button>
                    </Form.Item>
                </Form>
                {isAddSmallProcess === true && <div style={{marginTop: '20px'}}>
                    <Card className='box-card'>
                        <Form model={this.state} labelWidth='80'>
                            <Form.Item label='步骤名'>
                                <Input size='small' placeholder='步骤名' value={smallProcess.name} onChange={(value) => {
                                    this.ProcessModal({value: value, name: 'name'})
                                }}/>
                            </Form.Item>
                            <Form.Item label='步骤顺序'>
                                <InputNumber size='small' defaultValue={smallProcess.sorting} value={smallProcess.sorting} min="1" max='99' style={{width: '100%'}} onChange={(value) => {
                                    this.ProcessModal({value: value, name: 'sorting'})
                                }}/>
                            </Form.Item>
                            <Form.Item style={{float: 'left'}}>
                                <Button type="success" size='small' onClick={this.addAndUpSmallProcess}>添加步骤</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>}
                <AJAX ref={e => {
                    this.ProcessModalAjax = e
                }}>
                    <div style={{marginTop: '20px'}} className='divTable'>
                        {this.getTable()}
                    </div>
                </AJAX>
                <div>
                    <ProcessEditModal ref={e => this.processEditModal = e} goPageNow={this.props.goPageNow} querySmallProcessList={this.querySmallProcessList}/>
                </div>
            </div>
        );
    }
}

class ProcessEditModal extends React.Component {

    stateValue = () => {
        return {
            processEdit: false,//编辑步骤模态开关
            smallProcess: {},//修改用步骤
        }
    };

    constructor(props) {
        super(props);
        this.state = this.stateValue();
    }

    processEditChange = ({value, name}) => {//编辑步骤修改
        let smallProcess = this.state.smallProcess;
        smallProcess[name] = value;
        this.setState({smallProcess: smallProcess});
    };

    upSmallProcess = () => {//修改步骤
        this.ProcessEditModalAjax.ajax({
            type: 'post',
            url: '/content/admin/superManage/addAndUpSmallProcess.io',
            data: {smallProcess: JSON.stringify(this.state.smallProcess)},
            callback: () => {
                Notification({
                    title: '成功',
                    message: '修改步骤成功',
                    type: 'success'
                });
                this.setState({processEdit: false}, () => {
                    this.props.querySmallProcessList();
                    this.props.goPageNow();
                });
            }
        });
    };

    open = (item) => {//打开模态
        item.largeProcessId = item.largeProcess.id;
        this.setState({smallProcess: item, processEdit: true});
    };

    close = () => {//关闭模态LargeProcessModal
        let state = this.stateValue();
        this.setState(state);
    };

    render() {
        let smallProcess = this.state.smallProcess;
        return (
            <AJAX ref={e => {
                this.ProcessEditModalAjax = e
            }}>
                <div>
                    <Dialog
                        title="流程步骤"
                        size="full"
                        visible={this.state.processEdit}
                        onCancel={this.close}
                        lockScroll={false}
                    >
                        <Dialog.Body>
                            <Form model={this.state} labelWidth='80'>
                                <Form.Item label='步骤名'>
                                    <Input placeholder='步骤名' value={smallProcess.name} onChange={(value) => {
                                        this.processEditChange({value: value, name: 'name'})
                                    }}/>
                                </Form.Item>
                                <Form.Item label='步骤顺序'>
                                    <InputNumber defaultValue={smallProcess.sorting} value={smallProcess.sorting} min="1" max='99' style={{width: '100%'}} onChange={(value) => {
                                        this.processEditChange({value: value, name: 'sorting'})
                                    }}/>
                                </Form.Item>
                            </Form>
                        </Dialog.Body>
                        <Dialog.Footer className="dialog-footer">
                            <Button onClick={this.close}>关闭</Button>
                            <Button type="primary" onClick={this.upSmallProcess}>修改</Button>
                        </Dialog.Footer>
                    </Dialog>
                </div>
            </AJAX>
        );
    }
}

export default ProcessModal;
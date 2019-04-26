/**
 * Created by 薛荣晖 on 2018/11/15 0015下午 2:51.达人收藏夹
 */

import React from "react";
import {Button, Dialog, Table, Input, Layout, MessageBox, Message} from "element-react";
import 'element-theme-default';
import AJAX from '../../../../../../../lib/newUtil/AJAX';

require('../../../../../../../../styles/content/content_template.css');

class TalentSquareDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            branchClass: [],
            dialogVisible: false,
        }
    }

    getBranchClass = () => {//表格数据
        let branchClass = this.state.branchClass;
        let columns = [
            {label: "分类名称", prop: "branchName"},
            {
                label: "操作", prop: "id", render: (data) => {
                    if (data.branchName == "默认分类") {
                        return (
                            <span>默认分类不能编辑与删除</span>
                        )
                    } else {
                        return (
                            <div>
                                <Button size="small" type='success' onClick={() => {
                                    this.sonCollection({id: data.id, branchName: data.branchName});
                                }}>编辑</Button>
                                <Button size="small" type='danger' onClick={() => {
                                    this.delBranch(data.id)
                                }}>删除</Button>
                            </div>
                        )
                    }
                }
            },
        ];
        let array = [];
        if (branchClass.length > 0) {
            branchClass.map((item, i) => {
                let {branchName, id} = item;
                array.push({branchName: branchName, id: id})
            })
        }
        return <Table
            style={{width: '100%'}}
            stripe={true}
            columns={columns}
            data={array}/>
    };

    sonCollection = ({id, branchName}) => {
        let branchClass = this.state.branchClass;
        branchClass.id = id;
        branchClass.branchName = branchName;
        this.editCollection.setState({editDialogVisible: true, branchClass: branchClass});
    };

    delBranch = (branchId) => {//删除分类
        MessageBox.confirm('此操作将删除该分类，是否继续', '提示', {
            type: 'warning'
        }).then(() => {
            this.TalentSquareDialogAjax.ajax({
                type: 'post',
                url: "/user/admin/mechanism/delBranch.io",
                data: {'branchId': branchId},
                callback: () => {
                    Message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.props.branchList();
                }
            });
        }).catch(() => {
            Message({
                type: 'info',
                message: '已取消删除'
            });
        });
    };

    render() {
        return (
            <div>
                <AJAX ref={e => this.TalentSquareDialogAjax = e}>
                    <div className='divTable'>
                        {this.getBranchClass()}
                    </div>
                </AJAX>
                <div>
                    <EditCollection ref={e => this.editCollection = e} branchList={this.props.branchList} closeModal={this.props.closeModal}/>
                </div>
            </div>
        )
    }
}

class EditCollection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editDialogVisible: false,
            branchClass: {
                branchName: '',
                id: ''
            },
        }
    }

    sonClose = () => {
        this.setState({editDialogVisible: false})
    };

    branchNameChange = (value) => {//修改收藏名称
        let branchClass = this.state.branchClass;
        branchClass.branchName = value;
        this.setState({branchClass: branchClass})
    };

    alterBranchNameClick = ({branchId, branchName}) => { //提交修改
        let branchClass = this.state.branchClass;
        branchClass.id = branchId;
        branchClass.branchName = branchName;
        this.EditCollectionAjax.ajax({
            url: "/user/admin/mechanism/upBranch.io",
            data: {"branchId": branchId, "branchName": branchName},
            callback: () => {
                Message({
                    type: 'success',
                    message: '修改成功'
                });
                this.props.branchList();
            }
        });
        this.props.closeModal();
    };

    render() {
        let branchClass = this.state.branchClass;
        let branchName = branchClass.branchName;
        let branchId = branchClass.id;
        return (
            <AJAX ref={e => {
                this.EditCollectionAjax = e
            }}>
                <div>
                    <Dialog
                        title="编辑达人分类"
                        size="full"
                        visible={this.state.editDialogVisible}
                        onCancel={this.sonClose}
                    >
                        <Dialog.Body>
                            <Layout.Row gutter='10'>
                                <Layout.Col span='5'>
                                    <h5>分类名称</h5>
                                </Layout.Col>
                                <Layout.Col span='14'>
                                    <Input size='small' placeholder='请输入达人分类名称' value={branchName} onChange={(value) => {
                                        this.branchNameChange(value)
                                    }}/>
                                </Layout.Col>
                                <Layout.Col span='5'>
                                    <Button size='small' type="info" onClick={() => {
                                        this.alterBranchNameClick({branchId, branchName})
                                    }}>修改</Button>
                                </Layout.Col>
                            </Layout.Row>
                        </Dialog.Body>
                    </Dialog>
                </div>
            </AJAX>
        );
    }
}

export default TalentSquareDialog;
/**
 * Created by linhui on 17-7-21.管理员
 */
require('../../../../../../../styles/forum/forum_admin.css');
import $ from 'jquery';
import React from 'react';
import ReactChild from "../../../../../../lib/util/ReactChild";
import {ajax} from '../../../../../../lib/util/ajax';
import {Paging3} from '../../../../../../lib/util/Paging';
import noty from 'noty';
import {BundleLoading} from '../../../../../../../bundle';
import postEditTitleModal from 'bundle-loader?lazy&name=pc/trends_asset/components/forum/admin-[name]!../components/forum_postEditTitleModal';
import {Tab, Tabs, Label, Button, Modal, Checkbox, Form, Table, NavItem, Nav, FormGroup, FormControl, ControlLabel} from "react-bootstrap"

class AdminTabsInstance extends React.Component {

    searchTitleChange = (env) => {//改变title
        let value = env.target.value;
        this.props.setPaState({title: value});
    };
    branchChange = (env) => {//改变分类名称
        let value = env.target.value;
        this.props.setPaState({branchName: value});
    };
    isPowerChange = (env) => {//改变是否有权限
        let value = env.target.checked;
        this.props.setPaState({isPower: value});
    };
    branchSearch = (env) => {//分类搜索
        let zujian = this;
        let value = $(env.target).data('value');
        this.props.setPaState({branchId: value}, function () {
            zujian.searchClick();
        });
    };
    searchClick = () => {//搜索
        this.props.goPage(1);
    };
    superMangeAddAndUpdateBranch = (env) => {//添加分类&&修改
        let zujian = this;
        let branchName = zujian.props.getState.branchName;
        let branchPower = zujian.props.getState.isPower;
        let branchId = zujian.props.getState.branchId;
        if (branchId == '' || branchId == undefined || branchId == null) {
            branchId = 0;
        }
        if (branchName == null || branchName == '' || branchName == undefined) {
            new noty({
                text: '分类名称不能为空',
                type: 'error',
                layout: 'topCenter',
                modal: false,
                timeout: 3000,
                theme: 'bootstrap-v4',
                animation: {
                    open: 'noty_effects_open',
                    close: 'noty_effects_close'
                }
            }).show();
        } else {
            ajax.ajax({
                url: '../forum/bbs/loginBySuperMange/superMangeAddAndUpdateBranch.io',
                data: {'branchName': branchName, 'branchPower': branchPower, 'branchId': branchId},
                callback: function (json) {
                    new noty({
                        text: '新增分类成功',
                        type: 'success',
                        layout: 'topCenter',
                        modal: false,
                        timeout: 3000,
                        theme: 'bootstrap-v4',
                        animation: {
                            open: 'noty_effects_open',
                            close: 'noty_effects_close'
                        }
                    }).show();
                    zujian.close();
                    zujian.props.getBranchList();
                }
            });
        }

    };
    editBranch = (env) => {//修改分类
        let zujian = this;
        let branchId = $(env.target).data('branchid');
        let branchPower = $(env.target).data('branchpower');
        let branchName = $(env.target).data('branchname');
        zujian.props.setPaState({branchId: branchId, branchName: branchName, isPower: branchPower, showModal: true});
    };
    superMangeDelBranch = (env) => {//删除分类
        let zujian = this;
        let branchId = $(env.target).data('branchid');
        let n = new noty({
            text: '<h4>您确定要删除吗</h4>',
            theme: 'bootstrap-v4',
            modal: true,
            layout: 'center',
            type: 'warning',
            buttons: [
                noty.button('删除', 'btn btn-success', function () {
                    ajax.ajax({
                        type: 'post',
                        url: '../forum/bbs/loginBySuperMange/superMangeDelBranch.io',
                        data: {'branchId': branchId},
                        callback: function (json) {
                            new noty({
                                text: '删除成功',
                                type: 'success',
                                layout: 'topCenter',
                                modal: false,
                                timeout: 3000,
                                theme: 'bootstrap-v4',
                                animation: {
                                    open: 'noty_effects_open',
                                    close: 'noty_effects_close'
                                }
                            }).show();
                            zujian.props.getBranchList();
                        }
                    });
                    n.close();
                }, {id: 'button1', 'data-status': 'ok'}),
                noty.button('取消', 'btn btn-error', function () {
                    n.close();
                })
            ]
        }).show();
    };
    delForumPost = (env) => {//删除帖子
        let zujian = this;
        let postId = $(env.target).data('postid');
        ajax.ajax({
            type: 'post',
            url: '../forum/bbs/loginAndOrg/delForumPostAndTalent.io',
            data: {'postId': postId},
            callback: ()=> {
                new noty({
                    text: '帖子删除成功',
                    type: 'success',
                    layout: 'topCenter',
                    modal: false,
                    timeout: 3000,
                    theme: 'bootstrap-v4',
                    animation: {
                        open: 'noty_effects_open',
                        close: 'noty_effects_close'
                    }
                }).show();
                zujian.searchClick();
            }
        });
    };

    close = () => {
        this.props.setPaState({showModal: false});
    };
    open = () => {
        this.props.setPaState({branchId: '', branchName: '', isPower: '', showModal: true});
    };
    openModal=(env)=>{//打开修改标题模态
        let postId = $(env.target).data('postid');
        this.setState({editTitleModal:true},()=>{
            let upload=setInterval(()=>{
                let jd = this.bundleLoading.jd;
                if(jd){
                    clearInterval(upload);
                    jd.setState({postId:postId,titleModal:true});
                }
            },100);
        })
    };

    render() {
        let zujian = this;
        return (
            <div>
                {this.state.editTitleModal&&<BundleLoading ref={e=>this.bundleLoading=e} load={postEditTitleModal} goPage={this.props.goPage}/>}
                <Tabs defaultActiveKey={2} id="uncontrolled-tab-example">
                    <Tab eventKey={1} title="所有帖子">
                        <Nav bsStyle="pills" activeKey={this.props.getState.branchId}>
                            <NavItem data-value=' ' eventKey=" " onClick={zujian.branchSearch}>全部</NavItem>
                            {this.props.getState.branch.map(function (item, i) {
                                return (
                                    item.isDel == true ? '' : <NavItem key={item.id} data-value={item.id} eventKey={item.id} onClick={zujian.branchSearch} href='#'>{item.branchName}</NavItem>
                                )
                            })}
                            <Form inline>
                                <FormGroup>
                                    <FormControl type='text' placeholder='请输入标题搜索' onChange={this.searchTitleChange}/>
                                </FormGroup>
                                {' '}
                                <Button onClick={this.searchClick}>搜索</Button>
                            </Form>
                        </Nav>
                        <Table hover>
                            <thead>
                            <tr>
                                <td>标题</td>
                                <td>作者</td>
                                <td width='200px'>发帖时间</td>
                            </tr>
                            </thead>
                            <tbody>
                            {this.props.getState.post.map(function (item, i) {
                                return (
                                    <tr key={item.id}>
                                        <td>
                                            <a href={'forum_post.html?id=' + item.id} target='_blank'>{item.title}</a>
                                            {item.manAgeId == zujian.props.getState.loginManage.id || zujian.props.getState.loginManage.superMan == true ?
                                                <Label href="#" style={{cursor:'pointer'}} bsStyle='danger' data-postid={item.id} onClick={zujian.delForumPost}>删除</Label> : ''}
                                            {item.manAgeId == zujian.props.getState.loginManage.id || zujian.props.getState.loginManage.superMan == true ?
                                                <Label href="#" style={{cursor:'pointer'}} bsStyle='success' data-postid={item.id} onClick={zujian.openModal}>修改标题</Label> : ''}
                                        </td>
                                        <td>{item.manAgeName}</td>
                                        <td>{item.addTime}</td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </Table>
                        <Paging3 bsSize="large" pageNow={zujian.props.getState.pageNow} pageSize={zujian.props.getState.pageSize} count={zujian.props.getState.count}
                                 goPage={zujian.props.goPage}/>
                    </Tab>
                    <Tab eventKey={2} title="分类">
                        <Button onClick={this.open} bsStyle="success">新增分类</Button>
                        <Modal show={this.props.getState.showModal} onHide={this.close}>
                            <Modal.Header closeButton>
                                <Modal.Title>{this.props.getState.branchId == '' ? '新增分类' : '修改分类'}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <FormGroup controlId='formControlsText'>
                                    <ControlLabel>分类名称：</ControlLabel>
                                    <FormControl type='text' placeholder='分类名称' value={this.props.getState.branchName} onChange={this.branchChange}/>
                                </FormGroup>
                                <FormGroup controlId='formControlsText'>
                                    <ControlLabel>是否需要权限：</ControlLabel>
                                    <Checkbox className='isPowerCheckbox' checked={this.props.getState.isPower == true ? 'checked' : ''} onChange={this.isPowerChange}/>
                                </FormGroup>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button bsStyle='primary' onClick={this.superMangeAddAndUpdateBranch}>{this.props.getState.branchId == '' ? '新增' : '修改'}</Button>
                            </Modal.Footer>
                        </Modal>
                        <Table>
                            <thead>
                            <tr>
                                <td>分类Id</td>
                                <td>分类名</td>
                                <td>分类权限</td>
                                <td>操作</td>
                            </tr>
                            </thead>
                            <tbody>
                            {this.props.getState.branch.map(function (item, i) {
                                return (
                                    item.isDel == true ? undefined : <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.branchName}</td>
                                        <td>{item.branchPower == true ? '需要权限' : '不需要权限'}</td>
                                        <td>
                                            <Button data-branchid={item.id} bsStyle="danger" onClick={zujian.superMangeDelBranch}>删除</Button>&nbsp;
                                            <Button data-branchId={item.id} bsStyle="warning" data-branchname={item.branchName} data-branchpower={item.branchPower} onClick={zujian.editBranch}>修改</Button>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </Table>

                    </Tab>
                </Tabs>
            </div>
        )
    }
}

class Forum_admin extends ReactChild {
    componentDidMount() {
        this.getBranchList();
        this.goPage(1);
    }

    constructor(props) {
        super(props);
        this.state = {
            pageNow: 1,
            pageSize: 16,
            count: 0,
            post: [],
            title: '',
            branchId: '',
            branch: [],
            branchName: '',
            loginManage: '',
            showModal: false,
            isPower: false,
        }
    }

    getPersonalDetails = (data, callback) => {//拿去帖子
        let zujian = this;
        ajax.ajax({
            url: '../forum/bbs/loginBySuperMange/superMangeQueryPostList.io',
            data: data,
            callback: function (json) {
                console.log(json);
                zujian.setState(json, callback);
            }
        });

    };
    getBranchList = () => {//拿去分类数据
        let zujian = this;
        ajax.ajax({
            type: 'post',
            url: '../forum/bbs/loginBySuperMange/superMangGetBranchList.io',
            data: {},
            callback: function (json) {
                console.log(json);
                zujian.setState(json);
            }
        });
    };
    setThisState = (state, callback) => {
        this.setState(state, function () {
            if (callback && (typeof callback) == 'function') {
                callback();
            }
        });
    };
    goPage = (pageNow) => {/*点击分页*/
        let zujian = this;
        pageNow = pageNow ? pageNow : zujian.state.pageNow;
        zujian.getPersonalDetails({
            pageNow: pageNow,
            pageSize: zujian.state.pageSize,
            title: zujian.state.title,
            branchId: zujian.state.branchId,
        });
    };

    render() {
        return (
            <div>
                <AdminTabsInstance setPaState={this.setThisState} getState={this.state} goPage={this.goPage} getBranchList={this.getBranchList}/>
            </div>
        )
    }
}

export default Forum_admin;
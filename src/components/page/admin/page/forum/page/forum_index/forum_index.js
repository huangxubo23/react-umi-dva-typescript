/**
 * Created by Administrator on 2017/6/26.论坛首页
 */
require('../../../../../../../styles/forum/forum_index.css');
import React from 'react';
import ReactChild from "../../../../../../lib/util/ReactChild";
import $ from 'jquery';
import '../../../../../../lib/util/ajaxfileupload';
import noty from 'noty';
import {ajax} from '../../../../../../lib/util/ajax';
import {Paging3} from '../../../../../../lib/util/Paging';
import Advertisement from '../../../../../../lib/util/Advertisement';
import  EditBox from '../../../../../../lib/sharing/editBox/EditBox';
import  {
    Checkbox,
    Label,
    Button,
    Modal,
    Table,
    NavItem,
    Nav,
    FieldGroup,
    FormGroup,
    FormControl,
    ControlLabel,
    Col,
    InputGroup,
    Row
} from 'react-bootstrap'

//发帖
class OutPost extends React.Component {

    titleChange = (env) => {//改变标题
        let value = env.target.value;
        this.props.setPaState({title: value});
    };
    branchChange = (env) => {//改变分类
        let value = env.target.value;
        this.props.setPaState({branchId: value});
    };
    contentChange = (env) => {//改变内容值
        let value = env.target.value;
        this.props.setPaState({content: value});

    };
    isForeignChange = (env) => {//改变是否对外公开
        let value = env.target.checked;
        this.props.setPaState({isForeign: value});
    };
    addAndUpForumPost = () => {//新增帖子
        let zujian = this;
        let title = zujian.props.getState.title;
        let content = zujian.props.getState.content;
        let branchId = zujian.props.getState.branchId;
        let isForeign = zujian.props.getState.isForeign;
        let contents = this.refs.editBox.getContent();
        if (title == undefined || title == null || title == '') {
            new noty({
                text: '标题不能为空',
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
            return false;
        } else if (branchId == '' || branchId == undefined || branchId == null) {
            new noty({
                text: '分类不能为空',
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
            return false;
        }
        /*else if(content==undefined||content==null||content=='') {
         new noty({
         text: '内容不能为空',
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
         return false;
         }*/
        ajax.ajax({
            type: 'post',
            url: '../forum/bbs/loginAndOrg/addAndUpForumPost.io',
            data: {'title': title, 'content': JSON.stringify(contents), 'branchId': branchId, 'isForeign': isForeign},
            callback: function (json) {
                new noty({
                    text: '发帖成功',
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
                zujian.props.setPaState({showModal: false, title: ''}, function () {
                    zujian.props.goPage(1);
                });

            }
        });
    };
    close = () => {
        this.props.setPaState({showModal: false});
    };

    render() {
        let zujian = this;
        return (
            <div>
                <Modal show={this.props.getState.showModal} onHide={this.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>发表帖子</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                        <FormGroup controlId='formControlsText'>
                            <ControlLabel>标题：</ControlLabel>
                            <FormControl type='text' placeholder='标题' onChange={this.titleChange}/>
                        </FormGroup>
                        <FormGroup >
                            <ControlLabel>选择分类：</ControlLabel>
                            <FormControl componentClass='select' placeholder='分类' id='paternaMissionId'
                                         onChange={this.branchChange}>
                                <option value='undefined'>请选择分类</option>
                                {this.props.branch.map(function (item, i) {
                                    if (zujian.props.getState.loginManage.grade == '0') {
                                        return (
                                            item.isDel == true ? '' :
                                                <option key={item.id} value={item.id}>{item.branchName}</option>
                                        )
                                    } else if (item.branchPower == 0) {
                                        return (
                                            item.isDel == true ? '' :
                                                <option key={item.id} value={item.id}>{item.branchName}</option>
                                        )
                                    }

                                })}
                            </FormControl>
                        </FormGroup>


                        <FormGroup controlId='formControlsText'>
                            <ControlLabel>是否对外公开：</ControlLabel>
                            <Checkbox className='isForeginCheckbox'
                                      checked={this.props.getState.isForeign == true ? 'checked' : ''}
                                      onChange={this.isForeignChange}/>
                        </FormGroup>
                        <FormGroup >
                            <ControlLabel>内容：</ControlLabel>
                            <EditBox imgDisabled={true}  ref="editBox"/>
                            {/*<FormControl componentClass='textarea' rows='5' placeholder='内容'  />*/}
                        </FormGroup>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle='primary' onClick={this.addAndUpForumPost}>发表帖子</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}
// 帖子列表
class ForumTable extends React.Component {
    searchTitleChange = (env) => {//改变title
        let value = env.target.value;
        this.props.setPaState({title: value});
    };
    searchClick = () => {//搜索

        this.props.goPage(1);
    };
    branchSearch = (env) => {//分类搜索
        let zujian = this;
        let value = $(env.target).data('value');
        this.props.setPaState({branchId: value}, function () {
            zujian.searchClick();
        });
    };
    delForumPost = (env) => {//删除帖子
        let zujian = this;
        let postId = $(env.target).data('postid');
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
                        url: '../forum/bbs/loginAndOrg/delForumPostAndTalent.io',
                        data: {'postId': postId},
                        callback: function () {
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
                    n.close();
                }, {id: 'button1', 'data-status': 'ok'}),
                noty.button('取消', 'btn btn-error', function () {
                    n.close();
                })
            ]
        }).show();
    };
    postOpen = () => {//打开发帖
        let zujian = this;
        let loginManageId = zujian.props.getState.loginManageId;
        if (loginManageId == ' ' || loginManageId == undefined || loginManageId == null) {
            let n = new noty({
                text: '<h4>您还没有登录,请先登录</h4>',
                theme: 'bootstrap-v4',
                modal: true,
                layout: 'center',
                type: 'warning',
                buttons: [
                    noty.button('登录', 'btn btn-success', function () {
                    }, {id: 'button1', 'data-status': 'ok'}),
                    noty.button('取消', 'btn btn-error', function () {
                        n.close();
                    })
                ]
            }).show();
            return false;
        } else {
            this.props.setPaState({showModal: true});
        }

    };

    setTop=(env)=>{
        let postId = $(env.target).data('postid');
        this.setTopAjax(postId,1);
    };

    setTopAjax=(id,setTop=0)=>{
        ajax.ajax({
            url: '/forum/bbs/upFourmPostBysetTop.io',
            data: {id:id,setTop:setTop},
            isCloseMask:true,
            callback: ()=> {
                this.searchClick();
            },
            error: ()=> {

            }
        });
    };

    render() {
        let zujian = this;
        return (
            <div>
                <Row>
                    <Col sm={2}>
                        <Button bsStyle="primary" onClick={this.postOpen} block>发布帖子</Button>
                    </Col>
                    <Col sm={2}>
                        <Button bsStyle="success" href="/admin/forum/forum_personalCenter" target="_blank" block>个人中心</Button>
                    </Col>
                    <Col sm={8}>
                        <FormGroup>
                            <InputGroup>
                                <FormControl type="text" placeholder='请输入帖子标题' onChange={this.searchTitleChange}/>
                                <InputGroup.Button>
                                    <Button onClick={this.searchClick} bsStyle="info">搜索</Button>
                                </InputGroup.Button>
                            </InputGroup>
                        </FormGroup>
                    </Col>
                </Row>
                <Nav bsStyle="tabs" activeKey={this.props.getState.branchId}>
                    <NavItem data-value=' ' eventKey=" " onClick={this.branchSearch}>全部</NavItem>
                    {this.props.branch.map((item, i) => {
                        return (
                            item.isDel ? '' :
                                <NavItem key={item.id} data-value={item.id} eventKey={item.id}
                                         onClick={zujian.branchSearch} href='#'>{item.branchName}</NavItem>
                        )
                    })}
                </Nav>
                <Table striped bordered condensed hover style={{marginTop:"10px"}}>
                    <thead>
                    <tr>
                        <td>标题</td>
                        <td>作者</td>
                        <td width='200px'>发帖时间</td>
                        <td>操作</td>
                    </tr>
                    </thead>
                    <tbody>
                    {(this.props.getState.setTopList?this.props.getState.setTopList:[]).map((item,i)=>{
                        return (
                            <tr key={item.id}>
                                <td>
                                    <Label bsStyle="info">置顶</Label>
                                    <a href={'forum_post.html?id=' + item.id} target='_blank'>
                                        {item.title}
                                    </a>
                                </td>
                                <td>{item.manAgeName}</td>
                                <td>{item.addTime}</td>
                                <td>
                                    {(item.manAgeId == zujian.props.getState.loginManage.id || zujian.props.getState.loginManage.superMan == true)&&
                                    <Button href="#" bsStyle='info' data-postid={item.id} onClick={()=>{
                                        this.setTopAjax(item.id)
                                    }} bsSize="xsmall">取消置顶</Button>}
                                    {" "}
                                    {(item.manAgeId == this.props.getState.loginManage.id || this.props.getState.loginManage.superMan == true) &&
                                    <Button href="#" bsStyle='danger' data-postid={item.id} onClick={this.delForumPost} bsSize="xsmall">删除</Button>}
                                </td>
                            </tr>
                        )
                    })}
                    {this.props.post.map(function (item, i) {
                        return (
                            <tr key={item.id}>
                                <td>
                                    <a href={'forum_post.html?id=' + item.id} target='_blank'>
                                        {item.title}
                                    </a>
                                </td>
                                <td>{item.manAgeName}</td>
                                <td>{item.addTime}</td>
                                <td>
                                    {(item.manAgeId == zujian.props.getState.loginManage.id || zujian.props.getState.loginManage.superMan == true)&&
                                    <Button href="#" bsStyle='info' data-postid={item.id} onClick={zujian.setTop} bsSize="xsmall">置顶</Button>}
                                    {" "}
                                    {(item.manAgeId == zujian.props.getState.loginManage.id || zujian.props.getState.loginManage.superMan == true)&&
                                        <Button href="#" bsStyle='danger' data-postid={item.id} onClick={zujian.delForumPost} bsSize="xsmall">删除</Button>}
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </Table>
                <Paging3 pageNow={this.props.getState.pageNow} pageSize={this.props.getState.pageSize} count={this.props.getState.count}
                         goPage={this.props.goPage}/>
            </div>
        )
    }
}
class Forum extends ReactChild {
    componentDidUpdate() {
    }

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
            loginManageId: '',//登录人id
            loginManageGrade: '',//登录人权限
            loginManage: '',
            post: [],//帖子数据
            branch: [],//分类数据
            branchId: ' ',//分类id
            title: '',//标题
            content: '',//内容
            isForeign: true,//是否有权限
            showModal: false,//发帖模态
            setTopList:[]
        }
    }

    setThisState = (state, callback) => {
        this.setState(state, function () {
            if (callback && (typeof callback) == 'function') {
                callback();
            }
        });
    };
    getPostList = (data, callback) => {//拿取帖子数据
        let zujian = this;
        ajax.ajax({
            url: '../forum/bbs/postList.io',
            data: data,
            isCloseMask:true,
            callback: function (json) {
                console.log(json);
                zujian.setState(json, callback);
            }, error: function () {

            }
        });
    };
    getBranchList = () => {//拿去分类数据
        let zujian = this;
        ajax.ajax({
            type: 'post',
            url: '../forum/bbs/getBranchList.io',
            data: {},
            isCloseMask:true,
            callback: function (json) {
                zujian.setState(json);
            }
        });
    };
    goPage = (pageNow=this.state.pageNow, callback) => {/*点击分页*/
        this.getPostList({
            pageNow: pageNow,
            pageSize: this.state.pageSize,
            title: this.state.title,
            branchId: this.state.branchId,
        }, callback);
    };
    render() {
        return (
            <div>
                <OutPost setPaState={this.setThisState} getState={this.state} branch={this.state.branch}
                         getPostList={this.getPostList} goPage={this.goPage}/>
                <Advertisement />
                <ForumTable post={this.state.post} getState={this.state} branch={this.state.branch}
                            setPaState={this.setThisState} getPostList={this.getPostList} goPage={this.goPage}/>
            </div>
        );
    }
}

export default Forum;

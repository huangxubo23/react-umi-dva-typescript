/**
 * Created by linhui on 17-7-19.论坛个人中心
 */

require('../../../../../../../styles/forum/forum_personalCenter.css');
import $ from 'jquery';
import React from 'react';
import ReactChild from "../../../../../../lib/util/ReactChild";
import {ajax} from '../../../../../../lib/util/ajax';
import {Paging3} from '../../../../../../lib/util/Paging';
import UpImages from '../../../../../../lib/sharing/upload/UpImages';
import noty from 'noty';
import EditTitleModal from '../components/forum_postEditTitleModal';
import {
    Tabs,
    Tab,
    Label,
    Button,
    Jumbotron,
    Table,
    NavItem,
    Col,
    ControlLabel,
    Modal,
    Nav,
    FormGroup,
    FormControl,
    Form,
    Grid,
    Image
} from "react-bootstrap"

const Ajax = ajax.ajax;

class StaffModal extends React.Component {//打开Model
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            loginManage: {},
            manAgeId: "",
            manageName: "",
            headPortrait: "",
        }
    }

    upFile = () => {
        this.refs.upImages._open();
    };

    nameState = (env) => {//名字赋值
        let name = env.target.value;
        let loginManage = this.state.loginManage;
        loginManage.manageName = name;
        this.setState({loginManage: loginManage});
    };

    submitMnage = () => {
        let loginManage = this.state.loginManage;
        Ajax({
            url: "/forum/bbs/isLogin/updateSuperMange.io",
            data: {
                manAgeId: loginManage.manAgeId,
                manageName: loginManage.manageName,
                headPortrait: loginManage.headPortrait
            },
            callback: () => {
                this.setState({show: false});
                new noty({
                    text: '提交成功',
                    type: 'success',
                    layout: 'topCenter',
                    modal: false,
                    timeout: 3000,
                    theme: 'bootstrap-v4',
                    animation: {
                        open: 'noty_effects_open',
                        close: 'noty_effects_close',
                    }
                }).show();
                this.props.update();
            }
        });
        this.setState({superMange: {}});
    };

    render() {
        let close = () => this.setState({show: false});
        return (
            <Modal show={this.state.show} onHide={close}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title">修改我的信息</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form horizontal>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={3}>
                                头像
                            </Col>
                            <Col sm={9}>
                                <div className="avatar">
                                    <iframe width="202" height="202" src={this.state.loginManage.headPortrait}>
                                    </iframe>
                                </div>
                                <div className="head_sc">
                                    <Button type="button" bsStyle="primary" onClick={this.upFile}>上传头像</Button>
                                </div>
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="formHorizontalText">
                            <Col componentClass={ControlLabel} sm={3}>
                                ID
                            </Col>
                            <Col sm={9}>
                                <FormControl type="text" disabled value={this.state.loginManage.manAgeId}/>
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="formHorizontalText">
                            <Col componentClass={ControlLabel} sm={3}>
                                名称
                            </Col>
                            <Col sm={9}>
                                <FormControl type="text" value={this.state.loginManage.manageName}
                                             onChange={this.nameState}/>
                            </Col>
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <div className="foot">
                        <Button type="button" className="footed" bsStyle="primary"
                                onClick={this.submitMnage}>提交</Button>
                        <Button type="button" className="footed" onClick={close}>关闭</Button>
                    </div>
                </Modal.Footer>
                <UpImages ref="upImages" callback={this.callback}/>
            </Modal>
        )
    }
}

class PersonalCenterTabsInstance extends React.Component {
    searchTitleChange = (env) => {//改变title
        let value = env.target.value;
        this.props.setPaState({title: value});
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
    updateMange = () => {
        let loginManage = this.props.getState.loginManage;
        let manAgeId = this.props.getState.loginManage.manAgeId;
        let manageName = this.props.getState.loginManage.manageName;
        let headPortrait = this.props.getState.loginManage.headPortrait;
        console.log(loginManage);
        this.staffModal.setState({
            loginManage: loginManage,
            manAgeId: manAgeId,
            manageName: manageName,
            headPortrait: headPortrait,
            show: true
        });
    };

    queryUpdate = () => {
        this.props.getPersonalDetails();
    };


    delForumPost = (env) => {//删除帖子
        let zujian = this;
        let postId = $(env.target).data('postid');
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
    };
    openModal=(env)=>{//打开修改标题模态
        let postId = $(env.target).data('postid');
        this.editTitleModal.setState({postId:postId,titleModal:true});
    };

    render() {
        let zujian = this;
        let state = this.props.getState;
        return (
            <div>
                <EditTitleModal  ref={e=>this.editTitleModal=e}  goPage={this.props.goPage}/>{/*修改标题*/}
                <Jumbotron>
                    <Grid>
                        <Image onClick={this.updateMange} src={this.props.getState.loginManage.headPortrait} circle/>
                    </Grid>
                    <p>您好!<span className="red">{this.props.getState.loginManage.manageName}</span></p>
                </Jumbotron>
                <Tabs defaultActiveKey={2} id="uncontrolled-tab-example">
                    <Tab eventKey={2} title="我发过的帖子">
                        <Nav bsStyle="pills" activeKey={this.props.getState.branchId}>
                            <NavItem data-value=' ' eventKey=" " onClick={zujian.branchSearch}>全部</NavItem>
                            {this.props.getState.branch.map(function (item, i) {
                                return (
                                    item.isDel == true ? '' :
                                        <NavItem key={item.id} data-value={item.id} eventKey={item.id}
                                                 onClick={zujian.branchSearch} href='#'>{item.branchName}</NavItem>
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
                                        <td><a href={'forum_post.html?id=' + item.id}
                                               target='_blank'>{item.title}</a>{/*{item.manAgeId == zujian.props.getState.loginManage.id ?'': ''}*/}
                                            <Label href="#" bsStyle='danger' data-postid={item.id} style={{cursor: 'pointer'}}
                                                   onClick={zujian.delForumPost}>删除</Label>

                                            <Label href="#" style={{cursor: 'pointer'}} bsStyle='success' data-postid={item.id} onClick={zujian.openModal}>修改标题</Label>
                                        </td>
                                        <td>{item.manAgeName}</td>
                                        <td>{item.addTime}</td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </Table>
                        <Paging3 bsSize="large" pageNow={zujian.props.getState.pageNow}
                                 pageSize={zujian.props.getState.pageSize} count={zujian.props.getState.count}
                                 goPage={zujian.props.goPage}/>
                    </Tab>
                    <Tab eventKey={3} title="回复过的帖子">
                        <Nav bsStyle="pills" activeKey={this.props.getState.branchId}>
                            <NavItem data-value=' ' eventKey=" " onClick={zujian.branchSearch}>全部</NavItem>
                            {this.props.getState.branch.map(function (item, i) {
                                return (
                                    item.isDel == true ? '' :
                                        <NavItem key={item.id} data-value={item.id} eventKey={item.id}
                                                 onClick={zujian.branchSearch} href='#'>{item.branchName}</NavItem>
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
                            {state.postList.post.map((item, i) => {
                                return (
                                    <tr key={item.id}>
                                        <td><a href={'forum_post.html?id=' + item.id}
                                               target='_blank'>{item.title}</a>{item.manAgeId == state.postList.loginManage.id ?
                                            <Label href="#" bsStyle='danger' data-postid={item.id}
                                                   onClick={zujian.delForumPost}>删除</Label> : ''}</td>
                                        <td>{item.manAgeName}</td>
                                        <td>{item.addTime}</td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </Table>
                        <Paging3 bsSize="large" pageNow={zujian.props.getState.pageNow}
                                 pageSize={zujian.props.getState.pageSize} count={zujian.props.getState.count}
                                 goPage={zujian.props.goSuperMangePage}/>
                    </Tab>
                    <Tab eventKey={4} title="回复过的内容">
                        <Nav bsStyle="pills" activeKey={this.props.getState.branchId}>
                            <NavItem data-value=' ' eventKey=" " onClick={zujian.branchSearch}>全部</NavItem>
                            {this.props.getState.branch.map(function (item, i) {
                                return (
                                    item.isDel == true ? '' :
                                        <NavItem key={item.id} data-value={item.id} eventKey={item.id}
                                                 onClick={zujian.branchSearch} href='#'>{item.branchName}</NavItem>
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
                                <td>回复内容</td>
                                <td>帖子</td>
                                <td>帖子作者</td>
                                <td width='200px'>发帖时间</td>
                            </tr>
                            </thead>
                            <tbody>
                            {state.replyList.reply.map((item, i) => {
                                return (
                                    <tr key={item.id}>
                                        <td>{item.contents}</td>
                                        <td><a href={'forum_post.html?id=' + item.content && item.content.forumPost.id}
                                               target='_blank'>{item.content && item.content.forumPost.title}</a>{item.manAgeId == state.postList.loginManage.id ?
                                            <Label href="#" bsStyle='danger' data-postid={item.id}
                                                   onClick={zujian.delForumPost}>删除</Label> : ''}</td>
                                        <td>{item.manAgeName}</td>
                                        <td>{item.content.forumPost.addTime}</td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </Table>
                        <Paging3 bsSize="large" pageNow={zujian.props.getState.pageNow}
                                 pageSize={zujian.props.getState.pageSize} count={zujian.props.getState.count}
                                 goPage={zujian.props.goSuperMangePage}/>
                    </Tab>
                    <StaffModal ref={e => this.staffModal = e} update={this.queryUpdate}/>
                </Tabs>
            </div>
        )
    }
}

class ForumPersonalCenter extends ReactChild {
    componentDidMount() {
        this.getBranchList();
        this.userInfo();
        this.goPage(1);
        this.querySuperMangeByPostList();
        this.querySuperMangeByContentList();
    }

    constructor(props) {
        super(props);
        this.state = {
            pageNow: 1,
            pageSize: 16,
            count: 0,
            postList: {
                pageNow: 1,
                pageSize: 16,
                count: 0,
                title: '',
                post: [],
                loginManage: '',
            },
            replyList: {
                reply: [],
            },
            post: [],
            title: '',
            branchId: '',
            branch: [],
            loginManage: '',
            userInfo: '',//用户信息

        }
    }

    getPersonalDetails = (data, callback) => {//拿去帖子(我发过的帖子
        // )
        let zujian = this;
        ajax.ajax({
            url: '../forum/bbs/isLogin/PersonalDetails.io',
            data: data,
            callback: function (json) {
                zujian.setState(json, callback);
            }
        });

    };

    querySuperMangeByPostList = (data) => {//回复过的帖子（个人详情）
        let zujian = this;
        ajax.ajax({
            url: '../forum/bbs/loginAndOrg/querySuperMangeByPostList.io',
            data: data,
            callback: (json) => {
                zujian.setState({postList: json});
            }
        });

    };

    querySuperMangeByContentList = (data) => {//我回复过的小回复（个人详情）
        let zujian = this;
        ajax.ajax({
            url: '../forum/bbs/loginAndOrg/queryReplyByMeList.io',
            data: data,
            callback: (json) => {
                zujian.setState({replyList: json}, () => {
                    console.log(this.state.replyList);
                });
            }
        });

    };

    getBranchList = () => {//拿去分类数据
        let zujian = this;
        ajax.ajax({
            type: 'post',
            url: '../forum/bbs/getBranchList.io',
            data: {},
            callback: function (json) {
                zujian.setState(json);
            }
        });
    };
    userInfo = () => {//拿取用户信息
        let zujian = this;
        ajax.ajax({
            url: '/user/admin/user/user.manage.info.io',
            data: {},
            callback: function (json) {
                zujian.setState({userInfo: json});
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

    goSuperMangePage = (pageNow) => {/*点击分页(个人详情)*/
        let zujian = this;
        pageNow = pageNow ? pageNow : zujian.state.contentList.pageNow;
        zujian.querySuperMangeByContentList({
            pageNow: pageNow,
            pageSize: zujian.state.contentList.pageSize,
            title: zujian.state.contentList.title,
        });
    };

    render() {
        return (
            <div>
                <PersonalCenterTabsInstance setPaState={this.setThisState} getState={this.state} goPage={this.goPage} getPersonalDetails={this.getPersonalDetails}/>
            </div>
        )
    }
}

export default ForumPersonalCenter;
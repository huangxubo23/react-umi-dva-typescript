

require('../../../../../../../styles/forum/forum_addSuperManage.css');
import $ from 'jquery';
import React from 'react';
import ReactChild from "../../../../../../lib/util/ReactChild";
import {ajax} from '../../../../../../lib/util/ajax';
import {infoNoty} from '../../../../../../lib/util/global';
import {Paging3} from '../../../../../../lib/util/Paging';
import noty from 'noty';
import addbut from '../../../../../../../images/user/addbut.png';
import '../../../../../../../styles/user/content.css';
import {
    Row,
    Col,
    Button,
    Modal,
    Checkbox,
    Form,
    FormGroup,
    FormControl,
    ControlLabel,
    Panel
} from "react-bootstrap"

const Ajax = ajax.ajax;

class StaffModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            add: true,//判断是添加还是编辑
            superMange: {
                headPortrait: "",
                manAgeId: "",
                manageName: "",
                superMan: true,

            },
            manage: {},
            subNick: "",
            editId: "",
        }
    }

    subNickState = (env) => {
        let subNick = env.target.value;
        this.setState({subNick: subNick});
    };

    nameState = (env) => {//名字赋值
        let name = env.target.value;
        let manage = this.state.manage;
        manage.name = name;
        let superMange = this.state.superMange;
        superMange.manageName = name;
        this.setState({manage: manage, superMange: superMange});
    };

    superManState = (env) => {
        // let superMan = env.target.value;
        let sss = env.target.checked;
        let superMange = this.state.superMange;
        superMange.superMan = sss;
        this.setState({superMange: superMange});
    };

    queryManageBySubNick = () => {//根据混淆ID查询   a017Bna9cX2Ce0IRr1HCizdyU3hxs+MvcP9bldon8tRn6Y=
        let s = this.state.subNick;
        if (!s) {
            infoNoty('混淆ID不能为空', 'error');
            return false;
        }
        Ajax({
            url: "/user/admin/superManage/queryManageBySubNick.io",
            data: {subNick: s},
            callback: (data) => {
                this.setState({manage: data});
            }
        });
    };

    submitBbsSuperMnage = () => {

        let manage = this.state.manage;
        let superMange = this.state.superMange;
        let superManges = {
            manAgeId: manage.id,
            manageName: manage.name,
            superMan: superMange.superMan,
            headPortrait : manage.portrait,
        };

        Ajax({
            url: "/forum/admin/superManage/topManageAddSuperMange.io",
            data: {superMange: JSON.stringify(superManges)},
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

    submitBbsSuperMnageUp = () => {
        let manage = this.state.manage;
        let superMange = this.state.superMange;
        let superManges = {
            headPortrait: superMange.headPortrait,
            manAgeId: superMange.manAgeId,
            manageName: superMange.manageName,
            superMan: superMange.superMan,
        };

        Ajax({
            url: "/forum/admin/superManage/topManageAddSuperMange.io",
            data: {superMange: JSON.stringify(superManges)},
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


    deleted = ()=> {
        let id = this.state.superMange.manAgeId;
        Ajax({
            url: "/forum/admin/superManage/topManageDelSuperMange.io",
            data: {manAgeId: JSON.stringify(id)},
            callback: ()=> {
                this.setState({show: false});
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
                    <Modal.Title id="contained-modal-title">{this.state.add ? "添加员工" : "编辑员工"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.add == true ? <Form horizontal>
                        <FormGroup controlId="formHorizontalText">
                            <Col componentClass={ControlLabel} sm={3}>
                                输入混淆ID
                            </Col>
                            <Col sm={7}>
                                <FormControl type="text" placeholder="请输入混淆ID..." onChange={this.subNickState}/>
                            </Col>
                            <Col sm={2}>
                                <Button type="button" className="footed" bsStyle="primary"
                                        onClick={this.queryManageBySubNick}>查询</Button>
                            </Col>
                        </FormGroup>

                        {this.state.manage.id && <div>
                            <FormGroup controlId="formHorizontalText">
                                <Col componentClass={ControlLabel} sm={3}>
                                    ID
                                </Col>
                                <Col sm={9}>
                                    <FormControl type="text" disabled value={this.state.manage.id}/>
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="formHorizontalText">
                                <Col componentClass={ControlLabel} sm={3}>
                                    名称
                                </Col>
                                <Col sm={9}>
                                    <FormControl type="text" value={this.state.manage.name} onChange={this.nameState}/>
                                </Col>
                            </FormGroup>
                            <FormGroup controlId="formHorizontalText">
                                <Col componentClass={ControlLabel} sm={3}>
                                    是否为管理员
                                </Col>
                                <Col sm={9}>
                                    <Checkbox name="radioGroup" className="radio-inline"
                                              value={this.state.superMange.superMan}
                                              onClick={this.superManState}
                                              checked={this.state.superMange.superMan == true ? "checked" : ""} inline>
                                        是
                                    </Checkbox>
                                </Col>
                            </FormGroup>

                        </div>}
                    </Form> : <Form horizontal>


                        <FormGroup controlId="formHorizontalText">
                            <Col componentClass={ControlLabel} sm={3}>
                                ID
                            </Col>
                            <Col sm={9}>
                                <FormControl type="text" disabled value={this.state.superMange.manAgeId}/>
                            </Col>

                        </FormGroup>

                        <FormGroup controlId="formHorizontalText">
                            <Col componentClass={ControlLabel} sm={3}>
                                名称
                            </Col>
                            <Col sm={9}>
                                <FormControl type="text" value={this.state.superMange.manageName}
                                             onChange={this.nameState}/>
                            </Col>
                        </FormGroup>

                        <FormGroup controlId="formHorizontalText">
                            <Col componentClass={ControlLabel} sm={3}>
                                是否为管理员
                            </Col>
                            <Col sm={9}>
                                <Checkbox name="radioGroup" className="radio-inline"
                                          value={this.state.superMange.superMan}
                                          onClick={this.superManState}
                                          checked={this.state.superMange.superMan == true ? "checked" : ""} inline>
                                    是
                                </Checkbox>
                            </Col>
                        </FormGroup>
                        <Button bsStyle="danger" onClick={this.deleted} block>删除员工</Button>
                    </Form>}
                </Modal.Body>
                <Modal.Footer>
                    <div className="foot">
                        {this.state.add == true ?
                            <Button type="button" className="footed" bsStyle="primary"
                                    onClick={this.submitBbsSuperMnage}>提交</Button> :
                            <Button type="button" className="footed" bsStyle="primary"
                                    onClick={this.submitBbsSuperMnageUp}>提交</Button>}
                        <Button type="button" className="footed" onClick={close}>关闭</Button>
                    </div>
                </Modal.Footer>
            </Modal>
        )
    }
}


class Forum_addSuperManage extends ReactChild {
    componentDidMount() {//初始化方法
        this.goPage(1);
    }

    constructor(props) {
        super(props);
        this.state = {
            pageNow: 1,
            pageSize: 16,
            count: 0,
            superMange: []
        }
    }

    goPage = (pageNow) => {
        this.setState({pageNow: pageNow}, () => {
            this.getContentModeData(pageNow);
        });
    };

    updateList = () => {
        this.getContentModeData();
    };

    getContentModeData = (pageNow) => {
        Ajax({
            url: "/forum/admin/superManage/topManageQuerySuperMange.io",
            data: {pageNow: pageNow, pageSize: 23},
            callback: (data) => {
                this.setState(data);
            }
        });
    };
    edit = (env) => {
        let i = $(env.target).data("i");
        let id = $(env.target).data("id");
        let state = this.state;
        let superMange = state.superMange[i];
        this.staffModal.setState({superMange: superMange, add: false, show: true, editId: id});
    };

    establish = () => {
        this.staffModal.setState({
            show: true,
            add: true,
            superMange: {
                headPortrait: "",
                manAgeId: "",
                manageName: "",
                superMan: true,
            }
        });
    };

    render() {
        return (
            <div>
                <Panel header={<h3>BBS管理员</h3>} bsStyle="success" style={{marginTop:"10px"}}>
                    <Row>
                        <Col sm={3} md={2} className="listManage" onClick={this.establish}>
                            <div className="listManage__">
                                <div className="portrait">
                                    <img src={addbut} className="img-circle"/>
                                </div>
                                <div className="panel panel-info">
                                    <div className="panel-body">增加BBS管理员</div>
                                </div>
                            </div>
                        </Col>
                        {this.state.superMange.map((item, i) => {
                            return (
                                <Col sm={3} md={2} className="listManage" onClick={this.edit} key={"talent" + item.id}
                                     data-id={item.id}>
                                    <div className="listManage__">
                                        <div className="portrait">
                                            <img src={item.headPortrait} className="img-circle" data-i={i}
                                                 data-id={item.id}/>
                                        </div>
                                        <div className="panel panel-info">
                                            <div className="panel-body" data-i={i} data-id={item.id}>
                                                {item.manageName == "" ? "暂无名称" : item.manageName}
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            )
                        })}
                    </Row>
                    <Paging3 pageSize={this.state.pageSize} count={this.state.count} goPage={this.goPage}/>
                    <StaffModal ref={e => this.staffModal = e} update={this.updateList}/>
                </Panel>
            </div>
        )
    }

}


export default Forum_addSuperManage;
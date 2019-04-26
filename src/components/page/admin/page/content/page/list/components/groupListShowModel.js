/**
 * Created by linhui on 17-12-8.小组内容看的模态
 */


import React from 'react';
import {
    Modal,
    Row,
    Col,
    Table,
    FormControl,
    Label,
    Alert,
    Panel,
    FormGroup,
    ButtonGroup,
    Button,
    DropdownButton,
    MenuItem,
    InputGroup
} from "react-bootstrap";
import {ajax} from '../../lib/util/ajax';
import noty from 'noty';
import $ from 'jquery';
import ShowConten from '../../../../../../../components/ShowConten';
import  {getUrlPat, infoNoty} from "../../lib/util/global"
import FlagRemarks from '../flagRemarks';
const Ajax = ajax.ajax;

class GroupListShowModel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            postShow: false,
            message: "",
            groupCrew: [],//手动保护选取的组员
            manageId: '',//组员id
            name: '',//组员名字
        }
    }

    messageChange = (env) => {
        this.setState({message: env.target.value})
    };

    componentDidMount() {
        if (this.state.postShow) {

        }

    }

    componentWillReceiveProps(newProps) {
        if (newProps.showContent) {
            let feedId = newProps.showContent.feedId;
            if (feedId) {
                this.setState({manualReleaseUrl: "http://h5.m.taobao.com/content/detail.html?contentId=" + feedId})
            }
        }

        if (newProps.showContent) {
            this.getContentMode(newProps.showContent.contentModeId, (contentMode) => {
                this.setState({contentMode: contentMode});
            })
        }

    }

    auditTrue=(env)=>{//审核通过
        let id = this.props.showContent.id;
        let state = $(env.target).data("state");
        let message = this.state.message;
        ajax.ajax({
            type:'post',
            url :'/content/admin/manageGroup/backFunction.io',
            data : {contentId: id, step: '', message: message},
            callback:(json)=>{
                ajax.ajax({
                    type:'post',
                    url:'/content/admin/content/domain.content.audit.io',
                    data: {id: id, type: 1, state: state, message: message},
                    callback:(json21)=>{
                        new noty({
                            text: '提交成功',
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
                        this.setState({message: ""});
                        this.close(() => {
                            this.props.getContentStatePreview();
                        });
                    }
                });
            }
        });
    };

    audit = (env) => {//打回步骤||小组已完成||
        let id = this.props.showContent.id;
        let step = $(env.target).data('id');
        let message = this.state.message;
        let data = {contentId: id, step: step, message: message};
        let url = '/content/admin/manageGroup/backFunction.io';
        Ajax({
            url: url,
            data: data,
            callback: () => {
                new noty({
                    text: '提交成功',
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
                this.setState({message: ""});
                this.close(() => {
                    this.props.getContentStatePreview();
                });
            }
        })
    };
    copyConten = (env) => {
        let contentModeId = $(env.target).data("conten_mode");
        Ajax({
            url: "/content/admin/content/domain.content.copy.io",
            data: {contentModeId: contentModeId, type: 1, id: this.props.showContent.id},
            callback: (data) => {
                let n = this.close(() => {
                    new noty({
                        text: '拷贝成功，请到草稿箱中查看',
                        type: 'success',
                        layout: 'topCenter',
                        modal: false,
                        timeout: 3000,
                        theme: 'bootstrap-v4',
                        animation: {
                            open: 'noty_effects_open',
                            close: 'noty_effects_close'
                        },
                        button: [
                            noty.button('确定', 'button tiny alert', function () {
                                n.close();
                            })
                        ]
                    }).show();
                    this.props.getContentStatePreview();
                });
            }
        });
    };
    getContentMode = (contentModeId, callback) => {
        let contentMode = this.props.contentMode;
        for (let i in contentMode) {
            if (contentMode[i].id === contentModeId) {
                if (callback) {
                    callback(contentMode[i].constraint);
                }
                return (contentMode[i].constraint);
            }
        }
        Ajax({
            url: "/content/admin/content/contentModeById.io",
            data: {id: contentModeId},
            callback: (data) => {
                if (callback) {
                    callback(data.constraint);
                }

            }
        });


    };
    manualRelease = () => {
        let manualReleaseUrl = this.state.manualReleaseUrl;
        if (manualReleaseUrl) {
            let feedId = getUrlPat(manualReleaseUrl, "contentId");
            if (feedId) {
                Ajax({
                    url: "/content/admin/content/domain.content.releaseSuccess.io",
                    data: {feedId: feedId, id: this.props.showContent.id},
                    callback: () => {
                        new noty({
                            text: '发布成功',
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
                        this.close(() => {
                            this.props.getContentStatePreview();
                        })
                    }
                });
            } else {
                new noty({
                    text: '发布连接有误',
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
            }
        } else {
            new noty({
                text: '请输入发布的连接',
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
        }
    };
    manualReleaseUrlChange = (env) => {
        this.setState({manualReleaseUrl: env.target.value});
    };
    close = (callback) => {
        this.setState({postShow: false}, callback);
    };
    manualProtection = () => {//手动保护
        let contentId = this.props.showContent.id;
        let manageId = this.state.manageId;
        if (!manageId) {
            infoNoty('手动保护组员不能为空', 'error');
            return false;
        }
        ajax.ajax({
            type: 'post',
            url: '/content/admin/manageGroup/manualProtection.io',
            data: {contentId: contentId, manageId: manageId},
            callback: (json) => {
                infoNoty('手动保护成功', 'success');
                this.props.getContentStatePreview();
            }

        });
    };
    getCrewMode = (pageNow) => {//手动保护选择的组员
        let num = pageNow ? pageNow : 1;
        if (this.props.showContent.manageGrade) {
            Ajax({
                url: '/user/admin/user/queryManageList.io',//"/user/admin/user/queryListManageByZy.io",
                data: {pageNow: num, pageSize: 23, name: this.state.name},
                callback: (data) => {
                    let groupCrew = data.talent;
                    this.setState({groupCrew: groupCrew});
                }
            });
        }

    };
    groupCrewNameChange = (env) => {//组员名字搜索事件
        let name = env.target.value;
        this.setState({name: name});
    };

    groupCrewChange = (env) => {//选择组员事件
        let id = env.target.value;
        this.setState({manageId: id});

    };

    render() {
        let close = () => this.close();
        let array = [];
        let str = this.props.showContent ? this.props.showContent.smallProcessStr : '';
        let list = this.props.smallProcessList ? this.props.smallProcessList : [];
        if (str && list.length > 0) {//循环判断步骤id获取value
            for (let x = 0; x < list.length; x++) {
                for (let i = 0; i < str.length; i++) {
                    if (list[x].id == str[i].id) {
                        let obj = {};
                        obj.id = list[x].id;
                        obj.name = list[x].name;
                        obj.value = str[i].state;
                        array.push(obj);
                    }
                }
            }
        }
        return (
            <Modal show={this.state.postShow} onHide={close} bsSize="large">
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-lg">
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.props.showContent ?
                        <Row className="show-grid">
                            <Col xs={7} md={7} className="listShowModelCol">
                                <ShowConten showContent={this.props.showContent} showZoom={true}
                                            contentMode={this.state.contentMode}/>
                            </Col>
                            <Col xs={5} md={5} className="listShowModelCol">
                                {this.props.showContent ?
                                    <div>
                                        <Table striped bordered condensed hover>
                                            <tbody>
                                            <tr>
                                                <td>标题</td>
                                                <td>
                                                    <FormControl type="text" value={this.props.showContent.title}
                                                                 readOnly/>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>模式</td>
                                                <td>{this.props.showContent.contentModeName ? this.props.showContent.contentModeName : ''}</td>
                                            </tr>
                                            <tr>
                                                <td>类别</td>
                                                <td>
                                                    <h4><Label bsStyle="primary">{this.props.showContent.typeTab}</Label></h4>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>封面</td>
                                                <td>
                                                    {this.props.showContent.contentData.picUrl ?
                                                        <span><img width="150px"
                                                                   src={this.props.showContent.picUrl}/></span> : "无"}
                                                </td>
                                            </tr>


                                            </tbody>
                                        </Table>

                                        <div>
                                            <Panel header="标记备注" bsStyle="primary">
                                                <FlagRemarks ref="fremarks" goPage={this.props.goPage}
                                                             pageNow={this.props.pageNow} data={{
                                                    id: this.props.showContent.id,
                                                    remarks: this.props.showContent.remarks,
                                                    flag: this.props.showContent.flag,
                                                    submitButton: true
                                                }}/>
                                            </Panel>
                                            {this.props.showContent.message ?
                                                <Alert bsStyle="danger">
                                                    {this.props.showContent.message}
                                                </Alert> : undefined}
                                            {this.props.showContent.manageGrade ?
                                                <Panel header="手动保护" bsStyle="primary">
                                                    <FormGroup>
                                                        <Col sm={6}>
                                                            <FormControl componentClass='select' placeholder='选择组员' onChange={this.groupCrewChange}>
                                                                <option value="">请选择组员</option>
                                                                {this.state.groupCrew.map((item, i) => {
                                                                    return (
                                                                        <option key={item.id} value={item.id}>{item.name}</option>
                                                                    )
                                                                })}
                                                            </FormControl>
                                                        </Col>
                                                        <Col sm={6}>
                                                            <InputGroup>
                                                                <FormControl type='text' placeholder='选择组员' value={this.state.name}
                                                                             onChange={this.groupCrewNameChange}/>
                                                                <InputGroup.Button>
                                                                    <Button bsStyle='info' onClick={() => {this.getCrewMode()}}>搜</Button>
                                                                </InputGroup.Button>
                                                            </InputGroup>
                                                        </Col>
                                                    </FormGroup>

                                                    <Button bsStyle="primary" style={{marginTop:'10px'}} onClick={this.manualProtection}>手动保护此条内容</Button>
                                                </Panel> : ''}
                                            {this.props.showContent.manageGrade ?
                                                <Panel header="审核" bsStyle="primary">
                                                    <FormGroup controlId="formControlsTextarea">
                                                        <FormControl componentClass="textarea" placeholder="请输入审核理由"
                                                                     rows="4" value={this.state.message} onChange={this.messageChange}/>
                                                        <br/>
                                                        <ButtonGroup justified>
                                                            <DropdownButton title="打回到" bsStyle="danger" id="bg-nested-dropdown">
                                                                {(this.props.smallProcessList ? this.props.smallProcessList : []).map((item, i) => {
                                                                    return (
                                                                        <MenuItem eventKey={i} key={item.id} data-id={item.id}
                                                                                  onClick={this.audit}>{item.name}</MenuItem>
                                                                    )
                                                                })}
                                                            </DropdownButton>
                                                            <Button onClick={this.audit} href="#" bsStyle="primary">小组确定完成</Button>
                                                            {this.props.showContent&&<Button href="#" data-state="3" onClick={this.auditTrue} bsStyle="info">审核通过</Button>}
                                                        </ButtonGroup>
                                                    </FormGroup>
                                                    <div>
                                                        {array.map((item, i) => {
                                                            return (
                                                                <Col sm={6} key={item.id}><Label
                                                                    bsStyle={item.value ? "info" : 'danger'}
                                                                >{item.name}:{item.value ? '完成' : '未完成'}</Label>&nbsp;
                                                                </Col>
                                                            )
                                                        })}
                                                    </div>
                                                </Panel> : ''}

                                            <Panel header="日志" bsStyle="primary" className="day_overflow">
                                                {this.props.showContent.log ? this.props.showContent.log.split("\n\r").map((item, i) => {
                                                    return (
                                                        <div key={i}>{item}</div>
                                                    );
                                                }) : ""}
                                            </Panel>
                                        </div>
                                    </div>
                                    : ""}
                            </Col>
                        </Row> : undefined}
                </Modal.Body>
            </Modal>
        )
    }
}
GroupListShowModel.defaultProps = {};

export default GroupListShowModel;

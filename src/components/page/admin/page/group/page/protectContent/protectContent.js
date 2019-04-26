/**
 * Created by linhui on 18-1-4.被保护内容（需要修改内容）
 */


import $ from 'jquery';
import React from 'react';
import ReactChild from "../../../../../../lib/util/ReactChild";

require('../../../../../../../styles/group/protectContent.css');
require('../../../../../../../styles/addList/content.css');
import {ajax} from '../../../../../../../components/lib/util/ajax';
import {Alert, Table, Button, ButtonToolbar, OverlayTrigger, Glyphicon, ButtonGroup, Tooltip, Modal, Row, Col, Panel} from "react-bootstrap";
import {BundleLoading, loading} from '../../../../../../../bundle';
import ShowConten from 'bundle-loader?lazy&name=pc/trends_asset/admin/content/app-[name]!../../../../../../components/ShowConten';
import {getUrlPat, infoNoty} from "../../../../../../../components/lib/util/global";

class ProtectContent extends ReactChild {
    constructor(props) {
        super(props);
        this.state = {
            contents: [],
        }
    }

    componentDidMount() {
        this.getProtectContentList();
    }

    getProtectContentList = () => {//获取数据
        ajax.ajax({
            type: 'post',
            url: '/content/admin/content/getProtectContentList.io',
            data: {},
            callback: (json) => {
                this.setState({contents: json.contents});
            }
        });
    };
    findContent = (id, groupId, callback) => {
        let data = {
            id: id,
            groupId: groupId
        };
        ajax.ajax({
            url: "/content/admin/manageGroup/domain.content.find.io",
            data: data,
            callback: (json) => {
                this.setState({showContent: json}, callback)
            }
        });
    };

    seletContent = (env) => {
        let id = $(env.target).data("id");
        let groupId = $(env.target).data("group");
        let contentModeId = $(env.target).data("content");
        this.findContent(id, groupId, () => {
            ajax.ajax({
                url: "/content/admin/content/contentModeById.io",
                data: {id: contentModeId},
                callback: (data) => {
                    this.setState({constraint: data.constraint}, () => {
                        let {constraint, showContent} = this.state;
                        this.showModel.open({constraint, showContent});
                    })
                }
            });
        });
    };
    delOnlyString = (env) => {//删除唯一字符串
        let contentId = $(env.target).data('id');
        if (contentId) {
            ajax.ajax({
                type: 'post',
                url: '/content/admin/content/delOnlyString.io',
                data: {contentId: contentId},
                callback: (json) => {
                    infoNoty('取消成功', 'success');
                }
            });
        }
    };
    protection = (env) => {//取消保护
        let contentId = $(env.target).data('id');

        ajax.ajax({
            type: 'post',
            url: '/content/admin/manageGroup/domain.content.relieve.protection.io',
            data: {contentId: contentId},
            callback: (json) => {
                infoNoty('取消保护成功', 'success');
                this.getProtectContentList();
            }
        });
    };

    render() {
        let zujian = this;
        return (
            <div>
                <ShowModel ref={e => this.showModel = e}/>
                {this.state.contents.length > 0 ?
                    <Panel header={<h3>修改内容列表</h3>} bsStyle="info">
                        <div className="contentList">
                            <Table striped bordered condensed hover>
                                <thead>
                                <tr>
                                    <th width="100px">ID</th>
                                    <th>模式</th>
                                    <th>类别</th>
                                    <th width="188px">封面</th>
                                    <th>标题</th>
                                    <th width="158px">更新时间</th>
                                    <th>工作流程</th>
                                    <th>当前步骤</th>
                                    <th>状态</th>
                                    <th width="220px">操作</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.contents.map((item, i) => {
                                    let btnClas = undefined;
                                    let st = "";
                                    let sorting = item.smallProcess ? item.smallProcess.sorting : 0;
                                    let state = item.state;
                                    let rgb;
                                    if (item.isProcessStrComplete) {
                                        btnClas = "";
                                        st = "小组已完成";
                                    } else if (state && state != 0) {
                                        switch (state) {
                                            case 1 :
                                                btnClas = "warning";
                                                st = "待审核";
                                                break;
                                            case 2 :
                                                btnClas = "danger";
                                                st = "审核失败";
                                                break;
                                            case 3 :
                                                btnClas = "info";
                                                st = "待发布";
                                                break;
                                            case 4 :
                                                btnClas = "success";
                                                st = "已发布";
                                                break;
                                            case 5 :
                                                btnClas = "info";
                                                st = "待修改";
                                                break;
                                            case 6 :
                                                btnClas = "purple";
                                                st = "通过";
                                                break;
                                            case 7 :
                                                btnClas = "synchronization";
                                                st = "已修改";
                                                break;
                                            case 8 :
                                                btnClas = "default";
                                                st = "待同步";
                                                break;
                                        }
                                    }
                                    return (
                                        <tr key={item.id + "-" + i} className={btnClas} style={{backgroundColor: rgb}}>
                                            <td className="wz">
                                                <label>
                                                    <input className="conCheckbox" type="checkbox"
                                                           checked={item.checked ? true : false}
                                                           onChange={zujian.props.checked} value={item.id}
                                                           data-feed_id={item.feedId}/>
                                                    {item.id}
                                                </label>
                                            </td>
                                            <td className="wz">{item.contentModeName}</td>
                                            <td className="wz">{item.typeTab}</td>
                                            <td className="wz">{item.picUrl ? <img src={item.picUrl}/> : ""}</td>
                                            <td className="wz">
                                                <a href={"/content/queryByContentId.html?id=" + item.id} target="_blank">{item.title}</a>
                                            </td>
                                            <td className="wz">{item.upTime}</td>
                                            <td className="wz">{item.largeProcesses ? item.largeProcesses.name : ''}</td>
                                            <td className="wz">{item.smallProcess ? item.smallProcess.name : ''}</td>
                                            <td className="wz">{st}</td>
                                            <td>
                                                <ButtonToolbar>
                                                    <OverlayTrigger placement="top"
                                                                    overlay={<Tooltip id="tooltip">备注内容：{item.remarks}</Tooltip>}>
                                                    <span
                                                        className={item.flag == 1 ? 'red' : item.flag == 2 ? 'orange' : item.flag == 3 ? 'yellow' : item.flag == 4 ? 'green' : item.flag == 5 ? 'cyan' : item.flag == 6 ? 'blue' : item.flag == 7 ? 'violet' : item.flag == 8 ? 'white' : item.flag == 9 ? 'black' : item.flag == 10 ? 'deeppink' : item.flag == 11 ? 'brown' : ''}
                                                        onClick={this.openFlagRemarks} data-i={i}>
                                                <Glyphicon style={{cursor: 'pointer'}} data-i={i}
                                                           glyph="glyphicon glyphicon-flag"/></span>
                                                    </OverlayTrigger>
                                                </ButtonToolbar>
                                                {item.version == 3 ? <ButtonToolbar>
                                                        {item.ifInvalidStr &&
                                                        <ButtonGroup bsSize="xsmall" justified>
                                                            <Button href="#" bsStyle="primary">保护期：</Button>
                                                            <Button href="#" bsStyle="primary">{item.ifInvalidStr.manageName}</Button>
                                                            {item.relieveProtection ?
                                                                <Button href="#" bsStyle="danger" data-id={item.id}
                                                                        onClick={this.protection}>取消保护</Button> : ''}
                                                        </ButtonGroup>}

                                                        <ButtonGroup bsSize="xsmall" justified className="ma">
                                                            <Button data-id={item.id} data-group={item.creator} data-content={item.contentModeId} onClick={zujian.seletContent} href="#"
                                                                    bsStyle="info">看</Button>
                                                            {item.edit ? <Button  target="_blank" href={"/pc/adm/content/groupAdd/manageGroup/" + item.creator + "/" + item.id} ta
                                                                                 bsStyle="primary">编</Button>
                                                                : undefined}
                                                        </ButtonGroup>
                                                        <ButtonGroup bsSize="xsmall" justified>
                                                            {item.editContent &&
                                                            <Button href="#" bsStyle="primary">{item.editContent}</Button>}
                                                            {item.deleEditContent &&
                                                            <Button href="#" bsStyle="danger" data-id={item.id} onClick={this.delOnlyString}
                                                                    data-id={item.id}>放弃</Button>}
                                                        </ButtonGroup>

                                                    </ButtonToolbar> :
                                                    <Button href={"http://content.52wzg.com/admin/" + contentType + "/list.htm"}
                                                            target="_blank"
                                                            block>到2.0处理</Button>
                                                }
                                            </td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </Table>
                        </div>
                    </Panel> : <Alert>
                        <h4>你做的很好！无修改内容</h4>
                    </Alert>}
            </div>
        )
    }
}

class ShowModel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            postShow: false,
        }
    }

    open = (data) => {
        this.setState({postShow: true, showContent: data.showContent, contentMode: data.constraint}, () => {

        });
    };

    close = () => {
        this.setState({postShow: false})
    };

    render() {
        let close = () => this.close();
        return (
            <Modal show={this.state.postShow} onHide={close} bsSize="large">
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-lg">

                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.showContent &&
                    <Row className="show-grid">
                        <Col xs={7} md={7} className="listShowModelCol">
                            {this.state.postShow && <BundleLoading ref={e => this.bundleLoading = e} load={ShowConten}
                                                                   showContent={this.state.showContent} showZoom={true}
                                                                   contentMode={this.state.contentMode}/>}
                        </Col>
                        <Col xs={5} md={5}>
                            {this.state.showContent.message &&
                            <Alert bsStyle="danger">
                                {this.state.showContent.message}
                            </Alert>}
                        </Col>
                    </Row>
                    }
                </Modal.Body>
            </Modal>
        )
    }
}

export default ProtectContent;
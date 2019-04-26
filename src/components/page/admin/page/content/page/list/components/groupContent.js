/**
 * Created by linhui on 17-12-2.小组内容列表
 */
import React from 'react';
import {Table} from "react-bootstrap";
import {ajax} from '../../lib/util/ajax';
import {
    DropdownButton,
    MenuItem,
    ButtonToolbar,
    ButtonGroup,
    Button,
    Glyphicon,
    Modal,
    Tooltip,
    Label,
    OverlayTrigger,
    FormGroup,
    InputGroup,
    FormControl
} from "react-bootstrap";
import noty from 'noty';
import $ from 'jquery';
import FlagRemarks from '../flagRemarks';
import {currencyNoty} from '../../lib/react_assembly/Noty'
import {getUrlPat, infoNoty} from '../../lib/util/global'
require("../../../styles/component/react_assembly/listContent.css");
const Ajax = ajax.ajax;

class GroupContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            judge: true,
            name: {},
            data: [],
            flagSwitch: false,//标记备注模态开关
            go: false,
            fuzzyQuery: true,
            fuzzy: [],
            transfer: false,
            fuzzyTransfer: true,
            search: {
                manage: "",
                goManage: "",
            }
        }
    }

    findContentModeName = (id) => {
        let contentMode = this.props.contentMode;
        for (let i in contentMode) {
            if (contentMode[i].id === id) {
                return contentMode[i].name;
            }
        }
    };
    findManageName = (id) => {
        let governmentManage = this.props.governmentManage;
        if (governmentManage.length > 0) {
            for (let i in governmentManage) {
                if (governmentManage[i].id === id) {
                    return governmentManage[i].name;
                }
            }
            this.props.getGovernmentManage(id);
        }
    };
    submitAudit = (env) => {//提交审核
        let zujian = this;
        let id = $(env.target).data("id");
        let url = window.location.href;
        let groupId = getUrlPat(url,'groupId');
        let n = new noty({
            text: '确定转给下一个步骤？',
            theme: 'bootstrap-v4',
            modal: true,
            layout: 'center',
            type: 'warning',
            buttons: [
                noty.button('确定', 'btn btn-info ma', function () {
                    Ajax({
                        url: '/content/admin/manageGroup/upContentStep.io',//"/content/admin/" + contentType + "/domain.content.submitAudit.io",
                        data: {contentIds: JSON.stringify([{contentIds:id}]),groupId:groupId},
                        callback: function () {
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
                            zujian.props.getContentStatePreview();
                        }
                    });
                    n.close();
                }),
                noty.button('暂不转给', 'btn btn-danger ma', function () {
                    n.close();
                })
            ]
        }).show();
    };
    delete = (env) => {
        let zujian = this;
        let id = $(env.target).data("id");
        let n = new noty({
            text: '确定删除这条内容？',
            theme: 'bootstrap-v4',
            modal: true,
            layout: 'center',
            type: 'warning',
            buttons: [
                noty.button('确定', 'btn btn-info ma', function () {
                    Ajax({
                        url: '/content/admin/manageGroup/delContentGroup.io',// "/content/admin/" + contentType + "/domain.content.delete.io",
                        data: {id: id},
                        callback: function () {
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
                            zujian.props.getContentStatePreview();
                        }
                    });
                    n.close();
                }),
                noty.button('暂不提交', 'btn btn-danger ma', function () {
                    n.close();
                })
            ]
        }).show();
    };
    synchronizationAudit = (env) => {
        let zujian = this;
        let id = $(env.target).data("id");
        let n = new noty({
            text: '确定已经修改好了？',
            theme: 'bootstrap-v4',
            modal: true,
            layout: 'center',
            type: 'warning',
            buttons: [
                noty.button('确定', 'btn btn-info ma', function () {
                    ajax.ajax({
                        url: "/content/admin/" + contentType + "/domain.content.synchronizationAudit.io",
                        data: {id: id},
                        callback: function () {
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
                            zujian.props.getContentStatePreview();
                        }
                    });
                    n.close();
                }),
                noty.button('暂不提交', 'btn btn-error ma', function () {
                    n.close();
                })
            ]
        }).show();
    };
    selesctManage = (eventKey, event) => {
        let zujian = this;
        this.props.setPaState({manage: eventKey}, function () {
            zujian.props.goPage();
        })

    };
    topspeedAddId = (env) => {
        let id = $(env.target).data("id");
        Ajax({
            url: "/content/admin/content//domain.content.topspeed.select.io",
            data: {id: id},
            callback: function () {
                new noty({
                    text: '成功添加',
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
            }
        })

    };
    pattern = (contentModeId, i) => {
        if (this.state.judge) {
            this.patternJson(contentModeId, (callback) => {
                let name = this.state.name;
                let data = this.state.data;
                name[i] = callback.name;
                let isRepeated = false;
                for (let j in data) {
                    if (data[j].contentModeId == callback.contentModeId) {
                        isRepeated = true;
                        break;
                    }
                }
                if (!isRepeated) {
                    data.push(callback);
                }
                this.setState({name: name, data: data, judge: false}, () => {
                    this.props.pattern(data);
                });
            });
        }
        return this.state.name[i];
    };
    patternJson = (contentModeId, callback) => {
        Ajax({
            url: "/content/admin/content/contentModeById.io",
            data: {id: contentModeId},
            callback: (data) => {
                if (callback) {
                    callback(data);
                }
            }
        });
    };
    openFlagRemarks = (env) => {//打开标记模态
        let i = $(env.target).data('i');
        let contents = this.props.contents[i];
        let flag = {id: contents.id, flag: contents.flag, remarks: contents.remarks};
        this.setState({flagSwitch: true}, () => {
            this.refs.flagRemarks.open(flag);
        });
    };
    closeFlagRemarks = () => {//关闭标记模态
        this.setState({flagSwitch: false});
    };
    updateFlagAndRemarks = () => {//提交标记备注内容
        this.refs.flagRemarks.updateFlagAndRemarks();
        this.closeFlagRemarks();
    };

    searchChange = (env) => {
        let it = $(env.target).data("name");
        let value = env.target.value;
        let search = this.state.search;
        search[it] = value;
        this.setState({search: search});
    };
    goSearch = (env) => {
        let name = $(env.target).data("name");
        let governmentManage = this.props.governmentManage;
        let manage = this.state.search[name];
        let [g, arr] = [false, []];
        for (let i in governmentManage) {
            if (governmentManage[i].name == manage) {
                g = true;
                if (name == "manage") {
                    this.selesctManage(governmentManage[i].id);
                } else {
                    this.props.shiftContent(governmentManage[i].id);
                }
            } else {
                if (governmentManage[i].name.indexOf(manage) >= 0) {
                    arr.push(governmentManage[i]);
                }
            }
        }
        if (g) {
            if (name == "manage") {
                this.setState({go: false});
            } else {
                this.setState({transfer: false});
            }
        } else {
            if (arr.length > 1) {
                this.setState({fuzzy: arr}, () => {
                    if (name == "manage") {
                        this.setState({fuzzyQuery: false});
                    } else {
                        this.setState({fuzzyTransfer: false});
                    }
                });
            } else if (arr.length === 1) {
                if (name == "manage") {
                    this.selesctManage(arr[0].id);
                    this.setState({go: false});
                } else {
                    this.props.shiftContent(arr[0].id);
                    this.setState({transfer: false});
                }
            } else {
                currencyNoty("查无此人", "warning");
            }
        }
    };
    fuzzySelect = (eventKey) => {
        this.setState({fuzzyQuery: true, go: false}, () => {
            this.selesctManage(eventKey);
        });
    };
    transferSelect = (eventKey) => {
        this.setState({fuzzyTransfer: true, transfer: false}, () => {
            this.props.shiftContent(eventKey);
        });
    };

    delOnlyString = (env) => {
        let contentId = $(env.target).data("id");
        if (contentId) {
            ajax.ajax({
                type: 'post',
                url: '/content/admin/content/delOnlyString.io',
                data: {contentId: contentId},
                callback: () => {
                    this.props.getContentStatePreview();
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
                this.props.getContentStatePreview();
            }
        });
    };

    render() {
        let url = window.location.href;
        let groupId = getUrlPat(url, "groupId");
        let zujian = this;
        let FullName = "全部";
        {
            this.props.governmentManage.map((item, i) => {
                if (item.id == this.props.manage) {
                    FullName = item.name;
                }
            })
        }
        return (
            <div className="contentList">
                <Modal show={this.state.flagSwitch} onHide={this.closeFlagRemarks}>
                    <Modal.Header closeButton>
                        <Modal.Title>标记备注</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FlagRemarks ref="flagRemarks" goPage={this.props.goPage} pageNow={this.props.pageNow}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="danger" onClick={this.closeFlagRemarks}>关闭</Button>
                        <Button bsStyle="info" onClick={this.updateFlagAndRemarks}>提交</Button>
                    </Modal.Footer>
                </Modal>
                <Table striped bordered condensed hover>
                    <thead>
                    <tr>
                        <th width="100px">ID<Button onClick={() => {
                            this.props.setordId()
                        }}>id排序</Button></th>
                        <th >模式</th>
                        <th >类别</th>
                        <th width="188px">封面</th>
                        <th >标题</th>
                        <th width="158px">更新时间<Button onClick={() => {
                            this.props.goPage(1)
                        }}>时间排序</Button></th>
                        <th >工作流程</th>
                        <th >当前步骤</th>
                        <th>状态</th>
                        <th width="220px">操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.contents.map((item, i) => {
                        let btnClas = undefined;
                        let st = "";
                        let sorting = item.smallProcess ? item.smallProcess.sorting : 0;
                        let state = item.state;
                        let rgb;
                        if (sorting) {

                            this.props.smallProcessList.map((item, i) => {
                                if (item.sorting == sorting) {
                                    rgb = this.props.cols[i % 5];
                                }
                            })


                        } else if (item.isProcessStrComplete) {
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
                                <td className="wz">{item.largeProcesses?item.largeProcesses.name:''}</td>
                                {/*{zujian.findManageName(item.creator)}*/}
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
                                            <Button data-id={item.id} onClick={zujian.props.seletContent} href="#"
                                                    bsStyle="info">看</Button>
                                            {item.smallProcess ?
                                                <Button href="#" data-id={item.id} onClick={zujian.submitAudit}
                                                        bsStyle="success">转下步</Button> : undefined}
                                            {item.edit ?
                                                <Button target="_blank"
                                                        href={"/group/addContent.html?id=" + item.id + "&groupId=" + groupId}
                                                        bsStyle="primary">编</Button>
                                                : undefined}
                                            {/*{item.synchronization ?
                                                <Button href="#" data-id={item.id} onClick={zujian.synchronizationAudit}
                                                        bsStyle="success">提</Button>
                                                : undefined}*/}
                                            {item.delete ?
                                                <Button href="#" data-id={item.id} onClick={zujian.delete}
                                                        bsStyle="danger">删</Button>
                                                : undefined}
                                            {contentType === "album" ?
                                                <Button href="#" onClick={this.topspeedAddId}
                                                        data-id={item.id}>极速选</Button>
                                                : undefined}
                                            <Button href={"/content/queryByContentId.html?id=" + item.id} target="_blank">链接</Button>
                                        </ButtonGroup>

                                        <ButtonGroup bsSize="xsmall" justified>
                                            {item.editContent &&
                                            <Button href="#" bsStyle="primary">{item.editContent}</Button>}
                                            {item.deleEditContent &&
                                            <Button href="#" bsStyle="danger" onClick={this.delOnlyString}
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
                    <tfoot>
                    <tr>
                        <td colSpan="4">
                            <ButtonGroup className="listContent_pl">
                                <Button onClick={this.props.sellectAll} bsStyle="primary">全选</Button>
                                <Button onClick={this.props.sellectaAgainst} bsStyle="primary">反选</Button>
                                <Button onClick={this.props.sellectClear} bsStyle="primary">取消</Button>
                                <DropdownButton title="选中" id="bg-nested-dropdown" bsStyle="primary">
                                    {this.props.smallProcessList.map((item, i) => {
                                        return (
                                            <MenuItem eventKey={i} data-sorting={item.sorting} key={item.id}
                                                      onClick={this.props.checkedState}>{item.name}</MenuItem>
                                        )
                                    })}
                                </DropdownButton>
                                {this.props.actionButtons.audit ?
                                    <Button onClick={this.props.batchSubmitThrough} bsStyle="primary">
                                        批量通过
                                    </Button>
                                    : undefined}
                               {this.props.actionButtons.submit ?
                                    <Button onClick={this.props.batchTurnNextStep} bsStyle="primary">
                                        批量转下一步
                                    </Button>
                             : undefined}
                            </ButtonGroup>

                        </td>
                        <td colSpan="6">
                        </td>
                    </tr>
                    </tfoot>
                </Table>
            </div>
        )
    }
}
export default GroupContent; 
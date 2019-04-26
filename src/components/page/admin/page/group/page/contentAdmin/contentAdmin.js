/**
 * Created by linhui on 17-11-25.小组内容管理
 */
require('../../../../../../../styles/group/contentAdmin.css');
import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import {ajax} from '../../../../../../../components/lib/util/ajax';
import {getManage, infoNoty} from '../../../../../../../components/lib/util/global';
import {Paging3} from '../../../../../../../components/lib/util/Paging';
import {
    Panel,
    ButtonToolbar,
    ButtonGroup,
    Checkbox,
    Button,
    Modal,
    Form,
    Table,
    FormGroup,
    FormControl,
    ControlLabel,
    Row,
    Col,
    Label,
} from 'react-bootstrap'

class ContentAdmin extends React.Component {//内容列表
    constructor(props) {
        super(props);
        this.state = {
            pageNow: 1,
            pageSize: 16,
            count: 0,
            manageList: [],//小组内容数据
            loginManage: '',
        }
    }

    componentDidMount() {
        getManage((data) => {
            if (data) {
                this.setState({loginManage: data}, () => {
                    this.goPage(1);
                });
            } else {
                this.goPage(1);
            }
        });

    }

    queryGroupList = (data) => {//拿取小组列表数据
        let zujian = this;

        function forManageList(i, json) {
            let manageList = json.manageList;
            if (manageList.length > i) {
                if (manageList[i].process) {
                    /* ajax.ajax({
                         type: 'post',
                         url: '/content/admin/manageGroup/queryLargeProcessById.io',//根据id获取工作流程名字
                         data: {groupId: manageList[i].id},
                         isCloseMask: true,
                         callback: (json20) => {*/

                    ajax.ajax({
                        type: 'post',
                        url: '/content/admin/manageGroup/queryLargeProcessByIdCount.io',//步骤总数
                        data: {groupId: manageList[i].id, contentModeId: 0},
                        isCloseMask: true,
                        callback: (json21) => {
                            manageList[i].strCompleteContent = json21[0].isProcessStrCompleteCount ? json21[0].isProcessStrCompleteCount : 0;
                            manageList[i].smallProcessList = json21[0].count;
                            /* if (json20 && json20.largeProcess) {
                                 manageList[i].processName = json20.largeProcess.name;
                             }
                             if (json21.length > 0 && json20.smallProcessList.length > 0) {
                                 let smallProcessList = json20.smallProcessList;
                                 for (let z = 0; z < json21.length; z++) {
                                     for (let x = 0; x < smallProcessList.length; x++) {
                                         if (json21[z].id == smallProcessList[x].id) {
                                             manageList[i].smallProcessList = json21;
                                         }
                                     }
                                 }
                             }*/
                            i++;
                            zujian.setState(json, () => {
                                forManageList(i, json);
                            });
                        }
                    });
                    /*
                                            }
                                        });*/
                } else {
                    i++;
                    zujian.setState(json, () => {
                        forManageList(i, json);
                    });
                }
            } else {
                zujian.setState(json);
            }
        }

        ajax.ajax({
            type: 'post',
            url: '/user/admin/group/queryGroupList.io',
            data: data,
            isCloseMask: true,
            callback: (json) => {
                let i = 0;
                this.setState(json, () => {
                    forManageList(i, json);
                });
            }
        });
    };

    goPage = (pageNow) => {/*点击分页*/
        let zujian = this;
        pageNow = pageNow ? pageNow : zujian.state.pageNow;
        zujian.queryGroupList({
            pageNow: pageNow,
            pageSize: zujian.state.pageSize,

        });
    };
    isHideGroup = (env) => {//隐藏显示小组
        let i = $(env.target).data('i');
        let data = this.state.manageList[i];
        let isHide = false;
        if (data.isHide) {
            isHide = false;
        } else {
            isHide = true;
        }
        ajax.ajax({
            type: 'post',
            url: '/user/admin/group/addGroupIsHide.io',
            data: {groupId: data.id, isHide: isHide},
            callback: (json) => {
                if (isHide) {
                    infoNoty('隐藏成功', 'success');
                } else {
                    infoNoty('显示成功', 'success');
                }
                this.goPage();
            }
        });
    };

    render() {
        let grade = this.state.loginManage && this.state.loginManage.loginManage ? this.state.loginManage.loginManage.grade : '';
        return (
            <div>
                <div className="allColor">
                    <Panel header={<h3>分组内容管理</h3>} bsStyle="success">
                        <Row>
                            {(this.state.manageList ? this.state.manageList : []).map((item, i) => {
                                return (
                                    <Col sm={4} md={4} className="listManage" onClick={this.edit} key={item.id}
                                         data-id={item.id}>
                                        <div className="widthHeght">
                                            <Panel header={item.name + (item.isHide ? "(该小组已被隐藏，组员不可见)" : "")}
                                                   bsStyle={item.isHide ? "danger" : "info"}>
                                                <Row>
                                                    <Col sm={12}>
                                                        <div style={{width: "120px", float: "left"}}>
                                                            <img className="imgFloat"
                                                                 style={{width: '120px', height: '120px'}}
                                                                 src='http://assets.alicdn.com/apps/mytaobao/3.0/profile/defaultAvatar/avatar-160.png'/>
                                                        </div>
                                                    </Col>
                                                    <div className="positionRelative"
                                                         style={{
                                                             textAlign: "left",
                                                             float: "left",
                                                             "marginLeft": "138px",
                                                             "marginTop": "-123px"
                                                         }}>
                                                        {/*   <p className="talentData">小组名:<strong>{item.name}</strong></p>
                                                         <p className="talentData">工作流程名:<strong>{item.processName}</strong></p>

                                                         */}
                                                        <Row>
                                                            {(item.smallProcessList ? item.smallProcessList : []).map((smallProcess, x) => {
                                                                let bsStyle = undefined;
                                                                let sorting = smallProcess.sorting;
                                                                if (sorting > 8) {
                                                                    sorting = sorting % 8;
                                                                }
                                                                switch (sorting) {
                                                                    case 0 :
                                                                        break;
                                                                    case 1 :
                                                                        bsStyle = "warning";
                                                                        break;
                                                                    case 2 :
                                                                        bsStyle = "danger";
                                                                        break;
                                                                    case 3 :
                                                                        bsStyle = "primary";
                                                                        break;
                                                                    case 4 :
                                                                        bsStyle = "success";
                                                                        break;
                                                                    case 5 :
                                                                        bsStyle = "info";
                                                                        break;
                                                                    case 7 :
                                                                        break;
                                                                    case 8 :
                                                                        bsStyle = "primary";
                                                                        break;
                                                                }
                                                                return (
                                                                    <Col sm={4} key={smallProcess.id}>
                                                                        <h4>
                                                                            <Label bsStyle={bsStyle}>
                                                                                {smallProcess.name + '(' + smallProcess.count.count + ')'}
                                                                            </Label>
                                                                        </h4>
                                                                    </Col>

                                                                )
                                                            })}
                                                            <Col sm={4}>
                                                                <h4>
                                                                    <Label>
                                                                        小组已完成({item.strCompleteContent})
                                                                    </Label>
                                                                </h4>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </Row>
                                                <p/>
                                                <Row>

                                                    <Col sm={4}>
                                                        <Button
                                                            href={'/pc/adm/content/groupList/manageGroup/' + item.id} target="_blank" >内容列表</Button>
                                                    </Col>{/*post.html?groupId=" + item.id*/}
                                                    <Col sm={4}>
                                                        <Button
                                                            href={'/pc/adm/content/groupAdd/manageGroup/' + item.id} target="_blank">创建内容</Button>
                                                    </Col>{/*addContent.html?groupId=*/}
                                                    <Col sm={4}>{grade == 0 &&
                                                    <Button onClick={this.isHideGroup}
                                                            data-i={i}>{item.isHide ? '显示该小组' : '隐藏该小组'}</Button>}</Col>
                                                </Row>
                                            </Panel>
                                        </div>
                                    </Col>
                                )
                            })}
                        </Row>
                        <Paging3 pageNow={this.state.pageNow} pageSize={this.state.pageSize} count={this.state.count}
                                 ref="paging3" goPage={this.goPage}/>
                    </Panel>
                </div>
                <br/>
            </div>
        )

    }
}

export default ContentAdmin;
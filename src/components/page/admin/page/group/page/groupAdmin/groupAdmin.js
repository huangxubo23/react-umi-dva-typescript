/**
 * Created by linhui on 17-12-16.小组管理
 */

require('../../../../../../../styles/user/content.css');
import React from 'react';
import addbut from '../../../../../../../images/user/addbut.png';
import AJAX from '../../../../../../lib/newUtil/AJAX.js';
import {BundleLoading} from '../../../../../../../bundle';
import groupManageModel
    from 'bundle-loader?lazy&name=pc/trends_asset/components/user/listManage/app-[name]!./components/groupManageModel';
import {Tabs, Layout, Tooltip, Pagination, Dialog, Form, Input, Select} from 'element-react';
import 'element-theme-default';

class GroupAdmin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            grade: {
                pageNow: 1,
                pageSize: 23,
                count: 0,
                talent: [],
            },
        }
    }

    componentDidMount() {
        this.getGradeMode();
    };

    getGradeMode = (pageNow = 1) => {//小组
        this.gradeListAJAX.ajax({
            url: "/user/admin/superManage/manage/queryListManageByGrade.io",
            data: {pageNow: pageNow, pageSize: 23},
            callback: (grade) => {
                this.setState({grade});
            }
        });
    };

    editGroup = ({talent}) => {
        let groupLeaderList = talent.groupLeaderList;
        let arr = [], object = {};
        if (groupLeaderList.length > 0) {
            for (let g in groupLeaderList) {
                arr.push(groupLeaderList[g].groupLeader);
                object[groupLeaderList[g].groupLeader.id] = true;
            }
        }
        let group = {
            name: talent.name,
            password: talent.password,
            permissions: talent.process,
            teamLeader: arr,
            id: talent.id,
            groupType: talent.groupType ? talent.groupType : 1,
        };
        this.pushState({group: group, dialogVisible: true, teamLeaderList: arr});
    };

    addGroup = () => {
        this.pushState({
            dialogVisible: true,
            group: {
                name: "",
                password: "",
                teamLeader: [],
                id: 0,
                groupType: 1
            },
        });
    };

    pushState = (item) => {
        let {groupManageModel} = this.state;
        if (groupManageModel) {
            this.groupManageModel.jd.setState(item);
        } else {
            this.setState({groupManageModel: true}, () => {
                const timer = setInterval(() => {
                    let jd = this.groupManageModel.jd;
                    if (jd) {
                      clearInterval(timer);
                        jd.setState(item, () => {
                            jd.newComponentDidMount();
                        });
                    }
                }, 100);
            })
        }
    };

    render() {
        let {grade} = this.state;
        return (
            <div>
                <Tabs type="border-card" activeName={1}>
                    <Tabs.Pane label="小组管理" name={1}>
                        <AJAX ref={e => this.gradeListAJAX = e}>
                            <Layout.Row gutter="10" style={{margin: "8px 0"}}>
                                <Layout.Col md={6} lg={4} className="listManage">
                                    <div className="listManage__" onClick={() => this.addGroup()}>
                                        <div className="portrait">
                                            <img src={addbut} className="img-circle"/>
                                        </div>
                                        <div className="panel panel-info">
                                            <div className="panel-body">增加小组</div>
                                        </div>
                                    </div>
                                </Layout.Col>
                                {grade.talent.map(item => {
                                    let defaultUrl = 'https://assets.alicdn.com/apps/mytaobao/3.0/profile/defaultAvatar/avatar-160.png';
                                    return (
                                        <Layout.Col md={6} lg={4} className="listManage" key={"talent" + item.id}>
                                            <div className="listManage__"
                                                 onClick={() => this.editGroup({talent: item})}>
                                                <div className="portrait">
                                                    <img src={item.portrait ? item.portrait : defaultUrl}
                                                         className="img-circle"/>
                                                </div>
                                                <div className="panel panel-info">
                                                    <Tooltip className="item" effect="dark"
                                                             content={item.name ? item.name : "暂无名称"}
                                                             placement="bottom">
                                                        <div className="panel-body" style={{
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                            overflow: "hidden",
                                                        }}>
                                                            {item.name ? item.name : "暂无名称"}
                                                        </div>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        </Layout.Col>
                                    )
                                })}
                            </Layout.Row>
                        </AJAX>
                        <div style={{margin: '16px 0 10px'}}>
                            <Pagination layout="total, prev, pager, next, jumper" total={grade.count}
                                        pageSize={grade.pageSize}
                                        currentPage={grade.pageNow} onCurrentChange={this.getGradeMode}/>
                        </div>
                    </Tabs.Pane>
                </Tabs>
                {this.state.groupManageModel &&
                <BundleLoading ref={e => this.groupManageModel = e} load={groupManageModel}
                               update={() => this.getGradeMode(grade.pageNow)}/>}
            </div>
        )
    }
}


export default GroupAdmin;

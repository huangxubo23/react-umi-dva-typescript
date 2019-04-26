/**
 * Created by shiying on 17-11-14.
 */
require('../../../../../../../styles/user/content.css');
import React from 'react';
import ReactChild from "../../../../../../lib/util/ReactChild";
import AJAX from '../../../../../../lib/newUtil/AJAX.js';
import '../../../../../../../styles/user/content.css';
import addbut from '../../../../../../../images/user/addbut.png';
import {BundleLoading} from '../../../../../../../bundle';
import staffModal
    from 'bundle-loader?lazy&name=pc/trends_asset/components/user/listManage/app-[name]!./components/staffModal';
import {Tabs, Layout, Button, Input, Pagination, Tooltip} from 'element-react';
import 'element-theme-default';

class EmpManage extends ReactChild {
    constructor(props) {
        super(props);
        this.state = {
            staff: {
                pageNow: 1,
                pageSize: 23,
                count: 0,
                talent: [],
            },
            staffName: '',//员工搜索
            crew: {
                pageNow: 1,
                pageSize: 23,
                count: 0,
                talent: [],
            },
            crewName: '',//组员搜索
            activeName: 1,
            crewJudge: true
        }
    }

    componentDidMount() {
        this.getContentMode();
    };

    getContentMode = (pageNow = 1) => {//员工||组员
        let {activeName, staffName, crewName} = this.state;
        let ajax = {
            url: `/user/admin/superManage/manage/${activeName === 1 ? 'queryListManage' : 'queryListManageByZy'}.io`,
            data: {
                pageNow: pageNow,
                pageSize: 23,
                name: activeName === 1 ? staffName : crewName
            },
            callback: (data) => {
                this.setState({[activeName === 1 ? 'staff' : 'crew']: data});
            }
        };
        if (activeName === 1) {
            this.staffListAJAX.ajax(ajax);
        } else {
            this.crewListAJAX.ajax(ajax);
        }
    };

    selectPresent = (tab) => {//选择卡
        let activeName = tab.props.name;
        this.setState({activeName}, () => {
            if (activeName === 2 && this.state.crewJudge) {
                this.setState({crewJudge: false}, this.getContentMode)
            }
        });
    };

    searchChange = ({value, type}) => {
        this.setState({[type]: value});
    };

    cleanSeek = ({type}) => {
        this.setState({[type]: ''});
    };

    obtain = (pageNow = 1) => {//分页
        this.getContentMode(pageNow);
    };

    editPersonnel = ({talent}) => {
        let {...setTalent} = talent;
        let teamId = setTalent.teamId instanceof Array;
        if (!teamId) {
            setTalent.teamId = [];
        }
        this.pushState({
            talent: setTalent,
            dialogVisible: true,
            editId: talent.id,
            initial: talent.grade === 0 ? '管理员' : ''
        });
    };

    addPersonnel = (permission) => {
        this.pushState({
            dialogVisible: true,
            talent: {
                id: 0,
                name: "",
                nick: "",
                password: "",
                permissions: {},
                grade: permission,
                teamId: [],
                topPermissions: {}
            }
        });
    };

    pushState = (item) => {
        let {staffModal} = this.state;
        let object = {
            dialogVisible: true,
            talent: {
                id: 0,
                name: "",
                nick: "",
                password: "",
                permissions: {},
                grade: '',
                teamId: [],
                topPermissions: {}
            }
        };
        if (staffModal) {
            this.staffModal.jd.setState(object, () => {
                this.staffModal.jd.setState(item);
            });

        } else {
            this.setState({staffModal: true}, () => {
                let i = setInterval(() => {
                    let jd = this.staffModal.jd;
                    if (jd) {
                        clearInterval(i);
                        jd.setState(object, () => {
                            jd.setState(item);
                        });
                    }
                }, 100);
            })
        }
    };

    render() {
        let {activeName, staffName, staff, crewName, crew} = this.state;
        return (
            <div>
                <Tabs type="border-card" activeName={activeName} onTabClick={this.selectPresent}>
                    <Tabs.Pane label="员工管理" name={1}>
                        <Layout.Row style={{margin: "8px 0"}}>
                            <Layout.Col span="24">
                                <Input placeholder="请输入员工名字搜索" value={staffName}
                                       onChange={(value) => this.searchChange({value, type: 'staffName'})} prepend={
                                    <Button type="primary"
                                            onClick={() => this.cleanSeek({type: 'staffName'})}>清空</Button>
                                } append={<Button type="primary" icon="search"
                                                  onClick={() => this.getContentMode()}>查询</Button>}/>
                            </Layout.Col>
                        </Layout.Row>
                        <AJAX ref={e => this.staffListAJAX = e}>
                            <Layout.Row gutter="10" style={{margin: "8px 0"}}>
                                <Layout.Col md={6} lg={4} className="listManage">
                                    <div className="listManage__" onClick={() => this.addPersonnel(1)}>
                                        <div className="portrait">
                                            <img src={addbut} className="img-circle"/>
                                        </div>
                                        <div className="panel panel-info">
                                            <div className="panel-body">增加员工</div>
                                        </div>
                                    </div>
                                </Layout.Col>
                                {staff.talent.map(item => {
                                    let defaultUrl = 'https://assets.alicdn.com/apps/mytaobao/3.0/profile/defaultAvatar/avatar-160.png';
                                    return (
                                        <Layout.Col md={6} lg={4} className="listManage" key={"talent" + item.id}>
                                            <div className="listManage__"
                                                 onClick={() => this.editPersonnel({talent: item})}>
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
                            <Pagination layout="total, prev, pager, next, jumper" total={staff.count}
                                        pageSize={staff.pageSize}
                                        currentPage={staff.pageNow} onCurrentChange={this.obtain}/>
                        </div>
                    </Tabs.Pane>
                    <Tabs.Pane label="组员管理" name={2}>
                        <Layout.Row style={{margin: "8px 0"}}>
                            <Layout.Col span="24">
                                <Input placeholder="请输入组员名字搜索" value={crewName}
                                       onChange={(value) => this.searchChange({value, type: 'crewName'})} prepend={
                                    <Button type="primary"
                                            onClick={() => this.cleanSeek({type: 'crewName'})}>清空</Button>
                                } append={<Button type="primary" icon="search"
                                                  onClick={() => this.getContentMode()}>查询</Button>}/>
                            </Layout.Col>
                        </Layout.Row>
                        <AJAX ref={e => this.crewListAJAX = e}>
                            <Layout.Row gutter="10" style={{margin: "8px 0"}}>
                                <Layout.Col span="4" className="listManage">
                                    <div className="listManage__" onClick={() => this.addPersonnel(3)}>
                                        <div className="portrait">
                                            <img src={addbut} className="img-circle"/>
                                        </div>
                                        <div className="panel panel-info">
                                            <div className="panel-body">增加组员</div>
                                        </div>
                                    </div>
                                </Layout.Col>
                                {crew.talent.map(item => {
                                    let defaultUrl = 'https://assets.alicdn.com/apps/mytaobao/3.0/profile/defaultAvatar/avatar-160.png';
                                    return (
                                        <Layout.Col span="4" className="listManage" key={"talent" + item.id}>
                                            <div className="listManage__"
                                                 onClick={() => this.editPersonnel({talent: item})}>
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
                            <Pagination layout="total, prev, pager, next, jumper" total={crew.count}
                                        pageSize={crew.pageSize}
                                        currentPage={crew.pageNow} onCurrentChange={this.obtain}/>
                        </div>
                    </Tabs.Pane>
                </Tabs>
                {this.state.staffModal &&
                <BundleLoading ref={e => this.staffModal = e} load={staffModal} update={this.obtain}
                               activeName={activeName}/>}
            </div>
        )
    }
}

export default EmpManage;

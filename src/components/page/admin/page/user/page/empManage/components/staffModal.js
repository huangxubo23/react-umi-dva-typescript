/**
 * Created by shiying on 18-9-18
 */

import React from 'react';
import Menu from '../../../../../components/AdminMenu';
import AJAX from '../../../../../../../lib/newUtil/AJAX.js';
import {JurisdictionModel} from '../../../components/JurisdictionModel';
import {
    Tabs,
    Layout,
    Button,
    Input,
    Pagination,
    Tooltip,
    Dialog,
    Checkbox,
    Radio,
    Message,
    MessageBox,
    Notification
} from 'element-react';
import 'element-theme-default';
import {ThousandsOfCall} from "../../../../../../../lib/util/ThousandsOfCall";

class LargeProcessModel extends React.Component {//流程步骤模态
    constructor(props) {
        super(props);
        this.state = {
            showProcessModel: false,
            groupLargeProcess: '',//流程步骤数据
            stepstr: this.props.stepstr,//步骤id
            groupId: '',//小组id
        }
    }

    componentDidMount = () => {
        this.process();
    };
    process = () => {//根据小组id拿取流程步骤
        let {groupId} = this.props;
        if (groupId) {
            this.largeProcessModelAJAX.ajax({
                url: "/content/admin/manageGroup/queryLargeProcessById.io",
                data: {groupId},
                callback: (groupLargeProcess) => {
                    this.setState({groupLargeProcess});
                }
            })
        }
    };

    forsmallId = (id) => {//循环判断步骤id
        let {stepstr} = this.state;
        let flag = false;
        if (stepstr && stepstr.length >= 0) {
            for (let i = 0; i < stepstr.length; i++) {
                if (stepstr[i].id == id) {
                    flag = true;
                }
            }
        }
        return flag;
    };

    smallProcessChange = ({value, checked, name}) => {//步骤返回事件
        let smallProcessId = value;
        let {stepstr, groupLargeProcess} = this.state;
        if (checked) {
            if (!stepstr || stepstr.length <= 0) {
                stepstr = [];
            }
            stepstr.push({id: smallProcessId});
        } else {
            let stepstrs = [];
            for (let i = 0; i < stepstr.length; i++) {
                if (stepstr[i].id != smallProcessId) {
                    stepstrs.push({id: stepstr[i].id});
                }
            }
            stepstr = stepstrs;
        }
        let {groupId, getState, setPaState} = this.props;
        let talent = getState.talent;
        let teamId = talent[name];
        if (!teamId || teamId.length <= 0) {
            teamId[0].processId = groupLargeProcess.largeProcess.id;
            teamId[0].stepstr = stepstr;
        } else {
            for (let i = 0; i < teamId.length; i++) {
                if (teamId[i].groupId == groupId) {
                    teamId[i].processId = groupLargeProcess.largeProcess.id;
                    teamId[i].stepstr = stepstr;
                }
            }
        }
        talent[name] = teamId;
        this.setState({stepstr}, setPaState({talent}));
    };

    render() {
        let {smallProcessList = []} = this.state.groupLargeProcess;
        return (
            <div>
                <Layout.Row gutter="10" style={{margin: "6px 0"}}>
                    <Layout.Col span='4' style={{textAlign: 'right'}}>
                        步骤勾选
                    </Layout.Col>
                    <AJAX ref={e => this.largeProcessModelAJAX = e}>
                        <Layout.Col span='20'>
                            {smallProcessList.map(item => {
                                return (
                                    <Checkbox key={item.id} label={item.name} checked={this.forsmallId(item.id)}
                                              onChange={(value) => this.smallProcessChange({
                                                  value: item.id,
                                                  checked: value,
                                                  name: 'teamId'
                                              })}/>

                                )
                            })}
                        </Layout.Col>
                    </AJAX>
                </Layout.Row>
            </div>
        )
    }
}

class StaffModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogVisible: false,
            Jurisdiction: [],
            allTalent:[],//已过滤达人数据
            topPermissions: [],
            teamId: [],
            talent: {
                id: 0,
                name: "",//名字
                nick: "",//混淆id
                password: "",//密码
                permissions: {},//普通员工权限详情
                grade: 0,//管理员或普通员工
                teamId: [],//兼职的小组管理
                topPermissions: {},
            },
            editId: "",
            invitationEntryLink: '',//邀请入职链接
            initial: '',
            talentList:[]
        }
    }

    componentDidMount() {
        this.getContentMode(() => {
            this.setTeamLeader(() => {
                this.daren_list();
            });
        });
    }

    setThisState = (state, callback) => {
        this.setState(state, () => {
            if (callback && (typeof callback) == "function") {
                callback();
            }
        });
    };

    getContentMode = (callback) => {
        this.staffModelAJAX.ajax({
            url: "/user/admin/superManage/manage/takePermission.io",
            data: {},
            callback: ({topPermissions = [], permissions}) => {
                this.setState({
                    Jurisdiction: permissions,
                    topPermissions,
                    permissionsVersion: this.isPermissions(permissions)
                }, callback);
            }
        });
    };

    isPermissions = (per) => {
        if (per && per.length > 0) {
            if (typeof per[0] === 'string') {
                return 1;
            } else {
                return 2
            }
        }
    };

    setTeamLeader = (callback) => {
        this.staffModelAJAX.ajax({
            url: "/user/admin/visible/queryManageByType.io",
            data: {},
            callback: (data) => {
                this.setState({teamId: data.talent}, () => {
                    if (callback) {
                        callback()
                    }
                });
            }
        })
    };

    daren_list = (callback) => {//获取授权达人列表
        ThousandsOfCall.acoustic(
            {}, "requestTanleList", (msg) => {
                if (msg.success) {
                    let talentList =msg.data;
                    let allTalent =[];
                    for (let i = 0; i < talentList.length; i++) {
                        //allTalent.value.push(talentList[i].title);
                        allTalent.push(talentList[i].title);

                    }
                    this.setState({talentList:talentList,allTalent:allTalent});
                } else {
                    Message.error('获取达人列表失败');
                }
            }
        )
    };

    talentStateChange = ({value, name, checked}) => {//共用change
        let {talent, teamId, Jurisdiction, talentList,allTalent} = this.state;
        if (name === 'topPermissions' || name === 'permissions') {
            let permission = talent[name];
            if (checked) {
                //let allTalent = {title: '使用授权账号', value: []};
                permission[value] = true;
                if (value.indexOf('$')>-1) {
                     allTalent = [];
                    for (let i = 0; i < talentList.length; i++) {
                        //allTalent.value.push(talentList[i].title);
                        allTalent.push(talentList[i].title);
                        if (value === talentList[i].title) {
                            permission['sqdr-'+talentList[i].id] = true;
                        }
                    }
                    if(Jurisdiction[1].value!=="$allTalent"){
                        Jurisdiction.splice(1, 0,{title:"$使用授权账号",value:"$allTalent"});
                    }
                   // Jurisdiction.splice(1, 0, obj);
                }else{
                    for (let i = 0; i < talentList.length; i++) {
                        if (value === talentList[i].title) {
                            permission['sqdr-'+talentList[i].id] = true;
                        }
                    }
                }
                talent[name] = permission;
                this.setState({talent, Jurisdiction,allTalent});
            } else {
                delete permission[value];
                if (value.indexOf('$')>-1 ) {
                    for (let i in permission) {
                        for (let t = 0; t < talentList.length; t++) {
                            if (i.indexOf('sqdr-') > -1&&i.split('sqdr-')[1] == talentList[t].id) {
                                delete permission[talentList[t].title];
                                delete permission['sqdr-'+talentList[t].id];
                            }
                        }
                    }
                    for(let j in Jurisdiction){
                        if(Jurisdiction[j].value==='$allTalent'){
                            Jurisdiction.splice(j, 1);
                        }
                    }
                }else{
                    for (let i = 0; i < talentList.length; i++) {
                        if (value === talentList[i].title) {
                            delete permission['sqdr-'+talentList[i].id];
                        }
                    }
                }
                talent[name] = permission;
                this.setState({talent, Jurisdiction});
            }

        } else if (name === 'teamId') {
            let teamId = talent[name];
            if (checked) {
                let ss = teamId instanceof Array;
                if (!ss) {
                    teamId = [];
                    teamId.push({groupId: value});
                } else {
                    teamId.push({groupId: value});
                }
            } else {
                let teamIds = [];
                for (let i = 0; i < teamId.length; i++) {
                    if (teamId[i].groupId != value) {
                        teamIds.push(teamId[i]);
                    }
                }
                teamId = teamIds;
            }
            talent[name] = teamId;
            this.setState({talent});
        } else {
            talent[name] = value;
            this.setState({talent});
        }
    };

    forGroupId = (id) => {//循环判断小组id
        let {teamId} = this.state.talent;
        let flag = false;
        for (let i = 0; i < teamId.length; i++) {
            if (teamId[i].groupId == id) {
                flag = true;
                break;
            }
        }
        return flag;
    };

    submit = () => {
        let {id, name, nick, password, permissions, grade, teamId, topPermissions = 0,permissionsVersion} = this.state.talent;
        let talents = {
            id, name, subNick: nick, password,
            permissions: permissionsVersion === 1 ? this.judgePermissions(permissions) : this.judgeNewPermissions(permissions),
            grade, teamId, topPermissions,
        };
        this.staffModelAJAX.ajax({
            url: "/user/admin/superManage/manage/addOrUpManages.io",
            data: {manAge: JSON.stringify(talents)},
            callback: () => {
                Message({
                    message: '提交成功',
                    type: 'success'
                });
                this.close(() => {
                    this.props.update();
                });
            }
        });
    };

    judgeNewPermissions = (per) => {
        let {Jurisdiction,talentList,allTalent} = this.state;
        let Jurisdictions = [...allTalent,...this.isArray(Jurisdiction)];
        let pr ={};
        for (let p in per) {
            if(Jurisdictions.join().indexOf(p) >-1||p.indexOf('sqdr-')>-1){
                pr[p]=per[p];
            }
            for (let t = 0; t < talentList.length; t++) {
                if(p.indexOf('sqdr-')>-1){
                    let str =p.split('sqdr-')[1];
                    if (talentList[t].id==str) {
                        pr[p]=per[p];
                    }
                }

            }
        }
        return pr;
    };

    isArray = (array) => {
        if(array instanceof Array){
            let arr = [];
            for (let a = 0, l = array.length; a < l; a++) {
                if (typeof array[a] === 'string') {
                    arr.push(array[a]);
                } else {
                    arr.push(...this.isArray(array[a].value));
                }
            }
            return arr;
        }else {
            return [];
        }
    };

    judgePermissions = (per) => {
        let {Jurisdiction,talentList} = this.state;
        let pr ={};
        for (let p in per) {
            if(Jurisdiction.join().indexOf(p) >-1||p.indexOf('sqdr-')>-1){
                pr[p]=per[p];
                //delete per[p];
            }
            for (let t = 0; t < talentList.length; t++) {
                if (talentList[t].title===p) {
                    pr[p]=per[p];
                }
            }
        }
        return pr;
    };

    del = () => {
        let {id} = this.state.talent;
        MessageBox.confirm(`确定将这个${this.props.activeName === 1 ? '员工' : '组员'}删除?`, '提示', {
            type: 'success'
        }).then(() => {
            this.staffModelAJAX.ajax({
                url: "/user/admin/superManage/manage/delManage.io",
                data: {id: JSON.stringify(id)},
                callback: () => {
                    Message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.close(() => {
                        this.props.update();
                    });
                }
            })
        }).catch(() => {
            Notification({
                title: '消息',
                message: '已取消删除',
                type: 'info'
            });
        });
    };

    close = (callback) => {
        this.setState({dialogVisible: false}, callback);
    };

    render() {
        let {talent, teamId, dialogVisible, topPermissions, Jurisdiction, initial, permissionsVersion} = this.state;
        let {grade, id} = talent;
        let login = dialogVisible && Menu.isLogin();
        let talentTeamId = talent.teamId;
        if (teamId.length > 0 && talentTeamId.length > 0) {
            for (let i = 0; i < teamId.length; i++) {
                for (let x = 0; x < talentTeamId.length; x++) {
                    if (teamId[i].id == talentTeamId[x].groupId) {
                        teamId[i].stepstr = talentTeamId[x].stepstr;
                    }
                }
            }
        }
        let arr = [{margin: "6px 0"}, {margin: "8px 0", textAlign: 'right', fontWeight: 'bold'}];
        return (
            <div style={{textAlign: 'left'}}>
                <Dialog title={grade === 3 ? (id === 0 ? "添加组员" : "编辑组员") : (id === 0 ? "添加员工" : "编辑员工")} size="small"
                        visible={dialogVisible}
                        onCancel={() => this.setState({dialogVisible: false})}
                        lockScroll={false}>
                    <AJAX ref={e => this.staffModelAJAX = e}>
                        <Dialog.Body>
                            <Layout.Row gutter="10" style={arr[0]}>
                                <Layout.Col span='4' style={arr[1]}>
                                    入职链接
                                </Layout.Col>
                                <Layout.Col span='20'>
                                    <Input
                                        value={'http://www.52wzg.com/user/addNewEmp.html?orgId=' + (login && login.loginManage.organization.id)}
                                        disabled/>
                                </Layout.Col>
                            </Layout.Row>
                            <Layout.Row gutter="10" style={arr[0]}>
                                <Layout.Col span='4' style={arr[1]}>
                                    名字
                                </Layout.Col>
                                <Layout.Col span='20'>
                                    <Input placeholder="请输入名字..." value={talent.name}
                                           onChange={(value) => this.talentStateChange({value, name: 'name'})}/>
                                </Layout.Col>
                            </Layout.Row>
                            <Layout.Row gutter="10" style={arr[0]}>
                                <Layout.Col span='4' style={arr[1]}>
                                    混淆id
                                </Layout.Col>
                                <Layout.Col span='20'>
                                    <Input placeholder="让员工登入后台后,首页右上角有提供" value={talent.nick}
                                           onChange={(value) => this.talentStateChange({value, name: 'nick'})}/>
                                </Layout.Col>
                            </Layout.Row>
                            <Layout.Row gutter="10" style={arr[0]}>
                                <Layout.Col span='4' style={arr[1]}>
                                    密码
                                </Layout.Col>
                                <Layout.Col span='20'>
                                    <Input type="password" placeholder="请输入密码..." value={talent.password}
                                           onChange={(value) => this.talentStateChange({value, name: 'password'})}/>
                                </Layout.Col>
                            </Layout.Row>
                            {(talent.orgIsManage && topPermissions.length > 0) &&
                            <Layout.Row gutter="10" style={arr[0]}>
                                <Layout.Col span='4' style={arr[1]}>
                                    顶级权限
                                </Layout.Col>
                                <Layout.Col span='20'>
                                    <Layout.Row gutter="10" style={{margin: "6px 0"}}>
                                        {topPermissions.map((item, index) => {
                                            return (
                                                <Layout.Col span='8'>
                                                    <Checkbox key={index} label={item}
                                                              checked={item in talent.topPermissions}
                                                              onChange={(value) => this.talentStateChange({
                                                                  value: item,
                                                                  checked: value,
                                                                  name: 'topPermissions'
                                                              })}/>
                                                </Layout.Col>

                                            )
                                        })}
                                    </Layout.Row>
                                </Layout.Col>
                            </Layout.Row>}
                            <Layout.Row gutter="10" style={arr[0]}>
                                <Layout.Col span='4' style={arr[1]}>
                                    权限管理
                                </Layout.Col>
                                <Layout.Col span='20' style={{margin: "8px 0"}}>
                                    <Radio.Group value={talent.grade}
                                                 onChange={(value) => this.talentStateChange({value, name: 'grade'})}>
                                        <Radio value={0}>管理员(所有权限)</Radio>
                                        <Radio value={1}>普通员工(部分权限)</Radio>
                                        <Radio value={3}>组员(选择组员后不能在改为其他权限)</Radio>
                                    </Radio.Group>
                                </Layout.Col>
                            </Layout.Row>
                            {talent.grade === 1 && <Layout.Row gutter="10" style={arr[0]}>
                                <Layout.Col span='4' style={arr[1]}>
                                    员工权限
                                </Layout.Col>
                                <Layout.Col span='20'>
                                    {permissionsVersion === 1 ?
                                        <Layout.Row gutter="10" style={{margin: "6px 0"}}>
                                            {Jurisdiction.map((item, index) => {
                                                return (
                                                    <Layout.Col span='8' key={index}>
                                                        <Checkbox label={item} checked={item in talent.permissions}
                                                                  onChange={(value) => this.talentStateChange({
                                                                      value: item,
                                                                      checked: value,
                                                                      name: 'permissions'
                                                                  })}/>
                                                    </Layout.Col>

                                                )
                                            })}
                                        </Layout.Row> :
                                        <div style={{margin: "25px 0 10px"}}>
                                            <JurisdictionModel Jurisdiction={Jurisdiction} talent={talent} allTalent={this.state.allTalent}
                                                               onChange={this.talentStateChange}/>
                                        </div>
                                    }
                                </Layout.Col>
                            </Layout.Row>}
                            {(talent.grade === 1 || talent.grade === 3) && <Layout.Row gutter="10" style={arr[0]}>
                                <Layout.Col span='4' style={arr[1]}>
                                    小组权限
                                </Layout.Col>
                                <Layout.Col span='20'>
                                    <Layout.Row gutter="10" style={{margin: "6px 0"}}>
                                        {teamId.length > 0 ? teamId.map((item, index) => {
                                            return (
                                                <Layout.Col span='20'>
                                                    <Checkbox key={index} label={item.name}
                                                              checked={this.forGroupId(item.id)}
                                                              onChange={(value) => this.talentStateChange({
                                                                  value: item.id,
                                                                  checked: value,
                                                                  name: 'teamId'
                                                              })}/>
                                                    {this.forGroupId(item.id) && <div>
                                                        <LargeProcessModel groupId={item.id} stepstr={item.stepstr}
                                                                           getState={this.state}
                                                                           setPaState={this.setThisState}/>
                                                    </div>}
                                                </Layout.Col>
                                            )
                                        }) : "还未添加小组"}
                                    </Layout.Row>
                                </Layout.Col>
                            </Layout.Row>}
                            {(talent.id !== 0 && talent.grade !== 0) &&
                            <Button type="danger" onClick={this.del} style={{width: '100%'}}
                                    disabled={initial === '管理员'}>
                                {initial ? '当前为管理员，不可删除(删除需要把权限设置为非管理员)' : `删除${talent.grade === 1 ? "员工" : "组员"}`}
                            </Button>
                            }
                        </Dialog.Body>
                        <Dialog.Footer className="dialog-footer">
                            <Button onClick={() => this.setState({dialogVisible: false})}>取消</Button>
                            <Button type="primary" onClick={this.submit}>确定</Button>
                        </Dialog.Footer>
                    </AJAX>
                </Dialog>
            </div>
        )
    }
}



export default StaffModal;
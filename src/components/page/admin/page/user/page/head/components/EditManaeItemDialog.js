/**
 * Created by 薛荣晖 on 2018/9/26 0026下午 6:06.
 */

import React from "react";
import {Button, Input, Switch, InputNumber, Select, Layout, Checkbox, Collapse, Notification, MessageBox, Message} from "element-react";
import 'element-theme-default';
import AJAX from '../../../../../../../lib/newUtil/AJAX';
import {ThousandsOfCall} from "../../../../../../../lib/util/ThousandsOfCall";

class EditManaeItemDialog extends React.Component {

    statevalue = () => {
        return {
            dialogVisible: false,
            manAgeItem: {//所有导航栏数据
                id: 0,
                title: undefined,//名字
                isPublic: false,//是否对外公开
                rank: 1,//排序
                type: 1,//用户类型
            },
            head: 0,//0:新建，1:编辑,2:查看
            manAgePage: {//子导航栏模态用 - 子导航栏新建数据默认值
                id: 0,
                title: undefined,//名字
                isPublic: false,//是否对外公开
                rank: 1,//排序
                page: undefined,//跳转链接
                supManage: 3,//角色　１指定用户２网站设置３顶级管理员４管理员
                designationMark: '',//指定权限
                managePermissions: '',//员工权限
                topPermissions: '',//顶级权限
                permissions: [],//组织权限
                permission: {},
                manAgeItemId: 0,//大导航栏Id
            },
            seedHead: -1,
            i: -1,
            designationMark: [],//指定权限
            managePermission: [],//员工权限
            topPermissions: [],//顶级权限
            permission: [], // 组织权限
        }
    };

    constructor(props) {
        super(props);
        this.state = this.statevalue();
    };
    componentDidMount(){
        this.daren_list();
    }
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

    headChange = ({value, name}) => {//所有激发事件
        let manAgeItem = this.state.manAgeItem;
        manAgeItem[name] = value;
        this.setState({manAgeItem});
    };

    sonHeadChang = ({value, name}) => {//子导航栏激发事件
        let [managePage, i, manAgePage = {}] = [this.state.manAgeItem.managePage, this.state.i, this.state.manAgePage];
        if (i >= 0) {
            manAgePage = managePage[i];
        }
        manAgePage[name] = value;
        this.isNewHead(manAgePage, this.state.manAgeItem, i);
    };
    isNewHead = (manAgePage, manAgeItem, i) => {//是否新建子导航
        if (i >= 0) {
            manAgeItem.managePage[i] = manAgePage;
            this.setState({manAgeItem: manAgeItem});
        } else {
            this.setState({manAgePage: manAgePage});
        }
    };


    manageSelectChange = (env) => {//子导航栏选择事件
        let [managePage, i, manAgePage] = [this.state.manAgeItem.managePage, env.i, {}];
        if (i === -1) {
            manAgePage.id = 0;
        } else {
            manAgePage = managePage[i];
        }
        this.editManaeItemDialogAjax.ajax({
            type: 'post',
            url: '/user/admin/superManage/manage/takePermission.io',//超超级管理员拿取全部员工权限
            data: {},
            callback: (json) => {
                this.setState({
                        managePermission: json.permissions, topPermissions: json.topPermissions, designationMark: json.designationMark, manAgePage: manAgePage, i: i, supManage: 3
                    },
                    () => {
                        this.queryPermissionList();
                    });
            }
        });
    };

    queryPermissionList = () => {//查询PermissionList给添加用
        this.editManaeItemDialogAjax.ajax({
            type: 'post',
            url: '/user/admin/superOrganization/queryPermissionList.io',
            data: {},
            callback: (json) => {
                this.setState(json);
            }
        });
    };

    supManageChange = (env) => {//角色选择事件
        let {manAgeItem, i, manAgePage} = this.state;
        if (i >= 0) {
            manAgeItem.managePage[i].supManage = env.supManage;
            manAgeItem.managePage[i].topPermissions = '';
            manAgeItem.managePage[i].designationMark = '';
            manAgeItem.managePage[i].managePermissions = '';
            manAgeItem.managePage[i].permissions = [];
        } else {
            manAgePage.supManage = env.supManage;
            manAgePage.topPermissions = '';
            manAgePage.designationMark = '';
            manAgePage.managePermissions = '';
            manAgePage.permissions = [];
        }
        this.isNewHead(manAgePage, manAgeItem, i);

    };

    designationMarkChange = (env) => {//指定权限选择事件
        let {manAgeItem, i, manAgePage} = this.state;
        if (i >= 0) {
            manAgeItem.managePage[i].designationMark = env.roleSelection;
        } else {
            manAgePage.designationMark = env.roleSelection
        }
        this.isNewHead(manAgePage, manAgeItem, i);
    };

    CheckboxChange = ({value, checked}) => {//员工管理选择权限事件
        let {manAgeItem, i, manAgePage} = this.state;
        if (!manAgePage.managePermissions) {
            manAgePage.managePermissions = '';
        }
        if (i >= 0) {
            let booleans = manAgeItem.managePage[i].managePermissions.charAt(manAgeItem.managePage[i].managePermissions.length - 1) === ',';
            if (booleans) {
                manAgeItem.managePage[i].managePermissions = manAgeItem.managePage[i].managePermissions.substring(0, manAgeItem.managePage[i].managePermissions.length - 1)
            }
            if (checked) {
                if (manAgeItem.managePage[i].managePermissions) {
                    manAgeItem.managePage[i].managePermissions += ',' + value;
                } else {
                    manAgeItem.managePage[i].managePermissions = value;
                }
            } else {
                manAgeItem.managePage[i].managePermissions = manAgeItem.managePage[i].managePermissions.replace(value, '')
            }
        } else {
            let booleans = manAgePage.managePermissions.charAt(manAgePage.managePermissions.length - 1) === ',';
            if (booleans) {
                manAgePage.managePermissions = manAgePage.managePermissions.substring(0, manAgePage.managePermissions.length - 1)
            }
            if (checked) {
                if (manAgePage.managePermissions) {
                    manAgePage.managePermissions += ',' + value;
                } else {
                    manAgePage.managePermissions = value;
                }
            } else {
                manAgePage.managePermissions = manAgePage.managePermissions.replace(value, '')
            }
        }
        this.isNewHead(manAgePage, manAgeItem, i);
    };

    topPermissionsChange = ({value, checked}) => {//网站配置 —— 顶级权限
        let {manAgeItem, i, manAgePage} = this.state;
        if (!manAgePage.topPermissions) {
            manAgePage.topPermissions = '';
        }
        if (i >= 0) {

            let boolean = manAgeItem.managePage[i].topPermissions.charAt(manAgeItem.managePage[i].topPermissions.length - 1) === ',';
            if (boolean) {
                manAgeItem.managePage[i].topPermissions = manAgeItem.managePage[i].topPermissions.substring(0, manAgeItem.managePage[i].topPermissions.length - 1);
            }
            if (checked) {
                if (manAgeItem.managePage[i].topPermissions) {
                    manAgeItem.managePage[i].topPermissions += ',' + value;
                } else {
                    manAgeItem.managePage[i].topPermissions += value;
                }
            } else {
                manAgeItem.managePage[i].topPermissions = manAgeItem.managePage[i].topPermissions.replace(value, '');
            }
        } else {
            let boolean = manAgePage.topPermissions.charAt(manAgePage.topPermissions.length - 1) === ',';
            if (boolean) {
                manAgePage.topPermissions = manAgePage.topPermissions.substring(0, manAgePage.topPermissions.length - 1);
            }
            if (checked) {
                if (manAgePage.topPermissions) {
                    manAgePage.topPermissions += ',' + value;
                } else {
                    manAgePage.topPermissions += value;
                }
            } else {
                manAgePage.topPermissions = manAgePage.topPermissions.replace(value, '');
            }
        }
        this.isNewHead(manAgePage, manAgeItem, i);
    };

    permissionsChange = (value) => {//管理员/普通员工 —— 组织权限
        let {manAgeItem, i, manAgePage, permission} = this.state;
        let array = [];
        for (let y = 0; y < permission.length; y++) {
            for (let x = 0; x < value.length; x++) {
                if (permission[y].id == value[x]) {
                    array.push(permission[y]);
                }
            }
        }

        if (i >= 0) {
            manAgeItem.managePage[i].permissions = array;
        } else {
            manAgePage.permissions = array;
        }
        this.isNewHead(manAgePage, manAgeItem, i);
    };

    addmanAgeItem = (callback) => {//新建主导航栏
        let manAgeItem = this.state.manAgeItem;
        let title = manAgeItem.title;
        let rank = manAgeItem.rank;
        let state = this.state;
        if (!title) {
            Notification.error({
                title: '错误',
                message: '名称不能为空'
            });
            return false;
        } else if (!rank) {
            Notification.error({
                title: '错误',
                message: '排序不能为空或者为0'
            });
            return false;
        }
        this.editManaeItemDialogAjax.ajax({
            url: '/user/admin/superOrganization/addManAgeItem.io',
            type: 'post',
            data: {'manAgeItem': JSON.stringify(manAgeItem)},
            callback: () => {
                Notification({
                    title: '',
                    message: '提交成功',
                    type: 'success'
                });
                if (typeof(callback) == 'function') {
                    callback(state);
                } else {
                    this.props.cloneModal();
                    this.props.queryHeadList();
                }
            }
        })
    };

    addManAgePage = (state) => {// 新建子导航栏
        state = state ? state : this.state;
        let {manAgePage, i, manAgeItem} = state; // 主导航栏数据 - 子导航栏数据
        if (i >= 0) {
            manAgePage = manAgeItem.managePage[i];
        }
        let permission = manAgePage.permission;//拿取组织权限
        let permissions = manAgePage.permissions;// 组织权限
        let title = manAgePage.title;// 名称
        let rank = manAgePage.rank;// 排序
        let page = manAgePage.page;// 跳转链接
        let supManage = manAgePage.supManage;// 角色 １指定用户２网站设置３顶级管理员４管理员
        let designationMark = manAgePage.designationMark;// 指定权限
        let manAgeItemId = manAgeItem.id;// 主导航栏ID
        if (!title) {
            Notification.error({
                title: '错误',
                message: '名称不能为空'
            });

            return false;
        } else if (!rank) {
            Notification.error({
                title: '错误',
                message: '排序不能为空或者为0'
            });
            return false;
        } else if (!page) {
            Notification.error({
                title: '错误',
                message: '跳转链接不能为空'
            });
            return false;
        } else if (supManage == 1) {
            if (!designationMark) {
                Notification.error({
                    title: '错误',
                    message: '请选择指定权限'
                });
                return false;
            }
        }
        for (let i in permission) {
            permissions.push({id: permission[i]});
        }
        this.editManaeItemDialogAjax.ajax({
            type: 'post',
            url: '/user/admin/superOrganization/addManAgePage.io',
            data: {'manAgePage': JSON.stringify(manAgePage), 'manAgeItemId': manAgeItemId},
            callback: () => {
                Notification({
                    title: '',
                    message: '提交成功',
                    type: 'success'
                });
                this.props.cloneModal();
                this.props.queryHeadList();
            }
        });
    };

    editNavigation = () => {//修改导航栏与子导航栏
        let {i, manAgePage} = this.state;
        if (i !== -1 && manAgePage.id !== 0) {
            this.addmanAgeItem((state) => {
                this.addManAgePage(state);
            });
        } else {
            this.addmanAgeItem();
        }
    };

    delManAgePage = (id) => {//删除子导航栏
        MessageBox.confirm('此操作将删除子导航, 是否继续?', '提示', {
            type: 'warning'
        }).then(() => {
            this.editManaeItemDialogAjax.ajax({
                url: '/user/admin/superOrganization/delManAgePage.io',
                type: 'post',
                data: {'id': id},
                callback: () => {
                    Message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.props.cloneModal();
                    this.props.queryHeadList();
                }
            })
        }).catch(() => {
            Message({
                type: 'info',
                message: '已取消删除'
            });
        })
    };


    sonSubmit = () => {//打开新建按钮事件
        let state = this.statevalue();
        let manAgePage = state.manAgePage;
        this.setState({manAgePage: manAgePage, seedHead: 0});
    };

    render() {
        let {manAgeItem, head} = this.state;
        let managePage = manAgeItem.managePage ? manAgeItem.managePage : [];
        let activeName = "1";
        return (
            <div>
                <NewPanel header='主导航栏'>
                    <Layout.Row gutter='20' style={{marginTop: '15px'}} type='flex' align='middle'>
                        <Layout.Col span='5'>
                            <strong>名称</strong>
                        </Layout.Col>
                        <Layout.Col span='19'>
                            <Input value={manAgeItem.title} size='small' placeholder='请输入导航栏名称' disabled={head === 2}
                                   onChange={(value) => {
                                       this.headChange({value: value, name: 'title'})
                                   }}
                            />
                        </Layout.Col>
                    </Layout.Row>
                    <Layout.Row gutter='20' style={{marginTop: '20px'}} type='flex' align='middle'>
                        <Layout.Col span='5'>
                            <strong>是否公开</strong>
                        </Layout.Col>
                        <Layout.Col span='19'>
                            <Switch disabled={head === 2} style={{float: 'left'}}
                                    value={manAgeItem.isPublic}
                                    onChange={(value) => {
                                        this.headChange({value: value, name: 'isPublic'})
                                    }}
                            >
                            </Switch>
                        </Layout.Col>
                    </Layout.Row>
                    <Layout.Row gutter='20' style={{marginTop: '20px'}} type='flex' align='middle'>
                        <Layout.Col span='5'>
                            <strong>排序</strong>
                        </Layout.Col>
                        <Layout.Col span='19'>
                            <InputNumber size='small' value={manAgeItem.rank} defaultValue={manAgeItem.rank} max="99" disabled={head === 2} style={{float: 'left'}}
                                         onChange={(value) => {
                                             this.headChange({value: value, name: 'rank'})
                                         }}/>
                        </Layout.Col>
                    </Layout.Row>
                    <Layout.Row gutter='20' style={{marginTop: '20px', marginBottom: '15px'}} type='flex' align='middle'>
                        <Layout.Col span='5'>
                            <strong>用户类型</strong>
                        </Layout.Col>
                        <Layout.Col span='19'>
                            <Select value={manAgeItem.type} size="small" disabled={head === 2} style={{float: 'left'}}
                                    onChange={(value) => {
                                        this.headChange({value: value, name: 'type'})
                                    }}>
                                <Select.Option label='达人' value={1}/>
                                <Select.Option label='商家' value={2}/>
                            </Select>
                        </Layout.Col>
                    </Layout.Row>
                </NewPanel>

                <AJAX ref={e => this.editManaeItemDialogAjax = e}>
                    <div style={{textAlign: 'left'}}>
                        {head == 2 && <div><Collapse value={activeName} accordion={true}>
                            {managePage.map((some, x) => {
                                return (
                                    <Collapse.Item title={some.title} name={some.id} key={+new Date() + x}>
                                        <NewPanel header={some.title}>
                                            <SubnavigationBar editState={this.state} manAgePage={some} allTalent={this.state.allTalent}/>
                                        </NewPanel>
                                    </Collapse.Item>
                                )
                            })}
                        </Collapse>
                            <div style={{marginTop: '10px'}}>
                                <Button type='success' size='small' onClick={this.sonSubmit}>新建子导航栏</Button>
                                <div id='myButton' style={{textAlign: 'center'}}>
                                    {this.state.seedHead == 0 && <NewPanel header='新建子导航栏'>
                                        <SubnavigationBar editState={this.state} allTalent={this.state.allTalent} seedHead={this.state.seedHead}
                                                          supManageChange={this.supManageChange}
                                                          designationMarkChange={this.designationMarkChange}
                                                          topPermissionsChange={this.topPermissionsChange}
                                                          sonHeadChang={this.sonHeadChang}
                                                          CheckboxChange={this.CheckboxChange}
                                                          permissionsChange={this.permissionsChange}

                                        />
                                    </NewPanel>}
                                </div>
                            </div>
                        </div>}
                    </div>

                    {head == 1 &&
                    <div>
                        <NewPanel header={'编辑导航栏'}>
                            <SubnavigationBar editState={this.state} allTalent={this.state.allTalent} manageSelectChange={this.manageSelectChange}
                                              supManageChange={this.supManageChange}
                                              designationMarkChange={this.designationMarkChange}
                                              topPermissionsChange={this.topPermissionsChange}
                                              sonHeadChang={this.sonHeadChang}
                                              CheckboxChange={this.CheckboxChange}
                                              permissionsChange={this.permissionsChange}
                                              delManAgePage={this.delManAgePage}
                            />
                        </NewPanel>
                    </div>}
                </AJAX>
            </div>
        )
    }
}

class SubnavigationBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let {manAgeItem, manAgePage, head, i, designationMark, managePermission, topPermissions, permission} = this.props.editState;
        let seedHead = this.props.seedHead;
        let managePage = manAgeItem.managePage ? manAgeItem.managePage : [];
        manAgePage = i >= 0 ? manAgeItem.managePage[i] : this.props.manAgePage ? this.props.manAgePage : manAgePage;
        let supManage = manAgePage.supManage ? manAgePage.supManage : 3;
        let roleSelection = manAgePage.designationMark ? manAgePage.designationMark : -1;
        let topLevelPermissions = manAgePage.topPermissions ? manAgePage.topPermissions : '';
        let permissions = manAgePage.managePermissions ? manAgePage.managePermissions : '';
        let discuss = manAgePage.permissions ? manAgePage.permissions : [];
        let discussIds = [];
        for (let i = 0; i < discuss.length; i++) {
            discussIds.push(discuss[i].id + '');
        }
        return (
            <div>
                {head !== 2 &&
                <Layout.Row gutter='20' style={{marginTop: '20px', marginBottom: '15px'}} type='flex' align='middle'>
                    <Layout.Col span='5'>
                        <strong>选择</strong>
                    </Layout.Col>
                    <Layout.Col span={manAgePage.id == 0 ? '19' : '10'}>
                        <Select value={i} size="small" onChange={(value) => {
                            this.props.manageSelectChange({i: value})
                        }} disabled={head === 2}>
                            <Select.Option value={-1} label='选择'/>
                            {managePage.map((item, i) => {
                                return (
                                    <Select.Option key={item.id} value={i} label={item.title}/>
                                )
                            })}
                        </Select>
                    </Layout.Col>
                    <Layout.Col span='5'>
                        {manAgePage.id !== 0 ?
                            <div>
                                <Button type='danger' size='small' onClick={() => {
                                    this.props.delManAgePage(manAgePage.id)
                                }}>删除子导航栏</Button>
                            </div> : ''}
                    </Layout.Col>
                </Layout.Row>}

                {((seedHead == 0 && manAgePage.id == 0) || manAgePage.id !== 0) &&
                <div>
                    <Layout.Row gutter='20' style={{marginTop: '20px', marginBottom: '15px'}} type='flex' align='middle'>
                        <Layout.Col span='5'>
                            <strong>子导航名</strong>
                        </Layout.Col>
                        <Layout.Col span='19'>
                            <Input size='small' placeholder='请输入子导航栏名称' value={manAgePage.title} disabled={head == 2 && seedHead !== 0 ? head == 2 : ''}
                                   onChange={(value) => {
                                       this.props.sonHeadChang({value: value, name: 'title'})
                                   }}/>
                        </Layout.Col>
                    </Layout.Row>

                    <Layout.Row gutter='20' style={{marginTop: '20px', marginBottom: '15px'}} type='flex' align='middle'>
                        <Layout.Col span='5'>
                            <strong>排序</strong>
                        </Layout.Col>
                        <Layout.Col span='19'>
                            <InputNumber size='small' min="1" defaultValue={manAgePage.rank} value={manAgePage.rank} max="99" style={{float: 'left'}} disabled={head == 2 && seedHead !== 0 ? head == 2 : ''}
                                         onChange={(value) => {
                                             this.props.sonHeadChang({value: value, name: 'rank'})
                                         }}/>
                        </Layout.Col>
                    </Layout.Row>

                    <Layout.Row gutter='20' style={{marginTop: '20px', marginBottom: '15px'}} type='flex' align='middle'>
                        <Layout.Col span='5'>
                            <strong>跳转链接</strong>
                        </Layout.Col>
                        <Layout.Col span='19'>
                            <Input size='small' placeholder='请输入跳转链接' value={manAgePage.page} disabled={head == 2 && seedHead !== 0 ? head == 2 : ''}
                                   onChange={(value) => {
                                       this.props.sonHeadChang({value: value, name: 'page'})
                                   }}/>
                        </Layout.Col>
                    </Layout.Row>

                    <Layout.Row gutter='20' style={{marginTop: '20px', marginBottom: '15px'}} type='flex' align='middle'>
                        <Layout.Col span='5'>
                            <strong>角色</strong>
                        </Layout.Col>
                        <Layout.Col span='19'>
                            <Select size="small" style={{float: 'left'}} value={supManage} disabled={head == 2 && seedHead !== 0 ? head == 2 : ''}
                                    onChange={(value) => {
                                        this.props.supManageChange({supManage: value})
                                    }}>
                                <Select.Option value={3} label='顶级管理员'/>
                                <Select.Option value={1} label='指定用户'/>
                                <Select.Option value={2} label='网站配置'/>
                                <Select.Option value={4} label='管理员'/>
                                <Select.Option value={5} label='普通员工'/>
                                <Select.Option value={6} label='公开页面'/>
                                <Select.Option value={7} label='线'/>
                            </Select>
                        </Layout.Col>
                    </Layout.Row>
                </div>}

                {supManage == 1 &&
                <Layout.Row gutter='20' style={{marginTop: '20px', marginBottom: '15px'}} type='flex' align='middle'>
                    <Layout.Col span='5'>
                        <strong>指定权限</strong>
                    </Layout.Col>
                    <Layout.Col span='19'>
                        <Select size="small" style={{float: 'left'}} value={roleSelection} disabled={head == 2 && seedHead !== 0 ? head == 2 : ''}
                                onChange={(value) => {
                                    this.props.designationMarkChange({roleSelection: value})
                                }}>
                            <Select.Option value={roleSelection} label='请选择指定权限'/>
                            {designationMark.map((item, i) => {
                                return (
                                    <Select.Option key={item} value={item} label={item}/>
                                )
                            })}
                        </Select>
                    </Layout.Col>
                </Layout.Row>}
                {supManage == 2 &&
                <div>
                    <Layout.Row gutter='10' style={{marginTop: '20px'}} type='flex' align='middle'>
                        <Layout.Col span='5'>
                            <strong>顶级权限</strong>
                        </Layout.Col>
                    </Layout.Row>
                    <div style={{margin: '10px 15px 10px 15px', textAlign: 'left'}}>
                        {topPermissions.map((item, i) => {
                            return (
                                <Checkbox key={+new Date() + i} label={item} checked={topLevelPermissions.indexOf(item) > -1} disabled={head == 2 && seedHead !== 0 ? head == 2 : ''}
                                          style={i === 0 ? {marginLeft: '15px'} : {}}
                                          onChange={(value) => {
                                              this.props.topPermissionsChange({value: item, checked: value})
                                          }}/>
                            )
                        })}
                    </div>
                </div>}

                {supManage == 5 || supManage == 4 ?
                    <div>
                        <Layout.Row gutter='10' style={{marginTop: '20px'}} type='flex' align='middle'>
                            <Layout.Col span='5'>
                                <strong>组织权限</strong>
                            </Layout.Col>
                        </Layout.Row>
                        <div style={{margin: '10px 15px 10px 15px', textAlign: 'left'}}>
                            {permission.map((item, i) => {
                                return (
                                    <Checkbox.Group value={discussIds} key={item.id} onChange={this.props.permissionsChange}>
                                        <Checkbox label={item.id + ''} disabled={head == 2 && seedHead !== 0 ? head == 2 : ''}
                                        >{item.remarks}</Checkbox>
                                    </Checkbox.Group>
                                )
                            })}
                        </div>
                    </div> : ''}


                {supManage == 5 &&
                <div>
                    <Layout.Row gutter='10' style={{marginTop: '20px'}} type='flex' align='middle'>
                        <Layout.Col span='5'>
                            <strong>查看权限</strong>
                        </Layout.Col>
                    </Layout.Row>
                    <Layout.Row gutter='10' style={{marginBottom: '5px'}} type='flex' align='middle'>
                        <div disabled={head === 2}>
                            <JurisdictionModel Jurisdiction={managePermission} permissions={permissions} onChange={this.props.CheckboxChange} disabled={head == 2 && seedHead !== 0 ? head == 2 : ''}/>
                        </div>
                    </Layout.Row>
                </div>
                }
            </div>
        )
    }
}

class JurisdictionModel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        let {Jurisdiction, permissions, onChange, indexProps = 'index', disabled} = this.props;
        if (Jurisdiction == "$allTalent") {Jurisdiction = this.props.allTalent?this.props.allTalent:[];}
        return (
            <div>
                {Jurisdiction.map((item, index) => {
                    if (item == "$allTalent") item = this.props.allTalent?this.props.allTalent:[];
                    if (typeof item === 'string') {
                        return (
                            <Checkbox key={`${indexProps}-${index}`} label={item} checked={permissions.indexOf(item) > -1} disabled={disabled}
                                      onChange={(value) => onChange({value: item, checked: value})} style={index === 0 ? {marginLeft: '15px'} : {}}/>
                        )
                    } else {
                        return (
                            <div key={`${indexProps}-${index}`} style={{float: 'left', marginLeft: '18px', textAlign: 'left'}}>
                                <div style={{fontWeight: 'bold', fontSize: '15px'}}>{item.title}</div>
                                <div style={{marginLeft: '50px'}}>
                                    <JurisdictionModel Jurisdiction={item.value} onChange={onChange} permissions={permissions} indexProps={`${indexProps}-${index}`} disabled={disabled}/>
                                </div>
                            </div>
                        )
                    }
                })}
                <hr/>
            </div>
        )
    }
}

class NewPanel extends React.Component {
    render() {
        let {header} = this.props;
        return (
            <div style={{
                marginTop: "10px",
                marginBottom: '12px',
                backgroundColor: '#fff',
                border: '1px solid transparent',
                borderRadius: '4px',
                boxShadow: '0 1px 1px rgba(0, 0, 0, .05)',
                borderColor: '#bce8f1'
            }}>
                <div style={{
                    padding: '1px 10px',
                    borderBottom: '1px solid transparent',
                    borderTopLeftRadius: '3px',
                    borderTopRightRadius: '3px',
                    color: '#4E7B8F',
                    backgroundColor: '#d9edf7',
                    borderColor: '#bce8f1',
                }}>
                    <h5 style={{textAlign: 'left', marginLeft: '20px'}}>{header}</h5>
                </div>
                <div style={{
                    padding: '10px',
                }}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default EditManaeItemDialog;
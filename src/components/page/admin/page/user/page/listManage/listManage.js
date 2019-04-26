/**
 * Created by 薛荣晖 on 2018/11/24 0024上午 8:28.列表管理
 */

import React from "react";
import ReactChild from "../../../../../../lib/util/ReactChild";
import AJAX from '../../../../../../lib/newUtil/AJAX';
import {Tabs, Button, Input, Layout, Popover, Select, Table, Pagination, Alert} from "element-react";
import 'element-theme-default';
import '../../../../../../../styles/user/content.css';
import '../../../../../../../styles/component/util/minSm.js.css';

require('../../../../../../../styles/content/content_template.css');

import {DialogBundle} from '../../../../../../../bundle';
import orgDetailsContainere
    from 'bundle-loader?lazy&name=pc/trends_asset/components/user/head/app-[name]!./components/orgDetails';
import empPermissionsModalContainere
    from 'bundle-loader?lazy&name=pc/trends_asset/components/user/head/app-[name]!./components/empPermissionsModal';

const popoverHoverFocus = (title, content) => {
    return (
        <Popover id="popover-trigger-hover-focus" title={title}>
            <ul>
                {content.map((item, i) => {
                    return (
                        <li key={i}>{item}</li>
                    )
                })}
            </ul>
        </Popover>
    )
};

class ListManage extends ReactChild {
    constructor(props) {
        super(props);
        this.state = {
            tabsValue: '1',
            org: {//组织搜索字段
                pageNow: 1,
                pageSize: 20,
                orgName: ""
            },
            orgContent: {//组织获取数据
                pageNow: 1,
                pageSize: 20,
                count: 10,
                orgList: []
            },
            daren: {//达人搜索字段
                pageNow: 1,
                pageSize: 20,
                talentName: ""
            },
            darenContent: {//达人获取数据
                pageNow: 1,
                pageSize: 20,
                count: 10,
                talentList: []
            },
            staff: {//人员搜索字段
                pageNow: 1,
                pageSize: 20,
                id: ""
            },
            staffContent: {//人员获取数据
                pageNow: 1,
                pageSize: 20,
                count: 10,
                manageList: []
            },
            dialogVisible: false,
        }
    }

    componentDidMount() {
        this.getData();
    };

    getData = (type = "org") => {
        let t = this.state[type];
        let obj = {org: 'ListManageAjax', daren: 'ListManageAjax1', staff: 'ListManageAjax2',};

        this[obj[type]].ajax({
            url: this.url(type),
            data: t,
            callback: (data) => {//获取数据改变属性

                this.setState({[type + 'Content']: data}, () => {
                    this.getTable()
                });
            }
        });
    };

    url = (type) => {
        let obj = {
            org: "/user/admin/superOrganization/userInfo/getorgListPage.io",
            daren: "/user/admin/superOrganization/userInfo/getTalentMessageListByNameAndOrgIdPage.io",
            staff: "/user/admin/superOrganization/userInfo/querListManageByIdAndOrgIdAndTalentIdAndGradePage.io"
        };
        return obj[type];
    };


    handleSelect = (p) => {//面板切换
        let {orgContent, darenContent, staffContent} = this.state;
        this.setState({tabsValue: p.props.name}, () => {
            if (p.props.name === '1') {
                if (orgContent.orgList < 1) {
                    this.getData("org");
                }
            } else if (p.props.name === '2') {
                if (darenContent.talentList < 1) {
                    this.getData("daren");
                }
            } else if (p.props.name === '3') {
                if (staffContent.manageList < 1) {
                    this.getData("staff");
                }
            }
        })
    };

    SearchTypeChange = ({type, n, value, c}) => {//搜索类型选择
        let t = type;
        let Type = value;//内容 —— c属性
        let con = n;//"org","daren","staff"
        let content = this.state[con];
        this.setState({
            [c]: Type == "grade" ? "0" : "",
            [t]: Type,
            [con]: {
                pageNow: content.pageNow,
                pageSize: content.pageSize,
                [Type]: Type == "grade" ? "0" : "",
            }
        });
    };

    SearchContentChange = ({value, c, type, n}) => {//搜索内容改变
        let t = c;//属性 
        let con = n;//"org","daren","staff"
        let content = this.state[con];
        content[type] = value;
        this.setState({
            [t]: value,
            [con]: content
        });
    };

    setKey = (n) => {//搜索操作
        let con = n;
        let content = this.state[con.n];
        content.pageNow = 1;
        this.setState({[con.n]: content}, () => {
            this.getData(con.n);
        });
    };

    toPageSize = ({pageSize, title}) => {//每页个数
        let state = this.state;
        state[title].pageSize = pageSize;
        this.setState(state, () => {
            //this.goPage();
            this.getData(title);
        });

    };

    goPageNow = ({pageNow, title}) => {//跳转页
        let state = this.state;
        state[title].pageNow = pageNow;
        this.setState(state, () => {
            //this.goPage();
            this.getData(title);
        });
    };

    Modality = (id) => {//组织详情模态
        this.orgDetails.open({id: id}, () => {
            this.orgDetails.getBun((gt) => {
                gt.itemData(id);
            });
            this.orgDetails.getBun((gt) => {
                gt.orgIdData(id);
            });
        })
    };

    powerModality = (i) => {//权限设置模态
        let staffContent = this.state.staffContent;
        let manage = staffContent.manageList[i];
        this.empPermissionsModal.open({manage: manage}, () => {
            this.empPermissionsModal.getBun((gt) => {
                gt.takePermission();
            })
        });
    };

    perData = (title, per, type) => {//详情按钮
        let arr = [];
        for (let p in per) {
            if (type === "per" || type === "top_per") {
                arr.push(p);
            } else if (type === "leader") {
                arr.push(per[p].groupLeader.name);
            } else if (type === "groups") {
                arr.push(per[p].name);
            }
        }
        return arr;
    };

    judgeLevel = (type) => {//级别
        let obj = {
            0: "管理员",
            1: "普通员工",
        };
        return obj[type];
    };
    getTable = () => {
        let {orgContent, darenContent, staffContent} = this.state;
        let columns = [//组织列表
            {label: '组织id', prop: 'id'},
            {label: '组织名称', prop: 'name'},
            {label: '电话', prop: 'telephone'},
            {label: 'QQ', prop: 'iocq'},
            {label: '邮箱', prop: 'mailbox'},
            {label: '剩余点卡', prop: 'remainingNum'},
            {
                label: '达人列表', prop: 'daren', render: (data) => {
                    return (
                        <div>
                            <Button size='small' type='info' onClick={() => {
                                this.setState({
                                    tabsValue: '2',
                                    daren: {
                                        pageNow: 1,
                                        pageSize: 20,
                                        orgId: data.id
                                    },
                                    darenSearchType: "orgId",
                                    darenSearchContent: data.id
                                }, () => {
                                    this.getData("daren");
                                })
                            }}>转达人列表</Button>
                        </div>
                    )
                }
            },
            {
                label: '员工列表', prop: 'orgId', render: (data) => {
                    return (
                        <div>
                            <Button size='small' type='info' onClick={() => {
                                this.setState({
                                    tabsValue: '3',
                                    staff: {
                                        pageNow: 1,
                                        pageSize: 20,
                                        orgId: data.id
                                    },
                                    staffSearchType: "orgId",
                                    staffSearchContent: data.id
                                }, () => {
                                    this.getData("staff");
                                })
                            }}>转员工列表</Button>
                        </div>
                    )
                }
            },
            {
                label: '详情', prop: 'id', render: (data) => {
                    return (
                        <div>
                            <Button size='small' type='success' onClick={() => {
                                this.Modality(data.id)
                            }}>组织详情</Button>
                        </div>
                    )
                }
            },
        ];
        let array = [];//组织列表内容
        if (orgContent.orgList.length > 0) {
            orgContent.orgList.map((item, i) => {
                let {id, name, telephone, iocq, mailbox, remainingNum} = item;
                array.push({id: id, name: name, telephone: telephone, iocq: iocq, mailbox: mailbox, remainingNum: remainingNum})
            })
        }

        let columns1 = [//达人列表
            {label: '达人id', prop: 'id'},
            {label: '达人名称', prop: 'title'},
            {label: '粉丝', prop: 'fansNum'},
            {label: '层级', prop: 'rankInfo'},
            {
                label: '对应组织', prop: 'orgId', render: (data) => {
                    return (
                        <div>
                            <Button size='small' type='info' onClick={() => {
                                this.setState({
                                    tabsValue: '1',
                                    org: {
                                        pageNow: 1,
                                        pageSize: 20,
                                        orgId: data.organizationId
                                    },
                                    orgSearchContent: data.organizationId,
                                    orgSearchType: "orgId"
                                }, () => {
                                    this.getData();
                                })
                            }}>转组织列表</Button>
                        </div>
                    )
                }
            },
        ];
        let array1 = [];//达人列表内容
        if (darenContent.talentList.length > 0) {
            darenContent.talentList.map((item, i) => {
                let {id, title, fansNum, rankInfo} = item;
                rankInfo = rankInfo ? "L" + rankInfo : "暂无";
                array1.push({id: id, title: title, fansNum: fansNum, rankInfo: rankInfo, organizationId: item.organizationId})
            })
        }

        let columns2 = [
            {label: '人员名字', prop: 'name', width: 105},
            {label: '组织id', prop: 'organization'},
            {
                label: '高级权限', prop: 'topPermissions', width: 100, render: (data) => {
                    return (
                        <div>
                            <Popover placement="right" title="高级权限" width="165" trigger="hover" content={(
                                <div>
                                    <ul>
                                        {this.perData("高级权限", data.topPermissions, "top_per").map((item, i) => {
                                            return (
                                                <li key={i} style={{textAlign: 'left'}}>{item}</li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            )}>
                                <Button size='small'>详情↑</Button>
                            </Popover>
                        </div>
                    )
                }
            },
            {
                label: '权限 ', prop: 'permissions', width: 95, render: (data) => {
                    return (
                        <div>
                            <Popover placement="right" title="权限" width="165" trigger="hover" content={(
                                <div>
                                    <ul>
                                        {this.perData("权限", data.permissions, "per").map((item, i) => {
                                            return (
                                                <li key={i} style={{textAlign: 'left'}}>{item}</li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            )}>
                                <Button size='small'>详情↑</Button>
                            </Popover>
                        </div>
                    )
                }
            },
            {label: '混淆id', prop: 'nick', minWidth: 290},
            {
                label: '级别', prop: 'grade', width: 95, render: (data) => {
                    return (
                        <div>
                            <span>{this.judgeLevel(data.grade)}</span>
                        </div>
                    )
                }
            },
            {
                label: '小组负责人', prop: 'groupLeaderList', render: (data) => {
                    return (
                        <div>
                            {data.groupLeaderList.length > 0 &&
                            <Popover placement="right" title="高级权限" width="165" trigger="hover" content={(
                                <div>
                                    <ul>
                                        {this.perData("小组负责人", data.topPermissions, "leader").map((item, i) => {
                                            return (
                                                <li key={i} style={{textAlign: 'left'}}>{item}</li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            )}>
                                <Button size='small'>详情↑</Button>
                            </Popover>}
                        </div>
                    )
                }
            },
            {
                label: '负责的小组', prop: 'groupsList', width: 110, render: (data) => {
                    return (
                        <div>
                            {data.groupsList.length > 0 &&
                            <Popover placement="right" title="负责的小组" width="180" trigger="hover" content={(
                                <div>
                                    <ul>
                                        {this.perData("负责的小组", data.groupsList, "groups").map((item, i) => {
                                            return (
                                                <li key={i} style={{textAlign: 'left'}}>{item}</li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            )}>
                                <Button size='small'>详情↑</Button>
                            </Popover>}
                        </div>
                    )
                }
            },
            {
                label: '对应组织', prop: 'orgId', minWidth: 130, render: (data) => {
                    return (
                        <div>
                            <Button.Group>
                                {data.organization &&
                                <Button type="info" size='mini' onClick={() => {
                                    this.setState({
                                        tabsValue: '1',
                                        org: {
                                            pageNow: 1,
                                            pageSize: 20,
                                            orgId: data.organization
                                        },
                                        orgSearchType: "orgId",
                                        orgSearchContent: data.organization
                                    }, () => {
                                        this.getData("org");
                                    })
                                }}>转组织列表</Button>}
                                <Button type="success" size='mini' onClick={() => {
                                    this.powerModality(data.i)
                                }}>权限设置</Button>
                            </Button.Group>
                        </div>
                    )
                }
            },
        ];
        let array2 = [];//员工列表内容
        if (staffContent.manageList.length > 0) {
            staffContent.manageList.map((item, i) => {
                let {name, organization, topPermissions, permissions, nick, grade, groupLeaderList, groupsList} = item;
                organization = organization ? organization.id : '';
                array2.push({
                    name: name, organization: organization, topPermissions: topPermissions, i: i,
                    permissions: permissions, nick: nick, grade: grade, groupLeaderList: groupLeaderList, groupsList: groupsList
                })
            })
        }
        this.setState({columns, columns1, columns2, array, array1, array2});
    };

    render() {
        let {tabsValue, orgSearchType, orgSearchContent, darenSearchType, darenSearchContent, staffSearchType, staffSearchContent, orgContent, darenContent, staffContent, columns, columns1, columns2, array, array1, array2} = this.state;
        let obj = {
            org: [{title: "组织名称", type: "orgName"}, {title: "组织id", type: "orgId"}, {title: "混淆id", type: "subNick"}],
            daren: [{title: "达人名称", type: "talentName"}, {title: "组织id", type: "orgId"}],
            staff: [{title: "个人id", type: "id"}, {title: "组织id", type: "orgId"}, {title: "混淆id", type: "subNick"}, {title: "角色选择", type: "grade"}]
        };
        let g = [{title: "管理员", type: "0"}, {title: "普通员工", type: "1"}];
        return (
            <div>
                <Alert title="列表管理" type="info" closable={false}/>
                <div style={{marginTop: '15px'}}>
                    <Tabs type="card" value={tabsValue} onTabClick={this.handleSelect}>
                        <Tabs.Pane label="组织列表" name='1'>
                            <div style={{minHeight: '1150px'}}>
                                <Layout.Row gutter='20'>
                                    <Layout.Col span='3'>
                                        <strong>选择搜索类型</strong>
                                    </Layout.Col>
                                    <Layout.Col span='6'>
                                        <Select value={orgSearchType} placeholder="请选择" size='small' style={{width: '100%'}} onChange={(value) =>
                                            this.SearchTypeChange({value: value, type: 'orgSearchType', n: 'org'})}>
                                            {obj.org.map((item, i) => {
                                                return (
                                                    <Select.Option key={i} value={item.type} label={item.title}/>
                                                )
                                            })}
                                        </Select>
                                    </Layout.Col>
                                    <Layout.Col span='15'>
                                        <Input placeholder="请输入内容" size='small' value={orgSearchContent} onChange={(value) => {
                                            this.SearchContentChange({value: value, c: 'orgSearchContent', n: 'org', type: orgSearchType ? orgSearchType : "orgName"})
                                        }} onKeyDown={(event) => {
                                            if (event.keyCode == "13") {
                                                this.setKey({n: 'org'})
                                            }
                                        }}
                                               append={<Button type="primary" icon="search" onClick={() => {
                                                   this.setKey({n: 'org'})
                                               }}>搜索</Button>}/>
                                    </Layout.Col>
                                </Layout.Row>
                                <AJAX ref={e => {
                                    this.ListManageAjax = e
                                }}>
                                    <div style={{marginTop: '15px'}} className='divTable'>
                                        <Table style={{width: '100%'}} columns={columns} data={array} border={true}/>
                                    </div>
                                    <DialogBundle ref={e => this.orgDetails = e} dialogProps={{title: '组织详情', size: "small"}}
                                                  bundleProps={{
                                                      load: orgDetailsContainere, closeModal: () => {
                                                          this.orgDetails.setState({dialogVisible: false})
                                                      }
                                                  }}
                                                  dialogFooter={<div>
                                                      <Button type="primary" onClick={() => {
                                                          this.orgDetails.setState({dialogVisible: false})
                                                      }}>取消</Button></div>}>
                                    </DialogBundle>
                                </AJAX>
                                <div style={{marginTop: '30px'}}>
                                    <Pagination layout="total, sizes, prev, pager, next, jumper" total={orgContent.count} pageSizes={[20, 40, 80, 160]}
                                                pageSize={orgContent.pageSize} currentPage={orgContent.pageNow}
                                                onSizeChange={(pageSize) => {
                                                    this.toPageSize({pageSize: pageSize, title: 'org'})
                                                }}
                                                onCurrentChange={(pageNow) => {
                                                    this.goPageNow({pageNow: pageNow, title: 'org'})
                                                }}/>
                                </div>
                            </div>
                        </Tabs.Pane>

                        <Tabs.Pane label="达人列表" name='2'>
                            <div style={{minHeight: '1150px'}}>
                                <Layout.Row gutter='20'>
                                    <Layout.Col span='3'>
                                        <strong>选择搜索类型</strong>
                                    </Layout.Col>
                                    <Layout.Col span='6'>
                                        <Select value={darenSearchType} placeholder="请选择" size='small' style={{width: '100%'}} onChange={(value) =>
                                            this.SearchTypeChange({value: value, type: 'darenSearchType', n: 'daren'})}>
                                            {obj.daren.map((item, i) => {
                                                return (
                                                    <Select.Option key={i} value={item.type} label={item.title}/>
                                                )
                                            })}
                                        </Select>
                                    </Layout.Col>
                                    <Layout.Col span='15'>
                                        <Input placeholder="请输入内容" size='small' value={darenSearchContent} onKeyDown={(event) => {
                                            if (event.keyCode == "13") {
                                                this.setKey({n: 'daren'})
                                            }
                                        }}
                                               onChange={(value) => {
                                                   this.SearchContentChange({value: value, c: 'darenSearchContent', n: 'daren', type: darenSearchType ? darenSearchType : "talentName"})
                                               }}
                                               append={<Button type="primary" icon="search" onClick={() => {
                                                   this.setKey({n: 'daren'})
                                               }}>搜索</Button>}/>
                                    </Layout.Col>
                                </Layout.Row>
                                <AJAX ref={e => {
                                    this.ListManageAjax1 = e
                                }}>
                                    <div style={{marginTop: '15px'}} className='divTable'>
                                        <Table style={{width: '100%'}} columns={columns1} data={array1} border={true}/>
                                    </div>
                                </AJAX>
                                <div style={{marginTop: '30px'}}>
                                    <Pagination layout="total, sizes, prev, pager, next, jumper" total={darenContent.count} pageSizes={[20, 40, 80, 160]}
                                                pageSize={darenContent.pageSize} currentPage={darenContent.pageNow}
                                                onSizeChange={(pageSize) => {
                                                    this.toPageSize({pageSize: pageSize, title: 'daren'})
                                                }}
                                                onCurrentChange={(pageNow) => {
                                                    this.goPageNow({pageNow: pageNow, title: 'daren'})
                                                }}/>
                                </div>
                            </div>
                        </Tabs.Pane>

                        <Tabs.Pane label="员工列表" name='3'>
                            <div style={{minHeight: '1150px'}}>
                                <Layout.Row gutter='20'>
                                    <Layout.Col span='3'>
                                        <strong>选择搜索类型</strong>
                                    </Layout.Col>
                                    <Layout.Col span='6'>
                                        <Select value={staffSearchType} placeholder="请选择" size='small' style={{width: '100%'}} onChange={(value) =>
                                            this.SearchTypeChange({value: value, type: 'staffSearchType', n: 'staff', c: 'staffSearchContent'})}>
                                            {obj.staff.map((item, i) => {
                                                return (
                                                    <Select.Option key={i} value={item.type} label={item.title}/>
                                                )
                                            })}
                                        </Select>
                                    </Layout.Col>
                                    <Layout.Col span='15'>
                                        {staffSearchType == "grade" ?
                                            <Layout.Row>
                                                <Layout.Col span='16'>
                                                    <Select value={staffSearchContent} placeholder="请选择" size='small' onChange={(value) =>
                                                        this.SearchContentChange({value: value, type: {staffSearchType}, n: 'staff', c: 'staffSearchContent'})} style={{marginBottom: "15px", width: '85%'}}>
                                                        {g.map((item, i) => {
                                                            return (
                                                                <Select.Option key={i} value={item.type} label={item.title}/>
                                                            )
                                                        })}
                                                    </Select>
                                                </Layout.Col>
                                                <Layout.Col span='8'>
                                                    <Button type='success' size='small' style={{width: '85%'}} onClick={() => {
                                                        this.setKey({n: 'staff'})
                                                    }}>搜索</Button>
                                                </Layout.Col>
                                            </Layout.Row> :
                                            <Input placeholder="请输入内容" size='small' value={staffSearchContent} onKeyDown={(event) => {
                                                if (event.keyCode == "13") {
                                                    this.setKey({n: 'staff'})
                                                }
                                            }}
                                                   onChange={(value) =>
                                                       this.SearchContentChange({value: value, type: staffSearchType ? staffSearchType : "id", n: 'staff', c: 'staffSearchContent'})}
                                                   append={<Button type="primary" icon="search" onClick={() => {
                                                       this.setKey({n: 'staff'})
                                                   }}>搜索</Button>}/>}
                                    </Layout.Col>
                                </Layout.Row>
                                <AJAX ref={e => {
                                    this.ListManageAjax2 = e
                                }}>
                                    <div style={{marginTop: '15px'}} className='divTable'>
                                        <Table style={{width: '100%'}} columns={columns2} data={array2} border={true}/>
                                    </div>
                                    <DialogBundle ref={e => this.empPermissionsModal = e} dialogProps={{title: '组织详情', size: "small"}}
                                                  bundleProps={{
                                                      load: empPermissionsModalContainere, closeModal: () => {
                                                          this.empPermissionsModal.setState({dialogVisible: false})
                                                      }
                                                  }}
                                                  dialogFooter={<div>
                                                      <Button type="primary" onClick={() => {
                                                          this.empPermissionsModal.setState({dialogVisible: false})
                                                      }}>取消</Button>
                                                      <Button type="primary" onClick={() => {
                                                          this.empPermissionsModal.getBun((gb) => {
                                                              gb.editPermissionsClick();
                                                          });
                                                      }}>修改</Button>
                                                  </div>}>
                                    </DialogBundle>
                                </AJAX>
                                <div style={{marginTop: '30px'}}>
                                    <Pagination layout="total, sizes, prev, pager, next, jumper" total={staffContent.count} pageSizes={[20, 40, 80, 160]}
                                                pageSize={staffContent.pageSize} currentPage={staffContent.pageNow}
                                                onSizeChange={(pageSize) => {
                                                    this.toPageSize({pageSize: pageSize, title: 'staff'})
                                                }}
                                                onCurrentChange={(pageNow) => {
                                                    this.goPageNow({pageNow: pageNow, title: 'staff'})
                                                }}/>
                                </div>
                            </div>
                        </Tabs.Pane>
                    </Tabs>
                </div>
            </div>
        );
    }
}

export default ListManage;
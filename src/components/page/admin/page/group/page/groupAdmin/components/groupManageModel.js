/**
 * Created by 石英 on 2018/9/19 0019下午 4:30.
 */

import React from 'react';
import AJAX from '../../../../../../../lib/newUtil/AJAX.js';
import {
    Tabs,
    Layout,
    Tooltip,
    Pagination,
    Dialog,
    Form,
    Input,
    Select,
    Alert,
    Button,
    Checkbox,
    Tag,
    Message,
    Notification,
    MessageBox
} from 'element-react';
import 'element-theme-default';


class Administrator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogVisible: false,
            teamLeaderName: "",
            teamLeader: [],
            leader: [],
            pageSize: 36,
            pageNow: 1,
            count: 10,
        }
    }

    setTeamLeader = (teamLeaderName = '', callback) => {
        let {pageNow} = this.state;
        this.administratorAJAX.ajax({
            url: "/user/admin/superManage/manage/getTamLeader.io",
            data: {pageNow: pageNow, pageSize: 36, name: teamLeaderName},
            callback: (data) => {
                let manage = data.manage;
                let teamLeader = manage.map(item => {
                    return {name: item.name, id: item.id}
                });
                Object.assign(data, {teamLeader});
                this.setState(data, () => {
                    if (callback && typeof callback == 'function') {
                        callback();
                    }
                });
            }
        })
    };

    selectTeamLeader = (data) => {
        let {name, value, checked} = data;
        let {leader} = this.state;
        if (checked) {
            leader.push(value);
        } else {
            leader.splice(this.index({leader, value}), 1)
        }
        this.setState({[name]: leader});
    };

    index = ({leader, value}) => {
        for (let l = 0; l < leader.length; l++) {
            if (leader[l].id === value.id) {
                return l;
            }
        }
    };

    open = () => {
        this.setState({dialogVisible: true}, this.setTeamLeader('', () => {
            let {teamLeader} = this.props;
            this.setState({leader: teamLeader});
        }));
    };

    searchChange = ({name, value}) => {
        this.setState({[name]: value});
    };

    cleanSeek = ({name}) => {
        this.setState({[name]: ''});
    };

    goPage = (pageNow) => {
        this.setState({pageNow}, this.setTeamLeader)
    };

    submit = () => {
        let {leader} = this.state, {callback} = this.props;
        this.setState({dialogVisible: false}, callback(leader))
    };

    render() {
        let {dialogVisible, teamLeaderName, teamLeader = [], leader, count, pageSize, pageNow} = this.state;
        return (
            <div style={{textAlign: 'left'}}>
                <Dialog title='增改负责人' size="large" visible={dialogVisible}
                        onCancel={() => this.setState({dialogVisible: false})}
                        lockScroll={false}>
                    <Dialog.Body>
                        <Layout.Row>
                            <Layout.Col span="24">
                                <Input placeholder="请输入小组负责人..." value={teamLeaderName}
                                       onChange={(value) => this.searchChange({value, name: 'teamLeaderName'})}
                                       prepend={
                                           <Button type="primary"
                                                   onClick={() => this.cleanSeek({name: 'teamLeaderName'})}>清空</Button>
                                       } append={<Button type="primary" icon="search"
                                                         onClick={() => this.setTeamLeader(teamLeaderName)}>查询</Button>}/>
                            </Layout.Col>
                        </Layout.Row>
                        <AJAX ref={e => this.administratorAJAX = e}>
                            <Layout.Row gutter="10" style={{margin: "6px 0"}}>
                                {teamLeader.map(item => {
                                    return (
                                        <Layout.Col span='6' key={item.id}>
                                            <Checkbox label={item.name}
                                                      checked={leader.map(leaderItem => leaderItem.id).indexOf(item.id) > -1}
                                                      onChange={(value) => this.selectTeamLeader({
                                                          value: item,
                                                          checked: value,
                                                          name: 'leader'
                                                      })}/>
                                        </Layout.Col>

                                    )
                                })}
                            </Layout.Row>
                        </AJAX>
                        <div style={{textAlign: 'center', margin: '5px 0'}}>
                            <Pagination layout="total, prev, pager, next, jumper" total={count} pageSize={pageSize}
                                        currentPage={pageNow} onCurrentChange={this.goPage}/>
                        </div>
                        <div>已选择:{leader.map(item => {
                            return (
                                <Tag type="gray" key={item.id} style={{margin: '3px'}}>{item.name}</Tag>
                            )
                        })}</div>
                    </Dialog.Body>
                    <Dialog.Footer className="dialog-footer">
                        <Button onClick={() => this.setState({dialogVisible: false})}>取消</Button>
                        <Button type="primary" onClick={this.submit}>确定</Button>
                    </Dialog.Footer>
                </Dialog>
            </div>
        )
    }
}

class GroupManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogVisible: false,
            Jurisdiction: [],
            group: {
                name: "",
                password: "",
                permissions: "",
                teamLeader: [],
                id: 0,
                groupType: 1,
            },
            deletePerson: false,
        }
    }

    newComponentDidMount = () => {
        let {groupType} = this.state.group;
        this.getContentMode(groupType)
    };

    getContentMode = (type) => {
        this.permissionsAJAX.ajax({
            url: "/content/admin/superManage/queryLargeProcessByType.io",
            data: {type: type},
            callback: ({largeProcessList = []}) => {
                this.setState({Jurisdiction: largeProcessList});
            }
        });
    };

    onChange(key, value) {
        let {group} = this.state;
        if (key === 'groupType') {
            group.permissions = '';
        }
        this.setState({
            group: Object.assign(group, {[key]: value})
        }, () => {
            if (key === 'groupType') {
                this.getContentMode(value);
            }
        });
    }

    del = () => {
        let {id} = this.state.group;
        MessageBox.confirm(`确定将这个小组删除?`, '提示', {
            type: 'success'
        }).then(() => {
            this.delAJAX.ajax({
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
            });
        }).catch(() => {
            Notification({
                title: '消息',
                message: '已取消删除',
                type: 'info'
            });
        });
    };

    submit = () => {
        let {group} = this.state;
        let {teamLeader} = group;
        if (!group.name) {
            Notification({
                title: '警告',
                message: '您还没有输入组名',
                type: 'warning'
            });
            return;
        }
        if (!group.permissions) {
            Notification({
                title: '警告',
                message: '您还没有选择工作流程',
                type: 'warning'
            });
            return;
        }
        if (teamLeader.length < 1) {
            Notification({
                title: '警告',
                message: '至少选择一个小组负责人',
                type: 'warning'
            });
            return;
        }
        let groupItem = {
            id: group.id,
            name: group.name,
            process: group.permissions,
            password: group.password,
            teamLeader: teamLeader.map(item => item.id).join(),
            grade: 8,
            groupType: group.groupType,
        };
        this.submitAJAX.ajax({
            url: "/user/admin/superManage/manage/addAndUpGroup.io",
            data: {manAge: JSON.stringify(groupItem)},
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

    close = (callback) => {
        this.setState({dialogVisible: false}, callback);
    };

    teamClick = () => {
        this.administrator.open();
    };

    teamLeaderCallback = (value) => {
        let {group} = this.state;
        group.teamLeader = value;
        this.setState({group})
    };

    render() {
        let {group, dialogVisible, Jurisdiction = [], deletePerson} = this.state;
        let groupType = [
            {name: "帖子", type: 1}, {name: "清单", type: 2},
            {name: "好货", type: 3}, {name: "搭配", type: 4},
            {name: "结构体", type: 7}, {name: "短视频", type: 8}
        ];
        return (
            <div style={{textAlign: 'left'}}>
                <Dialog title={group.id === 0 ? "添加小组" : "编辑小组"} size="small" visible={dialogVisible}
                        onCancel={() => this.setState({dialogVisible: false})}
                        lockScroll={false}>
                    <Dialog.Body>
                        <Form labelPosition='right' labelWidth="100" model={this.state.group}
                              className="demo-form-stacked">
                            <Form.Item label="组名">
                                <Input value={group.name} placeholder="请输入组名..."
                                       onChange={this.onChange.bind(this, 'name')}>

                                </Input>
                            </Form.Item>
                            <Form.Item label="内容类型">
                                <Select value={group.groupType} onChange={this.onChange.bind(this, 'groupType')}>
                                    {groupType.map(item => {
                                        return (
                                            <Select.Option label={item.name} value={item.type} key={item.type}/>
                                        )
                                    })}
                                </Select>
                            </Form.Item>
                            <Form.Item label="工作流程">
                                <AJAX ref={e => this.permissionsAJAX = e}>
                                </AJAX>
                                <Select value={group.permissions} onChange={this.onChange.bind(this, 'permissions')}
                                        disabled={Jurisdiction.length < 1}>
                                    {Jurisdiction.map(item => {
                                        return (
                                            <Select.Option label={item.name} value={item.id} key={item.id}/>
                                        )
                                    })}
                                </Select>
                                <div style={{marginTop: '5px'}}>{Jurisdiction.length < 1 &&
                                <Alert title="暂无工作流程选择,请先创建工作流程" type="info"/>}</div>
                            </Form.Item>
                            <Form.Item label="小组负责人">
                                <Button.Group>
                                    <Button type="primary" onClick={this.teamClick}>增改负责人</Button>
                                    <Button type="danger"
                                            onClick={() => this.setState({deletePerson: !deletePerson})}>{deletePerson ? '取消删除' : '删除负责人'}</Button>
                                </Button.Group>
                                <Layout.Row gutter="10" style={{margin: "8px 0"}}>
                                    {(group.teamLeader ? group.teamLeader : []).map((item, i) => {
                                        return (
                                            <Layout.Col span="12" key={i} style={{margin: "6px 0"}}>
                                                <Button type="info">{item.name}</Button>
                                                {deletePerson && <Button plain={true} type="danger" onClick={() => {
                                                    group.teamLeader.splice(i, 1);
                                                    this.setState({group});
                                                }}>删</Button>}
                                            </Layout.Col>
                                        )
                                    })}
                                </Layout.Row>
                                {group.teamLeader.length < 1 && <Alert title="还未添加负责人" type="info"/>}
                            </Form.Item>
                        </Form>
                        <AJAX ref={e => this.delAJAX = e}>
                            {group.id !== 0 &&
                            <Button type="danger" onClick={this.del} style={{width: '100%'}}>删除小组</Button>}
                        </AJAX>
                        <Administrator ref={e => this.administrator = e} teamLeader={group.teamLeader}
                                       callback={this.teamLeaderCallback}/>
                    </Dialog.Body>
                    <AJAX ref={e => this.submitAJAX = e}>
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

export default GroupManagement;
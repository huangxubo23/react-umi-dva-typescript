/**
 * Created by linhui on 18-3-10.达人赏金任务
 */

require('../../../../../../../styles/bountyTask/addBountyTask.css');
require('../../../../../../../styles/addList/content.css');
import ReactChild from "../../../../../../lib/util/ReactChild";
import React from 'react';
import $ from 'jquery';
import ReactDOM from 'react-dom';
import AJAX from '../../../../../../../components/lib/newUtil/AJAX';
import {clone} from '../../../../../../../components/lib/util/global';
import {BundleLoading, loading} from '../../../../../../../bundle';
import AddBountyTaskModal from 'bundle-loader?lazy&name=pc/trends_asset/admin/bountyTask/app-[name]!../../components/addBountyTaskModal';
import ContentDetailsModal from 'bundle-loader?lazy&name=pc/trends_asset/admin/bountyTask/app-[name]!../../components/contentDetailsModal';
import ManualmatchingModal from 'bundle-loader?lazy&name=pc/trends_asset/admin/bountyTask/app-[name]!../../components/manualmatchingModal';
import {Button, Layout, Input, Table, Pagination, MessageBox, Message} from 'element-react';
import 'element-theme-default';

class TalentBountyTask extends ReactChild {//达人赏金任务列表
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,//模态开关
            pageNow: 1,
            pageSize: 20,
            count: 0,
            title: '',//标题
            state: '',//内容状态
            taskState: '',//任务状态
            contentsList: [],//内容数据
            empList: [],//所有员工
            bountyTaskId: '',//赏金任务id
            bountyTaskEncryptTime: '',//赏金任务加密时间
            content: {
                id: '',
                bountyTaskId: '',//赏金任务id
            },
            contentStatePreview: [//内容状态  con -3任务已满  -4商品被删除   -5 内容被删除  -6主动放弃  -7管理员放弃    4 发布成功   5 需要修改  6 平台接收
                {state: '', name: "全部", count: 0, typeTab: []},
                {state: -3, name: "任务已满", count: 0, typeTab: []},
                {state: -4, name: "商品被删除", count: 0, typeTab: []},
                {state: -5, name: "内容已被删除", count: 0, typeTab: []},
                {state: -6, name: "主动放弃", count: 0, typeTab: []},
                {state: -7, name: "管理员放弃", count: 0, typeTab: []},
                {state: 0, name: "进行中", count: 0, typeTab: []},
                {state: 1, name: "失败(渠道不匹配)", count: 0, typeTab: []},
                {state: 2, name: "审核通过", count: 0, typeTab: []},
                {state: 3, name: "已打款", count: 0, typeTab: []},
                {state: 4, name: "已发布", count: 0, typeTab: []},
                {state: 5, name: "需要修改", count: 0, typeTab: []},
                {state: 6, name: "平台接收", count: 0, typeTab: []}
            ],
        }
    }


    goPage = (pageNow) => {/*点击分页*/
        pageNow = pageNow ? pageNow : this.state.pageNow;
        this.queryContentsList({
            pageNow: pageNow,
            pageSize: this.state.pageSize,
            conState: this.state.state,
            taskState: this.state.taskState,
            title: this.state.title,
            /*bountyTaskId: this.state.bountyTaskId,*/

        });
    };
    goSize = (pageSize) => {/*点击分页*/
        pageSize = pageSize ? pageSize : this.state.pageSize;
        this.queryContentsList({
            pageNow: this.state.pageNow,
            pageSize: pageSize,
            conState: this.state.state,
            taskState: this.state.taskState,
            title: this.state.title,
        });
    };
    queryContentsList = (data) => {//查询内容
        this.talentBountyTaskAjax.ajax({
            type: 'post',
            url: '/mission/admin/talentBountyTask/queryContentsList.io',
            data: data,
            callback: (json) => {
                let columns = [
                    {
                        label: "id",
                        prop: "id",
                    },
                    {
                        label: "达人名称",
                        prop: "userName",
                    },
                    {
                        label: "标题",
                        prop: "title",
                        width: 240
                    },
                    {
                        label: "任务标题",
                        prop: "bountyTaskTitle",
                    },
                    {
                        label: "卖家名称",
                        prop: "bountyTaskSellerName",
                    },
                    {
                        label: "任务单价",
                        prop: "bountyTaskPrice",
                    },
                    {
                        label: "渠道",
                        prop: "channelName",
                        width: 240
                    },
                    {
                        label: "达人等级",
                        prop: "rankInfo",
                    },
                    {
                        label: "状态",
                        prop: "taskStateName",
                    },
                    {
                        label: "操作",
                        prop: "",
                        width: 160,
                        render: (item) => {
                            return (
                                <Button.Group>
                                    {item.taskState != -6 || item.taskState != -5 && <Button type=" danger" size="small" onClick={() => {
                                        this.abandon({id: item.id})
                                    }}>放弃</Button>}
                                    {item.conState != -5 || item.taskState != -6 && <Button type="warning" size="small" onClick={() => {
                                        this.delContet({id: item.id})
                                    }}>我已删除</Button>}
                                    <Button size="small" onClick={() => {
                                        this.openDetails({i: item.i})
                                    }} type="primary">日志</Button>
                                    <Button type="info" size="small" onClick={() => {
                                        this.bountyTaskDetails({i: item.i})
                                    }}>任务详情</Button>
                                </Button.Group>
                            )
                        }
                    },
                ];
                let [contentsList, contentTable] = [json.contentsList, []];
                contentsList.map((item, i) => {
                    let [btnClas, st] = ["", ""];
                    if (item.conState) {
                        switch (item.taskState) {
                            case 5 :
                                btnClas = "secondary";
                                st = "草稿箱";
                                break;
                            case 8 :
                                btnClas = "warning";
                                st = "待审核";
                                break;
                            case 1 :
                                btnClas = "danger";
                                st = "审核失败";
                                break;
                            case 4 :
                                btnClas = "info";
                                st = "待发布";
                                break;
                            case 3 :
                                btnClas = "success";
                                st = "已发布";
                                break;
                            case 0 :
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
                            case 2 :
                                btnClas = "info";
                                st = "待同步";
                                break;
                        }
                        if (item.conState < 0) {
                            btnClas = "danger"
                        }
                    }
                    let bountyTask = item.bountyTask ? item.bountyTask : {};
                    let taskStateName = item.taskState == -10 ? '今日可做条数已满' : item.taskState == -9 ? '达人可做条数已满' : item.taskState == -8 ? '达人等级不足' : item.taskState == -7 ? '管理员放弃' : item.taskState == -6 ? '主动放弃' : item.taskState == -5 ? '内容被删除' : item.taskState == -4 ? '商品被删除' : item.taskState == -3 ? '任务已满/已完成' : item.taskState == -1 ? '审核不通过' : item.taskState == 0 ? '进行中' : item.taskState == 1 ? '渠道不匹配' : item.taskState == 2 ? '审核通过' : item.taskState == 3 ? '已打款' : '';
                    taskStateName += '(';
                    taskStateName += item.conState == 4 ? '已发布' : item.conState == 5 ? '需要修改' : item.conState == 6 ? '平台已接受' : item.conState == 0 ? '进行中' : item.conState == 7 ? '微淘收录' : item.conState == 8 ? '不需要(收录/通过)' : '';
                    taskStateName += ')';
                    contentTable.push(
                        {
                            id: item.id,
                            userName: item.userName,
                            title: item.title,
                            bountyTaskTitle: bountyTask.title,
                            bountyTaskSellerName: bountyTask.sellerName,
                            bountyTaskPrice: bountyTask.price,
                            channelName: item.channelName,
                            rankInfo: item.rankInfo,
                            taskState: item.taskState,
                            taskStateName: taskStateName,
                            i: i
                        }
                    );
                });
                json.columns = columns;
                json.contentTable = contentTable;
                this.setState(json);
            }
        });
    };

    colleagues = (callback) => {//拿取所有同事
        let zujian = this;
        let [pn, t] = [1, []];
        empList(pn, t);

        function empList(pageNow, talent) {
            this.talentBountyTaskAjax.ajax({
                type: 'post',
                url: '/user/admin/user/queryManageList.io',
                data: {pageNow: pageNow, pageSize: 50, type: 0},
                isCloseMask: true,
                callback: (json) => {
                    for (let i = 0; i < json.talent.length; i++) {
                        talent.push(json.talent[i]);
                    }
                    if (json.count > talent.length) {
                        empList(pageNow + 1, talent);
                    } else {
                        zujian.setState({empList: talent});
                    }
                }
            });
        }
    };

    componentDidMount() {
        this.goPage();
        /*  getManage((json) => {
              this.colleagues();
          });*/

    };

    findManageName = (id) => {
        let empList = this.state.empList;
        if (empList.length > 0) {
            for (let i in empList) {
                if (empList[i].id === id) {
                    return empList[i].name;
                }
            }
        }
    };
    selectState = (env) => {//内容搜索
        let state = env.state;
        this.setState({taskState: state}, () => {
            this.goPage(1);
        });
    };
    openDetails = (env) => {//打开日志详情
        let [i, contentsList] = [env.i, this.state.contentsList];
        this.setState({contents: contentsList[i], contentDetails: true}, () => {
            let upload = setInterval(() => {
                let contentDetailsModal = this.contentDetailsModal;
                if (contentDetailsModal && contentDetailsModal.jd) {
                    clearInterval(upload);
                    contentDetailsModal.jd.getContetLog();
                }
            }, 100);
        });

    };
    delContet = (env) => {//删除内容
        let id = env.id;
        MessageBox.confirm('确定删除本条内容吗?', '提示', {
            type: 'warning'
        }).then(() => {
            this.talentBountyTaskAjax.ajax({
                type: 'post',
                url: '/mission/admin/talentBountyTask/upContentsByConState.io',
                data: {id: id, taskState: -5},
                callback: (json) => {
                    Message({message: '删除成功', type: 'success'});
                    this.goPage();
                }
            });
        }).catch(() => {
            Message({
                type: 'info',
                message: '已取消删除'
            });
        });
    };
    abandon = (env) => {//放弃任务
        let id = env.id;
        MessageBox.confirm('确定放弃本条内容吗?', '提示', {
            type: 'warning'
        }).then(() => {
            this.talentBountyTaskAjax.ajax({
                type: 'post',
                url: '/mission/admin/talentBountyTask/upContentsByConState.io',
                data: {id: id, taskState: -6},
                callback: (json) => {
                    Message({message: '放弃任务成功', type: 'success'});
                    this.goPage();
                }
            });
        }).catch(() => {
            Message({
                type: 'info',
                message: '已取消放弃'
            });
        });
    };

    titleChange = ({value}) => {//标题改变事件
        this.setState({title: value});
    };
    titleSearch = () => {//标题搜索
        this.goPage(1);
    };
    bountyTaskDetails = (env) => {//任务详情
        let [i, contents] = [env.i, this.state.contentsList];
        let [details, adoptChannels] = [$.isEmptyObject(contents[i].bountyTask.details), contents[i].bountyTask.adoptChannels];
        if (details) {
            contents[i].bountyTask.details = '';
        }
        if (adoptChannels) {
            let [ac, arr] = [adoptChannels.split(','), []];
            for (let i = 0; i < ac.length; i++) {
                arr.push(ac[i]);
            }
            contents[i].bountyTask.adoptChannels = arr;
        }
        this.setState({bountyTask: clone(contents[i].bountyTask), disbaled: true}, () => {
            let upload = setInterval(() => {
                let addBountyTaskModal = this.addBountyTaskModal;
                if (addBountyTaskModal && addBountyTaskModal.jd) {
                    clearInterval(upload);
                    addBountyTaskModal.jd.initial();
                }
            }, 100);
        });
    };


    render() {
        let {bountyTask,disbaled,contentDetails,contents,manualmatching,columns,contentTable,count,pageSize,pageNow,title}=this.state;
        let taskState = [{name: '全部', state: ''},
            {bsStyle: 'info', name: '进行中', state: 0},
            {bsStyle: 'danger', name: '审核不通过', state: 1},
            {bsStyle: 'primary', name: '审核通过', state: 2},
            {bsStyle: 'success', name: '已打款', state: 3}];
        return (
            <NewPanel header='任务列表'>
                {/*搜索*/}
                <div style={{marginTop: '12px'}}>
                    <Layout.Row>
                        <Layout.Col sm={3}>
                            <Button type="success" onClick={() => {
                                this.setState({manualmatching: true}, () => {
                                    let upload = setInterval(() => {
                                        let manualmatchingModal = this.manualmatchingModal;
                                        if (manualmatchingModal && manualmatchingModal.jd) {
                                            clearInterval(upload);
                                            manualmatchingModal.jd.openModal();
                                        }
                                    }, 100);
                                });
                            }} style={{width:"100%"}}>手动匹配内容</Button>
                        </Layout.Col>
                        <Layout.Col sm={9}>
                            <Button.Group>
                                {taskState.map((item, i) => {
                                    return (
                                        <Button key={i + "-" + item.name} type={item.bsStyle} onClick={() => {
                                            this.selectState({state: item.state})
                                        }}>{item.name}</Button>
                                    )
                                })}
                            </Button.Group>
                        </Layout.Col>
                        <Layout.Col sm={12}>
                            <Input placeholder="请输入搜索关键词，多个词提包空格隔开" value={title}
                                   onKeyDown={(event) => {
                                       if (event.keyCode == "13") {
                                           this.goPage(1)
                                       }
                                   }}
                                   onChange={(value) => this.titleChange({value})} append={<Button type="primary" icon="search" onClick={this.titleSearch}>搜索</Button>}/>
                        </Layout.Col>
                    </Layout.Row>
                </div>
                {/*展示*/}
                <AJAX ref={e => this.talentBountyTaskAjax = e}>
                    <div style={{margin: '20px 0'}}>
                        <Table style={{width: '100%'}} columns={columns} data={contentTable}/>
                    </div>
                    <Pagination layout="total, sizes, prev, pager, next, jumper" total={count} pageSizes={[16, 20, 30, 40]} pageSize={pageSize}
                                currentPage={pageNow} onSizeChange={this.goSize} onCurrentChange={this.goPage}/>
                </AJAX>
                {bountyTask && <BundleLoading load={AddBountyTaskModal} ref={e => this.addBountyTaskModal = e} bountyTask={bountyTask}
                                              disbaled={disbaled} goPage={this.goPage}/>}{/*赏金任务模态*/}
                {contentDetails && <BundleLoading load={ContentDetailsModal} ref={e => this.contentDetailsModal = e} contents={contents}/>}{/*日志模态*/}
                {manualmatching && <BundleLoading load={ManualmatchingModal} ref={e => this.manualmatchingModal = e}/>}{/*手动匹配模态*/}
            </NewPanel>
        )
    }
}

class NewPanel extends React.Component {
    render() {
        let {header,children} = this.props;
        return (
            <div style={{
                marginTop: "10px",
                marginBottom: '12px',
                backgroundColor: '#fff',
                border: '1px solid transparent',
                borderRadius: '4px',
                boxShadow: '0 1px 1px rgba(0, 0, 0, .05)',
                borderColor: '#50bfff'
            }}>
                <div style={{
                    padding: '1px 10px',
                    borderBottom: '1px solid transparent',
                    borderTopLeftRadius: '3px',
                    borderTopRightRadius: '3px',
                    color: '#fff',
                    backgroundColor: '#50bfff',
                    borderColor: '#50bfff',
                }}>
                    <h5 style={{textAlign: 'center'}}>{header}</h5>
                </div>
                <div style={{
                    padding: '10px',
                }}>
                    {children}
                </div>
            </div>
        )
    }
}


export default TalentBountyTask;
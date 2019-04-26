/**
 * Created by linhui on 18-07-04.赏金任务内容列表
 */
import ReactChild from "../../../../../../../../lib/util/ReactChild";
require('../../../../../../../../../styles/bountyTask/addBountyTask.css');
require('bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.css');
require('../../../../../../../../../styles/addList/content.css');
import React from 'react';
import $ from 'jquery';
import {ajax} from '../../../../../../../../../components/lib/util/ajax';
import {infoNoty, getManage, notyOK} from '../../../../../../../../../components/lib/util/global';
import {Paging3} from '../../../../../../../../../components/lib/util/Paging';
import '../../../../../../../../../components/lib/util/bootstrap-datetimepicker.min';
import 'bootstrap-switch';
import {BundleLoading} from '../../../../../../../../../bundle';
import ContentDetailsModal
    from 'bundle-loader?lazy&name=pc/trends_asset/admin/bountyTask/app-[name]!../../../../components/contentDetailsModal';
import StatisticsModal
    from 'bundle-loader?lazy&name=pc/trends_asset/admin/bountyTask/app-[name]!./page/statisticsModal/statisticsModal';
import AdoptModal
    from 'bundle-loader?lazy&name=pc/trends_asset/admin/bountyTask/app-[name]!./page/adoptModal/adoptModal';
import LogModal from 'bundle-loader?lazy&name=pc/trends_asset/admin/bountyTask/app-[name]!./page/logModal/logModal';
import {
    Button,
    Table,
    ButtonGroup,
    Row,
    Col,
    FormControl,
    ButtonToolbar,
    OverlayTrigger,
    Popover
} from "react-bootstrap";

class ContentList extends ReactChild {//内容列表
    constructor(props) {
        super(props);
        let bountyTaskId = this.props.bountyTaskId;
        let tabs = this.props.tabs;
        this.state = {
            tabs: tabs,//是否手动审核选项卡
            title: '',//手动审核标题
            userId: '',//手动审核达人名称id
            userName: '',//搜索达人名
            sellerTitle: '',//手动审核任务标题
            pageNow: 1,
            pageSize: 20,
            count: 0,
            conState: '',//内容状态
            log: '',//拒绝理由
            taskState: '',//任务状态
            contentsList: [],//内容数据
            empList: [],//所有员工
            bountyTaskId: bountyTaskId,//赏金任务idF
            bountyTaskEncryptTime: '',//赏金任务加密时间
            content: {
                id: '',
                bountyTaskId: '',//赏金任务id
            },
            talent: {},//达人信息
            logModal: false,//拒绝理由模态开关
            adoptI: '',//通过下标
            contentStatePreview: [//内容状态  con -3任务已满  -4商品被删除   -5 内容被删除  -6主动放弃  -7管理员放弃    4 发布成功   5 需要修改  6 平台接收
                {state: '', name: "全部", count: 0, typeTab: []},
                {state: -5, name: "内容被删除", count: 0, typeTab: []},
                {state: -6, name: "主动放弃", count: 0, typeTab: []},
                {state: -7, name: "管理员放弃", count: 0, typeTab: []},
                {state: 5, name: "需要修改", count: 0, typeTab: []},
                {state: 7, name: "已修改", count: 0, typeTab: []},
                {state: 8, name: "待同步", count: 0, typeTab: []},
                {state: 6, name: "平台接收", count: 0, typeTab: []}
            ],
            contentDetails: false,//赏金任务日志详情模态

        }

    }


    componentDidMount() {
        getManage((json) => {
            this.colleagues(() => {
                if (this.props.tabs) {
                    this.examineGoPage(1);
                } else {
                    this.goPage(1);
                }
            });
        });
    };

    examineGoPage = (pageNow) => {//审核分页
        let zujian = this;
        pageNow = pageNow ? pageNow : this.state.pageNow;
        this.queryContentsListByStateAndMatchingChannel({
            pageNow: pageNow,
            pageSize: this.state.pageSize,
            userId: this.state.userId,
            userName: this.state.userName,
            title: this.state.title,
            taskState: this.state.taskState,
            conState: this.state.state,
            bountyTaskId: this.state.bountyTaskId,
            sellerTitle: this.state.sellerTitle,
        });
    };

    queryContentsListByStateAndMatchingChannel = (data) => {//根据状态是平台接受与是否匹配查询内容
        ajax.ajax({
            type: 'post',
            url: '/mission/admin/supOrgTask/queryContentsListByStateAndMatchingChannel.io',
            data: data,
            callback: (json) => {
                this.setState(json);
            }
        });
    };

    goPage = (pageNow) => {/*点击分页*/
        let zujian = this;
        pageNow = pageNow ? pageNow : this.state.pageNow;
        this.queryContentsListByBountyTask({
            pageNow: pageNow,
            pageSize: this.state.pageSize,
            conState: this.state.state,
            taskState: this.state.taskState,
            userName: this.state.userName,
            title: this.state.title,
            bountyTaskId: this.state.bountyTaskId,

        });
    };
    queryContentsListByBountyTask = (data) => {//查询内容
        ajax.ajax({
            type: 'post',
            url: '/mission/admin/supOrgTask/queryContentsListByBountyTask.io',
            data: data,
            callback: (json) => {
                this.setState(json);
            }
        });
    };

    colleagues = (callback) => {//拿取所有同事
        let zujian = this;
        let [pn, t] = [1, []];
        empList(pn, t);

        function empList(pageNow, talent) {
            ajax.ajax({
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
                    if (callback) {
                        callback();
                    }
                }
            });
        }
    };

    ContentBountyTaskState = (env) => {//更改内容任务状态
        let [taskstate, i, contentsList] = [$(env.target).data("state"), $(env.target).data("i"), this.state.contentsList];

        let [contents, log] = [this.state.contentsList[i], this.state.log];
        let [id, conState] = [contents.id, contentsList[i].conState];
        ajax.ajax({
            type: 'post',
            url: '/mission/admin/supOrgTask/upContentsBytaskState.io',
            data: {conlog: log, taskState: taskstate, id: id, conState: conState},
            callback: (json) => {
                infoNoty('操作成功', 'success');
                this.examineGoPage();
            }
        });
    };
    taskStateChange = (env) => {//手动审核任务状态搜索
        let state = $(env.target).data("state");
        this.setState({taskState: state}, () => {
            this.examineGoPage(1);
        });
    };
    taskStateChange2 = (env) => {//赏金任务状态搜索
        let state = $(env.target).data("state");
        this.setState({taskState: state}, () => {
            this.goPage(1);
        });
    };
    selectState = (env) => {//内容搜索
        let state = $(env.target).data('state');
        this.setState({state: state}, () => {
            this.goPage(1);
        });
    };
    userNameChange = (env) => {//手动审核达人名称事件
        let value = env.target.value;
        this.setState({userName: value});
    };

    seekKeyChange = (env) => {//手动审核title事件
        let title = env.target.value;
        this.setState({title: title});
    };
    sellerTitleChange = (env) => {//手动审核任务名称事件
        let title = env.target.value;
        this.setState({sellerTitle: title});
    };
    sellerTitleClick = (env) => {//任务名称点击事件
        let title = $(env.target).data('sellertitle');
        this.setState({sellerTitle: title}, () => {
            this.examineGoPage(1);
        });
    };
    adminAbandon = (env) => {//管理员放弃
        let id = $(env.target).data("id");
        notyOK({text: "确定放弃吗", text2: "放弃"}, () => {
            ajax.ajax({
                type: 'post',
                url: '/mission/admin/supOrgTask/upContentsByIdAndConStateAndTaskState.io',
                data: {id: id, conState: -7, taskState: 1},
                callback: (json) => {
                    infoNoty("放弃成功", "success");
                    if (this.contentDetailsModal&&this.contentDetailsModal.jd) {
                        this.contentDetailsModal.jd.closeModal();
                    }
                    this.goPage();
                }
            })
        });
    };
    openDetails = (env) => {//打开日志详情
        console.log($(env.target).data("i"));
        let [i, contentsList] = [$(env.target).data("i"), this.state.contentsList];

        this.setState({contents: contentsList[i], contentDetails: true}, () => {

            let i = setInterval(() => {
                let contentDetailsModal = this.contentDetailsModal;
                if (contentDetailsModal&&contentDetailsModal.jd) {
                    clearInterval(i);
                    contentDetailsModal.jd.openModal(() => {
                        contentDetailsModal.jd.getContetLog();
                    });
                }
            }, 200);
        });

    };

    openModal = (env) => {//打开拒绝模态
        let [i, contentsList] = [$(env.target).data("i"), this.state.contentsList];
        let contents = contentsList[i];
        this.setState({logModal: true, logContents: contents}, () => {

            let i = setInterval(() => {
                let logModal = this.logModal;
                if (logModal&&logModal.jd) {
                    clearInterval(i);
                    logModal.jd.openModal();
                }
            }, 200);

        });
    };

    excelClick = () => {//导出内容
        let zujian = this;
        notyOK({text: '即将下载当前展示的内容点击下载进行确认', text2: '下载'}, () => {
            let url = '/mission/admin/supOrgTask/createExcel.io?bountyTaskId=' + this.state.bountyTaskId;
            if (zujian.state.userId) {
                url += '&userId=' + zujian.state.userId;
            }
            if (zujian.state.title) {
                url += '&title=' + zujian.state.title;
            }
            if (zujian.state.taskState) {
                url += '&taskState=' + zujian.state.taskState;
            }
            if (zujian.state.state) {
                url += '&conState=' + zujian.state.state;
            }
            window.location.href = url;
        });
    };
    userNameClick = (env) => {//点击查看达人信息
        let id = $(env.target).data('orgid');
        ajax.ajax({
            type: 'post',
            url: '/user/admin/getorganizationById.io',
            data: {id: id},
            isCloseMask: true,
            callback: (json) => {
                this.setState({talent: json});
            }
        });
    };

    openStatisticsModal = (env) => {//打开统计模态
        let [taskId] = [$(env.target).data('taskid')];
        this.setState({taskId: taskId}, () => {

            let i = setInterval(() => {
                let statisticsModal = this.statisticsModal;
                if (statisticsModal&&statisticsModal.jd) {
                    clearInterval(i);
                    statisticsModal.jd.openModal();
                }
            }, 200);


        });

    };
    copenAdoptModal = (env) => {//打开通过模态开关
        let [taskstate, i, contentsList] = [$(env.target).data("state"), $(env.target).data("i"), this.state.contentsList];
        this.setState({taskstate: taskstate, adoptI: i, contentsList: contentsList}, () => {
            let i = setInterval(() => {
                let adoptModal = this.adoptModal;
                if (adoptModal&&adoptModal.jd) {
                    clearInterval(i);
                    adoptModal.jd.getOrgmoneyMakingInfo();
                }
            }, 200);
        });

    };

    render() {
        let taskState = [
            {name: '全部', state: ''},
            {bsStyle: 'info', name: '进行中', state: 0},
            {bsStyle: 'danger', name: '审核不通过', state: 1},
            {bsStyle: 'primary', name: '审核通过', state: 2},
            {bsStyle: 'success', name: '已打款', state: 3}];
        let popoverRight =
            <Popover id="popover-trigger-click-root-close" title="达人联系方式">
                <Table>
                    <tr>
                        <td>名称:</td>
                        <td>{this.state.talent.name}</td>
                    </tr>
                    <tr>
                        <td>邮箱:</td>
                        <td>{this.state.talent.mailbox}</td>
                    </tr>
                    <tr>
                        <td>电话:</td>
                        <td>{this.state.talent.telephone}</td>
                    </tr>
                    <tr>
                        <td>qq:</td>
                        <td>{this.state.talent.iocq}</td>
                    </tr>
                </Table>
            </Popover>;
        return (

            <div>
                {/*状态按钮开始*/}
                <ButtonGroup justified>
                    {taskState.map((item, i) => {
                        return (
                            <Button key={i + "_" + item.name} href="#" bsStyle={item.bsStyle}
                                    onClick={this.state.tabs ? this.taskStateChange : this.taskStateChange2}
                                    data-state={item.state}>{item.name}</Button>
                        )
                    })}
                </ButtonGroup>
                {/*状态按钮结束*/}

                {/*搜索开始*/}
                <div style={{marginTop: '20px'}}>
                    <Row>
                        <Col sm={3}>
                            <FormControl type='text' placeholder='请输入达人名称' value={this.state.userName}
                                         onChange={this.userNameChange}>
                            </FormControl>
                        </Col>
                        <Col sm={3}>
                            <FormControl type="text" placeholder="请输入内容标题" value={this.props.seekKey}
                                         onChange={this.seekKeyChange}/>
                        </Col>
                        <Col sm={3}>
                            <FormControl type="text" placeholder="请输入任务标题" value={this.state.sellerTitle}
                                         onChange={this.sellerTitleChange}/>
                        </Col>
                        <Col sm={3}>
                            <Button onClick={() => {
                                this.state.tabs ? this.examineGoPage(1) : this.goPage(1)
                            }} bsStyle="info" block>搜索</Button>
                        </Col>
                    </Row>
                </div>
                {/*搜索结束*/}

                {!this.state.tabs && <Button bsStyle='success' style={{marginTop: '20px'}}
                                             onClick={this.excelClick}>导出当前内容到Excel表格</Button>}{/*数据导出Excel*/}

                <div style={{marginTop: '20px'}}>
                    <Table>
                        <thead>
                        <tr>
                            <th>id</th>
                            <th>达人名称</th>
                            {/* <th>类别</th>
                             <th>封面</th>*/}
                            <th>标题</th>
                            <th>商家</th>
                            <th>任务标题</th>
                            <th>渠道</th>
                            {/*<th>状态</th>*/}
                            <th>状态</th>
                            <th>达人等级</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.contentsList.map((item, i) => {
                            let [btnClas, st, rgb] = ["", "", ""];
                            if (item.taskState) {
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
                                if (item.taskState < 0) {
                                    btnClas = "danger"
                                }
                            }
                            return (
                                <tr key={item.id + "-" + i} className={btnClas}>
                                    <td className="wz">{item.id}</td>
                                    <td className="wz">
                                        <ButtonToolbar>
                                            <OverlayTrigger trigger="click" rootClose placement="right"
                                                            overlay={popoverRight}>
                                                <a href="javascript:void(0)" data-orgid={item.organizationId}
                                                   onClick={this.userNameClick}>{item.userName}</a>
                                            </OverlayTrigger>
                                        </ButtonToolbar>
                                    </td>
                                    {/* <td className="wz">{item.typeTab}</td>
                                     <td className="wz">{item.picUrl ? <img src={item.picUrl}/> : ""}</td>*/}
                                    <td className="wz">
                                        <a href={"https://market.m.taobao.com/apps/market/content/index.html?contentId=" + item.feedId}
                                           target="_blank">{item.title}</a>
                                    </td>
                                    <td className="wz">{item.bountyTask.sellerName}</td>
                                    <td className="wz">
                                        <a href='javascript:void(0)' onClick={this.sellerTitleClick}
                                           data-sellertitle={item.bountyTask.title}>{item.bountyTask.title}</a>
                                        <Button onClick={this.openStatisticsModal} data-taskid={item.bountyTask.id}
                                                bsSize="xsmall" bsStyle='info'>统计</Button>
                                    </td>
                                    <td className="wz">{item.channelName}</td>
                                    {/*<td className="wz">{st}</td>*/}
                                    <td className="wz">
                                        {item.taskState == -10 ? "今日可做条数已满" : item.taskState == -9 ? '达人可做条数已满' : item.taskState == -8 ? '达人等级不足' : item.taskState == -7 ? '管理员放弃' : item.taskState == -6 ? '主动放弃' : item.taskState == -5 ? '内容被删除' : item.taskState == -4 ? '商品被删除' : item.taskState == -3 ? '任务已满/已完成' : item.taskState == -1 ? '审核不通过' : item.taskState == 0 ? '进行中' : item.taskState == 1 ? '渠道不匹配' : item.taskState == 2 ? '审核通过' : item.taskState == 3 ? '已打款' : ''}
                                        ( {item.conState == 4 ? '已发布' : item.conState == 5 ? '需要修改' : item.conState == 6 ? '平台已接受' : item.conState == 0 ? '进行中' : item.conState == 4 ? '已发布' : item.conState == 7 ? '微淘收录' : item.conState == 8 ? '不需要(收录/通过)' : ''})
                                    </td>
                                    <td>{item.rankInfo == 0 ? 'L0' : item.rankInfo == 1 ? 'L1' : item.rankInfo == 2 ? 'L2' : item.rankInfo == 3 ? 'L3' : item.rankInfo == 4 ? 'L4' : item.rankInfo == 5 ? 'L5' : item.rankInfo == 6 ? 'L6' : ''}</td>
                                    <td>
                                        {!this.state.tabs ? <ButtonGroup bsSize="xsmall">
                                                <Button bsStyle="link" target="_blank"
                                                        href={"bountyStatistics.html?vMissionId=" + this.state.bountyTaskId + '&contentTime=' + item.encryptTime +
                                                        '&encryptTime=' + this.props.bountyTaskEncryptTime + '&feedId=' + item.feedId}>流量统计</Button>
                                                <Button bsStyle="danger" data-id={item.id}
                                                        onClick={this.adminAbandon}>放弃</Button>
                                                <Button data-i={i} bsStyle="primary" onClick={this.openDetails}>详情</Button>
                                            </ButtonGroup> :
                                            <ButtonGroup bsSize="xsmall">
                                                {item.taskState != 3 &&
                                                <Button bsStyle="danger" href="#" data-state="1" data-i={i}
                                                        onClick={this.openModal}>不通过</Button>}
                                                {item.taskState < 2 ?
                                                    <Button bsStyle="success" href="#" data-state="2" data-i={i}
                                                            onClick={this.copenAdoptModal}>通过</Button> : item.taskState == 2 ?
                                                        <Button bsStyle="success" href="#" data-state="3" data-i={i}
                                                                onClick={this.ContentBountyTaskState}>已打款</Button> : ''}
                                                <Button onClick={this.openDetails} data-i={i}
                                                        bsStyle="primary">详情</Button>
                                            </ButtonGroup>}
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </Table>
                    <Paging3 pageNow={this.state.pageNow} pageSize={this.state.pageSize} count={this.state.count}
                             goPage={this.state.tabs ? this.examineGoPage : this.goPage}/>
                </div>
                {this.state.contentDetails &&
                <BundleLoading ref={e => this.contentDetailsModal = e} contents={this.state.contents}
                               load={ContentDetailsModal}/>}{/*内容日志详情模态*/}
                {this.state.taskId && <BundleLoading ref={e => this.statisticsModal = e} load={StatisticsModal}
                                                     taskId={this.state.taskId}/>}{/*任务统计模态*/}
                {/*赏金任务内容列表通过打款信息模态*/}
                {this.state.taskstate &&
                <BundleLoading ref={e => this.adoptModal = e} load={AdoptModal} taskstate={this.state.taskstate}
                               adoptI={this.state.adoptI} contentsList={this.state.contentsList}
                               examineGoPage={this.examineGoPage}/>}
                {/*拒绝理由模态*/}
                {this.state.logContents &&
                <BundleLoading ref={e => this.logModal = e} load={LogModal} logContents={this.state.logContents}
                               examineGoPage={this.examineGoPage}/>}

            </div>
        )
    }
}

export default ContentList;
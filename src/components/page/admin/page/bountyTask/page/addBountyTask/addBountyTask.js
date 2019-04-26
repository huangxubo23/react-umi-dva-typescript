/**
 * Created by linhui on 18-1-27.新增赏金任务&&s赏金任务列表
 */
import ReactChild from "../../../../../../lib/util/ReactChild";
require('../../../../../../../styles/bountyTask/addBountyTask.css');
require('../../../../../../../styles/addList/content.css');
import React from 'react';
import $ from 'jquery';
import {ajax} from '../../../../../../../components/lib/util/ajax';
import {infoNoty, timePosition, notyOK, clone} from '../../../../../../../components/lib/util/global';
import {Paging3} from '../../../../../../../components/lib/util/Paging';
import '../../../../../../../components/lib/util/bootstrap-datetimepicker.min';
import noty from 'noty';
import {BundleLoading} from '../../../../../../../bundle';
import ManualmatchingModal
    from 'bundle-loader?lazy&name=pc/trends_asset/admin/bountyTask/app-[name]!../../components/manualmatchingModal';
import AddBountyTaskModal
    from 'bundle-loader?lazy&name=pc/trends_asset/admin/bountyTask/app-[name]!../../components/addBountyTaskModal';
import ContentList
    from 'bundle-loader?lazy&name=pc/trends_asset/admin/bountyTask/app-[name]!./page/contentList/contentList';
import {
    Button,
    Table,
    ButtonGroup,
    Row,
    Col,
    Form,
    FormGroup,
    ControlLabel,
    FormControl,
    InputGroup,
    Panel,
    Modal,
    Tabs, Tab,
} from "react-bootstrap";
import {Radio} from 'element-react';
require('../../../../../../../styles/content/content_template.css');

class AddBountyTask extends ReactChild {//赏金任务列表
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,//模态开关
            pageNow: 1,
            pageSize: 20,
            count: 0,
            bountyTaskList: [],//列表数据
            typeTab: '',//行业分类
            state: '',//状态
            title: '',//赏金任务名
            manualmatching: false,//赏金任务手动匹配模态框
            tabContent: false,//审核内容列表
            bountyTaskId: '',
        }
    }

    componentDidMount() {
        let startTime = $("#startTime").datetimepicker({
            format: "yyyy-mm-dd",
            language: 'zh-CN',
            minView: 2
        }).on("changeDate", (ev) => {
            startTime.datetimepicker('hide');
            let date = new Date(ev.date.getTime());
            date.setMonth(date.getMonth() + 6);
            this.props.setPaState({
                startTime: ev.date.getFullYear() + "-" + (ev.date.getMonth() + 1) + "-" + ev.date.getDate(),
                endTime: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
            }, () => {
                endTime.datetimepicker('setEndDate', date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate());
                endTime.datetimepicker('show');
            });
        });

        let endTime = $("#endTime").datetimepicker({
            format: "yyyy-mm-dd",
            language: 'zh-CN',
            minView: 3
        }).on("changeDate", (ev) => {
            endTime.datetimepicker('hide');
            this.props.setPaState({
                endTime: ev.date.getFullYear() + "-" + (ev.date.getMonth() + 1) + "-" + ev.date.getDate()
            });
        });

        this.goPage();
    };

    addTask = () => {//新增赏金任务
        this.setState({addBounty: true}, () => {
            let upload=setInterval(()=>{
                let addBountyTaskModal = this.addBountyTaskModal;
                if (addBountyTaskModal&&addBountyTaskModal.jd) {
                    clearInterval(upload);
                    addBountyTaskModal.jd.addTask();
                }
            },100)
        });
    };

    goPage = (pageNow) => {/*点击分页*/
        pageNow = pageNow ? pageNow : this.state.pageNow;
        this.queryListByPage({
            pageNow: pageNow,
            pageSize: this.state.pageSize,
            typeTab: this.state.typeTab,
            state: this.state.state,
            title: this.state.title,

        });
    };

    queryListByPage = (data) => {//查询赏金任务列表数据
        ajax.ajax({
            type: 'post',
            url: '/mission/admin/supOrgTask/queryListByPage.io',
            data: data,
            callback: (json) => {//bountyTaskList
                this.setState(json);
            }
        });
    };


    editBountyTaskOrDetails = (env) => {//编辑任务or任务详情
        let [i, bountyTask, disbaled] = [$(env.target).data('i'), this.state.bountyTaskList, $(env.target).data('disbaled')];
        let [details, adoptChannels] = [$.isEmptyObject(bountyTask[i].details), bountyTask[i].adoptChannels];
        if (details) {
            bountyTask[i].details = '';
        }
        if (adoptChannels) {
            let [ac, arr] = [adoptChannels.split(','), []];
            for (let i = 0; i < ac.length; i++) {
                arr.push(ac[i]);
            }
            bountyTask.adoptChannels = arr;
        }
        this.setState({bountyTask: clone(bountyTask[i]), disbaled: disbaled, addBounty: true}, () => {
            let upload=setInterval(()=>{
                let addBountyTaskModal = this.addBountyTaskModal;
                if (addBountyTaskModal&&addBountyTaskModal.jd) {
                    clearInterval(upload);
                    addBountyTaskModal.jd.openModal();
                }
            },100);
        });

    };

    typeTabOrStateChange = (env) => {//行业搜索or状态搜索
        let [value, name, state] = [env.target.value, $(env.target).data('name'), this.state];
        state[name] = value;
        this.setState(state, () => {
            this.goPage();
        });
    };
    titleChange = (env) => {//赏金名字事件
        this.setState({title: env.target.value});
    };
    titleSearch = () => {//赏金搜索
        this.goPage();
    };
    contentListClick = (env) => {//根据赏金任务打开内容列表
        let [id, encryptTime] = [$(env.target).data('id'), $(env.target).data('encrypttime')];
        this.setState({bountyTaskId: id, bountyTaskEncryptTime: encryptTime, showModal: true});
    };

    delBountyTask = (env) => {//删除赏金任务
        let value = $(env.target).data("id");
        let n = new noty({
            text: '<h4>您确定要删除吗</h4>',
            theme: 'bootstrap-v4',
            modal: true,
            layout: 'center',
            type: 'warning',
            buttons: [
                noty.button('删除', 'btn btn-success', function () {
                    ajax.ajax({
                        type: 'post',
                        url: '/mission/admin/supOrgTask/delBountyTask.io',
                        data: {id: value},
                        callback: (json) => {
                            infoNoty('删除赏金任务成功', 'success');
                            this.goPage();
                        }
                    });
                    n.close();
                }, {id: 'button1', 'data-status': 'ok'}),
                noty.button('取消', 'btn btn-error', function () {
                    n.close();
                })
            ]
        }).show();

    };
    selesctManage = (eventKey, event) => {//人员搜索
        this.props.setPaState({manage: eventKey}, function () {
            this.props.goPage();
        })
    };

    postMessage = () => {//发送消息
        let contribution = {
            "id": "200467948920",
            "userId": "7",
            "status": "1",
            "statusDesc": "审核通过",
            "activityName": "攻略内容招稿",
            "activityId": "932",
            "title": "草草草擦"
        };
        ajax.ajax({
            type: 'post',
            url: '/message/admin/content/reviewState.io',
            data: {contribution: contribution},
            callback: (json) => {
            }
        })
    };

    componentDidUpdate() {

    }

    stateChange = (env) => {////更改是否隐藏
        let [value, i, bountyTaskList] = [env.value, env.i, this.state.bountyTaskList];
        /* if (!checked) {
             btState = 0;
         } else {
             btState = 1;
         }*/
        ajax.ajax({
            type: 'post',
            url: '/mission/admin/supOrgTask/upBountyTaskByState.io',
            data: {id: bountyTaskList[i].id, state: value},
            callback: (json) => {
                bountyTaskList[i].state = value;
                this.setState({bountyTaskList: bountyTaskList}, () => {
                    this.goPage();
                });
            }
        });
    };

    upBountyTaskIsPayment = (env) => {//手动付款
        let i = $(env.target).data("i");
        let bountyTask = this.state.bountyTaskList[i];
        bountyTask.isPayment = true;
        ajax.ajax({
            type: 'post',
            url: '/mission/admin/supOrgTask/upBountyTaskIsPayment.io',
            data: {data: JSON.stringify(bountyTask)},
            callback: (json) => {
                infoNoty('手动付款成功', 'success');
                this.goPage();
            }
        });
    };
    openModal = () => {//打开内容模态
        this.setState({showModal: true});
    };
    closeModal = () => {//关闭内容模态
        this.setState({showModal: false});
    };
    tabsClick = (env) => {//切换标签
        if (env == 2) {
            this.setState({tabContent: true}, () => {
                let upload=setInterval(()=>{
                    let tabContentList = this.tabContentList;
                    if (tabContentList&&tabContentList.jd) {
                        clearInterval(upload);
                        tabContentList.jd.examineGoPage();
                    }
                },100);
            });
        } else {
            this.tabContentList.jd.setState({tabs: false});
        }
    };
    complete = (env) => {//完成任务
        let i = $(env.target).data('i');
        let data = this.state.bountyTaskList[i];
        notyOK({text: '您确定要完成任务吗', text2: '确定'}, (n) => {
            ajax.ajax({
                type: 'post',
                url: '/mission/admin/supOrgTask/upBountyTaskByState.io',
                data: {id: data.id, state: 2},
                callback: (json) => {
                    infoNoty('完成任务成功', 'success');
                    this.goPage(this.state.pageNow);
                }
            });
        });

    };
    openEnd = () => {//模态结束//打开内容热加载
        this.setState({openEndTrue: true}, () => {
            let upload=setInterval(()=>{
                let contentList = this.contentList;
                if (contentList&&contentList.jd) {
                    clearInterval(upload);
                    contentList.jd.goPage();
                }
            },100);
        });

    };

    render() {
        let typeTab = ["潮女", "潮男", "美妆", "母婴", "户外", "数码", "家居", "文体", "汽车", "美食"];
        return (
            <div>
                <Tabs defaultActiveKey={1} id="uncontrolled-tab-example" onSelect={this.tabsClick}>
                    <Tab eventKey={1} title="赏金任务">
                        <Panel header="赏金任务列表">
                            <Button onClick={this.addTask} bsStyle="info" style={{marginBottom: '10px'}}>新增赏金任务</Button>
                            <Button onClick={() => {
                                this.setState({manualmatching: true}, () => {
                                    let upload=setInterval(()=>{
                                        let manualmatchingModal = this.manualmatchingModal;
                                        if (manualmatchingModal&&manualmatchingModal.jd) {
                                            clearInterval(upload);
                                            manualmatchingModal.jd.openModal();
                                        }
                                    },100)
                                })
                                //this.manualmatchingModal.setState({showModal: true})
                            }} bsStyle="success" style={{marginBottom: '10px'}}>手动匹配</Button>
                            <Row>
                                <Col sm={6}>
                                    <Form horizontal>
                                        <FormGroup>
                                            <Col componentClass={ControlLabel} sm={3}>
                                                行业分类
                                            </Col>
                                            <Col sm={9}>
                                                <FormControl componentClass='select' data-name="typeTab"
                                                             onChange={this.typeTabOrStateChange}>
                                                    <option value="">全部</option>
                                                    {typeTab.map((item, x) => {
                                                        return (
                                                            <option key={x}>
                                                                {item}
                                                            </option>
                                                        );
                                                    })}
                                                </FormControl>
                                            </Col>
                                        </FormGroup>
                                    </Form>
                                </Col>
                                <Col sm={6}>
                                    <Form horizontal>
                                        <FormGroup>
                                            <Col componentClass={ControlLabel} sm={3}>
                                                状态
                                            </Col>
                                            <Col sm={9}>
                                                <FormControl componentClass='select' data-name="state"
                                                             onChange={this.typeTabOrStateChange}>
                                                    <option value="">全部</option>
                                                    <option value="1">未开始</option>
                                                    <option value="2">进行中</option>
                                                    <option value="3">已结束</option>
                                                </FormControl>
                                            </Col>
                                        </FormGroup>
                                    </Form>
                                </Col>
                                <Col sm={12}>
                                    <Form horizontal>
                                        <FormGroup>
                                            <InputGroup>
                                                <FormControl type="text" value={this.state.title}
                                                             onChange={this.titleChange}/>
                                                <InputGroup.Button>
                                                    <Button bsStyle="info" onClick={this.titleSearch}>搜</Button>
                                                </InputGroup.Button>
                                            </InputGroup>
                                        </FormGroup>
                                    </Form>
                                </Col>
                            </Row>
                            <Table style={{textAlign: 'left'}}>
                                <thead>
                                <tr>
                                    <th>标题</th>
                                    <th width="200px">卖家名称</th>
                                    <th>数量</th>
                                    <th>价格</th>
                                    <th>状态</th>
                                    <th>行业分类</th>
                                    <th style={{width: '266px'}}>达人是否展示</th>
                                    <th>是否付款</th>
                                    <th>达人等级要求</th>
                                    <th>操作</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.bountyTaskList.map((item, i) => {
                                    return (
                                        <tr key={item.id}>
                                            <td>{item.title}</td>
                                            <td>{item.sellerName}</td>
                                            <td>{item.totalCount}/{item.number}</td>
                                            <td>{item.price}</td>
                                            <td>{timePosition(item.startDateTime, item.endDateTime)}</td>
                                            <td>{item.typeTab}</td>
                                            <td>
                                                <Radio.Group size='small' value={item.state} onChange={(value) => {
                                                    this.stateChange({value: value, i: i})
                                                }}>
                                                    <Radio.Button value={0}>不展示</Radio.Button>
                                                    <Radio.Button value={1}>展示</Radio.Button>
                                                    <Radio.Button value={2}>任务已完成</Radio.Button>
                                                    <Radio.Button value={3}>任务已满</Radio.Button>
                                                </Radio.Group>
                                                {/*     {item.state != 2 ?
                                                    <input type="checkbox" value={i} checked={item.state ? 'checked' : ''} onChange={this.stateChange}/>
                                                    : item.state==3?'任务已满':'已完成'}*/}
                                            </td>
                                            <td>{item.isPayment ? '已付' : '未付'}</td>
                                            <td>{item.talentGrade == 0 ? 'L0' : item.talentGrade == 1 ? 'L1' : item.talentGrade == 2 ? 'L2' : item.talentGrade == 3 ? 'L3' : item.talentGrade == 4 ? 'L4' : item.talentGrade == 5 ? 'L5' : item.talentGrade == 6 ? 'L6' : ''}</td>
                                            <td>
                                                <ButtonGroup bsSize="xsmall">
                                                    <Button href={item.sellerLink} target="_blank"
                                                            bsStyle="primary">店铺</Button>
                                                    <Button data-i={i} bsStyle="success" data-disbaled="false"
                                                            onClick={this.editBountyTaskOrDetails}>编</Button>
                                                    <Button data-i={i} bsStyle="info" data-disbaled="true"
                                                            onClick={this.editBountyTaskOrDetails}>详</Button>
                                                    <Button data-id={item.id} bsStyle="danger"
                                                            onClick={this.delBountyTask}>删</Button>
                                                    <Button data-i={i} bsStyle="success"
                                                            onClick={this.upBountyTaskIsPayment}>付款</Button>
                                                    <Button data-id={item.id} data-encrypttime={item.encryptTime}
                                                            bsStyle="warning"
                                                            onClick={this.contentListClick}>内容</Button>
                                                    <Button data-i={i} bsStyle="primary"
                                                            onClick={this.complete}>完成</Button>
                                                </ButtonGroup>
                                            </td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </Table>
                            <Paging3 pageNow={this.state.pageNow} pageSize={this.state.pageSize}
                                     count={this.state.count}
                                     goPage={this.goPage}/>
                        </Panel>
                    </Tab>
                    <Tab eventKey={2} title="手动审核">
                        <BundleLoading ref={e => this.tabContentList = e} load={ContentList} tabs={true}/>
                    </Tab>

                </Tabs>

                {this.state.manualmatching &&
                <BundleLoading ref={e => this.manualmatchingModal = e} load={ManualmatchingModal}/>}{/*手动匹配模态*/}

                {/*内容列表开始*/}
                <Modal show={this.state.showModal} bsSize="large" onHide={this.closeModal} onEntered={this.openEnd}>
                    <Modal.Header closeButton>
                        <Modal.Title>内容列表</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.openEndTrue &&
                        <BundleLoading ref={e => this.contentList = e} load={ContentList} tabs={false}
                                       bountyTaskId={this.state.bountyTaskId}
                                       bountyTaskEncryptTime={this.state.bountyTaskEncryptTime}/>}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle='primary' onClick={this.closeModal}>关闭</Button>
                    </Modal.Footer>
                </Modal>
                {/*内容列表结束*/}
                {this.state.addBounty &&
                <BundleLoading load={AddBountyTaskModal} ref={e => this.addBountyTaskModal = e} goPage={this.goPage}
                               bountyTask={this.state.bountyTask}
                               disbaled={this.state.disbaled}/>}{/*赏金任务模态*/}

            </div>
        )
    }
}

export default AddBountyTask;

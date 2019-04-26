/**
 * Created by 石英 on 2018/10/26 0026下午 2:51.
 */

import React from "react";
import ReactChild from "../../../../../../lib/util/ReactChild";
import {Tabs, Button, Card, Input, Message, Table, Layout, Pagination} from "element-react";
import 'element-theme-default';
import AJAX from '../../../../../../../components/lib/newUtil/AJAX.js';
import {BundleLoading} from '../../../../../../../bundle';
import AddTaskGroupModel
    from 'bundle-loader?lazy&name=pc/trends_asset/admin/taskGroup/app-[name]!./components/addTaskGroupModel';


class TaskGroup extends ReactChild {
    constructor(props) {
        super(props);
        this.state = {
            data: {list: [], pageNow: 1, pageSize: 30, count: 0, state: undefined, perform: undefined},
            columns: [
                {
                    label: "id",
                    prop: "id",
                }, {
                    label: "详细",
                    prop: "detailed",
                }, {
                    label: "任务标题",
                    prop: "title",
                }, {
                    label: "店铺旺旺名称",
                    prop: "shopNick",
                }, {
                    label: "任务联系方式",
                    prop: "vTaskContact",
                }, {
                    label: "推广的商品",
                    prop: "items",
                }, {
                    label: "接任务达人id",
                    prop: "accountId",
                }, {
                    label: "任务状态",
                    prop: "state",
                    render: (data) => {
                        return data.state === 0 ? '待接单' : (data.state === 1 ? '待交付' : (data.state === 4 ? '已完成' : ''))
                    }
                }, {
                    label: "操作",
                    render() {
                        return '......'
                    }
                }
            ],
            isShow: {
                addTaskGroupModel: false,
            },
        }
    }

    componentDidMount() {
        this.getV_missionList();
    }

    getV_missionList = () => {
        this.V_missionListAJAX.ajax({
            type: 'get',
            url: `/mission/admin/taskGroup/domain.taskGroup.list.io`,
            data: {
                pageNow: this.state.data.pageNow,
                pageSize: this.state.data.pageSzie,
                state: this.state.data.state,
                title: this.state.data.title,
            },
            callback: (data) => {
                this.setState({data: data});
            }
        });
    };

    addTaskGroup = () => {
        let {isShow} = this.state;
        let {addTaskGroupModel} = isShow;
        if (addTaskGroupModel) {
            this.addTaskGroupModel.jd.open({name: '添加任务组'});
        } else {
            this.setState({isShow: Object.assign(isShow, {addTaskGroupModel: true})}, () => {
                let open = setInterval(() => {
                    let model = this.addTaskGroupModel;
                    if (model && model.jd) {
                        clearInterval(open);
                        model.jd.open({name: '添加任务组'});
                    }
                }, 100);
            })
        }
    };

    render() {
        let {columns, data, isShow} = this.state;
        return (
            <div>
                <Tabs type="border-card" activeName="1">
                    <Tabs.Pane label="任务组列表" name="1">
                        <AJAX ref={e => this.V_missionListAJAX = e}> </AJAX>
                        <Layout.Row gutter="16" style={{margin: "8px 0 18px"}}>
                            <Layout.Col span="5">
                                <Button type='info' block onClick={() => {

                                }} style={{width: '100%'}}>全部</Button>
                            </Layout.Col>
                            <Layout.Col span="5">
                                <Button type='info' block onClick={this.addTaskGroup}
                                        style={{width: '100%'}}>添加任务组</Button>
                            </Layout.Col>
                            <Layout.Col span="14">
                                <Input placeholder="请输入内容搜索" prepend={
                                    <Button type="primary" icon="delete">清空</Button>
                                } append={<Button type="primary" icon="search">搜索</Button>}/>
                            </Layout.Col>
                        </Layout.Row>
                        <Table style={{width: '100%'}} columns={columns} data={data.list} stripe={true}/>
                        <Pagination layout="total, prev, pager, next, jumper" style={{margin: '10px 0'}}
                                    total={data.count} pageSize={data.pageSize} currentPage={data.pageNow}/>
                    </Tabs.Pane>
                </Tabs>
                {isShow.addTaskGroupModel &&
                <BundleLoading ref={e => this.addTaskGroupModel = e} load={AddTaskGroupModel}/>}
            </div>
        )
    }
}

export default TaskGroup;
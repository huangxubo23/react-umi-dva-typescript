/**
 * Created by 石英 on 2018/10/26 0026下午 3:54.日常任务
 */

import React from "react";
import ReactChild from "../../../../../../lib/util/ReactChild";
import AJAX from '../../../../../../lib/newUtil/AJAX';
import {Button, Input, Layout, Pagination, Table} from "element-react";
import 'element-theme-default';
import {DialogBundle} from '../../../../../../../bundle';
import dailyTaskDialogContainere
    from 'bundle-loader?lazy&name=pc/trends_asset/components/user/head/app-[name]!./components/dailyTaskDialog';

require('../../../../../../../styles/content/content_template.css');

class DailyTaskDetailed extends ReactChild {
    constructor(props) {
        super(props);
        this.state = {
            title: '',          //任务标题
            state: -1,          //任务状态  -1任务未开始  0 发任务方已经付款  1 接任务方已处理   2 商家确认打款   3 商家有异议 4 已退款给商家
            titleSearch: '',    //标题搜索
            titleSearchName: '',//标题搜索名字

            sendStart: true,    //true同意，false不同意 —— 派方是否同意
            receiveStart: true, //true同意，false不同意 —— 收方是否同意

            pageNow: 1,       //页
            pageSize: 16,     //每页显示条目个数
            count: 80,        //总数
            dialogVisible: false,
        }
    }


    getData = () => {
        let {sendStart, receiveStart, state} = this.state;
        let columns = [
            {label: "任务标题", prop: "title"},
            {label: "推广的商品", prop: "items"},
            {label: "价格（元）", prop: "price"},
            {label: "派方组织ID", prop: "sendOrgId"},
            {label: "收方组织ID", prop: "receiveOrgId"},
            {label: "派方是否同意", prop: "sendStart"},
            {label: "收方是否同意", prop: "receiveStart"},
            {label: "任务状态", prop: "state"},
            {label: "付款时间", prop: "receiveOrgAlipayDate"},
            {
                label: "操作", prop: "detailed", render: () => {
                    return (
                        <div>
                            <Button size="small" type='success'>详情</Button>
                        </div>
                    )
                }
            }

        ];
        let array = [{
            title: '测试一',
            items: '玩具车',
            price: '100',
            sendOrgId: 1,
            receiveOrgId: 1,
            sendStart: sendStart ? '同意' : '不同意',
            receiveStart: receiveStart ? '同意' : '不同意',
            state: state == -1 ? '任务未开始' : state == 0 ? '发任务方已经付款' : state == 1 ? '接任务方已处理' : state == 2 ? '商家确认打款' : state == 3 ? '商家有异议' : state == 4 ? '已退款给商家' : '无',
            receiveOrgAlipayDate: '2018-11-03'
        }, {
            title: '测试二',
            items: '小玩偶',
            price: '100',
            sendOrgId: 1,
            receiveOrgId: 1,
            sendStart: sendStart ? '同意' : '不同意',
            receiveStart: receiveStart ? '同意' : '不同意',
            state: state == -1 ? '任务未开始' : state == 0 ? '发任务方已经付款' : state == 1 ? '接任务方已处理' : state == 2 ? '商家确认打款' : state == 3 ? '商家有异议' : state == 4 ? '已退款给商家' : '无',
            receiveOrgAlipayDate: '2018-11-03'
        }];
        return {columns, array}
    };

    addTasks = () => {//打开模态
        this.dailyTaskDialog.open();
    };

    whole = () => {//全部
        this.setState({pageNow: 1, pageSize: 20, title: ""})
    };

    titleSearchNameButton = () => {//搜索标题
        let titleSearchName = this.state.titleSearchName;
        this.setState({title: titleSearchName, pageNow: 1})
    };

    toPageSize = (value) => {//每页个数
        this.setState({pageSize: value})
    };

    goPageNow = (value) => {//跳转页
        this.setState({pageNow: value})
    };


    render() {
        let {titleSearchName, pageNow, pageSize, count} = this.state;
        let tableData = this.getData();
        return (
            <AJAX ref={e => this.dailyTaskDetailedAjax = e}>
                <div style={{margin: '10px 40px'}} className='divTable'>
                    <Layout.Row gutter="15">
                        <Layout.Col span="4">
                            <Button type='info' style={{width: '200px'}} title="展示全部" onClick={this.whole}>全部</Button>
                        </Layout.Col>
                        <Layout.Col span="4">
                            <Button type='success' style={{width: '200px'}} title="添加任务" onClick={this.addTasks}>添加任务</Button>
                        </Layout.Col>
                        <Layout.Col span="16">
                            <Input value={titleSearchName}
                                   onChange={(value) => {
                                       this.setState({titleSearchName: value})
                                   }}
                                   placeholder="请输入内容"
                                   prepend={<Button type='danger' icon='delete2' onClick={() => {
                                       this.setState({titleSearchName: ''})
                                   }}>清空</Button>}
                                   append={<Button type="info" icon="search" onClick={this.titleSearchNameButton}>搜索</Button>}/>
                        </Layout.Col>
                    </Layout.Row>
                    <div style={{marginTop: '20px'}}>
                        <Table style={{width: '100%'}} columns={tableData.columns} data={tableData.array} border={true}/>
                    </div>
                </div>
                <div style={{marginTop: '20px'}}>
                    <Pagination layout="total, sizes, prev, pager, next, jumper" total={count} pageSizes={[16, 20, 50, 100]}
                                pageSize={pageSize} currentPage={pageNow}
                                onSizeChange={(pageSize) => {
                                    this.toPageSize(pageSize)
                                }}
                                onCurrentChange={(pageNow) => {
                                    this.goPageNow(pageNow)
                                }}/>
                </div>
                <DialogBundle ref={e => this.dailyTaskDialog = e} dialogProps={{title: '添加任务', size: "small"}}
                              bundleProps={{
                                  load: dailyTaskDialogContainere, closeModal: () => {
                                      this.dailyTaskDialog.setState({dialogVisible: false})
                                  }
                              }}
                              dialogFooter={<div>
                                  <Button type="primary" onClick={() => {
                                      this.dailyTaskDialog.setState({dialogVisible: false})
                                  }}>取消</Button>
                                  <Button type="primary" onClick={() => {
                                      this.dailyTaskDialog.setState({dialogVisible: false})
                                  }}>确定</Button>
                              </div>}>
                </DialogBundle>
            </AJAX>
        )
    }
}

export default DailyTaskDetailed;
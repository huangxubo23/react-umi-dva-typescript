/**
 * Created by 薛荣晖 on 2018/12/18 0018上午 9:20.工作流程列表
 */

require('../../../../../../../styles/content/content_template.css');
import React from "react";
import ReactChild from "../../../../../../lib/util/ReactChild";
import AJAX from '../../../../../../lib/newUtil/AJAX';
import {Button, Card, Alert, Layout, MessageBox, Message, Table, Pagination} from "element-react";
import 'element-theme-default';
import {DialogBundle} from "../../../../../../../bundle";
import LargeProcessModalContainere from 'bundle-loader?lazy&name=pc/trends_asset/components/user/head/app-[name]!./components/LargeProcessModal';
import processModalContainere from 'bundle-loader?lazy&name=pc/trends_asset/components/user/head/app-[name]!./components/processModal';

class LargeProcess extends ReactChild {//工作流程列表
    constructor(props) {
        super(props);
        this.state = {
            pageNow: 1,
            pageSize: 16,
            count: 0,
            type: 0,
            largeProcessList: [],//工作数据
        }
    }

    componentDidMount = () => {
        this.goPageNow(1);
    };

    queryLargeProcessListPage = (data) => {//工作流程列表数据
        this.LargeProcessAjax.ajax({
            type: 'post',
            url: '/content/admin/superManage/queryLargeProcessListPage.io',
            data: data,
            callback: (json) => {
                this.setState(json, () => {
                    this.getTable()
                });
            }
        });
    };

    delLargeProcess = (id) => {//删除工作流程
        MessageBox.confirm('您确定要删除当前工作流程吗, 是否继续?', '提示', {
            type: 'warning'
        }).then(() => {
            this.LargeProcessAjax.ajax({
                type: 'post',
                url: '/content/admin/superManage/delLargeProcess.io',
                data: {id: id},
                callback: () => {
                    Message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.goPageNow(1);
                }
            });
        }).catch(() => {
            Message({
                type: 'info',
                message: '已取消删除'
            });
        });
    };

    getTable = () => {//表格数据
        let largeProcessList = this.state.largeProcessList;
        let columns = [
            {label: '名字', prop: 'name', width: 120,},
            {
                label: '类型', prop: 'type', render: (item) => {
                    return (
                        <div>
                            <span>{item.type === 1 ? '帖子' : item.type === 2 ? '清单' : item.type === 3 ? '单品' : item.type === 4 ? '搭配' : item.type === 7 ? '结构体' : ''}</span>
                        </div>
                    )
                }
            },
            {
                label: '模板名', prop: 'contentModeList', width: 1000, render: (item) => {
                    return (
                        <div>
                            {item.contentModeList.map((mode, i) => {
                                return (<span key={i}>{mode.contentMode.name},</span>)
                            })}
                        </div>
                    )
                }
            },
            {
                label: '操作', prop: 'id', width: 200, render: (item) => {
                    return (
                        <div>
                            <Button.Group>
                                <Button type="info" size='mini' onClick={() => {
                                    this.largeProcessDialog({type: 1, largeProcess: item})
                                }}>编辑</Button>
                                <Button type="danger" size='mini' onClick={() => {
                                    this.delLargeProcess(item.id)
                                }}>删除</Button>
                                <Button type="success" size='mini' onClick={() => {
                                    this.processModalDialog(item.id)
                                }}>查看步骤</Button>
                            </Button.Group>
                        </div>
                    )
                }
            },
        ];
        let array = [];
        if (largeProcessList.length > 0) {
            largeProcessList.map((item, i) => {
                let {name, type, contentModeList, id} = item;
                array.push({name: name, type: type, contentModeList: contentModeList, id: id})
            })
        }
        this.setState({columns, array})
    };

    toPageSize = (pageSize) => {//每页个数
        let state = this.state;
        pageSize = pageSize ? pageSize : state.pageSize;
        this.setState(state, () => {
            this.queryLargeProcessListPage(pageSize);
        });
    };

    goPageNow = (pageNow) => {//跳转页
        let state = this.state;
        pageNow = pageNow ? pageNow : state.pageNow;
        this.setState(state, () => {
            this.queryLargeProcessListPage(pageNow);
        });
    };

    largeProcessDialog = (data) => {//新增编辑模态
        this.setState({type: data.type}, () => {
            let contentModeList = data.largeProcess.contentModeList;
            let contentModeId = [];
            if (contentModeList) {
                for (let i = 0; i < contentModeList.length; i++) {
                    let obj = {};
                    obj.id = contentModeList[i].contentMode.id;
                    obj.name = contentModeList[i].contentMode.name;
                    contentModeId.push(obj);
                }
            }
            data.contentModeId = contentModeId;
            this.LargeProcessModal.open(data);
        });
    };

    processModalDialog = (id) => {//查看步骤模态
        this.processModal.open({largeProcessId: id}, () => {
            this.processModal.getBun((gt) => {
                gt.querySmallProcessList();
            })
        });
    };

    openModal = (data) => {
        this.LargeProcessModal.open(data);
    };

    render() {
        let {pageNow, pageSize, count, columns, array, type} = this.state;
        return (
            <AJAX ref={e => {
                this.LargeProcessAjax = e
            }}>
                <div>
                    <Card className='box-card'>
                        <Alert title="工作流程管理" type="info" closable={false}/>
                        <div style={{marginTop: '20px'}}>
                            <Layout.Row>
                                <Layout.Col span='24'>
                                    <Button style={{width: '100%'}} type='success' onClick={() => {
                                        this.largeProcessDialog({type: 0, largeProcess: {id: '', name: '', organization: '', type: ''}})
                                    }}>新增工作流程</Button>
                                </Layout.Col>
                            </Layout.Row>
                        </div>
                        <div style={{marginTop: '20px'}} className='divTable'>
                            <Table style={{width: '100%'}} columns={columns} data={array} border={true}/>
                        </div>
                    </Card>
                    <div style={{marginTop: '20px'}}>
                        <Pagination layout="total, sizes, prev, pager, next, jumper" total={count} pageSizes={[16, 20, 40]} pageSize={pageSize} currentPage={pageNow}
                                    onSizeChange={(pageSize) => {
                                        this.toPageSize(pageSize)
                                    }}
                                    onCurrentChange={(pageNow) => {
                                        this.goPageNow(pageNow)
                                    }}/>
                    </div>
                </div>
                <DialogBundle ref={e => this.LargeProcessModal = e} dialogProps={{title: type === 0 ? '新增工作流程' : '修改工作流程', size: "small"}}
                              bundleProps={{
                                  load: LargeProcessModalContainere, goPageNow: this.goPageNow, newOpen: this.openModal, closeModal: () => {
                                      this.LargeProcessModal.setState({dialogVisible: false})
                                  }
                              }}
                              dialogFooter={<div>
                                  <Button type="primary" onClick={() => {
                                      this.LargeProcessModal.setState({dialogVisible: false})
                                  }}>取消</Button>
                                  <Button type="primary" onClick={() => {
                                      this.LargeProcessModal.getBun((gb) => {
                                          gb.addAndUpLargeProcess();
                                      });
                                  }}>{type === 0 ? '添加' : '修改'}</Button>
                              </div>}>
                </DialogBundle>
                <DialogBundle ref={e => this.processModal = e} dialogProps={{title: '流程步骤'}}
                              bundleProps={{load: processModalContainere, goPageNow: this.goPageNow,closeModal: () => {
                                      this.processModal.setState({dialogVisible: false})
                                  }}}
                              dialogFooter={<div>
                                  <Button type="primary" onClick={() => {
                                      this.processModal.setState({dialogVisible: false})
                                  }}>取消</Button></div>}>
                </DialogBundle>
            </AJAX>
        );
    }
}

export default LargeProcess;
/**
 * Created by shiying on 18-4-21.组织详情
 */

import React from "react";
import AJAX from '../../../../../../../lib/newUtil/AJAX';
import {Card, Form, Button, Input, Layout, Alert, Message, InputNumber, Table, Pagination} from "element-react";
import 'element-theme-default';
import '../../../../../../../../styles/user/content.css';
import '../../../../../../../../styles/component/util/minSm.js.css';

require('../../../../../../../../styles/content/content_template.css');

class OrgDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogVisible: false,
            reason: '',//修改理由
            num: 0,//修改数量
            editRemainingNumSwitch: false,//修改点卡数量开关
            columns: [],
            array: []
        }
    }

    itemData = (id) => {
        this.OrgDetailsAjax.ajax({
            type: "post",
            url: "/user/admin/superOrganization/userInfo/getPermissionItem.io",//要访问的后台地址
            data: {
                orgId: id,
            },
            callback: (data) => {
                this.setState({perItem: data});
            }
        });
    };

    orgIdData = (id, now = 1, pageSize = 10) => {
        this.OrgDetailsAjax.ajax({
            type: "post",
            url: "/user/admin/superOrganization/userInfo/esteemnDetailByorgId.io",//要访问的后台地址
            data: {
                orgId: id,
                pageNow: now,
                pageSize: pageSize,
            },
            callback: (data) => {
                this.setState({idItem: data})
            }
        });
    };

    upOrganizationOrder = () => {//修改点卡
        this.OrgDetailsAjax.ajax({
            type: 'post',
            url: '/user/admin/superOrganization/upOrganizationOrder.io',
            data: {reason: this.state.reason, num: this.state.num, organizationId: this.state.id},
            callback: (json) => {
                Message({
                    message: '点卡修改成功',
                    type: 'success'
                });
                this.goPageNow();
            }
        });
    };

    getTable = () => {//表格数据
        let idItem = this.state.idItem;
        let columns = [
            {label: '时间', prop: 'date'},
            {label: '备注', prop: 'instructions'},
            {label: '变化', prop: 'changeNum'},
            {label: '余额', prop: 'remainingNum'},
        ];
        let array = [];
        if (idItem) {
            if (idItem.data.length > 0) {
                idItem.data.map((item, i) => {
                    let {date, instructions, changeNum, remainingNum} = item;
                    array.push({date: date, instructions: instructions, changeNum: changeNum, remainingNum: remainingNum})
                })
            }
        }
        return <Table style={{width: '100%'}} columns={columns} data={array} border={true}/>
    };


    sonSubmit = () => {
        let {num, reason} = this.state;
        this.setState({num: num, reason: reason, editRemainingNumSwitch: true})
    };

    toPageSize = (pageSize) => {//每页个数
        let idItem = this.state.idItem;
        idItem.pageSize = pageSize;
        this.setState({idItem}, () => {
            this.orgIdData(this.state.id, idItem.pageNow, idItem.pageSize);
        });
    };

    goPageNow = (pageNow) => {//跳转页
        let idItem = this.state.idItem;
        idItem.pageNow = pageNow;
        this.setState({idItem}, () => {
            this.orgIdData(this.state.id, idItem.pageNow, idItem.pageSize);
        });
    };

    render() {
        let {idItem, perItem, num, reason, editRemainingNumSwitch} = this.state;
        return (
            <AJAX ref={e => {
                this.OrgDetailsAjax = e
            }}>
                <div>
                    <Card className='box-card'>
                        <Alert title="权限到期时间" type="info" closable={false}/>
                        <div style={{marginBottom: '15px'}}>
                            <Layout.Row gutter='20'>
                                {(perItem ? perItem.permissionItem : []).map((item, i) => {
                                    return (
                                        <Layout.Col span='12' key={i} style={{marginTop: '15px'}}>
                                            <Card className='box-card'>
                                                <strong>{item.remarks}</strong>
                                                <div style={{marginTop: '10px', marginBottom: '10px'}}>
                                                    {item.whetherPermissions ?
                                                        <Alert title="当前权限可用" type="success" closable={false}/> :
                                                        <Alert title="当前权限不可用" type="error" closable={false}/>}
                                                </div>
                                                <span>到期时间：{item.endDate}</span>
                                            </Card>
                                        </Layout.Col>

                                    )
                                })}
                            </Layout.Row>
                        </div>
                        <div>
                            <Alert title="点卡明细" type="info" closable={false}/>
                            <div style={{marginTop: '10px', textAlign: 'left'}}>
                                <Button type='success' size='small' onClick={this.sonSubmit}>修改点卡</Button>
                                {editRemainingNumSwitch === true && <div style={{marginTop: '10px'}}>
                                    <Card>
                                        <Form model={this.state} labelWidth='80'>
                                            <Form.Item label='理由'>
                                                <Input placeholder='请输入理由' size='small' value={reason} style={{width: '50%'}} onChange={(value) => {
                                                    this.setState({reason: value})
                                                }}/>
                                            </Form.Item>
                                            <Form.Item label='点卡数量'>
                                                <InputNumber size='small' min='1' defaultValue={num} onChange={(value) => {
                                                    this.setState({num: value})
                                                }}/>
                                            </Form.Item>
                                            <Form.Item label=''>
                                                <Button size='small' type='success' onClick={this.upOrganizationOrder}>修改</Button>
                                            </Form.Item>
                                        </Form>
                                    </Card>
                                </div>}
                            </div>
                            <div style={{marginTop: '15px'}} className='divTable'>
                                {this.getTable()}
                            </div>
                            {idItem && <div style={{marginTop: '30px'}}>
                                <Pagination layout="total, sizes, prev, pager, next, jumper" total={idItem.count} pageSizes={[10, 20, 40, 60]}
                                            pageSize={idItem.pageSize} currentPage={idItem.pageNow}
                                            onSizeChange={(pageSize) => {
                                                this.toPageSize(pageSize)
                                            }}
                                            onCurrentChange={(pageNow) => {
                                                this.goPageNow(pageNow)
                                            }}/>
                            </div>}
                        </div>
                    </Card>
                </div>
            </AJAX>
        );
    }
}

export default OrgDetails;
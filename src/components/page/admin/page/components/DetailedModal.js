import React from "react";
import {Button, Dialog, Table, Pagination} from 'element-react'
import 'element-theme-default';
import AJAX from "../../../../lib/newUtil/AJAX";

class DetailedModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            data: [],
            pageNow: 1,
            pageSize: 16,
            count: 0,
            columns: [{
                label: "时间",
                prop: "date"
            }, {
                label: "备注",
                prop: "instructions"
            }, {
                label: "变化",
                prop: "changeNum"
            }, {
                label: "余额",
                prop: "remainingNum"
            }]
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        let {pageNow,pageSize}=this.state;
        this.ajax.ajax({
            type: "get",
            url: "/user/admin/superManage/esteemnDetail.io",//要访问的后台地址
            data: {pageNow,pageSize},
            callback: (msg) => {
                this.setState({
                    data: msg.data,
                    pageNow: msg.pageNow,
                    pageSize: msg.pageSize,
                    count: msg.count,
                });
            }
        });
    };

    goPage = (pageNow) => {
        this.setState({pageNow},this.getData);
    };

    rowClassName(row) {
        if (row.changeNum > 0) {
            return 'info-row';
        }
        return 'danger-row';
    }

    render() {
        let {show,columns,data,pageSize,pageNow,count}=this.state;
        return (
            <AJAX ref={e => this.ajax = e}>
                <Dialog visible={show} size="small" title="点卡明细"
                        onCancel={() => this.setState({show: false})} style={{textAlign: "left"}}>
                    <Dialog.Body>
                        <Table style={{width: '100%'}} rowClassName={this.rowClassName.bind(this)} columns={columns} data={data}/>
                        <div style={{textAlign:'center',marginTop:'10px'}}>
                            <Pagination onCurrentChange={this.goPage} pageSize={pageSize} currentPage={pageNow} layout="prev, pager, next" total={count}/>
                        </div>
                    </Dialog.Body>
                    <Dialog.Footer className="dialog-footer">
                        <Button onClick={() => this.setState({show: false})}>关闭</Button>
                    </Dialog.Footer>
                </Dialog>
            </AJAX>
        )
    }
}

export default DetailedModal;
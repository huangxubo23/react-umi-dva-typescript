/**
 * Created by shiying on 18-9-13.
 */

import React from 'react';
import AJAX from '../../../../../../../../lib/newUtil/AJAX.js';
import {PersonSelection} from '../../../../../../components/PersonSelection';
import {Dialog,Pagination,Table} from 'element-react';
import 'element-theme-default';

class ContentDetails extends React.Component{
    constructor(props) {
        super(props);
        let typeL={1:"帖子", 2:"清单", 3:"单品", 4:"搭配", 7:"结构体"};
        this.state = {
            dialogVisible: false,
            item:{},
            details:{
                count: 20,
                pageNow: 1,
                pageSize: 16,
                userPassingRateDetailsList:[]
            },
            columns:[{
                label: '人员',
                prop: 'manageId',
                render:(data)=>{
                    let m=PersonSelection.getManage(data['manageId'],()=>{
                        this.forceUpdate();
                    });
                    return <div>{m&&m.name}</div>
                }
            },{
                label: '类型',
                prop: 'contentType',
                render:(data)=>data.contentType?typeL[data.contentType]:"暂无"
            },{
                label: '时间',
                prop: 'recordDate',
                render:(data)=>data.recordDate?data.recordDate:"暂无"
            },{
                label: '审核次数',
                prop: 'auditNumber',
            },{
                label: '通过次数',
                prop: 'throughNumber',
            },{
                label: '通过率',
                prop: 'creator',
                render: (data)=>(((data.throughNumber*100)/data.auditNumber).toFixed(0))+"%"
            }],
        };
        this.open = this._open.bind(this);
        this.close = this._close.bind(this);
    }

    getDetails=(pageNow)=>{
        let {contentType,manageId}=this.state.item;
        this.adoptListModelAJAX.ajax({
            type: 'post',
            url: '/message/admin/passingRate/queryUserPassingRateDetails.io',
            data: {
                contentType, manageId, pageNow, pageSize: 16,
            },
            callback: (data) => {
                this.setState({details:data})
            }
        })
    };

    _open(item) {
        this.setState({dialogVisible: true,item:item}, ()=> this.getDetails(1))
    }

    _close() {
        this.setState({dialogVisible: false});
    }

    getDetailsList=(e)=>{
        this.getDetails(e);
    };

    render() {
        let {details,dialogVisible,columns}=this.state;
        return (
            <Dialog title="每日通过率" size="small" visible={dialogVisible}
                    onCancel={() =>this.setState({ dialogVisible: false})}
                    lockScroll={false}>
                <Dialog.Body>
                    <AJAX ref={e => this.adoptListModelAJAX = e}>
                        <Table style={{width: '100%',margin:'10px 0 0'}}
                            columns={columns} data={details.userPassingRateDetailsList}
                            border={true}/>
                    </AJAX>
                    <div style={{marginTop:'10px'}}>
                        <Pagination layout="total, prev, pager, next, jumper" total={details.count}
                                    pageSize={details.pageSize} currentPage={details.pageNow} onCurrentChange={this.getDetailsList}/>
                    </div>
                </Dialog.Body>
            </Dialog>
        )
    }
}

export default ContentDetails;
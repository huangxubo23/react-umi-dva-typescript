/**
 * Created by shiying on 18-9-15.
 */
import React from 'react';
import AJAX from '../../../../../../../../lib/newUtil/AJAX.js';
import {Pagination,Table,Dialog} from 'element-react';
import 'element-theme-default';

class RewardCountDetailsModal extends React.Component {//奖励总和详情模态
    constructor(props) {
        super(props);
        this.state = {
            dialogVisible: false,
            startDate: "",//开始时间
            endDate: "",//结束时间
            manageId: "",//员工id
            pageNow:1,
            pageSize:20,
            count:0,
            effectAnalyseList: [],
            columns:[{
                label: 'feedId',
                prop: 'feedId',
            },{
                label: '标题',
                prop: 'feedTitle',
            },{
                label: '封面图',
                prop: 'feedPicUrl',
                minWidth:'200px',
                render:(data)=>{
                    return <img src={data.feedPicUrl}/>
                }
            },{
                label: '奖励',
                prop: 'publicFee',
                render:(data)=>{
                    return `${data.publicFee.toFixed(2)}元`
                }
            }],
        }
    };

    goPage = (newPageNow) => {/*点击分页*/
        let {pageSize,startDate,endDate,manageId,pageNow}=this.state;
        this.rewardCountDetailsModalAJAX.ajax({
            url:'/message/admin/effectAnalyse/queryEffectAnalyseByDateAndmanageId.io',
            type:'post',
            data:{
                pageNow: newPageNow?newPageNow:pageNow, pageSize, startDate, endDate, manageId
            }, callback:(json)=>{
                this.setState(json);
            }
        });
    };

    render(){
        let {dialogVisible,columns,effectAnalyseList,count,pageSize,pageNow}=this.state;
        return (
            <Dialog title="奖励详情" size="small" visible={dialogVisible}
                    onCancel={() =>this.setState({ dialogVisible: false})}
                    lockScroll={false}>
                <Dialog.Body>
                    <AJAX ref={e => this.rewardCountDetailsModalAJAX = e}>
                        <Table style={{width: '100%',margin:'10px 0 0'}}
                               columns={columns} data={effectAnalyseList}
                               border={true}/>
                    </AJAX>
                    <div style={{marginTop:'10px',textAlign:"center"}}>
                        <Pagination layout="total, prev, pager, next, jumper" total={count}
                                    pageSize={pageSize} currentPage={pageNow} onCurrentChange={this.goPage}/>
                    </div>
                </Dialog.Body>
            </Dialog>
        )
    }
}

export default RewardCountDetailsModal;
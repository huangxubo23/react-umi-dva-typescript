/**
 * Created by linhui on 18-06-29.赏金任务统计铺模态
 */
import React from 'react';
import {
    ListGroupItem,
    Label,
    Button,
    Modal,
    ListGroup,
} from "react-bootstrap";
import $ from 'jquery';
import noty from 'noty';
import {ajax} from '../../../../../../../../../../lib/util/ajax';
import {infoNoty,notyOK} from '../../../../../../../../../../lib/util/global';
import ReactChild from "../../../../../../../../../../lib/util/ReactChild";

class StatisticsModal extends ReactChild {
    stateValue = () => {
        return {
            showModal: true,//模态开关
            taskId: '',//任务id
            taskStateContentList: [],//统计状态数据
            moenyTask2ContentList: [],//统计每人打款数据TaskState=2
            moenyTask3ContentList: [],//统计每人打款数据TaskState=3
            price:'',//任务价格
        }
    };

    constructor(props) {
        super(props);
        this.state = this.stateValue();
    }
    componentDidMount(){
        if(this.props.taskId){
            this.querybountyTaskStatistics();
        }
    }

    querybountyTaskStatistics=()=>{//统计数据
      let taskId = this.props.taskId;
     ajax.ajax({
         type:'post',
         url:'/mission/admin/supOrgTask/querybountyTaskStatistics.io',
         data:{bountyTaskId:taskId},
         callback:(json)=>{
             this.setState(json);
         }
     });
    };

    openModal = () => {//打开模态
        this.setState({showModal: true});
    };

    closeModal = () => {//关闭模态
        this.setState({showModal: false});
    };
    allMakeMoney=(env)=>{//全部打款
        let moey = $(env.target).data('moey');
        notyOK({text:'您确定要全部打款吗',text2:'打款'},()=>{
            ajax.ajax({
                type:'post',
                url:'/mission/admin/supOrgTask/allMakeMoney.io',
                data:{taskId:this.state.taskId,moey:JSON.stringify(moey)},
                callback:(json)=>{
                    infoNoty('打款成功','success');
                    this.closeModal();
                    this.querybountyTaskStatistics();
                }
            });
        });
    };

    render() {
        let [jinXingZhong,buTongGuo,tongGuo,yiDaKuang,taskStateContentList]=[0,0,0,0,this.state.taskStateContentList];
        taskStateContentList.map((cs,i)=>{
           if(cs.taskState==0){
               jinXingZhong++
           }else if(cs.taskState<0||cs.taskState==1){
               buTongGuo++
           }else if(cs.taskState==2){//通过
                tongGuo++
           }else if(cs.taskState==3){//已打款
                yiDaKuang++
           }
       });

        return (
            <Modal show={this.state.showModal} onHide={this.closeModal} onExit={this.stateValue}>
                <Modal.Header>
                    <Modal.Title>统计</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ListGroup>
                        <ListGroupItem>
                            <Label bsStyle="info">进行中({jinXingZhong})</Label><p />
                            <Label bsStyle="danger">审核不通过({buTongGuo})</Label><p />
                            <Label bsStyle="primary">审核通过({tongGuo})</Label><p />
                            <Label bsStyle="success">已打款({yiDaKuang})</Label><p />
                        </ListGroupItem>
                        <ListGroupItem>
                        {this.state.moenyTask2ContentList.map((item,i)=>{
                            return(
                                <p key={item.moneyMakingInfo.name+"_"+i}>支付宝:{item.moneyMakingInfo.name}:{item.moneyMakingInfo.alipay}未打款:{item.count}x{this.state.price}x90%={item.count*this.state.price*0.9}元
                                    <Button bsSize="small" bsStyle='success' data-moey={JSON.stringify(item.moneyMakingInfo)} onClick={this.allMakeMoney}>全部已打款</Button>
                                </p>
                            )
                        })}
                        </ListGroupItem>
                        <ListGroupItem>
                        {this.state.moenyTask3ContentList.map((item,i)=>{
                            return(
                                <p key={item.moneyMakingInfo.name+"_"+i}>支付宝:{item.moneyMakingInfo.name}:{item.moneyMakingInfo.alipay}:已打款:{item.count}x{this.state.price}x90%={item.count*this.state.price*0.9}元</p>
                            )
                        })}
                        </ListGroupItem>
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle='danger' onClick={this.closeModal}>关闭</Button>
                </Modal.Footer>
            </Modal>
        )
    }

}

export default StatisticsModal;

/**
 * Created by linhui on 18-07-04.赏金任务内容列表通过打款信息
 */
import React from 'react';
import {
    Button,
    Col,
    Form,
    FormGroup,
    ControlLabel,
    FormControl,
    Modal,
} from "react-bootstrap";
import ReactChild from "../../../../../../../../../../lib/util/ReactChild";
import {infoNoty} from "../../../../../../../../../../lib/util/global";
import {ajax} from "../../../../../../../../../../lib/util/ajax";

class AdoptModal extends ReactChild {
    constructor(props){
        super(props);
        this.state={
            adoptModal:true,
            adoptTaskState: '',//通过状态
            getOrgmoneyMakingInfo: '',//组织打款信息
            moneyMakingInfo: {//打款信息
                name: '',//姓名
                alipay: '',//支付宝
            },
        }
    }
    openAdoptModal = (env) => {//打开通过模态开关
        this.setState({adoptModal:true});
    };
    getOrgmoneyMakingInfo=()=>{
        let [taskstate, adoptI, contentsList] = [this.props.taskstate,this.props.adoptI,this.props.contentsList];
        let moneyMakingInfo = '';
        ajax.ajax({
            type: 'post',
            url: '/user/admin/superOrganization/bountyTask/getOrgmoneyMakingInfo.io',
            data: {orgId: contentsList[adoptI].organizationId},
            callback: (json) => {
                moneyMakingInfo = json;
                if (json) {
                    this.setState({adoptTaskState: taskstate, adoptI: adoptI, contentsList: contentsList, moneyMakingInfo: moneyMakingInfo, getOrgmoneyMakingInfo: moneyMakingInfo, adoptModal: true});
                } else {
                    this.setState({adoptTaskState: taskstate, adoptI: adoptI, contentsList: contentsList, getOrgmoneyMakingInfo: '', adoptModal: true});
                }
            }
        });
    };

    closeAdoptModal = () => {//关闭通过模态开关
        this.setState({adoptModal: false});
    };
    setMoeyMakingInfo = () => {//关闭付款模态框情况里面内容
        let moneyMakingInfo = this.state.moneyMakingInfo;
        moneyMakingInfo.alipay = '';
        moneyMakingInfo.name = '';
        this.setState({moneyMakingInfo: moneyMakingInfo});
    };
    moneyMakingInfoChange = (env) => {//打款信息事件
        let [value, name, moneyMakingInfo] = [env.target.value, $(env.target).data('name'), this.state.moneyMakingInfo];
        moneyMakingInfo[name] = value;
        this.setState({moneyMakingInfo: moneyMakingInfo});
    };
    moneyMakingInfoClcik = (env) => {//通过
        let [taskstate, i, contentsList, moneyMakingInfo] = [$(env.target).data("state"), $(env.target).data("i"), this.state.contentsList, this.state.moneyMakingInfo];
        if (!moneyMakingInfo.name) {
            infoNoty('请输入支付宝姓名');
            return false;
        } else if (!moneyMakingInfo.alipay) {
            infoNoty('请输入打款支付宝账号');
            return false;
        }
        let [id, conState] = [contentsList[i].id, contentsList[i].conState];
        if (!this.state.getOrgmoneyMakingInfo) {
            ajax.ajax({
                type: 'post',
                url: '/user/admin/superOrganization/bountyTask/addOrgmoneyMakingInfo.io',
                data: {orgId: contentsList[i].organizationId, moneyMakingInfo: JSON.stringify(moneyMakingInfo)},
                callback: (json) => {
                    ajax.ajax({
                        type: 'post',
                        url: '/mission/admin/supOrgTask/upContentsBytaskState.io',
                        data: {taskState: taskstate, id: id, conState: conState, moneyMakingInfo: JSON.stringify(moneyMakingInfo)},
                        callback: (json) => {
                            infoNoty('通过成功', 'success');
                            moneyMakingInfo.name = '';
                            moneyMakingInfo.alipay = '';
                            this.setState({moneyMakingInfo: moneyMakingInfo}, () => {
                                this.closeAdoptModal();
                                this.props.examineGoPage();
                            });
                        }
                    });
                }
            });
        } else {
            ajax.ajax({
                type: 'post',
                url: '/mission/admin/supOrgTask/upContentsBytaskState.io',
                data: {taskState: taskstate, id: id, conState: conState, moneyMakingInfo: JSON.stringify(moneyMakingInfo)},
                callback: (json) => {
                    infoNoty('通过成功', 'success');
                    this.closeAdoptModal();
                    this.props.examineGoPage();
                }
            });
        }

    };

    render(){
        return(
        <Modal show={this.state.adoptModal} bsSize="large" onHide={this.closeAdoptModal} onExit={this.setMoeyMakingInfo}>
            <Modal.Header closeButton>
                <Modal.Title>请填写打款信息</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form horizontal>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={3}>
                            支付宝姓名
                        </Col>
                        <Col sm={9}>
                            <FormControl type='text' value={this.state.moneyMakingInfo.name} data-name='name' onChange={this.moneyMakingInfoChange}/>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={3}>
                            支付宝账号
                        </Col>
                        <Col sm={9}>
                            <FormControl type='text' value={this.state.moneyMakingInfo.alipay} data-name='alipay' onChange={this.moneyMakingInfoChange}/>
                        </Col>
                    </FormGroup>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button bsStyle='primary' data-state={this.state.adoptTaskState} data-i={this.state.adoptI} onClick={this.moneyMakingInfoClcik}>通过</Button>
                <Button bsStyle='danger' onClick={this.closeAdoptModal}>关闭</Button>
            </Modal.Footer>
        </Modal>
        )
    }
}

export  default AdoptModal;
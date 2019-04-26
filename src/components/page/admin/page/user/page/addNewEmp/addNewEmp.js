/**
 * Created by linhui on 2018年5月4日15:55:17
 */

import React from 'react';
import ReactChild from "../../../../../../lib/util/ReactChild";
import {ajax} from '../../../../../../lib/util/ajax';
import {infoNoty, getUrlPat} from '../../../../../../lib/util/global';
import {
    Button,
    Col,
    FormGroup,
    ControlLabel,
    FormControl,
    Form,
    Panel
} from "react-bootstrap";
import '../../../../../../../styles/user/content.css';
import '../../../../../../../styles/component/util/minSm.js.css';

class AddNewEmp extends ReactChild {
    constructor(props) {
        super(props);
        this.state = {
            orgId: '',//组织id
            name: '',//员工名字
        }
    }

    componentDidMount = () => {
        let url = window.location.href;
        let orgId = getUrlPat(url, 'orgId');
        this.setState({orgId: orgId}, () => {
            this.getMain();
        });
    };
    getMain = () => {//拿去主页头部信息
        ajax.ajax({
            type: "post",
            url: "/user/admin/getIndexHeader.io",
            data: {},
            callback: (data) => {
                this.setState({data: data});
            }
        });
    };
    nameState=(env)=>{//名字事件
        let name = env.target.value;
        this.setState({name:name});
    };
    addNewManages=()=>{//添加新员工
        let [name,subNick,orgId] = [this.state.name,this.state.data.subNick,this.state.orgId];
        if(!name){
            infoNoty("名字不能为空");
            return false;
        }else if(!orgId){
            infoNoty("组织Id不能为空");
            return false;
        }
        let talents ={name:name,subNick:subNick,orgId:orgId};
        ajax.ajax({
            type:'post',
            url:'/user/admin/visible/addNewManages.io',
            data: {manAge: JSON.stringify(talents)},
            callback:()=>{
                infoNoty("添加成功,请联系管理员","success");

            }
        });
    };
    render() {
        return (
            <div>
                <Panel header='新员工填写表'>
                    <Form horizontal>
                        <FormGroup controlId="formHorizontalText">
                            <Col componentClass={ControlLabel} sm={2}>
                                名字
                            </Col>
                            <Col sm={10}>
                                <FormControl type="text" placeholder="请输入名字..." value={this.state.name} onChange={this.nameState}/>
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="formHorizontalText">
                            <Col componentClass={ControlLabel} sm={2}>
                                混淆id
                            </Col>
                            <Col sm={10}>
                                <FormControl type="text" value={this.state.data && this.state.data.subNick} onChange={() => {
                                }}/>
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="formHorizontalText">
                            <Col componentClass={ControlLabel} sm={2}>
                                组织Id
                            </Col>
                            <Col sm={10}>
                                <FormControl type="text" placeholder="让员工登入后台后,首页右上角有提供" value={this.state.orgId} onChange={() => {
                                }}/>
                            </Col>
                        </FormGroup>
                    </Form>
                    <Button onClick={this.addNewManages}>确定</Button>
                </Panel>
            </div>
        )
    }
}

export default AddNewEmp;
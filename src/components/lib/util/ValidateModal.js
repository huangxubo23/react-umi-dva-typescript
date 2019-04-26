/**
 * Created by 石英 on 2019/1/18 0018下午 3:57.
 */

import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import {Dialog, Button, Alert, Loading,Input,Notification} from 'element-react';
import AJAX from '../newUtil/AJAX';
import 'element-theme-default';

class ValidateModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            value:'',
        };
    }

    open = () => {
        this.setState({showModal: true});
    };

    close = () => {
        this.setState({showModal: false});
    };

    getTest=()=>{
        let {value}=this.state,{parameter,callback}=this.props;
        this.validateAjax.ajax({
            url: "/message/maliciousAccessCode/validation.io",
            data: {
                code:value,
                ...parameter
            },
            callback: () => {
                callback(true);
            }
        });
    };

    verificationCode=()=>{
        let da=new Date();
        $('.verification')[0].src=`/message/maliciousAccessCode/image.img?t=${Date.parse(da)}`;
    };

    render() {
        let {showModal,value,d}=this.state;
        return (
            <Dialog title="这是一个机器猖獗的时代，唯有验证无可替代" visible={showModal} onCancel={this.close} size={"tiny"}>
                <Dialog.Body>
                    <div style={{textAlign:'center'}}>
                        <img src={`/message/maliciousAccessCode/image.img?t=${Date.parse(d)}`} className='verification'/>
                        <Button type="text" onClick={this.verificationCode}>看不清？换一张</Button>
                    </div>
                    <AJAX ref={e => this.validateAjax = e}>
                        <div style={{textAlign:'center',marginTop:'10px'}}>
                            <Input value={value} onChange={(value)=>this.setState({value})} placeholder="请输入验证码..."
                                   append={<Button type="primary" onClick={this.getTest}>验证</Button>} style={{width:'280px'}}/>
                        </div>
                    </AJAX>
                </Dialog.Body>
                <div style={{textAlign:'center'}}>
                    <a href="https://www.yuque.com/li59rd/grkh9g/glsym4" target="_blank">为什么要频繁验证，查看验证原因？</a>
                </div>
                <Dialog.Footer className="dialog-footer">
                    <Button onClick={this.close}>关闭</Button>
                </Dialog.Footer>
            </Dialog>
        );
    }
}

class Validate {

    static callbacks = [];
    static ajax;

    static getInstance(cb, ajax,parameter) {
        Validate.ajax = ajax;
        if (!Validate.instance) {
            $('body').append('<div id="validateModel"></div>');
            Validate.instance = ReactDOM.render(
                <ValidateModal
                    callback={Validate.callback} parameter={parameter}/>, document.getElementById('validateModel'));
        }

        if (cb) {
            Validate.open(cb);
        }

        return Validate;
    }

    static callback = (ca) => {
        let cbs = Validate.callbacks;
        cbs.map((item, i) => {
            item(ca);
        });
        Validate.instance.setState({showModal: false});
    };

    static open(cb) {
        if (cb && typeof cb == 'function') {
            let cbs = Validate.callbacks;
            cbs.push(cb);
            Validate.callbacks = cbs;
            let d=new Date();
            Validate.instance.setState({showModal: true,d});
        }
    }
}

Validate.defaultProps = {};
export default Validate;
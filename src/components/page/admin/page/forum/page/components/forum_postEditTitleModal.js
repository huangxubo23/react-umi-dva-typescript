
/**
 * Created by 林辉 on 2018-06-08.
 */

import React from 'react';
import { Button, Modal, FormGroup, FormControl, ControlLabel} from "react-bootstrap"
import {ajax} from "../../../../../../lib/util/ajax";
import noty from "noty";

class EditTitleModal extends React.Component {
    constructor(props){
        super(props);
        this.state={
            TitleModal:false,
        }
    }

    editFroumPost=(env)=>{//修改标题
        let [postId,title] = [this.state.postId,this.state.title];
        ajax.ajax({
            type: 'post',
            url: '../forum/bbs/loginAndOrg/editFroumPost.io',
            data: {'postId': postId,title:title},
            callback:  ()=> {
                new noty({
                    text: '帖子修改成功',
                    type: 'success',
                    layout: 'topCenter',
                    modal: false,
                    timeout: 3000,
                    theme: 'bootstrap-v4',
                    animation: {
                        open: 'noty_effects_open',
                        close: 'noty_effects_close'
                    }
                }).show();
                this.closeModal();
                this.props.goPage(1);
            }
        });
    };

    closeModal=()=>{//关闭修改标题模态
        this.setState({titleModal:false});
    };
    titleChange=(env)=>{//标题修改事件
        let title = env.target.value;
        this.setState({title:title});
    };
    render() {
        return (
            <Modal show={this.state.titleModal} onHide={this.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>修改标题</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormGroup controlId='formControlsText'>
                        <ControlLabel>标题：</ControlLabel>
                        <FormControl type='text' placeholder='请输入标题' value={this.state.title} onChange={this.titleChange}/>
                    </FormGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle='primary' onClick={this.editFroumPost}>修改</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default EditTitleModal;
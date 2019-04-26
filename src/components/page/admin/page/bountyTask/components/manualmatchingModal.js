/**
 * Created by linhui on 18-3-31.赏金任务手动匹配模态框
 */

import ReactChild from "../../../../../lib/util/ReactChild";
import React from 'react';
import AJAX from '../../../../../../components/lib/newUtil/AJAX';
import {ajax} from '../../../../../../components/lib/util/ajax';
import {Notification, Dialog, Layout, Button, Input} from 'element-react';
import 'element-theme-default';


class manualMatchingModal extends ReactChild {//手动匹配
    constructor(props) {
        super(props);
        this.state = {
            dialogVisible: true,
            contentId: '',
        };
        this.openModal = () => {
            this.setState({dialogVisible: true});
        };
        this.closeModal = () => {
            this.setState({dialogVisible: false});
        };
    }

    contentIdChange = (contentId) => {
        this.setState({contentId});
    };

    putMessageByContentId = () => {//匹配内容
        let {contentId} = this.state;
        if (!contentId) {
            Notification({
                message: '内容Id不能为空',
                type: 'warning'
            });
            return false;
        }
        this.manualmatchingModalAjax.ajax({
            type: 'post',
            url: '/content/admin/content/manualmatchingsByContentId.io',
            data: {contentId: contentId},
            callback: () => {
                Notification({
                    message: '已提交匹配',
                    type: 'success'
                });
                this.closeModal();
            }
        });
    };

    render() {
        let {dialogVisible, contentId} = this.state;
        return (
            <div>
                <AJAX ref={e=>this.manualmatchingModalAjax=e}>
                    <Dialog title="手动匹配" size="tiny" visible={dialogVisible}
                            onCancel={() => this.setState({dialogVisible: false})}
                            lockScroll={false} style={{textAlign: 'left'}}>
                        <Dialog.Body>
                            <Layout.Row gutter="5">
                                <Layout.Col span={4} style={{marginTop: '5px'}}>
                                    内容ID
                                </Layout.Col>
                                <Layout.Col span={20}>
                                    <Input placeholder="请输入内容" value={contentId} onChange={this.contentIdChange}/>
                                </Layout.Col>
                            </Layout.Row>
                        </Dialog.Body>
                        <Dialog.Footer className="dialog-footer">
                            <Button onClick={() => this.setState({dialogVisible: false})}>关闭</Button>
                            <Button type="primary" onClick={this.putMessageByContentId}>匹配</Button>
                        </Dialog.Footer>
                    </Dialog>
                </AJAX>
            </div>
        )
    }
}

export default manualMatchingModal;

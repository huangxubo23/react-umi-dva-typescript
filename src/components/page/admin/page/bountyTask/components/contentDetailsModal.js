/**
 * Created by linhui on 18-04-04.赏金任务日志详情模态
 */
import React from 'react';
import AJAX from '../../../../../lib/newUtil/AJAX';
import NewPanel from '../../../../../lib/util/elementsPanel';
import 'bootstrap-switch';
import {
    Row,
    Panel,
    Modal,
} from "react-bootstrap";
import {Button, Layout, Dialog} from 'element-react';
import 'element-theme-default';
import ReactChild from "../../../../../lib/util/ReactChild";

class ContentDetailsModal extends ReactChild {//内容详情模态
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            contents: '',
            contentLog: '',

        }
    }

    componentDidMount() {
        if (this.props.contents) {
            this.getContetLog();
        }
    }

    openModal = (callback) => {//打开模态
        this.setState({showModal: true}, () => {
            callback();
        });
    };
    closeModal = () => {//关闭模态
        this.setState({showModal: false});
    };

    getContetLog = () => {//获取日志
        let content = this.props.contents.contentId;
        this.contentDetailsModalAjax.ajax({
            type: 'post',
            url: '/content/admin/content/getContentLogById.io',
            data: {contentId: content},
            callback: (json) => {
                this.setState({contentLog: json,showModal:true});
            }
        });
    };

    render() {
        let [contents, contentLog] = [this.props.contents, this.state.contentLog];
        return (
            <div>
                <AJAX ref={e => this.contentDetailsModalAjax = e}>
                    <Dialog title="日志" size="small" visible={this.state.showModal} onCancel={this.closeModal} lockScroll={false}>
                        <Dialog.Body>
                            <Layout.Row>
                                <Layout.Col sm={12}>
                                    <NewPanel  header={"内容列表日志"}>
                                        <div style={{height: '400px', overflow: 'auto'}}>
                                            {contentLog && contentLog.split('\n\r').map((item, i) => {
                                                return (<div key={i}>{item}</div>)
                                            })}
                                        </div>
                                    </NewPanel>
                                </Layout.Col>
                                <Layout.Col sm={12}>
                                    <NewPanel  header={"赏金任务内容日志"}>
                                        {contents.log && contents.log.split('\n\r').map((item, i) => {
                                            return (<div key={i}>{item}</div>)
                                        })}
                                    </NewPanel>
                                </Layout.Col>
                            </Layout.Row>
                        </Dialog.Body>
                        <Dialog.Footer className="dialog-footer">
                            <Button type='primary' onClick={this.closeModal}>关闭</Button>
                        </Dialog.Footer>
                    </Dialog>
                </AJAX>
            </div>
        )
    }
}

export default ContentDetailsModal;
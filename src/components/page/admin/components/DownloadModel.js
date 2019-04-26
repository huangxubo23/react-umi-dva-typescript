/**
 * Created by shiying on 17-7-26.
 */

import React from 'react';
import {
    Modal,
    Row,
    Col,
    Button,
    Jumbotron
} from "react-bootstrap";
import {ajax} from '../../../lib/util/ajax';

const Ajax = ajax.ajax;
import ReactChild from "../../../lib/util/ReactChild";
import {ThousandsOfCall} from "../../../lib/util/ThousandsOfCall";



class ListShowModel extends ReactChild {
    constructor(props) {
        super(props);
        this.state = {
            postShow: true,
        }
    }

    messageChange = (env) => {
        this.setState({message: env.target.value})
    };

    componentDidMount() {
        this.getwin();
        this.getmac();
    }

    getwin = () => {
        ThousandsOfCall.acoustic(
            {
                agreement: "http",
                hostname: "wzgpc.file.alimmdn.com",
                data: {t: new Date().getTime()},
                path: "/upload/latest.yml",
                method: "get",
            },
            "request", (msg) => {
                let ymls = msg.data;
                let ymlsp = ymls.split("\n");
                let winUp = {};
                for (let i in ymlsp) {
                    let ym = ymlsp[i].replace(/(^\s*)|(\s*$)/g, "");
                    let yml = ym.split(": ");
                    if (yml[0] && yml[1]) {
                        winUp[yml[0]] = yml[1];
                    }
                }
                this.setState({winUp: winUp})
            }
        );

    }

    getmac = () => {
        ThousandsOfCall.acoustic(
            {
                agreement: "http",
                hostname: "wzgpc.file.alimmdn.com",
                path: "/upload/latest-mac.yml",
                data: {t: new Date().getTime()},
                method: "get",
            },
            "request", (msg) => {
                console.log(msg);
                let ymls = msg.data;
                let ymlsp = ymls.split("\n");
                let macUp = {};
                for (let i in ymlsp) {
                    let ym = ymlsp[i].replace(/(^\s*)|(\s*$)/g, "");
                    let yml = ym.split(": ");
                    if (yml[0] && yml[1]) {
                        macUp[yml[0]] = yml[1];
                    }
                }
                this.setState({macUp: macUp})
            }
        );

    }


    close = () => {
        this.setState({postShow: false});
    };


    render() {

        return (
            <Modal show={this.state.postShow} onHide={this.close} bsSize="large">
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-lg">
                        最新版软件下载
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="show-grid">
                        <Col xs={6} md={6}>
                            {this.state.winUp && <Jumbotron>
                                <h1>Windows </h1>
                                <h3>{this.state.winUp.version}</h3>
                                <p>
                                    正常的windows电脑，请下载这个版本
                                </p>
                                <p>
                                    <Button bsStyle="primary" onClick={() => {
                                        shell.openExternal("http://wzgpc.file.alimmdn.com/upload/" + this.state.winUp["- url"]);
                                    }}>下载</Button>
                                    <br/>
                                    <span>{"http://wzgpc.file.alimmdn.com/upload/" + this.state.winUp["- url"]}</span>
                                </p>
                            </Jumbotron>}
                        </Col>
                        <Col xs={6} md={6}>
                            {this.state.macUp && <Jumbotron>
                                <h1>Mac OS </h1>
                                <h3>{this.state.macUp.version}</h3>
                                <p>
                                    苹果电脑专用版本。
                                </p>
                                <p>
                                    <Button bsStyle="primary" onClick={() => {
                                        shell.openExternal("http://wzgpc.file.alimmdn.com/upload/" + this.state.macUp["- url"]);
                                    }}>下载</Button>
                                    <br/>
                                    <span>{"http://wzgpc.file.alimmdn.com/upload/" + this.state.macUp["- url"]}</span>
                                </p>
                            </Jumbotron>}
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        )
    }
}

ListShowModel.defaultProps = {};

export default ListShowModel;

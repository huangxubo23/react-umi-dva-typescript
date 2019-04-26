/**
 * Created by linhui on 17-9-28.智能抠图
 */
require('../../../../../../../styles/tool/itemTesting.css');
import React from 'react';
import ReactChild from "../../../../../../lib/util/ReactChild";
import '../../../../../../lib/util/ajaxfileupload';
import UpImages from '../../../../../../lib/sharing/upload/UpImages';
import {ThousandsOfCall} from '../../../../../../lib/util/ThousandsOfCall';
import  {
    Button,
    Col,
    Panel,
    Image,
    Row,
} from 'react-bootstrap'

class SmartCutout extends ReactChild {
    constructor(props) {
        super(props);
        this.state = {
            primordial: undefined,
            results: undefined
        };
    }

    openUpImgMo = ()=> {
        this.refs.upImages.open();
    };

    callback = (img)=> {
        this.setState({primordial: img},()=>{
            let s = {
                type: "jsonp",
                dataType: "jsonp",
                api: "mtop.taobao.luban.dapei.cutandcroppic",
                v: "1.0",
                appKey: 12574478,
                t: new Date().getTime(),
                jsv: "2.4.3",
                ecode: 1,
            };
            ThousandsOfCall.acoustic({
                parameters: s,
                requesData: {picUrl: img},
                host: "https://acs.m.taobao.com/h5",
                ajaxData: {requeryType: "get"}
            }, "requestH5", (data)=> {
                this.setState({results: data.data.result});
            });
        });
    };

    render() {
        return (
            <div>
                <Panel header={<h3>智能抠图</h3>} bsStyle="info">
                    <Row style={{marginBottom:"20px"}}>
                        <Col sm={5}>

                        </Col>
                        <Col sm={2}>
                            <Button onClick={this.openUpImgMo} bsStyle="info" block>上传图片</Button>
                        </Col>
                        <Col sm={5}>

                        </Col>
                    </Row>
                    <Row>
                        <Col sm={6}>
                            <Panel header="原始图">
                                <Image src={this.state.primordial} thumbnail/>
                                {this.state.primordial}
                            </Panel>
                        </Col>
                        <Col sm={6}>
                            <Panel header="抠图后">
                                <Image src={this.state.results} thumbnail/>
                                {this.state.results}
                            </Panel>

                        </Col>
                    </Row>
                    <UpImages ref="upImages" callback={this.callback}/>
                </Panel>
            </div>
        )
    }
}


export default SmartCutout;


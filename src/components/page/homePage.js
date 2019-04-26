
/**
 * Created by 林辉 on 2018/10/15 14:40.下载首页
 */
import React from "react";
import ppt0727 from '../../images/index/哇掌柜ppt0727.jpg'
import 'element-theme-default';
import $ from 'jquery';
import {
    Alert, Card, Button,Layout
} from 'element-react';
import {ThousandsOfCall} from "../lib/util/ThousandsOfCall";
class HomePageIndex extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            model: undefined,
            runTime: 0
        }
    }

    componentDidMount(){
        this.getwin();
        this.getmac();
    }

    getwin = (callback) => {
        let winUp = {};
        $.ajax({
            url: "http://wzgpc.file.alimmdn.com/upload/latest.yml", dataType: "text", success: (msg) => {
                console.log('msg',msg);
                let ymlsp = msg.split("\n");

                for (let i in ymlsp) {
                    let ym = ymlsp[i].replace(/(^\s*)|(\s*$)/g, "");
                    let yml = ym.split(": ");
                    if (yml[0] && yml[1]) {
                        winUp[yml[0]] = yml[1];
                    }
                }
                if(callback){
                    callback(winUp);
                }
                this.setState({winUp: winUp})
            }
        });
    };

    getmac = () => {


        $.ajax({
            url: "http://wzgpc.file.alimmdn.com/upload/latest-mac.yml", dataType: "text", success: (msg) => {
                let ymlsp = msg.split("\n");
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
        })
    };



    render(){
        return(
            <div style={{minWidth: "750px", backgroundColor: "white"}}>
                <div style={{position: "absolute", right: 0, maxWidth: "1920px"}}><img src={ppt0727} width={"100%"}/></div>
                <div style={{
                    width: "48%",
                    position: "absolute",
                    right: "50%",
                    top: "40%",
                    textAlign: "center",
                    padding: "10px",
                    marginTop: "-225px"
                }}>
                    <h2 style={{color: "#5f5f5f"}}>欢迎使用哇掌柜</h2>
                    <a href="https://www.yuque.com/li59rd/grkh9g" target="_blank"
                       style={{color: "#9c9b9b", textDecoration: "non", fontSize: "12px"}}>为了更好的使用软件，请仔细阅读操作文档</a>
                    {/*<div style={{border: "1px solid #e2e2e2", marginTop: "30px"}}>*/}
                    {/*<h3>请选择操作模式</h3>*/}
                    {/*</div>*/}

                    <Card style={{marginTop: "30px", textAlign: "left"}} className="box-card" header={
                        <div className="clearfix">
                            <span style={{"float": "left"}}><h2 style={{"lineHeight": "36px"}}>最新版软件下载</h2></span>
                        </div>
                    }>

                        <div className="text item">
                            <Layout.Row className="show-grid" gutter="20">
                                <Layout.Col span={12}>
                                    {this.state.winUp && <Card>
                                        <h1>Windows </h1>
                                        <h3>{this.state.winUp.version}</h3>
                                        <p>
                                            windows电脑，请下载这个版本
                                        </p>
                                        <p>
                                            <Button bsStyle="primary" onClick={() => {
                                                window.open("http://wzgpc.file.alimmdn.com/upload/" + this.state.winUp["- url"]);
                                            }}>下载</Button>
                                            <br/>
                                            <span>{"http://wzgpc.file.alimmdn.com/upload/" + this.state.winUp["- url"]}</span>
                                        </p>
                                    </Card>}
                                </Layout.Col>
                                <Layout.Col span={12}>
                                    {this.state.macUp && <Card>
                                        <h1>Mac OS </h1>
                                        <h3>{this.state.macUp.version}</h3>
                                        <p>
                                            苹果电脑专用版本。
                                        </p>
                                        <p>
                                            <Button bsStyle="primary" onClick={() => {
                                                window.open("http://wzgpc.file.alimmdn.com/upload/" + this.state.macUp["- url"]);
                                            }}>下载</Button>
                                            <br/>
                                            <span>{"http://wzgpc.file.alimmdn.com/upload/" + this.state.macUp["- url"]}</span>
                                        </p>
                                    </Card>}
                                </Layout.Col>
                            </Layout.Row>
                        </div>

                    </Card>
                </div>
            </div>
        )
    }
}
export default HomePageIndex;
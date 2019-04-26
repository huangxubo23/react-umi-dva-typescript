import {judgeDarenData, darenData} from "../../../lib/util/darenData"
import $ from "jquery";
import NewNavbar from '../../../lib/util/Navbar';
import {BundleLoading} from '../../../../bundle';
import '../../../../styles/component/adminMenu.css';


import "../../../../styles/bootstrap-theme/css/bootstrap-default.css"
import AJAX from '../../../lib/newUtil/AJAX';

import QQtb from '../../../../images/index/QQtb.png';
import React from "react";
import ReactChild from "../../../lib/util/ReactChild";

import {Notification, Menu, Button, Message} from 'element-react'
import '../../../lib/util/element-theme-wzg'
import drwx from '../../../../images/drwx.png'
import {ThousandsOfCall} from "../../../lib/util/ThousandsOfCall";

let currentLogin = undefined;

class AdminMenu extends ReactChild {

    constructor(props) {
        super(props);
        let [openLeft, path] = [true, this.props.match.path];
        if (path == '/pc/adm') {
            openLeft = false;
        }
        this.state = {
            name: "哇掌柜",
            permission: [],
            businessRegister: [],
            loginManage: '',
            isRegister: '',
            isPerission: '',
            isLogin: false,
            openLeft: openLeft,
            loginNick: undefined,
            client: false,
            listTalent: []
        };
    }

    componentWillMount() { //渲染前

    }


    componentDidMount() {
        window.addEventListener('message', this.messageCl);
        let _hmt = _hmt || [];

        (function () {
            let hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?bf6d91bca3becb27021e87a87a61e753";
            let s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
        })();

        this.getIsLogin(() => {
            if (window.ipcRenderer) {
                ipcRenderer.on("resize", (event, arg) => {
                    this.urlWidth();
                });
                ipcRenderer.on("loginSuccess", (event, arg) => {
                    this.getIsLogin(this.newNavbar.getPermissionsHead);
                });
            } else {

            }
        });
        ThousandsOfCall.acoustic({}, "test", () => {
            this.setState({client: true}, () => {
                this.daren_list((list) => {
                    this.setState({listTalent: list});
                })
            });
        });
    }

    componentDidUpdate() {
        this.urlWidth();
    }

    urlWidth = () => {
        let rightButwidth = ($("#rightBut").width());
        let urlWidth = ($(window).width() - 600 - (rightButwidth ? rightButwidth : 0));
        if (urlWidth != this.state.urlWidth) {
            this.setState({urlWidth: urlWidth});
        }
    };

    daren_list = (callback) => {//获取授权达人
        ThousandsOfCall.acoustic(
            {}, "requestTanleList", (msg) => {
                if (msg.success) {
                    callback(msg.data);
                } else {
                    Message({
                        showClose: true,
                        message: '获取失败',
                        type: 'warning'
                    });
                }
            }
        )
    };


    messageCl = (a) => {
        if (a.data) {
            if (a.data.type == "urlChange") {
                this.setState({url: a.data.urlChange})
            } else if (a.data.type == "loginSuccess") {
                this.getIsLogin(this.newNavbar.getPermissionsHead);
            }

        }
    };

    getIsLogin = (successCallback) => {
        this.menuAjax.ajax({
            url: "/user/isLogin.io",
            data: {},
            callback: (data) => {
                currentLogin = data;
                window.currentLogin = data;

                if (data.isLogin) { // 当前账号已经登入的话就去拿菜单
                    this.setState(data);
                    this.newNavbar.getPermissionsHead();
                }
                if (successCallback && typeof successCallback == "function") {
                    successCallback();
                }
            }
        })
    };

    static isLogin = () => {
        return currentLogin;
    };


    openLeft = () => {
        this.setState({openLeft: !this.state.openLeft})
    };

    goBack = () => {
        this.props.history.goBack();
    };
    goForward = () => {
        this.props.history.goForward();
    };
    refresh = () => {
        history.go(0)
    };


    render() {
        let height = $('#navBarHeght').height() - 20;
        return (

            <div id="navbarTop">
                <AJAX ref={e => this.menuAjax = e}> </AJAX>
                <div className="inner">
                    <div className="leftContent" style={{width: this.state.openLeft ? "210px" : "0"}}>
                        <NewNavbar height={height + 'px'} loginManage={this.state.loginManage} url={this.state.url}
                                   matchPath={this.props.match.path} isLogin={this.state.isLogin}
                                   ref={e => {
                                       if (e) {
                                           this.newNavbar = e;
                                       }
                                   }}/>
                    </div>
                    <div style={{
                        width: "20px",
                        position: "absolute",
                        top: "50%",
                        left: this.state.openLeft ? "206px" : "-1px",
                        background: "#dcdbdb",
                        borderRadius: "0 8px 8px 0",
                        zIndex: 22,
                        cursor: "pointer",
                        padding: "50px 0",
                        marginTop: "-50px",
                        border: " groove 3px #e2e2e2",
                        borderLeft: "0"
                    }} onClick={this.openLeft}>
                        <i className={`el-icon-arrow-${this.state.openLeft ? 'left' : 'right'}`}>

                        </i>
                    </div>
                    <div className="rightContent" style={{left: this.state.openLeft ? "210px" : "0"}}>
                        <div id="topMenu">
                            <Menu className="el-menu-demo" mode="horizontal" style={{height: '50px'}}>
                                <Menu.Item index="1"><Button type="text" onClick={this.props.history.goBack}
                                                             icon='arrow-left'/></Menu.Item>
                                <Menu.Item index="1"><a target="_blank"
                                                        href="https://www.yuque.com/li59rd/grkh9g">哇掌柜操作文档</a></Menu.Item>
                                {currentLogin && currentLogin.loginManage && currentLogin.loginManage.grade == 0 &&
                                <Menu.SubMenu index="2" title="加入哇掌柜机构">
                                    <Menu.Item index="2-1">
                                        <img src={drwx} width={"100%"}/>
                                    </Menu.Item>
                                </Menu.SubMenu>}
                                <Menu.SubMenu index="3" title="同步">
                                    <Menu.Item index="3-1"><a
                                        href="javascript:void(0)" onClick={() => {
                                        if (window.ipcRenderer) {
                                            window.ipcRenderer.send("bonusFlowCollection", 1);
                                        } else {
                                            Notification({
                                                title: '同步奖金流量',
                                                message: '该功能只能在客户端使用',
                                                type: 'warning'
                                            });
                                        }
                                    }}>同步奖金流量</a></Menu.Item>
                                    <Menu.Item index="3-2"><a href="javascript:void(0)" onClick={() => {
                                        if (window.ipcRenderer) {
                                            window.ipcRenderer.send("bonusFlowCollection", 2);
                                        } else {
                                            Notification({
                                                title: '同步审核状态',
                                                message: '该功能只能在客户端使用',
                                                type: 'warning'
                                            });
                                        }
                                    }}>同步审核状态</a></Menu.Item>
                                </Menu.SubMenu>
                                {(window.currentLogin && window.currentLogin.loginManage && window.currentLogin.loginManage.isOwnerManage) &&
                                <Menu.SubMenu index="4" title="多达人号同时在线" style={{textAlign: "left"}}>
                                    {this.state.listTalent.map((item, i) => {
                                        return <Menu.Item key={"4-" + i} index={"4-" + i}>
                                            <a href="javascript:void(0);"
                                               style={item.cookieIsFailure ? {} : {color: "#e2e2e2"}} onClick={() => {
                                                if (item.cookieIsFailure) {
                                                    ThousandsOfCall.acoustic({talentId: item.id}, "openTalentManage")
                                                } else {
                                                    ThousandsOfCall.acoustic({}, "loginAndAuthorization")
                                                }
                                            }}> {item.title}-{item.cookieIsFailure ? "打开达人后台" : "未授权,去授权"}</a>
                                        </Menu.Item>
                                    })}

                                </Menu.SubMenu>}

                                {window.ipcRenderer && <Menu.SubMenu index="5" title="重新选择模式">

                                    <Menu.Item index="5-1">
                                        <a href="javascript:void(0);" onClick={() => {
                                            window.ipcRenderer.send("RefreshWindow", {});
                                        }}> 刷新窗口并重新选择模式</a>
                                    </Menu.Item>
                                </Menu.SubMenu>}
                            </Menu>
                            {!this.state.client &&
                            <div id="clientHint">
                                <b><a style={{color: "red"}} target={"_black"}
                                      href={"http://www.52wzg.com/pc/index"}>未检测到客户端，请下载并安装</a></b>
                            </div>}

                            <div id="customerServer">
                                <a target="_blank"
                                   href="http://wpa.qq.com/msgrd?v=3&uin=2179494461&site=qq&menu=yes"><img
                                    src={QQtb}/>在线客服</a>
                            </div>

                        </div>
                        <div className=" menuContent">
                            <div id="panel-body" className='scrollParent'>
                                <div style={{minWidth: "800px", minHeight: '500px'}}>
                                    {/*<Alert title="计划 11月15日 0点停机维护，估计要好几个小时。。就这样////" type="error" />*/}
                                    {this.props.children}
                                    <div className="ft">
                                        <p>© Copyright 2018 哇掌柜
                                            {/*<span>|</span>*/}
                                            {/*<a href="" target="_blank">在线支持</a>*/}
                                            {/*<span>|</span>*/}
                                            {/*<a href="" target="_blank">文档查看</a>*/}
                                            {/*<span>|</span>*/}
                                            {/*<a href="" target="_blank">插件地址</a>*/}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

AdminMenu.defaultProps = {};

export default AdminMenu;

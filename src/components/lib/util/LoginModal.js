/**
 * Created by muqingzhong on 2017/7/18.登录模态
 */
import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import {Dialog, Button, Alert, Loading} from 'element-react';
import 'element-theme-default';

class LoginModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            alertVisible: true,
            loader: false,
            message: undefined,
            loaderNum: 0
        };

    }

    open = () => {
        this.setState({showModal: true});
    };

    close = () => {
        this.setState({showModal: false});
    };

    handleAlertDismiss = () => {
        this.setState({alertVisible: false});
    };


    handleAlertShow = () => {
        this.setState({alertVisible: true});
    };

    abandon = () => {
        this.setState({loader: false, showModal: false, message: "放弃登入"}, () => {
            this.props.callback(false);
        });
    };

    gotoLogin = () => {
        let auditUrl = this.getAuditUrl();
        if (window.ipcRenderer) {
            window.ipcRenderer.send("login", {url: auditUrl});
        } else {
            window.open(auditUrl);
        }

        this.setState({loader: true, message: undefined, loaderNum: 0}, () => {
            if (window.ipcRenderer) {
                window.ipcRenderer.on("loginSuccess", (event, arg) => {
                    this.judgeLogin(() => {
                        this.props.callback(true);
                    });
                });
            } else {
                this.judgeLogin(() => {
                    window.postMessage({type: "loginSuccess"}, document.URL)
                    this.props.callback(true);
                });
            }
        });
    };

    getAuditUrl = () => {
        let origin = window.location.origin;
        let url = `${origin}/user/manageAuthorization.htm`;
        url = url += `?redirect=${encodeURIComponent(`${origin}/pc/loginSuccess.html`)}&redirect_uri=${encodeURIComponent(url)}`;
        let auditUrl = `https://oauth.taobao.com/authorize?response_type=code&client_id=23072597&redirect_uri=${encodeURIComponent(url)}`;
        return auditUrl;                                              //原client_id百川key23072597 茉莉百川key23334409
    }

    judgeLogin = (callback) => {

        if (this.state.loader && this.state.loaderNum <= 60) {
            $.ajax({
                url: "/user/isLogin.io", dataType: "jsonp", success: (msg) => {
                    if (msg.success && msg.data.isLogin) {
                        this.setState({loader: false, showModal: false, message: "登入成功"}, () => {
                            callback(msg.data);
                        })
                    } else {
                        this.setState({loaderNum: this.state.loaderNum + 1}, () => {
                            setTimeout(() => {
                                this.judgeLogin(callback);
                            }, 2000)
                        });
                    }
                }, error: () => {
                    this.setState({loader: false, message: "获取登入状态失败"});
                }
            })
        } else {
            this.setState({loader: false, message: "登入超时"});
        }
    };

    render() {
        return (
            <Dialog title="登入超时提醒" visible={this.state.showModal} onCancel={() => this.setState({showModal: false})}
                    size={"tiny"}>
                <Dialog.Body>
                    {this.state.loader ?
                        <Loading text="请您先登入">
                            <div style={{width: "100%", height: "200px"}}>
                            </div>
                        </Loading> :
                        <Alert type="warning" title={"检测到您当前没有登入，或者登入超时"}
                               description={"你需要重新登入，或者放弃当前操作，点击去登入页面登入成功后系统会继续你的操作"} showIcon={true}/>}
                    {this.state.message ? <Alert title={this.state.message} type="info"/> : undefined}
                </Dialog.Body>

                <Dialog.Footer className="dialog-footer">
                    <Button target="_blank" onClick={this.gotoLogin}
                            type="success">去登入页面</Button>
                    <Button type="danger"
                            onClick={this.abandon}>放弃当前操作</Button>
                </Dialog.Footer>

            </Dialog>
        );
    }
}

class Login {

    static callbacks = [];
    static ajax;

    static getInstance(cb, ajax) {
        Login.ajax = ajax;
        if (!Login.instance) {
            $('body').append('<div id="loginModel"></div>');
            Login.instance = ReactDOM.render(
                <LoginModal
                    callback={Login.callback}/>, document.getElementById('loginModel'));
        }

        if (cb) {
            Login.open(cb);
        }

        return Login;
    }

    static callback = (ca) => {
        let cbs = Login.callbacks;
        cbs.map((item, i) => {
            item(ca);
        });
        Login.instance.setState({showModal: false});
    };

    static open(cb) {
        if (cb && typeof cb == 'function') {
            let cbs = Login.callbacks;
            cbs.push(cb);
            Login.callbacks = cbs;
            Login.instance.setState({showModal: true});
        }
    }
}

Login.defaultProps = {};
export default Login;

/**
 * Created by muqingzhong on 2017/7/11.ajax
 */
import Login from '../util/LoginModal';
import {Loading, Notification} from 'element-react';
import {ajax} from './ajaxEx';

class AJAX extends React.Component {

    constructor(props) {
        super(props);
        this.state = {num: 0, isLoad: false};
    }


    addLoad = () => {
        this.setState({num: this.state.num + 1}, () => {
            if (this.state.num > 0) {
                this.setState({isLoad: true});
            }
        })
    };

    removeLoad = () => {
        let num = this.state.num - 1;
        this.setState({num: num < 0 ? 0 : num}, () => {
            if (this.state.num <= 0) {
                this.setState({isLoad: false});
            }
        })
    };

    ajax = (data) => {
        data.addLoad = this.addLoad;
        data.removeLoad = this.removeLoad;
        ajax.ajax(data);
        /*$.ajax({
            type: data.type ? data.type : "get",//使用get方法访问后台
            dataType: data.dataType ? data.dataType : "json",//返回json格式的数据
            url: data.url,//要访问的后台地址
            data: data.data,//要发送的数据
            async: data.async,
            success: (msg)=> {
                if (msg.success) {
                    let callback = data.callback;
                    if (callback && typeof callback == 'function') {
                        callback(msg.data);
                    }
                } else {
                    if (msg.code == 302 && !data.notLogin) {
                        Login.getInstance( (isLogin)=> {
                            if (isLogin) {
                                this.ajax(data);
                            }
                        }, this.ajax);
                    } else {
                        Notification.error({
                            title: '错误',
                            message: '服务器异常:'+ msg.message
                        });
                        var error = data.error;
                        if (error && typeof error == 'function') {
                            error();
                        }
                    }
                }
            },
            error:  (e)=>{
                Notification.error({
                    title: '错误',
                    message: '网络异常'
                });
                let error = data.error;
                if (error && typeof error == 'function') {
                    error(e);
                }
            },
            beforeSend:  ()=>{
                if (!data.isCloseMask) {
                    this.addLoad();
                }
            },
            complete:  () =>{
                if (!data.isCloseMask) {
                    this.removeLoad();
                }
            }
        });*/
    };

    render() {
        return (
            <div style={{width: "100%", height: "100%", position: "relative"}}>
                {this.props.children}
                {this.state.isLoad && <Loading text="拼命加载中" style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }}>拼命加载中</Loading>}
            </div>
        )
    }

}


export default AJAX;

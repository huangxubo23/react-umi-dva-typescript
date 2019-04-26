/**
 * Created by muqingzhong on 2017/7/11.ajax
 */
import Login from './LoginModal';
import noty from 'noty';
import $ from 'jquery';
/*import Loadable from 'react-loadable';*/
/*import {Register} from './RegisterModal';*/
import '../../../styles/component/util/ajax.js.css'


class AJAX {

    static num = 0;

    static addLoad() {
        if ($('#load').length > 0) $('#load').show();
        else {
            var loal = $('<div id="load"><div id="load_im"><img src="https://img.alicdn.com/imgextra/i1/772901506/TB2evosXnTfFuJjSspjXXcGuFXa_!!772901506.gif"></div></div></div>');
            /*""*/
            $('body').append(loal);
        }
    }

    static removeLoad() {
        if (AJAX.num <= 0) $('#load').hide();
    }

    ajaxAgency = (data) => {//代理ajax
        data.data.pa = JSON.stringify(data.data.pa);
        this.ajax({
            type: data.type ? data.type : "get",//使用get方法访问后台
            dataType: "jsonp",//返回json格式的数据
            url: data.url,//要访问的后台地址
            data: data.data,//要发送的数据
            async: data.async,
            isCloseMask: data.isCloseMask,
            callback: (json) => {
                if (json) {
                    if (json.content.errorCode == 1001) {
                        new noty({
                            text: '当前账号还未授权，请联系管理员授权',
                            type: 'error',
                            layout: 'topCenter',
                            modal: modal ? modal : false,
                            timeout: timeout ? timeout : 3000,
                            theme: 'bootstrap-v4',
                            animation: {
                                open: 'noty_effects_open',
                                close: 'noty_effects_close'
                            }
                        }).show();
                        return false;
                    } else if (json.content.errorCode == 1002) {
                        if (window.confirm('获取模版失败,点击确定重试？')) {
                            this.ajaxAgency(data);
                        }
                    } else {
                        let callback = data.callback;
                        if (callback && typeof callback == 'function') {
                            callback(JSON.parse(json.content));
                        }
                    }

                } else {
                    new noty({
                        text: '获取数据错误',
                        type: 'error',
                        layout: 'topCenter',
                        modal: modal ? modal : false,
                        timeout: timeout ? timeout : 3000,
                        theme: 'bootstrap-v4',
                        animation: {
                            open: 'noty_effects_open',
                            close: 'noty_effects_close'
                        }
                    }).show();
                    return false;
                }
            }
        });
    };
    ajax = (data) => {
        $.ajax({
            type: data.type ? data.type : "get",//使用get方法访问后台
            dataType: data.dataType ? data.dataType : "json",//返回json格式的数据
            url: data.url,//要访问的后台地址
            data: data.data,//要发送的数据
            async: data.async,
            success: function (msg) {
                if (msg.success) {
                    var callback = data.callback;
                    if (callback && typeof callback == 'function') {
                        callback(msg.data);
                    }
                } else {
                    if (msg.code == 302 && !data.notLogin) {
                        Login.getInstance(function (isLogin) {
                            if (isLogin) {
                                ajax.ajax(data);
                            }
                        }, ajax);
                    } else if (msg.code == 305) {//没有组织
                        // data.ZC= 0 1 2; // 0没有 1达人注册 2商家注册
                        // Register.getInstance(data.registerType, (isRegister)=> {
                        //     if (isRegister) {
                        //         ajax.ajax(data);
                        //     }
                        // });

                    } else {
                        new noty({
                            text: '服务器错误:' + msg.message,
                            type: 'error',
                            layout: 'topCenter',
                            theme: 'bootstrap-v4',
                            timeout: 3000,
                            animation: {
                                open: 'noty_effects_open',
                                close: 'noty_effects_close'
                            },
                        }).show();
                        var error = data.error;
                        console.log("111111");
                        console.log(error);
                        console.log(typeof error);
                        if (error && typeof error == 'function') {
                            error();
                        }
                    }
                }
            }
            ,
            error: function (e) {
                new noty({
                    text: '网络异常',
                    type: 'error',
                    layout: 'topCenter',
                    theme: 'bootstrap-v4',
                    timeout: 3000,
                    animation: {
                        open: 'noty_effects_open',
                        close: 'noty_effects_close'
                    },
                }).show();
                var error = data.error;
                if (error && typeof error == 'function') {
                    error(e);
                }

            }
            ,
            beforeSend: function () {
                if (!data.isCloseMask) {
                    AJAX.addLoad();
                    AJAX.num++;
                }
            }
            ,
            complete: function () {
                if (!data.isCloseMask) {
                    AJAX.num--;
                    AJAX.removeLoad();
                }
            }
        });
    }

}


let ajax = new AJAX();


export {ajax, AJAX};

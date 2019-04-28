/**
 * Created by 石英 on 2018/8/14 0014下午 4:14.
 */

 import $ from 'jquery';
import Login from '../util/LoginModal';
import Validate from '../util/ValidateModal';
import {Message} from 'element-react';
import 'element-theme-default';

class AJAX {

    ajax = (data) => {
        $.ajax({
            type: data.type ? data.type : "get",//使用get方法访问后台
            dataType: data.dataType ? data.dataType : "json",//返回json格式的数据
            url: data.url,//要访问的后台地址
            data: data.data,//要发送的数据
            async: data.async,
            success: (msg) => {
                if (msg.success) {
                    let callback = data.callback;
                    if (callback && typeof callback == 'function') {
                        callback(msg.data);
                    }
                } else {
                    if (msg.code == 302 && !data.notLogin) {
                        Login.getInstance((isLogin) => {
                            if (isLogin) {
                                ajax.ajax(data);
                            }
                        }, ajax);
                    } else if(msg.code == 306){
                        //Message.error(`服务器错误:${msg.message}`);
                        Validate.getInstance((isLogin) => {
                            if (isLogin) {
                                ajax.ajax(data);
                            }
                        }, ajax,{type:'manage', value:msg.manageId});
                    }else if(msg.code == 307){
                        //Message.error(`服务器错误:${msg.message}`);
                        Validate.getInstance((isLogin) => {
                            if (isLogin) {
                                ajax.ajax(data);
                            }
                        }, ajax,{type:'ip', value:msg.ip});
                    }else {
                        Message.error(`服务器错误:${msg.message}`);
                        var error = data.error;
                        if (error && typeof error == 'function') {
                            error();
                        }
                    }
                }
            },
            error: (e) => {
                Message.error(`网络异常`);
                let error = data.error;
                if (error && typeof error == 'function') {
                    error(e);
                }
            },
            beforeSend: () => {
                if (!data.isCloseMask && data.addLoad) {
                    data.addLoad();

                }
                if (data.Fcallback && typeof data.Fcallback == 'function') {
                    data.Fcallback(true);
                }
            },
            complete: () => {
                if (!data.isCloseMask && data.removeLoad) {
                    data.removeLoad();
                }
                if (data.Fcallback && typeof data.Fcallback == 'function') {
                    data.Fcallback(false);
                }
                let complete = data.complete;
                if (complete && typeof complete == 'function') {
                    complete();
                }

            }
        });
    }
}

let ajax = new AJAX();
export {ajax, AJAX};

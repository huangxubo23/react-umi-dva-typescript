/**
 * Created by muqingzhong on 2017/7/15.Upitem用
 */

import $ from 'jquery';
import {ajax} from '../util/ajax';
import {urlAnalysis} from '../util/global';
import {ThousandsOfCall} from '../util/ThousandsOfCall';
import {MessageBox, Notification} from 'element-react';
import 'element-theme-default';

let Ajax = ajax.ajax;

class ItemGet {
    itemrowHeay(classificationId, numIid, callback) {  //排重
        if (numIid && classificationId) {
            $.ajax({
                type: 'get',//使用get方法访问后台
                dataType: 'jsonp',//返回json格式的数据
                url: '/message/admin/cheesy/cheesyRowHeay.io',//要访问的后台地址
                data: {
                    numIid: numIid,
                    classificationId: classificationId == true ? 1 : classificationId
                },//要发送的数据
                success: (msg) => {
                    let {success, exist, message = ''} = msg;
                    if (success && exist) {
                        Notification({
                            title: '警告',
                            message: message,
                            duration:6000,
                            offset:400,
                            type: 'warning'
                        });
                    }
                }
            });
        }
    }

    itemUrlActivityId(da, callback) {
        let data = {
            activityId: da.activityId,
            url: da.itemUrl,
            categoryId: 0,
        };
        ThousandsOfCall.acoustic({
            agreement: "https",
            hostname: "resource.taobao.com",
            path: "/item/add",
            data: data,
            method: "POST",
            referer: "https://we.taobao.com/"
        }, "requestRelyTB", (msg) => {
            if (msg.success) {
                let json = JSON.parse(msg.data);
                if (json.status == 'SUCCESS') {
                    callback(json.data);
                } else {
                    Notification.error({
                        title: '错误',
                        message: json.message
                    });
                    return false;
                }
            } else {
                Notification({
                    title: '警告',
                    message: `获取失败`,
                    type: 'warning'
                });
            }
        });
    }

    getSearch(data) {
        $.ajax({
            type: 'get',
            dataType: 'jsonp',
            url: 'https://kxuan.taobao.com/searchSp.htm',
            data: {
                q: data.url,
                id: 0,
            },
            success: function (msg) {
                if (msg) {
                    data.callback(msg);
                } else {
                    Notification({
                        title: '警告',
                        message: `搜全站获取失败`,
                        type: 'warning'
                    });
                }
            },
        });
    }

    getTBItem(opt) { //达人接口
        if (opt.id) {
            $.ajax({
                type: 'get',//使用get方法访问后台
                dataType: 'jsonp',//返回json格式的数据
                url: 'https://scenes.taobao.com/content/json/getItemDetailByUrl.do',//要访问的后台地址
                data: {
                    url: 'https://item.taobao.com/item.htm?id=' + opt.id,
                    appKey: 'jiyoujia',
                    isNeedTaoke: true,
                    isCheckItem: true
                },//要发送的数据
                success: (msg) => {
                    if (msg.success) {
                        opt.callback(msg.jsonObject.itemDetail);
                    } else {
                        MessageBox.alert(msg.errorMsg, '说明');
                        opt.callback(undefined, msg.errorMsg);
                    }
                }, error: function () {
                    opt.callback();
                }
            });
        }
    }

    ajaxItem(opt) {
        Ajax({
            url: "/message/admin/content/domain.item.by.get.io",
            data: {"numIid": opt.id, "openIid": opt.open_iid},
            callback:  (data)=> {
                if (!data.yongjin) {
                    let datat = {
                        q: opt.itemUrl,
                        _t: new Date().getTime(),
                        perPageSize: 50,
                        t: new Date().getTime(),
                        _tb_token_: '576333e85b3ea',
                        //  pvid: 10_120.35.147.218_18721_1551744117863
                    };
                    let dt = {
                        agreement: "https",
                        method: "get",
                        hostname: 'pub.alimama.com',
                        path: '/items/search.json',
                        data: datat,
                        referer: "https://we.taobao.com/",
                    };
                    ThousandsOfCall.acoustic(dt, 'requestRelyTB', (ctr) => {
                        if (ctr.success) {
                            try {
                                let res = JSON.parse(ctr.data);
                                    let pageList = res.data.pageList;
                                    if(pageList&&pageList.length>0){
                                        let tkCommonFee= pageList[0].tkCommonRate;
                                        data.yongjin=tkCommonFee;
                                        opt.callback(data);
                                    }else{
                                        Notification({
                                            title: '警告',
                                            message: `这个商品没有佣金`,
                                            type: 'warning'
                                        });
                                        opt.callback(data);
                                    }
                            } catch (e) {
                                Notification({
                                    title: '警告',
                                    message: `未获取到商品佣金信息`,
                                    type: 'warning'
                                });
                                opt.callback(data)
                            }
                        }
                    });
                    opt.callback(data);
                } else {
                    opt.callback(data);
                }
            }
        });
    }
}

let itemGet = new ItemGet();
export default itemGet;

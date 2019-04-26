/**
 * Created by 石英 on 2018/10/15 0015下午 4:41.
 */

import $ from 'jquery';
import React from 'react';
import {Message} from 'element-react';
import 'element-theme-default';
import {parameter} from './take'
let darenDataId={};

const darenDataId_change=(obj,callback)=>{
    darenDataId=obj;
    if(callback){
        callback();
    }
};

const talentNick = (callback)=> {//拿取达人主页数据
    parameter(
        {
            agreement: "https",
            hostname: "we.taobao.com",
            path: "/",
            data: {},
            method: "get",
            referer: "https://we.taobao.com/"
        },
        darenDataId, (item) => {
            if(item.success){
                let msg=item.data;
                if(msg.indexOf("window.CREATOR_GLOBAL =")>-1){
                    let i = msg.indexOf("window.CREATOR_GLOBAL =");
                    msg = msg.substring(i + 23);
                    let ii = msg.indexOf("</script>");
                    let msgs = msg.substring(0, ii);
                    let user = JSON.parse(msgs).user;
                    callback(user);
                }else {
                    callback();
                }
            }else {
                Message({
                    showClose: true,
                    message: '获取失败',
                    type: 'warning'
                });
            }
        }
    );
};

const talentIndex = (callback)=> {
    parameter(
        {
            agreement: "https",
            hostname: "sycm.taobao.com",
            path: "/xsite/daren/score/index.json",
            data: {},
            method: "get",
            referer: "https://we.taobao.com/"
        },
        darenDataId, (msg) => {
            console.log(msg);
            if(msg.success){
                let json=JSON.parse(msg.data);
                if (!json.hasError) {
                    if(json.content){
                        let data = json.content.data;
                        callback(data);
                    }else {
                        callback();
                    }
                } else {
                    callback();
                }
            }else {
                Message({
                    showClose: true,
                    message: '数据获取失败',
                    type: 'warning'
                });
            }
        }
    );
};

const getArea = (callback)=> {
    let date = new Date();
    let d = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate() - 1);
    parameter(
        {
            agreement: "https",
            hostname: "sycm.taobao.com",
            path: "/xsite/daren/content/overview/area.json",
            data: {dateType: "day", dateRange: d + "|" + d},
            method: "get",
            referer: "https://we.taobao.com/"
        },
        darenDataId, (msg) => {
            if(msg.success){
                let data=JSON.parse(msg.data);
                if (!data.hasError) {
                    let area = data.content.data.area.value;
                    callback(area);
                } else {
                    callback();
                }
            }else {
                Message({
                    showClose: true,
                    message: '数据获取失败',
                    type: 'warning'
                });
            }
        }
    );
};

const channel_list = (callback, current = 1, pageSize = 100, data = [])=> {
    parameter(
        {
            agreement: "https",
            hostname: "contents.taobao.com",
            path: "/api2/channel/channel_list.json",
            data: {pageSize: pageSize, current: current},
            method: "get",
            referer: "https://we.taobao.com/"
        },
        darenDataId, (item) => {
            if(item.success){
                let msg=JSON.parse(item.data);
                if (msg.status == "SUCCESS") {
                    let itemList = msg.data.itemList;
                    for (let i in itemList) {
                        let activityList = itemList[i].activityList;
                        if (activityList) {
                            activityList.map(function (item) {
                                item.mainChannel = itemList[i].id;
                            });
                        }
                        data = data.concat(activityList);
                    }
                    current = msg.data.current;
                    pageSize = msg.data.pageSize;
                    let total = msg.data.total;
                    if (total > current * pageSize) {
                        channel_list(callback, current + 1, pageSize, data);
                    } else {
                        callback(data);
                    }
                } else {
                    //出错
                }
            }else {
                Message({
                    showClose: true,
                    message: '数据获取失败',
                    type: 'warning'
                });
            }
        }
    );
};

const channel_info = (id, callback, mainChannel)=> {
    parameter(
        {
            agreement: "https",
            hostname: "contents.taobao.com",
            path: "/api2/channel/channel_info.json",
            data: {id: id},
            method: "get",
            referer: "https://we.taobao.com/"
        },
        darenDataId, (item) => {
            if(item.success){
                let msg=JSON.parse(item.data);
                if (msg != null && msg.status == "SUCCESS") {
                    callback(msg.data, mainChannel);
                } else {
                    callback();
                }
            }
        }
    );
};


const getUrlPat = (url, pa)=> {
    let pas = url.split("?")[1];
    if (pas) {
        let pavals = pas.split("&");
        for (let i = 0; i < pavals.length; i++) {
            let pv = pavals[i].split("=");
            if (pv[0] == pa) {
                return pv[1];
            }
        }
    }
};

const channel_list_content = (callback, json, names, i = 0, arr = [])=> {
    if (json.length > i) {
        let activityId = json[i].id;
        let mainChannel = json[i].mainChannel;
        channel_info(activityId, (channelInfo, mainChannel)=> {
            if (channelInfo) {
                let typeList = channelInfo.typeList;
                for (let z in typeList) {
                    let t = typeList[z];
                    if (!names || names.indexOf(typeList[z].entityType) >= 0) {
                        let href = t.href;
                        t.template = getUrlPat(href, "template");
                        t.name = channelInfo.name;
                        t.parentName = channelInfo.parentName;
                        t.activityId = channelInfo.id;
                        t.mainChannel = mainChannel;
                        arr.push(t);
                    }
                }
            }
            let con=setInterval(()=> {
                clearInterval(con);
                channel_list_content(callback, json, names, i + 1, arr);
            }, 100)
        }, mainChannel)
    } else {
        callback(arr);
    }
};

const getAllEntryId = (callback, names)=> {//拿取渠道
    channel_list((json)=> {
        channel_list_content((arr)=> {
            callback(arr);
        }, json, names);
    });
};

const darenData = (callback)=> {
    talentNick((user)=> {
        talentIndex((index)=> {
            if (index) {
                user = $.extend(user, index);
            }
            callback(user);
            /*getAllEntryId((qds)=> {
                user.qds = qds;
                user.version = 3;
                callback(user);
            })*/
        });
    })
};


export {darenData,talentNick,darenDataId_change,talentIndex};
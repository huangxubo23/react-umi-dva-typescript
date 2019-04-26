import {currencyNoty} from "./Noty";

/**
 * Created by muqingzhong on .工具类
 */
var jQuery = require('jquery');
import React from 'react';
import {ajax} from './ajax';
import 'noty/lib/noty.css';
import 'noty/lib/themes/bootstrap-v4.css';
import {ThousandsOfCall} from "../../../components/lib/util/ThousandsOfCall";
import noty from 'noty';


var $ = jQuery;

/**
 * 返回url中带的参数
 */
function getUrlPat(url, pa) {
    if (url) {
        var reg = new RegExp("(\\?|&)" + pa + "=([^&]*)(&|$)");
        var r = url.match(reg);
        if (r != null) url = r[2]
        url = unescape(url);
        return url;
    } else {
        return null;
    }

}


function httpcl(url) {
    url = url.replace('https:', '');
    url = url.replace('http:', '');
    return url;
}


/**
 * 日期格式化方法
 * @param format
 * @returns {*}
 */
Date.prototype.format = function (format) {
    var o = {
        'M+': this.getMonth() + 1, //month
        'd+': this.getDate(), //day
        'h+': this.getHours(), //hour
        'm+': this.getMinutes(), //minute
        's+': this.getSeconds(), //second
        'q+': Math.floor((this.getMonth() + 3) / 3), //quarter
        'S': this.getMilliseconds() //millisecond
    };

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
        }
    }
    return format;
};

/**
 * 深度拷贝对象
 * @param obj
 * @returns {Clone}
 */
function clone(obj) {

    var str, newobj = obj.constructor === Array ? [] : {};
    if (typeof obj !== 'object') {
        return obj;
    } else if (window.JSON) {
        str = JSON.stringify(obj); //系列化对象
            newobj = JSON.parse(str); //还原
    } else {
        for (var i in obj) {
            newobj[i] = typeof obj[i] === 'object' ?
                clone(obj[i]) : obj[i];
        }
    }
    return newobj;
}
function deepCopy(x) {//递归深度拷贝
    // =============
    const uniqueList = []; // 用来去重
    // =============

    let root = {};

    // 循环数组
    const loopList = [
        {
            parent: root,
            key: undefined,
            data: x,
        }
    ];

    while(loopList.length) {
        // 深度优先
        const node = loopList.pop();
        const parent = node.parent;
        const key = node.key;
        const data = node.data;

        // 初始化赋值目标，key为undefined则拷贝到父元素，否则拷贝到子元素
        let res = parent;
        if (typeof key !== 'undefined') {
            res = parent[key] = {};
        }

        // =============
        // 数据已经存在
        let uniqueData = find(uniqueList, data);
        if (uniqueData) {
            parent[key] = uniqueData.target;
            continue; // 中断本次循环
        }

        // 数据不存在
        // 保存源数据，在拷贝数据中对应的引用
        uniqueList.push({
            source: data,
            target: res,
        });
        // =============

        for(let k in data) {
            if (data.hasOwnProperty(k)) {
                if (typeof data[k] === 'object') {
                    // 下一次循环
                    loopList.push({
                        parent: res,
                        key: k,
                        data: data[k],
                    });
                } else {
                    res[k] = data[k];
                }
            }
        }
    }

    return root;
    console.log('obj',x);
    console.log('newObj',root);
    return root;
}
function find(arr, item) {
    for(let i = 0; i < arr.length; i++) {
        if (arr[i].source === item) {
            return arr[i];
        }
    }

    return null;
}

function similarity(original, constTSource) {
    if (constTSource) {
        var c = constTSource.length;
        var similarity = 0;
        for (var i = 0; i < constTSource.length; i++) {
            var s = constTSource.substring(i, i + 1);
            if (original.indexOf(s) >= 0) {
                similarity++;
            }
        }
        return similarity * 100 / c;
    } else {
        return 0;
    }
}

// 交换数组元素
var swapItems = function (arr, index1, index2) {
    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
    return arr;
};

// 上移
var upRecord = function (arr, $index) {
    if ($index == 0) {
        return;
    }
    swapItems(arr, $index, $index - 1);
};

// 下移
var downRecord = function (arr, $index) {
    if ($index == arr.length - 1) {
        return;
    }
    swapItems(arr, $index, $index + 1);
};

String.prototype.endWith = function (endStr) {  //增加字符串判断是不是以xx结尾
    var d = this.length - endStr.length;
    return (d >= 0 && this.lastIndexOf(endStr) == d)
};


function localImgSize(imgUrl, callback) { //获取图片大小

    let pic = new Image();
    pic.src = imgUrl;

    let s = setInterval(function () {
        if (pic.complete) {
            clearInterval(s);
            callback(pic.width, pic.height);
        }
    }, 200);

}

function isLogin(callback) {
    $.ajax({
        type: 'get',//使用get方法访问后台
        dataType: 'jsonp',//返回json格式的数据
        url: '/user/isLogin.io',//要访问的后台地址
        data: {},//要发送的数据
        success: function (msg) {
            callback(msg.data);
        }
    });
}


/**
 * 随机字符串
 * @param len
 * @returns {string}
 */
function randomString(len) {
    len = len || 32;
    var $chars = 'abcdefhijkmnprstwxyz2345678oOl9gqvu1ABCDEFGHIJKLMNOPQRETUVWSXYZ';
    /****默认去掉了容易混淆的字符****/
    var maxPos = $chars.length;
    var pwd = '';
    for (var i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

const feedType = [
    {name: "全部", type: 0},
    {name: "清单", type: 503},
    {name: "帖子", type: 500},
    {name: "单品", type: 502},
    {name: "搭配", type: 504},
    {name: "视频", type: 506}
];

function getTypeName(type) {
    for (var i = 0; i < feedType.length; i++) {
        if (feedType[i].type == type) {
            return feedType[i].name;
        }
    }
}


function imgToBase64(file, callback) {

    //判断是否是图片类型
    if (!/image\/\w+/.test(file.type)) {
        alert("只能选择图片");
        return false;
    }
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
        callback(this.result)
    }
}

function infoNoty(text, type, modal, timeout) {//信息提示 //第一个参数为内容，第二个参数为类型,第三个为遮罩,第四个参数为提示位置，第四个参数为持续展示时间
    new noty({
        text: text ? text : '暂无内容',
        type: type ? type : 'error',
        layout: 'topCenter',
        modal: modal ? modal : false,
        timeout: timeout ? timeout : 3000,
        theme: 'bootstrap-v4',
        animation: {
            open: 'noty_effects_open',
            close: 'noty_effects_close'
        }
    }).show();
}

function notyOK(data, callback) {
    let n = new noty({
        text: '<h4>' + data.text + '</h4>',
        theme: 'bootstrap-v4',
        modal: true,
        layout: 'center',
        type: 'warning',
        buttons: [
            noty.button(data.text2, 'btn btn-success', () => {
                if (callback && typeof callback == 'function') {
                    callback();
                    n.close();
                }
            }, {id: 'button1', 'data-status': 'ok'}),
            noty.button('取消', 'btn btn-error', () => {
                n.close();
            })
        ]
    }).show();
}

function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}


function colleagues(callback) {//拿取所有同事
    ajax.ajax({
        type: 'post',
        url: '/user/admin/user/user.colleagues.list.io',
        data: {},
        isCloseMask: true,
        callback: (json) => {
            callback(json);
        }
    });
}

function manageInfo(id, callback) {//拿取当个员工
    ajax.ajax({
        type: 'post',
        url: '/user/admin/user/user.manage.info.io',
        data: {id: id},
        isCloseMask: true,
        callback: (json) => {
            callback(json);
        }
    });
}

function getManage(callback) {//拿取当前登录人
    ajax.ajax({
        type: 'post',
        url: "/user/isLogin.io",
        data: {},
        callback: (json) => {
            callback(json);
        }
    });
}

const timePosition = (startTime, endTime) => {//时间判断
    let date = new Date;
    let cyrrebtDate = date.getTime();
    if (cyrrebtDate < startTime && cyrrebtDate < endTime) {
        return "未开始";
    } else if (cyrrebtDate > endTime && cyrrebtDate > startTime) {
        return "已结束";
    } else {
        return "进行中";
    }
};

const judgment = {//勾选问题
    Base: (data, t) => {
        if (typeof data == "array") {
            let index = $.inArray(data, t);
            if (index >= 0) {
                data.splice(index, 1)
            } else {
                data.push(t);
            }
        } else if (typeof data == "string") {
            if (data.indexOf(t) < 0) {
                data += t + ",";
            } else {
                data = data.replace(t + ",", "");
            }
        }
        return data;
    }
};

const urlAnalysis = (url, callback) => {//链接解析为淘宝提交数据
    if (!url.trim()) {
        infoNoty('地址不能为空');
        return false;
    }
    let data = {};
    let Arr = url.split("?");
    let agreement = Arr[0].split('//')[0] || 'https';
    let host = Arr[0].split('//')[1];
    let hostname = host.split('/')[0];
    let path = host.slice(host.indexOf('/'));
    let arr = Arr[1].split("&");
    for (let i in arr) {
        data[((arr[i].split("="))[0])] = (arr[i].split("="))[1];
    }
    if (callback) {
        callback({agreement: agreement, hostname: hostname, path: path, data: data});
    } else {
        return {agreement: agreement, hostname: hostname, path: path, data: data};
    }
};

let acoustic = (data, type, callback) => {//千里传音过滤一层
    ThousandsOfCall.acoustic(data, type, (data) => {
        if (data.success) {
            if (data.fileName) {
                callback(data.data, data.fileName);
            } else {
                callback(data.data);
            }
        } else {
            currencyNoty('获取失败', 'warning')
        }
    })
};


export {
    getUrlPat,
    localImgSize,
    isLogin,
    getTypeName,
    clone,
    imgToBase64,
    generateUUID,
    colleagues,
    manageInfo,
    infoNoty,
    getManage,
    timePosition,
    notyOK,
    judgment,
    urlAnalysis,
    acoustic,deepCopy

};

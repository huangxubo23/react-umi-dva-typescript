/**
 * Created by 石英 on 2018/10/15 0015下午 4:41.
 */

import {ajax} from '../../../../../../../lib/util/ajax';
import {ThousandsOfCall} from "../../../../../../../lib/util/ThousandsOfCall";
import {darenDataId_change} from './darenData';
import {acoustic} from '../../../../../../../lib/util/global';
import {Message,MessageBox} from 'element-react';
import 'element-theme-default';

const Ajax = ajax.ajax;
let darenId = {};

const darenId_change = (obj, callback) => {
    darenId = obj;
    darenDataId_change(obj, callback);//darenData.js=>添加授权达人id
};

const parameter = (obj, darenId, callback, type = '') => {
    if (darenId.talentId) {
        type = 'requestRelyAgentTB';
        obj.talentId = darenId.talentId;
    } else {
        type = 'requestRelyTB';
    }
    ThousandsOfCall.acoustic(obj, type, callback);
};

const releaseSuccess = (contentId, feedId, channel, user, callback, state = 0, message = '') => {
    let st = state === 8 ? {state: state, message: message} : {};
    Ajax({
        url: "/content/admin/content/domain.content.releaseSuccess.io",
        type: "post",
        data: {
            id: contentId,
            feedId: feedId,
            channel: JSON.stringify(channel),
            user: JSON.stringify(user),
            userId: parseInt(user.accountId),
            ...st
        },
        isCloseMask: true,
        callback: () => {
            callback(true);
        }, error: () => {
            callback(false);
        }
    })
};

const releaseFail = (contentId, message, callback) => {
    Ajax({
        url: "/content/admin/content/domain.content.audit.io",
        data: {
            state: 2,
            id: contentId,
            message: "尝试发布到达人后台，存在错误=" + message
        },
        isCloseMask: true,
        callback: () => {
            if (callback) {
                callback(true);
            }
        }, error: () => {
            callback(false);
        }
    })
};

const daren_list = (callback) => {//获取授权达人
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

const getIdContent = ({ids, contentType}, callback) => {//通过id拿取内容
    Ajax({
        url: '/content/admin/content/domain.content.releaseData.io',
        data: {ids: JSON.stringify(ids), v: 2},
        type: "get",
        dataType: 'json',
        jsonp: 'callback',
        callback: (json) => {
            callback(json);
        }
    });
};

const getWtList = (callback) => {
    parameter({
        agreement: "https",
        hostname: "we.taobao.com",
        path: "/portal/listing.json",
        data: {'__version__': "3.0"},
        method: "get",
        referer: "https://we.taobao.com/creation/new"
    }, darenId, (msg) => {
        if (msg.success) {
            let data = JSON.parse(msg.data);
            callback(data.data.tabList);
        } else {
            Message({
                showClose: true,
                message: '获取失败',
                type: 'warning'
            });
        }
    })
};

const getNewWtList = (callback) => {
    parameter({
        agreement: "https",
        hostname: "we.taobao.com",
        path: "/portal/new/listing.json",
        data: {'__version__': "3.0"},
        method: "get",
        referer: "https://we.taobao.com/creation/new"
    }, darenId, (msg) => {
        if (msg.success) {
            let data = JSON.parse(msg.data);
            callback(data.data.tabList);
        } else {
            Message({
                showClose: true,
                message: '获取失败',
                type: 'warning'
            });
        }
    })
};

const getQdList = (callback, pageSize = 20, current = 1, res = []) => {
    parameter(
        {
            agreement: "https",
            hostname: "contents.taobao.com",
            path: "/api2/channel/channel_list.json",
            data: {
                pageSize: pageSize,
                current: current,
                __version__: "3.0"
            },
            method: "get",
            referer: "https://we.taobao.com/"
        }, darenId, (msg) => {
            if (msg.success) {
                let json = JSON.parse(msg.data);
                if (json.data) {
                    res = res.concat(json.data.itemList);
                    let total = json.data.total;
                    if (pageSize * current < total) {
                        getQdList(callback, pageSize, current + 1, res);
                    } else {
                        callback(res);
                    }
                }
            } else {
                Message({
                    showClose: true,
                    message: '获取失败',
                    type: 'warning'
                });
            }
        }
    );
};

const getLXList = (id, callback) => {
    parameter(
        {
            agreement: "https",
            hostname: "contents.taobao.com",
            path: "/api2/channel/channel_info.json",
            data: {
                id: id,
                __version__: "3.0"
            },
            method: "get",
            referer: "https://we.taobao.com/"
        }, darenId, (msg) => {
            if (msg.success) {
                let json = JSON.parse(msg.data);
                if (json.data) {
                    callback(json.data);
                } else {
                    let arr = [];
                    callback(arr);
                }
            } else {
                Message({
                    showClose: true,
                    message: '获取失败',
                    type: 'warning'
                });
            }
        }
    );
};
const getHDList = (id, callback) => {
    parameter(
        {
            agreement: "https",
            hostname: "contents.taobao.com",
            path: "/api2/activity/activity_info.json",
            data: {
                id: id,
                __version__: "3.0"
            },
            method: "get",
            referer: "https://we.taobao.com/"
        }, darenId, (msg) => {
            if (msg.success) {
                let json = JSON.parse(msg.data);
                if (json.data) {
                    callback(json.data);
                } else {
                    let arr = [];
                    callback(arr);
                }
            } else {
                Message({
                    showClose: true,
                    message: '获取失败',
                    type: 'warning'
                });
            }
        }
    );
};

const addItem = (itemUrl, activityId, callback) => {
    parameter(
        {
            agreement: "https",
            hostname: "resource.taobao.com",
            path: "/item/add",
            data: {
                url: itemUrl,
                activityId: activityId,
                categoryId: 0
            },
            method: "POST",
            referer: "https://we.taobao.com/"
        }, darenId, (msg) => {
            if (msg.success) {
                let json = JSON.parse(msg.data);
                if (json.data) {
                    callback(json.data);
                } else {
                    callback(json.data, '发布出错，有宝贝已经下架或者不存在');
                }
            } else {
                Message({
                    showClose: true,
                    message: '获取失败',
                    type: 'warning'
                });
            }
        }
    );
};

const http_delete = (url) => {
    return url.replace(/http:|https:/g, "");
};

const def = ({value, type}, z = undefined) => {
    if (type === "string") {
        z = value ? value : "";
    } else if (type === "array") {
        z = value ? value : [];
    } else if (type === "object") {
        z = value ? value : {};
    }
    return z;
};

const randomString = (len) => {
    let num = len || 32;
    let $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let maxPos = $chars.length;
    let pwd = '';
    for (let i = 0; i < num; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
};

const titleCase = (str) => {//第一个字母大写

    let array = str.toLowerCase().split(" ");
    for (let i = 0; i < array.length; i++) {
        array[i] = array[i][0].toUpperCase() + array[i].substring(1, array[i].length);
    }
    return array.join(" ");
};

const savedapei = (dataIt, callback) => {
    let s = {
        api: "mtop.taobao.luban.dapei.savedapei",
        type: "originaljson",
        dataType: "jsonp",
        v: "2.0",
        appKey: 12574478,
        t: new Date().getTime(),
        jsv: "2.4.3",
        ecode: 1,
        timeout: 3000
    };
    let dataT = {
        parameters: s,
        requesData: dataIt,
        host: "https://h5api.m.taobao.com/h5",
        ajaxData: {requeryType: "post", referer: "https://h5.m.taobao.com"}
    };
    if (darenId.talentId) {
        Object.assign(dataT, {talentId: darenId.talentId})
    }
    ThousandsOfCall.acoustic(dataT, "requestH5", (data) => {
        if (data.success) {
            let d = {"dapeiId": data.data.result};
            let s1 = setTimeout(() => {
                clearTimeout(s1);
                querydapei(d, (item) => {
                    if (item) {
                        callback(item);
                    } else {
                        let s2 = setTimeout(() => {
                            clearTimeout(s2);
                            querydapei(d, (item) => {
                                callback(item);
                            });
                        }, 2000);
                    }
                });
            }, 2000);
        }
    });
};

const querydapei = (d, callback) => {
    let s = {
        jsv: "2.4.3",
        appKey: 12574478,
        t: new Date().getTime(),
        api: "mtop.taobao.luban.dapei.querydapei",
        v: "1.0",
        ecode: 1,
        type: "originaljson",
        dataType: "jsonp",
        timeout: 3000
    };
    let dataT = {
        parameters: s,
        requesData: d,
        host: "https://acs.m.taobao.com/h5",
        ajaxData: {requeryType: "post", referer: "https://h5.m.taobao.com"}
    };
    if (darenId.talentId) {
        Object.assign(dataT, {talentId: darenId.talentId})
    }
    ThousandsOfCall.acoustic(dataT, "requestH5", (ds) => {
        let d = ds.data;
        try {
            if (d) {
                let item = {}, anchors = [], features = {};
                let rawData = JSON.parse(d.rawData);
                let layers = rawData.layers;
                for (let i in layers) {
                    if (layers[i].type == 8) {
                        let obj = {
                            data: {
                                finalPricePc: 0,
                                finalPriceWap: 0,
                                itemId: layers[i].itemId,
                                materialId: "P-74-Item-" + layers[i].itemId,
                                price: 0,
                                url: "https://item.taobao.com/item.htm?id=" + layers[i].itemId,
                                title: "",
                            },
                            type: "item",
                            x: Math.round(((((layers[i].anchorX / 100) * layers[i].width) + layers[i].x) / 1200) * 100),
                            y: Math.round(((((layers[i].anchorY / 100) * layers[i].height) + layers[i].y) / 1200) * 100),
                        };
                        anchors.push(obj);
                    }
                }
                item.anchors = anchors;
                features.dapeiParams = {
                    area: d.area,
                    bannerSize: "1200_1200",
                };
                features.dapeiId = d.id;
                features.images = [];
                item.features = JSON.stringify(features);
                item.hotSpaces = [];
                item.url = d.url;
                callback(item);
            } else {
                callback();
            }
        } catch (e) {
            callback();
        }
    });
};

const pushItem = (data, callback) => {
    let {submission, retainItem} = data;
    let s = {
        api: "mtop.taobao.luban.dapei.savedapei",
        type: "originaljson",
        dataType: "jsonp",
        v: "5.0",
        appKey: 12574478,
        t: new Date().getTime(),
        jsv: "2.4.3",
        ecode: 1,
        timeout: 15000
    };
    let dataT = {
        parameters: s,
        requesData: submission,
        host: "https://h5api.m.taobao.com/h5",
        ajaxData: {requeryType: "post", referer: "https://h5.m.taobao.com"},
    };
    if (darenId.talentId) {
        Object.assign(dataT, {talentId: darenId.talentId})
    }
    ThousandsOfCall.acoustic(dataT, "requestH5", (msg) => {
        let data = msg.data;
        if (data) {
            getItem({data, retainItem}, callback);
        }
    });
};

const getDarenId = (contentId, callback) => {
    let s = {
        api: "mtop.taobao.beehive.detail.contentservicenewv2",
        type: "jsonp",
        dataType: "jsonp",
        v: "1.0",
        appKey: 12574478,
        t: new Date().getTime(),
        jsv: "2.4.11",
        AntiCreep: true,
        AntiFlood: true,
        callback: 'mtopjsonp1',
    };
    let submission = {
        "contentId": contentId,
        "source": "daren",
        "type": "h5",
        "params": "",
        "businessSpm": "",
        "business_spm": "",
        "track_params": ""
    };
    let dataT = {
        parameters: s,
        requesData: submission,
        host: "https://h5api.m.taobao.com/h5",
        ajaxData: {requeryType: "get", referer: "https://h5.m.taobao.com"},
    };
    ThousandsOfCall.acoustic(dataT, "requestH5", (msg) => {
        let data = msg.data;
        try {
            if (data.models.account) {
                callback({id: data.models.account.id, name: data.models.account.name});
            }
        } catch (e) {
            Message({
                showClose: true,
                message: '获取失败',
                type: 'warning'
            });
        }
    });
};

const getItem = ({data, retainItem}, callback, num = 0) => {
    let s = {
        jsv: "2.4.3",
        appKey: 12574478,
        t: new Date().getTime(),
        api: "mtop.taobao.luban.dapei.querydapei",
        v: "2.0",
        ecode: 1,
        type: "originaljson",
        dataType: "jsonp",
        timeout: 3000
    };
    let dataT = {
        parameters: s,
        requesData: {dapeiId: data.result},
        host: "https://h5api.m.taobao.com/h5",
        ajaxData: {requeryType: "post", referer: "https://we.taobao.com/mirror/mirror.html"},
    };
    if (darenId.talentId) {
        Object.assign(dataT, {talentId: darenId.talentId})
    }
    ThousandsOfCall.acoustic(dataT, "requestH5", (msg) => {
        if (msg.success) {
            let {rawData, area, size, url} = msg.data;
            let pushItem = {}, anchors = [];
            let {layers} = JSON.parse(rawData);
            for (let i in layers) {
                if (layers[i].type == 8) {
                    let obj = {
                        data: {
                            finalPricePc: 0,
                            finalPriceWap: 0,
                            itemId: layers[i].itemId,
                            materialId: matching({rawData: retainItem, itemId: layers[i].itemId}),
                            price: 0,
                            coverUrl: layers[i].picUrl,
                        },
                        type: "item",
                        x: Math.round(((((layers[i].anchorX / 100) * layers[i].width) + layers[i].x) / 1200) * 100),
                        y: Math.round(((((layers[i].anchorY / 100) * layers[i].height) + layers[i].y) / 1200) * 100),
                    };
                    anchors.push(obj);
                }
            }
            let object = {
                images: [],
                dapeiParams: {area, bannerSize: size},
                dapeiId: data.result
            };
            Object.assign(pushItem, {
                features: JSON.stringify(object), url, hotSpaces: [], anchors
            });
            callback(pushItem);
        } else {
            if (num < 10) {
                setTimeout(() => {
                    getItem({data, retainItem}, callback, ++num);
                }, 500)
            } else {
                Message({
                    showClose: true,
                    message: '多次获取失败',
                    type: 'warning'
                });
            }
        }
    });
};

const matching = ({rawData, itemId}) => {
    let materialId = '';
    rawData.layers.forEach(item => {
        if (item.itemId === itemId) {
            materialId = item.temporaryItem.materialId;
        }
    });
    return materialId;
};

const getQuality = (url, callback, index = 0) => {
    setTimeout(()=>{
        let data = newTemplate.urlAnalysis(url);
        let obj = {
            agreement: "https",
            hostname: "cpub.taobao.com",
            path: `/quality.json`,
            data: data,
            method: "get",
            referer: 'https://we.taobao.com/'
        };
        parameter(
            obj, darenId, (msg) => {
                if (msg.success) {
                    try {
                        let json = JSON.parse(msg.data);
                        if (json.troubleCount && json.troubleCount > 0) {
                            callback(json.troubleDetails);
                        } else {
                            callback([]);
                        }
                    } catch (e) {
                        if (index < 3) {
                            let newT = setInterval(() => {
                                clearInterval(newT);
                                getQuality(url, callback, index + 1);
                            }, 600);
                        } else {
                            callback([{title: '内容校验失败，无法诊断'}]);
                        }
                    }
                } else {
                    Message({
                        showClose: true,
                        message: '获取失败',
                        type: 'warning'
                    });
                }
            }
        );
    },500)
};

class TemplateConversion {
    getNewWeiTao = (channelPa, callback, failCallback, i = 0, failTime = 0) => {//获取达人平台数据模板
        let isyx = true;
        parameter({
                agreement: "https",
                hostname: "cpub.taobao.com",
                path: "/render.json",
                data: channelPa,
                method: "get",
                referer: 'https://we.taobao.com/',
                notRedirect: true
            }, darenId, (msg) => {
                if (isyx) {
                    isyx = false;
                    if (msg.success) {
                        if (!msg.code || msg.code == 200) {
                            try {
                                let json = JSON.parse(msg.data);
                                if (json.config) {
                                    callback(json.config);
                                }
                            } catch (e) {
                                if (i < 3) {
                                    let newT = setInterval(() => {
                                        clearInterval(newT);
                                        newTemplate.getNewWeiTao(channelPa, callback, failCallback, i + 1, failTime);
                                    }, 600);
                                } else {
                                    if (window.confirm('达人平台获取模板接口调用失败,点击确定重试？')) {
                                        newTemplate.getNewWeiTao(channelPa, callback, failCallback, i + 1, failTime);
                                    }
                                }
                            }
                        } else if (msg.code == 302) {
                            ThousandsOfCall.acoustic({
                                id: darenId.talentId,
                                url: msg.redirectLocation
                            }, "switchAccount", () => {
                                failTime++;
                                if (failTime > 2) {
                                    failCallback(false, (judge) => {
                                        if (judge) {
                                            ThousandsOfCall.acoustic({}, 'loginAndAuthorization', ({success}) => {
                                                if (success) {
                                                    this.getNewWeiTao(channelPa, callback, failCallback, i, failTime)
                                                }
                                            });
                                        } else {
                                            this.getNewWeiTao(channelPa, callback, failCallback, i, failTime)
                                        }
                                    });
                                } else {
                                    failCallback(true, () => {
                                        this.getNewWeiTao(channelPa, callback, failCallback, i, failTime)
                                    });
                                }
                            });
                        } else {
                            Message({
                                showClose: true,
                                message: '淘宝操作频繁，请稍后再试，或联系最高管理员重新授权',
                                type: 'warning'
                            });
                        }
                    } else {
                        Message({
                            showClose: true,
                            message: '获取失败',
                            type: 'warning'
                        });
                    }
                }
            }
        );

        setTimeout(() => {
            if (isyx) {
                isyx = false;
                MessageBox.confirm(`请求超时，重新获取`, '提示', {
                    type: 'info'
                }).then(() => {
                    newTemplate.getNewWeiTao(channelPa, callback, failCallback, i = 0, failTime = 0);
                }).catch(() => {
                    Message({
                        showClose: true,
                        message: `已取消发布`,
                        type: 'info'
                    });
                });
            }
        }, 10000);
    };

    testingQuality = ({url, config, callback, time = 0}) => {//内容诊断
        let obj = {
            agreement: "https",
            hostname: "cpub.taobao.com",
            path: `/submit.json?${url.split('?')[1]}`,
            data: {
                config: JSON.stringify(config)
            },
            method: "post",
            referer: 'https://we.taobao.com/'
        };
        parameter(
            obj, darenId, (msg) => {
                if (msg.success) {
                    try {
                        let json = JSON.parse(msg.data);
                        getQuality(json.config.formData.qualityCheckUrl, (array) => {
                            callback(array, json.config);
                        });

                    } catch (e) {
                        if (i < 3) {
                            let newT = setInterval(() => {
                                clearInterval(newT);
                                newTemplate.testingQuality({url, config, callback, time: time + 1});
                            }, 600);
                        } else {
                            if (window.confirm('达人平台诊断接口调用失败,点击确定重试？')) {
                                newTemplate.testingQuality({url, config, callback, time: time + 1});
                            }
                        }
                    }
                } else {
                    Message({
                        showClose: true,
                        message: '获取失败',
                        type: 'warning'
                    });
                }
            }
        );
    };

    pushTB = (data, callback, i = 0) => {//提交数据
        let cs = newTemplate.urlAnalysis(data.url);
        cs.config = data.data.config;

        let obj = {
            agreement: "https",
            hostname: "cpub.taobao.com",
            path: "/" + (data.async ? "async" : "submit") + ".json?" + data.url.split("?")[1],
            data: {
                config: data.data.config
            },
            method: "post",
            referer: 'https://we.taobao.com/'
        };
        parameter(
            obj, darenId, (msg) => {
                if (msg.success) {
                    try {
                        let json = JSON.parse(msg.data);
                        callback(json);
                    } catch (e) {
                        if (i < 3) {
                            let newT = setInterval(() => {
                                clearInterval(newT);
                                newTemplate.pushTB(data, callback, i + 1);
                            }, 600);
                        } else {
                            if (window.confirm('达人平台提交接口调用失败,点击确定重试？')) {
                                newTemplate.pushTB(data, callback, i + 1);
                            }
                        }
                    }
                } else {
                    Message({
                        showClose: true,
                        message: '获取失败',
                        type: 'warning'
                    });
                }
            }
        );
    };

    daren = (callback) => {//获取授权达人
        ajax.ajax({
            type: 'post',
            url: '/user/admin/visible/domain.talentMessage.get.accredit.io',
            data: {
                pageNow: 1,
                pageSize: 50,
            },
            callback: (json) => {
                callback(json.talentMessageList);
            }
        });
    };

    dataStructure = (children, showContent, callback, Pcallback, pushPage) => {//内容=>props=>value赋值
        Pcallback("开始合成内容，请稍等...");
        let mk = 0;
        let contentData = showContent.contentData, isRelease = true, totalMessage = '';
        let updateName = undefined;

        for (let c in children) {

            if (children[c].updateOnChange) {
                updateName = children[c].name;
            }

            if (children[c].component == "Input") {//文本输入
                if (showContent.contentData[children[c].name]) {
                    children[c].props.value = def({
                        value: showContent.contentData[children[c].name].value,
                        type: "string"
                    });
                }
                mk++;
            } else if (children[c].component == "Forward") {//引导话题
                if (showContent.contentData[children[c].name]) {
                    children[c].props.value = def({
                        value: showContent.contentData[children[c].name].value,
                        type: "string"
                    });
                }
                mk++;
            } else if (children[c].component == "OriginalStatement") {//原创声明
                let {newOriginalStatement} = showContent.contentData;
                if (newOriginalStatement) {
                    Object.assign(children[c].props.value, {
                        declared: newOriginalStatement === 1
                    });
                }
                mk++;
            } else if (children[c].component == "AddLink") {//添加链接
                if (showContent.contentData[children[c].name]) {
                    children[c].props.value = def({
                        value: showContent.contentData[children[c].name].value,
                        type: "array"
                    });
                }
                mk++;
            } else if (children[c].component == "AddTag") {//添加短亮点
                if (showContent.contentData[children[c].name]) {
                    children[c].props.value = def({
                        value: showContent.contentData[children[c].name].value,
                        type: "array"
                    });
                }
                mk++;
            } else if (children[c].component == "Editor") {//帖子编辑器
                Pcallback("开始解析帖子编辑器");
                let oldValue = showContent.contentData[children[c].name].value;
                let [oldBlocks, oldEntityMap, obj] = [oldValue.blocks, oldValue.entityMap, {
                    blocks: [],
                    entityMap: {}
                }];
                let activityId = 0;
                let ps = children[c].props.plugins;
                for (let i in ps) {
                    if (ps[i].name == "SIDEBARSEARCHITEM") {
                        activityId = ps[i].props.activityId;
                    }
                }
                let bl = 0;
                let [pt, py] = [0, 0];
                for (let o in oldBlocks) {
                    if (oldBlocks[o].type == "unstyled") {
                        obj.blocks.push({
                            depth: 0,
                            entityRanges: [],
                            inlineStyleRanges: oldBlocks[o].inlineStyleRanges,
                            text: oldBlocks[o].text,
                            type: "unstyled"
                        });
                        bl++;
                    } else if (oldBlocks[o].type == "alignCenter") {
                        obj.blocks.push({
                            depth: 0,
                            entityRanges: [],
                            inlineStyleRanges: oldBlocks[o].inlineStyleRanges,
                            text: oldBlocks[o].text,
                            type: "alignCenter"
                        });
                        bl++;
                    } else if (oldBlocks[o].type == "alignLeft") {
                        obj.blocks.push({
                            depth: 0,
                            entityRanges: [],
                            inlineStyleRanges: oldBlocks[o].inlineStyleRanges,
                            text: oldBlocks[o].text,
                            type: "alignLeft"
                        });
                        bl++;
                    } else if (oldBlocks[o].type == "alignRight") {
                        obj.blocks.push({
                            depth: 0,
                            entityRanges: [],
                            inlineStyleRanges: oldBlocks[o].inlineStyleRanges,
                            text: oldBlocks[o].text,
                            type: "alignRight"
                        });
                        bl++;
                    } else if (oldBlocks[o].type == "atomic") {
                        let key = randomString(20);
                        let k = oldBlocks[o].entityRanges[0].key;
                        obj.blocks.push({
                            depth: 0,
                            entityRanges: [
                                {
                                    key: key,
                                    length: 1,
                                    offset: 0,
                                }
                            ],
                            inlineStyleRanges: [],
                            text: " ",
                            type: "atomic"
                        });
                        if (oldEntityMap[k].type == "SIDEBARSEARCHITEM") {
                            if (oldEntityMap[k].data.materialId) {
                                obj.entityMap[key] = {
                                    data: {
                                        coverUrl: http_delete(oldEntityMap[k].data.coverUrl),
                                        description: oldEntityMap[k].data.description,
                                        itemId: oldEntityMap[k].data.itemId,
                                        materialId: oldEntityMap[k].data.materialId,
                                        name: key,
                                        price: parseInt(oldEntityMap[k].data.price),
                                        resourceUrl: oldEntityMap[k].data.resourceUrl,
                                        title: oldEntityMap[k].data.title,
                                        type: "SIDEBARSEARCHITEM",
                                    },
                                    mutability: "IMMUTABLE",
                                    type: "SIDEBARSEARCHITEM"
                                };
                                bl++;
                            } else {
                                pt++;
                                Pcallback("获取第" + pt + "个商品中...");
                                addItem(oldEntityMap[k].data.detailUrl ? oldEntityMap[k].data.detailUrl : ("https://item.taobao.com/item.htm?id=" + oldEntityMap[k].data.itemId), activityId, (data) => {
                                    py++;
                                    Pcallback("获取第" + py + "个商品成功");
                                    obj.entityMap[key] = {
                                        data: {
                                            coverUrl: http_delete(oldEntityMap[k].data.coverUrl),
                                            description: oldEntityMap[k].data.description,
                                            itemId: oldEntityMap[k].data.itemId,
                                            materialId: data ? data.materialId : "",
                                            name: key,
                                            price: data ? (data.item.finalPrice ? parseInt(data.item.finalPrice) : parseInt(data.item.reservedPrice)) : "",
                                            resourceUrl: data ? data.item.itemUrl : "",
                                            title: oldEntityMap[k].data.title,
                                            type: "SIDEBARSEARCHITEM",
                                        },
                                        mutability: "IMMUTABLE",
                                        type: "SIDEBARSEARCHITEM"
                                    };
                                    bl++;
                                });
                            }
                        } else if (oldEntityMap[k].type == "SIDEBARIMAGE") {
                            if (oldEntityMap[k].data.materialId) {
                                obj.entityMap[key] = {
                                    data: {
                                        materialId: oldEntityMap[k].data.materialId,
                                        name: key,
                                        type: "SIDEBARIMAGE",
                                        url: oldEntityMap[k].data.url
                                    },
                                    mutability: "MUTABLE",
                                    type: "SIDEBARIMAGE"
                                };
                            } else {
                                obj.entityMap[key] = {
                                    data: {
                                        name: key,
                                        type: "SIDEBARIMAGE",
                                        url: oldEntityMap[k].data.url
                                    },
                                    mutability: "MUTABLE",
                                    type: "SIDEBARIMAGE"
                                };
                            }
                            bl++;
                        } else if (oldEntityMap[k].type == "SIDEBARADDSPU") {
                            let ids = {
                                itemIds: oldEntityMap[k].data.itemId,
                            };
                            obj.entityMap[key] = {
                                data: {
                                    coverUrl: oldEntityMap[k].data.coverUrl,
                                    features: JSON.stringify(ids),
                                    images: [oldEntityMap[k].data.coverUrl],
                                    materialId: oldEntityMap[k].data.materialId,
                                    name: key,
                                    resourceType: "Product",
                                    spuId: oldEntityMap[k].data.spuId,
                                    title: oldEntityMap[k].data.title,
                                    type: "SIDEBARADDSPU"
                                },
                                mutability: "IMMUTABLE",
                                type: "SIDEBARADDSPU"
                            };
                            bl++;
                        } else if (oldEntityMap[k].type == "SIDEBARHOTSPACEIMAGE") {
                            let hot = (hotSpaces) => {
                                let arr = [];
                                for (let h in hotSpaces) {
                                    if (hotSpaces[h].type == 'link') {
                                        arr.push(hotSpaces[h]);
                                    } else if (hotSpaces[h].type == 'item') {
                                        arr.push({
                                            data: {
                                                coverUrl: hotSpaces[h].data.coverUrl,
                                                finalPricePc: 0,
                                                finalPriceWap: 0,
                                                images: [hotSpaces[h].data.coverUrl],
                                                itemId: hotSpaces[h].data.url.split("=")[1],
                                                price: 0,
                                                rawTitle: hotSpaces[h].data.title,
                                                resourceUrl: hotSpaces[h].data.resourceUrl ? hotSpaces[h].data.resourceUrl : hotSpaces[h].data.url,
                                                title: hotSpaces[h].data.title,
                                                url: hotSpaces[h].data.url ? hotSpaces[h].data.url : hotSpaces[h].data.resourceUrl
                                            },
                                            height: hotSpaces[h].height,
                                            type: "item",
                                            width: hotSpaces[h].width,
                                            x: hotSpaces[h].x,
                                            y: hotSpaces[h].y
                                        })
                                    }
                                }
                                return arr;
                            };
                            obj.entityMap[key] = {
                                data: {
                                    hotSpaces: hot(oldEntityMap[k].data.hotSpaces),
                                    name: key,
                                    picHeight: oldEntityMap[k].data.picHeight,
                                    picWidth: oldEntityMap[k].data.picWidth,
                                    showPoint: oldEntityMap[k].data.showPoint,
                                    type: "SIDEBARHOTSPACEIMAGE",
                                    url: oldEntityMap[k].data.url
                                },
                                mutability: "MUTABLE",
                                type: "SIDEBARHOTSPACEIMAGE"
                            };
                            bl++;
                        } else {
                            bl++;

                        }
                    } else {
                        bl++;
                    }
                }
                let ba = setInterval(() => {
                    if (oldBlocks.length <= bl) {
                        children[c].props.value = obj;
                        clearInterval(ba);
                        mk++;
                    }
                }, 500);
            } else if (children[c].component == "RadioGroup") {//单选
                if (showContent.contentData[children[c].name]) {
                    if (children[c].name == "itemSpuOption") {
                        children[c].props.value = showContent.contentData[children[c].name].value ? showContent.contentData[children[c].name].value : "item";
                    } else {
                        if (showContent.contentData[children[c].name].value) {
                            children[c].props.value = showContent.contentData[children[c].name].value;
                        }
                    }
                }
                mk++;
            } else if (children[c].component == "CreatorAddItem") {//商品
                if (showContent.contentData[children[c].name]) {
                    children[c].props.value = [];
                    let activityId = 0, sp = 0, arr = [];
                    let valueArray = showContent.contentData[children[c].name].value ? showContent.contentData[children[c].name].value : [];
                    for (let i = 0, l = valueArray.length; i < l; i++) {
                        let value = valueArray[i];
                        addItem(value.resourceUrl, activityId, (data) => {
                            let obj = {
                                checked: false,
                                coverUrl: value.coverUrl,
                                extraBanners: value.extraBanners,
                                finalPricePc: 0,
                                finalPriceWap: 0,
                                images: value.extraBanners,
                                itemId: value.itemId,
                                materialId: data ? data.materialId : "",
                                price: value.price ? parseInt(value.price) : (data ? (data.item.finalPrice ? parseInt(data.item.finalPrice) : parseInt(data.item.reservedPrice)) : ""),
                                rawTitle: value.title,
                                resourceUrl: value.resourceUrl,
                                title: value.title
                            };
                            arr.push(obj);
                            sp++;
                        });
                    }
                    let isItem = setInterval(() => {
                        if (sp >= valueArray.length) {
                            clearInterval(isItem);
                            children[c].props.value.push(...arr);
                            mk++;
                        }
                    }, 600);
                } else {
                    mk++;
                }
            } else if (children[c].component == "CreatorAddSpu") {//spu
                if (showContent.contentData[children[c].name]) {
                    children[c].props.value = [];
                    let activityId = 0;
                    let ids = {
                        itemIds: oldEntityMap[k].data.itemId,
                    };
                    let value = showContent.contentData[children[c].name].value[0];
                    let obj = {
                        coverUrl: value.coverUrl,
                        features: JSON.stringify(ids),
                        images: [value.coverUrl],
                        materialId: value.materialId,
                        resourceType: "Product",
                        spuId: value.spuId,
                        title: value.title,
                    };
                    children[c].props.value.push(obj);
                    mk++;
                } else {
                    mk++;
                }
            } else if (children[c].component == "CreatorAddImage") {//图片
                if (showContent.contentData[children[c].name] && showContent.contentData[children[c].name].value && showContent.contentData[children[c].name].value.length > 0) {
                    children[c].props.value = [];
                    let value = showContent.contentData[children[c].name].value;
                    for (let v in value) {
                        let obj = {
                            anchors: [],
                            hotSpaces: [],
                            materialId: value[v].materialId,
                            url: value[v].url
                        };
                        children[c].props.value.push(obj);
                    }
                    mk++;
                } else {
                    mk++;
                }
            } else if (children[c].component == "AnchorImageList") {//搭配图片
                if (showContent.contentData[children[c].name]) {
                    if (children[c].props.type == "CreatorAddCollocation") {
                        let value = contentData[children[c].name] && contentData[children[c].name].value ? contentData[children[c].name].value : [];
                        let newValue = [];
                        let clDAP = (value, callback) => {
                            if (value.length > 0) {
                                let [dap, ...val] = value;
                                if (dap.pushItem) {
                                    pushItem(dap, (pushItem) => {
                                        newValue.push(pushItem);
                                        clDAP(val, callback)
                                    });
                                } else {
                                    if (dap.device) {
                                        savedapei(dap.device, (item) => {
                                            if (item) {
                                                newValue.push(item);
                                            }
                                            clDAP(val, callback);
                                        })
                                    } else {
                                        newValue.push(dap);
                                        clDAP(val, callback)
                                    }
                                }

                            } else {
                                callback();
                            }
                        };
                        clDAP(value, () => {
                            Pcallback("搭配图解析成功");
                            children[c].props.value = newValue;
                            mk++;
                        });
                    } else {
                        children[c].props.value = def({
                            value: showContent.contentData[children[c].name].value,
                            type: "array"
                        });
                        mk++;
                    }
                } else {
                    mk++;
                }
            } else if (children[c].component == "CascaderSelect") {//人群
                if (showContent.contentData[children[c].name]) {
                    children[c].props.value = showContent.contentData[children[c].name].value;
                }
                mk++;
            } else if (children[c].component == "DateTime") {//定时
                // if (showContent.contentData[children[c].name]) {
                //     children[c].props.value = showContent.contentData[children[c].name].value;
                // }
                mk++;
            } else if (children[c].component == "creator-none") {//参加“微淘优质内容奖励”
                if (showContent.contentData[children[c].name]) {
                    children[c].props.value = showContent.contentData[children[c].name].value;
                }
                mk++;
            } else if (children[c].component == "TagPicker") {//分类
                if (showContent.contentData[children[c].name]) {
                    children[c].props.value = showContent.contentData[children[c].name].value;
                }
                mk++;
            } else if (children[c].component == 'CreatorPush') {//是否推送主页
                children[c].props.value = pushPage;
                mk++;
            } else if (children[c].component == 'Rating') {//店铺评分
                children[c].props.value = showContent.contentData[children[c].name].value;
                mk++;
            } else if (children[c].component == 'IceAddVideo') {//短视频
                Pcallback('开始解析短视频，用时稍长，请耐心等待...');
                let Video = showContent.contentData[children[c].name];
                let sp = ({str, type, r = 0}) => {
                    let s = str.split('&');
                    for (let t in s) {
                        let p = s[t].split('=');
                        if (p.length == 2 && p[0] == type) {
                            r = p[1];
                        }
                    }
                    return r;
                };
                if (Video && Video.value && Video.value.length > 0 && Video.value[0].ivideoData) {
                    const promise = new Promise((resolve, reject) => {
                        let {videoId, title, playUrl, coverUrl, duration, ivideoData} = Video.value[0];
                        parameter({
                            agreement: "https",
                            hostname: "duomeiti.taobao.com",
                            path: "/interactiveVideo.htm",
                            data: {
                                bizCode: 'DAREN',
                                videoInfo: JSON.stringify({title, coverUrl, videoUrl: playUrl, videoId, duration})
                            },
                            method: "get",
                            referer: "https://we.taobao.com/"
                        }, darenId, (json) => {
                            let videoData = json.data;
                            let str = videoData.split('"exparams","')[1];
                            let str1 = str.split('"')[0];
                            let userId = sp({str: str1, type: 'userid'});
                            let str2 = videoData.split('"J_subID_num" value="')[1];
                            let str3 = str2.split('"')[0];
                            Object.assign(ivideoData, {
                                userId: userId, userName: str3
                            });
                            let time = new Date();
                            let t = time.format("yyyy-MM-dd hh:mm:ss");
                            ivideoData.gmtCreate = t;
                            ivideoData.gmtModified = t;
                            delete ivideoData.totalItem;
                            Object.assign(ivideoData,{timeline:ivideoData.timeline.map((item)=>{
                                    item.offsetLeft=Math.round(item.offsetLeft);
                                    item.width=Math.round(item.width);
                                    return item;
                                })});
                            let s = {
                                type: "originaljson",
                                dataType: "jsonp",
                                api: "mtop.dreamweb.interactive.add",//编辑 mtop.dreamweb.interactive.update
                                v: "2.0",
                                appKey: 12574478,
                                t: new Date().getTime(),
                                jsv: "2.4.10",
                                ecode: 1,
                            };
                            let dataT = {
                                parameters: s,
                                requesData: {data: JSON.stringify(ivideoData)},
                                host: "https://h5api.m.taobao.com/h5",
                                ajaxData: {
                                    requeryType: "post",
                                    referer: "https://duomeiti.taobao.com/interactiveVideo.htm"
                                }
                            };
                            if (darenId.talentId) {
                                Object.assign(dataT, {talentId: darenId.talentId})
                            }
                            setTimeout(()=>{
                                acoustic(dataT, "requestH5", (data) => {
                                    if (data.interactiveVideoId) {
                                        Pcallback('生成互动视频成功');
                                        setTimeout(() => {
                                            resolve(data.interactiveVideoId);
                                        }, 2000);
                                    } else {
                                        Pcallback('生成互动视频失败');
                                        mk++;
                                    }
                                });
                            },3000);
                        });
                    });
                    promise.then((id) => {
                        Video.value[0].interactId = id;
                        delete Video.value[0].ivideoData;
                        children[c].props.value = Video.value;
                        mk++;
                    });
                } else {
                    delete Video.value[0].ivideoData;
                    children[c].props.value = Video.value;
                    mk++;
                }
            } else if (children[c].component == "StructCanvas") {//结构体
                Pcallback("开始解析结构体");
                let structCanvasCon = children[c];
                let moduleInfos = structCanvasCon.props.moduleInfos;
                let sidebarBlockList = structCanvasCon.props.sidebarBlockList;

                this.getModuleInfos(sidebarBlockList, moduleInfos, () => {
                    let module = (value) => {
                        for (let v in value) {
                            if (value[v].data.images && value[v].data.images.length > 0 && value[v].data.images[0].picWdth) {
                                value[v].data.images[0].materialId = "";
                                value[v].data.images[0].picWidth = value[v].data.images[0].picWdth;
                                delete value[v].data.images[0].picWdth;
                            }
                        }
                        return value;
                    };
                    let value = module(contentData[children[c].name].value);
                    let newValue = [];
                    let vl = 0;

                    for (let i = 0; i < value.length; i++) {
                        vl++;
                        clValue(value[i], i, (nv) => {
                            if (nv.success) {
                                newValue[i] = nv.data;
                            } else {
                                newValue[i] = structCanvasCon.props.value[i];
                                Pcallback(nv.message);//提示
                                isRelease = false;
                                totalMessage += nv.message + ';';
                            }
                            vl--;
                        })
                    }

                    let t3 = setInterval(function () {
                        if (vl == 0) {
                            window.clearInterval(t3);
                            structCanvasCon.props.value = newValue;
                            structCanvasCon.cl = true;
                            mk++;
                        }
                    }, 1000);


                    function clValue(value, ind, callback) {
                        let v = value;
                        const materialId = v.materialId;
                        let moduleInfo = moduleInfos[materialId];

                        if (!moduleInfo && (materialId == "UPX-48576-20014762302" || materialId == "UPX-48578-20016185602")) {
                            for (let i in moduleInfos) {
                                if (moduleInfos[i].materialId == "UPX-48576-20014762302" || moduleInfos[i].materialId == "UPX-48578-20016185602") {
                                    moduleInfo = moduleInfos[i];
                                }
                            }
                        }
                        if (moduleInfo != null) {
                            let moduleInfoName = moduleInfo.name;
                            let n = moduleInfoName.split("-");
                            let name = "";
                            for (let ne in n) {
                                name += titleCase(n[ne]);
                            }
                            let retData = {
                                moduleInfo: {dataSchema: moduleInfo.dataSchema},
                                attrs: {},
                                errorMsg: "",
                                guid: name + "-" + ind,
                                materialId: moduleInfo.materialId,
                                name: moduleInfo.name,
                                resourceId: moduleInfo.id,
                                rule: {"dragable": true, "enable": true, "replaceable": true, "deletable": true}
                            };

                            let properties = moduleInfo.dataSchema;
                            newTemplate.propertiesCl(properties, v.data, {moduleConfig: structCanvasCon.props.moduleConfig}, (t) => {

                                if (t.success) {
                                    retData.data = t.data;
                                    callback({data: retData, success: true});
                                } else {
                                    retData.data = t.data;
                                    callback({data: retData, success: false, message: t.message ? t.message : ""});
                                }
                            });
                        } else {
                            callback({success: false, message: "模版不正确,请尽量保证软件和达人后台的主题一致"});
                        }
                    }
                })
            } else {
                mk++;
            }
        }
        let set = setInterval(() => {
            if (children.length <= mk) {
                Pcallback("获取结束");
                clearInterval(set);
                callback({children, updateName, isRelease, totalMessage});
            }
        }, 1000);
    };

    getModuleInfos = (sidebarBlockList, moduleInfo, callback) => {
        let clNum = 0;
        for (let i in sidebarBlockList) {
            if (sidebarBlockList[i].moduleInfo) {
                moduleInfo[sidebarBlockList[i].moduleInfo.materialId] = sidebarBlockList[i].moduleInfo;
                clNum++;
            } else {
                let api = sidebarBlockList[i].props.api;
                newTemplate.getModuleInfo(api, (mis) => {
                    for (let z in  mis) {
                        moduleInfo[mis[z].materialId] = mis[z];
                    }
                    clNum++;
                })
            }
        }

        let t = setInterval(() => {
            if (clNum >= sidebarBlockList.length) {
                window.clearInterval(t);
                callback(moduleInfo);
            }
        }, 500)
    };

    getModuleInfo = (api, callback) => {
        newTemplate.getModuleInfoAjax({
            api: api, current: 1, callback: (modelInfos) => {
                callback(modelInfos);
            }
        })
    };

    urlAnalysis = (url) => {//达人平台拿取数据参数
        let item = {};
        let arr = (url.split("?")[1]).split("&");
        for (let i in arr) {
            if (((arr[i].split("="))[0]) != "redirectURL") {
                item[((arr[i].split("="))[0])] = (arr[i].split("="))[1];
            }
        }
        return item;
    };

    getModuleInfoAjax = (json) => {
        let sp = json.api.split('//')[1];
        let cs = newTemplate.urlAnalysis(json.api);
        cs.current = json.current;
        cs.pageSize = 10;
        cs.__version__ = 3.0;
        let obj = {
            agreement: "https",
            hostname: sp.split(".com")[0] + ".com",
            path: sp.split(".com")[1].split("?")[0],
            data: cs,
            method: "get",
            referer: "https://we.taobao.com/"
        };
        parameter(
            obj, darenId, (msg) => {
                if (msg.success) {
                    let data = JSON.parse(msg.data);
                    let modelInfos = json.modelInfos ? json.modelInfos : [];
                    modelInfos = modelInfos.concat(data.data.itemList);
                    if (data.total > data.current * data.pageSzie) {
                        newTemplate.getModuleInfoAjax({
                            modelInfos: modelInfos,
                            api: json.api,
                            current: data.current + 1,
                            callback: json.callback,
                        });
                    } else {
                        json.callback(modelInfos);
                    }
                } else {
                    Message({
                        showClose: true,
                        message: '获取失败',
                        type: 'warning'
                    });
                }
            }
        );
    };


    propertiesCl = (propertie, value, json, callback) => {
        let message = "";
        let bridge = "ui:bridge";
        if (propertie.type == "array") {
            let success = true;
            let data = [];
            let pi = propertie.items;
            json[bridge] = propertie[bridge];
            if (value) {
                let valueData = (callback, value, i = 0) => {
                    if (!value || i < value.length) {
                        newTemplate.propertiesCl(pi, value[i], json, (t) => {
                            if (t.success) {
                                data.push(t.data);
                            } else {
                                success = false;
                                data.push(t.data);
                                message += t.message + "\n\r"
                            }
                            valueData(callback, value, i + 1)
                        })
                    } else {
                        callback();
                    }
                };
                valueData(() => {
                    callback({data: data, success: success, message: message});
                }, value)
            } else {
                callback({data: [], success: success, message: message});
            }
        } else if (propertie.type == "object") {

            if (propertie.title == "bmqd-item" || propertie.title == "添加宝贝") {

                if (!value.detailUrl && value.itemId) {
                    value.detailUrl = "https://detail.tmall.com/item.htm?=" + value.itemId;
                } else if (!value.detailUrl && value.item) {
                    value.detailUrl = value.item.detailUrl;
                }

                if (value.detailUrl) {
                    let bridgev = json[bridge];
                    let commonItemPropsName = bridgev.split(":")[1];
                    let commonItemProps = json.moduleConfig[commonItemPropsName];

                    let newData = {
                        isCollected: true,
                        itemImages: value.itemImages,
                        itemPriceDTO: value.itemPriceDTO,
                        item_numiid: value.item_numiid,
                        item_pic: value.item_pic,
                        item_title: value.item_title,
                        materialId: value.materialId
                    };
                    addItem(value.detailUrl, 0, (items, message) => {
                        if (message) {
                            callback({data: newData, success: false, message: message})
                        } else {
                            callback({data: newData, success: true})
                        }
                    });

                } else {
                    callback({data: value, success: false, message: "某条内容没有商品"});
                }

            } else if (propertie.allOf && propertie.allOf[0]["__ref"] == "contentDetail/content_spu") {

                callback({success: true, data: value, message: ""});

            } else {
                let success = true;
                let properties = propertie.properties;
                let data = {};
                let lindex = 0;
                for (let propertiesName in properties) {
                    lindex++;

                    if (value) {
                        newTemplate.propertiesCl(properties[propertiesName], value[propertiesName], json, (t) => {
                            lindex--;
                            if (t.success) {
                                data[propertiesName] = t.data;
                            } else {
                                data[propertiesName] = t.data;
                                success = false;
                                message += t.message + "\n\r";
                            }
                        });
                    } else {
                        lindex--;
                        data[propertiesName] = {};
                    }
                }

                let t1 = setInterval(() => {
                    if (lindex == 0) {
                        window.clearInterval(t1);
                        callback({success: success, data: data, message: message});
                    }
                }, 800);

            }
        } else {
            callback({success: true, data: value});
        }
    };

}

let newTemplate = new TemplateConversion();

export {
    getIdContent,
    getWtList,
    getQdList,
    getLXList,
    newTemplate,
    releaseSuccess,
    releaseFail,
    daren_list,
    darenId_change,
    parameter,
    getHDList,
    getDarenId,
    getNewWtList,
    pushItem,
    savedapei
}
import $ from 'jquery';
import React from 'react';
import {ThousandsOfCall} from "./ThousandsOfCall";
import {currencyNoty} from "./Noty";
import {ajax} from '../../lib/util/ajax';

//新添
const talentNick = (callback) => {//拿取达人主页数据（当前达人账号）
    ThousandsOfCall.acoustic({
            agreement: "https",
            hostname: "we.taobao.com",
            path: '/',
            method: "get",
            data: {},
            referer: "https://we.taobao.com/",
        }, "requestRelyTB", (item) => {
            if (item.success) {
                let msg = item.data;
                if (msg.indexOf("window.CREATOR_GLOBAL =") > -1) {
                    let i = msg.indexOf("window.CREATOR_GLOBAL =");
                    msg = msg.substring(i + 23);
                    let ii = msg.indexOf("</script>");
                    let msgs = msg.substring(0, ii);
                    let user = JSON.parse(msgs).user;
                    callback(user);
                } else {
                    callback();
                    //currencyNoty('此号非达人账号','warning')
                }
            } else {
                callback();
                //currencyNoty('获取失败','warning')
            }
        }
    );
};

const talentIndex = (callback) => {
    ThousandsOfCall.acoustic({
            agreement: "https",
            hostname: "sycm.taobao.com",
            path: '/xsite/daren/score/index.json',
            method: "get",
            data: {},
            referer: "https://we.taobao.com/",
        }, "requestRelyTB", (msg) => {
            if (msg.success) {
                let json = JSON.parse(msg.data);
                if (!json.hasError) {
                    let data = json.content.data;
                    callback(data);
                } else {
                    callback();
                }
            } else {
                currencyNoty('获取失败', 'warning')
            }
        }
    );
};

const tbName = (callback) => {
    ThousandsOfCall.acoustic({
            agreement: "https",
            hostname: "sycm.taobao.com",
            path: '/custom/menu/getPersonalView.json',
            method: "",
            data: {},
            referer: "https://we.taobao.com/",
        }, "requestRelyTB", (json) => {
            if (json.success) {
                let msg = JSON.parse(json.data);
                if (msg.message == "操作成功") {
                    let data = msg.data.loginUserName;
                    callback(data);
                } else {
                    callback();
                }
            } else {
                currencyNoty('获取失败', 'warning')
            }
        }
    );
};

const channel_list = (callback, current = 1, pageSize = 100, data = []) => {
    ThousandsOfCall.acoustic({
            agreement: "https",
            hostname: "contents.taobao.com",
            path: '/api2/channel/channel_list.json',
            method: "",
            data: {pageSize: pageSize, current: current},
            referer: "https://we.taobao.com/",
        }, "requestRelyTB", (json) => {
            if (json.success) {
                let msg = JSON.parse(json.data);
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
                }
            } else {
                currencyNoty('获取失败', 'warning')
            }
        }
    );
};

const channel_info = (id, callback, mainChannel) => {
    ThousandsOfCall.acoustic({
            agreement: "https",
            hostname: "contents.taobao.com",
            path: '/api2/channel/channel_info.json',
            method: "",
            data: {id: id},
            referer: "https://we.taobao.com/",
        }, "requestRelyTB", (json) => {
            if (json.success) {
                let msg = JSON.parse(json.data);
                if (msg != null && msg.status == "SUCCESS") {
                    callback(msg.data, mainChannel);
                } else {
                    callback();
                }
            } else {
                currencyNoty('获取失败', 'warning')
            }
        }
    );
};


const newTalentIndex = (callback) => {
    ThousandsOfCall.acoustic({
            agreement: "https",
            hostname: "we.taobao.com",
            path: '/newRank/getRankSummary.json',
            method: "",
            data: {__version__: 3.0},
            referer: "https://we.taobao.com/",
        }, "requestRelyTB", (json) => {
            if (json.success) {
                let msg = JSON.parse(json.data);
                if (msg.status == "SUCCESS") {
                    let data = msg.data;
                    callback(data);
                } else {
                    callback();
                }
            } else {
                currencyNoty('获取失败', 'warning')
            }
        }
    );
};


const accountInfo = (callback) => {
    ThousandsOfCall.acoustic({
            agreement: "https",
            hostname: "we.taobao.com",
            path: '/account/getAccountSettingInfo.json',
            method: "get",
            data: {__version__: 3.0},
            referer: "https://we.taobao.com/",
        }, "requestRelyTB", (json) => {
            if (json.success) {
                let msg = JSON.parse(json.data);
                if (msg.status == "SUCCESS") {
                    let data = msg.data;
                    callback(data);
                } else {
                    callback();
                }
            } else {
                currencyNoty('获取失败', 'warning')
            }
        }
    );
};


const getUrlPat = (url, pa) => {

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

const channel_list_content = (callback, json, names, i = 0, arr = []) => {
    if (json.length > i) {
        let activityId = json[i].id;
        let mainChannel = json[i].mainChannel;
        channel_info(activityId, (channelInfo, mainChannel) => {
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
            setTimeout(() => {
                channel_list_content(callback, json, names, i + 1, arr);
            }, 500)
        }, mainChannel)
    } else {
        callback(arr);
    }
};

const getAllEntryId = (callback, names) => {
    channel_list((json) => {
        channel_list_content((arr) => {
            callback(arr);
        }, json, names);

    });

};


// const judgeDarenData = () => {
//     const darenGetCookie = (cname) => {//达人数据同步更新
//         let name = cname + "=";
//         let ca = document.cookie.split(';');
//         for (let i = 0; i < ca.length; i++) {
//             let c = ca[i].trim();
//             if (c.indexOf(name) == 0) {
//                 return c.substring(name.length, c.length);
//             }
//         }
//         return "";
//     };
//
//     const darenSetCookie = (cname, cvalue, exdays) => {//达人数据首次更新
//         let d = new Date();
//         d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
//         let expires = "expires=" + d.toUTCString();
//         document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
//     };
//
//     let x = document.cookie;
//     if (x.indexOf("daren") > -1) {
//         let user = darenGetCookie("daren");
//         let d = new Date(new Date().getTime() - 30 * 60 * 1000);
//         let currentDate = d.getTime();
//         if (currentDate > user) {
//             darenData(() => {
//                 let date = new Date;
//                 let cyrrebtDate = date.getTime();
//                 darenSetCookie("daren", cyrrebtDate, 1);
//             });
//         }
//     } else {
//         let date = new Date;
//         let currentDate = date.getTime();
//         darenSetCookie("daren", currentDate, 1);
//         darenData();
//     }
// };


const darenData = (callback) => {
    talentNick((user) => {
        talentIndex((index) => {
            if (index) {
                user = $.extend(user, index);
            }
            tbName((tbName) => {
                if (tbName) {
                    user.tbName = tbName;
                }
                newTalentIndex((newIndes) => {
                    if (newIndes != null) {
                        user.darenIndex = newIndes.darenIndex;
                        user.currentLevelRank = newIndes.currentLevelRank;
                    }
                    accountInfo((accountInfo) => {
                        if (accountInfo != null) {
                            user.contactEmail = accountInfo.email;
                            user.contactPhone = accountInfo.phone;
                            user.contactName = accountInfo.name;
                        }
                        ck(user, () => {
                            getAllEntryId((qds) => {
                                user.qds = qds;
                                user.version = 3;
                                ck(user, callback);
                            })
                        })
                    })
                })
            });
        });
    })
};


const ck = (user, callback) => {
    ajax.ajax({
        url: "/user/admin/visible/domain.talentMessage.set.io",
        data: {
            data: JSON.stringify(user),
        },
        async: false,
        type: "post",
        isCloseMask: true,
        callback: () => {
            if (callback && typeof callback == 'function')
                callback();
        }
    })
};

export {darenData, talentNick};
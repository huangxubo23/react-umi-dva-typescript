/**
 * Created by linhui on 18-7-10.暗度陈仓
 */
import {ajax} from './ajax';
import $ from 'jquery';
import {currencyNoty} from "./Noty";
import {ThousandsOfCall} from "./ThousandsOfCall";
import {infoNoty} from "./global";
import {Button} from 'element-react';
import 'element-theme-default';
//import {Button,} from 'react-bootstrap';

let TheSucker = new class TheSuckers {

    getDynamic = (json, str, infoCallback) => {//采集奖金

        let i = json.i ? json.i : 0;
        if (i <= (json.num ? json.num : 7)) {
            if (!json.notHint) {
                //TheSucker.appendInfo("采集奖金前" + i);
                if (infoCallback) {
                    infoCallback({text: "采集奖金" + (i + 1), color: 'danger'});
                }

            }
            let date = TheSucker.getCurrentDate(i, str);
            TheSucker.getAllDynamic(json.accountId, json.talentId,json.notHint, {
                date: date,
                callback: () => {
                    json.i = i + 1;
                    TheSucker.getDynamic(json, str, infoCallback);
                }
            }, infoCallback)
        } else {
            if (json.callback) {
                json.callback();
            }
            if (infoCallback) {
                infoCallback({text: '采集奖金结束', color: 'info'});
            }

        }
    };


    getAllDynamic = (accountId, talentId,notHint, dynamicDate, infoCallback) => {//采集奖金2

        let pageNow = dynamicDate.pageNow ? dynamicDate.pageNow : 1;
        let date = dynamicDate.date ? dynamicDate.date : TheSucker.getCurrentDate();
        TheSucker.dynamic(pageNow, date, talentId, accountId, infoCallback, (data) => {
            TheSucker.putMessage(accountId, data.itemList,notHint, () => {
                if (data.total > data.pageSize * data.current) {
                    TheSucker.getAllDynamic(accountId, talentId,notHint,{
                        pageNow: data.current + 1,
                        date: date,
                        callback: dynamicDate.callback
                    }, infoCallback)
                } else {
                    dynamicDate.callback();
                }
            }, infoCallback)

        });
    };

    getCurrentDate = (day, str) => {
        let nowTemp = new Date();
        if (str) {
            nowTemp = new Date(str.substring(0, 4), str.substring(4, 6) - 1, str.substring(6, 8), 0, 0, 0);
            nowTemp.setDate(nowTemp.getDate() - (day ? day : 0));
        }else {
            nowTemp.setDate(nowTemp.getDate() - 2 - (day ? day : 0));
        }

        let nowTime = "" + nowTemp.getFullYear() + (nowTemp.getMonth() >= 9 ? (nowTemp.getMonth() + 1) : ("0" + (nowTemp.getMonth() + 1))) + (nowTemp.getDate() > 9 ? (nowTemp.getDate()) : ("0" + (nowTemp.getDate())));
        return nowTime;
    };

    putMessage = (accountId, list,notHint, callback, infoCallback) => {
        let data = {userId: accountId, effectAnalyseIncomeDataJson: list};
        ajax.ajax({
            url: "/message/admin/effectAnalyse/setEffectAnalyseIncome.io",
            data: {effectAnalyseIncomeData: JSON.stringify(data)},
            type: "post",
            isCloseMask: true,
            notLogin:notHint?false:true,
            callback: (res) => {
                /*  if (res) {*/
                /*if(res.success){*/
                callback();
                if (infoCallback) {
                    infoCallback({text: '奖金推送到服务器成功', color: 'success', accountId: accountId});
                }
            }
        });
    };

    dynamic = (pageNow, date, darenId, accountId, infoCallback, callback) => {
        let obj = {
            current: pageNow,
            pageSize: 100,
            __version__: "3.0",
            channel: "全部渠道",
            query_date: date,
            _output_charset: "UTF-8",
            _input_charset: "UTF-8"
        };
        let messageType = 'requestRelyTB';
        let da = {
            agreement: "https",
            hostname: "v.taobao.com",
            path: '/micromission/income/query_daren_dynamic_dates.do',
            method: "get",
            data: obj,
            referer: "https://we.taobao.com/",
        };
        if (darenId) {
            da.talentId = parseInt(darenId);
            messageType = 'requestRelyAgentTB';
        }
        /*if(darenId){
            obj.talentId=parseInt(darenId);
        }*/
        ThousandsOfCall.acoustic(da, messageType, (msg) => {
                if (msg.success) {
                    let json = JSON.parse(msg.data);
                    if (json.status == "SUCCESS") {
                        if (infoCallback) {
                            infoCallback({
                                text: '正在推送' + json.data.itemList.length + "条奖金数据到服务器",
                                color: "success",
                                accountId: accountId
                            });
                        }
                        callback(json.data);
                    } else if (json.status == 'NOT_LOGIN') {
                        if (infoCallback) {
                            infoCallback({text: '授权已失效，请重新授权', color: "danger", accountId: accountId});
                        }
                        infoNoty('授权已失效，请重新授权');
                        return false;
                    } else {
                        if (infoCallback) {
                            infoCallback({text: json.message, color: "danger", accountId: accountId});
                        }
                        infoNoty(json.message);
                    }
                }
            }
        );
    };

    exNewSynchronizationState = (data, infoCallback, callback) => {//同步审核状态1
        let daren = data.currDaren;

        if (!data || !data.notHint) {
            if(infoCallback){
                infoCallback({text: '正在采集内容', color: 'red'});
            }
        }
        let drId = daren.accountId;
        let feedIds = [];
        TheSucker.stateBuleF(1, drId, feedIds,data.notHint, infoCallback, (feedIds) => {
            data.drId = drId;
            TheSucker.cl(feedIds, data, infoCallback, callback);
        });

    };

    stateBuleF = (pageNow, drId, feedIds,notHint, infoCallback, callback) => {//同步审核状态2
        if(infoCallback){
            infoCallback({text: "获取需要同步状态的内容, page = " + pageNow, color: 'success'});
        }
        TheSucker.getToAudit(drId, pageNow,notHint, (json) => {
            let feedId = json.feedId;
            let pageNow = json.pageNow;
            let pageSize = json.pageSize;
            let count = json.count;
            feedIds = feedIds.concat(feedId);
            let pageCount = Math.floor((count - 1) / pageSize) + 1;
            if (pageNow < pageCount) {
                TheSucker.stateBuleF(pageNow + 1, drId, feedIds,notHint, infoCallback, callback);
            } else {
                callback(feedIds);
            }
        });
    };

    cl = (feedIds, data, infoCallback, callback) => {//同步审核状态3
        if (feedIds.length > 0) {
            let feedId = feedIds.shift();
            if (feedId) {
                TheSucker.gatherState(feedId.title, feedId.feedId, feedId.channel, data, infoCallback, () => {
                    if (!data || !data.notHint) {
                        if(infoCallback){
                            infoCallback({text: "正在搜索剩余=" + feedIds.length, color: 'danger'});
                        }
                    }
                    if(infoCallback){
                        infoCallback({text: "正在搜索剩余=" + feedIds.length, color: 'success'});
                    }
                    TheSucker.cl(feedIds, data, infoCallback, callback);
                });
            } else {
                TheSucker.cl(feedIds, data, infoCallback, callback);
            }
        } else {
            if (!data || !data.notHint) {
                if(infoCallback){
                    infoCallback({text: "采集结束", color: "danger"});
                }

            } else {
                if(infoCallback){
                    infoCallback({text: '同步状态结束', color: 'info'});
                }
                //console.log("同步状态结束")
            }
            if (callback) {
                callback();
            }

        }
    };


    contentRank = (callback, page, userId, notHint, date, infoCallback, talentId, accountId) => {  //按页采集流量
        page = page ? page : 1;
        let pageSize = 10;
        if (!notHint) {
            //TheSucker.appendInfo("采集流量第" + page + "页");
            if(infoCallback){
                infoCallback({text: "采集流量第" + page + "页", color: 'success'});
            }

        }
        let dt = {
            agreement: "https",
            hostname: "sycm.taobao.com",
            path: '/xsite/daren/content/overview/contentRank.json',
            method: "get",
            data: {
                articleType: 2,
                pageSize: pageSize,
                page: page,
                dateType: "day",
                order: "desc",
                orderBy: "sumReadCnt"
            },
            referer: "https://we.taobao.com/",
        };
        let messageType = 'requestRelyTB';
        if (talentId) {
            dt.talentId = talentId;
            messageType = 'requestRelyAgentTB';
        }
        ThousandsOfCall.acoustic(dt, messageType, (item) => {
                if (item.success) {
                    let res = JSON.parse(item.data);
                    if (!res.hasError) {
                        let data = res.content.data.data;
                        let recordCount = data.recordCount;
                        let list = data.data;
                        TheSucker.batchGetEffectAnalyse(list, userId,notHint, () => {
                            if (recordCount > page * pageSize) {
                                TheSucker.contentRank(callback, page + 1, userId, notHint, date, infoCallback, talentId, accountId);
                            } else {
                                callback();
                            }
                        }, date, infoCallback, talentId, accountId);
                    } else {
                        if (notHint) {
                            let bu = <Button
                                onClick={TheSucker.contentRank(callback, page, userId, notHint, date, infoCallback, talentId, accountId)}>采集错误，点击确定重试</Button>;
                                if(infoCallback){
                                    infoCallback({text: bu, color: "danger", accountId: accountId});
                                }

                            /*  if (window.confirm('采集错误，点击确定重试')) {

                                  TheSucker.contentRank(callback, page, userId, notHint, date,infoCalback,talentId,accountId);
                              } else {
                                  callback();
                              }*/
                        }else{
                            callback();
                        }

                        console.log("获取内容列表失败，，，暂停。。。。。。。。。")
                    }
                } else {
                    if(infoCallback){
                        infoCallback({text: '获取失败', color: "danger", accountId: accountId});
                    }else{
                        callback();
                    }

                    currencyNoty('获取失败', 'warning')

                }
            }
        );

    };

    appendInfo = (info, color) => {
        $("#drzl_info").append("<div style='color: " + color + "' class='ma'>" + info + "</div>");
        $("#drzl_info").parent().scrollTop(99999999999);
    };

    getToAudit = (drid, pageNow,notHint, callback) => {
        ajax.ajax({
            url: "/content/admin/effectAnalyse/getToAudit.io",
            type: "post",
            dataType: 'json',
            //timeout: 5000,
            isCloseMask: true,
            notLogin:notHint?false:true,
            data: {drid: drid, pageNow: pageNow},
            callback: (json) => {
                // console.log(json);
                callback(json);
            }
        });
    };

    gatherState = (title, feedId, channel, data, infoCallback, callback) => {
        if(infoCallback){
            infoCallback({text: "开始搜索内容:" + title, color: 'success'});
        }
        let zd = false;
        let ss = title.split("'");
        title = ss[0];
        for (let i in ss) {
            if (ss[i].length > title.length) {
                title = ss[i];
            }
        }


        if (!channel || channel.from == "draft" || channel.from == "weitao") {
            TheSucker.ssNewWT(title, feedId, data, infoCallback, (zd, title) => { //微淘搜索
                if (!zd && !channel) { //微淘中没有找到 同时不确定渠道
                    if(infoCallback){
                        infoCallback({text: "微淘中找不到，准备渠道中搜索", color: 'success'});
                    }
                    TheSucker.ssContribute(title, feedId, channel, data, infoCallback, callback, false);
                } else {
                    callback();
                }
            }, true)
        } else {
            TheSucker.ssContribute(title, feedId, channel, data, infoCallback, callback, true);
        }

    };

    ssContribute = (title, feedId, channel, data, infoCallback, callback, cs) => { //搜索投稿
        if(infoCallback){
            infoCallback({text: "搜索投稿的内容", color: 'success'});
        }
        TheSucker.ssNewChannel(title, feedId, channel, data, infoCallback, (zd, title) => {
            if (!zd) { //
                if(infoCallback){
                    infoCallback({text: "投稿的内容中没有找到", color: 'danger'});
                }
                callback(false);
            } else {
                callback(true, title);
            }
        }, cs);
    };

    ssNewChannel = (title, feedId, channel, data, infoCallback, callback, cs) => { //搜索渠道
        let zd = false;
        TheSucker.listAsy(title, data.currDaren.talentId, (list) => {
            for (var i in list) {
                var item = list[i];
                if (list[i].id == feedId) {
                    zd = true;
                    if (item.auditStatusString && item.auditStatusString != "审核中") {
                        TheSucker.pushSecver({
                            id: item.id,
                            userId: data.drId,
                            status: item.finalStatus,
                            reason: item.reason + ",【修改次数：" + item.editStr + "】",
                            editStr: item.editStr,
                            reason: item.reason,
                            statusDesc: item.auditStatusString,
                            auditStatusString: item.auditStatusString,
                            auditStatusName: item.auditStatusName,
                            activityName: item.recruitActivityName,
                            recruitActivityName: item.recruitActivityName,
                            recruitChannelName: item.recruitChannelName,
                            publishTime: item.publishTime,
                            title: item.title,
                            feedId: feedId,
                        },data.notHint, infoCallback, () => {
                            callback(true, title);
                        });
                    } else {
                        callback(true, title);
                    }
                }
            }

            if (!zd) {
                if (cs) {
                    TheSucker.collectContetnH5(feedId, function (da) {
                        if (da) {
                            try {
                                title = da.models.content.title;
                                TheSucker.ssNewChannel(title, feedId, channel, data, infoCallback, callback, false);
                            } catch (e) {
                                callback(false, title);
                            }
                        } else {
                            callback(false, title);
                        }
                    })
                } else {
                    callback(false, title);
                }
            }
        }, true, data.notHint);

    };

    collectContetnH5 = (feedId, callback) => {

        let data = {"contentId": feedId + "", "source": "qingdan_dacu_itemlist", "type": "h5"};
        let s = {
            type: "jsonp",
            dataType: "jsonp",
            api: "mtop.taobao.beehive.detail.contentservicenew",
            v: "1.0",
            appKey: 12574478,
            t: new Date().getTime()
        };
        ThousandsOfCall.acoustic({
            parameters: s,
            requesData: data,
            host: "https://acs.m.taobao.com/h5",
            ajaxData: {requeryType: "get", referer: "https://h5.m.taobao.com"},
        }, "requestH5", (response) => {
            callback(response);
        });

    };

    /**
     * 搜索渠道的内容 根据标题
     * @param columnId
     * @param title
     * @param callback
     * @param isTautology
     * actType 0 渠道投稿  1 活动头号
     */
    listAsy = (title, talentId, callback, isTautology, notHint) => {
        let data = {
            agreement: "https",
            hostname: "contents.taobao.com",
            path: '/api2/content/content_list.json',
            method: "get",
            data: {
                current: 1,
                pageSize: 30,
                type: "common",
                key: title,
                __version__: 3.0,
            },
            referer: "https://we.taobao.com/",
        };
        let messageType = 'requestRelyTB';
        if (talentId) {
            messageType = 'requestRelyAgentTB';
            data.talentId = talentId;
        }
        ThousandsOfCall.acoustic(data, messageType, (msg) => {
                if (msg.success) {
                    let mes = JSON.parse(msg.data);
                    if (mes.status == "SUCCESS") {
                        callback(mes.data.itemList);
                    } else if (isTautology) {
                        setTimeout(() => {
                            TheSucker.listAsy(title, talentId,callback, false,notHint);
                        }, 5000);
                    } else {
                        if (notHint) {
                            if (window.confirm('搜索内容失败，点击重试')) {
                                TheSucker.listAsy(title,talentId, callback, isTautology,notHint);
                            } else {
                                callback();
                            }
                        } else {
                            callback();
                        }
                    }
                } else {
                    if (notHint) {
                        if (window.confirm('搜索内容失败，点击重试')) {
                            TheSucker.listAsy(title,talentId, callback, isTautology,notHint);
                        } else {
                            callback();
                        }
                    } else {
                        callback();
                    }
                }
            }
        );
    };

    pushSecver = (contribution,notHint, infoCallback, callback) => {

        ajax.ajax({
            type: "post",
            url: "/message/admin/content/reviewState.io",
            dataType: 'json',
            data: {contribution: JSON.stringify(contribution)},
            isCloseMask: true,
            notLogin:notHint?false:true,
            //timeout: 5000,
            callback: (data) => {
                if(infoCallback){
                    infoCallback({
                        text: contribution.title + "：" + contribution.statusDesc + "：发送到服务器成功",
                        color: "info"
                    });
                }
                callback();
            }
        });
    };

    ssNewWT = (title, feedId, data, infoCallback, callback, cs) => { //搜索新微淘
        let zd = false;
        TheSucker.listAsyNewWT(title, data.currDaren.talentId, (components) => {
            for (let i in components) {
                if (components[i].component == "ContentTable") {
                    let dataSource = components[i].props.dataSource;
                    for (let j in dataSource) {
                        var item = dataSource[j];
                        if (item.id == feedId) {
                            zd = true;
                            if (item.adoptChannels && item.adoptChannels.length > 0) {
                                TheSucker.pushSecverAdoptChannels({
                                    adoptChannels: item.adoptChannels,
                                    id: item.id,
                                    qualityScore: item.qualityScore,
                                    userId: item.userId,
                                    title: item.title.title
                                },data.notHint, infoCallback, () => {
                                    callback(true, title);
                                });
                            } else {
                                callback(true, title);
                            }

                        }
                    }
                }
            }

            if (!zd) {
                if (cs) {
                    TheSucker.collectContetnH5(feedId, function (da) {
                        if (da) {
                            try {
                                title = da.models.content.title;
                                TheSucker.ssNewWT(title, feedId, data, infoCallback, callback, false);
                            } catch (e) {
                                callback(false, title);
                            }
                        } else {
                            callback(false, title);
                        }
                    })
                } else {
                    callback(false, title);
                }
            }

        }, true, data.notHint);

    };

    pushSecverAdoptChannels = (contribution,notHint, infoCallback, callback) => {
        ajax.ajax({
            type: 'post',
            url: "/message/admin/content/adoptChannels.io",
            dataType: 'json',
            data: {contribution: JSON.stringify(contribution)},
            isCloseMask: true,
            notLogin:notHint?false:true,
            //timeout: 5000,
            callback: (data) => {
                if(infoCallback){
                    infoCallback({
                        text: contribution.title + "：" + contribution.adoptChannels + "：发送到服务器成功",
                        color: "info"
                    });
                }

                callback();
            }
        });
    };

    /**
     * 搜索渠道的内容 根据标题
     * @param columnId
     * @param title
     * @param callback
     * @param isTautology
     */
    listAsyNewWT = (title, talentId, callback, isTautology, notHint) => {
        let messageType = 'requestRelyTB';
        let data = {
            agreement: "https",
            hostname: "we.taobao.com",
            path: '/daren/list_new.json',
            method: "get",
            data: {
                tab: "all",
                subTab: "weiTaoPushed",
                titleSearch: title,
                __version__: 3.0,
            },
            referer: "https://we.taobao.com/",
        };
        if (talentId) {
            messageType = 'requestRelyAgentTB';
            data.talentId = talentId;
        }
        ThousandsOfCall.acoustic(data, messageType, (msg) => {
                if (msg.success) {
                    let mes = JSON.parse(msg.data);
                    if (mes.status == "SUCCESS") {
                        callback(mes.data.components);
                    } else if (isTautology) {
                        setTimeout(() => {
                            TheSucker.listAsyNewWT(title, talentId, callback, false);
                        }, 5000);
                    } else {
                        if (notHint) {
                            if (window.confirm('搜索微淘内容失败，点击重试')) {
                                TheSucker.listAsyNewWT(title, talentId, callback, isTautology);
                            } else {
                                callback();
                            }
                        } else {
                            callback();
                        }

                    }
                } else {
                    if (notHint) {
                        if (window.confirm('搜索微淘内容失败，点击重试')) {
                            TheSucker.listAsyNewWT(title, talentId, callback, isTautology);
                        } else {
                            callback();
                        }
                    } else {
                        callback();
                    }
                }
            }
        );
    }

    batchGetEffectAnalyse = (list, userId,notHint, callback, dateNew, infoCallback, talentId, accountId) => {  //批量采集处理流量
        if (list.length == 0) {
            callback();
        } else {
            let date = new Date();
            date.setDate(date.getDate() - 2);

            var d = date.getDate() + "";
            d = d.length == 2 ? d : ("0" + d);
            var m = (date.getMonth() + 1) + "";
            m = m.length == 2 ? m : ("0" + m);
            var time = dateNew ? dateNew : (date.getFullYear() + "-" + m + "-" + d);
            let e = list.shift();
            TheSucker.getEffectAnalyse({
                userId: userId,
                feedId: e.feedId.value,
                startTime: time,
                endTime: time,
                notHint: notHint,
            }, () => {
                TheSucker.batchGetEffectAnalyse(list, userId, notHint,callback, dateNew, infoCallback, talentId, accountId);
            }, infoCallback, talentId, accountId);
        }
    };

    getEffectAnalyse = (json, callback, infoCallback, talentId, accountId) => {  //拿流量
        var day = "day";
        let feedId = json.feedId;
        var reqdata = {
            feedId: (feedId + "").indexOf("daren_") >= 0 ? feedId : ("daren_" + feedId),
            dateRange: json.startTime + "|" + json.endTime,
            dateType: day
        };
        let messageType = 'requestRelyTB';
        let da = {

            agreement: "https",
            hostname: "sycm.taobao.com",
            path: '/xsite/daren/content/article/trend.json',
            method: "get",
            data: reqdata,
            //timeout: 20000,
            referer: "https://we.taobao.com/",
        };
        if (talentId) {
            messageType = 'requestRelyAgentTB';
            da.talentId = talentId;
        }


        ThousandsOfCall.acoustic(da, messageType, (msg) => {
                if (msg.success) {
                    let res = JSON.parse(msg.data);
                    let effs = [];
                    let feedId;
                    if (res.content && res.content.message == "操作成功") {
                        feedId = (json.feedId + "").indexOf("daren_") >= 0 ? json.feedId.split("_")[1] : json.feedId;
                        let data = res.content.data;
                        let feedUv = data.readUv;

                        for (let i = 0; i < feedUv.length; i++) {
                            if (feedUv[i] != 0) {
                                let eff = {};
                                eff.uv = feedUv[i];
                                eff.pv = data.readPv[i];
                                eff.statDate = data.statDate[i];
                                eff.fenxiangCnt = data.snsShareCnt[i]; //分享
                                eff.pinglunCnt = data.snsCnt[i];//评论
                                eff.zanCnt = data.snsFavorCnt[i]; //赞
                                effs.push(eff);
                            }
                        }
                        if (effs.length > 0) {
                            TheSucker.effectSummary(reqdata, talentId, (summaryData) => {
                                if(infoCallback){
                                    infoCallback({
                                        text: "feedid=" + json.feedId + "正在推送到服务器",
                                        color: "success",
                                        accountId: accountId
                                    });
                                }
                                let effectAnalyseData = {
                                    feedId: feedId,
                                    effectAnalyse: effs,
                                    userId: json.userId,
                                    summaryData: summaryData
                                };
                                TheSucker.pushEffectAnalyse(effectAnalyseData, callback, json.notHint, accountId, infoCallback);
                            })
                            // cizt(feedId, callback);
                        } else {
                            callback();
                        }

                    } else {
                        if (res.errorMsg != "仅支持查看自己的文章数据！") {
                            if(infoCallback){
                                infoCallback({text: res.errorMsg, color: 'danger'});
                            }
                        }
                        if(infoCallback){
                            infoCallback({text: res.content.message, color: 'danger'});
                        }
                        callback();
                    }
                } else {
                    if (!json.notHint) {
                        let bt = <Button onClick={() => {
                            TheSucker.getEffectAnalyse(json, callback, infoCallback, talentId, accountId);
                        }}>内容采集失败,点击确定重试</Button>;
                        if(infoCallback){
                            infoCallback({text: bt, color: 'danger'});
                        }else{
                            callback();
                        }

                        /*   if (window.confirm('内容采集失败,点击确定重试')) {
                               TheSucker.getEffectAnalyse(json, callback,infoCalback,talentId,accountId);
                           } else {
                               callback();
                           }*/
                    }
                }
            }
        );
    };

    pushEffectAnalyse = (effectAnalyseData, callback, notHint, accountId, infoCallback) => {
        ajax.ajax({
            url: "/message/admin/effectAnalyse/setEffectAnalyse.io",
            type: "post",
            dataType: 'json',
            isCloseMask: true,
            notLogin:notHint?false:true,
            data: {effectAnalyseData: JSON.stringify(effectAnalyseData)},
            //timeout: 15000,
            callback: (z) => {
                // if (z) {
                if(infoCallback){
                    infoCallback({text: "推送到服务器成功", color: "success", accountId: accountId});
                }

                callback();
                /* } else {
                     if (z.cs) {
                         TheSucker.pushEffectAnalyse(effectAnalyseData, callback);
                     }
                 }*/
            }
        });

    };

    effectSummary = (data, talentId, callback) => {
        let da = {
            agreement: "https",
            hostname: "sycm.taobao.com",
            path: '/xsite/daren/content/detail/summary.json',
            method: "get",
            data: data,
            //timeout: 20000,
            referer: "https://we.taobao.com/",
        };
        let messageType = 'requestRelyTB';
        if (talentId) {
            da.talentId = talentId;
            messageType = 'requestRelyAgentTB';
        }
        ThousandsOfCall.acoustic(da, messageType, (msg) => {
                if (msg.success) {
                    let res = JSON.parse(msg.data);
                    if (res.content.code == 0) {
                        callback(res.content.data);
                    }
                }
            }
        );
    }
};

export default TheSucker;
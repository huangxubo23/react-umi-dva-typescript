/**
 * Created by shiying on 17-7-24.内容列表
 */

require('./styles/content.css');
import React from "react";
import ReactChild from "../../../../../../lib/util/ReactChild";
import listShowModelContainer from 'bundle-loader?lazy&name=pc/trends_asset/admin/content/app-[name]!./page/listShowModel/ListShowModel';
import {BundleLoading} from '../../../../../../../bundle';
import {Link, Switch, Route, BrowserRouter} from 'react-router-dom';

import ListMode from './components/ListMode';
import ListStepButton from './components/ListStepButton';
import ListContent from './components/ListContent';
import AJAX from '../../../../../../lib/newUtil/AJAX.js';

import {Pagination, Message, MessageBox} from 'element-react';
import 'element-theme-default';

class PostList extends ReactChild {

    constructor(props) {
        super(props);
        const nowTemp = new Date();
        const endTime = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate() + 1, 0, 0, 0, 0);
        const startTime = new Date(nowTemp.getFullYear(), nowTemp.getMonth() - 6, nowTemp.getDate(), 0, 0, 0, 0);
        let contentType = props.match.params.contentType;
        this.state = {
            contentHistory: '半年以内',
            contentType: contentType,
            modePaging: {
                pageNow: 1,
                pageSize: 20,
                count: 0,
                countPage: 1,
                name: '',
            },
            contentMode: [],
            contentModeId: 0,
            showContent: undefined,
            contentStatePreview: [
                {state: 0, name: "草稿箱", count: 0, typeTab: []},
                {state: 1, name: "待审核", count: 0, typeTab: []},
                {state: 2, name: "审核失败", count: 0, typeTab: []},
                {state: 3, name: "待发布", count: 0, typeTab: []},
                {state: 4, name: "已发布", count: 0, typeTab: []},
                {state: 5, name: "需要修改", count: 0, typeTab: []},
                {state: 7, name: "已修改", count: 0, typeTab: []},
                {state: 8, name: "待同步", count: 0, typeTab: []},
                {state: 6, name: "平台接收", count: 0, typeTab: []}
            ],
            contents: [],
            ordId: 0,
            pageNow: 1,
            pageSize: 30,
            count: 0,
            state: undefined,
            manage: 0,
            flag: '',
            typeTab: undefined,
            type: 1,
            governmentManage: [],
            actionButtons: {release: false, update: false, audit: false, submit: false},
            seekKey: "",
            startTime: startTime.getFullYear() + "-" + (startTime.getMonth() + 1) + "-" + (startTime.getDate()),
            endTime: endTime.getFullYear() + "-" + (endTime.getMonth() + 1) + "-" + (endTime.getDate()),
            groupId: undefined,
            largeProcessName: '',//工作流程名
            largeProcessId: '',//工作流程id
            smallProcessId: '',//步骤id
            largeProcess: '',//工作流程
            isProcessStrComplete: '',
            cols: ["#cab5b5", "#bfb5ca", "#b5bfca", "#b5cac1", "#cac3b5"],
            defaultSort: true,
            fullscreen: false,//加载事件
            version: true,
            showContentJudge: false,
            dapContentMode:[]
        };
        document.title = "内容列表-哇掌柜";
    }

    setThisState = (state, callback) => {
        this.setState(state, () => {
            if (callback && (typeof callback) == 'function') {
                callback();
            }
        });
    };

    componentDidMount() {
        let {groupId} = this.props.match.params;
        if (groupId) {
            groupId = groupId.split("#")[0];
            this.querygroupById(groupId, () => {
                this.modegoPage(1, () => {
                    this.queryLargeProcessByIdCount(() => {
                        this.getContentStatePreview(undefined, () => {
                            this.getGovernmentManage();
                        });
                        this.getDap();
                    });
                });
            });
        } else {
            this.modegoPage(1, () => {
                this.getContentStatePreview(undefined, () => {
                    this.getGovernmentManage();
                });
                this.getDap();
            });
        }
        if (this.getCookie('version') == 1) {
            this.setState({version: false});
        } else if (this.getCookie('version') == 2) {
            this.setState({version: true});
        }
    };

    getDap=()=>{//新添
        this.listContentAJAX.listAJAX.ajax({
            url: `/content/admin/dap/queryContentOvert.io`,
            data: {
                pageNow: 1,
                pageSize: 66,
                name: '',
            },
            callback: (data) => {
                this.setState({dapContentMode: data.contentMode});
            }
        });
    };

    versionCookie = () => {
        let {version} = this.state;
        if (version) {
            this.setCookie('version', 2, 7)
        } else {
            this.setCookie('version', 1, 7)
        }
    };

    setCookie = (cname, cvalue, exdays) => {
        let d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    };

    getCookie = (cname) => {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
        }
        return "";
    };

    getContentMode = (da, callback, arr = []) => { //获取所有的contenModel
        let {groupId, contentType, countPage, modePaging} = this.state;
        if (groupId) {
            Object.assign(da, {groupId})
        }
        this.listContentAJAX.listAJAX.ajax({
            url: `/content/admin/${contentType}/queryContentOvert.io`,
            data: da,
            callback: (data) => {
                let {count, pageSize} = data;
                if (count / pageSize > parseInt(count / pageSize)) {
                    countPage = parseInt(count / pageSize) + 1;
                } else {
                    countPage = parseInt(count / pageSize);
                }
                if (countPage > da.pageNow) {
                    da.pageNow = da.pageNow + 1;
                    this.getContentMode(da, callback, [...arr, ...data.contentMode]);
                } else {
                    let modePagings = {
                        pageNow: da.pageNow,
                        pageSize: da.pageSize,
                        count: da.count,
                        countPage: countPage,
                        name: modePaging.name,
                    };
                    this.setState({contentMode: [...arr, ...data.contentMode], modePaging: modePagings}, () => {
                        if (callback && typeof callback == "function") {
                            callback();
                        }
                    });
                }
            }
        });
    };

    /*getContentMode = (da, callback) => { //获取所有的contenModel旧
        let {groupId,contentType,countPage,modePaging} = this.state;
        if (groupId) {
            Object.assign(da,{groupId})
        }
        this.listAJAX.ajax({
            url: `/content/admin/${contentType}/queryContentOvert.io`,
            data: da,
            callback: (data) => {
                let {count,pageSize} = data;
                if (count / pageSize > parseInt(count / pageSize)) {
                    countPage = parseInt(count / pageSize) + 1;
                } else {
                    countPage = parseInt(count / pageSize);
                }
                let modePagings = {
                    pageNow: da.pageNow,
                    pageSize: da.pageSize,
                    count: da.count,
                    countPage: countPage,
                    name: modePaging.name,
                };
                this.setState({contentMode:data.contentMode, modePaging: modePagings}, () => {
                    if (callback && typeof callback == "function") {
                        callback();
                    }
                });
            }
        });
    };*/

    querygroupById = (groupId, callback) => {//根据小组id查询工作流程id
        this.listContentAJAX.listAJAX.ajax({
            type: 'post',
            url: '/content/admin/manageGroup/queryLargeProcessById.io',
            data: {groupId: groupId},
            callback: (json20) => {
                this.setState({
                    largeProcess: json20,
                    groupId: groupId
                }, () => {
                    if (callback && typeof callback == "function") {
                        callback();
                    }
                });
            }
        });
    };

    modegoPage = (newPageNow, callback) => {/*点击分页*/
        let {pageSize, name, pageNow} = this.state.modePaging;
        this.getContentMode({
            pageNow: newPageNow ? newPageNow : pageNow,
            pageSize: pageSize,
            name: name,
        }, () => {
            if (callback && typeof callback == "function") {
                callback();
            }
        });
    };
    queryLargeProcessByIdCount = (callback) => {//拿取步骤总数
        let {largeProcess, contentModeId, startTime, endTime} = this.state;
        this.listContentAJAX.listAJAX.ajax({
            type: 'post',
            url: '/content/admin/manageGroup/queryLargeProcessByIdCount.io',
            data: {
                groupId: largeProcess.largeProcess.groupId,
                contentModeId: contentModeId,
                startTime: startTime,
                endTime: endTime
            },
            callback: (json) => {
                this.setState({smallProcessList: json[0].count}, () => {
                    if (callback && typeof callback == "function") {
                        callback();
                    }
                });
            }
        });
    };

    getContentStatePreview = (pageNow, callback) => {//内容状态预览
        this.goPage(pageNow, () => {
            let {groupId, contentModeId, startTime, endTime, largeProcess, contentType} = this.state;
            let getData = {
                contentModeId: contentModeId,
                startTime: startTime,
                endTime: endTime,
                contentHistory: this.state.contentHistory == '半年以内' ? false : true,
            };
            if (groupId) {//判断是小组还是内容
                Object.assign(getData, {
                    groupId: largeProcess.largeProcess.groupId
                })
            }
            this.listContentAJAX.listAJAX.ajax({
                url: `/content/admin/${contentType}/domain.content.state.preview.io`,//要访问的后台地址
                data: getData,
                isCloseMask: true,
                callback: (data) => {
                    this.setState({contentStatePreview: data}, () => {

                    })
                }
            });
        });
    };
    getContentByState = () => {
        let {contentModeId, state, typeTab, startTime, endTime, pageSize} = this.state;
        this.listData({
            contentModeId, state, typeTab, startTime, endTime, pageNow: 1, pageSize
        });
    };
    getGovernmentManage = (id, callback) => {
        if (id == 0) return;
        if (id) {
            this.listContentAJAX.listAJAX.ajax({
                url: "/user/admin/user/user.manage.info.io",
                data: {id: id, type: 1},
                callback: (data) => {
                    let {governmentManage} = this.state;
                    this.setState({governmentManage: [...governmentManage, data]}, () => {
                        if (callback && typeof callback == "function") {
                            callback();
                        }
                    });
                }
            });
        } else {
            this.listContentAJAX.listAJAX.ajax({
                url: '/user/admin/user/queryManageList.io',
                data: {name: '', pageNow: 1, pageSize: 999, type: 1},
                callback: (data) => {
                    let array = [];
                    for (let i = 0; i < data.talent.length; i++) {
                        if (data.talent[i].grade != 3) {
                            array.push(data.talent[i]);
                        }
                    }
                    this.setState({governmentManage: array}, () => {
                        if (callback && typeof callback == "function") {
                            callback();
                        }
                    });
                }
            });
        }
    };

    listData = (data, callback) => {
        let {contentType, contentHistory} = this.state;
        this.listContentAJAX.listAJAX.ajax({
            url: `/content/admin/${contentType}/domain.content.list.io`,
            data: Object.assign(data, {contentHistory: contentHistory == '半年以内' ? false : true}),
            callback: (json) => {
                Object.assign({
                    state: undefined, typeTab: undefined, manage: undefined
                }, json);
                this.setState(json, () => {
                    if (callback && typeof callback == "function") {
                        callback();
                    }
                });
            }
        });
    };

    seletContent = (env) => {
        let id = $(env.target).data("id");
        this.newSelectContent({id});
    };

    newSelectContent = ({id}) => {
        let {showContentJudge} = this.state;
        if (showContentJudge && this.bundleLoading&&this.bundleLoading.jd) {
            this.bundleLoading.jd.setState({postShow: true}, () => {
                this.bundleLoading.jd.findContent(id);
            });
        } else {
            this.setState({showContentJudge: true}, () => {
                let upload = setInterval(() => {
                    let bundleLoading = this.bundleLoading;
                    if (bundleLoading && bundleLoading.jd) {
                        clearInterval(upload);
                        bundleLoading.jd.setState({postShow: true}, () => {
                            this.bundleLoading.jd.findContent(id);
                        });
                    }
                }, 100)
            });
        }
    };


    rotatingStructure = (env) => {//转结构体
        let id = $(env.target).data("id");
        let data = {id: id}, {groupId, contentType} = this.state;
        if (groupId) {
            Object.assign(data, {groupId});
        }
        this.listAJAX.ajax({
            url: `/content/admin/${contentType}/domain.content.find.io`,
            data: data,
            callback: (json) => {
                let contentData = json.contentData;
                let date = contentData;
                if (contentData.baiditu) {
                    let content = {
                        body: contentData.body,
                        bodySpu: contentData.bodySpu ? contentData.bodySpu : {type: "CreatorAddSpu", version: 3},
                        bodyStruct: {
                            type: "StructCanvas",
                            value: [],
                            version: 3
                        },
                        crowdId: contentData.crowdId,
                        duanliangdian: contentData.duanliangdian,
                        pushDaren: contentData.pushDaren,
                        recruit: contentData.recruit,
                        title: contentData.title,
                        type: 3,
                    };
                    let [arr, arr1] = [[], []];
                    let value = contentData.coverUrl.value;
                    for (let v in value) {
                        if (value[v].url) {
                            arr.push(value[v].url);
                        } else {
                            arr.push(value[v]);
                        }
                    }
                    let value1 = contentData.baiditu.value;
                    for (let v in value1) {
                        if (value1[v].url) {
                            arr1.push(value1[v].url);
                        } else {
                            arr1.push(value1[v]);
                        }
                    }
                    content.body.value[0].extraBanners = arr;
                    content.body.value[0].coverUrl = arr1[0];
                    this.getContentModeNum((children = []) => {
                        for (let c in children) {
                            if (children[c].type == "StructCanvas") {
                                let sidebar = children[c].props.sidebarBlockList;
                                children[c].props.value = [];
                                for (let s in sidebar) {
                                    if (sidebar[s].blockName == "Spot") {
                                        let it = date.changliangdian.value;
                                        let moduleInfo = sidebar[s].moduleInfo;
                                        let newContent = {
                                            attrs: {},
                                            data: {features: it},
                                            errorMsg: "",
                                            guid: "ItemFeature-0",
                                            materialId: moduleInfo.materialId,
                                            moduleInfo: {dataSchema: moduleInfo.dataSchema},
                                            name: moduleInfo.name,
                                            resourceId: moduleInfo.id,
                                            rule: moduleInfo.rule,
                                        };
                                        content.bodyStruct.value.push(newContent);
                                    } else if (sidebar[s].blockName == "StdParagraph") {

                                    } else if (sidebar[s].blockName == "CustomParagraph") {
                                        let biaoti = date.buchongbiaoti.value;
                                        let jieshao = date.buchongjieshao.value;
                                        let peitu = date.buchongpeitu.value[0];
                                        let moduleInfo = sidebar[s].moduleInfo;
                                        let newContent = {
                                            attrs: {},
                                            data: {
                                                desc: jieshao,
                                                images: [{
                                                    //materialId: "R-20092471763",
                                                    picHeight: peitu.picHeight,
                                                    picUrl: peitu.url ? peitu.url : peitu,
                                                    picWidth: peitu.picWidth,
                                                }],
                                                title: biaoti,
                                            },
                                            errorMsg: "",
                                            guid: "ItemParagraph-1",
                                            materialId: moduleInfo.materialId,
                                            moduleInfo: {dataSchema: moduleInfo.dataSchema},
                                            name: moduleInfo.name,
                                            resourceId: moduleInfo.id,
                                            rule: moduleInfo.rule,
                                        };
                                        content.bodyStruct.value.push(newContent);
                                        content.bodyStruct.value.push(this.model(date, moduleInfo));

                                        if (date.buchongshuoming1_biaoti && date.buchongshuoming1_jieshao && date.buchongshuoming1_peitu) {
                                            if (date.buchongshuoming1_biaoti.value && date.buchongshuoming1_jieshao.value && date.buchongshuoming1_peitu.value) {
                                                let peitu = date.buchongshuoming1_peitu.value[0];
                                                let newContent1 = {
                                                    attrs: {},
                                                    data: {
                                                        desc: date.buchongshuoming1_jieshao.value,
                                                        images: [{
                                                            //materialId: "R-20092471763",
                                                            picHeight: peitu.picHeight,
                                                            picUrl: peitu.url ? peitu.url : peitu,
                                                            picWidth: peitu.picWidth,
                                                        }],
                                                        title: date.buchongshuoming1_biaoti.value,
                                                    },
                                                    errorMsg: "",
                                                    guid: "ItemParagraph-3",
                                                    materialId: moduleInfo.materialId,
                                                    moduleInfo: {dataSchema: moduleInfo.dataSchema},
                                                    name: moduleInfo.name,
                                                    resourceId: moduleInfo.id,
                                                    rule: moduleInfo.rule,
                                                };
                                                content.bodyStruct.value.push(newContent1);
                                                if (date.buchongshuoming2_biaoti && date.buchongshuoming2_jieshao && date.buchongshuoming2_peitu) {
                                                    if (date.buchongshuoming2_biaoti.value && date.buchongshuoming2_jieshao.value && date.buchongshuoming2_peitu.value) {
                                                        let peitu = date.buchongshuoming2_peitu.value[0];
                                                        let newContent2 = {
                                                            attrs: {},
                                                            data: {
                                                                desc: date.buchongshuoming2_jieshao.value,
                                                                images: [{
                                                                    //materialId: "R-20092471763",
                                                                    picHeight: peitu.picHeight,
                                                                    picUrl: peitu.url ? peitu.url : peitu,
                                                                    picWidth: peitu.picWidth,
                                                                }],
                                                                title: date.buchongshuoming2_biaoti.value,
                                                            },
                                                            errorMsg: "",
                                                            guid: "ItemParagraph-4",
                                                            materialId: moduleInfo.materialId,
                                                            moduleInfo: {dataSchema: moduleInfo.dataSchema},
                                                            name: moduleInfo.name,
                                                            resourceId: moduleInfo.id,
                                                            rule: moduleInfo.rule,
                                                        };
                                                        content.bodyStruct.value.push(newContent2);
                                                    }
                                                }
                                            } else if (date.buchongshuoming2_biaoti && date.buchongshuoming2_jieshao && date.buchongshuoming2_peitu) {
                                                if (date.buchongshuoming2_biaoti.value && date.buchongshuoming2_jieshao.value && date.buchongshuoming2_peitu.value) {
                                                    let peitu = date.buchongshuoming2_peitu.value[0];
                                                    let newContent3 = {
                                                        attrs: {},
                                                        data: {
                                                            desc: date.buchongshuoming2_jieshao.value,
                                                            images: [{
                                                                //materialId: "R-20092471763",
                                                                picHeight: peitu.picHeight,
                                                                picUrl: peitu.url ? peitu.url : peitu,
                                                                picWidth: peitu.picWidth,
                                                            }],
                                                            title: date.buchongshuoming2_biaoti.value,
                                                        },
                                                        errorMsg: "",
                                                        guid: "ItemParagraph-3",
                                                        materialId: moduleInfo.materialId,
                                                        moduleInfo: {dataSchema: moduleInfo.dataSchema},
                                                        name: moduleInfo.name,
                                                        resourceId: moduleInfo.id,
                                                        rule: moduleInfo.rule,
                                                    };
                                                    content.bodyStruct.value.push(newContent3);
                                                }
                                            }
                                        } else if (date.buchongshuoming2_biaoti && date.buchongshuoming2_jieshao && date.buchongshuoming2_peitu) {
                                            if (date.buchongshuoming2_biaoti.value && date.buchongshuoming2_jieshao.value && date.buchongshuoming2_peitu.value) {
                                                let peitu = date.buchongshuoming2_peitu.value[0];
                                                let newContent3 = {
                                                    attrs: {},
                                                    data: {
                                                        desc: date.buchongshuoming2_jieshao.value,
                                                        images: [{
                                                            //materialId: "R-20092471763",
                                                            picHeight: peitu.picHeight,
                                                            picUrl: peitu.url ? peitu.url : peitu,
                                                            picWidth: peitu.picWidth,
                                                        }],
                                                        title: date.buchongshuoming2_biaoti.value,
                                                    },
                                                    errorMsg: "",
                                                    guid: "ItemParagraph-3",
                                                    materialId: moduleInfo.materialId,
                                                    moduleInfo: {dataSchema: moduleInfo.dataSchema},
                                                    name: moduleInfo.name,
                                                    resourceId: moduleInfo.id,
                                                    rule: moduleInfo.rule,
                                                };
                                                children[c].props.value.push(newContent3);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        let data = {
                            id: json.id,
                            typeTab: json.typeTab,
                            contentModeId: json.contentModeId,
                            data: content,
                            title: json.title,
                            picUrl: json.picUrl,
                            flag: json.flag,
                            remarks: json.remarks,
                            version: 3
                        };
                        this.listContentAJAX.listAJAX.ajax({
                            url: `/content/admin/${contentType}/domain.content.add.io`,
                            data: {data: JSON.stringify(data)},
                            async: false,
                            type: "post",
                            callback: (data) => {
                                if (data.id) {
                                    Message({
                                        showClose: true,
                                        message: '转换成功',
                                        type: 'success'
                                    });
                                }
                            }
                        })
                    });

                } else {
                    Message({
                        showClose: true,
                        message: '已是新好货结构',
                        type: 'warning'
                    });
                }
            }
        });
    };

    model = (date, moduleInfo) => {
        let pinpailogo = date.pinpailogo.value[0];
        return {
            attrs: {},
            data: {
                desc: date.pinpaijieshao.value,
                images: [{
                    //materialId: "R-20092471763",
                    picHeight: pinpailogo.picHeight,
                    picUrl: pinpailogo,
                    picWidth: pinpailogo.picWidth,
                }],
                title: "品牌介绍",
            },
            errorMsg: "",
            guid: "ItemParagraph-2",
            materialId: moduleInfo.materialId,
            moduleInfo: {dataSchema: moduleInfo.dataSchema},
            name: moduleInfo.name,
            resourceId: moduleInfo.id,
            rule: moduleInfo.rule,
        };
    };

    getContentModeNum = (callback) => {
        this.listContentAJAX.listAJAX.ajax({
            url: "/content/admin/content/contentModeById.io",
            data: {id: 27},
            callback: ({constraint}) => {
                if (callback) {
                    callback(constraint);
                }
            }
        });


    };

    /*findContent = (id, callback) => {//看
        let data = {id: id}, {groupId, contentType} = this.state;
        if (groupId) {
            Object.assign(data, {groupId});
        }
        let upload = setInterval(() => {
            let showContentAJAX = this.bundleLoading.jd.showContentAJAX;
            if (showContentAJAX) {
                clearInterval(upload);
                this.bundleLoading.jd.showContentAJAX.ajax({
                    type: 'post',
                    url: '/content/admin/contentComments/getContentCommentsByContentId.io',
                    data: {contentId: id},
                    callback: (comments) => {
                        this.bundleLoading.jd.showContentAJAX.ajax({
                            url: `/content/admin/${contentType}/domain.content.find.io`,
                            data: data,
                            callback: (json) => {
                                if (json.darenId) {  //根据达人id返回达人名
                                    this.bundleLoading.jd.showContentAJAX.ajax({
                                        type: 'post',
                                        url: '/user/admin/visible/querytalentMessageByAccountId.io',
                                        data: {accountId: json.darenId},
                                        callback: (json20) => {
                                            json.darenTitle = json20.title;
                                            this.setState({showContent: json, comments: comments}, () => {
                                                this.bundleLoading.jd.setState({showContent: json, comments: comments}, callback);
                                            })
                                        }
                                    });
                                } else {
                                    this.setState({showContent: json, comments: comments}, () => {
                                        this.bundleLoading.jd.setState({showContent: json, comments: comments}, callback);
                                    })
                                }
                            }
                        });
                    }
                });

            }
        }, 100)
    };*/
    goSize = (size) => {
        this.setState({pageSize: size}, () => {
            this.goPage();
        });
    };

    goPage = (pageNow = this.state.pageNow, callback) => {
        let {pageSize, contentModeId, state, typeTab, manage, type, seekKey, startTime, endTime, ordId, flag, groupId, largeProcess, isProcessStrComplete, smallProcessId,contentId} = this.state;
        let data = {
            pageSize, pageNow, contentModeId, state, typeTab, manage, type, seekKey, startTime, endTime, ordId, flag,contentId
        };
        let smallProcessIds = largeProcess ? largeProcess.largeProcess.id : undefined;
        if (groupId && smallProcessIds) {
            Object.assign(data, {
                groupId, smallProcessId, isProcessStrComplete
            });
            // data.smallProcessId=smallProcessId;
        }
        this.listData(data, callback);
    };

    IDSort = () => {//ID sort
        this.setState({ordId: 1, defaultSort: false}, () => this.goPage(1))
    };

    timeSort = () => {//time sort
        this.setState({ordId: 0, defaultSort: true}, () => this.goPage(1))
    };

    selectAll = () => {
        let {contents} = this.state;
        this.setState({
            contents: contents.map((item) => {
                item.checked = true;
                return item;
            })
        }, () => {
            this.actionButtons()
        });
    };
    selectClear = () => {
        let {contents} = this.state;
        this.setState({
            contents: contents.map((item) => {
                item.checked = false;
                return item;
            })
        }, () => {
            this.actionButtons();
        });
    };
    selectAgainst = () => {
        let {contents} = this.state;
        this.setState({
            contents: contents.map((item) => {
                item.checked = !item.checked;
                return item;
            })
        }, () => {
            this.actionButtons();
        });
    };
    checked = (env) => {//单项勾选
        let value = env.target.value;
        let checked = env.target.checked;
        this.newChecked({value, checked});
    };

    newChecked = ({value, checked}) => {//单项勾选(new)
        this.setState({
            contents: this.state.contents.map((item) => {
                if (item.id == value) {
                    item.checked = checked;
                }
                return item
            })
        }, () => this.actionButtons())
    };

    checkedState = (env) => {//选中全部某一个状态
        let state = $(env.target).data("state");
        this.newCheckedState({state});
    };

    newCheckedState = ({state}) => {//选中全部某一个状态(new)
        let {contents} = this.state;
        this.setState({
            contents: contents.map((item) => {
                item.checked = item.state == state;
                return item;
            })
        }, () => this.actionButtons());
    };

    checkedSmallProcess = (env) => {//全部选择某一个步骤
        let sorting = $(env.target).data("sorting");
        this.newCheckedSmallProcess({sorting});
    };

    newCheckedSmallProcess = ({sorting}) => {//全部选择某一个步骤(new)
        let {contents} = this.state;
        this.setState({
            contents: contents.map((item) => {
                let smallProcess = item.smallProcess ? item.smallProcess.sorting : '';
                item.checked = smallProcess == sorting;
                return item;
            })
        }, () => {
            this.actionButtons();
        });
    };

    actionButtons = () => {
        let release = true, audit = true, update = true, submit = true, fail = true, synchronizationAuditing = true;
        let {contents} = this.state;
        let xz = [];
        contents.map((item) => {
            if (item.checked) {
                xz.push(item);
            }
        });
        if (xz.length > 0) {
            for (let i in xz) {
                let item = xz[i];
                if (!item.release || item.feedId || item.version != 3) release = false;
                if (!item.release || !item.feedId) update = false;
                if (!item.audit && !(item.modifierAudit && !item.terraceAudit)) audit = false;
                if (!item.submitAudit) submit = false;
                if (item.state == 2 || item.state == 5) fail = false;
                if (!item.feedId) synchronizationAuditing = false;
            }
        } else {
            release = false;
            audit = false;
            update = false;
            submit = false;
            fail = false;
            synchronizationAuditing = false;
        }
        let actionButtons = {release: release, audit: audit, update: update, submit: submit, fail, synchronizationAuditing};
        this.setState({actionButtons: actionButtons});
    };

    batchSubmitFail = () => {//批量失败
        let xz = [], {contents, contentType} = this.state;
        contents.map(item => {
            if (item.checked) {
                xz.push(item.id);
            }
        });
        this.listContentAJAX.listAJAX.ajax({
            url: `/content/admin/${contentType}/domain.content.batchFailure.io`,
            data: {ids: JSON.stringify(xz)},
            callback: () => {
                Message({
                    showClose: true,
                    message: '提交成功',
                    type: 'success'
                });
                this.getContentStatePreview();
            }
        })
    };
    batchSubmitThrough = () => {//批量通过
        let xz = [], {contents, contentType} = this.state;
        contents.map(item => {
            if (item.checked) {
                xz.push(item.id);
            }
        });
        if (xz.length > 0) {
            this.listContentAJAX.listAJAX.ajax({
                url: `/content/admin/${contentType}/domain.content.batchSubmitThrough.io`,
                data: {ids: JSON.stringify(xz)},
                callback: () => {
                    Message({
                        showClose: true,
                        message: '提交成功',
                        type: 'success'
                    });
                    this.getContentStatePreview();
                }
            });
        }
    };

    idsArr = () => {
        let xz = [];
        this.state.contents.map((item) => {
            if (item.checked) {
                xz.push(item.id);
            }
        });
        return xz;
    };

    batchSubmitAudit = () => {
        let xz = [], {contents, contentType} = this.state;
        contents.map(item => {
            if (item.checked) {
                xz.push(item.id);
            }
        });
        if (xz.length > 0) {
            this.listContentAJAX.listAJAX.ajax({
                url: `/content/admin/${contentType}/domain.content.batchSubmitAudit.io`,
                data: {ids: JSON.stringify(xz)},
                callback: () => {
                    Message({
                        showClose: true,
                        message: '提交成功',
                        type: 'success'
                    });
                    this.getContentStatePreview();
                }
            });
        }
    };

    shiftContent = (eventKey) => { //转移作者
        let xz = [], {contents, contentType, groupId, governmentManage} = this.state;
        contents.map((item) => {
            if (item.checked) {
                xz.push(item.id);
            }
        });
        if (xz.length > 0) {
            let name = '';
            governmentManage.map(item => {
                if (item.id == eventKey) {
                    name = item.name;
                }
            });
            let data = {ids: JSON.stringify(xz), shiftManId: eventKey};
            if (groupId) {
                data.groupId = groupId;
            }
            MessageBox.confirm(`确定将这条内容转移给${name}？如果你不是内容的创建者，将会转移失败`, '提示', {
                type: 'success'
            }).then(() => {
                this.listContentAJAX.listAJAX.ajax({
                    type: 'post',
                    url: `/content/admin/${contentType}/domain.content.shift.io`,
                    data: data,
                    callback: () => {
                        Message({
                            message: '提交成功',
                            type: 'success'
                        });
                        this.getContentStatePreview();
                    }
                });
            }).catch(() => {
                Message({
                    type: 'info',
                    message: '已取消提交'
                });
            });
        } else {
            Message({
                showClose: true,
                message: '至少需要选中一条内容',
                type: 'warning'
            });
        }
    };
    pattern = (data) => {
        let {contentMode} = this.state;
        for (let i in data) {
            contentMode.push(data[i]);
        }
        let item = this.patternRemoval(contentMode);
        this.setState({contentMode: item});
    };
    patternRemoval = (arr) => {
        let result = [];
        for (let i in arr) {
            let isRepeated = false;
            for (let j in result) {
                if (arr[i].id == result[j].id) {
                    isRepeated = true;
                    break;
                }
            }
            if (!isRepeated) {
                result.push(arr[i]);
            }
        }
        return result;
    };
    batchTurnNextStep = () => {//批量转下一步
        let xz = [], {contents} = this.state;
        let flag = true;//是否相同
        let checkedflag = false;//是否勾选
        let groupId = '';
        contents.map((item) => {
            if (item.checked) {
                checkedflag = true;
                if (xz.length <= 0) {
                    xz.push({contentIds: item.id, sorting: item.smallProcess.sorting});
                    groupId = item.creator;
                } else {
                    for (let i = 0; i < xz.length; i++) {
                        if (xz[i].sorting != item.smallProcess.sorting) {
                            Message({
                                showClose: true,
                                message: '批量转下一步必须当前步骤相同',
                                type: 'warning'
                            });
                            flag = false;
                            return false;
                        }
                    }
                    xz.push({contentIds: item.id, sorting: item.smallProcess.sorting});
                }
            }
        });
        if (!checkedflag) {
            Message({
                showClose: true,
                message: '请选择勾选一个内容进行转下一步',
                type: 'warning'
            });
            return false;
        }
        if (flag) {
            this.listContentAJAX.listAJAX.ajax({
                type: 'post',
                url: '/content/admin/manageGroup/upContentStep.io',
                data: {contentIds: JSON.stringify(xz), groupId: groupId},
                callback: () => {
                    Message({
                        showClose: true,
                        message: '转下一步成功',
                        type: 'success'
                    });
                }
            });
        }
    };

    render() {
        let listIdWith = $("#listId").width();
        return (
            <div id='listId'>{/*内容列表停机维护，明早上班恢复*/}
                <AJAX ref={e => this.listAJAX = e}>
                    <ListMode getContentStatePreview={this.getContentStatePreview}
                              contentMode={this.state.contentMode} modePaging={this.state.modePaging}
                              contentModeId={this.state.contentModeId} modegoPage={this.modegoPage}
                              setPaState={this.setThisState}/>
                    <ListStepButton contentStatePreview={this.state.contentStatePreview} state={this.state} contentHistory={this.state.contentHistory}
                                    params={this.props.match.params}
                                    contentHistoryChange={(value) => this.setState(Object.assign(this.state, value), () => {
                                        this.getContentStatePreview(1)
                                    })}
                                    getContentByState={this.getContentByState} listData={this.listData}
                                    goPage={this.goPage} seekKey={this.state.seekKey} id={this.state.contentId}
                                    smallProcessList={this.state.smallProcessList}
                                    cols={this.state.cols} contentType={this.state.contentType}
                                    manage={this.state.manage}
                                    getContentStatePreview={this.getContentStatePreview}
                                    setPaState={this.setThisState} newVersion={this.state.version}
                                    version={() => this.setState({version: !this.state.version}, () => this.versionCookie())}
                                    IDSort={this.IDSort} timeSort={this.timeSort} defaultSort={this.state.defaultSort}/>
                    <ListContent contentMode={this.state.contentMode} ref={(e) => {
                        if (e) this.listContentAJAX = e
                    }}
                                 contents={this.state.contents} pContentModeId={this.state.contentModeId}
                                 actionButtons={this.state.actionButtons} dapContentMode={this.state.dapContentMode}
                                 checked={this.checked} newChecked={this.newChecked}
                                 selectAll={this.selectAll}
                                 selectAgainst={this.selectAgainst}
                                 selectClear={this.selectClear}
                                 batchSubmitThrough={this.batchSubmitThrough} batchSubmitFail={this.batchSubmitFail}
                                 batchSubmitAudit={this.batchSubmitAudit}
                                 batchTurnNextStep={this.batchTurnNextStep}
                                 setPaState={this.setThisState}
                                 checkedState={this.checkedState} newCheckedState={this.newCheckedState}
                                 governmentManage={this.state.governmentManage}
                                 getGovernmentManage={this.getGovernmentManage}
                                 seletContent={this.seletContent} newSelectContent={this.newSelectContent}
                                 rotatingStructure={this.rotatingStructure} contentType={this.state.contentType}
                                 manage={this.state.manage} goPage={this.goPage} pageNow={this.state.pageNow}
                                 IDSort={this.IDSort} timeSort={this.timeSort} defaultSort={this.state.defaultSort}
                                 getContentStatePreview={this.getContentStatePreview}
                                 shiftContent={this.shiftContent} smallProcessList={this.state.smallProcessList}
                                 cols={this.state.cols} groupId={this.state.groupId}
                                 checkedSmallProcess={this.checkedSmallProcess}
                                 newCheckedSmallProcess={this.newCheckedSmallProcess}
                                 pattern={this.pattern} idsArr={this.idsArr} newVersion={this.state.version}
                                 version={() => this.setState({version: false})}
                    />
                    <Pagination layout="total, sizes, prev, pager, next, jumper" total={this.state.count}
                                pageSizes={[30, 60, 90]}
                                pageSize={this.state.pageSize} currentPage={this.state.pageNow}
                                onCurrentChange={this.goPage} onSizeChange={this.goSize} style={{marginTop: '8px'}}/>

                    {this.state.showContentJudge &&
                    <BundleLoading ref={e => this.bundleLoading = e} load={listShowModelContainer} comments={this.state.comments} listIdWith={listIdWith}
                                   showContent={this.state.showContent} groupId={this.state.groupId}
                                   smallProcessList={this.state.smallProcessList} contentType={this.state.contentType}
                                   contentMode={this.state.contentMode} pageNow={this.state.pageNow}
                                   goPage={this.goPage}
                                   getContentStatePreview={this.getContentStatePreview}/>}{/*ListShowModel 看的模态*/}
                </AJAX>
            </div>
        )
    }
}

PostList.defaultProps = {};

export default PostList;

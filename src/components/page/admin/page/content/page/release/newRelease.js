/**
 * Created by 石英 on 2018/10/15 0015下午 4:41.
 */

import React from 'react';
import $ from 'jquery';
import ReactChild from "../../../../../../lib/util/ReactChild";
import {
    Pagination,
    Message,
    MessageBox,
    Layout,
    Card,
    Checkbox,
    Dropdown,
    Dialog,
    Button,
    Tabs,
    Notification,
    Select,
    Input,
    Alert,
    Cascader,
    Radio
} from 'element-react';
import 'element-theme-default';
import {
    getIdContent,
    getWtList,
    getQdList,
    getLXList,
    newTemplate,
    releaseSuccess,
    releaseFail,
    daren_list,
    darenId_change,
    getHDList,
    getDarenId,
    getNewWtList,
} from './components/take';
import {darenData, talentNick, talentIndex} from './components/darenData';
import {clone, getUrlPat} from "../../../../../../lib/util/global";
import {InvitationActivities} from '../../../../components/PersonSelection';
import {dynamicAnalysis} from '../components/contentCurrency'

class ReleaseAndSynchronization extends ReactChild {
    constructor(props) {
        super(props);
        let {contentType, ids, direction} = this.props.match.params;
        this.state = {
            addressData: {//链接地址数据
                contentType, direction, ids: ids.split('_'),
            },
            releaseCondition: {
                publish: 0,//发布方向(微淘||渠道||邀请我的活动||自定义链接)
                weitao: [],//微淘选择
                channel: 0,//渠道名称
                subChannel: 0,//子渠道名称
                subChannelType: 0,//子渠道类型名称
                activityType: 0,//邀请我的活动类型
                link: "",//自定义链接
                preserve:'',//历史记录渠道
            },
            releaseListData: {
                weitao: [],//微淘列表
                channel: [],//渠道列表
                subChannel: [],//子渠道列表
                subChannelType: [],//子渠道类型列表
                activityType: [],//邀请我的活动类型列表
                preserve:[],//历史记录渠道列表
            },
            daren: {
                name: '暂无数据',//登录达人名称
                list: [],//选择达人列表
                releaseId: "0",//选择发布达人
                data: undefined,//选择发布达人详细数据
            },
            typeArray: [],//内容类型数组
            promptContent: [],//提示数组
            showContent: [],//提交内容

            releaseContent: [],//发布内容
            synchronizationContent: [],//同步内容
            singleContent: [],
            releaseNum: 0,//发布成功数量
            failNum: 0,//发布失败数量
            putBottom: true,//置于底部
            isSynchronization: true,
            isTalentNick:true,
            activityId:0,
            channelId:0,
            isTestingQuality:false,
        }
    }

    multipleType = ({showContent, callback}, typeArray = []) => {//发布内容类型数组
        let {direction}=this.state.addressData;
        if(direction=='release'){
            showContent.forEach(item => {
                if (typeArray.indexOf(item.typeTab) < 0) {
                    typeArray.push(item.typeTab)
                }
            });
            if (typeArray.length > 1) {
                Message({
                    duration: 0,
                    showClose: true,
                    message: `多个类型[${typeArray.join('][')}]内容，请关闭本页面，返回内容列表页面确认发布内容并重新发布`,
                    type: 'warning'
                });
            }
            callback({typeArray});
        }else {
            callback({typeArray:['潮女']});
        }
    };

    matchingDomain = (focusContentCate) => {//判断发布类型是否对应领域
        let {typeArray} = this.state;
        let arr = [{
            type: '潮女', content: '美搭'
        }, {
            type: '潮男', content: '型男'
        }, {
            type: '美妆', content: '美妆个护'
        }, {
            type: '母婴', content: '母婴'
        }, {
            type: '户外', content: '运动'
        }, {
            type: '数码', content: '数码科技'
        }, {
            type: '家居', content: '居家'
        }, {
            type: '文体', content: ''
        }, {
            type: '汽车', content: ''
        }, {
            type: '美食', content: '美食'
        }];
        let correct = arr.some(item => {
            if (item.type == typeArray[0]) {
                return item.content.indexOf(focusContentCate) > -1
            }
        });
        if (!correct && focusContentCate) {
            Message({
                duration: 0,
                showClose: true,
                message: `当前【发布内容：${typeArray[0]}】与选择账号【专注领域：${focusContentCate}】有误`,
                type: 'warning'
            });
        }
    };

    repeatNumber = (list, accountId, arr = []) => {//剔除登录达人
        for (let l in list) {
            if (list[l].accountId != accountId) {
                arr.push(list[l]);
            }
        }
        return arr;
    };

    componentDidMount() {//第一次
        let {addressData, daren,releaseListData} = this.state;
        let {ids, contentType, direction} = addressData;
        getIdContent({contentType, ids}, (data) => {//依据ids拿取内容
            this.multipleType({
                showContent: data, callback: ({typeArray}) => {//判断内容类型（more||less）
                    this.setState({showContent: [...data], typeArray: typeArray}, () => {
                        talentNick((us) => {//拿取登录人数据
                            if (us) {
                                daren.name = us.name;
                                daren_list((list) => {//拿取授权达人列表
                                    daren.list = direction == 'synchronization'?list:this.repeatNumber(list, us.accountId);
                                    this.setState({daren, [`${direction}Content`]: data,isTalentNick:false}, () => {
                                        if (direction == 'synchronization') {
                                            //this.synchronizationContent(data, this.repeatNumber(list, us.accountId), us.accountId);
                                            this.synchronizationContent(data, list);
                                        }
                                    });
                                });
                            } else {
                                daren_list((list) => {//拿取授权达人列表
                                    daren.list = list;
                                    this.setState({daren, [`${direction}Content`]: data,isTalentNick:false}, () => {
                                        if (direction == 'synchronization') {
                                            this.synchronizationContent(data, list);
                                        }
                                    });
                                });
                            }
                        })
                    });
                }
            });
        });
        let scrollParent = $('.dom_id');
        scrollParent.scroll(() => {
            let cl = $('.dom_id');
            let viewH = cl.height();//可见高度
            let contentH = cl.get(0).scrollHeight;//内容高度
            let scrollTop = cl.scrollTop();//滚动高度
            if (viewH + scrollTop == contentH) {
                this.setState({putBottom: true});
            } else {
                this.setState({putBottom: false});
            }
        });
        releaseListData.preserve=this.integrationCookie({type:'get'});
        let testingQuality=this.getCookie('testingQuality');
        if(testingQuality=='true'){
            this.setState({isTestingQuality:true})
        }else if(testingQuality=='false'){
            this.setState({isTestingQuality:false})
        }else {
            MessageBox.confirm(`是否启用诊断`, '提示', {
                type: 'info'
            }).then(() => {
                this.saveQualityData({name:'true'},()=>{
                    this.setState({isTestingQuality:true})
                });
            }).catch(() => {
                this.saveQualityData({name:'false'},()=>{
                    this.setState({isTestingQuality:false})
                });
            });
        }
        this.setState({releaseListData});
    }

    saveQualityData=({name},callback)=>{
        let d = new Date();
        d.setTime(d.getTime() + (15 * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = "testingQuality=" + name + "; " + expires;
        callback();
    };

    getDarenDetails = (id = 0) => {//获取达人单个详情
        let {list} = this.state.daren;
        let obj = undefined;
        for (let t in list) {
            if (list[t].id == id) {
                obj = list[t];
            }
        }
        return obj;
    };

    darenIdChange = ({id}) => {//daren达人信息
        let {daren, releaseCondition, releaseListData} = this.state;
        this.setState({
            daren: Object.assign(daren, {
                data: id != 0 ? this.getDarenDetails(id) : undefined,
                releaseId: id,
            }),
            releaseCondition: Object.assign(releaseCondition, {
                publish: 0,//发布方向(微淘||渠道||自定义链接)
                weitao: [],//微淘选择
                channel: 0,//渠道名称
                subChannel: 0,//子渠道名称
                subChannelType: 0,//子渠道类型名称
                activity: 0,//邀请我的活动
                activityType: 0,//邀请我的活动类型
                link: "",//自定义链接
            }),
            releaseListData: Object.assign(releaseListData, {
                weitao: [],//微淘列表
                channel: [],//渠道列表
                subChannel: [],//子渠道列表
                subChannelType: [],//子渠道类型列表
                activityType: [],//邀请我的活动类型列表
            }),
        }, () => {
            let object = {};
            if (id != 0) {
                Object.assign(object, {
                    talentId: +id
                })
            }
            darenId_change(object, () => {
                //this.automaticExpansion('publish');
            })
        });
    };

    automaticExpansion = (id) => {//虚拟点击
        let btn = document.getElementById(id);
        let event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, true, document.defaultView, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        btn.dispatchEvent(event);
    };

    getQD = (value, subChannel, obj = {}) => {//频道选择=>子频道拿取
        subChannel.forEach(item => {
            if (item.name == value) {
                obj = item.activityList;
            }
        });
        return obj;
    };

    newWeitaoMerge = (res, array = []) => {//array向内合并=>获取微淘列表事件
        let str='',arr=[];
        for (let r=0,l=res.length;r<l;r++ ){
            if(str.indexOf(res[r].title)<0){
                str+=`|${res[r].title}|`;
                arr.push(res[r]);
            }
        }
        arr.forEach(item=>{
            let main={
                value:item.title,
                label:item.title,
                children:item.blockList.map(it=>{
                    return {
                        value:it.props.title,
                        label:it.props.title,
                        children:it.props.btnList.map(btn=>{
                            if(btn.text!= '多条推送'){
                                return{
                                    value:`${btn.url}||${btn.text}`,
                                    label:btn.text,
                                }
                            }else {
                                return{
                                    value:`${btn.url}||${btn.text}`,
                                    label:btn.text,
                                    disabled: true,
                                }
                            }
                        })
                    }
                })
            };
            array.push(main);
        });
        return array;
    };

    arrayValue=({url})=>{//preserve 渠道||活动
        let {releaseListData} = this.state;
        let {preserve}=releaseListData,string='';
        preserve.forEach(item=>{
            if(item.url==url){
                string=item.name;
            }
        });
        return string.split('/').length>2?'渠道':'活动';
    };

    conditionChange = ({value, name,valueName}) => {//选择条件改变事件
        let {releaseCondition, releaseListData} = this.state;
        if (name === 'weitao') {
            releaseCondition[name] = value;
        } else if (name === 'channel') {
            Object.assign(releaseCondition, {
                [name]: value,
                subChannel: 0,
                subChannelType: 0
            });
            Object.assign(releaseListData, {
                subChannel: this.getQD(value, releaseListData.channel),
                subChannelType: [],
            });
        } else if(name==='preserve'){
            let array=value.split('--');
            if(array.length>1){
                releaseCondition[name] = '';
                this.setState({releaseCondition},()=>{
                    if(this.arrayValue(value)=='渠道'){
                        getLXList(+array[1], (data) => {
                            releaseCondition[name] = value;
                            this.setState({releaseCondition, releaseListData,surplus:`(今日剩余投稿数:${data.remainCount})`}, this.setStateAfter({value, name,valueName}));
                        });
                    }else{
                        getHDList(+array[1], (data) => {
                            releaseCondition[name] = value;
                            this.setState({releaseCondition, releaseListData,surplus:`(今日剩余投稿数:${data.remaindeToDayActivityStr})`}, this.setStateAfter({value, name,valueName}));
                        });
                    }
                })
            }else {
                releaseCondition[name] = value;
                this.setState({releaseCondition, releaseListData,surplus:''}, this.setStateAfter({value, name,valueName}));
            }
        }else {
            releaseCondition[name] = value;
        }
        if(name!='preserve'){
            this.setState({releaseCondition, releaseListData}, this.setStateAfter({value, name,valueName}));
        }
    };

    setStateAfter = ({name, value,valueName}) => {//改变事件之后
        let {releaseListData, releaseCondition} = this.state;
        if (name === 'publish') {
            talentIndex((accountData) => {
                this.matchingDomain(accountData.focusContentCate);
                if (value === 1) {
                    getNewWtList((list) => {
                        releaseListData.weitao = this.newWeitaoMerge(list);
                        releaseCondition.weitao = [];
                        this.setState({releaseListData, releaseCondition})
                    });
                } else if (value === 2) {
                    getQdList((list) => {
                        releaseListData.channel = list;
                        this.setState({releaseListData});
                    })
                } else if (value === 3 && this.invitationActivities) {
                    releaseListData.activityType = [];
                    releaseCondition.activityType = 0;
                    this.setState({releaseListData, releaseCondition}, () => {
                        this.invitationActivities.darenChangeTake();
                    })
                }
            });
        } else if (name === 'subChannel') {
            this.setState({channelId:value},()=>{
                getLXList(value, (data) => {
                    releaseCondition.subChannelType = 0;
                    releaseListData.subChannelType = data.typeList;
                    this.setState({releaseCondition, releaseListData}, () => {

                    });
                });
            })
        } else if (name === 'activity') {
            this.setState({activityId:value},()=>{
                getHDList(value, (data) => {
                    releaseCondition.activityType = 0;
                    releaseListData.activityType = data.typeList;
                    this.setState({releaseCondition, releaseListData,activityName:valueName});
                });
            })
        }
    };

    pushHomePage = (callback) => {
        MessageBox.confirm(`是否推送到主页？`, '提示', {
            type: 'info'
        }).then(() => {
            this.setState({pushPage: true}, () => callback())
        }).catch(() => {
            this.setState({pushPage: false}, () => callback())
        });
    };

    isTemplate = (url) => {
        let {contentType} = this.state.addressData;
        let names = [];
        switch (contentType) {
            case "cheesy":
                names = ["ContentItem", "item2", "item",'yhhatlas'];
                break;
            case "post":
                names = ["ContentPost", "post", "qa", "ContentStruct", "itemrank", "iteminventory", "shopinventory"];
                break;
            case "album":
                names = ["ContentItemAlbum"];
                break;
            case "dap":
                names = ["ContentCollection", "collection", "collection2", "magiccollocation"];
                break;

        }
        let template = getUrlPat(url, "template");
        if (names.indexOf(template) >= 0) {
            this.getTemplate(url);
        } else {
            MessageBox.confirm(`内容类型和发布渠道不一致，是否继续发布？(短视频忽略)`, '提示', {
                type: 'info'
            }).then(() => {
                this.getTemplate(url);
            }).catch(() => {
                Message({
                    showClose: true,
                    message: `已取消发布`,
                    type: 'info'
                });
            });
        }
    };

    prompt = (content) => {//添加提示
        let {promptContent, putBottom} = this.state;
        promptContent.push(content);
        this.setState({promptContent}, () => {
            if (putBottom) {
                $('.dom_id').scrollTop(999999999)
            }
        })
    };

    getUrl = ({actions, name}, url = '') => {//通过批量类型拿取链接
        actions.forEach(item => {
            if (item.name == name) {
                url = item.url;
            }
        });
        return url;
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

    synchronizationContent = (showContent, list, darenId) => {//同步筛选内容
        let get_daren_id = (darenId, id) => {
            for (let l in list) {
                if (list[l].accountId == darenId) {
                    id = list[l].id;
                    break;
                }
            }
            return id;
        };
        let [arr, arr1, arr2, arr3] = [[], [], [], []];
        for (let l in list) {
            if (list[l].cookieIsFailure) {
                arr.push(list[l].accountId);
            }
        }
        if (darenId && $.inArray(darenId, arr) < 0) {
            arr.push(parseInt(darenId));
        }
        for (let s in showContent) {
            if (showContent[s].darenId) {
                if ($.inArray(showContent[s].darenId, arr) > -1) {
                    showContent[s].daren_id = get_daren_id(showContent[s].darenId);
                    arr1.push(showContent[s]);
                } else {
                    arr2.push(showContent[s].title);
                }
            } else {
                arr1.push(showContent[s]);
            }
        }
        this.setState({
            synchronizationContent: arr1,
            contentAlert: arr2.length > 0 ? "因未授权或授权失效，需要授权同步的文案有《" + arr2.join("》《") + "》" : "",
            //noIdContentAlert: arr3.length > 0 ? "因缺少达人id字段，需要选择达人号同步的文案有《" + arr3.join("》《") + "》" : "",
            isSynchronization: false,
        });

    };

    getTemplate = (url, pd = false) => {//发布获取模板
        let {releaseContent, urlName = '', releaseNum, failNum} = this.state;
        if (releaseContent.length > 0) {
            this.prompt({text: "开始获取模板"});
            let con = releaseContent.shift();
            let analysis = this.urlAnalysis(url);
            newTemplate.getNewWeiTao(analysis, (config) => {
                this.setState({
                    config: config,
                    singleContent: [con],
                    releaseContent: releaseContent,
                    analysis: analysis,
                    showContent: this.isShow({id: con.id, isState: 3})
                }, () => {
                    if (config.formError) {
                        this.prompt({text: "获取模板失败提示：" + config.formError, type: "alert:danger"});
                        this.setState({
                            failNum: failNum + 1,
                            showContent: this.isShow({id: con.id, isState: 2})
                        }, () => {
                            this.getTemplate(url, pd);
                        })
                    } else {
                        this.prompt({text: "获取模板成功.准备开始发布"});
                        let releaseUrl = this.getUrl({actions: config.actions, name: urlName});
                        this.bingFB(releaseUrl, pd, (pd) => {
                            this.getTemplate(url, pd);
                        });
                    }
                });
            }, (isFewerTimes, callback) => {
                if (isFewerTimes) {
                    this.prompt({
                        buts: [{text: "重新获取数据", bsStyle: "info"}],
                        type: "button",
                        callback: () => callback()
                    });
                } else {
                    this.prompt({text: "多次重新获取数据失败，可以尝试重新授权解决", type: "alert:danger"});
                    this.prompt({
                        buts: [{text: "重新获取数据", bsStyle: "info"}],
                        type: "button",
                        callback: () => callback(false)
                    });
                    this.prompt({
                        buts: [{text: "重新授权", bsStyle: "info"}],
                        type: "button",
                        callback: () => callback(true)
                    })
                }
            });
        } else {
            this.prompt({text: "发布结束"});
            MessageBox.confirm(`成功发布${releaseNum}条，发布失败${failNum}条，发布结束,您确定要关闭标签?`, '提示', {
                type: 'info'
            }).then(() => {
                window.close();
            }).catch(() => {
                Message({
                    showClose: true,
                    message: `已取消关闭标签`,
                    type: 'info'
                });
            });
        }
    };

    screen = ({data, list, feedId}, callback) => {
        let {showContent} = this.state;
        let object = {};
        list.forEach(item => {
            if (item.accountId == data.id) {
                object = item;
            }
        });
        let newContent = showContent.map(item => {
            if (item.feedId == feedId) {
                item.daren_id = object.id;
            }
            return item;
        });
        this.setState({showContent: newContent}, () => {
            if (object.cookieUpDate && object.cookieIsFailure) {
                callback(true, object);
            } else {
                this.prompt({text: "内容的达人id授权失效或未授权，自动跳过该条内容同步"});
                callback();
            }
        })
    };

    getSynchronization = (pd = false) => {//同步获取模板
        this.setState({user: ''}, () => {
            let {synchronizationContent, urlName = '', releaseNum, failNum, daren} = this.state;
            if (synchronizationContent.length > 0) {
                this.prompt({text: "开始获取模板"});
                let con = synchronizationContent.shift();
                let analysis = {id: con.feedId}, obj = {};
                let setDarenId = (obj) => {
                    this.setState({tb:obj,isTb:true},()=>{
                        darenId_change(obj, () => {
                            newTemplate.getNewWeiTao(analysis, (config) => {
                                this.setState({
                                    config: config,
                                    singleContent: [con],
                                    synchronizationContent: synchronizationContent,
                                    analysis: analysis,
                                    showContent: this.isShow({id: con.id, isState: 3})
                                }, () => {
                                    if (config.formError) {
                                        this.prompt({text: "获取模板失败提示：" + config.formError, type: "alert:danger"});
                                        this.setState({
                                            failNum: failNum + 1,
                                            showContent: this.isShow({id: con.id, isState: 2})
                                        }, () => {
                                            this.getSynchronization(pd);
                                        });
                                    } else {
                                        this.prompt({text: "获取模板成功.准备开始同步"});
                                        let releaseUrl = this.getUrl({actions: config.actions, name: urlName});
                                        this.bingFB(releaseUrl, pd, (pd) => {
                                            this.getSynchronization(pd);
                                        });
                                    }
                                });
                            }, (isFewerTimes, callback) => {
                                if (isFewerTimes) {
                                    this.prompt({
                                        buts: [{
                                            text: "重新获取数据",
                                            bsStyle: "info"
                                        }], type: "button", callback: () => callback()
                                    });
                                } else {
                                    this.prompt({text: "多次重新获取数据失败，可以尝试重新授权解决", type: "alert:danger"});
                                    this.prompt({
                                        buts: [{text: "重新获取数据", bsStyle: "info"}],
                                        type: "button",
                                        callback: () => callback(false)
                                    });
                                    this.prompt({
                                        buts: [{text: "重新授权", bsStyle: "info"}],
                                        type: "button",
                                        callback: () => callback(true)
                                    })
                                }
                            });
                        });
                    })
                };
                if (con.daren_id) {
                    Object.assign(obj, {
                        talentId: con.daren_id
                    });
                    setDarenId(obj);
                } else {
                    getDarenId(con.feedId, (data) => {
                        this.screen({data: data, list: daren.list, feedId: con.feedId}, (judge, object) => {
                            if (judge) {
                                Object.assign(obj, {
                                    talentId: object.id
                                });
                                setDarenId(obj);
                            } else {
                                this.setState({
                                    synchronizationContent,
                                    failNum: failNum + 1,
                                    showContent: this.isShow({id: con.id, isState: 2})
                                }, () => {
                                    this.getSynchronization(pd);
                                })
                            }
                        });
                    });
                }
            } else {
                this.prompt({text: "同步结束"});
                MessageBox.confirm(`成功同步${releaseNum}条，同步失败${failNum}条，同步结束,您确定要关闭标签?`, '提示', {
                    type: 'info'
                }).then(() => {
                    window.close();
                }).catch(() => {
                    Message({
                        showClose: true,
                        message: `已取消关闭标签`,
                        type: 'info'
                    });
                });
            }
        });
    };

    isShow = ({id, isState}) => {
        return this.state.showContent.map(item => {
            if (item.id === id) {
                item.releaseResults = isState;
            }
            return item;
        });
    };

    getTestUrl=(array,url='')=>{
        array.forEach(item=>{
            if(item.name=='quality'){
                url=item.url;
            }
        });
        return url;
    };

    quality=(array)=>{
        let str='';
        array.forEach(item=>{
            let str1='';
            if(typeof  item.value=='string'){
                str1=item.value;
                str+=`${item.title}:[【${str1}】`;
            }else if(typeof  item.value=='object'){
                if(item.value instanceof Array){
                    item.value.forEach((img,index)=>{
                        str1+=`【图${index+1}:${img}】`
                    });
                    str+=`${item.title}:${str1}`;
                }
            }
        });
        return str;
    };

    bingFB = (url = null, pd = false, callback) => {
        let newConfig = clone(this.state.config);
        let {singleContent, releaseNum, failNum, pushPage,config,daren,isTestingQuality} = this.state;
        if (singleContent.length > 0) {
            let content = singleContent.shift();
            let accountExec=daren.releaseId=='0'?{}:{talentId:+daren.releaseId};
            if(this.state.isTb){
                accountExec=this.state.tb;
            }
            dynamicAnalysis.dataReorganization({
                config:newConfig,showContent:content,pushPage,accountExec:accountExec,callback:({newConfig,totalMessage})=>{
                    if(totalMessage){
                        let message=totalMessage;
                        this.prompt({text: "发布失败" + message, type: "alert:danger"});
                        if (this.state.failCl == 1) {
                            this.bingFB(url, pd, callback);
                        } else if (this.state.failCl == 2) {
                            releaseFail(content.id, message, (success) => {
                                if (success) {
                                    this.prompt({text: "已将内容设置为审核失败", type: "alert"});
                                } else {
                                    this.prompt({text: "将内容设置为审核失败未成功", type: "alert"});
                                }
                                this.bingFB(url, pd, callback);
                            });
                        } else {
                            this.setState({bottom: true}, () => {
                                this.prompt({
                                    buts: [{text: "发布失败跳过", v: 1}, {text: "跳过,并设置为审核失败", v: 2}],
                                    type: "button",
                                    callback: (data) => {
                                        let v = data.v;
                                        if (v == 1) {
                                            this.setState({failCl: 1}, () => {
                                                this.bingFB(url, pd, callback);
                                            })
                                        } else if (v == 2) {
                                            this.setState({failCl: 2}, () => {
                                                releaseFail(content.id, message, (success) => {
                                                    if (success) {
                                                        this.prompt({text: "已将内容设置为审核失败", type: "alert"});
                                                    } else {
                                                        this.prompt({text: "将内容设置为审核失败未成功", type: "alert"});
                                                    }
                                                    this.bingFB(url, pd, callback);
                                                });
                                            })
                                        } else {
                                            this.bingFB(url, pd, callback);
                                        }
                                    }
                                });
                            });
                        }
                    }else {
                        let isQualityEvent=(qualityConfig)=>{
                            newConfig=qualityConfig?qualityConfig:newConfig;
                            let submissionTemplate = (url, pd) => {
                                this.submissionTemplate(newConfig, url, content, (success, message) => {
                                    if (success) {
                                        this.setState({
                                            singleContent: singleContent,
                                            releaseNum: releaseNum + 1,
                                            showContent: this.isShow({id: content.id, isState: 1})
                                        }, () => {
                                            if (!pd) {
                                                url = false;
                                            }
                                            let st = setInterval(() => {
                                                clearInterval(st);
                                                this.bingFB(url, pd, callback);
                                            }, 2000);
                                        });
                                    } else {
                                        this.setState({
                                            singleContent: singleContent,
                                            failNum: failNum + 1,
                                            showContent: this.isShow({id: content.id, isState: 2})
                                        }, () => {
                                            this.prompt({text: "发布失败：" + message, type: "alert:danger"});
                                            if (this.state.failCl == 1) {
                                                this.bingFB(url, pd, callback);
                                            } else if (this.state.failCl == 2) {
                                                releaseFail(content.id, message, (success) => {
                                                    if (success) {
                                                        this.prompt({text: "已将内容设置为审核失败", type: "alert"});
                                                    } else {
                                                        this.prompt({text: "将内容设置为审核失败未成功", type: "alert"});
                                                    }
                                                    this.bingFB(url, pd, callback);
                                                });
                                            } else {
                                                this.setState({bottom: true}, () => {
                                                    this.prompt({
                                                        buts: [{text: "发布失败跳过", v: 1}, {text: "跳过,并设置为审核失败", v: 2}],
                                                        type: "button",
                                                        callback: (data) => {
                                                            let v = data.v;
                                                            if (v == 1) {
                                                                this.setState({failCl: 1}, () => {
                                                                    this.bingFB(url, pd, callback);
                                                                })
                                                            } else if (v == 2) {
                                                                this.setState({failCl: 2}, () => {
                                                                    releaseFail(content.id, message, (success) => {
                                                                        if (success) {
                                                                            this.prompt({text: "已将内容设置为审核失败", type: "alert"});
                                                                        } else {
                                                                            this.prompt({text: "将内容设置为审核失败未成功", type: "alert"});
                                                                        }
                                                                        this.bingFB(url, pd, callback);
                                                                    });
                                                                })
                                                            } else {
                                                                this.bingFB(url, pd, callback);
                                                            }
                                                        }
                                                    });
                                                });
                                            }
                                        });
                                    }
                                });
                            };
                            if (url) {
                                let zt = setInterval(() => {
                                    clearInterval(zt);
                                    submissionTemplate(url, pd);
                                }, 2000);
                            } else {
                                let buts = [];
                                let actions = this.state.config.actions;
                                for (let i in actions) {
                                    let item = actions[i];
                                    if (item.name != "preview"&&item.name !='quality') {
                                        buts.push({name: item.name, url: item.url, text: item.text, pd: false});
                                        buts.push({
                                            name: item.name,
                                            url: item.url,
                                            text: "批量" + item.text,
                                            pd: true,
                                            bsStyle: "info"
                                        });
                                    }
                                }

                                this.prompt({
                                    buts: buts, type: "button", callback: (data) => {
                                        this.setState({urlName: data.pd ? data.name : ""}, () => {
                                            submissionTemplate(data.url, data.pd);
                                        });
                                    }
                                });
                            }
                        };
                        let Quality=this.getTestUrl(newConfig.actions);
                        if(Quality&&isTestingQuality){
                            this.prompt({text: "开始内容诊断"});
                            newTemplate.testingQuality({
                                url:Quality,config:newConfig,callback:(array,qualityConfig)=>{//新添
                                    this.prompt({text: "诊断结束!该内容已保存至达人草稿箱", type: "alert:warning"});
                                    let newUrl='';
                                    qualityConfig.actions.forEach(item=>{
                                        if(item.name=='quality'){
                                            newUrl=item.url;
                                        }
                                    });
                                    let id=this.urlAnalysis(newUrl)['_draft_id'];
                                    let {analysis, user} = this.state;
                                    let message=this.quality(array);
                                    this.userData(content, id, analysis, user, ()=>{
                                        if(array.length>0){
                                            this.prompt({text: "内容诊断提示：" + message, type: "alert:danger"});
                                            if (this.state.failCl == 1) {
                                                this.bingFB(url, pd, callback);
                                            } else if (this.state.failCl == 2) {
                                                releaseFail(content.id, message, (success) => {
                                                    if (success) {
                                                        this.prompt({text: "已将内容设置为审核失败", type: "alert"});
                                                    } else {
                                                        this.prompt({text: "将内容设置为审核失败未成功", type: "alert"});
                                                    }
                                                    this.bingFB(url, pd, callback);
                                                });
                                            } else {
                                                this.setState({bottom: true}, () => {
                                                    this.prompt({
                                                        buts: [{text: "发布失败跳过", v: 1}, {text: "跳过,并设置为审核失败", v: 2},{text: "继续发布", v: 3}],
                                                        type: "button",
                                                        callback: (data) => {
                                                            let v = data.v;
                                                            if (v == 1) {
                                                                this.setState({failCl: 1}, () => {
                                                                    this.bingFB(url, pd, callback);
                                                                })
                                                            } else if (v == 2) {
                                                                this.setState({failCl: 2}, () => {
                                                                    releaseFail(content.id, message, (success) => {
                                                                        if (success) {
                                                                            this.prompt({text: "已将内容设置为审核失败", type: "alert"});
                                                                        } else {
                                                                            this.prompt({text: "将内容设置为审核失败未成功", type: "alert"});
                                                                        }
                                                                        this.bingFB(url, pd, callback);
                                                                    });
                                                                })
                                                            }else if(v == 3){
                                                                isQualityEvent(qualityConfig);
                                                            }else {
                                                                this.bingFB(url, pd, callback);
                                                            }
                                                        }
                                                    });
                                                });
                                            }
                                        }else {
                                            isQualityEvent(qualityConfig);
                                        }
                                    },8,message);
                                }
                            });
                        }else {
                            isQualityEvent();
                        }
                    }
                }
            })
            /*newTemplate.dataStructure(newConfig.children, content, ({children, updateName,isRelease,totalMessage}) => {
                if(isRelease){
                    let directlyRelease = (newConfig, url) => {
                        let isQualityEvent=()=>{
                            let submissionTemplate = (url, pd) => {
                                newConfig.children = children;
                                this.submissionTemplate(newConfig, url, content, (success, message) => {
                                    if (success) {
                                        this.setState({
                                            singleContent: singleContent,
                                            releaseNum: releaseNum + 1,
                                            showContent: this.isShow({id: content.id, isState: 1})
                                        }, () => {
                                            if (!pd) {
                                                url = false;
                                            }
                                            let st = setInterval(() => {
                                                clearInterval(st);
                                                this.bingFB(url, pd, callback);
                                            }, 2000);
                                        });
                                    } else {
                                        this.setState({
                                            singleContent: singleContent,
                                            failNum: failNum + 1,
                                            showContent: this.isShow({id: content.id, isState: 2})
                                        }, () => {
                                            this.prompt({text: "发布失败：" + message, type: "alert:danger"});
                                            if (this.state.failCl == 1) {
                                                this.bingFB(url, pd, callback);
                                            } else if (this.state.failCl == 2) {
                                                releaseFail(content.id, message, (success) => {
                                                    if (success) {
                                                        this.prompt({text: "已将内容设置为审核失败", type: "alert"});
                                                    } else {
                                                        this.prompt({text: "将内容设置为审核失败未成功", type: "alert"});
                                                    }
                                                    this.bingFB(url, pd, callback);
                                                });
                                            } else {
                                                this.setState({bottom: true}, () => {
                                                    this.prompt({
                                                        buts: [{text: "发布失败跳过", v: 1}, {text: "跳过,并设置为审核失败", v: 2}],
                                                        type: "button",
                                                        callback: (data) => {
                                                            let v = data.v;
                                                            if (v == 1) {
                                                                this.setState({failCl: 1}, () => {
                                                                    this.bingFB(url, pd, callback);
                                                                })
                                                            } else if (v == 2) {
                                                                this.setState({failCl: 2}, () => {
                                                                    releaseFail(content.id, message, (success) => {
                                                                        if (success) {
                                                                            this.prompt({text: "已将内容设置为审核失败", type: "alert"});
                                                                        } else {
                                                                            this.prompt({text: "将内容设置为审核失败未成功", type: "alert"});
                                                                        }
                                                                        this.bingFB(url, pd, callback);
                                                                    });
                                                                })
                                                            } else {
                                                                this.bingFB(url, pd, callback);
                                                            }
                                                        }
                                                    });
                                                });
                                            }
                                        });
                                    }
                                });
                            };
                            if (url) {
                                let zt = setInterval(() => {
                                    clearInterval(zt);
                                    submissionTemplate(url, pd);
                                }, 2000);
                            } else {
                                let buts = [];
                                let actions = this.state.config.actions;
                                for (let i in actions) {
                                    let item = actions[i];
                                    if (item.name != "preview") {
                                        buts.push({name: item.name, url: item.url, text: item.text, pd: false});
                                        buts.push({
                                            name: item.name,
                                            url: item.url,
                                            text: "批量" + item.text,
                                            pd: true,
                                            bsStyle: "info"
                                        });
                                    }
                                }

                                this.prompt({
                                    buts: buts, type: "button", callback: (data) => {
                                        this.setState({urlName: data.pd ? data.name : ""}, () => {
                                            submissionTemplate(data.url, data.pd);
                                        });
                                    }
                                });
                            }
                        };
                        let Quality=this.getTestUrl(config.actions);
                        if(Quality){
                            newTemplate.testingQuality({url:Quality,config:newConfig,callback:()=>{//新添

                                }
                            });
                        }else {

                        }
                    };
                    if (updateName) {
                        newConfig.updateName = updateName;
                        this.async(newConfig, newConfig.updateUrl, (newconfig) => {
                            if (newconfig) {
                                let children = newconfig.children;
                                let formError = newconfig.formError;
                                let totalMessage='';
                                if (formError) {
                                    this.prompt({text: formError});
                                    totalMessage+=formError+";";
                                }
                                for (let i in children) {
                                    let c = children[i];
                                    if (c.errMsg) {
                                        this.prompt({text: c.name + ":" + c.label + ":" + c.errMsg});
                                        totalMessage+=c.name + ":" + c.label + ":" + c.errMsg+";";
                                    }
                                }
                                let st = setInterval(() => {
                                    clearInterval(st);
                                    if(totalMessage){
                                        let message=totalMessage;
                                        if (this.state.failCl == 1) {
                                            this.bingFB(url, pd, callback);
                                        } else if (this.state.failCl == 2) {
                                            releaseFail(content.id, message, (success) => {
                                                if (success) {
                                                    this.prompt({text: "已将内容设置为审核失败", type: "alert"});
                                                } else {
                                                    this.prompt({text: "将内容设置为审核失败未成功", type: "alert"});
                                                }
                                                this.bingFB(url, pd, callback);
                                            });
                                        } else {
                                            this.setState({bottom: true}, () => {
                                                this.prompt({
                                                    buts: [{text: "发布失败跳过", v: 1}, {text: "跳过,并设置为审核失败", v: 2}],
                                                    type: "button",
                                                    callback: (data) => {
                                                        let v = data.v;
                                                        if (v == 1) {
                                                            this.setState({failCl: 1}, () => {
                                                                this.bingFB(url, pd, callback);
                                                            })
                                                        } else if (v == 2) {
                                                            this.setState({failCl: 2}, () => {
                                                                releaseFail(content.id, message, (success) => {
                                                                    if (success) {
                                                                        this.prompt({text: "已将内容设置为审核失败", type: "alert"});
                                                                    } else {
                                                                        this.prompt({text: "将内容设置为审核失败未成功", type: "alert"});
                                                                    }
                                                                    this.bingFB(url, pd, callback);
                                                                });
                                                            })
                                                        } else {
                                                            this.bingFB(url, pd, callback);
                                                        }
                                                    }
                                                });
                                            });
                                        }
                                    }else {
                                        directlyRelease(newconfig, url);
                                    }
                                }, 2000);
                            } else {
                                this.prompt({text: "异步更新数据出错"});
                            }
                        })
                    } else {
                        directlyRelease(newConfig, url);
                    }
                }else {
                    let message=totalMessage;
                    if (this.state.failCl == 1) {
                        this.bingFB(url, pd, callback);
                    } else if (this.state.failCl == 2) {
                        releaseFail(content.id, message, (success) => {
                            if (success) {
                                this.prompt({text: "已将内容设置为审核失败", type: "alert"});
                            } else {
                                this.prompt({text: "将内容设置为审核失败未成功", type: "alert"});
                            }
                            this.bingFB(url, pd, callback);
                        });
                    } else {
                        this.setState({bottom: true}, () => {
                            this.prompt({
                                buts: [{text: "发布失败跳过", v: 1}, {text: "跳过,并设置为审核失败", v: 2}],
                                type: "button",
                                callback: (data) => {
                                    let v = data.v;
                                    if (v == 1) {
                                        this.setState({failCl: 1}, () => {
                                            this.bingFB(url, pd, callback);
                                        })
                                    } else if (v == 2) {
                                        this.setState({failCl: 2}, () => {
                                            releaseFail(content.id, message, (success) => {
                                                if (success) {
                                                    this.prompt({text: "已将内容设置为审核失败", type: "alert"});
                                                } else {
                                                    this.prompt({text: "将内容设置为审核失败未成功", type: "alert"});
                                                }
                                                this.bingFB(url, pd, callback);
                                            });
                                        })
                                    } else {
                                        this.bingFB(url, pd, callback);
                                    }
                                }
                            });
                        });
                    }
                }
            }, (text) => {
                this.prompt({text: text});
            }, pushPage)*/
        } else {
            if (callback) {
                callback(pd);
            } else {
                this.prompt({text: "所有内容发布完毕"});
            }
        }
    };

    async = (config, updateUrl, callback) => {
        this.prompt({text: "异步更新数据"});
        newTemplate.pushTB({
            url: "https:" + updateUrl,
            data: {
                config: JSON.stringify(config),
            },
            async: true
        }, (data) => {
            callback(data.config);
        });

    };

    submissionTemplate = (config, url, content, callback) => {
        let {analysis, user} = this.state;
        this.prompt({text: "准备开始发布到达人平台"});
        newTemplate.pushTB({
            url: "https:" + url,
            data: {
                config: JSON.stringify(config),
            }
        }, (result) => {
            this.prompt({text: "发送结果：" + JSON.stringify(result), type: "alert:info"});
            let redirectUrl = result.redirectUrl;
            if (redirectUrl) {
                let feedId = getUrlPat(redirectUrl, "contentId");
                this.userData(content, feedId, analysis, user, () => {
                    callback(true);
                });
            } else {
                if (result.status) {
                    let message = "";
                    let children = result.config.children;
                    let issu = false;
                    message += result.config.formError ? result.config.formError : '';
                    for (let i = 0; i < children.length; i++) {
                        let c = children[i];
                        if (c.errMsg) {
                            if(c.name==='standardCoverUrl'){
                                message +=`封面图:${c.label}:${c.errMsg} `;
                            }else {
                                message +=`${c.name}:${c.label}:${c.errMsg} `;
                            }
                        }
                        if (c.component == "Toast") {
                            let name = c.name;
                            if (c.props.type != "error") {
                                issu = true;
                                let ss = name.split("_");
                                let id = ss[ss.length - 1];
                                this.userData(content, id, analysis, user, () => {
                                    callback(true);
                                });
                                break;
                            } else {
                                //发布错误
                            }
                        }
                    }
                    if (!issu) {
                        callback(false, message);
                    }
                } else {
                    callback(false);
                }
            }
        });
    };

    userData = (content, id, analysis, user, callback,state=0,message) => {
        if (user) {
            releaseSuccess(content.id, id, analysis, user, (success) => {
                if (!success) {
                    this.prompt({
                        text: "内容发布成功，但是通知软件后台失败，内容id=" + content.id + ",标题=" + content.title + ",达人后台id=" + id + ',首次通知失败再试一次',
                        type: "alert:danger"
                    });
                    releaseSuccess(content.id, id, analysis, user, (success) => {
                        if (!success) {
                            this.prompt({
                                text: "内容发布成功，但是通知软件后台失败，内容id=" + content.id + ",标题=" + content.title + ",达人后台id=" + id,
                                type: "alert:danger"
                            });

                        } else {
                            this.prompt({
                                text: "通知成功！",
                                type: "alert:success"
                            });
                            callback();
                        }
                    });
                }
                callback();
            },state,message);
        } else {
            this.prompt({
                text: "获取关键数据中,请稍等..."
            });
            darenData((user) => {
                this.prompt({
                    text: "获取结束"
                });
                this.setState({user: user}, () => {
                    releaseSuccess(content.id, id, analysis, user, (success) => {
                        if (!success) {
                            this.prompt({
                                text: "内容发布成功，但是通知软件后台失败，内容id=" + content.id + ",标题=" + content.title + ",达人后台id=" + id + ',首次通知失败再试一次',
                                type: "alert:danger"
                            });
                            releaseSuccess(content.id, id, analysis, user, (success) => {
                                if (!success) {
                                    this.prompt({
                                        text: "内容发布成功，但是通知软件后台失败，内容id=" + content.id + ",标题=" + content.title + ",达人后台id=" + id,
                                        type: "alert:danger"
                                    });

                                } else {
                                    this.prompt({
                                        text: "通知成功！",
                                        type: "alert:success"
                                    });
                                    callback();
                                }
                            });
                        }
                        callback();
                    },state,message);
                });
            });
        }
    };

    daren = (id = 0) => {
        let {list} = this.state.daren, string = '';
        list.forEach(item => {
            if (item.id == id) {
                string = `${item.title}${item.cookieUpDate ? (item.cookieIsFailure ? '(已授权)' : "(授权失效)") : "(未授权)"}`;
            }
        });
        return string ? string : '';
    };

    channel=(url,callback,channelId)=>{
        let {releaseCondition,releaseListData}=this.state;
        let {subChannel}=releaseListData,str=releaseCondition.channel;
        subChannel.forEach((item)=>{
            if(item.id==releaseCondition.subChannel){
                str+='/'+item.name;
            }
        });
        str+='/'+releaseCondition.subChannelType;
        this.saveData({name:str,url:url+"--"+channelId},callback);
    };

    getCookie = (cname) => {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for (let i = 0,l=ca.length; i < l; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
        }
        return "";
    };

    integrationCookie=({name,url,type})=>{
        let oldCookie=this.getCookie('release');
        let array=oldCookie?oldCookie.split(','):[],newArray=[],isName=false;
        array.forEach(item=>{
            if(type=='get'){
                newArray.push({
                    name:item.split('||')[0],url:item.split('||')[1]
                })
            }else {
                if(item.split('||')[0]==name){
                    isName=true;
                }else {
                    newArray.push({
                        name:item.split('||')[0],url:item.split('||')[1]
                    });
                }
            }
        });
        if(type!='get'){
            if(isName){
                let string='';
                newArray.forEach((item,index)=>{
                    string+=index>0?`,${item.name}||${item.url}`:`${item.name}||${item.url}`;
                });
                string+=newArray.length>0?`,${name}||${url}`:`${name}||${url}`;
                oldCookie=string;
            }else {
                if(array.length>11){
                    let index=oldCookie.indexOf(',');
                    oldCookie=oldCookie.substr(index+1);
                    oldCookie+=`,${name}||${url}`;
                }else if(array.length==0){
                    oldCookie=`${name}||${url}`;
                }else {
                    oldCookie+=`,${name}||${url}`;
                }
            }
        }
        return type=='get'?newArray.reverse():oldCookie;
    };

    saveData=({name,url},callback)=>{
        let d = new Date();
        d.setTime(d.getTime() + (15 * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = "release=" + this.integrationCookie({name,url,type:'set'}) + "; " + expires;
        callback();
    };

    render() {
        let {addressData, daren, releaseCondition, releaseListData, showContent, promptContent, isSynchronization, contentAlert,activityName,isTalentNick,
            activityId,channelId,surplus,isTestingQuality} = this.state;
        let publishList = [
            {text: "新微淘", type: 1},
            {text: "渠道", type: 2},
            {text: "邀请我的活动", type: 3},
            {text: "自定义链接", type: 4}
        ];
        return (
            <div>
                <Tabs type="border-card" activeName="1">
                    <Tabs.Pane label='发布达人平台' name="1">
                        <Alert title='“使用诊断”就是使用内容诊断（无内容诊断渠道略过），使用内容诊断后内容会设置为待同步，同时会保存到达人平台草稿箱，设置失败会到需要修改。“禁止诊断”就是禁止内容诊断。'
                               type="info" style={{textAlign: 'left'}}/>
                        {contentAlert && <Alert title={contentAlert} type="warning" style={{textAlign: 'left'}}/>}
                        {addressData.direction == 'synchronization' &&
                        <Layout.Row gutter="10" style={{marginTop: "8px"}}>
                            <Layout.Col span="6">
                                <Radio.Group value={isTestingQuality ? '使用诊断' : '禁止诊断'} onChange={(val)=>{
                                    this.saveQualityData({name:val=='使用诊断'?'true':'false'},()=>{
                                        this.setState({isTestingQuality:val=='使用诊断'?true:false})
                                    })
                                }}>
                                    <Radio.Button value="使用诊断"/>
                                    <Radio.Button value="禁止诊断"/>
                                </Radio.Group>
                            </Layout.Col>
                            <Layout.Col span="18">
                                <Button type='info' block onClick={() => {
                                    this.getSynchronization();
                                }} disabled={isSynchronization} style={{width: '100%'}}>开始同步</Button>
                            </Layout.Col>
                        </Layout.Row>}
                        {addressData.direction == 'release' &&
                        <Layout.Row gutter="10" style={{marginTop: "8px"}}>
                            <Layout.Col span="4">
                                <Radio.Group value={isTestingQuality ? '使用诊断' : '禁止诊断'} onChange={(val)=>{
                                    this.saveQualityData({name:val=='使用诊断'?'true':'false'},()=>{
                                        this.setState({isTestingQuality:val=='使用诊断'?true:false})
                                    })
                                }}>
                                    <Radio.Button value="使用诊断"/>
                                    <Radio.Button value="禁止诊断"/>
                                </Radio.Group>
                            </Layout.Col>
                            <Layout.Col span="4">
                                <Select value={daren.releaseId ? daren.releaseId : '0'}
                                        onChange={(id) => this.darenIdChange({id})} style={{width: '100%'}}>
                                    <Select.Option label={daren.name ? daren.name + '(当前登录号)' : "当前账号未注册达人(不可用)"}
                                                   value='0'/>
                                    {(daren.list ? daren.list : []).map((item, i) => {
                                        return (
                                            <Select.Option
                                                label={`${item.title}${item.cookieUpDate ? (item.cookieIsFailure ? '(已授权)' : "(授权失效)") : "(未授权)"}`}
                                                value={item.id} key={i} disabled={!item.cookieIsFailure}/>
                                        )
                                    })}
                                </Select>
                            </Layout.Col>
                            <Layout.Col span="4">
                                <Select value={releaseCondition.publish ? releaseCondition.publish : 0}
                                        onChange={(id) => this.conditionChange({value: id, name: 'publish'})}
                                        style={{width: '100%'}} id='publish' disabled={isTalentNick}>
                                    <Select.Option label='历史记录渠道' value={0}/>
                                    {publishList.map(item => {
                                        return (
                                            <Select.Option label={item.text} value={item.type} key={item.type}/>
                                        )
                                    })}
                                </Select>
                            </Layout.Col>
                            {releaseCondition.publish === 1 && <React.Fragment>
                                <Layout.Col span="6">
                                    <Cascader options={releaseListData.weitao} value={releaseCondition.weitao}
                                              onChange={(value) => this.conditionChange({value: value, name: 'weitao'})}/>
                                </Layout.Col>
                                <Layout.Col span="6">
                                    <Button type="primary" style={{width: '100%'}} onClick={() => {
                                        let arr=releaseCondition.weitao[2].split('||');
                                        this.saveData({name:`${releaseCondition.weitao[0]}/${releaseCondition.weitao[1]}/${arr[1]}`,url:arr[0]},()=>{
                                            this.pushHomePage(() => this.isTemplate(arr[0]))
                                        });
                                    }} disabled={releaseCondition.weitao.length<1}>确定选择开始发布微淘</Button>
                                </Layout.Col>
                            </React.Fragment>}
                            {releaseCondition.publish==0 && <React.Fragment>
                                <Layout.Col span="6">
                                    <Select style={{width: '100%'}} value={releaseCondition.preserve?releaseCondition.preserve:''}
                                            onChange={(value) => this.conditionChange({value: value, name: 'preserve'})}
                                            disabled={isTalentNick||releaseListData.preserve.length<1}>
                                        <Select.Option label='选择一个历史发布渠道' value={''} disabled/>
                                        {releaseListData.preserve.map((item, index) => {
                                            return (
                                                <Select.Option label={item.name} value={item.url}
                                                               key={`preserve-${index}`}/>
                                            )
                                        })}
                                    </Select>
                                </Layout.Col>
                                <Layout.Col span="6">
                                    <Button type="primary" style={{width: '100%'}} onClick={() => {
                                        let preserveUrl=releaseCondition.preserve.indexOf('--')>-1?releaseCondition.preserve.split('-')[0]:releaseCondition.preserve;
                                        this.pushHomePage(() => this.isTemplate(preserveUrl))
                                    }} disabled={!releaseCondition.preserve}>确定发布{surplus?surplus:''}</Button>
                                </Layout.Col>
                            </React.Fragment>}
                        </Layout.Row>}
                        {releaseCondition.publish === 2 && <Layout.Row gutter="10" style={{marginTop: "8px"}}>
                            <Layout.Col span="6">
                                <Select value={releaseCondition.channel ? releaseCondition.channel : 0}
                                        disabled={releaseListData.channel.length < 1}
                                        onChange={(title) => this.conditionChange({value: title, name: 'channel'})}
                                        style={{width: '100%'}}>
                                    <Select.Option label='选择一个频道' value={0} disabled/>
                                    {releaseListData.channel.map((item, index) => {
                                        return (
                                            <Select.Option label={item.name} value={item.name}
                                                           key={`channel-${index}`}/>
                                        )
                                    })}
                                </Select>
                            </Layout.Col>
                            <Layout.Col span="6">
                                <Select value={releaseCondition.subChannel ? releaseCondition.subChannel : 0}
                                        disabled={releaseListData.subChannel.length < 1}
                                        onChange={(id) => this.conditionChange({value: id, name: 'subChannel'})}
                                        style={{width: '100%'}}>
                                    <Select.Option label='选择一个子频道' value={0} disabled/>
                                    {releaseListData.subChannel.map((item, index) => {
                                        return (
                                            <Select.Option
                                                label={`${item.name}${item.remainCount ? `:今日还可投稿${item.remainCount}篇` : ""}`}
                                                value={item.id} key={`subChannel-${index}`}/>
                                        )
                                    })}
                                </Select>
                            </Layout.Col>
                            <Layout.Col span="6">
                                <Select value={releaseCondition.subChannelType ? releaseCondition.subChannelType : 0}
                                        disabled={releaseListData.subChannelType.length < 1}
                                        onChange={(id) => this.conditionChange({value: id, name: 'subChannelType'})}
                                        style={{width: '100%'}}>
                                    <Select.Option label='选择一个子频道类型' value={0} disabled/>
                                    {releaseListData.subChannelType.map((item, index) => {
                                        if (item.title !== "有好货奖金") {
                                            return (
                                                <Select.Option label={item.title} value={item.title}
                                                               key={`subChannelType-${index}`}/>
                                            )
                                        }
                                    })}
                                </Select>
                            </Layout.Col>
                            <Layout.Col span="6">
                                <Button type="primary" style={{width: '100%'}} onClick={() => {
                                    let moduleUrl = "", subChannelTypeArray = releaseListData.subChannelType;
                                    subChannelTypeArray.forEach(item => {
                                        if (item.title == releaseCondition.subChannelType) {
                                            moduleUrl = item.href;
                                        }
                                    });
                                    this.channel(moduleUrl,()=>{
                                        this.pushHomePage(() => this.isTemplate(moduleUrl))
                                    },channelId);
                                }} disabled={releaseCondition.subChannelType === 0}>确定选择开始发布渠道</Button>
                            </Layout.Col>
                        </Layout.Row>}
                        {releaseCondition.publish === 3 && <Layout.Row gutter="10" style={{marginTop: "8px"}}>
                            <Layout.Col span="6">
                                <InvitationActivities ref={e => this.invitationActivities = e}
                                                      darenId={+daren.releaseId} classNum={1}
                                                      style={{marginLeft: "0", width: '100%'}}
                                                      callback={(id,value) => this.conditionChange({
                                                          value: id,
                                                          name: 'activity',
                                                          valueName:value,
                                                      })}/>
                            </Layout.Col>
                            <Layout.Col span="6">
                                <Select value={releaseCondition.activityType ? releaseCondition.activityType : 0}
                                        disabled={releaseListData.activityType.length < 1}
                                        onChange={(id) => this.conditionChange({value: id, name: 'activityType'})}
                                        style={{width: '100%'}}>
                                    <Select.Option label='选择一个活动频道类型' value={0} disabled/>
                                    {releaseListData.activityType.map((item, index) => {
                                        return (
                                            <Select.Option label={item.title} value={item.title}
                                                           key={`activityType-${index}`}/>
                                        )
                                    })}
                                </Select>
                            </Layout.Col>
                            <Layout.Col span="6">
                                <Button type="primary" style={{width: '100%'}} onClick={() => {
                                    let moduleUrl = "", subChannelTypeArray = releaseListData.activityType;
                                    subChannelTypeArray.forEach(item => {
                                        if (item.title == releaseCondition.activityType) {
                                            moduleUrl = item.href;
                                        }
                                    });
                                    this.saveData({name:`${activityName}/${releaseCondition.activityType}`,url:moduleUrl+"--"+activityId},()=>{
                                        this.pushHomePage(() => this.isTemplate(moduleUrl))
                                    });
                                }} disabled={releaseCondition.activityType === 0}>确定选择开始发布活动渠道</Button>
                            </Layout.Col>
                        </Layout.Row>}
                        {releaseCondition.publish === 4 &&
                        <Layout.Row gutter="10" style={{marginTop: "8px"}}>
                            <Layout.Col span="24">
                                <Input placeholder="请输入发布链接" value={releaseCondition.link}
                                       onChange={(url) => this.conditionChange({value: url, name: 'link'})}
                                       prepend={
                                           <Button type="primary" icon="delete" onClick={() => this.conditionChange({
                                               value: '',
                                               name: 'link'
                                           })}>清空</Button>
                                       } append={<Button type="primary" onClick={() => {
                                    if (releaseCondition.link) {
                                        this.pushHomePage(() => this.isTemplate(releaseCondition.link))
                                    }
                                }}>开始发布</Button>}/>
                            </Layout.Col>
                        </Layout.Row>}
                        <Layout.Row gutter="10" style={{marginTop: "8px"}}>
                            <Layout.Col span="8">
                                <NewPanel header="发布内容详情">
                                    <div style={{
                                        height: "500px",
                                        overflowY: "scroll",
                                        overflow: "auto",
                                        overflowX: 'hidden'
                                    }}>
                                        {showContent.map((item, index) => {
                                            if (addressData.direction == 'release') {
                                                return (
                                                    <Layout.Row gutter="10" style={{marginTop: "8px"}} key={index}>
                                                        <Layout.Col span="16" style={{fontWeight: 'bold'}}>
                                                            <div>{item.title}</div>
                                                        </Layout.Col>
                                                        <Layout.Col span="8">
                                                            <Button
                                                                type={item.releaseResults ? (item.releaseResults === 1 ? 'success' : (item.releaseResults === 2 ? 'danger' : 'info')) : 'warning'}
                                                                icon={item.releaseResults ? (item.releaseResults === 1 ? 'check' : (item.releaseResults === 2 ? 'close' : 'loading')) : 'warning'}
                                                                size="small">
                                                                {item.releaseResults ? (item.releaseResults === 1 ? '发布成功' : (item.releaseResults === 2 ? '发布失败' : '发布中')) : '未发布'}
                                                            </Button>
                                                        </Layout.Col>
                                                    </Layout.Row>
                                                )
                                            } else {
                                                return (
                                                    <Layout.Row gutter="10" style={{marginTop: "8px"}} key={index}>
                                                        <Layout.Col span="12" style={{fontWeight: 'bold'}}>
                                                            <div>{item.title}</div>
                                                        </Layout.Col>
                                                        <Layout.Col span="8">
                                                            {item.daren_id?this.daren(item.daren_id):
                                                                <Button type="primary" onClick={() =>{
                                                                    getDarenId(item.feedId, (data) => {
                                                                        this.screen({data: data, list: daren.list, feedId: item.feedId}, (judge, object) => {
                                                                            if(object){
                                                                                showContent[index].daren_id=object.id;
                                                                                this.setState({showContent});
                                                                            }
                                                                        });
                                                                    });
                                                                }} size="small">获取账号</Button>}
                                                        </Layout.Col>
                                                        <Layout.Col span="4">
                                                            <Button
                                                                type={item.releaseResults ? (item.releaseResults === 1 ? 'success' : (item.releaseResults === 2 ? 'danger' : 'info')) : 'warning'}
                                                                icon={item.releaseResults ? (item.releaseResults === 1 ? 'check' : (item.releaseResults === 2 ? 'close' : 'loading')) : 'warning'}
                                                                size="small">
                                                                {item.releaseResults ? (item.releaseResults === 1 ? '发布成功' : (item.releaseResults === 2 ? '发布失败' : '发布中')) : '未发布'}
                                                            </Button>
                                                        </Layout.Col>
                                                    </Layout.Row>
                                                )
                                            }
                                        })}
                                    </div>
                                </NewPanel>
                            </Layout.Col>
                            <Layout.Col span="16">
                                <NewPanel header="发布提示">
                                    <div style={{
                                        textAlign: 'left',
                                        height: "500px",
                                        overflowY: "scroll",
                                        overflow: "auto",
                                        overflowX: 'hidden'
                                    }}
                                         className="dom_id">
                                        {promptContent.map((item, i) => {
                                            if (item.type && item.type.indexOf("alert") > -1) {
                                                return (
                                                    <div style={{
                                                        marginTop: "2px",
                                                        maxHeight: "120px",
                                                        overflowY: "scroll",
                                                        overflow: "auto",
                                                        wordBreak: 'break-all',
                                                        whiteSpace: 'normal'
                                                    }} key={i}>
                                                        <Alert title={item.text}
                                                               type={item.type.indexOf("success") > -1 ? "success" :
                                                                   (item.type.indexOf("danger") > -1 ? "error" : (item.type.indexOf('warning')>1?"warning":"info"))}/>
                                                    </div>
                                                )
                                            } else if (item.type && item.type.indexOf("button") > -1) {
                                                return (
                                                    <div key={i}>
                                                        {item.buts.map((but, b) => {
                                                            return (
                                                                <Button type={but.bsStyle} disabled={item.isDisable}
                                                                        onClick={() => {
                                                                            item.isDisable = true;
                                                                            promptContent[i] = item;
                                                                            this.setState({promptContent: promptContent}, () => {
                                                                                item.callback(but);
                                                                            });
                                                                        }} key={i + "-" + b}
                                                                        style={{margin: "3px"}}>{but.text}</Button>)
                                                        })}
                                                    </div>
                                                )
                                            } else if (item.type && item.type.indexOf("error") > -1) {
                                                return (
                                                    <div key={i}>
                                                        {item.text.map((it, t) => {
                                                            if (it.text == "重新发布") {
                                                                return (
                                                                    <Button onClick={() => {
                                                                        promptContent.splice(i, 1);
                                                                        this.setState({promptContent: promptContent}, () => {
                                                                            this.state.cw_callback(true);
                                                                        });
                                                                    }} key={i + "+" + t}
                                                                            style={{margin: "3px"}}>{it.text}</Button>
                                                                )
                                                            } else if (it.text == "设置为发布失败") {
                                                                return (
                                                                    <Button onClick={() => {
                                                                        this.state.failCallback();
                                                                    }} key={i + "+" + t}
                                                                            style={{margin: "3px"}}>{it.text}</Button>
                                                                )
                                                            } else {
                                                                return (
                                                                    <Button onClick={() => {
                                                                        promptContent.splice(i, 1);
                                                                        this.setState({promptContent: promptContent}, () => {
                                                                            this.state.cw_callback(false);
                                                                        });
                                                                    }} key={i + "+" + t}
                                                                            style={{margin: "3px"}}>{it.text}</Button>
                                                                )
                                                            }
                                                        })}
                                                    </div>
                                                )
                                            } else if (item.type && item.type.indexOf("daren") > -1) {
                                                return (
                                                    <div key={i}>
                                                        <Alert title='禁用的达人号已授权失效' type='info'/>
                                                        {(item.data ? item.data : []).map((daren, index) => {
                                                            return (
                                                                <Button type='info' style={{margin: "3px"}}
                                                                        onClick={() => {
                                                                            item.callback({id: daren.id});
                                                                        }} key={`daren${i}-${index}`}
                                                                        disabled={!daren.cookieIsFailure}>
                                                                    {daren.title}
                                                                </Button>
                                                            )
                                                        })}
                                                        <Button onClick={() => {
                                                            item.callback({});
                                                        }}>
                                                            跳过当前发布内容
                                                        </Button>
                                                    </div>
                                                )
                                            } else {
                                                return (
                                                    <div key={i}>
                                                        {item.text}
                                                    </div>
                                                )
                                            }
                                        })}
                                        <br/>
                                    </div>
                                </NewPanel>
                            </Layout.Col>
                        </Layout.Row>
                    </Tabs.Pane>
                </Tabs>
            </div>
        )
    }
}

class NewPanel extends React.Component {
    render() {
        let {header} = this.props;
        return (
            <div style={{
                marginTop: "10px",
                marginBottom: '12px',
                backgroundColor: '#fff',
                border: '1px solid transparent',
                borderRadius: '4px',
                boxShadow: '0 1px 1px rgba(0, 0, 0, .05)',
                borderColor: '#bce8f1'
            }}>
                <div style={{
                    padding: '3px 10px',
                    borderBottom: '1px solid transparent',
                    borderTopLeftRadius: '3px',
                    borderTopRightRadius: '3px',
                    color: '#31708f',
                    backgroundColor: '#d9edf7',
                    borderColor: '#bce8f1',
                }}>
                    <h4>{header}</h4>
                </div>
                <div style={{
                    padding: '10px',
                }}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default ReleaseAndSynchronization;
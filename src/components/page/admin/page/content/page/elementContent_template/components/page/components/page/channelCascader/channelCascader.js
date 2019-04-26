import ReactChild from "../../../../../../../../../../../lib/util/ReactChild";
import {clone} from "../../../../../../../../../../../lib/util/global";
import {ThousandsOfCall} from "../../../../../../../../../../../lib/util/ThousandsOfCall";
import {Button, Layout, Input, Message, Cascader, Loading, Notification, Alert, Breadcrumb, Card, Form} from 'element-react';
import {Link} from 'react-router-dom';
import ChannelSelection from '../channelSelection/channelSelection';
import {InvitationActivities} from "../../../../../../../../../components/PersonSelection";

require('../../../../../../../../../../../../styles/content/content_template.css');
import AJAX from '../../../../../../../../../../../lib/newUtil/AJAX';
import {oldModel, typeJudgment, taoTov2,fusionConstraint} from '../../../../../../../../../../../lib/newUtil/channelChange';
import {currencyNoty} from "../../../../../../../../../../../lib/util/Noty";

let failTime = 0;

/**
 * Created by 林辉 on 2018/8/15 8:52.模板渠道选择
 */

class ChannelCascader extends ReactChild {

    stateValue = () => {
        return {
            channelCascader: {//渠道级联
                options: [],
                props: {
                    //  label:'label',
                    value: 'value',
                    children: 'cities'
                },
                options2: [],
                props2: {
                    value: 'value',
                    children: 'cities'
                },
                default1: [],
                default2: [],
                itemList: [],//选中的授权达人第一渠道与第二渠道
                typeList: [],//选中的渠道3数据
            },
            privateDisable: {//违禁词
                id: 0,
                privateDisable: "",
            },
            channelLoading: false,//选择加载
            channelLoading2: false,//选择加载2
            i: -1,//是否标题
            ii: -1,//是否封面
            MainChannel: [],//渠道1数据
            activity: [],//渠道2数据
            channel: [],//渠道3数据
            alertVisible: false,//警告框按钮
            channelHideSwitch: false,//选择渠道三是否隐藏字段开关
            title: '',//渠道一名字
            columnName: '',//渠道2名字
            entryNam: '',//渠道3名字
            template: '',//模板类型

        }
    };


    constructor(props) {
        super(props);
        this.state = this.stateValue();
    }

    componentDidMount() {
        this.newOrEditTemplate();
    }


    newOrEditTemplate = (newModelConstraint) => {//新建或编辑模板
        let params = this.props.params;
        if (params) {//编辑模板
            let id = params.id;
            if (id) {//编辑模板
                if (this.modelChannelAjax) {
                    this.modelChannelAjax.ajax({//获取单个模板
                        type: 'post',
                        url: '/content/admin/superManage/queryContentModeById.io',
                        data: {id: id},
                        callback: (model) => {
                            let data = {};
                            if (model.url) {
                                let params = model.url.split('&');
                                for (let p = 0; p < params.length; p++) {
                                    let [key, value] = [params[p].split('=')[0], params[p].split('=')[1]];
                                    data[key] = value;
                                }
                            } else {
                                data.activityId = model.channel.activityId;
                                data.template = model.channel.template;
                                model.url = 'template=' + model.channel.template + '&activityId=' + model.channel.activityId;
                            }
                            if((typeof data.activityId)=='string'){
                               data.activityId=-30;
                            }
                            if (this.modelChannelAjax) {
                                this.modelChannelAjax.ajax({//拿取所有有当前模板达人
                                    type: 'post',
                                    url: '/user/admin/org/getWhetherToOwnChannelList.io',
                                    data: {activityId: data.activityId && data.activityId !== 'undefined' ? data.activityId : '', template: data.template},
                                    callback: (talentList) => {
                                        this.getchannelName(model, (mode) => {
                                            let talentMessageIds = [];
                                            if (mode.talentMessageIds && (typeof mode.talentMessageIds != 'string')) {
                                                for (let m = 0; m < mode.talentMessageIds.length; m++) {
                                                    talentMessageIds.push(mode.talentMessageIds[m]);
                                                }
                                            }
                                            for (let t = 0; t < talentList.length; t++) {
                                                talentMessageIds.push(talentList[t].id);
                                            }
                                            let newTalentMessageIds = [];
                                            for (let i = 0; i < talentMessageIds.length; i++) {
                                                if (newTalentMessageIds.indexOf(talentMessageIds[i]) == -1) {
                                                    newTalentMessageIds.push(talentMessageIds[i]);
                                                }
                                            }
                                            mode.talentMessageIds = newTalentMessageIds;

                                            let constraint = mode.constraint;
                                            let newProps = '';
                                            if (constraint.v == 2) {
                                                let nameList = constraint.nameList;
                                                let ct = constraint.constraint;
                                                if(newModelConstraint){
                                                    ct = fusionConstraint(newModelConstraint.constraint,constraint.constraint);
                                                    mode.constraint.constraint=ct;
                                                }
                                                for (let i = 0; i < nameList.length; i++) {
                                                    let ctObj = ct[nameList[i].name];
                                                    if (ctObj.type == 'Editor') {
                                                        let props = clone(ctObj.props);
                                                        props.plugins.push({name: 'NUMBER'});
                                                        newProps = props;
                                                    }
                                                }
                                            } else {
                                                for (let i = 0; i < constraint.length; i++) {
                                                    if (constraint[i].type == 'Editor') {
                                                        let props = clone(constraint[i].props);
                                                        props.plugins.push({name: 'NUMBER'});
                                                        newProps = props;
                                                    }
                                                }
                                            }
                                            this.daren_list((darenList) => {

                                                this.setState({channelHideSwitch: true}, () => {

                                                    this.props.thisSetState({model: clone(mode), newProps: newProps, talentMessageList: darenList});
                                                });
                                            });
                                        });
                                    }
                                });
                                /*model.activityName = json.activityName;model.channelName = json.channelName;*/

                            }
                        }
                    });
                }
            } else {//新建模板
                this.newModel();
            }
        }
    };
    getchannelName = (model, callback) => {//拿取渠道赋值渠道名字
        if (model.channelId) {
            this.modelChannelAjax.ajax({
                type: 'post',
                url: '/user/admin/superManage/queryChannel.io',
                data: {'id': model.channelId},
                callback: (json) => {//获取渠道赋值名字

                    model.channel.mainChannelName = json.title;
                    model.channel.activityName = json.columnName;
                    model.channel.entryName = json.entryName;
                    model.title = json.title;//渠道1名字
                    model.columnName = json.columnName;//渠道2名字
                    model.entryName = json.entryName;//渠道3名字
                    if (callback) {
                        callback(model);
                    }
                }
            });
        } else {
            model.title = model.channel.mainChannelName;//渠道1名字
            model.columnName = model.channel.activityName;//渠道2名字
            model.entryName = model.channel.entryName;//渠道3名字
            callback(model);
        }
    };

    newModel = () => {//新建模板
        let {channelCascader} = this.state;
        let options = [];
        this.daren_list((darenList) => {//拿取授权达人
            //  channelLoading = false;//加载结束
            if (darenList.length > 0) {
                for (let i = 0; i < darenList.length; i++) {
                    let data = {};
                    /*if (darenList[i].cookieUpDate && darenList[i].cookieIsFailure) {*/

                    Object.assign(data, {label: darenList[i].title, value: darenList[i].id, cities: []});
                    if (!darenList[i].cookieIsFailure) {
                        data.disabled = true;
                        data.label += '(未授权)';
                    }
                    options.push(data);
                    /*}*/
                }
                channelCascader.options = options;
            }
            if (options.length <= 0) {
                options.push({label: '当前没有授权达人', value: -11});
                channelCascader.default1[0] = -11;
            }
            this.setState({channelCascader: channelCascader, darenList: darenList}, () => {
                let state = this.props.stateValue();
                state.talentMessageList = darenList;
                state.alertVisible = false;
                this.props.thisSetState(state);
            });
        });
    };

    daren_list = (callback) => {//获取授权达人列表
        ThousandsOfCall.acoustic(
            {}, "requestTanleList", (msg) => {
                if (msg.success) {
                    callback(msg.data);
                } else {
                    Message.error('获取达人列表失败');
                }
            }
        )
    };

    handleItemChange = (val) => {//选择第一渠道
        let channelCascader = this.state.channelCascader;
        let [options, channelLoading, talentId, index] = [channelCascader.options, true, '', -1];
        this.setState({channelLoading: channelLoading}, () => {
            for (let i = 0; i < options.length; i++) {
                if (options[i].value === val[0]) {
                    talentId = options[i].value;
                    options[i].cities = [];
                    index = i;
                    break;
                }
            }
            if (talentId) {//匹配选中的授权达人
                channelCascader.default1[0] = val[0];
                let list = [{name: '邀请我的活动', id: -10000000}, {name: '新微淘', id: -3}];
                this.getMainChannel(talentId, list, 1, (mainChannelList) => {
                    channelLoading = false;
                    let itemList = [];
                    for (let y = 0; y < mainChannelList.length; y++) {
                        let data = {};
                        Object.assign(data, {label: mainChannelList[y].name, value: mainChannelList[y].id});
                        itemList.push(mainChannelList[y]);
                        options[index].cities.push(data);
                    }
                    channelCascader.options = options;
                    channelCascader.itemList = itemList;
                    this.setState({channelCascader: channelCascader, channelLoading: channelLoading, talentId: talentId});

                });
            } else {//未匹配到把旋转取消
                Message.error('未匹配到该达人渠道');
                this.setState({channelLoading: false});
            }
        });
    };

    getMainChannel = (talentId, list, i, callback) => {//获取某一个达人所有第一渠道//频道投稿，邀请我的活动，微淘
        let dt = {
            agreement: "https",
            hostname: "contents.taobao.com",
            path: '/api2/channel/channel_list.json',
            method: "get",
            data: {
                current: i,
                pageSize: 50,
                __version__: 3.0
            },
            talentId: talentId,
            referer: "https://we.taobao.com/",
        };
        ThousandsOfCall.acoustic(dt, 'requestRelyAgentTB', (json) => {
            if (json.success) {
                let res = JSON.parse(json.data);
                if (res.status === 'SUCCESS') {
                    let [data, totalCount] = [res.data, i * 50];
                    list.push.apply(list, data.itemList);
                    if (data.total > totalCount) {
                        this.getMainChannel(talentId, list, i + 1, callback);
                    } else {
                        if (callback) {
                            callback(list);
                        }
                    }
                } else {
                    Notification.error({
                        title: '授权达人：' + res.message,
                    });
                    return false;
                }
            }
        });

    };


    mainChannelChange = (env) => {//根据渠道1id获取渠道2
        let {channelCascader} = this.state;
        let {model} = this.props;
        let {options2, itemList} = channelCascader;
        let value = env[1];
        if (value) {
            channelCascader.default1[1] = value;
            model.channel.mainChannel = value;
            if (value === -3) {//新微淘
                let dt = {
                    agreement: "https",
                    hostname: "we.taobao.com",
                    path: '/portal/new/listing.json',
                    method: "get",
                    data: {__version__: 3.0},
                    talentId: this.state.talentId,
                    referer: "https://we.taobao.com/",
                };
                ThousandsOfCall.acoustic(dt, 'requestRelyAgentTB', (json) => {
                    if (json.success) {
                        let res = JSON.parse(json.data);
                        if (res.status === 'SUCCESS') {
                            model.mainChannel = -3;
                            model.channel.mainChannel = -3;
                            model.channel.mainChannelName = '新微淘';
                            let tabList = res.data.tabList;
                            let title = '新微淘';//选中的第一渠道名字
                            options2 = [];

                            for (let y = 0; y < tabList.length; y++) {
                                let data = {};
                                Object.assign(data, {label: tabList[y].title, value: tabList[y].key, cities: []});
                                options2.push(data);
                                let blockList = tabList[y].blockList;
                                for (let i = 0; i < blockList.length; i++) {
                                    let props = blockList[i].props;
                                    let btnList = props.btnList;
                                    for (let b = 0; b < btnList.length; b++) {
                                        options2[parseInt(y)].cities.push({label: props.title + '/' + btnList[b].text, value: btnList[b].url});
                                    }
                                }

                            }
                            channelCascader.options2 = options2;
                            this.setState({
                                activity: tabList,//渠道二数据
                                mainChannelValue: value,
                                title: title,//选中的第一渠道名字
                                alertVisible: false,
                                activityValue: false,
                                channelHideSwitch: false,
                                channelCascader: channelCascader,
                            }, () => {
                                this.props.thisSetState({model: model})
                            });
                        } else {
                            Message.error(res.message);
                        }
                    }
                });
            } else if (value < -100) {//进行搜索 邀请我的活动
                //model.title = value;
                model.mainChannel = value;
                model.mainChannelName = '邀请我的活动';
                model.channelmainChannel = value;
                model.channel.mainChannelName = '邀请我的活动';
                /*  let dt = {
                      agreement: "https",
                      hostname: "contents.taobao.com",
                      path: '/api2/activity/activity_list.json',
                      method: "get",
                      data: {current:1,pageSize:8},
                      talentId: this.state.talentId,
                      referer: "https://we.taobao.com/",
                  };
                  ThousandsOfCall.acoustic(dt, 'requestRelyAgentTB', (json) => {
                      if (json.success) {
                          let res = JSON.parse(json.data);
                          if (res.status === 'SUCCESS') {
                              let itemList = res.data.itemList;*/
                this.setState({
                    alertVisible: false,
                    //  activity: itemList,
                    mainChannelValue: false,
                    activityValue: false,
                    channelHideSwitch: false,
                    channelCascader: channelCascader,
                }, () => {
                    this.props.thisSetState({model: model}, () => {
                        this.invitationActivitiesChannel.darenChangeTake();
                    })
                });
                /*          }else{
                              Message.error(res.message);
                          }
                      }
                  });*/

            } else {//进行第二渠道选择
                model.channel.mainChannel = value;
                let [title, json] = ['', ''];
                for (let y = 0; y < itemList.length; y++) {
                    if (itemList[y].id == value) {
                        options2 = [];
                        title = itemList[y].name;//选中的第一渠道名字
                        model.mainChannelName = title;
                        model.channel.mainChannelName = title;
                        json = itemList[y].activityList;
                        for (let i = 0; i < json.length; i++) {
                            let data = {};
                            Object.assign(data, {label: json[i].name, value: json[i].id, cities: []});
                            options2.push(data);
                        }

                    }
                }
                channelCascader.options2 = options2;
                this.setState({
                    activity: json,//渠道二数据
                    mainChannelValue: value,
                    title: title,//选中的第一渠道名字
                    alertVisible: false,
                    activityValue: false,
                    channelHideSwitch: false,
                    channelCascader: channelCascader,
                }, () => {
                    this.props.thisSetState({model: model})
                });
            }
        }
    };
    /*  columnNameChange = (columnName) => {//改变渠道2(渠道2搜索text)
          this.setState({columnName: columnName});
      };*/
    mainChannelClick = () => {//id值-100以下搜索渠道2
        let {channelCascader} = this.state;
        let options2 = channelCascader.options2;
        let model = this.props.model;
        let value = model.mainChannel;
        let columnName = this.state.columnName;
        if (columnName) {
            let dt = {
                agreement: "https",
                hostname: "contents.taobao.com",
                path: '/api2/activity/activity_list.json',
                method: "get",
                data: {q: columnName, current: 1, pageSize: 8},
                talentId: this.state.talentId,
                referer: "https://we.taobao.com/",
            };
            ThousandsOfCall.acoustic(dt, 'requestRelyAgentTB', (json) => {
                if (json.success) {
                    let res = JSON.parse(json.data);
                    if (res.status === 'SUCCESS') {
                        options2 = [];
                        let itemList = res.data.itemList;

                        model.mainChannel = value;
                        for (let i = 0; i < itemList.length; i++) {
                            let data = {};
                            Object.assign(data, {label: itemList[i].name, value: itemList[i].id, cities: []});
                            options2.push(data);
                        }
                        channelCascader.options2 = options2;
                        this.setState({
                            channelCascader: channelCascader,
                            activity: itemList,
                            alertVisible: false,
                            mainChannelValue: value,
                            activityValue: false,
                            channelHideSwitch: false
                        }, () => {
                            this.props.thisSetState({model: model})
                        });
                    } else {
                        Message.error(res.message);
                    }
                }
            });
        }
    };

    getGovernmentManages = ({current = 1, q = ''}, callback) => {//分页式获取活动投稿千里传音
        let {prompt} = this.props;
        let talentId = this.state.talentId;
        let dt = {
            agreement: "https",
            hostname: "contents.taobao.com",
            path: '/api2/activity/activity_list.json',
            method: "get",
            data: {q: q, current: current, pageSize: 8},
            talentId: talentId,
            referer: "https://we.taobao.com/",
        };
        ThousandsOfCall.acoustic(dt, 'requestRelyAgentTB', (json) => {
            if (json.success) {
                let res = JSON.parse(json.data);
                if (res.status === 'SUCCESS') {
                    let data = res.data;
                    let arr = [], arr2 = [];
                    if (data.current > 1) {
                        arr.push({id: -1, value: '上一页'});
                    }
                    let arr1 = data.itemList.map((item) => {
                        return {id: item.id, value: item.name}
                    });
                    if (data.current < (Math.floor((data.total - 1) / data.pageSize) + 1)) {
                        arr2.push({id: -2, value: '下一页'});
                    }
                    if (callback && typeof callback == 'function') {
                        callback({restaurants: [...arr, ...arr1, ...arr2], activitiesList: res.data});
                    }
                } else {
                    Message.error(res.message);
                }
            }
        });
    };

    activityCallback = (id, value) => {//选择第二渠道值后回调
        let {channelCascader} = this.state;
        let model = this.props.model;
        let mainChannel = model.mainChannel;
        channelCascader.options2 = [{label: value, value: id, cities: []}];
        channelCascader.default2[0] = id;
        this.setState({
            channelCascader: channelCascader, alertVisible: false,
            mainChannelValue: mainChannel,
            activityValue: false,
            channelHideSwitch: false
        });
    };

    activityChange = (env) => {//根据渠道2获取渠道3
        let {channelCascader, talentId} = this.state;
        let {model} = this.props;
        let {options2, default1} = channelCascader;
        let value = env[0];
        if (value) {
            channelCascader.default2[0] = value;//渠道2id
            let [s, columnName, object, id] = ['', '', {}, value];
            for (let o = 0; o < options2.length; o++) {//赋值渠道2名字
                if (options2[o].value == value) {
                    s = o;
                    object = options2[o];
                    model.name = options2[o].label;
                    model.channel.activityId = options2[o].value;
                    model.channel.activityName = options2[o].label;
                    columnName = options2[o].label;//渠道2名字
                }
            }
            if (default1[1] === -3 && value !== 'hudong') {//新微淘
                channelCascader.typeList = object.cities;
                this.setState({alertVisible: false, channelCascader: channelCascader, columnName: columnName, channelHideSwitch: false}, () => {
                    this.props.thisSetState({model: model});
                })//channel: json.channel,
            } else {
                if (value === 'hudong') {//新微淘互动
                    let btnUrl = object.cities[0].value;
                    id = btnUrl.split('activity/')[1];
                }
                let dt = {
                    agreement: "https",
                    hostname: "contents.taobao.com",
                    path: '/api2/channel/channel_info.json',
                    method: "get",
                    data: {id: id, __version__: 3.0},
                    talentId: talentId,
                    referer: "https://we.taobao.com/",
                };
                this.setState({channelLoading2: true}, () => {
                    ThousandsOfCall.acoustic(dt, 'requestRelyAgentTB', (json) => {
                        this.setState({channelLoading2: false}, () => {
                            if (json.success) {
                                let res = JSON.parse(json.data);
                                if (res.status === 'SUCCESS') {
                                    let typeList = res.data.typeList;
                                    options2[s].cities = [];
                                    if (typeList.length > 0) {
                                        for (let i = 0; i < typeList.length; i++) {
                                            let data = {};
                                            Object.assign(data, {label: typeList[i].title, value: typeList[i].id});//value: typeList[i].id + ',' + json.channel[i].entryName + ',' + json.channel[i].template + ','
                                            if (!options2[s].cities) {
                                                options2[s].cities = [];
                                            }
                                            options2[s].cities.push(data);
                                        }

                                        channelCascader.typeList = typeList;//渠道3数据
                                        channelCascader.options2 = options2;
                                    }
                                    this.setState({alertVisible: false, channelCascader: channelCascader, columnName: columnName, channelHideSwitch: false},//channel: json.channel,
                                        () => {
                                            this.props.thisSetState({model: model});
                                        });
                                } else {
                                    Notification.error({
                                        title: '错误',
                                        message: json.message
                                    });
                                    return false;
                                }
                            }
                        });
                    });
                });
            }
        }
    };

    channelChange = (env) => {//根据渠道获取基础模板
        let {channelCascader} = this.state;
        let [id, data, entityData, entryName, typeList] = [env[1], {}, '', '', channelCascader.typeList];
        let {model} = this.props;
        if (channelCascader.default1[1] === -3 && channelCascader.default2[0] !== 'hudong') {//判断是否微淘
            for (let t = 0; t < typeList.length; t++) {
                if (typeList[t].value == id) {
                    entryName = typeList[t].label;
                    break;
                }
            }
            let param = id.split('?')[1];
            let pm = param.split('&');
            for (let m = 0; m < pm.length; m++) {
                let [key, value] = [pm[m].split('=')[0], pm[m].split('=')[1]];
                data[key] = value;
            }
            if (!data.from) {//判断微淘是否有from值
                data.from = 'draft';
            }
            model.url = 'template=' + data.template + '&from=' + data.from;
            if (data.topic) {
                model.url += '&topic=' + data.topic;
            }
            if (data.formName) {
                model.url += '&formName=' + data.formName;
            }
        } else {
            for (let t = 0; t < typeList.length; t++) {
                if (typeList[t].id == id) {
                    entityData = typeList[t];
                    break;
                }
            }
            entryName = entityData.title;//第三渠道名字
            let href = entityData.href;
            let index = href.indexOf('?');
            let subParam = href.substring(index + 1);
            let param = subParam.split('&');
            for (let p = 0; p < param.length; p++) {//template=item2&activityId=414&redirectURL=%2F%2Fdaren.taobao.com%2Fsubmission%2Fchannel%2Fmanage
                let da = param[p].split('=');
                if (da[0] === 'template') {
                    data.template = da[1];//模板类型
                } else if (da[0] === 'activityId') {
                    data.activityId = parseInt(da[1]);
                } else {
                    data[da[0]] = da[1];
                }
            }
            model.channel.entryId = id;
            model.url = 'template=' + data.template + '&activityId=' + channelCascader.default2[0];
        }
        model.channel.entryName = entryName;
        model.channel.template = data.template;
        channelCascader.default2[1] = env[1];//被选中的渠道3
        let type = typeJudgment(data.template);
        let state = this.stateValue();
        if(typeof(data.activityId )== 'string'){
            data.activityId=-30;
        }
        if (!id) {
            Notification.error({
                title: '错误',
                message: '请选择一种渠道'
            });
            model = state.model;
        } else {
            this.modelChannelAjax.ajax({
                type: 'post',
                url: '/user/admin/org/getWhetherToOwnChannelList.io',
                data: data,
                callback: (darenList) => {
                    this.queryListByOrgId({data: data, pageNow: 1, contentModel: []}, (alertVisible, jsoncontentModel) => {
                        this.queryChannel(data, (json) => {
                            json.entryId = entityData.id;
                            json.entryName = entryName;
                            json.template = data.template;
                            Object.assign(model, {constraint: json.contentMode, type: type, entryName: name});
                            let constraint = model.constraint;
                            let [newProps, isT, isC] = ['', -1, -1];
                            for (let i = 0; i < constraint.length; i++) {
                                if (constraint[i].type === 'Editor') {
                                    let props = clone(constraint[i].props);
                                    props.plugins.push({name: 'NUMBER'});
                                    newProps = props;
                                } else if (constraint[i].type === 'Input') {
                                    if (isT <= -1) {
                                        isT = i;
                                    }

                                } else if (constraint[i].type === 'CreatorAddImage' || constraint[i].type === 'CreatorAddItem' || constraint[i].type === 'AnchorImageList' || constraint[i].type === 'CreatorAddSpu') {
                                    if (isC <= -1) {
                                        isC = i;
                                    }
                                }
                            }
                            let [talentMessageIds] = [[]];
                            talentMessageIds.push(this.state.talentId);
                            for (let d = 0; d < darenList.length; d++) {
                                let daren = darenList[d];
                                if (this.state.talentId != daren.id) {
                                    talentMessageIds.push(daren.id);
                                }
                            }
                            talentMessageIds.push(this.state.talentId);
                            model.talentMessageIds = talentMessageIds;
                            model.channelId = jsoncontentModel.channelId;
                            this.setState({alertVisible: alertVisible, contentModelId: jsoncontentModel.id, modelName: name, channelHideSwitch: true, channelCascader: channelCascader}, () => {
                                this.props.thisSetState({model: model, isC: isC, isT: isT, newProps: newProps, alertVisible: alertVisible})
                            });
                        });
                    });
                }
            });
        }
    };
    queryListByOrgId = (data, callback) => {//拿取所有模板判断模板是否重复
        let {channelCascader} = this.state;
        let channel = this.props.model.channel;
        Object.assign(data.data, {title: channel.mainChannelName, mainChannel: channel.mainChannel, columnName: channel.activityName, newEntryId: channel.entryId, entryName: channel.entryName});
        this.modelChannelAjax.ajax({
            type: 'post',
            data: {data: JSON.stringify(data.data)},
            url: '/user/admin/superManage/queryByActivityIdOrfromValue.io',
            callback: (json) => {
                this.modelChannelAjax.ajax({
                    type: 'post',
                    data: {channelId: json.id},
                    url: '/content/admin/superManage/querycontentModeByChannelId.io',
                    callback: (contentModel) => {
                        let alertVisible = false;
                        if (contentModel && contentModel.channelId) {
                            alertVisible = true;
                        } else {
                            contentModel = {channelId: json.id};
                        }
                        if (callback) {
                            callback(alertVisible, contentModel);
                        }
                    }
                });
            }
        });
    };
    queryChannel = (data, callback) => {//拿取线上渠道模板
        let {title, columnName, channelCascader} = this.state;
        let [mainChannel, activityId] = [channelCascader.default1[1], channelCascader.default2[0]];
        let dt = {
            agreement: "https",
            hostname: "cpub.taobao.com",
            path: '/render.json',
            method: "get",
            data: data,
            talentId: this.state.talentId,
            referer: "https://we.taobao.com/",
            notRedirect: true
        };
        ThousandsOfCall.acoustic(dt, 'requestRelyAgentTB', (json) => {
            if (json.success) {
                if (!json.code || json.code == 200) {
                    try {
                        let res = JSON.parse(json.data);
                        if (res.status === 'success') {
                            let children = res.config.children;
                            taoTov2({children: children}, (contentMode) => {
                                let model = {title: title, mainChannel: mainChannel, columnName: columnName, activityId: activityId, contentMode: contentMode};
                                if (callback) {
                                    callback(model);
                                }
                            });
                        } else {
                            Notification.error({
                                title: '拿取模板错误',
                                message: json.message
                            });
                            return false;
                        }
                    } catch (e) {
                        ThousandsOfCall.acoustic({
                            id: this.state.talentId,
                            url: json.redirectLocation
                        }, "switchAccount", () => {
                            failTime++;
                            this.queryChannel(data, callback);
                        });
                    }
                } else if (json.code == 302) {
                    ThousandsOfCall.acoustic({
                        id: this.state.talentId,
                        url: json.redirectLocation
                    }, "switchAccount", () => {
                        failTime++;
                        this.queryChannel(data, callback);
                    });
                } else {
                    currencyNoty('淘宝操作频繁，请稍后再试，或联系最高管理员重新授权', 'warning')
                }

            } else {
                Notification.error({
                    title: '拿取模板错误',
                    message: json.message
                });
            }
        });
    };

    render() {
        let {channelCascader, mainChannelValue, channelLoading, channelLoading2, alertVisible, contentModelId, columnName, activity} = this.state;
        let {model, params} = this.props;
        let url = encodeURIComponent(model.url + '&entryName=' + model.channel.entryName + '&mainChannelName=' + model.channel.mainChannelName + '&activityName=' + model.channel.activityName);
        let {props, options, props2, options2} = channelCascader;
        return (
            <div>
                <AJAX ref={e => this.modelChannelAjax = e}>
                    {!params.id ? <Form inline={true}>
                        <Form.Item label={'选择创作渠道：'}>
                            <Loading text="拼命加载中" loading={channelLoading}>
                                <Cascader props={props} options={options} value={channelCascader.default1} onChange={this.mainChannelChange} activeItemChange={this.handleItemChange}/>
                                {channelCascader.default1[0] === -11 && <a href='https://www.yuque.com/li59rd/grkh9g/mxy1gc' target='_blank'>如何授权达人</a>}
                            </Loading>
                        </Form.Item>
                        <Form.Item>
                            {model.mainChannel < -100 &&
                            <InvitationActivities ref={e => this.invitationActivitiesChannel = e} getInvitationActvities={this.getGovernmentManages} classNum={1}
                                                  style={{marginLeft: "0", width: '100%'}} callback={this.activityCallback}/>

                            }
                        </Form.Item>
                        <Form.Item>
                            <Loading text='拼命加载中' loading={channelLoading2}>
                                <Cascader props={props2} options={options2} value={channelCascader.default2} disabled={model.id || !mainChannelValue} onChange={this.channelChange}
                                          activeItemChange={this.activityChange}/>
                            </Loading>
                        </Form.Item>
                    </Form> : <div>
                        <Breadcrumb separator="/">
                            <Breadcrumb.Item><Link to={this.props.url}>设置模板</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>编辑渠道</Breadcrumb.Item>
                            <Breadcrumb.Item>{model.channel.title}</Breadcrumb.Item>
                            <Breadcrumb.Item>{model.name}</Breadcrumb.Item>
                            <Breadcrumb.Item>{model.channel.entryName}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>}
                    {alertVisible && <Alert title='您已添加过该渠道模板，请选择其他渠道！' type='warning'/>}
                    {alertVisible && <a href={this.props.url + '/template/' + contentModelId + '/' + url}>点击进入该已添加过的模板</a>}
                </AJAX>
            </div>
        )
    }
}

export default ChannelCascader;
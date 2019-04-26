/**
 * Created by 林辉 on 2018/10/16 10:27.批量创建模板
 */
import {ThousandsOfCall} from "../../../../../../../../lib/util/ThousandsOfCall";
import {Button, Layout, Input, Message, Cascader, Loading, Notification, Alert, Breadcrumb, Card, Form, Select,Checkbox} from 'element-react';
import {InvitationActivities} from "../../../../../../components/PersonSelection";
import {oldModel} from "../../../../../../../../lib/newUtil/channelChange";
import {currencyNoty} from "../../../../../../../../lib/util/Noty";
let failTime=0;
class BatchCreationModel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isTalent: false,//是否有授权达人
            darenList: [],//达人列表
            talentId: '',//已选择的达人
            talentTitle: '',//已选择达人名
            mainChannelList: [],//第一渠道
            mainChannelId: '',//选中的第一渠道id
            mainChannelTitle: '',//选中的第一渠道名字
            activityList: [],//第二渠道数据
            columnName: '',//渠道2名字
            columnId: '',//渠道2id
            entryList: [],//渠道3数据
            chennalList:[],//已选择的渠道
        }
    }

    componentDidMount() { //第一次渲染
        this.newModel();
    }

    newModel = () => {//新建模板
        this.daren_list((darenList) => {//拿取授权达人
            this.setState({darenList: darenList});
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

    handleItemChange = (val) => {//根据达人id选择第一渠道
        let darenList = this.state.darenList;
        let daren = darenList[val];
        let talentId = daren.id;
        if (talentId) {//匹配选中的授权达人
            let list = [{name: '邀请我的活动', id: -10000000}, {name: '新微淘', id: -3}];
            this.getMainChannel(talentId, list, 1, (mainChannelList) => {
                this.setState({talentId: talentId, talentTitle: daren.title, mainChannelList: mainChannelList});
            });
        } else {//未匹配到把旋转取消
            Message.error('未匹配到该达人渠道');
            this.setState({channelLoading: false});
        }
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
                    console.log('data', data);
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
    mainChannelChange = (env) => {//根据渠道1获取渠道2
        let {mainChannelList} = this.state;
        let mainChannel = mainChannelList[env];
        let value = mainChannel.id;
        if (value) {
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
                            console.log('res.data.tabList', res.data.tabList);
                            let tabList = res.data.tabList;
                            let title = '新微淘';//选中的第一渠道名字
                            this.setState({
                                activityList: tabList,//渠道二数据
                                mainChannelId: value,//选中的第一渠道id
                                mainChannelTitle: title,//选中的第一渠道名字
                                alertVisible: false,
                                activityValue: false,
                                channelHideSwitch: false,
                            });
                        } else {
                            Message.error(res.message);
                        }
                    }
                });
            } else if (value < -100) {//进行搜索 邀请我的活动
                this.setState({alertVisible: false, mainChannelId: value, mainChannelTitle: '邀请我的活动', activityValue: false, channelHideSwitch: false,}, () => {
                    this.invitationActivitiesChannel.darenChangeTake();
                });
            } else {//进行第二渠道选择
                console.log('mainChannel.activityList', mainChannel.activityList);
                this.setState({
                    activityList: mainChannel.activityList,//渠道二数据
                    mainChannelId: value,
                    mainChannelTitle: mainChannel.name,//选中的第一渠道名字
                    alertVisible: false,
                    activityValue: false,
                    channelHideSwitch: false,
                });
            }
        }
    };
    getGovernmentManages = ({current = 1, q = ''}, callback) => {//分页式获取活动投稿千里传音
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
    activityCallback = (id, value) => {//搜索选择渠道2回调
        console.log('id', id);
        console.log('value', value);
        let talentId = this.state.talentId;
        let dt = {
            agreement: "https",
            hostname: "contents.taobao.com",
            path: '/api2/channel/channel_info.json',
            method: "get",
            data: {id: id, __version__: 3.0},
            talentId: talentId,
            referer: "https://we.taobao.com/",
        };
        ThousandsOfCall.acoustic(dt, 'requestRelyAgentTB', (json) => {
            if (json.success) {
                let res = JSON.parse(json.data);
                if (res.status === 'SUCCESS') {
                    console.log('邀请我的活动', res);
                    this.setState({columnName: value, columnId: res.data.name, entryList: res.data.typeList});
                } else {
                    Notification.error({
                        title: '错误',
                        message: json.message
                    });
                    return false;
                }
            }
        });

    };

    activityChange = (env) => {//根据渠道2获取渠道3
        let {activityList, mainChannelId, talentId} = this.state;
        let activity = activityList[env];
        let object = {};
        if (mainChannelId === -3) {//新微淘
            console.log('新微淘', activity);
            let {blockList, title, key} = activity;
            let entryList=[];
            for (let b = 0; b < blockList.length; b++) {
                debugger;
                let props = blockList[b].props;
                for (let l = 0; l<props.btnList.length; l++) {
                    entryList.push({title:props.title+'/'+props.btnList[l].text,value:props.btnList[l].url});
                }
            }
            this.setState({alertVisible: false, entryList: entryList, columnId: key, columnName: title, channelHideSwitch: false});
        } else {
           /* if(value === 'hudong') {//新微淘互动
                let btnUrl = object.cities[0].value;
                id = btnUrl.split('activity/')[1];
            }*/
            let dt = {
                agreement: "https",
                hostname: "contents.taobao.com",
                path: '/api2/channel/channel_info.json',
                method: "get",
                data: {id: activity.id, __version__: 3.0},
                talentId: talentId,
                referer: "https://we.taobao.com/",
            };

            ThousandsOfCall.acoustic(dt, 'requestRelyAgentTB', (json) => {
                if (json.success) {
                    let res = JSON.parse(json.data);
                    debugger;
                    if (res.status === 'SUCCESS') {
                        console.log('渠道', res.data);
                        let typeList = res.data.typeList;
                        this.setState({alertVisible: false, columnId: res.data.id, columnName: res.data.name, entryList: typeList, channelHideSwitch: false});
                    } else {
                        Notification.error({
                            title: '错误',
                            message: json.message
                        });
                        return false;
                    }
                }
            });
        }
    };
    entryChange=(env)=>{//第三渠道选择
        let {talentId,talentTitle, mainChannelId, mainChannelTitle, columnName, columnId,entryList,chennalList} = this.state;
        let [entry,data] = [entryList[env],{}];
        let object = {talentId,talentTitle,mainChannelId, mainChannelTitle, columnName, columnId};
        console.log('entry',entry);
        if(mainChannelId===-3){
            let param = entry.value.split('?')[1];
            let pm = param.split('&');
            for (let m=0;m<pm.length;m++) {
                let [key, value] = [pm[m].split('=')[0], pm[m].split('=')[1]];
                data[key] = value;
            }
            object.entryTitle=entry.title;
            object.data=data;
        }else{
            object.entryId=entry.id;
            object.entryTitle=entry.title;
        }
        chennalList.push(object);
        console.log('chennalList',chennalList);
        this.setState({chennalList:chennalList});
    };

    queryChannel = (data, callback) => {//拿取线上渠道模板
        let {title, columnName, channelCascader,talentId} = this.state;
        let [mainChannel, activityId] = [channelCascader.default1[1], channelCascader.default2[0]];
        let dt = {
            agreement: "https",
            hostname: "cpub.taobao.com",
            path: '/render.json',
            method: "get",
            data: data,
            talentId: talentId,
            referer: "https://we.taobao.com/",
        };
        ThousandsOfCall.acoustic(dt, 'requestRelyAgentTB', (json) => {
            if (json.success) {
                debugger;
                if (!json.code || json.code == 200) {
                    try {
                        let res = JSON.parse(json.data);
                        if (res.status === 'success') {
                            let children = res.config.children;
                            oldModel({children: children}, (contentMode) => {
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
                        Notification.error({
                            title: '访问受限',
                            message: json.message
                        });
                    }
                } else if (json.code == 302) {
                    ThousandsOfCall.acoustic({
                        id: this.state.talentId,
                        url: msg.redirectLocation
                    }, "switchAccount", () => {
                        failTime++;
                        this.queryChannel(data, callback);
                    });
                } else {
                    currencyNoty('淘宝操作频繁，请稍后再试，或联系最高管理员重新授权', 'warning')
                }

            }else{
                Notification.error({
                    title: '拿取模板错误',
                    message: json.message
                });
            }
        });
    };

    render() {
        let {darenList, talentId, mainChannelList, mainChannelId,columnId, activityList, entryList,chennalList} = this.state;
        console.log('darenList', darenList);
        return (
            <div>
                <Form inline={true}>
                    <Form.Item label="批量创建模板">
                        <Form.Item>
                            <Select placeholder="请选择授权达人" onChange={this.handleItemChange}>
                                {darenList.map((dl, d) => {
                                    return (
                                        <Select.Option key={dl.id} label={dl.title} value={d}/>
                                    )
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Select placeholder="请选择第一渠道" onChange={this.mainChannelChange} disabled={!talentId}>
                                {mainChannelList.map((mcl, m) => {
                                    return (
                                        <Select.Option key={mcl.id} label={mcl.name} value={m}/>
                                    )
                                })}
                            </Select>
                        </Form.Item>

                        <Form.Item>
                            {mainChannelId < -100 &&
                            <InvitationActivities ref={e => this.invitationActivitiesChannel = e} getInvitationActvities={this.getGovernmentManages} classNum={1}
                                                  style={{marginLeft: "0", width: '100%'}} callback={this.activityCallback}/>}
                        </Form.Item>

                        <Form.Item>
                            <Select placeholder="请选择第二渠道" disabled={!mainChannelId || mainChannelId < -100} onChange={this.activityChange}>
                                {activityList.map((al, a) => {
                                    return (
                                        <Select.Option key={a} label={al.title ? al.title : al.name} value={a}/>
                                    )
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Select placeholder="请选择第三渠道" onChange={this.entryChange} disabled={!columnId}>
                                {entryList.map((el, e) => {
                                    return (
                                        <Select.Option key={e}  label={el.title ? el.title : el.name} value={e}/>
                                    )
                                })}
                            </Select>
                        </Form.Item>
                    </Form.Item>
                </Form>
                <Form>
                    <Form.Item label='已选择渠道'>
                        <Checkbox.Group value={chennalList}>
                            {chennalList.map((cl,c)=>{
                                return(<Checkbox key={c} label={c}>{cl.talentTitle+':'+cl.mainChannelTitle+'/'+cl.columnName+'/'+cl.entryTitle}</Checkbox>)
                            })}

                        </Checkbox.Group>
                    </Form.Item>
                </Form>
                {(!darenList || darenList.length <= 0) && <div>创建模板请先授权达人。<a href='https://www.yuque.com/li59rd/grkh9g/mxy1gc' target='_blank'>如何授权达人</a></div>}

            </div>
        )
    }
}

export default BatchCreationModel;
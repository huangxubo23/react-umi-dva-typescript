/**
 * Created by 林辉 on 2018/8/10 16:06.新建Or编辑模板
 */

import ReactChild from "../../../../../../../../lib/util/ReactChild";
import AJAX from '../../../../../../../../lib/newUtil/AJAX';
import {clone,deepCopy} from '../../../../../../../../lib/util/global';
import {Button, Layout, Input, Message, Cascader, Loading, Notification, Form, InputNumber, Select, Switch, Tabs, Alert, Card, MessageBox, Checkbox, Dialog} from 'element-react';
import {TextInput, CreatorAddItem, CreatorAddImage, AddLink, TagPicker, Activity, AddTag, RadioGroup, Editor, StructCanvas, CascaderSelect, AnchorImageList, Forward,} from './components/template';
import {typeJudgment, FusionModel, v1ToV2, myPropsAndPropsfusion} from '../../../../../../../../lib/newUtil/channelChange';

require('../../../../../../../../../styles/content/content_template.css');
import ChannelCascader from './components/page/channelCascader/channelCascader';
import {ThousandsOfCall} from "../../../../../../../../lib/util/ThousandsOfCall";
import EditPanel from "../../../../../../components/content/EditPanel/EditPanel";

class TemplatePage extends ReactChild {
    stateValue = () => {
        return {
            scrollTop: 0,
            hint: {},
            contentData: {},
            heayWarehouse: [],//排重库数据
            privateDisable: {//违禁词数据
                id: 0,
                privateDisable: "",
            },
            dialogVisible: false,//授权达人模态
            isT: -1,
            isC: -1,
            i: -1,//是否标题
            ii: -1,//是否封面
            MainChannel: [],//渠道1数据
            activity: [],//渠道2数据
            channel: [],//渠道3数据
            alertVisible: false,//警告框按钮
            channelHideSwitch: false,//选择渠道三是否隐藏字段开关
            model: {//单个模板数据
                id: 0,//0新增其他编辑
                mainChannel: '',//第一渠道id
                activityId: '',//第二渠道id
                activityName: '',//第二渠道name
                entryId: '',//第三渠道id
                entryName: '',//第三渠道name
                mainChannelName: '',//第一渠道name
                channelName: undefined,//渠道名字
                name: '',//模板名称
                isRowHeay: true,//是否排重
                sort: 99,//排序
                type: 0,//帖子  2、清单 3 单品 4 搭配 5 结构体
                channelId: '',//渠道id
                isTitle: '',//是否标题
                isCoverImg: '',//是封面图
                constraint: {},//约束
                talentMessageIds: '',//授权id
                url: '',//
                columnName: undefined,//渠道2名字
                //    entryName: undefined,//渠道3 名字
                title: undefined,//渠道1名字
                channel: {},//所有渠道id
                isHide: false,//是否在编辑页面展示 false展示
                privateDisable: '',//违禁词

            },
            newProps: '',//保存的数据
            talentMessageList: [],//所有已授权达人

        }
    };

    constructor(props) {
        super(props);
        this.state = this.stateValue();
    }

    componentDidMount() {
        let scrollParent = $("#panel-body");
        let s = () => {
            let t = scrollParent.scrollTop();
            if (t - 60 > this.state.scrollTop) {
                scrollParent.animate({scrollTop: $('#topModel').height() + 'px'}, 150, "linear", () => {
                    this.setState({scrollTop: $('#topModel').height()}, () => {
                        scrollParent.stop(true, true);
                    });
                })
            } else if (t + 60 < this.state.scrollTop) {
                scrollParent.animate({scrollTop: '0px'}, 150, "linear", () => {
                    scrollParent.stop(true, true);
                    this.setState({scrollTop: 0});
                })
            }
        };
        scrollParent.bind("scroll", s);
        this.getCheesyRowHeayClassification();
    }

    componentWillUnmount() {
        let scrollParent = $("#panel-body");
        scrollParent.unbind("scroll");
    }


    setThisState = (state, callback) => {//其他组件用的set状态
        this.setState(state, ()=> {
            if (callback) {
                callback();
            }
        });
    };


    getCheesyRowHeayClassification = () => {//排重库
        if (this.cheesyRowHeayAjax) {
            this.cheesyRowHeayAjax.ajax({
                type: 'post',
                url: '/message/admin/content/getCheesyRowHeayClassification.io',
                data: {},
                callback: (json) => {
                    this.setState({heayWarehouse: json}, () => {
                        this.getPrivateDisable();//违禁词
                    });
                }
            });
        }
    };

    getPrivateDisable = () => {//违禁词
        this.cheesyRowHeayAjax.ajax({
            type: 'post',
            url: '/user/admin/visible/getPrivateDisable.io',
            data: {},
            callback: (json) => {
                let model = this.state.model;
                if (!model.privateDisable) {
                    model.privateDisable = json.privateDisable;
                }
                this.setState({privateDisable: json, model: model});
            }
        })
    };
    modalChange = (data) => {//改变模板状态
        let value = data.value;
        let name = data.name;
        let model = this.state.model;
        let constraint = model.constraint;
        let nameList = constraint.nameList;
        let ct = constraint.constraint;
        if (name === 'title') {//选择标题
            for (let i = 0; i < nameList.length; i++) {
                ct[nameList[i].name].isTitle = false;
            }

            /* constraint = constraint.map((item) => {
                 item.isTitle = false;
                 return item;
             });*/

            if (value >= 0) {
                ct[nameList[value].name].isTitle = true;
                //   constraint[value].isTitle = true;
            }
            constraint.constraint = ct;
            model.constraint = constraint;
            this.setState({model: model, i: value});
        } else if (name === 'image') {//选择图片
            for (let i = 0; i < nameList.length; i++) {
                ct[nameList[i].name].isCoverImg = false;
            }

            /*constraint = constraint.map((item) => {
                item.isCoverImg = false;
                return item;
            });*/

            if (value >= 0) {
                ct[nameList[value].name].isCoverImg = true;
                //constraint[value].isCoverImg = true;
            }
            constraint.constraint = ct;
            model.constraint = constraint;
            this.setState({model: model, ii: value});
        } else if (name === 'privateDisable') {//违禁词
            value = value.replace(/，/g, ",");
            model.privateDisable = value;
            this.setState({model: model});
        } else {
            model[name] = value;
            this.setState({model: model});
        }
    };
    onChen = (i, label, value, data) => {//模板内变化事件
        value = (!value ? undefined : value);
        let model = this.state.model;
        //let ii = model.constraint[i];
        //ii.props[label] = value;
        let name = model.constraint.nameList[i];
        let ml = '';
        if (model.constraint.constraint[name.name]) {
            if (!model.constraint.constraint[name.name].myProps) {
                model.constraint.constraint[name.name].myProps = {};
            }
            if (value) {
                model.constraint.constraint[name.name].myProps[label] = value;
          //      ml = deepCopy(model);
            } else {
                delete  model.constraint.constraint[name.name].myProps[label];
       //         ml = deepCopy(model);
            }
        }
        let wh = '';
        if (data) {
            wh = data;
            if (data === 'anchorImageListW' || data === 'creatorAddImageW') {
                value = value.split('x')[0];
            } else if (data === 'anchorImageListH' || data === 'creatorAddImageH') {
                value = value.split('x')[1];
            }
            //ii.props[wh] = value;
            model.constraint.constraint[name.name].myProps[wh] = value;
        //    ml = deepCopy(model);
        }
        //  model.constraint[i] = ii;
        this.setState({model: model});
    };
    addAndUpContentMode = () => {//新增模板||编辑模板 if(id=0){新增}else{编辑}
        let isT = -1, isC = -1;
        let constraint = this.state.model.constraint;
        let [c, ct] = [constraint.nameList, constraint.constraint];
        for (let i = 0; i < c.length; i++) {
            if (ct[c[i].name].isTitle) {
                isT = i;
            }
            if (ct[c[i].name].isCoverImg) {
                isC = i;
            }
        }
        if (isT < 0) {
            if (this.state.i < 0) {
                Message.error('请选择标题');
                return false;
            }
            if (isC < 0) {
                Message.error('请选择标题');
                return false;
            }
        }

        /*for (let i in c) {
            if (c[i].isTitle) {
                isT = i;
            }
            if (c[i].isCoverImg) {
                isC = i;
            }
        }*/

        let contentMode = this.state.model;
        let flag = this.channelCascader.state.alertVisible;//模板是否重复

        //  let talentMessageIds = this.talentMessageModal.state.talentMessageIds;
        //contentMode.talentMessageIds = talentMessageIds;
        let ss = JSON.stringify(contentMode);
        if (!flag || contentMode.id) {
            if (this.templateAjax) {
                this.templateAjax.ajax({
                    type: 'post',
                    url: '/content/admin/superManage/addAndUpContentMode.io',
                    data: {'contentMode': ss},
                    callback: (json) => {
                        if (contentMode.id == 0) {
                            if (this.props.match) {
                                window.location.href = window.location.origin + '/pc/admin/content/content_template';//this.props.match.path+'/'+json;
                            } else {
                                window.location.href = window.location.origin + '/pc/admin/content/add/post';
                            }
                        }
                        Notification({
                            title: '成功',
                            message: '操作成功',
                            type: 'success'
                        });
                        /*  this.setState(this.stateValue, () => {
                              this.channelCascader.setState(this.channelCascader.stateValue());
                          });*/
                    }
                });
            }

        } else {
            Notification({
                title: '警告',
                message: '您已添加过该渠道模板，请选择其他渠道！',
                type: 'warning'
            });
            return false;
        }
    };
    recoveryModel = () => {//恢复模板
        let model = this.state.model;
        let channelId = model.channelId;
        MessageBox.confirm('恢复模板前，请先授权该模板达人,授权后再进行恢复，如当天已授权请忽略此提示', '提示', {
            type: 'warning'
        }).then(() => {
            this.recoveryQue(model);
        }).catch(() => {
            Message({
                type: 'info',
                message: '已取消恢复'
            });
        });
    };

    forWhetherToOwnChannelList = (list, talentMessageIds, data, children, callback) => {//循环获取达人模板
        if (list.length > 0) {
            let talent = list.shift();
            talentMessageIds.push(talent.id);

            if (!children && talent.cookieIsFailure) {//如果没有模板与此同时达人已授权
                let dt = {
                    agreement: "https",
                    hostname: "cpub.taobao.com",
                    path: '/render.json',
                    method: "get",
                    data: data,
                    talentId: talent.id,
                    referer: "https://we.taobao.com/",
                };
                ThousandsOfCall.acoustic(dt, 'requestRelyAgentTB', (ctr) => {
                    if (ctr.success) {
                        let res = JSON.parse(ctr.data);
                        if (res.status === 'success') {
                            let children = res.config.children;
                            if (children.length > 0) {//模板有数据继续循环拿取相同渠道达人id
                                this.forWhetherToOwnChannelList(list, talentMessageIds, data, children, callback);
                            } else {
                                this.forWhetherToOwnChannelList(list, talentMessageIds, data, '', callback);
                            }
                        }
                    }
                });
            } else {//继续循环拿取相同渠道达人id
                this.forWhetherToOwnChannelList(list, talentMessageIds, data, children, callback);
            }
        } else {
            let d = {talentMessageIds: talentMessageIds, children: children};
            if (callback) {
                callback(d);
            }
        }
    };

    recoveryQue = (model) => {//恢复确定
        let [data] = [{}];
        if (model.url) {
            let match = this.props.match ? this.props.match : {};//重复模板跳转过来数据
            let params = match.params ? match.params : {};
            let decodeUrl = decodeURIComponent(params.url);
            let url = decodeUrl ? decodeUrl.split('&') : model.url.split('&');//是否有跳转过来数据
            for (let p = 0; p < url.length; p++) {
                let [key, value] = [url[p].split('=')[0], url[p].split('=')[1]];
                data[key] = value;
            }
            if (decodeUrl) {
                model.channel.mainChannelName = data.mainChannelName;
                model.channel.activityName = data.activityName;
                model.channel.entryName = data.entryName;
            }
            if (data.from) {
                model.channel.entryId = '';
            } else {
                data.activityId = model.channel.activityId;
                data.template = model.channel.template;
                model.url = 'template=' + model.channel.template + '&activityId=' + model.channel.activityId;
            }
        } else {
            data.activityId = model.channel.activityId;
            data.template = model.channel.template;
            model.url = 'template=' + model.channel.template + '&activityId=' + model.channel.activityId;
        }
        let type = typeJudgment(data.template);
        model.type = type;
        if((typeof data.activityId  )=='string'){
            data.activityId=-30;
        }
        if (this.state.dialogVisible) {
            this.getTalentMessages(model, data);
        } else {
            this.cheesyRowHeayAjax.ajax({//拿取所有有当前模板达人
                type: 'post',
                url: '/user/admin/org/getWhetherToOwnChannelList.io',
                data: {template: data.template, activityId: data.activityId},
                callback: (json) => {
                    if (model.talentMessageIds > 0) {
                        this.getTalentMessages(model, data);
                    } else {
                        this.forWhetherToOwnChannelList(json, [], data, '', (md) => {//拿取有相同模板达人id和一个模板数据
                            if (!md.children) {
                                Message.error('没有授权当前渠道达人或未匹配到渠道模板,请在当前面板选择一个已有当前模板达人');
                                this.setState({dialogVisible: true});

                            } else {
                                model.talentMessageIds = md.talentMessageIds;
                                this.ResetModel(md.children, model);
                            }
                        });
                    }

                }
            });
        }
    };

    getTalentMessages = (model, data) => {//获取勾选达人数据
        let talentMessageList = this.state.talentMessageList;
        let array = [];
        for (let m = 0; m < talentMessageList.length; m++) {
            for (let t = 0; t < model.talentMessageIds.length; t++) {
                if (talentMessageList[m].id == model.talentMessageIds[t]) {
                    array.push(talentMessageList[m]);
                }
            }
        }
        this.forWhetherToOwnChannelList(array, [], data, '', (m) => {
            model.talentMessageIds = m.talentMessageIds;
            this.setState({dialogVisible: false}, () => {
                this.ResetModel(m.children, model);
            });
        });
    };

    getDesc=(children, model,callback)=>{//线上获取模板介绍
        let dt = {
            agreement: "https",
            hostname: "we.taobao.com",
            path: '/extraInfo/publishInfo.json',
            method: "get",
            data: {__version__: 3.0, infoType: 3, activityId: model.channel.activityId, template:model.channel.template},
            talentId: model.talentMessageIds[0],
            referer: "https://we.taobao.com/",
        };
        ThousandsOfCall.acoustic(dt, 'requestRelyAgentTB', (ctr) => {
            if (ctr.success) {
                let res = JSON.parse(ctr.data);
                if (res.status === 'success'||res.status === 'SUCCESS') {
                    let data = res.data;
                    let taskDesc  =data.taskDesc;
                    callback(taskDesc);
                }else{callback()}
            }else{callback()}
        });
    };

    ResetModel = (children, model) => {//重置模板
        let newModel = '';
        this.getDesc(children, model,(taskDesc)=>{
            model.taskDesc=taskDesc;
            if (model.constraint.v != 2) {
                newModel = v1ToV2(children, model.constraint);
            } else {
                newModel = FusionModel(children, model.constraint);
            }

            model.constraint = clone(newModel);
            this.setState({model: model}, () => {
                this.cheesyRowHeayAjax.ajax({
                    type: 'post',
                    url: '/content/admin/superManage/addAndUpContentMode.io',
                    data: {'contentMode': JSON.stringify(model)},
                    callback: () => {
                        Message({
                            type: 'success',
                            message: '模板已经重置，请核对后再提交!'
                        });
                        this.channelCascader.newOrEditTemplate(newModel);
                    }
                });
            });
        });

    };

    talentMessageIdsChange = (env) => {//授权达人选择事件
        let [value, model] = [env, this.state.model];
        model.talentMessageIds = value;
        this.setState({model: model});
    };

    render() {
        let {model, privateDisable, alertVisible, talentMessageList, isT, isC, hint, contentData, tabsName} = this.state;
        let [arrayCreatorAddImage, arrayInput, talentMessageIds,] = [[], [], []];
        let match = this.props.match ? this.props.match : {};
        let params = match.params ? match.params : {};
        let constraint = model.constraint;
        let [nameList, ct, v] = [constraint.nameList, constraint.constraint, constraint.v];
        if (v == 2) {
            for (let i = 0; i < nameList.length; i++) {
                if (ct[nameList[i].name].isTitle) {
                    isT = i;
                }
                if (ct[nameList[i].name].isCoverImg) {
                    isC = i;
                }
            }
        }
        /* for (let i in c) {
             if (c[i].isTitle) {
                 isT = i;
             }
             if (c[i].isCoverImg) {
                 isC = i;
             }
         }*/
        let url = match.url ? match.url.split('/template')[0] : '';
        if (model.talentMessageIds && (typeof(model.talentMessageIds) != 'string')) {
            talentMessageIds = model.talentMessageIds;
        }
        let h = $("#panel-body").height();
        return (
            <div style={{textAlign: 'left'}} id='tempLatePageId'>
                <AJAX ref={e => this.cheesyRowHeayAjax = e}/>
                <Layout.Row style={{marginBottom: "10px"}}>
                    {<Layout.Col span={24}>{/*渠道选择*/}
                        <div id='topModel'>
                            <ChannelCascader ref={e => this.channelCascader = e} url={url} history={this.props.history} getPrivateDisable={this.getPrivateDisable} thisSetState={this.setThisState}
                                             params={params} model={model} stateValue={this.stateValue}/>
                            {!alertVisible && <Card className="box-card">
                                {(model.id || (this.channelCascader && this.channelCascader.state.channelHideSwitch)) && <Layout.Row style={{marginTop: '20px'}}>
                                    {v!=2&&<Alert title="当前不是最新模板请先恢复模板" type="warning" />}
                                    <Form labelPosition='right' labelWidth='100px'>
                                        <Form.Item>
                                            {params && params.id && <Button type='info' onClick={this.recoveryModel}>恢复模板</Button>}
                                            {params && params.id && <a target='_blank' href='https://www.yuque.com/li59rd/grkh9g/bizqb0'>恢复模板不正常或无效怎么办？</a>}
                                        </Form.Item>
                                    </Form>
                                    {v==2&&<Form model={model} labelPosition='right' labelWidth='100px'>
                                        <Layout.Col span={12}>
                                            <Form.Item label='模板名称'>
                                                <Input value={model.name} placeholder="请输入模板名称" onChange={(value) => {
                                                    this.modalChange({value: value, name: 'name'})
                                                }}/>
                                            </Form.Item>
                                            <Form.Item label='模板排序'>
                                                <InputNumber value={model.sort} defaultValue={model.sort} placeholder="请输入模板排序" onChange={(value) => {
                                                    this.modalChange({value: value, name: 'sort'})
                                                }}/>
                                            </Form.Item>
                                            <Form.Item label="是否在编辑页面展示">
                                                <Switch value={!model.isHide} onChange={(value) => {
                                                    let model = this.state.model;
                                                    model.isHide = !value;
                                                    this.setState({model: model});
                                                }}/>
                                            </Form.Item>
                                        </Layout.Col>
                                        <Layout.Col span={12}>
                                            <Form.Item label="标题选择">
                                                <Select value={parseInt(isT)} placeholder="请选择标题选择" onChange={(value) => {
                                                    this.modalChange({value: value, name: 'title'})
                                                }}>
                                                    <Select.Option label="请选择标题" value={-1}/>
                                                    {(nameList ? nameList : []).map((cc, i) => {
                                                        let item = ct[cc.name];
                                                        if (item.type === 'Input') {
                                                            return (
                                                                <Select.Option key={i} value={i} label={item.title}/>
                                                            )
                                                        }
                                                    })}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item label="封面图选择">
                                                <Select value={parseInt(isC)} placeholder="请选择封面图选择" onChange={(value) => {
                                                    this.modalChange({value: value, name: 'image'})
                                                }}>
                                                    <Select.Option label="请选择封面图" value={-1}/>
                                                    {(nameList ? nameList : []).map((cc, i) => {
                                                        let item = ct[cc.name];
                                                        if (item.type === 'CreatorAddImage' || item.type === 'CreatorAddItem' || item.type === 'AnchorImageList' || item.type === 'CreatorAddSpu') {
                                                            return (
                                                                <Select.Option key={i} value={i} label={item.title}/>
                                                            )
                                                        }
                                                    })}
                                                </Select>
                                            </Form.Item>

                                            <Form.Item label="违禁词">
                                                <Input type="textarea" value={model.privateDisable}
                                                       autosize={{minRows: 2, maxRows: 4}} placeholder="请输入需要违禁的词语，以逗号隔开" rows={10}
                                                       onChange={(value) => {
                                                           this.modalChange({value: value, id: privateDisable.privateDisableId, name: 'privateDisable'})
                                                       }}/>
                                            </Form.Item>
                                        </Layout.Col>
                                        <Layout.Col span={24}>
                                            <Form.Item label="模板简介">
                                                <Input type="textarea" value={model.taskDesc}
                                                       autosize={{minRows: 2, maxRows: 4}} placeholder="请输入模板简介" rows={10}
                                                       onChange={(value) => {
                                                           this.modalChange({value: value, name: 'taskDesc'})
                                                       }}/>
                                            </Form.Item>
                                        </Layout.Col>
                                    </Form>}
                                </Layout.Row>}
                            </Card>}
                        </div>
                    </Layout.Col>}
                </Layout.Row>
                {!alertVisible && <Layout.Row>
                    {v==2&&
                    <Layout.Col span={24}>
                        <Layout.Row gutter="10">
                            <Layout.Col span={12}>
                                {this.channelCascader && this.channelCascader.state.channelHideSwitch &&
                                <Card style={{height: h}}>
                                    <Tabs activeName={nameList.length>0 ? nameList[0].name : '1'} value={tabsName} type="card" style={{minHeight: '300px'}}>{/*onTabClick={}*/}
                                        {(nameList ? nameList : []).map((nl, i) => {
                                            let item = ct[nl.name];
                                            if (!item.title) {
                                                if (item.name === 'body') {
                                                    item.title = '主体';
                                                } else if (item.name === 'subTitle') {
                                                    item.title = '子标题'
                                                } else if (item.name === 'bodyStruct') {
                                                    item.title = '主体'
                                                } else if (item.name === 'itemSpuOption') {
                                                    item.title = 'spu商品'
                                                } else if (item.name === 'summary') {
                                                    item.title = '描述'
                                                } else if (item.name === 'standardCoverUrl') {
                                                    item.title = '封面图'
                                                } else if (item.name === 'forward') {
                                                    item.title = '引导叙述'
                                                }
                                            } else if ((!item.title) || item.type === 'Editor' || item.type === 'StructCanvas' || item.type === 'CreatorAddItem') {
                                                if (item.type === 'Editor') {
                                                    item.title = '帖子编辑器';
                                                }
                                                if (item.type === 'StructCanvas') {
                                                    item.title = '结构体';
                                                }
                                                if (item.type === 'CreatorAddItem') {
                                                    if (!item.title) {
                                                        item.title = '种草单品';
                                                    }
                                                }
                                            }
                                            if (item.type === 'Input') {
                                                arrayInput.push({title: item.title, name: item.name});
                                            }
                                            if (item.type === 'CreatorAddImage') {
                                                arrayCreatorAddImage.push({title: item.title, name: item.name});
                                            }
                                            if (item.type === 'Input') {//文本输入
                                                return <Tabs.Pane key={i} label={item.title ? item.title : item.name} name={item.name}>
                                                    <div className='tabContent' style={{height: h - 140}}>
                                                        <TextInput arrayInput={arrayInput} isTitle={model.isTitle}
                                                                   arrayCreatorAddImage={arrayCreatorAddImage}
                                                                   data={item} index={i} onChange={this.onChen}/>
                                                    </div>
                                                </Tabs.Pane>;
                                            } else if (item.type === 'CreatorAddItem') {//添加商品
                                                return <Tabs.Pane key={i} label={item.title ? item.title : item.name} name={item.name}>
                                                    <div className='tabContent' style={{height: h - 140}}>
                                                        <CreatorAddItem data={item} index={i} arrayInput={arrayInput}
                                                                        isCoverImg={model.isCoverImg} arrayCreatorAddImage={arrayCreatorAddImage}
                                                                        heayWarehouse={this.state.heayWarehouse} onChange={this.onChen}/>
                                                    </div>
                                                </Tabs.Pane>;
                                            } else if (item.type === 'CreatorAddImage') {//添加图片
                                                return <Tabs.Pane key={i} label={item.title ? item.title : item.name} name={item.name}>
                                                    <div className='tabContent' style={{height: h - 140}}>
                                                        <CreatorAddImage data={item} index={i} isCoverImg={model.isCoverImg} onChange={this.onChen}/>
                                                    </div>
                                                </Tabs.Pane>;
                                            } else if (item.type === 'AddLink') {//添加文本链接
                                                return <Tabs.Pane key={i} label={item.title ? item.title : item.name} name={item.name}>
                                                    <div className='tabContent' style={{height: h - 140}}>
                                                        <AddLink data={item} index={i} onChange={this.onChen}/>
                                                    </div>
                                                </Tabs.Pane>;
                                            } else if (item.type === 'TagPicker') {//分类
                                                return <Tabs.Pane key={i} label={item.title ? item.title : item.name} name={item.name}>
                                                    <div className='tabContent' style={{height: h - 140}}>
                                                        <TagPicker data={item} index={i} onChange={this.onChen}/>
                                                    </div>
                                                </Tabs.Pane>;
                                            } else if (item.type === 'Activity') {//互动
                                                return <Tabs.Pane key={i} label={item.title ? item.title : item.name} name={item.name}>
                                                    <div className='tabContent' style={{height: h - 140}}>
                                                        <Activity data={item} index={i} onChange={this.onChen}/>
                                                    </div>
                                                </Tabs.Pane>;
                                            } else if (item.type === 'AddTag') {//添加标签
                                                return <Tabs.Pane key={i} label={item.title ? item.title : item.name} name={item.name}>
                                                    <div className='tabContent' style={{height: h - 140}}>
                                                        <AddTag data={item} index={i} onChange={this.onChen}/>
                                                    </div>
                                                </Tabs.Pane>;
                                            } else if (item.type === 'RadioGroup') {//模特尺码
                                                return <Tabs.Pane key={i} label={item.title ? item.title : item.name} name={item.name}>
                                                    <div className='tabContent' style={{height: h - 140}}>
                                                        <RadioGroup data={item} index={i} onChange={this.onChen}/>
                                                    </div>
                                                </Tabs.Pane>;
                                            } else if (item.type === 'AnchorImageList') {//搭配/图集
                                                return <Tabs.Pane key={i} label={item.title ? item.title : item.name} name={item.name}>
                                                    <div className='tabContent' style={{height: h - 140}}>
                                                        <AnchorImageList data={item} index={i} isCoverImg={model.isCoverImg} onChange={this.onChen}/>
                                                    </div>
                                                </Tabs.Pane>
                                            } else if (item.type === 'Editor') {
                                                return <Tabs.Pane key={i} label={item.title ? item.title : item.name} name={item.name}>
                                                    <div className='tabContent' style={{height: h - 140}}>
                                                        <Editor data={item} index={i} newProps={this.state.newProps} onChange={this.onChen}/>
                                                    </div>
                                                </Tabs.Pane>;
                                            } else if (item.type === 'StructCanvas') {//结构体
                                                return <Tabs.Pane key={i} label={item.title ? item.title : item.name} name={item.name}>
                                                    <div className='tabContent' style={{height: h - 140}}>
                                                        <StructCanvas data={item} index={i} arrayCreatorAddImage={arrayCreatorAddImage} isCoverImg={model.isCoverImg} onChange={this.onChen}/>
                                                    </div>
                                                </Tabs.Pane>;
                                            } else if (item.type === 'CascaderSelect') {
                                                return <Tabs.Pane key={i} label={item.title ? item.title : item.name} name={item.name}>
                                                    <div className='tabContent' style={{height: h - 140}}><CascaderSelect data={item} index={i} onChange={this.onChen}/></div>
                                                </Tabs.Pane>;
                                            } else if (item.type === 'Forward') {
                                                return <Tabs.Pane key={i} label={item.title ? item.title : item.name} name={item.name}>
                                                    <div className='tabContent' style={{height: h - 140}}>
                                                        <Forward data={item} index={i} onChange={this.onChen}/>
                                                    </div>
                                                </Tabs.Pane>;
                                            }
                                        })}
                                    </Tabs>
                                    <AJAX ref={e => this.templateAjax = e}>
                                        <Form>
                                            <Form.Item>
                                                {this.channelCascader && this.channelCascader.state.channelHideSwitch &&
                                                <Button type='info' style={{float: 'right'}} onClick={this.addAndUpContentMode}>提交</Button>}
                                            </Form.Item>
                                        </Form>
                                    </AJAX>
                                </Card>}
                            </Layout.Col>
                            <Layout.Col span={12}>
                                < Card style={{height: h, overflowY: 'auto'}}>
                                    {v == 2 && <EditPanel value={{contentData: contentData, hint: hint, model: model}} onChengeModel={() => {
                                    }} onChange={(value) => {
                                        this.setState(value)
                                    }}/>}
                                </Card>
                            </Layout.Col>
                        </Layout.Row>
                    </Layout.Col>}
                </Layout.Row>}
                <Dialog title="请勾选已有该渠道授权达人" visible={this.state.dialogVisible} onCancel={() =>{ this.setState({dialogVisible: false})}}>
                    <Dialog.Body>{this.state.dialogVisible && (<div>
                        <Form model={model} labelPosition='right' labelWidth='100px'>
                            <Form.Item label='已有当前渠道达人'>
                                <Checkbox.Group value={talentMessageIds} onChange={this.talentMessageIdsChange}>
                                    {talentMessageList.map((item, i) => {
                                        return (
                                            <Checkbox label={item.id} key={item.id}>{item.title}{!item.cookieIsFailure && '(未授权)'}</Checkbox>
                                        )
                                    })}
                                </Checkbox.Group>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" onClick={this.recoveryModel}>确定</Button>
                            </Form.Item>
                        </Form>
                    </div>)}
                    </Dialog.Body>
                </Dialog>
            </div>)
    }
}

export default TemplatePage;
/**
 * Created by shiying on 17-7-20.
 */

import ReactChild from "../../../../../../lib/util/ReactChild";
require("../../../../../../../styles/content/addContent.css");
require("../../../../../../../styles/component/react_assembly/listContent.css");
import {Prompt} from 'react-router';
import $ from 'jquery';
import React from 'react';
import {ajax} from '../../../../../../../components/lib/newUtil/ajaxEx';
import AJAX from '../../../../../../lib/newUtil/AJAX';
import {Alert, Button, Tabs, Input, Layout, Message, MessageBox, Popover, Progress, Notification, Loading, Steps, Card,} from 'element-react';
import 'element-theme-default';
import {generateUUID} from '../../../../../../../components/lib/util/global'
import '../../../../../../../styles/addList/content.css';
import {BundleLoading} from '../../../../../../../bundle';
import StringModule from 'bundle-loader?lazy&name=pc/trends_asset/components/page/admin/components/content/StringModule/app-[name]!../../../../components/content/StringModule'
import ItemModule from 'bundle-loader?lazy&name=pc/trends_asset/components/page/admin/components/content/ItemModule/app-[name]!../../../../components/content/ItemModule'
import SpuModule from 'bundle-loader?lazy&name=pc/trends_asset/components/page/admin/components/content/SpuModule/app-[name]!../../../../components/content/SpuModule'
import AnchorImageListModule from 'bundle-loader?lazy&name=pc/trends_asset/components/page/admin/components/content/AnchorImageListModule/app-[name]!../../../../components/content/AnchorImageListModule'
import ImgModule from 'bundle-loader?lazy&name=pc/trends_asset/components/page/admin/components/content/ImgModule/app-[name]!../../../../components/content/ImgModule'
import AddTagModule from 'bundle-loader?lazy&name=pc/trends_asset/components/page/admin/components/content/AddTagModule/app-[name]!../../../../components/content/AddTagModule'
import TagPickerModule from 'bundle-loader?lazy&name=pc/trends_asset/components/page/admin/components/content/TagPickerModule/app-[name]!../../../../components/content/TagPickerModule'
import RadioGroupModule from 'bundle-loader?lazy&name=pc/trends_asset/components/page/admin/components/content/RadioGroupModule/app-[name]!../../../../components/content/RadioGroupModule'
import AddLinkModule from 'bundle-loader?lazy&name=pc/trends_asset/components/page/admin/components/content/AddLinkModule/app-[name]!../../../../components/content/AddLinkModule'
import TitleModule from 'bundle-loader?lazy&name=pc/trends_asset/components/page/admin/components/content/TitleModule/app-[name]!../../../../components/content/TitleModule'
import EditModule from 'bundle-loader?lazy&name=pc/trends_asset/components/page/admin/components/content/EditModule/app-[name]!../../../../components/content/EditModule'
import StructCanvasModule from 'bundle-loader?lazy&name=pc/trends_asset/components/page/admin/components/content/StructCanvasModule/app-[name]!../../../../components/content/StructCanvasModule'
import CascaderSelectModule from 'bundle-loader?lazy&name=pc/trends_asset/components/page/admin/components/content/CascaderSelectModule/app-[name]!../../../../components/content/CascaderSelectModule'
import IceAddVideoModule from 'bundle-loader?lazy&name=pc/trends_asset/components/page/admin/components/content/IceAddVideoModule/app-[name]!../../../../components/content/IceAddVideoModule'
import TextModule from 'bundle-loader?lazy&name=pc/trends_asset/components/page/admin/components/content/TextModule/app-[name]!../../../../components/content/TextModule'
import ForwardModule from 'bundle-loader?lazy&name=pc/trends_asset/components/page/admin/components/content/ForwardModule/app-[name]!../../../../components/content/ForwardModule'
import RatingModule from 'bundle-loader?lazy&name=pc/trends_asset/components/page/admin/components/content/RatingModule/app-[name]!../../../../components/content/RatingModule'
import AtlasImageListModule from 'bundle-loader?lazy&name=pc/trends_asset/components/page/admin/components/content/AtlasImageListModule/app-[name]!../../../../components/content/AtlasImageListModule'
import TypeTabModule from '../../../../components/content/TypeTabModule'
import AuthorizedPersonModule from '../../../../components/content/AuthorizedPersonModule'
import OriginalStatementModule from '../../../../components/content/OriginalStatementModule'
import SignModule from '../../../../components/content/SignModule'
import {dynamicAnalysis} from '../components/contentCurrency'
import SubmitHint from '../../../../components/content/SubmitHint'
import {daren_list, darenId_change, newTemplate} from '../release/components/take'
import '../../../../../../../styles/addList/content.css';
import noty from 'noty';
import {ThousandsOfCall} from '../../../../../../lib/util/ThousandsOfCall';
import {FusionModel, v1ToV2} from '../../../../../../../components/lib/newUtil/channelChange'
import {myPropsAndPropsfusion} from '../../../../../../../components/lib/newUtil/channelChange'
import Menu from "../../../../components/AdminMenu";
import BountyTaskList from '../../../../page/bountyTask/components/bountyTaskList';

const Ajax = ajax.ajax;

class ModeSelection extends ReactChild {
    constructor(props) {
        super(props);
        this.state = {
            pageNow: 1,
            pageSize: 200,
            count: 0,
            countPage: 1,
            name: '',
            contentMode: [],
            present: 0,
            title: "",
        }
    }

    componentDidMount() { //第一次渲染
        this.goPage(1);
    }

    componentDidUpdate() {//  组建更新后

    }

    getContentMode = (da) => {
        let {getState, contentType} = this.props;
        let groupId = getState.groupId;
        if (groupId) {
            da.groupId = groupId;
        }
        if (this.contentModeAjax) {
            this.contentModeAjax.ajax({
                url: "/content/admin/" + contentType + "/queryContentOvert.io",//要访问的后台地址
                data: da,//要发送的数据
                callback: (data) => {
                    if (data) {
                        let count = data.count;
                        let pageSize = data.pageSize;
                        let countPage = this.state.countPage;
                        if (count / pageSize > parseInt(count / pageSize)) {
                            countPage = parseInt(count / pageSize) + 1;
                        } else {
                            countPage = parseInt(count / pageSize);
                        }
                        data.countPage = countPage;
                        let present = this.state.present;
                        let contentMode = data.contentMode;
                        let contentModeids = contentMode.map((item) => {
                            return item.id;
                        });
                        let noMode = this.getnowMode();
                        if (noMode && contentModeids.indexOf(noMode.id) < 0) {
                            contentMode.unshift(noMode);
                        }
                        data.contentMode = contentMode;
                        let id = this.props.id;
                        if (id) {
                            id = id.split('#')[0];
                        }
                        if (!present && !id) {
                            present = contentMode[0] ? contentMode[0].id : undefined;
                            data.present = present;
                        }
                        this.setState(data, () => {
                            this.setMainContentState();
                        });
                    }
                }
            });
        }
    };
    goPage = (pageNow = this.state.pageNow) => {/*点击分页*/
        let {pageSize, name} = this.state;
        this.getContentMode({
            pageNow: pageNow, pageSize, name,
        });
    };
    selectPresent = (env) => {
        let i = parseInt(env.props.name);
        this.ifContentType(i, true);
    };
    ifContentType = (i, modelChoose) => {
        let {contentType, commodityBank} = this.props;
        if (contentType === "struct") {
            MessageBox.confirm('因结构体数据结构不同，切换模式可能会丢失数据, 是否继续?', '提示', {
                type: 'warning'
            }).then(() => {
                this.setState({present: i}, () => {
                    this.props.setMainContentState({modelChoose}, () => {
                        this.setMainContentState();
                    });
                    commodityBank();
                });
            }).catch(() => {
                Message({
                    type: 'info',
                    message: '取消切换'
                });
            });
        } else {
            this.setState({present: i, id: i}, () => {
                this.props.setMainContentState({modelChoose: modelChoose}, () => {
                    this.setMainContentState();
                    commodityBank();
                });
            });
        }
    };

    setMainContentState = (modelChoose) => {
        let nowContentMode = this.getnowMode(),object = {};
        Object.assign(object, nowContentMode);
        if (nowContentMode && nowContentMode.constraint && nowContentMode.constraint.v === 2) {
            // newDataMerge.mergeProps({contentMode:nowContentMode},(newContentMode)=>{
            //     this.props.setMainContentState({nowContentMode:newContentMode,initialMode:nowContentMode}, () => {
            //         this.props.contentModeChenag();
            //     });
            // });
            object.constraint.constraint = myPropsAndPropsfusion(object.constraint.constraint);
            this.props.setMainContentState({nowContentMode: object, initialMode: nowContentMode}, () => {
                this.props.contentModeChenag();
            });
        } else {
            this.props.setMainContentState({nowContentMode: nowContentMode, initialMode: nowContentMode}, () => {
                this.props.contentModeChenag();
            });
        }
    };

    getnowMode = () => {
        let {contentMode, present} = this.state;
        for (let i = 0; i < contentMode.length; i++) {
            if (present == contentMode[i].id) {
                return contentMode[i];
            }
        }
    };
    setSelectId = (id) => {
        let isRepeated = false;
        let callback = (data) => {
            let {contentMode} = this.state;
            let arr = data ? [...contentMode, data] : contentMode;
            this.setState({contentMode: arr}, () => {
                for (let i = 0; i < contentMode.length; i++) {
                    if (contentMode[i].id == id) {
                        this.setState({present: id}, () => {
                            this.setMainContentState();
                        });
                    }
                }
            })
        };
        let isContentMode = setInterval(() => {
            let {contentMode} = this.state;
            if (contentMode.length > 0) {
                clearInterval(isContentMode);
                for (let i in contentMode) {
                    if (contentMode[i].id == id) {
                        isRepeated = true;
                        break;
                    }
                }
                if (!isRepeated) {
                    this.setSelectIdJson(id, (data) => {
                        callback(data);
                    })
                } else {
                    callback();
                }
            }
        }, 500);

        /*this.setSelectIdJson(id, (callback) => {
            let isRepeated = false;
            let {contentMode} = this.state;
            for (let i in contentMode) {
                if (contentMode[i].name == callback.name) {
                    isRepeated = true;
                    break;
                }
            }
            if (!isRepeated) {
                contentMode.push(callback);
            }
            this.setState({contentMode: contentMode}, () => {
                for (let i = 0; i < contentMode.length; i++) {
                    if (contentMode[i].id == id) {
                        this.setState({present: id}, () => {
                            this.setMainContentState();
                        });
                    }
                }
            })
        });*/
    };

    setSelectIdJson = (id, callback) => {
        this.contentModeAjax.ajax({
            url: "/content/admin/content/contentModeById.io",
            data: {id: id},
            callback: (data) => {
                if (callback) {
                    callback(data);
                }
            }
        });
    };

    render() {
        let {contentMode, present, name} = this.state;
        let {getState, modelChoose} = this.props;
        let ids = contentMode.map((item) => {
            return item.id;
        });
        return (
            <AJAX ref={e => this.contentModeAjax = e}>
                <div style={{marginTop: "12px"}}>
                    {getState.largeProcess.largeProcess &&
                    <Alert title={getState.largeProcess.groupName} type="success" closable={false}/>}
                    <Input style={{marginBottom: '10px'}} value={name} placeholder="请输入模板名字进行搜索" onChange={(value) => {
                        this.setState({name: value})
                    }} onKeyDown={(event) => {
                        if (event.keyCode == "13") {
                            this.goPage(1)
                        }
                    }} append={<Button type="primary" icon="search" onClick={() => {
                        this.goPage(1)
                    }}>搜索</Button>}/>

                    {((this.props.id || modelChoose) && contentMode && contentMode.length > 0) ?
                        <Tabs type="card" value={ids.indexOf(present) >= 0 ? `${present}` : undefined}
                              onTabClick={this.selectPresent} className="listMode">
                            {contentMode.map((item) => {
                                return (
                                    <Tabs.Pane label={item.name} name={`${item.id}`} key={item.name}>

                                    </Tabs.Pane>
                                )
                            })}
                        </Tabs> : <ModelBlock contentMode={contentMode} ifContentType={this.ifContentType}/>}
                </div>
            </AJAX>
        );
    }
}


class EditPanel extends ReactChild {
    constructor(props) {
        super(props);
        let type;
        let {contentType} = this.props;
        if (this.props.type) {
            type = this.props.type;
        } else {
            type = contentType == 'post' ? 1 : contentType == 'album' ? 2 : contentType == 'cheesy' ? 3 : contentType == 'dap' ? 4 : contentType == 'struct' ? 7 : contentType == 'video' ? 8 : '';
        }
        this.state = {
            contentData: {
                type: type
            },
            picUrl: "",
            title: "",
            hint: {},
            id: 0,
            flag: '',
            constraint: {},
            typeTab: "",
            authorizedPerson: '',
            dynamic: false,
            timeCardAdd: false,
            contraband: [],
            isDiagnosis: false,
            authorizedPersonList: [],
            stepNumber: 0,
            stepType: 'success',
            currentLocation: 100
        }
    }

    parameter = (api, callback) => {
        let [arr, item] = [(api.split("?")[1]).split("&"), {pageSize: 10, current: 1}];
        for (let i in arr) {
            item[((arr[i].split("="))[0])] = (arr[i].split("="))[1];
        }
        ThousandsOfCall.acoustic({
                agreement: "https",
                hostname: "resource.taobao.com",
                path: '/comresource/query',
                method: "POST",
                data: item,
                referer: "https://we.taobao.com/",
            }, "requestRelyTB", (json20) => {
                if (json20) {
                    let json = JSON.parse(json20.data);
                    if (json.status == "SUCCESS") {
                        callback(json.data.itemList);
                    }
                }
            }
        );
    };

    getSidebarBlockList = (constraint, ind, sidebarBlockList, i, callback) => {
        if (sidebarBlockList.length > i) {
            if (sidebarBlockList[i].moduleInfo) {
                constraint[ind].props.moduleInfos[sidebarBlockList[i].moduleInfo.materialId] = sidebarBlockList[i].moduleInfo;
                i++;
                this.getSidebarBlockList(constraint, ind, sidebarBlockList, i, callback);
            } else {
                this.parameter(sidebarBlockList[i].props.api, (data) => {
                    let sss = setInterval(() => {
                        clearInterval(sss);
                        for (let d in data) {
                            let materialId = data[d].materialId;
                            constraint[ind].props.moduleInfos[materialId] = data[d];
                        }
                        i++;
                        this.getSidebarBlockList(constraint, ind, sidebarBlockList, i, callback);
                    }, 600);
                });
            }
        } else {
            callback(constraint);
        }
    };

    contentModeChenag = () => {
        this.setState({authorizedPerson: ''}, () => {
            let contentData = this.state.contentData;
            let constraint = this.props.contentMode ? this.props.contentMode.constraint : [];
            for (let name in contentData) {
                if (contentData[name].type == "StructCanvas") {
                    let constraintItem;
                    for (let ind in constraint) {
                        if (constraint[ind].name == name && constraint[ind].type == 'StructCanvas') {
                            let sidebarBlockList = constraint[ind].props.sidebarBlockList ? constraint[ind].props.sidebarBlockList : [];

                            this.getSidebarBlockList(constraint, ind, sidebarBlockList, 0, (c) => {
                                constraint = c;
                                constraintItem = constraint[ind];
                                let value = contentData[name].value;
                                let newV = [];
                                for (let i in value) {
                                    let materialId = value[i].materialId;
                                    if (constraintItem.props.moduleInfos[materialId]) {
                                        newV.push(value[i]);

                                    }
                                }

                                let topLockIndex = constraintItem.props.topLockIndex;
                                if (topLockIndex) {
                                    if (newV.length < topLockIndex) {
                                        for (let i = newV.length; i < topLockIndex && i < constraintItem.props.value.length; i++) {
                                            newV[i] = constraintItem.props.value[i];
                                        }
                                    }
                                }
                                contentData[name].value = [];
                                contentData[name].value = newV;
                                this.setState({contentData: contentData});
                            });
                        }
                    }
                }
            }
            let id = this.props.id;
            if (!id) {//默认人群判断
                if (contentData.crowdId) {
                    for (let c in constraint) {
                        if (constraint[c].type === "CascaderSelect") {
                            let {childrenvalue} = constraint[c].props;
                            if (this.casader && this.casader.jd) {
                                this.casader.jd.setState({options: constraint[c].props.dataSource}, () => {
                                    if (childrenvalue) {
                                        contentData.crowdId = {
                                            type: "CascaderSelect",
                                            value: childrenvalue,
                                            version: 3,
                                        };
                                        this.setState({contentData: contentData});
                                    }
                                });
                            }
                        }
                    }
                }
            }
        })
    };

    componentDidMount() {
        let {id} = this.props;
        daren_list((array) => {
            this.setState({authorizedPersonList: array}, () => {
                if (id) {
                    let dt = setInterval(() => {
                        let {contentData} = this.state, {contentMode} = this.props;
                        if (contentMode) {
                            clearInterval(dt);
                            let s = false, c = false;
                            array.forEach(item => {
                                if ((item.id == contentData.authorizedPerson) && item.cookieIsFailure) {
                                    s = true;
                                }
                            });
                            if (contentMode.constraint instanceof Array) {
                                contentMode.constraint.forEach((item) => {
                                    if (item.updateOnChange == 'true') {
                                        c = true;
                                    }
                                });
                            } else {
                                let constraint = contentMode.constraint.constraint;
                                for (let con in constraint) {
                                    if (constraint[con].updateOnChange == 'true') {
                                        c = true;
                                    }
                                }
                            }

                            if (this.state.is && s && c) {
                                this.setState({
                                    loading: true,
                                    authorizedPerson: contentData.authorizedPerson
                                }, this.updateOnChange);
                            } else {
                                if (c && (!s)) {
                                    Notification({
                                        title: '警告',
                                        message: `动态加载不能使用，请重新选择达人号获取数据`,
                                        type: 'warning'
                                    });
                                }
                            }
                        }
                    }, 500);
                }
            })
        });
        if (id) {
            id = id.split('#')[0];
            this.getData(id);
        }
        this.timer = setInterval(() => {
            let largeProcess = this.props.getState.largeProcess.largeProcess ? this.props.getState.largeProcess.largeProcess : '';
            let groupId = this.props.getState.groupId ? this.props.getState.groupId : '';
            if (this.state.dynamic) {
                if (this.state.typeTab) {
                    let contentData = this.state.contentData;
                    let data = {
                        id: this.state.id,
                        typeTab: this.state.typeTab,
                        flag: this.state.flag,
                        remarks: this.state.remarks,
                        contentModeId: this.props.contentMode.id,
                        data: contentData,
                        title: this.state.title.indexOf("[自动保存]") >= 0 ? this.state.title : ("[自动保存]" + this.state.title),
                        picUrl: this.state.picUrl,
                        version: 3
                    };
                    let d = {};
                    if (largeProcess && groupId) {
                        data.creator = groupId;
                        data.largeProcessId = largeProcess.id;
                        d.groupId = groupId;
                    }
                    d.data = JSON.stringify(data);
                    Ajax({//this.editPanelAjax.ajax
                        url: "/content/admin/" + this.props.contentType + "/domain.content.add.io",
                        data: d,
                        async: false,
                        type: "post",
                        callback: (data) => {
                            this.setState({id: data.id, dynamic: false}, () => {
                                Message({
                                    message: '系统已为你自动保存',
                                    type: 'success'
                                });
                            });
                        }
                    });
                } else {
                    Message.error('请选择一个类别,否则不能自动定时提交');
                }
            }
        }, 1000 * 60 * 10);//设置时间周期
        this.currentLocation();
    }

    currentLocation = () => {
        let scrollParent = $(".scrollParent");
        if (scrollParent.length == 0) {
            scrollParent = $(window);
        }
        scrollParent.scroll(() => {
            let t = scrollParent.scrollTop();
            let len = $('.leftContent').width() > 50 ? 1048 : 828;
            if (t > 190) {
                $(".currentLocation").addClass("newPosition");
                this.setState({leftDeviation: len})
            } else {
                $(".currentLocation").removeClass("newPosition");
                this.setState({leftDeviation: 828})
            }
        });
    };

    componentWillUnmount() {
        this.timer && clearInterval(this.timer);
    }

    getData = (id) => {
        let groupId = this.props.getState.groupId;
        let data = {id: id};
        if (groupId) {
            data.groupId = groupId;
        }
        Ajax({//   this.editPanelAjax.ajax
            url: "/content/admin/" + this.props.contentType + "/domain.content.get.edit.io",
            async: false,
            data: data,
            callback: (data) => {
                this.props.setContentMode(data.contentModeId);
                data.is = true;
                this.setState(data, () => {
                    let contentData = this.state.contentData;
                    for (let i in contentData) {
                        if (contentData[i].type == "Editor") {
                            let s = setInterval(() => {
                                let m = this.editModule;
                                if (m && m.jd) {
                                    m.jd.setEditBoxContent(contentData[i].value);
                                    clearInterval(s);
                                }
                            }, 1000)

                        }
                    }
                });
            }
        });
    };

    submit = () => {
        let groupId = this.props.getState.groupId;
        if (!this.state.typeTab) {
            Message.error(`必须选择一个类别`);
            return;
        }
        if (groupId) {
            let id = this.props.id;
            if (id) {
                id = id.split('#')[0];
            }
            this.submitHint.open(this.submitData, id);
        } else {
            this.submitHint.open(this.submitData);
        }

    };
    submitData = (submitNextStep) => {
        let {getState} = this.props, {authorizedPerson, contentData} = this.state,d = {};
        let [groupId, largeProcess] = [getState.groupId, getState.largeProcess.largeProcess ? getState.largeProcess.largeProcess : ''];
        if (authorizedPerson) {
            contentData.authorizedPerson = authorizedPerson;
        }
        let data = {
            id: this.state.id,
            typeTab: this.state.typeTab,
            contentModeId: this.props.contentMode.id,
            data: contentData,
            title: this.state.title,
            picUrl: this.state.picUrl,
            flag: this.state.flag,
            remarks: this.state.remarks,
            timeCardAdd: this.state.timeCardAdd,
            version: 3
        };
        if (groupId && largeProcess) {//判断是否小组数据
            data.creator = groupId;
            data.largeProcessId = largeProcess.id;
            d.groupId = groupId;
        }
        d.data = JSON.stringify(data);
        Ajax({//this.editPanelAjax.ajax
            url: "/content/admin/" + this.props.contentType + "/domain.content.add.io",
            data: d,
            async: false,
            type: "post",
            callback: (data) => {
                this.setState({id: data.id}, () => {
                    let [editUrl, addUrl, queryUrl] = ['', '', ''];
                    if (groupId) {//小组编辑｀新增｀查看链接
                        [editUrl, addUrl, queryUrl] = ["/pc/adm/content/groupAdd/" + this.props.contentType + '/' + groupId + '/' + data.id, "/pc/adm/content/groupAdd/" + this.props.contentType + '/' + groupId, "/pc/adm/content/groupList/" + this.props.contentType + '/' + groupId];
                    } else {//内容列表编辑｀新增｀查看链接
                        [editUrl, addUrl, queryUrl] = ["/pc/adm/content/add/" + this.props.contentType + "/" + data.id, "/pc/adm/content/add/" + this.props.contentType, "/pc/adm/content/list/" + this.props.contentType];
                    }
                    if (submitNextStep && groupId) {//判断编辑的时候是不是提交转下一步
                        Ajax({//this.editPanelAjax.ajax
                            type: 'post',
                            url: '/content/admin/manageGroup/upContentStep.io',//转下一步
                            data: {contentIds: JSON.stringify([{contentIds: this.state.id}]), groupId: groupId},
                            callback: (small) => {
                                this.EditOrAddOrQuery(editUrl, addUrl, queryUrl);
                            }
                        });
                    } else {
                        this.EditOrAddOrQuery(editUrl, addUrl, queryUrl);
                    }
                });
            }
        });
    };

    EditOrAddOrQuery=(e, a, q)=> {
        this.delOnlyString();//提交成功后删除唯一字符串
        this.props.leavePrompt(false);
        new noty({
            text: '操作成功',
            type: 'info',
            layout: 'center',
            theme: 'bootstrap-v4',
            modal: true,
            animation: {
                open: 'noty_effects_open',
                close: 'noty_effects_close'
            }, buttons: [
                noty.button('继续编辑这个内容', 'btn btn-success ma', () => {
                    window.onbeforeunload = null;
                    location.replace(e);

                }),

                noty.button('添加新的内容', 'btn btn-primary ma', () => {
                    window.onbeforeunload = null;
                    location.replace(a);

                }),

                noty.button('查看内容列表', 'btn btn-info ma', () => {
                    window.onbeforeunload = null;
                    location.replace(q);
                })
            ]
        }).show();
    };

    prompt = (title, value) => {
        let {privateDisable} = this.props.contentMode;
        if (value) {
            let contraband = privateDisable ? privateDisable.split(",") : [];
            for (let i in contraband) {
                let t = contraband[i];
                if (t.length > 0) {
                    if (value.indexOf(t) >= 0) {
                        Message.error(`当前${title}出现违禁词【${t}】,请核查`);
                    }
                }
            }
        }
    };

    upmodalChange = (constraint, value) => {//更新模板

    };

    dataChange = (constraint, value, hint) => {
        if (constraint.type == "Editor") {
            let b = value.blocks;
            let e = value.entityMap;
            for (let t in b) {
                let val = b[t].text;
                this.prompt('帖子编辑框文本', val);
            }
            if (e) {
                for (let t in e) {
                    if (e[t].type == "SIDEBARSEARCHITEM") {
                        let val = e[t].data.description;
                        this.prompt('帖子编辑框商品', val);
                    }
                }
            }
        } else if (constraint.type == "CreatorAddItem") {
            for (let t in value) {
                let val = value[t].description;
                let v = value[t].title;
                if (val) {
                    this.prompt('宝贝描述', val);
                }
                if (v) {
                    this.prompt('宝贝标题', v);
                }
            }
        } else if (constraint.type == "StructCanvas") {
            for (let t in value) {
                if (value[t].name == "item-feature") {
                    let features = value[t].data.features;
                    for (let f in features) {
                        this.prompt('亮点', features[f]);
                    }
                } else if (value[t].name == "item-paragraph-select" || value[t].name == "item-paragraph") {
                    this.prompt('段落介绍', value[t].data.desc);
                    this.prompt('段落标题', value[t].data.title);
                } else if (value[t].name == "shop-inventory-separator") {
                    this.prompt('分隔符内容', value[t].data.title);
                } else if (value[t].name == "paragraph") {
                    this.prompt('段落文字', value[t].data.text);
                } else if (value[t].name == "two-column-items") {
                    let items = value[t].data.items;
                    for (let it in items) {
                        this.prompt('双列宝贝标题', items[it].item_title);
                    }
                } else if (value[t].name == "content-shop") {
                    let shopDetail = value[t].data.shopDetail;
                    for (let s in shopDetail) {
                        this.prompt('店铺描述', shopDetail[s].shop_desc);
                    }
                } else if ((value[t].name == "single-item-inventory") || (value[t].name == "single-item-rank")) {
                    this.prompt('榜单宝贝描述', value[t].data.itemDescription);
                    this.prompt('榜单宝贝标题', value[t].data.itemTitle);
                    this.prompt('榜单段落标题', value[t].data.title);
                }
            }
        } else {
            this.prompt('输入', value);
        }
        let {contentData} = this.state;
        const name = constraint.name;
        if (constraint.type == "Editor") {
            let blocks = value ? value.blocks : [];
            for (let i in blocks) {
                while (blocks[i] && blocks[i].type == "atomic" && blocks[i].entityRanges.length == 0) {
                    blocks.splice(i, 1);
                }
                if (blocks[i].type == "atomic") {
                    let newb = blocks[i];
                    newb.entityRanges[0].length = 1;
                    newb.entityRanges[0].offset = 0;
                    newb.text = " ";
                    blocks[i] = newb;
                }
                value.blocks = blocks;
            }
            contentData[name] = {type: constraint.type, value: value, version: 3};
        } else {
            contentData[name] = {type: constraint.type, value: value, version: 3};
        }
        let hintD = this.state.hint;
        if (hint) {
            hintD[name] = hint;
        }
        let state = {contentData: contentData, hint: hintD};
        if (constraint.isTitle) {
            state.title = value;
        }
        if (constraint.isCoverImg) {
            let coverImg = "";
            switch (constraint.type) {
                case "CreatorAddItem":
                    coverImg = value && value[0] ? value[0].coverUrl : "";
                    break;
                case "CreatorAddImage":
                    coverImg = value && value[0] ? value[0] : "";
                    break;
                case "AnchorImageList":
                    coverImg = value && value[0] ? (value[0].url ? value[0].url : value[0].pushItem.url) : "";
                    break;
            }
            state.picUrl = typeof coverImg == "object" ? coverImg.url : coverImg;
        }
        state.dynamic = true;
        state.visible = false;
        state.tipsContent = undefined;
        this.setState(state, () => {
            if(constraint.type!='RadioGroup'&&constraint.type!='CascaderSelect'){
                this.props.leavePrompt(true);
            }
            if (constraint.updateOnChange == 'true' && this.state.authorizedPerson) {
                this.setState({loading: true}, this.updateOnChange);
            }
        });
    };

    dataAdditionalChange = (name, value) => {
        let {contentData} = this.state, {constraint} = this.props.contentMode;
        if (constraint instanceof Array) {
            for (let i in constraint) {
                let item = constraint[i];
                if (item.name == name) {
                    if (item.type == "Input") {
                        let s = contentData[name] ? contentData[name] : {type: item.type, version: 3, value: ""};
                        let v = s.value ? s.value : "";
                        v = value;
                        s.value = v;
                        contentData[name] = s;
                        //StringModule.hint(v, item);
                        this.setState({contentData: contentData});
                        break;
                    } else if (item.type == "CreatorAddImage") {
                        let s = contentData[name] ? contentData[name] : {type: item.type, version: 3, value: []};
                        let v = s.value ? s.value : [];
                        v.push(value);
                        s.value = v;
                        contentData[name] = s;
                        //ImgModule.hint(v, item);
                        this.setState({contentData: contentData});
                        break;
                    }
                }
            }
        } else {
            constraint.nameList.forEach((item, index) => {
                if (item.name == name) {
                    if (constraint.constraint[item.name].type == 'Input') {
                        let s = contentData[name] ? contentData[name] : {type: item.type, version: 3, value: ""};
                        let v = s.value ? s.value : "";
                        v = value;
                        s.value = v;
                        contentData[name] = s;
                        //StringModule.hint(v, item);
                        this.setState({contentData: contentData});
                    } else if (constraint.constraint[item.name].type == 'CreatorAddImage') {
                        let s = contentData[name] ? contentData[name] : {type: item.type, version: 3, value: []};
                        let v = s.value ? s.value : [];
                        v.push(value);
                        s.value = v;
                        contentData[name] = s;
                        //ImgModule.hint(v, item);
                        this.setState({contentData: contentData});
                    }
                }
            })
        }
    };

    typeTabChange = (value) => {
        this.setState({typeTab: value});
    };

    originalStatementChange = (value) => {
        let {contentData} = this.state;
        contentData.newOriginalStatement = value;
        this.setState({contentData});
    };

    timeCardAddChange = (value) => {
        this.setState({timeCardAdd: value});
    };
    poolState = () => {
        let itemModule = this.itemModule;
        if (itemModule && itemModule.jd) {
            itemModule.jd.selectionChange();
        }
        // let anchorImageListModule=this.anchorImageListModule;
        // if(anchorImageListModule){
        //     anchorImageListModule.selectionChange();
        // }
        let editModule = this.editModule;
        if (editModule && editModule.jd) {
            editModule.jd.selectionChange();
        }
    };
    delOnlyString = () => {//删除唯一字符串
        let contentId = this.props.id;
        if (contentId) {
            contentId = contentId.split('#')[0];
            Ajax({//  this.editPanelAjax.ajax
                type: 'post',
                url: '/content/admin/content/delOnlyString.io',
                data: {contentId: contentId},
                callback: (json) => {

                }
            });
        }
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

    updateOnChange = () => {//动态加载
        let {contentMode, initialMode} = this.props, {authorizedPerson, contentData} = this.state;
        this.templateData({
            talentId: authorizedPerson,
            nowContentMode: contentMode,
            type: 'dynamicLoading'
        }, ({talentId, newConfig}) => {
            dynamicAnalysis.dataReorganization({
                config: newConfig, showContent: {contentData}, accountExec: {talentId}, isInteractiveVideo: true,
                callback: ({newConfig, totalMessage}) => {
                    if (totalMessage) {
                        this.setState({loading: false}, () => {
                            Message({
                                showClose: true,
                                message: totalMessage,
                                type: 'info',
                                duration: 0
                            })
                        })
                    } else {
                        let newConstraint = initialMode.constraint.v === 2 ? FusionModel(newConfig.children, initialMode.constraint) : v1ToV2(newConfig.children, initialMode.constraint);
                        // newDataMerge.mergeProps({contentMode:newConstraint},(newContentMode)=>{
                        //         Object.assign(contentMode,newContentMode);
                        //         this.setState({loading:false},()=>this.props.contentModeChange({newContentMode:contentMode}));
                        //     })
                        Object.assign(contentMode.constraint, newConstraint);
                        Object.assign(contentMode.constraint, {constraint: myPropsAndPropsfusion(newConstraint.constraint)});
                        this.setState({loading: false}, () => this.props.contentModeChange({newContentMode: contentMode}));
                    }
                }
            })
        })
    };

    diagnosisEvent = () => {//诊断事件
        let {contentMode} = this.props, {contentData, diagnosisNumber = 0, authorizedPerson, visible} = this.state;
        if (diagnosisNumber > 4) {
            Message({
                showClose: true,
                message: `内容诊断次数过多，请刷新后进行诊断！`,
                type: 'warning',
                duration: 0
            });
            return false;
        }
        if (visible) {
            return false;
        }
        this.templateData({
            talentId: authorizedPerson,
            nowContentMode: contentMode,
            type: 'diagnosis'
        }, ({type, config, url, talentId}) => {
            if (type === 'success') {
                dynamicAnalysis.dataReorganization({
                    config: config, showContent: {contentData}, accountExec: {talentId},
                    callback: ({newConfig, totalMessage}) => {
                        if (totalMessage) {
                            this.step({number: 2, type: 'error'}, () => {
                                Message({
                                    showClose: true,
                                    message: totalMessage,
                                    type: 'info',
                                    duration: 0
                                });
                            });
                        } else {
                            this.step({number: 2, type: 'success'}, () => {
                                newTemplate.testingQuality({
                                    url: url, config: newConfig, callback: (array, qualityConfig) => {
                                        if (array.length > 0 && array[0].title == '内容校验失败，无法诊断') {
                                            this.step({number: 3, type: 'error'}, () => {
                                                Message({
                                                    showClose: true,
                                                    message: `内容校验失败，请检查创作是否完整`,
                                                    type: 'info'
                                                });
                                            })
                                        } else {
                                            this.step({number: 3, type: 'success'}, () => {
                                                this.setState({
                                                    tipsContent: array,
                                                    visible: true,
                                                    diagnosisNumber: diagnosisNumber + 1
                                                }, () => {
                                                    setTimeout(() => {
                                                        let qualityCheckUrl = qualityConfig.formData.qualityCheckUrl;
                                                        dynamicAnalysis.deleteContent({id: this.urlAnalysis(qualityCheckUrl).id}, (data) => {
                                                            this.step(data, () => {

                                                            })
                                                        });
                                                    }, 10000)
                                                })
                                            })
                                        }
                                    }
                                })
                            })
                        }
                    }
                })
            } else {
                this.setState({isDiagnosis: true});
            }
        });
    };

    templateData = ({talentId, nowContentMode, type}, callback) => {//拿取模板
        if (talentId) {
            darenId_change({talentId}, () => {
                let parameter = (url, obj = {}) => {
                    let arr = url.split('&');
                    arr.forEach((item) => {
                        let arr1 = item.split('=');
                        if (arr1[0] == 'activityId') {
                            obj[arr1[0]] = +arr1[1];
                        } else {
                            obj[arr1[0]] = arr1[1];
                        }
                    });
                    return obj;
                };
                newTemplate.getNewWeiTao(parameter(nowContentMode.url), (config) => {
                    if (type === 'diagnosis') {//诊断返回
                        let qualityUrl = '';
                        config.actions.forEach((item) => {
                            if (item.name == 'quality') {
                                qualityUrl = item.url;
                            }
                        });
                        if (qualityUrl) {
                            this.step({number: 1, type: 'success'}, () => {
                                callback({type: 'success', config, url: qualityUrl, talentId})
                            })
                        } else {
                            Message({
                                showClose: true,
                                message: `该渠道或达人号无诊断接口，联系负责人询问，请勿再尝试诊断！`,
                                type: 'warning',
                                duration: 0
                            });
                            this.step({number: 1, type: 'error'}, () => {
                                callback({type: 'fail'})
                            })
                        }
                    } else if (type === 'dynamicLoading') {//动态更新返回
                        callback({talentId, newConfig: config})
                    }
                }, (isFewerTimes, callback) => {
                    let text = isFewerTimes ? '模板获取失败，是否重新获取？' : '多次重新获取数据失败，可以尝试联系负责人重新授权解决';
                    MessageBox.confirm(text, '提示', {
                        type: 'info'
                    }).then(() => {
                        if (isFewerTimes) {
                            callback();
                        }
                    }).catch(() => {
                        Message({
                            showClose: true,
                            message: `已取消关闭标签`,
                            type: 'info'
                        });
                    });
                });
            })
        } else {
            Notification({
                title: '警告',
                message: `没有选择达人账号，无法${type === 'diagnosis' ? "诊断" : "更新模板"}！`,
                type: 'warning'
            });
        }
    };

    step = ({number, type}, callback) => {
        this.setState({stepNumber: number, stepType: type}, callback)
    };

    render() {
        let {contentMode} = this.props;
        let {contentData, hint, typeTab, flag, timeCardAdd, remarks, isDiagnosis, tipsContent, visible = false, authorizedPersonList, authorizedPerson, loading, stepNumber, stepType, currentLocation, leftDeviation} = this.state;
        if (contentMode) {
            let {constraint} = contentMode;
            let nameList = constraint instanceof Array ? undefined : constraint.nameList;
            let jidian = (nameList ? nameList : constraint).map((itemName, i) => {
                let item = nameList ? constraint.constraint[itemName.name] : itemName;
                let value = (contentData[item.name]) ? (contentData[item.name].value) : undefined;
                switch (item.type) {
                    case "Input":
                        return (
                            <BundleLoading load={StringModule} key={item.name} value={value} constraint={item}
                                           dataAdditionalChange={this.dataAdditionalChange} onChange={this.dataChange}
                                           hint={hint[item.name]}/>
                        );
                        break;
                    case "CreatorAddItem":
                        return (
                            <BundleLoading load={ItemModule} ref={e => this.itemModule = e} key={item.name}
                                           value={value} constraint={item}
                                           dataAdditionalChange={this.dataAdditionalChange} onChange={this.dataChange}
                                           hint={hint[item.name]}/>
                        );
                        break;
                    case "CreatorAddSpu":
                        return (
                            <BundleLoading load={SpuModule} key={item.name} value={value} constraint={item}
                                           onChange={this.dataChange} hint={hint[item.name]}/>
                        );
                        break;
                    case "AnchorImageList":
                        return (
                            <BundleLoading load={AnchorImageListModule} ref={e => this.anchorImageListModule = e}
                                           key={item.name}
                                           value={value} channel={contentMode.channel}
                                           constraint={item} onChange={this.dataChange} hint={hint[item.name]}/>
                        );
                        break;
                    case "CreatorAddImage":

                        return (
                            <BundleLoading load={ImgModule} key={item.name} value={value} constraint={item}
                                           onChange={this.dataChange}
                                           hint={hint[item.name]}/>
                        );
                        break;
                    case "AddTag":
                        return (
                            <BundleLoading load={AddTagModule} key={item.name} value={value} constraint={item}
                                           onChange={this.dataChange}
                                           hint={hint[item.name]}/>
                        );
                        break;
                    case "TagPicker":
                        return (
                            <BundleLoading load={TagPickerModule} key={item.name} value={value} constraint={item}
                                           onChange={this.dataChange}
                                           hint={hint[item.name]}/>
                        );
                        break;
                    case "RadioGroup":
                        return (
                            <BundleLoading load={RadioGroupModule} key={item.name} value={value} constraint={item}
                                           contentMode={contentMode}
                                           talentMessageIds={contentMode.talentMessageIds} onChange={this.dataChange}
                                           hint={hint[item.name]}/>
                        );
                        break;
                    case "AddLink":
                        return (
                            <BundleLoading load={AddLinkModule} key={item.name} value={value} constraint={item}
                                           onChange={this.dataChange}
                                           hint={hint[item.name]}/>
                        );
                        break;
                    case "Editor":
                        return (
                            <BundleLoading load={EditModule} ref={e => this.editModule = e} key={item.name}
                                           value={value} constraint={item}
                                           talentMessageIds={contentMode.talentMessageIds}
                                           onChange={this.dataChange} hint={hint[item.name]}
                                           channel={contentMode.channel}/>
                        );
                        break;
                    case "Title":
                        return (
                            <BundleLoading load={TitleModule} key={item.name} constraint={item}/>
                        );
                        break;
                    case "StructCanvas":
                        if (!value) {
                            value = item.props.value;
                            contentData[item.name] = {type: item.type, value: value, version: 3};
                            this.setState({contentData: contentData})
                        }
                        return (
                            <BundleLoading load={StructCanvasModule} key={item.name}
                                           value={value instanceof Array ? value : []}
                                           constraint={item}
                                           channel={contentMode.channel}
                                           onChange={this.dataChange} hint={hint[item.name]} isFloat={true}/>
                        );
                        break;
                    case "CascaderSelect":
                        return (
                            <BundleLoading load={CascaderSelectModule} ref={e => this.casader = e} key={item.name}
                                           value={value}
                                           constraint={item}
                                           onChange={this.dataChange} hint={hint[item.name]}/>
                        );
                        break;
                    case "Forward":
                        return (
                            <BundleLoading load={ForwardModule} key={item.name} value={value} constraint={item}
                                           onChange={this.dataChange}
                                           hint={hint[item.name]}/>
                        );
                        break;
                    case 'IceAddVideo':
                        return (
                            <BundleLoading load={IceAddVideoModule} key={item.name} value={value} constraint={item}
                                           onChange={this.dataChange} hint={hint[item.name]}/>
                        );
                        break;
                    case 'Text':
                        return (
                            <BundleLoading load={TextModule} key={item.name} constraint={item}/>
                        );
                        break;
                    case 'Rating':
                        return (
                            <BundleLoading load={RatingModule} key={item.name} constraint={item} value={value}
                                           onChange={this.dataChange}/>
                        );
                        break;
                    case 'AtlasImageList':
                        return (
                            <BundleLoading load={AtlasImageListModule} key={item.name} constraint={item} value={value}
                                           onChange={this.dataChange}/>
                        );
                        break;
                    /*case 'CreatorAddTag':
                        return (
                            <CreatorAddTagModule key={item.name} value={value} constraint={item}
                                               onChange={this.dataChange} hint={hint[item.name]}/>
                        );
                        break;
                    case "DateTime":
                        return(
                            <DateTimeModule key={item.name} value={value} constraint={item} onChange={this.dataChange}/>
                        );
                        break;*/
                }

            });
            let currentLogin = Menu.isLogin();
            let permissions = currentLogin ? currentLogin.loginManage.permissions : '';
            return (
                <div style={{position: 'relative'}}>
                    <div style={{width: '800px'}}>
                        <form className="content_property" role="form">
                            <AuthorizedPersonModule authorizedPersonList={authorizedPersonList}
                                                    talentMessageIds={contentMode.talentMessageIds}
                                                    authorizedPerson={authorizedPerson}
                                                    authorizedPersonChange={(value) => this.setState({authorizedPerson: value})}/>
                            <TypeTabModule typeTab={typeTab} typeTabChange={this.typeTabChange}/>{/*类别*/}
                            {jidian}
                            <OriginalStatementModule originalStatement={contentData.newOriginalStatement}
                                                     originalStatementChange={this.originalStatementChange}/>
                            <SignModule flag={flag} remarks={remarks} flagChange={value => this.setState({flag: value})}
                                        remarksChange={value => this.setState({remarks: value})}/>{/*标记备注*/}
                            <div className="maTop">
                                <Layout.Row gutter="6">
                                    {this.state.isStep && <Layout.Col span="24">
                                        <Steps space={128} active={stepNumber} finishStatus={stepType}
                                               style={{marginLeft: '66px'}}>
                                            <Steps.Step title="拿取模板"> </Steps.Step>
                                            <Steps.Step title="提交数据"> </Steps.Step>
                                            <Steps.Step title="校验完成"> </Steps.Step>
                                            <Steps.Step title="删除完成"> </Steps.Step>
                                        </Steps>
                                    </Layout.Col>}
                                    <Layout.Col span="12">
                                        {visible ?
                                            <Popover placement="top"
                                                     title={(tipsContent && tipsContent.length > 0) ? `${tipsContent.length}个问题待优化` : ""}
                                                     width="400"
                                                     trigger="click" visible={visible} content={(
                                                <div>
                                                    {(tipsContent && tipsContent.length > 0) ? tipsContent.map((item, index) => {
                                                        if (item.type == 'picture') {
                                                            return (
                                                                <div key={'tips-' + item.title}>
                                                                    <span>{item.title}</span>
                                                                    <Layout.Row gutter="2">
                                                                        {item.value.map((val, v) => {
                                                                            return (
                                                                                <Layout.Col span="8"
                                                                                            key={'tips-' + item.title + v}>
                                                                                    <img src={val} style={{
                                                                                        width: "100%",
                                                                                        maxHeight: '120px'
                                                                                    }}/>
                                                                                </Layout.Col>
                                                                            )
                                                                        })}
                                                                    </Layout.Row>
                                                                </div>
                                                            )
                                                        } else {
                                                            if (typeof item.value == 'string') {
                                                                return (
                                                                    <div key={'tips-' + item.title}>
                                                                        <span>{item.title}</span>
                                                                        <div>{item.value}</div>
                                                                    </div>
                                                                )
                                                            }
                                                        }
                                                    }) : <div style={{fontWeight: 'bold'}}>完美通过</div>}
                                                </div>
                                            )}>
                                                <Button style={{width: '100%'}} type="success">
                                                    点击查看结果
                                                </Button>
                                            </Popover> :
                                            <Button style={{width: '100%'}} type="success"
                                                    onClick={() => this.setState({isStep: true}, this.diagnosisEvent)}
                                                    disabled={isDiagnosis}>
                                                {isDiagnosis ? '请换达人号' : '诊断'}
                                            </Button>}
                                    </Layout.Col>
                                    <Layout.Col span="12">
                                        <Button style={{width: '100%'}} type="primary" onClick={this.submit}>
                                            提交
                                        </Button>
                                    </Layout.Col>
                                </Layout.Row>
                            </div>
                        </form>
                        <SubmitHint ref={e => this.submitHint = e} contentData={contentData} hint={hint}
                                    timeCardAdd={timeCardAdd} nameList={nameList}
                                    constraint={contentMode.constraint} onChange={this.dataChange}
                                    timeCardAddChange={this.timeCardAddChange}/>
                    </div>
                    {/*修改*/}
                    {(currentLogin && currentLogin.loginManage.grade == 0 || (permissions ? permissions.indexOf('赏金任务接单') > -1 : false)) &&
                    <div className="currentLocation oldPosition"
                         style={{left: `${leftDeviation ? leftDeviation : 828}px`}}>
                        <div style={{width: "100%", height: "100%", overflow: "auto"}}>
                            <BountyTaskList col={6} currentLogin={currentLogin} channel={contentMode.channel}/>
                        </div>
                    </div>}
                    {loading && <div style={{
                        position: 'absolute',
                        backgroundColor: 'white',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0.6,
                        zIndex: '100'
                    }}>
                        <div style={{position: 'sticky', top: '10px'}}>
                            <div style={{textAlign: 'right', marginBottom: '88px'}}>
                                <Button type="danger" icon="close"
                                        onClick={() => this.setState({loading: false})}>点击取消加载</Button>
                            </div>
                            <Loading text="拼命加载中">

                            </Loading>
                        </div>
                    </div>}
                </div>
            );
        } else {
            return (
                <div>
                    <AJAX ref={e => this.editPanelAjax = e}>

                    </AJAX>
                </div>
            );
        }
    }
}

class AddContent extends ReactChild {
    constructor(props) {
        super(props);
        let contentType = props.match.params.contentType;
        let id = this.props.match.params.id;
        this.state = {
            contentType: contentType,
            type: '',//内容类型帖子好货.......1.2···
            hintContent: {},
            onlyString: id ? true : false,//登录人uuid
            largeProcess: '',//流程
            groupId: this.props.match.params.groupId,//小组id
            uuid: generateUUID(),
            time: 0,
            dsType: 'success',
            isExhibition: false,
            isEdit: true,
            modelChoose: false,//是否已选择模板
            isLeavePrompt:false,
        }
    }

    setMainContentState = (s, callback) => {
        this.setState(s, callback);
    };

    setContentMode = (id) => {
        this.modeSelection.setSelectId(id);
    };

    contentModeChenag = () => {
        if (this.editPanel) {
            this.editPanel.contentModeChenag();
        }
    };

    componentDidMount() {
        this.uuidChange(() => {
                if (!this.state.onlyString) {
                    let groupId = this.props.match.params.groupId;
                    if (groupId) {
                        this.addAjax.ajax({
                            type: 'post',
                            url: '/content/admin/manageGroup/queryLargeProcessById.io',
                            data: {groupId: groupId},
                            callback: (json20) => {
                                let type = json20.largeProcess.type;
                                this.setState({largeProcess: json20, groupId: groupId, type: type}, () => {

                                });
                            }
                        });
                    }
                }

            }
        );
    }


    uuidChange = (callback) => {

        let id = this.props.match.params.id;
        if (id) {
            id = id.split('#')[0];
            let uuid = this.state.uuid;
            this.addOnlyString(id, uuid, () => {
                this.countDown(() => {
                    this.ds(id, uuid);
                    callback();
                });
            });
        } else {
            callback();
        }
    };

    ds = (id, uuid) => {
        setTimeout(() => {
            this.addOnlyString(id, uuid, () => {
                this.ds(id, uuid)
            });
        }, 1000 * 60)
    };

    countDown = (callback) => {
        this.countDownTime = setInterval(() => {
            let {time} = this.state, dsType = '';
            if (0 <= time && time < 34) {
                dsType = 'success';
            } else if (34 <= time && time < 67) {
                dsType = '';
            } else if (67 <= time && time < 100) {
                dsType = 'exception';
            } else {
                dsType = 'exception';
            }
            time = time > 99 ? time : time + 1;
            this.setState({time, dsType})
        }, 1800);
        callback();
    };

    componentWillUnmount() {
        this.countDownTime && clearInterval(this.countDownTime);
    }

    protect = () => {
        let id = this.props.match.params.id;
        let uuid = this.state.uuid;
        this.addOnlyString(id, uuid, () => {

        })
    };

    addOnlyString(id, uuid, callback) {
        let {onlyStringManage, isExhibition} = this.state;
        if (!onlyStringManage || !onlyStringManage.onlyString) {
            Ajax({
                type: 'post',
                url: '/content/admin/content/addOnlyString.io',
                isCloseMask: true,
                data: {data: JSON.stringify({contentId: id, onlyString: uuid})},
                callback: (json21) => {
                    if (json21) {
                        if (json21.onlyString === 2 && isExhibition) {
                            Notification({
                                title: '警告',
                                message: `${json21.onlyStringManage.manageName}现在正在操作这条内容,请联系负责人解决`,
                                type: 'warning',
                                duration: 0
                            });
                            this.setState({isEdit: false});
                        } else {
                            this.setState(json21);
                        }
                    } else {
                        this.setState({onlyString: false, time: 0, dsType: 'success', isExhibition: true});
                    }
                },
                complete: () => {
                    callback();
                }
            });
        }
    }

    commodityBank = () => {
        let editPanel = this.editPanel;
        if (editPanel) {
            editPanel.poolState();
        }
    };

    delOnlyStringClick = () => {//删除唯一字符串
        let contentId = this.props.match.params.id;
        contentId = contentId.split("#")[0];
        let {groupId, contentType} = this.state;
        if (contentId) {
            Ajax({
                type: 'post',
                url: '/content/admin/content/delOnlyString.io',
                data: {contentId: contentId},
                callback: () => {
                    window.onbeforeunload = undefined;
                    if (groupId) {//groupAdd/:contentType/:groupId/:id"
                        this.props.history.push('/pc/adm/content/groupAdd/' + contentType + '/' + groupId + '/' + contentId);
                    } else {// window.location.href = '/pc/adm/content/add/' + contentType + '/' + contentId;
                        this.props.history.push('/pc/adm/content/add/' + contentType + '/' + contentId);
                    }
                }
            });
        }
    };
    setThisState = (state, callback) => {//其他组件用的set状态
        this.setState(state, () => {
            if (callback) {
                callback()
            }
        })
    };

    render() {
        let {contentType, isLeavePrompt,onlyString, largeProcess, nowContentMode, onlyStringManage, time, dsType, isExhibition, isEdit, initialMode, modelChoose} = this.state;
        let id = this.props.match.params.id;
        if (id) {
            id = id.split('#')[0];
        }
        let judge = contentType != "manageGroup" || (contentType == "manageGroup" && largeProcess);
        return (
            <div>
                {isLeavePrompt&&<Prompt message={location =>`您正在创作内容，确定要离开创作页面?||${location.pathname}`}/>}
                <AJAX ref={e => this.addAjax = e}>
                    {(!onlyString || isExhibition) && <React.Fragment>
                        {this.editPanel && this.editPanel.state.message &&
                        <Alert title={this.editPanel.state.message} type="danger" closable={true}/>}
                        {judge &&
                        <ModeSelection ref={e => this.modeSelection = e} setMainContentState={this.setMainContentState}
                                       contentType={contentType} id={id} modelChoose={modelChoose}
                                       contentModeChenag={this.contentModeChenag} commodityBank={this.commodityBank}
                                       getState={this.state}/>}
                        {(id || modelChoose) && judge && (id || nowContentMode) ? <div>
                                <EditPanel ref={e => this.editPanel = e} getState={this.state} contentType={contentType}
                                           id={id} contentModeChange={({newContentMode}) => this.setState({nowContentMode})}
                                           type={this.state.type} leavePrompt={(is)=>this.setState({isLeavePrompt:is})}
                                           setContentMode={this.setContentMode} contentMode={nowContentMode}
                                           initialMode={initialMode}/>

                            </div> :
                            <div style={{fontSize: "32px"}}>
                                <div>创建内容前，请先选择一个渠道(模板){/*<a href='https://www.yuque.com/li59rd/grkh9g/tvf9ip'
                                                          target='_blank'>如何创建文档？</a>*/}</div>
                                {/* <Button type='info' size="large" onClick={() => {
                                    this.setState({dialogVisible: true})
                                }}>选择渠道
                                </Button>
                                <Dialog title="创建模板" size="large" visible={this.state.dialogVisible}
                                        onCancel={() => this.setState({dialogVisible: false})} lockScroll={false}>
                                    <Dialog.Body>
                                        <TemplatePage/>
                                    </Dialog.Body>
                                    <Dialog.Footer className="dialog-footer">
                                        <Button onClick={() => this.setState({dialogVisible: false})}>取消</Button>
                                    </Dialog.Footer>
                                </Dialog>*/}
                            </div>}
                    </React.Fragment>}

                    {onlyString == 1 && <div>
                        <Alert type="warning" title="您上一个编辑窗口没有提交关闭，为了防止重复操作，请确定是否已经关闭" closable={false}/>
                        <Button type="info" onClick={this.delOnlyStringClick}>确定关闭</Button>
                    </div>}
                    {onlyString == 2 &&
                    <Alert type="warning" title={`${onlyStringManage ? onlyStringManage.manageName : 'xxx'}现在正在操作这条内容`}
                           closable={false}/>}
                </AJAX>
                {id && !onlyString && <div style={{position: 'fixed', bottom: '25px', right: '25px'}}>
                    {dsType === 'success' ? <div style={{
                            position: 'absolute',
                            zIndex: 10000,
                            marginTop: '40px',
                            marginLeft: '16px',
                            fontWeight: 'bold'
                        }}>内容保护中</div>
                        : dsType === '' ?
                            <Button style={{position: 'absolute', zIndex: 10000, marginTop: '36px', marginLeft: '16px'}}
                                    size="small" type="success" onClick={this.protect} plain={true}
                                    disabled={!isEdit}>{isEdit ? '手动保护' : '已被编辑'}</Button> :
                            <Button style={{position: 'absolute', zIndex: 10000, marginTop: '36px', marginLeft: '16px'}}
                                    size="small" type="success" onClick={this.protect} plain={true}
                                    disabled={!isEdit}>{isEdit ? '手动保护' : '已被编辑'}</Button>}
                    <Progress type="circle" percentage={time + 100} width={100} status={dsType} showText={false}
                              style={{backgroundColor: 'white'}}/>
                </div>}
            </div>
        );
    }
}

class ModelBlock extends React.Component {//模板块选择
    constructor(props) {
        super(props);
        this.state = {}
    }

    addContent = (id) => {
        this.props.ifContentType(id, true);
    };

    render() {
        let {contentMode} = this.props;
        return (
            <div id='addDiv'>
                <Layout.Row gutter="10">
                    {contentMode.map((item, index) => {
                        let channelName = item.channel.name ? item.channel.name : '';
                        if (!channelName) {
                            channelName += item.channel.title ? item.channel.title : item.channel.mainChannelName + '-';
                            channelName += item.channel.columnName ? item.channel.columnName : item.channel.activityName + '-';
                            channelName += item.channel.entryName;
                        }
                        let sColor = ['#eceef3', '#f6f6f6','rgb(247, 240, 240)','rgb(231, 241, 243)','rgb(236, 243, 238)','rgb(245, 242, 235)'];
                        let t = index % (sColor.length);
                        return (
                            <Layout.Col xs="24" sm="12" md="12" lg="8" className='el-col-xlg-6'>
                                <Card className="box-card" style={{background: sColor[t], textAlign: 'left'}}
                                      header={<div style={{position: "relative"}}>
                                              <span title={item.name} style={{
                                                  lineHeight: "28px",
                                                  fontSize: '16px',
                                                  color: '#0073bd',
                                                  overflow: "hidden",
                                                  whiteSpace: "nowrap",
                                                  textOverflow: "ellipsis"
                                              }}>
                                                  {item.name}
                                              </span>
                                          <span style={{position: "absolute", right: "1px", top: '1px'}}>
                                                 <Button type="info" onClick={() => {
                                                     this.addContent(item.id)
                                                 }} size="small">开始创作</Button>
                                              </span>
                                      </div>
                                      }>
                                    <div className="text item">
                                        <div style={{display: 'flex'}}>
                                            <div style={{height: '40px', minWidth: '66px'}}>
                                                <strong>所在渠道:</strong>
                                            </div>
                                            <span title={channelName} style={{
                                                color: '#999',
                                                overflow: "hidden",
                                                whiteSpace: "nowrap",
                                                textOverflow: "ellipsis"
                                            }}>{channelName}</span>
                                        </div>
                                        <div style={{overflowY: 'auto', height: '60px', display: 'flex'}}>
                                            <div style={{height: '32px', minWidth: '66px'}}>
                                                <strong>模板简介:</strong>
                                            </div>
                                            <span style={{color: '#999'}}>{item.desc ? item.desc : '暂无简介'}</span>
                                        </div>
                                    </div>
                                </Card>
                                <p/>
                            </Layout.Col>
                        )
                    })}
                </Layout.Row>
            </div>
        )
    }
}

export default AddContent;

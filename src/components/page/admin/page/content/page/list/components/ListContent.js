/**
 * Created by shiying on 17-7-25.
 */

require("../../../../../../../../styles/component/react_assembly/listContent.css");
import '../../../../../../../../styles/component/react_assembly/editBox.css';
import React from 'react';
import {BundleLoading} from '../../../../../../../../bundle';
import $ from 'jquery';
import FlagRemarks from '../../../../../components/content/flagRemarks';
import {PersonSelection, NewPersonSelection} from '../../../../../components/PersonSelection';
import AJAX from '../../../../../../../lib/newUtil/AJAX.js';
import manualMatchingModal from 'bundle-loader?lazy&name=pc/trends_asset/admin/content/app-[name]!../../../../bountyTask/components/manualmatchingModal';
import {ThousandsOfCall} from "../../../../../../../../components/lib/util/ThousandsOfCall";
import {Pagination, Message, MessageBox, Layout, Card, Checkbox, Dropdown, Dialog,Select} from 'element-react';
import * as ele from 'element-react';
import 'element-theme-default';
import {wordZH} from './components/wordZH';

const randomString = (len) => {
    let num = len || 32;
    let $chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let maxPos = $chars.length;
    let pwd = '';
    for (let i = 0; i < num; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
};

class ListContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            manualMatching: false,//赏金任务手动匹配模态框
            judge: true,
            name: {},
            data: [],
            flagSwitch: false,//标记备注模态开关
            picImgHeight: 150,
            pModeId:''
        }
    }

    submitAudit = (env) => {//提交审核||转下一步
        let id = $(env.target).data("id");
        this.newSubmitAudit({id});
    };



    newSubmitAudit = ({id}) => {//提交审核||转下一步(新)
        let data = '', text = '', cancel = '';
        let {groupId, contentType} = this.props;
        if (groupId) {
            groupId = groupId.split("#")[0];
            [data, text, cancel] = [{
                contentIds: JSON.stringify([{contentIds: id}]),
                groupId: groupId
            }, '确定转给下一个步骤？', '暂不转给'];
        } else {
            [data, text, cancel] = [{id: id}, '确定提交审核？提交后将不能编辑', '暂不提交'];
        }
        MessageBox.confirm(text, '提示', {
            type: 'warning'
        }).then(() => {
            this.listAJAX.ajax({
                url: `/content/admin/${contentType}/domain.content.submitAudit.io`,
                data: data,
                callback: () => {
                    Message({
                        message: '提交成功',
                        type: 'success'
                    });
                    this.props.getContentStatePreview();
                }
            });
        }).catch(() => {
            Message({
                type: 'info',
                message: '已取消提交'
            });
        });
    };

    delete = (env) => {//删除内容
        let id = $(env.target).data("id");
        this.newDelete({id});
    };

    newDelete = ({id}) => {//删除内容(新)
        let {groupId, contentType} = this.props;
        let data = {id: id};
        if (groupId) {
            groupId = groupId.split("#")[0];
            data.groupId = groupId;
        }
        MessageBox.confirm('确定删除这条内容？', '提示', {
            type: 'warning'
        }).then(() => {
            this.listAJAX.ajax({
                url: `/content/admin/${contentType}/domain.content.delete.io`,
                data: data,
                callback: () => {
                    Message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.props.getContentStatePreview();
                }
            });
        }).catch(() => {
            Message({
                type: 'info',
                message: '已取消删除'
            });
        });
    };

    synchronizationAudit = (env) => {//修改提交
        let id = $(env.target).data("id");
        this.newSynchronizationAudit({id});
    };

    newSynchronizationAudit = ({id}) => {//修改提交(新)
        MessageBox.confirm('确定已经修改好了？', '提示', {
            type: 'warning'
        }).then(() => {
            this.listAJAX.ajax({
                url: `/content/admin/${this.props.contentType}/domain.content.synchronizationAudit.io`,
                data: {id: id},
                callback: () => {
                    Message({
                        message: '提交成功',
                        type: 'success'
                    });
                    this.props.getContentStatePreview();
                }
            });
        }).catch(() => {
            Message({
                type: 'info',
                message: '已取消提交'
            });
        });
    };

    selectManage = (eventKey) => {//人员搜索
        this.props.setPaState({manage: eventKey}, () => {
            this.props.goPage();
        })
    };

    topSpeedAddId = (env) => {//急速选
        let id = $(env.target).data("id");
        this.newTopSpeedAddId({id});
    };

    newTopSpeedAddId = ({id}) => {//急速选（新）
        this.listAJAX.ajax({
            url: "/content/admin/content//domain.content.topspeed.select.io",
            data: {id: id},
            callback: () => {
                Message({
                    message: '成功添加',
                    type: 'success'
                });
            }
        })
    };

    delOnlyString = (env) => {//编辑放弃
        let contentId = $(env.target).data("id");
        this.newDelOnlyString({contentId});
    };

    newDelOnlyString = ({contentId}) => {//编辑放弃(新)
        if (contentId) {
            this.listAJAX.ajax({
                type: 'post',
                url: '/content/admin/content/delOnlyString.io',
                data: {contentId: contentId},
                callback: () => {
                    this.props.getContentStatePreview();
                }
            });
        }
    };

    protection = (env) => {//取消保护
        let contentId = $(env.target).data('id');
        this.newProtection({id: contentId});
    };

    newProtection = ({id}) => {//取消保护(new)
        this.listAJAX.ajax({
            type: 'post',
            url: '/content/admin/manageGroup/domain.content.relieve.protection.io',
            data: {contentId: id},
            callback: () => {
                Message({
                    message: '取消保护成功',
                    type: 'success'
                });
                this.props.getContentStatePreview();
            }
        });
    };

    wordClick = (env) => {//导出一条内容word文档
        let id = env.id;

        /*let activeXObject = new ActiveXObject("Word.Application");
        let doText,obj;
        if(activeXObject!=null){
            activeXObject.Visible=true;
            obj = activeXObject.Documents.Open("E:\\bm115.xlsx");
            console.log('obj',obj);
        }*/

        this.listAJAX.ajax({
            url: "/content/decrypt.io",
            data: {"id": id, "encryptTime": ''},
            callback: (json) => {
                // notyOK({text: '即将下载本条内容点击下载进行确认', text2: '下载'}, () => {
                // let url = '/content/admin/' + this.props.contentType + '/getWord.io?id=' + id + '&encryptTime=' + json.encryptTime;
                //      window.location.href = url;
                //  });
                let url = '/content/admin/' + this.props.contentType + '/getWord2.io';

                this.listAJAX.ajax({
                    type: 'post',
                    url: url,
                    data: {id: id},
                    callback: (showContent) => {
                        wordZH(showContent, (array) => {
                            ThousandsOfCall.acoustic({
                                array: array,
                                id: showContent.id,
                                title: showContent.contentData.title.value
                            }, 'word', (mes) => {
                                Message({
                                    message: mes.message,
                                    type: mes.success === true ? 'success' : 'error'
                                });
                            });
                        });
                    }
                });
            }
        });
    };


    componentDidMount() {
        let {groupId, contentType} = this.props;
        if (groupId) {
            groupId = groupId.split("#")[0];
        }
        if (!groupId && contentType == "struct") {
            this.listAJAX.ajax({
                url: "/content/admin/post/queryContentOvert.io",
                data: {
                    pageNow: 1,
                    pageSize: 20,
                    name: "",
                },
                callback: (data) => {
                    this.setState({postContentMode: data.contentMode});
                }
            });
        }
    }


    rotatingPost = (env) => {//转帖子
        let contentModeId = $(env.target).data("content_mode");
        let i = $(env.target).data("i");
        this.newRotatingPost({contentModeId, i});
    };

    newRotatingPost = ({i, contentModeId}) => {//转帖子(new)
        let arrId = this.props.idsArr();
        this.setState({postContent: this.state.postContentMode[i]});
        if (arrId.length > 0) {
            this.rotatingPostContent(contentModeId, arrId);
        } else {
            Message({
                message: '未勾选内容',
                type: 'warning'
            });
        }
    };

    rotatingPostContent = (contentModeId, arrId, num = 0) => {//转帖子接口
        this.listAJAX.ajax({
            url: `/content/admin/${this.props.contentType}/domain.content.find.io`,
            data: {id: arrId[num]},
            callback: (json) => {
                let contentData = json.contentData;
                for (let c in contentData) {
                    if (contentData[c].type == "StructCanvas") {
                        let val = contentData[c].value;
                        let obj = {blocks: [], entityMap: {}}, key = -1;
                        for (let v in val) {
                            if (val[v].name == "paragraph") {
                                obj.blocks.push({
                                    data: {},
                                    depth: 0,
                                    entityRanges: [],
                                    inlineStyleRanges: [],
                                    key: randomString(5),
                                    text: val[v].data.text,
                                    type: "unstyled"
                                });
                            } else if (val[v].name == "picture") {
                                key++;
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
                                obj.entityMap[key] = {
                                    data: {
                                        url: val[v].data.images[0].picUrl,
                                        picHeight: val[v].data.images[0].picHeight,
                                        picWidth: val[v].data.images[0].picWidth
                                    },
                                    mutability: "MUTABLE",
                                    type: "SIDEBARIMAGE"
                                };
                            } else if (val[v].name == "shop-inventory-separator") {
                                obj.blocks.push({
                                    data: {},
                                    depth: 0,
                                    entityRanges: [],
                                    inlineStyleRanges: [],
                                    key: randomString(5),
                                    text: "top" + val[v].data.topNum,
                                    type: "alignCenter"
                                });
                                obj.blocks.push({
                                    data: {},
                                    depth: 0,
                                    entityRanges: [],
                                    inlineStyleRanges: [],
                                    key: randomString(5),
                                    text: "————",
                                    type: "alignCenter"
                                });
                                obj.blocks.push({
                                    data: {},
                                    depth: 0,
                                    entityRanges: [],
                                    inlineStyleRanges: [],
                                    key: randomString(5),
                                    text: val[v].data.title,
                                    type: "alignCenter"
                                });
                            } else if (val[v].name == "two-column-items") {
                                let items = val[v].data.items;
                                for (let it in items) {
                                    key++;
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
                                    obj.entityMap[key] = {
                                        data: items[it].item,
                                        mutability: "IMMUTABLE",
                                        type: "SIDEBARSEARCHITEM"
                                    };
                                    obj.blocks.push({
                                        data: {},
                                        depth: 0,
                                        entityRanges: [],
                                        inlineStyleRanges: [],
                                        key: randomString(5),
                                        text: "",
                                        type: "unstyled"
                                    });
                                }
                            } else if (val[v].name == "single-item-inventory" || val[v].name == "single-item-rank") {
                                obj.blocks.push({
                                    data: {},
                                    depth: 0,
                                    entityRanges: [],
                                    inlineStyleRanges: [],
                                    key: randomString(5),
                                    text: "top" + val[v].data.topNum,
                                    type: "alignCenter"
                                });
                                obj.blocks.push({
                                    data: {},
                                    depth: 0,
                                    entityRanges: [],
                                    inlineStyleRanges: [],
                                    key: randomString(5),
                                    text: "————",
                                    type: "alignCenter"
                                });
                                obj.blocks.push({
                                    data: {},
                                    depth: 0,
                                    entityRanges: [],
                                    inlineStyleRanges: [],
                                    key: randomString(5),
                                    text: val[v].data.title,
                                    type: "alignCenter"
                                });
                                key++;
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
                                obj.entityMap[key] = {
                                    data: val[v].data.items[0],
                                    mutability: "IMMUTABLE",
                                    type: "SIDEBARSEARCHITEM"
                                };
                                obj.blocks.push({
                                    data: {},
                                    depth: 0,
                                    entityRanges: [],
                                    inlineStyleRanges: [],
                                    key: randomString(5),
                                    text: "",
                                    type: "unstyled"
                                });
                                obj.blocks.push({
                                    data: {},
                                    depth: 0,
                                    entityRanges: [],
                                    inlineStyleRanges: [],
                                    key: randomString(5),
                                    text: val[v].data.itemTitle,
                                    type: "unstyled"
                                });
                                obj.blocks.push({
                                    data: {},
                                    depth: 0,
                                    entityRanges: [],
                                    inlineStyleRanges: [],
                                    key: randomString(5),
                                    text: val[v].data.itemDescription,
                                    type: "unstyled"
                                });
                            }
                        }
                        contentData[c] = {
                            type: "Editor",
                            value: obj,
                            version: 3
                        };
                    } else if (c == "type") {
                        contentData[c] = 1;
                    }
                }
                let data = {
                    id: 0,
                    typeTab: json.typeTab,
                    contentModeId: contentModeId,
                    data: this.contentMatching(contentData, this.state.postContent),
                    title: json.title,
                    picUrl: json.picUrl,
                    flag: json.flag,
                    remarks: json.remarks,
                    version: 3
                };
                this.listAJAX.ajax({
                    url: "/content/admin/post/domain.content.add.io",
                    data: {data: JSON.stringify(data)},
                    async: false,
                    type: "post",
                    isCloseMask: true,
                    callback: (data) => {
                        if (data.id) {
                            Message({
                                message: '转帖成功',
                                type: 'success'
                            });
                            if (arrId.length > num + 1) {
                                this.rotatingPostContent(contentModeId, arrId, num + 1);
                            } else {
                                Message({
                                    message: '转帖结束',
                                    type: 'success'
                                });
                            }
                        }
                    }
                })
            }
        })
    };

    rotatingDapContent=(contentModeId, arrId, num = 0)=>{//转搭配接口
        let {contentType}=this.props;
        this.listAJAX.ajax({
            url: `/content/admin/${contentType}/domain.content.find.io`,
            data: {id: arrId[num]},
            callback: (json) => {
                let contentData = json.contentData,array=[];
                for(let c in contentData){
                    if(contentData[c].type==='AtlasImageList'){
                        let val=contentData[c].value;
                        val.forEach((item,index)=>{
                            if(item.resourceFeatures.picTab==='穿搭'){
                                contentData.summary = {
                                    type: "Input",
                                    value: item.desc,
                                    version: 3
                                };
                            }
                            if(index<2){
                                item.url.forEach((u)=>{
                                    array.push({url:u, anchors: []})
                                })
                            }
                        });
                        contentData.body = {
                            type: "AnchorImageList",
                            value: array,
                            version: 3
                        };
                    }
                }
                let data = {
                    id: 0,
                    typeTab: json.typeTab,
                    contentModeId: contentModeId,
                    data: this.dapContentMatching(contentData, this.state.dapContent),
                    title: json.title,
                    picUrl: json.picUrl,
                    flag: json.flag,
                    remarks: json.remarks,
                    version: 3
                };
                this.listAJAX.ajax({
                    url: "/content/admin/dap/domain.content.add.io",
                    data: {data: JSON.stringify(data)},
                    async: false,
                    type: "post",
                    isCloseMask: true,
                    callback: (data) => {
                        if (data.id) {
                            if (arrId.length > num + 1) {
                                Message({
                                    message: '转换成功，接着下一个',
                                    type: 'success'
                                });
                                this.rotatingDapContent(contentModeId, arrId, num + 1);
                            } else {
                                Message({
                                    message: '转换结束',
                                    type: 'success'
                                });
                            }
                        }
                    }
                })
            }
        })
    };

    dapContentMatching = (contentData, dapMode) => {//抽丝剥茧
        let constraint = dapMode.constraint instanceof Array?dapMode.constraint:dapMode.constraint.nameList;
        let [arr1, obj] = [[], {}];
        for (let con in constraint) {
            arr1.push(constraint[con].name);
        }
        for (let d in contentData) {
            if (arr1.join().indexOf(d) > -1) {
                obj[d] = contentData[d];
            }
        }
        obj.type = 4;//搭配
        return obj;
    };

    batchConversion=()=>{
        let arrId = this.props.idsArr(),{pModeId}=this.state;
        if (arrId.length > 0) {
            if(pModeId){
                let {dapContentMode}=this.props,odj={};
                dapContentMode.forEach((item,index)=>{
                    if(item.id==pModeId){
                        odj=item;
                    }
                });
                this.setState({dapContent:odj},()=>{
                    this.rotatingDapContent(pModeId, arrId);
                });
            }else {
                Message({
                    message: '未选择渠道',
                    type: 'warning'
                });
            }
        } else {
            Message({
                message: '未勾选内容',
                type: 'warning'
            });
        }
    };

    contentMatching = (contentData, postMode) => {//抽丝剥茧
        let constraint = postMode.constraint;
        let [arr1, obj] = [[], {}];
        for (let con in constraint) {
            arr1.push(constraint[con].name);
        }
        for (let d in contentData) {
            if (arr1.join().indexOf(d) > -1) {
                obj[d] = contentData[d];
            }
        }
        obj.type = 1;//帖子
        return obj;
    };

    componentDidUpdate() {
        let scrollParent = $("#panel-body");
        scrollParent.scroll(() => {
            let t = scrollParent.scrollTop();
            let h = scrollParent.children().height();
            if ((h - t - scrollParent.height()) > 0) {
                $(".editBottomBox").addClass("editBoxButsBottomFD");
            } else {
                $(".editBottomBox").removeClass("editBoxButsBottomFD");
            }
        });

        let h = $(".picImg").height();
        if (h && h != this.state.picImgHeight) {
            this.setState({"picImgHeight": h});
        }

        let w = 0;
        let bgs = $(".editButGroup");

        let l = bgs.length;
        for (let i = 0; i < l; i++) {
            let lw = 0;
            let bs = $(bgs[i]).children("button");
            let bsl = bs.length;
            for (let j = 0; j < bsl; j++) {
                ;
                lw = lw + $(bs[j]).width() + 20;
            }
            if (w < lw) w = lw;
        }

        w = Math.ceil(w);

        if (this.state.w != w) {
            this.setState({w: w});
        }
    }

    openFlagRemarks = (env) => {//打开标记模态
        let i = $(env.target).data('i');
        this.newOpenFlagRemarks({i});
    };

    newOpenFlagRemarks = ({i}) => {//打开标记模态(new)
        let {id, flag, remarks} = this.props.contents[i];
        this.setState({flagSwitch: true}, () => {
            this.flagRemarks.setState({id, flag, remarks});
        });
    };

    newTableOpenFlagRemarks = ({id, flag, remarks}) => {//表格打开标记模态(new)
        this.setState({flagSwitch: true}, () => {
            this.flagRemarks.setState({id, flag, remarks});
        });
    };

    updateFlagAndRemarks = () => {//提交标记备注内容
        this.flagRemarks.updateFlagAndRemarks(() => {
            this.setState({flagSwitch: false});
        });
    };

    flagNum = (arr, flag, str = '') => {
        for (let a in arr) {
            if (arr[a].order == flag) {
                str = arr[a].color;
            }
        }
        return str;
    };

    checklistNumber = (con) => {
        let num = 0;
        for (let c in con) {
            if (con[c].checked) {
                num++;
            }
        }
        return num;
    };

    rowClassName = ({item, groupId}) => {
        let btnClass = "", sorting = item.smallProcess ? item.smallProcess.sorting : 0, rgb = '';
        if (sorting) {
            this.props.smallProcessList.map((item, i) => {
                if (item.sorting == sorting) {
                    //rgb = this.props.cols[i % 5];
                    btnClass = 'rgb' + [i % 5];
                }
            })
        } else if (item.isProcessStrComplete) {
            btnClass = "secondary";
        } else if ((!groupId && item.state || item.state == 0) || (item.state && item.state != 0)) {
            switch (item.state) {
                case 0 :
                    btnClass = "secondary";
                    break;
                case 1 :
                    btnClass = "warning";
                    break;
                case 2 :
                    btnClass = "alert";
                    break;
                case 3 :
                    btnClass = "default";
                    break;
                case 4 :
                    btnClass = "success";
                    break;
                case 5 :
                    btnClass = "info";
                    break;
                case 6 :
                    btnClass = "purple";
                    break;
                case 7 :
                    btnClass = "synchronization";
                    break;
                case 8 :
                    btnClass = "default";
                    break;
            }
        }
        return btnClass;
    };

    render() {
        let {groupId, contentType, newVersion, contents, actionButtons, goPage, pageNow,pContentModeId,dapContentMode} = this.props;
        let {postContentMode, flag,pModeId} = this.state;
        if (groupId) {
            groupId = groupId.split("#")[0];
        }
        let flagArr = [
            {order: 1, color: 'red'}, {order: 2, color: 'orange'}, {order: 3, color: 'yellow'}, {
                order: 4,
                color: 'green'
            }, {order: 5, color: 'cyan'},
            {order: 6, color: 'blue'}, {order: 7, color: 'violet'}, {order: 8, color: 'white'}, {
                order: 9,
                color: 'black'
            }, {order: 10, color: 'deeppink'}, {order: 11, color: 'brown'},
        ];
        //预留数据，请勿删除
        let groupPossess = groupId ? [{
            label: "工作流程",
            prop: "largeProcesses",
            minWidth: "80px",
            render: (data) => {
                return data.largeProcesses ? data.largeProcesses.name : '';
            }
        }, {
            label: "当前步骤",
            prop: "smallProcess",
            minWidth: "80px",
            render: (data) => {
                return data.smallProcess ? data.smallProcess.name : '';
            }
        }] : [];
        let columns = [
            {
                label: "ID",
                prop: "id",
                width: 115,
                render: (data) => {
                    return (
                        <div>
                            <Checkbox label='' checked={data.checked}
                                      onChange={() => this.props.newChecked({
                                          checked: !Boolean(data.checked),
                                          value: data.id
                                      })} value={data.id}/>
                            <span>{data.id}</span>
                        </div>
                    )
                }
            }, {
                label: "模式",
                prop: "contentModeName",
            }, {
                label: "类别",
                prop: "typeTab",
                width: "50px",
            }, {
                label: "封面",
                prop: "picUrl",
                width: "180px",
                render: (data) => {
                    return (
                        <div style={{margin: '5px 0'}}>
                            <img className={"picImg"} src={data.picUrl} style={{width: "180px"}}/>
                        </div>
                    )
                }
            }, {
                label: '标题',
                prop: 'title',
            }, {
                label: '更新时间',
                prop: 'upTime',
            }, {
                label: groupId ? '组名' : '员工',
                prop: 'title',
                width: "100px",
                render: (data) => {
                    let m = PersonSelection.getManage(data.creator, () => {
                        this.forceUpdate();
                    });
                    return m ? m.name : "无";
                }
            }, ...groupPossess, {
                label: '状态',
                prop: 'addTime',
                width: "50px",
                render: (item) => {
                    let st = '';
                    if (item.isProcessStrComplete) {
                        st = "小组已完成";
                    } else if ((!groupId && item.state || item.state == 0) || (item.state && item.state != 0)) {
                        switch (item.state) {
                            case 0 :
                                st = "草稿箱";
                                break;
                            case 1 :
                                st = "待审核";
                                break;
                            case 2 :
                                st = "审核失败";
                                break;
                            case 3 :
                                st = "待发布";
                                break;
                            case 4 :
                                st = "已发布";
                                break;
                            case 5 :
                                st = "待修改";
                                break;
                            case 6 :
                                st = "通过";
                                break;
                            case 7 :
                                st = "已修改";
                                break;
                            case 8 :
                                st = "待同步";
                                break;
                        }
                    }
                    return st;
                }
            }, {
                label: '操作',
                prop: 'state',
                width: this.state.w ? (this.state.w + 20 + "px") : "180px",
                render: (item) => {
                    return (
                        <div>
                            <div className={this.flagNum(flagArr, item.flag)}
                                 onClick={() => this.newTableOpenFlagRemarks(item)}>
                                {item.remarks ?
                                    <ele.Tooltip className="item" effect="dark"
                                                 content={item.remarks} placement="bottom">
                                        <i className="iconfont">&#xe624;</i>
                                    </ele.Tooltip> :
                                    <i className="iconfont">&#xe624;</i>}
                            </div>
                            {item.ifInvalidStr && <ele.Button.Group>
                                <ele.Button type="primary" size="small">保护期：
                                </ele.Button>
                                <ele.Button type="primary"
                                            size="small">{item.ifInvalidStr.manageName}</ele.Button>
                                {item.relieveProtection &&
                                <ele.Button type="danger" size="small"
                                            onClick={() => {
                                                this.newProtection({id: item.id})
                                            }}>取消保护</ele.Button>}
                            </ele.Button.Group>}
                            <ele.Button.Group style={{width: this.state.w ? (this.state.w + "px") : "180px"}}
                                              className="editButGroup">
                                <ele.Button type="success" size="small" icon="view"
                                            onClick={() => this.props.newSelectContent({id: item.id})}>看
                                </ele.Button>
                                {!groupId ? item.submitAudit &&
                                    <ele.Button type="primary" size="small"
                                                onClick={() => this.newSubmitAudit({id: item.id})}>提</ele.Button> :
                                    item.smallProcess &&
                                    <ele.Button type="success" size="small"
                                                onClick={() => this.newSubmitAudit({id: item.id})}>转下步</ele.Button>}
                                {item.edit && <ele.Button onClick={() => {
                                    let href = (!groupId) ? (window.location.origin + "/pc/adm/content/add/" + contentType + "/" + item.id) :
                                        (window.location.origin + "/pc/adm/content/groupAdd/" + contentType + '/' + groupId + '/' + item.id);
                                    window.open(href);
                                }} type="primary" size="small"
                                                          icon="edit">编</ele.Button>}
                                {(!groupId && item.synchronization) &&
                                <ele.Button type="primary" size="small"
                                            onClick={() => this.newSynchronizationAudit({id: item.id})}>提</ele.Button>}
                                {item.delete &&
                                <ele.Button type="danger" size="small" icon="delete2"
                                            onClick={() =>
                                                this.newDelete({id: item.id})
                                            }>删</ele.Button>}
                                {contentType === "album" &&
                                <ele.Button type="info" size="small"
                                            onClick={() => this.newTopSpeedAddId({id: item.id})}>极速选</ele.Button>}

                                <ele.Button type="success" size="small"
                                            onClick={() => this.wordClick({id: item.id})}>导出word
                                </ele.Button>
                                <ele.Popover placement="bottom" title="" width="200" trigger="click"
                                             content={<ele.Button.Group>
                                                 <ele.Button type="info" onClick={() => {
                                                     window.open(window.location.origin + `/pc/visible/auditOpinion/add/${item.id}`)
                                                 }}>审稿链接
                                                 </ele.Button>
                                                 <ele.Button type="info" onClick={() => {
                                                     window.open(window.location.origin + `/pc/visible/preview/${item.id}`)
                                                 }}>查看链接
                                                 </ele.Button>
                                             </ele.Button.Group>}>
                                    <ele.Button size="small" icon="share">链接</ele.Button>
                                </ele.Popover>
                            </ele.Button.Group>
                            <ele.Button.Group>
                                {item.editContent && <ele.Button type="success"
                                                                 size="small">{item.editContent}</ele.Button>}
                                {item.deleEditContent &&
                                <ele.Button type="danger" size="small"
                                            onClick={() => this.newDelOnlyString({contentId: item.id})}>放弃</ele.Button>}
                            </ele.Button.Group>
                        </div>
                    )
                }
            }
        ];
        return (
            <div className="contentList">
                <Dialog title="标记备注" size="tiny" visible={this.state.flagSwitch}
                        onCancel={() => this.setState({flagSwitch: false})}
                        lockScroll={false} style={{textAlign: 'left'}}>
                    <Dialog.Body>
                        <FlagRemarks ref={e => this.flagRemarks = e} data={flag} goPage={goPage} pageNow={pageNow}/>
                    </Dialog.Body>
                    <Dialog.Footer className="dialog-footer">
                        <ele.Button onClick={() => this.setState({flagSwitch: false})}>关闭</ele.Button>
                        <ele.Button type="primary" onClick={this.updateFlagAndRemarks}>提交</ele.Button>
                    </Dialog.Footer>
                </Dialog>
                <AJAX ref={e => this.listAJAX = e}>
                    <div>
                        <div style={{display: newVersion ? 'inline' : 'none'}}>
                            <Layout.Row gutter="20" style={{marginTop: "8px"}}>
                                {(contents ? contents : []).map((item, i) => {
                                    let [btnClass, st, rgb, sorting] = ["", "", "", item.smallProcess ? item.smallProcess.sorting : 0];
                                    if (sorting) {
                                        this.props.smallProcessList.map((item, i) => {
                                            if (item.sorting == sorting) {
                                                rgb = this.props.cols[i % 5];
                                            }
                                        })
                                    } else if (item.isProcessStrComplete) {
                                        btnClass = "#939393";
                                        st = "小组已完成";
                                    } else if ((!groupId && item.state || item.state == 0) || (item.state && item.state != 0)) {
                                        switch (item.state) {
                                            case 0 :
                                                btnClass = "#939393";
                                                st = "草稿箱";
                                                break;
                                            case 1 :
                                                btnClass = "#f9c855";
                                                st = "待审核";
                                                break;
                                            case 2 :
                                                btnClass = "#ff6d6d";
                                                st = "审核失败";
                                                break;
                                            case 3 :
                                                btnClass = "#20a0ff";
                                                st = "待发布";
                                                break;
                                            case 4 :
                                                btnClass = "#13ce66";
                                                st = "已发布";
                                                break;
                                            case 5 :
                                                btnClass = "#50bfff";
                                                st = "待修改";
                                                break;
                                            case 6 :
                                                btnClass = "#943894";
                                                st = "通过";
                                                break;
                                            case 7 :
                                                btnClass = "#20a0ff";
                                                st = "已修改";
                                                break;
                                            case 8 :
                                                btnClass = "#20a0ff";
                                                st = "待同步";
                                                break;
                                        }
                                    }
                                    let m = PersonSelection.getManage(item.creator, () => {
                                        this.forceUpdate();
                                    });
                                    return (
                                        <Layout.Col xs={8} sm={8} md={6} lg={6} className="el-col-xlg-4"
                                                    key={`new${item.id}`}
                                                    style={{margin: "6px 0"}}>
                                            <Card bodyStyle={{padding: 0}} style={{marginBottom: '5px'}}>
                                                <div style={{
                                                    backgroundColor: btnClass || rgb, opacity: 0.96,
                                                    width: '100%', textAlign: 'left', color: 'white', padding: '3px'
                                                }}>
                                                    <Checkbox label="复选框 A" checked={item.checked}
                                                              style={{width: '100%', color: 'white', marginBottom: '0'}}
                                                              onChange={() => this.props.newChecked({
                                                                  checked: !Boolean(item.checked),
                                                                  value: item.id
                                                              })} value={item.id}>
                                                        <span>{`ID:${item.id}`}</span>
                                                        <span style={{float: 'right', marginRight: '8px'}}>
                                                    {`${item.typeTab}`}{st && ` || `}{st && <span>{st}</span>}
                                                </span>
                                                    </Checkbox>
                                                </div>
                                                <div style={{
                                                    height: this.state.picImgHeight + "px",
                                                    backgroundColor: "#f7fafa",
                                                    margin: "0 8px"
                                                }}><img className={"picImg"} src={item.picUrl}
                                                        onClick={() => this.props.newSelectContent({id: item.id})}
                                                        style={{
                                                            maxWidth: '100%',
                                                            maxHeight: '100%',
                                                            cursor: "pointer"
                                                        }}/></div>
                                                <div style={{padding: '8px', textAlign: 'left'}}>
                                                    <div style={{
                                                        fontWeight: 'bold',
                                                    }}>
                                                        {item.title ?
                                                            <ele.Popover placement="bottom" title="" width="200"
                                                                         trigger="click"
                                                                         content={<ele.Button.Group>
                                                                             <ele.Button type="info"
                                                                                         onClick={() => {
                                                                                             window.open(window.location.origin + `/pc/visible/auditOpinion/add/${item.id}`)
                                                                                         }}>审稿链接
                                                                             </ele.Button>
                                                                             <ele.Button type="info"
                                                                                         onClick={() => {
                                                                                             window.open(window.location.origin + `/pc/visible/preview/${item.id}`)
                                                                                         }}>查看链接
                                                                             </ele.Button>
                                                                         </ele.Button.Group>}>
                                                                <ele.Tooltip className="item" effect="dark"
                                                                             content={item.title}
                                                                             placement="bottom-start">
                                                                    <div style={{
                                                                        textOverflow: 'ellipsis',
                                                                        whiteSpace: 'nowrap',
                                                                        overflow: "hidden",
                                                                        display: "block",
                                                                        cursor: "pointer"
                                                                    }}>  {item.title}</div>
                                                                </ele.Tooltip>
                                                            </ele.Popover> : <br/>}
                                                    </div>
                                                    <div className="bottom clearfix">
                                                        <time className="time" style={{
                                                            fontSize: "12px",
                                                            color: "#a2a2a2",
                                                            fontWeight: '50'
                                                        }}>{item.upTime}</time>
                                                    </div>
                                                    <div className="listContent_model">
                                                        <ele.Tooltip className="item" effect="dark"
                                                                     content={item.contentModeName}
                                                                     placement="bottom-start"> <span
                                                            style={{fontWeight: 'bold'}}>
                                                        模式:
                                                    </span>
                                                            {item.contentModeName}
                                                        </ele.Tooltip>
                                                    </div>
                                                    <div>
                                                <span style={{fontSize: "14px", color: "#828282", lineHeight: "24px"}}>
                                                    <span style={{fontWeight: 'bold'}}>
                                                        {groupId ? "组名" : '员工'}:
                                                    </span>
                                                    {m ? m.name : "无"}
                                                </span>
                                                        <span className={this.flagNum(flagArr, item.flag)}
                                                              onClick={() => this.newOpenFlagRemarks({i: i})}
                                                              style={{float: 'right', marginRight: '8px'}}>
                                                            {item.remarks ?
                                                                <ele.Tooltip className="item" effect="dark"
                                                                             content={item.remarks} placement="bottom">
                                                                    <i className="iconfont">&#xe624;</i>
                                                                </ele.Tooltip> :
                                                                <i className="iconfont">&#xe624;</i>}
                                                </span>
                                                    </div>
                                                    {groupId && <div>
                                                <span style={{fontSize: "14px", color: "#828282", lineHeight: "24px"}}>
                                                {item.largeProcesses && <React.Fragment>
                                                <span style={{fontWeight: 'bold'}}>
                                                    流程:
                                                </span>{item.largeProcesses.name}</React.Fragment>}
                                                </span>
                                                        <span style={{
                                                            fontSize: "14px",
                                                            color: "#828282",
                                                            lineHeight: "24px"
                                                        }}>
                                                {item.smallProcess && <React.Fragment>
                                                    <span style={{fontWeight: 'bold'}}>
                                                ||步骤:
                                                </span>{item.smallProcess.name}</React.Fragment>}
                                                </span>
                                                    </div>}
                                                    <div style={{
                                                        height: '44px',
                                                        position: "relative",
                                                        padding: "0 5px",
                                                        width: "100%"
                                                    }}>
                                                        <div style={{
                                                            position: "absolute",
                                                            left: 0,
                                                            right: 0,
                                                            overflow: "visible",
                                                        }}>
                                                            <div style={{
                                                                height: "44px", verticalAlign: 'middle',
                                                                display: 'table-cell', overflow: "visible",
                                                            }}>
                                                                {item.ifInvalidStr && <ele.Button.Group>
                                                                    <ele.Button type="primary" size="mini">保护期：
                                                                    </ele.Button>
                                                                    <ele.Button type="primary"
                                                                                size="mini">{item.ifInvalidStr.manageName}</ele.Button>
                                                                    {item.relieveProtection &&
                                                                    <ele.Button type="danger" size="mini"
                                                                                onClick={() => {
                                                                                    this.newProtection({id: item.id})
                                                                                }}>取消保护</ele.Button>}
                                                                </ele.Button.Group>}
                                                                <ele.Button.Group>
                                                                    <ele.Button type="success" size="mini" icon="view"
                                                                                onClick={() => this.props.newSelectContent({id: item.id})}>看
                                                                    </ele.Button>
                                                                    {!groupId ? item.submitAudit &&
                                                                        <ele.Button type="primary" size="mini"
                                                                                    onClick={() => this.newSubmitAudit({id: item.id})}>提</ele.Button> :
                                                                        item.smallProcess &&
                                                                        <ele.Button type="success" size="mini"
                                                                                    onClick={() => this.newSubmitAudit({id: item.id})}>转下步</ele.Button>}
                                                                    {item.edit && <ele.Button onClick={() => {
                                                                        let href = (!groupId) ? (window.location.origin + "/pc/adm/content/add/" + this.props.contentType + "/" + item.id)
                                                                            : (window.location.origin + "/pc/adm/content/groupAdd/" + this.props.contentType + '/' + groupId + '/' + item.id);
                                                                        window.open(href);
                                                                    }} type="primary" size="mini"
                                                                                              icon="edit">编</ele.Button>}
                                                                    {(!groupId && item.synchronization) &&
                                                                    <ele.Button type="primary" size="mini"
                                                                                onClick={() => this.newSynchronizationAudit({id: item.id})}>提</ele.Button>}
                                                                    {item.delete &&
                                                                    <ele.Button type="danger" size="mini" icon="delete2"
                                                                                onClick={() =>
                                                                                    this.newDelete({id: item.id})
                                                                                }>删</ele.Button>}
                                                                    {contentType === "album" &&
                                                                    <ele.Button type="info" size="mini"
                                                                                onClick={() => this.newTopSpeedAddId({id: item.id})}>极速选</ele.Button>}

                                                                    <ele.Button type="success" size="mini"
                                                                                onClick={() => this.wordClick({id: item.id})}>导出word
                                                                    </ele.Button>
                                                                    <ele.Popover placement="bottom" title="" width="200"
                                                                                 trigger="click"
                                                                                 content={<ele.Button.Group>
                                                                                     <ele.Button type="info"
                                                                                                 onClick={() => {
                                                                                                     window.open(window.location.origin + `/pc/visible/auditOpinion/add/${item.id}`)
                                                                                                 }}>审稿链接
                                                                                     </ele.Button>
                                                                                     <ele.Button type="info"
                                                                                                 onClick={() => {
                                                                                                     window.open(window.location.origin + `/pc/visible/preview/${item.id}`)
                                                                                                 }}>查看链接
                                                                                     </ele.Button>
                                                                                 </ele.Button.Group>}>
                                                                        <ele.Button size="mini" icon="share">链接
                                                                        </ele.Button>
                                                                    </ele.Popover>
                                                                </ele.Button.Group>
                                                                <ele.Button.Group>
                                                                    {item.editContent && <ele.Button type="success"
                                                                                                     size="mini">{item.editContent}</ele.Button>}
                                                                    {item.deleEditContent &&
                                                                    <ele.Button type="danger" size="mini"
                                                                                onClick={() => this.newDelOnlyString({contentId: item.id})}>放弃</ele.Button>}
                                                                </ele.Button.Group>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </Layout.Col>
                                    )
                                })}
                            </Layout.Row>
                        </div>
                        <div style={{display: newVersion ? 'none' : 'inline'}}>
                            <ele.Table
                                style={{width: '100%', backgroundColor: 'white', marginBottom: '12px'}}
                                columns={columns} data={contents}
                                rowClassName={(item) => this.rowClassName({item, groupId})}
                                border={true} className="contentList" highlightCurrentRow={false}
                            />
                        </div>
                    </div>
                </AJAX>
                <div className="editBottomBox">
                    <span className='el-pagination__total'>已勾选{this.checklistNumber(contents)}条</span>
                    <ele.Button.Group style={{marginLeft: "20px"}}>
                        <ele.Button type="primary" onClick={this.props.selectAll}>全选</ele.Button>
                        <ele.Button type="info" onClick={this.props.selectAgainst}>反选</ele.Button>
                        <ele.Button type="danger" onClick={this.props.selectClear}>取消</ele.Button>
                        {this.props.smallProcessList ?
                            <Dropdown type="primary" onCommand={(sorting) => {
                                this.props.newCheckedSmallProcess({sorting: sorting});
                            }} menu={(
                                <Dropdown.Menu>
                                    {this.props.smallProcessList.map(tab => {
                                        return (
                                            <Dropdown.Item key={tab.id} command={tab.sorting}>
                                                {tab.name}
                                            </Dropdown.Item>
                                        )
                                    })}
                                </Dropdown.Menu>
                            )}>
                                <ele.Button type="primary" style={{fontSize: '16px'}}>
                                    选中<i className="el-icon-caret-bottom el-icon--right"> </i>
                                </ele.Button>
                            </Dropdown> : <Dropdown type="primary" onCommand={(state) => {
                                this.props.newCheckedState({state: state});
                            }} menu={(
                                <Dropdown.Menu>
                                    <Dropdown.Item command='0'>草稿箱</Dropdown.Item>
                                    <Dropdown.Item command='1'>待审核</Dropdown.Item>
                                    <Dropdown.Item command='3'>待发布</Dropdown.Item>
                                    <Dropdown.Item command='7'>已经修改</Dropdown.Item>
                                </Dropdown.Menu>
                            )}>
                                <ele.Button type="primary" style={{fontSize: '14px'}}>
                                    选中<i className="el-icon-caret-bottom el-icon--right"> </i>
                                </ele.Button>
                            </Dropdown>}
                    </ele.Button.Group>

                    <ele.Button.Group style={{marginLeft: "20px"}}>
                        {actionButtons.audit && actionButtons.fail && <ele.Button type="danger" onClick={this.props.batchSubmitFail}>批量失败</ele.Button>}
                        {actionButtons.audit && <ele.Button type="primary" onClick={this.props.batchSubmitThrough}>批量通过</ele.Button>}
                        {(!groupId && actionButtons.submit) && <ele.Button type="primary" onClick={this.props.batchSubmitAudit}>批量提交</ele.Button>}
                        {groupId && <ele.Button type="primary" onClick={this.props.batchTurnNextStep}>批量转下一步</ele.Button>}
                        {(!groupId && actionButtons.release) &&
                        <ele.Button type="primary" onClick={() => {
                            window.open(`${window.location.origin}/pc/adm/content/newRelease/${contentType}/release/${this.props.idsArr().join('_')}`);
                        }}>批量发布</ele.Button>}
                        {(!groupId && actionButtons.update) &&
                        <ele.Button type="primary" onClick={() => {
                            window.open(`${window.location.origin}/pc/adm/content/newRelease/${contentType}/synchronization/${this.props.idsArr().join('_')}`);
                        }}>批量同步</ele.Button>}
                        {actionButtons.synchronizationAuditing &&
                        <ele.Button type="primary" target="_blank" onClick={() => {
                            window.open(`${window.location.origin}/pc/adm/content/synchronization/${contentType}/${this.props.idsArr().join(',')}`);
                        }}>手动批量同步审核状态</ele.Button>}
                        {!groupId && contentType == "struct" &&
                        <Dropdown type="primary" onCommand={(num) => {
                            this.newRotatingPost({i: num, contentModeId: postContentMode[num].id});
                        }} menu={(
                            <Dropdown.Menu>
                                {(postContentMode ? postContentMode : []).map((tab, i) => {
                                    return (
                                        <Dropdown.Item key={tab.id} command={i}>
                                            {tab.name}
                                        </Dropdown.Item>
                                    )
                                })}
                            </Dropdown.Menu>
                        )}>
                            <ele.Button type="primary" style={{fontSize: '16px'}}>
                                拷贝为帖子<i className="el-icon-caret-bottom el-icon--right"> </i>
                            </ele.Button>
                        </Dropdown>}
                    </ele.Button.Group>
                    {!groupId&&(pContentModeId===13502||pContentModeId===13544)&&<Select value={pModeId} onChange={pModeId=>this.setState({pModeId})}
                                                                               style={{width: '150px',marginLeft: '10px'}} placeholder='请选择一个渠道'>
                        {dapContentMode.map(el => {
                            return <Select.Option key={el.id} label={el.name} value={el.id}/>
                        })}
                    </Select>}
                    {!groupId&&(pContentModeId===13502||pContentModeId===13544)&&<ele.Button type="info" onClick={this.batchConversion}>批量转换</ele.Button>}
                    <NewPersonSelection callback={this.props.shiftContent} prompt="把内容转移给..." type={1}
                                        classNum={2} style={{marginLeft: "20px"}}/>
                </div>
                {this.state.manualMatching &&
                <BundleLoading ref={e => this.manualMatchingModal = e} load={manualMatchingModal}/>}
            </div>
        )
    }
}

export default ListContent;

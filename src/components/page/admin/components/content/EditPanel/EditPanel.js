/**
 * Created by 林辉 on 2019/1/7 17:12.添加组建
 */
import React from "react";
import {BundleLoading} from '../../../../../../bundle';
import StringModule
    from "bundle-loader?lazy&name=pc/trends_asset/components/page/admin/components/content/StringModule/app-[name]!../StringModule";
import ItemModule
    from "bundle-loader?lazy&name=pc/trends_asset/components/page/admin/components/content/ItemModule/app-[name]!../ItemModule";
import SpuModule
    from "bundle-loader?lazy&name=pc/trends_asset/components/page/admin/components/content/SpuModule/app-[name]!../SpuModule";
import AnchorImageListModule
    from "bundle-loader?lazy&name=pc/trends_asset/components/page/admin/components/content/AnchorImageListModule/app-[name]!../AnchorImageListModule";
import ImgModule
    from "bundle-loader?lazy&name=pc/trends_asset/components/page/admin/components/content/ImgModule/app-[name]!../ImgModule";
import AddTagModule
    from "bundle-loader?lazy&name=pc/trends_asset/components/page/admin/components/content/AddTagModule/app-[name]!../AddTagModule";
import TagPickerModule
    from "bundle-loader?lazy&name=pc/trends_asset/components/page/admin/components/content/TagPickerModule/app-[name]!../TagPickerModule";
import RadioGroupModule
    from "bundle-loader?lazy&name=pc/trends_asset/components/page/admin/components/content/RadioGroupModule/app-[name]!../RadioGroupModule";
import AddLinkModule
    from "bundle-loader?lazy&name=pc/trends_asset/components/page/admin/components/content/AddLinkModule/app-[name]!../AddLinkModule";
import EditModule
    from "bundle-loader?lazy&name=pc/trends_asset/components/page/admin/components/content/EditModule/app-[name]!../EditModule";
import TitleModule
    from "bundle-loader?lazy&name=pc/trends_asset/components/page/admin/components/content/TitleModule/app-[name]!../TitleModule";
import StructCanvasModule
    from "bundle-loader?lazy&name=pc/trends_asset/components/page/admin/components/content/StructCanvasModule/app-[name]!../StructCanvasModule";
import CascaderSelectModule
    from "bundle-loader?lazy&name=pc/trends_asset/components/page/admin/components/content/CascaderSelectModule/app-[name]!../CascaderSelectModule";
import ForwardModule
    from "bundle-loader?lazy&name=pc/trends_asset/components/page/admin/components/content/ForwardModule/app-[name]!../ForwardModule";
import IceAddVideoModule
    from "bundle-loader?lazy&name=pc/trends_asset/components/page/admin/components/content/IceAddVideoModule/app-[name]!../IceAddVideoModule";
import TextModule
    from "bundle-loader?lazy&name=pc/trends_asset/components/page/admin/components/content/TextModule/app-[name]!../TextModule";
import RatingModule
    from "bundle-loader?lazy&name=pc/trends_asset/components/page/admin/components/content/RatingModule/app-[name]!../RatingModule";
import AtlasImageListModule
    from "bundle-loader?lazy&name=pc/trends_asset/components/page/admin/components/content/AtlasImageListModule/app-[name]!../AtlasImageListModule";
import {newDataMerge} from '../../../../../lib/newUtil/dataMerge';
import {ThousandsOfCall} from "../../../../../lib/util/ThousandsOfCall";
import {dynamicAnalysis} from '../../../page/content/page/components/contentCurrency';
import {Message} from 'element-react';
import {FusionModel, myPropsAndPropsfusion, v1ToV2} from "../../../../../lib/newUtil/channelChange";
let failTime = 0;
class EditPanel extends React.Component {//添加组建
    constructor(props) {
        super(props);
        this.state = {}
    }

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
        let {contentData} = this.props.value;
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
        let hintD = this.props.value.hint;
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
        if (constraint.updateOnChange) {
            this.updateOnChange({model:this.props.value.model,talentId:this.props.value.model.talentMessageIds[0],contentData:contentData},(data)=>{
                this.props.value.model.constraint=data;
                state.model =this.props.value.model;
                this.onChange(state, constraint);
            });
        }else{
            this.onChange(state, constraint);
        }
    };

    onChange = (val) => {//{}
        let value = this.props.value;
        value = value ? value : {};
        for (let i in val) {
            if (i == 'hint' && !val[i]) {
                value[i] = {};
            } else {
                value[i] = val[i];
            }
        }
        this.props.onChange(value);
    };
    updateOnChange = (data,callback) => {//动态加载
        let {talentId,contentData,model} = data;
        let fromData={};
        let url = model.url.split('&');
        for(let i=0; i<url.length;i++ ){
            let uData = url[i].split('=');
            fromData[uData[0]] = uData[1];
        }


        let dt = {
            agreement: "https",
            hostname: "cpub.taobao.com",
            path: '/render.json',
            method: "get",
            data: fromData,
            talentId:talentId,
            referer: "https://we.taobao.com/",
            notRedirect: true
        };
        ThousandsOfCall.acoustic(dt, 'requestRelyAgentTB', (json) => {
            if (json.success) {
                if (!json.code || json.code == 200) {
                    try {
                        let res = JSON.parse(json.data);
                        if (res.status === 'success') {
                            let config = res.config;
                            dynamicAnalysis.dataReorganization({
                                config: config, showContent: {contentData}, accountExec: {talentId},
                                callback:({newConfig, totalMessage})=>{
                                    if (totalMessage) {
                                        Message({
                                            showClose: true,
                                            message: totalMessage,
                                            type: 'info',
                                            duration: 0
                                        });
                                    } else {
                                        let newConstraint=model.constraint.v===2?FusionModel(newConfig.children,model.constraint):v1ToV2(newConfig.children,model.constraint);
                                        if(callback){
                                            callback(newConstraint);
                                        }
                                    }
                                }
                            });

                        } else {
                            Message.error(json.message);
                            return false;
                        }
                    } catch (e) {
                        ThousandsOfCall.acoustic({
                            id: this.state.talentId,
                            url: json.redirectLocation
                        }, "switchAccount", () => {
                            failTime++;
                            this.updateOnChange(talentId, data,callback);
                        });
                    }
                } else if (json.code == 302) {
                    ThousandsOfCall.acoustic({
                        id: this.state.talentId,
                        url: json.redirectLocation
                    }, "switchAccount", () => {
                        failTime++;
                        this.updateOnChange(talentId, data,callback);
                    });
                } else {
                    message.warning('淘宝操作频繁，请稍后再试，或联系最高管理员重新授权');
                }
            }else{
                Message.error(json.message);
            }
        });
    };

    dataAdditionalChange = (name, value) => {
        let contentData = this.props.contentData;
        for (let i in  this.props.model.constraint) {
            let item = this.props.model.constraint[i];
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
    };

    prompt = (title, value) => {//出现违禁词事件
        let {privateDisable} = this.props.value.model;
        if (value) {
            let contraband = privateDisable ? privateDisable.split(",") : [];
            for (let i in contraband) {
                let t = contraband[i];
                if (t.length > 0) {
                    if (value.indexOf(t) >= 0) {
                        new noty({
                            text: '当前' + title + '出现违禁词【' + t + '】,请更改',
                            type: 'error',
                            layout: 'topCenter',
                            modal: false,
                            timeout: 3000,
                            theme: 'bootstrap-v4',
                            animation: {
                                open: 'noty_effects_open',
                                close: 'noty_effects_close'
                            }
                        }).show();
                    }
                }
            }
        }
    };
    editModelTabChange = (name) => {//改变模板选项事件
        let value = this.props.value;
        value.tabsName = name;
        this.onChange(value);
    };

    render() {
        let {model, contentData, hint} = this.props.value;
    //    model.constraint.constraint = myPropsAndPropsfusion(model.constraint.constraint);
        newDataMerge.mergeProps({contentMode: model.constraint}, (cmct) => {
            model.constraint = cmct;
        });

        let {constraint, nameList} = model.constraint;
        let jidian = (nameList ? nameList : constraint).map((itemName, i) => {

            if (itemName.isShow) {
                let item = nameList ? constraint[itemName.name] : itemName;

                let value = (contentData[item.name]) ? (contentData[item.name].value) : undefined;
                switch (item.type) {
                    case "Input":
                        return (
                            <BundleLoading load={StringModule} key={item.name} value={value} constraint={item}
                                           dataAdditionalChange={this.dataAdditionalChange} onChange={this.dataChange}
                                           hint={hint[item.name]}
                                           modelSet={true} tabsName={item.name} modelOnChenge={() => {
                                this.editModelTabChange(item.name)
                            }}/>
                        );
                        break;
                    case "CreatorAddItem":
                        return (
                            <BundleLoading load={ItemModule} ref={e => this.itemModule = e} key={item.name}
                                           value={value} constraint={item}
                                           dataAdditionalChange={this.dataAdditionalChange}
                                           onChange={this.dataChange} hint={hint[item.name]}
                                           modelSet={true} tabsName={item.name} modelOnChenge={() => {
                                this.editModelTabChange(item.name)
                            }}/>
                        );
                        break;
                    case "CreatorAddSpu":
                        return (
                            <BundleLoading load={SpuModule} key={item.name} value={value} constraint={item}
                                           onChange={this.dataChange} hint={hint[item.name]}
                                           modelSet={true} modelOnChenge={() => {
                                this.editModelTabChange(item.name)
                            }}/>
                        );
                        break;
                    case "AnchorImageList":
                        return (
                            <BundleLoading load={AnchorImageListModule} ref={e => this.anchorImageListModule = e}
                                           key={item.name}
                                           value={value} channel={model.channel} constraint={item}
                                           onChange={this.dataChange} hint={hint[item.name]}
                                           modelSet={true} modelOnChenge={() => {
                                this.editModelTabChange(item.name)
                            }}/>
                        );
                        break;
                    case "CreatorAddImage":

                        return (
                            <BundleLoading load={ImgModule} key={item.name} value={value} constraint={item}
                                           onChange={this.dataChange} hint={hint[item.name]}
                                           modelSet={true} modelOnChenge={() => {
                                this.editModelTabChange(item.name)
                            }}/>
                        );
                        break;
                    case "AddTag":
                        return (
                            <BundleLoading load={AddTagModule} key={item.name} value={value} constraint={item}
                                           onChange={this.dataChange} hint={hint[item.name]}
                                           modelSet={true} modelOnChenge={() => {
                                this.editModelTabChange(item.name)
                            }}/>
                        );
                        break;
                    case "TagPicker":
                        return (
                            <BundleLoading load={TagPickerModule} key={item.name} value={value} constraint={item}
                                           onChange={this.dataChange} hint={hint[item.name]}
                                           modelSet={true} modelOnChenge={() => {
                                this.editModelTabChange(item.name)
                            }}/>
                        );
                        break;
                    case "RadioGroup":
                        return (
                            <BundleLoading load={RadioGroupModule} key={item.name} value={value} constraint={item}
                                           contentMode={model}
                                           talentMessageIds={model.talentMessageIds} onChange={this.dataChange}
                                           hint={hint[item.name]}
                                           modelSet={true} tabsName={item.name} modelOnChenge={() => {
                                this.editModelTabChange(item.name)
                            }}/>
                        );
                        break;
                    case "AddLink":
                        return (
                            <BundleLoading load={AddLinkModule} key={item.name} value={value} constraint={item}
                                           onChange={this.dataChange} hint={hint[item.name]}
                                           modelSet={true} tabsName={item.name} modelOnChenge={() => {
                                this.editModelTabChange(item.name)
                            }}/>
                        );
                        break;
                    case "Editor":
                        return (
                            <BundleLoading load={EditModule} ref={e => this.editModule = e} key={item.name}
                                           isHide={true} value={value} constraint={item}
                                           talentMessageIds={model.talentMessageIds} onChange={this.dataChange}
                                           hint={hint[item.name]} channel={model.channel}
                                           modelSet={true} tabsName={item.name} modelOnChenge={() => {
                                this.editModelTabChange(item.name)
                            }}/>
                        );
                        break;
                    case "Title":
                        return (
                            <BundleLoading load={TitleModule} key={item.name} constraint={item}
                                           modelSet={true} tabsName={item.name} modelOnChenge={() => {
                                this.editModelTabChange(item.name)
                            }}/>
                        );
                        break;
                    case "StructCanvas":
                        if (!value) {
                            value = item.props.value;
                            contentData[item.name] = {type: item.type, value: value, version: 3};
                            this.setState({contentData: contentData})
                        }
                        return (
                            <BundleLoading load={StructCanvasModule} key={item.name} isHide={true}
                                           value={value instanceof Array ? value : []}
                                           constraint={item} channel={model.channel} onChange={this.dataChange}
                                           hint={hint[item.name]} isFloat={true}
                                           modelSet={true} modelOnChenge={() => {
                                this.editModelTabChange(item.name)
                            }}/>
                        );
                        break;
                    case "CascaderSelect":
                        return (
                            <BundleLoading load={CascaderSelectModule} ref={e => this.casader = e} key={item.name}
                                           value={value} constraint={item} onChange={this.dataChange}
                                           hint={hint[item.name]}
                                           modelSet={true} modelOnChenge={() => {
                                this.editModelTabChange(item.name)
                            }}/>
                        );
                        break;
                    case "Forward":
                        return (
                            <BundleLoading load={ForwardModule} key={item.name} value={value} constraint={item}
                                           onChange={this.dataChange} hint={hint[item.name]}
                                           modelSet={true} modelOnChenge={() => {
                                this.editModelTabChange(item.name)
                            }}/>
                        );
                        break;
                    case 'IceAddVideo':
                        return (
                            <BundleLoading load={IceAddVideoModule} key={item.name} value={value} constraint={item}
                                           onChange={this.dataChange} hint={hint[item.name]}
                                           modelSet={true} modelOnChenge={() => {
                                this.editModelTabChange(item.name)
                            }}/>
                        );
                        break;
                    case 'Text':
                        return (
                            <BundleLoading load={TextModule} key={item.name} constraint={item}
                                           modelSet={true} modelOnChenge={() => {
                                this.editModelTabChange(item.name)
                            }}/>
                        );
                        break;
                    case 'Rating':
                        return (
                            <BundleLoading load={RatingModule} key={item.name} constraint={item} value={value}
                                           onChange={this.dataChange}
                                           modelSet={true} modelOnChenge={() => {
                                this.editModelTabChange(item.name)
                            }}/>
                        );
                        break;
                    case 'AtlasImageList':
                        return (
                            <BundleLoading load={AtlasImageListModule} key={item.name} constraint={item} value={value}
                                           onChange={this.dataChange}
                                           modelSet={true} modelOnChenge={() => {
                                this.editModelTabChange(item.name)
                            }}/>
                        );
                        break;
                }
            }
        });
        return (<div>{jidian}</div>)


    }
}

export default EditPanel;
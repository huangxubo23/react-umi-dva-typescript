
/**
 * Created by 石英 on 2018/11/23 0023上午 10:49.
 */

import {newTemplate, parameter, pushItem, savedapei} from "../release/components/take";
import {Message,Notification} from 'element-react';
import 'element-theme-default';
import {ThousandsOfCall} from "../../../../../../../components/lib/util/ThousandsOfCall";
import {acoustic} from "../../../../../../lib/util/global";
import {currencyNoty} from "../../../../../../lib/util/Noty";

let darenId={};

const titleCase = (str) => {//第一个字母大写
    let array = str.toLowerCase().split(" ");
    for (let i = 0; i < array.length; i++) {
        array[i] = array[i][0].toUpperCase() + array[i].substring(1, array[i].length);
    }
    return array.join(" ");
};

const randomString = (len) => {
    let num = len || 32;
    let $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let maxPos = $chars.length;
    let pwd = '';
    for (let i = 0; i < num; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
};

const http_delete = (url) => {
    return url.replace(/http:|https:/g, "");
};

const defaultValue = ({value, type}) => {//默认值
    if (type === "string") {
        return value ? value : "";
    } else if (type === "array") {
        return value ? value : [];
    } else if (type === "object") {
        return value ? value : {};
    }else {
        return '';
    }
};

const addItem = (itemUrl, activityId, callback) => {//商品数据口
    parameter(
        {
            agreement: "https",
            hostname: "resource.taobao.com",
            path: "/item/add",
            data: {
                url: itemUrl,
                activityId: activityId,
                categoryId: 0
            },
            method: "POST",
            referer: "https://we.taobao.com/"
        }, darenId, (msg) => {
            if (msg.success) {
                try {
                    let json = JSON.parse(msg.data);
                    if (json.data) {
                        callback(json.data);
                    } else {
                        callback(json.data,`发布出错，宝贝链接:${itemUrl}已经下架或者不存在`);
                    }
                }catch (e) {
                    Message({
                        showClose: true,
                        message: `出错：${e}`,
                        type: 'warning'
                    });
                }
            } else {
                Message({
                    showClose: true,
                    message: '获取失败',
                    type: 'warning'
                });
            }
        }
    );
};

const getItem=({itemArray,activityId,callback,array=[],index=0,errors=''})=>{//获取宝贝
    if(index<itemArray.length){
        let value=itemArray[index++];
        addItem(value.resourceUrl, activityId, (data,error) => {
            if(error){
                errors+=error+';';
            }
            let item = {
                checked: false,
                coverUrl: value.coverUrl,
                extraBanners: value.extraBanners,
                finalPricePc: 0,
                finalPriceWap: 0,
                images: value.extraBanners,
                itemId: value.itemId,
                materialId: data ? data.materialId : "",
                price: value.price ? +value.price : (data ? (data.item.finalPrice ? +data.item.finalPrice : +data.item.reservedPrice) : ""),
                rawTitle: value.title,
                resourceUrl: value.resourceUrl,
                title: value.title
            };
            array.push(item);
            getItem({itemArray,activityId,callback,array,index,errors})
        });
    }else {
        callback({array,errors})
    }
};

const AtlasImage=({value})=>{
    let newValue=[];
    value.forEach((item)=>{
        if(item.url.length>1){
            item.url.forEach((img)=>{
                newValue.push({
                    anchors: [],
                    desc: item.desc,
                    hotSpaces: [],
                    materialId: "",
                    resourceFeatures: {
                        atlasIndex: item.resourceFeatures.atlasIndex,
                        picTab: item.resourceFeatures.picTab
                    },
                    url: img
                })
            })
        }else {
            newValue.push({
                anchors: [],
                desc: item.desc,
                hotSpaces: [],
                materialId: "",
                resourceFeatures: {
                    atlasIndex: item.resourceFeatures.atlasIndex,
                    picTab: item.resourceFeatures.picTab
                },
                url: item.url[0]
            })
        }
    });
    return newValue;
};

class DynamicAnalysis{
    pushUpdate = ({config, callback,index=0}) => {//数据更新
        let obj = {
            agreement: "https",
            hostname: "cpub.taobao.com",
            path: "/async.json?" + config.updateUrl.split("?")[1],
            data: {
                config:JSON.stringify(config)
            },
            method: "post",
            referer: 'https://we.taobao.com/'
        };
        parameter(
            obj, darenId, (msg) => {
                if (msg.success) {
                    try {
                        let json = JSON.parse(msg.data);
                        callback(json.config);
                    } catch (e) {
                        if (index < 3) {
                            let newT = setInterval(() => {
                                clearInterval(newT);
                                dynamicAnalysis.pushUpdate({config, callback,index:index+1});
                            }, 300);
                        } else {
                            if (window.confirm('达人平台更新接口调用失败,点击确定重试？')) {
                                dynamicAnalysis.pushUpdate({config, callback,index:index+1});
                            }
                        }
                    }
                } else {
                    Message({
                        showClose: true,
                        message: '获取失败',
                        type: 'warning'
                    });
                }
            }
        );
    };
    deleteContent=({id},callback)=>{
        let obj = {
            agreement: "https",
            hostname: "daren.taobao.com",
            path: '/creator/content/delete.json',
            data: {
                id,
                __version__: 3.0,
                appKey: 'draft'
            },
            method: "get",
            referer: 'https://we.taobao.com/'
        };
        parameter(
            obj, darenId, (msg) => {
                let json = JSON.parse(msg.data);
                if(json.status!='SUCCESS'){
                    Notification({
                        title: '警告',
                        message: '草稿箱内容删除失败!',
                        type: 'warning'
                    });
                    if(callback&&typeof callback=='function'){
                        callback({number:4,type:'error'})
                    }
                }else {
                    if(callback&&typeof callback=='function'){
                        callback({number:4,type:'success'})
                    }
                }
            }
        )
    };
    dataReorganization=({config,showContent,callback,index=0,accountExec='',totalMessage='',pushPage=false,isInteractiveVideo=false})=>{//accountExec授权账号
        if(accountExec){
            darenId=accountExec;
        }
        let {children}=config;
        if(index<children.length){
            let {component,name,updateOnChange}=children[index];
            let componentData=showContent.contentData[name];
            let callRelease=()=>{
                config.children=children;
                if (updateOnChange=='true') {
                    dynamicAnalysis.pushUpdate({config,callback:(newConfig)=>{
                            dynamicAnalysis.dataReorganization({config:newConfig,showContent,callback,index:index+1,totalMessage,pushPage,isInteractiveVideo});
                        }})
                }else {
                    dynamicAnalysis.dataReorganization({config,showContent,callback,index:index+1,totalMessage,pushPage,isInteractiveVideo});
                }
            };
            if (component === "Input") {//input输入
                if (componentData) {
                    children[index].props.value =defaultValue({value:componentData.value,type:'string'});
                }
                callRelease();
            }else if (component === "Forward") {//forward引导话题
                if (componentData) {
                    children[index].props.value = defaultValue({value: componentData.value, type: "string"});
                }
                callRelease();
            } else if (component === "AddLink") {//addLink添加链接
                if (componentData) {
                    children[index].props.value = defaultValue({value: componentData.value, type: "array"});
                }
                callRelease();
            } else if (component === "AddTag") {//addTag添加短亮点
                if (componentData) {
                    children[index].props.value = defaultValue({value: componentData.value, type: "array"});
                }
                callRelease();
            }else if (component === "RadioGroup") {//radioGroup单选
                if (componentData) {
                    if (name === "itemSpuOption"&&componentData.value) {
                        children[index].props.value = componentData.value;
                    } else {
                        if (componentData.value) {
                            children[index].props.value = componentData.value;
                        }
                    }
                }
                callRelease();
            }else if (component === "CreatorAddItem") {//creatorAddItem商品
                if (componentData) {
                    Object.assign(children[index].props,{value:[]});
                    let activityId = 0;
                    let valueArray = componentData.value?componentData.value:[];
                    getItem({
                        itemArray:valueArray,activityId,callback:({array,errors})=>{
                            totalMessage+=errors;
                            children[index].props.value.push(...array);
                            callRelease();
                        }
                    });
                } else {
                    callRelease();
                }
            } else if (component === "CreatorAddSpu") {//spu
                if (componentData) {
                    Object.assign(children[index].props,{value:[]});
                    let value = componentData.value[0];
                    let obj = {
                        coverUrl: value.coverUrl,
                        extraBanners:[value.coverUrl],
                        images: [],
                        materialId: value.materialId,
                        resourceType: "Product",
                        spuId: value.spuId,
                        title: value.title,
                    };
                    children[index].props.value.push(obj);
                    callRelease();
                } else {
                    callRelease();
                }
            }else if (component === "CreatorAddImage") {//图片
                if (componentData && componentData.value && componentData.value.length > 0) {
                    Object.assign(children[index].props,{value:[]});
                    let value = componentData.value;
                    value.forEach(item=>{
                        children[index].props.value.push({
                            anchors: [],
                            hotSpaces: [],
                            materialId: item.materialId,
                            url: item.url
                        });
                    });
                    callRelease();
                } else {
                    callRelease();
                }
            } else if(component==='AtlasImageList'){//模块
                if (componentData && componentData.value && componentData.value.length > 0) {
                    Object.assign(children[index].props,{value:[]});
                    let value = componentData.value;
                    let newValue=AtlasImage({value});
                    Object.assign(children[index].props,{value:newValue});
                    callRelease();
                } else {
                    callRelease();
                }
            } else if (component === "CascaderSelect") {//人群
                if (componentData) {
                    children[index].props.value = defaultValue({value:componentData.value,type:'string'});
                }
                callRelease();
            } else if (component === "DateTime") {//定时
                // if (componentData) {
                //     children[index].props.value = componentData.value;
                // }
                callRelease();
            }else if (component === "creator-none") {//参加“微淘优质内容奖励”
                if (componentData) {
                    children[index].props.value = componentData.value;
                }
                callRelease();
            } else if (component === "TagPicker") {//分类
                if (componentData) {
                    children[index].props.value = componentData.value;
                }
                callRelease();
            }else if (component === 'CreatorPush') {//是否推送主页
                Object.assign(children[index].props,{value:pushPage});
                callRelease();
            }  else if (component === 'Rating') {//店铺评分
                children[index].props.value = componentData.value;
                callRelease();
            }else if (component === "OriginalStatement") {//originalStatement原创声明
                let {newOriginalStatement}=showContent.contentData;
                if (newOriginalStatement) {
                    Object.assign(children[index].props.value,{
                        declared:newOriginalStatement===1
                    });
                }
                callRelease();
            } else if (component === "AnchorImageList") {//搭配图片
                if (componentData) {
                    if (children[index].props.type === "CreatorAddCollocation") {
                        let value = componentData && componentData.value ? componentData.value : [];
                        let newValue = [];
                        let clDAP = (value, callback) => {
                            if (value.length > 0) {
                                let [dap, ...val] = value;
                                if (dap.pushItem) {
                                    pushItem(dap, (pushItem) => {
                                        newValue.push(pushItem);
                                        clDAP(val, callback)
                                    });
                                } else {
                                    if (dap.device) {
                                        savedapei(dap.device, (item) => {
                                            if (item) {
                                                newValue.push(item);
                                            }
                                            clDAP(val, callback);
                                        })
                                    } else {
                                        newValue.push(dap);
                                        clDAP(val, callback)
                                    }
                                }

                            } else {
                                callback();
                            }
                        };
                        clDAP(value, () => {
                            Object.assign(children[index].props,{value:newValue});
                            callRelease();
                        });
                    } else {
                        children[index].props.value = defaultValue({value: componentData.value, type: "array"});
                        callRelease();
                    }
                } else {
                    callRelease();
                }
            } else if (component === "Editor") {//帖子编辑器
                if(componentData){
                    let oldValue = componentData.value;
                    let [oldBlocks, oldEntityMap, obj] = [oldValue.blocks, oldValue.entityMap, {
                        blocks: [],
                        entityMap: {}
                    }];
                    let activityId = 0;
                    let ps = children[index].props.plugins;
                    for (let i in ps) {
                        if (ps[i].name == "SIDEBARSEARCHITEM") {
                            activityId = ps[i].props.activityId;
                        }
                    }
                    let bl = 0;
                    for (let o in oldBlocks) {
                        if (oldBlocks[o].type == "unstyled") {
                            obj.blocks.push({
                                depth: 0,
                                entityRanges: [],
                                inlineStyleRanges: oldBlocks[o].inlineStyleRanges,
                                text: oldBlocks[o].text,
                                type: "unstyled"
                            });
                            bl++;
                        } else if (oldBlocks[o].type == "alignCenter") {
                            obj.blocks.push({
                                depth: 0,
                                entityRanges: [],
                                inlineStyleRanges: oldBlocks[o].inlineStyleRanges,
                                text: oldBlocks[o].text,
                                type: "alignCenter"
                            });
                            bl++;
                        } else if (oldBlocks[o].type == "alignLeft") {
                            obj.blocks.push({
                                depth: 0,
                                entityRanges: [],
                                inlineStyleRanges: oldBlocks[o].inlineStyleRanges,
                                text: oldBlocks[o].text,
                                type: "alignLeft"
                            });
                            bl++;
                        } else if (oldBlocks[o].type == "alignRight") {
                            obj.blocks.push({
                                depth: 0,
                                entityRanges: [],
                                inlineStyleRanges: oldBlocks[o].inlineStyleRanges,
                                text: oldBlocks[o].text,
                                type: "alignRight"
                            });
                            bl++;
                        } else if (oldBlocks[o].type == "atomic") {
                            let key = randomString(20);
                            let k = oldBlocks[o].entityRanges[0].key;
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
                            if (oldEntityMap[k].type == "SIDEBARSEARCHITEM") {
                                if (oldEntityMap[k].data.materialId) {
                                    obj.entityMap[key] = {
                                        data: {
                                            coverUrl: http_delete(oldEntityMap[k].data.coverUrl),
                                            description: oldEntityMap[k].data.description,
                                            itemId: oldEntityMap[k].data.itemId,
                                            materialId: oldEntityMap[k].data.materialId,
                                            name: key,
                                            price: +oldEntityMap[k].data.price,
                                            resourceUrl: oldEntityMap[k].data.resourceUrl,
                                            title: oldEntityMap[k].data.title,
                                            type: "SIDEBARSEARCHITEM",
                                        },
                                        mutability: "IMMUTABLE",
                                        type: "SIDEBARSEARCHITEM"
                                    };
                                    bl++;
                                } else {
                                    addItem(oldEntityMap[k].data.detailUrl ? oldEntityMap[k].data.detailUrl : ("https://item.taobao.com/item.htm?id=" + oldEntityMap[k].data.itemId), activityId, (data,errror) => {
                                        if(errror){
                                            totalMessage+=errror+';';
                                        }
                                        obj.entityMap[key] = {
                                            data: {
                                                coverUrl: http_delete(oldEntityMap[k].data.coverUrl),
                                                description: oldEntityMap[k].data.description,
                                                itemId: oldEntityMap[k].data.itemId,
                                                materialId: data ? data.materialId : "",
                                                name: key,
                                                price: data ? (data.item.finalPrice ? parseInt(data.item.finalPrice) : parseInt(data.item.reservedPrice)) : "",
                                                resourceUrl: data ? data.item.itemUrl : "",
                                                title: oldEntityMap[k].data.title,
                                                type: "SIDEBARSEARCHITEM",
                                            },
                                            mutability: "IMMUTABLE",
                                            type: "SIDEBARSEARCHITEM"
                                        };
                                        bl++;
                                    });
                                }
                            } else if (oldEntityMap[k].type == "SIDEBARIMAGE") {
                                if (oldEntityMap[k].data.materialId) {
                                    obj.entityMap[key] = {
                                        data: {
                                            materialId: oldEntityMap[k].data.materialId,
                                            name: key,
                                            type: "SIDEBARIMAGE",
                                            url: oldEntityMap[k].data.url
                                        },
                                        mutability: "MUTABLE",
                                        type: "SIDEBARIMAGE"
                                    };
                                } else {
                                    obj.entityMap[key] = {
                                        data: {
                                            name: key,
                                            type: "SIDEBARIMAGE",
                                            url: oldEntityMap[k].data.url
                                        },
                                        mutability: "MUTABLE",
                                        type: "SIDEBARIMAGE"
                                    };
                                }
                                bl++;
                            } else if (oldEntityMap[k].type == "SIDEBARADDSPU") {
                                let ids = {
                                    itemIds: oldEntityMap[k].data.itemId,
                                };
                                obj.entityMap[key] = {
                                    data: {
                                        coverUrl: oldEntityMap[k].data.coverUrl,
                                        features: JSON.stringify(ids),
                                        images: [oldEntityMap[k].data.coverUrl],
                                        materialId: oldEntityMap[k].data.materialId,
                                        name: key,
                                        resourceType: "Product",
                                        spuId: oldEntityMap[k].data.spuId,
                                        title: oldEntityMap[k].data.title,
                                        type: "SIDEBARADDSPU"
                                    },
                                    mutability: "IMMUTABLE",
                                    type: "SIDEBARADDSPU"
                                };
                                bl++;
                            } else if (oldEntityMap[k].type == "SIDEBARHOTSPACEIMAGE") {
                                let hot = (hotSpaces) => {
                                    let arr = [];
                                    for (let h in hotSpaces) {
                                        if (hotSpaces[h].type == 'link') {
                                            arr.push(hotSpaces[h]);
                                        } else if (hotSpaces[h].type == 'item') {
                                            arr.push({
                                                data: {
                                                    coverUrl: hotSpaces[h].data.coverUrl,
                                                    finalPricePc: 0,
                                                    finalPriceWap: 0,
                                                    images: [hotSpaces[h].data.coverUrl],
                                                    itemId: hotSpaces[h].data.url.split("=")[1],
                                                    price: 0,
                                                    rawTitle: hotSpaces[h].data.title,
                                                    resourceUrl: hotSpaces[h].data.resourceUrl ? hotSpaces[h].data.resourceUrl : hotSpaces[h].data.url,
                                                    title: hotSpaces[h].data.title,
                                                    url: hotSpaces[h].data.url ? hotSpaces[h].data.url : hotSpaces[h].data.resourceUrl
                                                },
                                                height: hotSpaces[h].height,
                                                type: "item",
                                                width: hotSpaces[h].width,
                                                x: hotSpaces[h].x,
                                                y: hotSpaces[h].y
                                            })
                                        }
                                    }
                                    return arr;
                                };
                                obj.entityMap[key] = {
                                    data: {
                                        hotSpaces: hot(oldEntityMap[k].data.hotSpaces),
                                        name: key,
                                        picHeight: oldEntityMap[k].data.picHeight,
                                        picWidth: oldEntityMap[k].data.picWidth,
                                        showPoint: oldEntityMap[k].data.showPoint,
                                        type: "SIDEBARHOTSPACEIMAGE",
                                        url: oldEntityMap[k].data.url
                                    },
                                    mutability: "MUTABLE",
                                    type: "SIDEBARHOTSPACEIMAGE"
                                };
                                bl++;
                            } else {
                                bl++;

                            }
                        } else {
                            bl++;
                        }
                    }
                    let isEditor = setInterval(() => {
                        if (oldBlocks.length <= bl) {
                            Object.assign(children[index].props,{value:obj});
                            clearInterval(isEditor);
                            callRelease();
                        }
                    }, 500);
                }else {
                    callRelease();
                }
            }else if (component === 'IceAddVideo') {//短视频
                let Video = showContent.contentData[name];
                if(Video && Video.value instanceof Array&&Video.value.length > 0){
                    if((!isInteractiveVideo)&&Video.value[0].ivideoData){
                        let sp = ({str, type, r = 0}) => {
                            let s = str.split('&');
                            for (let t in s) {
                                let p = s[t].split('=');
                                if (p.length == 2 && p[0] == type) {
                                    r = p[1];
                                }
                            }
                            return r;
                        };
                        const promise = new Promise((resolve, reject) => {
                            let {videoId, title, playUrl, coverUrl, duration, ivideoData} = Video.value[0];
                            parameter({
                                agreement: "https",
                                hostname: "duomeiti.taobao.com",
                                path: "/interactiveVideo.htm",
                                data: {
                                    bizCode: 'DAREN',
                                    videoInfo: JSON.stringify({title, coverUrl, videoUrl: playUrl, videoId, duration})
                                },
                                method: "get",
                                referer: "https://we.taobao.com/"
                            }, darenId, (json) => {
                                let videoData=json.data;
                                let str = videoData.split('"exparams","')[1];
                                let str1 = str.split('"')[0];
                                let userId = sp({str: str1, type: 'userid'});
                                let str2 = videoData.split('"J_subID_num" value="')[1];
                                let str3 = str2.split('"')[0];
                                Object.assign(ivideoData, {
                                    userId: userId, userName: str3
                                });
                                let time=new Date();
                                let t=time.format("yyyy-MM-dd hh:mm:ss");
                                ivideoData.gmtCreate=t;
                                ivideoData.gmtModified=t;
                                delete ivideoData.totalItem;
                                Object.assign(ivideoData,{timeline:ivideoData.timeline.map((item)=>{
                                        item.offsetLeft=Math.round(item.offsetLeft);
                                        item.width=Math.round(item.width);
                                        return item;
                                    })});
                                let s = {
                                    type: "originaljson",
                                    dataType: "jsonp",
                                    api: "mtop.dreamweb.interactive.add",//编辑 mtop.dreamweb.interactive.update
                                    v: "2.0",
                                    appKey: 12574478,
                                    t: new Date().getTime(),
                                    jsv: "2.4.10",
                                    ecode: 1,
                                };
                                let dataT={
                                    parameters: s,
                                    requesData: {data: JSON.stringify(ivideoData)},
                                    host: "https://h5api.m.taobao.com/h5",
                                    ajaxData: {
                                        requeryType: "post",
                                        referer: "https://duomeiti.taobao.com/interactiveVideo.htm"
                                    }
                                };
                                setTimeout(()=>{
                                    if (darenId.talentId) {
                                        Object.assign(dataT, {talentId: darenId.talentId})
                                    }
                                    ThousandsOfCall.acoustic(dataT, "requestH5", (data) => {
                                        if (data.success) {
                                            if (data.data.interactiveVideoId) {
                                                setTimeout(() => {
                                                    resolve(data.data.interactiveVideoId);
                                                }, 3000);
                                            } else {
                                                resolve();
                                            }
                                        } else {
                                            Message({
                                                showClose: true,
                                                message: '上传互动视频出现错误，请确认内容是否完整或修改后重试！',
                                                type: 'warning'
                                            });
                                        }
                                    });
                                },2000);
                            });
                        });
                        promise.then((id) => {
                            if(id&&Video){
                                Video.value[0].interactId = id;
                                delete Video.value[0].ivideoData;
                                children[index].props.value = Video.value;
                            }
                            callRelease();
                        });
                    }else {
                        if(isInteractiveVideo&&Video.value[0].ivideoData){
                            delete Video.value[0].ivideoData;
                        }
                        children[index].props.value = Video.value;
                        callRelease();
                    }
                }else {
                    callRelease();
                }
            } else if (component === "StructCanvas") {//结构体
                let structCanvasCon = children[index];
                let moduleInfos = structCanvasCon.props.moduleInfos;
                let sidebarBlockList = structCanvasCon.props.sidebarBlockList;

                dynamicAnalysis.getModuleInfos(sidebarBlockList, moduleInfos, () => {
                    let module = (value) => {
                        for (let v in value) {
                            if (value[v].data.images && value[v].data.images.length > 0 && value[v].data.images[0].picWdth) {
                                value[v].data.images[0].materialId = "";
                                value[v].data.images[0].picWidth = value[v].data.images[0].picWdth;
                                delete value[v].data.images[0].picWdth;
                            }
                        }
                        return value;
                    };
                    let value = module(componentData.value);
                    let newValue = [];
                    let vl = 0;

                    for (let i = 0; i < value.length; i++) {
                        vl++;
                        clValue(value[i], i, (nv) => {
                            if (nv.success) {
                                newValue[i] = nv.data;
                            } else {
                                newValue[i] = structCanvasCon.props.value[i];
                                totalMessage+=nv.message+';';
                            }
                            vl--;
                        })
                    }

                    let t3 = setInterval(()=> {
                        if (vl == 0) {
                            clearInterval(t3);
                            Object.assign(structCanvasCon.props,{value:newValue});
                            callRelease();
                        }
                    }, 1000);


                    function clValue(value, ind, callback) {
                        let v = value;
                        const materialId = v.materialId;
                        let moduleInfo = moduleInfos[materialId];

                        if (!moduleInfo && (materialId == "UPX-48576-20014762302" || materialId == "UPX-48578-20016185602")) {
                            for (let i in moduleInfos) {
                                if (moduleInfos[i].materialId == "UPX-48576-20014762302" || moduleInfos[i].materialId == "UPX-48578-20016185602") {
                                    moduleInfo = moduleInfos[i];
                                }
                            }
                        }
                        if (moduleInfo != null) {
                            let moduleInfoName = moduleInfo.name;
                            let n = moduleInfoName.split("-");
                            let name = "";
                            for (let ne in n) {
                                name += titleCase(n[ne]);
                            }
                            let retData = {
                                moduleInfo: {dataSchema: moduleInfo.dataSchema},
                                attrs: {},
                                errorMsg: "",
                                guid: name + "-" + ind,
                                materialId: moduleInfo.materialId,
                                name: moduleInfo.name,
                                resourceId: moduleInfo.id,
                                rule: {"dragable": true, "enable": true, "replaceable": true, "deletable": true}
                            };

                            let properties = moduleInfo.dataSchema;
                            dynamicAnalysis.propertiesCl(properties, v.data, {moduleConfig: structCanvasCon.props.moduleConfig}, (t) => {

                                if (t.success) {
                                    retData.data = t.data;
                                    callback({data: retData, success: true});
                                } else {
                                    retData.data = t.data;
                                    callback({data: retData, success: false, message: t.message ? t.message : ""});
                                }
                            });
                        } else {
                            callback({success: false, message: "模版不正确,请尽量保证软件和达人后台的主题一致"});
                        }
                    }
                })
            }else {
                callRelease();
            }
        }else {
            callback({newConfig:config,totalMessage})
        }
    };
    getModuleInfos = (sidebarBlockList, moduleInfo, callback) => {
        let clNum = 0;
        for (let i in sidebarBlockList) {
            if (sidebarBlockList[i].moduleInfo) {
                moduleInfo[sidebarBlockList[i].moduleInfo.materialId] = sidebarBlockList[i].moduleInfo;
                clNum++;
            } else {
                let api = sidebarBlockList[i].props.api;
                dynamicAnalysis.getModuleInfo(api, (mis) => {
                    for (let z in  mis) {
                        moduleInfo[mis[z].materialId] = mis[z];
                    }
                    clNum++;
                })
            }
        }

        let t = setInterval(() => {
            if (clNum >= sidebarBlockList.length) {
                window.clearInterval(t);
                callback(moduleInfo);
            }
        }, 500)
    };

    getModuleInfo = (api, callback) => {
        dynamicAnalysis.getModuleInfoAjax({
            api: api, current: 1, callback: (modelInfos) => {
                callback(modelInfos);
            }
        })
    };

    getModuleInfoAjax = (json) => {
        let sp = json.api.split('//')[1];
        let cs = newTemplate.urlAnalysis(json.api);
        cs.current = json.current;
        cs.pageSize = 10;
        cs.__version__ = 3.0;
        let obj = {
            agreement: "https",
            hostname: sp.split(".com")[0] + ".com",
            path: sp.split(".com")[1].split("?")[0],
            data: cs,
            method: "get",
            referer: "https://we.taobao.com/"
        };
        parameter(
            obj, darenId, (msg) => {
                if (msg.success) {
                    let data = JSON.parse(msg.data);
                    let modelInfos = json.modelInfos ? json.modelInfos : [];
                    modelInfos = modelInfos.concat(data.data.itemList);
                    if (data.total > data.current * data.pageSzie) {
                        dynamicAnalysis.getModuleInfoAjax({
                            modelInfos: modelInfos,
                            api: json.api,
                            current: data.current + 1,
                            callback: json.callback,
                        });
                    } else {
                        json.callback(modelInfos);
                    }
                } else {
                    Message({
                        showClose: true,
                        message: '获取失败',
                        type: 'warning'
                    });
                }
            }
        );
    };


    propertiesCl = (propertie, value, json, callback) => {
        let message = "";
        let bridge = "ui:bridge";
        if (propertie.type == "array") {
            let success = true;
            let data = [];
            let pi = propertie.items;
            json[bridge] = propertie[bridge];
            if (value) {
                let valueData = (callback, value, i = 0) => {
                    if (!value || i < value.length) {
                        dynamicAnalysis.propertiesCl(pi, value[i], json, (t) => {
                            if (t.success) {
                                data.push(t.data);
                            } else {
                                success = false;
                                data.push(t.data);
                                message += t.message + "\n\r"
                            }
                            valueData(callback, value, i + 1)
                        })
                    } else {
                        callback();
                    }
                };
                valueData(() => {
                    callback({data: data, success: success, message: message});
                }, value)
            } else {
                callback({data: [], success: success, message: message});
            }
        } else if (propertie.type == "object") {

            if (propertie.title == "bmqd-item" || propertie.title == "添加宝贝") {

                if (!value.detailUrl && value.itemId) {
                    value.detailUrl = "https://detail.tmall.com/item.htm?=" + value.itemId;
                } else if (!value.detailUrl && value.item) {
                    value.detailUrl = value.item.detailUrl;
                }

                if (value.detailUrl) {
                    let bridgev = json[bridge];
                    let commonItemPropsName = bridgev.split(":")[1];
                    let commonItemProps = json.moduleConfig[commonItemPropsName];

                    let newData = {
                        isCollected: true,
                        itemImages: value.itemImages,
                        itemPriceDTO: value.itemPriceDTO,
                        item_numiid: value.item_numiid,
                        item_pic: value.item_pic,
                        item_title: value.item_title,
                        materialId: value.materialId
                    };
                    addItem(value.detailUrl, 0, (items, message) => {
                        if (message) {
                            callback({data: newData, success: false, message: message})
                        } else {
                            callback({data: newData, success: true})
                        }
                    });

                } else {
                    callback({data: value, success: false, message: "某条内容没有商品"});
                }

            } else if (propertie.allOf && propertie.allOf[0]["__ref"] == "contentDetail/content_spu") {

                callback({success: true, data: value, message: ""});

            } else {
                let success = true;
                let properties = propertie.properties;
                let data = {};
                let lindex = 0;
                for (let propertiesName in properties) {
                    lindex++;

                    if (value) {
                        dynamicAnalysis.propertiesCl(properties[propertiesName], value[propertiesName], json, (t) => {
                            lindex--;
                            if (t.success) {
                                data[propertiesName] = t.data;
                            } else {
                                data[propertiesName] = t.data;
                                success = false;
                                message += t.message + "\n\r";
                            }
                        });
                    } else {
                        lindex--;
                        data[propertiesName] = {};
                    }
                }

                let t1 = setInterval(() => {
                    if (lindex == 0) {
                        window.clearInterval(t1);
                        callback({success: success, data: data, message: message});
                    }
                }, 800);

            }
        } else {
            callback({success: true, data: value});
        }
    };
}
let dynamicAnalysis = new DynamicAnalysis();

export {dynamicAnalysis}


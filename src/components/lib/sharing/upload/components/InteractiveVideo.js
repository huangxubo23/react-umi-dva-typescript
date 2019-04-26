/**
 * Created by 石英 on 2019/3/15 0015下午 3:20.
 */

import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import {Layout,Button,Dialog,Radio,Input,Select} from 'element-react';
import 'element-theme-default';
import '../../../../../styles/addList/content.css';
import {acoustic} from '../../../util/global'
import UpIitem from '../UpItem'
require("../../../../lib/util/jquery-ui.min");


class Interaction extends React.Component {

    componentDidMount() {

    }

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            data: {},
            videoTime: 0,
            newTime: '00:00.0',
            left: 0,
            buttonData: [],
            totalItem: [],
            editNum: -1,
            addOK:true,
            drag:{},
            type:'add',
            disabled:false,
            daren:{}
        };
        this.open = ({item,type,disabled}) => {
            this.setState({showModal: true, data:item,type,disabled}, () => {
                if(type==='add'){
                    this.getLabel(()=>{
                        this.dsp();
                    });
                }else if(type==='edit'){
                    this.getLabel(()=>{
                        this.setState({totalItem:item.ivideoData.totalItem},this.dsp)
                    });
                }
            })
        };
        this.close = () => {
            this.setState({
                showModal: false,
                data: {},
                videoTime: 0,
                newTime: '00:00.0',
                left: 0,
                buttonData: [],
                totalItem: [],
                editNum: -1,
                addOK:true,
                drag:{},
                type:'add',
            });
        };
    }

    dsp=()=>{
        let st=setInterval(()=>{
            if ($("#active").length > 0&&$('#active').get(0)) {
                clearInterval(st);
                $("#active").on("canplay", () => {
                    let myVid = $('#active').get(0);
                    myVid.ontimeupdate = ()=> {
                        let c=myVid.currentTime;
                        let n = (c % 60).toFixed(1), t = Math.floor(c / 60);
                        this.setState({
                            left: Math.floor(c*6.8),
                            newTime: `${t > 9 ? t : `0${t}`}:${n < 10 ? `0${n}` : n}`,
                            drag:this.pd(c),
                        });
                    };
                });
                let w=$('#active').get(0).videoWidth;
                let h=$('#active').get(0).videoHeight;
                //this.setState({videoTime: $('#active').get(0).duration,w_h:`${w}_${h}`,videoWidth:480,videoHeight:parseInt(h/w*480)});
                this.setState({videoTime: $('#active').get(0).duration,videoWH:{initialW:w,initialH:h,exhibitionW:(w/h*360),exhibitionH:360}});
            }
        },500);
    };

    getLabel = (callback) => {//拿取按钮数据
        let data = {"bizFrom": "DAREN"};
        let s = {
            type: "jsonp",
            dataType: "jsonp",
            api: "mtop.interactive.admin.menu.list",
            v: "1.0",
            appKey: 12574478,
            t: new Date().getTime(),
            jsv: "2.4.2",
            ecode: 1,
        };
        acoustic({
            parameters: s,
            requesData: data,
            host: "https://acs.m.taobao.com/h5",
            ajaxData: {requeryType: "get", referer: "https://h5.m.taobao.com"}
        }, "requestH5", (data) => {
            this.setState({buttonData: data.result},()=>{
                callback();
            })
        });
    };

    componentDidUpdate() {
        $(".timeLine").draggable({axis: "x", containment: "parent"}).unbind("drag").on("drag", (event, ui) => {//实时时间线
            let l=Number(ui.position.left);
            this.setState({
                left: l,
                newTime: this.newTimeChange({left:l,type:"start"})
            }, () => {
                let myVid = $('#active').get(0);
                myVid.currentTime = Math.round(ui.position.left / 68 * 100)/10;
            });
        });

        if($('.contentTag').length>0){
            $(ReactDOM.findDOMNode(this)).find(".contentTag").draggable({containment: 'parent'}).unbind("dragstop").on("dragstop", (event, ui) => {
                let i = $(event.target).data("i");
                let {totalItem}=this.state;
                let x = ui.position.left;
                let y = ui.position.top;
                totalItem[i].anchorArray.previewX = x;
                totalItem[i].anchorArray.previewY = y;
                totalItem[i].anchorArray.x = x/640;
                totalItem[i].anchorArray.y = y/360;
                this.setState({totalItem:totalItem});
            });
        }
    }

    Timeline = (len) => {//时间线
        let timeLine = new Array(len + 1).fill('');
        for (let t in timeLine) {
            let l = Math.floor(t / 6);
            timeLine[t] = `${l > 9 ? l : `0${l}`}:${t % 6}0`;
        }
        return timeLine;
    };

    Interaction = () => {//互动组件
        let {buttonData}=this.state;
        this.selectionType.open({data:buttonData});
    };

    addOpen = ({componentName}) => {//打开
        if (componentName === 'darenItemCard') {
            this.setState({callback: this.itemCard,addOK:!this.state.addOK}, () => {
                this.upIitem.open();
            })
        } else if (componentName === 'coupon') {
            this.setState({callback: this.coupon,addOK:!this.state.addOK}, () => {
                let ids=this.couponIds();
                this.upCoupon.open(ids);
            })
        } else if (componentName === 'contentTag') {
            this.setState({callback: this.tag,addOK:!this.state.addOK}, () => {
                this.upIitem.open();
            })
        }
    };

    couponIds=()=>{
        let {totalItem} = this.state;
        let {entries} = Object,arr=[];
        for (let [key, value] of entries(totalItem)) {
            if(value.type=='darenItemCard'){
                arr.push(value.item.itemId);
            }
        }
        return arr.join();
    };

    coupon=(it)=>{
        let {totalItem, newTime, left} = this.state;
        totalItem.push({
            type: "coupon",
            title: "优惠券",
            item: it,
            startTime: newTime,
            endTime: this.getEndTime(newTime,5),
            timeLength: 5,
            offsetLeft: left,
            width: 34,
        });
        this.setState({totalItem: totalItem, editNum: totalItem.length-1});
    };

    Coupon=(it)=>{
        let {totalItem,editNum} = this.state;
        let t = totalItem[editNum];
        t.item = it;
        totalItem.splice(editNum, 1, t);
        this.setState({totalItem: totalItem});
    };

    titleChange = (value) => {//++内容标签=>contentTitle
        let {totalItem, editNum} = this.state;
        totalItem[editNum].contentTitle = value;
        this.setState({totalItem});
    };

    tag = (it) => {//+内容标签
        let {totalItem, newTime, left} = this.state;
        totalItem.push({
            type: "contentTag",
            title: "内容标签",
            item: it,
            startTime: newTime,
            endTime: this.getEndTime(newTime,5),
            timeLength: 5,
            offsetLeft: left,
            width: 34,
            contentTitle: it.title.slice(0, 7),
            anchorArray: {
                boxX: 0,
                boxY: 0,
                boxW: 640,
                boxH: 360,
                previewX: 302,
                previewY: 162,
                x: 0.471875,
                y: 0.45,
                time: 0,
                direction:false
            },
        });
        this.setState({totalItem: totalItem, editNum: totalItem.length-1});
    };

    Tag = (it) => {//++内容标签
        let {totalItem,editNum} = this.state;
        let t = totalItem[editNum];
        t.item = it;
        t.contentTitle = it.title.slice(0, 7);
        totalItem.splice(editNum, 1, t);
        this.setState({totalItem: totalItem});
    };

    itemCard = (it) => {//+边看边买
        let {totalItem, newTime, left} = this.state;
        totalItem.push({
            type: "darenItemCard",
            title: "边看边买",
            item: it,
            startTime: newTime,
            endTime: this.getEndTime(newTime,5),
            timeLength: 5,
            offsetLeft: left,
            width: 34,
        });
        this.setState({totalItem: totalItem, editNum: totalItem.length-1});
    };

    ItemCard = (it) => {//++边看边买
        let {totalItem,editNum} = this.state;
        let t = totalItem[editNum];
        t.item = it;
        totalItem.splice(editNum, 1, t);
        this.setState({totalItem: totalItem});
    };

    display = (env) => {//显示编辑
        env.stopPropagation();
        let i = $(env.target).data("i");
        this.setState({editNum: parseInt(i)});
    };

    unDisplay = () => {//取消编辑
        //this.setState({editNum:-1});
    };

    del = (env) => {//删除内容块
        let i = $(env.target).data("i");
        let {totalItem} = this.state;
        totalItem.splice(i, 1);
        this.setState({totalItem: totalItem, editNum: -1});
    };

    newTimeChange=({left,type})=>{
        if(type==='start'){
            let ti = Math.round(left / 68 * 100)/10;
            let n = (ti % 60).toFixed(1), t = Math.floor(ti / 60);
            let n1=`${n}`;
            return `${t > 9 ? t : `0${t}`}:${n < 10 ? `0${n1.indexOf('.')<0?`${n}.0`:n}` : n1.indexOf('.')<0?`${n}.0`:n}`;
        }else if(type==='end'){
            let ti = Math.round(left / 68 * 100)/10;
            let n = (ti % 60).toFixed(1), t = Math.floor(ti / 60);
            let n1=`${n}`;
            return `${t > 9 ? t : `0${t}`}:${n < 10 ? `0${n1.indexOf('.')<0?`${n}.0`:n}` : n1.indexOf('.')<0?`${n}.0`:n}`;
        }
    };

    getTimeLength=(startTime,endTime)=>{
        let st=startTime.split(':');
        let start=Number(st[0])*60+Number(st[1]);
        let en=endTime.split(':');
        let end=Number(en[0])*60+Number(en[1]);
        return (end*10-start*10).toFixed(0)/10;
    };

    getEndTime=(startTime,timeLength)=>{
        let st=startTime.split(':');
        let start=Number(st[0])*60+Number(st[1]);
        let ti=(start*10+timeLength*10)/10;
        let n = (ti % 60).toFixed(1), t = Math.floor(ti / 60);
        let n1=`${n}`;
        return `${t > 9 ? t : `0${t}`}:${n < 10 ? `0${n1.indexOf('.')<0?`${n}.0`:n}` : n1.indexOf('.')<0?`${n}.0`:n}`;
    };

    dragMousemove = (e) => {
        let {nowDrag,leftDrag,rightDrag,editNum,totalItem,videoTime}=this.state;
        let scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
        let x = e.clientX + scrollX;
        if(nowDrag>=0&&nowDrag===editNum){//移动
            let left=Math.floor((x - $(".general").offset().left) - totalItem[nowDrag].width/2);
            if(0<=left&&left<=((videoTime-1) *6.8-totalItem[nowDrag].width)){
                let startTime=this.newTimeChange({left:left,type:"start"});
                Object.assign(totalItem[nowDrag],{
                    offsetLeft:left,
                    startTime:startTime,
                    endTime:this.getEndTime(startTime,totalItem[nowDrag].timeLength),
                });
                this.setState({totalItem});
            }
        }
        if(leftDrag>=0&&leftDrag===editNum){//左拉缩放
            let left=x - $(".general").offset().left;
            let w=totalItem[leftDrag].offsetLeft-left+totalItem[leftDrag].width;
            if(0<=left&&w>=34){
                let startTime=this.newTimeChange({left:left,type:"start"});
                Object.assign(totalItem[leftDrag],{
                    offsetLeft:left,
                    startTime:startTime,
                    width:w,
                    timeLength:this.getTimeLength(startTime,totalItem[leftDrag].endTime)
                });
                this.setState({totalItem});
            }
        }
        if(rightDrag>=0&&rightDrag===editNum){//右拉缩放
            let left=x - $(".general").offset().left;
            if(totalItem[rightDrag].offsetLeft+34<=left&&left<=(videoTime-1) *6.8){
                let endTime=this.newTimeChange({left:left,type:"end"});
                Object.assign(totalItem[rightDrag],{
                    width:left-totalItem[rightDrag].offsetLeft,
                    endTime:endTime,
                    timeLength:this.getTimeLength(totalItem[rightDrag].startTime,endTime)
                });
                this.setState({totalItem});
            }
        }
    };

    pd=(newTime,obj={})=>{//浮动标签判断
        let {totalItem}=this.state;
        for (let t in totalItem){
            let st=(totalItem[t].offsetLeft/6.8).toFixed(1);
            if(Number(st)<=newTime&&newTime<=(Number(st)+Number(totalItem[t].timeLength))){
                if(totalItem[t].type=="contentTag"){
                    Object.assign(obj,{
                        pd:true,
                        num:t
                    });
                    break;
                }else if(totalItem[t].type=="coupon"){
                    Object.assign(obj,{
                        cp:true,
                        num:t
                    });
                    break;
                }
            }
        }
        return obj;
    };

    order = (name, item) => {
        return item.sort((a, b) => {
            return a[name] - b[name]
        })
    };

    like=(totalItem)=>{
        return totalItem.map((item)=>{
            let offsetLeft=Math.round(item.offsetLeft),width=Math.round(item.width);
            let startTime=this.newTimeChange({left:offsetLeft,type:"start"}),endTime=this.newTimeChange({left:offsetLeft+width,type:"end"});
            item.startTime=startTime;
            item.endTime=endTime;
            item.timeLength=this.getTimeLength(startTime,endTime);
            item.offsetLeft=offsetLeft;
            item.width=width;
            return item;
        });
    };

    submit=()=>{
        let {data,daren,totalItem,type,videoWH}=this.state;
        let time=new Date();
        let t=time.format("yyyy-MM-dd hh:mm:ss");
        if(totalItem.length>1){
            this.order('offsetLeft', totalItem);
        }
        totalItem=this.like(totalItem);
        if(type=='add'){
            let d={
                coverUrl: data.coverUrl,
                duration: data.duration,
                gmtCreate: t,
                gmtModified: t,
                interactiveTypeString: "timeline",
                jsTemplates: {},
                materialList: "",
                mediaType: "1",
                producerSource: "1",
                source: "TBVideo",
                timeline: this.timelineData(totalItem),
                title: data.title,
                type: "1",
                userId: daren.userId,
                userName: daren.userName,
                version: 2,
                videoId: data.videoId,
                videoUrl: data.playUrl,
                status: 1,
                height: videoWH.initialH,
                width: videoWH.initialW,
                videoTraceInfo: false,
                totalItem:totalItem
            };
            data.ivideoData=d;
            this.props.videoData(data);
            this.close();
        }else {
            data.ivideoData.timeline=this.timelineData(totalItem);
            data.ivideoData.totalItem=totalItem;
            this.props.videoData(data);
            this.close();
        }
    };

    timelineData=(totalItem,arr=[])=>{//内容块整合
        let {data,videoWH}=this.state;
        let {entries} = Object;
        let defaultData=[460206980,488824882,493041319,501698010,254368138,256801021];
        for (let [key, value] of entries(totalItem)) {
            let moduleData=this.dataModuleList(value.type);
            if(value.type=='darenItemCard'){
                Object.assign(moduleData,{
                    endTime:value.endTime,
                    materialName:`item_${defaultData.shift()}`,
                    startTime:value.startTime,
                    width:value.width,
                    offsetLeft:value.offsetLeft,
                    renderData:{
                        favored: "false",
                        itemId: ''+value.item.itemId,
                        itemName: value.item.title,
                        itemPic: value.item.coverUrl,
                        itemPrice: value.item.price,
                        itemUrl:`//h5.m.taobao.com/awp/core/detail.htm?iv=search&id=${value.item.itemId}&scm=20140639.88.1.1`,
                        fetchStatus: "success",
                        bulk: "false",
                        type: "itemInfo"
                    }
                });
                let mode={
                    jsData: {
                        bulk: "false",
                        favored: "false",
                        itemId: ''+value.item.itemId,
                        type: "itemInfo",
                        shopId: "",
                        userId: "",
                        itemName: value.item.title,
                        coverUrl: value.item.coverUrl,
                    },
                    renderOrientation: "RB",
                };
                Object.assign(moduleData.portraitMode,mode);
                Object.assign(moduleData.landscapeMode,mode);
                arr.push(moduleData);
            }else if(value.type=='contentTag'){
                Object.assign(moduleData,{
                    endTime:value.endTime,
                    materialName: "contentTag_256801021",
                    startTime:value.startTime,
                    width:value.width,
                    offsetLeft:value.offsetLeft,
                    renderData: {
                        favored: "false",
                        itemId: value.item.itemId,
                        itemName: value.item.title,
                        itemPic: value.item.coverUrl,
                        contentTitle: value.contentTitle,
                        contentType: "1",
                        contentUrl:'//item.taobao.com/item.htm?id='+value.item.itemId,
                        traceFlag: "0",
                        type: "contentTag",
                        renderOrientation: value.anchorArray.direction?"LB":"RB",
                        fetchStatus: "success",
                        itemPrice: value.item.price,
                        itemUrl:`//h5.m.taobao.com/awp/core/detail.htm?iv=search&id=${value.item.itemId}&scm=20140639.88.1.1`,
                    }
                });
                let mode={
                    anchorArray: [{
                        boxX: 0,
                        boxY: 0,
                        boxW: 640,
                        boxH: 360,
                        x: value.anchorArray.x,
                        y: value.anchorArray.y,
                        previewX: value.anchorArray.previewX,
                        previewY: value.anchorArray.previewY,
                        time: 0
                    }],
                    jsData: {
                        contentTitle: value.contentTitle,
                        contentType: "1",
                        contentUrl: value.item.resourceUrl,
                        itemId: value.item.itemId,
                        itemName: value.item.title,
                        renderOrientation: value.anchorArray.direction?"LB":"RB",
                        coverUrl: value.item.coverUrl,
                        shopId: "",
                        userId: "",
                        type: "contentTag",
                        traceFlag: 0
                    },
                    renderOrientation: value.anchorArray.direction?"LB":"RB",//"LB"
                };
                Object.assign(moduleData.portraitMode,mode);
                Object.assign(moduleData.landscapeMode,mode);
                arr.push(moduleData);
            }else if(value.type=='coupon'){
                let currentTime = new Date().getTime();
                Object.assign(moduleData,{
                    endTime:value.endTime,
                    materialName: "coupon_272855545",
                    startTime:value.startTime,
                    width:value.width,
                    offsetLeft:value.offsetLeft,
                    renderData: {
                        fetchStatus: "success",
                        itemMiniPic: "//img.alicdn.com/tps/i1/TB1A6FlMpXXXXcJXVXXcy0wIpXX-70-70.png",
                        itemPic: "//img.alicdn.com/tps/i3/TB15ZhKMpXXXXXmXFXX7XzKOFXX-264-102.png",
                        name: value.item.name,
                        threshold: value.item.threshold,
                        amount: value.item.amount,
                        supplierId: value.item.supplierId,
                        uuid: value.item.uuid,
                        type: value.item.type,
                        activityId: value.item.activityId,
                        applyCount: value.item.applyCount,
                        couponInstanceSource: value.item.couponInstanceSource,
                        currentTime: `${currentTime}`,
                        endTime: value.item.endTime,
                        startTime: value.item.startTime,
                        status: "1",
                        totalCount: value.item.totalCount,
                    }
                });
                let mode={
                    jsData: {
                        supplierId: value.item.supplierId,
                        coverUrl: "//img.alicdn.com/tps/i3/TB15ZhKMpXXXXXmXFXX7XzKOFXX-264-102.png",
                        status: "1",
                        endTime: value.item.endTime,
                        type: value.item.type,
                        threshold: value.item.threshold,
                        startTime: value.item.startTime,
                        activityId: value.item.activityId,
                        amount: value.item.amount,
                        currentTime: `${currentTime}`,
                        couponInstanceSource: value.item.couponInstanceSource,
                        totalCount: value.item.totalCount,
                        shopId: "",
                        name: value.item.name,
                        videoId: data.videoId,
                        userId: "",
                        uuid: value.item.uuid,
                        applyCount: value.item.applyCount
                    },
                    renderOrientation: "RB",
                };
                Object.assign(moduleData.portraitMode,mode);
                Object.assign(moduleData.landscapeMode,mode);
                arr.push(moduleData);
            }else {

            }
        }
        return arr;
    };

    dataModuleList=(type)=>{//初始模板
        let content={
            alipayCoupon: {
                source: 'alipayCoupon',
                name: 'alipayCoupon',
                type: 'WEEX',
                portraitMode: {
                    type: 'H5',
                    align: 'bottom',
                    layout: 'relative',
                    startAnimations: null,
                    endAnimations: null
                },
                landscapeMode: {
                    type: 'H5',
                    align: 'bottom',
                    layout: 'relative',
                    startAnimations: null,
                    endAnimations: null
                },
            },
            coupon: {
                source: 'coupon',
                name: 'coupon',
                type: 'WEEX',
                portraitMode: {
                    type: 'WEEX',
                    align: 'bottom',
                    layout: 'relative',
                    startAnimations: [{
                        type : "TYPE_SCALE_START",
                        duration : 300,
                        interpolatorType : "linear",
                        orientation : "top"
                    }],
                    endAnimations: [{
                        type : "TYPE_SCALE_END",
                        duration : 300,
                        interpolatorType : "linear",
                        orientation : "top"
                    }]
                },
                landscapeMode: {
                    type: 'WEEX',
                    align: 'bottom',
                    layout: 'relative',
                    startAnimations: [{
                        type : "TYPE_SCALE_START",
                        duration : 300,
                        interpolatorType : "linear",
                        orientation : "top"
                    }],
                    endAnimations: [{
                        type : "TYPE_SCALE_END",
                        duration : 300,
                        interpolatorType : "linear",
                        orientation : "top"
                    }]
                },
            },
            itemcard: {
                source: 'item',
                name: 'itemcard',
                type: 'WEEX',
                portraitMode: {
                    type: 'WEEX',
                    align: 'bottom',
                    layout: 'relative',
                    startAnimations: [{
                        type : "TYPE_TRANSLATION_START1",
                        duration : 300,
                        interpolatorType : "linear",
                        orientation : "top"
                    }],
                    endAnimations: [{
                        type : "TYPE_TRANSLATION_END1",
                        duration : 300,
                        interpolatorType : "linear",
                        orientation : "top"
                    }]
                },
                landscapeMode: {
                    type: 'WEEX',
                    align: 'bottom',
                    layout: 'relative',
                    startAnimations: [{
                        type : "TYPE_TRANSLATION_START1",
                        duration : 300,
                        interpolatorType : "linear",
                        orientation : "right"
                    }],
                    endAnimations: [{
                        type : "TYPE_TRANSLATION_END1",
                        duration : 300,
                        interpolatorType : "linear",
                        orientation : "right"
                    }]
                },
            },
            darenItemCard: {
                source: 'item',
                name: 'darenItemCard',
                type: 'WEEX',
                portraitMode: {
                    type: 'WEEX',
                    align: 'bottom',
                    layout: 'relative',
                    startAnimations: [{
                        type : "TYPE_TRANSLATION_START1",
                        duration : 300,
                        interpolatorType : "linear",
                        orientation : "top"
                    }],
                    endAnimations: [{
                        type : "TYPE_TRANSLATION_END1",
                        duration : 300,
                        interpolatorType : "linear",
                        orientation : "top"
                    }]
                },
                landscapeMode: {
                    type: 'WEEX',
                    align: 'bottom',
                    layout: 'relative',
                    startAnimations: [{
                        type : "TYPE_TRANSLATION_START1",
                        duration : 300,
                        interpolatorType : "linear",
                        orientation : "right"
                    }],
                    endAnimations: [{
                        type : "TYPE_TRANSLATION_END1",
                        duration : 300,
                        interpolatorType : "linear",
                        orientation : "right"
                    }]
                },
            },
            contentTag: {
                source: 'contentTag',
                name: 'contentTag',
                type: 'NATIVE',
                portraitMode: {
                    type: 'NATIVE',
                    align: 'center',
                    layout: 'relative',
                    startAnimations: [{
                        type : "TYPE_TRANSLATION_START1",
                        duration : 300,
                        interpolatorType : "linear",
                        orientation : "top"
                    }],
                    endAnimations: [{
                        type : "TYPE_TRANSLATION_END1",
                        duration : 300,
                        interpolatorType : "linear",
                        orientation : "top"
                    }]
                },
                landscapeMode: {
                    type: 'NATIVE',
                    align: 'center',
                    layout: 'relative',
                    anchorArray: [{
                    }],
                    startAnimations: [{
                        type : "TYPE_TRANSLATION_START1",
                        duration : 300,
                        interpolatorType : "linear",
                        orientation : "top"
                    }],
                    endAnimations: [{
                        type : "TYPE_TRANSLATION_END1",
                        duration : 300,
                        interpolatorType : "linear",
                        orientation : "top"
                    }]
                },
            },
            contentTagTrace: {
                source: 'contentTagTrace',
                name: 'contentTagTrace',
                type: 'NATIVE',
                portraitMode: {
                    type: 'NATIVE',
                    align: 'center',
                    layout: 'relative',
                    startAnimations: [{
                        type : "TYPE_TRANSLATION_START1",
                        duration : 300,
                        interpolatorType : "linear",
                        orientation : "top"
                    }],
                    endAnimations: [{
                        type : "TYPE_TRANSLATION_END1",
                        duration : 300,
                        interpolatorType : "linear",
                        orientation : "top"
                    }]
                },
                landscapeMode: {
                    type: 'NATIVE',
                    align: 'center',
                    layout: 'relative',
                    startAnimations: [{
                        type : "TYPE_TRANSLATION_START1",
                        duration : 300,
                        interpolatorType : "linear",
                        orientation : "top"
                    }],
                    endAnimations: [{
                        type : "TYPE_TRANSLATION_END1",
                        duration : 300,
                        interpolatorType : "linear",
                        orientation : "top"
                    }]
                },
            },
            timeBox: {
                name: "timeBox",
                source: "timeBox",
                type: "WEEX",
                landscapeMode: {
                    type: 'WEEX',
                    align: 'bottom',
                    layout: 'relative',
                    startAnimations: [{
                        type : "TYPE_SCALE_START",
                        duration : 300,
                        interpolatorType : "linear",
                        orientation : "top"
                    }],
                    endAnimations: [{
                        type : "TYPE_SCALE_END",
                        duration : 300,
                        interpolatorType : "linear",
                        orientation : "top"
                    }]
                },
                portraitMode: {
                    type: 'WEEX',
                    align: 'bottom',
                    layout: 'relative',
                    startAnimations: [{
                        type : "TYPE_SCALE_START",
                        duration : 300,
                        interpolatorType : "linear",
                        orientation : "top"
                    }],
                    endAnimations: [{
                        type : "TYPE_SCALE_END",
                        duration : 300,
                        interpolatorType : "linear",
                        orientation : "top"
                    }]
                },
            },
            base: {
                source: '',
                name: '',
                type: 'WEEX',
                portraitMode: {
                    type: 'WEEX',
                    align: 'top',
                    anchorArray: [{
                        boxH: "0.0",
                        boxW: "0.0",
                        boxX: "0.0",
                        boxY: "0.0",
                        previewX: "0.0",
                        previewY: "0.0",
                        time: "0",
                        x: "0.0",
                        y: "0.0"
                    }],
                    layout: 'relative',
                    startAnimations: [{
                        type: "TYPE_TRANSLATION_START1",
                        duration: 300,
                        interpolatorType: "linear",
                        orientation: "top"
                    }],
                    endAnimations: [{
                        type: "TYPE_TRANSLATION_END1",
                        duration: 300,
                        interpolatorType: "linear",
                        orientation: "top"
                    }]
                },
                landscapeMode: {
                    type: 'WEEX',
                    align: 'top',
                    anchorArray: [{
                        boxH: "0.0",
                        boxW: "0.0",
                        boxX: "0.0",
                        boxY: "0.0",
                        previewX: "0.0",
                        previewY: "0.0",
                        time: "0",
                        x: "0.0",
                        y: "0.0"
                    }],
                    layout: 'relative',
                    startAnimations: [{
                        type: "TYPE_TRANSLATION_START1",
                        duration: 300,
                        interpolatorType: "linear",
                        orientation: "right"
                    }],
                    endAnimations: [{
                        type: "TYPE_TRANSLATION_END1",
                        duration: 300,
                        interpolatorType: "linear",
                        orientation: "right"
                    }]
                }
            }
        };
        return content[type];
    };

    render() {
        let {showModal, data, videoTime, left, newTime, callback, totalItem, editNum,drag,float,disabled,videoWH} = this.state, edit = undefined;
        let i = (data.playUrl || '').lastIndexOf('.');
        let type = (data.playUrl || '').substring(i + 1);
        let t = parseInt(videoTime / 10);
        let time = this.Timeline(t);
        if (totalItem.length > 0 && editNum > -1) {
            let {type, title, item, startTime, endTime, timeLength, contentTitle} = totalItem[editNum];
            switch (type) {
                case "darenItemCard":
                    edit = <div style={{
                        paddingRight: 0,
                        paddingLeft: 0,
                        overflowY: "scroll",
                        overflow:"auto",
                        maxHeight:'360px'
                    }}>
                        <h3 style={{color:'#ff5000'}}>边看边买</h3>
                        <div className="thumbnail">
                            <a href={item.resourceUrl} target="_blank">
                                <img src={item.coverUrl}/>
                            </a>
                            <p style={{marginTop: "10px"}}>
                                <a href={item.resourceUrl} target="_blank">{item.title}</a>
                            </p>
                            <p>￥{item.price}&emsp;&emsp;佣金{item.yongjin}</p>
                            <Button type='primary' onClick={() => {
                                this.setState({callback: this.ItemCard}, () => {
                                    this.upIitem.open();
                                })
                            }} style={{width:'100%'}}>重新选择</Button>
                        </div>
                        <div>
                            <div>起始时间：{startTime}</div>
                            <div>结束时间：{endTime}</div>
                            <div>共展现{timeLength}秒 (内容小卡最短展示时长为5秒)</div>
                        </div>
                    </div>;
                    break;
                case "coupon":
                    edit = <div>
                        <h3 style={{color:'#ff5000'}}>优惠券</h3>
                        <div>
                            {`${item.name}  ${item.amount}元  满${item.threshold}元可用`}
                        </div>
                        <Button type='primary' onClick={() => {
                            this.setState({callback: this.Coupon}, () => {
                                let ids=this.couponIds();
                                this.upCoupon.open(ids);
                            })
                        }} style={{width:'100%'}}>重新选择</Button>
                        <div>
                            <div>起始时间：{startTime}</div>
                            <div>结束时间：{endTime}</div>
                            <div>共展现{timeLength}秒 (内容小卡最短展示时长为5秒)</div>
                        </div>
                    </div>;
                    break;
                case "contentTag":
                    edit = <div style={{
                        paddingRight: 0,
                        paddingLeft: 0,
                        overflowY: "scroll",
                        overflow:"auto",
                        maxHeight:'360px'
                    }}>
                        <h3 style={{color:'#ff5000'}}>内容标签</h3>
                        <Input placeholder="标签文本" value={contentTitle} onChange={this.titleChange}/>
                        <div className="thumbnail">
                            <a href={item.resourceUrl} target="_blank">
                                <img src={item.coverUrl}/>
                            </a>
                            <p style={{marginTop: "10px"}}>
                                <a href={item.resourceUrl} target="_blank">{item.title}</a>
                            </p>
                            <p>￥{item.price}&emsp;&emsp;佣金{item.yongjin}</p>
                            <Button type='primary' onClick={() => {
                                this.setState({callback: this.Tag}, () => {
                                    this.upIitem.open();
                                })
                            }} style={{width:'100%'}}>重新选择</Button>
                        </div>
                        <div>
                            <div>起始时间：{startTime}</div>
                            <div>结束时间：{endTime}</div>
                            <div>共展现{timeLength}秒 (内容小卡最短展示时长为5秒)</div>
                        </div>
                    </div>;
                    break;
            }
        }
        return(
            <div>
                <Dialog title='互动视频编辑器' size='small' visible={showModal}
                        onCancel={this.close} lockScroll={false} closeOnClickModal={false} style={{width:'960px'}}>
                    <Dialog.Body>
                        {data.playUrl &&<Layout.Row gutter="6" style={{margin: "18px 0 28px"}} onClick={this.unDisplay}>
                            <Layout.Col span="18" style={{paddingRight: 0, paddingLeft: 0}}>
                                <div style={{position:"relative",textAlign: 'center',width: '640px',height:'360px'}}>
                                    <video id='active' style={{background: '#000',width: '100%',height:"100%"}} controls={true}
                                           poster={data.coverUrl}>
                                        <source src={data.playUrl} type={`video/${type}`}/>
                                    </video>
                                    {drag.cp&&<div style={{position: 'absolute', bottom: 0, right: 0, zIndex: 101}}>
                                        <div style={{
                                            position: 'absolute',
                                            left: 0,
                                            top: 0,
                                            right: 0,
                                            bottom: 0,
                                            zIndex: 100,
                                        }}>

                                        </div>
                                        <div style={{display: 'block'}}>
                                            <div style={{
                                                width: '168.96px',
                                                backgroundColor: 'rgba(0, 0, 0, 0)',
                                                margin: '0!important',
                                                overflow: 'hidden',
                                                WebkitBoxPack: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <div style={{
                                                    position: 'absolute',
                                                    left: 0,
                                                    top: 0,
                                                    width: '168.96px',
                                                    height: '65.28px',
                                                    backgroundImage: 'url(//gw.alicdn.com/tps/i3/TB15ZhKMpXXXXXmXFXX7XzKOFXX-264-102.png)',
                                                    boxSizing: 'border-box',
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundSize: '100% 100%',
                                                    backgroundPosition: '50%',
                                                }}>

                                                </div>
                                                <div style={{
                                                    display: 'flex',
                                                    WebkitBoxOrient: 'horizontal',
                                                    flexDirection: "row",
                                                    paddingLeft: '9.6px',
                                                    WebkitBoxAlign: 'start',
                                                    alignItems: 'flex-start',
                                                    alignContent: 'flex-start',
                                                    position: 'relative',
                                                    boxSizing: 'border-box',
                                                    flexShrink: 0,
                                                }}>
                                                    <div style={{
                                                        fontSize: '14.08px',
                                                        color: 'rgb(255, 255, 255)',
                                                        paddingTop: '9.6px',
                                                        flexDirection: 'column',
                                                        flexShrink: 0,
                                                        alignItems: 'stretch',
                                                        alignContent: 'flex-start',
                                                        position: 'relative',
                                                        WebkitBoxOrient: 'vertical',
                                                        boxSizing: 'border-box',
                                                    }}>
                                                        <span style={{
                                                            whiteSpace: 'pre-wrap',
                                                            wordWrap: 'break-word',
                                                            display: '-webkit-box',
                                                            WebkitBoxOrient: 'vertical'
                                                        }}>
                                                            ¥
                                                        </span>
                                                    </div>
                                                    <div style={{
                                                        fontSize: '25.6px',
                                                        fontWeight: 'bold',
                                                        color: 'rgb(255, 255, 255)',
                                                    }}>
                                                        <span style={{
                                                            whiteSpace: 'pre-wrap',
                                                            wordWrap: 'break-word',
                                                            display: '-webkit-box',
                                                            WebkitBoxOrient: 'vertical',
                                                        }}>
                                                            {totalItem[drag.num].item.amount}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div style={{
                                                    fontSize: '12.8px',
                                                    paddingLeft: '9.6px',
                                                    color: 'rgb(255, 255, 255)',
                                                    position: 'relative',
                                                    display: 'flex',
                                                    WebkitBoxAlign: 'start',
                                                    alignItems: 'flex-start',
                                                    WebkitBoxOrient: 'vertical',
                                                    flexDirection: 'column',
                                                    flexShrink: 0,
                                                    alignContent: 'flex-start'
                                                }}>
                                                        <span style={{
                                                            whiteSpace: 'pre-wrap',
                                                            wordWrap: 'break-word',
                                                            display: '-webkit-box',
                                                            webkitBoxOrient: 'vertical'
                                                        }}>
                                                            {`满${totalItem[drag.num].item.threshold}元可用`}
                                                        </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>}
                                    {drag.pd&&<div style={{
                                        position: 'absolute',
                                        left: `${totalItem[drag.num].anchorArray.previewX}px`,
                                        top: `${totalItem[drag.num].anchorArray.previewY}px`,
                                        zIndex: 101,
                                        minHeight: '37px',
                                        pointerEvents: 'auto'
                                    }} className='contentTag' data-i={drag.num} onMouseOut={()=>this.setState({float:false})} onMouseOver={()=>this.setState({float:true})}>
                                        <div>
                                            <div style={{display: float?'inline':'none'}}>
                                                <i style={{
                                                    display: 'block',
                                                    position: 'absolute',
                                                    top: 0,
                                                    width: '16px',
                                                    height: '16px',
                                                    background: 'url(//gw.alicdn.com/mt/TB1OVWCPpXXXXbxXpXXXXXXXXXX-16-16.png) no-repeat 50%',
                                                    zIndex: 105,
                                                    right:totalItem[drag.num].anchorArray.direction?"auto":0,
                                                    cursor:'pointer'
                                                }} onClick={()=>{
                                                    let {totalItem} = this.state;
                                                    totalItem.splice(drag.num, 1);
                                                    this.setState({totalItem: totalItem, editNum: -1,drag:{}});
                                                }} data-i={drag.num}>

                                                </i>
                                                <i style={{
                                                    padding: '0 31px',
                                                    width: '25px',
                                                    height: '16px',
                                                    background: 'url(//gw.alicdn.com/mt/TB1PzPEPXXXXXb2apXXXXXXXXXX-28-16.png) no-repeat 50%',
                                                    backgroundSize: '25px 16px',
                                                    zIndex: 104,
                                                    display: 'block',
                                                    position: 'absolute',
                                                    top: 0,
                                                    right:totalItem[drag.num].anchorArray.direction?"auto":0,
                                                    cursor:'e-resize'
                                                }} onClick={()=>{
                                                    totalItem[drag.num].anchorArray.direction=!totalItem[drag.num].anchorArray.direction;
                                                    if(totalItem[drag.num].anchorArray.direction){
                                                        let w=$('.anchor').width();
                                                        totalItem[drag.num].anchorArray.x=(totalItem[drag.num].anchorArray.previewX+w)/640;
                                                    }else {
                                                        totalItem[drag.num].anchorArray.x=totalItem[drag.num].anchorArray.previewX/640;
                                                    }
                                                    this.setState({totalItem:totalItem});
                                                }}>

                                                </i>
                                            </div>
                                            <div style={{
                                                display: float?'inline':'none',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                height: '100%',
                                                width: '100%',
                                                border: '1px solid transparent',
                                                zIndex: 102,
                                                borderColor: 'rgb(255, 0, 228)',
                                                backgroundColor: 'rgba(255, 0, 228, 0.4)',
                                                cursor:'move'
                                            }}>

                                            </div>
                                        </div>
                                        <div style={{position:'relation'}}>
                                            <div style={{
                                                position: 'absolute',
                                                left: 0,
                                                top: 0,
                                                right: 0,
                                                bottom: 0,
                                                zIndex: 100,
                                            }}>

                                            </div>
                                            <div>
                                                <div style={{
                                                    display: 'flex',
                                                    WebkitBoxOrient: 'horizontal',
                                                    flexDirection: 'row',
                                                    WebkitBoxAlign: 'center',
                                                    alignItems: 'center'
                                                }}>
                                                    {totalItem[drag.num].anchorArray.direction?<React.Fragment>
                                                            <div style={{
                                                                display: 'flex',
                                                                WebkitBoxOrient: 'horizontal',
                                                                flexDirection: 'row',
                                                                WebkitBoxAlign: 'center',
                                                                alignItems: 'center',
                                                                color: 'rgb(255, 255, 255)',
                                                                alignContent: 'flex-start',
                                                                position: 'relative',
                                                                border: '0 solid black',
                                                                margin: 0,
                                                                padding: 0,
                                                                minWidth: 0,
                                                                boxSizing: 'border-box',
                                                                flexShrink: 0
                                                            }} className='anchor'>
                                                                <div style={{
                                                                    display: 'flex',
                                                                    height: '44.3733px',
                                                                    width: '27.3067px',
                                                                    backgroundImage: 'url(//gw.alicdn.com/mt/TB1JLyrc2DH8KJjy1XcXXcpdXXa-29-52.png)',
                                                                    boxSizing: 'border-box',
                                                                    position: 'relative',
                                                                    backgroundRepeat: 'no-repeat',
                                                                    backgroundSize: '100% 100%',
                                                                    backgroundPosition: '50%',
                                                                }}>

                                                                </div>
                                                                <div style={{
                                                                    boxSizing: 'border-box',
                                                                    position: 'relative',
                                                                    backgroundRepeat: 'no-repeat',
                                                                    backgroundSize: '100% 100%',
                                                                    backgroundPosition: '50%',
                                                                    alignContent: 'flex-start',
                                                                    border: '0 solid black',
                                                                    margin: 0,
                                                                    padding: 0,
                                                                    minWidth: 0,
                                                                    flexDirection: 'column',
                                                                    flexShrink: 0,
                                                                    alignItems: 'stretch',
                                                                    display: 'flex',
                                                                    WebkitBoxOrient: 'vertical',
                                                                    fontSize: '18.7733px',
                                                                    height: '44.3733px',
                                                                    paddingRight: '27.3067px',
                                                                    lineHeight: '44.3733px',
                                                                    backgroundColor: 'rgba(0, 0, 0, 0.6)'
                                                                }}>
                                                                <span style={{
                                                                    whiteSpace: 'pre-wrap',
                                                                    wordWrap: 'break-word',
                                                                    display: '-webkit-box',
                                                                    WebkitBoxOrient: 'vertical',
                                                                    boxSizing: 'border-box'
                                                                }}>
                                                                    {totalItem[drag.num].contentTitle}
                                                                </span>
                                                                </div>
                                                                <div style={{
                                                                    display: 'flex',
                                                                    height: '44.3733px',
                                                                    width: '44.3733px',
                                                                    backgroundImage: 'url(//gw.alicdn.com/mt/TB1IT9mcYYI8KJjy0FaXXbAiVXa-58-52.png)',
                                                                    boxSizing: 'border-box',
                                                                    position: 'relative',
                                                                    backgroundRepeat: 'no-repeat',
                                                                    backgroundSize: '100% 100%',
                                                                    backgroundPosition: '50%'
                                                                }}>

                                                                </div>
                                                            </div>
                                                            <div style={{
                                                                display: 'flex',
                                                                width: '51.2px',
                                                                height: '51.2px',
                                                                backgroundImage: 'url(//gw.alicdn.com/mt/TB1mne7OVXXXXbpaFXXXXXXXXXX-43-43.png)',
                                                                boxSizing: 'border-box',
                                                                position: 'relative',
                                                                backgroundRepeat: 'no-repeat',
                                                                backgroundSize: '100% 100%',
                                                                backgroundPosition: '50%',
                                                            }}>

                                                            </div>
                                                        </React.Fragment>:
                                                        <React.Fragment>
                                                            <div style={{
                                                                display: 'flex',
                                                                width: '51.2px',
                                                                height: '51.2px',
                                                                backgroundImage: 'url(//gw.alicdn.com/mt/TB1mne7OVXXXXbpaFXXXXXXXXXX-43-43.png)',
                                                                boxSizing: 'border-box',
                                                                position: 'relative',
                                                                backgroundRepeat: 'no-repeat',
                                                                backgroundSize: '100% 100%',
                                                                backgroundPosition: '50%',
                                                            }}>

                                                            </div>
                                                            <div style={{
                                                                display: 'flex',
                                                                WebkitBoxOrient: 'horizontal',
                                                                flexDirection: 'row',
                                                                WebkitBoxAlign: 'center',
                                                                alignItems: 'center',
                                                                color: 'rgb(255, 255, 255)',
                                                                alignContent: 'flex-start',
                                                                position: 'relative',
                                                                border: '0 solid black',
                                                                margin: 0,
                                                                padding: 0,
                                                                minWidth: 0,
                                                                boxSizing: 'border-box',
                                                                flexShrink: 0
                                                            }} className='anchor'>
                                                                <div style={{
                                                                    display: 'flex',
                                                                    height: '44.3733px',
                                                                    width: '27.3067px',
                                                                    backgroundImage: 'url(//gw.alicdn.com/mt/TB1JLyrc2DH8KJjy1XcXXcpdXXa-29-52.png)',
                                                                    boxSizing: 'border-box',
                                                                    position: 'relative',
                                                                    backgroundRepeat: 'no-repeat',
                                                                    backgroundSize: '100% 100%',
                                                                    backgroundPosition: '50%',
                                                                }}>

                                                                </div>
                                                                <div style={{
                                                                    boxSizing: 'border-box',
                                                                    position: 'relative',
                                                                    backgroundRepeat: 'no-repeat',
                                                                    backgroundSize: '100% 100%',
                                                                    backgroundPosition: '50%',
                                                                    alignContent: 'flex-start',
                                                                    border: '0 solid black',
                                                                    margin: 0,
                                                                    padding: 0,
                                                                    minWidth: 0,
                                                                    flexDirection: 'column',
                                                                    flexShrink: 0,
                                                                    alignItems: 'stretch',
                                                                    display: 'flex',
                                                                    WebkitBoxOrient: 'vertical',
                                                                    fontSize: '18.7733px',
                                                                    height: '44.3733px',
                                                                    paddingRight: '27.3067px',
                                                                    lineHeight: '44.3733px',
                                                                    backgroundColor: 'rgba(0, 0, 0, 0.6)'
                                                                }}>
                                                                <span style={{
                                                                    whiteSpace: 'pre-wrap',
                                                                    wordWrap: 'break-word',
                                                                    display: '-webkit-box',
                                                                    WebkitBoxOrient: 'vertical',
                                                                    boxSizing: 'border-box'
                                                                }}>
                                                                    {totalItem[drag.num].contentTitle}
                                                                </span>
                                                                </div>
                                                                <div style={{
                                                                    display: 'flex',
                                                                    height: '44.3733px',
                                                                    width: '44.3733px',
                                                                    backgroundImage: 'url(//gw.alicdn.com/mt/TB1IT9mcYYI8KJjy0FaXXbAiVXa-58-52.png)',
                                                                    boxSizing: 'border-box',
                                                                    position: 'relative',
                                                                    backgroundRepeat: 'no-repeat',
                                                                    backgroundSize: '100% 100%',
                                                                    backgroundPosition: '50%'
                                                                }}>

                                                                </div>
                                                            </div>
                                                        </React.Fragment>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>}
                                </div>
                            </Layout.Col>
                            <Layout.Col span="6" style={{paddingRight: 0, paddingLeft: 0}} className='editContent'>
                                {edit}
                            </Layout.Col>
                        </Layout.Row>}
                        <div
                            style={{
                                height: '115px',
                                minWidth: '868px',
                                backgroundColor: '#fff',
                                boxShadow: '0 -2px 6px rgba(0,0,0,.1)',
                                position: 'relative',
                                zIndex: 9999,
                                WebkitUserSelect: 'none',
                                userSelect: 'none',
                                margin: "36px 0 80px"
                            }}>
                            <div style={{
                                position: 'absolute',
                                top: '-33px',
                                padding: '84px 15px',
                                width: '100%',
                                overflowX: 'scroll'
                            }}>
                                <div style={{
                                    margin: "0 15px",
                                    height: "36px",
                                    position: "relative",
                                    border: "1px solid #cbcbcb",
                                    borderLeft: 0,
                                    borderRight: 0,
                                    background: "url(//img.alicdn.com/tps/TB1ReNILXXXXXaSXVXXXXXXXXXX-68-16.png) repeat-x 1px bottom #ececec",
                                    width: `${(videoTime / 10 * 68 + 100) > 800 ? (videoTime / 10 * 68 + 100) : 800}px`
                                }} onMouseMove={this.dragMousemove}>
                                    <div style={{
                                        height: "100%", width: "1px", backgroundColor: "#cbcbcb",
                                        position: "absolute", top: 0, bottom: 0, zIndex: 102, left: 0
                                    }}>

                                    </div>
                                    <div style={{
                                        height: "100%", width: "1px", backgroundColor: "#cbcbcb",
                                        position: "absolute", top: 0, bottom: 0, zIndex: 102, right: 0
                                    }}>

                                    </div>
                                    <div style={{position: 'absolute', left: 0, bottom: 0, zIndex: 98}}>
                                        {(time ? time : []).map((item, i) => {
                                            return (
                                                <div style={{
                                                    position: "absolute",
                                                    zIndex: 99,
                                                    top: 0,
                                                    fontSize: "12px",
                                                    marginLeft: "-20px",
                                                    marginTop: "6px",
                                                    width: "40px",
                                                    textAlign: "center",
                                                    color: "#999",
                                                    left: `${parseInt(i) * 68}px`
                                                }}>
                                                    {item}
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div style={{position: 'relative', zIndex: 103, width: `${videoTime / 10 * 68}px`}}>
                                        <div style={{
                                            height: '34px',
                                            width: '100%',
                                            position: 'relative',
                                            zIndex: 101,
                                            backgroundColor: '#fff'
                                        }}>
                                            <div style={{
                                                height: '34px',
                                                width: '100%',
                                                position: 'relative',
                                                zIndex: 101,
                                                backgroundColor: 'rgb(255, 255, 255)'
                                            }}>
                                                <div style={{
                                                    height: '100%',
                                                    width: '1px',
                                                    backgroundColor: '#cbcbcb',
                                                    position: 'absolute',
                                                    top: 0,
                                                    bottom: 0,
                                                    zindex: 102,
                                                    left: 0
                                                }}>

                                                </div>
                                                <div style={{
                                                    height: '100%', cursor: 'pointer', position: 'relative',
                                                    background: 'url(//img.alicdn.com/tps/TB1ReNILXXXXXaSXVXXXXXXXXXX-68-16.png) repeat-x 0 bottom #fff'
                                                }}>

                                                </div>
                                                <div>
                                                    <div style={{
                                                        width: '100%',
                                                        position: 'absolute',
                                                        left: 0,
                                                        top: 0,
                                                        cursor: 'pointer'
                                                    }} className='general'>
                                                        {totalItem.map((item, i) => {
                                                            let leftIcon = {
                                                                position: 'absolute',
                                                                zIndex: 101,
                                                                width: '1px',
                                                                backgroundColor: '#f60',
                                                                bottom: 0,
                                                                height: '37px',
                                                                left: '-1px',
                                                                cursor: 'ew-resize'
                                                            }, rightIcon = {
                                                                position: 'absolute',
                                                                zIndex: 101,
                                                                width: '1px',
                                                                backgroundColor: '#f60',
                                                                bottom: 0,
                                                                height: '37px',
                                                                right: '-1px',
                                                                cursor: 'ew-resize'
                                                            }, delIcon = {
                                                                position: 'absolute',
                                                                backgroundImage: 'url(https://img.alicdn.com/tps/TB1F104LXXXXXbAXXXXXXXXXXXX-16-16.png)',
                                                                width: '16px',
                                                                height: '16px',
                                                                right: 0,
                                                                top: 0,
                                                                cursor: 'pointer',
                                                                zIndex: 101
                                                            };
                                                            if (i != editNum) {
                                                                Object.assign(leftIcon, {display: 'none'});
                                                                Object.assign(rightIcon, {display: 'none'});
                                                                Object.assign(delIcon, {display: 'none'});
                                                            }
                                                            return (
                                                                <div key={i} style={{
                                                                    boxSizing: 'border-box',
                                                                    position: 'absolute',
                                                                    height: '34px',
                                                                    left: `${item.offsetLeft}px`,
                                                                    zIndex: 100,
                                                                    width: `${item.width}px`
                                                                }} data-i={parseInt(i)}>
                                                                    <div style={leftIcon}>
                                                                        <div style={{
                                                                            background: 'url(https://img.alicdn.com/tps/TB14LtyLXXXXXa5apXXXXXXXXXX-12-20.png)',
                                                                            width: '12px',
                                                                            height: '20px',
                                                                            marginLeft: '-6px',
                                                                            position: 'absolute',
                                                                            left: 0,
                                                                            top: '-20px'
                                                                        }} onMouseDown={()=>{
                                                                            this.setState({leftDrag: i})
                                                                        }} onMouseUp={() => {
                                                                            this.setState({leftDrag: undefined})
                                                                        }} onMouseOut={()=>{
                                                                            this.setState({leftDrag: undefined})
                                                                        }} className='pull'>

                                                                        </div>
                                                                    </div>
                                                                    <div style={rightIcon}>
                                                                        <div style={{
                                                                            background: 'url(https://img.alicdn.com/tps/TB14LtyLXXXXXa5apXXXXXXXXXX-12-20.png)',
                                                                            width: '12px',
                                                                            height: '20px',
                                                                            marginLeft: '-6px',
                                                                            position: 'absolute',
                                                                            left: 0,
                                                                            top: '-20px'
                                                                        }} onMouseDown={()=>{
                                                                            this.setState({rightDrag: i})
                                                                        }} onMouseUp={() => {
                                                                            this.setState({rightDrag: undefined})
                                                                        }} onMouseOut={()=>{
                                                                            this.setState({rightDrag: undefined})
                                                                        }}>

                                                                        </div>
                                                                    </div>
                                                                    <div style={delIcon} onClick={this.del} data-i={i}>

                                                                    </div>
                                                                    <div style={{
                                                                        height: '100%',
                                                                        textAlign: 'center',
                                                                        color: '#fff',
                                                                        lineHeight: '36px',
                                                                        backgroundColor: item.type=="coupon"?"rgba(255,156,0,.8)":(item.type=="darenItemCard"?"rgba(255,80,0,.8)":'#6f85e6')
                                                                    }} onClick={this.display} data-i={i}
                                                                         onMouseDown={() => {
                                                                             this.setState({nowDrag: i})
                                                                         }} onMouseUp={() => {
                                                                        this.setState({nowDrag: undefined})
                                                                    }} onMouseOut={()=>{
                                                                        this.setState({nowDrag: undefined})
                                                                    }}>

                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{
                                                position: 'absolute',
                                                zIndex: 200,
                                                left: `${left}px`,
                                                height: '100%',
                                                top: 0,
                                                width: 0
                                            }} className='timeLine'>
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '-50px',
                                                    bottom: 0,
                                                    width: 0,
                                                    borderLeft: '1px solid red'
                                                }}>

                                                </div>
                                                <div style={{
                                                    display: "flex",
                                                    width: "137px",
                                                    marginLeft: "-27px",
                                                    height: "32px",
                                                    textAlign: "center",
                                                    fontSize: "12px",
                                                    lineHeight: "32px",
                                                    position: "absolute",
                                                    left: 0,
                                                    top: "-85px",
                                                }}>
                                                <span style={{
                                                    background: '#f60',
                                                    color: '#fff',
                                                    width: '56px',
                                                    position: 'relative',
                                                    zIndex: 2,
                                                    height: '32px',
                                                    cursor: 'pointer'
                                                }}>
                                                    {newTime}
                                                </span>
                                                    <span style={{
                                                        width: "80px",
                                                        height: "32px",
                                                        position: "relative",
                                                        zIndex: "2",
                                                        cursor: "pointer",
                                                        backgroundColor: "#ff9000",
                                                        color: "#fff",
                                                        marginLeft: "1px"
                                                    }} onClick={this.Interaction}>
                                                    添加互动组件
                                                </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Dialog.Body>
                    <Dialog.Footer className="dialog-footer">
                        <Button onClick={this.close}>取消</Button>
                        <Button type="primary" onClick={this.submit} disabled={disabled}>确定</Button>
                    </Dialog.Footer>
                </Dialog>
                <SelectionType ref={e=>this.selectionType=e} addOpen={this.addOpen}/>
                <UpIitem ref={e => this.upIitem = e} activityId={0} callback={callback}/>
                <UpCoupon ref={e=>this.upCoupon=e} callback={callback}/>
            </div>
        )
    }
}

class SelectionType extends React.Component{//添加互动组件
    constructor(props){
        super(props);
        this.state={
            showModal:false,
            data:[],
            value:''
        };
    }

    close=()=>{
        this.setState({
            showModal:false,
            data:[],
            value:''
        })
    };

    open=({data})=>{
        this.setState({showModal:true,data})
    };

    changeSelect=(value)=>{
        this.setState({value})
    };

    submit=()=>{
        let {data,value}=this.state,componentName='';
        data.forEach(item=>{
            if(item.title==value){
                componentName=item.componentName;
            }
        });
        this.setState({
            showModal:false,
            data:[],
            value:''
        },()=>this.props.addOpen({componentName}))
    };

    render(){
        let {showModal,data,value}=this.state;
        return(
            <Dialog title='添加互动组件' size="tiny" visible={showModal}
                    onCancel={this.close} lockScroll={false}>
                <Dialog.Body>
                    请选择一个组件添加：
                    <Radio.Group value={value} onChange={this.changeSelect}>
                        {data.map(item=> <Radio.Button value={item.title} key={item.title}/>)}
                    </Radio.Group>
                </Dialog.Body>
                <Dialog.Footer className="dialog-footer">
                    <Button type="primary" onClick={this.submit} disabled={!value}>下一步</Button>
                </Dialog.Footer>
            </Dialog>
        )
    }
}

class UpCoupon extends React.Component{
    constructor(props){
        super(props);
        this.state={
            showModal:false,
            couponList:[],
            num:-1,
        };
        this.open=(ids)=>{
            this.setState({showModal:true},()=>{
                this.getCoupon(ids);
            });
        };
        this.close=()=>{
            this.setState({
                showModal:false,
                couponList:[],
                num:-1,
            });
        };
    }

    getCoupon=(ids)=>{
        acoustic({
                agreement: "https",
                hostname: "duomeiti.taobao.com",
                path: "/video/component/getShopCouponListForDaren.do",
                data: {
                    item_ids: ids
                },
                method: "get",
                referer: "https://we.taobao.com/"
            }, 'requestRelyTB', (msg) => {
                let data=JSON.parse(msg);
                this.setState({couponList:data.couponList});
            }
        );
    };

    submit=()=>{
        let {num,couponList}=this.state;
        this.close();
        this.props.callback(couponList[num])
    };

    render(){
        let {showModal,couponList,num}=this.state;
        return(
            <Dialog title='选择优惠劵' size="small" visible={showModal}
                    onCancel={this.close} lockScroll={false}>
                <Dialog.Body>
                    <div>
                        <Select value={''} onChange={(t)=>{
                            this.setState({num:t});
                        }}>
                            {(couponList?couponList:[]).map((item,i)=>{
                                return(
                                    <Select.Option key={i} label={`${item.name} ${item.amount}元 满${item.threshold}元可用`} value={i}/>
                                )
                            })}
                        </Select>
                        {num!=-1&&<React.Fragment>
                            <span>{`使用有效期：${couponList[num].startTime}至${couponList[num].endTime}  |`}</span>
                            <span>{`|  发行量：${couponList[num].totalCount}张`}</span>
                        </React.Fragment>}
                    </div>
                </Dialog.Body>
                <Dialog.Footer className="dialog-footer">
                    <Button type="danger" onClick={this.close}>取消</Button>
                    <Button type="primary" onClick={this.submit} disabled={num==-1}>确定</Button>
                </Dialog.Footer>
            </Dialog>
        )
    }
}

export default Interaction;
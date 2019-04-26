/**
 * Created by 石英 on 2018/9/28 0028上午 11:32.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
//import  {Image} from 'react-bootstrap';
import {ThousandsOfCall} from "../../../../../lib/util/ThousandsOfCall";
import {BundleLoading} from '../../../../../../bundle';
import {Message, MessageBox, Layout, Dialog,Button,Tabs,Notification} from 'element-react';
import 'element-theme-default';
import UpItem from 'bundle-loader?lazy&name=pc/trends_asset/components/lib/sharing/upload/upItem/app-[name]!../../../../../lib/sharing/upload/UpItem';
import UpImages from 'bundle-loader?lazy&name=pc/trends_asset/components/lib/sharing/upload/upImages/app-[name]!../../../../../lib/sharing/upload/UpImages';
import {localImgSize} from "../../../../../lib/util/global";
import Cropper from 'bundle-loader?lazy&name=pc/trends_asset/components/lib/sharing/upload/cropper/app-[name]!../../../../../lib/sharing/upload/Cropper';
import '../../../../../../styles/content/addContentModule/dapModule.css';

class NewAddImageListModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogVisible:false,
            type:'',//搭配类型
            moreTemplates:[],//更多模板
            choiceTemplates:'',
            rawData:{//智能搭配
                noCrop: false,
                usePngFormat: false,
                type: "bg",
                layers:[{
                    backgroundColorHex: '# ',
                    index: 0,
                    resultHeight: 1200,
                    notOffsetX: false,
                    notOffsetY: false,
                    picWidthStable: false,
                    textSize: 24,
                    picUrl: 'https://img.alicdn.com/tfs/TB1O5D8lgMPMeJjy1XbXXcwxVXa-1500-1500.png',
                    resultWidth: 1200,
                    bgType: 2,
                    noCrop: false,
                    usePngFormat: false
                }],
            },
            selectData:{//选中数据
                index:0,isShow:false
            },
            templateValue:{},//模板数据
            disableButton:false,
        };
    }

    blankTemplate=()=>{
        MessageBox.confirm(`是否重置为空白模板？`, '提示', {
            type: 'info'
        }).then(() => {
            this.setState({
                rawData:{
                    noCrop: false,
                    usePngFormat: false,
                    type: "bg",
                    layers:[{
                        backgroundColorHex: '# ',
                        index: 0,
                        resultHeight: 1200,
                        notOffsetX: false,
                        notOffsetY: false,
                        picWidthStable: false,
                        textSize: 24,
                        picUrl: 'https://img.alicdn.com/tfs/TB1O5D8lgMPMeJjy1XbXXcwxVXa-1500-1500.png',
                        resultWidth: 1200,
                        bgType: 2,
                        noCrop: false,
                        usePngFormat: false
                    }],
                },
                selectData:{
                    index:0,isShow:false
                },
                choiceTemplates:''
            })
        }).catch(() => {
            Notification({
                title: '消息',
                message: '已取消重置',
                type: 'info'
            });
        });
    };

    open=(value) => {//模态框打开事件
        let {type=''}=this.props;
        if(value){
            let {templateValue,retainItem,choiceTemplates}=value;
            this.setState({dialogVisible:true,type:type,rawData:retainItem,templateValue,choiceTemplates},this.module);
        }else {
            this.setState({dialogVisible:true,type:type},this.module);
        }
    };

    close=() => {//模态框关闭事件
        this.setState({dialogVisible:false});
    };

    module=()=>{//更多模板
        let s = {
            jsv: "2.4.3",
            appKey: 12574478,
            t: new Date().getTime(),
            api: "mtop.taobao.luban.dapei.queryallindustry",
            v: "1.0",
            ecode: 1,
            type: "originaljson",
            dataType: "jsonp",
            timeout: 15000
        };
        ThousandsOfCall.acoustic({
            parameters: s,
            requesData: {},
            host: "https://h5api.m.taobao.com/h5",
            ajaxData: {requeryType: "post",referer: "https://we.taobao.com/mirror/mirror.html"}
        }, "requestH5", (msg) => {
            if(msg.success){
                let {result=[]}=msg.data;
                this.setState({moreTemplates:result})
            }else {
                Message({
                    type: 'warning',
                    message: '获取数据失败'
                });
            }
        })
    };

    scalingDown=(width,height)=>{//初始比例
        if(width>height){
            return{
                width:600,
                height:Math.round((height/width)*600)
            }
        }else {
            return{
                height:600,
                width:Math.round((width/height)*600)
            }
        }
    };

    showData=(number)=>{//展示数值
        return Math.round((number/1200)*500)
    };

    setData=(number)=>{//状态数值
        return Math.round((number/500)*1200)
    };

    addGood=()=>{//添加宝贝
        let goodCallback=(item)=>{
            localImgSize(item.coverUrl,(imgWidth, imgHeight)=>{
                let {rawData}=this.state;
                let {layers}=rawData;
                let {width, height}=this.scalingDown(imgWidth, imgHeight);
                let goodItem={
                    index: layers.length,
                    height: height,
                    width: width,
                    x: 300,
                    y: 300,
                    picUrl: item.coverUrl,
                    group: 0,
                    subIndex: 1,
                    collocationItemCount: "1",
                    notOffsetX: false,
                    notOffsetY: false,
                    picWidthStable: false,
                    anchorX: 50,
                    anchorY: 50,
                    textSize: 24,
                    fontStyle: 0,
                    spacing: 0,
                    dynamic: true,
                    rotate: 0,
                    algoType: "",
                    type: 8,
                    itemId: item.itemId,
                    temporaryItem:item
                };
                layers.push(goodItem);
                rawData.layers=layers;
                this.setState({rawData});
            });
        };
        this.setState({callback:goodCallback},()=>this.upItemBundleLoading())
    };

    addPicture=()=>{//添加图片
        let pictureCallback=(url, pa, img)=>{
            let {rawData}=this.state;
            let {layers}=rawData;
            let {width, height}=this.scalingDown(pa.w, pa.h);
            let picItem={
                index: layers.length,
                height: height,
                width: width,
                x: 300,
                y: 300,
                picUrl: url,
                group: 0,
                subIndex: 1,
                collocationItemCount: "1",
                notOffsetX: false,
                notOffsetY: false,
                picWidthStable: false,
                anchorX: 50,
                anchorY: 50,
                textSize: 24,
                fontStyle: 0,
                spacing: 0,
                dynamic: true,
                rotate: 0,
                algoType: "",
                type: 9
            };
            layers.push(picItem);
            rawData.layers=layers;
            this.setState({rawData});
        };
        this.setState({callback:pictureCallback},()=>this.upImagesBundleLoading())
    };

    selectChange=(index)=>{//选中改变
        let {selectData}=this.state;
        Object.assign(selectData,{index,isShow:true});
        this.setState({selectData});
    };

    clickTemplates=item=>{//打开额外模板
        this.templateCardModel.open(item);
    };

    templatesCallback=(value,name)=>{
        let v=JSON.parse(value.rawData);
        if(v.layers.length<2){
            this.setState({
                rawData:{
                    noCrop: false,
                    usePngFormat: false,
                    type: "bg",
                    layers:v.layers,
                },templateValue:Object.assign(value,{
                    rawData:v
                }),choiceTemplates:''
            })
        }else {
            this.setState({
                rawData:{
                    noCrop: false,
                    usePngFormat: false,
                    type: "outline",
                    layers:v.layers,
                },templateValue:Object.assign(value,{
                    rawData:v
                }),choiceTemplates:name
            })
        }
    };

    putTop=()=>{//置于顶部
        let {selectData,rawData}=this.state;
        let {index}=selectData,{layers}=rawData;
        let val=layers[index];
        $(`#index${index}`).css("border", "none");
        layers.splice(index,1);
        layers.push(val);
        layers.forEach((item,i)=>{
            if(!item.backgroundColorHex){
                layers[i].index=i;
            }
        });
        rawData.layers=layers;
        selectData.index=layers.length-1;
        $(`#index${layers.length-1}`).css("border", "1px solid #6af");
        this.setState({rawData,selectData});
    };

    putBottom=()=>{//置于底部
        let {selectData,rawData}=this.state;
        let {index}=selectData,{layers}=rawData;
        $(`#index${index}`).css("border", "none");
        layers.splice(1,0,layers[index]);
        layers.splice(index+1,1);
        layers.forEach((item,i)=>{
            if(!item.backgroundColorHex){
                layers[i].index=i;
            }
        });
        rawData.layers=layers;
        selectData.index=1;
        $(`#index1`).css("border", "1px solid #6af");
        this.setState({rawData,selectData});
    };

    cutPicture=()=>{
        let {selectData,rawData}=this.state;
        this.setState({callback:this.cutPictureCallback},()=>{
            let {picUrl}=rawData.layers[selectData.index];
            picUrl=picUrl.indexOf("http") >= 0?picUrl:`https:${picUrl}`;
            localImgSize(picUrl, (w, h) => {
                this.cropperBundleLoading(picUrl,{w:w,h:h},{});
                //this.croppers.open(picUrl,{w:w,h:h},{});
            });
        });
    };

    cutPictureCallback=(url, pa, img)=>{
        let {selectData,rawData}=this.state;
        let {h,w}=pa;
        let data=rawData.layers[selectData.index];
        if(data.outline){
            Object.assign(rawData.layers[selectData.index],{
                picUrl:url
            },this.lineJudge(data,{width:pa.w,height:pa.h}));
        }else {
            let {width,height}=this.scalingDown(w,h);
            Object.assign(rawData.layers[selectData.index],{
                picUrl:url,width,height
            });
        }
        this.setState({rawData});
    };

    cutOut=()=>{//智能抠图
        let {selectData,rawData}=this.state;
        let {picUrl}=rawData.layers[selectData.index];
        let s = {
            type: "jsonp",
            dataType: "jsonp",
            api: "mtop.taobao.luban.dapei.cutandcroppic",
            v: "1.0",
            appKey: 12574478,
            t: new Date().getTime(),
            jsv: "2.4.3",
            ecode: 1,
        };
        ThousandsOfCall.acoustic({
            parameters: s,
            requesData: {picUrl},
            host: "https://acs.m.taobao.com/h5",
            ajaxData: {requeryType: "get",referer: "https://h5.m.taobao.com/"}
        }, "requestH5", (msg)=> {
            let data=msg.data;
            if(data){
                rawData.layers[selectData.index].picUrl= data.result;
                this.setState({rawData});
            }else {
                Notification({
                    title: '消息',
                    message: '请检查选品插件是否为最新且淘宝登录状态是否中断！',
                    type: 'warning'
                });
            }
        });
    };

    editContent=()=>{
        let {selectData,rawData}=this.state;
        let value=rawData.layers[selectData.index];
        if(value.itemId){
            let callback=(item)=>{
                if(rawData.type==='bg'){
                    localImgSize(item.coverUrl,(imgWidth, imgHeight)=>{
                        let {width, height}=this.scalingDown(imgWidth, imgHeight);
                        let content={
                            index: value.index,
                            height: height,
                            width: width,
                            x: 300,
                            y: 300,
                            picUrl: item.coverUrl,
                            group: 0,
                            subIndex: 1,
                            collocationItemCount: "1",
                            notOffsetX: false,
                            notOffsetY: false,
                            picWidthStable: false,
                            anchorX: 50,
                            anchorY: 50,
                            textSize: 24,
                            fontStyle: 0,
                            spacing: 0,
                            dynamic: true,
                            rotate: 0,
                            algoType: "",
                            type: 8,
                            itemId: item.itemId,
                            temporaryItem:item
                        };
                        Object.assign(rawData.layers[selectData.index],content);
                        this.setState({rawData});
                    });
                }else if(rawData.type ==='outline'){
                    localImgSize(item.coverUrl, (width, height) => {
                        Object.assign(rawData.layers[selectData.index],{
                            picUrl: item.coverUrl,
                            itemId: item.itemId,
                            anchorX: 50,
                            anchorY: 50,
                            temporaryItem:item
                        },this.lineJudge(value,{width,height}));
                        this.setState({rawData})
                    });
                }
            };
            this.setState({callback:callback},()=>{
                value.temporaryItem.coverUrl=value.picUrl;
                this.upItemBundleLoading(value.temporaryItem);
                //this.upItem.open(value.temporaryItem);
            });
        }else {
            let callback=(url, pa, img)=>{
                let {width, height}=this.scalingDown(pa.w, pa.h);
                let content={
                    index: selectData.index,
                    height: height,
                    width: width,
                    x: 300,
                    y: 300,
                    picUrl: url,
                    group: 0,
                    subIndex: 1,
                    collocationItemCount: "1",
                    notOffsetX: false,
                    notOffsetY: false,
                    picWidthStable: false,
                    anchorX: 50,
                    anchorY: 50,
                    textSize: 24,
                    fontStyle: 0,
                    spacing: 0,
                    dynamic: true,
                    rotate: 0,
                    algoType: "",
                    type: 9
                };
                Object.assign(rawData.layers[selectData.index],content);
                this.setState({rawData});
            };
            this.setState({callback:callback},()=>this.upImagesBundleLoading())
        }
    };

    delContent=()=>{//删除内容
        let {selectData,rawData}=this.state;
        let {index}=selectData;
        $(`#index${index}`).css("border", "none");
        rawData.layers.splice(index,1);
        rawData.layers.forEach((item,i)=>{
            if(!item.backgroundColorHex){
                rawData.layers[i].index=i;
            }
        });
        this.setState({rawData,selectData:{index:0, isShow:false}});
    };

    openUpItem=({collocationItemKind,index})=>{
        let callback=(item)=>{
            let {rawData}=this.state;
            let itemJudge=rawData.layers[index];
            localImgSize(item.coverUrl, (width, height) => {
                Object.assign(rawData.layers[index],{
                    picUrl: item.coverUrl,
                    itemId: item.itemId,
                    anchorX: 50,
                    anchorY: 50,
                    temporaryItem:item
                },this.lineJudge(itemJudge,{width,height}));
                this.setState({rawData})
            });
        };
        this.setState({collocationItemKind,callback},()=>{
            this.upItemBundleLoading();
            //this.upItem.open();
        });
    };

    lineJudge=(itemJudge,{width,height})=>{//位置
        let outline=itemJudge.outline,obj={};
        if(outline.height&&outline.width){
            if(width/height>outline.width/outline.height){
                Object.assign(obj,{
                    height:outline.width*height/width,
                    width:outline.width,
                    x:outline.x,
                    y:outline.y+(outline.height-outline.width*height/width)/2
                });
            }else {
                Object.assign(obj,{
                    height:outline.height,
                    width:outline.height*width/height,
                    y:outline.y,
                    x:outline.x+(outline.width-outline.height*width/height)/2
                });
            }
        }
        return obj;
    };

    deepCopy =(data)=> {
        return JSON.parse(JSON.stringify(data));
    };

    pushItem=()=>{
        let {rawData,templateValue,choiceTemplates}=this.state,{activityId}=this.props;
        let itemNum=0,newRawData=this.deepCopy(rawData);
        newRawData.layers.forEach((item,index,array)=>{
            if(item.itemId){
                delete newRawData.layers[index].temporaryItem;
                itemNum+=1;
            }
        });
        if(itemNum>1){
            Notification({
                title: '消息',
                message: '图片生成有延迟，请稍等！',
                type: 'success'
            });
            let dataIt={};
            if(!choiceTemplates){
                Object.assign(dataIt,{
                    rawData:JSON.stringify(newRawData),
                    channelId: +activityId,
                    channelType: "1",
                    refRawdataId: 0,
                    refDapeiId: 0,
                    contentId: "1",
                    activityId: +activityId,
                })
            }else {
                Object.assign(dataIt,{
                    rawData:JSON.stringify(newRawData),
                    channelId: +activityId,
                    channelType: "1",
                    refRawdataId: templateValue.id,
                    refDapeiId: 0,
                    contentId: "1",
                    activityId: +activityId,
                    actionLog: "[]",
                    preDapeiId: 0
                })
            }
            let s = {
                api: "mtop.taobao.luban.dapei.savedapei",
                type: "originaljson",
                dataType: "jsonp",
                v: "5.0",
                appKey: 12574478,
                t: new Date().getTime(),
                jsv: "2.4.3",
                ecode: 1,
                timeout: 15000
            };
            ThousandsOfCall.acoustic({
                parameters: s,
                requesData: dataIt,
                host: "https://h5api.m.taobao.com/h5",
                ajaxData: {requeryType: "post",referer: "https://h5.m.taobao.com"}
            }, "requestH5", (msg)=> {
                let data=msg.data;
                if(data){
                    this.getItem(data,dataIt);
                }else {
                    Notification({
                        title: '消息',
                        message: '图片生成失败，请登录淘宝账号！',
                        type: 'error'
                    });
                }
            });
        }else {
            Notification({
                title: '消息',
                message: '至少两个商品!',
                type: 'error'
            });
        }
    };

    getItem=(data,submission,num=0)=>{
        let s = {
            jsv: "2.4.3",
            appKey: 12574478,
            t: new Date().getTime(),
            api: "mtop.taobao.luban.dapei.querydapei",
            v: "2.0",
            ecode: 1,
            type: "originaljson",
            dataType: "jsonp",
            timeout: 3000
        };
        ThousandsOfCall.acoustic({
            parameters: s,
            requesData: {dapeiId:data.result},
            host: "https://h5api.m.taobao.com/h5",
            ajaxData: {requeryType: "post",referer: "https://we.taobao.com/mirror/mirror.html"}
        }, "requestH5", (msg) => {
            if(msg.success){
                let {rawData,area,size,url}=msg.data;
                let pushItem={},anchors=[];
                let {layers}=JSON.parse(rawData);
                for (let i in layers){
                    if(layers[i].type==8){
                        let obj={
                            data:{
                                finalPricePc: 0,
                                finalPriceWap: 0,
                                itemId: layers[i].itemId,
                                materialId: this.matching({rawData:this.state.rawData,itemId:layers[i].itemId}),
                                price: 0,
                                coverUrl: layers[i].picUrl,
                            },
                            type:"item",
                            x: Math.round(((((layers[i].anchorX/100)*layers[i].width)+layers[i].x)/1200)*100),
                            y: Math.round(((((layers[i].anchorY/100)*layers[i].height)+layers[i].y)/1200)*100),
                        };
                        anchors.push(obj);
                    }
                }
                let object={
                    images:[],
                    dapeiParams:{area,bannerSize:size},
                    dapeiId:data.result
                };
                Object.assign(pushItem,{
                    features:JSON.stringify(object),url,hotSpaces:[],anchors
                });
                this.props.callback({pushItem,retainItem:this.state.rawData,choiceTemplates:this.state.choiceTemplates,templateValue:this.state.templateValue,submission});
                this.close();
            }else {
                if(num<9){
                    setTimeout(()=>{
                        this.getItem(data,submission,++num);
                    },500);
                }else {
                    Notification({
                        title: '消息',
                        message: '多次获取失败！请稍后重试',
                        type: 'error'
                    });
                }
            }
        });
    };

    matching=({rawData,itemId})=>{
        let materialId='';
        rawData.layers.forEach((item,index,array)=>{
            if(item.itemId===itemId){
                materialId=item.temporaryItem.materialId;
            }
        });
        return materialId;
    };
    upItemBundleLoading=(data)=>{//添加商品热加载
        if (this.state.upItemFlag && this.upItem) {
            this.upItem.jd.open(data);
        } else {
            this.setState({upItemFlag: true}, () => {
                let upload = setInterval(() => {
                    let upItem = this.upItem;
                    if (upItem && upItem.jd) {
                        clearInterval(upload);
                        this.upItem.jd.open(data);
                    }
                }, 100);
            });
        }
    };
    upImagesBundleLoading=()=>{//添加图片热加载
        if (this.state.upImagesFlag && this.upImages) {
            this.upImages.jd.open();
        } else {
            this.setState({upImagesFlag: true}, () => {
                let upload = setInterval(() => {
                    let upImages = this.upImages;
                    if (upImages && upImages.jd) {
                        clearInterval(upload);
                        this.upImages.jd.open();
                    }
                }, 100);
            });
        }
    };
    cropperBundleLoading=(url,wh,data)=>{//裁图片热加载
        if (this.state.cropperFlag && this.croppers) {
            this.croppers.jd.open(url,wh,data);
        } else {
            this.setState({cropperFlag: true}, () => {
                let upload = setInterval(() => {
                    let croppers = this.croppers;
                    if (croppers && croppers.jd) {
                        clearInterval(upload);
                        this.croppers.jd.open(url,wh,data);
                    }
                }, 100);
            });
        }
    };
    render() {
        let {dialogVisible,moreTemplates,rawData,callback,choiceTemplates,collocationItemKind,selectData,disableButton}=this.state;
        let {activityId}=this.props;
        return (
            <div className='imageList'>
                <Dialog title='搭配编辑器' size="small" visible={dialogVisible}
                        onCancel={() =>this.setState({dialogVisible: false})}
                        lockScroll={false} closeOnClickModal={false}>
                    <Dialog.Body>
                        <Layout.Row gutter="10">
                            <Layout.Col span='6'>
                                <div style={{
                                    height: '48px',
                                    backgroundColor: 'rgb(239, 246, 255)',
                                    color: 'rgb(102, 170, 255)',
                                    display: 'flex',
                                    borderLeft: '4px solid rgb(102, 170, 255)',
                                    cursor: 'pointer',
                                    alignItems: 'center',
                                    paddingLeft: '24px',
                                }}>
                                    △创建搭配从这里开始
                                </div>
                                <div style={{paddingBottom: '20px'}}>
                                    <div style={{
                                        width: '161px',
                                        height: '161px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        margin: '20px auto 0px',
                                        cursor: 'pointer',
                                    }} className='template-card-empty template-card' onClick={this.blankTemplate}>
                                        +空白模板
                                    </div>
                                    {moreTemplates.map(item=>{
                                        return(
                                            <div key={item.appkey} style={{
                                                width: '161px',
                                                height: '161px',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                margin: '20px auto 0px',
                                                cursor: 'pointer',
                                                backgroundColor: 'rgb(244, 244, 244)',
                                                border: '1px solid rgba(151, 151, 151, 0.2)',
                                                backgroundImage: `url(${item.facePic})`,
                                                backgroundSize: '161px 161px',
                                            }} className='template-card template-card-border' onClick={()=>this.clickTemplates(item)}>
                                                <Button type='info'>{`+${item.name}`}</Button>
                                            </div>
                                        )
                                    })}
                                </div>
                            </Layout.Col>
                            <Layout.Col span='18'>
                                <div style={{textAlign:'center'}}>
                                    <Button.Group>
                                        <Button type="primary" icon='plus' disabled={rawData.type==='outline'} onClick={this.addGood}>宝贝</Button>
                                        <Button type="primary" icon='plus' disabled={rawData.type==='outline'} onClick={this.addPicture}>图片</Button>
                                        <Button type="info" onClick={this.putTop} disabled={disableButton||!selectData.isShow||selectData.index===(rawData.layers.length-1)}>置于顶层</Button>
                                        <Button type="info" onClick={this.putBottom} disabled={disableButton||!selectData.isShow||selectData.index===1}>置于底层</Button>
                                        <Button type="success" onClick={this.cutPicture} disabled={!selectData.isShow}>剪裁图片</Button>
                                        <Button type="success" disabled={!selectData.isShow} onClick={this.cutOut}>智能抠图</Button>
                                        <Button type="info" icon="edit" disabled={!selectData.isShow} onClick={this.editContent}>编</Button>
                                        <Button type="danger" icon="delete" disabled={disableButton||!selectData.isShow} onClick={this.delContent}>删</Button>
                                    </Button.Group>
                                </div>
                                <div style={{margin:"60px 0"}}>
                                    <CollocationContainer rawData={rawData} showData={this.showData} selectChange={this.selectChange}
                                                          selectData={selectData} cancelSelect={value=>this.setState({selectData:value})}
                                                          changeRawData={(rawData)=>this.setState({rawData})} setData={this.setData}
                                                          openUpItem={this.openUpItem} disableButton={disableButton=>this.setState(disableButton)}/>
                                </div>
                            </Layout.Col>
                        </Layout.Row>
                        <Layout.Row gutter="2">
                            <Layout.Col span='12'>
                                <Button type="danger" onClick={this.close} style={{width:'100%'}}>取消</Button>
                            </Layout.Col>
                            <Layout.Col span='12'>
                                <Button type="info" onClick={this.pushItem} style={{width:'100%'}}>确定</Button>
                            </Layout.Col>
                        </Layout.Row>
                    </Dialog.Body>
                </Dialog>
                {this.state.upItemFlag&&<BundleLoading load={UpItem} ref={e=>this.upItem=e} categoryListApiQuery={{poolId:''}} activityId={activityId}
                        callback={callback} matchingChannel={choiceTemplates} collocationItemKind={collocationItemKind}/>}
                {this.state.upImagesFlag&&<BundleLoading load={UpImages} ref={e=>this.upImages=e} callback={callback}/>}
                {this.state.cropperFlag&&<BundleLoading load={Cropper} ref={e=>this.croppers=e} callbacks={this.state.callback}/>}
                <TemplateCardModel ref={e=>this.templateCardModel=e} callback={this.templatesCallback}/>
            </div>
        );
    }
}

class TemplateCardModel extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            dialogVisible: false,
            propsItem:{},
            activeName:'0',
            data:undefined,
        };
        this.open=(item)=>{
            this.setState({propsItem:item,dialogVisible:true},()=>{
                this.getTemplateCard()
            })
        };
        this.close=()=>{
            this.setState({dialogVisible:false,activeName:'0'})
        };
    }

    getTemplateCard=(callback)=>{
        let {propsItem,activeName}=this.state,d={};
        Object.assign(d,{
            "industry":propsItem.appkey,"labelId":activeName,"pageSize":100,"pageNo":1
        });
        let s={
            jsv: '2.4.3',
            appKey: 12574478,
            t: new Date().getTime(),
            api: 'mtop.taobao.luban.dapei.templatelist',
            v: '1.0',
            ecode: 1,
            dataType: 'jsonp',
            type: "originaljson",
        };
        ThousandsOfCall.acoustic({
            parameters: s,
            requesData: d,
            host: "https://h5api.m.taobao.com/h5",
            ajaxData: {requeryType: "get", referer: "https://h5.m.taobao.com"}
        }, "requestH5", (msg) => {
            let {success,data}=msg;
            if(success){
                this.setState({data},()=>{
                    if(callback &&typeof callback=='function'){
                        callback()
                    }
                })
            }
        });
    };

    componentDidUpdate(){
        let {data,activeName}=this.state;
        if(data) {
            let templateInfoList = data.templateList.templateInfoList;
            templateInfoList.forEach(item=>{
                $(`.active${activeName}-list${item.id}`).hover(()=>{
                    $(`.active${activeName}-list${item.id} img`).css({"border":"1px solid #6af",'cursor':'pointer'}).attr("src",item.hoverPreviewPic);
                },()=>{
                    $(`.active${activeName}-list${item.id} img`).css("border","none").attr("src",item.defaultPreviewPic);
                });
            })
        }
    }

    selectPresent = (tab) => {//切换
        let value=tab.props.name;
        this.setState({activeName:value},this.getTemplateCard);
    };

    submit=({id})=>{
        let d={"templateId":id},s={
            jsv: '2.4.3',
            appKey: 12574478,
            t: new Date().getTime(),
            api: 'mtop.taobao.luban.dapei.templateinfo',
            v: '1.0',
            ecode: 1,
            dataType: 'jsonp',
            type: "originaljson",
        };
        ThousandsOfCall.acoustic({
            parameters: s,
            requesData: d,
            host: "https://h5api.m.taobao.com/h5",
            ajaxData: {requeryType: "get", referer: "https://h5.m.taobao.com"}
        }, "requestH5", (data) => {
            if(data.success){
                this.setState({dialogVisible:false,activeName:'0'},()=>{
                    this.props.callback(data.data,this.state.propsItem.name);
                });
            }
        });
    };

    render(){
        let {dialogVisible,propsItem,activeName,data}=this.state;
        return(
            <Dialog title={propsItem.name||''} size="small" visible={dialogVisible}
                    onCancel={() =>this.close()}
                    lockScroll={false} closeOnClickModal={false}>
                <Dialog.Body>
                    <Tabs activeName={activeName} onTabClick={this.selectPresent} type="card">
                        <Tabs.Pane label="全部" name='0'>
                            <Layout.Row gutter="10">
                                {data&&data.templateList.templateInfoList.map(item=>{
                                    return(
                                        <Layout.Col span='6' key={item.id}>
                                            <div style={{margin:"6px"}} className={"active"+activeName+"-list"+item.id}>
                                                <img src={item.defaultPreviewPic} onClick={()=>this.submit({id:item.id})}/>
                                            </div>
                                        </Layout.Col>
                                    )
                                })}
                            </Layout.Row>
                        </Tabs.Pane>
                        {data&&data.labels.map(lab=>{
                            return(
                                <Tabs.Pane label={lab.name} name={lab.id} key={lab.id}>
                                    <Layout.Row gutter="10">
                                        {data.templateList.templateInfoList.map(item=>{
                                            return(
                                                <Layout.Col span='6' key={item.id}>
                                                    <div style={{margin:"6px"}} className={"active"+lab.id+"-list"+item.id}>
                                                        <img src={item.defaultPreviewPic} onClick={()=>this.submit({id:item.id})}/>
                                                    </div>
                                                </Layout.Col>
                                            )
                                        })}
                                    </Layout.Row>
                                </Tabs.Pane>
                            )
                        })}
                    </Tabs>
                </Dialog.Body>
            </Dialog>
        )
    }
}

class CollocationContainer extends React.Component{

    componentDidUpdate() {
        let {rawData}=this.props;
        if(rawData.type==='bg'){
            $(ReactDOM.findDOMNode(this)).find(".anchorsNum").resizable({containment: $(".anchorsTotal"),aspectRatio:true}).unbind("resizestop").on("resizestop", (event, ui) => {
                let {rawData,setData,changeRawData}=this.props;
                let {layers}=rawData;
                let i = $(event.target).data("i");
                let w = ui.size.width;
                let h = ui.size.height;
                layers[i].width = setData(w);
                layers[i].height = setData(h);
                rawData.layers=layers;
                changeRawData(rawData);
            });
            $(ReactDOM.findDOMNode(this)).find(".anchor-position").draggable({containment: "parent"}).unbind("dragstop").on("dragstop", (event, ui) => {
                event.stopPropagation();
                let {rawData,changeRawData}=this.props;
                let {layers}=rawData;
                let i = $(event.target).data("i");
                let x = ui.position.left;
                let y = ui.position.top;
                layers[i].anchorX = Math.round((x * 100) / ((layers[i].width/1200)*500));
                layers[i].anchorY = Math.round((y * 100) / ((layers[i].height/1200)*500));
                rawData.layers=layers;
                changeRawData(rawData);
            });
            $(ReactDOM.findDOMNode(this)).find(".anchorsNum").draggable({containment: $(".anchorsTotal")}).unbind("dragstop").on("dragstop", (event, ui) => {
                let {rawData,setData,changeRawData}=this.props;
                let {layers}=rawData;
                let i = $(event.target).data("i");
                let {left,top} = ui.position;
                layers[i].x = setData(left);
                layers[i].y = setData(top);
                rawData.layers=layers;
                changeRawData(rawData);
            });
        }else if(rawData.type==='outline'){//分割线
            $(ReactDOM.findDOMNode(this)).find(".anchor-positioner").draggable({containment: "parent"}).unbind("dragstop").on("dragstop", (event, ui) => {
                event.stopPropagation();
                let index = $(event.target).data("i");
                let {rawData,changeRawData}=this.props;
                let {width,height}=rawData.layers[index];
                let x = ui.position.left,y = ui.position.top;
                rawData.layers[index].anchorX = Math.round((x * 100) / (width/1200*500));
                rawData.layers[index].anchorY = Math.round((y * 100) / (height/1200*500));
                changeRawData(rawData);
            });
            if($('.anchorsNum').length>0){
                $(ReactDOM.findDOMNode(this)).find(".anchorsNum").draggable({containment: 'parent'}).unbind("dragstop").on("dragstop", (event, ui) => {
                    let i = $(event.target).data("i");
                    let {rawData,changeRawData}=this.props;
                    let x = ui.position.left;
                    let y = ui.position.top;
                    rawData.layers[i].x = rawData.layers[i].outline.x+x*1200/500;
                    rawData.layers[i].y = rawData.layers[i].outline.y+y*1200/500;
                    changeRawData(rawData);
                });
            }
            if($('.anchorsNum').length>0){
                $(ReactDOM.findDOMNode(this)).find(".anchorsNum").resizable({containment: 'parent',aspectRatio:true}).unbind("resizestop").on("resizestop", (event, ui) => {
                    let i = $(event.target).data("i");
                    let {rawData,changeRawData}=this.props;
                    let w = ui.size.width;
                    let h = ui.size.height;
                    rawData.layers[i].width = (w*1200/500);
                    rawData.layers[i].height = (h*1200/500);
                    changeRawData(rawData);
                });
            }
        }
    }

    select=(index,callback)=>{
        let {selectData,selectChange}=this.props;
        $(`#index${selectData.index}`).css("border", "none");
        $(`#index${index}`).css("border", "1px solid #6af");
        selectChange(index);
        if(callback&&typeof callback=='function'){
            callback();
        }
    };

    cancelSelect=()=>{
        let {selectData,cancelSelect}=this.props;
        $(`#index${selectData.index}`).css("border", "none");
        cancelSelect({index:0, isShow:false});
    };

    render(){
        let {rawData,showData,selectData,openUpItem}=this.props;
        if(rawData.type==='bg'){
            return(
                <div style={{position: "relative",width:"502px",height:"502px",margin:"0 auto",border:"1px solid rgba(0, 0, 0, 0.36)"}}>
                    <div style={{
                        zIndex:99,
                        left: 0,
                        top: "249px",
                        width: "500px",
                        height: "2px",
                        position: "absolute",
                        background: "url(https://gw.alicdn.com/tfs/TB1Aardk4TI8KJjSspiXXbM4FXa-1000-4.png) center center/500px 2px no-repeat"
                    }}>
                    </div>
                    <div style={{
                        zIndex:99,
                        left: "249px",
                        top: 0,
                        width: "2px",
                        height: "500px",
                        position: "absolute",
                        background: "url(https://gw.alicdn.com/tfs/TB1eY_0k3vD8KJjy0FlXXagBFXa-4-1000.png) center top/2px 500px no-repeat"
                    }}>

                    </div>
                    <div style={{position: "absolute",width:"500px",height:"500px",margin:"0 auto"}} onClick={this.cancelSelect} className="anchorsTotal">
                        {rawData.layers.map((item,ind)=>{
                            let {picUrl,index}=item;
                            if(item.backgroundColorHex){
                                return(
                                    <div style={{
                                        zIndex:index,
                                        left: 0,
                                        top: 0,
                                        width: "500px",
                                        height: "500px",
                                        position: "absolute",
                                        background: `url(${picUrl}) center center/500px 500px no-repeat`
                                    }} key={index}>

                                    </div>
                                )
                            }else {
                                let isSelect=(long,index,type)=>{
                                    if(selectData.isShow&&selectData.index===index){
                                        if(type==='top'||type==='left'){
                                            return --long;
                                        }else {
                                            return long+2;
                                        }
                                    }else {
                                        return long;
                                    }
                                };
                                return(
                                    <div key={index} id={`index${ind}`} style={{
                                        position: "absolute",
                                        top: `${isSelect(showData(item.y),ind,'top')}px`,
                                        left: `${isSelect(showData(item.x),ind,'left')}px`,
                                        width:`${isSelect(showData(item.width),ind,'width')}px`,
                                        height:`${isSelect(showData(item.height),ind,'height')}px`,
                                        zIndex: index*2,
                                        cursor: "move",
                                    }} className="anchorsNum" data-i={ind}>
                                        <img src={picUrl} style={{width:"100%"}} data-i={ind} onClick={(env)=>{
                                            env.stopPropagation();
                                            this.select(ind)
                                        }}/>
                                        {item.itemId&&
                                        <div title="调整商品锚点位置" className="anchor-position anchor-positioner"
                                            style={{top:`${Math.round(showData(item.height)*item.anchorY/100)}px`,zIndex: index*2+1,
                                                left:`${Math.round(showData(item.width)*item.anchorX/100)}px`}} data-i={ind}>

                                        </div>}
                                    </div>
                                )
                            }
                        })}
                    </div>
                </div>
            )
        }else if(rawData.type==='outline'){
            return(
                <div style={{position: "relative",width:"502px",height:"502px",margin:"0 auto",border:"1px solid rgba(0, 0, 0, 0.28)"}} onClick={this.cancelSelect}>
                    {rawData.layers.map((item,ind)=>{
                        let {picUrl,index}=item;
                        if(item.backgroundColorHex){
                            return(
                                <div style={{
                                    zIndex:index,
                                    left: 0,
                                    top: 0,
                                    width: "500px",
                                    height: "500px",
                                    position: "absolute",
                                    backgroundColor:item.backgroundColorHex,
                                    background: `url(${picUrl}) center center/500px 500px no-repeat`
                                }} key={index}>

                                </div>
                            )
                        }else if(item.type===3){
                            return(
                                <div key={index}>

                                </div>
                            )
                            /*return(
                                <div style={{
                                    zIndex:index*2,
                                    left: `${item.x}px`,
                                    top: `${item.y}px`,
                                    width: `${showData(item.width)}px`,
                                    height: `${showData(item.height)}px`,
                                    position: "absolute",
                                }} key={index}>
                                    <img src={picUrl} style={{width:"100%"}}/>
                                </div>
                            )*/
                        }else if(item.type===8){
                            let style={
                                top: `${showData(item.outline.y)}px`,
                                left: `${showData(item.outline.x)}px`,
                                width:`${showData(item.outline.width)}px`,
                                height:`${showData(item.outline.height)}px`,
                                position: "absolute",
                                zIndex: index*2,
                                cursor: "move",
                            };
                            if(!item.itemId){
                                Object.assign(style,{
                                    border:"1px dashed #666",
                                    backgroundImage: 'url("https://img.alicdn.com/imgextra/i2/1765153321/TB2FpGzkWAoBKNjSZSyXXaHAVXa_!!1765153321-1-daren.gif_150x150q90.jpg")'
                                })
                            }
                            let isSelect=(long,index,type)=>{
                                if(selectData.isShow&&selectData.index===index){
                                    if(type==='top'||type==='left'){
                                        return --long;
                                    }else {
                                        return long+2;
                                    }
                                }else {
                                    return long;
                                }
                            };
                            return(
                                <div key={index} style={style} className={'anchorsTotal'+ind}>
                                    {item.itemId? <div style={{
                                        top: `${isSelect(showData(item.y-item.outline.y),ind,'top')}px`,
                                        left: `${isSelect(showData(item.x-item.outline.x),ind,'left')}px`,
                                        width:`${isSelect(showData(item.width),ind,'width')}px`,
                                        height:`${isSelect(showData(item.height),ind,'height')}px`,
                                        position: "absolute",
                                    }} className='anchorsNum' data-i={ind} id={`index${ind}`}>
                                            <img src={item.picUrl} data-i={ind} style={{width:'100%'}} onClick={(env)=>{
                                                env.stopPropagation();
                                                this.select(ind,()=>{
                                                    this.props.disableButton({disableButton:true,collocationItemKind:item.collocationItemKind})
                                                })
                                            }}/>
                                            <div title="调整商品锚点位置" className="anchor-positioner" style={{
                                                top:`${item.anchorY}%`,
                                                left:`${item.anchorX}%`,
                                                zIndex:index*2+1
                                            }} data-i={ind}>

                                            </div>
                                    </div>:
                                        <div style={{
                                            textAlign:"center",
                                            lineHeight: `${showData(item.height)}px`,
                                            cursor:"pointer"
                                        }} data-kind={item.collocationItemKind} data-i={ind} onClick={()=>{
                                            openUpItem({collocationItemKind:item.collocationItemKind,index:ind})
                                        }} className='template-layers'>
                                            {"+"+item.text}
                                        </div>}
                                </div>
                            )
                        }
                    })}
                </div>
            )
        }
    }
}

function ImgListMain(props) {
    return <div className="imgListCoverPa">
        {/*<Image width={"100%"} data-i={props.data_i} rounded className="imgListCover"
               src={props.url}
               onClick={props.addAnchors}/>*/}
        <img width={"100%"}  src={props.url} onClick={props.addAnchors}/>
        {props.anchors.map( (item, i)=> {
            return (<div className="anchorsDian" key={i} data-i={i} onClick={props.selectDian}
                         style={{top: item.y + "%", left: item.x + "%"}}>
                <div className="anchorsDianTitle" data-i={i}>
                    <p data-i={i}><a target="_blank" href={item.data.url}> {item.data.title||item.data.rawTitle}</a></p>
                </div>
            </div>);
        })}
    </div>
}

function NewImgListMain(props) {
    let get_Data=(id,array=[])=>{
        let object={};
        array.forEach((item,index,array)=>{
            if(item.itemId==id){
                object=item.temporaryItem;
            }
        });
        return object;
    };
    return(
        <div className="imgListCoverPa">
            {/*<Image width={"100%"} rounded className="imgListCover" src={props.url}
                   onClick={props.addAnchors}/>*/}
            <img width={"100%"}  src={props.url} onClick={props.addAnchors}/>
            {props.anchors.map((item, i)=> {
                let {detailUrl,title,resourceUrl}=get_Data(item.data.itemId,props.layers);
                return (<div className="anchorsDian" key={i} data-i={i} onClick={props.selectDian}
                             style={{top: item.y + "%", left: item.x + "%"}}>
                    <div className="anchorsDianTitle" data-i={i}>
                        <p data-i={i}><a target="_blank" href={detailUrl?detailUrl:resourceUrl}>{title}</a></p>
                    </div>
                </div>);
            })}
        </div>
    )
}

export {NewAddImageListModal, ImgListMain,NewImgListMain};
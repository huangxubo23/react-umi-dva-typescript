/**
 * Created by shiying on 17-9-28.
 */
import React from 'react';
import {BundleLoading} from '../../../../../../bundle';
import {Dialog,Layout,Notification} from 'element-react';
import * as ele from 'element-react';
import 'element-theme-default';
import $ from 'jquery';
import HintShow from './../Hint';
import {ThousandsOfCall} from '../../../../../../components/lib/util/ThousandsOfCall';
import UpItem from 'bundle-loader?lazy&name=pc/trends_asset/components/lib/sharing/upload/upItem/app-[name]!../../../../../../components/lib/sharing/upload/UpItem';
import UpImages from 'bundle-loader?lazy&name=pc/trends_asset/components/lib/sharing/upload/upImages/app-[name]!../../../../../../components/lib/sharing/upload/UpImages';
import UpSPUItem from "bundle-loader?lazy&name=pc/trends_asset/components/lib/sharing/upload/upSPUItem/app-[name]!../../../../../../components/lib/sharing/upload/UpSPUItem";
import SoBrand from 'bundle-loader?lazy&name=pc/trends_asset/admin/content/soBrand/app-[name]!../SoBrand';
import {clone} from '../../../../../../components/lib/util/global'
import StringModule from './StringModule'
import ArrarModule from './ArrarModule'
import {currencyNoty} from '../../../../../../components/lib/util/Noty'
import {ajax} from '../../../../../../components/lib/util/ajax';

const Ajax = ajax.ajax;
class NewPanel extends React.Component{
    render(){
        let {header}=this.props;
        return(
            <div style={{
                marginTop: "10px",
                marginBottom: '12px',
                backgroundColor: '#fff',
                border: '1px solid transparent',
                borderRadius: '4px',
                boxShadow: '0 1px 1px rgba(0, 0, 0, .05)',
                borderColor: '#ddd'
            }}>
                <div style={{
                    padding: '1px 10px',
                    borderBottom: '1px solid transparent',
                    borderTopLeftRadius: '3px',
                    borderTopRightRadius: '3px',
                    color: '#333',
                    backgroundColor: '#f5f5f5',
                    borderColor: '#ddd',
                }}>
                    <h5>{header}</h5>
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

class EditModule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            data: {},
            addSubmit: true,
            item: {},
            hint: [],
            titleSelect: true,
        };
        this.open = this._open.bind(this);
        this.close = this._close.bind(this);
        this.textChangeAdd = this._textChangeAdd.bind(this);
    }

    _open(it, p) {
        if (p) {
            let t = clone(it);
            this.setState({showModal: true, item: this.temporary(t), data: t.data})
        } else {
            this.setState({showModal: true, addSubmit: p, data: {text: ""}})
        }
    }

    temporary=(t)=>{//临时使用，过后删除
        let defaultValue = {
            dataSchema: {
                title: "宝贝亮点",
                properties: {
                    features: {
                        title: "亮点描述（用于第一段展示）",
                        items: {
                            title: "宝贝亮点文案",
                            maxLength: 20,
                            minLength: 12,
                            type: "string",
                            "ui:placeholder": "请在这里输入12-20字的宝贝长亮点"
                        },
                        titleName: "亮点描述（用于第一段展示）",
                        minItems: 2,
                        type: "array",
                        maxItems: 3
                    }
                },
                type: "object",
                brandTitle: false
            }
        };
        if(t.name==='item-feature'){
            if(!(t.moduleInfo.dataSchema.properties.features&&t.moduleInfo.dataSchema.properties.features.items)){
                Object.assign(t.moduleInfo,defaultValue);
            }
        }
        return t;
    };

    _close() {
        this.setState({
            showModal: false,
            data: {},
            addSubmit: true,
            item: {},
            hint: [],
        })
    }

    _textChangeAdd(value) {//添加文本
        let {data} = this.state;
        data.text = value;
        this.setState({data});
    }

    textChangeEdit = ({value}) => {//text编辑改变
        let {data,item} = this.state;
        data.text = value;
        item.data = data;
        this.setState({data, item});
    };

    newChange=({value,type})=>{//新改变
        let {item,hint} = this.state;
        item.data[type] = value;
        let hints = EditModule.hint(value, item.moduleInfo.dataSchema.properties, type),obj = {};
        hint.forEach((item,index)=>{
            if(hints[0].type === item.type){
                Object.assign(obj,{hintNum:index,isHint:true})
            }
        });
        if (obj.isHint) {
            hint.splice(obj.hintNum,1,...hints)
        } else {
            hint.push(...hints);
        }
        this.setState({item,hint});
    };

    static hint = (data, props, type) => {
        data = data ? data : "";
        let titleHint = undefined;
        let meet = true;
        let minTitle = props[type].minLength;
        let maxTitle = props[type].maxLength;
        if (minTitle && minTitle > data.length) {
            meet = false;
            titleHint = "不能少于" + minTitle + "个字";
        } else if (maxTitle && maxTitle < data.length) {
            meet = false;
            titleHint = "不能大于" + maxTitle + "个字";
        }
        return [{
            meet: meet,
            value: data.length,
            title: props[type].title,
            text: titleHint,
            type: type,
        }];
    };
    featureChange = ({type,i,value}) => {//宝贝亮点改变及约束提示
        let {item,hint} = this.state;
        item.data[type].splice(i, 1, value);
        let newHint = EditModule.hintArr(value, item.moduleInfo.dataSchema.properties, i),hintNum = false,num=undefined;
        for (let h in hint) {
            if (hint && newHint[0].num == hint[h].num) {
                num=h;
                hintNum = true;
                break;
            }
        }
        if (hintNum) {
            hint[num] = newHint[0];
        } else {
            hint.push(newHint[0]);
        }
        this.setState({hint,item});
    };

    static publicHint=({data='', props, i,type,it})=>{
        let titleHint = undefined,meet = true;
        let minTitle =props[type].items.properties[it].minLength;
        let maxTitle = props[type].items.properties[it].maxLength;
        if (minTitle && minTitle > data[it].length) {
            meet = false;
            titleHint = "不能少于" + minTitle + "个字";
        } else if (maxTitle && maxTitle < data[it].length) {
            meet = false;
            titleHint = "不能大于" + maxTitle + "个字";
        }
        return [{
            meet: meet,
            value:data[it].length,
            title:props[type].title,
            text: titleHint,
            num: i,
        }];
    };

    newScoreChange=({value,index,type,it})=>{
        let {item,hint} = this.state;
        let value_d = item.data[type][index];
        value_d[it] = value;
        item.data[type].splice(index, 1, value_d);
        let newHint = EditModule.publicHint({data:value_d, props:item.moduleInfo.dataSchema.properties, i:index,type,it:type=='scores'?'item_title':'rateTitle'}),hintNum = false,num=undefined;
        for (let h in hint) {
            if (hint && newHint[0].num == hint[h].num) {
                num=h;
                hintNum = true;
                break;
            }
        }
        if (hintNum) {
            hint[num] = newHint[0];
        } else {
            hint.push(newHint[0]);
        }
        this.setState({hint,item});
    };

    static hintArr = (data, props, i) => {
        data = data ? data : "";
        let titleHint = undefined;
        let meet = true;
        let minTitle = props.features.items.minLength;
        let maxTitle = props.features.items.maxLength;
        if (minTitle && minTitle > data.length) {
            meet = false;
            titleHint = "不能少于" + minTitle + "个字";
        } else if (maxTitle && maxTitle < data.length) {
            meet = false;
            titleHint = "不能大于" + maxTitle + "个字";
        }
        return [{
            meet: meet,
            value: data.length,
            title: props.features.title,
            text: titleHint,
            num: i,
        }];
    };
    shopChange = (env) => {//店铺改变
        let value=env.target.value;
        let type=$(env.target).data("type");
        let {item} = this.state;
        if (item.data.shopDetail) {
            item.data.shopDetail[0][type] = value;
        } else {
            item.data.shopDetail = [{[type]: value}]
        }
        this.setState({item});
    };

    newShopChange = ({value,type}) => {//新店铺改变
        let {item} = this.state;
        if (item.data.shopDetail) {
            item.data.shopDetail[0][type] = value;
        } else {
            item.data.shopDetail = [{[type]: value}]
        }
        this.setState({item});
    };

    componentDidMount() {
        ThousandsOfCall.acoustic('', "testbb", (data) => {
            if (data.plugins >= 3.14) {
                this.setState({flag: true, plugins: data.plugins});
            }
        })
    }

    gainCommodity = (data, item) => {
        ThousandsOfCall.acoustic({
            agreement: "https",
            hostname: "resource.taobao.com",
            path: "/shop/query",
            data: data,
            method: "get",
            referer: "https://we.taobao.com/"
        }, "requestRelyTB", (msg) => {
            if (msg.success) {
                let json = JSON.parse(msg.data);
                let {shopTitle, shopUrl, shopLogo, shopImg, b2cShop, level, type} = json.data.itemList[0];
                Object.assign(item.data.shopDetail[0], {
                    shop_title: shopTitle,
                    shop_url: shopUrl,
                    shop_logo: shopLogo,
                    shop_img: shopImg,
                    b2cShop, level, type
                });
                this.setState({item: item}, () => {
                    this.props.editCallback(this.state.item);
                });
            } else {
                currencyNoty('获取失败', 'warning')
            }
        });
    };
    determine = () => {
        let {item} = this.state;
        this.gainCommodity({shopId: item.data.shopDetail[0].shop_sid}, item);
    };

    newShowAddItem=({type})=>{//新添加宝贝
        let callback = (data) => {
            let {item} = this.state,imgArr = [];
            let {images,itemId,coverUrl,title,price}=data;
            images.forEach(it=>{
                imgArr.push({
                    picUrl:it
                })
            });
            let object={
                itemImages:imgArr,
                item_numiid:itemId,
                item_pic:coverUrl,
                item_title:title,
                itemPriceDTO:{price: {item_current_price: parseInt(price), item_price: parseInt(price)}},
                item:data,
            };
            if (item.data[type]) {
                item.data[type].push(object);
            } else {
                item.data[type] = [object];
            }
            this.setState({item});
        };
        this.setState({callback},this.upItemBundleLoading);
    };

    newEditItem=({index,type})=>{//新编辑宝贝
        let {item}=this.state;
        let callback = (data) => {
            let imgArr = [];
            let {images,itemId,coverUrl,title,price}=data;
            images.forEach(it=>{
                imgArr.push({
                    picUrl:it
                })
            });
            let object={
                itemImages:imgArr,
                item_numiid:itemId,
                item_pic:coverUrl,
                item_title:title,
                itemPriceDTO:{price: {item_current_price: parseInt(price), item_price: parseInt(price)}},
                item:data,
            };
            item.data[type].splice(index, 1, object);
            this.setState({item});
        };
        this.setState({callback},()=>this.upItemBundleLoading(item.data[type][index].item))
    };

    newDelAddItem=({type,index})=>{//新删除宝贝
        let {item} = this.state;
        item.data[type].splice(index, 1);
        this.setState({item})
    };

    upItemBundleLoading=(data)=>{//添加商品热加载
        if (this.state.upItemFlag && this.upItem&&this.upItem.jd) {
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
        if (this.state.upImagesFlag && this.upImages&&this.upImages.jd) {
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

    setPaState = (data, callback) => {
        this.setState(data, callback);
    };

    getSoBrand = () => {//修复
        let {soBrandFlag,brandName}=this.state;
        let callback = (log, introduction, name) => {
            let {item} = this.state;
            let {dataSchema}=item.moduleInfo;
            let properties = dataSchema.properties;
            item.data.title = "品牌故事";
            item.data.brandName = name;
            for (let p in properties) {
                if (properties[p].title == dataSchema.brandLogoName) {
                    item.data[p].push({picUrl: log});
                }
                if (properties[p].title == dataSchema.brandIntroductionName) {
                    item.data[p] = introduction;
                }
            }
            this.setState({item});
        };
        this.setState({callback: callback, soBrandFlag: true}, () => {
            if (soBrandFlag &&this.soBrand&& this.soBrand.jd) {
                this.soBrand.jd.open(brandName);
            } else {
                this.setState({soBrandFlag: true}, () => {
                    let upload = setInterval(() => {
                        let soBrand = this.soBrand;
                        if (soBrand && soBrand.jd) {
                            clearInterval(upload);
                            this.soBrand.jd.open(brandName);
                        }
                    }, 100);
                });
            }
        });
    };

    soBrandNameChange = (value) => {//修复
        this.setState({brandName: value});
    };

    addBrand = (d) => {
        if (d.brandName) {
            if (d.images.length > 0 && d.desc) {
                let data = {
                    id: 0,
                    name: d.brandName,
                    pBIlog: d.images[0].picUrl,
                    introduction: d.desc
                };
                Ajax({
                    type: 'post',
                    url: '/message/admin/cheesy/addOrUpPrivateBrandInfo.io',
                    data: data,
                    callback: () => {
                        currencyNoty("添加成功", "success")
                    }
                });
            } else {
                currencyNoty("添加品牌内容不完整", "warning")
            }
        } else {
            if (d.images.length > 0 && d.desc && this.state.brandName) {
                let data = {
                    id: 0,
                    name: this.state.brandName,
                    pBIlog: d.images[0].picUrl,
                    introduction: d.desc
                };
                Ajax({
                    type: 'post',
                    url: '/message/admin/cheesy/addOrUpPrivateBrandInfo.io',
                    data: data,
                    callback: () => {
                        currencyNoty("添加成功", "success")
                    }
                });
            } else {
                currencyNoty("添加品牌内容不完整", "warning")
            }
        }
    };

    upSPUItemBundleLoading=(data)=>{//添加产品热加载
        if (this.state.upSPUItemFlag && this.upSPUItem&&this.upSPUItem.jd) {
            this.upSPUItem.jd.open(data);
        } else {
            this.setState({upSPUItemFlag: true}, () => {
                let upload = setInterval(() => {
                    let upSPUItem = this.upSPUItem;
                    if (upSPUItem && upSPUItem.jd) {
                        clearInterval(upload);
                        this.upSPUItem.jd.open(data);
                    }
                }, 100);
            });
        }
    };

    addSPUItem = () => {//大进口
        let callback = (data) => {
            let {item} = this.state,{title,coverUrl,spuId,resourceType}=data;
            item.data.item.push({
                spu_name: title,
                spu_pic: coverUrl,
                spu_id: spuId,
                resourceType
            });
            Object.assign(item,{spu:data});
            this.setState({item})
        };
        this.setState({callback}, () => {
            this.upSPUItemBundleLoading();
        });
    };

    editSPUItem = ({i}) => {//大进口
        let callback = (data) => {
            let {item} = this.state,{title,coverUrl,spuId,resourceType}=data;
            item.data.item.splice(i, 1, {
                spu_name: title,
                spu_pic: coverUrl,
                spu_id: spuId,
                resourceType
            });
            Object.assign(item,{spu:data});
            this.setState({item})
        };
        this.setState({callback}, () => {
            this.upSPUItemBundleLoading(this.state.item.spu);
        });
    };

    delSPUItem = ({i}) => {//大进口
        let {item} = this.state;
        item.data.item.splice(i, 1);
        this.setState({item});
    };

    render() {
        let {brandName,item,data,upImagesFlag,upSPUItemFlag,upItemFlag,soBrandFlag,imgCallback,showModal,callback} = this.state;
        let {moduleConfig,constraint}=this.props;
        let name = item.name;
        let properties = item.moduleInfo ? item.moduleInfo.dataSchema.properties : undefined;
        let dataSchema = item.moduleInfo ? item.moduleInfo.dataSchema : undefined;

        let body = undefined;
        switch (name) {
            case "goodshop-shendian-shop":
                body = <GoodshopShendianShop pProps={this.props} pState={this.state} properties={properties} change={this.newChange}
                                             shopChange={this.shopChange} determine={this.determine}
                                             close={this.close} setPaState={this.setPaState} upImages={()=>this.upImagesBundleLoading()}/>;
                break;
            case "calendar-header-card":
                body = <CalendarHeaderCard pProps={this.props} pState={this.state} properties={properties} change={this.newChange}
                                           shopChange={this.newShopChange} determine={this.determine}
                                           close={this.close} showAddItem={this.newShowAddItem} editItem={this.newEditItem}
                                           delAddItem={this.newDelAddItem} setPaState={this.setPaState} upImages={() => this.upImagesBundleLoading()}/>;
                break;
            case "need-content-bpu":
                body = <NeedContentBPU pProps={this.props} pState={this.state} shopChange={this.shopChange}
                                       determine={this.determine} properties={properties} addSPUItem={this.addSPUItem}
                                       editSPUItem={this.editSPUItem} delSPUItem={this.delSPUItem} scoreChange={this.newScoreChange}
                                       change={this.newChange} close={this.close} setPaState={this.setPaState}/>;
                break;
            case "weitao-ver-items"://垂直宝贝清单
                body = <WeitaoVerItems pProps={this.props} pState={this.state} close={this.close}
                                       showAddItem={this.newShowAddItem} editItem={this.newEditItem} delAddItem={this.newDelAddItem}/>;
                break;
            case "weitao-score-range"://维度评分
                body = <WeitaoScoreRange pProps={this.props} pState={this.state} properties={properties}
                                         close={this.close} setPaState={this.setPaState}
                                         scoreChange={this.newScoreChange}/>;
                break;
            case "single-item-inventory" :
            case "single-item-rank"://单列榜单
                body = <StructCanvasEdit pProps={this.props} pState={this.state} change={this.newChange} close={this.close} setPaState={this.setPaState}/>;
                break;
            case "paragraph":
                body = <Paragraph pProps={this.props} pState={this.state} textChangeEdit={this.textChangeEdit}
                                  close={this.close}/>;
                break;
            case "shop-inventory-separator":
                body = <ShopInventorySeparator pProps={this.props} pState={this.state} change={this.newChange}
                                               close={this.close}/>;
                break;
            case "content-shop":
                body = <ContentShop pProps={this.props} pState={this.state} shopChange={this.newShopChange}
                                    determine={this.determine} close={this.close}/>;
                break;
            case "weitao-item-pk"://pk双列
            case "two-column-items"://双列宝贝
                body = <TwoColumnItems pProps={this.props} pState={this.state}
                                       close={this.close} showAddItem={this.newShowAddItem} editItem={this.newEditItem}
                                       delAddItem={this.newDelAddItem}/>;
                break;
            case  "item-paragraph"://自定义段落
                body = <ItemParagraph pProps={this.props} pState={this.state}
                                      properties={properties} dataSchema={dataSchema} getSoBrand={this.getSoBrand}
                                      soBrandNameChange={this.soBrandNameChange} brandName={brandName}
                                      change={this.newChange} close={this.close}  setPaState={this.setPaState}
                                      upImages={() => this.upImagesBundleLoading()} addBrand={this.addBrand}/>;
                break;

            case "item-paragraph-select"://标准段落
                body = <ItemParagraphSelect pProps={this.props} pState={this.state}
                                            titleSelectChange={() => this.setState({titleSelect: !this.state.titleSelect})}
                                            properties={properties} dataSchema={dataSchema} getSoBrand={this.getSoBrand}
                                            soBrandNameChange={this.soBrandNameChange} brandName={brandName} change={this.newChange} close={this.close}
                                            setPaState={this.setPaState} upImages={() => this.upImagesBundleLoading()} addBrand={this.addBrand}/>;
                break;

            case "item-feature"://长亮点
                body = <ItemFeature pProps={this.props} pState={this.state} properties={properties}
                                    change={this.change} close={this.close}  setPaState={this.setPaState}
                                    featureChange={this.featureChange}/>;
                break;
            default :
                body = <div>
                    <ele.Input value={data.text} onChange={this.textChangeAdd} type="textarea"
                               autosize={{ minRows: 5, maxRows: 6}} placeholder="请在这里输入文字...."/>
                    <span style={{margin:'10px 0'}}>{`${(data.text ? data.text.length : 0)}/0/200`}</span>
                    <NewButtonBlock close={this.close} editCallback={this.props.textAddCallback} item={data} isProhibit={!data.text}/>
                </div>;
        }
        let dialogName = {
            "paragraph": "文本编辑框", "shop-inventory-separator": "分隔符编辑框", "content-shop": "店铺信息编辑框", "two-column-items": "双列宝贝编辑框",
            "item-paragraph": "自定义段落编辑框", "item-paragraph-select": "标准段落编辑框", "item-feature": "宝贝亮点编辑框",
            "weitao-score-range": "维度打分编辑框", "weitao-ver-items": "垂直宝贝编辑框", "weitao-item-pk": "宝贝PK编辑框",
            "need-content-bpu": "大进口BPU内容编辑框", "calendar-header-card": "头部店铺编辑框", "goodshop-shendian-shop": "店铺资源编辑框"
        };
        return (
            <div>
                <Dialog title={dialogName[name] ? dialogName[name] : "文本编辑框"} size="small" visible={showModal} onCancel={this.close} lockScroll={false}>
                    <Dialog.Body>
                        {body}
                    </Dialog.Body>
                </Dialog>
                {upImagesFlag&&<BundleLoading load={UpImages} ref={e => this.upImages = e} callback={imgCallback}/>}
                {upSPUItemFlag&&<BundleLoading load={UpSPUItem} ref={e => this.upSPUItem = e} callback={callback} constraint={constraint.props.moduleConfig.commonSpuProps}/>}
                {soBrandFlag && <BundleLoading ref={e => this.soBrand = e} load={SoBrand} callback={callback}/>}
                {upItemFlag &&
                <BundleLoading ref={e => this.upItem = e} load={UpItem}
                               activityId={moduleConfig && moduleConfig.commonItemProps && moduleConfig.commonItemProps.categoryListApiQuery ? moduleConfig.commonItemProps.categoryListApiQuery.activityId : 0}
                               categoryListApiQuery={moduleConfig &&moduleConfig.commonItemProps && moduleConfig.commonItemProps.categoryListApiQuery ? moduleConfig.commonItemProps.categoryListApiQuery : undefined}
                               callback={callback}/>}
            </div>
        )
    }
}


const Paragraph = (props) => {//文本√
    let {pState,close,pProps}=props;
    let {text}=pState.data;
    return (<div>
        <ele.Input value={text} onChange={(value)=>props.textChangeEdit({value})} type="textarea"
                   autosize={{ minRows: 5, maxRows: 6}} placeholder="请在这里输入文字...."/>
        <span style={{margin:'10px 0'}}>{`${(text ? text.length : 0)}/0/200`}</span>
        <NewButtonBlock close={close} editCallback={pProps.editCallback} item={pState.item} isProhibit={!text}/>
    </div>)
};

const ShopInventorySeparator = (props) => {//分隔符√
    let {pState,close,pProps}=props;
    let {item,hint}=pState;
    let {properties}=item.moduleInfo.dataSchema;
    let prohibit=()=>{
        let prohibit=false;
        if(item.data.title.length<1||item.data.title.length>properties.title.maxLength){
            prohibit=true;
        }
        return prohibit;
    };
    let is=prohibit();
    return(
        <div>
            <NewPanel header={properties.topNum.title}>
                <ele.Select value={item.data.topNum} onChange={(value)=>props.change({value,type:'topNum'})} style={{width: "100%"}}>
                    {(item ?properties.topNum.enum : []).map(el => {
                        return <ele.Select.Option key={el} label={el} value={el}/>
                    })}
                </ele.Select>
            </NewPanel>
            <NewPanel header={properties.title.title}>
                <ele.Input placeholder={properties.title.description} value={item.data.title} onChange={(value)=>props.change({value,type:'title'})}
                           prepend={`${(item ? item.data.title.length : 0)}/${(properties.title.minLength  ? properties.title.minLength  : 0)}/${properties.title.maxLength}`}/>
                <HintShow hint={hint}/>
            </NewPanel>
            <NewButtonBlock close={close} editCallback={pProps.editCallback} item={item} isProhibit={is}/>
        </div>
    )
};

const ContentShop = (props) => {//店铺√
    let {pState,close,determine}=props;
    let {shopDetail}=pState.item.data;
    let prohibit=()=>{
        if(shopDetail.length < 1){
            return true;
        }else {
            if(!shopDetail[0].shop_sid){
                return true;
            }else if(!shopDetail[0].shop_desc){
                return true;
            }else {
                return false;
            }
        }
    };
    let is=prohibit();
    return(
        <div>
            <NewPanel header="店铺 shopId">
                <ele.Input placeholder="请输入店铺shopId" value={shopDetail.length > 0 ? shopDetail[0].shop_sid : ""}
                           onChange={(value)=>props.shopChange({value,type:'shop_sid'})}/>
                <ele.Alert title="请填写店铺 shopid（chrome浏览器：店铺首页→鼠标右键→查看网页源代码→shopId=XXXXXX）" type="warning" style={{marginTop:'6px'}}/>
            </NewPanel>
            <NewPanel header="店铺描述">
                <ele.Input placeholder="请输入店铺描述..." value={shopDetail.length > 0 ? shopDetail[0].shop_desc : ""}
                           onChange={(value)=>props.shopChange({value,type:'shop_desc'})} disbabled={!shopDetail[0].shop_sid }/>
            </NewPanel>
            <NewButtonBlock close={close} editCallback={determine} isProhibit={is}/>
        </div>
    )
};

const WeitaoVerItems = (props) => {
    let {pState,close,pProps}=props;
    let {data}=pState.item;
    let {properties}=pState.item.moduleInfo.dataSchema;
    let prohibit=()=>{
        let prohibit=false,it=data.products ? data.products : [];
        if(it.length<1){
            prohibit=true;
        }
        return prohibit;
    };
    let is=prohibit();
    return(
        <div>
            <NewPanel header={properties.products.items.title}>
                <Layout.Row gutter="2">
                    {(data.products ? data.products.length : 0) < properties.products.maxItems&&
                    <Layout.Col span="6" className="itemM_pic">
                        <img src="https://img.alicdn.com/imgextra/i1/772901506/TB2oeLpihhmpuFjSZFyXXcLdFXa_!!772901506.jpg"
                             onClick={()=>props.showAddItem({type:'products'})}/>
                    </Layout.Col>}
                    {(data.products ? data.products : []).map((item,index)=>{
                        return(
                            <Layout.Col span="6" className="listItem" key={item.item_pic}>
                                <img src={item.item_pic} onClick={()=>props.editItem({index,type:'products'})} width="100%"/>
                                <div className="del" onClick={()=>props.delAddItem({index,type:'products'})}>
                                    删除
                                </div>
                            </Layout.Col>
                        )
                    })}
                </Layout.Row>
                {is&&<ele.Alert title={`必须添加${properties.products.minItems}~${properties.products.maxItems}个宝贝`} type="warning" />}
            </NewPanel>
            <NewButtonBlock close={close} editCallback={pProps.editCallback} item={pState.item} isProhibit={is}/>
        </div>
    )
};

const TwoColumnItems = (props) => {
    let {pState,close,pProps}=props;
    let {data}=pState.item;
    let {properties}=pState.item.moduleInfo.dataSchema;
    let prohibit=()=>{
        let prohibit=false,it=data.items ? data.items : [];
        if(it.length<2){
            prohibit=true;
        }
        return prohibit;
    };
    let is=prohibit();
    return(
        <div>
            <NewPanel header={properties.items.items.title}>
                <Layout.Row gutter="2">
                    {(data.items ? data.items.length : 0) < properties.items.maxItems&&
                    <Layout.Col span="6" className="itemM_pic">
                        <img src="https://img.alicdn.com/imgextra/i1/772901506/TB2oeLpihhmpuFjSZFyXXcLdFXa_!!772901506.jpg"
                            onClick={()=>props.showAddItem({type:'items'})}/>
                    </Layout.Col>}
                    {(data.items ? data.items : []).map((item,index)=>{
                        return(
                            <Layout.Col span="6" className="listItem" key={item.item_pic}>
                                <img src={item.item_pic} onClick={()=>props.editItem({index,type:'items'})} width="100%"/>
                                <div className="del" onClick={()=>props.delAddItem({index,type:'items'})}>
                                    删除
                                </div>
                            </Layout.Col>
                        )
                    })}
                </Layout.Row>
                {is&&<ele.Alert title="必须添加两个宝贝" type="warning" />}
            </NewPanel>
            <NewButtonBlock close={close} editCallback={pProps.editCallback} item={pState.item} isProhibit={is}/>
        </div>
    )
};

const ItemParagraph = (props) => {//自定义段落√
    let {dataSchema,pState,properties,pProps}=props;
    let {brandTitle}=dataSchema,{data}=pState.item;
    let tips=({type,array=[]})=>{
        pState.hint.forEach(item=>{
            if (item.type == type) {
                array.push(item);
            }
        });
        return array;
    };
    let addChange=()=>{
        let imgCallback = (img, p) => {
            let {item} = pState;
            item.data.images.push({picUrl:img, picHeight:p.h, picWidth:p.w});
            props.setPaState({item});
        };
        props.setPaState({imgCallback},() => props.upImages())
    };
    let del=({i})=>{
        let {item} = pState;
        item.data.images.splice(i, 1);
        props.setPaState({item});
    };
    return (
        <div>
            {(brandTitle === "true" || brandTitle === true) &&<NewPanel header="品牌库">
                <ele.Input placeholder="请输入品牌名..." value={props.brandName} onChange={props.soBrandNameChange}
                           append={<ele.Button type="primary" icon="search" onClick={props.getSoBrand}>去搜索</ele.Button>}/>
                <ele.Button type="success" style={{width:'100%',marginTop:'10px'}} onClick={()=>props.addBrand(data)}>把下面内容添加到私人品牌库</ele.Button>
            </NewPanel>}
            <NewPanel header={properties.title.title}>
                <ele.Input placeholder={properties.title.description} value={data.title} onChange={(value)=>props.change({value,type:'title'})}
                           prepend={`${(data.title ? data.title.length : 0)}/${(properties.title.minLength  ? properties.title.minLength  : 0)}/${properties.title.maxLength}`}/>
                <HintShow hint={tips({type:'title'})}/>
            </NewPanel>
            <NewPanel header={properties.desc.title}>
                <ele.Input value={data.desc} onChange={(value)=>props.change({value,type:'desc'})} type="textarea"
                    autosize={{ minRows: 3, maxRows: 5}} placeholder={properties.desc.description}/>
                <span> {`${(data.desc ? data.desc.length : 0)}/${(properties.desc.minLength ? properties.desc.minLength : 0)}/${properties.desc.maxLength}`}</span>
                <HintShow hint={tips({type:'desc'})}/>
            </NewPanel>
            <NewPanel header={properties.images.title}>
                <Layout.Row gutter="2" style={{margin: "4px 0"}}>
                    {((data.images ? data.images.length : 0) < properties.images.maxItems)&&
                        <Layout.Col span="8" className="itemM_pic">
                            <img src="https://img.alicdn.com/imgextra/i1/772901506/TB2oeLpihhmpuFjSZFyXXcLdFXa_!!772901506.jpg"
                                 onClick={addChange}/>
                        </Layout.Col>}
                    {(data.images ? data.images : []).map((item, index) => {
                        return (
                            <Layout.Col className="listItem" span="8" key={item.picUrl}>
                                <img src={item.picUrl} width="100%"/>
                                <div className="del" onClick={() =>del({i:index})} style={{left: '5px',right: '5px'}}>
                                    删除
                                </div>
                            </Layout.Col>
                        );
                    })}
                </Layout.Row>
                <span>{properties.images.description}</span>
            </NewPanel>
            <NewButtonBlock close={props.close} item={pState.item} editCallback={pProps.editCallback} isProhibit={false}/>
        </div>
    )
};

const ItemParagraphSelect = (props) => {//标准段落√
    let {dataSchema,pState,properties,pProps}=props;
    let {brandTitle}=dataSchema,{data}=pState.item;
    let tips=({type,array=[]})=>{
        pState.hint.forEach(item=>{
            if (item.type == type) {
                array.push(item);
            }
        });
        return array;
    };
    let addChange=()=>{
        let imgCallback = (img, p) => {
            let {item} = pState;
            item.data.images.push({picUrl:img, picHeight:p.h, picWidth:p.w});
            props.setPaState({item});
        };
        props.setPaState({imgCallback},() => props.upImages())
    };
    let del=({i})=>{
        let {item} = pState;
        item.data.images.splice(i, 1);
        props.setPaState({item});
    };

    return (
        <div>
            {(brandTitle === "true" || brandTitle === true) &&<NewPanel header="品牌库">
                <ele.Input placeholder="请输入品牌名..." value={props.brandName} onChange={props.soBrandNameChange}
                           append={<ele.Button type="primary" icon="search" onClick={props.getSoBrand}>去搜索</ele.Button>}/>
                <ele.Button type="success" style={{width:'100%',marginTop:'10px'}} onClick={()=>props.addBrand(data)}>把下面内容添加到私人品牌库</ele.Button>
            </NewPanel>}
            <NewPanel header={properties.title.title}>
                {pProps.constraint.props.moduleConfig.channelTitle?
                    <div>
                        <ele.Select value={data.title} onChange={(value)=>props.change({value,type:'title'})} style={{width: "100%"}}>
                            {[{label: "", value: ""},...pProps.constraint.props.moduleConfig.channelTitle.dataSource].map(el => {
                                return <ele.Select.Option key={el.value} label={el.value} value={el.value}/>
                            })}
                        </ele.Select>
                    </div>:
                <ele.Input placeholder={properties.title.description} value={data.title} onChange={(value)=>props.change({value,type:'title'})}/>}
                <HintShow hint={tips({type:'title'})}/>
            </NewPanel>
            <NewPanel header={properties.desc.title}>
                <ele.Input value={data.desc} onChange={(value)=>props.change({value,type:'desc'})} type="textarea"
                           autosize={{ minRows: 3, maxRows: 5}} placeholder={properties.desc.description}/>
                <span> {`${(data.desc ? data.desc.length : 0)}/${(properties.desc.minLength ? properties.desc.minLength : 0)}/${properties.desc.maxLength}`}</span>
                <HintShow hint={tips({type:'desc'})}/>
            </NewPanel>
            <NewPanel header={properties.images.title}>
                <Layout.Row gutter="2" style={{margin: "4px 0"}}>
                    {((data.images ? data.images.length : 0) < properties.images.maxItems)&&
                    <Layout.Col span="8" className="itemM_pic">
                        <img src="https://img.alicdn.com/imgextra/i1/772901506/TB2oeLpihhmpuFjSZFyXXcLdFXa_!!772901506.jpg"
                             onClick={addChange}/>
                    </Layout.Col>}
                    {(data.images ? data.images : []).map((item, index) => {
                        return (
                            <Layout.Col className="listItem" span="8" key={item.picUrl}>
                                <img src={item.picUrl} width="100%"/>
                                <div className="del" onClick={() =>del({i:index})} style={{left: '5px',right: '5px'}}>
                                    删除
                                </div>
                            </Layout.Col>
                        );
                    })}
                </Layout.Row>
                <span>{properties.images.description}</span>
            </NewPanel>
            <NewButtonBlock close={props.close} item={pState.item} editCallback={pProps.editCallback} isProhibit={false}/>
        </div>
    )
};

const ItemFeature = (props) => {//宝贝亮点√

    let {properties,pState,setPaState,pProps}=props;
    let {title,items,minItems,maxItems}=properties.features;
    let {features=[]}=pState.item.data;
    let itemFeatureClick=({type,index})=>{
        let {item} =pState;
        if(type==='add'){
            features.push("");
        }else if(type==='del'){
            features.splice(index, 1);
        }else if(type==='up'){
            features.splice(index - 1, 2, features[index], features[index - 1]);
        }else if(type==='down'){
            features.splice(index, 2, features[index + 1], features[index]);
        }
        Object.assign(item.data,{features});
        setPaState({item});
    };
    let prohibit=()=>{
        let prohibit=false;
        if(features.length<2){
            prohibit=true;
        }
        return prohibit;
    };
    let is=prohibit();
    features=features instanceof Array?features:[];
    return (
        <div>
            <NewPanel header={title}>
                {features.map((item,index)=>{
                    let {hint} = pState,arr = [];
                    hint.forEach(hintData=>{
                        if (hintData.num === index) {
                            arr.push(hintData);
                        }
                    });
                    return(
                        <NewPanel header={`${items.title}:`} key={index}>
                            <Layout.Row gutter="2" style={{margin: "4px 0"}}>
                                <Layout.Col span="16">
                                    <ele.Input placeholder='请输入宝贝亮点...' value={item} onChange={(value)=>props.featureChange({i:index,value:value,type:'features'})}
                                               prepend={`${(item ? item.length : 0)}/${(items.minLength ? items.minLength : 0)}/${items.maxLength}`}/>
                                </Layout.Col>
                                <Layout.Col span="8">
                                    <ele.Button.Group>
                                        <ele.Button icon="arrow-up" onClick={()=>itemFeatureClick({type:'up',index})} disabled={index===0}>上移</ele.Button>
                                        <ele.Button icon="arrow-down" onClick={()=>itemFeatureClick({type:'down',index})} disabled={index===(features.length-1)}>下移</ele.Button>
                                        <ele.Button type="danger" icon="delete" onClick={()=>itemFeatureClick({type:'del',index})} disabled={features.length<=minItems}>删</ele.Button>
                                    </ele.Button.Group>
                                </Layout.Col>
                            </Layout.Row>
                            <HintShow hint={arr}/>
                        </NewPanel>
                    )
                })}
                {(maxItems > (features ? features.length : 0))&&
                    <img src="https://img.alicdn.com/imgextra/i1/772901506/TB2oeLpihhmpuFjSZFyXXcLdFXa_!!772901506.jpg"
                        onClick={()=>itemFeatureClick({type:'add'})} style={{width: "120px", border: "1px solid rgba(0, 0, 0, 0.20)"}}/>}
            </NewPanel>
            <NewButtonBlock close={props.close} item={pState.item} editCallback={pProps.editCallback} isProhibit={is}/>
        </div>
    )
};

const NewButtonBlock = (props) => {//新事件按钮√
    return(
        <Layout.Row gutter="2" style={{margin: "4px 0"}}>
            <Layout.Col span="12">
                <ele.Button type="danger" onClick={() => props.close()} style={{width:'100%'}}>关闭</ele.Button>
            </Layout.Col>
            <Layout.Col span="12">
                <ele.Button type="primary" onClick={()=>{
                    if(props.item){
                        props.editCallback(props.item);
                    }else {
                        props.editCallback();
                    }
                    props.close();
                }} disabled={props.isProhibit} style={{width:'100%'}}>确定</ele.Button>
            </Layout.Col>
        </Layout.Row>
    )
};

const WeitaoScoreRange = (props) => {//维度打分
    let array = ["①", "②", "③", "④", "⑤"];
    let {properties,pState,setPaState,pProps}=props;
    let {title}=properties.scores.items,{scores=[]}=pState.item.data,{hint}=pState,{item_score,item_title}=properties.scores.items.properties;
    let weitaoScoreRangeClick=({type,index})=>{
        let {item} = pState;
        if(type==='add'){
            item.data.scores.push({item_score: "1", item_title: ""});
        }else if(type==='del'){
            item.data.scores.splice(index,1);
        }
        setPaState({item});
    };
    let prohibit=()=>{
        let prohibit=false;
        scores.forEach(item=>{
            if(!(item.item_score&&item.item_title)){
                prohibit=true;
            }
        });
        if(scores.length<2){
            prohibit=true;
        }
        return prohibit;
    };
    let is=prohibit();
    return(
        <div>
            <NewPanel header={title}>
                {scores.map((item,index)=>{
                    let arr = [];
                    hint.forEach(hintData=>{
                        if (hintData.num === index) {
                            arr.push(hintData);
                        }
                    });
                    return(
                        <NewPanel key={index} header={title + array[index]}>
                            <Layout.Row gutter="2">
                                <Layout.Col span="10">
                                    <div style={{margin:'5px 0'}}>
                                        {item_score.title}
                                    </div>
                                    <ele.Select value={item.item_score} onChange={(value)=>props.scoreChange({value,type:'scores',it:'item_score',index})}
                                                style={{width: "100%"}}>
                                        {(item_score.enum?item_score.enum:[]).map((el,e) => {
                                            return <ele.Select.Option key={`${index}-${e}`} label={el} value={e+1}/>
                                        })}
                                    </ele.Select>
                                </Layout.Col>
                                <Layout.Col span="10">
                                    <div style={{margin:'5px 0'}}>
                                        {item_title.title}
                                    </div>
                                    <ele.Input placeholder='请输入评分标题...' value={item.item_title} onChange={(value)=>props.scoreChange({value,it:'item_title',type:'scores',index})}
                                               prepend={`${(item.item_title ? item.item_title.length : 0)}/${(item_title.minLength ? item_title.minLength : 0)}/${item_title.maxLength}`}/>
                                </Layout.Col>
                                <Layout.Col span="4">
                                    <div style={{margin:'5px 0'}}>
                                        操作
                                    </div>
                                    <ele.Button type="danger" icon="delete" onClick={()=>weitaoScoreRangeClick({type:'del',index})} disabled={scores.length<2}>删</ele.Button>
                                </Layout.Col>
                            </Layout.Row>
                        </NewPanel>
                    )
                })}
                {(properties.scores.maxItems > scores.length)&&
                <img src="https://img.alicdn.com/imgextra/i1/772901506/TB2oeLpihhmpuFjSZFyXXcLdFXa_!!772901506.jpg"
                     onClick={()=>weitaoScoreRangeClick({type:'add'})} style={{
                    width: "150px",
                    border: "1px solid rgba(0, 0, 0, 0.20)"
                }}/>}
            </NewPanel>
            <NewButtonBlock close={props.close} item={pState.item} editCallback={pProps.editCallback} isProhibit={is}/>
        </div>
    )
};

const NeedContentBPU = (props) => {
    let {properties,pState,setPaState,pProps}=props;
    let {title,description,item,rates}=properties,{data}=pState.item,{rateScore,rateTitle}=properties.rates.items.properties;
    let array = ["①", "②", "③", "④", "⑤"];
    let getHint=({type})=>{
        let arr=[];
        pState.hint.forEach(item=>{
            if (item.type == type) {
                arr.push(item);
            }
        });
        return arr;
    };
    let needContentBPUClick=({type,index})=>{
        let {item} = pState;
        if(type==='add'){
            item.data.rates.push({rateScore: "1", rateTitle: ""});
        }else if(type==='del'){
            item.data.rates.splice(index,1);
        }
        setPaState({item});
    };
    let prohibit=()=>{
        let prohibit=false;
        data.rates.forEach(item=>{
            if(!(item.rateScore&&item.rateTitle)){
                prohibit=true;
            }
        });
        if(data.rates.length<1){
            prohibit=true;
        }
        if((!data.title)||(!data.description)||data.item.length<1){
            prohibit=true;
        }
        return prohibit;
    };
    let is=prohibit();
    return(
        <div>
            <NewPanel header={title.title}>
                <ele.Input placeholder={title['ui:placeholder']} value={data.title} onChange={(value)=>props.change({value,type:'title'})}
                           prepend={`${(data.title ? data.title.length : 0)}/${(title.minLength ? title.minLength : 0)}/${title.maxLength}`}/>
                <HintShow hint={getHint({type:'title'})}/>
            </NewPanel>
            <NewPanel header={description.title}>
                <ele.Input value={data.description} onChange={(value)=>props.change({value,type:'description'})} type="textarea"
                           autosize={{ minRows: 3, maxRows: 5}} placeholder={description['ui:placeholder']}/>
                <span> {`${(data.description ? data.description.length : 0)}/${(properties.description.minLength ? properties.description.minLength : 0)}/${properties.description.maxLength}`}</span>
                <HintShow hint={getHint({type:'description'})}/>
            </NewPanel>
            <NewPanel header={item.title}>
                <Layout.Row gutter="2">
                    {(data.item.length < item.minItems)&&<Layout.Col span="8" className="itemM_pic">
                        <img src="https://img.alicdn.com/imgextra/i1/772901506/TB2oeLpihhmpuFjSZFyXXcLdFXa_!!772901506.jpg"
                             onClick={props.addSPUItem}/>
                    </Layout.Col>}
                    {(data.item ? data.item : []).map((it,index) => {
                        return(
                            <Layout.Col span="8" className="listItem" key={it.spu_pic}>
                                <img src={it.spu_pic} onClick={()=>props.editSPUItem({i:index})} width="100%"/>
                                <div className="del" onClick={()=>props.delSPUItem({i:index})}>
                                    删除
                                </div>
                            </Layout.Col>
                        )
                    })}
                </Layout.Row>
            </NewPanel>
            <NewPanel header={rates.title}>
                {(data.rates?data.rates:[]).map((item,index)=>{
                    let arr = [];
                    pState.hint.forEach(hintData=>{
                        if (hintData.num === index) {
                            arr.push(hintData);
                        }
                    });
                    return(
                        <NewPanel key={index} header={rates.title + array[index]}>
                            <Layout.Row gutter="2">
                                <Layout.Col span="10">
                                    <div style={{margin:'5px 0'}}>
                                        {rateScore.title}
                                    </div>
                                    <ele.Select value={item.rateScore} onChange={(value)=>props.scoreChange({value,type:'rates',it:'rateScore',index})}
                                                style={{width: "100%"}}>
                                        {(rateScore.enum?rateScore.enum:[]).map((el,e) => {
                                            return <ele.Select.Option key={`${index}-${e}`} label={el} value={e+1}/>
                                        })}
                                    </ele.Select>
                                </Layout.Col>
                                <Layout.Col span="10">
                                    <div style={{margin:'5px 0'}}>
                                        {rateTitle.title}
                                    </div>
                                    <ele.Input placeholder='请输入评分标题...' value={item.rateTitle} onChange={(value)=>props.scoreChange({value,it:'rateTitle',type:'rates',index})}
                                               prepend={`${(item.rateTitle ? item.rateTitle.length : 0)}/${(rateTitle.minLength ? rateTitle.minLength : 0)}/${rateTitle.maxLength}`}/>
                                </Layout.Col>
                                <Layout.Col span="4">
                                    <div style={{margin:'5px 0'}}>
                                        操作
                                    </div>
                                    <ele.Button type="danger" icon="delete" onClick={()=>needContentBPUClick({type:'del',index})} disabled={rates.length<2}>删</ele.Button>
                                </Layout.Col>
                            </Layout.Row>
                            <HintShow hint={arr}/>
                        </NewPanel>
                    )
                })}
                {(rates.maxItems > data.rates.length)&&
                <img src="https://img.alicdn.com/imgextra/i1/772901506/TB2oeLpihhmpuFjSZFyXXcLdFXa_!!772901506.jpg"
                     onClick={()=>needContentBPUClick({type:'add'})} style={{
                    width: "150px",
                    border: "1px solid rgba(0, 0, 0, 0.20)"
                }}/>}
            </NewPanel>
            <NewButtonBlock close={props.close} item={pState.item} editCallback={pProps.editCallback} isProhibit={is}/>
        </div>
    )
};

const CalendarHeaderCard = (props) => {
    let {properties,pState,setPaState,upImages}=props;
    let {data}=pState.item,{labelTitle,title,tag,summary,firstGoods,backgroundImg,contentId}=properties;
    let backgroundImgClick=({type,index})=>{
        if(type==='add'){
            let imgCallback = (img, p) => {
                let arr=backgroundImg['ui:options'].pixFilter.split('x');
                if(parseInt(p.w) == parseInt(arr[0]) && parseInt(p.h) == parseInt(arr[1])){
                    let {item} = pState;
                    let {backgroundImg=[]}=item.data;
                    backgroundImg.push({
                        picUrl:img,
                        picHeight:p.h,
                        picWidth:p.w,
                    });
                    Object.assign(item.data,{backgroundImg});
                    setPaState({item});
                }else {
                    Notification({
                        title: '警告',
                        message: '图片规格不符合推荐要求',
                        type: 'warning'
                    });
                }
            };
            setPaState({imgCallback}, () => {
                upImages();
            });
        }else if(type==='del'){
            let {item} = pState;
            item.data.backgroundImg.splice(index, 1);
            setPaState({item});
        }
    };
    let prohibit=()=>{
        let prohibit=false,{firstGoods=[],backgroundImg=[]}=data;
        if((!data.labelTitle)||(!data.title)||(!data.tag)||(!data.summary)||(firstGoods.length<1)||(backgroundImg.length<1)||(!data.shopDetail)){
            prohibit=true;
        }
        return prohibit;
    };
    let is=prohibit();
    return(
        <div>
            <NewPanel header={labelTitle.title}>
                <ele.Input placeholder={labelTitle['ui:placeholder']} value={data.labelTitle} onChange={(value)=>props.change({value,type:'labelTitle'})}
                           prepend={`${(data.labelTitle ? data.labelTitle.length : 0)}/${(labelTitle.minLength ? labelTitle.minLength : 0)}/${labelTitle.maxLength}`}/>
            </NewPanel>
            <NewPanel header={title.title}>
                <ele.Input placeholder={title['ui:placeholder']} value={data.title} onChange={(value)=>props.change({value,type:'title'})}
                           prepend={`${(data.title ? data.title.length : 0)}/${(title.minLength ? title.minLength : 0)}/${title.maxLength}`}/>
            </NewPanel>
            <NewPanel header='店铺 shopId'>
                <ele.Input placeholder="请输入店铺shopId..." value={data.shopDetail?(data.shopDetail.length > 0 ? data.shopDetail[0].shop_sid : ""):''}
                           onChange={(value)=>props.shopChange({value,type:'shop_sid'})}/>
                <ele.Alert title="请填写店铺 shopid（chrome浏览器：店铺首页→鼠标右键→查看网页源代码→shopId=XXXXXX）" type="warning" style={{marginTop:'6px'}}/>
            </NewPanel>
            <NewPanel header={tag.title}>
                <ele.Input placeholder={tag['ui:placeholder']} value={data.tag} onChange={(value)=>props.change({value,type:'tag'})}
                           prepend={`${(data.tag ? data.tag.length : 0)}/${(tag.minLength ? tag.minLength : 0)}/${tag.maxLength}`}/>
            </NewPanel>
            <NewPanel header={summary.title}>
                <ele.Input value={data.summary} onChange={(value)=>props.change({value,type:'summary'})} type="textarea"
                           autosize={{ minRows: 3, maxRows: 5}} placeholder={summary['ui:placeholder']}/>
                <span> {`${(data.summary ? data.summary.length : 0)}/${(summary.minLength ? summary.minLength : 0)}/${summary.maxLength}`}</span>
            </NewPanel>
            <NewPanel header={firstGoods.title}>
                <Layout.Row gutter="2">
                    {(data.firstGoods ? data.firstGoods.length : 0) < 1&&<Layout.Col span="6" className="itemM_pic">
                        <img src="https://img.alicdn.com/imgextra/i1/772901506/TB2oeLpihhmpuFjSZFyXXcLdFXa_!!772901506.jpg"
                             onClick={()=>props.showAddItem({type:'firstGoods'})}/>
                    </Layout.Col>}
                    {(data.firstGoods ? data.firstGoods : []).map((item,index)=>{
                        return(
                            <Layout.Col span="6" className="listItem" key={item.item_pic}>
                                <img src={item.item_pic} onClick={()=>props.editItem({index,type:'firstGoods'})} width="100%"/>
                                <div className="del" onClick={()=>props.delAddItem({index,type:'firstGoods'})}>
                                    删除
                                </div>
                            </Layout.Col>
                        )
                    })}
                </Layout.Row>
                <div>{firstGoods.description}</div>
            </NewPanel>
            <NewPanel header={backgroundImg['ui:title']}>
                <Layout.Row gutter="2">
                    {((data.backgroundImg ? data.backgroundImg.length : 0) < backgroundImg.maxItems)&&<Layout.Col span="6" className="itemM_pic">
                        <img src="https://img.alicdn.com/imgextra/i1/772901506/TB2oeLpihhmpuFjSZFyXXcLdFXa_!!772901506.jpg"
                            onClick={()=>backgroundImgClick({type:'add'})}/>
                    </Layout.Col>}
                    {(data.backgroundImg?data.backgroundImg : []).map((item,index)=>{
                        return(
                            <Layout.Col span="6" className="listItem" key={item.picUrl}>
                                <img src={item.picUrl} width="100%"/>
                                <div className="del" onClick={() => backgroundImgClick({type:'del',index})}>
                                    删除
                                </div>
                            </Layout.Col>
                        )
                    })}
                </Layout.Row>
                <div>{backgroundImg.description}</div>
            </NewPanel>
            <NewPanel header={contentId.title}>
                <ele.Input placeholder={contentId['ui:placeholder']} value={data.contentId} onChange={(value)=>props.change({value,type:'contentId'})}/>
            </NewPanel>
            <NewButtonBlock close={props.close} item={pState.item} editCallback={props.determine} isProhibit={is}/>
        </div>
    )
};

const GoodshopShendianShop = (props) => {
    let {properties,pState,upImages,setPaState}=props;
    let {data}=pState.item,{shop_tag,shop_desc,shopNumber,shop_cover}=properties;
    let shopCoverClick=({type,index})=>{
        if(type==='add'){
            let imgCallback = (img, p) => {
                let {item} = pState;
                let {shop_cover=[]} = item.data;
                shop_cover.push({
                    picUrl:img,
                    picHeight:p.h,
                    picWidth:p.w
                });
                if (shop_cover.length === 1) {
                    if (parseInt(p.w) != 1404 || parseInt(p.h) != 788) {
                        Notification({
                            title: '警告',
                            message: '图片规格不符合推荐要求',
                            type: 'warning'
                        });
                    }
                }
                if (shop_cover.length === 2) {
                    if (parseInt(p.w) != 340 || parseInt(p.h) != 487) {
                        Notification({
                            title: '警告',
                            message: '图片规格不符合推荐要求',
                            type: 'warning'
                        });
                    }
                }
                Object.assign(item.data,{shop_cover});
                setPaState({item});
            };
            setPaState({imgCallback}, () => {
                upImages();
            });
        }else if(type==='del'){
            let {item} = pState;
            item.data.shop_cover.splice(index, 1);
            setPaState({item});
        }
    };
    let prohibit=()=>{
        let prohibit=false,{shop_cover=[]}=data;
        if((!data.shop_tag)||(!data.shop_desc)||(!data.shopNumber)||(shop_cover.length<2)||(!data.shopDetail)){
            prohibit=true;
        }
        return prohibit;
    };
    let is=prohibit();
    return(
        <div>
            <NewPanel header='店铺 shopId'>
                <ele.Input placeholder="请输入店铺shopId..." value={data.shopDetail?(data.shopDetail.length > 0 ? data.shopDetail[0].shop_sid : ""):''}
                           onChange={(value)=>props.shopChange({value,type:'shop_sid'})}/>
                <ele.Alert title="请填写店铺 shopid（chrome浏览器：店铺首页→鼠标右键→查看网页源代码→shopId=XXXXXX）" type="warning" style={{marginTop:'6px'}}/>
            </NewPanel>
            <NewPanel header={shop_tag.title}>
                <ele.Input placeholder={shop_tag['ui:placeholder']} value={data.shop_tag} onChange={(value)=>props.change({value,type:'shop_tag'})}
                           prepend={`${(data.shop_tag ? data.shop_tag.length : 0)}/${(shop_tag.minLength ? shop_tag.minLength : 0)}/${shop_tag.maxLength}`}/>
                <ele.Alert title={shop_tag.description} type="warning" style={{marginTop:'6px'}}/>
            </NewPanel>
            <NewPanel header={shop_desc.title}>
                <ele.Input placeholder={shop_desc['ui:placeholder']} value={data.shop_desc} onChange={(value)=>props.change({value,type:'shop_desc'})}
                           prepend={`${(data.shop_desc ? data.shop_desc.length : 0)}/${(shop_desc.minLength ? shop_desc.minLength : 0)}/${shop_desc.maxLength}`}/>
            </NewPanel>
            <NewPanel header={shopNumber.title}>
                <ele.Input placeholder={shopNumber['ui:placeholder']} value={data.shopNumber} onChange={(value)=>props.change({value,type:'shopNumber'})}/>
                <ele.Alert title={shopNumber.description} type="warning" style={{marginTop:'6px'}}/>
            </NewPanel>
            <NewPanel header={shop_cover['ui:title']}>
                <Layout.Row gutter="2">
                    {((data.shop_cover ? data.shop_cover.length : 0) < shop_cover.maxItems)&&<Layout.Col span="6" className="itemM_pic">
                        <img src="https://img.alicdn.com/imgextra/i1/772901506/TB2oeLpihhmpuFjSZFyXXcLdFXa_!!772901506.jpg"
                             onClick={()=>shopCoverClick({type:'add'})}/>
                    </Layout.Col>}
                    {(data.shop_cover?data.shop_cover : []).map((item,index)=>{
                        return(
                            <Layout.Col span="6" className="listItem" key={item.picUrl}>
                                <img src={item.picUrl} width="100%"/>
                                <div className="del" onClick={() => shopCoverClick({type:'del',index})}>
                                    删除
                                </div>
                            </Layout.Col>
                        )
                    })}
                </Layout.Row>
                <div>{shop_cover.description}</div>
            </NewPanel>
            <NewButtonBlock close={props.close} item={pState.item} editCallback={props.determine} isProhibit={is}/>
        </div>
    )
};

class StructCanvasEdit extends React.Component {
    static hint(value, props, ind) {
        let hints = [],{data,materialId} = value;
        let moduleInfo = props.moduleInfos[materialId];
        if (moduleInfo) {
            let {properties} = moduleInfo.dataSchema;
            for (let i in properties) {
                let propertie = properties[i];
                switch (propertie.type) {
                    case "string":
                        hints = hints.concat(StringModule.hint(data[i], propertie, parseInt(ind) + 1, propertie.title));
                        break;
                    case "array":
                        hints = hints.concat(ArrarModule.hint(data[i], propertie, parseInt(ind) + 1, propertie.title));
                        break;
                }
            }
        }
        return hints;
    }

    onChange = (value, name) => {
        let {pState,setPaState}=this.props;
        let {item} = pState;
        item.data[name] = value;
        setPaState({item});
    };

    render() {
        let {pState,close,pProps}=this.props;
        let value = pState.item,{dataSchema}=pState.item.moduleInfo;
        let ui = dataSchema['ui:order'];
        let properties = dataSchema.properties;
        return (
            <div>
                {ui.map((item, i) => {
                    let s = properties[item];
                    switch (s.type) {
                        case "string":
                            return (
                                <StringModule ref={e => this[item] = e} constraint={s} value={value.data[item]} key={s.name + "" + item}
                                              name={item} onChange={this.onChange} i={i}/>
                            );
                            break;
                        case "array":
                            return (
                                <ArrarModule choiceItemPool={pProps.constraint.choiceItemPool}
                                             constraint={s} pc={properties} gb={(item, name) => this[name].setState({value: item})}
                                             value={(value.data[item] ? value.data[item] : [])} key={s.name + "" + item} name={item} onChange={this.onChange}
                                    categoryListApiQuery={pProps.moduleConfig.commonItemProps.categoryListApiQuery} i={i}/>
                            );
                            break;
                    }
                })}
                <NewButtonBlock close={close} item={pState.item} editCallback={pProps.editCallback} isProhibit={false}/>
            </div>
        )
    }
}

export {EditModule, StructCanvasEdit};

/**
 * Created by shiying on 17-10-14.
 */

import React from 'react';
import * as ele from 'element-react';
import 'element-theme-default';
import StringExhibition from './StringExhibition'
import ArrarExhibition from './ArrarExhibition'
import creationShop from '../../../../../../images/content/creationShop.png';
import shop1 from '../../../../../../images/content/shop1.png';
import shop2 from '../../../../../../images/content/shop2.png';

const NewMove=(props)=>{//新上移下移
    let {i,upChange,downChange,length,initialNumber=0}=props;
    return (
        <div style={{position: "absolute", left: 0, top: 0, bottom: 0, right: 0}} className='fs'>
            <ele.Button style={{position: "absolute", left: "-32px", bottom: "24px", fontSize: '12px'}}
                    type="info" size="mini" onClick={()=>upChange({i})} disabled={props.i === initialNumber} icon="arrow-up"> </ele.Button>
            <ele.Button style={{position: "absolute", left: "-42px", bottom: "0", fontSize: '12px'}}
                    type="info" size="mini" onClick={()=>downChange({i})} disabled={props.i === (length-1)} icon="arrow-down"> </ele.Button>
        </div>
    )
};

const NewOperation = (props) => {//新编辑插入删除
    return (
        <div style={{position: "absolute", left: 0, top: 0, bottom: 0, right: 0}} className='fs'>
            {props.edit && <div style={{position: "absolute", left: 0, top: 0, bottom: 0, right: 0, cursor: "pointer"}}
                                onClick={()=>props.editChange({i:props.i})}> </div>}
            {props.insert&&<ele.Button style={{position: "absolute", left: "502px", bottom: "22px", fontSize: '12px'}}
                                       type="primary" size="mini" onClick={()=>props.insertChange({i:props.i,id:props.id})}>插</ele.Button>}
            {props.del&&<ele.Button style={{position: "absolute", left: "492px", bottom: "-2px", fontSize: '12px'}}
                                    type="danger" size="mini" onClick={()=>props.delChange({i:props.i})}>删</ele.Button>}
        </div>
    );
};


const SingleItemInventory = (props) => {
    let {item,value,i,constraint} = props;
    item.data.topNum = i + 1;//改变top数值
    let ui = item.moduleInfo.dataSchema['ui:order'];
    let properties = item.moduleInfo.dataSchema.properties;
    let spare = undefined;//备用内容
    if (constraint.props.moduleInfos[item.materialId]) {
        spare = constraint.props.moduleInfos[item.materialId].data;
    }
    let con = ui.map((it, t) => {
        let s = properties[it];
        switch (s.type) {
            case "string":
                return (
                    <StringExhibition value={item.data[it]} spare={spare ? spare[it] : ""} type={it} key={"u" + t}/>
                );
                break;
            case "array":
                return (
                    <ArrarExhibition value={item.data[it]} spare={spare ? spare[it] : []} type={it} key={"u" + t}/>
                );
                break;
        }
    });
    return (
        <div>
            <div className="structCanvasKuai" style={{marginTop: "10px"}}>
                <div className="thumbnail">{con}</div>
                <NewMove i={i} upChange={props.upChange} downChange={props.downChange} length={value.length}/>
                <NewOperation i={i} delChange={props.delChange} editChange={props.editChange} edit={props.edit} del={props.del}/>
            </div>
            {value.length == (i + 1) && <ele.Button type="info" style={{marginTop: "2px",width:'100%'}} onClick={props.addSingleItem}>添加段落</ele.Button>}
        </div>
    );
};

const Picture = (props) => {
    let {value,item,i}=props;
    let {images} = item.data;
    return (
        <div className="structCanvasKuai">
            <img src={images[0].picUrl} id={"pic" + i} className="imgShow"/>
            <NewMove i={i} upChange={props.upChange} downChange={props.downChange} length={value.length}/>
            <NewOperation i={i} delChange={props.delChange} editChange={props.editChange} edit={props.edit}
                          del={props.del} insertChange={props.insertChange} insert={props.insert} id={"pic" + i}/>
        </div>
    );
};

const ShopInventorySeparator = (props) => {
    let {item,i,value} = props;
    return (
        <div className="structCanvasKuai">
            <div id={"pic" + i} className="external">
                <div className="topNum">top{item.data.topNum ? item.data.topNum : item.spareData.topNum}</div>
                <div className="topNum">————</div>
                <div className="topNum">{item.data.title ? item.data.title : item.spareData.title}</div>
            </div>
            <NewMove i={i} upChange={props.upChange} downChange={props.downChange} length={value.length}/>
            <NewOperation i={i} delChange={props.delChange} editChange={props.editChange} edit={props.edit}
                          del={props.del} insertChange={props.insertChange} insert={props.insert} id={"pic" + i}/>
        </div>
    );
};

const TwoColumnItem = (props) => {
    let {item,i,value} = props;
    let items = item.data.items && item.data.items.length > 0 ? item.data.items : item.spareData.items;
    return (
        <div className="structCanvasKuai">
            <div id={"pic" + i} className="external">
                <ele.Layout.Row gutter="6">
                    {(items?items:[]).map((item,index)=>{
                        return(
                            <ele.Layout.Col span="12" key={`twoItem-${index}`}>
                                <img src={item.item_pic}/>
                                <div style={{opacity: "0.5"}} title={item.item_title}>{strLen(item.item_title, 16)}</div>
                                <span style={{color:'rgb(255, 80, 0)'}}>¥{item.item ? item.item.price : item.itemPriceDTO.price.item_current_price}</span>
                            </ele.Layout.Col>
                        )
                    })}
                </ele.Layout.Row>
            </div>
            <NewMove i={i} upChange={props.upChange} downChange={props.downChange} length={value.length}/>
            <NewOperation i={i} delChange={props.delChange} editChange={props.editChange} edit={props.edit}
                          del={props.del} insertChange={props.insertChange} insert={props.insert} id={"pic" + i}/>
        </div>
    );
};

const ContentShop = (props) => {
    let {item,i,value} = props;
    let {shopDetail=[]} = item.data;
    return (
        <div className="structCanvasKuai">
            <div id={"pic" + i} className="external">
                {shopDetail.map((item,index)=>{
                    return(
                        <ele.Layout.Row gutter="6" key={`shop-${index}`}>
                            <ele.Layout.Col span="6">
                                <img src={item.shop_logo}/>
                            </ele.Layout.Col>
                            <ele.Layout.Col span="18">
                                <div style={{fontSize: "16px",marginTop:'10px'}}>{item.shop_title}</div>
                                <div style={{fontSize: "12px",marginTop:'6px'}}>{item.shop_desc}</div>
                                <div style={{marginTop:'10px',width: '52px', height: '16px'}}>
                                    <img src='https://gw.alicdn.com/tfs/TB1F2YZRXXXXXXqXpXXXXXXXXXX-78-24.png'/>
                                </div>
                            </ele.Layout.Col>
                        </ele.Layout.Row>
                    )
                })}
            </div>
            <NewMove i={i} upChange={props.upChange} downChange={props.downChange} length={value.length}/>
            <NewOperation i={i} delChange={props.delChange} editChange={props.editChange} edit={props.edit}
                       del={props.del} insertChange={props.insertChange} insert={props.insert} id={"pic" + i}/>
        </div>
    );
};

const Paragraph = (props) => {
    let {item,i,value} = props;
    return (
        <div className="structCanvasKuai">
            <div className="external" id={"pic" + i}>
                <div style={{padding: "10px 0"}}>{item.data.text}</div>
            </div>
            <NewMove i={i} upChange={props.upChange} downChange={props.downChange} length={value.length}/>
            <NewOperation i={i} delChange={props.delChange} editChange={props.editChange} edit={props.edit}
                       del={props.del} insertChange={props.insertChange} insert={props.insert} id={"pic" + i}/>
        </div>
    );
};

const ItemParagragh = (props) => {
    let {item,i,value} = props;
    return (
        <div className="structCanvasKuai">
            <div id={"pic" + i} className="external">
                <div style={{alignItems: 'center',display: 'flex',flexDirection: 'column'}}>
                    <div className="topNum">{item.data.title ? item.data.title : item.spareData.title}</div>
                    <div style={{
                        border: '0px solid black',
                        boxSizing: 'border-box',
                        display: 'flex',
                        WebkitBoxOrient: 'horizontal',
                        flexDirection: 'row',
                        alignContent: 'flex-start',
                        flexShrink: 0,
                        marginTop: '2px',
                    }}>
                        <div style={{
                            border: '0px solid black',
                            boxSizing: 'border-box',
                            display: 'flex',
                            WebkitBoxOrient: 'vertical',
                            flexDirection: 'column',
                            alignContent: 'flex-start',
                            flexShrink: 0,
                            width: '30px',
                            height: '2px',
                            backgroundColor: 'rgb(51, 51, 51)'
                        }}>

                        </div>
                    </div>
                </div>
                <div style={{margin:'6px 0'}}>{item.data.desc ? item.data.desc : item.spareData ? item.spareData.desc : ""}</div>
                {(item.data.images.length > 0 ? item.data.images : item.spareData ? item.spareData.images : []).map((item, index) => {
                    return (
                        <img key={`img${item.picUrl}-${index}`} src={item.picUrl}/>
                    )
                })}
            </div>
            <NewMove i={i} upChange={props.upChange} downChange={props.downChange} length={value.length} initialNumber={1}/>
            <NewOperation i={i} delChange={props.delChange} editChange={props.editChange} edit={props.edit} del={props.del}/>
        </div>
    )
};

const ItemParagraghSelect = (props) => {
    let {item,i,value} = props;
    return (
        <div className="structCanvasKuai">
            <div id={"pic" + i} className="external">
                <div style={{alignItems: 'center',display: 'flex',flexDirection: 'column'}}>
                    <div className="topNum">{item.data.title ? item.data.title : item.spareData ? item.spareData.title : ""}</div>
                    <div style={{
                        border: '0px solid black',
                        boxSizing: 'border-box',
                        display: 'flex',
                        WebkitBoxOrient: 'horizontal',
                        flexDirection: 'row',
                        alignContent: 'flex-start',
                        flexShrink: 0,
                        marginTop: '2px',
                    }}>
                        <div style={{
                            border: '0px solid black',
                            boxSizing: 'border-box',
                            display: 'flex',
                            WebkitBoxOrient: 'vertical',
                            flexDirection: 'column',
                            alignContent: 'flex-start',
                            flexShrink: 0,
                            width: '30px',
                            height: '2px',
                            backgroundColor: 'rgb(51, 51, 51)'
                        }}>

                        </div>
                    </div>
                </div>
                <div  style={{margin:'6px 0'}}>{item.data.desc ? item.data.desc : item.spareData ? item.spareData.desc : ""}</div>
                {(item.data.images.length > 0 ? item.data.images : item.spareData ? item.spareData.images : []).map((item, index) => {
                    return (
                        <img key={`img${item.picUrl}-${index}`} src={item.picUrl}/>
                    )
                })}
            </div>
            <NewMove i={i} upChange={props.upChange} downChange={props.downChange} length={value.length} initialNumber={1}/>
            <NewOperation i={i} delChange={props.delChange} editChange={props.editChange} edit={props.edit} del={props.del}/>
        </div>
    )
};

const ItemFeature = (props) => {//长亮点(已改)
    let {item,i,value,...pProps} = props;
    let {features}=item.data;
    let defaultContent=["长亮点描述", "长亮点描述", "长亮点描述"];
    return(
        <div className="structCanvasKuai">
            <div className="external" id={"pic" + i}>
                <div style={{alignItems: 'center',display: 'flex',flexDirection: 'column'}}>
                    <div className="topNum">{item.moduleInfo.dataSchema.title}</div>
                    <div style={{
                        border: '0px solid black',
                        boxSizing: 'border-box',
                        display: 'flex',
                        WebkitBoxOrient: 'horizontal',
                        flexDirection: 'row',
                        alignContent: 'flex-start',
                        flexShrink: 0,
                        marginTop: '2px',
                    }}>
                        <div style={{
                            border: '0px solid black',
                            boxSizing: 'border-box',
                            display: 'flex',
                            WebkitBoxOrient: 'vertical',
                            flexDirection: 'column',
                            alignContent: 'flex-start',
                            flexShrink: 0,
                            width: '30px',
                            height: '2px',
                            backgroundColor: 'rgb(51, 51, 51)'
                        }}>

                        </div>
                    </div>
                </div>
                {(features&&features.length>0?features:defaultContent).map((item, index) => {
                    return (
                        <div key={`itemFeature-${index}`}>○{item}</div>
                    )
                })}
            </div>
            <NewOperation i={i} {...pProps}/>
        </div>
    )
};

const CepingSeparator = (props) => {
    let obj = {
        "ceping-separator1": {top: "01", title: "评测选品"},
        "ceping-separator2": {top: "02", title: "评测维度"},
        "ceping-separator3": {top: "03", title: "评测结果"}
    };
    let {i,item,value} = props;
    return (
        <div className="structCanvasKuai">
            <div id={"pic" + i} className="external">
                <div className="topNum">{obj[item.name].top}</div>
                <div className="topNum">————</div>
                <div className="topNum">{obj[item.name].title}</div>
            </div>
            <NewMove i={i} upChange={props.upChange} downChange={props.downChange} length={value.length}/>
            <NewOperation i={i} delChange={props.delChange} editChange={props.editChange} edit={props.edit}
                          del={props.del} insertChange={props.insertChange} insert={props.insert} id={"pic" + i}/>
        </div>
    );
};

const WeitaoVerItems = (props) => {
    let {item,i,value} = props;
    let items = item.data.products.length > 0 ? item.data.products : item.spareData.products;
    return (
        <div className="structCanvasKuai">
            <div id={"pic" + i} className="external">
                {items.map((shop,index)=>{
                    return(
                        <ele.Layout.Row gutter="6" key={"verItems" + index}>
                            <ele.Layout.Col span="8">
                                <img src={shop.item_pic}/>
                            </ele.Layout.Col>
                            <ele.Layout.Col span="16">
                                <div style={{opacity: "0.5"}}>{strLen(shop.item_title, 16)}</div>
                                <span style={{color:'rgb(255, 80, 0)'}}>¥{shop.item ? shop.item.price : shop.itemPriceDTO.price.item_current_price}</span>
                            </ele.Layout.Col>
                        </ele.Layout.Row>
                    )
                })}
            </div>
            <NewMove i={i} upChange={props.upChange} downChange={props.downChange} length={value.length}/>
            <NewOperation i={i} delChange={props.delChange} editChange={props.editChange} edit={props.edit}
                          del={props.del} insertChange={props.insertChange} insert={props.insert} id={"pic" + i}/>
        </div>
    );
};

const strLen = (str, len) => {//字符串截取
    let reg = /[\u4e00-\u9fa5]/g,
        slice = str.substring(0, len),
        chineseCharNum = (~~(slice.match(reg) && slice.match(reg).length)),
        realen = slice.length * 2 - chineseCharNum;
    return str.substr(0, realen) + (realen < str.length ? "..." : "");
};

const WeitaoItemPK = (props) => {
    let {item,i,value} = props;
    let items = item.data.items.length > 0 ? item.data.items : item.spareData.items;
    return (
        <div className="structCanvasKuai">
            <div id={"pic" + i} className="external" style={{position: "relation"}}>
                <div style={{
                    border: " 0.5px solid rgb(249, 255, 110)", position: " absolute", boxSizing: " border-box",
                    display: " flex", WebkitBoxOrient: " vertical", flexDirection: " column",
                    alignContent: " flex-start", flexShrink: " 0", left: "249.5px",
                    top: " 85px", width: " 60px", height: " 60px", borderRadius: " 30px",
                    padding: " 2.5px", transform: " translate(-50%, -50%)", zIndex: "100"
                }}>
                    <span style={{
                        whiteSpace: " pre-wrap", border: " 0px solid black", position: " relative",
                        boxSizing: " border-box", display: " inline-block", WebkitBoxOrient: " vertical",
                        flexDirection: " column", alignContent: " flex-start", flexShrink: " 0",
                        fontSize: " 25px", width: " 54px", height: " 54px",
                        lineHeight: " 54px", textAlign: " center", borderRadius: " 27px", backgroundColor: " rgb(255, 144, 0)",
                        backgroundImage: " linear-gradient(to right, rgb(255, 128, 0), rgb(255, 80, 0))", fontWeight: " 300",
                        color: " rgb(255, 255, 255)",
                    }}>PK</span>
                </div>
                <ele.Layout.Row gutter="6">
                    {items.map((shop, s) => {
                        return (
                            <ele.Layout.Col span="12" key={"s" + s}>
                                <img src={shop.item_pic}/>
                                <div style={{opacity: "0.5"}} title={shop.item_title}>{strLen(shop.item_title, 16)}</div>
                                <span style={{color:'rgb(255, 80, 0)'}}>¥{shop.item ? shop.item.price : shop.itemPriceDTO.price.item_current_price}</span>
                            </ele.Layout.Col>
                        )
                    })}
                </ele.Layout.Row>
            </div>
            <NewMove i={i} upChange={props.upChange} downChange={props.downChange} length={value.length}/>
            <NewOperation i={i} delChange={props.delChange} editChange={props.editChange} edit={props.edit}
                          del={props.del} insertChange={props.insertChange} insert={props.insert} id={"pic" + i}/>
        </div>
    );
};

const WeitaoScoreRange = (props) => {
    let {item,i,value} = props;
    let items = (item.data.scores&&item.data.scores.length > 0 )? item.data.scores : item.spareData.scores;
    return (
        <div className="structCanvasKuai">
            <div id={"pic" + i} className="external">
                {items.map((shop, index) => {
                    return(
                        <ele.Layout.Row gutter="6" key={"score" + index}>
                            <ele.Layout.Col span="8">
                                {shop.item_title}
                            </ele.Layout.Col>
                            <ele.Layout.Col span="4">
                                {shop.item_score}分
                            </ele.Layout.Col>
                            <ele.Layout.Col span="12">
                                <ele.Rate showText={true} texts={['', '', '', '', '']} value={shop.item_score}/>
                            </ele.Layout.Col>
                        </ele.Layout.Row>
                    )
                })}
            </div>
            <NewMove i={i} upChange={props.upChange} downChange={props.downChange} length={value.length}/>
            <NewOperation i={i} delChange={props.delChange} editChange={props.editChange} edit={props.edit}
                          del={props.del} insertChange={props.insertChange} insert={props.insert} id={"pic" + i}/>
        </div>
    );
};

const NeedContentBPU = (props) => {
    let {item,i,value} = props;
    let items = item.data.item.length > 0 ? item.data : item.spareData;
    return (
        <div className="structCanvasKuai">
            <div id={"pic" + i} className="external">
                <ele.Layout.Row gutter="6">
                    <ele.Layout.Col span="12">
                        <ele.Tag type="gray">{`top${(items.topNum > 9 ? items.topNum : `0${items.topNum}`)}`}</ele.Tag>{items.title}
                    </ele.Layout.Col>
                    <ele.Layout.Col span="24">
                        <h3>{items.description}</h3>
                    </ele.Layout.Col>
                </ele.Layout.Row>
                {items.item[0].itemBrand ? "|" + items.item[0].itemBrand.brandName : ""}
                <ele.Layout.Row gutter="6">
                    <ele.Layout.Col span="10">
                        <img src={items.item[0].spu_pic}/>
                    </ele.Layout.Col>
                    <ele.Layout.Col span="14">
                        {items.rates.map((shop, index) => {
                            return(
                                <ele.Layout.Row gutter="6" key={"BPU" + index} style={{marginBottom:'6px'}}>
                                    <ele.Layout.Col span="8">
                                        {shop.rateTitle}
                                    </ele.Layout.Col>
                                    <ele.Layout.Col span="16">
                                        <ele.Rate showText={true} texts={['1分', '2分', '3分', '4分', '5分']} value={shop.rateScore}/>
                                    </ele.Layout.Col>
                                </ele.Layout.Row>
                            )
                        })}
                    </ele.Layout.Col>
                </ele.Layout.Row>
            </div>
            <NewMove i={i} upChange={props.upChange} downChange={props.downChange} length={value.length}/>
            <NewOperation i={i} delChange={props.delChange} editChange={props.editChange} edit={props.edit}
                          del={props.del} insertChange={props.insertChange} insert={props.insert} id={"pic" + i}/>
        </div>
    )
};


const CalendarHeaderCard = (props) => {
    let {item, constraint, i} = props;
    let data = item.data.tag ? item.data : (constraint.props.moduleInfos[item.materialId] ? constraint.props.moduleInfos[item.materialId].data : "");
    if (data) {
        return (
            <div className="structCanvasKuai">
                <div id={"pic" + i}>
                    <div style={{
                        border: "0px solid black",
                        position: "relative",
                        boxSizing: "border-box",
                        display: "flex",
                        WebkitBoxOrient: "vertical",
                        flexDirection: "column",
                        alignContent: "flex-start",
                        flexShrink: "0",
                        backgroundColor: "rgb(255, 255, 255)",
                        width: "496px"
                    }}>
                        <div style={{minHeight: "498px"}}>
                            <img style={{padding: "1px", width: "100%"}} src={data.backgroundImg[0].picUrl}/>
                        </div>
                        <div style={{
                            border: "0px solid black",
                            position: "absolute",
                            boxSizing: "border-box",
                            display: "flex",
                            WebkitBoxOrient: "horizontal",
                            flexDirection: "row",
                            alignContent: "flex-start",
                            flexShrink: "0",
                            height: "52px",
                            top: "73.5px"
                        }}>
                            <div style={{
                                border: "0px solid black",
                                position: "relative",
                                boxSizing: "border-box",
                                display: "flex",
                                WebkitBoxOrient: "vertical",
                                flexDirection: "column",
                                placeContent: "flex-start center",
                                flexShrink: "0",
                                marginTop: "0px",
                                height: "52px",
                                paddingLeft: "13px",
                                paddingRight: "30px",
                                WebkitBoxAlign: "start",
                                alignItems: "flex-start",
                                WebkitBoxPack: "center",
                                opacity: "0.9",
                                backgroundColor: "rgb(207, 181, 137)",
                                borderRadius: "0px 50px 50px 0px"
                            }}>
                            <span style={{
                                whiteSpace: "pre-wrap",
                                border: "0px solid black",
                                position: "relative",
                                boxSizing: "border-box",
                                display: "block",
                                WebkitBoxOrient: "vertical",
                                flexDirection: "column",
                                alignContent: "flex-start",
                                flexShrink: "0",
                                fontSize: "22px",
                                fontFamily: "PingFangSC-Medium",
                                color: "rgb(47, 29, 6)"
                            }}>{data.labelTitle}</span>
                            </div>
                        </div>
                        <div style={{
                            border: "0px solid black",
                            position: "absolute",
                            boxSizing: "border-box",
                            display: "flex",
                            WebkitBoxOrient: "vertical",
                            flexDirection: "column",
                            placeContent: "flex-start center",
                            flexShrink: "0",
                            height: "667px",
                            top: "0px",
                            left: "0px",
                            width: "496px",
                            WebkitBoxPack: "center",
                            WebkitBoxAlign: "center",
                            alignItems: "center"
                        }}>
                            <div style={{
                                border: "0px solid black",
                                position: "relative",
                                boxSizing: "border-box",
                                display: "flex",
                                WebkitBoxOrient: "horizontal",
                                flexDirection: "row",
                                placeContent: "flex-start center",
                                flexShrink: "0",
                                width: "496px",
                                height: "420.5px",
                                marginTop: "80px",
                                WebkitBoxPack: "center"
                            }}>
                                <div style={{
                                    border: "0px solid black",
                                    position: "relative",
                                    boxSizing: "border-box",
                                    display: "flex",
                                    WebkitBoxOrient: "vertical",
                                    flexDirection: "column",
                                    placeContent: "flex-start",
                                    flexShrink: "0",
                                    width: "496px",
                                    height: "420.5px",
                                    WebkitBoxPack: "start"
                                }}>
                                    <div style={{
                                        border: "0px solid black",
                                        position: "relative",
                                        boxSizing: "border-box",
                                        display: "flex",
                                        WebkitBoxOrient: "horizontal",
                                        flexDirection: "row",
                                        placeContent: "flex-start space-between",
                                        flexShrink: "0",
                                        marginTop: "222px",
                                        marginBottom: "3px",
                                        WebkitBoxPack: "justify",
                                        paddingLeft: "7px",
                                        paddingRight: "418px",
                                        width: "496px",
                                        WebkitBoxAlign: "center",
                                        alignItems: "center"
                                    }}>
                                    <span style={{
                                        whiteSpace: "nowrap",
                                        border: "0px solid black",
                                        position: "relative",
                                        boxSizing: "border-box",
                                        display: "block",
                                        WebkitBoxOrient: "vertical",
                                        flexDirection: "column",
                                        alignContent: "flex-start",
                                        flexShrink: "0",
                                        fontSize: "12px",
                                        color: "rgb(51, 51, 51)",
                                        fontWeight: "400",
                                        overflow: "hidden"
                                    }}>掌柜吆喝</span>
                                        <img
                                            src="//gw.alicdn.com/tfs/TB1E5BNpMmTBuNjy1XbXXaMrVXa-26-24.png_110x10000.jpg"
                                            style={{
                                                display: "flex",
                                                width: "11.5px",
                                                height: "11.5px",
                                                marginLeft: "1px"
                                            }}/>
                                    </div>
                                    <img src="//gw.alicdn.com/tfs/TB1l9wQqgmTBuNjy1XbXXaMrVXa-37-28.png_110x10000.jpg"
                                         style={{
                                             display: "flex",
                                             width: "15px",
                                             height: "11.5px",
                                             position: "absolute",
                                             top: "262px",
                                             left: "6.5px"
                                         }}/>
                                    <span style={{
                                        whiteSpace: "pre-wrap",
                                        border: "0px solid black",
                                        position: "relative",
                                        boxSizing: "border-box",
                                        display: "-webkit-box",
                                        WebkitBoxOrient: "vertical",
                                        flexDirection: "column",
                                        alignContent: "flex-start",
                                        flexShrink: "0",
                                        fontSize: "20px",
                                        width: "443px",
                                        height: "52px",
                                        color: "rgb(26, 26, 26)",
                                        letterSpacing: "0.485px",
                                        lineHeight: "26px",
                                        fontWeight: "500",
                                        marginLeft: "6px",
                                        marginTop: "0px",
                                        WebkitLineClamp: "2",
                                        overflow: "hidden"
                                    }}>
                                    &nbsp;&nbsp;&nbsp;&nbsp;{data.title}
                                </span>
                                </div>
                            </div>
                        </div>
                        <div style={{
                            border: "0px solid black",
                            boxSizing: "border-box",
                            display: "flex",
                            WebkitBoxOrient: "horizontal",
                            flexDirection: "row",
                            placeContent: "flex-start",
                            flexShrink: "0",
                            marginTop: "5px",
                            marginBottom: "5px",
                            WebkitBoxPack: "start",
                            WebkitBoxAlign: "center",
                            alignItems: "center"
                        }}>
                            <img src="//gw.alicdn.com/tfs/TB16HrgnXuWBuNjSspnXXX1NVXa-62-56.png_110x10000.jpg"
                                 style={{display: "flex", width: "15px", height: "14px", marginLeft: "7.5px"}}/>
                            <span style={{
                                whiteSpace: "nowrap",
                                border: "0px solid black",
                                boxSizing: "border-box",
                                display: "block",
                                WebkitBoxOrient: "vertical",
                                flexDirection: "column",
                                alignContent: "flex-start",
                                flexShrink: "0",
                                fontSize: "14px",
                                color: "rgb(155, 155, 155)",
                                letterSpacing: "0px",
                                textAlign: "right",
                                fontWeight: "200",
                                maxWidth: "200px",
                                textOverflow: "ellipsis",
                                marginTop: "1.5px",
                                overflow: "hidden"
                            }}>{data.shopDetail[0].shop_title}</span>
                            <span style={{
                                whiteSpace: "nowrap",
                                border: "0px solid black",
                                boxSizing: "border-box",
                                display: "block",
                                WebkitBoxOrient: "vertical",
                                flexDirection: "column",
                                alignContent: "flex-start",
                                flexShrink: "0",
                                fontSize: "16px",
                                marginLeft: "5px",
                                marginRight: "5px",
                                color: "rgb(155, 155, 155)",
                                fontWeight: "200",
                                overflow: "hidden"
                            }}>|</span>
                            <span style={{
                                whiteSpace: "nowrap",
                                border: "0px solid black",
                                boxSizing: "border-box",
                                display: "block",
                                WebkitBoxOrient: "vertical",
                                flexDirection: "column",
                                alignContent: "flex-start",
                                flexShrink: "0",
                                fontSize: "14px",
                                color: "rgb(155, 155, 155)",
                                letterSpacing: "0px",
                                textAlign: "right",
                                fontWeight: "200",
                                maxWidth: "200px",
                                textOverflow: "ellipsis",
                                marginTop: "1.5px",
                                overflow: "hidden"
                            }}>{data.tag}</span>
                        </div>
                        <div style={{
                            border: "0px solid black",
                            position: "relative",
                            boxSizing: "border-box",
                            display: "flex",
                            WebkitBoxOrient: "horizontal",
                            flexDirection: "row",
                            placeContent: "flex-start space-between",
                            flexShrink: "0",
                            marginTop: "0px",
                            WebkitBoxPack: "justify",
                            paddingLeft: "3.5px",
                            paddingRight: "3px",
                            width: "349px"
                        }}>
                            <img src={data.firstGoods[0].item_pic}
                                 style={{display: "flex", width: "120px", height: "120px"}}/>
                        </div>
                        <span style={{margin: "0 2px"}}>
                        {data.summary}
                    </span>
                        <img src={creationShop} style={{width: "100%"}}/>
                    </div>
                </div>
                <NewOperation i={i} delChange={props.delChange} editChange={props.editChange} edit={props.edit}
                              del={props.del} insertChange={props.insertChange} insert={props.insert} id={"pic" + i}/>
            </div>
        )
    } else {
        return (
            <div>

            </div>
        )
    }
};

const GoodshopShendianShop = (props) => {
    let {item, i, constraint} = props;
    let data = (item.data.shop_cover && item.data.shop_cover.length > 0) ? item.data : (constraint.props.moduleInfos[item.materialId] ? constraint.props.moduleInfos[item.materialId].data : "");
    if (data) {
        return (
            <div className="structCanvasKuai">
                <div id={"pic" + i}>
                    <img src={shop1} style={{width: "100%"}}/>
                    <div style={{
                        border: "0px solid black",
                        position: "relative",
                        boxSizing: "border-box",
                        display: "flex",
                        WebkitBoxOrient: "vertical",
                        flexDirection: "column",
                        alignContent: "flex-start",
                        flexShrink: "0",
                        backgroundColor: "rgb(255, 255, 255)",
                        width: "496px"
                    }}>
                        <img style={{
                            height: "200px", width: "496px", marginLeft: "1px",
                            backgroundImage: 'url("' + data.shop_cover[0].picUrl + '")',
                            backgroundPosition: "center"
                        }}/>
                        <div style={{
                            border: "0px solid black",
                            position: "absolute",
                            boxSizing: "border-box",
                            display: "flex",
                            WebkitBoxOrient: "vertical",
                            flexDirection: "column",
                            placeContent: "flex-start center",
                            flexShrink: "0",
                            height: "100px",
                            top: "0px",
                            left: "0px",
                            width: "496px",
                            WebkitBoxPack: "center",
                            WebkitBoxAlign: "center",
                            alignItems: "center"
                        }}>
                            <div style={{
                                border: "0px solid black",
                                position: "relative",
                                boxSizing: "border-box",
                                display: "flex",
                                WebkitBoxOrient: "horizontal",
                                flexDirection: "row",
                                placeContent: "flex-start center",
                                flexShrink: "0",
                                width: "496px",
                                height: "420.5px",
                                marginTop: "80px",
                                WebkitBoxPack: "center"
                            }}>
                                <div style={{
                                    border: "0px solid black",
                                    position: "relative",
                                    boxSizing: "border-box",
                                    display: "flex",
                                    WebkitBoxOrient: "vertical",
                                    flexDirection: "column",
                                    placeContent: "flex-start",
                                    flexShrink: "0",
                                    width: "496px",
                                    height: "420.5px",
                                    WebkitBoxPack: "start"
                                }}>
                                    <div style={{
                                        border: "0px solid black",
                                        position: "relative",
                                        boxSizing: "border-box",
                                        display: "flex",
                                        WebkitBoxOrient: "horizontal",
                                        flexDirection: "row",
                                        placeContent: "flex-start space-between",
                                        flexShrink: "0",
                                        marginTop: "222px",
                                        marginBottom: "3px",
                                        WebkitBoxPack: "justify",
                                        paddingLeft: "7px",
                                        paddingRight: "418px",
                                        width: "496px",
                                        WebkitBoxAlign: "center",
                                        alignItems: "center"
                                    }}>
                                    <span style={{
                                        whiteSpace: "nowrap",
                                        border: "0px solid black",
                                        position: "relative",
                                        boxSizing: "border-box",
                                        display: "block",
                                        WebkitBoxOrient: "vertical",
                                        flexDirection: "column",
                                        alignContent: "flex-start",
                                        flexShrink: "0",
                                        fontSize: "12px",
                                        color: "rgb(51, 51, 51)",
                                        fontWeight: "400",
                                        overflow: "hidden"
                                    }}>掌柜吆喝</span>
                                        <img
                                            src="//gw.alicdn.com/tfs/TB1E5BNpMmTBuNjy1XbXXaMrVXa-26-24.png_110x10000.jpg"
                                            style={{
                                                display: "flex",
                                                width: "11.5px",
                                                height: "11.5px",
                                                marginLeft: "1px"
                                            }}/>
                                    </div>
                                    <img src="//gw.alicdn.com/tfs/TB1l9wQqgmTBuNjy1XbXXaMrVXa-37-28.png_110x10000.jpg"
                                         style={{
                                             display: "flex",
                                             width: "15px",
                                             height: "11.5px",
                                             position: "absolute",
                                             top: "262px",
                                             left: "6.5px"
                                         }}/>
                                    <span style={{
                                        whiteSpace: "pre-wrap",
                                        border: "0px solid black",
                                        position: "relative",
                                        boxSizing: "border-box",
                                        display: "-webkit-box",
                                        WebkitBoxOrient: "vertical",
                                        flexDirection: "column",
                                        alignContent: "flex-start",
                                        flexShrink: "0",
                                        fontSize: "20px",
                                        width: "443px",
                                        height: "52px",
                                        color: "rgb(26, 26, 26)",
                                        letterSpacing: "0.485px",
                                        lineHeight: "26px",
                                        fontWeight: "500",
                                        marginLeft: "6px",
                                        marginTop: "0px",
                                        WebkitLineClamp: "2",
                                        overflow: "hidden"
                                    }}>
                                        &nbsp;&nbsp;&nbsp;&nbsp;{data.shop_desc}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div style={{position: "absolute", marginLeft: "10px"}}>
                            <ele.Tag type="success">{data.shop_tag}</ele.Tag>
                        </div>
                    </div>
                    <div style={{marginLeft: "5px"}}>{data.shopDetail[0].shop_title}</div>
                    <img src={shop2} style={{width: "100%"}}/>
                </div>
                <NewOperation i={i} delChange={props.delChange} editChange={props.editChange} edit={props.edit}
                              del={props.del} insertChange={props.insertChange} insert={props.insert} id={"pic" + i}/>
            </div>
        )
    } else {
        return (
            <div>

            </div>
        )
    }
};

export {
    SingleItemInventory,
    Picture,
    ShopInventorySeparator,
    TwoColumnItem,
    ContentShop,
    Paragraph,
    ItemParagragh,
    ItemParagraghSelect,
    ItemFeature,
    CepingSeparator,
    WeitaoVerItems,
    WeitaoItemPK,
    WeitaoScoreRange,
    NeedContentBPU,
    CalendarHeaderCard,
    GoodshopShendianShop
};

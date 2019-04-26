/**
 * Created by muqingzhong on 2017/7/18.
 */
import $ from 'jquery';
import React from 'react';
import {Layout, Dialog, Tabs, Input, Message, Tag, Alert, Form, Button,Notification} from 'element-react';
import 'element-theme-default';
import ItemGet from '../../util/itemGet';
import {getUrlPat, localImgSize, clone, urlAnalysis} from '../../util/global';
import UpImages from './UpImages';
import '../../../../styles/component/react_assembly/UpItem.js.css';
import AJAX from '../../newUtil/AJAX';
import {ThousandsOfCall} from '../../util/ThousandsOfCall';
import SelectItemsPond from '../../sharing/selectionOfPool/selectItemsPond';
import SelectionOfPool from '../../sharing/selectionOfPool/SelectionOfPool';
import Cropper from "./Cropper";
require("../../util/jquery-ui.min");


/**
 * 使用方法
 *   <UpIitem ref='addItemModal' callback={this.addItemCallback}/>
 *   打开需要调用open();
 *   标题字数限制 需要传入 props minTitle maxTitle
 *   需要描述 请传 description 描述字段限制  minDescription  maxDescription
 */

class UpIitem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            key: '1',
            showModal: false,
            itemUrl: "",
            item: undefined,
            spareImg: [],
            spareImg2: [],
            extraBanners: [],
            select: true,
            disabled: false,
            data: {},
            da: {},
            pond: {},
            selectionChange: 0,
            getUrl: {
                w: 750,
                h: 750
            }
        };
        this.open = this._open.bind(this);
        this.close = this._close.bind(this);
        this.itemUrlChange = this._itemUrlChange.bind(this);
        this.itemTitleChange = this._itemTitleChange.bind(this);
        this.editChange = this._editChange.bind(this);
        this.clickUpImg = this._clickUpImg.bind(this);
        this.itemDescriptionChange = this._itemDescriptionChange.bind(this);
        this.handleSelect = this._handleSelect.bind(this);
    }

    componentDidMount() {
        this.sort();
    }

    componentDidUpdate() {
        this.sort();
    }

    sort = () => {
        $("#sortable_ex").sortable().disableSelection().unbind("sortstop").on("sortstop", (event, ui) => {
            let items = ui.item;

            let index = items.children("img").data("i");
            let w = items.width() + 30;
            let h = items.height() + 30;

            let top = ui.position.top;//当前的位置
            let left = ui.position.left;

            let originalTop = ui.originalPosition.top;//元素的原始位置
            let originalLeft = ui.originalPosition.left;

            let paW = $("#sortable_ex").width();
            let lineNum = Math.round(paW / w);
            let sl = Math.round((left - originalLeft) / w);
            sl += Math.round((top - originalTop) / h) * lineNum;

            let extraBanners = this.state.extraBanners;
            let albIt = extraBanners.splice(index, 1)[0];
            extraBanners.splice(index + sl, 0, albIt);
            this.setState({extraBanners: extraBanners});
        });
    };

    setThisState = (state, callback) => {
        this.setState(state, function () {
            if (callback && (typeof callback) == 'function') {
                callback();
            }
        });
    };


    _open(data, t) {
        this.setState({
            showModal: true,
            item: data,
            itemUrl: (data ? (data.detailUrl) : ""),
            extraBanners: data ? (data.extraBanners ? data.extraBanners : []) : []
        }, () => {
            if (data) {
                this.editChange();
            }
            if (t === "禁用") {
                this.setState({disabled: true});
            }
        });
    }

    _close() {
        this.setState({
            showModal: false,
            spareImg: [],
            spareImg2: [],
            itemUrl: "",
            select: true,
            key: '1',
            disabled: false,
        });
    }

    _handleSelect(env) {
        let p = env.props ? env.props.name : env;
        this.setState({key: p}, () => {
            if (p == 2 && this.state.select) {
                this.refs.selectionOfPool.goPage(1);
                this.setState({select: false});
            } else if (p == 3) {
                this.refs.getImemData.getactivityIdAndPoolId();
            }
        });
    };

    _editChange() {
        let itemUrl = this.state.itemUrl;
        let numIid = getUrlPat(itemUrl, "id");
        ItemGet.ajaxItem({
            id: numIid,itemUrl:itemUrl,
            callback: (data) => {
                if (data) {
                    let item = this.state.item;
                    let cleanImages = data.cleanImages;
                    let t = [];
                    for (let i in cleanImages) {
                        if (i < 20) {
                            t.push(cleanImages[i]);
                        }
                    }
                    item.cleanImages = t;
                    this.setState({item: item});
                }
            }
        });
    }

    _itemUrlChange(env, it) {
        let zujian = this;
        let itemUrl = it ? it : (env.value ? env.value : env.target ? env.target.value : "");
        this.setState({itemUrl: itemUrl}, () => {
            if (itemUrl) {
                itemUrls();

                function itemUrls() {
                    let itemUrl = zujian.state.itemUrl;
                    let numIid = getUrlPat(itemUrl, "id");
                    let activityId = zujian.props.activityId;

                    let arrItem = [];
                    {
                        (zujian.props.judge) ? (zujian.props.data ? zujian.props.data : []).map((item) => {
                            arrItem.push("" + item.data.itemId);
                        }) : (zujian.props.data ? zujian.props.data : []).map((item) => {
                            arrItem.push("" + item.itemId);
                        })
                    }
                    if (arrItem.indexOf("" + numIid) == -1) {
                        let cid = zujian.props.isRowHeay;
                        if (cid) {
                            ItemGet.itemrowHeay(cid, numIid, () => {
                            });
                        }
                        ItemGet.itemUrlActivityId({activityId: activityId, itemUrl: itemUrl}, (da) => {
                            let item = {
                                coverUrl: da.url,
                                description: zujian.state.item ? (zujian.state.item.description ? zujian.state.item.description : "") : "",
                                detailUrl: "https:" + da.item.itemUrl,
                                cleanImages: da.images,
                                images: clone(da.images),
                                itemId: da.item.itemId,
                                price: da.item.finalPrice,
                                resourceUrl: da.item.itemUrl,
                                title: da.title,
                                materialId: da.materialId
                            };

                            ItemGet.getSearch({//搜全站获取
                                url: "https:" + da.item.itemUrl, callback: (data) => {
                                    if (data.mods) {
                                        let auctions = data.mods.itemlist.data.auctions[0];
                                        if (auctions) {
                                            item.q_score = auctions.q_score;
                                            let icon = auctions.icon;
                                            let pd = false;
                                            for (let i in icon) {
                                                if (icon[i].innerText == "营销") {
                                                    pd = true;
                                                    break;
                                                }
                                            }
                                            if (pd) {
                                                item.icon = true;
                                            } else {
                                                item.icon = false;
                                                Notification({
                                                    title: '警告',
                                                    message: '不符合新7条',
                                                    type: 'warning'
                                                });
                                            }
                                        } else {
                                            Notification({
                                                title: '警告',
                                                message: '无法判断新七条',
                                                type: 'warning'
                                            });
                                        }
                                    }
                                    zujian.setState({item: item}, () => {
                                        localImgSize(item.coverUrl, (w, h) => {//获取图片大小
                                            let obj = {w: w, h: h};
                                            zujian.setState({w_h: obj});
                                        });
                                        ItemGet.ajaxItem({
                                            itemUrl:itemUrl,
                                            id: numIid, callback: (data) => {
                                                if (data != undefined) {
                                                    let item = zujian.state.item;
                                                    let cleanImages = data.cleanImages;
                                                    item.nick = data.nick;
                                                    item.yongjin = data.yongjin;
                                                    item.isInPond = data.isInPond;
                                                    item.isRelease = data.isRelease;
                                                    for (let i in cleanImages) {
                                                        if (i < 20) {
                                                            item.cleanImages.push(cleanImages[i]);
                                                        }
                                                    }
                                                    zujian.setState({item: item});
                                                } else {
                                                    urlAnalysis(da.item.itemUrl, (data) => {
                                                        ThousandsOfCall.acoustic(
                                                            {
                                                                agreement: data.agreement,
                                                                hostname: data.hostname,
                                                                path: data.path,
                                                                data: data.data,
                                                                method: "get",
                                                                referer: "https://taobao.com/",
                                                            }, "request", (msg) => {
                                                                let json = msg.data;
                                                                let url_jc = (img) => {
                                                                    if (img.indexOf('_60') > -1) {
                                                                        img = img.split('_60')[0];
                                                                    } else if (img.indexOf('_50') > -1) {
                                                                        img = img.split('_50')[0];
                                                                    } else if (img.indexOf('_30') > -1) {
                                                                        img = img.split('_30')[0];
                                                                    }
                                                                    return img;
                                                                };
                                                                let item = zujian.state.item;
                                                                let J_img = json.split("J_UlThumb")[1];
                                                                let J_img1 = J_img.split("ul")[0];
                                                                let arr = [], arr1 = [];
                                                                if (J_img1.indexOf('src="') > -1) {
                                                                    let J_img2 = J_img1.split('src="');
                                                                    J_img2.shift();
                                                                    for (let j in J_img2) {
                                                                        arr.push(url_jc(J_img2[j].split('"')[0]));
                                                                    }
                                                                } else if (J_img1.indexOf('data-src="') > -1) {
                                                                    let J_img2 = J_img1.split('data-src="');
                                                                    J_img2.shift();
                                                                    for (let j in J_img2) {
                                                                        arr.push(url_jc(J_img2[j].split('"')[0]));
                                                                    }
                                                                }
                                                                if (json.indexOf('background:url(') > -1) {
                                                                    let J_img2 = json.split('background:url(');
                                                                    J_img2.shift();
                                                                    for (let j in J_img2) {
                                                                        arr1.push(url_jc(J_img2[j].split(')')[0]));
                                                                    }
                                                                }
                                                                item.cleanImages = item.cleanImages.concat(arr1, arr);
                                                                zujian.setState({item: item});
                                                            })
                                                    });
                                                    this.upItemAjax.ajax({
                                                        url: "/content/admin/content/capture.io",
                                                        data: {url: itemUrl},
                                                        callback: (data) => {
                                                            item.nick = data.nick;
                                                            zujian.setState({item: item});
                                                        }
                                                    })
                                                }
                                            }
                                        })
                                    })
                                }
                            });
                        });
                    } else {
                        Notification({
                            title: '警告',
                            message: '商品添加重复',
                            type: 'warning'
                        });
                    }
                }
            }
        });
    }

    _itemTitleChange(env) {
        let title = env.value;
        let item = this.state.item;
        item.title = title;
        let titleHint = undefined;
        let minTitle = this.props.minTitle;
        let maxTitle = this.props.maxTitle;
        if (minTitle && minTitle > title.length) {
            titleHint = "不能少于" + minTitle + "个字";
        } else if (maxTitle && maxTitle < title.length) {
            titleHint = "不能大于" + maxTitle + "个字";
        }

        this.setState({item: item, titleHint: titleHint});
    }

    _itemDescriptionChange(env) {
        let description = env.value;
        let item = this.state.item;
        item.description = description;
        let descriptionHint = undefined;
        let minDescription = this.props.minDescription;
        let maxDescription = this.props.maxDescription;
        if (minDescription && minDescription > description.length) {
            descriptionHint = "不能少于" + minDescription + "个字";
        } else if (maxDescription && maxDescription < description.length) {
            descriptionHint = "不能大于" + maxDescription + "个字";
        }

        this.setState({item: item, descriptionHint: descriptionHint});
    }


    _clickUpImg() {
        this.setState({
            imgCallback: (url, pa, img) => {
                let item = this.state.item;
                item.coverUrl = url;
                let images = item.cleanImages;
                if (images) {
                    images.unshift(url);
                }
                this.setState({item: item}, () => {
                    localImgSize(url, (w, h) => {
                        let obj = {w: w, h: h};
                        this.setState({w_h: obj});
                    });
                });
            }
        }, () => {
            this.refs.addImgModal.open();
        });

    }

    selectionChange = () => {
        this.setState({selectionChange: 1});
    };
    cutOut = () => {
        let img = this.state.item.coverUrl;
        let data = {"picUrl": img};
        let s = {
            type: "originaljson",
            dataType: "jsonp",
            //api: this.props.kind?"mtop.taobao.luban.dapei.cutandcroppic":"mtop.taobao.luban.dapei.cutpic",
            api: "mtop.taobao.luban.dapei.cutandcroppic",
            v: "1.0",
            appKey: 12574478,
            t: new Date().getTime(),
            jsv: "2.3.18",
            ecode: 1,
        };
        ThousandsOfCall.acoustic({
            parameters: s,
            requesData: data,
            host: "https://acs.m.taobao.com/h5",
            ajaxData: {requeryType: "get", referer: "https://h5.m.taobao.com"}
        }, "requestH5", (msg) => {
            if (msg.success) {
                let data = msg.data;
                if (data) {
                    let item = this.state.item;
                    item.coverUrl = data.result;
                    this.setState({item: item});
                } else {
                    Message({
                        message: '该功能不能使用！请更新选品插件！',
                        type: 'warning'
                    });
                    /*  new noty({
                          text: '该功能不能使用！请更新选品插件！',
                          type: 'warning',
                          layout: 'topCenter',
                          theme: 'bootstrap-v4',
                          timeout: 3000,
                          modal: false,
                          animation: {
                              open: 'noty_effects_open',
                              close: 'noty_effects_close'
                          },
                      }).show();*/
                }
            } else {
                Message({
                    message: '获取失败',
                    type: 'warning'
                });
                // currencyNoty('获取失败','warning')
            }
        });
    };

    getUrlGe = (env) => {
        let i = $(env.target).data("i");
        let value = env.target.value;
        let {getUrl} = this.state;
        getUrl[i] = value;
        this.setState({getUrl: getUrl});
    };

    standardPic = () => {
        let {item, getUrl} = this.state;
        let pixFilter = getUrl.w + "x" + getUrl.h;
        let callback = (url) => {
            item.coverUrl = url;
            this.setState({item: item});
        };
        this.setState({pixFilter: pixFilter, callback: callback}, () => {
            localImgSize(item.coverUrl, (w, h) => {
                this.cropper.open(item.coverUrl, {w: w, h: h}, {picWidth: w, picHeight: h});
            });
        });
    };

    jiyoujia_Of = (val, collocationItemKind, id, callback) => {
        let data = {"industry": val == '极有家' ? "jiyoujia" : 'ifashion', "collocationItemKind": collocationItemKind, "itemId": id};
        let s = {
            type: "originaljson",
            dataType: "jsonp",
            api: "mtop.taobao.luban.dapei.checkitemallowed",
            v: "1.0",
            appKey: 12574478,
            t: new Date().getTime(),
            jsv: "2.4.3",
            ecode: 1,
        };

        ThousandsOfCall.acoustic({
            parameters: s,
            requesData: data,
            host: "https://h5api.m.taobao.com/h5",
            ajaxData: {requeryType: "POST", referer: "https://we.taobao.com/"}
        }, "requestH5", (data) => {

            if (data.success) {
                if (data.data.allowed) {
                    callback();
                } else {
                    Notification({
                        title: '警告',
                        message:data.data.reason,
                        type: 'warning'
                    });
                    //currencyNoty(data.data.reason, "warning");
                }
            } else {
                Notification({
                    title: '警告',
                    message: '获取失败',
                    type: 'warning'
                });

                //currencyNoty("获取失败", "warning");
            }
        });
    };

    render() {
        let {w_h,key} = this.state;
        let rules = {
            title: [
                {required: true, message: '请输入宝贝标题', trigger: 'blur'},
                {
                    validator: (rule, value, callback) => {
                        if (value === '') {
                            callback(new Error('请输入宝贝标题'));
                        } else if (value.length < this.props.minTitle) {
                            callback(new Error('不能小于' + this.props.minTitle + '个字'));
                        } else if (value.length > this.props.maxTitle) {
                            callback(new Error('不能大于' + this.props.maxTitle + '个字'));
                        } else {
                            callback();
                        }
                    }
                }
            ],
            description: [
                {required: true, message: '请输入宝贝描述', trigger: 'blur'},
                {
                    validator: (rule, value, callback) => {
                        if (value === '') {
                            callback(new Error('请输入宝贝描述'));
                        } else if (value.length < this.props.minDescription) {
                            callback(new Error('不能小于' + this.props.minDescription + '个字'));
                        } else if (value.length > this.props.maxDescription) {
                            callback(new Error('不能大于' + this.props.maxDescription + '个字'));
                        } else {
                            callback();
                        }
                    }
                }
            ],
        };
        return (
            <AJAX ref={e => this.upItemAjax = e}>
                <Dialog title="上传商品" size={this.props.size?this.props.size:'small'} visible={this.state.showModal} onCancel={() => this.setState({key:'1',showModal: false})} lockScroll={false}>
                    <Dialog.Body>
                        <Tabs type="card" value={key} onTabClick={this.handleSelect}>
                            <Tabs.Pane label="添加商品" activeName='1' name="1">
                                <Input value={this.state.itemUrl} onChange={(value) => {
                                    this.itemUrlChange({value: value})
                                }} placeholder="请输入产品链接" prepend="商品链接"/>
                                {this.state.item ?
                                    <Layout.Row ClassName="clearfix maTop" style={{marginTop: '20px'}}>
                                        <Layout.Col sm={8} className="coverUrlCss">
                                            <div className="thumbnail" style={{position: "relative"}}>
                                                <img src={this.state.item.coverUrl} className="item_bj"
                                                     onClick={this.clickUpImg}/>
                                            </div>
                                            {w_h &&
                                            <div style={{textAlign: "center", cursor: "pointer", marginTop: "-22px"}}>
                                                <Tag type="success">{w_h.w + "X" + w_h.h}</Tag>
                                            </div>}
                                            <div style={{textAlign: "center", cursor: "pointer", marginTop: "2px"}}>
                                                <div onClick={this.cutOut}><Tag type="primary">智能抠图</Tag></div>
                                            </div>
                                        </Layout.Col>
                                        <Layout.Col sm={16}>
                                            <Tag type="success" className="ma"> 价格:{this.state.item.price}</Tag>
                                            <Tag type="danger" className="ma">
                                                佣金:{this.state.item.yongjin + "%"}</Tag>{/*(this.state.item.yongjin / 100)*/}
                                            <Tag type="primary" className="ma">{this.state.item.q_score}</Tag>
                                            {this.state.item.icon && <Tag type="warning" className="ma">新7条</Tag>}

                                            <Form ref="item" model={this.state.item} rules={rules} labelWidth="100">
                                                <Form.Item label="宝贝标题" prop='title'>
                                                    <Input placeholder="宝贝标题" value={this.state.item.title} onChange={(value) => {
                                                        this.itemTitleChange({value: value})
                                                    }}
                                                           append={this.state.item.title.length + (this.props.minTitle ? ("/" + this.props.minTitle) : "") + (this.props.maxTitle ? ("/" + this.props.maxTitle) : "")}/>
                                                </Form.Item>
                                                {this.props.description && <Form.Item label="商品描述" prop='description'>
                                                    <Input placeholder="商品描述" type='textarea' value={this.state.item.description} onChange={(value) => {
                                                        this.itemDescriptionChange({value: value})
                                                    }}
                                                           append={this.state.item.description.length + (this.props.minDescription ? ("/" + this.props.minDescription) : "") + (this.props.maxDescription ? ("/" + this.props.maxDescription) : "")}/>
                                                    <span style={{
                                                        position: 'absolute',
                                                        top: '55px',
                                                        right: '20px'
                                                    }}> {this.state.item.description.length + (this.props.minDescription ? ("/" + this.props.minDescription) : "") + (this.props.maxDescription ? ("/" + this.props.maxDescription) : "")} </span>
                                                </Form.Item>}
                                            </Form>
                                            {/*        {this.state.titleHint && <Alert type="error" title={this.state.titleHint} closable={false}/>}*/}
                                            {/*  {this.props.description ? <div className="maTop">
                                                <ControlLabel>商品描述</ControlLabel>
                                                <FormControl value={this.state.item.description} componentClass="textarea" placeholder="商品描述" onChange={this.itemDescriptionChange}/>
                                                <span
                                                    className="descriptionNum"> {this.state.item.description.length + (this.props.minDescription ? ("/" + this.props.minDescription) : "") + (this.props.maxDescription ? ("/" + this.props.maxDescription) : "")} </span>
                                            </div> : undefined}*/}


                                            {this.state.descriptionHint && <Alert title={this.state.descriptionHint} type="error" closable={false}/>}
                                            {this.props.isRowHeay == 1 ? <div>

                                                {this.state.item.isInPond ?
                                                    <Alert type="error" title='检测到该宝贝已经被好货收录，不建议添加' closable={false}/> : this.state.item.isRelease ?
                                                        <Alert title='未检测到该宝贝被好货收录，但是已经被其他达人抢先发布到达人后台' type="warning" closable={false}/> :
                                                        <Alert title='暂未检测到该商品好货入库信息' type="info" closable={false}/>}
                                            </div> : undefined}


                                            {this.props.selectedImgPoint ?
                                                <Layout.Col sm={24} style={this.state.spareImg.length > 0 ? {
                                                    border: "1px solid #bce8f1",
                                                    marginTop: "15px"
                                                } : {}}>
                                                    <Layout.Row gutter="35">
                                                        {this.state.spareImg.map((item, i) => {
                                                            return (
                                                                <Layout.Col sm={6} key={i + "key"} className="deleteSpare">
                                                                    <img src={item}/>
                                                                    <div onClick={() => {
                                                                        let spareImg = this.state.spareImg;
                                                                        spareImg.splice(i, 1);
                                                                        this.setState({spareImg: spareImg});
                                                                    }}><Tag type="danger">删除备用图1</Tag></div>

                                                                    {/*<Image src={item} thumbnail/>*/}
                                                                    {/*<Label bsStyle="danger" className="deleteSpare_t"
                                                                       onClick={() => {
                                                                           let spareImg = this.state.spareImg;
                                                                           spareImg.splice(i, 1);
                                                                           this.setState({spareImg: spareImg});
                                                                       }}>删除备用图1</Label>*/}
                                                                </Layout.Col>
                                                            )
                                                        })}
                                                    </Layout.Row>
                                                </Layout.Col> : undefined}
                                            {this.props.selectedImgPoint2 ?
                                                <Layout.Col sm={24} style={this.state.spareImg2.length > 0 ? {
                                                    border: "1px solid #5cb85c",
                                                    marginTop: "5px"
                                                } : {}}>
                                                    <Layout.Row gutter="35">
                                                        {this.state.spareImg2.map((item, i) => {
                                                            return (
                                                                <Layout.Col sm={6} key={i + "key"} className="deleteSpare">
                                                                    <img src={item} className="item_bj"/>
                                                                    <div onClick={() => {
                                                                        let spareImg2 = this.state.spareImg2;
                                                                        spareImg2.splice(i, 1);
                                                                        this.setState({spareImg2: spareImg2});
                                                                    }}><Tag type='danger' className="deleteSpare_t">删除备用图2</Tag></div>
                                                                </Layout.Col>
                                                            )
                                                        })}
                                                    </Layout.Row>
                                                </Layout.Col> : undefined}
                                        </Layout.Col>
                                        {this.props.enableExtraBanner ?
                                            <Layout.Col sm={24}>
                                                <Layout.Row gutter="35">
                                                    <div id="sortable_ex">
                                                        {this.state.extraBanners.map((item, i) => {
                                                            return (
                                                                <Layout.Col sm={4} md={4} key={item + i} className="deleteSpare">
                                                                    <img src={item} className="image" data-i={i}/>
                                                                    <div onClick={() => {
                                                                        let extraBanners = this.state.extraBanners;
                                                                        extraBanners.splice(i, 1);
                                                                        this.setState({extraBanners: extraBanners});
                                                                    }}><Tag type="danger" className="deleteSpare_t">删除补充图</Tag></div>
                                                                </Layout.Col>
                                                            )
                                                        })}
                                                    </div>
                                                    <Layout.Col sm={4} className="itemM_pic">
                                                        <img src="https://img.alicdn.com/imgextra/i1/772901506/TB2oeLpihhmpuFjSZFyXXcLdFXa_!!772901506.jpg"
                                                             onClick={() => {
                                                                 this.setState({
                                                                     imgCallback: (url) => {
                                                                         let extraBanners = this.state.extraBanners;
                                                                         extraBanners.push(url);
                                                                         this.setState({extraBanners: extraBanners});
                                                                     }
                                                                 }, () => {
                                                                     this.refs.addImgModal.open();
                                                                 });
                                                             }}/>
                                                    </Layout.Col>
                                                </Layout.Row>
                                            </Layout.Col> : undefined}
                                        {this.props.enableExtraBanner ?
                                            <Layout.Col sm={24}>
                                                <Alert title='请在下方图片或者上传图片中，添加3~5张补充图' type="warning" closable={false}/>
                                            </Layout.Col> : undefined}
                                        <Layout.Col sm={24} className="maTop ">
                                            <Button type="primary" size="small" style={{width: '100%'}} onClick={() => {
                                                let item = this.state.item;
                                                let {matchingChannel, collocationItemKind} = this.props;
                                                if (item) {
                                                    if (matchingChannel) {
                                                        this.jiyoujia_Of(matchingChannel, collocationItemKind, item.itemId, () => {
                                                            delete item.cleanImages;
                                                            this.props.callback(item);
                                                            this.close();
                                                        });
                                                    } else {
                                                        if (this.props.enableExtraBanner) {
                                                            item.extraBanners = this.state.extraBanners;
                                                            delete item.cleanImages;
                                                            this.props.callback(item, this.state.spareImg, this.state.spareImg2);
                                                            this.close();
                                                        } else {
                                                            delete item.cleanImages;
                                                            this.props.callback(item, this.state.spareImg, this.state.spareImg2);
                                                            this.close();
                                                        }
                                                    }
                                                }
                                            }}>提交</Button>
                                        </Layout.Col>
                                        <Layout.Col sm={24}>
                                            <Layout.Row gutter='30'>
                                                {(this.state.item.cleanImages ? this.state.item.cleanImages : []).map((item, i) => {
                                                    let form = undefined;
                                                    let arr = item.split(".");
                                                    form = arr[arr.length - 1].length > 6 ? "" : arr[arr.length - 1];
                                                    localImgSize(item, (w, h) => {
                                                        setTimeout(() => {
                                                            let format = w + "X" + h;
                                                            if (this.props.selectedImgPoint) {
                                                                if (w == h && w >= 500) {
                                                                    $(".itemcimgkey" + i + " .imgsize").remove();
                                                                    $(".itemcimgkey" + i).append("<div><span class='imgsize' style='position: relative;top: -54px;color: white;background:green ; padding: 2px;left: 49px;'>" + format + "<span style='color: black;'> " + form + "</span></span></div>")
                                                                } else {
                                                                    $(".itemcimgkey" + i + " .imgsize").remove();
                                                                    $(".itemcimgkey" + i).append("<div><span class='imgsize' style='position: relative;top: -54px;color: white;background: red;padding: 2px;left: 49px;'>" + format + "<span style='color: black;'> " + form + "</span></span></div>")
                                                                }
                                                            } else {
                                                                if (w == h && w >= 500) {
                                                                    $(".itemcimgkey" + i + " .imgsize").remove();
                                                                    $(".itemcimgkey" + i).append("<span class='imgsize' style='position: relative;top: -54px;color: white;background:green ; padding: 2px;left: 49px;'>" + format + "<span style='color: black;'> " + form + "</span></span>")
                                                                } else {
                                                                    $(".itemcimgkey" + i + " .imgsize").remove();
                                                                    $(".itemcimgkey" + i).append("<span class='imgsize' style='position: relative;top: -54px;color: white;background: red;padding: 2px;left: 49px;'>" + format + "<span style='color: black;'> " + form + "</span></span>")
                                                                }
                                                            }
                                                        }, 200);
                                                    });

                                                    return (<Layout.Col sm={6} key={item + "-" + i}  className={"itemcimgkey" + i}>
                                                        <div className="thumbnail" style={{position: "relative"}}>
                                                            <img src={item} onClick={() => {
                                                                let it = this.state.item;
                                                                it.coverUrl = item;
                                                                this.setState({item: it}, () => {
                                                                    localImgSize(item, (w, h) => {
                                                                        let obj = {w: w, h: h};
                                                                        this.setState({w_h: obj});
                                                                    });
                                                                });
                                                            }}/>
                                                        </div>

                                                        {(this.props.selectedImgPoint && this.props.selectedImgPoint2) ? [
                                                            <div onClick={() => {
                                                                let spareImg = this.state.spareImg;
                                                                if (this.props.selectedImgNumber != 0) {
                                                                    if (this.props.selectedImgNumber > spareImg.length) {
                                                                        if (!(spareImg.indexOf(item) >= 0)) {
                                                                            spareImg.push(item);
                                                                        }
                                                                    }
                                                                } else {
                                                                    spareImg.push(item);
                                                                }
                                                                this.setState({spareImg: spareImg});
                                                            }}><Tag type="info" className="AddSpare2">选为备用图1</Tag></div>,
                                                            <div onClick={() => {
                                                                let spareImg2 = this.state.spareImg2;
                                                                if (this.props.selectedImgNumber != 0) {
                                                                    if (this.props.selectedImgNumber > spareImg2.length) {
                                                                        if (!(spareImg2.indexOf(item) >= 0)) {
                                                                            spareImg2.push(item);
                                                                        }
                                                                    }
                                                                } else {
                                                                    spareImg2.push(item);
                                                                }
                                                                this.setState({spareImg2: spareImg2});
                                                            }}><Tag type="success" className="AddSpare3">选为备用图2</Tag></div>

                                                        ] : (
                                                            [(this.props.selectedImgPoint && <div onClick={() => {
                                                                let spareImg = this.state.spareImg;
                                                                if (this.props.selectedImgNumber != 0) {
                                                                    if (this.props.selectedImgNumber > spareImg.length) {
                                                                        if (!(spareImg.indexOf(item) >= 0)) {
                                                                            spareImg.push(item);
                                                                        }
                                                                    }
                                                                } else {
                                                                    spareImg.push(item);
                                                                }
                                                                this.setState({spareImg: spareImg});
                                                            }}>
                                                                <Tag type="info" className="AddSpare">选为备用图1</Tag>
                                                            </div>),
                                                                (this.props.selectedImgPoint2 &&
                                                                    <div onClick={() => {
                                                                        let spareImg2 = this.state.spareImg2;
                                                                        if (this.props.selectedImgNumber != 0) {
                                                                            if (this.props.selectedImgNumber > spareImg2.length) {
                                                                                if (!(spareImg2.indexOf(item) >= 0)) {
                                                                                    spareImg2.push(item);
                                                                                }
                                                                            }
                                                                        } else {
                                                                            spareImg2.push(item);
                                                                        }
                                                                        this.setState({spareImg2: spareImg2});
                                                                    }}>
                                                                        <Tag type="success" className="AddSpare">选为备用图2</Tag>
                                                                    </div>
                                                                )]
                                                        )}

                                                        {this.props.enableExtraBanner ?
                                                            <div style={{position: 'relative',left:'47px',cursor:'pointer'}} onClick={() => {
                                                                let extraBanners = this.state.extraBanners;
                                                                if (5 > extraBanners.length) {
                                                                    if (!(extraBanners.indexOf(item) >= 0)) {
                                                                        extraBanners.push(item);
                                                                    }
                                                                }
                                                                this.setState({extraBanners: extraBanners});
                                                            }}>
                                                                <Tag type="primary" >选为补充图</Tag>
                                                            </div>

                                                            : undefined}
                                                    </Layout.Col>)
                                                })}
                                            </Layout.Row>
                                        </Layout.Col>
                                    </Layout.Row> : undefined}
                            </Tabs.Pane>
                            <Tabs.Pane label="官方精选" name="2">
                                <SelectionOfPool ref="selectionOfPool" categoryListApiQuery={this.props.categoryListApiQuery}
                                                 activityId={this.props.activityId} data={this.state.data} da={this.state.da}
                                                 itemUrlChange={(it) => {
                                                     this.setState({key: '1'}, () => {
                                                         this.itemUrlChange(undefined, it)
                                                     })
                                                 }}
                                                 selectionOfPool={(data, da) => {
                                                     this.setState({data: data, da: da})
                                                 }} selectionChange={this.state.selectionChange} noChange={() => {
                                    this.setState({selectionChange: 0})
                                }}/>
                            </Tabs.Pane>
                            <Tabs.Pane label="超级选品池" name="3">
                                <SelectItemsPond ref="getImemData"
                                                 poolId={this.props.categoryListApiQuery ? this.props.categoryListApiQuery.poolId : undefined}
                                                 itemUrlChange={this.itemUrlChange} noChange={() => {
                                    this.setState({selectionChange: 0})
                                }}
                                                 activityId={this.props.activityId} setItemState={this.setThisState}
                                                 selectItemsState={(pond) => {
                                                     this.setState({pond: pond})
                                                 }} pond={this.state.pond}
                                />
                            </Tabs.Pane>
                        </Tabs>
                    </Dialog.Body>
                </Dialog>
                <Cropper ref={e => this.cropper = e} pixFilter={this.state.pixFilter} callback={this.state.callback}/>
                <UpImages ref="addImgModal" callback={this.state.imgCallback}/>
                {/*<Modal show={this.state.showModal} onHide={this.close} bsSize="large" backdrop='static'>
                    <Modal.Header closeButton>
                            <Modal.Title>上传商品</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>*/}
                {/*  <Tabs defaultActiveKey={1} id="controlled-tab-example" activeKey={this.state.key}
                              onSelect={this.handleSelect}>
                            <br/>
                            <Tab eventKey={1} title="添加商品">
                                <FormGroup controlId="formHorizontalEmail" bsClass="clearfix">
                                    <Col sm={2} componentClass={ControlLabel}>商品链接:</Col>
                                    <Col sm={10}>
                                        <FormControl
                                            type="text"
                                            placeholder="请输入产品链接"
                                            value={this.state.itemUrl}
                                            onChange={this.itemUrlChange}
                                        />
                                    </Col>
                                </FormGroup>
                            </Tab>
                            <Tab eventKey={2} title="官方精选" disabled={this.state.disabled}>

                            </Tab>
                            <Tab eventKey={3} title="超级选品池">

                            </Tab>
                        </Tabs>*/}
                {/*         <UpImages ref="addImgModal" callback={this.state.imgCallback}/>
                        <Cropper ref={e=>this.cropper=e} pixFilter={this.state.pixFilter} callback={this.state.callback}/>
                    </Modal.Body>
                </Modal>*/}
            </AJAX>
        );
    }
}

export default UpIitem;

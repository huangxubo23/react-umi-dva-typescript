/**
 * Created by 石英 on 2018/9/4 0004上午 8:59.
 */

import '../../../../../../../styles/component/react_assembly/editBox.css';
import React from 'react';
import ReactChild from "../../../../../../lib/util/ReactChild";
import {acoustic} from '../../../../../../lib/util/global';
import {Input, Button, Layout, Select, Card, Message, Tag, Checkbox, MessageBox,Tooltip} from 'element-react';
import 'element-theme-default';
import {DialogBundle} from "../../../../../../../bundle";
import AJAX from "../../../../../../lib/newUtil/AJAX";
import $ from "jquery";

import rapidAdditionModelContainere
    from 'bundle-loader?lazy&name=pc/trends_asset/components/user/head/app-[name]!./components/rapidAdditionModel';
const randomStringNum = (len) => {
    len = len || 32;
    let $chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let maxPos = $chars.length;
    let pwd = '';
    for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
};

class AddCopyWriting extends ReactChild {
    constructor(props) {
        super(props);
        this.state = {
            val: "",
            lj: "",
            key: "",//关键词--搜索
            bigList: [],
            smallList: [],
            listJudge: false,
            lab: [],
            page: 1,
            typeArr: [],
            typeId: "",
            fixedPool: [
                {title: "必买清单X行业精品池", id: 3721, kxuan_swyt_item: 23915, searchtype: "item", ruletype: 2}
            ],
            fixed: "",
        }
    }

    keyChange(value) {//搜索关键词
        this.setState({key: value});
    }

    keySearch() {//去搜索
        this.setState({page: 1}, () => {
            this.getList(2);
        });
    }

    cleanKey() {//清空搜索关键词
        this.setState({key: ''});
    }

    getList = (type = 1) => {//大列表数据获取
        let {key, bigList, page} = this.state;
        let obj = {
            "tce_sid": "1891397",
            "tce_vid": "0",
            "tid": "",
            "tab": "",
            "topic": "search",
            "count": "",
            "env": "online",
            "pageNo": "1",
            "psId": "51817",
            "bizCode": "steins.goodItem",
            "type": "search",
            "page": "" + page,
            "pageSize": "20",
            "key": key,
            "src": "phone"
        };
        let data = {d: JSON.stringify(obj)};
        let s = {
            type: "jsonp",
            dataType: "jsonp",
            api: "mtop.taobao.tceget.steins.gooditem.xget",
            v: "1.0",
            appKey: 12574478,
            t: new Date().getTime()
        };
        acoustic({
            parameters: s,
            requesData: data,
            host: "https://h5api.m.taobao.com/h5",
            ajaxData: {requeryType: "get", referer: "https://h5.m.taobao.com"}
        }, "requestH5", (response) => {
            let result = response.result["1891397"].result[0].data[0].data[0][0].result.result, bigListArray = [];
            for (let i in result) {
                let {feedId, cover, title} = result[i];
                bigListArray.push({feedId, cover, title});
            }
            this.setState({bigList: type === 1 ? [...bigList, ...bigListArray] : bigListArray});
        });
    };

    getCheesy = (feedId) => {//小列表
        let obj = {
            videoFrom: "youhaohuo",
            business_spm: "a2141.7631543"
        };
        let data = {
            "contentId": feedId,
            "type": "weex",
            "source": "youhh_h5",
            "frontModuleName": "recommendContent",
            "params": JSON.stringify(obj)
        };
        let s = {
            type: "jsonp",
            dataType: "jsonp",
            api: "mtop.taobao.beehive.detail.contentrecommendservice",
            v: "1.0",
            appKey: 12574478,
            t: new Date().getTime()
        };
        acoustic({
            parameters: s,
            requesData: data,
            host: "https://h5api.m.taobao.com/h5",
            ajaxData: {requeryType: "get", referer: "https://h5.m.taobao.com"}
        }, "requestH5", (response) => {
            let result = response.result;
            let {lab, smallList} = this.state, oldArr = [], newArr = [];
            for (let s in smallList) {
                if ((lab.join().indexOf(smallList[s].id)) >= 0) {
                    oldArr.push(smallList[s]);
                }
            }
            for (let i in result) {
                let {id, cover, title, item} = result[i];
                newArr.push({
                    id, cover, title,
                    itemUrl: item ? (item.itemUrl ? item.itemUrl : "//item.taobao.com/item.htm?id=" + item.itemId) : undefined
                });
            }
            Message({
                message: '自动剔除不合格好货内容,请稍等...',
                type: 'success'
            });
            this.promise(newArr, (array) => {
                this.setState({smallList: [...oldArr, ...array]}, () => {
                    acoustic({
                            agreement: "https",
                            hostname: "kxuan.taobao.com",
                            path: "/weIndex.htm",
                            data: {businessId: 0},
                            method: "get",
                            referer: "https://we.taobao.com/"
                        }, 'requestRelyTB', (json) => {
                            let t = json.indexOf("we-row");
                            let f = json.indexOf("result-list");
                            let tf = json.substr(t, f - t);
                            let [tf_arr, arr] = [tf.split("</span>"), []];
                            tf_arr.splice(tf_arr.length - 1, 1);
                            for (let a in tf_arr) {
                                let ss = tf_arr[a].split('data-choice-id="')[1];
                                arr.push({
                                    title: ss.split('>')[1],
                                    id: ss.split('"')[0],
                                })
                            }
                            this.setState({typeArr: arr});
                        }
                    );
                });
            });
        });
        this.setState({listJudge: !this.state.listJudge});
    };

    promise = (data = [], callback, num = 0, arrItem = []) => {//判断内容符合度
        if (data.length > num) {
            let obj = {
                videoFrom: "youhaohuo"
            };
            let da = {
                "contentId": data[num].id,
                "source": "youhh_h5",
                "type": "h5",
                "params": JSON.stringify(obj),
                "businessSpm": "",
                "business_spm": "a2141.7631543",
                "track_params": ""
            };
            let s = {
                type: "jsonp",
                dataType: "jsonp",
                api: "mtop.taobao.beehive.detail.contentservicenewv2",
                v: "1.0",
                appKey: 12574478,
                t: new Date().getTime()
            };
            acoustic({
                parameters: s,
                requesData: da,
                host: "https://h5api.m.taobao.com/h5",
                ajaxData: {requeryType: "get", referer: "https://h5.m.taobao.com"}
            }, "requestH5", (response) => {
                let {frontModuleJson} = response.models.config, t = 0;
                for (let c in frontModuleJson) {
                    let {name, data} = frontModuleJson[c];
                    if (name == 'item-paragraph-select' || name == 'item-paragraph') {
                        if (!(data.title == '品牌介绍' || data.title == '好在哪里' || data.title == '品牌故事')) {
                            if (data.desc.length > 50) {
                                t++;
                            }
                        }
                    }
                }
                let you = setInterval(() => {
                    clearInterval(you);
                    if (t > 0) {
                        arrItem.push(data[num]);
                    }
                    this.promise(data, callback, num + 1, arrItem);
                }, 50);
            });
        } else {
            callback(arrItem);
        }
    };

    selectAll = () => {//全选
        let {smallList} = this.state;
        let arr = [];
        for (let i in smallList) {
            arr.push(smallList[i].id);
        }
        this.setState({lab: arr});
    };

    selectAgainst = () => {//反选
        let {smallList, lab} = this.state;
        let arr = [];
        for (let i in smallList) {
            if (lab.join().indexOf(smallList[i].id) < 0) {
                arr.push(smallList[i].id);
            }
        }
        this.setState({lab: arr});
    };
    selectClear = () => {
        this.setState({lab: []});
    };

    album = (arr, radioId, typeTab) => {
        let content = {
            body: {
                type: "CreatorAddItem",
                value: arr,
                version: 3
            },
            type: 2,
        };
        let data = {
            id: 0,
            typeTab: typeTab,
            contentModeId: radioId,
            data: content,
            version: 3
        };
        this.randomStringNumAjax.ajax({
            url: "/content/admin/album/domain.content.add.io",
            data: {data: JSON.stringify(data)},
            type: "post",
            callback: () => {
                Message({
                    message: '成功发布',
                    type: 'success'
                });
            }
        })
    };

    get__Data = (arr = [], callback, num = 0, arrItem = []) => {
        if (arr.length > num) {
            let obj = {
                "videoFrom": "youhaohuo"
            };
            let data = {
                "contentId": arr[num],
                "source": "youhh_h5",
                "type": "h5",
                "params": JSON.stringify(obj),
                "businessSpm": "",
                "business_spm": "a2141.7631543",
                "track_params": ""
            };
            let s = {
                type: "jsonp",
                dataType: "jsonp",
                api: "mtop.taobao.beehive.detail.contentservicenewv2",
                v: "1.0",
                appKey: 12574478,
                t: new Date().getTime()
            };
            acoustic({
                parameters: s,
                requesData: data,
                host: "https://h5api.m.taobao.com/h5",
                ajaxData: {requeryType: "get", referer: "https://h5.m.taobao.com"}
            }, "requestH5", (response) => {
                let content = response.models.content;
                let obj = {
                    coverUrl: content.item.item_pic,
                    description: content.summary,
                    detailUrl: "//item.taobao.com/item.htm?id=" + content.item.item_numiid,
                    icon: true,
                    isInPond: true,
                    isRelease: undefined,
                    itemId: content.item.item_numiid,
                    nick: "暂无",
                    price: content.item.itemPriceDTO.subPrice.item_price,
                    q_score: "暂无",
                    resourceUrl: "//item.taobao.com/item.htm?id=" + content.item.item_numiid,
                    title: content.title,
                    yongjin: 0,
                };
                let you = setInterval(() => {
                    clearInterval(you);
                    arrItem.push(obj);
                    num++;
                    this.get__Data(arr, callback, num, arrItem);
                }, 200);
            });
        } else {
            callback(arrItem);
        }
    };

    get_StructData = (arr = [], callback, num = 0, arrItem = []) => {
        if (arr.length > num) {
            let obj = {
                "videoFrom": "youhaohuo"
            };
            let data = {
                "contentId": arr[num],
                "source": "youhh_h5",
                "type": "h5",
                "params": JSON.stringify(obj),
                "businessSpm": "",
                "business_spm": "a2141.7631543",
                "track_params": ""
            };
            let s = {
                type: "jsonp",
                dataType: "jsonp",
                api: "mtop.taobao.beehive.detail.contentservicenewv2",
                v: "1.0",
                appKey: 12574478,
                t: new Date().getTime()
            };
            acoustic({
                parameters: s,
                requesData: data,
                host: "https://h5api.m.taobao.com/h5",
                ajaxData: {requeryType: "get", referer: "https://h5.m.taobao.com"}
            }, "requestH5", (response) => {
                let content = response.models.content;
                let desT = () => {
                    let m = 0, obj = {};
                    let content = response.models.config.frontModuleJson;
                    for (let c in content) {
                        if (content[c].name == 'item-paragraph-select' || content[c].name == 'item-paragraph') {
                            if (!(content[c].data.title == '品牌介绍' || content[c].data.title == '好在哪里' || content[c].data.title == '品牌故事')) {
                                m++;
                                obj["lizicontent" + m] = content[c].data.desc;
                            }
                        }
                    }
                    return obj;
                };
                let obj = {
                    itemDescription: desT().lizicontent1,
                    itemTitle: content.item.itemTitle,
                    items: [
                        {
                            coverUrl: content.item.item_pic,
                            detailUrl: "https://item.taobao.com/item.htm?id=" + content.item.item_numiid,
                            itemId: content.item.item_numiid,
                            item_numiid: content.item.item_numiid,
                            item_pic: content.item.item_pic,
                            title: content.item.item_title
                        }
                    ],
                    title: content.title,
                    topNum: num + 1
                };
                let you = setInterval(() => {
                    clearInterval(you);
                    arrItem.push(obj);
                    num++;
                    this.get_StructData(arr, callback, num, arrItem);
                }, 500);
            });
        } else {
            callback(arrItem);
        }
    };

    struct = (arr, radioId, typeTab, mb) => {
        this.getTemplates(arr, mb, (item) => {
            let content = {
                body: {
                    type: "StructCanvas",
                    value: item,
                    version: 3
                },
                type: 1,
            };
            let data = {
                id: 0,
                typeTab: typeTab,
                contentModeId: radioId,
                data: content,
                version: 3
            };
            this.randomStringNumAjax.ajax({
                url: "/content/admin/post/domain.content.add.io",
                data: {data: JSON.stringify(data)},
                type: "post",
                callback: () => {
                    Message({
                        type: 'success',
                        message: '成功发布'
                    });
                }
            })
        });
    };

    getTemplates = (arr, mb, callback, num = 0) => {
        let constraint = mb.constraint instanceof Array?constraint[num]:mb.constraint.constraint[mb.constraint.nameList[num].name];
        if (constraint.type == "StructCanvas") {
            let n = constraint.props.value;
            let s = arr.length - n.length;
            if (s > 0) {
                for (let i = 1; i <= s; i++) {
                    let obj = {
                        attrs: {},
                        data: n[0].data,
                        errorMsg: "",
                        guid: "",
                        materialId: n[0].materialId,
                        moduleInfo: n[0].moduleInfo,
                        name: n[0].name,
                        rule: n[0].rule,
                        resourceId: n[0].resourceId,
                    };
                    obj.data.topNum = 6 + i;
                    n.push(obj);
                }
            }
            constraint.props.value = n;
            this.getTemplateas(arr, constraint, callback);
        } else {
            num++;
            this.getTemplates(arr, mb, callback, num);
        }
    };

    getTemplateas = (arr, constraint, callback, item = [], num = 0) => {
        this.getTemplate(arr, constraint, (arrs, items) => {
            if (arr.length > 0) {
                this.getTemplateas(arrs, constraint, callback, items, num + 1);
            } else {
                callback(items);
            }
        }, item, num);
    };

    getTemplate = (arr, constraint, callback, item = [], num = 0) => {
        constraint.props.value[num].data = {};
        constraint.props.value[num].data = arr.shift();
        item.push(constraint.props.value[num]);
        callback(arr, item);
    };

    get_Data = (arr = [], callback, num = 0, arrItem = []) => {
        if (arr.length > num) {
            let obj = {
                "videoFrom": "youhaohuo"
            };
            let data = {
                "contentId": arr[num],
                "source": "youhh_h5",
                "type": "h5",
                "params": JSON.stringify(obj),
                "businessSpm": "",
                "business_spm": "a2141.7631543",
                "track_params": ""
            };
            let s = {
                type: "jsonp",
                dataType: "jsonp",
                api: "mtop.taobao.beehive.detail.contentservicenewv2",
                v: "1.0",
                appKey: 12574478,
                t: new Date().getTime()
            };
            acoustic({
                parameters: s,
                requesData: data,
                host: "https://h5api.m.taobao.com/h5",
                ajaxData: {requeryType: "get", referer: "https://h5.m.taobao.com"}
            }, "requestH5", (response) => {
                let obj = {};
                let content = response.models.content;
                obj.price = content.item.itemPriceDTO.subPrice.item_price;
                obj.coverUrl = content.item.item_pic;
                obj.title = content.title;
                obj.summary = content.summary;
                obj.itemId = content.item.item_numiid;
                obj.resourceUrl = "//item.taobao.com/item.htm?id=" + content.item.item_numiid;
                obj.haozai = content.advantages ? content.advantages : {};
                let arr1 = [], t = 0;
                let frontModuleJson = response.models.config.frontModuleJson;
                for (let c in frontModuleJson) {
                    if (frontModuleJson[c].name == 'item-paragraph-select' || frontModuleJson[c].name == 'item-paragraph') {
                        if (!(frontModuleJson[c].data.title == '品牌介绍' || frontModuleJson[c].data.title == '好在哪里' || frontModuleJson[c].data.title == '品牌故事')) {
                            t++;
                            arr1.push(frontModuleJson[c].data);
                        }
                    }
                }
                obj["lizicontent"] = arr1;
                let you = setInterval(() => {
                    clearInterval(you);
                    if (t > 0) {
                        arrItem.push(obj);
                    }
                    this.get_Data(arr, callback, num + 1, arrItem);
                }, 100);
            });
        } else {
            callback(arrItem);
        }
    };

    post = (arr, radioId, typeTab) => {
        let numt = ["— ❶ —", "— ❷ —", "— ❸ —", "— ❹ —", "— ❺ —", "— ❻ —", "— ❼ —", "— ❽ —", "— ❾ —", "— ❿ —"]
        let value = {
            blocks: [],
            entityMap: {}
        };
        let uu = -1;
        for (let a in arr) {

            let itemKey1 = randomStringNum(5);
            value.blocks.push({
                "text": "",
                "data": {},
                "inlineStyleRanges": [],
                "entityRanges": [],
                "type": "unstyled",
                "key": itemKey1,
                "depth": 0
            });

            let t = a < 9 ? numt[a] : "— " + (a + 1) + " —";
            let itemKey6 = randomStringNum(5);
            value.blocks.push({
                data: {},
                depth: 0,
                entityRanges: [],
                inlineStyleRanges: [{
                    length: t.length,
                    offset: 0,
                    style: "BOLD",
                }],
                key: itemKey6,
                text: t,
                type: "alignCenter",
            });


            uu++;
            let itemKey2 = randomStringNum(5);
            value.blocks.push({
                data: {},
                depth: 0,
                entityRanges: [
                    {key: uu, length: 1, offset: 0}
                ],
                inlineStyleRanges: [],
                key: itemKey2,
                text: " ",
                type: "atomic",
            });
            value.entityMap[uu] = {
                data: {
                    coverUrl: arr[a].coverUrl,
                    images: [arr[a].coverUrl],
                    itemId: arr[a].itemId,
                    price: arr[a].price,
                    resourceUrl: arr[a].resourceUrl,
                    title: arr[a].title,
                    description: "",
                    detailUrl: "https:" + arr[a].resourceUrl,
                },
                mutability: "IMMUTABLE",
                type: "SIDEBARSEARCHITEM",
            };
            let itemKey4 = randomStringNum(5);
            value.blocks.push({
                data: {},
                depth: 0,
                entityRanges: [],
                inlineStyleRanges: [],
                key: itemKey4,
                text: arr[a].summary,
                type: "unstyled",
            });
            if (arr[a].lizicontent.length > 0) {
                let li = arr[a].lizicontent;
                for (let l in li) {
                    uu++;
                    let itemKey8 = randomStringNum(5);
                    value.blocks.push({
                        data: {},
                        depth: 0,
                        entityRanges: [
                            {key: uu, length: 1, offset: 0}
                        ],
                        inlineStyleRanges: [],
                        key: itemKey8,
                        text: " ",
                        type: "atomic",
                    });
                    value.entityMap[uu] = {
                        data: {
                            picHeight: parseInt(li[l].images[0].picHeight),
                            picWidth: parseInt(li[l].images[0].picWidth),
                            pix: li[l].images[0].picWidth + "x" + li[l].images[0].picHeight,
                            url: li[l].images[0].picUrl,
                        },
                        mutability: "MUTABLE",
                        type: "SIDEBARIMAGE",
                    };
                    let itemKey10 = randomStringNum(5);
                    value.blocks.push({
                        data: {},
                        depth: 0,
                        entityRanges: [],
                        inlineStyleRanges: [],
                        key: itemKey10,
                        text: li[l].desc,
                        type: "unstyled",
                    });
                }
            }
        }
        let content = {
            body: {
                type: "Editor",
                value: value,
                version: 3
            },
            type: 1,
        };
        let data = {
            id: 0,
            typeTab: typeTab,
            contentModeId: radioId,
            data: content,
            version: 3
        };
        this.randomStringNumAjax.ajax({
            url: "/content/admin/post/domain.content.add.io",
            data: {data: JSON.stringify(data)},
            type: "post",
            callback: () => {
                Message({
                    type: 'success',
                    message: '成功发布'
                });
            }
        })
    };

    GenerationOfAlbum = () => {//提交合成清单
        let {lab} = this.state;
        if (lab.length > 0) {
            Message({
                message: '请稍等',
                type: 'success'
            });
            this.get__Data(lab, (arrItem) => {
                let callback = (radioId, typeTab) => {
                    this.album(arrItem, radioId, typeTab);
                };
                this.setState({callback: callback}, () => {
                    this.rapidAdditionModel.open({type: ''}, () => {
                        this.rapidAdditionModel.getBun((gt) => {
                            gt.addition(1, 'album');
                        })
                    });
                });
            });
        } else {
            Message({
                message: '未选择商品',
                type: 'warning'
            });
        }
    };

    GenerationOfPost = () => {//提交合成结构体/帖子
        let {lab} = this.state;
        MessageBox.msgbox({
            title: '选择提示',
            message: '请选择一个合成类型',
            showCancelButton: true,
            cancelButtonText: '帖子编辑器',
            confirmButtonText: '结构体',
        }).then((data) => {
            if(data==='confirm'){
                if (lab.length > 0 && lab.length < 11) {
                    Message({
                        type: 'success',
                        message: '结构体数据拿取中，请稍等！'
                    });
                    this.get_StructData(lab, (arrItem) => {
                        let callback = (radioId, typeTab, mb) => {
                            this.struct(arrItem, radioId, typeTab, mb);
                        };
                        this.setState({callback: callback}, () => {
                            this.rapidAdditionModel.open({type: ''}, () => {
                                this.rapidAdditionModel.getBun((gt) => {
                                    gt.addition(1, 'post');
                                })
                            });
                        });
                    });
                } else {
                    Message({
                        message: '未选择商品或商品数超过10个，请核查',
                        type: 'warning'
                    });
                }
            }else {
                if (lab.length > 0) {
                    Message({
                        type: 'success',
                        message: '帖子编辑器数据拿取中，请稍等！'
                    });
                    this.get_Data(lab, (arrItem) => {
                        let callback = (radioId, typeTab) => {
                            this.post(arrItem, radioId, typeTab);
                        };
                        this.setState({callback: callback}, () => {
                            this.rapidAdditionModel.open({type: ''}, () => {
                                this.rapidAdditionModel.getBun((gt) => {
                                    gt.addition(1, 'post');
                                })
                            });
                        });
                    });
                } else {
                    Message({
                        message: '未选择商品，请补充',
                        type: 'warning'
                    });
                }
            }
        })
    };

    typeIdChange = (value) => {//选择类型
        this.setState({typeId: value});
    };

    fixedChange = (value) => {//选品池检测
        this.setState({fixed: value});
    };

    category = () => {//选择类型点击确定进行检测
        let {typeId} = this.state;
        if (typeId) {
            acoustic({
                    agreement: "https",
                    hostname: "kxuan.taobao.com",
                    path: "/weIndex.htm",
                    data: {businessId: typeId},
                    method: "get",
                    referer: "https://we.taobao.com/"
                }, 'requestRelyTB', (json) => {
                    let t = json.indexOf("result-list");
                    let f = json.indexOf("we-pagination");
                    let tf = json.substr(t, f - t);
                    let [tf_arr, arr] = [tf.split("we-item-pic ifram-a"), []];
                    tf_arr.splice(0, 1);
                    for (let a in tf_arr) {
                        let ss = tf_arr[a].split('data-spm="')[1];
                        arr.push({
                            id: ss.split('"')[0],
                        })
                    }
                    this.category_pd(arr, this.state.smallList, 0);
                }
            );
        } else {
            Message({
                message: '请选择类型',
                type: 'warning'
            });
        }
    };

    category_pd = (arr, item, i = 0) => {
        if (item.length > i) {
            this.category_pp(arr, "https:" + item[i].itemUrl, (pd, auctions) => {
                let {smallList} = this.state;
                if (pd) {
                    let o = {};
                    if (auctions[0].sameStyleCount) {
                        o.sameStyleCount = auctions[0].sameStyleCount;
                        o.nid = auctions[0].nid;
                        o.pid = auctions[0].pid;
                    }
                    o.q_score = auctions[0].q_score;
                    o.icon = auctions[0].icon;
                    smallList[i].qx = o;
                    smallList[i].pool = "d";
                } else {
                    smallList[i].pool = "c";
                }
                this.setState({smallList: smallList}, () => {
                    let set = setInterval(() => {
                        clearInterval(set);
                        this.category_pd(arr, item, i + 1);
                    }, 500);
                });
            })
        } else {
            Message({
                message: '判断选品池完毕',
                type: 'success'
            });
        }
    };

    category_pp = (arr, url, callback, a = 0) => {
        if (arr.length > a) {
            let id = parseInt(arr[a].id);
            this.category_it(id, (obj) => {
                Object.assign(obj, {
                    q: url,
                    callback: 'jsonp20',
                });
                acoustic({
                        agreement: "https",
                        hostname: "kxuan.taobao.com",
                        path: "/searchSp.htm",
                        data: obj,
                        method: "get",
                        referer: "https://we.taobao.com/",
                        dataType: "jsonp",
                    }, 'requestRelyTB', (msg) => {
                        let msg1 = msg.split('jsonp20(')[1].split(')')[0];
                        let json = JSON.parse(msg1);
                        let auctions = json.mods.itemlist.data.auctions;
                        if (auctions.length > 0) {
                            callback(true, auctions);
                        } else {
                            this.category_pp(arr, url, callback, a + 1);
                        }
                    }
                );
            });
        } else {
            callback(false);
        }
    };

    category_it = (id, callback) => {
        acoustic({
                agreement: "https",
                hostname: "kxuan.taobao.com",
                path: "/search.htm",
                data: {id: id, nested: "we"},
                method: "get",
                referer: "https://we.taobao.com/"
            }, 'requestRelyTB', (json) => {
                let t = json.indexOf('params = "');
                let f = json.indexOf('siteUrl = "');
                let tf = json.substr(t, f - t);
                let tr = tf.split('"')[1];
                callback(this.urlAnalysis(tr));
            }
        );
    };

    urlAnalysis = (cs) => {
        let item = {};
        let arr = cs.split("&");
        for (let i in arr) {
            item[((arr[i].split("="))[0])] = (arr[i].split("="))[1];
        }
        return item;
    };

    fixed = () => {//选择一个固定选品池进行检测
        let {fixed, fixedPool} = this.state;
        if (fixed) {
            this.fixed_pp(fixedPool[fixed - 1], this.state.smallList);
        } else {
            Message({
                message: '请选择一个固定选品池',
                type: 'warning'
            });
        }
    };

    fixed_pp = (cs, list, l = 0) => {//检测
        if (list.length > l) {
            let obj = {
                id: cs.id,
                kxuan_swyt_item: cs.kxuan_swyt_item,
                ruletype: cs.ruletype,
                searchtype: cs.searchtype,
                q: "https:" + list[l].itemUrl,
                callback: 'jsonp20',
            };
            acoustic({
                    agreement: "https",
                    hostname: "kxuan.taobao.com",
                    path: "/searchSp.htm",
                    data: obj,
                    method: "get",
                    referer: "https://we.taobao.com/"
                }, 'requestRelyTB', (msg) => {
                    let msg1 = msg.split('jsonp20(')[1].split(')')[0];
                    let json = JSON.parse(msg1);
                    let auctions = json.mods.itemlist.data.auctions;
                    let {smallList} = this.state;
                    if (auctions.length > 0) {
                        let o = {};
                        if (auctions[0].sameStyleCount) {
                            o.sameStyleCount = auctions[0].sameStyleCount;
                            o.nid = auctions[0].nid;
                            o.pid = auctions[0].pid;
                        }
                        o.q_score = auctions[0].q_score;
                        o.icon = auctions[0].icon;
                        smallList[l].pool = "d";
                        smallList[l].qx = o;
                        this.setState({smallList: smallList}, () => {
                            this.fixed_pp(cs, list, l + 1);
                        })
                    } else {
                        smallList[l].pool = "c";
                        this.setState({smallList: smallList}, () => {
                            this.fixed_pp(cs, list, l + 1);
                        })
                    }
                }
            );
        } else {
            Message({
                message: '判断选品池完毕',
                type: 'success'
            });
        }
    };

    del = () => {//清空非选品池
        let {smallList} = this.state;
        let arr = [];
        for (let i in smallList) {
            if (smallList[i].pool != 'c') {
                arr.push(smallList[i]);
            }
        }
        this.setState({smallList: arr});
    };

    labChange = (value) => {//多选框value
        let {lab} = this.state;
        let index = $.inArray(value, lab);
        if (index >= 0) {
            lab.splice(index, 1);
        } else {
            lab.push(value);
        }
        this.setState({lab});
    };

    componentDidUpdate() {
        let scrollParent = $("#panel-body");
        if (scrollParent.length == 0) {
            scrollParent = $(window);
        }
        scrollParent.scroll(() => {
            let t = scrollParent.scrollTop();
            if (t > 150) {
                $(".editBox").addClass("editBoxButsFD");
            } else {
                $(".editBox").removeClass("editBoxButsFD");
            }

        });
    }

    render() {
        let {key, bigList = [], listJudge, page, typeId, typeArr, fixed, fixedPool, lab, smallList} = this.state;
        return (
            <AJAX ref={e => {
                this.randomStringNumAjax = e
            }}>
                <div>
                    <NewPanel header="文案合成">
                        <Input placeholder="请输入搜索关键词" value={key} onChange={this.keyChange.bind(this)} onKeyDown={(event) => {
                            if (event.keyCode == "13") {
                                this.keySearch()
                            }
                        }} prepend={<Button type="primary" icon="delete" onClick={this.cleanKey.bind(this)}>清空</Button>}
                               append={<Button type="primary" icon="search" onClick={this.keySearch.bind(this)}>搜索</Button>}/>
                        {bigList.length > 0 &&<div style={{marginTop:'10px'}}>
                            {listJudge && <div className="editBox" style={{top: "50px", left: "210px"}}>
                                <div style={{marginTop: "5px", textAlign: 'center',marginBottom:'5px'}}>
                                    <Layout.Row>
                                        <Layout.Col span='24'>
                                            <strong style={{fontWeight:'bold'}}>操作：</strong>
                                            <Button type='info' title="会保留勾选数据" size='small' onClick={() => this.setState({listJudge: false})}>返回上一级</Button>

                                            <Button type='success' size='small' onClick={this.selectAll}>全选</Button>

                                            <Button type='info' size='small' onClick={this.selectAgainst}>反选</Button>

                                            <Button type='warning' size='small' onClick={this.selectClear}>不选</Button>

                                            <Button type='primary' size='small' style={{marginRight: '8px'}} onClick={this.GenerationOfPost} title="建议勾选5个以上商品">提交合成帖子</Button>

                                            {/*<Button type='primary' size='small' style={{marginRight: '8px'}} onClick={this.GenerationOfAlbum} title="建议全选">提交合成清单</Button>*/}

                                            <Select value={typeId ? typeId : "0"} placeholder="请选择" size='small'
                                                    style={{marginRight: '8px', verticalAlign: 'middle', width: '180px'}} onChange={this.typeIdChange}>
                                                <Select.Option value='0' label='选择类型' disabled/>
                                                {(typeArr ? typeArr : []).map((item, i) => {
                                                    if (item.id != '0') {
                                                        return (
                                                            <Select.Option value={item.id} key={item.id + "-" + i} label={item.title}/>
                                                        )
                                                    }
                                                })}
                                            </Select>
                                            <Button type='primary' size='small' title="请先选择一个选品池类型后确定。提示！只会判断对应类型的选品池" onClick={this.category}>确定</Button>

                                            <Select value={fixed ? fixed : "0"} placeholder="请选择" size='small'
                                                    style={{marginLeft: '15px', marginRight: '15px', verticalAlign: 'middle'}} onChange={this.fixedChange}>
                                                <Select.Option value='0' label='选择固定选品池' disabled/>
                                                {(fixedPool ? fixedPool : []).map((item, i) => {
                                                    return (
                                                        <Select.Option value={i + 1} key={item.id + "-" + i} label={item.title}/>
                                                    )
                                                })}
                                            </Select>
                                            <Button type='primary' size='small' title="请先选择一个固定选品池后确定" onClick={this.fixed}>确定</Button>

                                            <Button type='danger' size='small' style={{marginRight: '10px'}} onClick={this.del}>清空非选品池</Button>

                                            <Tag type="success" style={{marginRight: '12px', textAlign: 'center'}}>已勾选({lab.length})个</Tag>
                                        </Layout.Col>
                                    </Layout.Row>
                                </div>
                            </div>}

                            {listJudge && <Layout.Row style={{marginTop: '15px'}} gutter='10'>
                                {(smallList ? smallList : []).map((item, i) => {
                                    return (
                                        <Layout.Col xs={6} sm={6} md={4} lg={4} key={item.id}>
                                            <div style={{position: "relative"}}>
                                                <div style={{position: "absolute", margin: "4px 0 0 8px"}}>
                                                    <label>
                                                        <Checkbox checked={lab.join().indexOf(item.id) > -1 ? "checked" : ""} style={{width: "15px", height: "15px"}}
                                                                  onChange={() => {
                                                                      this.labChange(item.id);
                                                                  }}/>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="thumbnail">
                                                <a href={item.itemUrl} target="_blank">
                                                    <img src={item.cover}/>
                                                </a>
                                                <Tooltip className="item" effect="dark"
                                                         content={item.title}
                                                         placement="bottom">
                                                    <div style={{
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        overflow: "hidden",
                                                        display: "block",
                                                        cursor: "pointer"
                                                    }}>  {item.title}</div>
                                                </Tooltip>
                                                {item.pool == "d" &&
                                                <a href={"https://s.taobao.com/search?type=samestyle&app=i2i&rec_type=&uniqpid=" + item.qx.pid + "&nid=" + item.qx.nid}
                                                   target="_blank">{item.qx.sameStyleCount ? item.qx.sameStyleCount + "家在售" : ""}</a>}
                                                <div style={{textAlign: 'left', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', height: '24px'}}>
                                                    {item.pool == "d" && <Tag type="primary" style={{marginBottom: '5px'}}>{item.qx.q_score}</Tag>}
                                                    {item.pool == "d" && (item.qx.icon ? item.qx.icon : []).map((con, c) => {
                                                        return (
                                                            <Tag type="success" key={i + "-" + c} style={{marginBottom: '5px'}}>{con.innerText}</Tag>
                                                        )
                                                    })}
                                                </div>
                                                {item.pool ?
                                                    <Button style={{width: '100%'}} type={item.pool == "c" ? "danger" : "success"}
                                                            size="small">已检测:
                                                        {item.pool == "d" ? "在选品池" : "不在选品池"}</Button> :
                                                    <Button type="warning" size="small" style={{width: '100%'}}>未检测</Button>}
                                            </div>
                                        </Layout.Col>
                                    )
                                })}
                            </Layout.Row>}

                            {!listJudge && <React.Fragment>
                                <Layout.Row gutter="20" style={{marginTop: "8px"}}>
                                    {bigList.map(item => {
                                        return (
                                            <Layout.Col xs={6} sm={6} md={4} lg={4} key={item.feedId} style={{margin: "6px 0"}}>
                                                <Card bodyStyle={{padding: 0}} style={{marginBottom: '5px', backgroundColor: "#f7fafa"}}>
                                                    <div style={{
                                                        height: "240px",
                                                        backgroundColor: "#f7fafa",
                                                        margin: "0 8px"
                                                    }}>
                                                        <img src={item.cover} style={{maxWidth: '100%', maxHeight: '100%'}}/>
                                                    </div>
                                                    <div style={{
                                                        fontWeight: 'bold',
                                                        marginBottom: '10px'
                                                    }}>
                                                        {item.title ?
                                                            <a style={{textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: "hidden", display: "block"}}>{item.title}</a> : <br/>}
                                                    </div>
                                                    <Button type="primary" size="mini" onClick={() => this.getCheesy(item.feedId)} style={{width: '100%'}}>相似商品</Button>
                                                </Card>
                                            </Layout.Col>
                                        )
                                    })}
                                </Layout.Row>
                                <Button type="info" onClick={() => this.setState({page: page + 1}, () => this.getList(1))}>加载更多</Button>
                            </React.Fragment>}
                        </div>}
                    </NewPanel>
                </div>
                <div>
                    <DialogBundle ref={e => this.rapidAdditionModel = e} dialogProps={{title: '快速添品', size: "small"}}
                                  bundleProps={{
                                      load: rapidAdditionModelContainere, callback: this.state.callback, closeModal: () => {
                                          this.rapidAdditionModel.setState({dialogVisible: false})
                                      }
                                  }}
                                  dialogFooter={<div>
                                      <Button onClick={() => {
                                          this.rapidAdditionModel.setState({dialogVisible: false})
                                      }}>取消</Button>
                                      <Button type="primary" onClick={() => {
                                          this.rapidAdditionModel.getBun((gb) => {
                                              gb.submit();
                                          })
                                      }}>确定</Button>
                                  </div>}>
                    </DialogBundle>
                </div>
            </AJAX>
        )
    }
}

class NewPanel extends React.Component {
    render() {
        let {header} = this.props;
        return (
            <div style={{
                marginTop: "10px",
                marginBottom: '12px',
                backgroundColor: '#fff',
                border: '1px solid transparent',
                borderRadius: '4px',
                boxShadow: '0 1px 1px rgba(0, 0, 0, .05)',
                borderColor: '#50bfff'
            }}>
                <div style={{
                    padding: '1px 10px',
                    borderBottom: '1px solid transparent',
                    borderTopLeftRadius: '3px',
                    borderTopRightRadius: '3px',
                    color: '#fff',
                    backgroundColor: '#50bfff',
                    borderColor: '#50bfff',
                }}>
                    <h5 style={{textAlign: 'center'}}>{header}</h5>
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

export default AddCopyWriting;
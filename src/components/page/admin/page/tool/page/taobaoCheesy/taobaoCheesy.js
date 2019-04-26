/**
 * Created by 石英 on 2018/8/13 0013上午 11:33.
 */
import '../../../../../../../styles/component/react_assembly/editBox.css';
import React from 'react';
import {
    Button,
    FormGroup,
    InputGroup,
    FormControl,
    Panel,
    Row,
    Col,
    Modal,
    Radio,
    Alert,
    ButtonGroup,
    Label,
    ListGroupItem
} from 'react-bootstrap'
import $ from 'jquery';
import {currencyNoty} from '../../../../../../lib/util/Noty';
import {ajax} from '../../../../../../lib/util/ajax';
import ReactChild from "../../../../../../lib/util/ReactChild";
import {acoustic} from '../../../../../../lib/util/global'
import noty from 'noty';

const Ajax = ajax.ajax;

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

const title = {
    shopList: <h3>收藏店铺列表</h3>,
    newItem: <h3>新品列表</h3>,
    rapidAddition: <h3>选择一个渠道</h3>,
    rapidAdditionType: <h3>选择一个类型</h3>,
    shopAdd: <h3>增加店铺</h3>,
    type: <h3>选择一个提交对象</h3>,
};

let numm = 0;

class TaobaoCheesy extends ReactChild {
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

    gettaobao = (ss = 0, callback) => {
        let data = {
            "type": "interest",
            "interestIds": "0",
            "s": ss,
            "n": 20,
            "includeZan": 1,
            "contentId": "2500000200464582196"
        };
        let s = {
            type: "jsonp",
            dataType: "jsonp",
            api: "mtop.arctic.circle.recommend.list",
            v: "6.4",
            appKey: 12574478,
            t: new Date().getTime()
        };

        acoustic({
            parameters: s,
            requesData: data,
            host: "https://h5api.m.taobao.com/h5",
            ajaxData: {requeryType: "get", referer: "https://h5.m.taobao.com"}
        }, "requestH5", (data) => {
            callback(data);
        });
    };

    h5 = (n) => {
        this.gettaobao(n, (response) => {
            let [resultList, contentIdArr] = [response.resultList, []];
            for (let r in resultList) {
                contentIdArr.push(resultList[r].contentId);
            }
            this.collectContetnH5_Arr(contentIdArr, 0, () => {
                n += 20;
                this.h5(n);
            });
        });
    };

    cheesy = () => {//多个
        let {val} = this.state;
        val = parseInt(val) ? parseInt(val) : 0;
        this.h5(val);
    };

    cheesy1 = () => {//单个
        let {lj} = this.state;
        let obj = {};
        let arr = lj.split("?")[1].split("&");
        for (let i in arr) {
            obj[arr[i].split("=")[0]] = arr[i].split("=")[1];
        }
        let id = obj.id.split("_")[1];
        currencyNoty("正在生成中...");
        this.collectContetnH5_ArrId(id, (arr) => {
            this.posttaobao1(arr, () => {
                currencyNoty("成功发布");
            });
        });
    };

    collectContetnH5_Arr = (contentIdArr, num, callback) => {
        this.collectContetnH5_ArrId(contentIdArr[num], (arr) => {
            this.posttaobao1(arr, () => {
                numm++;
                currencyNoty("成功发布" + numm + "个", "success");
                num++;
                if (num < 20) {
                    this.collectContetnH5_Arr(contentIdArr, num, callback);
                } else {
                    callback();
                }
            });
        }, true)
    };

    collectContetnH5_ArrId = (contentId, callback) => {
        let data = {
            "id": "1_" + contentId,
            "hasRecommend": "1",
            "hasFavor": "1",
            "hasRate": "1",
            "hasZan": "1"
        };
        let s = {
            type: "jsonp",
            dataType: "jsonp",
            api: "mtop.arctic.mini.detail",
            v: "4.0",
            appKey: 12574478,
            t: new Date().getTime(),
        };

        acoustic({
            parameters: s,
            requesData: data,
            host: "https://h5api.m.taobao.com/h5",
            ajaxData: {requeryType: "get", referer: "https://h5.m.taobao.com"}
        }, "requestH5", (response) => {
            let arr = [];
            arr.push(response.contentId);
            let extList = response.extList;
            for (let e in extList) {
                if (extList[e].type == "2") {
                    let arrList = extList[e].itemList;
                    for (let a in arrList) {
                        arr.push(arrList[a].itemId);
                    }
                }
            }
            this.youhaohuo(arr, 0, callback);
        });
    };

    posttaobao1 = (arr, callback) => {
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
            let itemKey3 = randomStringNum(5);
            value.blocks.push({
                "text": "",
                "data": {},
                "inlineStyleRanges": [],
                "entityRanges": [],
                "type": "unstyled",
                "key": itemKey3,
                "depth": 0
            });
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
            if (arr[a].lizicontent1) {
                let itemKey5 = randomStringNum(5);
                value.blocks.push({
                    "text": "",
                    "data": {},
                    "inlineStyleRanges": [],
                    "entityRanges": [],
                    "type": "unstyled",
                    "key": itemKey5,
                    "depth": 0
                });
                let itemKey6 = randomStringNum(5);
                value.blocks.push({
                    data: {},
                    depth: 0,
                    entityRanges: [],
                    inlineStyleRanges: [{
                        length: arr[a].lizicontent1.length,
                        offset: 0,
                        style: "BOLD",

                    }],
                    key: itemKey6,
                    text: arr[a].lizicontent1,
                    type: "alignCenter",
                });
            }

            if (arr[a].lizipicture1) {
                uu++;
                let itemKey7 = randomStringNum(5);
                value.blocks.push({
                    "text": "",
                    "data": {},
                    "inlineStyleRanges": [],
                    "entityRanges": [],
                    "type": "unstyled",
                    "key": itemKey7,
                    "depth": 0
                });
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
                        picHeight: parseInt(arr[a].lizipicture1.picHeight),
                        picWidth: parseInt(arr[a].lizipicture1.picWidth),
                        pix: arr[a].lizipicture1.picWidth + "x" + arr[a].lizipicture1.picHeight,
                        url: arr[a].lizipicture1.picUrl,
                    },
                    mutability: "MUTABLE",
                    type: "SIDEBARIMAGE",
                };
            }

            if (arr[a].lizicontent2) {
                let itemKey9 = randomStringNum(5);
                value.blocks.push({
                    "text": "",
                    "data": {},
                    "inlineStyleRanges": [],
                    "entityRanges": [],
                    "type": "unstyled",
                    "key": itemKey9,
                    "depth": 0
                });
                let itemKey10 = randomStringNum(5);
                value.blocks.push({
                    data: {},
                    depth: 0,
                    entityRanges: [],
                    inlineStyleRanges: [],
                    key: itemKey10,
                    text: arr[a].lizicontent2,
                    type: "unstyled",
                });
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
        let typeTab = '潮男';
        let data = {
            id: 0,
            typeTab: typeTab,
            contentModeId: 33,
            data: content,
            version: 3
        };
        Ajax({
            url: "/content/admin/post/domain.content.add.io",
            data: {data: JSON.stringify(data)},
            type: "post",
            callback: () => {
                callback();
            }
        })
    };

    youhaohuo = (arr = [], num = 0, callback, arrItem = []) => {
        if (arrItem.length < 8) {
            let data = {
                "contentId": arr[num].slice(7),
                "source": "youhh_h5",
                "type": "h5",
                "params": "",
                "businessSpm": "",
                "business_spm": "",
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
                let richText = content.richText;
                let m = 0;
                for (let r in richText) {
                    let resource = richText[r].resource;
                    if (resource.length > 0) {
                        for (let re in resource) {
                            if (resource[re].entityType = "ResourceText") {
                                if (resource[re].text) {
                                    if (resource[re].text.length < 10) {
                                        m++;
                                        obj["lizicontent" + m] = resource[re].text;
                                    }
                                    if (resource[re].text.length > 10) {
                                        m++;
                                        obj["lizicontent" + m] = resource[re].text;
                                    }
                                } else if (resource[re].picture) {
                                    if (parseInt(resource[re].picture.picHeight) > 100) {
                                        obj["lizipicture" + m] = resource[re].picture;
                                    }
                                }
                            } else if (resource[re].entityType = "ResourcePic") {
                                if (parseInt(resource[re].picture.picHeight) > 100) {
                                    obj["lizipicture" + m] = resource[re].picture;
                                }
                            }
                        }
                    }
                }
                let you = setInterval(() => {
                    clearInterval(you);
                    arrItem.push(obj);
                    num++;
                    this.youhaohuo(arr, num, callback, arrItem);
                }, 500);
            });
        } else {
            callback(arrItem);
        }
    };

    valChange = (env) => {
        let value = env.target.value;
        this.setState({val: value});
    };

    ljChange = (env) => {
        let value = env.target.value;
        this.setState({lj: value});
    };

    keyChange = (env) => {//关键词
        let value = env.target.value;
        this.setState({key: value});
    };

    getList = (type = 1) => {//大列表
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
        let data = {"d": JSON.stringify(obj)};
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
            let content = response.result["1891397"].result[0].data[0].data[0][0];
            let result = content.result.result;
            let arr = [];
            for (let i in result) {
                let {feedId, cover, title} = result[i];
                arr.push({feedId, cover, title});
            }
            if (type == 1) {
                this.setState({bigList: bigList.concat(arr)});
            } else {
                this.setState({bigList: arr});
            }
        });
    };

    search = () => {
        this.setState({page: 1}, () => {
            this.getList(2);
        });
    };

    getCheesy = (env) => {//小列表
        let feedId = $(env.target).data("id");
        let obj = {
            "videoFrom": "youhaohuo",
            "business_spm": "a2141.7631543"
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
            let {lab, smallList} = this.state;
            let arr1 = [];
            for (let s in smallList) {
                if ((lab.join().indexOf(smallList[s].id)) >= 0) {
                    arr1.push(smallList[s]);
                }
            }
            let result = response.result;
            let arr = [];
            for (let i in result) {
                let {id, cover, title, item} = result[i];
                arr.push({
                    id,
                    cover,
                    title,
                    itemUrl: item ? (item.itemUrl ? item.itemUrl : "//item.taobao.com/item.htm?id=" + item.itemId) : undefined
                });
            }
            currencyNoty("请稍等，自动剔除不合格好货内容...", 'success');
            this.promise(arr, (array) => {
                this.setState({smallList: [...arr1, ...array]}, () => {
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
                "videoFrom": "youhaohuo"
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
                let t = 0;
                let frontModuleJson = response.models.config.frontModuleJson;
                for (let c in frontModuleJson) {
                    if (frontModuleJson[c].name == 'item-paragraph-select' || frontModuleJson[c].name == 'item-paragraph') {
                        if (!(frontModuleJson[c].data.title == '品牌介绍' || frontModuleJson[c].data.title == '好在哪里' || frontModuleJson[c].data.title == '品牌故事')) {
                            if (frontModuleJson[c].data.desc.length > 50) {
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
                }, 100);
            });
        } else {
            callback(arrItem);
        }
    };

    labChange = (env) => {
        let lab = this.state.lab;
        let value = env.target.value;
        let index = $.inArray(value, lab);
        if (index >= 0) {
            lab.splice(index, 1);
        } else {
            lab.push(value);
        }
        this.setState({lab: lab});
    };

    selectAll = () => {
        let {smallList} = this.state;
        let arr = [];
        for (let i in smallList) {
            arr.push(smallList[i].id);
        }
        this.setState({lab: arr});
    };

    selectAgainst = () => {
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

    del = () => {
        let {smallList} = this.state;
        let arr = [];
        for (let i in smallList) {
            if (smallList[i].pool != 'c') {
                arr.push(smallList[i]);
            }
        }
        this.setState({smallList: arr});
    };

    GenerationOfAlbum = () => {
        let {lab} = this.state;
        if (lab.length > 0) {
            currencyNoty("请稍等...", "success");
            this.get__Data(lab, (arrItem) => {
                let callback = (radioId, typeTab) => {
                    this.album(arrItem, radioId, typeTab);
                };
                this.setState({callback: callback}, () => {
                    this.rapidAddition.open("album");
                });
            });
        } else {
            currencyNoty("未选择商品", "warning");
        }
    };

    GenerationOfPost = () => {
        let {lab} = this.state;

        let n = new noty({
            text: '<h4>选择合成类型？</h4>',
            theme: 'bootstrap-v4',
            modal: true,
            layout: 'center',
            type: 'warning',
            buttons: [
                noty.button('结构体', 'btn btn-success', ()=> {
                    if (lab.length > 0 && lab.length < 11) {
                        currencyNoty("请稍等...", "success");
                        this.get_StructData(lab, (arrItem) => {
                            let callback = (radioId, typeTab, mb) => {
                                this.struct(arrItem, radioId, typeTab, mb);
                            };
                            this.setState({callback: callback}, () => {
                                this.rapidAddition.open("post");
                            });
                        });
                    } else {
                        currencyNoty("未选择商品或商品数超过10个", "warning");
                    }
                    n.close();
                }, {id: 'button1', 'data-status': 'ok'}),
                noty.button('帖子', 'btn btn-info', ()=> {
                    if (lab.length > 0) {
                        currencyNoty("请稍等...", "success");
                        this.get_Data(lab, (arrItem) => {
                            let callback = (radioId, typeTab) => {
                                this.post(arrItem, radioId, typeTab);
                            };
                            this.setState({callback: callback}, () => {
                                this.rapidAddition.open("post");
                            });
                        });
                    } else {
                        currencyNoty("未选择商品", "warning");
                    }
                    n.close();
                })
            ]
        }).show();
    };

    GenerationOfTopStruct = () => {
        let {lab} = this.state;
        if (lab.length > 0 && lab.length < 11) {
            currencyNoty("请稍等...", "success");
            this.get_StructData(lab, (arrItem) => {
                let callback = (radioId, typeTab, mb) => {
                    this.struct(arrItem, radioId, typeTab, mb);
                };
                this.setState({callback: callback}, () => {
                    this.rapidAddition.open("post");
                });
            });
        } else {
            currencyNoty("未选择商品或商品数超过10个", "warning");
        }
    };

    getTemplate = (arr, constraint, callback, item = [], num = 0) => {
        constraint.props.value[num].data = {};
        constraint.props.value[num].data = arr.shift();
        item.push(constraint.props.value[num]);
        callback(arr, item);
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

    getTemplates = (arr, mb, callback, num = 0) => {
        let constraint = mb.constraint;
        if (constraint[num].type == "StructCanvas") {
            let n = constraint[num].props.value;
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
            constraint[num].props.value = n;
            this.getTemplateas(arr, constraint[num], callback);
        } else {
            num++;
            this.getTemplates(arr, mb, callback, num);
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
            Ajax({
                url: "/content/admin/post/domain.content.add.io",
                data: {data: JSON.stringify(data)},
                type: "post",
                callback: () => {
                    currencyNoty("成功发布", "success");
                }
            })
        });
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
                /*let des=()=>{
                    let richText=content.richText;
                    let m=0;
                    let obj={};
                    for(let r in richText){
                        let resource=richText[r].resource;
                        if(resource.length>0){
                            for(let re in resource){
                                if(resource[re].entityType="ResourceText"){
                                    if(resource[re].text){
                                        if(resource[re].text.length<10){
                                            m++;
                                            obj["lizicontent"+m]=resource[re].text;
                                        }
                                        if(resource[re].text.length>10){
                                            m++;
                                            obj["lizicontent"+m]=resource[re].text;
                                        }
                                    }else if(resource[re].picture){
                                        if(parseInt(resource[re].picture.picHeight)>100){
                                            obj["lizipicture"+m]=resource[re].picture;
                                        }
                                    }
                                }else if(resource[re].entityType="ResourcePic"){
                                    if(parseInt(resource[re].picture.picHeight)>100){
                                        obj["lizipicture"+m]=resource[re].picture;
                                    }
                                }
                            }
                        }
                    }
                    return obj;
                };*/
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
        Ajax({
            url: "/content/admin/album/domain.content.add.io",
            data: {data: JSON.stringify(data)},
            type: "post",
            callback: () => {
                currencyNoty("成功发布", "success");
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

            let t = a < 9 ? numt[a] : "— " + (a + 1)+ " —";
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
            // let itemKey3=randomStringNum(5);
            // value.blocks.push({
            //     "text": "",
            //     "data": {},
            //     "inlineStyleRanges": [],
            //     "entityRanges": [],
            //     "type": "unstyled",
            //     "key": itemKey3,
            //     "depth": 0
            // });
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
                    //if(li[l].title=='设计亮点'){
                    // let itemKey5=randomStringNum(5);
                    // value.blocks.push({
                    //     "text": "",
                    //     "data": {},
                    //     "inlineStyleRanges": [],
                    //     "entityRanges": [],
                    //     "type": "unstyled",
                    //     "key": itemKey5,
                    //     "depth": 0
                    // });
                    // let itemKey6=randomStringNum(5);
                    // value.blocks.push({
                    //     data: {},
                    //     depth: 0,
                    //     entityRanges: [],
                    //     inlineStyleRanges: [{
                    //         length: li[l].title.length,
                    //         offset: 0,
                    //         style: "BOLD",
                    //
                    //     }],
                    //     key: itemKey6,
                    //     text: li[l].title,
                    //     type: "alignCenter",
                    // });
                    uu++;
                    // let itemKey7=randomStringNum(5);
                    // value.blocks.push({
                    //     "text": "",
                    //     "data": {},
                    //     "inlineStyleRanges": [],
                    //     "entityRanges": [],
                    //     "type": "unstyled",
                    //     "key": itemKey7,
                    //     "depth": 0
                    // });
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
                    // let itemKey9=randomStringNum(5);
                    // value.blocks.push({
                    //     "text": "",
                    //     "data": {},
                    //     "inlineStyleRanges": [],
                    //     "entityRanges": [],
                    //     "type": "unstyled",
                    //     "key": itemKey9,
                    //     "depth": 0
                    // });
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
                //}
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
        Ajax({
            url: "/content/admin/post/domain.content.add.io",
            data: {data: JSON.stringify(data)},
            type: "post",
            callback: () => {
                currencyNoty("成功发布", "success");
            }
        })
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

    typeIdChange = (env) => {
        let value = env.target.value;
        this.setState({typeId: value});
    };

    fixedChange = (env) => {
        let value = env.target.value;
        this.setState({fixed: value});
    };

    category = () => {
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
            currencyNoty("请选择类型", "warning");
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
            currencyNoty("判断选品池完毕", "success");
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

    fixed = () => {
        let {fixed, fixedPool} = this.state;
        if (fixed) {
            this.fixed_pp(fixedPool[fixed - 1], this.state.smallList);
        } else {
            currencyNoty("请选择一个固定选品池", "warning");
        }
    };

    fixed_pp = (cs, list, l = 0) => {
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
            currencyNoty("判断选品池完毕", "success");
        }
    };

    urlAnalysis = (cs) => {
        let item = {};
        let arr = cs.split("&");
        for (let i in arr) {
            item[((arr[i].split("="))[0])] = (arr[i].split("="))[1];
        }
        return item;
    };

    render() {
        let {val, lj, key, bigList, listJudge, smallList, lab, page, typeArr, typeId, fixedPool, fixed} = this.state;
        return (
            <div>
                <FormGroup>
                    <InputGroup>
                        <FormControl type="text" value={key} onChange={this.keyChange} placeholder="请输入搜索关键词"/>
                        <InputGroup.Button>
                            <Button bsStyle="primary" onClick={this.search}>搜索</Button>
                        </InputGroup.Button>
                    </InputGroup>
                </FormGroup>
                {bigList.length > 0 &&
                <Panel header="文案合成" bsStyle="success" style={{marginTop: "10px"}}>
                    {listJudge && <div className="editBox" style={{top: "50px", left: "210px"}}>
                        <FormGroup validationState="success" style={{marginTop: "5px"}}>
                            操作：
                            <Button bsStyle="info" onClick={() => {
                                this.setState({listJudge: false})
                            }} title="会保留勾选数据">
                                返回上一级
                            </Button>
                            {' '}
                            <Button bsStyle="success" onClick={this.selectAll}>
                                全选
                            </Button>
                            {' '}
                            <Button bsStyle="info" onClick={this.selectAgainst}>
                                反选
                            </Button>
                            {' '}
                            <Button bsStyle="warning" onClick={this.selectClear}>
                                不选
                            </Button>
                            {' '}
                            <Button bsStyle="primary" onClick={this.GenerationOfPost} title="建议勾选5个以上商品">
                                提交合成帖子(结构体)
                            </Button>
                            {' '}
                            <Button bsStyle="primary" onClick={this.GenerationOfAlbum} title="建议全选">
                                提交合成清单
                            </Button>
                            {' '}
                            {/*<Button bsStyle="primary" onClick={this.GenerationOfTopStruct} title="建议勾选6个以上商品,只适应于top榜单">
                                提交合成结构体
                            </Button>*/}
                            {' '}
                            <FormControl componentClass="select" placeholder="select" onChange={this.typeIdChange}
                                         value={typeId ? typeId : "0"}
                                         style={{width: "200px", display: "inline"}}>
                                <option value="0" disabled>选择类型</option>
                                {(typeArr ? typeArr : []).map((item, i) => {
                                    if (item.id != "0") {
                                        return (
                                            <option value={item.id} key={item.id + "-" + i}>{item.title}</option>
                                        )
                                    }
                                })}
                            </FormControl>
                            {' '}
                            <Button bsStyle="primary" onClick={this.category} title="请先选择一个选品池类型后确定。提示！只会判断对应类型的选品池">
                                确定
                            </Button>
                            {' '}
                            <FormControl componentClass="select" placeholder="select" onChange={this.fixedChange}
                                         value={fixed ? fixed : "0"}
                                         style={{width: "200px", display: "inline"}}>
                                <option value="0" disabled>选择固定选品池</option>
                                {(fixedPool ? fixedPool : []).map((item, i) => {
                                    return (
                                        <option value={i + 1} key={item.id + "-" + i}>{item.title}</option>
                                    )
                                })}
                            </FormControl>
                            {' '}
                            <Button bsStyle="primary" onClick={this.fixed} title="请先选择一个固定选品池后确定">
                                确定
                            </Button>
                            {' '}
                            <Button bsStyle="danger" onClick={this.del}>
                                清空非选品池
                            </Button>
                            {' '}
                            <Label bsStyle="success" style={{marginLeft: "28px"}}>已勾选({lab.length})个</Label>
                        </FormGroup>
                    </div>}
                    {!listJudge && <Row style={{marginTop: "2px"}}>
                        {(bigList ? bigList : []).map((item, i) => {
                            let title = '';
                            if (item.title) {
                                title = item.title.substring(0, 13);
                            }
                            let titles = title + "...";
                            return (
                                <Col sm={2} key={item.feedId}>
                                    <div className="thumbnail" onClick={this.getCheesy}>
                                        <img src={item.cover} data-id={item.feedId}/>
                                        <p style={{marginTop: "10px"}} title={item.title} data-id={item.feedId}>
                                            {titles}
                                        </p>
                                    </div>
                                </Col>
                            )
                        })}
                    </Row>}
                    {!listJudge && <Button bsStyle="info" onClick={() => {
                        this.setState({page: page + 1}, () => {
                            this.getList(1);
                        })
                    }}>加载更多</Button>}
                    {listJudge && <Row style={{marginTop: "2px"}}>
                        {(smallList ? smallList : []).map((item, i) => {
                            let title = '';
                            if (item.title) {
                                title = item.title.substring(0, 13);
                            }
                            let titles = title + "...";
                            return (
                                <Col sm={2} key={item.id}>
                                    <div style={{position: "relative"}}>
                                        <div style={{position: "absolute", margin: "4px 0 0 8px"}}>
                                            <label>
                                                <input type="checkbox"
                                                       checked={lab.join().indexOf(item.id) > -1 ? "checked" : ""}
                                                       onChange={this.labChange} value={item.id}
                                                       style={{width: "15px", height: "15px"}}/>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="thumbnail">
                                        <a href={item.itemUrl} target="_blank">
                                            <img src={item.cover}/>
                                        </a>
                                        <p style={{marginTop: "10px"}} title={item.title}>
                                            {titles}
                                        </p>
                                        {item.pool == "d" &&
                                        <a href={"https://s.taobao.com/search?type=samestyle&app=i2i&rec_type=&uniqpid=" + item.qx.pid + "&nid=" + item.qx.nid}
                                           target="_blank">{item.qx.sameStyleCount ? item.qx.sameStyleCount + "家在售" : ""}</a>}
                                        {item.pool == "d" && <Label bsStyle="info">{item.qx.q_score}</Label>}
                                        {item.pool == "d" && (item.qx.icon ? item.qx.icon : []).map((con, c) => {
                                            return (
                                                <Label bsStyle="success" key={i + "-" + c}>{con.innerText}</Label>
                                            )
                                        })}
                                        {item.pool ?
                                            <ListGroupItem bsStyle={item.pool == "c" ? "danger" : "success"}
                                                           bsSize="small">已检测:
                                                {item.pool == "d" ? "在选品池" : "不在选品池"}</ListGroupItem> :
                                            <ListGroupItem bsStyle="warning" bsSize="small">未检测</ListGroupItem>}
                                    </div>
                                </Col>
                            )
                        })}
                    </Row>}
                </Panel>
                }
                <RapidAddition ref={e => this.rapidAddition = e} callback={this.state.callback}/>
            </div>
        )
    }
}

class RapidAddition extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            contentMode: [],
            radioId: "",
            typeTab: "",
            num: 0,
            form: 0,
            GroupList: {
                count: 20,
                manageList: [],
                pageNow: 1,
                pageSize: 20,
            },
            groupId: "",
            process: "",
        }
    }

    componentDidMount() {
        // Ajax({
        //     type:"post",
        //     url:"/user/admin/group/queryGroupList.io",
        //     data:{pageNow:1,pageSize:30},
        //     callback:(data)=>{
        //         this.setState({GroupList:data});
        //     }
        // });
        //this.addition();
    }

    addition = (num = 1, type = "post", callback) => {
        Ajax({
            url: "/content/admin/" + type + "/queryContentOvert.io",//要访问的后台地址
            data: {
                pageNow: num,
                pageSize: 30,
                name: "",
            },
            isCloseMask: true,
            callback: (data) => {
                this.setState({contentMode: data.contentMode}, () => {
                    callback();
                });
            }
        })
    };

    additions = (id, num = 1) => {
        Ajax({
            url: "/content/admin/manageGroup/getContentModeByLargeProcess.io",//要访问的后台地址
            data: {
                pageNow: num,
                pageSize: 30,
                name: "",
                groupId: id,
            },
            isCloseMask: true,
            callback: (data) => {
                this.setState({contentMode: data.contentMode});
            }
        })
    };

    open = (type = "post") => {
        this.addition(1, type, () => {
            this.setState({showModal: true});
        });
    };

    close = () => {
        this.setState({
            showModal: false,
            radioId: "",
            typeTab: "",
            num: 0,
            form: 0,
            groupId: "",
            process: "",
        });
    };

    selectTypeTab = (env) => {
        let value = env.target.value;
        let i = $(env.target).data("i");
        this.setState({radioId: value, num: i});
    };

    selectForm = (env) => {
        // let value=env.target.value;
        // this.setState({form:value},()=>{
        //     if(value==0){
        //         this.setState({groupId:"",radioId:""},()=>{
        //             this.addition();
        //         });
        //     }else {
        //         this.setState({radioId:""});
        //     }
        // });
    };

    submit = () => {
        let {typeTab, radioId, num, contentMode, form, groupId, process} = this.state;
        if (typeTab && radioId) {
            if (form == 0) {
                this.close();
                this.props.callback(radioId, typeTab, contentMode[num]);
            } else if (form == 1 && groupId) {
                this.close();
                this.props.callback(radioId, typeTab, contentMode[num], form, groupId, process);
            } else {
                currencyNoty("必选一个小组", "warning");
            }
        } else {
            currencyNoty("类型渠道必选", "warning");
        }
    };

    selectType = (env) => {
        let value = env.target.value;
        this.setState({typeTab: value});
    };

    selectGroup = (env) => {
        let process = $(env.target).data("p");
        let value = env.target.value;
        this.setState({groupId: value, process: process}, () => {
            this.additions(value);
        });
    };

    render() {
        let typeTabRadioarr = ["潮女", "潮男", "美妆", "母婴", "户外", "数码", "家居", "文体", "汽车", "美食"];
        let {contentMode, radioId, showModal, typeTab, form, GroupList, groupId} = this.state;
        return (
            <Modal show={showModal} onHide={this.close} bsSize="large" backdrop='static'>
                <Modal.Header closeButton>
                    <Modal.Title>快速添品</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Panel header={title.type} bsStyle="primary">
                        <FormGroup>
                            <Radio name="radioGroup" className="radio-inline" value="0"
                                   onClick={this.selectForm}
                                   checked={form == 0 ? "checked" : ""} inline>
                                个人
                            </Radio>
                            {/*<br/>
                            <Radio name="radioGroup" className="radio-inline" value="1"
                                   onClick={this.selectForm}
                                   checked={form == 1 ? "checked" : ""} inline>
                                小组
                            </Radio>*/}
                        </FormGroup>
                        {form == 1 &&
                        <Alert>
                            选择一个小组(必选):<br/>
                            {GroupList.manageList.map((item, i) => {
                                return (
                                    <Radio key={item.id} value={item.id} onChange={this.selectGroup}
                                           data-p={item.process}
                                           checked={item.id == groupId} inline>
                                        {item.name}
                                    </Radio>
                                );
                            })}
                        </Alert>
                        }
                    </Panel>
                    <Panel header={title.rapidAdditionType} bsStyle="info">
                        {typeTabRadioarr.map((item) => {
                            return (
                                <Radio key={item} value={item} onChange={this.selectType}
                                       checked={item == typeTab} inline>
                                    {item}
                                </Radio>
                            );
                        })}
                    </Panel>
                    <Panel header={title.rapidAddition} bsStyle="success">
                        {(contentMode ? contentMode : []).map((item, i) => {
                            return (
                                <Radio value={item.id} onChange={this.selectTypeTab} data-i={i}
                                       checked={radioId == item.id} key={item.id} inline>
                                    {item.name}
                                </Radio>
                            )
                        })}
                    </Panel>
                    <ButtonGroup justified>
                        <Button bsStyle="danger" href="#" onClick={() => {
                            this.close();
                        }}>取消</Button>
                        <Button bsStyle="primary" href="#" onClick={this.submit}>确定</Button>
                    </ButtonGroup>
                </Modal.Body>
            </Modal>
        )
    }
}

export default TaobaoCheesy;
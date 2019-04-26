/**
 * Created by 薛荣晖 on 2018/12/11 0011上午 9:25.店铺新品排重
 */

import React from "react";
import {Button, Tabs, Tag, Tooltip, Input, Select, Layout, Checkbox, MessageBox, Message, Alert, Progress} from "element-react";
import 'element-theme-default';
import AJAX from '../../../../../../lib/newUtil/AJAX';
import {ThousandsOfCall} from '../../../../../../lib/util/ThousandsOfCall';
import '../../../../../../../styles/addList/content.css';
import '../../../../../../../styles/component/react_assembly/editBox.css';
import {acoustic, urlAnalysis} from "../../../../../../lib/util/global";
import ReactChild from "../../../../../../lib/util/ReactChild";
import $ from 'jquery';
import {DialogBundle} from '../../../../../../../bundle';
import favoriteModelContainere from 'bundle-loader?lazy&name=pc/trends_asset/components/user/head/app-[name]!./components/favoriteModel';
import RapidAdditionContainere from 'bundle-loader?lazy&name=pc/trends_asset/components/user/head/app-[name]!./components/RapidAddition';

const urlStr = ({url, callback}) => {
    let urlAnl = (url) => {
        let str = url.split('//')[1];
        let str1 = str.split(':')[1];
        return url.replace(':' + str1, '');
    };
    ThousandsOfCall.acoustic({
        url: urlAnl(url)
    }, "switchAccount", () => {
        callback();
    });
};

let url_jc = (img) => {
    if (img.indexOf('_60') > -1) {
        img = img.split('_60')[0];
    } else if (img.indexOf('_50') > -1) {
        img = img.split('_50')[0];
    } else if (img.indexOf('_30') > -1) {
        img = img.split('_30')[0];
    } else if (img.indexOf('_240') > -1) {
        img = img.split('_240')[0];
    }
    return img;
};


class NewStores extends ReactChild {
    constructor(props) {
        super(props);
        this.state = {
            shopName: "",
            shop: [],
            data: [],
            lab: [],
            searchName: "",
            fixedPool: [
                {title: "有好货全量商品池——B+C", id: 3734, kxuan_swyt_item: 24629, searchtype: "item", ruletype: 2},
                {title:'有好货单品内容多元化第一期商品池',id:4073,kxuan_swyt_item:32627,searchtype:'item',ruletype: 2}
            ],
            flow: false,
            sz_type: 'newOn_desc',
            purchase: '',
            failureTime: 0,
            sz_typeArr: [
                {name: "综合排序", type: "defaultSort"},
                {name: "销量", type: "hotsell_desc"},
                {name: "新品", type: "newOn_desc"},
                {name: "收藏", type: "hotkeep_desc"},
                {name: "价格↑", type: "price_asc"},
                {name: "价格↓", type: "price_desc"},
                {name: "口碑", type: "koubei"},
            ],
        }
    }

    sz_typeChange = (value) => {//选择
        this.setState({sz_type: value});
    };

    clearButton = () => {//清空
        this.setState({shopName: ""});
    };

    shopNameChange = (value) => {//输入店铺旺旺名
        let v = value.replace("，", ",");
        this.setState({shopName: v});
    };

    shopNameButton = (callback) => {//搜索店铺
        let shopName = this.state.shopName;
        let arr = shopName.split(",");
        this.setState({shop: [], data: []}, () => {
            this.search(arr, 0, () => {
                Message({
                    message: '获取完毕',
                    type: 'success',
                    duration: 1000
                });
                if (callback && typeof callback === "function") {
                    Message({
                        message: '排重中,请稍等...',
                        type: 'warning',
                        duration: 3000
                    });
                    this.isSchedulings(arr.length, 0, callback);
                }
                if (this.state.test) {
                    this.ks_test(this.state.shop);
                }
            }, 1);
        });
    };

    isSchedulings = (len, n, callback, it) => {
        let {shop} = this.state;
        let item = it ? it : shop[n].item;
        let numIid = "";
        let l = false;
        for (let i in item) {
            if (i < 30) {
                numIid += item[i].id + ",";
            } else {
                l = true;
                break;
            }
        }
        if (l) {
            let it = item.slice(30);
            this.NewStoresAjax.ajax({
                type: 'post',
                url: '/message/admin/cheesy/domain.item.cheesylibraryList.io',
                data: {'numIid': numIid.substring(0, numIid.length - 1)},
                isCloseMask: true,
                callback: (json) => {
                    let item = json.item;
                    let shop = this.state.shop;
                    let data = shop[n].item;
                    for (let i in data) {
                        if (numIid.indexOf(data[i].id) > -1) {
                            data[i].pc = true;
                            data[i].pcType = 3;
                            for (let it in item) {
                                if (data[i].id == item[it].numIid) {
                                    if (item[it].isInPond) {
                                        data[i].pcType = 1;
                                    } else if (item[it].isRelease) {
                                        data[i].pcType = 2;
                                    } else {
                                        data[i].pcType = 3;
                                    }
                                }
                            }
                        }
                    }
                    shop[n].item = data;
                    this.setState({shop: shop}, () => {
                        let s = setTimeout(() => {
                            clearTimeout(s);
                            this.isSchedulings(len, n, callback, it);
                        }, 1000);
                    });
                }
            })
        } else {
            this.NewStoresAjax.ajax({
                type: 'post',
                url: '/message/admin/cheesy/domain.item.cheesylibraryList.io',
                data: {'numIid': numIid.substring(0, numIid.length - 1)},
                isCloseMask: true,
                callback: (json) => {
                    let item = json.item;
                    let shop = this.state.shop;
                    let data = shop[n].item;
                    for (let i in data) {
                        if (numIid.indexOf(data[i].id) > -1) {
                            data[i].pc = true;
                            data[i].pcType = 3;
                            for (let it in item) {
                                if (data[i].id == item[it].numIid) {
                                    if (item[it].isInPond) {
                                        data[i].pcType = 1;
                                    } else if (item[it].isRelease) {
                                        data[i].pcType = 2;
                                    } else {
                                        data[i].pcType = 3;
                                    }
                                }
                            }
                        }
                    }
                    shop[n].item = data;
                    this.setState({shop: shop}, () => {
                        n += 1;
                        if (len <= n) {
                            //callback();自动添加回调
                            Message({
                                message: '结束了',
                                type: 'warning',
                                duration: 1000
                            });
                        } else {
                            let s = setTimeout(() => {
                                clearTimeout(s);
                                this.isSchedulings(len, n, callback);
                            }, 1000);
                        }
                    });
                }
            })
        }
    };

    ks_test = (shop, i = 0) => {
        let {fixed, fixedPool} = this.state;
        let item = shop[i].item;
        let b = [];
        for (let it in item) {
            b.push(item[it].itemUrl);
        }
        this.fixed_pp(fixedPool[fixed - 1], b, i, 0, 0, () => {
            if (shop.length > i + 1) {
                this.ks_test(shop, i + 1);
            } else {
                this.setState({speed: undefined}, () => {
                    Message({
                        message: '判断选品池完毕',
                        type: 'success'
                    });
                })
            }
        });
    };

    search = (arr, num, callback, pageNo = 1) => {
        let {sz_type} = this.state;
        Message({
            message: '开始获取店铺信息,请稍等',
            type: 'success',
            duration: 1000
        });
        this.NewStoresAjax.ajax({
            url: "/user/admin/visible/getShopByNick.io",
            data: {nick: arr[num]},
            isCloseMask: true,
            callback: (data) => {
                let sid = data.myShop.sid;
                let date = {};
                ThousandsOfCall.acoustic({
                        agreement: "https",
                        hostname: 'shop' + sid + '.taobao.com',
                        path: "/",
                        data: date,
                        method: "get",
                        referer: "https://taobao.com/"
                    }, "requestRelyTB", (call_json) => {
                        let json = call_json.data;
                        if (json.indexOf("天猫Tmall") > -1) {
                            let t = json.indexOf("canonical");
                            let s1 = json.substr(t - 60, 60);
                            let s2 = s1.split("href");
                            let arr1 = s2[1].split('"');
                            let d = {
                                orderType: sz_type,
                                tsearch: 'y',
                                search: 'y',
                                pageNo: 1
                            };
                            let arr100 = arr1[1].split('://');
                            ThousandsOfCall.acoustic({
                                    agreement: arr100[0],
                                    hostname: arr100[1].split('/')[0],
                                    path: "/search.htm",
                                    data: d,
                                    method: "get",
                                    referer: "https://taobao.com/"
                                }, "requestRelyTB", (call_item) => {
                                    let item = call_item.data;
                                    let j1 = item.indexOf("J_ShopAsynSearchURL");
                                    let n1 = item.substr(j1 + 20, 66);
                                    let arr2 = n1.split('mid=');
                                    let arr3 = arr2[1].split("&");
                                    let setItem = setTimeout(() => {
                                        clearTimeout(setItem);
                                        ThousandsOfCall.acoustic({
                                            agreement: arr100[0],
                                            hostname: arr100[1].split('/')[0],
                                            path: "/i/asynSearch.htm",
                                            data: {
                                                mid: arr3[0],
                                                orderType: sz_type,
                                                pageNo: pageNo
                                            },
                                            method: "get",
                                            referer: "https://taobao.com/"
                                        }, "requestRelyTB", (call_it) => {
                                            let it = call_it.data;
                                            if (it.indexOf("J_TItems") > 0) {//天猫
                                                let page = pageNo + 1;
                                                let pa = false;
                                                if (it.indexOf(">" + page + "</a>") > 0) {
                                                    pa = true;
                                                }
                                                let t1 = (it.split("J_TItems"))[1];
                                                let t2 = (t1.split("本店内推荐"))[0];
                                                let j2 = t2.split('class=\\"J_TGoldData\\"');
                                                let data = this.state.data;
                                                let j3 = [];
                                                for (let i in j2) {
                                                    if (i > 0) {
                                                        let j4 = j2[i].split('href=\\"');
                                                        let j5 = j4[1].split("&");
                                                        let j12 = j5[0].split("id=");

                                                        let j6 = j2[i].split('alt=\\"');
                                                        let j7 = j6[1].split('\\"');

                                                        let j8 = j2[i].split('lazyload=\\"');
                                                        let j9 = j8[1].split('\\"');

                                                        let j10 = j2[i].split('c-price\\">');
                                                        let j11 = j10[1].split('<');
                                                        let obj = {
                                                            title: j7[0],
                                                            itemUrl: j5[0],
                                                            coverUrl: url_jc(j9[0]),
                                                            price: j11[0],
                                                            id: parseInt(j12[1]),
                                                            shop: arr[num],
                                                        };
                                                        j3.push(obj);
                                                        data.push(obj);
                                                    }
                                                }
                                                let itemShop = {
                                                    name: arr[num],
                                                    item: j3,
                                                    page: pa,
                                                    numPage: pageNo
                                                };
                                                let shop = this.state.shop;
                                                let [l, nu, ls] = [true, 0, -1];
                                                for (let i in shop) {
                                                    if (shop[i].name == arr[num]) {
                                                        let item = shop[i].item;
                                                        ls = i;
                                                        let it = itemShop.item;
                                                        for (let t in it) {
                                                            item.push(it[t]);
                                                        }
                                                        itemShop.item = item;
                                                        nu++;
                                                    } else {
                                                        nu++;
                                                    }
                                                }
                                                let set = setTimeout(() => {
                                                    if (shop.length <= nu) {
                                                        if (l) {
                                                            clearTimeout(set);
                                                            if (ls == -1) {
                                                                shop.push(itemShop);
                                                            } else {
                                                                shop.splice(ls, 1, itemShop);
                                                            }
                                                            this.setState({shop: shop, data: data}, () => {
                                                                if (arr.length > (num + 1)) {
                                                                    let n = num + 1;
                                                                    this.search(arr, n, callback, pageNo);
                                                                } else {
                                                                    callback();
                                                                }
                                                            });
                                                        } else {
                                                            clearTimeout(set);
                                                            if (arr.length > (num + 1)) {
                                                                let n = num + 1;
                                                                this.search(arr, n, callback, pageNo);
                                                            } else {
                                                                callback();
                                                            }
                                                        }
                                                    }
                                                }, 500);
                                            } else {
                                                let data = JSON.parse(it);
                                                if (data && data.url) {
                                                    if (this.state.failureTime < 3) {
                                                        urlStr({url: data.url, callback: () => this.setState({failureTime: this.state.failureTime + 1}, this.search(arr, num, callback, pageNo))});
                                                    } else {
                                                        this.setState({failureTime: 0}, () => {
                                                            Message({
                                                                message: '多次获得数据失败，请稍后重试',
                                                                type: 'warning',
                                                                duration: 1000
                                                            });
                                                        });
                                                    }
                                                } else {
                                                    Message({
                                                        message: '未获得数据，请检查淘宝登录状态是否中断并确认该店铺是否有新品页面"',
                                                        type: 'warning',
                                                        duration: 1000
                                                    });
                                                }
                                            }
                                        })
                                    }, 200);
                                }
                            );
                        } else {
                            let d = {
                                orderType: sz_type,
                            };
                            ThousandsOfCall.acoustic({
                                    agreement: "https",
                                    hostname: 'shop' + sid + '.taobao.com',
                                    path: "/search.htm",
                                    data: d,
                                    method: "get",
                                    referer: "https://taobao.com/"
                                }, "requestRelyTB", (call_item) => {
                                    let item = call_item.data;
                                    let j1 = item.indexOf("J_ShopAsynSearchURL");
                                    let n1 = item.substr(j1 + 20, 66);
                                    let arr2 = n1.split('mid=');
                                    let arr3 = arr2[1].split("&");
                                    let setItem = setTimeout(() => {
                                        clearTimeout(setItem);
                                        ThousandsOfCall.acoustic({
                                            agreement: "https",
                                            hostname: this.state.purchase ? urlAnalysis(this.state.purchase).hostname : 'shop' + sid + '.taobao.com',
                                            path: "/i/asynSearch.htm",
                                            data: {
                                                mid: arr3[0],
                                                orderType: sz_type,
                                                pageNo: pageNo
                                            },
                                            method: "get",
                                            referer: "https://taobao.com/"
                                        }, "requestRelyTB", (call_it) => {
                                            let it = call_it.data;
                                            if (it.indexOf("shop-hesper-bd grid") > 0) {//淘宝
                                                let page = pageNo + 1;
                                                let pa = false;
                                                if (it.indexOf(">" + page + "</a>") > 0) {
                                                    pa = true;
                                                }

                                                let t1 = (it.split("shop-hesper-bd grid"))[1];
                                                let t2 = (t1.split("page-cur"))[0];
                                                let j2 = t2.split('class=\\"J_TGoldData\\"');
                                                let data = this.state.data;
                                                let j3 = [];
                                                for (let i in j2) {
                                                    if (i > 0) {
                                                        let j4 = j2[i].split('href=\\"');
                                                        let j5 = j4[1].split('\\"');
                                                        let j12 = j5[0].split("id=");

                                                        let j6 = j2[i].split('alt=\\"');
                                                        let j7 = j6[1].split('\\"');

                                                        let j8 = j2[i].split(' src=\\"');
                                                        let j9 = j8[1].split('\\"');

                                                        let j10 = j2[i].split('c-price\\">');
                                                        let j11 = j10[1].split('<');
                                                        let obj = {
                                                            title: j7[0],
                                                            itemUrl: j5[0],
                                                            coverUrl: url_jc(j9[0]),
                                                            price: j11[0],
                                                            id: parseInt(j12[1]),
                                                            shop: arr[num],
                                                        };
                                                        j3.push(obj);
                                                        data.push(obj);
                                                    }
                                                }
                                                let itemShop = {
                                                    name: arr[num],
                                                    page: pa,
                                                    item: j3,
                                                    numPage: pageNo,
                                                };
                                                let shop = this.state.shop;
                                                let [l, nu, ls] = [true, 0, -1];
                                                for (let i in shop) {
                                                    if (shop[i].name == arr[num]) {
                                                        let item = shop[i].item;
                                                        ls = i;
                                                        let it = itemShop.item;
                                                        for (let t in it) {
                                                            item.push(it[t]);
                                                        }
                                                        itemShop.item = item;
                                                        nu++;
                                                    } else {
                                                        nu++;
                                                    }
                                                }
                                                let set = setTimeout(() => {
                                                    if (shop.length <= nu) {
                                                        if (l) {
                                                            clearTimeout(set);
                                                            if (ls == -1) {
                                                                shop.push(itemShop);
                                                            } else {
                                                                shop.splice(ls, 1, itemShop);
                                                            }
                                                            this.setState({shop: shop, data: data}, () => {
                                                                if (arr.length > (num + 1)) {
                                                                    let n = num + 1;
                                                                    this.search(arr, n, callback, pageNo);
                                                                } else {
                                                                    callback();
                                                                }
                                                            });
                                                        } else {
                                                            clearTimeout(set);
                                                            if (arr.length > (num + 1)) {
                                                                let n = num + 1;
                                                                this.search(arr, n, callback, pageNo);
                                                            } else {
                                                                callback();
                                                            }
                                                        }
                                                    }
                                                }, 500);
                                            } else if (it.indexOf("J_TItems") > 0) {//天猫国际

                                                let page = pageNo + 1;
                                                let pa = false;
                                                if (it.indexOf(">" + page + "</a>") > 0) {
                                                    pa = true;
                                                }
                                                let t1 = (it.split("J_TItems"))[1];
                                                let t2 = (t1.split("page-cur"))[0];
                                                let j2 = [],tmgjLength=t2.split('class="J_TGoldData"').length;
                                                if(tmgjLength>1){
                                                    j2=t2.split('class="J_TGoldData"');
                                                }else {
                                                    j2=t2.split('class=\\"J_TGoldData\\"');
                                                }
                                                let data = this.state.data;
                                                let j3 = [];
                                                for (let i in j2) {
                                                    if (i > 0) {
                                                        if(tmgjLength.length>1){
                                                            let j4 = j2[i].split('href="');
                                                            let j5 = j4[1].split('"');
                                                            let j12 = j5[0].split("id=");

                                                            let j6 = j2[i].split('alt="');
                                                            let j7 = j6[1].split('"');

                                                            let j8 = j2[i].split(' data-ks-lazyload="');
                                                            let j9 = j8[1].split('"');

                                                            let j10 = j2[i].split('c-price">');
                                                            let j11 = j10[1].split('<');
                                                            let obj = {
                                                                title: j7[0],
                                                                itemUrl: j5[0],
                                                                coverUrl: j9[0],
                                                                price: j11[0],
                                                                id: parseInt(j12[1]),
                                                                shop: arr[num],
                                                            };
                                                            j3.push(obj);
                                                            data.push(obj);
                                                        }else {
                                                            let j4 = j2[i].split('href=\\"');
                                                            let j5 = j4[1].split('\\"');
                                                            let j12 = j5[0].split("id=");

                                                            let j6 = j2[i].split('alt=\\"');
                                                            let j7 = j6[1].split('\\"');

                                                            let j8 = j2[i].split(' data-ks-lazyload=\\"');
                                                            let j9 = j8[1].split('\\"');

                                                            let j10 = j2[i].split('c-price\\">');
                                                            let j11 = j10[1].split('<');
                                                            let obj = {
                                                                title: j7[0],
                                                                itemUrl: j5[0],
                                                                coverUrl: j9[0],
                                                                price: j11[0],
                                                                id: parseInt(j12[1]),
                                                                shop: arr[num],
                                                            };
                                                            j3.push(obj);
                                                            data.push(obj);
                                                        }
                                                    }
                                                }
                                                let itemShop = {
                                                    name: arr[num],
                                                    page: pa,
                                                    item: j3,
                                                    numPage: pageNo,
                                                };
                                                let shop = this.state.shop;
                                                let [l, nu, ls] = [true, 0, -1];
                                                for (let i in shop) {
                                                    if (shop[i].name == arr[num]) {
                                                        let item = shop[i].item;
                                                        ls = i;
                                                        let it = itemShop.item;
                                                        for (let t in it) {
                                                            item.push(it[t]);
                                                        }
                                                        itemShop.item = item;
                                                        nu++;
                                                    } else {
                                                        nu++;
                                                    }
                                                }
                                                let set = setTimeout(() => {
                                                    if (shop.length <= nu) {
                                                        if (l) {
                                                            clearTimeout(set);
                                                            if (ls == -1) {
                                                                shop.push(itemShop);
                                                            } else {
                                                                shop.splice(ls, 1, itemShop);
                                                            }
                                                            this.setState({shop: shop, data: data}, () => {
                                                                if (arr.length > (num + 1)) {
                                                                    let n = num + 1;
                                                                    this.search(arr, n, callback, pageNo);
                                                                } else {
                                                                    callback();
                                                                }
                                                            });
                                                        } else {
                                                            clearTimeout(set);
                                                            if (arr.length > (num + 1)) {
                                                                let n = num + 1;
                                                                this.search(arr, n, callback, pageNo);
                                                            } else {
                                                                callback();
                                                            }
                                                        }
                                                    }
                                                }, 500);
                                            } else {
                                                if(it){
                                                    let data = JSON.parse(it);
                                                    if (data && data.url) {
                                                        if (this.state.failureTime < 3) {
                                                            urlStr({url: data.url, callback: () => this.setState({failureTime: this.state.failureTime + 1}, this.search(arr, num, callback, pageNo))});
                                                        } else {
                                                            this.setState({failureTime: 0}, () => {
                                                                Message({
                                                                    message: '多次获得数据失败，请稍后重试',
                                                                    type: 'warning',
                                                                    duration: 1000
                                                                });
                                                            });
                                                        }
                                                    } else {
                                                        Message({
                                                            message: '未获得数据，请检查淘宝登录状态是否中断并确认该店铺是否有新品页面',
                                                            type: 'warning',
                                                            duration: 1000
                                                        });
                                                    }
                                                }else {
                                                    Message({
                                                        message: '未返回数据',
                                                        type: 'warning',
                                                        duration: 1000
                                                    });
                                                }
                                            }
                                        });
                                    }, 2000);
                                }
                            )
                        }
                    }
                );
            }
        });
    };

    fixedChange = (value) => {//选品池选择
        this.setState({fixed: value});
    };

    generalChoice=({t,type,id})=>{//通用选择
        let array=[],{shop, lab} = this.state;
        if(type==='selectAll'){
            let {item}= shop[t];
            item.forEach(item=>{
                if (!item.pc) array.push(item.id)
            })
        }else if(type==='select45'){
            let {item}= shop[t],num=0;
            item.forEach(item=>{
                if (!item.pc&&++num<=45) array.push(item.id)
            })
        }else if(type==='selectAgainst'){
            let {item}=shop[t];
            item.forEach(item=>{
                if (lab.indexOf(item.id)<0) array.push(item.id)
            });
        }else if(type==='selectClear'){

        }else if(type==='selectNoStorage'){
            let {item}= shop[t];
            item.forEach(item=>{
                if (item.pcType===3) array.push(item.id)
            })
        }else if(type==='select'){
            let index=lab.indexOf(id);
            if (index < 0) {
                lab.push(id)
            } else {
                lab.splice(index,1)
            }
            array=lab;
        }
        this.setState({lab: array});
    };

    loadMore = ({i}) => {//加载更多
        let shop = this.state.shop;
        this.setState({searchName: shop[i].name, search: false}, () => {
            let [arr, pageNo, searchName] = [[this.state.searchName], 1, this.state.searchName];
            for (let i in shop) {
                if (searchName == shop[i].name) {
                    pageNo = shop[i].numPage + 1;
                }
            }
            this.search(arr, 0, () => {
                Message({
                    message: '获取完毕',
                    type: 'success',
                    duration: 1000
                });
            }, pageNo);
        });
    };

    isScheduling = ({i}) => {//批量排重
        let {lab} = this.state,array=[];
        if(lab.length>45){
            array=lab.slice(0,44);
        }else {
            array=lab;
        }
        MessageBox.confirm('您确定要进行排重吗？每次排重至多45个(此功能免费使用)', '提示', {
            type: 'warning'
        }).then(() => {
            this.NewStoresAjax.ajax({
                type: 'post',
                url: '/message/admin/cheesy/domain.item.cheesylibraryList.io',
                data: {numIid: array.join()},
                callback: (json) => {
                    let item = json.item;
                    let shop = this.state.shop;
                    let data = shop[i].item;
                    for (let i in data) {
                        if (array.indexOf(data[i].id) > -1) {
                            data[i].pc = true;
                            data[i].pcType = 3;
                            for (let it in item) {
                                if (data[i].id == item[it].numIid) {
                                    if (item[it].isInPond) {
                                        data[i].pcType = 1;
                                    } else if (item[it].isRelease) {
                                        data[i].pcType = 2;
                                    } else {
                                        data[i].pcType = 3;
                                    }
                                }
                            }
                        }
                    }
                    shop[i].item = data;
                    this.setState({shop: shop,lab:[]});
                }
            });
        }).catch(() => {
            Message({
                type: 'info',
                message: '已取消排重'
            });
        })
    };

    del_isScheduling = ({i}) => {//清除
        let {shop} = this.state;
        let item = shop[i].item;
        let b = [];
        for (let it in item) {
            if (item[it].pc) {
                if (item[it].pcType == 3) {
                    b.push(item[it]);
                }
            } else {
                b.push(item[it]);
            }
        }
        shop[i].item = b;
        this.setState({shop: shop});
    };

    addNewTest = () => {//选品池搜索检测
        let {fixed} = this.state;
        if (fixed) {
            this.setState({test: true}, () => {
                this.shopNameButton();
            });
        } else {
            Message({
                message: '请选择一个固定选品池',
                type: 'warning'
            });
        }
    };

    del_fixed = ({i}) => {//选品池清除
        let {shop} = this.state;
        let item = shop[i].item;
        let b = [];
        for (let it in item) {
            if (item[it].xp_pd) {
                if (item[it].zxp) {
                    b.push(item[it]);
                }
            } else {
                b.push(item[it]);
            }
        }
        shop[i].item = b;
        this.setState({shop: shop});
    };

    fixed = ({i}) => {//选品池检测
        let {fixed, fixedPool, shop} = this.state;
        let item = shop[i].item;
        let b = [];
        let ll = true;
        let ii = 0;
        for (let it in item) {
            if ((!item[it].xp_pd) && ll) {
                ll = false;
                ii = it;
            }
            if (!item[it].xp_pd) {
                b.push(item[it].itemUrl);
            }
        }
        if (fixed) {
            if (b.length > 0) {
                this.fixed_pp(fixedPool[fixed - 1], b, i, 0, ii);
            } else {
                Message({
                    message: '无商品可检测',
                    type: 'warning'
                });
            }
        } else {
            Message({
                message: '请选择一个固定选品池',
                type: 'warning'
            });
        }
    };

    fixed_pp = (cs, list, i, l = 0, ii, callback) => {
        if (list.length > l) {
            let obj = {
                id: cs.id,
                kxuan_swyt_item: cs.kxuan_swyt_item,
                ruletype: cs.ruletype,
                searchtype: cs.searchtype,
                q: "https:" + list[l],
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
                    let {shop} = this.state;
                    if (auctions.length > 0) {
                        shop[i].item[l + parseInt(ii)].zxp = true;
                        shop[i].item[l + parseInt(ii)].xp_pd = true;
                        this.setState({shop: shop, speed: {max: list.length, speedNum: l + 1}}, () => {
                            this.fixed_pp(cs, list, i, l + 1, ii, callback);
                        })
                    } else {
                        shop[i].item[l + parseInt(ii)].zxp = false;
                        shop[i].item[l + parseInt(ii)].xp_pd = true;
                        this.setState({shop: shop, speed: {max: list.length, speedNum: l + 1}}, () => {
                            this.fixed_pp(cs, list, i, l + 1, ii, callback);
                        })
                    }
                }
            );
        } else {
            if (callback) {
                callback();
            } else {
                this.setState({speed: undefined}, () => {
                    Message({
                        message: '判断选品池完毕',
                        type: 'success'
                    });
                })
            }
        }
    };

    favoriteCallback = (n) => {
        this.setState({shopName: n});
    };

    favorite = () => {//收藏夹模态
        this.favoriteModel.open();
    };

    addCheesy = () => {
        this.getCheesy2();
    };

    getCheesy2 = () => {//添加好货模态
        let callback = (id, typeTab, item, form, groupId, process) => {
            Message({
                message: '添加好货中，请稍后...',
                type: 'success',
                duration: 2000
            });
            let {shop, lab} = this.state;
            let constraint = item.constraint;
            let [contentData, arr] = [{}, []];
            if(constraint instanceof Array){
                for (let i in constraint) {
                    contentData[constraint[i].name] = {
                        type: constraint[i].type,
                        version: 3,
                        value: constraint[i].props.value,
                    };
                }
            }else {
                constraint.nameList.forEach(list=>{
                    contentData[list.name] = {
                        type: constraint.constraint[list.name].type,
                        version: 3,
                        value: constraint.constraint[list.name].props.value,
                    };
                })
            }
            contentData.type = 3;
            for (let s in shop) {
                let item = shop[s].item;
                for (let i in item) {
                    if (lab.indexOf(item[i].id) > -1) {
                        arr.push(item[i]);
                    }
                }
            }
            if (form == 0) {
                this.submitCheesy({id: id, typeTab: typeTab, contentData: contentData}, arr, 0);
            } else if (form == 1) {
                this.submitGroupCheesy({id: id, typeTab: typeTab, contentData: contentData, groupId: groupId, process: process}, arr, 0);
            }

        };
        this.setState({callback: callback}, () => {
            this.RapidAddition.open()
        });
    };

    submitCheesy = (item, arr, num) => {
        let it = arr[num];
        let contentData = item.contentData;
        let obj = {
            coverUrl: it.coverUrl,
            description: "",
            detailUrl: "https:" + it.itemUrl,
            images: [it.coverUrl],
            itemId: it.id,
            price: it.price,
            resourceUrl: it.itemUrl,
            title: it.title,
        };
        for (let c in contentData) {
            if (c == "body") {
                contentData[c].value = [];//指向相同,所以要清空数组(打印该数组会得到相同的结果)
                contentData[c].value.push(obj);
            } else if (c == "title") {
                contentData[c].value = it.title;
            }
        }

        let data = {
            id: 0,
            typeTab: item.typeTab,
            contentModeId: item.id,
            data: contentData,
            title: it.title,
            picUrl: it.coverUrl,
            flag: "",
            version: 3,
        };
        this.NewStoresAjax.ajax({
            url: "/content/admin/cheesy/domain.content.add.io",
            data: {data: JSON.stringify(data)},
            async: false,
            type: "post",
            callback: (data) => {
                num += 1;
                if (data.id) {
                    let s = setInterval(() => {
                        clearInterval(s);
                        if (arr.length > num) {
                            this.submitCheesy(item, arr, num);
                        } else {
                            Message({
                                message: '添加结束',
                                type: 'success',
                                duration: 2000
                            });
                        }
                    }, 1000);
                } else {
                    let s = setInterval(() => {
                        clearInterval(s);
                        if (arr.length > num) {
                            this.submitCheesy(item, arr, num);
                        } else {
                            Message({
                                message: '添加结束',
                                type: 'success',
                                duration: 2000
                            });
                        }
                    }, 1000);
                }
            }
        });
    };

    submitGroupCheesy = (item, arr, num) => {
        let it = arr[num];
        let contentData = item.contentData;
        let obj = {
            coverUrl: it.coverUrl,
            description: "",
            detailUrl: "https:" + it.itemUrl,
            images: [it.coverUrl],
            itemId: it.id,
            price: it.price,
            resourceUrl: it.itemUrl,
            title: it.title,
        };
        for (let c in contentData) {
            if (c == "body") {
                contentData[c].value = [];//指向相同,所以要清空数组(打印该数组会得到相同的结果)
                contentData[c].value.push(obj);
            } else if (c == "title") {
                contentData[c].value = it.title;
            }
        }
        let data = {
            id: 0,
            typeTab: item.typeTab,
            contentModeId: item.id,
            data: contentData,
            title: it.title,
            picUrl: it.coverUrl,
            flag: "",
            version: 3,
            creator: item.groupId,
            largeProcessId: item.process,
        };
        this.NewStoresAjax.ajax({
            url: "/content/admin/manageGroup/addContentByGroup.io",
            data: {data: JSON.stringify(data), groupId: item.groupId},
            async: false,
            type: "post",
            callback: (data) => {
                num += 1;
                if (data.id) {
                    let s = setInterval(() => {
                        clearInterval(s);
                        if (arr.length > num) {
                            this.submitGroupCheesy(item, arr, num);
                        } else {
                            Message({
                                message: '添加结束',
                                type: 'success',
                                duration: 2000
                            });
                        }
                    }, 1000);
                } else {
                    let s = setInterval(() => {
                        clearInterval(s);
                        if (arr.length > num) {
                            this.submitGroupCheesy(item, arr, num);
                        } else {
                            Message({
                                message: '添加结束',
                                type: 'success',
                                duration: 2000
                            });
                        }
                    }, 1000);
                }
            }
        })
    };

    componentDidUpdate() {
        let scrollParent = $("#panel-body");
        if (scrollParent.length < 1) {
            scrollParent = $(window);
        }
        scrollParent.scroll(() => {
            let t = scrollParent.scrollTop();
            if (t > 250) {
                $(".editBoxButss").addClass("editBoxButsFD");
            } else {
                $(".editBoxButss").removeClass("editBoxButsFD");
            }
        }) ;
    }

    render() {
        let {shopName, lab, shop, fixedPool, fixed, sz_type, purchase,present='0'} = this.state;
        let [arr1, arr2, arr3] = [[], [], []];
        if (lab.length > 0) {
            let arr = lab;
            for (let i in arr) {
                for (let s in shop) {
                    let item = shop[s].item;
                    for (let it in item) {
                        if (item[it].id == arr[i]) {
                            if (item[it].pcType) {
                                if (item[it].pcType == 3) {
                                    arr2.push(arr[i]);
                                } else {
                                    arr3.push(arr[i]);
                                }
                            } else {
                                arr1.push(arr[i]);
                            }
                        }
                    }
                }
            }
        }
        let sz = [
            {name: "综合排序", type: "defaultSort"},
            {name: "销量", type: "hotsell_desc"},
            {name: "新品", type: "newOn_desc"},
            {name: "收藏", type: "hotkeep_desc"},
            {name: "价格↑", type: "price_asc"},
            {name: "价格↓", type: "price_desc"},
            {name: "口碑", type: "koubei"},
        ];
        return (
            <AJAX ref={e => {
                this.NewStoresAjax = e
            }}>
                <div>
                    <NewPanel header='店铺新品'>
                        <div style={{marginTop: '15px'}}>
                            <Layout.Row gutter='10'>
                                <Layout.Col span='2'>
                                    <Tooltip content="用于收藏店铺" placement="bottom" effect="light">
                                        <Button type='success' size='small' onClick={this.favorite} style={{width:'100%'}}>收藏夹</Button>
                                    </Tooltip>
                                </Layout.Col>
                                <Layout.Col span='5'>
                                    <Input placeholder='请输入店铺首页链接(详情请查看帮助)' size='small' value={purchase} onChange={(value) => {
                                        this.setState({purchase: value})
                                    }} prepend={<Tooltip className="item" effect="dark"
                                                         content='某些店铺(全球购等)不可直接通过掌柜名获取，请在后面输入店铺首页链接来获取新品'
                                                         placement="bottom-start">
                                        帮助
                                    </Tooltip>}/>
                                </Layout.Col>
                                <Layout.Col span='10'>
                                    <Input placeholder="请添加店铺掌柜旺旺名，多个请用逗号隔开" size='small' value={shopName} onChange={value => this.shopNameChange(value)}
                                           onKeyDown={(event) => {if (event.keyCode == "13") {this.shopNameButton()}}}
                                           prepend={<Select value={sz_type} placeholder="请选择" size='small' onChange={(value) => {
                                               this.sz_typeChange(value)
                                           }} style={{width:'100px'}}>
                                               {(sz ? sz : []).map((item) => {
                                                   return (
                                                       <Select.Option value={item.type} key={item.type} label={item.name}/>
                                                   )
                                               })}
                                           </Select>}
                                           append={<Button type="info" icon="search" onClick={this.shopNameButton}>搜索</Button>}/>
                                </Layout.Col>
                                <Layout.Col span='4'>
                                    <Select value={fixed ? fixed : "0"} placeholder="请选择" size='small' onChange={(value) => {
                                        this.fixedChange(value)
                                    }} style={{width: '100%'}}>
                                        <Select.Option value='0' label='选择固定选品池' disabled/>
                                        {(fixedPool ? fixedPool : []).map((item, i) => {
                                            return (
                                                <Select.Option value={i + 1} key={item.id + "-" + i} label={item.title}/>
                                            )
                                        })}
                                    </Select>
                                </Layout.Col>
                                <Layout.Col span='3'>
                                    <Tooltip content="搜索完新品接着自动检测" placement="bottom" effect="light">
                                        <Button type='info' size='small' disabled={this.state.speed} style={{width: '100%'}} onClick={this.addNewTest}>搜索-检测</Button>
                                    </Tooltip>
                                </Layout.Col>
                            </Layout.Row>
                            {shop.length > 0 &&
                            <div style={{marginTop:'10px'}}>
                                <Tabs type="card" value={present} onTabClick={(env)=>this.setState({present:env.props.name})} className="listMode">
                                    {(shop ? shop : []).map((it, t) => {
                                        return (
                                            <Tabs.Pane label={it.name} name={`${t}`} key={it.name}>
                                                <div className='editBoxButss' style={{top:"50px",left:"210px"}}>
                                                    <div style={{marginTop: "5px", textAlign: 'left'}}>
                                                        <Layout.Row gutter='5'>
                                                            <Layout.Col span='14'>
                                                                <strong style={{marginLeft: '12px', marginRight: '15px'}}>批量排重</strong>
                                                                <Button type="success" size='small' onClick={() => {
                                                                    this.generalChoice({t,type:'selectAll'});
                                                                }} style={{marginRight: '12px', width: '62px'}}>全选</Button>
                                                                <Button type="success" size='small' onClick={() => {
                                                                    this.generalChoice({t,type:'select45'});
                                                                }} style={{marginRight: '12px', width: '62px'}}>选45</Button>
                                                                <Button type="info" size='small' onClick={() => {
                                                                    this.generalChoice({t,type:'selectAgainst'});
                                                                }} style={{marginRight: '12px', width: '62px'}}>反选</Button>
                                                                <Button type="warning" size='small' onClick={() => {
                                                                    this.generalChoice({t,type:'selectClear'});
                                                                }} style={{marginRight: '12px', width: '62px'}}>不选</Button>
                                                                <Button type="primary" size='small' disabled={lab.length < 1} title="请勾选1~45个商品" onClick={() => {
                                                                    this.isScheduling({i: t})
                                                                }} style={{marginRight: '12px', width: '108px'}}>批量排重({lab.length})</Button>
                                                                <Button type="danger" size='small' title="清除排重不合格商品，未排重商品除外" onClick={() => {
                                                                    this.del_isScheduling({i: t})
                                                                }} style={{marginRight: '12px', width: '62px'}}>清除</Button>
                                                            </Layout.Col>
                                                            <Layout.Col span='10'>
                                                                <strong style={{marginRight: '15px'}}>添加好货</strong>
                                                                <Button type="success" size='small' onClick={() => {
                                                                    this.generalChoice({t,type:'selectNoStorage'});
                                                                }} style={{marginRight: '15px', width: '120px'}}>全选未入库</Button>
                                                                <Button type="danger" size='small' onClick={() => {
                                                                    this.generalChoice({t,type:'selectClear'});
                                                                }} style={{marginRight: '15px', width: '62px'}}>不选</Button>
                                                                <Button type="info" size='small' onClick={this.addCheesy} disabled={lab.length <1} title="请勾选1个以上商品"
                                                                        style={{marginRight: '15px', width: '100px'}}>添加好货({lab.length})</Button>
                                                            </Layout.Col>
                                                        </Layout.Row>
                                                        <div style={{marginTop: '5px'}}>
                                                            <Layout.Row gutter='5'>
                                                                <Layout.Col span='14'>
                                                                    <strong style={{marginLeft: '12px', marginRight: '15px'}}>选品池检测</strong>
                                                                    <Select value={fixed ? fixed : "0"} placeholder="请选择" size='small' style={{marginRight: '15px', width: '250px', verticalAlign: 'middle'}} onChange={(value) => {
                                                                        this.fixedChange(value)
                                                                    }}>
                                                                        <Select.Option value='0' label='选择固定选品池' disabled/>
                                                                        {(fixedPool ? fixedPool : []).map((item, i) => {
                                                                            return (
                                                                                <Select.Option value={i + 1} key={item.id + "-" + i} label={item.title}/>
                                                                            )
                                                                        })}
                                                                    </Select>
                                                                    <Button type="info" size='small' title="请先选择一个固定选品池后确定" disabled={this.state.speed} onClick={() => {
                                                                        this.fixed({i: t})
                                                                    }} style={{marginRight: '15px', width: '80px'}}>检测</Button>
                                                                    <Button type="danger" size='small' title="清除非选品池商品，未检测商品除外" onClick={() => {
                                                                        this.del_fixed({i: t})
                                                                    }} style={{width: '80px'}}>清除</Button>
                                                                </Layout.Col>
                                                                <Layout.Col span='10'>
                                                                    <strong style={{marginRight: '15px'}}>勾选详情</strong>
                                                                    <Tag type="warning" style={{marginRight: '12px', textAlign: 'center', width: '110px'}}>未排重({arr1.length})</Tag>
                                                                    <Tag type="success" style={{marginRight: '12px', textAlign: 'center', width: '110px'}}>已排重:合格({arr2.length})</Tag>
                                                                    <Tag type="danger" style={{marginRight: '12px', textAlign: 'center', width: '110px'}}>已排重:不合格({arr3.length})</Tag>
                                                                </Layout.Col>
                                                            </Layout.Row>
                                                        </div>
                                                        <div>
                                                            {this.state.speed && (this.state.speed.speedNum !== this.state.speed.max) &&
                                                            <Layout.Row gutter='20'>
                                                                <Layout.Col span='2'>
                                                                    <Tag type="primary" style={{textAlign: 'center', width: '80px'}}>检测进度</Tag>
                                                                </Layout.Col>
                                                                <Layout.Col span='22'>
                                                                    <div style={{marginTop: '7px'}}>
                                                                        <Progress strokeWidth={19} percentage={(100 / this.state.speed.max * this.state.speed.speedNum).toFixed(1)} status="success" textInside/>
                                                                    </div>
                                                                </Layout.Col>
                                                            </Layout.Row>}
                                                        </div>
                                                    </div>
                                                </div>

                                                {it.item.length > 0 &&
                                                <Layout.Row gutter='10'>
                                                    {(it.item ? it.item : []).map((item, i) => {
                                                        let lastIndex = item.coverUrl.lastIndexOf('\\');
                                                        let cover = lastIndex + 1 == item.coverUrl.length ? item.coverUrl.substring(0, lastIndex) : item.coverUrl;
                                                        let titleLastIndex=item.title.lastIndexOf('\\');
                                                        let newTitle = titleLastIndex + 1 == item.title.length ? item.title.substring(0, titleLastIndex) : item.title;
                                                        return (
                                                            <Layout.Col xs="6" sm="6" md="6" lg="4" key={t + "i" + i} style={{marginTop: '8px'}}>
                                                                <div style={{position: "relative"}}>
                                                                    <div style={{position: "absolute", margin: "4px 0 0 8px"}}>
                                                                        <label>
                                                                            <Checkbox checked={lab.indexOf(item.id) > -1 ? true : false} style={{width: "17px", height: "17px"}}
                                                                                      onChange={() => {
                                                                                          this.generalChoice({id:item.id,type:'select'});
                                                                                      }}/>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                <div className="thumbnail">
                                                                    <div style={{height: '210px'}}>
                                                                        <a href={item.itemUrl} target="_blank">
                                                                            <img src={cover} style={{maxWidth: '100%', maxHeight: '100%'}}/>
                                                                        </a>
                                                                    </div>
                                                                    <div style={{margin:"0 6px"}}>
                                                                        <Tooltip className="item" effect="dark"
                                                                                 content={newTitle}
                                                                                 placement="bottom-start">
                                                                            <div style={{
                                                                                textOverflow: 'ellipsis',
                                                                                whiteSpace: 'nowrap',
                                                                                overflow: "hidden",
                                                                                display: "block",
                                                                                cursor: "pointer"
                                                                            }}>  {newTitle}</div>
                                                                        </Tooltip>
                                                                        <div style={{textAlign:'left',position:'relative'}}>
                                                                            <span style={{color:'#F40'}}>￥{item.price}</span>
                                                                            <span style={{position:'absolute',color:'#888',right:0}}>{it.name}</span>
                                                                        </div>
                                                                    </div>
                                                                    <Layout.Row gutter='5'>
                                                                        <Layout.Col span='12'>
                                                                            {item.pc ? <Tag type={item.pcType == 1 || item.pcType == 2 ? "danger" : "success"}>已排重：
                                                                                    {item.pcType == 1 ? "好货已入库" : (item.pcType == 2 ? "未入库，但被抢发" : "未入库")}</Tag> :
                                                                                <Tag type='warning'>未排重</Tag>}
                                                                        </Layout.Col>
                                                                        <Layout.Col span='12'>
                                                                            {item.xp_pd ? <Tag type={item.zxp ? "success" : "danger"}> {item.zxp ? "在选品池" : "不在选品池"}</Tag> :
                                                                                <Tag type='warning'>未检测</Tag>}
                                                                        </Layout.Col>
                                                                    </Layout.Row>
                                                                </div>
                                                            </Layout.Col>
                                                        )
                                                    })}
                                                </Layout.Row>}
                                                <div style={{marginTop: '20px'}}>
                                                    {it.page && <Button type="info" onClick={() => this.loadMore({i: t})}>
                                                        加载更多
                                                    </Button>}
                                                </div>
                                            </Tabs.Pane>
                                        )
                                    })}
                                </Tabs>
                            </div>}
                        </div>
                    </NewPanel>
                </div>
                <DialogBundle ref={e => this.favoriteModel = e} dialogProps={{title: '店铺收藏夹', size: "small"}}
                              bundleProps={{
                                  load: favoriteModelContainere, callback: this.favoriteCallback, closeModal: () => {
                                      this.favoriteModel.setState({dialogVisible: false})
                                  }
                              }}
                              dialogFooter={<div>
                                  <Button onClick={() => {
                                      this.favoriteModel.setState({dialogVisible: false})
                                  }}>取消</Button>
                                  <Button type="primary" onClick={() => {
                                      this.favoriteModel.getBun((gb) => {
                                          gb.submit();
                                      });
                                  }}>确定</Button>
                              </div>}>
                </DialogBundle>
                <DialogBundle ref={e => this.RapidAddition = e} dialogProps={{title: '选择方向', size: "small"}}
                              bundleProps={{
                                  load: RapidAdditionContainere, callback: this.state.callback, closeModal: () => {
                                      this.RapidAddition.getBun((gb) => {
                                          gb.addition();
                                      });
                                      this.RapidAddition.setState({dialogVisible: false})
                                  }
                              }}
                              dialogFooter={<div>
                                  <Button onClick={() => {
                                      this.RapidAddition.getBun((gb) => {
                                          gb.addition();
                                      });
                                      this.RapidAddition.setState({dialogVisible: false})
                                  }}>取消</Button>
                                  <Button type="primary" onClick={() => {
                                      this.RapidAddition.getBun((gb) => {
                                          gb.submit();
                                      });
                                  }}>确定</Button>
                              </div>}>
                </DialogBundle>
            </AJAX>
        );
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

export default NewStores;
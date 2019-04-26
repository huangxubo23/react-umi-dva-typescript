import $ from 'jquery';
import React from 'react';
import {Dialog, Layout, Tabs, Button, Input, Tag, Alert, Pagination, Notification} from 'element-react';
import 'element-theme-default';
import ItemGet from '../../util/itemGet';
import {localImgSize, urlAnalysis} from '../../util/global';
import {BundleLoading} from '@/bundle';
import UpImages from 'bundle-loader?lazy&name=pc/trends_asset/components/lib/sharing/upload/upImages/app-[name]!./UpImages';
import '../../../../styles/component/react_assembly/UpItem.js.css';
import {ThousandsOfCall} from '../../util/ThousandsOfCall';
import wz from '../../../../images/tool/zw.png'

require("../../../../components/lib/util/jquery-ui.min");


class UpSPUItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            key: 1,
            showModal: false,
            q: "",
            data: {
                current: 1,
                pageSize: 40,
                total: 40,
                itemList: []
            },
            item: undefined,
            itemUrl: "",
            titleHint: "",
        };
        this.open = this._open.bind(this);
        this.close = this._close.bind(this);
        this.handleSelect = this._handleSelect.bind(this);
    }

    _handleSelect(p) {
        this.setState({key: p});
    };

    _open(data) {
        this.setState({
            showModal: true,
            item: data ? data : undefined,
            itemUrl: data ? data.itemUrl : ""
        }, () => {
            this.getSPUItem();
        });
    }

    getSPUItem = (e = 1) => {
        let {q} = this.state;
        this.gainCommodity({
            pageSize: 40,
            q: q,
            current: e,
            resourceType: "SPU",
            activityId: this.props.constraint.activityId,
        });
        if (e == 1) {
            let s = setInterval(() => {
                if (this.commodityPaging) {
                    clearInterval(s);
                    this.commodityPaging.changePageNow(1);
                }
            }, 100);

        }
    };

    gainCommodity = (data) => {
        ThousandsOfCall.acoustic(
            {
                agreement: "https",
                hostname: "resource.taobao.com",
                path: '/poolresource/query',
                data: data,
                referer: "https://we.taobao.com/",
            },
            "requestRelyTB", (json20) => {
                if (json20.success) {
                    let json = JSON.parse(json20.data);
                    if (json.status == "SUCCESS") {
                        let d = json.data;
                        let {data} = this.state;
                        data.current = d.current;
                        data.pageSize = d.pageSize;
                        data.total = d.total;
                        data.itemList = d.itemList;
                        this.setState({data: data});
                    } else {
                        Notification({
                            title: '警告',
                            message: `淘宝${json.message}`,
                            type: 'warning'
                        });
                    }
                } else {
                    Notification({
                        title: '警告',
                        message: `spu未查询到任何数据`,
                        type: 'warning'
                    });
                }

            }
        );
    };

    _close() {
        this.setState({
            showModal: false,
            key: 1,
            item: undefined,
            itemUrl: "",
        });
    }

    qChange = (env) => {
        this.setState({q: env.value});
    };

    searchClick = () => {
        this.getSPUItem(1);
    };

    spuChange = (env) => {
        let v = env.value;
        this.setState({itemUrl: v}, () => {
            this.gainData(v);
        });
    };

    itemUrlChange = (it) => {
        this.setState({itemUrl: it}, () => {
            this.gainData(it);
        });
    };

    getImg = (itemId) => {
        ItemGet.ajaxItem({
            itemUrl:this.state.itemUrl,
            id: itemId, callback: (data) => {
                let {item} = this.state;
                if ($.inArray("http:" + item.images[0], data.cleanImages) > -1) {
                    item.images = data.cleanImages;
                } else {
                    item.images = item.images.concat(data.cleanImages);
                }
                item.yongjin = data.yongjin;
                this.setState({item: item});
            }
        })
    };

    gainData = (itemUrl) => {//拿取单个商品具体数据
        let data = urlAnalysis(itemUrl);
        ThousandsOfCall.acoustic({
                agreement: 'https',
                hostname: data.hostname,
                path: data.path,
                data: data.data,
                referer: "https://spu.taobao.com/",
            }, "requestRelyTB", (json20) => {
                if (json20.success) {
                    let json = json20.data;
                    if (json.indexOf("window.olympicJson =") > -1) {
                        let t = json.split("window.olympicJson =")[1];
                        let str = t.split("}};")[0] + "}}";
                        let obj = JSON.parse(str);
                        if (obj.itemList.length > 0) {
                            let item = {
                                title: obj.itemList[0].title,
                                itemId: obj.itemList[0].itemId,
                                coverUrl: obj.itemList[0].imageUrl,
                                price: obj.itemList[0].price,
                                url: obj.itemList[0].url
                            };
                            item.spuId = obj.spuId;
                            item.resourceType = "Product";
                            item.materialId = "P-3049-SPU-" + obj.spuId;
                            item.images = [obj.pictUrl];
                            item.extraBanners = [];
                            item.itemUrl = itemUrl;
                            this.setState({item: item}, () => {
                                //  this.getImg(obj.itemList[0].itemId);
                                this.getImg(itemUrl);
                            });
                        } else {
                            let item = {
                                title: obj.title,
                                price: obj.status.price,
                                coverUrl: obj.pictUrl,
                            };
                            item.spuId = obj.spuId;
                            item.resourceType = "Product";
                            item.materialId = "P-3049-SPU-" + obj.spuId;
                            item.images = [obj.pictUrl];
                            item.extraBanners = [];
                            item.itemUrl = itemUrl;
                            this.setState({item: item});
                        }
                    } else {
                        Notification({
                            title: '警告',
                            message: `暂无数据`,
                            type: 'warning'
                        });
                    }
                } else {
                    Notification({
                        title: '提示',
                        message: '未获取到产品数据'
                    });
                }

            }
        )
    };

    clickUpImg = () => {
        this.setState({
            imgCallback: (url, pa, img) => {
                let item = this.state.item;
                item.coverUrl = url;
                let images = item.images;
                if (images) {
                    images.unshift(url);
                }
                this.setState({item: item});
            }
        }, () => {
            this.upImagesBundleLoading();
        });

    };

    cutOut = () => {
        let img = this.state.item.coverUrl;
        let data = {"picUrl": img};
        let s = {
            type: "originaljson",
            dataType: "jsonp",
            api: "mtop.taobao.luban.dapei.cutpic",
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
        }, "requestH5", (data1) => {
            if (data1.success) {
                let data = JSON.parse(data1.data);
                if (data) {
                    let {item} = this.state;
                    item.coverUrl = data.result;
                    this.setState({item: item});
                } else {
                    Notification({
                        title: '警告',
                        message: `该功能不能使用！请更新选品插件！`,
                        type: 'warning'
                    });
                }
            } else {
                Notification({
                    title: '警告',
                    message: `智能抠图失败`,
                    type: 'warning'
                });
            }

        });
    };

    itemTitleChange = (env) => {
        let title = env.target.value;
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
    };
    upImagesBundleLoading = () => {//添加图片热加载
        if (this.state.upImagesFlag && this.addImgModal) {
            this.addImgModal.jd.open();
        } else {
            this.setState({upImagesFlag: true}, () => {
                let upload = setInterval(() => {
                    let addImgModal = this.addImgModal;
                    if (addImgModal && addImgModal.jd) {
                        clearInterval(upload);
                        this.addImgModal.jd.open();
                    }
                }, 100);
            });
        }
    };

    render() {
        let {showModal, key, q, data, itemUrl, item, titleHint, upImagesFlag, imgCallback} = this.state;
        let {constraint, minTitle, maxTitle} = this.props;
        return (
            <div>
                <Dialog title="上传产品" size="small" visible={showModal} onCancel={this.close} lockScroll={false}>
                    <Dialog.Body>
                        <Tabs type="card" value="1">
                            <Tabs.Pane label="添加产品" name="1">
                                <Input value={itemUrl} onChange={(value) => {
                                    this.spuChange({value: value})
                                }}
                                       placeholder="请输入产品链接" prepend="产品链接" append={<Button onClick={() => {
                                    if (item) {
                                        ipcRenderer.send("addTab", item.url ? item.url : itemUrl);
                                    }
                                }}>查看</Button>}/>
                                {item && <Layout.Row bsClass="clearfix maTop">
                                    <Layout.Col sm={8}>
                                        <div className="thumbnail" style={{position: "relative"}}>
                                            <img src={item.coverUrl} className="item_bj"
                                                 onClick={this.clickUpImg}/>
                                        </div>
                                        <div style={{textAlign: "center", cursor: "pointer", marginTop: "-20px"}}>
                                            <div><Tag type="primary" onClick={this.cutOut}>智能抠图</Tag></div>
                                        </div>
                                    </Layout.Col>
                                    <Layout.Col sm={16}>
                                        <Tag type='primary'>价格:{item.price}</Tag>
                                        <Tag type='success'>佣金:{item.yongjin ? (item.yongjin / 100) + "%" : "0%"}</Tag>
                                        <div className="maTop">
                                            <Input placeholder="宝贝标题" value={item.title} onChange={this.itemTitleChange} append={<span className="titleNum">
                                                {item.title.length + (minTitle ? ("/" + minTitle) : "") + (maxTitle ? ("/" + maxTitle) : "")}
                                            </span>}/>
                                        </div>
                                        {titleHint && <Alert type="danger" title={titleHint} closable={false}/>}
                                    </Layout.Col>
                                    {constraint.enableExtraBanner &&
                                    <Layout.Col sm={24}>
                                        <div id="sortable_ex">
                                            {(item.extraBanners ? item.extraBanners : []).map((item, i) => {
                                                return (
                                                    <Layout.Col sm={4} md={4} key={item + i} data-i={i} className="deleteSpare">
                                                        <img src={item} className="image" data-i={i}/>
                                                        <div onClick={() => {
                                                            let item = this.state.item;
                                                            let extraBanners = item.extraBanners;
                                                            extraBanners.splice(i, 1);
                                                            item.extraBanners = extraBanners;
                                                            this.setState({item: item});
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
                                                             let extraBanners = item.extraBanners;
                                                             extraBanners.push(url);
                                                             item.extraBanners = extraBanners;
                                                             this.setState({item: item});
                                                         }
                                                     }, () => {
                                                         this.upImagesBundleLoading();
                                                     });
                                                 }}/>
                                        </Layout.Col>
                                    </Layout.Col>}
                                    <Layout.Col sm={24} className="maTop ">
                                        <Button type="primary" size="small" block onClick={() => {
                                            let {item} = this.state;
                                            this.props.callback(item);
                                            this.close();
                                        }}>提交</Button>
                                    </Layout.Col>
                                    <Layout.Col sm={24} className="maTop ">
                                        {(item.images ? item.images : []).map((item, i) => {
                                            let form = undefined;
                                            let arr = item.split(".");
                                            form = arr[arr.length - 1].length > 6 ? "" : arr[arr.length - 1];
                                            localImgSize(item, (w, h) => {
                                                setTimeout(() => {
                                                    let format = w + "X" + h;
                                                    if (this.props.selectedImgPoint) {
                                                        if (w == h && w >= 500) {
                                                            $("#itemcimgkey" + i + " .imgsize").remove();
                                                            $("#itemcimgkey" + i).append("<div><span class='imgsize' style='position: relative;top: -46px;color: white;background:green ; padding: 2px;left: 49px;'>" + format + "<span style='color: black;'> " + form + "</span></span></div>")
                                                        } else {
                                                            $("#itemcimgkey" + i + " .imgsize").remove();
                                                            $("#itemcimgkey" + i).append("<div><span class='imgsize' style='position: relative;top: -46px;color: white;background: red;padding: 2px;left: 49px;'>" + format + "<span style='color: black;'> " + form + "</span></span></div>")
                                                        }
                                                    } else {
                                                        if (w == h && w >= 500) {
                                                            $("#itemcimgkey" + i + " .imgsize").remove();
                                                            $("#itemcimgkey" + i).append("<span class='imgsize' style='position: relative;top: -26px;color: white;background:green ; padding: 2px;left: 49px;'>" + format + "<span style='color: black;'> " + form + "</span></span>")
                                                        } else {
                                                            $("#itemcimgkey" + i + " .imgsize").remove();
                                                            $("#itemcimgkey" + i).append("<span class='imgsize' style='position: relative;top: -26px;color: white;background: red;padding: 2px;left: 49px;'>" + format + "<span style='color: black;'> " + form + "</span></span>")
                                                        }
                                                    }
                                                }, 200);
                                            });
                                            return (<Layout.Col sm={6} key={item + "-" + i} id={"itemcimgkey" + i}>
                                                <div className="thumbnail">
                                                    <img src={item} onClick={() => {
                                                        let it = this.state.item;
                                                        it.coverUrl = itemthis.setState({item: it});
                                                    }}/>
                                                </div>
                                                {constraint.enableExtraBanner &&
                                                <div onClick={() => {
                                                    let items = this.state.item;
                                                    let extraBanners = items.extraBanners;
                                                    if (5 > extraBanners.length) {
                                                        if (!(extraBanners.indexOf(item) >= 0)) {
                                                            extraBanners.push(item);
                                                        } else {
                                                            Notification({
                                                                title: '警告',
                                                                message: `添加重复`,
                                                                type: 'warning'
                                                            });
                                                        }
                                                    }
                                                    items.extraBanners = extraBanners;
                                                    this.setState({item: items});
                                                }}>
                                                    <Tag type="primary" className="extraBanners">选为补充图</Tag>
                                                </div>}
                                            </Layout.Col>)
                                        })}
                                    </Layout.Col>
                                </Layout.Row>}
                            </Tabs.Pane>
                            <Tabs.Pane label="官方精选" name="2">
                                <Input placeholder='请输入产品关键字' onChange={(value) => {
                                    this.qChange({value: value})
                                }}
                                       value={q} append={<Button type="primary" onClick={this.searchClick} icon="search">搜索</Button>}/>
                                <Layout.Row>
                                    {(data.itemList ? data.itemList : []).map((item, i) => {
                                        let title = '';
                                        if (item.title) {
                                            title = item.title.substring(0, 12);
                                        }
                                        let titles = title + "...";
                                        return (
                                            <Layout.Col sm={6} key={item.spuId}>
                                                <div className="thumbnail">
                                                    <div style={{height: "185px"}}>
                                                        <a href={item.spuInfoDTO.spuUrl} target="_blank">
                                                            <img src={item.coverUrl ? item.coverUrl : wz} style={{maxHeight: "185px"}}/>
                                                        </a>
                                                    </div>
                                                    <p style={{marginTop: "10px"}}>
                                                        <a href={item.spuInfoDTO.spuUrl} target="_blank">{titles}</a>
                                                    </p>
                                                    <p>￥{item.spuInfoDTO.price}</p>
                                                    <Button style="primary" onClick={() => {
                                                        let it = "https:" + item.spuInfoDTO.spuUrl;
                                                        this.setState({key: 1}, () => {
                                                            this.itemUrlChange(it);
                                                        });
                                                    }} size="xsmall" block>添加该商品</Button>
                                                </div>
                                            </Layout.Col>
                                        )
                                    })}
                                </Layout.Row>
                                <div style={{textAlign: "center", margin: '16px 0'}}>
                                    <Pagination layout="total, prev, pager, next, jumper" total={data.count}
                                                pageSize={data.pageSize} currentPage={data.pageNow}
                                                onCurrentChange={this.getSPUItem}/>
                                </div>
                            </Tabs.Pane>
                        </Tabs>
                    </Dialog.Body>
                </Dialog>
                {upImagesFlag && <BundleLoading load={UpImages} ref={e => this.addImgModal = e} callback={imgCallback}/>}
            </div>
        )
    }
}


export default UpSPUItem;

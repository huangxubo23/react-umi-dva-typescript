/**
 * Created by shiying on 17-8-25.
 */

require('../../../../styles/addList/content.css');
require("../../util/jquery-ui.min");
import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import {Message, MessageBox, Layout, Card, Checkbox, Dropdown, Dialog,Button,Input,Alert} from 'element-react';
import 'element-theme-default';
import {BundleLoading} from '@/bundle';
import UpIitem from 'bundle-loader?lazy&name=pc/trends_asset/components/lib/sharing/upload/upItem/app-[name]!./UpItem';
import UpImages from 'bundle-loader?lazy&name=pc/trends_asset/components/lib/sharing/upload/upImages/app-[name]!./UpImages'

class UpHotImages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            url: "",
            pa: {},
            img: {},
            hotSpaces: [],
            structure: {},
            mouseISDown: false,
            move: true,
            showPoint: false
        };
        this.open = this._open.bind(this);
        this.close = this._close.bind(this);
    }

    _open(url, pa, img, h,showPoint) {
        this.setState({showModal: true, url: url, pa: pa, img: img, hotSpaces: (h ? h : []),showPoint:showPoint?showPoint:false});
    }

    _close(callback) {
        this.setState({showModal: false, url: "", pa: {}, img: {},hotSpaces: [], structure: {},mouseISDown: false, move: true,showPoint: false},()=>{
            if(callback&&typeof callback==='function'){
                callback();
            }
        });
    }

    SelectionDown = (env) => {
        if ($(env.target).hasClass("hotImgArea")) {
            let e = env || window.env;
            let dianx = e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
            let diany = e.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
            let imgListCover = $(env.target);
            let imgx = imgListCover.offset().left;
            let imgy = imgListCover.offset().top;
            dianx = dianx - imgx;
            diany = diany - imgy;
            dianx = Math.round(dianx / imgListCover.width() * 100);
            diany = Math.round(diany / imgListCover.height() * 100);
            let structure = this.state.structure;
            structure.x = dianx;
            structure.y = diany;
            this.setState({structure: structure, mouseISDown: true}, () => {
                $(".hotImgArea").bind('mousemove', this.SelectionMove);
            });
        }
    };
    SelectionMove = (env) => {
        let lj = true;
        if (this.state.mouseISDown && $(env.target).hasClass("hotImgArea")) {
            let e = env || window.env;
            let dianx = e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
            let diany = e.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
            let imgListCover = $(env.target);
            let imgx = imgListCover.offset().left;
            let imgy = imgListCover.offset().top;
            dianx = dianx - imgx;
            diany = diany - imgy;

            dianx = Math.round(dianx / imgListCover.width() * 100);
            diany = Math.round(diany / imgListCover.height() * 100);

            if (dianx == 100 || diany == 100) {
                lj = false;
            }
            let hotSpaces = this.state.hotSpaces;
            let structure = this.state.structure;
            let pa = this.state.pa;
            let numW = (44 / (pa.w)) * 100;
            let numH = (44 / (pa.h)) * 100;
            structure.width = (dianx - structure.x) >= parseInt(numW.toFixed(0)) ? dianx - structure.x : parseInt(numW.toFixed(0));
            structure.height = (diany - structure.y) >= parseInt(numH.toFixed(0)) ? diany - structure.y : parseInt(numH.toFixed(0));
            let m = this.state.move;
            if (m) {
                this.setState({move: false});
                hotSpaces.push(structure);
            } else {
                hotSpaces.push(structure);
                hotSpaces.splice(hotSpaces.length - 2, 1);
            }
            this.setState({structure: structure, hotSpaces: hotSpaces, mouseISDown: lj});

        }
    };
    SelectionUp = (env) => {
        $(".hotImgArea").unbind('mousemove');
        if (this.state.mouseISDown && $(env.target).hasClass("hotImgArea")) {
            let e = env || window.env;
            let dianx = e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
            let diany = e.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
            let imgListCover = $(env.target);
            let imgx = imgListCover.offset().left;
            let imgy = imgListCover.offset().top;
            dianx = dianx - imgx;
            diany = diany - imgy;
            dianx = Math.round(dianx / imgListCover.width() * 100);
            diany = Math.round(diany / imgListCover.height() * 100);

            let hotSpaces = this.state.hotSpaces;
            let structure = this.state.structure;
            let pa = this.state.pa;
            let numW = (44 / (pa.w)) * 100;
            let numH = (44 / (pa.h)) * 100;
            structure.width = (dianx - structure.x) >= parseInt(numW.toFixed(0)) ? dianx - structure.x : parseInt(numW.toFixed(0));
            structure.height = (diany - structure.y) >= parseInt(numH.toFixed(0)) ? diany - structure.y : parseInt(numH.toFixed(0));
            hotSpaces.push(structure);
            let m = this.state.move;
            if (!m) {
                hotSpaces.splice(hotSpaces.length - 2, 1);
            }
            this.setState({hotSpaces: hotSpaces, mouseISDown: false, structure: {}, move: true});

        }
    };

    addLink = ({i}) => {
        this.link.open(i);
    };

    addItem = ({i}) => {
        this.setState({
            addItemCallback: (it) => {
                let {hotSpaces} = this.state;
                hotSpaces[i].data = {
                    coverUrl: it.coverUrl,
                    url: it.resourceUrl,
                    resourceUrl: it.resourceUrl,
                    detailUrl: it.detailUrl,
                    title: it.title,
                    rawTitle: it.title,
                    itemId: it.itemId,
                    images: it.images,
                    finalPricePc: 0,
                    finalPriceWap: 0,
                    price: 0,
                };
                hotSpaces[i].type = "item";
                this.setState({hotSpaces: hotSpaces});
            }
        }, () => {
            this.upItemBundleLoading();
        });
    };
    editItem = ({i}) => {
        this.setState({
            addItemCallback: (it) => {
                let {hotSpaces} = this.state;
                hotSpaces[i].data = {
                    coverUrl: it.coverUrl,
                    url: it.resourceUrl,
                    resourceUrl: it.resourceUrl,
                    detailUrl: it.detailUrl,
                    title: it.title,
                    rawTitle: it.title,
                    itemId: it.itemId,
                    images: it.images,
                    finalPricePc: 0,
                    finalPriceWap: 0,
                    price: 0,
                };
                this.setState({hotSpaces: hotSpaces});
            }
        }, () => {
            let {data} = this.state.hotSpaces[i];
            Object.assign(data, {
                coverUrl: data.coverUrl,
                resourceUrl: data.url,
                detailUrl: data.detailUrl,
                title: data.title,
            });
            this.upItemBundleLoading(data);
        });
    };

    editLink = ({i}) => {
        let hotSpaces = this.state.hotSpaces;
        this.link.open(i, hotSpaces[i].data.url);
    };

    deleteLink = ({i}) => {
        let {hotSpaces} = this.state;
        hotSpaces.splice(i, 1);
        this.setState({hotSpaces});
    };

    linkChange = (l, i) => {
        let hotSpaces = this.state.hotSpaces;
        hotSpaces[i].data = {};
        hotSpaces[i].type = "link";
        this.setState({hotSpaces: hotSpaces}, () => {
            hotSpaces[i].data.url = l;
            this.setState({hotSpaces: hotSpaces});
        });
    };

    Specifications = (c) => {
        return {
            width: $(c).width(),
            height: $(c).height(),
        }
    };

    deviation = (x, y, i) => {
        let {width, height} = this.Specifications(".imgStyle");
        let hotSpaces = this.state.hotSpaces;
        hotSpaces[i].x = parseInt(((x * 100) / width).toFixed(0));
        hotSpaces[i].y = parseInt(((y * 100) / height).toFixed(0));
        this.setState({hotSpaces: hotSpaces});
    };
    zoom = (w, h, i) => {
        let {width, height} = this.Specifications(".imgStyle");
        let hotSpaces = this.state.hotSpaces;
        hotSpaces[i].width = parseInt(((w * 100) / width).toFixed(0));
        hotSpaces[i].height = parseInt(((h * 100) / height).toFixed(0));
        this.setState({hotSpaces: hotSpaces});
    };

    submit = () => {
        let {hotSpaces, showPoint,url,pa} = this.state;
        let hotSpace = [];
        for (let i in hotSpaces) {
            if (hotSpaces[i].type) {
                hotSpace.push(hotSpaces[i]);
            }
        }
        let data = {
            hotSpaces: hotSpace,
            picHeight: parseInt(pa.h),
            picWidth: parseInt(pa.w),
            showPoint: showPoint,
            type: "SIDEBARHOTSPACEIMAGE",
            url: url,
        };
        this.close(()=>{
            this.props.callback(data);
        });

    };

    ChangeUrl = () => {
        let upImagesBack = (url, pa, img) => {
            this.setState({url: url, pa: pa, img: img});
        };
        this.setState({upImagesBack: upImagesBack}, () => {
            this.upImagesBundleLoading();
        });
    };
    upItemBundleLoading=(data)=>{//添加商品热加载
        if (this.state.upItemFlag && this.upIitem&&this.upIitem.jd) {
            this.upIitem.jd.open(data);
        } else {
            this.setState({upItemFlag: true}, () => {
                let upload = setInterval(() => {
                    let upIitem = this.upIitem;
                    if (upIitem && upIitem.jd) {
                        clearInterval(upload);
                        this.upIitem.jd.open(data);
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

    render() {
        let {showPoint,showModal,hotSpaces,url,upItemFlag,upImagesFlag} = this.state,{minSpaces,maxHotSpaces}=this.props.item;
        return(
            <div>
                <Dialog title="编辑热区" size="small" visible={showModal} onCancel={this.close} lockScroll={false}>
                    <Dialog.Body>
                        <div style={{color:'rgb(119, 119, 119)'}}>
                            <Button type="text" onClick={this.ChangeUrl}>点击换图</Button>请在图片上选择合适的位置创建热区，所划区域不小于44*44px。
                        </div>
                        <Checkbox checked={showPoint} onChange={() => this.setState({showPoint: !showPoint})}>图片显示点击引导</Checkbox>
                        <Layout.Row gutter="6">
                            <Layout.Col span="12">
                                <HotSpot url={url} hotSpaces={hotSpaces} deviation={this.deviation} zoom={this.zoom}
                                         SelectionUp={this.SelectionUp} SelectionDown={this.SelectionDown} showPoint={showPoint}/>
                                <div style={{height: "6px"}}> </div>
                            </Layout.Col>
                            <Layout.Col span="12">
                                {hotSpaces.length>0?
                                    <div>
                                        {hotSpaces.map((item,index)=>{
                                            return(
                                                <Layout.Row gutter="2" key={`hot-${index}`} style={{padding:'5px 0'}}>
                                                    <Layout.Col span="2" style={{fontSize: "16px", marginTop: "7px"}}>
                                                        {index + 1}
                                                    </Layout.Col>
                                                    {item.data ?<React.Fragment>
                                                        <Layout.Col span="12">
                                                            <Input disabled value={item.data.title ? item.data.title : item.data.url}/>
                                                        </Layout.Col>
                                                            <Layout.Col span="10">
                                                                <Button.Group>
                                                                    <Button type="primary" icon="edit" onClick={()=>{
                                                                        item.type === "item" ? this.editItem({i:index}) : this.editLink({i:index})
                                                                    }} size="small">
                                                                        {item.type === "item" ? "商品" : "链接"}
                                                                    </Button>
                                                                    <Button type="danger" icon="delete" onClick={()=>this.deleteLink({i:index})} size="small">
                                                                        删
                                                                    </Button>
                                                                </Button.Group>
                                                            </Layout.Col>
                                                        </React.Fragment>:
                                                        <React.Fragment>
                                                            <Layout.Col span="8">
                                                                <Input disabled placeholder="暂无宝贝"/>
                                                            </Layout.Col>
                                                            <Layout.Col span="14">
                                                                <Button.Group>
                                                                    <Button type="primary" onClick={()=>this.addItem({i:index})} size="small">+商品</Button>
                                                                    <Button type="info" onClick={()=>this.addLink({i:index})} size="small">+链接</Button>
                                                                    <Button type="danger" onClick={()=>this.deleteLink({i:index})} size="small">删除</Button>
                                                                </Button.Group>
                                                            </Layout.Col>
                                                        </React.Fragment>}
                                                </Layout.Row>
                                            )
                                        })}
                                        <Alert title={`当前已添加${hotSpaces.length}个，请添加${minSpaces}~${maxHotSpaces}个热区`} type="info" />
                                    </div>:<div style={{padding: "120px 0 0 60px",color:'#999',fontSize: '16px',lineHeight: '24px'}}>
                                        请在左侧合适的位置拖拽添加热区,请添加{minSpaces}~{maxHotSpaces}个热区</div>}
                            </Layout.Col>
                        </Layout.Row>
                    </Dialog.Body>
                    <Dialog.Footer className="dialog-footer">
                        <Button onClick={this.close} size="small">取消</Button>
                        <Button type="primary" onClick={this.submit} size="small">确定</Button>
                    </Dialog.Footer>
                </Dialog>
                {upItemFlag&&<BundleLoading load={UpIitem} ref={e => this.upIitem = e} callback={this.state.addItemCallback} categoryListApiQuery={this.props.categoryListApiQuery}
                                            maxTitle={this.props.item.titleMaxLength} minTitle="1" activityId={this.props.activityId}/>}
                {upImagesFlag&&<BundleLoading load={UpImages} ref={e => this.upImages = e} callback={this.state.upImagesBack}/>}
                <Link ref={e => this.link = e} linkChange={this.linkChange}/>
            </div>
        )
    }
}

class Link extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            link: "",
            i: undefined,
        };
    }

    open=(i, l)=> {
        this.setState({show: true, i: i, link: (l ? l : "")});
    };

    close=()=> {
        this.setState({show: false, link: "", i: undefined});
    };

    linkChange=(value)=> {
        this.setState({link: value});
    };

    submit=()=> {
        let {i,link} = this.state;
        this.props.linkChange(link, i);
        this.close();
    };

    render() {
        let {show,link}=this.state;
        return(
            <Dialog title="添加链接" size="tiny" visible={show} onCancel={this.close} lockScroll={false}>
                <Dialog.Body>
                    <div>添加普通链接将不会转换淘客链接，仅为页面跳转使用。支持淘宝、天猫等阿里巴巴旗下网站链接（支付宝除外）。</div>
                    <Layout.Row gutter="5" style={{marginTop: "6px"}}>
                        <Layout.Col span="4">
                            <div style={{marginLeft: "33px"}}>
                                链接
                            </div>
                        </Layout.Col>
                        <Layout.Col span="20">
                            <Input placeholder="https://" value={link} onChange={this.linkChange}/>
                        </Layout.Col>
                    </Layout.Row>
                </Dialog.Body>
                <Dialog.Footer className="dialog-footer">
                    <Button onClick={this.close} size="small">取消</Button>
                    <Button type="primary" onClick={this.submit} disabled={!link} size="small">确定</Button>
                </Dialog.Footer>
            </Dialog>
        )
    }
}

class HotSpot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidUpdate() {
        $(ReactDOM.findDOMNode(this)).find(".hotImgAreaNum").draggable({containment: $(".hotImgArea")}).unbind("dragstop").on("dragstop", (event, ui) => {
            event.stopPropagation();
            let i = $(event.target).data("i");
            let x = ui.position.left;
            let y = ui.position.top;
            this.props.deviation(x, y, i);
        });
        $(() => {
            $(ReactDOM.findDOMNode(this)).find(".hotImgAreaNum").resizable({containment: $(".hotImgArea")}).unbind("resizestop").on("resizestop", (event, ui) => {
                event.stopPropagation();
                let i = $(event.target).data("i");
                let w = ui.size.width;
                let h = ui.size.height;
                this.props.zoom(w, h, i);
            });
        });
    }

    render() {
        let {url,SelectionDown,SelectionUp,hotSpaces,showPoint}=this.props;
        return (
            <div style={{position: "relative"}}>
                <img src={url} width="100%" className="imgStyle"/>
                <div className="hotImgArea" style={{width: "100%", height: "100%", position: "absolute", top: 0, left: 0}}
                     onMouseDown={SelectionDown} onMouseUp={SelectionUp}>
                    {hotSpaces.map((item, i) => {
                        return (
                            <div className="hotImgAreaNum" key={i} data-i={i}
                                 style={{
                                     position: "absolute",
                                     top: item.y + "%",
                                     left: item.x + "%",
                                     width: item.width + "%",
                                     height: item.height + "%",
                                     zIndex: i * 100 + 10000,
                                     cursor: "move",
                                     backgroundColor: "rgba(158, 213, 248, 0.24)",
                                 }}>
                                <div style={{
                                    backgroundColor: "rgba(158, 213, 248, 0.66)",
                                    width: "20px",
                                    color: "white",
                                }}>
                                    <div style={{textAlign: "center"}} data-i={i}>{i + 1}</div>
                                </div>
                            </div>
                        )
                    })}
                    {showPoint && hotSpaces.map((item, i) => {
                        return (
                            <div key={i} style={{
                                position: "absolute",
                                top: (item.y + item.height / 2) + "%",
                                left: (item.x + item.width / 2) + "%",
                                zIndex: i * 100 + 10000 + 50,
                                cursor: "move",
                            }}>
                                <div style={{
                                    width: '18px',
                                    height: '18px',
                                    backgroundColor: '#fff',
                                    borderRadius: '9px',
                                    top: '-9px',
                                    left: '-9px',
                                    position: "relative",
                                    textAlign: 'center'
                                }}>
                                    +
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default UpHotImages;

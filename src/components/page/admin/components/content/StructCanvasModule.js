/**
 * Created by shiying on 17-9-20.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {Layout, Button, MessageBox, Message} from 'element-react';
import 'element-theme-default';
import HintShow from './Hint';
import '../../../../../styles/addList/content.css';
import CustomModule from 'bundle-loader?lazy&name=pc/trends_asset/page/admin/components/content/structCanvasModule/CustomModule/app-[name]!../content/structCanvasModule/CustomModule'
import {EditModule, StructCanvasEdit} from '../content/structCanvasModule/EditModule';
import {BundleLoading} from '../../../../../bundle';
import UpImages from 'bundle-loader?lazy&name=pc/trends_asset/components/lib/sharing/upload/upImages/app-[name]!../../../../../components/lib/sharing/upload/UpImages'
import {
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
} from '../content/structCanvasModule/SmallStructCanvas'

class StructCanvasModule extends React.Component {
    static hint(data, props) {
        let hint = [];
        for (let ind in data) {
            hint = hint.concat(StructCanvasEdit.hint(data[ind], props, ind));
        }
        return hint;
    }

    constructor(props) {
        super(props);
        this.handleClick = e => {
            const i = $(e.target).data("i");
            let show = this.state.show;
            show[i] = this.state.show[i] ? false : true;
            this.setState({target: e.target, show: show});
        };
        this.state = {
            show: [],
            wf: true,
            LeftOffset: 0,
            ii: undefined,
            id: undefined
        };
    }

    onChange = (i, val) => {
        let {value, constraint, onChange} = this.props;
        value.splice(i, 1, val);
        let hint = StructCanvasModule.hint(value, constraint.props);
        onChange(constraint, value, hint);
    };
    click = () => {
        this.setState({show: []});
    };

    new_upChange = ({i}) => {//新上移
        let {value, constraint, onChange} = this.props;
        value.splice(i - 1, 2, value[i], value[i - 1]);
        onChange(constraint, value);
    };

    new_downChange = ({i}) => {//新下移
        let {value, onChange, constraint} = this.props;
        value.splice(i, 2, value[i + 1], value[i]);
        onChange(constraint, value);
    };

    new_insertChange = ({id, i}) => {//新插入
        if (this.state.id) {
            $("#" + this.state.id).css("border", "none", "padding", "3px 5px");
        }
        this.setState({ii: i, id: id}, () => {
            $("#" + id).css("border", "1px solid #6af", "padding", "2px 4px");
        });
    };

    new_delChange = ({i}) => {//新删除
        let {value, constraint, onChange} = this.props;
        MessageBox.confirm('您确定要进行删除', '提示', {
            type: 'info'
        }).then(() => {
            value.splice(i, 1);
            onChange(constraint, value);
        }).catch(() => {
            Message({
                showClose: true,
                message: `已取消删除`,
                type: 'info'
            });
        });
    };

    new_editChange = ({i}) => {//新编辑
        let {value, constraint} = this.props;
        let editCallback = (t) => {
            value.splice(i, 1, t);
            if (t.name == "item-paragraph-select" || t.name == "item-paragraph") {
                let an = (it) => {
                    it[0].title = "第" + (i + 1) + "段落" + it[0].title;
                    return it;
                };
                let hints = this.props.hint;
                let h = [];
                for (let t in hints) {
                    if (!(hints[t].title.indexOf("第" + (i + 1) + "段落") > -1)) {
                        h.push(hints[t]);
                    }
                }
                let hint = [];
                let data = t.data;
                for (let it in data) {
                    if (it != "brandName") {
                        let ed = EditModule.hint(data[it], t.moduleInfo.dataSchema.properties, it);
                        hint = hint.concat(an(ed));
                    }
                }
                if (hint.length > 0) {
                    h = h.concat(hint);
                }
                this.props.onChange(constraint, value, h);
            } else if (t.name == "single-item-inventory" || t.name == "single-item-rank") {
                let judgeShop = (arr) => {
                    let arr1 = [].concat(arr);
                    let [count, yuansu, sum] = [1, [], []];
                    for (let i = 0; i < arr1.length; i++) {
                        for (let j = i + 1; j < arr1.length; j++) {
                            if (arr1[i].nick == arr1[j].nick) {
                                count++;//用来计算与当前这个元素相同的个数
                                arr1.splice(j, 1); //没找到一个相同的元素，就要把它移除掉
                                j--;
                            }
                        }
                        yuansu[i] = arr1[i].nick;//将当前的元素存入到yuansu数组中
                        sum[i] = count;  //并且将有多少个当前这样的元素的个数存入sum数组中
                        count = 1;  //再将count重新赋值，进入下一个元素的判断
                    }
                    let sss = (y) => {
                        let arr6 = [];
                        for (let r in arr) {
                            if (arr[r].nick == y) {
                                arr6.push(arr[r].num);
                            }
                        }
                        return arr6.join("、");
                    };
                    let arr2 = [];
                    if (constraint.props.itemMaxNum) {
                        let arr3 = [];
                        for (let s in sum) {
                            if (sum[s] > parseInt(constraint.props.itemMaxNum)) {
                                arr3.push(yuansu[s] + ":段落分别为" + sss(yuansu[s]));
                            }
                        }
                        if (arr3.length > 0) {
                            arr2.push({
                                meet: false,
                                value: "",
                                title: "单店铺商品数量不能大于" + constraint.props.itemMaxNum,
                                text: "超量店铺【" + arr3.join("】【") + "】",
                                type: "shopMinNum",
                            })
                        }
                    }
                    if (constraint.props.shopMinNum) {
                        if (parseInt(constraint.props.shopMinNum) > yuansu.length) {
                            arr2.push({
                                meet: false,
                                value: "",
                                title: "店铺数量不能少于" + constraint.props.shopMinNum,
                                text: "已有店铺【" + yuansu.join("】【") + "】",
                                type: "shopMinNum",
                            })
                        }
                    }
                    return arr2;
                };
                if (constraint.props.itemMaxNum || constraint.props.shopMinNum) {
                    let arr = [];
                    for (let v in value) {
                        if (value[v].data.items && value[v].data.items.length > 0) {
                            if (value[v].data.items[0].nick) {
                                let obj = {nick: value[v].data.items[0].nick, num: parseInt(v) + 1};
                                arr.push(obj);
                            }
                        }
                    }
                    let hints = this.props.hint;
                    let h = [];
                    for (let t in hints) {
                        if (hints[t].type != "shopMinNum" && hints[t].type != "itemMaxNum") {
                            h.push(hints[t]);
                        }
                    }
                    if (arr.length > 0) {
                        let j = judgeShop(arr).concat(h);
                        this.props.onChange(constraint, value, j);
                    } else {
                        this.props.onChange(constraint, value);
                    }
                } else {
                    this.props.onChange(constraint, value);
                }
            } else {
                this.props.onChange(constraint, value);
            }
        };

        this.setState({editCallback}, () => {
            this.editModule.open(value[i], true);
        });
    };

    new_addSingleItem = () => {
        let {value, constraint, onChange} = this.props, {ii} = this.state;
        let customCallback = (t) => {
            let obj = {};
            obj.attrs = t.attrs;
            obj.data = {};
            obj.materialId = t.materialId;
            obj.moduleInfo = {dataSchema: t.dataSchema};
            obj.name = t.name;
            obj.resourceId = t.id;
            obj.rule = t.rule;
            if (ii || ii === 0) {//改动
                value.splice(ii + 1, 0, obj);
                $("#" + this.state.id).css("border", "none", "padding", "3px 5px");
                this.setState({ii: undefined, id: undefined});
            } else {
                value.push(obj);
            }
            onChange(constraint, value);
        };
        this.setState({customCallback}, () => this.customModuleBundleLoading(constraint.props.sidebarBlockList[0].props.api))
    };

    new_editPicChange = ({i}) => {
        let {value, constraint, onChange} = this.props;
        let imgCallback = (url, pix) => {
            let imgStyle = [];
            imgStyle.push({picHeight: Number(pix.h), picWidth: Number(pix.w), picUrl: url});
            Object.assign(value[i].data, {images: imgStyle});
            onChange(constraint, value);
        };
        this.setState({imgCallback}, this.upImagesBundleLoading)
    };

    check = (val) => {
        let num = 1;
        for (let v in val) {
            if (val[v].name == "need-content-bpu") {
                num++;
            }
        }
        return num;
    };

    addCustomParagraph = ({i}) => {
        let {value, constraint, onChange} = this.props;
        let customCallback = (data) => {
            let {ii} = this.state, {name, materialId, id, dataSchema} = data;
            let [it, str, dt] = [{}, "", data.data];
            for (let d in dt) {
                str = d;
            }
            Object.assign(it, {
                name,
                materialId,
                resourceId: id,
                moduleInfo: {dataSchema: dataSchema}
            });
            if (data.name == "need-content-bpu") {
                let i = this.check(value);
                it.data = {
                    description: "",
                    item: [],
                    rates: [],
                    title: "",
                    topNum: i,
                };
                it.spareData = {
                    description: data.data.description,
                    item: data.data.item,
                    rates: data.data.rates,
                    title: data.data.title,
                    topNum: i,
                };
            } else if (data.name == "goodshop-shendian-shop") {
                it.data = {
                    shopDetail: [{}],
                    shopNumber: "",
                    shop_cover: [],
                    shop_desc: "",
                    shop_tag: "",
                };
            } else {
                if (str == "shopDetail") {
                    it.data = data.data;
                } else {
                    it.data = {
                        [str]: []
                    };
                    it.spareData = data.data;
                }
            }
            if (ii || ii === 0) {
                value.splice(ii + 1, 0, it);
                $(`#${this.state.id}`).css("border", "none", "padding", "3px 5px");
                this.setState({ii: undefined, id: undefined});
            } else {
                value.push(it);
            }
            onChange(constraint, value);
        };
        this.setState({customCallback}, () => this.customModuleBundleLoading(constraint.props.sidebarBlockList[i].props.api))
    };

    addNewCustomParagraph = ({i}) => {
        let {value, constraint, onChange} = this.props;
        let customCallback = (data) => {
            let it = {}, {name, materialId, id, dataSchema} = data, {ii} = this.state;
            Object.assign(it, {
                name,
                materialId,
                resourceId: id,
                moduleInfo: {dataSchema: dataSchema}
            });
            if (data.name === "ceping-separator1" || data.name === "ceping-separator2" || data.name === "ceping-separator3") {
                it.data = {};
                it.spareData = {coverUrl: data.coverUrl};
            } else if (data.name === "weitao-score-range") {
                it.data = {scores: []};
                it.spareData = data.data;
            } else if (data.name === "shop-inventory-separator") {
                it.data = {
                    title: "",
                    topNum: "1"
                };
                it.spareData = data.data;
            } else if (data.name === "weitao-ver-items") {
                it.data = {products: []};
                it.spareData = data.data;
            } else if (data.name === "weitao-item-pk") {
                it.data = {items: []};
                it.spareData = data.data;
            }
            if (ii || ii === 0) {//插入
                value.splice(ii + 1, 0, it);
                $(`#${this.state.id}`).css("border", "none", "padding", "3px 5px");
                this.setState({ii: undefined, id: undefined});
            } else {
                value.push(it);
            }
            onChange(constraint, value);
        };
        this.setState({customCallback}, () => this.customModuleBundleLoading(constraint.props.sidebarBlockList[i].props.api))
    };

    addPic = ({i}) => {
        let {value, constraint, onChange} = this.props, {ii} = this.state;
        let item = constraint.props.sidebarBlockList[i];
        let imgCallback = (url, pix) => {
            let it = {}, imgStyle = [];
            imgStyle.push({picHeight: Number(pix.h), picWidth: Number(pix.w), picUrl: url});
            it.materialId = item.moduleInfo.materialId;
            it.moduleInfo = {dataSchema: item.moduleInfo.dataSchema};
            it.resourceId = item.moduleInfo.id;
            it.name = "picture";
            it.data = {images: imgStyle};
            if (ii || ii === 0) {
                value.splice(ii + 1, 0, it);
                $("#" + this.state.id).css("border", "none", "padding", "3px 5px");
                this.setState({ii: undefined, id: undefined});
            } else {
                value.push(it);
            }
            onChange(constraint, value);
        };
        this.setState({imgCallback}, this.upImagesBundleLoading)
    };

    addParagraph = ({i}) => {
        let {value, constraint, onChange} = this.props, {ii} = this.state;
        let item = constraint.props.sidebarBlockList[i];
        let textAddCallback = (t) => {
            let it = {};
            it.materialId = item.moduleInfo.materialId;
            it.moduleInfo = {dataSchema: item.moduleInfo.dataSchema};
            it.resourceId = item.moduleInfo.id;
            it.name = item.moduleInfo.name;
            it.data = t;
            if (ii || ii === 0) {//改动
                value.splice(ii + 1, 0, it);
                $("#" + this.state.id).css("border", "none", "padding", "3px 5px");
                this.setState({ii: undefined, id: undefined});
            } else {
                value.push(it);
            }
            onChange(constraint, value);
        };
        this.setState({textAddCallback}, () => {
            this.editModule.open(undefined, false);
        })
    };
    addSeparator = ({i}) => {
        let {value, constraint, onChange} = this.props, {ii} = this.state;
        let customCallback = (data) => {
            let it = {};
            it.name = data.name;
            it.materialId = data.materialId;
            it.resourceId = data.id;
            it.moduleInfo = {dataSchema: data.dataSchema};
            it.data = {
                title: "",
                topNum: "1"
            };
            it.spareData = data.data;
            if (ii || ii === 0) {//改动
                value.splice(ii + 1, 0, it);
                $("#" + this.state.id).css("border", "none", "padding", "3px 5px");
                this.setState({ii: undefined, id: undefined});
            } else {
                value.push(it);
            }
            onChange(constraint, value);
        };
        this.setState({customCallback}, () => {
            this.customModuleBundleLoading(constraint.props.sidebarBlockList[i].props.api);
        })
    };

    addCusParagraph = ({i}) => {
        this.growGrass(i);
    };
    addStdParagraph = ({i}) => {
        this.growGrass(i);
    };
    growGrass = (i) => {
        let {constraint, value, onChange} = this.props, {ii} = this.state;
        let moduleInfo = constraint.props.sidebarBlockList[i].moduleInfo;
        let obj = {
            attrs: moduleInfo.attrs,
            spareData: moduleInfo.data,
            data: {
                title: "",
                desc: "",
                images: []
            },
            materialId: moduleInfo.materialId,
            rule: moduleInfo.rule,
            resourceId: moduleInfo.id,
            name: moduleInfo.name,
            moduleInfo: {dataSchema: moduleInfo.dataSchema},
        };
        if (ii || ii === 0) {//改动
            value.splice(ii + 1, 0, obj);
            $("#" + this.state.id).css("border", "none", "padding", "3px 5px");
            this.setState({ii: undefined, id: undefined});
        } else {
            value.push(obj);
        }
        onChange(constraint, value);
    };

    componentDidMount() {
        let buts = $(ReactDOM.findDOMNode(this)).find(".editButtons");
        if (this.props.isFloat) {
            if (buts.offset()) {
                let scrollParent = $(ReactDOM.findDOMNode(this)).parents(".scrollParent");
                if (scrollParent.length == 0) {
                    scrollParent = $(window);
                }
                let top = buts.offset().top - scrollParent.offset().top;
                scrollParent.scroll(() => {
                    if ($('.structEditBox').length > 0) {
                        let h = $('.xiaopp').height();
                        let t = scrollParent.scrollTop();
                        if (top < t && t < (top + h - 100)) {
                            $(".structEditBox").addClass("editButtonFD").css("left", buts.offset().left + "px");
                        } else {
                            $(".structEditBox").removeClass("editButtonFD").css("left", "0px");
                        }
                    }
                });
            }
        }
    };

    upImagesBundleLoading = () => {//添加图片热加载
        if (this.state.upImagesFlag && this.upImages && this.upImages.jd) {
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
    customModuleBundleLoading = (data) => {//添加自定义段落热加载
        if (this.state.customModuleFlag && this.customModule && this.customModule.jd) {
            this.customModule.jd.open(data);
        } else {
            this.setState({customModuleFlag: true}, () => {
                let upload = setInterval(() => {
                    let customModule = this.customModule;
                    if (customModule && customModule.jd) {
                        clearInterval(upload);
                        this.customModule.jd.open(data);
                    }
                }, 100);
            });
        }
    };

    getPublicChange = ({changeType, isType}) => {//拿取事件及判断
        let object = {};
        changeType.forEach(item => {
            if (typeof item == 'string') {
                Object.assign(object, {[item]: this[`new_${item}`]})
            } else {
                Object.assign(object, {[item.pName]: this[`new_${item.name}`]})
            }
        });
        isType.forEach(item => {
            if (typeof item == 'string') {
                Object.assign(object, {[item]: true});
            } else {
                Object.assign(object, item);
            }
        });
        return object;
    };

    render() {

        let {value = [], constraint} = this.props, {upImagesFlag, imgCallback, customModuleFlag, customCallback, textAddCallback, editCallback} = this.state;
        let {sidebarBlockList = []} = constraint.props;
        let span = ['', '24', '12', '8', '6', '4', '4'];
        return (
            <div>
                {constraint.type == "StructCanvas" &&
                <div>
                    <Layout.Row gutter="20" style={{margin: "8px 0"}} className="addContentComponent xiaopp">
                        <Layout.Col span="2" style={{fontWeight: 'bold'}}>
                            自定义段落
                        </Layout.Col>
                        <Layout.Col span="22">
                            <div style={{width: "500px", minHeight: "745px", border: "1px solid rgba(0, 0, 0, 0.25)", borderRadius: "4px"}} className="editButtons">
                                {(sidebarBlockList.length > 0 && sidebarBlockList[0].title != "段落" && sidebarBlockList[0].title != "亮点") &&
                                <div style={{width: "500px", height: "40px", top: "50px", left: "210px"}} className="structEditBox">
                                    <Layout.Row gutter="0" style={{marginTop: 0, bottom: 0, width: "500px"}}>
                                        {sidebarBlockList.map((item, index) => {
                                            switch (item.blockName) {
                                                case "CustomParagraph":
                                                    if (item.title == "段落") {
                                                        return (
                                                            <Layout.Col span={span[sidebarBlockList.length]} key={`sidebarBlock-${index}`}>
                                                                <Button type="success" onClick={() => this.addNewCustomParagraph({i: index})} style={{width: '100%'}}>{item.title}</Button>
                                                            </Layout.Col>
                                                        )
                                                    } else {
                                                        if (item.props) {
                                                            return (
                                                                <Layout.Col span={span[sidebarBlockList.length]} key={`sidebarBlock-${index}`}>
                                                                    <Button type="success" onClick={() => this.addCustomParagraph({i: index})} style={{width: '100%'}}>{item.title}</Button>
                                                                </Layout.Col>
                                                            );
                                                        } else {
                                                            return (
                                                                <Layout.Col span={span[sidebarBlockList.length]} key={`sidebarBlock-${index}`}>
                                                                    <Button type="success" onClick={() => this.addCusParagraph({i: index})} style={{width: '100%'}}>{item.title}</Button>
                                                                </Layout.Col>
                                                            )
                                                        }
                                                    }
                                                    break;
                                                case "StdParagraph":
                                                    return (
                                                        <Layout.Col span={span[sidebarBlockList.length]} key={`sidebarBlock-${index}`}>
                                                            <Button type="primary" onClick={() => this.addStdParagraph({i: index})} style={{width: '100%'}}>{item.title}</Button>
                                                        </Layout.Col>
                                                    );
                                                    break;
                                                case "Pic":
                                                    return (
                                                        <Layout.Col span={span[sidebarBlockList.length]} key={`sidebarBlock-${index}`}>
                                                            <Button type="primary" onClick={() => this.addPic({i: index})} style={{width: '100%'}}>{item.title}</Button>
                                                        </Layout.Col>
                                                    );
                                                    break;
                                                case "Paragraph":
                                                    return (
                                                        <Layout.Col span={span[sidebarBlockList.length]} key={`sidebarBlock-${index}`}>
                                                            <Button onClick={() => this.addParagraph({i: index})} style={{width: '100%'}}>{item.title}</Button>
                                                        </Layout.Col>
                                                    );
                                                    break;
                                                case "Separator":
                                                    return (
                                                        <Layout.Col span={span[sidebarBlockList.length]} key={`sidebarBlock-${index}`}>
                                                            <Button type="info" onClick={() => this.addSeparator({i: index})} style={{width: '100%'}}>{item.title}</Button>
                                                        </Layout.Col>
                                                    );
                                                    break;
                                            }
                                        })}
                                    </Layout.Row>
                                </div>}
                                <div className="na">
                                    {value.map((item, i) => {//upChange 上移；downChange 下移；editChange 编辑；delChange 删除；insertChange 插入；
                                        let pData = {item, i, value};
                                        switch (item.name) {
                                            case "calendar-header-card"://每日神店头部
                                                return (
                                                    <CalendarHeaderCard key={"structCanvas" + i} {...pData}{...this.getPublicChange({
                                                        changeType: ['editChange'],
                                                        isType: ['edit']
                                                    })} constraint={constraint}/>
                                                );
                                                break;
                                            case "goodshop-shendian-shop"://每日神店
                                                return (
                                                    <GoodshopShendianShop key={"structCanvas" + i} {...pData}{...this.getPublicChange({
                                                        changeType: ['editChange', 'delChange'],
                                                        isType: ['edit', 'del']
                                                    })} constraint={constraint}/>
                                                );
                                                break;
                                            case "need-content-bpu":
                                                return (
                                                    <NeedContentBPU key={"structCanvas" + i} {...pData}{...this.getPublicChange({
                                                        changeType: ['upChange', 'downChange', 'editChange', 'delChange', 'insertChange'],
                                                        isType: ['insert', 'edit', 'del']
                                                    })}/>
                                                );
                                                break;
                                            case "weitao-ver-items":
                                                return (
                                                    <WeitaoVerItems key={"structCanvas" + i} {...pData}{...this.getPublicChange({
                                                        changeType: ['upChange', 'downChange', 'editChange', 'delChange', 'insertChange'],
                                                        isType: ['insert', 'edit', 'del']
                                                    })}/>
                                                );
                                                break;
                                            case "weitao-item-pk":
                                                return (
                                                    <WeitaoItemPK key={"structCanvas" + i} {...pData}{...this.getPublicChange({
                                                        changeType: ['upChange', 'downChange', 'editChange', 'delChange', 'insertChange'],
                                                        isType: ['insert', 'edit', 'del']
                                                    })}/>
                                                );
                                                break;
                                            case "weitao-score-range":
                                                return (
                                                    <WeitaoScoreRange key={"structCanvas" + i} {...pData}{...this.getPublicChange({
                                                        changeType: ['upChange', 'downChange', 'editChange', 'delChange', 'insertChange'],
                                                        isType: ['insert', 'edit', 'del']
                                                    })}/>
                                                );
                                                break;
                                            case "ceping-separator1":
                                            case "ceping-separator2":
                                            case "ceping-separator3":
                                                return (
                                                    <CepingSeparator key={"structCanvas" + i} {...pData}{...this.getPublicChange({
                                                        changeType: ['upChange', 'downChange', 'delChange', 'insertChange'],
                                                        isType: ['insert', 'del']
                                                    })}/>
                                                );
                                                break;
                                            case "single-item-inventory" :
                                            case "single-item-rank":  //单列榜单商品
                                                return (
                                                    <SingleItemInventory key={"structCanvas" + i} {...pData}{...this.getPublicChange({
                                                        changeType: ['upChange', 'downChange', 'delChange', 'insertChange', 'editChange', 'addSingleItem'],
                                                        isType: ['insert', 'edit', {del: !(i < constraint.props.topLockIndex)}]
                                                    })} constraint={constraint}/>
                                                );
                                                break;
                                            case "picture":
                                                return (
                                                    <Picture key={"structCanvas" + i} {...pData}{...this.getPublicChange({
                                                        changeType: ['upChange', 'downChange', 'delChange', 'insertChange', {pName: 'editChange', name: 'editPicChange'}],
                                                        isType: ['insert', 'edit', 'del']
                                                    })}/>
                                                );
                                                break;
                                            case "shop-inventory-separator":
                                                return (
                                                    <ShopInventorySeparator key={"structCanvas" + i} {...pData}{...this.getPublicChange({
                                                        changeType: ['upChange', 'downChange', 'editChange', 'delChange', 'insertChange'],
                                                        isType: ['insert', 'edit', 'del']
                                                    })}/>
                                                );
                                                break;
                                            case "two-column-items":
                                                return (
                                                    <TwoColumnItem key={"structCanvas" + i} {...pData}{...this.getPublicChange({
                                                        changeType: ['upChange', 'downChange', 'editChange', 'delChange', 'insertChange'],
                                                        isType: ['insert', 'edit', 'del']
                                                    })}/>
                                                );
                                                break;
                                            case "content-shop":
                                                return (
                                                    <ContentShop key={"structCanvas" + i} {...pData}{...this.getPublicChange({
                                                        changeType: ['upChange', 'downChange', 'editChange', 'delChange', 'insertChange'],
                                                        isType: ['insert', 'edit', 'del']
                                                    })}/>
                                                );
                                                break;
                                            case "paragraph":
                                                return (
                                                    <Paragraph key={"structCanvas" + i} {...pData}{...this.getPublicChange({
                                                        changeType: ['upChange', 'downChange', 'editChange', 'delChange', 'insertChange'],
                                                        isType: ['insert', 'edit', 'del']
                                                    })}/>
                                                );
                                                break;
                                            case "item-paragraph":
                                                return (
                                                    <ItemParagragh key={"structCanvas-" + i} {...pData}{...this.getPublicChange({
                                                        changeType: ['upChange', 'downChange', 'editChange', 'delChange'],
                                                        isType: ['edit', 'del']
                                                    })}/>
                                                );
                                                break;
                                            case "item-paragraph-select":
                                                return (
                                                    <ItemParagraghSelect key={"structCanvas-" + i} {...pData}{...this.getPublicChange({
                                                        changeType: ['upChange', 'downChange', 'editChange', 'delChange'],
                                                        isType: ['edit', 'del']
                                                    })}/>
                                                );
                                                break;
                                            case "item-feature":
                                                return (
                                                    <ItemFeature key={"structCanvas-" + i} {...pData}{...this.getPublicChange({changeType: ['editChange'], isType: ['edit']})}/>
                                                );
                                                break;
                                        }
                                    })}
                                </div>
                                {sidebarBlockList[0].title == "亮点" &&
                                <div style={sidebarBlockList[0].title != "段落" ? {
                                    width: "500px",
                                    height: "40px",
                                    position: 'absolute',
                                    bottom: 0,
                                } : {}}>
                                    <Layout.Row gutter="0">
                                        {constraint.props.sidebarBlockList.map((item, index) => {
                                            switch (item.blockName) {
                                                case "CustomParagraph":
                                                    if (item.title != "段落") {
                                                        if (item.props) {
                                                            return (
                                                                <Layout.Col span='12' key={`hh-sidebarBlock-${index}`}>
                                                                    <Button type="success" onClick={() => this.addCustomParagraph({i: index})} style={{width: '100%'}}>{item.title}</Button>
                                                                </Layout.Col>
                                                            );
                                                        } else {
                                                            return (
                                                                <Layout.Col span='12' key={`hh-sidebarBlock-${index}`}>
                                                                    <Button type="success" onClick={() => this.addCusParagraph({i: index})} style={{width: '100%'}}>{item.title}</Button>
                                                                </Layout.Col>
                                                            )
                                                        }
                                                    }
                                                    break;
                                                case "StdParagraph":
                                                    return (
                                                        <Layout.Col span='12' key={`sidebarBlock-${index}`}>
                                                            <Button type="primary" onClick={() => this.addStdParagraph({i: index})} style={{width: '100%'}}>{item.title}</Button>
                                                        </Layout.Col>
                                                    );
                                                    break;
                                            }
                                        })}
                                    </Layout.Row>
                                </div>}
                                <div style={{height: '36px', width: '100%'}}></div>
                            </div>
                        </Layout.Col>
                    </Layout.Row>
                    <Layout.Row gutter="20" style={{margin: "6px 0"}}>
                        <Layout.Col span="2">
                            <div style={{height: '10px', width: '100%'}}></div>
                        </Layout.Col>
                        <Layout.Col span="22">
                            <HintShow hint={this.props.hint}/>
                        </Layout.Col>
                    </Layout.Row>
                    {upImagesFlag && <BundleLoading load={UpImages} ref={e => this.upImages = e} callback={imgCallback}/>}
                    {customModuleFlag && <BundleLoading load={CustomModule} ref={e => this.customModule = e} callback={customCallback}/>}
                    <EditModule ref={e => this.editModule = e} textAddCallback={textAddCallback} constraint={constraint}
                                moduleConfig={constraint.props.moduleConfig} editCallback={editCallback}/>
                </div>}

            </div>
        );
    }
}


export default StructCanvasModule;

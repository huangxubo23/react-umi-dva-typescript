/**
 * Created by 林辉 on 2018/9/19 10:56.word转换
 */
import {StructCanvasEdit} from '../../../../../../components/content/structCanvasModule/EditModule'

const StringModuleHint = (data, props) => {//string提示
    data = data ? data : "";
    let titleHint = undefined;
    let meet = true;
    let minTitle = props.minLength;
    let maxTitle = props.maxLength;
    if (minTitle && minTitle > data.length) {
        meet = false;
        titleHint = "不能少于" + minTitle + "个字";
    } else if (maxTitle && maxTitle < data.length) {
        meet = false;
        titleHint = "不能大于" + maxTitle + "个字";
    }
    return [{meet: meet, value: data.length, title: "字数", text: titleHint}];
};

const ItemModuleHint = (data, props) => {//CreatorAddItem
    let hints = [];
    let hint = undefined;
    let min = props.min;
    let max = props.max;
    const editTitleMaxLength = props.editTitleMaxLength;
    const editTitleMinLength = props.editTitleMinLength;
    data = data ? data : [];
    let meet = true;
    if (min && min > data.length) {
        meet = false;
        hint = "不能少于" + min + "个商品";
    } else if (max && max < data.length) {
        meet = false;
        hint = "不能大于" + max + "个商品";
    }
    hints.push({meet: meet, text: hint, value: data.length, title: "商品数量"});
    let shopNum = {};
    for (let i in data) {
        let titleMeet = true;
        let titleHint = undefined;
        let title = data[i].title;
        let i = Number(i);
        let t = i + 1;
        if (editTitleMinLength && editTitleMinLength > title.length) {
            titleMeet = false;
            titleHint = "不能少于" + editTitleMinLength + "个字";
        } else if (editTitleMaxLength && editTitleMaxLength < title.length) {
            titleMeet = false;
            titleHint = "不能大于" + editTitleMaxLength + "个字";
        }
        if (props.isDesc) {
            let editDescMaxLength = props.editDescMaxLength;
            let editDescMinLength = props.editDescMinLength;
            let descMeet = true;
            let descHint = undefined;
            let description = data[i].description;
            if (editDescMinLength && editDescMinLength > description.length) {
                descMeet = false;
                descHint = "不能少于" + editDescMinLength + "个字";
            } else if (editDescMaxLength && editDescMaxLength < description.length) {
                descMeet = false;
                descHint = "不能大于" + editDescMaxLength + "个字";
            }
            hints.push({meet: descMeet, text: descHint, value: description.length, title: "第" + t + "个产品描述"});
        }

        hints.push({meet: titleMeet, text: titleHint, value: title.length, title: "第" + t + "个产品标题"});

        let nick = data[i].nick;
        shopNum[nick] = shopNum[nick] ? (shopNum[nick] + 1) : 1;

    }
    let shopI = 0;
    for (let i in shopNum) {
        let shopMaxItemMeet = true;
        let shopMaxItemHint = undefined;
        let shopMaxItem = props.shopMaxItem;
        if (shopNum[i]) {
            shopI++;
        }
        if (shopNum[i] && shopNum[i] > shopMaxItem) {
            shopMaxItemMeet = false;
            shopMaxItemHint = "单店商品不能多于" + shopMaxItem + "个";
        }
        hints.push({meet: shopMaxItemMeet, text: shopMaxItemHint, value: shopNum[i], title: i});
    }
    let minShopMeet = true;
    let minShopHint = undefined;
    if (props.minShop && shopI < props.minShop) {
        minShopMeet = false;
        minShopHint = "最少不能小于" + props.minShop;

    }
    hints.push({
        meet: minShopMeet,
        text: minShopHint,
        value: Object.getOwnPropertyNames(shopNum).length,
        title: "店铺数"
    });
    return hints;
};

const AnchorImageListModuleHint = (data, props) => {//AnchorImageList
    data = data ? data : [];
    let hints = [];
    let hint = undefined;
    let min = props.min;
    let max = props.max;
    let maxAnchors = props.maxAnchors;
    let minAnchors = props.minAnchors;
    let titleMaxLength = props.titleMaxLength;
    let titleMinLength = props.titleMinLength;

    let meet = true;
    if (min && min > data.length) {
        meet = false;
        hint = "不能少于" + min + "张图片";
    } else if (max && max < data.length) {
        meet = false;
        hint = "不能大于" + max + "张图片";
    }
    let h = {meet: meet, text: hint, value: data.length, title: "搭配数量"};
    hints.push(h);

    for (let i in data) {
        let hint = undefined;
        let meet = true;
        let value = data[i];
        let anchors = value.anchors;
        if (minAnchors && minAnchors > anchors.length) {
            meet = false;
            hint = "不能少于" + min + "个锚点";
        } else if (maxAnchors && maxAnchors < anchors.length) {
            meet = false;
            hint = "不能大于" + max + "个锚点";
        }
        for (let j in anchors) {
            let anchorMeet = true;
            let anchorHint = undefined;
            if (titleMinLength && titleMinLength > anchors[j].data.title.length) {
                anchorMeet = false;
                anchorHint = "不能少于" + titleMinLength + "个字";
            } else if (titleMaxLength && titleMaxLength < anchors[j].data.title.length) {
                anchorMeet = false;
                anchorHint = "不能大于" + titleMaxLength + "个字";
            }
            hints.push({
                meet: anchorMeet,
                text: anchorHint,
                value: anchors[j].data.title.length,
                title: "第" + (parseInt(i) + 1) + "张图片,第" + (parseInt(j) + 1) + "个锚点"
            });
        }

        hints.push({meet: meet, text: hint, value: anchors.length, title: "第" + (parseInt(i) + 1) + "张图片"});
    }

    return hints;
};
const ImgModuleHint = (data, props) => {//CreatorAddImage
    let hints = [];
    let hint = undefined;
    let titleMeet = true;
    let min = props.min;
    let max = props.max;
    data = data ? data : [];
    if (min && min > data.length) {
        titleMeet = false;
        hint = "不能少于" + min + "张图片";
    } else if (max && max < data.length) {
        titleMeet = false;
        hint = "不能大于" + max + "张图片";
    }
    hints.push({meet: titleMeet, text: hint, value: data.length, title: "图片数量"});
    return hints;
};

const AddTagModuleHint = (data, props) => {//AddTag
    data = data ? data : [];
    let hints = [];
    let hint = undefined;
    let meet = true;
    let min = props.min;
    let max = props.max;
    if (min && min > data.length) {
        meet = false;
        hint = "不能少于" + min + "个标签";
    } else if (max && max < data.length) {
        meet = false;
        hint = "不能大于" + max + "个标签";
    }

    for (let i in data) {
        let hintLength = undefined;
        let meetLength = true;
        let minLength = props.minLength;
        let maxLength = props.maxLength;
        let j = parseInt(i) + 1;
        if (minLength && minLength > data[i].length) {
            meetLength = false;
            hintLength = "第" + j + "个标签不能少于" + minLength + "个字";
        } else if (maxLength && maxLength < data[i].length) {
            meetLength = false;
            hintLength = "第" + j + "个标签不能大于" + maxLength + "个字";
        }
        hints.push({meet: meetLength, text: hintLength, value: data[i].length, title: "标签字数"});
    }
    hints.push({meet: meet, text: hint, value: data.length, title: "标签数量"});
    return hints;
};

const TagPickerModuleHint = (data, props) => {//TagPicker
    let hint = undefined;
    let meet = true;
    let min = props.min;
    let max = props.max;
    data = data ? data : [];
    if (min && min > data.length) {
        meet = false;
        hint = "不能少于" + min + "个分类";
    } else if (max && max < data.length) {
        meet = false;
        hint = "不能大于" + max + "个分类";
    }
    return [{meet: meet, text: hint, value: data.length, title: "标签数量"}];
};

const EditModuleHint = (data, props) => {//Editor

    let d = data ? data.entityMap : {};
    let arr = [];
    for (let i in d) {
        if (d[i].type == "SIDEBARSEARCHITEM") {
            arr.push(d[i]);
        }
    }
    let hints = [];

    let min = props.min;
    let max = props.max;

    let hint = undefined;
    let meet = true;
    if (min && min > arr.length) {
        meet = false;
        hint = "不能少于" + min + "个商品";
    } else if (max && max < arr.length) {
        meet = false;
        hint = "不能大于" + max + "个商品";
    }
    hints.push({meet: meet, text: hint, value: arr.length, title: "商品数量"});

    let shopNum = {};
    const editTitleMaxLength = props.editTitleMaxLength;
    const editTitleMinLength = props.editTitleMinLength;
    const ItemDescribeMax = props.ItemDescMaxLength;
    const ItemDescribeMin = props.ItemDescMinLength;
    for (let i in arr) {
        let s = Number(i) + 1;
        let titleMeet = true;
        let titleHint = undefined;
        let title = arr[i].data.title;
        if (editTitleMinLength && editTitleMinLength > title.length) {
            titleMeet = false;
            titleHint = "不能少于" + editTitleMinLength + "个字";
        } else if (editTitleMaxLength && editTitleMaxLength < title.length) {
            titleMeet = false;
            titleHint = "不能大于" + editTitleMaxLength + "个字";
        }

        hints.push({
            meet: titleMeet,
            text: titleHint,
            value: title.length,
            title: "第" + s + "个产品标题"
        });


        let descriptionMeet = true;
        let descriptionHint = undefined;
        let description = arr[i].data.description;
        description = description ? description : "";
        if (ItemDescribeMin && ItemDescribeMin > description.length) {
            descriptionMeet = false;
            descriptionHint = "不能少于" + ItemDescribeMin + "个字";
        } else if (ItemDescribeMax && ItemDescribeMax < description.length) {
            descriptionMeet = false;
            descriptionHint = "不能大于" + ItemDescribeMax + "个字";
        }

        hints.push({
            meet: descriptionMeet,
            text: descriptionHint,
            value: description.length,
            title: "第" + s + "个产品描述"
        });


        let nick = arr[i].data.nick;
        shopNum[nick] = shopNum[nick] ? (shopNum[nick] + 1) : 1;
    }
    let shopI = 0;
    for (let i in shopNum) {
        let shopMaxItemMeet = true;
        let shopMaxItemHint = undefined;
        let shopMaxItem = props.shopMaxItem;
        if (shopNum[i]) {
            shopI++;
        }
        if (shopNum[i] && shopNum[i] > shopMaxItem) {
            shopMaxItemMeet = false;
            shopMaxItemHint = "单店商品不能多于" + shopMaxItem + "个";
        }
        hints.push({meet: shopMaxItemMeet, text: shopMaxItemHint, value: shopNum[i], title: i});
    }
    let minShopMeet = true;
    let minShopHint = undefined;
    if (props.minShopItem && shopI < props.minShopItem) {
        minShopMeet = false;
        minShopHint = "最少不能小于" + props.minShopItem;
    } else if (props.maxShopItem && shopI > props.maxShopItem) {
        minShopMeet = false;
        minShopHint = "最多不能大于" + props.maxShopItem;
    }
    hints.push({
        meet: minShopMeet,
        text: minShopHint,
        value: Object.getOwnPropertyNames(shopNum).length,
        title: "店铺数"
    });

    if (props.isAddShop) {

    }

    return hints;
};
const StructCanvasModuleHint = (data, props) => {//StructCanvas
    let hint = [];
    for (let ind in data) {
        hint = hint.concat(StructCanvasEdit.hint(data[ind], props, ind));
    }
    return hint;
};

const hintShow = (props, arr) => {//提示
    if (props.hint && props.hint.length > 0) {
        for (let i = 0; i < props.hint.length; i++) {
            let item = props.hint[i];
            let obj = {type: 'text', value: item.title + "!" + item.value + item.text};
            if (!item.meet) {
                obj.color = 'ff6d6d';
                arr.push(obj);
            } else if (props.meetIsShow) {
                obj.color = '42d885';
                arr.push(obj);
            }
        }
    }
};

const wordZH = (showContent, callback) => {
    let [array, nameList, constraint] = [[], [], {}];
    let contentData = showContent.contentData;
    let contentMode = showContent.contentMode.constraint;
    if (contentMode.v == 2) {
        nameList = contentMode.nameList;
        constraint = contentMode.constraint;
    } else {
        nameList = contentMode;
    }
    (nameList ? nameList : []).map((items, j) => {
        let item;
        if (contentMode.v == 2) {
            item = constraint[items.name];
        } else {
            item = items;
        }
        let data = contentData[item.name] ? contentData[item.name].value : undefined;
        switch (item.type) {//输入框
            case "Input":
                array.push({type: 'text', row: 0, col: 0, value: item.title, align: 'center'});
                array.push({type: 'text', row: 1, col: 0, value: data});
                array.push({type: 'text', value: ''});
                hintShow({hint: StringModuleHint(data, item.props)}, array);
                break;
            case "CreatorAddItem"://添加商品
                array.push({type: 'text', row: 0, col: 0, value: item.title, align: 'center'});
                (data ? data : []).map((item, i) => {
                    array.push({type: 'image', row: 1, col: 0, value: item.coverUrl});
                    array.push({type: 'text', row: 1, col: 0, value: "https://detail.tmall.com/item.htm?id=" + item.itemId});
                    array.push({type: 'text', row: 1, col: 0, value: item.title});
                    if (item.extraBanners) {
                        array.push({type: 'text', row: 1, col: 0, value: i == 0 ? "下列补充图" : ""});
                        (item.extraBanners ? item.extraBanners : []).map((it, t) => {
                            array.push({type: 'image', row: 1, col: 0, value: it});
                        });
                    }
                });
                array.push({type: 'text', value: ''});
                hintShow({hint: ItemModuleHint(data, item.props)}, array);
                break;
            case "AnchorImageList":
                array.push({type: 'text', row: 0, col: 0, value: item.title, align: 'center'});
                (data ? data : []).map((item, i) => {
                    array.push({type: 'image', row: 1, col: 0, value: item.url});
                    item.anchors.map((anchors, a) => {
                        array.push({type: 'text', row: 1, col: 0, value: anchors.data.title});
                        array.push({type: 'text', row: 1, col: 0, value: anchors.data.url});
                    })
                });
                array.push({type: 'text', value: ''});
                hintShow({hint: AnchorImageListModuleHint(data, item.props)}, array);
                break;
            case "CreatorAddImage":
                array.push({type: 'text', row: 0, col: 0, value: item.title, align: 'center'});
                (data ? data : []).map((item, i) => {
                    array.push({type: 'image', row: 1, col: 0, value: typeof item == "object" ? item.url : item});
                });
                array.push({type: 'text', value: ''});
                hintShow({hint: ImgModuleHint(data, item.props)}, array);
                break;
            case "AddTag":
                array.push({type: 'text', row: 0, col: 0, value: item.title, align: 'center'});
                (data ? data : []).map((item, i) => {
                    array.push({type: 'text', row: 1, col: 0, value: item});
                });
                array.push({type: 'text', value: ''});
                hintShow({hint: AddTagModuleHint(data, item.props)}, array);
                break;
            case "AddLink":
                array.push({type: 'text', row: 0, col: 0, value: item.title, align: 'center'});
                (data ? data : []).map((item, i) => {
                    array.push({type: 'text', row: 1, col: 0, value: item.text});
                    array.push({type: 'text', row: 1, col: 0, value: item.link});
                });
                array.push({type: 'text', value: ''});
                break;
            case "TagPicker":
                const chosen = (allValue) => {
                    let chosen = [];
                    data = data ? data : [];
                    for (let i in allValue) {
                        let nc = allValue[i];
                        for (let z = 0; z < nc.length; z++) {
                            for (let j in data) {
                                if (data[j] == nc[z].value) {
                                    chosen.push(nc[z].label);
                                }
                            }
                        }
                    }
                    return chosen;
                };
                array.push({type: 'text', row: 0, col: 0, value: item.title, align: 'center'});
                chosen(item.props.dataSource).map((item, i) => {
                    array.push({type: 'text', row: 1, col: 0, value: item});
                });
                array.push({type: 'text', value: ''});
                hintShow({hint: TagPickerModuleHint(data, item.props)}, array);
                break;
            case "Editor"://帖子编辑器
                array.push({type: 'text', row: 0, col: 0, value: item.title, align: 'center'});
                let [entityMap, blocks] = [data.entityMap, data.blocks];
                for (let b in blocks) {
                    let block = blocks[b];
                    if(block.type==="alignLeft"){
                        array.push({type: 'text', value: block.text});
                    }else if (block.type === 'unstyled') {
                        array.push({type: 'text', value: block.text});
                    }else if(block.type ==='alignCenter'){
                        array.push({type: 'text', row: 0, col: 0, value: block.text, align: 'center'});
                    }else if (block.type === 'atomic') {
                        let entityRange = block.entityRanges[0];
                        for (let e in entityMap) {
                            let entityObj = entityMap[e];
                            if (entityRange.key == e) {
                                let entityData = entityObj.data;
                                if (entityObj.type === 'SIDEBARSEARCHITEM') {//商品
                                    let imageEditorItemurl = entityData.coverUrl;//商品图片
                                    if (imageEditorItemurl) {
                                        array.push({type: 'image', value: imageEditorItemurl});//商品图片
                                        array.push({type: 'text', value: 'https://detail.tmall.com/item.htm?id=' + entityData.itemId});
                                        array.push({type: 'text', value: entityData.title});//商品标题
                                        if (entityData.description) {
                                            array.push({type: 'text', value: entityData.description});//商品描述
                                        }
                                    }
                                } else if (entityObj.type === 'SIDEBARIMAGE') {//图片
                                    if (entityData.url) {
                                        array.push({type: 'image', value: entityData.url});
                                    }
                                } else if (entityObj.type === 'SIDEBARHOTSPACEIMAGE') {//热区图
                                    if (entityData.url) {
                                        array.push({type: 'image', value: entityData.url});
                                        if (entityData.hotSpaces) {
                                            let hotSpaces = entityData.hotSpaces;
                                            for (let h in hotSpaces) {//图片中的商品
                                                if (hotSpaces[h].data.title) {
                                                    array.push({type: 'text', value: hotSpaces[h].data.title});
                                                    array.push({type: 'image', value: hotSpaces[h].data.coverUrl});
                                                } else {
                                                    array.push({type: 'text', value: '链接：' + h + hotSpaces[h].data.url});
                                                }

                                            }
                                        }
                                    }
                                } else if (entityObj.type === 'SIDEBARADDSHOP') {//店铺
                                    let shopTitle = entityData.title;//店铺名
                                    if (shopTitle) {
                                        array.push({type: 'text', value: shopTitle});
                                    }
                                } else if (entityObj.type === 'SIDEBARADDSPU') {//产品
                                    let imageSUPUrl = entityData.coverUrl;
                                    if (imageSUPUrl) {
                                        array.push({type: 'image', value: imageSUPUrl});
                                        if (entityData.title) {
                                            array.push({type: 'text', value: entityData.title});//产品名
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                array.push({type: 'text', value: ''});
                hintShow({hint: EditModuleHint(data, item.props)}, array);
                break;
            case "StructCanvas":
                let props = item.props;
                array.push({type: 'text', row: 0, col: 0, value: '正文', align: 'center'});
                (data ? data : []).map((item, d) => {
                    switch (item.name) {
                        case "single-item-inventory":
                            let ui = item.moduleInfo.dataSchema['ui:order'];
                            let properties = item.moduleInfo.dataSchema.properties;
                            (ui ? ui : []).map((it, t) => {
                                let s = properties[it];
                                switch (s.type) {
                                    case "string":
                                        if (it === 'topNum') {
                                            array.push({type: 'text', value: 'top' + item.data[it], align: 'center'});
                                            array.push({type: 'text', value: '————', align: 'center'});
                                        } else if (it === "title") {
                                            array.push({type: 'text', value: item.data[it], align: 'center'});
                                        } else {
                                            array.push({type: 'text', value: item.data[it]});
                                        }
                                        break;
                                    case "array":
                                        (item.data[it] ? item.data[it] : []).map((da, a) => {
                                            array.push({type: 'image', value: da.item_pic});
                                            array.push({type: 'text', value: 'https://detail.tmall.com/item.htm?id=' + da.item_numiid});
                                        });
                                        break;
                                }
                            });
                            hintShow({hint: StructCanvasModuleHint(data, props)}, array);
                            break;
                        case "single-item-rank":
                            let u = item.moduleInfo.dataSchema['ui:order'];
                            let pro = item.moduleInfo.dataSchema.properties;
                            (u ? u : []).map((it, t) => {
                                let s = pro[it];
                                switch (s.type) {
                                    case "string":
                                        if (it === 'topNum') {
                                            array.push({type: 'text', value: 'top' + item.data[it], align: 'center'});
                                            array.push({type: 'text', value: '————', align: 'center'});
                                        } else if (it === "title") {
                                            array.push({type: 'text', value: item.data[it], align: 'center'});
                                        } else {
                                            array.push({type: 'text', value: item.data[it]});
                                        }
                                        break;
                                    case "array":
                                        (item.data[it] ? item.data[it] : []).map((da, a) => {
                                            array.push({type: 'image', value: da.item_pic});
                                            array.push({type: 'text', value: 'https://detail.tmall.com/item.htm?id=' + da.item_numiid});
                                        });
                                        break;
                                }
                            });
                            hintShow({hint: StructCanvasModuleHint(data, props)}, array);
                            break;
                        case "picture":
                            let images = item.data.images;
                            array.push({type: 'image', value: images[0].picUrl});
                            break;
                        case "shop-inventory-separator":
                            array.push({type: 'text', value: 'top' + item.data.topNum, align: 'center'});
                            array.push({type: 'text', value: '————', align: 'center'});
                            array.push({type: 'text', value: 'top' + item.data.title, align: 'center'});
                            break;
                        case "two-column-items":
                            (item.data.items ? item.data.items : []).map((shop, s) => {
                                array.push({type: 'image', value: shop.item_pic});
                                array.push({type: 'text', value: shop.item ? shop.item.detailUrl : ''});
                                array.push({type: 'text', value: shop.item_title});
                                array.push({type: 'text', value: '￥' + shop.item ? shop.item.price ? shop.item.price : shop.itemPriceDTO.price.item_price : "暂无"});
                            });
                            break;
                        case "weitao-item-pk":
                            (item.data.items ? item.data.items : []).map((shop, s) => {
                                array.push({type: 'image', value: shop.item_pic});
                                array.push({type: 'text', value: shop.item ? shop.item.detailUrl : ''});
                                array.push({type: 'text', value: shop.item_title});
                                array.push({type: 'text', value: '￥' + shop.item ? shop.item.price ? shop.item.price : shop.itemPriceDTO.price.item_price : "暂无"});
                                if (s == 0) {
                                    array.push({type: 'text', value: 'pk', align: 'center'});
                                }
                            });
                            break;
                        case"weitao-ver-items":
                            (item.data.products ? item.data.products : []).map((shop, s) => {
                                array.push({type: 'image', value: shop.item_pic});
                                array.push({type: 'text', value: shop.item_title});
                                array.push({type: 'text', value: '￥' + shop.item ? shop.item.price : shop.itemPriceDTO.price.item_price});
                            });
                            break;
                        case"weitao-score-range":
                            item.data.scores.map((shop, s) => {
                                array.push({type: 'text', value: shop.item_title + ':' + shop.item_score + '分'});
                            });
                            break;
                        case"ceping-separator1":
                        case"ceping-separator2":
                        case"ceping-separator3":
                            let obj = {
                                "ceping-separator1": {top: "01", title: "评测选品"},
                                "ceping-separator2": {top: "02", title: "评测维度"},
                                "ceping-separator3": {top: "03", title: "评测结果"}
                            };
                            array.push({type: 'text', value: obj[item.name].top, align: 'center'});
                            array.push({type: 'text', value: '————', align: 'center'});
                            array.push({type: 'text', value: obj[item.name].title, align: 'center'});
                            break;
                        case "content-shop":
                            (item.data.shopDetail ? item.data.shopDetail : []).map((shop, s) => {
                                array.push({type: 'image', value: shop.shop_logo});
                                array.push({type: 'text', value: shop.shop_title});
                                array.push({type: 'text', value: shop.shop_desc});
                            });
                            break;
                        case "paragraph":
                            array.push({type: 'text', value: item.data.text});
                            break;
                        case "item-paragraph":
                            array.push({type: 'text', value: item.data.title, align: 'center'});
                            array.push({type: 'text', value: '————— ○ —————', align: 'center'});
                            array.push({type: 'text', value: item.data.desc});
                            (item.data.images ? item.data.images : []).map((item, i) => {
                                array.push({type: 'image', value: item.picUrl});
                            });
                            break;
                        case "item-paragraph-select":
                            array.push({type: 'text', value: item.data.title, align: 'center'});
                            array.push({type: 'text', value: '————— ○ —————', align: 'center'});
                            array.push({type: 'text', value: item.data.desc});
                            (item.data.images ? item.data.images : []).map((item, i) => {
                                array.push({type: 'image', value: item.picUrl});
                            });
                            break;
                        case "item-feature":
                            (item.data.features ? item.data.features : []).map((item, i) => {
                                array.push({type: 'text', value: '○' + item})
                            });
                            break;
                        case "need-content-bpu":
                            let items = item.data;
                            array.push({type: 'text', value: 'top' + (items.topNum > 9 ? items.topNum : "0" + items.topNum) + items.title});
                            array.push({type: 'text', value: '上榜理由：' + items.description});
                            array.push({type: 'text', value: items.item[0].itemBrand ? "|" + items.item[0].itemBrand.brandName : ""});
                            array.push({type: 'image', value: items.item[0].spu_pic});
                            items.rates.map((shop, s) => {
                                array.push({type: 'text', value: shop.rateTitle + ':' + shop.rateScore + '分'})
                            });
                            break;
                        case "calendar-header-card"://每日神店头部
                            let cardData = item.data;
                            array.push({type: 'image', value: cardData.backgroundImg[0].picUrl});
                            array.push({type: 'text', value: cardData.labelTitle});
                            array.push({type: 'text', value: '掌柜吆喝'});
                            array.push({type: 'image', value: 'https://gw.alicdn.com/tfs/TB1E5BNpMmTBuNjy1XbXXaMrVXa-26-24.png_110x10000.jpg'});
                            array.push({type: 'image', value: 'https://gw.alicdn.com/tfs/TB1l9wQqgmTBuNjy1XbXXaMrVXa-37-28.png_110x10000.jpg'});
                            array.push({type: 'text', value: cardData.title});
                            array.push({type: 'image', value: 'https://gw.alicdn.com/tfs/TB16HrgnXuWBuNjSspnXXX1NVXa-62-56.png_110x10000.jpg'});
                            array.push({type: 'text', value: cardData.shopDetail[0].shop_title + '|' + cardData.tag});
                            array.push({type: 'image', value: cardData.firstGoods[0].item_pic});
                            array.push({type: 'text', value: cardData.summary});
                            array.push({type: 'image', value: 'creationShop'});
                            break;
                        case "goodshop-shendian-shop"://每日神店
                            let shendianData = item.data;
                            array.push({type: 'image', value: 'shop1'});
                            array.push({type: 'image', value: shendianData.shop_cover[0].picUrl});
                            array.push({type: 'text', value: '掌柜吆喝'});
                            array.push({type: 'image', value: 'https://gw.alicdn.com/tfs/TB1E5BNpMmTBuNjy1XbXXaMrVXa-26-24.png_110x10000.jpg'});
                            array.push({type: 'image', value: 'https://gw.alicdn.com/tfs/TB1l9wQqgmTBuNjy1XbXXaMrVXa-37-28.png_110x10000.jpg'});
                            array.push({type: 'text', value: shendianData.shop_desc});
                            array.push({type: 'text', value: shendianData.shop_tag});
                            array.push({type: 'image', value: shendianData.shopDetail[0].shop_title});
                            array.push({type: 'image', value: 'shop2'});
                            break;
                    }
                });
                break;
        }
    });
    if (callback) {
        callback(array);
    }
};
export {wordZH};
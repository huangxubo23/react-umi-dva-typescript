/**
 * Created by 林辉 on 2018/9/4 15:32.渠道转换
 */
import {ThousandsOfCall} from "../../lib/util/ThousandsOfCall";
import {clone, deepCopy} from "../../lib/util/global";

const newModel = () => {//存储模板转达人模板

};


const oldModelV1andUrlToV2 = (oldContentModel, data, talentId) => {//旧模板v1加淘宝模板生成新模板v2
    let dt = {
        agreement: "https",
        hostname: "cpub.taobao.com",
        path: '/render.json',
        method: "get",
        data: data,
        talentId: talentId,
        referer: "https://we.taobao.com/",
    };
    ThousandsOfCall.acoustic(dt, 'requestRelyAgentTB', (ctr) => {
        if (ctr.success) {
            let res = JSON.parse(ctr.data);
            if (res.status === 'success') {
                let children = res.config.children;//淘宝模板
                let constraint = oldContentModel.constraint;//旧模板
                return v1ToV2(children, constraint);
            }
        }
    });
};

function v1ToV2(newChildren, Oldconstraint) {//旧模板加淘宝模板生成新模板
    let [objConstraint, model] = [{}, ''];
    for (let t = 0; t < Oldconstraint.length; t++) {
        let ct = Oldconstraint[t];
        objConstraint[ct.name] = {};
        objConstraint[ct.name] = ct;
    }
    taoTov2({children: newChildren}, (newContentModel) => {
        let constraint = newContentModel.constraint;
        let myProps = cMyProps(objConstraint, constraint);
        for (let m in myProps) {
            let d = myProps[m];
            d.myProps = d.props;
            delete  d.props;
            myProps[m] = d;
            constraint[m] = Object.assign(d, constraint[m]);
        }
        newContentModel.constraint = constraint;
        newContentModel.v = 2;

        model = newContentModel;
    });
    return model;
}

let kb = [
    "max", "min", "title", "rows", "maxLength", "minLength", "placeholder",
    "addonAfter", "brandTitle", "brandLogoName", "brandIntroductionName",
    "editTitleMaxLength", "editTitleMinLength", "minShop", "shopMaxItem", "tips",
    "selectedImgPoint", "name", "selectedImgNumber", "selectedImgPoint2",
    "titlePoint", "isRowHeay", "isDesc", "editDescMaxLength", "editDescMinLength",
    "activityId", "categoryListApiQuery", "isCoverImg", "isTitle", "creatorAddImageW",
    "creatorAddImageH", "maxAnchors", "minAnchors", "titleMaxLength",
    "titleMinLength", "anchorImageListW", "anchorImageListH", "isAddShop",
    "itemDescribe", "plugins", "commodityPool", "choiceItemPool", "isAddItem",
    "maxShopItem", "minShopItem", "maxHotSpaces", "minSpaces", "arrCoverImageField",
    "maxItems", "minItems", "previousData", "moduleInfos", "value", "materialId",
    "moduleInfo", "dataSchema", "sidebarBlockList", "itemMaxNum", "shopMinNum",
    "topLockIndex", "arrayCreatorAddImage"

];

function cMyProps(objConstraint, newContentModel) {//旧模板减新模板
    let myProps = {};
    if (!newContentModel) return objConstraint;
    if (typeof objConstraint == "object") {
        if (!Array.isArray(objConstraint)) {
            for (let i in objConstraint) {
                let prop = cMyProps(objConstraint[i], newContentModel[i]);
                if (prop) {
                    if (typeof prop == "object" || kb.indexOf(i) >= 0) {
                        myProps[i] = prop;
                    }
                }
            }
            if (Object.keys(myProps).length) {
                return myProps;
            }
        } else {
            return undefined;
        }
    } else {
        return objConstraint != newContentModel ? objConstraint : undefined;
    }

}


const oldModel = (data, callback) => {//达人模板转v1
    let [children, model] = [data.children, []];

    for (let i in children) {
        let data = {};
        if (children[i].component) {//模板类型
            data.type = children[i].component;
        }
        if (children[i].label) {//标题
            data.title = children[i].label
        }
        if (children[i].name) {//name
            data.name = children[i].name;
        }
        if (children[i].props) {//约束
            data.props = children[i].props;
        }
        if (children[i].updateOnChange) {//是否需要更新模板
            data.updateOnChange = children[i].updateOnChange;
        }
        model.push(data);
    }
    if (callback) {
        callback(model);
    }

};


const taoTov2 = (data, callback) => {//达人模板转换后台v2模板
    let [children] = [data.children];
    let newModel = {nameList: [], constraint: {}};
    for (let i in children) {
        let data = {};
        /* if (children[i].component) {//模板类型
      data.type = children[i].component;
  }
  if (children[i].name){//name
      data.name =children[i].name;
  }
  if (children[i].props) {//约束
      data.props =children[i].props;
  }
    if (children[i].updateOnChange) {//是否需要更新模板
      data.updateOnChange =children[i].updateOnChange;
  }
  */
        if (children[i].label) {//标题
            data.title = children[i].label
        } else {
            let item = children[i];
            if (item.name === 'body') {
                data.title = '主体';
            } else if (item.name === 'subTitle') {
                data.title = '子标题'
            } else if (item.name === 'bodyStruct') {
                data.title = '主体'
            } else if (item.name === 'itemSpuOption') {
                data.title = '商品||SPU'
            } else if (item.name === 'summary') {
                data.title = '描述'
            } else if (item.name === 'standardCoverUrl') {
                data.title = '封面图'
            } else if (item.name === 'forward') {
                data.title = '引导叙述'
            }
        }

        newModel.nameList.push({name: children[i].name, defuleShow: true, isShow: true});
        newModel.constraint[children[i].name] = {};
        newModel.constraint[children[i].name].type = children[i].component;
        newModel.constraint[children[i].name].name = children[i].name;
        newModel.constraint[children[i].name].props = children[i].props;
        if (children[i].updateOnChange) {
            newModel.constraint[children[i].name].updateOnChange = children[i].updateOnChange;
        }
        newModel.constraint[children[i].name].title = data.title;


//        model.push(data);
    }
    newModel.v = 2;
    if (callback) {
        callback(newModel);
    }
};


const myPropsAndPropsfusion = (constraint) => {//融合myProps与props
    for (let ct in constraint) {
        let myProps = constraint[ct].myProps ? constraint[ct].myProps : {};
        let props = constraint[ct].props;
        constraint[ct].props = fusionMyprops(props, myProps);
    }
    return constraint;
};


function fusionMyprops(props, myProps) {
    if (!props) {
        return myProps;
    }

    if (typeof myProps == 'object') {
        for (let i in myProps) {
            if (i.indexOf("if ") == 0) {
                let ifsp = i.split("if ")[1];
                let name = ifsp.split('=')[0];
                let value = ifsp.split('=')[1];
                for (let p in props) {
                    if (props[p][name] == value) {
                        let newProps = fusionMyprops(props[p], clone(myProps[i]));
                        props[p] = newProps;
                    }
                }
            } else {
                let newProps = fusionMyprops(props[i], clone(myProps[i]));
                props[i] = newProps;
            }
        }
        return props;
    } else {
        if (myProps) {
            return myProps;
        } else {
            return props
        }
    }


}


const FusionModel = (children, oldContentMode) => {//融合淘宝模板与v2模板形成v2模板
    let findModel = '';
    taoTov2({children: children}, (newContentMode) => {
        let [nameListN, nameListO] = [newContentMode.nameList, oldContentMode.nameList];
        let [newConstraint, oldConstraint] = [newContentMode.constraint, oldContentMode.constraint];
        let nameListR = fusionNameList(nameListN, nameListO);
        if (nameListR <= 0) {
            nameListR = nameListO;
        }
        let constraintR = fusionConstraint(newConstraint, oldConstraint);
        newContentMode.nameList = nameListR;
        newContentMode.constraint = constraintR;
        newContentMode.v = 2;
        findModel = newContentMode;
    });
    return findModel;
};


function fusionConstraint(newConstraint, oldConstraint) {//融合约束

    oldConstraint = oldConstraint ? oldConstraint : {};
    for (let i in newConstraint) {
        oldConstraint[i] = fusion(newConstraint[i], oldConstraint[i])
    }
    return oldConstraint;
}


function fusion(newConstraint, oldConstraint) {//融合
    oldConstraint = oldConstraint ? oldConstraint : {};
    for (let i in newConstraint) {
        oldConstraint[i] = newConstraint[i];
    }
    return oldConstraint;
}


function fusionNameList(newModelName, oldModelName) {//融合NameList
    let njd = 0;
    for (let i in oldModelName) {
        let om = oldModelName[i];
        let c = false;
        for (let j in newModelName) {
            if (om.name == newModelName[j].name) {
                njd = j + 1;
                c = true;
                newModelName[j] = om;
                newModelName[j].isShow = true;
                break
            }
        }
        if (!c) {
            om.isShow = false;
            oldModelName.splice(njd, 0, om);
        }

        return newModelName;
    }
}


function modelDataConversion(constraint, name, props) {//模板数据转换
    for (let i in constraint) {
        let cm = constraint[i];
        if (constraint[i].type === 'StructCanvas') {

        } else if (cm.name === name) {
            return cm;
        }
    }
}

const typeJudgment = (template, type) => {//类型判断
    if (template === 'list') {
        type = 2;
    } else if (template === 'post' || template === 'qa' || template === 'struct' || template === 'itemrank' || template === 'iteminventory' || template === 'shopinventory' || template === 'evaluation') {
        type = 1;
    } else if (template === 'item' || template === 'item2' || template === 'yhhatlas') {
        type = 3;
    } else if (template === 'collection' || template === 'collection2' || template === 'magiccollocation') {
        type = 4;
        // } else if () {
        //     type = 7;
    } else if ( template === 'video'||template.indexOf('video')>-1) {
        type = 8;
    } else {
        type = 9
    }
    return type;
};
export {
    newModel,
    oldModel,
    typeJudgment,
    FusionModel,
    oldModelV1andUrlToV2,
    v1ToV2,
    taoTov2,
    myPropsAndPropsfusion,
    fusionConstraint
};
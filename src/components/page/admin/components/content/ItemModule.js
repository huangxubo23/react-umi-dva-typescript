/**
 * Created by shiying on 17-7-27.
 */

import React from 'react';
import {Layout, Alert,Button} from 'element-react';
import 'element-theme-default';
import $ from 'jquery';
import HintShow from './Hint';
import '../../../../../styles/addList/content.css';
import {BundleLoading} from '../../../../../bundle';
import UpItem from 'bundle-loader?lazy&name=pc/trends_asset/components/lib/sharing/upload/upItem/app-[name]!../../../../../components/lib/sharing/upload/UpItem';
import ReactDOM from 'react-dom';
require("../../../../../components/lib/util/jquery-ui.min");

class ItemModule extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        this.transposition();
    }

    componentDidUpdate() {
        this.transposition();
        let {value}=this.props;
        if(value) {
            value.forEach((item,index)=>{
                $(`.baby-${index}`).hover(()=>{
                    $(`.baby-z${index}`).css({"display":"inline"});
                },()=>{
                    $(`.baby-z${index}`).css("display","none");
                });
            })
        }
    }

    showAddItem = () => {
        const callback = (item, spareImg, spareImg2) => {
            let constraint = this.props.constraint;
            let selectedImgPoint = constraint.props.selectedImgPoint;
            let selectedImgPoint2 = constraint.props.selectedImgPoint2;
            let titlePoint = constraint.props.titlePoint;
            this.props.dataAdditionalChange(titlePoint, item.title);
            if (spareImg) {
                for (let i in spareImg) {
                    this.props.dataAdditionalChange(selectedImgPoint, spareImg[i]);
                }
            }
            if (spareImg2) {
                for (let i in spareImg2) {
                    this.props.dataAdditionalChange(selectedImgPoint2, spareImg2[i]);
                }
            }

            let data = this.props.value;
            data = data ? data : [];
            data.push(item);
            let hint = ItemModule.hint(data, this.props.constraint.props);
            this.props.onChange(this.props.constraint, data, hint);
        };
        this.setState({callback: callback}, () => {
            this.upItemBundleLoading();
        });

    };

    delAddItem = ({i}) => {
        let data = this.props.value;
        data.splice(i, 1);
        let hint = ItemModule.hint(data, this.props.constraint.props);
        this.props.onChange(this.props.constraint, data, hint);
    };

    editItem = ({i}) => {
        let data = this.props.value;
        const callback = (item, spareImg, spareImg2) => {
            let constraint = this.props.constraint;
            let selectedImgPoint = constraint.props.selectedImgPoint;
            let selectedImgPoint2 = constraint.props.selectedImgPoint2;
            let titlePoint = constraint.props.titlePoint;
            this.props.dataAdditionalChange(titlePoint, item.title);

            if (spareImg) {
                for (let i in spareImg) {
                    this.props.dataAdditionalChange(selectedImgPoint, spareImg[i]);
                }
            }
            if (spareImg2) {
                for (let i in spareImg2) {
                    this.props.dataAdditionalChange(selectedImgPoint2, spareImg2[i]);
                }
            }
            let data = this.props.value;
            data = data ? data : [];
            data.splice(i, 1, item);
            let hint = ItemModule.hint(data, this.props.constraint.props);
            this.props.onChange(this.props.constraint, data, hint);
        };
        this.setState({callback: callback}, () => {
            this.upItemBundleLoading(data[i]);
        });
    };


    static hint = (data, props) => {
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
                hints.push({meet: descMeet, text: descHint, value: description.length, title: "第" + t + "个商品描述"});
            }

            hints.push({meet: titleMeet, text: titleHint, value: title.length, title: "第" + t + "个商品标题"});

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

    transposition = () => {
        $(ReactDOM.findDOMNode(this)).find("#sortableId").sortable().disableSelection().unbind("sortstop").on("sortstop", (event, ui) => {
            let items = ui.item;
            let index = items.data("i");
            let w = items.width() + 30;
            let h = items.height() + 30;
            let top = ui.position.top;//当前的位置
            let left = ui.position.left;
            let originalTop = ui.originalPosition.top;//元素的原始位置
            let originalLeft = ui.originalPosition.left;
            let paW = $("#sortableId").width();
            let lineNum = Math.round(paW / w);
            let sl = Math.round((left - originalLeft) / w);
            sl += Math.round((top - originalTop) / h) * lineNum;

            let data = this.props.value;
            let albIt = data[index];
            data.splice(index, 1);
            data.splice(index + sl, 0, albIt);
            let hint = [];
            this.props.onChange(this.props.constraint, data, hint);
        });
    };

    selectionChange = () => {
        if (this.state.upItemFlag && this.addItemModal&&this.addItemModal.jd) {
            this.addItemModal.jd.selectionChange();
        } else {
            this.setState({upItemFlag: true}, () => {
                let upload = setInterval(() => {
                    let upItem = this.addItemModal;
                    if (upItem && upItem.jd) {
                        clearInterval(upload);
                        this.addItemModal.jd.selectionChange();
                    }
                }, 100);
            });
        }
    };

    upItemBundleLoading = (data) => {//添加商品热加载
        if (this.state.upItemFlag && this.addItemModal&&this.addItemModal.jd) {
            this.addItemModal.jd.open(data);
        } else {
            this.setState({upItemFlag: true}, () => {
                let upload = setInterval(() => {
                    let upItem = this.addItemModal;
                    if (upItem && upItem.jd) {
                        clearInterval(upload);
                        this.addItemModal.jd.open(data);
                    }
                }, 100);
            });
        }
    };

    render() {
        let {constraint,hint,value} = this.props;
        return (
            <Layout.Row gutter="20" style={{margin: "8px 0"}}>
                <Layout.Col style={{fontWeight: 'bold'}} span="2">
                    {constraint.title?constraint.title:'主体'}
                </Layout.Col>
                <Layout.Col span="22">
                    <Layout.Row gutter="10">
                        {(value ? value.length : 0) < (constraint.props.max ? constraint.props.max : 80) ?
                            <Layout.Col span='8' className="itemM_pic">
                                <img src="https://img.alicdn.com/imgextra/i1/772901506/TB2oeLpihhmpuFjSZFyXXcLdFXa_!!772901506.jpg"
                                    onClick={this.showAddItem}/>
                            </Layout.Col> : ""}
                        <div id="sortableId">
                            {(value ? value : []).map((item, index) => {
                                return (
                                    <div className={`el-col el-col-8 baby-${index}`} key={+new Date() + index}  data-i={index} style={{position:'relative'}}>
                                        <div style={{position:'absolute',bottom:0,width:'100%',display:'none',marginRight:'10px'}}
                                             className={`baby-z${index}`}>
                                            <Layout.Row>
                                                <Layout.Col span="12">
                                                    <Button className="el-icon-edit" style={{width: '100%'}} type="primary" size="mini"
                                                            onClick={()=>this.editItem({i:index})}>编辑</Button>
                                                </Layout.Col>
                                                <Layout.Col span="12">
                                                    <Button className="el-icon-delete" style={{width: '100%'}} type="danger" size="mini"
                                                            onClick={()=>this.delAddItem({i:index})}>删除</Button>
                                                </Layout.Col>
                                            </Layout.Row>
                                        </div>
                                        <img src={item.coverUrl} width="100%" data-i={index} onClick={()=>this.editItem({i:index})}/>
                                    </div>
                                );
                            })}
                        </div>
                    </Layout.Row>
                    <span className="imgHint">{constraint.props.tips}</span>
                    {constraint.props.activityId == 414 && !constraint.props.isRowHeay ?
                        <Alert type="danger" closable={false} title={<span>检测到您当前发布的有好货没有设置排重，您可以到<a
                            href="https://www.52wzg.com/pc/admin/content/content_template" target="_blank">模版设置</a>里面设置</span>}/> : ''}
                    <HintShow hint={hint}/>
                </Layout.Col>
                {this.state.upItemFlag && <BundleLoading ref={e => this.addItemModal = e} load={UpItem} minTitle={constraint.props.editTitleMinLength}
                               maxTitle={constraint.props.editTitleMaxLength} description={constraint.props.isDesc}
                               selectedImgPoint={constraint.props.selectedImgPoint} selectedImgPoint2={constraint.props.selectedImgPoint2}
                               maxDescription={constraint.props.editDescMaxLength} titlePoint={constraint.props.titlePoint}
                               minDescription={constraint.props.editDescMinLength} isRowHeay={constraint.props.isRowHeay}
                               selectedImgNumber={constraint.props.selectedImgNumber ? constraint.props.selectedImgNumber : 0}
                               callback={this.state.callback} data={value} categoryListApiQuery={constraint.props.categoryListApiQuery}
                               activityId={constraint.props.activityId} choiceItemPool={constraint.props.choiceItemPool == undefined ? true : false}
                               enableExtraBanner={constraint.props.enableExtraBanner ? true : false}/>}
            </Layout.Row>
        );
    }
}

export default ItemModule;

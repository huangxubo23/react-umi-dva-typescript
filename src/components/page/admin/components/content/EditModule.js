/**
 * Created by shiying on 17-7-28.
 */
import React from 'react';
import {Layout} from 'element-react';
import 'element-theme-default';
import UpImages from 'bundle-loader?lazy&name=pc/trends_asset/components/lib/sharing/upload/upImages/app-[name]!../../../../../components/lib/sharing/upload/UpImages';
import {getManage} from '../../../../../components/lib/util/global';
import HintShow from "./Hint";
import '../../../../../styles/addList/content.css';
import EditBox from '../../../../../components/lib/sharing/editBox/EditBox';
//import BountyTaskList from '../../page/bountyTask/components/bountyTaskList';
import $ from 'jquery';

class EditModule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            falot: false,
            flag: false,
            currentLogin: '',
            LeftOffset: 0,
            wf: true,
        }
    }

    static hint = (data, props) => {
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
            if(nick){
                shopNum[nick] = shopNum[nick] ? (shopNum[nick] + 1) : 1;
            }
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

    onChange = (content) => {
        let hint = EditModule.hint(content, this.props.constraint.props);
        this.props.onChange(this.props.constraint, content, hint);
    };

    setEditBoxContent = (contetn) => {
        if (contetn) {
            this.refs.editBox.setContent(contetn);
        }
    };

    componentDidUpdate() {
        let {wf} = this.state;
        if (wf) {
            let w = $(".fu .col-sm-4").width();
            if (w < 460) {
                let c_w = 460 - w;
                this.setState({LeftOffset: c_w, wf: false});
            } else {
                this.setState({LeftOffset: 0, wf: false});
            }
        }

    }

    componentDidMount() {
        window.onresize = () => {
            let w = $(".fu .col-sm-4").width();
            if (w < 460) {
                let c_w = 460 - w;
                this.setState({LeftOffset: c_w});
            } else {
                this.setState({LeftOffset: 0});
            }
        };

        getManage((data) => {
            this.setState({currentLogin: data});
        });
    };

    selectionChange = () => {
        this.refs.editBox.selectionChange();
    };

    templateName=(name)=>{
        let object={};
        if(name==='SIDEBARIMAGE'){
            Object.assign(object,{imgDisabled:true})
        }else if(name==='SIDEBARHOTSPACEIMAGE'){
            Object.assign(object,{hotImgDisabled:true})
        }else if(name==='SIDEBARSEARCHITEM'){
            Object.assign(object,{itemDisabled:true})
        }else if(name==='SIDEBARADDSHOP'){
            Object.assign(object,{shopDisabled:true})
        }else if(name==='SIDEBARADDSPU'){
            Object.assign(object,{SPUDisabled:true})
        }else if(name==='NUMBER'){
            Object.assign(object,{numberDisabled:true})
        }
        return object;
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
        let {currentLogin} = this.state;
        let permissions = currentLogin ? currentLogin.loginManage.permissions : '';
        let {constraint,value,talentMessageIds,channel,hint} = this.props;
        let data = value ? value.entityMap : {},valueArray = [],parameters={};
        for (let i in data) {
            valueArray.push(data[i]);
        }
        let plugins = constraint ? constraint.props.plugins : undefined;
        plugins.forEach(item=>{
            if(item instanceof Object){
                Object.assign(parameters,this.templateName(item.name))
            }else {
                Object.assign(parameters,this.templateName(item))
            }
        });
        return (
            <div className="addContentComponent">
                {currentLogin && <Layout.Row gutter="6">
                    <Layout.Col  span="2">
                        帖子编辑框
                    </Layout.Col>
                    <Layout.Col span="22">
                        <div style={{width: "500px", minHeight: "745px"}}>
                            <div id="editBoxPaId" className="editBoxPa">
                                <EditBox ref="editBox" BLOCK_TYPES_HEADER={false} BLOCK_TYPES_CODE={false}
                                         constraint={constraint} talentMessageIds={talentMessageIds}
                                         onChange={this.onChange} isFloat={true} data={valueArray} {...parameters}/>
                            </div>
                            <span className="imgHint">{constraint.props.tips ? constraint.props.tips.replace("https://daren.bbs.taobao.com/detail.html", "") : ""}</span>
                            <HintShow hint={hint}/>
                        </div>
                        {/*{(currentLogin.loginManage.grade == 0 || (permissions ? permissions.indexOf('赏金任务接单') > -1 : false)) ?
                            <div className="bountyTaskListPa">
                                <div style={{width: "100%", height: "100%", overflow: "auto"}}>
                                    <BountyTaskList col={6} currentLogin={currentLogin} channel={channel}/>
                                </div>
                            </div> : ''}*/}
                    </Layout.Col>
                </Layout.Row>}
                {this.state.upImagesFlag&&<UpImages ref={e=>this.upImages=e} pixFilter={constraint.props.pixFilter} callback={this.callback}/>}
            </div>
        );
    }
}

EditModule.defaultProps = {};

export default EditModule;

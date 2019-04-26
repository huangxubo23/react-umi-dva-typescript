/**
 * Created by shiying on 18-2-8.
 */
import '../../../../../styles/addList/content.css';

import React from 'react';
import ReactDOM from 'react-dom';
import {Layout} from 'element-react';
import 'element-theme-default';
import $ from 'jquery';
import HintShow from './Hint';
import {BundleLoading} from '../../../../../bundle';
import UpSPUItem from 'bundle-loader?lazy&name=pc/trends_asset/components/lib/sharing/upload/upSPUItem/app-[name]!../../../../../components/lib/sharing/upload/UpSPUItem'
import ItemModule from "./ItemModule";
require("../../../../lib/util/jquery-ui.min");

class SpuModule extends React.Component{
    static hint = (data=[], props) => {
        let hints = [],hint = undefined;
        let {min,max} = props.min;
        let meet = true;
        if (min && min > data.length) {
            meet = false;
            hint = "不能少于" + min + "个商品";
        } else if (max && max < data.length) {
            meet = false;
            hint = "不能大于" + max + "个商品";
        }
        return hints.push({meet: meet, text: hint, value: data.length, title: "商品数量"});
    };

    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentDidMount(){
        this.transposition();
    }
    componentDidUpdate() {
        this.transposition();
    }
    transposition=()=>{
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
    showAddSpu=()=>{
        let callback = (item) => {
            let {value=[],constraint,onChange} = this.props;
            value.push(item);
            let hint = ItemModule.hint(value, constraint.props);
            onChange(constraint, value, hint);
        };
        this.setState({callback},this.upSPUItemBundleLoading);
    };

    delAddSpu=({i})=>{
        let {value,constraint,onChange} = this.props;
        value.splice(i, 1);
        let hint = ItemModule.hint(value, constraint.props);
        onChange(constraint, data, hint);
    };
    editSpu=({i})=>{
        let callback = (item) => {
            let {value=[],constraint,onChange} = this.props;
            value.splice(i, 1, item);
            let hint = ItemModule.hint(value, constraint.props);
            onChange(constraint, data, hint);
        };
        this.setState({callback}, () => this.upSPUItemBundleLoading(this.props.value[i]));
    };
    upSPUItemBundleLoading=(data)=>{//添加产品热加载
        if (this.state.upSPUItemFlag && this.upSPUItem&&this.upSPUItem.jd) {
            this.upSPUItem.jd.open(data);
        } else {
            this.setState({upSPUItemFlag: true}, () => {
                let upload = setInterval(() => {
                    let upSPUItem = this.upSPUItem;
                    if (upSPUItem && upSPUItem.jd) {
                        clearInterval(upload);
                        this.upSPUItem.jd.open(data);
                    }
                }, 100);
            });
        }
    };

    render(){
        let {constraint,value=[],hint=[]}=this.props,{upSPUItemFlag,callback}=this.state;
        let {max}=constraint.props;
        return(
            <div>
                <Layout.Row gutter="20" style={{margin:"6px 0"}}>
                    <Layout.Col span="2">
                        {constraint.title}
                    </Layout.Col>
                    <Layout.Col span="22">
                        <Layout.Row gutter="2">
                            {value.length < (max ? max : 10)&&
                                <Layout.Col span="8" className="itemM_pic">
                                    <img src="https://img.alicdn.com/imgextra/i1/772901506/TB2oeLpihhmpuFjSZFyXXcLdFXa_!!772901506.jpg"
                                         onClick={this.showAddSpu}/>
                                </Layout.Col>}
                            {(value?value:[]).map((item,index)=>{
                                return(
                                    <Layout.Col className="listItem" span="8" key={item.coverUrl}>
                                        <img src={item.coverUrl} onClick={()=>this.editSpu({i:index})} width="100%"/>
                                        <div className="del" onClick={()=>this.delAddSpu({i:index})}>
                                            删除
                                        </div>
                                    </Layout.Col>
                                )
                            })}
                        </Layout.Row>
                        <HintShow hint={hint}/>
                    </Layout.Col>
                </Layout.Row>
                {upSPUItemFlag&&<BundleLoading load={UpSPUItem} ref={e=>this.upSPUItem=e} constraint={constraint.props} callback={callback}/>}
            </div>
        )
    }
}

export default SpuModule;

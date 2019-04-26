/**
 * Created by shiying on 17-7-28.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {BundleLoading} from '../../../../../bundle';
import UpImages from 'bundle-loader?lazy&name=pc/trends_asset/components/lib/sharing/upload/upImages/app-[name]!../../../../../components/lib/sharing/upload/UpImages';
import Cropper from 'bundle-loader?lazy&name=pc/trends_asset/components/lib/sharing/upload/cropper/app-[name]!../../../../../components/lib/sharing/upload/Cropper';
import HintShow from "./Hint";
import '../../../../../styles/addList/content.css';
import {Layout} from 'element-react';
import 'element-theme-default';
require("../../../../../components/lib/util/jquery-ui.min");

class ImgModule extends React.Component {//first drag and drop problem

    static hint = (data=[], props) => {
        let hints = [],hint = undefined,titleMeet = true;
        let {min,max} = props;
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

    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentDidMount(){
        this.sort();
    }
    componentDidUpdate() {
        this.sort();
    }
    sort=()=>{
        $(ReactDOM.findDOMNode(this)).find("#sortable").sortable().disableSelection().unbind("sortstop").on("sortstop", (event, ui) => {
            let items = ui.item;
            let index = items.data("i");
            let w = items.width() + 30;
            let h = items.height() + 30;
            let top = ui.position.top;//当前的位置
            let left = ui.position.left;
            let originalTop = ui.originalPosition.top;//元素的原始位置
            let originalLeft = ui.originalPosition.left;
            let paW = $("#sortable").width();
            let lineNum = Math.round(paW / w);
            let sl = Math.round((left - originalLeft) / w);
            sl += Math.round((top - originalTop) / h) * lineNum;

            let {value,constraint,onChange} = this.props;
            let albIt = value[index];
            value.splice(index, 1);
            value.splice(index + sl, 0, albIt);
            onChange(constraint, value, []);
        });
    };

    addCover = () => {
        this.upImagesBundleLoading();
        //this.upImages.open();
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

    shearCallback = (url, pa, img) => {
        let {value=[],constraint,onChange} = this.props;
        value.push(img);
        let hint = ImgModule.hint(value, constraint.props);
        onChange(constraint, value, hint);
    };

    callback = (url, pa, img) => {
        let {pixFilter} = this.props.constraint.props;
        let arr = pixFilter ? [parseInt(pixFilter.split("x")[0]),parseInt(pixFilter.split("x")[1])] : [0, 0];
        let g = url.substr(url.length - 3);
        if (g == "gif") {
            this.shearCallback(url, pa, img);
        } else {
            if (((arr[0] && arr[1]) ? arr[0] / arr[1] == pa.w / pa.h : true) && (arr[0] ? arr[0] <= pa.w : true) && (arr[1] ? arr[1] <= pa.h:true)){
                this.shearCallback(url, pa, img)
            } else {
                this.cropperBundleLoading(url, pa, img);
                //this.cropper.open(url, pa, img);
            }
        }
    };

    delAddItem = ({index}) => {
        let {value,constraint,onChange} = this.props;
        value.splice(index, 1);
        let hint = ImgModule.hint(value, constraint.props);
        onChange(constraint, value, hint);
    };
    cropperBundleLoading=(url,wh,data)=>{//裁图片热加载
        if (this.state.cropperFlag && this.cropper&&this.cropper.jd) {
            this.cropper.jd.open(url,wh,data);
        } else {
            this.setState({cropperFlag: true}, () => {
                let upload = setInterval(() => {
                    let cropper = this.cropper;
                    if (cropper && cropper.jd) {
                        clearInterval(upload);
                        this.cropper.jd.open(url,wh,data);
                    }
                }, 100);
            });
        }
    };

    render() {
        let {constraint, value=[], hint} = this.props;
        let {max=10, tips, pixFilter} = constraint.props;
        return (
            <div>
            <Layout.Row gutter="20" style={{margin:"8px 0"}}>
                <Layout.Col span="2" style={{fontWeight: 'bold'}}>
                    {constraint.title?constraint.title:<br/>}
                </Layout.Col>
                <Layout.Col span="22">
                    <Layout.Row gutter="10">
                        {((value ? value.length : 0) < max) &&
                        <Layout.Col span="8" className="itemM_pic">
                            <img src="https://img.alicdn.com/imgextra/i1/772901506/TB2oeLpihhmpuFjSZFyXXcLdFXa_!!772901506.jpg"
                                 onClick={this.addCover}/>
                        </Layout.Col>}
                        <div id="sortable">
                            {value.map((img, z) => {
                                return (
                                    <div key={(typeof img === "object" ? img.url : img) + z} data-i={z}
                                         className="el-col el-col-8 listItem" style={{position: 'relative',paddingLeft: '5px', paddingRight: '5px'}}>
                                        <img src={typeof img === "object" ? img.url : img} width="100%"/>
                                        <div className="del" onClick={()=>this.delAddItem({index:z})} style={{left: '5px',right: '5px'}}>
                                            删除
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </Layout.Row>
                    <span className="imgHint">{tips && tips.replace("https://daren.bbs.taobao.com/detail.html", "")}</span>
                    <HintShow hint={hint}/>
                </Layout.Col>
            </Layout.Row>
                {this.state.upImagesFlag&&<BundleLoading load={UpImages} ref={e=>this.upImages=e} pixFilter={pixFilter} callback={this.callback}/>}
                {this.state.cropperFlag&&<BundleLoading load={Cropper} ref={e=>this.cropper=e} pixFilter={pixFilter} callbacks={this.shearCallback}/>}
            </div>
        )
    }
}

export default ImgModule;

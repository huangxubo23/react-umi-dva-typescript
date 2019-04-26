/**
 * Created by shiying on 17-7-28.
 */
import React from 'react';
import $ from 'jquery';
import {NewAddImageListModal, ImgListMain, NewImgListMain} from "./AddImageListModal/NewAddImageListModal"
import AnchorPointCollocation from "./AddImageListModal/AnchorPointCollocationModal"
import HintShow from './Hint';
import '../../../../../styles/addList/content.css';
import Menu from "../AdminMenu";
import BountyTaskList from '../../page/bountyTask/components/bountyTaskList';
import {Layout} from 'element-react';
import 'element-theme-default';

class AnchorImageListModule extends React.Component {

    static hint = (data = [], props) => {
        let hints = [], hint = undefined;
        let {min, max, maxAnchors, minAnchors, titleMaxLength, titleMinLength} = props;
        let meet = true;
        if (min && min > data.length) {
            meet = false;
            hint = `不能少于${min}张图片`;
        } else if (max && max < data.length) {
            meet = false;
            hint = `不能大于${max}张图片`;
        }
        hints.push({meet: meet, text: hint, value: data.length, title: "搭配图数量"});
        for (let i in data) {
            let hint = undefined, meet = true;
            let {anchors} = data[i];
            if (!anchors) anchors = [];
            if (minAnchors && minAnchors > anchors.length) {
                meet = false;
                hint = `不能少于${minAnchors}个锚点`;
            } else if (maxAnchors && maxAnchors < anchors.length) {
                meet = false;
                hint = `不能大于${maxAnchors}个锚点`;
            }
            for (let j in anchors) {
                let anchorMeet = true, anchorHint = undefined;
                let {title, rawTitle} = anchors[j].data;
                if (titleMinLength && titleMinLength > (title ? title.length : (rawTitle?rawTitle.length:0))) {
                    anchorMeet = false;
                    anchorHint = `不能少于${titleMinLength}个字`;
                } else if (titleMaxLength && titleMaxLength < (title ? title.length : (rawTitle?rawTitle.length:0))) {
                    anchorMeet = false;
                    anchorHint = `不能大于${titleMaxLength}个字`;
                }
                hints.push({
                    meet: anchorMeet,
                    text: anchorHint,
                    value: (title ? title.length : rawTitle.length),
                    title: `第${parseInt(i) + 1}张搭配图,第${parseInt(j) + 1}个锚点`
                });
            }
            hints.push({meet: meet, text: hint, value: anchors.length, title: `第${parseInt(i) + 1}张搭配图`});
        }
        return hints;
    };

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount(){
        this.sort();
    }
    componentDidUpdate() {
        this.sort();
    }
    sort=()=>{
        $(ReactDOM.findDOMNode(this)).find("#sortTable").sortable().disableSelection().unbind("sortstop").on("sortstop", (event, ui) => {
            let items = ui.item;
            let index = items.data("i");
            let h = items.height() + 30;
            let top = ui.position.top;//当前的位置
            let originalTop = ui.originalPosition.top;//元素的原始位置
            let sl = Math.round((top - originalTop) / h);
            let {value,constraint,onChange} = this.props;
            let albIt = value[index];
            value.splice(index, 1);
            let newPosition=(index + sl)<0?0:(index + sl);
            value.splice(newPosition, 0, albIt);
            onChange(constraint, value, []);
        });
    };

    addAnchorImage = () => {//添加
        let {constraint} = this.props;
        let addAnchorImageCallback = (item) => {
            let {value = [], constraint, onChange} = this.props;
            value.push(item);
            this.propsValueChange({value, constraint, onChange});
        };
        this.setState({callback: addAnchorImageCallback}, () => {
            if (constraint.props.type) {
                this.newAddImageListModal.open();
            } else {
                this.anchorPointCollocationModal.open({type:'add'});
            }
        });
    };

    delAddItem = (index) => {//删除
        let {value, constraint, onChange} = this.props;
        value.splice(index, 1);
        this.propsValueChange({value, constraint, onChange});
    };

    editImagesList = ({index, data}) => {//编辑
        let {constraint} = this.props;
        let editAnchorImageCallback = (imgList) => {
            let {value, constraint, onChange} = this.props;
            value[index] = imgList;
            this.propsValueChange({value, constraint, onChange});
        };
        this.setState({callback: editAnchorImageCallback}, () => {
            if (constraint.props.type && data[index].pushItem) {
                this.newAddImageListModal.open(data[index]);
            } else {
                this.anchorPointCollocationModal.open({type:'edit',data:data[index]});
            }
        });
    };

    propsValueChange = ({value, constraint, onChange}) => {//data to father module
        if (constraint.props.url) {
            onChange(constraint, value);
        } else {
            let hint = AnchorImageListModule.hint(value, constraint.props);
            onChange(constraint, value, hint);
        }
    };

    selectionChange = () => {
        //this.addImageListModal.selectionChange();
    };

    render() {
        let {constraint, value = [], hint, channel} = this.props;
        let {callback} = this.state;
        let {url, max, tips, addImageProps, titleMaxLength, titleMinLength, type} = constraint.props;
        let currentLogin = Menu.isLogin();
        let permissions = currentLogin ? currentLogin.loginManage.permissions : '';
        return (
            <Layout.Row gutter="20" style={{margin: "8px 0"}}>
                <Layout.Col span="2" style={{fontWeight: 'bold'}}>
                    {constraint.title}
                </Layout.Col>
                <Layout.Col span="22" style={{position: 'relative'}}>
                    <div style={{width: "500px"}}>
                        <Layout.Row gutter="10">
                            {((value ? value.length : 0) < max) &&
                            <Layout.Col span="16" className="itemM_pic">
                                <img
                                    src="https://img.alicdn.com/imgextra/i1/772901506/TB2oeLpihhmpuFjSZFyXXcLdFXa_!!772901506.jpg"
                                    onClick={this.addAnchorImage}/>
                            </Layout.Col>}
                            <div id="sortTable">
                                {value.map((item, z) => {
                                    if(item){
                                        if (item.pushItem) {
                                            let {url, anchors} = item.pushItem;
                                            return (
                                                <div key={z} className="el-col el-col-24 listItem" data-i={z}
                                                     style={{
                                                         position: 'relative',
                                                         paddingLeft: '5px',
                                                         paddingRight: '5px'
                                                     }}>
                                                    <NewImgListMain url={url} anchors={anchors}
                                                                    layers={item.retainItem.layers}
                                                                    addAnchors={() => this.editImagesList({
                                                                        index: z,
                                                                        data: value
                                                                    })}/>
                                                    <div className="del" onClick={() => this.delAddItem(z)}
                                                         style={{left: '5px', right: '5px'}}>
                                                        删除
                                                    </div>
                                                </div>
                                            )
                                        } else {
                                            return (
                                                <div key={item.url + z} className="el-col el-col-18 listItem" data-i={z}
                                                     style={{
                                                         position: 'relative',
                                                         paddingLeft: '5px',
                                                         paddingRight: '5px'
                                                     }}>
                                                    <ImgListMain url={item.url} anchors={item.anchors}
                                                                 addAnchors={() => this.editImagesList({
                                                                     index: z,
                                                                     data: value
                                                                 })}/>
                                                    <div className="del" onClick={() => this.delAddItem(z)}
                                                         style={{left: '5px', right: '5px'}}>
                                                        删除
                                                    </div>
                                                </div>
                                            )
                                        }
                                    }
                                })}
                            </div>
                        </Layout.Row>
                        <span className="imgHint">{tips}</span>
                        <HintShow hint={hint}/>
                        <NewAddImageListModal ref={e => this.newAddImageListModal = e}
                                              pixFilter={addImageProps.pixFilter}
                                              titleMaxLength={titleMaxLength} titleMinLength={titleMinLength}
                                              type={type} callback={callback}
                                              activityId={url ? url.split("=")[1] : ""}/>
                        <AnchorPointCollocation ref={e => this.anchorPointCollocationModal = e} pixFilter={addImageProps.pixFilter}
                                           titleMaxLength={titleMaxLength} titleMinLength={titleMinLength}
                                           type={type} callback={callback} activityId={url ? url.split("=")[1] : ""}/>
                    </div>
                    {/*{(currentLogin && currentLogin.loginManage.grade == 0 || (permissions ? permissions.indexOf('赏金任务接单') > -1 : false)) &&
                    <div className="bountyTaskListPa" style={{left: '520px'}}>
                        <div style={{width: "100%", height: "100%", overflow: "auto"}}>
                            <BountyTaskList col={6} currentLogin={currentLogin} channel={channel}/>
                        </div>
                    </div>}*/}
                </Layout.Col>
            </Layout.Row>
        );

    }
}

export default AnchorImageListModule;

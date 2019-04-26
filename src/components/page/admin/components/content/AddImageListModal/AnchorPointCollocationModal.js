/**
 * Created by 石英 on 2018/11/30 0030下午 3:13.
 */

import React from 'react';
import $ from 'jquery';
//import  {Image} from 'react-bootstrap';
import {Layout, Input, Button, Upload,Dialog,Notification,Alert} from 'element-react';
import 'element-theme-default';
import UpImages from 'bundle-loader?lazy&name=pc/trends_asset/components/lib/sharing/upload/upImages/app-[name]!../../../../../lib/sharing/upload/UpImages';
import UpItem from 'bundle-loader?lazy&name=pc/trends_asset/components/lib/sharing/upload/upItem/app-[name]!../../../../../lib/sharing/upload/UpItem';
import {BundleLoading} from '../../../../../../bundle';
import '../../../../../../styles/content/addContentModule/dapModule.css';

class AnchorsPointCollocationModel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogVisible: false,
            url:'',
            anchors:[],
            nowEdit: undefined,
            nowEditData:{
                title: "",
                url: "",
            },
        }
    }

    open=({type,data})=>{
        if(type==='add'){
            this.setState({
                dialogVisible: true,
                url:'',
                anchors:[],
                nowEdit: undefined,
                nowEditData:{
                    title: "",
                    url: "",
                },
            })
        }else if(type==='edit'){
            this.setState({
                dialogVisible: true,
                url:data.url,
                anchors:data.anchors,
                nowEdit: undefined,
                nowEditData:{
                    title: "",
                    url: "",
                },
            })
        }
    };

    close=()=>{
        this.setState({dialogVisible: false})
    };

    upFile = () => {//添加图片
        let {pixFilter}=this.props;
        this.setState({callback: (url,pix) => {
            let arr=pixFilter.split('x');
            if(pix.w>=parseInt(arr[0])&&pix.h>=parseInt(arr[1])){
                this.setState({url})
            }else {
                Notification({
                    title: '警告',
                    message: `图片不能小于${pixFilter}`,
                    type: 'warning'
                });
            }
        }},this.upImageBundleLoading);
    };

    upImageBundleLoading = () => {//添加图片热加载
        if (this.state.upImagesFlag) {
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

    upItemBundleLoading = (data) => {//添加商品热加载
        if (this.state.upItemFlag) {
            this.upItem.jd.open(data);
        } else {
            this.setState({upItemFlag: true}, () => {
                let upload = setInterval(() => {
                    let upItem = this.upIitem;
                    if (upItem && upItem.jd) {
                        clearInterval(upload);
                        this.upItem.jd.open(data);
                    }
                }, 100);
            });
        }
    };

    addAnchors = (env) => {
        let {nowEdit}=this.state;
        if(!(nowEdit>=0)){
            let e = env || window.env;
            let dian_x = e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
            let dian_y = e.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
            let imgListCover = $(env.target);
            let img_x = imgListCover.offset().left;
            let img_y = imgListCover.offset().top;
            dian_x = dian_x - img_x;
            dian_y = dian_y - img_y;
            dian_x = Math.round(dian_x / imgListCover.width() * 100);
            dian_y = Math.round(dian_y / imgListCover.height() * 100);
            let {anchors} = this.state,defaultData={title: "", url: ""};
            anchors.push({x: dian_x, y: dian_y, type: "item", data: {title: "", url: ""}});
            this.setState({anchors: anchors, nowEdit: anchors.length - 1,nowEditData:defaultData});
        }else {
            Notification({
                title: '警告',
                message: '当前正在编辑锚点，请确定修改后再添加新锚点！',
                type: 'warning'
            });
        }
    };

    addItemData=()=>{//添加宝贝
        let callback = (data) => {
            let {nowEditData}=this.state;
            Object.assign(nowEditData,{
                coverUrl: data.coverUrl,
                finalPricePc: 0,
                finalPriceWap: 0,
                images: data.images,
                itemId: data.itemId,
                materialId: data.materialId,
                price: data.price,
                rawTitle: data.title,
                resourceUrl: data.resourceUrl,
                url: data.resourceUrl,
                detailUrl: data.detailUrl,
            });
            this.setState({nowEditData});
        };
        this.setState({callback: callback}, () => {
            this.upItemBundleLoading();
        });
    };

    editItemData=()=>{
        let callback = (data) => {
            let {nowEditData}=this.state;
            Object.assign(nowEditData,{
                coverUrl: data.coverUrl,
                finalPricePc: 0,
                finalPriceWap: 0,
                images: data.images,
                itemId: data.itemId,
                materialId: data.materialId,
                price: data.price,
                rawTitle: data.title,
                title: nowEditData.title,
                resourceUrl: data.resourceUrl,
                url: data.resourceUrl,
                detailUrl: data.detailUrl,
            });
            this.setState({nowEditData});
        };
        this.setState({callback: callback}, () => {
            let {nowEditData} = this.state;
            nowEditData.title = nowEditData.rawTitle;
            this.upItemBundleLoading(nowEditData);
        });
    };

    delItemData=()=>{
        let {nowEditData}=this.state;
        let defaultData={title: nowEditData.title, url: ""};
        this.setState({nowEditData: defaultData});
    };

    submitEdit = () => {//锚点修改
        let {anchors,nowEdit,nowEditData} = this.state,defaultData={title: "", url: ""};
        if(!nowEditData.url){
            Notification({
                title: '警告',
                message: '宝贝不能为空！',
                type: 'warning'
            });
            return false;
        }
        if(!nowEditData.title){
            Notification({
                title: '警告',
                message: '宝贝标签不能为空！',
                type: 'warning'
            });
            return false;
        }
        anchors[nowEdit].data = nowEditData;
        this.setState({
            anchors: anchors,
            nowEdit: undefined,
            nowEditData:defaultData
        });
    };

    cancelEdit = () => {//锚点取消修改
        let defaultData={title: "", url: ""};
        this.setState({
            nowEdit: undefined,
            nowEditData:defaultData
        });
    };

    delNowEdit = () => {//锚点删除
        let {anchors,nowEdit} = this.state,defaultData={title: "", url: ""};
        anchors.splice(nowEdit, 1);
        this.setState({
            anchors: anchors,
            nowEdit: undefined,
            nowEditData:defaultData
        });
    };

    submit=()=>{//提交
        let {url,anchors,nowEdit}=this.state;
        if(nowEdit>=0){
            Notification({
                title: '警告',
                message: '数据添加不完整，请补全！(编辑商品请确定修改)',
                type: 'warning'
            });
            return false;
        }
        this.setState({dialogVisible:false},()=>{
            this.props.callback({url:url, anchors: anchors});
        })
    };

    selectDian = (env) => {
        let i = $(env.target).data("i");
        let data = this.state.anchors[i].data;
        this.setState({
            nowEdit: i,
            nowEditData:{...data},
        })
    };

    titleChange=(value)=>{
        let {nowEditData}=this.state;
        nowEditData.title=value;
        this.setState({nowEditData})
    };

    render(){
        let {dialogVisible,url,anchors,upImagesFlag,upItemFlag,callback,nowEditData,nowEdit}=this.state,
            {pixFilter,categoryListApiQuery,activityId,titleMaxLength,titleMinLength}=this.props;
        return(
            <div className='imageList'>
                <Dialog title="锚点搭配编辑器" size="small" visible={dialogVisible} onCancel={this.close} lockScroll={false} closeOnClickModal={false}>
                    <Dialog.Body>
                        <Layout.Row gutter="10">
                            <Layout.Col span='12'>
                                {url? <ImgListMain url={url} anchors={anchors} addAnchors={this.addAnchors} selectDian={this.selectDian}/> :
                                    <img src="http://img.alicdn.com/imgextra/i3/772901506/TB2wVGudpXXXXclXXXXXXXXXXXX_!!772901506-2-tae.png"
                                        onClick={this.upFile} style={{width:'100%'}}/>}
                            </Layout.Col>
                            <Layout.Col span='12'>
                                <Button onClick={this.upFile} style={{width:'100%',margin:'5px 0'}} type="primary">{url?'更换图片':'上传图片'}</Button>
                                {(url&&anchors.length<1)&& <Alert title={`提示!点击图片可以添加锚点`} type="info"  style={{marginBottom:'5px'}}/>}
                                {nowEdit >= 0 && <div>
                                        <Layout.Row gutter="5">
                                            <Layout.Col span='6' style={{fontWeight: 'bold'}}>
                                                添加商品
                                            </Layout.Col>
                                            <Layout.Col span='18'>
                                                    <Layout.Row gutter="4" className="matop">
                                                        {!nowEditData.url?
                                                        <Layout.Col span='12'>
                                                            <img src="https://img.alicdn.com/imgextra/i1/772901506/TB2oeLpihhmpuFjSZFyXXcLdFXa_!!772901506.jpg"
                                                                 onClick={this.addItemData} style={{border: '1px solid #aeb9c5'}}/>
                                                        </Layout.Col>:
                                                        <Layout.Col span='12' className="listItem">
                                                            <img src={nowEditData.coverUrl} onClick={this.editItemData} width="100%"/>
                                                            <div className="del" onClick={this.delItemData}>删除</div>
                                                        </Layout.Col>}
                                                    </Layout.Row>
                                            </Layout.Col>
                                        </Layout.Row>
                                        <Layout.Row gutter="5" style={{marginTop:'10px'}}>
                                            <Layout.Col span='6' style={{fontWeight: 'bold'}}>
                                                宝贝标签
                                            </Layout.Col>
                                            <Layout.Col span='18'>
                                                <Input placeholder="请输入" onChange={this.titleChange} value={nowEditData.title} append={nowEditData.title.length + (titleMinLength ? ("/" + titleMinLength) : "/0")+(titleMaxLength ? ("/" + titleMaxLength) : "/0")} />
                                            </Layout.Col>
                                        </Layout.Row>
                                        <Button.Group style={{marginTop:'10px'}}>
                                            <Button type="success" onClick={this.submitEdit}>修改</Button>
                                            {/*<Button type="warning" onClick={this.cancelEdit}>取消</Button>*/}
                                            <Button type="danger" onClick={this.delNowEdit}>删除此条</Button>
                                        </Button.Group>
                                    </div>}
                            </Layout.Col>
                        </Layout.Row>
                        <Layout.Row gutter="2" style={{marginTop:'10px'}}>
                            <Layout.Col span='12'>
                                <Button type="danger" onClick={this.close} style={{width:'100%'}}>取消</Button>
                            </Layout.Col>
                            <Layout.Col span='12'>
                                <Button type="info" onClick={this.submit} style={{width:'100%'}} disabled={!url}>确定</Button>
                            </Layout.Col>
                        </Layout.Row>
                    </Dialog.Body>
                </Dialog>
                {upImagesFlag && <BundleLoading load={UpImages} ref={e => this.upImages = e} pixFilter={pixFilter} callback={callback}/>}
                {upItemFlag && <BundleLoading load={UpItem} ref={e => this.upItem = e} categoryListApiQuery={categoryListApiQuery}
                                              activityId={activityId} callback={callback}/>}
            </div>
        )
    }
}

function ImgListMain(props) {
    return <div className="imgListCoverPa">
        {/*<Image width={"100%"} data-i={props.data_i} rounded className="imgListCover"
               src={props.url}
               onClick={props.addAnchors} />*/}
        <img width={"100%"}  src={props.url} onClick={props.addAnchors}/>
        {props.anchors.map((item, i) => {
            return (<div className="anchorsDian" key={i} data-i={i} onClick={props.selectDian}
                         style={{top: item.y + "%", left: item.x + "%"}}>
                <div className="anchorsDianTitle" data-i={i}>
                    <p data-i={i}><a target="_blank" href={item.data.url}> {item.data.title || item.data.rawTitle}</a></p>
                </div>
            </div>);
        })}
    </div>
}

export default AnchorsPointCollocationModel;
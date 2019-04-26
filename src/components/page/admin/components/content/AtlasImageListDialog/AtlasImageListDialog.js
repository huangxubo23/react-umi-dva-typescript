/**
 * Created by 石英 on 2018/12/22 0022下午 2:48.
 */
import React from 'react';
import {Layout,Dialog,Form,Select,Input,Button,Notification} from 'element-react';
import 'element-theme-default';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {BundleLoading} from '../../../../../../bundle';
import UpImages from 'bundle-loader?lazy&name=pc/trends_asset/components/lib/sharing/upload/upImages/app-[name]!../../../../../../components/lib/sharing/upload/UpImages';
import Cropper from 'bundle-loader?lazy&name=pc/trends_asset/components/lib/sharing/upload/cropper/app-[name]!../../../../../../components/lib/sharing/upload/Cropper';

class AtlasImageListDialog extends React.Component{
    constructor(props){
        super(props);
        this.state={
            dialogVisible: false,
            data:{
                desc:'',
                picTab:'',
                url:[]
            },
            manualTitle:'',
            source:[],
            type:'add',
            timeStamp:''
        }
    }

    open=({type,data})=>{
        if(type==='add'){
            this.setState({dialogVisible:true,type:'add'});
        }else if(type==='edit'){
            this.setState({
                dialogVisible:true,
                data:{
                    desc:data.desc,
                    picTab:data.isOther?'其它':data.resourceFeatures.picTab,
                    url:data.url,
                },
                manualTitle:data.isOther?data.resourceFeatures.picTab:'',
                source:data.dataSource,
                type:'edit',
                timeStamp:data.resourceFeatures.atlasIndex
            });
        }
    };

    close=(callback)=>{
        this.setState({
            dialogVisible: false,
            data:{
                desc:'',
                picTab:'',
                url:[]
            },
            manualTitle:'',
            source:[],
            type:'add',
            timeStamp:''
        },()=>{
            if(callback&& typeof callback==='function'){
                callback();
            }
        })
    };

    onChange(key, value) {
        this.setState({
            data: Object.assign(this.state.data,{[key]: value})
        });
    }

    manualTitleChange=(value)=>{
        this.setState({manualTitle:value});
    };

    addUrl = () => {
        this.upImagesBundleLoading();
    };

    upImagesBundleLoading=()=>{//添加图片热加载
        if (this.state.upImagesFlag && this.upImages) {
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

    callback = (url, pa, img) => {
        let {pixFilter} = this.props.constraint.props.addImageProps;
        let arr = pixFilter ? [parseInt(pixFilter.split("x")[0]),parseInt(pixFilter.split("x")[1])] : [0, 0];
        if(pa.w>=arr[0]&&pa.h>=arr[1]){
            let g = url.substr(url.length - 3);
            if (g == "gif") {
                this.shearCallback(url, pa, img);
            } else {
                if (((arr[0] && arr[1]) ? arr[0] / arr[1] == pa.w / pa.h : true) && (arr[0] ? arr[0] <= pa.w : true) && (arr[1] ? arr[1] <= pa.h:true)){
                    this.shearCallback(url, pa, img)
                } else {
                    this.cropperBundleLoading(url, pa, img);
                }
            }
        }else {
            Notification({
                title: '警告',
                message: `图片不得小于${pixFilter}`,
                type: 'warning'
            });
        }
    };

    cropperBundleLoading=(url,wh,data)=>{//裁图片热加载
        if (this.state.cropperFlag && this.cropper) {
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

    shearCallback = (url, pa, img) => {
        let nowUrl=this.state.data.url;
        nowUrl.push(url);
        this.onChange('url',nowUrl);
    };

    delUrl=({index})=>{
        let nowUrl=this.state.data.url;
        nowUrl.splice(index,1);
        this.onChange('url',nowUrl)
    };

    submit=()=>{
        let {data,manualTitle,source,type,timeStamp}=this.state;
        let {constraint}=this.props;
        let {dataSource}=constraint.props;
        let newDataSource=dataSource?JSON.parse(dataSource):[];
        let picTab=data.picTab=='其它'?manualTitle:data.picTab;
        let newTimeStamp=new Date().getTime();
        if(picTab&&data.url.length>0&&data.desc){
            let subData={
                anchors: [],
                desc: data.desc,
                hotSpaces: [],
                materialId: "",
                resourceFeatures: {
                    atlasIndex: timeStamp?timeStamp:`${newTimeStamp}`,
                    picTab: picTab
                },
                dataSource:type==='edit'?source:newDataSource,
                isOther:data.picTab=='其它',
                url: data.url
            };
            this.close(()=>{
                this.props.callback(subData);
            })
        }else {
            Notification({
                title: '警告',
                message: '数据不完整，请补齐后提交！',
                type: 'warning'
            });
        }
    };

    componentDidMount(){
        this.sort();
    }
    componentDidUpdate() {
        this.sort();
    }
    sort=()=>{
        $(ReactDOM.findDOMNode(this)).find("#atlasImgSortable").sortable().disableSelection().unbind("sortstop").on("sortstop", (event, ui) => {
            let items = ui.item;
            let index = items.data("i");
            let w = items.width() + 10;
            let h = items.height() + 10;
            let top = ui.position.top;//当前的位置
            let left = ui.position.left;
            let originalTop = ui.originalPosition.top;//元素的原始位置
            let originalLeft = ui.originalPosition.left;
            let paW = $("#atlasImgSortable").width();
            let lineNum = Math.round(paW / w);
            let sl = Math.round((left - originalLeft) / w);
            sl += Math.round((top - originalTop) / h) * lineNum;

            let {data} = this.state;
            let albIt = data.url[index];
            data.url.splice(index, 1);
            data.url.splice(index + sl, 0, albIt);
            this.setState({data});
        });
    };

    render(){
        let {dialogVisible,data,manualTitle,source,type}=this.state,{constraint}=this.props;
        let {dataSource,addImageProps}=constraint.props;
        let newDataSource=dataSource?JSON.parse(dataSource):[];
        let num = `${data.desc ? data.desc.length : 0}/${addImageProps.minLength ? addImageProps.minLength : 0}/${addImageProps.maxLength ? addImageProps.maxLength : 0}`;
        if(type==='edit'){
            newDataSource=source;
        }
        return (
            <div>
                <Dialog title="添加模块" size="small" visible={dialogVisible} onCancel={this.close}
                        lockScroll={false} style={{textAlign:'left'}} closeOnClickModal={false}>
                    <Dialog.Body>
                        <Layout.Row gutter="10" style={{margin:"5px 0"}}>
                            <Layout.Col span="4" style={{fontWeight: 'bold'}}>
                                选择标题
                            </Layout.Col>
                            <Layout.Col span="20">
                                <Select value={data.picTab} onChange={this.onChange.bind(this, 'picTab')}>
                                    {newDataSource.map((item)=>{
                                        return(
                                            <Select.Option label={item.label} value={item.value} key={`sou-${item.value}`} disabled={item.disabled}>

                                            </Select.Option>
                                        )
                                    })}
                                </Select>
                                <div style={{marginTop:'10px'}}> </div>
                                {data.picTab==='其它'&&<Input value={manualTitle} placeholder="请在这里输入段落标题" onChange={this.manualTitleChange} style={{width:"220px"}}/>}
                            </Layout.Col>
                        </Layout.Row>
                        <Layout.Row gutter="10" style={{margin:"5px 0"}}>
                            <Layout.Col span="4" style={{fontWeight: 'bold'}}>
                                上传图片
                            </Layout.Col>
                            <Layout.Col span="20">
                                <Layout.Row gutter="10">
                                    {data.url.length<3&&<Layout.Col span="8" className="itemM_pic">
                                        <img src="https://img.alicdn.com/imgextra/i1/772901506/TB2oeLpihhmpuFjSZFyXXcLdFXa_!!772901506.jpg"
                                             onClick={this.addUrl}/>
                                    </Layout.Col>}
                                    <div id="atlasImgSortable">
                                        {(data.url?data.url:[]).map((item,index)=>{
                                            return(
                                                <div key={`img-${item}`} className="el-col el-col-8 listItem" data-i={index}
                                                            style={{position: 'relative',paddingLeft: '5px', paddingRight: '5px'}}>
                                                    <img src={item} width="100%"/>
                                                    <div className="del" onClick={()=>this.delUrl({index})} style={{left: '5px',right: '5px'}}>
                                                        删除
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    {/*{(data.url?data.url:[]).map((item,index)=>{
                                        return(
                                            <Layout.Col key={`img${index}`} span="8" className="listItem"
                                                        style={{position: 'relative',paddingLeft: '5px', paddingRight: '5px'}}>
                                                <img src={item} width="100%"/>
                                                <div className="del" onClick={()=>this.delUrl({index})} style={{left: '5px',right: '5px'}}>
                                                    删除
                                                </div>
                                            </Layout.Col>
                                        )
                                    })}*/}
                                </Layout.Row>
                                <div>请上传1-3张图片，宽度不小于720px，大小不超过2M</div>
                            </Layout.Col>
                        </Layout.Row>
                        <Layout.Row gutter="10" style={{margin:"5px 0"}}>
                            <Layout.Col span="4" style={{fontWeight: 'bold'}}>
                                输入描述
                            </Layout.Col>
                            <Layout.Col span="20">
                                <Input type="textarea" autosize={{minRows: 3, maxRows: 6}} onChange={this.onChange.bind(this, 'desc')} value={data.desc}
                                    placeholder={`请在这里输入${addImageProps.minLength}-${addImageProps.maxLength}字关于商品的描述`}/>
                                <span style={{float: 'right', marginRight: '6px', color: '#e04444'}}> {num} </span>
                            </Layout.Col>
                        </Layout.Row>
                    </Dialog.Body>
                    <Dialog.Footer className="dialog-footer">
                        <Button onClick={this.close}>取消</Button>
                        <Button type="primary" onClick={this.submit}>确定</Button>
                    </Dialog.Footer>
                </Dialog>
                {this.state.upImagesFlag&&<BundleLoading load={UpImages} ref={e=>this.upImages=e} pixFilter={addImageProps.pixFilter} callback={this.callback}/>}
                {this.state.cropperFlag&&<BundleLoading load={Cropper} ref={e=>this.cropper=e} pixFilter={addImageProps.pixFilter} callbacks={this.shearCallback}/>}
            </div>
        )
    }
}

export default AtlasImageListDialog;
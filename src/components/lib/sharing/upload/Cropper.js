/**
 * Created by shiying on 17-8-17.
 */
import $ from 'jquery';
import React from 'react';
import {Dialog,Button,Notification} from 'element-react';
import 'element-theme-default';
import '../../../../styles/addList/content.css';
import '../../../../../node_modules/cropper/dist/cropper.css';
import 'cropper';
import {ThousandsOfCall} from "../../util/ThousandsOfCall";


class Cropper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            img: {},
            url: '',
            pa: undefined,
            zoomable: false
        };
        this.open = this._open.bind(this);
        this.close = this._close.bind(this);
    }

    cropperInstall = () => {//初始化
        let {pixFilter} = this.props,{pa,zoomable}=this.state;
        let arr = [];
        arr = pixFilter ? pixFilter.split("x") : undefined;
        if (arr && (arr[0] == 0 || arr[1] == 0)) {
            pixFilter = undefined;
        }
        if (arr && arr.length < 2) {
            pixFilter = undefined;
        }

        let bl = 1;
        let w = pa ? pa.w : 0;
        let h = pa ? pa.h : 0;

        if (w > 568 || h > 568) {
            if (parseInt(w) > parseInt(h)) {
                bl = parseInt(w) > 568 ? 568 / parseInt(w) : 1;
            } else {
                bl = parseInt(h) > 568 ? 568 / parseInt(h) : 1;
            }
        }

        let xyw = 0;
        let xyh = 0;
        if (pixFilter) {
            if (arr[0] != 0) {
                xyw = arr[0] * bl;
            }
            if (arr[1] != 0) {
                xyh = arr[1] * bl;
            }
        }

        $('#imgCropper').cropper({
            aspectRatio: pixFilter ? (arr[0] && arr[1] ? arr[0] / arr[1] : NaN) : NaN,
            autoCropArea: 1,
            viewMode: 1,
            zoomable: zoomable,//是否允许放大缩小图片
            autoCrop: true,//是否在初始化时允许自动剪裁图片
            crop: (e) => {
                let xx=Math.round(e.x / bl),yy=Math.round(e.y / bl),
                    width=Math.round(e.width / bl),height = Math.round(e.height / bl);
                let formats = {
                    x:xx>pa.w?pa.w:xx,y:yy>pa.y?pa.y:yy,width:width>pa.width?pa.width:width,height:height>pa.height?pa.height:height
                };
                let {img} = this.state;
                this.setState({img:Object.assign(img,{format:formats})});
                if($('#imgCropper').length>0){
                    let canvasData = $('#imgCropper').cropper("getCanvasData");
                    let getData = $('#imgCropper').cropper("getData");
                    if (e.x < 0) {
                        $('#imgCropper').cropper("setData", {x: 0});
                    }
                    if (e.y < 0) {
                        $('#imgCropper').cropper("setData", {y: 0});
                    }
                    if ((e.x + getData.width) > canvasData.width) {
                        $('#imgCropper').cropper("setData", {x: canvasData.width - getData.width});
                    }
                    if ((e.y + getData.height) > canvasData.height) {
                        $('#imgCropper').cropper("setData", {x: canvasData.height - getData.height});
                    }
                    if (pixFilter) {
                        if (arr[0] != 0) {
                            if (e.width < xyw) {
                                $('#imgCropper').cropper("setData", {width: xyw});
                            }
                        }
                        if (arr[1] != 0) {
                            if (e.height < xyh) {
                                $('#imgCropper').cropper("setData", {height: xyh});
                            }
                        }
                    }
                }
            },
        });
    };

    _open(url, pa, img, f) {
        let pixFilter = this.props.pixFilter;
        let arr = pixFilter ? pixFilter.split("x") : undefined;
        if (f) {//可不可以缩放
            this.setState({zoomable: true});
        } else {
            this.setState({zoomable: false});
        }
        if (pixFilter) {
            let picHeight = img.picHeight;
            let picWidth = img.picWidth;
            if ((arr[0] ? parseInt(arr[0]) <= parseInt(picWidth) : true) && (arr[1] ? parseInt(arr[1]) <= parseInt(picHeight) : true)) {
                this.setState({showModal: true, url: url, pa: pa, img: img},()=>{
                    this.cropperInstall();
                });
            } else {
                Notification.error({
                    title: '错误',
                    message: '图片大小不能小于模板制定大小'
                });
            }
        } else {
            this.setState({showModal: true, url: url, pa: pa, img: img},()=>{
                this.cropperInstall();
            });
        }
    }

    _close() {
        this.setState({showModal: false,img: {}, url: '', pa: undefined, zoomable: false});
    }

    submit = () => {
        let {img, url} = this.state;
        let {width, height, x, y} = img.format;
        ThousandsOfCall.acoustic({
            agreement: "https",
            hostname: "resource.taobao.com",
            path: "/crop/img",
            data: {
                url: url,
                w: width,
                h: height,
                x: x,
                y: y,
            },
            method: "post",
            referer: "https://we.taobao.com/publish/post"
        }, 'requestRelyTB', (msg) => {
            if (msg.success) {
                try {
                    let data = JSON.parse(msg.data);
                    this.setState({showModal: false}, () => {
                        try {
                            if (data.data) {
                                let {url, picHeight, picWidth} = data.data;
                                this.props.callbacks(url, {w: picWidth, h: picHeight}, data.data);
                            } else {
                                Notification.error({
                                    title: '错误',
                                    message: data.message
                                });
                            }
                        } catch (e) {
                            Notification.error({
                                title: '错误',
                                message: '剪裁错误,返回参数有误'
                            });
                        }
                    });
                } catch (e) {
                    Notification.error({
                        title: '错误',
                        message: '剪裁错误'
                    });
                }
            }
        })
    };

    render() {
        let {showModal,url}=this.state;
        return (
            <div>
                <Dialog title="剪裁图片" size="small" visible={showModal} onCancel={this.close} lockScroll={false} onOpen={this.cropperInstall} style={{width:'660px'}}>
                    <Dialog.Body>
                        {showModal&&<div style={{textAlign:'center'}}>
                            <img id="imgCropper" src={`${url}_568x568.jpg`}/>
                        </div>}
                    </Dialog.Body>
                    <Dialog.Footer className="dialog-footer">
                        <Button onClick={this.close}>取消</Button>
                        <Button type="primary" onClick={this.submit}>确定</Button>
                    </Dialog.Footer>
                </Dialog>
            </div>
        )
    }
}

export default Cropper;

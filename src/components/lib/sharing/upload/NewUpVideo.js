/**
 * Created by 石英 on 2019/1/19 0019上午 8:45.
 */

import React from 'react';
import {Layout,Button,Dialog,Notification,Radio,Pagination} from 'element-react';
import 'element-theme-default';
import '../../../../styles/addList/content.css';
import {acoustic} from '../../util/global'
require("../../../lib/util/jquery-ui.min");
import {BundleLoading} from '@/bundle';//动态加载↓
import UpImages from "bundle-loader?lazy&name=pc/trends_asset/components/content/add/IceAddVideoModule/UpVideo/app-[name]!./UpImages";
import Cropper from "bundle-loader?lazy&name=pc/trends_asset/components/content/add/IceAddVideoModule/UpVideo/app-[name]!./Cropper";
import Interaction from './components/InteractiveVideo';
import UpScreenVideo from "bundle-loader?lazy&name=pc/trends_asset/components/content/add/IceAddVideoModule/UpVideo/app-[name]!./UpScreenVideo";


class UpVideo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            submitVideo: false,
            openUpImages: false,
            openCropper: false,
            type: "add",
            videoNum:-1,
        };
    }

    open=(data)=>{
        if (data) {
            this.setState({showModal: true, submitVideo: true, videoCoverUrl: data.videoCoverUrl, type: "edit", data},this.getVideo);
        } else {
            this.setState({showModal: true, type: "add"},this.getVideo);
        }
    };

    close=()=>{
        this.setState({showModal: false, submitVideo: false});
    };

    getVideo = (current = 1) => {//拿取视频列表数据
        acoustic({
            agreement: "https",
            hostname: "resource.taobao.com",
            path: "/video/getMaterial",
            data: {
                type: 'video',
                current: current,
                pageSize: 20,
                vf: 'p',
                producerSource: 1,
            },
            method: "get",
            referer: "https://we.taobao.com/"
        }, 'requestRelyTB', (msg) => {
            let data = JSON.parse(msg);
            if (data.data) {
                this.setState({video: data.data});
            } else {
                Notification({
                    title: '错误',
                    message: `错误提示：${data.message}`,
                    offset: 100
                });
            }
        });
    };

    add_Video = () => {//上传视频
        acoustic({
            agreement: "https",
            hostname: "resource.taobao.com",
            path: "/video/getVideoToken.json",
            data: {},
            method: "get",
            referer: "https://we.taobao.com/"
        }, 'requestRelyTB', (msg) => {
            let data = JSON.parse(msg);
            acoustic({data: data.data}, "upVideo", (json, fileName) => {
                acoustic({url: "https://we.taobao.com/ajax/getSnapshot.do"}, "getCookie", (cookie) => {
                    let co = cookie.split(';'), obj = {};
                    for (let c in co) {
                        obj[co[c].split('=')[0]] = co[c].split('=')[1];
                    }
                    let ss = {
                        fileId: json.fileId,
                        num: 1,
                        _tb_token_: obj[' _tb_token_'],
                    };
                    acoustic({
                        agreement: "https",
                        hostname: "ugc.taobao.com",
                        path: "/ajax/getSnapshot.do",
                        data: ss,
                        method: "get",
                        referer: "https://we.taobao.com/"
                    }, 'requestRelyTB', (urlData) => {
                        let Data = JSON.parse(urlData);
                        if (Data.code == '200') {
                            acoustic({
                                agreement: "https",
                                hostname: "resource.taobao.com",
                                path: "/video/addVideo.json",
                                data: {
                                    title: fileName,
                                    tag: 'ice-tbvideo',
                                    description: fileName,
                                    uploadId: json.fileId,
                                    coverUrl: Data.data[0],
                                },
                                method: "post",
                                referer: "https://we.taobao.com/"
                            }, 'requestRelyTB', () => {
                                Notification.info({
                                    title: '消息',
                                    message: 'videoData.message',
                                });
                                this.getVideo();
                            })
                        }
                    })
                })
            })
        });
    };

    submit = () => {//视频选择提交下一步骤
        let {video, videoNum} = this.state;
        this.setState({submitVideo: true, data: video.itemList[videoNum]});
    };

    addImg = () => {//添加图片
        if (this.state.openUpImages&&this.upImages&&this.upImages.jd) {
            this.upImages.jd.open();
        } else {
            this.setState({openUpImages: true}, () => {
                let upload = setInterval(() => {
                    let upImages = this.upImages;
                    if (upImages&&upImages.jd) {
                        clearInterval(upload);
                        upImages.jd.open();
                    }
                }, 100);
            })
        }
    };

    setSubmit = () => {//提交
        let {videoCoverUrl, data, type} = this.state;
        let {coverUrl, description, duration, playUrl, title, uploadTime, videoId,ivideoData} = data;
        this.props.callback({coverUrl, description, duration, playUrl, title, uploadTime, videoId, videoCoverUrl, ivideoData}, type);
        this.close();
    };

    imgCallback = (url, pa, img) => {//图片数据回调
        let {pixFilter} = this.props.constraint.props.addImageProps;
        let arr = pixFilter ? [parseInt(pixFilter.split("x")[0]), parseInt(pixFilter.split("x")[1])] : [0, 0];
        let g = url.substr(url.length - 3);
        if (g == "gif") {
            this.cropperCallback(url, pa, img);
        } else {
            if (arr[0] && arr[1] && arr[0] / arr[1] == pa.w / pa.h && arr[0] <= pa.w && arr[1] <= pa.h) {
                this.cropperCallback(url, pa, img);
            } else {
                if (this.state.openCropper) {
                    this.cropper.jd.open(url, pa, img);
                } else {
                    this.setState({openCropper: true}, () => {
                        let upload = setInterval(() => {
                            let jd = this.cropper.jd;
                            if (jd) {
                                clearInterval(upload);
                                jd.open(url, pa, img);
                            }
                        }, 100);
                    })
                }
            }
        }
    };

    cropperCallback = (url, pa, img) => {//剪切图片数据回调
        this.setState({videoCoverUrl: url});
    };

    ivideoEdit=(item,str='',full)=>{
        this.setState({showModal: str=='disabled'?false:true, disabled:true,submitVideo: str=='disabled'?false:true, videoCoverUrl: item.videoCoverUrl, type: "edit", item,full},()=>{
            this.getVideo();
            let ed=setInterval(()=>{
                if(this.interaction){
                    clearInterval(ed);
                    this.interaction.open({item,type:'edit',disabled:true});
                }
            },600);
        });
    };

    videoData=(data)=>{//互动视频回调
        this.setState({submitVideo: true, data: data});
    };

    render() {
        let {showModal, video, videoNum, submitVideo, openUpImages, openCropper, videoCoverUrl, data,disabled,full} = this.state,{constraint} = this.props;
        let {pixFilter}=constraint.props.addImageProps;
        return(
            <div>
                <Dialog title="添加视频" size="small" visible={showModal}
                        onCancel={this.close} style={{width:'1000px'}}
                        lockScroll={false}>
                    <Dialog.Body>
                        {submitVideo?
                            <React.Fragment>
                                <h4>设置视频封面</h4>
                                <Layout.Row style={{marginTop: "6px", marginBottom: "10px"}} gutter="20">
                                    {videoCoverUrl?<Layout.Col  span="8" className="listItem">
                                        <img src={videoCoverUrl} width="100%"/>
                                        <div className="del" onClick={() =>this.setState({videoCoverUrl: undefined})}>
                                            删除
                                        </div>
                                    </Layout.Col>:<Layout.Col  span="8" className="itemM_pic">
                                        <img src="https://img.alicdn.com/imgextra/i1/772901506/TB2oeLpihhmpuFjSZFyXXcLdFXa_!!772901506.jpg"
                                            onClick={this.addImg}/>
                                        </Layout.Col>}
                                    <Layout.Col span="16">
                                        {pixFilter&&<span>{`请上传${pixFilter}的图片，支持图片格式：png、jpg、jpeg，不超过 3MB`}</span>}
                                        <div style={{margin: '30px 0', backgroundColor: "#eaeaea"}}>
                                            <img src={data.coverUrl} style={{maxWidth: '240px'}}/>
                                            <span style={{marginLeft: "10px"}}>{data.title}</span>
                                        </div>
                                    </Layout.Col>
                                </Layout.Row>
                            </React.Fragment>:
                        <React.Fragment>
                            <div>请选择视频<span style={{color:'rgb(153, 153, 153)'}}>（仅显示转码完成的视频）</span></div>
                            <Layout.Row gutter="5">
                                <Layout.Col span="8" className="itemM_pic">
                                    <img src="https://img.alicdn.com/imgextra/i1/772901506/TB2oeLpihhmpuFjSZFyXXcLdFXa_!!772901506.jpg"
                                         onClick={this.add_Video} style={{width: "193px"}}/>
                                </Layout.Col>
                                {video && video.itemList.map((item, i) => {
                                    let {videoId, coverUrl, title, uploadTime} = item;
                                    return (
                                        <Layout.Col span="8" key={`v-${videoId}-${i}`} style={{margin: "10px 0"}}>
                                            <div style={{border: '1px solid #D4D4D4', position: 'relative'}}>
                                                <div style={{position: 'relative'}}>
                                                    <div style={{textAlign:'center'}}>
                                                        <img src={coverUrl} style={{maxHeight:'166.98px'}}/>
                                                    </div>
                                                    <div style={{
                                                        display: 'block', position: 'absolute', top: 0, left: 0, height: '100%', width: '100%',
                                                        cursor: 'pointer', backgroundImage: 'url(//img.alicdn.com/tfs/TB1LiOXNpXXXXbEaXXXXXXXXXXX-53-43.png)',
                                                        backgroundRepeat: 'no-repeat', backgroundPosition: 'center center'
                                                    }}>
                                                        <span style={{color: '#fff', backgroundColor: '#20a0ff', borderColor: '#20a0ff'}}>
                                                            <i className="el-icon-edit" onClick={()=>{
                                                                this.interaction.open({item,type:'add'});
                                                            }}>
                                                                创建互动视频
                                                            </i>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div style={{fontSize: '14px', color: '#666', height: '22px', lineHeight: '22px', overflow: 'hidden'}}>
                                                    <div style={{float: 'left', width: '36px', marginRight: '5px', height: '22px', paddingTop: '2px'}}>
                                                        <img src='https://img.alicdn.com/tps/TB1BfuoOXXXXXbIXXXXXXXXXXXX-36-18.png'/>
                                                    </div>
                                                    <div style={{overflow: 'hidden'}}>
                                                        <span style={{width: '159px', textOverflow: 'ellipsis', display: 'inline-block',
                                                            whiteSpace: 'nowrap', overflow: 'hidden'}}>{title}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <span style={{paddingRight: '10px'}}>{uploadTime}</span>
                                                </div>
                                                <div style={{bottom: '8px', right: '8px', position: 'absolute'}}>
                                                    <Radio value={''} checked={videoNum === i} onChange={()=>this.setState({videoNum:i})}/>
                                                </div>
                                            </div>
                                        </Layout.Col>
                                    )
                                })}
                            </Layout.Row>
                            <div style={{textAlign:'center',marginTop:'20px'}}>
                                {video&&<Pagination layout="total, prev, pager, next" total={video.total}
                                                    pageSize={video.pageSize} currentPage={video.current}
                                                    onCurrentChange={this.getVideo}/>}
                            </div>
                        </React.Fragment>}
                    </Dialog.Body>
                    <Dialog.Footer className="dialog-footer">
                        {submitVideo ?
                            <React.Fragment>
                                <Button type="danger" onClick={() => this.setState({submitVideo: false, videoCoverUrl: undefined})}>重新选择</Button>
                                <Button type="primary" onClick={this.setSubmit} disabled={!videoCoverUrl}>确定</Button>
                            </React.Fragment>:
                            <React.Fragment><Button onClick={this.close}>关闭</Button>
                                <Button type='primary' disabled={videoNum<0||disabled} onClick={this.submit}>确定</Button>
                            </React.Fragment> }
                    </Dialog.Footer>
                </Dialog>
                {openUpImages && <BundleLoading ref={e => this.upImages = e} load={UpImages} callback={this.imgCallback}/>}
                {openCropper && <BundleLoading ref={e => this.cropper = e} load={Cropper} callbacks={this.cropperCallback} pixFilter={pixFilter}/>}
                <Interaction ref={e => this.interaction = e} videoData={this.videoData} full={full}/>
            </div>
        )
    }
}

export default UpVideo;

/**
 * Created by muqingzhong on 2017/7/18.上传图片
 */

require('../../../../styles/component/react_assembly/upImages.css');
import $ from 'jquery';
import React from 'react';
import {ThousandsOfCall} from '../../util/ThousandsOfCall';
import {Dialog,Tabs,Alert,Progress,Notification,Layout,Pagination,Button} from 'element-react';
import 'element-theme-default';


class NewUpImages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogVisible: false,
            tabValue: 1,
            data: {//图片空间数据
                current: 1,//当前页
                pageSize: 20,//每页记录数
                total: 0,//总记录数
                itemList: [],//图片数据
                q: '',//标题搜索　
            },
        };
        this.open = this._open.bind(this);
        this.close = this._close.bind(this);
    }

    componentDidMount() {
        ThousandsOfCall.acoustic({}, "getVersion", (data) => {
            let judge = this.versionJudge(data.data);
            this.setState({isVersion: judge});
        })
    }

    versionJudge = (str) => {
        let arr = str.split('.');
        let arr1 = '0.3.8.0.0'.split('.'), judge = true;
        arr.forEach((item, index) => {
            let newItem = +item, zhi = +arr1[index];
            if (newItem < zhi) {
                judge = false;
            }
        });
        return judge;
    };

    _open() {
        this.setState({dialogVisible: true});
    }

    _close(callback) {
        this.setState({dialogVisible: false},()=>{
            if(callback &&typeof callback==='function'){
                callback();
            }
        });
    }

    selectPresent = (tab) => {//切换
        let tabValue = tab.props.name;
        this.setState({tabValue}, () => {
            if (tabValue === 2) {
                this.goPage();
            }
        });
    };

    goPage = (newCurrent) => {
        let {current, q, pageSize} = this.state.data;
        this.imgSpace({
            current: newCurrent ? newCurrent : current,
            pageSize: pageSize,
            q: q,
            resourceType: 'Pic',
        });
    };

    imgSpace = (data) => {//图片空间
        ThousandsOfCall.acoustic({
            agreement: "https",
            hostname: "resource.taobao.com",
            path: '/resource/query',
            method: "POST",
            data: data,
            referer: "https://we.taobao.com/",
        }, "requestRelyTB", (msg) => {
            let data = JSON.parse(msg.data);
            if (data.status == 'SUCCESS') {
                this.setState({data: data.data});
            } else {
                Notification.error({
                    title: '错误',
                    message: `淘宝:${data.message}`
                });
            }
        });
    };

    openUpImage = () => {//打开上传图片
        ThousandsOfCall.acoustic({}, "upTBImages", (imgData) => {
            if (imgData.success) {
                let msg = imgData.data;
                if (msg.status === "SUCCESS") {
                    let data = msg.data;
                    if (data[0] && data[0].coverUrl) {
                        let {coverUrl, picWidth, picHeight} = data[0];
                        ThousandsOfCall.acoustic({
                            agreement: "https",
                            hostname: "resource.taobao.com",
                            path: "/crop/img",
                            data: {
                                url: `https:${coverUrl}`,
                                x: 0,
                                y: 0,
                                w: picWidth,
                                h: picHeight,
                            },
                            method: "POST",
                            referer: "https://we.taobao.com/",
                        }, "requestRelyTB", (json20) => {
                            let json = JSON.parse(json20.data);
                            if (json.status == "SUCCESS") {
                                this.setState({tabValue: 2}, () => {
                                    this.goPage();
                                })
                            } else {
                                Notification.error({
                                    title: '错误',
                                    message: `服务器错误:${json.msg}`
                                });
                            }
                        })
                    } else {
                        Notification.error({
                            title: '错误',
                            message: `图片上传失败`
                        });
                    }
                } else {
                    Notification.error({
                        title: '错误',
                        message: `淘宝:${msg.message}`
                    });
                }
            } else {
                Notification.error({
                    title: '错误',
                    message: `解析错误，上传失败`
                });
            }
        })
    };

    optionImg = ({data}) => {//图片空间图片选择
        let {coverUrl, picWidth, picHeight} = data;
        let url = 'https:' + coverUrl;
        let pix = {w: picWidth, h: picHeight};
        if (url.indexOf('gif') > -1) {
            this.close(()=>this.props.callback(url, pix, data));
        } else {
            ThousandsOfCall.acoustic({
                agreement: "https",
                hostname: "resource.taobao.com",
                path: '/crop/img',
                method: "POST",
                data: {
                    url: `https:${coverUrl}`,
                    x: 0,
                    y: 0,
                    w: picWidth,
                    h: picHeight,
                },
                referer: "https://we.taobao.com/",
            }, "requestRelyTB", (json20) => {
                let json = JSON.parse(json20.data);
                if (json.status == "SUCCESS") {
                    let {url, picWidth, picHeight} = json.data;
                    this.close(()=>this.props.callback(`https:${url}`, {w: picWidth, h: picHeight}, json.data));
                } else {
                    Notification.error({
                        title: '错误',
                        message: `服务器错误:${json.msg}`
                    });
                }
            });
        }
    };

    onChange = (env) => {
        let fileData = env.target.files;
        if (fileData.length > 1) {
            this.loopChange({env, fileData})
        } else {
            let file = fileData[0];
            this.singleImage({env, file, isCallback: false})
        }
    };

    loopChange = ({env, fileData, index = 0}) => {
        if (index < fileData.length) {
            if (index > 0) {
                Notification.info({
                    title: '消息',
                    message: '上传下一个图片,请稍等'
                });
            }
            this.singleImage({
                env, file: fileData[index], isCallback: true, callback: () => {
                    this.loopChange({env, fileData, index: index + 1})
                }
            })
        } else {
            Notification.info({
                title: '消息',
                message: '图片上传结束'
            });
            document.getElementById('thousandsOfCallUploading').reset();
            $('.imgSpaceInput').val('');
            $('.imgSpaceInput').files = [];
        }
    };

    singleImage = ({env, file, isCallback, callback}) => {
        let reader = new FileReader();
        reader.readAsDataURL(file); // 读出 base64
        reader.onloadend = () => {// 图片的 base64 格式, 可以直接当成 img 的 src 属性值
            let dataURL = reader.result;
            ThousandsOfCall.acoustic({
                name: file.name,
                size: file.size,
                type: file.type,
                path: dataURL
            }, "upTBImages", (data1 = '') => {
                $(env.target).val("");
                if (data1.success) {
                    let data = data1.data;
                    if (data.status == "SUCCESS") {
                        data = data.data;
                        if (data[0].coverUrl) {
                            this.close();
                            let url = 'https:' + data[0].coverUrl;
                            if (url.indexOf('gif') > -1) {
                                this.props.callback(url, {w: data[0].picWidth, h: data[0].picHeight}, data[0]);
                                if (isCallback) {
                                    setTimeout(() => {
                                        callback();
                                    }, 500);
                                }
                            } else {
                                let pix = {w: data[0].picWidth, h: data[0].picHeight};
                                let d = {
                                    url: url,
                                    x: 0,
                                    y: 0,
                                    w: pix.w,
                                    h: pix.h,
                                };
                                ThousandsOfCall.acoustic({
                                        agreement: "https",
                                        hostname: "resource.taobao.com",
                                        path: "/crop/img",
                                        data: d,
                                        method: "POST",
                                        referer: "https://we.taobao.com/",
                                    }, "requestRelyTB", (json20) => {
                                        let json = JSON.parse(json20.data);
                                        if(!isCallback){
                                            document.getElementById('thousandsOfCallUploading').reset();
                                            $('.imgSpaceInput').val('');
                                            $('.imgSpaceInput').files = [];
                                        }
                                        if (json.status == "SUCCESS") {
                                            let newUrl = 'https:' + json.data.url;
                                            let newPix = {w: json.data.picWidth, h: json.data.picHeight};
                                            this.props.callback(newUrl, newPix, json.data);
                                            if (isCallback) {
                                                setTimeout(() => {
                                                    callback();
                                                }, 500);
                                            }
                                        } else {
                                            Notification.error({
                                                title: '错误',
                                                message: `服务器错误:${json.msg}`
                                            });
                                            return false;
                                        }
                                    }
                                );
                            }
                        } else {
                            Notification.error({
                                title: '错误',
                                message: `图片上传失败`
                            });
                        }
                    } else {
                        Notification.error({
                            title: '错误',
                            message: `淘宝${data.message}`
                        });
                    }
                } else {
                    Notification.error({
                        title: '错误',
                        message: `图片上传失败`
                    });
                }

            })
        };
    };

    render() {
        let {dialogVisible, tabValue, data,isVersion} = this.state,{size}=this.props;
        return (
            <Dialog title="图片选择框" size={size ? size : "small"} visible={dialogVisible}
                    onCancel={() => this.setState({dialogVisible: false})}
                    lockScroll={false} style={{textAlign: 'left'}}>
                <Dialog.Body>
                    <Tabs type="card" activeName={tabValue} onTabClick={this.selectPresent}>
                        <Tabs.Pane label="上传图片" name={1}>
                            <div style={{height: '500px'}}>
                                <Alert title={`点击虚线内空白处即可上传图片,请选择大小不超过 3 MB 的图片`} type="info"/>
                                <div className="imgSpaceDashed" style={{marginTop: "8px"}}>
                                    <form name="form" id="thousandsOfCallUploading" className='thousandsOfCallUploading'>
                                        <div className="addImg">
                                            <i className="el-icon-plus"> </i>
                                        </div>
                                        {isVersion ? <input type="file" name="files" className="imgSpaceInput" accept="image/*"
                                                                       id="thousandsOfCallUploadingFile" onChange={this.onChange} multiple/> :
                                            <div className="imgSpaceInput" onClick={this.openUpImage}/>}
                                    </form>
                                </div>
                            </div>
                        </Tabs.Pane>
                        <Tabs.Pane label="图片选择" name={2}>
                            <Layout.Row gutter="6">
                                {data.itemList.map((item, index) => {
                                    return (
                                        <Layout.Col span="6" key={index} style={{marginTop: '16px'}}>
                                            <div className="imgSpace" onClick={() => this.optionImg({data: item})}>
                                                <a href="javascript:void(0)" className="itemImgSpace">
                                                    <img src={item.coverUrl}/>
                                                </a>
                                                <p>{item.picWidth + '*' + item.picHeight}</p>
                                            </div>
                                        </Layout.Col>
                                    )
                                })}
                            </Layout.Row>
                            <div style={{textAlign: 'center'}}>
                                <Pagination layout="total, prev, pager, next, jumper" total={data.total}
                                            pageSize={data.pageSize} currentPage={data.current}
                                            onCurrentChange={(current) => this.goPage(current)}/>
                            </div>
                        </Tabs.Pane>
                    </Tabs>
                </Dialog.Body>
            </Dialog>
        );
    }
}

export default NewUpImages;

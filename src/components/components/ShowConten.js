/**
 * Created by shiying on 17-7-27.
 */

import React from 'react';
import {Card, Input, Form, Layout, Tag, Popover, Badge, Dialog, Message, MessageBox, Radio, Carousel, Alert, Rate, Button} from 'element-react';
import 'element-theme-default';
import $ from 'jquery';
import EditBox from '../lib/sharing/editBox/EditBox'
import HintShow from '../page/admin/components/content/Hint';
import {ImgListMain, NewImgListMain} from "../page/admin/components/content/AddImageListModal/NewAddImageListModal"
import StringModule from "../page/admin/components/content/StringModule"
import ItemModule from "../page/admin/components/content/ItemModule"
import AnchorImageListModule from '../page/admin/components/content/AnchorImageListModule'
import ImgModule from '../page/admin/components/content/ImgModule'
import AddTagModule from '../page/admin/components/content/AddTagModule'
import EditModule from '../page/admin/components/content/EditModule'
import StructCanvasModule from '../page/admin/components/content/StructCanvasModule'
import TagPickerModule from '../page/admin/components/content/TagPickerModule'
import BusinessRegister from '../page/admin/page/business/page/businessRegister/businessRegister';
import StringExhibition from '../page/admin/components/content/structCanvasModule/StringExhibition'
import ArrarExhibition from '../page/admin/components/content/structCanvasModule/ArrarExhibition'
import {BundleLoading} from '@/bundle';
import UpVideo from 'bundle-loader?lazy&name=pc/trends_asset/components/content/add/IceAddVideoModule/app-[name]!../lib/sharing/upload/NewUpVideo';
import creationShop from '../../images/content/creationShop.png';
import ContentCommentsEditBox from './ContentCommentsEditBox';
import {isLogin} from '../lib/util/global';
import Login from '../lib/util/LoginModal';
import("../../styles/addList/content.css");
import {EditorState, Modifier, Entity, RichUtils, CharacterMetadata, SelectionState, getDefaultKeyBinding, convertFromRaw} from "draft-js";
import AJAX from '../lib/newUtil/AJAX';
import shop1 from '../../images/content/shop1.png';
import shop2 from '../../images/content/shop2.png';

const exLinksBtn = document.getElementById('open-ex-links');
const strLen = (str, len) => {
    let reg = /[\u4e00-\u9fa5]/g,
        slice = str.substring(0, len),
        chineseCharNum = (~~(slice.match(reg) && slice.match(reg).length)),
        realen = slice.length * 2 - chineseCharNum;
    return str.substr(0, realen) + (realen < str.length ? "..." : "");
};

class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogVisible: false,
            data: {},
        };
    }

    open = (data) => {
        this.setState({data, dialogVisible: true}, () => {
            let editBox = this.editBox;
            if (data) {
                let contentState = convertFromRaw(data);
                let editorState = EditorState.createWithContent(contentState);
                editBox.onChange(editorState);
            } else {
                let editorState = EditorState.createEmpty();
                editBox.onChange(editorState);
            }
        });

    };

    onChange = (value) => {
        this.setState({data: value});
    };

    submit = () => {
        let {data} = this.state;
        this.setState({dialogVisible: false, data: {}}, () => {
            this.props.callback(data);
        })
    };

    render() {
        let {dialogVisible} = this.state;
        let parameters = {
            imgDisabled: true,
            itemDisabled: true
        };
        return (
            <Dialog title="点评" size="tiny" visible={dialogVisible}
                        onCancel={() => this.setState({dialogVisible: false, data: {}})}
                        lockScroll={false} style={{textAlign: 'left'}}>
                <Dialog.Body>
                    <div className='commentMode'>
                        <EditBox ref={e => this.editBox = e} readOnly={this.props.disabled}
                                 onChange={this.onChange} {...parameters}/>
                    </div>
                </Dialog.Body>
                <Dialog.Footer className="dialog-footer">
                    {!this.props.disabled && <div>
                        <Button onClick={() => this.setState({dialogVisible: false, data: {}})} size="small">取消
                        </Button>
                        <Button type="primary" onClick={this.submit} size="small">确定</Button>
                    </div>}
                </Dialog.Footer>
            </Dialog>
        )
    }
}

class ImgComment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        let {commentChange, commentValue} = this.props;
        return (
            <div>
                <div style={{position: 'relative'}}>
                    <div style={{position: 'absolute', zIndex: 66, right: 0, top: 0}}>
                        {commentValue && commentValue.blocks && (commentValue.blocks[0].text || commentValue.blocks.length > 1) ?
                            <Badge value={'new'}>
                                <Button size="small" onClick={() => {
                                    this.comment.open(commentValue);
                                }}>点评
                                </Button>
                            </Badge> : <Button size="small" onClick={() => {
                                this.comment.open();
                            }}>点评</Button>}
                    </div>
                </div>
                {this.props.children}
                <Comment ref={e => this.comment = e} disabled={this.props.disabled}
                         callback={(value) => commentChange(value)}/>
            </div>
        )
    }
}

class ShowConten extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            commentId: 0,
            contentData: {},
            contentMode: [],
            disabled: false,//是否禁用
            login: {
                cancel: false,//是否取消登录
            },//是否登录
            dialogVisible: false,//注册模态框按钮
            dialogVisible2: false,//添加成功模态
            reviewers: '',//审稿
            log: '',//日志
            resJson: {},//添加成功返回数据
            shade:new Array(8).fill(false)
        }
    }

    componentDidMount() {
        isLogin((login) => {
            this.setState({login: login}, () => {
                this.editorData();
                this.totalComment();
            });
        });
    }

    componentDidUpdate() {
        this.editorData();
    }

    editorData = () => {
        let {contentData,contentMode} = this.state;
        if(contentMode instanceof Array){
            for (let i in contentMode) {
                if (contentMode[i].type == "Editor") {
                    let edit = this.refs[contentMode[i].name];
                    if (edit && contentData[contentMode[i].name] && contentData[contentMode[i].name].value) {
                        edit.setContent(contentData[contentMode[i].name].value);
                    }
                }
            }
        }else {
            contentMode.nameList.forEach((item)=>{
                if(contentMode.constraint[item.name].type=='Editor'){
                    let edit = this.refs[item.name];
                    if (edit && contentData[item.name] && contentData[item.name].value) {
                        edit.setContent(contentData[item.name].value);
                    }
                }
            })
        }
    };

    totalComment = () => {
        let {contentData} = this.state;
        let totalEditBox = this.totalEditBox;
        if (totalEditBox && contentData) {
            if (contentData.commentValue) {
                let contentState = convertFromRaw(contentData.commentValue);
                let editorState = EditorState.createWithContent(contentState);
                totalEditBox.onChange(editorState);
            } else {
                let editorState = EditorState.createEmpty();
                totalEditBox.onChange(editorState);
            }
        }
    };

    reasonMouseOver = (env) => {
        let val = $(env.target).data("val");
        $("#" + val).show();
    };
    reasonMouseOut = (env) => {
        let val = $(env.target).data("val");
        $("#" + val).hide();
    };

    commentChange = ({name, type, index, value}) => {
        let {contentData} = this.state;
        if (type === 'array') {
            Object.assign(contentData[name].value[index], value);
        } else if (type === 'string' || type === 'Editor') {
            Object.assign(contentData[name], {comment: value});
        }
        this.setState({contentData});
    };

    submit = () => {//提交
        let {contentData, contentMode, reviewers, showContent, encryptTime} = this.state;
        if (!reviewers) {
            Message({
                message: '请选择内容审稿',
                type: 'error'
            });
            return false;
        }
        let object = {
            data: JSON.stringify({contentData: contentData, contentMode: contentMode}),
            id: this.state.commentId,
            contentId: showContent.id,
            encryptTime: encryptTime,
            reviewers: reviewers,
        };
        this.showContenAjax.ajax({
            url: '/content/contentComments/addAndUpContentComments.io',
            data: {data: JSON.stringify(object)},
            type: "post",
            callback: (json) => {
                this.setState({dialogVisible2: true, resJson: json});
            }
        });
    };
    cancelLogin = () => {//取消登录
        let {login} = this.state;
        login.isLogin = false;
        login.cancel = true;
        this.setState({login: login});
    };
    loginSubmit = (callback) => {//登录提交
        Login.getInstance((isLogins) => {
            isLogin((login) => {//获取登录信息
                this.setState({login: login}, () => {
                    if (callback) {
                        callback(login);
                    }
                });
            });
        });
    };

    registerSuccess = () => {//注册成功回调
        this.setState({dialogVisible: false, disabled: true}, () => {
            this.loginSubmit((login) => {
                this.showContenAjax.ajax({
                    type: 'post',
                    url: '/content/contentComments/addContentCommentsByUUID.io',
                    data: {id: this.state.resJson.id, uuid: this.state.resJson.uuid},
                    callback: (json) => {
                        Message({
                            message: '加入点评库成功',
                            type: 'success'
                        });
                    }
                });
            })
        });
    };
    loaginAddConmmtents = () => {//登录加入点评库
        this.loginSubmit((login) => {
            if (login.isLogin && (login.loginManage && login.loginManage.organization)) {
                Message({
                    type: 'success',
                    message: '加入点评库成功'
                });
            } else {
                this.setState({dialogVisible: true}, () => {
                    this.registerSuccess(() => {

                    });
                });
            }
        })
    };

    AtlasShade=({index})=>{
        let {shade}=this.state;
        shade[index]=!shade[index];
        this.setState({shade});
    };

    render() {
        let {contentData, contentMode, login, dialogVisible, dialogVisible2, disabled, resJson, reviewers, log, ContentComments,openVideo,upVideoData,shade} = this.state;
        let nameList;
        if (contentMode) {
            if (contentMode.constructor != Array) {
                nameList = contentMode.nameList;
            }
        } else {
            contentMode = [];
        }
        let {showZoom} = this.props;
        return (
            <div>
                <Dialog title="注册" visible={dialogVisible} onCancel={() => this.setState({dialogVisible: false})}
                        lockScroll={false}>
                    <Dialog.Body>
                        <BusinessRegister callback={this.registerSuccess}/>
                    </Dialog.Body>
                    <Dialog.Footer className="dialog-footer">
                        <Button onClick={() => this.setState({dialogVisible: false})}>取消</Button>
                    </Dialog.Footer>
                </Dialog>
                <Dialog title="点评成功" visible={dialogVisible2}
                        onCancel={() => this.setState({dialogVisible2: false})}>
                    <Dialog.Body>
                        <Button onClick={() => {
                            window.location.href = window.location.origin + '/pc/visible/auditOpinion/show/' + resJson.id + '/' + resJson.encryptCommentsDate;
                        }}>查看点评内容</Button>
                        {resJson.isLogin ? <Button onClick={() => {
                                window.location.href = window.location.origin + '/pc/user/commentTable';
                            }}>查看点评列表</Button> :
                            <Button onClick={this.loaginAddConmmtents}>添加到我的点评库</Button>}

                    </Dialog.Body>
                </Dialog>
                <AJAX ref={e => this.showContenAjax = e}>
                    {(ContentComments && !disabled) && <div style={{
                        position: 'fixed',
                        width: '520px',
                        height: '252px',
                        marginLeft: '-525px',
                        //  marginTop: '181px',
                        backgroundColor: 'white'
                    }}><img src='https://img.alicdn.com/imgextra/i2/772901506/O1CN011MzmwkVbNopyPAI_!!772901506.gif'/>
                    </div>}
                    {ContentComments && <div style={{
                        position: 'fixed',
                        width: '320px',
                        marginLeft: '630px',
                        // marginTop: '200px',
                        backgroundColor: 'white'
                    }} className="countContentComments">
                        <h4>总点评</h4>
                        <div className='generalComment'>
                            <EditBox readOnly={this.state.disabled} ref={e => this.totalEditBox = e} contentHeigth="400px"
                                 onChange={(value) => {
                                     contentData.commentValue = value;
                                     this.setState({contentData});
                                 }}/>
                        </div>
                        <Form labelWidth="85">
                            <Form.Item label="内容审稿">
                                <Radio.Group value={reviewers} onChange={(value) => {
                                    this.setState({reviewers: value})
                                }}>
                                    <Radio style={{marginLeft: '15px'}} value={1}
                                           disabled={disabled}>审稿已通过,可以直接发布</Radio>
                                    <Radio value={2} disabled={disabled}>按要求修改,改完直接发布</Radio>
                                    <Radio value={3} disabled={disabled}>按要求修改,改完再次审稿</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Form>

                        {!disabled ? <div className='dialog-footer' style={{margin: '10px 0'}}>
                            {login.isLogin ? (login.loginManage && login.loginManage.organization) ?
                                <Button style={{right: "10px"}} type="primary"
                                            onClick={this.submit}>点评提交</Button>
                                : <Button type="info" onClcik={this.submit}>游客点评</Button>
                                : login.cancel ? <Button type="info" onClick={this.submit}>游客点评</Button> :
                                    <Button.Group>
                                        <Button style={{right: "10px"}} type="primary"
                                                    onClick={this.loginSubmit}>登录提交点评
                                        </Button>
                                        <Button style={{right: "10px"}} onClick={this.cancelLogin}>不登录</Button>
                                    </Button.Group>
                            }
                        </div> : <div style={{
                            height: "80px",
                            overflowY: "scroll",
                            overflow: "auto",
                            textAlign: "left",
                            overflowX: 'hidden'
                        }}>{log}</div>}
                    </div>}
                    <Card className="box-card showContent">
                        <Form model={{}} labelWidth="85">

                            {(nameList ? nameList : (contentMode ? contentMode : [])).map((item, j) => {
                                item = nameList ? contentMode.constraint[item.name] : item;
                                let data = contentData[item.name] ? contentData[item.name].value : undefined;
                                contentData[item.name] = contentData[item.name]?contentData[item.name]:{};
                                let {comment} = contentData[item.name] ? contentData[item.name] : {};
                                switch (item.type) {
                                    case 'Forward':
                                        return (
                                            <Form.Item key={item.name} label={item.title ? item.title : '引导叙述'}>
                                                {ContentComments ?
                                                    <ContentCommentsEditBox disabled={this.state.disabled}
                                                                            data={contentData[item.name].comment ? {
                                                                                oldData: data,
                                                                                newData: contentData[item.name].comment
                                                                            } : {oldData: data}}
                                                                            onChange={(value) => this.commentChange({
                                                                                name: item.name,
                                                                                type: 'string',
                                                                                value: value
                                                                            })}/> : data}
                                                <div className="clearfix"></div>
                                            </Form.Item>
                                        );
                                        break;
                                    case "AtlasImageList":
                                        return (
                                            <Form.Item key={item.name} label={item.title}>
                                                <Layout.Row gutter="10">
                                                    {(data ? data : []).map((atlas, index) => {
                                                        return (
                                                            <Layout.Col key={`atlas-${j}-${index}`} span="18" style={{marginTop: '10px',position:'relative'}}>
                                                                <Carousel autoplay={false} arrow='never' height={413}>
                                                                    {(atlas.url ? atlas.url : []).map((urlItem, u) => {
                                                                        return (
                                                                            <Carousel.Item key={`${j}-${index}-${u}`}>
                                                                                <div style={{maxHeight: '100%'}}>
                                                                                    <img src={urlItem}/>
                                                                                </div>
                                                                            </Carousel.Item>
                                                                        )
                                                                    })}
                                                                </Carousel>
                                                                <div style={{position:'absolute',zIndex: 10,bottom: '18px'}}>
                                                                    <div className='dyh_shade' style={shade[index]?{height: '240px'}:{height: '90px'}}> </div>
                                                                </div>
                                                                <div style={{margin: '0 3px',position:'absolute',zIndex: 11,bottom: '18px', color: 'rgb(255, 255, 255)'}}
                                                                     className='AtlasImage' onClick={()=>this.AtlasShade({index})}>
                                                                    <span style={{
                                                                        fontWeight: 'bold',
                                                                        fontSize: '14px'
                                                                    }}>{atlas.resourceFeatures.picTab}</span>
                                                                    <div style={shade[index]?{
                                                                            color: "rgb(220, 220, 220)",
                                                                            fontSize: '12px',
                                                                            lineHeight: '20px',
                                                                            textAlign: "left",
                                                                        } :{
                                                                        color: "rgb(220, 220, 220)",
                                                                        fontSize: '12px',
                                                                        lineHeight: '20px',
                                                                        textAlign: "left",
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                        display: '-webkit-box',
                                                                        WebkitLineClamp: 3,
                                                                        lineClamp: 3,
                                                                        WebkitBoxOrient: 'vertical'
                                                                    }}>{atlas.desc}</div>
                                                                </div>
                                                            </Layout.Col>
                                                        )
                                                    })}
                                                </Layout.Row>
                                            </Form.Item>
                                        );
                                        break;
                                    case "Input":
                                        return (
                                            <Form.Item key={item.name} label={item.title}>
                                                {ContentComments ?
                                                    <ContentCommentsEditBox disabled={this.state.disabled}
                                                                            data={contentData[item.name].comment ? {
                                                                                oldData: data,
                                                                                newData: contentData[item.name].comment
                                                                            } : {oldData: data}}
                                                                            onChange={(value) => this.commentChange({
                                                                                name: item.name,
                                                                                type: 'string',
                                                                                value: value
                                                                            })}/> : data}
                                                <div className="clearfix"></div>
                                                <HintShow hint={StringModule.hint(data, item.props)}/>
                                            </Form.Item>
                                        );
                                        break;
                                    case "CreatorAddItem":
                                        return (
                                            <Form.Item key={item.name} label={item.title}>
                                                <Layout.Row gutter="20">
                                                    {(data ? data : []).map((commodityItem, i) => {
                                                        let {babyComment = ''} = commodityItem;
                                                        let floatNode = <a
                                                            href={"https://detail.tmall.com/item.htm?id=" + commodityItem.itemId}
                                                            target="_blank">
                                                            <img src={commodityItem.coverUrl}
                                                                 onMouseEnter={this.reasonMouseOver}
                                                                 onMouseLeave={this.reasonMouseOut}
                                                                 data-val={j + "item" + i}/>
                                                        </a>;
                                                        let node = <a
                                                            href={"https://detail.tmall.com/item.htm?id=" + commodityItem.itemId}
                                                            target="_blank">
                                                            <img src={commodityItem.coverUrl}/>
                                                        </a>;
                                                        return <Layout.Col className="listItem" span="12"
                                                                           key={commodityItem.itemId + "" + i}>
                                                            {showZoom ?
                                                                <div>
                                                                    {ContentComments ?
                                                                        <ImgComment disabled={this.state.disabled}
                                                                                    commentChange={value => {
                                                                                        this.commentChange({
                                                                                            name: item.name,
                                                                                            type: 'array',
                                                                                            index: i,
                                                                                            value: {babyComment: value}
                                                                                        })
                                                                                    }} commentValue={babyComment}>
                                                                            {floatNode}
                                                                        </ImgComment> : floatNode}
                                                                    <img id={j + "item" + i}
                                                                         className="hiddenImg  navbar-fixed-top"
                                                                         src={commodityItem.coverUrl}/>
                                                                </div> :
                                                                (ContentComments ?
                                                                    <ImgComment disabled={this.state.disabled}
                                                                                commentChange={value => {
                                                                                    this.commentChange({
                                                                                        name: item.name,
                                                                                        type: 'array',
                                                                                        index: i,
                                                                                        value: {babyComment: value}
                                                                                    })
                                                                                }} commentValue={babyComment}>
                                                                        {node}
                                                                    </ImgComment> : node)}
                                                            <span
                                                                className="showContentItemTitle">{commodityItem.title}</span>
                                                        </Layout.Col>
                                                    })}
                                                </Layout.Row>
                                                <Layout.Row gutter="20">
                                                    <Layout.Col span="24"><b>下列补充图</b></Layout.Col>
                                                    {(data ? data : []).map((commodityItem, i) => {
                                                        if (commodityItem.extraBanners) {
                                                            let {extraBannersComment = ['', '', '']} = commodityItem;
                                                            return (
                                                                <Layout.Col span="24"
                                                                            key={commodityItem.itemId + "-" + j}>
                                                                    <Layout.Row gutter="10">
                                                                        {(commodityItem.extraBanners ? commodityItem.extraBanners : []).map((it, t) => {
                                                                            return (
                                                                                <Layout.Col className="listItem"
                                                                                            span="8"
                                                                                            key={commodityItem.itemId + "" + i + "i" + t}>
                                                                                    {ContentComments ? <ImgComment
                                                                                            disabled={this.state.disabled}
                                                                                            commentChange={value => {
                                                                                                extraBannersComment.splice(t, 1, value);
                                                                                                this.commentChange({
                                                                                                    name: item.name,
                                                                                                    type: 'array',
                                                                                                    index: i,
                                                                                                    value: {extraBannersComment}
                                                                                                })
                                                                                            }}
                                                                                            commentValue={extraBannersComment[t]}
                                                                                            style={{
                                                                                                position: 'bottom-end',
                                                                                                width: '150px'
                                                                                            }}>
                                                                                            <img src={it} key={t}
                                                                                                 onMouseEnter={this.reasonMouseOver}
                                                                                                 onMouseLeave={this.reasonMouseOut}
                                                                                                 data-val={j + "item" + i + "t" + t}/>
                                                                                        </ImgComment> :
                                                                                        <img src={it} key={t}
                                                                                             onMouseEnter={this.reasonMouseOver}
                                                                                             onMouseLeave={this.reasonMouseOut}
                                                                                             data-val={j + "item" + i + "t" + t}/>}
                                                                                    <img id={j + "item" + i + "t" + t}
                                                                                         className="hiddenImg  navbar-fixed-top"
                                                                                         src={it}/>
                                                                                </Layout.Col>
                                                                            )
                                                                        })}
                                                                    </Layout.Row>
                                                                </Layout.Col>
                                                            )
                                                        }
                                                    })}
                                                </Layout.Row>
                                                <div className="clearfix"></div>
                                                <HintShow hint={ItemModule.hint(data, item.props)}/>
                                            </Form.Item>
                                        );
                                        break;
                                    case "AnchorImageList":
                                        return (
                                            <Form.Item key={item.name} label={item.title}>
                                                <Layout.Row gutter="20">
                                                    {(data ? data : []).map((item, i) => {
                                                        let {AnchorImageComment = ''} = item;
                                                        return <Layout.Col className="listItem" span={18}
                                                                           key={item.name + j + "-" + i}>
                                                            {item.pushItem ?
                                                                (ContentComments ?
                                                                    <ImgComment disabled={this.state.disabled}
                                                                                commentChange={value => {
                                                                                    this.commentChange({
                                                                                        name: item.name,
                                                                                        type: 'array',
                                                                                        index: i,
                                                                                        value: {AnchorImageComment: value}
                                                                                    })
                                                                                }}
                                                                                commentValue={AnchorImageComment}><NewImgListMain
                                                                        url={item.pushItem.url}
                                                                        anchors={item.pushItem.anchors}
                                                                        layers={item.retainItem.layers}
                                                                        addAnchors={() => {
                                                                        }}/>
                                                                    </ImgComment> :
                                                                    <NewImgListMain url={item.pushItem.url}
                                                                                    anchors={item.pushItem.anchors}
                                                                                    layers={item.retainItem.layers}
                                                                                    addAnchors={() => {
                                                                                    }}/>) :
                                                                (ContentComments ?
                                                                    <ImgComment disabled={this.state.disabled}
                                                                                commentChange={value => {
                                                                                    this.commentChange({
                                                                                        name: item.name,
                                                                                        type: 'array',
                                                                                        index: i,
                                                                                        value: {AnchorImageComment: value}
                                                                                    })
                                                                                }} commentValue={AnchorImageComment}>
                                                                        <ImgListMain data_i={i} url={item.url}
                                                                                     anchors={item.anchors}
                                                                                     addAnchors={() => {
                                                                                     }}/></ImgComment> :
                                                                    <ImgListMain data_i={i} url={item.url}
                                                                                 anchors={item.anchors}
                                                                                 addAnchors={() => {
                                                                                 }}/>)}
                                                        </Layout.Col>
                                                    })}
                                                    <div className="clearfix"></div>
                                                    {!(data && data.length && data.length > 0 && data[0].pushItem) &&
                                                    <HintShow hint={AnchorImageListModule.hint(data, item.props)}/>}
                                                </Layout.Row>
                                            </Form.Item>
                                        );
                                        break;
                                    case "CreatorAddImage":
                                        return (
                                            <Form.Item key={item.name} label={item.title}>
                                                <Layout.Row gutter="20">
                                                    {(data ? data : []).map((addImage, i) => {
                                                        let {addImageUrl = ''} = addImage;
                                                        return <Layout.Col className="listItem" span={12}
                                                                           key={item.name + j + "-" + i}>
                                                            {showZoom ?
                                                                <div>
                                                                    {ContentComments ?
                                                                        <ImgComment disabled={this.state.disabled}
                                                                                    commentChange={value => {
                                                                                        this.commentChange({
                                                                                            name: item.name,
                                                                                            type: 'array',
                                                                                            index: i,
                                                                                            value: {addImageUrl: value}
                                                                                        })
                                                                                    }} commentValue={addImageUrl}>
                                                                            <img
                                                                                src={typeof addImage == "object" ? addImage.url : addImage}
                                                                                onMouseEnter={this.reasonMouseOver}
                                                                                onMouseLeave={this.reasonMouseOut}
                                                                                data-val={j + "img" + i}/>
                                                                        </ImgComment> :
                                                                        <img
                                                                            src={typeof addImage == "object" ? addImage.url : addImage}
                                                                            onMouseEnter={this.reasonMouseOver}
                                                                            onMouseLeave={this.reasonMouseOut}
                                                                            data-val={j + "img" + i}/>}
                                                                    <img id={j + "img" + i}
                                                                         className="hiddenImg  navbar-fixed-top"
                                                                         src={typeof addImage == "object" ? addImage.url : addImage}/>
                                                                </div> :
                                                                (ContentComments ?
                                                                    <ImgComment disabled={this.state.disabled}
                                                                                commentChange={value => {
                                                                                    this.commentChange({
                                                                                        name: item.name,
                                                                                        type: 'array',
                                                                                        index: i,
                                                                                        value: {addImageUrl: value}
                                                                                    })
                                                                                }} commentValue={addImageUrl}>
                                                                        <img
                                                                            src={typeof addImage == "object" ? addImage.url : addImage}/>
                                                                    </ImgComment> : <img
                                                                        src={typeof addImage == "object" ? addImage.url : addImage}/>)}
                                                        </Layout.Col>
                                                    })}
                                                    <div className="clearfix"></div>
                                                    <HintShow hint={ImgModule.hint(data, item.props)}/>
                                                </Layout.Row>
                                            </Form.Item>
                                        );
                                        break;
                                    case "AddTag":
                                        return (
                                            <Form.Item key={item.name} label={item.title}>
                                                {(data ? data : []).map((tag, index) => {
                                                    return (
                                                        <Tag type="gray" key={`${item.name}${j}-${index}`}
                                                             style={{height: '40px'}}>
                                                            {ContentComments ?
                                                                <ContentCommentsEditBox disabled={this.state.disabled}
                                                                                        data={(comment && comment[index]) ? {
                                                                                            oldData: tag,
                                                                                            newData: comment[index]
                                                                                        } : {oldData: tag}}
                                                                                        onChange={(value) => {
                                                                                            if (!comment) {
                                                                                                comment = new Array(data.length).fill('');
                                                                                            }
                                                                                            comment.splice(index, 1, value);
                                                                                            this.commentChange({
                                                                                                name: item.name,
                                                                                                type: 'string',
                                                                                                value: comment
                                                                                            })
                                                                                        }}/> : tag}
                                                        </Tag>
                                                    )
                                                })}
                                                <div className="clearfix"></div>
                                                <HintShow hint={AddTagModule.hint(data, item.props)}/>
                                            </Form.Item>);
                                        break;
                                    case "AddLink":
                                        return (
                                            <Form.Item key={item.name} label={item.title}>
                                                {(data ? data : []).map((linkItem, index) => {
                                                    let {linkComment = ''} = linkItem;
                                                    return <Button type="text" key={`${j}-${index}`}
                                                                   href={linkItem.link}>
                                                        {ContentComments ?
                                                            <ContentCommentsEditBox disabled={this.state.disabled}
                                                                                    data={linkComment ? {
                                                                                        oldData: linkItem.text,
                                                                                        newData: linkComment
                                                                                    } : {oldData: linkItem.text}}
                                                                                    onChange={(value) => {
                                                                                        this.commentChange({
                                                                                            name: item.name,
                                                                                            type: 'array',
                                                                                            index: i,
                                                                                            value: {linkComment: value}
                                                                                        })
                                                                                    }}/> : linkItem.text}
                                                    </Button>
                                                })}
                                                <div className="clearfix"></div>
                                            </Form.Item>

                                        );
                                        break;
                                    case "TagPicker":
                                        const chosen = (allValue) => {
                                            let chosen = [];
                                            data = data ? data : [];
                                            for (let i in allValue) {
                                                let nc = allValue[i];
                                                for (let z = 0; z < nc.length; z++) {
                                                    for (let j in data) {
                                                        if (data[j] == nc[z].value) {
                                                            chosen.push(nc[z].label);
                                                        }
                                                    }
                                                }
                                            }
                                            return chosen;
                                        };
                                        return (
                                            <Form.Item key={item.name} label={item.title}>

                                                {chosen(item.props.dataSource).map((item, i) => {
                                                    return (
                                                        <Tag type="primary" key={i}>{item}</Tag>
                                                    )
                                                })}
                                                <div className="clearfix"></div>
                                                <HintShow hint={TagPickerModule.hint(data, item.props)}/>
                                            </Form.Item>);
                                        break;
                                    case "Editor":
                                        return (<Form.Item key={item.name} label={item.title}>
                                            {ContentComments ?
                                                <ContentCommentsEditBox disabled={this.state.disabled}
                                                                        data={contentData[item.name].comment ? {
                                                                            oldData: data,
                                                                            newData: contentData[item.name].comment
                                                                        } : {oldData: data}}
                                                                        onChange={(value) => {
                                                                            this.commentChange({
                                                                                name: item.name,
                                                                                type: 'Editor',
                                                                                value: value
                                                                            })
                                                                        }}/> :
                                                <EditBox ref={item.name} readOnly={true}/>}
                                            <div className="clearfix"></div>
                                            <HintShow hint={EditModule.hint(data, item.props)}/>
                                        </Form.Item>);
                                        break;
                                    case 'IceAddVideo':
                                        let UpVideoItem=item;
                                        return (
                                            <Form.Item key={item.name} label={item.title}>
                                                <Layout.Row gutter="20">
                                                    {(data ? data : []).map((item, z) => {
                                                        return (
                                                            <Layout.Col span={18} key={`video${z}`}
                                                                        className="listItem">
                                                                <div style={{position: 'relative'}}>
                                                                    <img src={item.videoCoverUrl} width="100%"/>
                                                                    <div style={{
                                                                        display: 'block',
                                                                        position: 'absolute',
                                                                        top: 0,
                                                                        left: 0,
                                                                        height: '100%',
                                                                        width: '100%',
                                                                        cursor: 'pointer',
                                                                        backgroundImage: 'url(//img.alicdn.com/tfs/TB1LiOXNpXXXXbEaXXXXXXXXXXX-53-43.png)',
                                                                        backgroundRepeat: 'no-repeat',
                                                                        backgroundPosition: 'center center'
                                                                    }} onClick={() => {
                                                                        if (item.ivideoData) {
                                                                            this.setState({upVideoData:UpVideoItem},()=>{
                                                                                if(openVideo&&this.upVideo&&this.upVideo.jd){
                                                                                    this.upVideo.jd.ivideoEdit(item, 'disabled','full');
                                                                                }else {
                                                                                    this.setState({openVideo:true},()=>{
                                                                                        let upload=setInterval(()=>{
                                                                                            let upVideo = this.upVideo;
                                                                                            if(upVideo&&upVideo.jd){
                                                                                                clearInterval(upload);
                                                                                                upVideo.jd.ivideoEdit(item, 'disabled','full');
                                                                                            }
                                                                                        },100);
                                                                                    })
                                                                                }
                                                                            })
                                                                        } else {
                                                                            this.watchVideo.open(item.playUrl);
                                                                        }
                                                                    }}/>
                                                                </div>
                                                            </Layout.Col>
                                                        )
                                                    })}
                                                </Layout.Row>
                                            </Form.Item>
                                        );
                                        break;
                                    case "StructCanvas":
                                        let props = item.props;
                                        return (
                                            <Form.Item key={item.name} label={item.title ? item.title : '结构体'}>
                                                <div style={item.props.sidebarBlockList[0].title != "段落" ? {
                                                    minHeight: "445px",
                                                    border: "1px solid rgba(0, 0, 0, 0.25)",
                                                    borderRadius: "4px"
                                                } : {}}>
                                                    {((data && data.length) ? data : []).map((struct, d) => {
                                                        switch (struct.name) {
                                                            case "single-item-inventory"://已处理
                                                                let ui = struct.moduleInfo.dataSchema['ui:order'];
                                                                let properties = struct.moduleInfo.dataSchema.properties;
                                                                let con = (ui ? ui : []).map((it, t) => {
                                                                    let s = properties[it];
                                                                    switch (s.type) {
                                                                        case "string":
                                                                            return (
                                                                                <StringExhibition
                                                                                    value={struct.data[it]} type={it}
                                                                                    key={t + "m"}
                                                                                    newData={struct.data.titleComment}
                                                                                    commentChange={(value) => {
                                                                                        struct.data.titleComment = value;
                                                                                        this.commentChange({
                                                                                            name: item.name,
                                                                                            type: 'array',
                                                                                            index: d,
                                                                                            value: struct
                                                                                        })
                                                                                    }}
                                                                                    ContentComments={ContentComments}
                                                                                    ContentCommentsEditBox={ContentCommentsEditBox}
                                                                                    data={struct.data.title}/>
                                                                            );
                                                                            break;
                                                                        case "array":
                                                                            return (
                                                                                <ArrarExhibition value={struct.data[it]}
                                                                                                 type={it} key={t + "m"}
                                                                                                 ImgComment={ImgComment}
                                                                                                 name={item.name}
                                                                                                 commentChange={(value, p) => {
                                                                                                     struct.data.items[p].comment = value;
                                                                                                     this.commentChange({
                                                                                                         name: item.name,
                                                                                                         type: 'array',
                                                                                                         index: d,
                                                                                                         value: struct
                                                                                                     });
                                                                                                 }}
                                                                                                 disabled={this.state.disabled}
                                                                                                 ContentComments={ContentComments}
                                                                                                 index={d}/>
                                                                            );
                                                                            break;
                                                                    }
                                                                });
                                                                return (
                                                                    <div key={"d" + d}>
                                                                        <div className="thumbnail"
                                                                             style={{width: "375px"}}>
                                                                            {con}
                                                                        </div>
                                                                        {data.length == (d + 1) ?
                                                                            <HintShow
                                                                                hint={StructCanvasModule.hint(data, props)}/> : undefined}
                                                                    </div>
                                                                );
                                                                break;
                                                            case "single-item-rank"://已处理
                                                                let u = struct.moduleInfo.dataSchema['ui:order'];
                                                                let pro = struct.moduleInfo.dataSchema.properties;
                                                                let cont = (u ? u : []).map((it, t) => {
                                                                    let s = pro[it];
                                                                    switch (s.type) {
                                                                        case "string":
                                                                            return (
                                                                                <StringExhibition
                                                                                    value={struct.data[it]} type={it}
                                                                                    key={t + "m"}
                                                                                    newData={struct.data.titleComment}
                                                                                    commentChange={(value) => {
                                                                                        struct.data.titleComment = value;
                                                                                        this.commentChange({
                                                                                            name: item.name,
                                                                                            type: 'array',
                                                                                            index: d,
                                                                                            value: struct
                                                                                        })
                                                                                    }}
                                                                                    ContentComments={ContentComments}
                                                                                    ContentCommentsEditBox={ContentCommentsEditBox}
                                                                                    data={struct.data.title}


                                                                                />
                                                                            );
                                                                            break;
                                                                        case "array":
                                                                            return (
                                                                                <ArrarExhibition value={struct.data[it]}
                                                                                                 type={it} key={t + "m"}
                                                                                                 ImgComment={ImgComment}
                                                                                                 name={item.name}
                                                                                                 commentChange={(value, p) => {
                                                                                                     struct.data.items[p].comment = value;
                                                                                                     this.commentChange({
                                                                                                         name: item.name,
                                                                                                         type: 'array',
                                                                                                         index: d,
                                                                                                         value: struct
                                                                                                     });
                                                                                                 }}
                                                                                                 ContentComments={ContentComments}
                                                                                                 index={d}/>
                                                                            );
                                                                            break;
                                                                    }
                                                                });
                                                                return (
                                                                    <div key={"d" + d}>
                                                                        <div className="thumbnail"
                                                                             style={{width: "375px"}}>
                                                                            {cont}
                                                                        </div>
                                                                        {data.length == (d + 1) ?
                                                                            <HintShow
                                                                                hint={StructCanvasModule.hint(data, props)}/> : undefined}
                                                                    </div>
                                                                );
                                                                break;
                                                            case "picture"://已处理
                                                                let images = struct.data.images;
                                                                let {comment} = images[0];
                                                                return (
                                                                    <div key={"d" + d}>
                                                                        {ContentComments ?
                                                                            <ImgComment disabled={this.state.disabled}
                                                                                        commentChange={value => {
                                                                                            struct.data.images[0].comment = value;
                                                                                            this.commentChange({
                                                                                                name: item.name,
                                                                                                type: 'array',
                                                                                                index: d,
                                                                                                value: struct
                                                                                            })
                                                                                        }} commentValue={comment}>
                                                                                <img src={images[0].picUrl}
                                                                                     className="imgShow"/>
                                                                            </ImgComment> : <img src={images[0].picUrl}
                                                                                                 className="imgShow"/>}

                                                                    </div>
                                                                );
                                                                break;
                                                            case "shop-inventory-separator"://已处理
                                                                return (
                                                                    <div key={"d" + d} className="external">
                                                                        <div
                                                                            className="topNum">top{struct.data.topNum}</div>
                                                                        <div className="topNum">————</div>
                                                                        {ContentComments ?
                                                                            <ContentCommentsEditBox
                                                                                disabled={this.state.disabled}
                                                                                data={struct.data.titleComment ? {
                                                                                    oldData: struct.data.title,
                                                                                    newData: struct.data.titleComment
                                                                                } : {oldData: struct.data.title}}
                                                                                onChange={(value) => {
                                                                                    struct.data.titleComment = value;
                                                                                    this.commentChange({
                                                                                        name: item.name,
                                                                                        type: 'array',
                                                                                        index: d,
                                                                                        value: struct
                                                                                    })
                                                                                }}/> :
                                                                            <div
                                                                                className="topNum">{struct.data.title}</div>}

                                                                    </div>
                                                                );
                                                                break;
                                                            case "two-column-items"://已处理
                                                                return (
                                                                    <div key={"d" + d} className="external">
                                                                        <Layout.Row gutter="2">
                                                                            {(struct.data.items ? struct.data.items : []).map((shop, s) => {
                                                                                let {comment} = shop;
                                                                                return (
                                                                                    <Layout.Col span="12" key={d + "s" + s}>
                                                                                        {ContentComments ?
                                                                                            <ImgComment
                                                                                                disabled={this.state.disabled}
                                                                                                commentChange={value => {
                                                                                                    struct.data.items[s].comment = value;
                                                                                                    this.commentChange({
                                                                                                        name: item.name,
                                                                                                        type: 'array',
                                                                                                        index: d,
                                                                                                        value: struct
                                                                                                    })
                                                                                                }}
                                                                                                commentValue={comment}>
                                                                                                <a href={shop.item ? shop.item.detailUrl : "#"}
                                                                                                   target="_blank"><img
                                                                                                    src={shop.item_pic}/></a>
                                                                                            </ImgComment> :
                                                                                            <a href={shop.item ? shop.item.detailUrl : "#"}
                                                                                               target="_blank"><img
                                                                                                src={shop.item_pic}/></a>}
                                                                                        {ContentComments ?
                                                                                            <ContentCommentsEditBox
                                                                                                disabled={this.state.disabled}
                                                                                                data={shop.item_titleComment ? {
                                                                                                    oldData: strLen(shop.item_title, 16),
                                                                                                    newData: shop.item_titleComment
                                                                                                } : {oldData: strLen(shop.item_title, 16)}}
                                                                                                onChange={(value) => {
                                                                                                    struct.data.items[s].item_titleComment = value;
                                                                                                    this.commentChange({
                                                                                                        name: item.name,
                                                                                                        type: 'array',
                                                                                                        index: d,
                                                                                                        value: struct
                                                                                                    })
                                                                                                }}/> :
                                                                                            <div
                                                                                                style={{opacity: "0.5"}}
                                                                                                title={shop.item_title}>{strLen(shop.item_title, 16)}</div>}
                                                                                        <div>￥{shop.item ? shop.item.price ? shop.item.price : shop.itemPriceDTO.price.item_price : "暂无"}</div>
                                                                                    </Layout.Col>
                                                                                )
                                                                            })}
                                                                        </Layout.Row>
                                                                    </div>
                                                                );
                                                                break;
                                                            case "weitao-item-pk"://已处理未测试
                                                                return (
                                                                    <div key={"d" + d} className="external"
                                                                         style={{position: "relation"}}>
                                                                        <div style={{
                                                                            border: " 0.5px solid rgb(249, 255, 110)",
                                                                            position: " absolute",
                                                                            boxSizing: " border-box",
                                                                            display: " flex",
                                                                            WebkitBoxOrient: " vertical",
                                                                            flexDirection: " column",
                                                                            alignContent: " flex-start",
                                                                            flexShrink: " 0",
                                                                            left: "249.5px",
                                                                            marginTop: " 88px",
                                                                            width: " 60px",
                                                                            height: " 60px",
                                                                            borderRadius: " 30px",
                                                                            padding: " 2.5px",
                                                                            transform: " translate(-50%, -50%)",
                                                                            zIndex: "100"
                                                                        }}>
                                                                <span style={{
                                                                    whiteSpace: " pre-wrap",
                                                                    border: " 0px solid black",
                                                                    position: " relative",
                                                                    boxSizing: " border-box",
                                                                    display: " inline-block",
                                                                    WebkitBoxOrient: " vertical",
                                                                    flexDirection: " column",
                                                                    alignContent: " flex-start",
                                                                    flexShrink: " 0",
                                                                    fontSize: " 25px",
                                                                    width: " 54px",
                                                                    height: " 54px",
                                                                    lineHeight: " 54px",
                                                                    textAlign: " center",
                                                                    borderRadius: " 27px",
                                                                    backgroundColor: " rgb(255, 144, 0)",
                                                                    backgroundImage: " linear-gradient(to right, rgb(255, 128, 0), rgb(255, 80, 0))",
                                                                    fontWeight: " 300",
                                                                    color: " rgb(255, 255, 255)",
                                                                }}>PK</span>
                                                                        </div>
                                                                        <Layout.Row gutter="2">
                                                                            {(struct.data.items ? struct.data.items : []).map((shop, s) => {
                                                                                let {comment} = shop;
                                                                                return (
                                                                                    <Layout.Col span="12" key={d + "s" + s}>
                                                                                        {ContentComments ?
                                                                                            <ImgComment
                                                                                                disabled={this.state.disabled}
                                                                                                commentChange={value => {
                                                                                                    struct.data.items[s].comment = value;
                                                                                                    this.commentChange({
                                                                                                        name: item.name,
                                                                                                        type: 'array',
                                                                                                        index: d,
                                                                                                        value: struct
                                                                                                    })
                                                                                                }}
                                                                                                commentValue={comment}>
                                                                                                <a href={shop.item ? shop.item.detailUrl : "#"}
                                                                                                   target="_blank"><img
                                                                                                    src={shop.item_pic}/></a>
                                                                                            </ImgComment> :
                                                                                            <a href={shop.item ? shop.item.detailUrl : "#"}
                                                                                               target="_blank"><img
                                                                                                src={shop.item_pic}/></a>}

                                                                                        {ContentComments ?
                                                                                            <ContentCommentsEditBox
                                                                                                disabled={this.state.disabled}
                                                                                                data={shop.item_titleComment ? {
                                                                                                    oldData: strLen(shop.item_title, 16),
                                                                                                    newData: shop.item_titleComment
                                                                                                } : {oldData: strLen(shop.item_title, 16)}}
                                                                                                onChange={(value) => {
                                                                                                    struct.data.items[s].item_titleComment = value;
                                                                                                    this.commentChange({
                                                                                                        name: item.name,
                                                                                                        type: 'array',
                                                                                                        index: d,
                                                                                                        value: struct
                                                                                                    })
                                                                                                }}/> :
                                                                                            <div
                                                                                                style={{opacity: "0.5"}}
                                                                                                title={shop.item_title}>{strLen(shop.item_title, 16)}</div>}
                                                                                        <div>￥{shop.item ? shop.item.price ? shop.item.price : shop.itemPriceDTO.price.item_price : "暂无"}</div>
                                                                                    </Layout.Col>
                                                                                )
                                                                            })}
                                                                        </Layout.Row>
                                                                    </div>
                                                                );
                                                                break;
                                                            case"weitao-ver-items"://已处理未测试
                                                                return (
                                                                    <div key={"d" + d} className="external">
                                                                        {(struct.data.products ? struct.data.products : []).map((shop, s) => {
                                                                            let {comment} = shop;
                                                                            return (
                                                                                <Layout.Row gutter="2" key={d + "s" + s} style={{margin: "2px 0"}}>
                                                                                    <Layout.Col span="8">
                                                                                        {ContentComments ?
                                                                                            <ImgComment
                                                                                                disabled={this.state.disabled}
                                                                                                commentChange={value => {
                                                                                                    struct.data.products[s].comment = value;
                                                                                                    this.commentChange({
                                                                                                        name: item.name,
                                                                                                        type: 'array',
                                                                                                        index: d,
                                                                                                        value: struct
                                                                                                    })
                                                                                                }}
                                                                                                commentValue={comment}>
                                                                                                <img
                                                                                                    src={shop.item_pic}/>
                                                                                            </ImgComment> :
                                                                                            <img src={shop.item_pic}/>}
                                                                                    </Layout.Col>
                                                                                    <Layout.Col span="16">
                                                                                        {ContentComments ?
                                                                                            <ContentCommentsEditBox
                                                                                                disabled={this.state.disabled}
                                                                                                data={shop.item_titleComment ? {
                                                                                                    oldData: strLen(shop.item_title, 16),
                                                                                                    newData: shop.item_titleComment
                                                                                                } : {oldData: strLen(shop.item_title, 16)}}
                                                                                                onChange={(value) => {
                                                                                                    struct.data.products[s].item_titleComment = value;
                                                                                                    this.commentChange({
                                                                                                        name: item.name,
                                                                                                        type: 'array',
                                                                                                        index: d,
                                                                                                        value: struct
                                                                                                    })
                                                                                                }}/> :
                                                                                            <div
                                                                                                style={{opacity: "0.5"}}
                                                                                                title={shop.item_title}>{strLen(shop.item_title, 16)}</div>}

                                                                                        <div>￥{shop.item ? shop.item.price : shop.itemPriceDTO.price.item_price}</div>
                                                                                    </Layout.Col>
                                                                                </Layout.Row>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                );
                                                                break;
                                                            case"weitao-score-range"://已处理未测试
                                                                return (
                                                                    <div key={"d" + d} className="external">
                                                                        {struct.data.scores.map((shop, s) => {
                                                                            return(
                                                                                <Layout.Row gutter="2" key={"s" + s}>
                                                                                    <Layout.Col span="10">
                                                                                        {ContentComments ?
                                                                                            <ContentCommentsEditBox
                                                                                                disabled={this.state.disabled}
                                                                                                data={shop.item_titleComment ? {
                                                                                                    oldData: shop.item_title,
                                                                                                    newData: shop.item_titleComment
                                                                                                } : {oldData: shop.item_title}}
                                                                                                onChange={(value) => {
                                                                                                    struct.data.scores[s].item_titleComment = value;
                                                                                                    this.commentChange({
                                                                                                        name: item.name,
                                                                                                        type: 'array',
                                                                                                        index: d,
                                                                                                        value: struct
                                                                                                    })
                                                                                                }}/> :
                                                                                            shop.item_title}
                                                                                    </Layout.Col>
                                                                                    <Layout.Col span="4">
                                                                                        {ContentComments ?
                                                                                            <ContentCommentsEditBox
                                                                                                disabled={this.state.disabled}
                                                                                                data={shop.item_scoreComment ? {
                                                                                                    oldData: shop.item_score,
                                                                                                    newData: shop.item_scoreComment
                                                                                                } : {oldData: shop.item_title}}
                                                                                                onChange={(value) => {
                                                                                                    struct.data.scores[s].item_scoreComment = value;
                                                                                                    this.commentChange({
                                                                                                        name: item.name,
                                                                                                        type: 'array',
                                                                                                        index: d,
                                                                                                        value: struct
                                                                                                    })
                                                                                                }}/> :
                                                                                            shop.item_score}
                                                                                        分
                                                                                    </Layout.Col>
                                                                                    <Layout.Col span="10">
                                                                                        <Rate value={shop.item_score} disabled/>
                                                                                    </Layout.Col>
                                                                                </Layout.Row>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                );
                                                                break;
                                                            case"ceping-separator1"://无需处理
                                                            case"ceping-separator2":
                                                            case"ceping-separator3":
                                                                let obj = {
                                                                    "ceping-separator1": {top: "01", title: "评测选品"},
                                                                    "ceping-separator2": {top: "02", title: "评测维度"},
                                                                    "ceping-separator3": {top: "03", title: "评测结果"}
                                                                };
                                                                return (
                                                                    <div key={"d" + d} className="external">
                                                                        <div
                                                                            className="topNum">{obj[struct.name].top}</div>
                                                                        <div className="topNum">————</div>
                                                                        <div
                                                                            className="topNum">{obj[struct.name].title}</div>
                                                                    </div>
                                                                );
                                                                break;
                                                            case "content-shop"://已处理未测试
                                                                return (
                                                                    <div key={"d" + d} className="external">
                                                                        {(struct.data.shopDetail ? struct.data.shopDetail : []).map((shop, s) => {
                                                                            let {comment} = shop;
                                                                            return (
                                                                                <Layout.Row gutter="2" key={"s" + s}>
                                                                                    <Layout.Col span="6">
                                                                                        {ContentComments ?
                                                                                            <ImgComment
                                                                                                disabled={this.state.disabled}
                                                                                                commentChange={value => {
                                                                                                    struct.data.shopDetail[s].comment = value;
                                                                                                    this.commentChange({
                                                                                                        name: item.name,
                                                                                                        type: 'array',
                                                                                                        index: d,
                                                                                                        value: struct
                                                                                                    })
                                                                                                }}
                                                                                                commentValue={comment}>
                                                                                                <img
                                                                                                    src={shop.shop_logo}/>
                                                                                            </ImgComment> :
                                                                                            <img src={shop.shop_logo}/>}
                                                                                    </Layout.Col>
                                                                                    <Layout.Col span="18">
                                                                                        {ContentComments ?
                                                                                            <ContentCommentsEditBox
                                                                                                disabled={this.state.disabled}
                                                                                                data={shop.shop_titleComment ? {
                                                                                                    oldData: shop.shop_title,
                                                                                                    newData: shop.shop_titleComment
                                                                                                } : {oldData: shop.shop_title}}
                                                                                                onChange={(value) => {
                                                                                                    struct.data.shopDetail[s].shop_titleComment = value;
                                                                                                    this.commentChange({
                                                                                                        name: item.name,
                                                                                                        type: 'array',
                                                                                                        index: d,
                                                                                                        value: struct
                                                                                                    })
                                                                                                }}/> :
                                                                                            <div
                                                                                                style={{fontSize: "15px"}}>{shop.shop_title}</div>}

                                                                                        {ContentComments ?
                                                                                            <ContentCommentsEditBox
                                                                                                disabled={this.state.disabled}
                                                                                                data={shop.shop_descComment ? {
                                                                                                    oldData: shop.shop_desc,
                                                                                                    newData: shop.shop_descComment
                                                                                                } : {oldData: shop.shop_desc}}
                                                                                                onChange={(value) => {
                                                                                                    struct.data.shopDetail[s].shop_descComment = value;
                                                                                                    this.commentChange({
                                                                                                        name: item.name,
                                                                                                        type: 'array',
                                                                                                        index: d,
                                                                                                        value: struct
                                                                                                    })
                                                                                                }}/> :
                                                                                            <div
                                                                                                style={{fontSize: "11px"}}>{shop.shop_desc}</div>}
                                                                                    </Layout.Col>
                                                                                </Layout.Row>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                );
                                                                break;
                                                            case "paragraph"://已处理
                                                                return (
                                                                    <div key={"d" + d} className="external">
                                                                        {ContentComments ?
                                                                            <ContentCommentsEditBox
                                                                                disabled={this.state.disabled}
                                                                                data={struct.data.textComment ? {
                                                                                    oldData: struct.data.text,
                                                                                    newData: struct.data.textComment
                                                                                } : {oldData: struct.data.text}}
                                                                                onChange={(value) => {
                                                                                    struct.data.textComment = value;
                                                                                    this.commentChange({
                                                                                        name: item.name,
                                                                                        type: 'array',
                                                                                        index: d,
                                                                                        value: struct
                                                                                    })
                                                                                }}/> :
                                                                            <div
                                                                                style={{margin: "5px 0"}}>{struct.data.text}</div>}
                                                                    </div>
                                                                );
                                                                break;
                                                            case "item-paragraph"://已处理
                                                                return (
                                                                    <div key={"d" + d} className="external">
                                                                        {ContentComments ?
                                                                            <ContentCommentsEditBox
                                                                                disabled={this.state.disabled}
                                                                                data={struct.data.textComment ? {
                                                                                    oldData: struct.data.title,
                                                                                    newData: struct.data.titleComment
                                                                                } : {oldData: struct.data.title}}
                                                                                onChange={(value) => {
                                                                                    struct.data.titleComment = value;
                                                                                    this.commentChange({
                                                                                        name: item.name,
                                                                                        type: 'array',
                                                                                        index: d,
                                                                                        value: struct
                                                                                    })
                                                                                }}/> :
                                                                            <div
                                                                                className="topNum">{struct.data.title}</div>}

                                                                        <div className="topNum">————— ○ —————</div>

                                                                        {ContentComments ?
                                                                            <ContentCommentsEditBox
                                                                                disabled={this.state.disabled}
                                                                                data={struct.data.descComment ? {
                                                                                    oldData: struct.data.desc,
                                                                                    newData: struct.data.descComment
                                                                                } : {oldData: struct.data.desc}}
                                                                                onChange={(value) => {
                                                                                    struct.data.descComment = value;
                                                                                    this.commentChange({
                                                                                        name: item.name,
                                                                                        type: 'array',
                                                                                        index: d,
                                                                                        value: struct
                                                                                    })
                                                                                }}/> :
                                                                            <div>{struct.data.desc}</div>}

                                                                        {(struct.data.images ? struct.data.images : []).map((image, m) => {
                                                                            let {comment} = image;
                                                                            return (
                                                                                <div key={m}>
                                                                                    {ContentComments ?
                                                                                        <ImgComment
                                                                                            disabled={this.state.disabled}
                                                                                            commentChange={value => {
                                                                                                struct.data.images[m].comment = value;
                                                                                                this.commentChange({
                                                                                                    name: item.name,
                                                                                                    type: 'array',
                                                                                                    index: d,
                                                                                                    value: struct
                                                                                                })
                                                                                            }} commentValue={comment}>
                                                                                            <img src={image.picUrl}/>
                                                                                        </ImgComment> :
                                                                                        <img src={image.picUrl}/>}
                                                                                </div>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                );
                                                                break;
                                                            case "item-paragraph-select"://已处理
                                                                return (
                                                                    <div key={"d" + d} className="external">
                                                                        {ContentComments ?
                                                                            <ContentCommentsEditBox
                                                                                disabled={this.state.disabled}
                                                                                data={struct.data.textComment ? {
                                                                                    oldData: struct.data.title,
                                                                                    newData: struct.data.titleComment
                                                                                } : {oldData: struct.data.title}}
                                                                                onChange={(value) => {
                                                                                    struct.data.titleComment = value;
                                                                                    this.commentChange({
                                                                                        name: item.name,
                                                                                        type: 'array',
                                                                                        index: d,
                                                                                        value: struct
                                                                                    })
                                                                                }}/> :
                                                                            <div
                                                                                className="topNum">{struct.data.title}</div>}
                                                                        <div className="topNum">————— ○ —————</div>

                                                                        {ContentComments ?
                                                                            <ContentCommentsEditBox
                                                                                disabled={this.state.disabled}
                                                                                data={struct.data.descComment ? {
                                                                                    oldData: struct.data.desc,
                                                                                    newData: struct.data.descComment
                                                                                } : {oldData: struct.data.desc}}
                                                                                onChange={(value) => {
                                                                                    struct.data.descComment = value;
                                                                                    this.commentChange({
                                                                                        name: item.name,
                                                                                        type: 'array',
                                                                                        index: d,
                                                                                        value: struct
                                                                                    })
                                                                                }}/> :
                                                                            <div>{struct.data.desc}</div>}

                                                                        {(struct.data.images ? struct.data.images : []).map((image, im) => {
                                                                            let {comment} = image;
                                                                            return (
                                                                                <div key={im}>
                                                                                    {ContentComments ?
                                                                                        <ImgComment
                                                                                            disabled={this.state.disabled}
                                                                                            commentChange={value => {
                                                                                                struct.data.images[im].comment = value;
                                                                                                this.commentChange({
                                                                                                    name: item.name,
                                                                                                    type: 'array',
                                                                                                    index: d,
                                                                                                    value: struct
                                                                                                })
                                                                                            }} commentValue={comment}>
                                                                                            <img src={image.picUrl}/>
                                                                                        </ImgComment> :
                                                                                        <img src={image.picUrl}/>}
                                                                                </div>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                );
                                                                break;
                                                            case "item-feature"://已处理
                                                                return (
                                                                    <div key={"d" + d} className="external">
                                                                        {(struct.data.features instanceof Array?struct.data.features:[]).map((feature, f) => {
                                                                            struct.data.featuresComment = struct.data.featuresComment ? struct.data.featuresComment : {};
                                                                            return (
                                                                                <div key={f} data-id={"pic" + f}>
                                                                                    {/*○*/} {ContentComments ?
                                                                                    <ContentCommentsEditBox
                                                                                        disabled={this.state.disabled}
                                                                                        data={struct.data.featuresComment[f] ? {
                                                                                            oldData: feature,
                                                                                            newData: struct.data.featuresComment[f]
                                                                                        } : {oldData: feature}}
                                                                                        onChange={(value) => {
                                                                                            struct.data.featuresComment[f] = value;
                                                                                            this.commentChange({
                                                                                                name: item.name,
                                                                                                type: 'array',
                                                                                                index: d,
                                                                                                value: struct
                                                                                            })
                                                                                        }}/> : feature}
                                                                                </div>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                );
                                                                break;
                                                            case "need-content-bpu"://已处理未测试
                                                                let items = struct.data;
                                                                return (
                                                                    <div key={"d" + d} className="external">
                                                                        <Layout.Row gutter="2">
                                                                            <Layout.Col span="24">
                                                                                <Tag type="gray">{"top " + (items.topNum > 9 ? items.topNum : "0" + items.topNum)}</Tag>
                                                                                {ContentComments ?
                                                                                    <ContentCommentsEditBox
                                                                                        disabled={this.state.disabled}
                                                                                        data={struct.data.titleComment ? {
                                                                                            oldData: items.title,
                                                                                            newData: struct.data.titleComment
                                                                                        } : {oldData: items.title}}
                                                                                        onChange={(value) => {
                                                                                            struct.data.title = value;
                                                                                            this.commentChange({
                                                                                                name: item.name,
                                                                                                type: 'array',
                                                                                                index: d,
                                                                                                value: struct
                                                                                            })
                                                                                        }}/> : items.title}
                                                                            </Layout.Col>
                                                                            <Layout.Col span="24">
                                                                                <h3>上榜理由：
                                                                                    {ContentComments ?
                                                                                        <ContentCommentsEditBox
                                                                                            disabled={this.state.disabled}
                                                                                            data={struct.data.descriptionComment ? {
                                                                                                oldData: items.description,
                                                                                                newData: struct.data.descriptionComment
                                                                                            } : {oldData: items.description}}
                                                                                            onChange={(value) => {
                                                                                                struct.data.description = value;
                                                                                                this.commentChange({
                                                                                                    name: item.name,
                                                                                                    type: 'array',
                                                                                                    index: d,
                                                                                                    value: struct
                                                                                                })
                                                                                            }}/> : items.description}
                                                                                </h3>
                                                                            </Layout.Col>
                                                                        </Layout.Row>
                                                                        {items.item[0].itemBrand ? "|" + items.item[0].itemBrand.brandName : ""}
                                                                        <Layout.Row gutter="2">
                                                                            <Layout.Col span="10">
                                                                                {ContentComments ?
                                                                                    <ImgComment
                                                                                        disabled={this.state.disabled}
                                                                                        commentChange={value => {
                                                                                            struct.data.item[0].comment = value;
                                                                                            this.commentChange({
                                                                                                name: item.name,
                                                                                                type: 'array',
                                                                                                index: d,
                                                                                                value: struct
                                                                                            })
                                                                                        }}
                                                                                        commentValue={items.item[0].comment}>
                                                                                        <img
                                                                                            src={items.item[0].spu_pic}/>
                                                                                    </ImgComment> :
                                                                                    <img src={items.item[0].spu_pic}/>}
                                                                            </Layout.Col>
                                                                            <Layout.Col span="14">
                                                                                {items.rates.map((shop, s) => {
                                                                                    return (
                                                                                        <Layout.Row gutter="2" key={"s" + s} style={{margin: "3px 0"}}>
                                                                                            <Layout.Col span="10">
                                                                                                {ContentComments ?
                                                                                                    <ContentCommentsEditBox
                                                                                                        disabled={this.state.disabled}
                                                                                                        data={shop.rateTitleComment ? {
                                                                                                            oldData: shop.rateTitle,
                                                                                                            newData: shop.rateTitleComment
                                                                                                        } : {oldData: shop.rateTitle}}
                                                                                                        onChange={(value) => {
                                                                                                            struct.data.items.rates[s].rateTitleComment = value;
                                                                                                            this.commentChange({
                                                                                                                name: item.name,
                                                                                                                type: 'array',
                                                                                                                index: d,
                                                                                                                value: struct
                                                                                                            })
                                                                                                        }}/> : shop.rateTitle}
                                                                                            </Layout.Col>
                                                                                            <Layout.Col span="14">
                                                                                                <Rate value={shop.rateScore} showText={true}
                                                                                                      texts={['1分', '2分', '3分', '4分', '5分']} disabled/>
                                                                                            </Layout.Col>
                                                                                        </Layout.Row>
                                                                                    )
                                                                                })}
                                                                                <Button type="primary" size="small">立即购买</Button>
                                                                            </Layout.Col>
                                                                        </Layout.Row>
                                                                    </div>
                                                                );
                                                                break;
                                                            case "calendar-header-card"://每日神店头部（已处理未测试 ）
                                                                let cardData = struct.data;
                                                                return (
                                                                    <div key={"d" + d}>
                                                                        <div style={{
                                                                            border: "0px solid black",
                                                                            position: "relative",
                                                                            boxSizing: "border-box",
                                                                            display: "flex",
                                                                            WebkitBoxOrient: "vertical",
                                                                            flexDirection: "column",
                                                                            alignContent: "flex-start",
                                                                            flexShrink: "0",
                                                                            backgroundColor: "rgb(255, 255, 255)",
                                                                            width: "406px"
                                                                        }}>
                                                                            {ContentComments ?
                                                                                <ImgComment
                                                                                    disabled={this.state.disabled}
                                                                                    commentChange={value => {
                                                                                        struct.data.comment = value;
                                                                                        this.commentChange({
                                                                                            name: item.name,
                                                                                            type: 'array',
                                                                                            index: d,
                                                                                            value: struct
                                                                                        })
                                                                                    }} commentValue={cardData.comment}>
                                                                                    <img style={{
                                                                                        padding: "1px",
                                                                                        width: "100%"
                                                                                    }}
                                                                                         src={cardData.backgroundImg[0].picUrl}/>
                                                                                </ImgComment> : <img style={{
                                                                                    padding: "1px",
                                                                                    width: "100%"
                                                                                }}
                                                                                                     src={cardData.backgroundImg[0].picUrl}/>}

                                                                            <div style={{
                                                                                border: "0px solid black",
                                                                                position: "absolute",
                                                                                boxSizing: "border-box",
                                                                                display: "flex",
                                                                                WebkitBoxOrient: "horizontal",
                                                                                flexDirection: "row",
                                                                                alignContent: "flex-start",
                                                                                flexShrink: "0",
                                                                                height: "52px",
                                                                                top: "73.5px"
                                                                            }}>
                                                                                <div style={{
                                                                                    border: "0px solid black",
                                                                                    position: "relative",
                                                                                    boxSizing: "border-box",
                                                                                    display: "flex",
                                                                                    WebkitBoxOrient: "vertical",
                                                                                    flexDirection: "column",
                                                                                    placeContent: "flex-start center",
                                                                                    flexShrink: "0",
                                                                                    marginTop: "0px",
                                                                                    height: "52px",
                                                                                    paddingLeft: "13px",
                                                                                    paddingRight: "30px",
                                                                                    WebkitBoxAlign: "start",
                                                                                    alignItems: "flex-start",
                                                                                    WebkitBoxPack: "center",
                                                                                    opacity: "0.9",
                                                                                    backgroundColor: "rgb(207, 181, 137)",
                                                                                    borderRadius: "0px 50px 50px 0px"
                                                                                }}>
                                                                    <span style={{
                                                                        whiteSpace: "pre-wrap",
                                                                        border: "0px solid black",
                                                                        position: "relative",
                                                                        boxSizing: "border-box",
                                                                        display: "block",
                                                                        WebkitBoxOrient: "vertical",
                                                                        flexDirection: "column",
                                                                        alignContent: "flex-start",
                                                                        flexShrink: "0",
                                                                        fontSize: "22px",
                                                                        fontFamily: "PingFangSC-Medium",
                                                                        color: "rgb(47, 29, 6)"
                                                                    }}>
                                                                        {ContentComments ?
                                                                            <ContentCommentsEditBox
                                                                                disabled={this.state.disabled}
                                                                                data={cardData.labelTitleComment ? {
                                                                                    oldData: cardData.labelTitle,
                                                                                    newData: cardData.labelTitleComment
                                                                                } : {oldData: cardData.labelTitle}}
                                                                                onChange={(value) => {
                                                                                    struct.data.labelTitleComment = value;
                                                                                    this.commentChange({
                                                                                        name: item.name,
                                                                                        type: 'array',
                                                                                        index: d,
                                                                                        value: struct
                                                                                    })
                                                                                }}/> : cardData.labelTitle}
                                                                        </span>
                                                                                </div>
                                                                            </div>
                                                                            <div style={{
                                                                                border: "0px solid black",
                                                                                position: "absolute",
                                                                                boxSizing: "border-box",
                                                                                display: "flex",
                                                                                WebkitBoxOrient: "vertical",
                                                                                flexDirection: "column",
                                                                                placeContent: "flex-start center",
                                                                                flexShrink: "0",
                                                                                height: "667px",
                                                                                top: "0px",
                                                                                left: "0px",
                                                                                width: "406px",
                                                                                WebkitBoxPack: "center",
                                                                                WebkitBoxAlign: "center",
                                                                                alignItems: "center"
                                                                            }}>
                                                                                <div style={{
                                                                                    border: "0px solid black",
                                                                                    position: "relative",
                                                                                    boxSizing: "border-box",
                                                                                    display: "flex",
                                                                                    WebkitBoxOrient: "horizontal",
                                                                                    flexDirection: "row",
                                                                                    placeContent: "flex-start center",
                                                                                    flexShrink: "0",
                                                                                    width: "406px",
                                                                                    height: "420.5px",
                                                                                    marginTop: "80px",
                                                                                    WebkitBoxPack: "center"
                                                                                }}>
                                                                                    <div style={{
                                                                                        border: "0px solid black",
                                                                                        position: "relative",
                                                                                        boxSizing: "border-box",
                                                                                        display: "flex",
                                                                                        WebkitBoxOrient: "vertical",
                                                                                        flexDirection: "column",
                                                                                        placeContent: "flex-start",
                                                                                        flexShrink: "0",
                                                                                        width: "406px",
                                                                                        height: "420.5px",
                                                                                        WebkitBoxPack: "start"
                                                                                    }}>
                                                                                        <div style={{
                                                                                            border: "0px solid black",
                                                                                            position: "relative",
                                                                                            boxSizing: "border-box",
                                                                                            display: "flex",
                                                                                            WebkitBoxOrient: "horizontal",
                                                                                            flexDirection: "row",
                                                                                            placeContent: "flex-start space-between",
                                                                                            flexShrink: "0",
                                                                                            marginTop: "140px",
                                                                                            marginBottom: "3px",
                                                                                            WebkitBoxPack: "justify",
                                                                                            paddingLeft: "7px",
                                                                                            paddingRight: "418px",
                                                                                            width: "406px",
                                                                                            WebkitBoxAlign: "center",
                                                                                            alignItems: "center"
                                                                                        }}>
                                                                                <span style={{
                                                                                    whiteSpace: "nowrap",
                                                                                    border: "0px solid black",
                                                                                    position: "relative",
                                                                                    boxSizing: "border-box",
                                                                                    display: "block",
                                                                                    WebkitBoxOrient: "vertical",
                                                                                    flexDirection: "column",
                                                                                    alignContent: "flex-start",
                                                                                    flexShrink: "0",
                                                                                    fontSize: "12px",
                                                                                    color: "rgb(51, 51, 51)",
                                                                                    fontWeight: "400",
                                                                                    overflow: "hidden"
                                                                                }}>掌柜吆喝</span>
                                                                                            <img
                                                                                                src="//gw.alicdn.com/tfs/TB1E5BNpMmTBuNjy1XbXXaMrVXa-26-24.png_110x10000.jpg"
                                                                                                style={{
                                                                                                    display: "flex",
                                                                                                    width: "11.5px",
                                                                                                    height: "11.5px",
                                                                                                    marginLeft: "1px"
                                                                                                }}/>
                                                                                        </div>
                                                                                        <img
                                                                                            src="//gw.alicdn.com/tfs/TB1l9wQqgmTBuNjy1XbXXaMrVXa-37-28.png_110x10000.jpg"
                                                                                            style={{
                                                                                                display: "flex",
                                                                                                width: "15px",
                                                                                                height: "11.5px",
                                                                                                position: "absolute",
                                                                                                top: "168px",
                                                                                                left: "6.5px"
                                                                                            }}/>
                                                                                        <span style={{
                                                                                            whiteSpace: "pre-wrap",
                                                                                            border: "0px solid black",
                                                                                            position: "relative",
                                                                                            boxSizing: "border-box",
                                                                                            display: "-webkit-box",
                                                                                            WebkitBoxOrient: "vertical",
                                                                                            flexDirection: "column",
                                                                                            alignContent: "flex-start",
                                                                                            flexShrink: "0",
                                                                                            fontSize: "20px",
                                                                                            width: "443px",
                                                                                            height: "52px",
                                                                                            color: "rgb(26, 26, 26)",
                                                                                            letterSpacing: "0.485px",
                                                                                            lineHeight: "26px",
                                                                                            fontWeight: "500",
                                                                                            marginLeft: "6px",
                                                                                            marginTop: "0px",
                                                                                            WebkitLineClamp: "2",
                                                                                            overflow: "hidden"
                                                                                        }}>
                                                                                &nbsp;&nbsp;&nbsp;&nbsp;
                                                                                            {ContentComments ?
                                                                                                <ContentCommentsEditBox
                                                                                                    disabled={this.state.disabled}
                                                                                                    data={cardData.titleComment ? {
                                                                                                        oldData: cardData.title,
                                                                                                        newData: cardData.titleComment
                                                                                                    } : {oldData: cardData.title}}
                                                                                                    onChange={(value) => {
                                                                                                        struct.data.titleComment = value;
                                                                                                        this.commentChange({
                                                                                                            name: item.name,
                                                                                                            type: 'array',
                                                                                                            index: d,
                                                                                                            value: struct
                                                                                                        })
                                                                                                    }}/> : cardData.title}
                                                                            </span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div style={{
                                                                                border: "0px solid black",
                                                                                boxSizing: "border-box",
                                                                                display: "flex",
                                                                                WebkitBoxOrient: "horizontal",
                                                                                flexDirection: "row",
                                                                                placeContent: "flex-start",
                                                                                flexShrink: "0",
                                                                                marginTop: "5px",
                                                                                marginBottom: "5px",
                                                                                WebkitBoxPack: "start",
                                                                                WebkitBoxAlign: "center",
                                                                                alignItems: "center"
                                                                            }}>
                                                                                <img
                                                                                    src="//gw.alicdn.com/tfs/TB16HrgnXuWBuNjSspnXXX1NVXa-62-56.png_110x10000.jpg"
                                                                                    style={{
                                                                                        display: "flex",
                                                                                        width: "15px",
                                                                                        height: "14px",
                                                                                        marginLeft: "7.5px"
                                                                                    }}/>
                                                                                <span style={{
                                                                                    whiteSpace: "nowrap",
                                                                                    border: "0px solid black",
                                                                                    boxSizing: "border-box",
                                                                                    display: "block",
                                                                                    WebkitBoxOrient: "vertical",
                                                                                    flexDirection: "column",
                                                                                    alignContent: "flex-start",
                                                                                    flexShrink: "0",
                                                                                    fontSize: "14px",
                                                                                    color: "rgb(155, 155, 155)",
                                                                                    letterSpacing: "0px",
                                                                                    textAlign: "right",
                                                                                    fontWeight: "200",
                                                                                    maxWidth: "200px",
                                                                                    textOverflow: "ellipsis",
                                                                                    marginTop: "1.5px",
                                                                                    overflow: "hidden"
                                                                                }}>
                                                                            {ContentComments ?
                                                                                <ContentCommentsEditBox
                                                                                    disabled={this.state.disabled}
                                                                                    data={cardData.titleComment ? {
                                                                                        oldData: cardData.shopDetail[0].shop_title,
                                                                                        newData: cardData.shopDetail[0].shop_titleComment
                                                                                    } : {oldData: cardData.shopDetail[0].shop_title}}
                                                                                    onChange={(value) => {
                                                                                        struct.data.shopDetail[0].shop_titleComment = value;
                                                                                        this.commentChange({
                                                                                            name: item.name,
                                                                                            type: 'array',
                                                                                            index: d,
                                                                                            value: struct
                                                                                        })
                                                                                    }}/> : cardData.shopDetail[0].shop_title}
                                                                            </span>
                                                                                <span style={{
                                                                                    whiteSpace: "nowrap",
                                                                                    border: "0px solid black",
                                                                                    boxSizing: "border-box",
                                                                                    display: "block",
                                                                                    WebkitBoxOrient: "vertical",
                                                                                    flexDirection: "column",
                                                                                    alignContent: "flex-start",
                                                                                    flexShrink: "0",
                                                                                    fontSize: "16px",
                                                                                    marginLeft: "5px",
                                                                                    marginRight: "5px",
                                                                                    color: "rgb(155, 155, 155)",
                                                                                    fontWeight: "200",
                                                                                    overflow: "hidden"
                                                                                }}>|</span>
                                                                                <span style={{
                                                                                    whiteSpace: "nowrap",
                                                                                    border: "0px solid black",
                                                                                    boxSizing: "border-box",
                                                                                    display: "block",
                                                                                    WebkitBoxOrient: "vertical",
                                                                                    flexDirection: "column",
                                                                                    alignContent: "flex-start",
                                                                                    flexShrink: "0",
                                                                                    fontSize: "14px",
                                                                                    color: "rgb(155, 155, 155)",
                                                                                    letterSpacing: "0px",
                                                                                    textAlign: "right",
                                                                                    fontWeight: "200",
                                                                                    maxWidth: "200px",
                                                                                    textOverflow: "ellipsis",
                                                                                    marginTop: "1.5px",
                                                                                    overflow: "hidden"
                                                                                }}>
                                                                            {ContentComments ?
                                                                                <ContentCommentsEditBox
                                                                                    disabled={this.state.disabled}
                                                                                    data={cardData.tagComment ? {
                                                                                        oldData: cardData.tag,
                                                                                        newData: cardData.tagComment
                                                                                    } : {oldData: cardData.tag}}
                                                                                    onChange={(value) => {
                                                                                        struct.data.shopDetail[0].shop_titleComment = value;
                                                                                        this.commentChange({
                                                                                            name: item.name,
                                                                                            type: 'array',
                                                                                            index: d,
                                                                                            value: struct
                                                                                        })
                                                                                    }}/> : cardData.tag}
                                                                            </span>
                                                                            </div>
                                                                            <div style={{
                                                                                border: "0px solid black",
                                                                                position: "relative",
                                                                                boxSizing: "border-box",
                                                                                display: "flex",
                                                                                WebkitBoxOrient: "horizontal",
                                                                                flexDirection: "row",
                                                                                placeContent: "flex-start space-between",
                                                                                flexShrink: "0",
                                                                                marginTop: "0px",
                                                                                WebkitBoxPack: "justify",
                                                                                paddingLeft: "3.5px",
                                                                                paddingRight: "3px",
                                                                                width: "349px"
                                                                            }}>
                                                                                {ContentComments ?
                                                                                    <ImgComment
                                                                                        disabled={this.state.disabled}
                                                                                        commentChange={value => {
                                                                                            struct.data.firstGoods[0].comment = value;
                                                                                            this.commentChange({
                                                                                                name: item.name,
                                                                                                type: 'array',
                                                                                                index: d,
                                                                                                value: struct
                                                                                            })
                                                                                        }}
                                                                                        commentValue={cardData.firstGoods[0].comment}>
                                                                                        <img
                                                                                            src={cardData.firstGoods[0].item_pic}
                                                                                            style={{
                                                                                                display: "flex",
                                                                                                width: "120px",
                                                                                                height: "120px"
                                                                                            }}/>
                                                                                    </ImgComment> : <img
                                                                                        src={cardData.firstGoods[0].item_pic}
                                                                                        style={{
                                                                                            display: "flex",
                                                                                            width: "120px",
                                                                                            height: "120px"
                                                                                        }}/>}
                                                                            </div>
                                                                            <span style={{margin: "0 2px"}}>
                                                                         {ContentComments ?
                                                                             <ContentCommentsEditBox
                                                                                 disabled={this.state.disabled}
                                                                                 data={cardData.summaryComment ? {
                                                                                     oldData: cardData.summary,
                                                                                     newData: cardData.summaryComment
                                                                                 } : {oldData: cardData.summary}}
                                                                                 onChange={(value) => {
                                                                                     struct.data.summaryComment = value;
                                                                                     this.commentChange({
                                                                                         name: item.name,
                                                                                         type: 'array',
                                                                                         index: d,
                                                                                         value: struct
                                                                                     })
                                                                                 }}/> : cardData.summary}

                                                                </span>
                                                                            <img src={creationShop}
                                                                                 style={{width: "100%"}}/>
                                                                        </div>
                                                                    </div>
                                                                );
                                                                break;
                                                            case "goodshop-shendian-shop"://每日神店（已处理未测试）
                                                                let shendianData = struct.data;
                                                                return (
                                                                    <div key={"d" + d} className="external">
                                                                        <img src={shop1} style={{width: "100%"}}/>
                                                                        <div style={{
                                                                            border: "0px solid black",
                                                                            position: "relative",
                                                                            boxSizing: "border-box",
                                                                            display: "flex",
                                                                            WebkitBoxOrient: "vertical",
                                                                            flexDirection: "column",
                                                                            alignContent: "flex-start",
                                                                            flexShrink: "0",
                                                                            backgroundColor: "rgb(255, 255, 255)",
                                                                            width: "406px"
                                                                        }}>
                                                                            <img style={{
                                                                                height: "200px",
                                                                                width: "402px",
                                                                                marginLeft: "1px",
                                                                                backgroundImage: 'url("' + shendianData.shop_cover[0].picUrl + '")',
                                                                                backgroundPosition: "center"
                                                                            }}/>
                                                                            <div style={{
                                                                                border: "0px solid black",
                                                                                position: "absolute",
                                                                                boxSizing: "border-box",
                                                                                display: "flex",
                                                                                WebkitBoxOrient: "vertical",
                                                                                flexDirection: "column",
                                                                                placeContent: "flex-start center",
                                                                                flexShrink: "0",
                                                                                height: "100px",
                                                                                top: "0px",
                                                                                left: "0px",
                                                                                width: "406px",
                                                                                WebkitBoxPack: "center",
                                                                                WebkitBoxAlign: "center",
                                                                                alignItems: "center"
                                                                            }}>
                                                                                <div style={{
                                                                                    border: "0px solid black",
                                                                                    position: "relative",
                                                                                    boxSizing: "border-box",
                                                                                    display: "flex",
                                                                                    WebkitBoxOrient: "horizontal",
                                                                                    flexDirection: "row",
                                                                                    placeContent: "flex-start center",
                                                                                    flexShrink: "0",
                                                                                    width: "406px",
                                                                                    height: "420.5px",
                                                                                    marginTop: "80px",
                                                                                    WebkitBoxPack: "center"
                                                                                }}>
                                                                                    <div style={{
                                                                                        border: "0px solid black",
                                                                                        position: "relative",
                                                                                        boxSizing: "border-box",
                                                                                        display: "flex",
                                                                                        WebkitBoxOrient: "vertical",
                                                                                        flexDirection: "column",
                                                                                        placeContent: "flex-start",
                                                                                        flexShrink: "0",
                                                                                        width: "406px",
                                                                                        height: "420.5px",
                                                                                        WebkitBoxPack: "start"
                                                                                    }}>
                                                                                        <div style={{
                                                                                            border: "0px solid black",
                                                                                            position: "relative",
                                                                                            boxSizing: "border-box",
                                                                                            display: "flex",
                                                                                            WebkitBoxOrient: "horizontal",
                                                                                            flexDirection: "row",
                                                                                            placeContent: "flex-start space-between",
                                                                                            flexShrink: "0",
                                                                                            marginTop: "222px",
                                                                                            marginBottom: "3px",
                                                                                            WebkitBoxPack: "justify",
                                                                                            paddingLeft: "7px",
                                                                                            paddingRight: "418px",
                                                                                            width: "406px",
                                                                                            WebkitBoxAlign: "center",
                                                                                            alignItems: "center"
                                                                                        }}>
                                                                                <span style={{
                                                                                    whiteSpace: "nowrap",
                                                                                    border: "0px solid black",
                                                                                    position: "relative",
                                                                                    boxSizing: "border-box",
                                                                                    display: "block",
                                                                                    WebkitBoxOrient: "vertical",
                                                                                    flexDirection: "column",
                                                                                    alignContent: "flex-start",
                                                                                    flexShrink: "0",
                                                                                    fontSize: "12px",
                                                                                    color: "rgb(51, 51, 51)",
                                                                                    fontWeight: "400",
                                                                                    overflow: "hidden"
                                                                                }}>掌柜吆喝</span>
                                                                                            <img
                                                                                                src="//gw.alicdn.com/tfs/TB1E5BNpMmTBuNjy1XbXXaMrVXa-26-24.png_110x10000.jpg"
                                                                                                style={{
                                                                                                    display: "flex",
                                                                                                    width: "11.5px",
                                                                                                    height: "11.5px",
                                                                                                    marginLeft: "1px"
                                                                                                }}/>
                                                                                        </div>
                                                                                        <img
                                                                                            src="//gw.alicdn.com/tfs/TB1l9wQqgmTBuNjy1XbXXaMrVXa-37-28.png_110x10000.jpg"
                                                                                            style={{
                                                                                                display: "flex",
                                                                                                width: "15px",
                                                                                                height: "11.5px",
                                                                                                position: "absolute",
                                                                                                top: "262px",
                                                                                                left: "6.5px"
                                                                                            }}/>
                                                                                        <span style={{
                                                                                            whiteSpace: "pre-wrap",
                                                                                            border: "0px solid black",
                                                                                            position: "relative",
                                                                                            boxSizing: "border-box",
                                                                                            display: "-webkit-box",
                                                                                            WebkitBoxOrient: "vertical",
                                                                                            flexDirection: "column",
                                                                                            alignContent: "flex-start",
                                                                                            flexShrink: "0",
                                                                                            fontSize: "20px",
                                                                                            width: "363px",
                                                                                            height: "52px",
                                                                                            color: "rgb(26, 26, 26)",
                                                                                            letterSpacing: "0.485px",
                                                                                            lineHeight: "26px",
                                                                                            fontWeight: "500",
                                                                                            marginLeft: "6px",
                                                                                            marginTop: "0px",
                                                                                            WebkitLineClamp: "2",
                                                                                            overflow: "hidden"
                                                                                        }}>
                                                                                &nbsp;&nbsp;&nbsp;&nbsp;
                                                                                            {ContentComments ?
                                                                                                <ContentCommentsEditBox
                                                                                                    disabled={this.state.disabled}
                                                                                                    data={shendianData.shop_descComment ? {
                                                                                                        oldData: shendianData.shop_desc,
                                                                                                        newData: shendianData.shop_descComment
                                                                                                    } : {oldData: shendianData.shop_desc}}
                                                                                                    onChange={(value) => {
                                                                                                        struct.data.shop_descComment = value;
                                                                                                        this.commentChange({
                                                                                                            name: item.name,
                                                                                                            type: 'array',
                                                                                                            index: d,
                                                                                                            value: struct
                                                                                                        })
                                                                                                    }}/> : shendianData.shop_desc}
                                                                            </span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div style={{
                                                                                position: "absolute",
                                                                                marginLeft: "10px"
                                                                            }}>
                                                                                <Tag type="success">
                                                                                    {ContentComments ?
                                                                                        <ContentCommentsEditBox
                                                                                            disabled={this.state.disabled}
                                                                                            data={shendianData.shop_tagComment ? {
                                                                                                oldData: shendianData.shop_tag,
                                                                                                newData: shendianData.shop_tagComment
                                                                                            } : {oldData: shendianData.shop_tag}}
                                                                                            onChange={(value) => {
                                                                                                struct.data.shop_tagComment = value;
                                                                                                this.commentChange({
                                                                                                    name: item.name,
                                                                                                    type: 'array',
                                                                                                    index: d,
                                                                                                    value: struct
                                                                                                })
                                                                                            }}/> : shendianData.shop_tag}
                                                                                </Tag>
                                                                            </div>
                                                                        </div>
                                                                        <div
                                                                            style={{marginLeft: "5px"}}>
                                                                            {ContentComments ?
                                                                                <ContentCommentsEditBox
                                                                                    disabled={this.state.disabled}
                                                                                    data={shendianData.shopDetail[0].shop_titleComment ? {
                                                                                        oldData: shendianData.shopDetail[0].shop_title,
                                                                                        newData: shendianData.shopDetail[0].shop_titleComment
                                                                                    } : {oldData: shendianData.shopDetail[0].shop_title}}
                                                                                    onChange={(value) => {
                                                                                        struct.data.shopDetail[0].shop_titleComment = value;
                                                                                        this.commentChange({
                                                                                            name: item.name,
                                                                                            type: 'array',
                                                                                            index: d,
                                                                                            value: struct
                                                                                        })
                                                                                    }}/> : shendianData.shopDetail[0].shop_title}</div>
                                                                        <img src={shop2} style={{width: "100%"}}/>
                                                                    </div>
                                                                );
                                                                break;
                                                        }
                                                    })}
                                                    <div>
                                                        {(props.sidebarBlockList ? props.sidebarBlockList : []).map((side, s) => {
                                                            if (side.blockName == "Spot") {
                                                                let items = side.moduleInfo.dataSchema.properties.features.items;
                                                                return (
                                                                    <div key="spot">
                                                                        {(data ? data : []).map((item, d) => {
                                                                            switch (item.name) {
                                                                                case "item-feature":
                                                                                    return (
                                                                                        <div key={s + "d" + d}
                                                                                             className="external">
                                                                                            {(item.data.features instanceof Array?item.data.features:[]).map((item, i) => {
                                                                                                if (items.minLength > item.length) {
                                                                                                    return (
                                                                                                        <Alert title={`第${i + 1}个长亮点字数为${item.length},少于${items.minLength}字`}
                                                                                                               showIcon={true} closable={false} type="error" key={i}/>
                                                                                                    )
                                                                                                } else if (items.maxLength < item.length) {
                                                                                                    return (
                                                                                                        <Alert title={`第${i + 1}个长亮点字数为${item.length},多于${items.maxLength}字`}
                                                                                                               showIcon={true} closable={false} type="error" key={i}/>
                                                                                                    )
                                                                                                }
                                                                                            })}
                                                                                        </div>
                                                                                    );
                                                                                    break;
                                                                            }
                                                                        })}
                                                                    </div>
                                                                )
                                                            } else if (side.blockName == "CustomParagraph" || side.blockName == "StdParagraph") {
                                                                return (
                                                                    <div key={"CustomParagraph" + s}>
                                                                        {(data ? data : []).map((item, d) => {
                                                                            switch (item.name) {
                                                                                case "item-paragraph-select":
                                                                                case "item-paragraph":
                                                                                    let item_paragraph = side.moduleInfo.dataSchema.properties.desc;
                                                                                    let descL = item.data ? item.data.desc ? item.data.desc.length : 0 : 0;
                                                                                    if (descL < item_paragraph.minLength) {
                                                                                        return (
                                                                                            <div key={s + "min" + d} className="external">
                                                                                                <Alert title={`第${d + 1}个段落：段落描述字数为${descL},少于${item_paragraph.minLength}字`}
                                                                                                       showIcon={true} closable={false} type="error" />
                                                                                            </div>
                                                                                        )
                                                                                    } else if (descL > item_paragraph.maxLength) {
                                                                                        return (
                                                                                            <div key={s + "max" + d} className="external">
                                                                                                <Alert title={`第${d + 1}个段落：段落描述字数为${descL},多于${item_paragraph.minLength}字`}
                                                                                                       showIcon={true} closable={false} type="error" />
                                                                                            </div>
                                                                                        )
                                                                                    }
                                                                            }
                                                                        })}
                                                                    </div>)
                                                            }
                                                        })}
                                                    </div>
                                                </div>
                                            </Form.Item>);
                                        break;
                                }
                            })}
                        </Form>
                    </Card>
                </AJAX>
                {openVideo&&<BundleLoading ref={e=>this.upVideo=e} load={UpVideo} constraint={upVideoData}/>}
                <WatchVideo ref={e => this.watchVideo = e}/>
            </div>
        )
    }
}

class WatchVideo extends React.Component{
    constructor(props){
        super(props);
        this.state= {
            dialogVisible: false
        };
        this.open=(url)=>{
            this.setState({dialogVisible:true},()=>{
                let i=url.lastIndexOf('.');
                let type = url.substring(i + 1);
                let t=`video/${type}`;
                $(".videoClass").prepend(`<video width="560" height="380" controls><source src=${url} type=${t}/></video>`);
            })
        };
        this.close=()=>{
            this.setState({dialogVisible:false},()=>{
                $(".videoClass").empty();
            })
        };
    }

    render(){
        let {dialogVisible}=this.state;
        return(
            <Dialog title="视频播放" size="large" visible={dialogVisible } onCancel={this.close} lockScroll={false}>
                <Dialog.Body>
                    <div style={{textAlign:'center'}} className='videoClass'>

                    </div>
                </Dialog.Body>
                <Dialog.Footer className="dialog-footer">
                    <Button onClick={this.close}>关闭</Button>
                </Dialog.Footer>
            </Dialog>
        )
    }
}


ShowConten.defaultProps = {};
export default ShowConten;










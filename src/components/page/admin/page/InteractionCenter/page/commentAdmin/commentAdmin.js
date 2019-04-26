/**
 * Created by 林辉 on 2019/2/25 8:49.评论管理
 */
import ReactChild from "../../../../../../lib/util/ReactChild";
import React from "react";
import {ThousandsOfCall} from "../../../../../../lib/util/ThousandsOfCall";
import {Pagination, Message, MessageBox, Tabs, Button, Popover, Checkbox} from 'element-react';
import 'element-theme-default';
import '../../../../../../../styles/InteractionCenter/commentAdmin.css';

let QRCode = require('qrcode.react');

class CommentAdmin extends ReactChild {
    constructor(props) {
        super(props);
        this.state = {
            talentList: [],//达人列表
            search: 'pagination',//搜索页
            page_size: 10,//每页个数
            page_num: 1,//当前页
            list: [],//【评论数据
            totalCount: '0',//总条数
            talentId: '',//达人id
        }
    }

    componentDidMount() {
        this.daren_list();
    }

    getComments = (tabPropsName) => {//获取评论数据
        let {page_size, page_num, talentList, talentId, targetId} = this.state;
        let s = {
            jsv: '2.4.11',
            appKey: 12574478,
            t: new Date().getTime(),
            api: 'mtop.taobao.social.comment.list.targetowner',
            v: '1.0',
            type: 'jsonp',
            timeout: 20000,
            dataType: 'jsonp',
        };
        if (tabPropsName) {
            talentId = talentList[tabPropsName].id;
        }
        let requesData = {"search": "{\"pagination\":{\"page_size\":" + page_size + ",\"page_num\":" + page_num + "}}"};
        if (targetId) {
            requesData = {"search": "{\"pagination\":{\"page_size\":" + page_size + ",\"page_num\":" + page_num + "},\"targetId\":" + targetId + "}"}
        }
        let dataT = {
            talentId: talentId,
            parameters: s,
            requesData: requesData,
            host: "https://h5api.m.taobao.com/h5",
            ajaxData: {requeryType: "get", referer: "https://we.taobao.com/interact?_ocean_showIndex=cmt"}
        };
        ThousandsOfCall.acoustic(dataT, "requestH5", (data) => {
            if (data.success) {
                data.data.talentId = talentId;
                if (tabPropsName) {
                    data.data.tabPropsName = tabPropsName;
                }
                this.setState(data.data, () => {
                    this.comments.setState({list: data.data.list});
                });
            } else {
                Message.error('获取' + talentList[tabPropsName].title + '列表失败');
            }
        });
    };
    daren_list = (callback) => {//获取授权达人列表
        ThousandsOfCall.acoustic(
            {}, "requestTanleList", (msg) => {
                if (msg.success) {
                    let talentList = msg.data;
                    this.setState({talentList: talentList}, () => {
                        if (callback) {
                            callback()
                        }
                    });
                } else {
                    Message.error('获取达人列表失败');
                }
            }
        )
    };

    render() {
        let {page_size, page_num, totalCount, list, tabPropsName,talentList} = this.state;
        return (
            <div>
                <Tabs activeName="2" onTabClick={(tab) => console.log(tab.props.name)}>
                    <Tabs.Pane label="互动管理" name="1">互动管理</Tabs.Pane>
                    <Tabs.Pane label="评论管理" name="2">
                        <Tabs type="card" value="0" onTabClick={(tab) => {
                            this.getComments(tab.props.name)
                        }}>
                            {talentList.map((item, i) => {
                                return (
                                    <Tabs.Pane label={item.cookieIsFailure?item.title:item.title+'(未授权)'} disabled={item.cookieIsFailure?'':true} name={i + ""} key={item.id}>
                                        {tabPropsName == i && <Comments list={list} talentId={item.id} goPage={this.goPage} ref={e => this.comments = e}/>}
                                    </Tabs.Pane>
                                )
                            })}
                        </Tabs>
                    </Tabs.Pane>
                </Tabs>
                <Pagination layout="total, sizes, prev, pager, next, jumper" total={parseInt(totalCount)} pageSizes={[10, 20, 30, 40]} pageSize={page_size} currentPage={page_num}
                            onSizeChange={(size) => {
                                this.goSize(size)
                            }} onCurrentChange={(page_num) => {
                    this.goPage(page_num)
                }}/>
            </div>
        )
    }

    goPage = (page_num, targetId) => {
        this.setState({page_num: page_num, targetId: targetId}, () => {
            this.getComments()
        })
    };
    goSize = (size) => {
        this.setState({page_size: size}, () => {
            this.getComments();
        })
    }
}

class Comments extends React.Component {//评论

    constructor(props) {
        super(props);
        this.state = {
            ifSwitch: false,//预览开关
            content: '',//回复内容
            targetTitle: '',//内容名
            targetId: '',//内容id
            list: this.props.list ? this.props.list : [],
            visible: false,//删除显示开关
            checkList: [],//删除举报数组
            commentId: '',//评论id
            replyCommentId: '',//回复id
            deleteCommentId: '',//删除id

        }
    }

    textChange = (env) => {//输入框事件
        let value = env.target.value;
        this.setState({content: value});
    };
    replyClick = (replyCommentId) => {//打开回复
        this.setState({replyCommentId: replyCommentId});
    };

    cancelRelpy = () => {//取消回复
        this.setState({replyCommentId: ''});
    };
    replyMessage = () => {//回复内容
        let {content, list, replyCommentId} = this.state;
        let {talentId} = this.props;
        let [comment, l] = [{}, ''];
        for (let i = 0; i < list.length; i++) {
            if (list[i].commentId == replyCommentId) {
                comment = list[i];
                l = i;
                break;
            }
        }
        let s = {
            jsv: '2.4.11',
            appKey: 12574478,
            t: new Date().getTime(),
            api: 'mtop.taobao.social.comment.add.h5',
            v: '2.0',
            type: 'jsonp',
            timeout: 20000,
            dataType: 'jsonp',
        };
        let requesData = {
            namespace: comment.namespace,
            targetId: comment.targetId,
            targetAccountId: comment.targetAccountId,
            parentId: comment.replys ? comment.replys[0].parentId : comment.parentId ? comment.parentId : comment.commentId,
            parentCommenterId: comment.parentCommenterId,
            targetTitle: comment.targetTitle,
            targetUrl: comment.targetUrl,
            content: content
        };
        let dataT = {
            talentId: talentId,
            parameters: s,
            requesData: requesData,
            host: "https://h5api.m.taobao.com/h5",
            ajaxData: {requeryType: "post", referer: "https://we.taobao.com/interact?_ocean_showIndex=cmt"}
        };
        ThousandsOfCall.acoustic(dataT, "requestH5", (data) => {
            if (data.success) {
                if (comment.replys) {
                    comment.replys.unshift(data.data);
                } else {
                    comment.replys = [];
                    comment.replys.push(data.data)
                }
                list[l] = comment;
                this.setState({list: list, replyCommentId: '', content: ''});
            } else {
                Message.error('回复消息失败');
            }
        });
    };

    openPreview = (targetUrl) => {//打开预览
        this.setState({ifSwitch: true, targetUrl: targetUrl});
    };
    closePreview = () => {//关闭预览
        this.setState({ifSwitch: false});
    };

    fromContent = (targetId, targetTitle) => {//筛选文章
        this.setState({targetId: targetId, targetTitle: targetTitle}, () => {
            this.props.goPage(1, targetId)
        });
    };
    cancelFromContent = () => {//取消筛选
        this.setState({targetId: '', targetTitle: ''}, () => {
            this.props.goPage(1, '');
        });
    };
    openDelete = (deleteCommentId) => {//打开删除
        this.setState({visible: true, deleteCommentId: deleteCommentId});
    };
    closeDate = () => {//关闭删除
        this.setState({visible: false, deleteCommentId: ''});
    };
    checkBoxChange = (value) => {//多选框事件
        this.setState({checkList: value});
    };
    submitDelete = () => {//提交删除
        let {list, checkList, deleteCommentId} = this.state;

        let [comment, l] = [{}, l];
        for (let i = 0; i < list.length; i++) {
            if (list[i].commentId == deleteCommentId) {
                comment = list[i];
                l = i;
                break;
            }
        }
        let reason = null;
        if (checkList.length > 0) {
            for (let i = 0; i < checkList.length; i++) {
                if (reason) {
                    reason += '|' + checkList[i];
                } else {
                    reason = checkList[i];
                }
            }
        }
        let requesData = {"adminCode": "delete", "commentId": comment.commentId, "namespace": comment.namespace, "reason": reason};
        this.delteHttp(requesData, () => {
            delete list[l];
            this.setState({list: list, deleteCommentId: '', visible: false});
        });
    };
    deleteSon = (commentId,deleteCommentId) => {//子回复删除
        let {list} = this.state;
        let [comment, l] = [{}, ''];
        for (let i = 0; i < list.length; i++) {
            if (list[i].commentId == deleteCommentId) {
                comment = list[i];
                l = i;
                break;
            }
        }
        let requesData = {"adminCode": "delete", "commentId": commentId, "namespace": comment.namespace};
        this.delteHttp(requesData,()=>{
            if(comment.replys&&comment.replys.length>0){
                let [replys,e] = [comment.replys,''];
                for(let r=0;r<replys.length;r++){
                    if(replys[r].commentId==commentId){
                        e=r;
                        break;
                    }
                }
                 list[l].replys.splice(e,1);
                this.setState({list:list});
            }
        });
    };

    delteHttp = (requesData, callback) => {
        let {talentId} = this.props;
        let s = {
            jsv: '2.4.11',
            appKey: 12574478,
            t: new Date().getTime(),
            api: 'mtop.taobao.social.comment.delete',
            v: '2.0',
            type: 'jsonp',
            timeout: 20000,
            dataType: 'jsonp',
        };

        let dataT = {
            talentId: talentId,
            parameters: s,
            requesData: requesData,
            host: "https://h5api.m.taobao.com/h5",
            ajaxData: {requeryType: "post", referer: "https://we.taobao.com/interact?_ocean_showIndex=cmt"}
        };
        ThousandsOfCall.acoustic(dataT, "requestH5", (data) => {
            if (data.success) {
                if (callback) {
                    callback();
                }
            } else {
                Message.error('删除失败:' + data.message);
            }
        });
    };

    render() {
        let {list, ifSwitch, content, targetId, targetTitle, visible, checkList, replyCommentId, targetUrl, commentId, deleteCommentId} = this.state;
        return (
            <div>
                <div className='iceCommentManager'>
                    {/*文章筛选开始*/}
                    <div id="topTitle" style={{marginLeft: '50px', marginBottom: '-30px'}}>
                        {(targetTitle && targetId) ? <div><span style={{marginTop: '32px', color: 'rgb(153, 153, 153)', fontSize: '16px'}}>文章： </span>
                            <div className="next-tag next-tag-deletable next-tag-level-normal next-tag-medium next-tag-zoom-appear next-tag-zoom-appear-active">
                                <div className="next-tag-body">{targetTitle}</div>
                                <div className="next-tag-tail">
                                    <span className="next-tag-opt" onClick={this.cancelFromContent}><i className="el-icon-close"/></span>
                                </div>
                            </div>
                        </div> : <Button type="primary" onClick={() => {
                            this.props.goPage(1, '')
                        }}>全部评论</Button>}
                    </div>
                    {/*文章筛选结束*/}
                    {/*预览开始*/}
                    {ifSwitch && targetUrl && <div className='ice-h5-priview-wrap'>
                        <span className="close" onClick={this.closePreview}><i className="el-icon-close"/></span>
                        <div className='iframe-wrapper'>
                            <div className=' ice-h5-preview' style={{width: '290px'}}>
                                <img className="image" src="https://img.alicdn.com/tps/TB13OXoLpXXXXcWaXXXXXXXXXXX-814-1700.png"/>
                                <div className="content" style={{overflow: 'hidden'}}>
                                    <iframe className="iframe" src={targetUrl}/>
                                </div>
                            </div>
                            <div className="qrcode">
                                <div className="ice-qrcode-panel ">
                                    <div style={{lineHeight: '0'}}>
                                        <QRCode height="120" width="120" style={{height: '120px', width: '120px'}} value={targetUrl}/>
                                    </div>
                                </div>
                                <div className="qrcode-desc">手机淘宝扫一扫<br/>手机预览</div>
                            </div>
                        </div>
                    </div>}
                    {/*预览结束*/}
                    {list.map((comments, c) => {
                        let date = new Date(parseInt(comments.timestamp));
                        let dateTime = date.getFullYear() + '-' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
                        return (
                            <div key={comments.commentId}>
                                <div className='div2'>
                                    <div className='iceCommentManagerData'>
                                        <div className='iceCommentManagerBody'>
                                            <div className='flexDirection'>
                                                <div className='contentTop'>
                                                    <img src={comments.commenterLogo} className='imgStyle'/>
                                                    <div className='contentText'>
                                                        <div className='contentTextTalentName'>
                                                            <span className='spanText'>{comments.commenterNick}</span>
                                                            <span className='spanText'>{dateTime}</span>
                                                        </div>
                                                        <span>
                                                            {comments.parentCommenterNick &&
                                                            <span style={{marginTop: '5px', color: 'rgb(51, 51, 51)', fontSize: '14px', float: 'left'}}>回复</span>}
                                                            {comments.parentCommenterNick &&
                                                            <span style={{color: 'rgb(102, 170, 255)', fontSize: '14px', marginTop: '5px', float: 'left'}}>{comments.parentCommenterNick}: </span>}
                                                            <span className='commentsContent'>{comments.content}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='contentBottom'>
                                                    <div className='contentBottomDiv'>
                                                        <div className='contentBottomDivLeftContent'>
                                                            <span className='contentBottomDivLeftContentText'>来自内容</span>
                                                            <span>
                                                            <span className='iceCllipsis' title={comments.targetTitle} onClick={() => {
                                                                this.fromContent(comments.targetId, comments.targetTitle)
                                                            }}>{comments.targetTitle}</span>
                                                        </span>
                                                        </div>
                                                        <div className='contentBottomDivRightContent'>
                                                            <span className='contentBottomDivRightContentText' onClick={() => {
                                                                this.openPreview(comments.targetUrl)
                                                            }}>预览</span>
                                                            <span className='contentBottomDivRightContentText' onClick={() => {
                                                                this.replyClick(comments.commentId)
                                                            }}>回复</span>
                                                            {/*删除开始*/}
                                                            <Popover placement="bottom" width="315" trigger="click" visible={visible} content={
                                                                deleteCommentId == comments.commentId && <div>
                                                                    <p>请选择删除原因：</p>
                                                                    <Checkbox.Group value={checkList} onChange={this.checkBoxChange}>
                                                                        <Checkbox label="广告"/>
                                                                        <Checkbox label="色情低俗"/>
                                                                        <Checkbox label="恶意攻击"/>
                                                                        <Checkbox label="刷屏"/>
                                                                        <Checkbox label="其他"/>
                                                                    </Checkbox.Group>
                                                                    <div style={{textAlign: 'right', margin: 0}}>
                                                                        <Button size="mini" type="text" onClick={this.closeDate}>取消</Button>
                                                                        <Button type="primary" size="mini" onClick={this.submitDelete}>确定</Button>
                                                                    </div>
                                                                </div>
                                                            }>
                                                                <span className='contentBottomDivRightContentText' onClick={() => {
                                                                    this.openDelete(comments.commentId)
                                                                }}>删除</span>
                                                            </Popover>
                                                            {/*删除结束*/}
                                                        </div>
                                                    </div>
                                                    {/*回复开始*/}
                                                    {(comments.replys || replyCommentId == comments.commentId) && <div className='replyBody'>
                                                        {/*回复三角开始*/}
                                                        <div className='replyLine'>
                                                            <div className='replyTriangle'/>
                                                        </div>
                                                        {/*回复三角结束*/}
                                                        {/*回复框开始*/}
                                                        {replyCommentId == comments.commentId && <div className='replyCenter'>
                                                            <div className='reply'>
                                                            <span style={{height: '110px', width: '590px'}} className='next-input next-input-multiple'>
                                                                    <textarea placeholder="输入您的回复" rows="4" maxLength="600" type="text" height="100%" value={content} onChange={this.textChange}
                                                                              data-spm-anchor-id="a2116r.interact.main.i4.493b4aa0UJt2d2"/>
                                                                <span className="next-input-control">
                                                                    <span className="next-input-len">{content.length}/600</span>
                                                                </span>
                                                            </span>
                                                                <br/>
                                                                <div className='relpyTowButton'>
                                                                    <button type="button" className="next-btn next-btn-primary next-btn-medium" onClick={this.replyMessage}
                                                                            style={{color: 'rgb(255, 255, 255)', backgroundColor: 'rgb(102, 170, 255)', marginRight: '12px', marginBottom: '20px'}}>
                                                                        回复
                                                                    </button>
                                                                    <button type="button" className="next-btn next-btn-normal next-btn-medium" onClick={this.cancelRelpy}>取消</button>
                                                                </div>
                                                            </div>
                                                        </div>}
                                                        {/*回复框结束*/}
                                                        {/*已回复内容开始*/}
                                                        <div className='relpyBottom'>
                                                            <div style={{display: 'flex', flexDirection: 'row', flex: '1 1 0%'}}>
                                                                {comments.replys && comments.replys.length > 0 &&
                                                                <img src={comments.replys[0].commenterLogo}
                                                                     style={{width: '40px', height: '40px', borderRadius: '40px', marginRight: '20px'}}/>}
                                                                <div style={{display: 'flex', flexDirection: 'column', flex: '1 1 0%'}}>
                                                                    {(comments.replys ? comments.replys : []).map((rep, r) => {
                                                                        let repdate = new Date(parseInt(rep.timestamp));
                                                                        let repDateTime = repdate.getFullYear() + '-' + (repdate.getMonth() + 1 < 10 ? '0' + (repdate.getMonth() + 1) : repdate.getMonth() + 1) + '-' + repdate.getDate() + ' ' + repdate.getHours() + ':' + repdate.getMinutes() + ':' + repdate.getSeconds();
                                                                        return (
                                                                            <div key={rep.commentId}>
                                                                                <div style={{display: 'flex', flex: '1 1 0%', flexDirection: 'row', justifyContent: 'space-between'}}>
                                                                                    <span className='relpyBottomContentText'>我 回复：</span>
                                                                                    <div>
                                                                                        <span className='relpyBottomContentText'>{repDateTime}</span>
                                                                                        <span style={{color: 'rgb(102, 170, 255)', fontSize: '12px', marginLeft: '12px', cursor: 'pointer'}}
                                                                                              onClick={()=>{this.deleteSon(rep.commentId,comments.commentId)}}>删除</span>
                                                                                    </div>
                                                                                </div>
                                                                                <span style={{color: 'rgb(153, 153, 153)', fontSize: '14px', marginTop: '2px', float: 'left'}}>{rep.content}</span>

                                                                                {comments.replys.length > (r + 1) &&
                                                                                <div style={{backgroundColor: 'rgba(153, 153, 153, 0.3)', height: '1px', marginTop: '40px', marginBottom: '20px'}}/>}
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/*已回复内容结束*/}
                                                    </div>}
                                                    {/*回复结束*/}
                                                    <div className='theDivider'/>
                                                    {/*分割线*/}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}


export default CommentAdmin
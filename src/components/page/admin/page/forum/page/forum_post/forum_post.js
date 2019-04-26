/**
 * Created by linhui on 17-7-11.帖子详情
 */
require('../../../../../../../styles/forum/forum_post.css');
import $ from 'jquery';
import React from 'react';
import ReactChild from "../../../../../../lib/util/ReactChild";
import {ajax} from '../../../../../../lib/util/ajax';
import {Paging3, PagingReply} from '../../../../../../lib/util/Paging';
import noty from 'noty';
import  EditBox from '../../../../../../lib/sharing/editBox/EditBox';
import  {
    ListGroup,
    ListGroupItem,
    Button,
    Modal,
    Table,
    Panel,
    FormGroup,
    FormControl,
} from "react-bootstrap"

class PostTable extends React.Component {//帖子列表
    constructor(props) {
        super(props);
        this.state = {
            pageNow: 1,
            pageSize: 5,
            count: 0,
            content: [],
            reply: [],
            itemId:false,
        }
    }

    huifuClick = (env) => {//根据i展示回复
        let i = $(env.target).data('i');
        $('#replyPanel' + i).unbind('normal').slideToggle('slow', () => {
            let ss = $('#huifuSlideDown' + i).html();
            if (ss == '回复') {
                $('#huifuSlideDown' + i).html('收起回复');
            } else {
                $('#huifuSlideDown' + i).html('回复');
            }
        });
    };
    miniReplyClick = (env) => {//回复某个id信息
        let i = $(env.target).data('i');
        let name = $(env.target).data('magename');
        let id = $(env.target).data('mageid');
        this.props.setPaState({coverName: name, coverMageId: id, i: i});
        // $('#floorminReply'+i).val('回复 '+name+':');
        // $('#floorminReply'+i).focus();
    };
    miniReplyChange = (env) => {//改变内容
        let [value,ii] = [env.target.value,$(env.target).data('ii')];

        let i = $(env.target).data('i');//let i = this.props.getContent.i;
        this.props.setPaState({contents: value}, () => {
            /* $('#floorminReply' + i).bind("keydown", (e)=> {
             debugger;
             e = e ? e : event;
             if (e.keyCode == 8) {
             if (value == '' || value == undefined || value == null) {
             this.props.setPaState({coverName: undefined, coverMageId: undefined, i: undefined});
             }
             }
             });*/
        });
    };
    goPage = (pageNow) => {/*点击分页*/
        this.props.setPaState({replyPageNow: pageNow}, () => {
            this.props.getContentList();
        });
    };
    miniReplyPost = (env) => {//小回复发表
        let manAgeId = $(env.target).data('manageid');
        let contentId = $(env.target).data('contentid');
        let postId = $(env.target).data('postid');
        let content = this.props.getContent.contents;
        let loginManageId = this.props.getContent.loginManage.id;
        let coverManAgeId = this.props.getContent.coverMageId;
        if (loginManageId == '' || loginManageId == undefined || loginManageId == null) {
            new noty({
                text: '您还未登录，请登录后再发表',
                type: 'error',
                layout: 'topCenter',
                modal: false,
                timeout: 3000,
                theme: 'bootstrap-v4',
                animation: {
                    open: 'noty_effects_open',
                    close: 'noty_effects_close'
                }
            }).show();
            return false;
        }
        ajax.ajax({
            url: '../forum/bbs/loginAndOrg/replyContent.io',
            data: {
                'manAgeId': manAgeId,
                'contentId': contentId,
                'postId': postId,
                'content': content,
                'coverManAgeId': coverManAgeId
            },
            callback: () => {
                this.props.getContentList();
            }
        });
    };
    close = () => {//关闭修改模态
        this.props.setPaState({floorModal: false});
    };
    editOpen = (env) => {//打开发帖
        let i = $(env.target).data('i');
        let contents = this.props.getContent.content[i];

        this.props.setPaState({contents: contents, floorModal: true});
    };
    updateContent = (env) => {//修改楼层内容
        let contentId = $(env.target).data('contentid');
        let postId = $(env.target).data('postid');
        let manAgeId = $(env.target).data('manageid');
        //    let contents = this.props.getContent.contents;
        let contents = this.refs.editEditBox.getContent();
        ajax.ajax({
            type: 'post',
            url: '../forum/bbs/loginAndOrg/updateContent.io',
            data: {
                'contentId': contentId,
                'postId': postId,
                'manAgeId': manAgeId,
                'contents': JSON.stringify(contents)
            },
            callback: () => {
                new noty({
                    text: '修改成功',
                    type: 'success',
                    layout: 'topCenter',
                    modal: false,
                    timeout: 3000,
                    theme: 'bootstrap-v4',
                    animation: {
                        open: 'noty_effects_open',
                        close: 'noty_effects_close'
                    }
                }).show();
                this.close();
                this.props.goPage(1);
            }
        });
    };
    delContent = (env) => {//删除一条楼层
        let contentId = $(env.target).data('contentid');
        let postId = $(env.target).data('postid');
        let manAgeId = $(env.target).data('manageid');
        let n = new noty({
            text: '<h4>您确定要删除本楼吗</h4>',
            theme: 'bootstrap-v4',
            modal: true,
            layout: 'center',
            type: 'warning',
            buttons: [
                noty.button('删除', 'btn btn-success', () => {
                    ajax.ajax({
                        type: 'get',
                        url: '../forum/bbs/loginAndOrg/delContent.io',
                        data: {'manAgeId': manAgeId, 'contentId': contentId, 'postId': postId},
                        callback: () => {
                            new noty({
                                text: '删除成功',
                                type: 'success',
                                layout: 'topCenter',
                                modal: false,
                                timeout: 3000,
                                theme: 'bootstrap-v4',
                                animation: {
                                    open: 'noty_effects_open',
                                    close: 'noty_effects_close',
                                }
                            }).show();
                            this.props.goPage(1);
                        }
                    });
                    n.close();
                }, {id: 'button1', 'data-status': 'ok'}),
                noty.button('取消', 'btn btn-error', () => {
                    n.close();
                })
            ]
        }).show();
    };
    openClick=(env)=>{
      let [id,itemId,value] = [$(env.target).data('id'),this.state.itemId,''];
      if(id==itemId){
          value='';
      }else{
          value=id;
      }
      this.setState({itemId:value});
    };
    render() {
        let getContent = this.props.getContent;
        return (
            <div>
                <ListGroup>
                    <ListGroupItem >{getContent.title}</ListGroupItem>
                </ListGroup>
                {/*<Navbar >
                 <Navbar.Header>
                 <Navbar.Brand>
                 {this.props.getContent.title}
                 </Navbar.Brand>
                 <Navbar.Toggle />
                 </Navbar.Header>
                 <Navbar.Collapse>
                 <Nav pullRight>
                 <NavItem eventKey={1} href="#">收藏</NavItem>
                 <NavItem eventKey={2} href="#">回复</NavItem>
                 </Nav>
                 </Navbar.Collapse>
                 </Navbar>*/}
                <Table hover className='forumPostTable'>
                    <tbody>

                    <Modal show={getContent.floorModal} onHide={this.close}>{/*修改楼层模态*/}
                        <Modal.Header closeButton>
                            <Modal.Title>修改内容</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {/* <FormControl componentClass='textarea' rows='5' placeholder='内容' onChange={this.miniReplyChange}/>*/}
                            <div className="replyEditBox">
                                <EditBox ref="editEditBox" BLOCK_TYPES_HEADER={false}
                                         BLOCK_TYPES_CODE={false} imgDisabled={true}
                                         content={this.props.getContent.contents.contents}/>
                            </div>

                        </Modal.Body>
                        <Modal.Footer>
                            <Button bsStyle='primary' data-contentid={this.props.getContent.contents.id}
                                    data-postid={this.props.getContent.contents.postId}
                                    data-manageid={this.props.getContent.contents.manAgeId}
                                    onClick={this.updateContent}>修改内容</Button>
                        </Modal.Footer>
                    </Modal>

                    {getContent.content.map((item, i) => {
                        return (
                            <tr key={+new Date() + i}>
                                <td width='150px' className='forumPostTableTd'>

                                    <div className='forumPostnicheng'>
                                        <img className='forumPostTableImg' src={item.headPortrait}/>
                                        <div>{item.manAgeName}</div>
                                        {/*{item[i].manAgeId==item[0].manAgeId?<div>楼主</div>:''}*/}
                                    </div>
                                </td>
                                <td>
                                    <div className='forumPostTable'>
                                        <span className='forumPostContent'>
                                            {item.isDel == false ? <EditBox readOnly content={item.contents}/> :
                                                <span className='forumPostHuiFu_1'>该楼层内容已被删除</span>}
                                        </span>
                                    </div>
                                    <div className="t_medal_section"></div>
                                    <div className='forumPostHuiFu'>
                                        <div className='huifu'>
                                            {console.log(getContent)}
                                            {getContent.loginManage.id == ' ' ? '' : item.isDel == true ? '' : item.manAgeId == getContent.loginManage.id||getContent.loginManage.superMan ?
                                                <span>
                                                    <a href="#" onClick={this.editOpen} data-i={i}>修改</a>

                                                    <span className='forumPostHuiFu_1'>&nbsp;|&nbsp;</span>
                                                    <a href="#" data-contentid={item.id} data-postid={getContent.postId}
                                                       data-manageid={item.manAgeId} onClick={this.delContent}>删除</a>
                                                    <span className='forumPostHuiFu_1'>&nbsp;|&nbsp;</span>
                                                </span> : ''
                                            }
                                            <span className='forumPostHuiFu_1'>第{i + 1}楼</span>&nbsp;&nbsp;
                                            <span className='forumPostHuiFu_1'>{item.addTime}</span>&nbsp;&nbsp;
                                            <span>
                                                {item.isDel == false ?
                                                    <a className='replyFlip' data-i={i} data-id={item.id}
                                                       onClick={this.openClick}>
                                                        {this.state.open ? '收起回复' : '回复'}({item.replyCount})</a> : ''}{/*<span id={"huifuSlideDown" +
                                             i}>回复</span>*/}{/* onClick={this.huifuClick}*/}
                                                {/*id={'replyPanel' + i}*/}
                                                <Panel  collapsible expanded={this.state.itemId==item.id?true:false}>
                                                   {item.reply.map((items, ii) => {
                                                       return (
                                                           <div key={items.id + ii}>
                                                               <p>
                                                                   <span>
                                                                       <a href="#">{items.replyManAge.name}</a>
                                                                   </span>
                                                                   <span>
                                                                       {items.coverManAge != undefined ?
                                                                           <span><span>: 回复</span><a
                                                                               href="#"> {items.coverManAge.name}</a></span> : undefined}
                                                                   </span>:{items.contents}
                                                               </p>
                                                               <div className='insideHuifu'>
                                                                   <span className='forumPostHuiFu_1'>
                                                                       {items.replyTime}
                                                                   </span>&nbsp;&nbsp;
                                                                   <span className=''>
                                                                       <a href='javascript:void(0)' data-i={i}
                                                                          data-mageid={items.replyManAge.id}
                                                                          data-magename={items.replyManAge.name}
                                                                          onClick={this.miniReplyClick}>回复</a>
                                                                   </span>
                                                               </div>
                                                               <hr/>
                                                           </div>
                                                       )
                                                   })}
                                                    { /*{item.replyCount>3?<span id="">还有{item.replyCount-3}条回复，<a href="#" onClick={zujian.viewClick} data-id={item.id}>点击查看</a></span>:""}*/}
                                                    {item.replyCount != 0 ? <PagingReply bsSize="small" key={item.id}
                                                                                         pageNow={item.replyPageNow}
                                                                                         pageSize={item.replyPageSize}
                                                                                         count={item.replyCount}
                                                                                         currentLayer={i}
                                                                                         goPage={this.goPage}/> : ""}
                                                    <FormGroup>
                                                        <FormControl type="text" id={'floorminReply' + i}
                                                                     onChange={this.miniReplyChange} data-i={i} value={getContent.contents}
                                                                     placeholder={getContent.i == i ? ('回复 ' + getContent.coverName) : '回复内容'}/>
                                                   </FormGroup>
                                                   <Button bsStyle="primary" className='forumPostPublish'
                                                           data-manageid={item.manAgeId}
                                                           data-contentid={item.id} data-postid={getContent.postId}
                                                           onClick={this.miniReplyPost}>发表</Button>
                                             </Panel>
                                         </span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </Table>
            </div>
        )
    }
}

class Reply extends React.Component {//回复帖子
    replyPost = () => {//回复帖子提交
        let postId = this.props.getState.postId;
        let contents = this.props.getState.contents;
        let loginManageId = this.props.getState.loginManage.id;
        let content = this.refs.getEditBox.getContent();
        if (loginManageId == '' || loginManageId == undefined || loginManageId == null) {
            new noty({
                text: '您还未登录，请登录后再发表',
                type: 'error',
                layout: 'topCenter',
                modal: false,
                timeout: 3000,
                theme: 'bootstrap-v4',
                animation: {
                    open: 'noty_effects_open',
                    close: 'noty_effects_close'
                }
            }).show();
            return false;
        }
        ajax.ajax({
            type: "post",
            url: "../forum/bbs/loginAndOrg       /replyPost.io",
            data: {"postId": postId, "contents": JSON.stringify(content)},
            callback: () => {
                this.props.getContentList();
            }
        });
    };
    contentsChange = (env) => {//改变回复内容
        let value = env.target.value;
        this.props.setPaState({contents: value})
    };

    render() {
        return (
            <div>
                <h5>发表回复</h5>
                <div className="replyDiv">
                    <div className="replyEditBox">
                        <EditBox ref="getEditBox" imgDisabled={true} isFloat='1'/>
                    </div>
                    {/*  <FormGroup >
                     <FormControl componentClass='textarea' cols="5" rows='5' placeholder='内容'  onChange={this.contentsChange}/>
                     </FormGroup>*/}
                    <Button bsStyle="primary" className="forumPostPublish2" onClick={this.replyPost}>发表回复</Button>
                    <br />
                    <p>&nbsp;</p>
                </div>
            </div>
        )
    }
}

class ForumPost extends ReactChild {
    componentDidMount() {
        this.queryContentList();
    }

    constructor(props) {
        super(props);
        this.state = {
            pageNow: 1,
            pageSize: 16,
            content: [],
            contents: '',
            postId: '',
            count: 0,
            title: '',
            replyPageNow: 1,
            replyPageSize: 3,
            replyCount: 0,
            loginManage: '',
            floorModal: false,//楼层修改模态开关
            coverName: undefined,//被回复名字
            coverMageId: undefined,//被回复id
            i: undefined,
            open: true,
        }
    }

    queryContentList = () => {//拿取一条帖子数据
        let url = location.search;
        let theRequest = {};
        if (url.indexOf('?') != -1) {
            let str = url.substr(1);
            let strs = str.split('&');
            for (let i = 0; i < strs.length; i++) {
                theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
            }
        }
        ajax.ajax({
            url: '../forum/bbs/queryContentList.io',
            data: {
                'postId': theRequest.id,
                'pageNow': this.state.pageNow,
                'pageSize': this.state.pageSize,
                'replyPageNow': this.state.replyPageNow,
                'replyPageSize': this.state.replyPageSize,
            },
            callback: (json) => {
                this.setState(json);
            }
        });
    };
    setThisState = (state, callback) => {
        this.setState(state, () => {
            if (callback && (typeof callback) == 'function') {
                callback();
            }
        });
    };
    goPage = (pageNow) => {/*点击分页*/
        this.setState({pageNow: pageNow}, () => {
            this.queryContentList();
        });
    };

    render() {
        return (
            <div>
                <PostTable getContent={this.state} setPaState={this.setThisState} getContentList={this.queryContentList}
                           goPage={this.goPage}/>
                <Paging3 bsSize="large" pageNow={this.state.pageNow} pageSize={this.state.pageSize}
                         count={this.state.count}
                         goPage={this.goPage}/>
                <Reply setPaState={this.setThisState} getState={this.state} getContentList={this.queryContentList}/>
            </div>
        )
    }
}

export default ForumPost;

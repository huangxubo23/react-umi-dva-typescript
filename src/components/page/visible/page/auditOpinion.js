import React from 'react';
import AJAX from '../../../lib/newUtil/AJAX';
import ShowConten from '../../../components/ShowConten';
// import {Dialog} from 'element-react';
import 'element-theme-default';

import("../../../../styles/addList/content.css");


class AuditOpinion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogVisible: true,
            showContent: {
                type: "",
                contentData: {},
                contentMode: {},
            }
        }
    }

    componentDidMount() {
        let {previewId, encryptTime, commentId, encryptCommentsDate} = this.props.match.params;
        let ContentComments = false;
        if (previewId) {
            if (!encryptTime) {//编辑人员看
                this.ajax.ajax({
                    url: "/content/decrypt.io",
                    data: {"id": previewId, "encryptTime": ''},
                    callback: (data) => {
                        if (data.type == 'encryptTime') {
                            if (this.props.match.path == '/pc/visible/auditOpinion/add/:previewId') {
                                window.location.href = '/pc/visible/auditOpinion/add/' + previewId + '/' + data.encryptTime;
                            } else {
                                window.location.href = '/pc/visible/preview/' + previewId + '/' + data.encryptTime;
                            }

                        }
                    }
                });
            } else {
                this.ajax.ajax({
                    url: "/content/decrypt.io",
                    data: {"id": previewId, "encryptTime": encryptTime},
                    callback: (data) => {
                        if (this.props.match.path == '/pc/visible/auditOpinion/add/:previewId/:encryptTime') {
                            ContentComments = true;
                        }
                        this.setState({show: true, encryptTime: encryptTime}, () => {
                            let showContent = data.data;let contentData = showContent.contentData;
                            let contentMode = showContent.contentMode.constraint ? showContent.contentMode.constraint : [];
                            this.modalShow.setState({showContent: showContent, contentData: contentData, contentMode: contentMode, encryptTime: encryptTime, ContentComments: ContentComments});
                        });
                    }
                });
            }
        } else if (commentId) {//看点评
            if (this.props.match.path === '/pc/visible/auditOpinion/edit/:commentId') {//编辑
                this.ajax.ajax({
                    type: 'post',
                    url: '/content/admin/contentComments/getContentCommentsById.io',
                    data: {id: commentId},
                    callback: (json) => {
                        /*this.setState({
                            commentId: commentId,
                            reviewers: json.reviewers,
                            showContent: {id: json.content.id, contentMode: {constraint: json.contentComments.contentMode}, contentData: json.contentComments.contentData},
                            ContentComments: true,
                            disabled: false
                        }, () => {*/
                            this.modalShow.setState({
                                commentId: commentId,
                                reviewers: json.reviewers,
                                ContentComments: true,
                                showContent: {id: json.content.id},
                                contentMode: json.contentComments.contentMode,
                                contentData: json.contentComments.contentData,
                                disabled: false,
                            });
                        /*});*/
                    }

                });
            } else if (!encryptCommentsDate) {
                this.ajax.ajax({
                    type: 'post',
                    url: '/content/admin/contentComments/queryContentCommentsByIdAndAddDate.io',
                    data: {id: commentId},
                    callback: (json) => {
                        window.location.href = '/pc/visible/auditOpinion/show/' + commentId + '/' + json.commentsDate;
                    }
                });
            } else {
                this.ajax.ajax({
                    type: 'post',
                    url: '/content/admin/contentComments/queryContentCommentsByIdAndAddDate.io',
                    data: {id: commentId, commentsDate: encryptCommentsDate},
                    callback: (json) => {
                        /*this.setState({
                                showContent:
                                    {contentMode: {constraint: json.data.contentComments.contentMode}, contentData: json.data.contentComments.contentData},
                                ContentComments: true,
                                disabled: true,
                                reviewers: json.data.reviewers,
                                log: json.log,
                            }, () => {*/
                                this.modalShow.setState({
                                        showContent: {}, contentMode: json.data.contentComments.contentMode, contentData: json.data.contentComments.contentData,
                                        ContentComments: true,
                                        disabled: true,
                                        reviewers: json.data.reviewers,
                                        log: json.log,});
                            /*});*/
                    }

                });
            }

        }
    }

   /* componentWillUpdate(nextProps, nextState) {
        let showContent = nextState.showContent;
        let contentData = showContent.contentData;
        let contentMode = nextState.showContent.contentMode.constraint ? nextState.showContent.contentMode.constraint : [];
        this.modalShow.setState({contentData, contentMode, showContent});
    }*/


    render() {
       // let constraint = this.state.showContent.contentMode.constraint ? this.state.showContent.contentMode.constraint : [];
        return (
            <AJAX ref={e => this.ajax = e}>
                <div style={{backgroundColor: "#828282", textAlign: "center", padding: "50px"}}>

                    {/*<div style={{width: "620px", margin: "0 auto", display: "inline-block"}}>*/}
                    {/*<ShowConten ref="modalShow" showContent={this.state.showContent} contentMode={constraint}/>*/}
                    {/*</div>*/}
                    <div style={{width: "620px", margin: "0 auto", display: "inline-block"}}>
                        <ShowConten ref={e => this.modalShow = e} />
                        {/*ContentComments={this.state.ContentComments} showContent={this.state.showContent} encryptTime={this.state.encryptTime}
                                    contentMode={constraint} match={this.props.match} disabled={this.state.disabled} reviewers={this.state.reviewers} commentId={this.state.commentId}
                                    log={this.state.log}*/}
                    </div>
                </div>
            </AJAX>
        )
    }
}

export default AuditOpinion;

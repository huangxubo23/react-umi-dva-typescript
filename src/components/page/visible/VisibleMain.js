import {Link, Switch, Route, BrowserRouter} from 'react-router-dom';
import React from "react";
import {loading} from '../../../bundle';
import AuditOpinionContainer from 'bundle-loader?lazy&name=pc/trends_asset/visible/app-[name]!./page/auditOpinion.js';
import ReactChild from "../../lib/util/ReactChild";

class VisibleMain extends ReactChild {
    render() {
        let {url}=this.props.match;
        return <BrowserRouter>
            <Switch>
                <Route path={url + "/preview/:previewId/:encryptTime"} exact component={loading(AuditOpinionContainer)}/>
                <Route path={url + "/preview/:previewId"} exact component={loading(AuditOpinionContainer)}/>
                <Route path={url + "/auditOpinion/edit/:commentId"} exact component={loading(AuditOpinionContainer)}/>/*编辑*/
                <Route path={url + "/auditOpinion/show/:commentId/:encryptCommentsDate"} exact component={loading(AuditOpinionContainer)}/>/*看点评*/
                <Route path={url + "/auditOpinion/show/:commentId"} exact component={loading(AuditOpinionContainer)}/>/*看点评*/
                <Route path={url + "/auditOpinion/add/:previewId/:encryptTime"} exact component={loading(AuditOpinionContainer)}/>/*创建点评*/
                <Route path={url + "/auditOpinion/add/:previewId"} exact component={loading(AuditOpinionContainer)}/>
            </Switch>
        </BrowserRouter>
    }
}

export default VisibleMain;

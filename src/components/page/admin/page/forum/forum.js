import React from "react";
import {Link, Switch, Route, BrowserRouter} from 'react-router-dom';
import {loading} from '../../../../../bundle';
import forum_index from 'bundle-loader?lazy&name=pc/trends_asset/admin/forum/[name]!./page/forum_index/forum_index.js';
import forum_addSuperManage from 'bundle-loader?lazy&name=pc/trends_asset/admin/forum/[name]!./page/forum_addSuperManage/forum_addSuperManage.js';
import forum_personalCenter from 'bundle-loader?lazy&name=pc/trends_asset/admin/forum/[name]!./page/forum_personalCenter/forum_personalCenter.js';
import forum_admin from 'bundle-loader?lazy&name=pc/trends_asset/admin/forum/[name]!./page/forum_admin/forum_admin.js';
import forum_post from 'bundle-loader?lazy&name=pc/trends_asset/admin/forum/[name]!./page/forum_post/forum_post.js';
import ReactChild from "../../../../lib/util/ReactChild";


class forum extends ReactChild {/*论坛*/
    render() {
        let {url}=this.props.match;
        return (
            <div>
                <Switch>
                    <Route path={url + "/forum_index"} component={loading(forum_index)}/>{/*论坛首页*/}
                    <Route path={url + "/forum_addSuperManage"} component={loading(forum_addSuperManage)}/>{/*BBS管理员*/}
                    <Route path={url + "/forum_personalCenter"} component={loading(forum_personalCenter)}/>{/*个人中心*/}
                    <Route path={url + "/forum_admin"} component={loading(forum_admin)}/>{/*帖子管理*/}
                    <Route path={url + "/forum_post"} component={loading(forum_post)}/>{/*帖子详情*/}
                </Switch>
            </div>
        )
    }
}

export default forum;
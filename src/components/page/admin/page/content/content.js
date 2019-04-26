/**
 * Created by muqingzhong on 2018/5/19.
 */

import React from "react";
import {Link, Switch, Route, BrowserRouter} from 'react-router-dom';
import addContainer from 'bundle-loader?lazy&name=pc/trends_asset/admin/content/app-[name]!./page/add/add.js';
import listContainer from 'bundle-loader?lazy&name=pc/trends_asset/admin/content/app-[name]!./page/list/list.js';
import flowList from 'bundle-loader?lazy&name=pc/trends_asset/admin/content/app-[name]!./page/statisics/flowList/flowList.js';
import workList from 'bundle-loader?lazy&name=pc/trends_asset/admin/content/app-[name]!./page/statisics/workList/workList.js';
import statisticsCenter from 'bundle-loader?lazy&name=pc/trends_asset/admin/content/app-[name]!./page/statisics/statisticsCenter/statisticsCenter.js';
import bonusFlowCollection from 'bundle-loader?lazy&name=pc/trends_asset/admin/content/app-[name]!./page/statisics/flowList/page/bonusFlowCollection/bonusFlowCollection.js';
import adoptList from 'bundle-loader?lazy&name=pc/trends_asset/admin/content/app-[name]!./page/statisics/adoptList/adoptList.js';
import newRelease from 'bundle-loader?lazy&name=pc/trends_asset/admin/content/app-[name]!./page/release/newRelease.js';
import synchronization from 'bundle-loader?lazy&name=pc/trends_asset/admin/content/app-[name]!./page/synchronization/synchronization.js';
import {loading} from '../../../../../bundle';
import ReactChild from "../../../../lib/util/ReactChild";


class Content extends ReactChild {
    render() {
        let {url}=this.props.match;
        return (
            <div>
                <Switch>
                    <Route path={url + "/groupAdd/:contentType/:groupId/:id"} component={loading(addContainer)}/>{/*小组编辑*/}
                    <Route path={url + "/groupAdd/:contentType/:groupId"} component={loading(addContainer)}/>{/*小组添加*/}
                    <Route path={url + "/groupList/:contentType/:groupId"} component={loading(listContainer)}/>{/*小组内容列表*/}
                    <Route path={url + "/add/:contentType/:id"} component={loading(addContainer)}/>{/*内容编辑*/}
                    <Route path={url + "/add/:contentType"} component={loading(addContainer)}/>{/*创建内容*/}
                    <Route path={url + "/list/:contentType"} component={loading(listContainer)}/>{/*内容列表*/}
                    <Route path={url + "/statistics/flowList/bonusFlowCollection/:type"} component={loading(bonusFlowCollection)}/>{/*奖金流量采集*/}
                    <Route path={url + "/statistics/statisticsCenter"} component={loading(statisticsCenter)}/>{/*组织唯一负责人军机处*/}
                    <Route path={url + "/statistics/flowList"} component={loading(flowList)}/>
                    <Route path={url + "/statistics/workList"} component={loading(workList)}/>
                    <Route path={url + "/statistics/adoptList"} component={loading(adoptList)}/>
                    <Route path={url + "/newRelease/:contentType/:direction/:ids"} component={loading(newRelease)}/>
                    <Route path={url + "/synchronization/:contentType/:ids"} component={loading(synchronization)}/>
                </Switch>
            </div>

        )
    }
}

Content.defaultProps = {};

export default Content;

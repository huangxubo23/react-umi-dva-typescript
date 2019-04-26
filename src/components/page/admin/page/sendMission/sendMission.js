/**
 * Created by 石英 on 2018/10/26 0026下午 2:42.
 */

import React from "react";
import {Link, Switch, Route, BrowserRouter} from 'react-router-dom';
import taskGroup from 'bundle-loader?lazy&name=pc/trends_asset/admin/user/app-[name]!./page/taskGroup/taskGroup.js';
import dailyTaskDetailed from 'bundle-loader?lazy&name=pc/trends_asset/admin/user/app-[name]!./page/dailyTaskDetailed/dailyTaskDetailed.js';
import {loading} from '../../../../../bundle';
import ReactChild from "../../../../lib/util/ReactChild";


class user extends ReactChild {
    render() {
        let {url}=this.props.match;
        return (
            <div>
                <Switch>
                    <Route path={url + "/taskGroup"} component={loading(taskGroup)}/>{/*任务组*/}
                    <Route path={url + "/dailyTaskDetailed"} component={loading(dailyTaskDetailed)}/>{/*日常任务*/}
                </Switch>
            </div>

        )
    }
}

export default user;
//2018.6.25  shiying
import React from "react";
import {Link, Switch, Route, BrowserRouter} from 'react-router-dom';
import empManage from 'bundle-loader?lazy&name=pc/trends_asset/admin/user/app-[name]!./page/empManage/empManage.js';
import userMessage from 'bundle-loader?lazy&name=pc/trends_asset/admin/user/app-[name]!./page/userMessage/userMessage.js';
import talentSetUp from 'bundle-loader?lazy&name=pc/trends_asset/admin/user/app-[name]!./page/talentSetUp/talentSetUp.js';
import userRegister from 'bundle-loader?lazy&name=pc/trends_asset/admin/user/app-[name]!./page/userRegister/userRegister.js';
import addNewEmp from 'bundle-loader?lazy&name=pc/trends_asset/admin/user/app-[name]!./page/addNewEmp/addNewEmp.js';
import listManage from 'bundle-loader?lazy&name=pc/trends_asset/admin/user/app-[name]!./page/listManage/listManage.js';
import newHead from 'bundle-loader?lazy&name=pc/trends_asset/admin/user/app-[name]!./page/head/newHead.js';
import newLargeProcess from 'bundle-loader?lazy&name=pc/trends_asset/admin/user/app-[name]!./page/largeProcess/newLargeProcess.js';
import {loading} from '../../../../../bundle';
import ReactChild from "../../../../lib/util/ReactChild";


class user extends ReactChild {
    render() {
        let {url}=this.props.match;
        return (
            <div>
                <Switch>
                    <Route path={url + "/empManage"} component={loading(empManage)}/>{/*人员管理*/}
                    <Route path={url + "/userMessage"} component={loading(userMessage)}/>{/*我的信息*/}
                    <Route path={url + "/talentSetUp"} component={loading(talentSetUp)}/>{/*达人设置*/}
                    <Route path={url + "/userRegister"} component={loading(userRegister)}/>{/*达人注册 userRegister*/}
                    <Route path={url + "/addNewEmp"} component={loading(addNewEmp)}/>{/*员工填写表*/}
                    <Route path={url + "/listManage"} component={loading(listManage)}/>{/*（组织，达人，员工）列表管理*/}
                    {/* <Route path={url + "/head"} component={loading(head)}/>*/}{/*导航栏设置*/}
                    <Route path={url + "/head"} component={loading(newHead)}/>{/*新导航栏设置*/}
                    <Route path={url + "/largeProcess"} component={loading(newLargeProcess)}/>{/*工作流程管理*/}

                </Switch>
            </div>

        )
    }
}

export default user;
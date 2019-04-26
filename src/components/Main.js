import '../styles/App.css';

import {Link, Switch, Route} from 'react-router-dom';
import {loading} from '@/bundle';
import "../styles/component/util/menu.js.css";
import '../styles/bootstrap-theme/css/bootstrap-default.css'
import React from "react";
import ReactChild from "./lib/util/ReactChild"
import AdminMainContainer from 'bundle-loader?lazy&name=pc/trends_asset/app-[name]!./page/admin/AdminMain.js';
import VisibleMainContainer from 'bundle-loader?lazy&name=pc/trends_asset/app-[name]!./page/visible/VisibleMain.js';
import AnnouncementContainer from 'bundle-loader?lazy&name=pc/trends_asset/app-[name]!./page/visible/announcement';
import IndexContainer from 'bundle-loader?lazy&name=pc/trends_asset/app-[name]!./page/Index.js';
import HomePageIndexContainer from 'bundle-loader?lazy&name=pc/trends_asset/app-[name]!./page/homePage.js';
import TestContainer from 'bundle-loader?lazy&name=pc/trends_asset/app-[name]!./page/admin/page/test/testIndex.js';

class AppComponent extends ReactChild {

    constructor(props) {
        super(props);
        window.onerror = function (msg, url, line, col, error) {
            window.demoError = arguments
        }
    }

    render() {
        return (
            <Switch>
                <Route path="/" exact component={loading(IndexContainer)}/>
                <Route path="/pc" exact component={loading(IndexContainer)}/>
                <Route path="/pc/index" exact component={loading(HomePageIndexContainer)}/>
                <Route path="/pc/admin" component={loading(AdminMainContainer)}/>
                <Route path="/pc/adm" component={loading(AdminMainContainer)}/>
                <Route path="/pc/ad" component={loading(AdminMainContainer)}/>
                <Route path="/pc/test" component={loading(TestContainer)}/>
                <Route path="/pc/visible" component={loading(VisibleMainContainer)}/>
                <Route path="/pc/announcement" component={loading(AnnouncementContainer)}/>
            </Switch>

        );
    }
}

AppComponent.defaultProps = {};

export default AppComponent;

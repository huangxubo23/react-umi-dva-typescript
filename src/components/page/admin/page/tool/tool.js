//2018.6.25  shiying

import React from "react";
import {Link, Switch, Route, BrowserRouter} from 'react-router-dom';
import {loading} from '../../../../../bundle';
import bachelorWisdom from 'bundle-loader?lazy&name=pc/trends_asset/admin/tool/[name]!./page/bachelorWisdom/bachelorWisdom.js';
import newShop from 'bundle-loader?lazy&name=pc/trends_asset/admin/tool/[name]!./page/newShop/newShop.js';
import newStores from 'bundle-loader?lazy&name=pc/trends_asset/admin/tool/[name]!./page/newStore/newStores.js';
import newPrivateBrand from 'bundle-loader?lazy&name=pc/trends_asset/admin/tool/[name]!./page/newPrivateBrand/newPrivateBrand.js';
import smartCutout from 'bundle-loader?lazy&name=pc/trends_asset/admin/tool/[name]!./page/smartCutout/smartCutout.js';
import businessItemTesting from 'bundle-loader?lazy&name=pc/trends_asset/admin/tool/[name]!./page/businessItemTesting/businessItemTesting.js';
import itemTesting from 'bundle-loader?lazy&name=pc/trends_asset/admin/tool/[name]!./page/itemTesting/itemTesting.js';
import getVideo from "bundle-loader?lazy&name=pc/trends_asset/admin/tool/[name]!./page/getVideo/getVideo";
import taobaoCheesy from "bundle-loader?lazy&name=pc/trends_asset/admin/tool/[name]!./page/taobaoCheesy/taobaoCheesy";
import addCopyWriting from "bundle-loader?lazy&name=pc/trends_asset/admin/tool/[name]!./page/addCopyWriting/addCopyWriting";
import videoManagement from "bundle-loader?lazy&name=pc/trends_asset/admin/tool/[name]!./page/videoManagement/videoManagement";
import ReactChild from "../../../../lib/util/ReactChild";


class tool extends ReactChild {
    render() {
        let {url}=this.props.match;
        return (
            <div>
                <Switch>
                    <Route path={`${url}/bachelorWisdom`} component={loading(bachelorWisdom)}/>{/*一士之智*/}
                    <Route path={`${url}/newShop`} component={loading(newShop)}/>{/*新店铺*/}
                    <Route path={`${url}/newStore`} component={loading(newStores)}/>{/*店铺新品*/}
                    <Route path={`${url}/smartCutout`} component={loading(smartCutout)}/>{/*智能抠图*/}
                    <Route path={`${url}/businessItemTesting`} component={loading(businessItemTesting)}/>{/*商家店铺全名检测*/}
                    <Route path={`${url}/itemTesting`} component={loading(itemTesting)}/>{/*达人用店铺全名检测*/}
                    <Route path={`${url}/getVideo`} component={loading(getVideo)}/>{/*有无视频判断*/}
                    <Route path={`${url}/post`} component={loading(taobaoCheesy)}/>{/*文案合成*/}
                    <Route path={`${url}/addCopyWriting`} component={loading(addCopyWriting)}/>{/*新文案合成*/}
                    <Route path={`${url}/privateBrand`} component={loading(newPrivateBrand)}/>{/*品牌库*/}
                    <Route path={`${url}/videoManagement`} component={loading(videoManagement)}/>{/*品牌库*/}
                </Switch>
            </div>

        )
    }
}

export default tool;
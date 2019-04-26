/**
 * Created by muqingzhong on 2017/7/13.
 */
import $ from 'jquery';
import React from 'react';
import {
    Button
} from 'element-react';
import EditBox from '../../../../lib/sharing/editBox/EditBox';
import {imgToBase64} from '../../../../lib/util/global';
import {ThousandsOfCall} from "../../../../lib/util/ThousandsOfCall";

import {BundleLoading, DialogBundle} from '../../../../../bundle';
import testDialog
    from 'bundle-loader?lazy&name=pc/trends_asset/components/test/app-[name]!./TestDialog';
import Validate from "../../../../lib/util/ValidateModal";
import {ajax} from "../../../../lib/newUtil/ajaxEx";

class Test extends React.Component {

    componentDidMount() {

        var miniLoginEmbedder = new window.MiniLoginEmbedder();

        //监听登录完成后的消息，resize已被监听
        miniLoginEmbedder.addEvent('onMessage', function (args) {
            if (args.action && args.action == "loginResult") {
                if (args.resultCode == '100') {
                    location.href = "https://lntcbc/login/loginSuccess.htm";//应用回跳地址
                }

            }
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            value: 1
        }
    }

    onChange(env) {
        let file = env.target.files[0];
        imgToBase64(file, (base64) => {
            window.postMessage({
                type: "thousandsOfCallUploading",
                data: {base64: base64}
            }, window.location.href)
        });

        window.addEventListener('message', function (event) {
            var origin = event.origin || event.originalEvent.origin;
            let data = event.data;
            if (data && data.type == "thousandsOfCallUploadingCallback") {
                console.log(data);
            }
        })
    }

    click = () => {
        let data = {
            "accountId": "772901506",
            "siteId": 41,
            "pageId": 6273,
            "fansId": "772901506",
            "status": 0,
            "currentPage": 2,
            "contentId": "",
            "tabString": "homepage",
            "subTabString": "items",
            "beginId": 0,
            "beginTime": 0
        };
        let s = {
            type: "originaljsonp",
            dataType: "originaljsonp",
            api: "mtop.taobao.maserati.xplan.render",
            v: "1.0",
            callback: "mtopjsonp5",
            appKey: 12574478,
            t: new Date().getTime()
        };
        ThousandsOfCall.acoustic({
            parameters: s,
            requesData: data,
            host: "https://h5api.m.taobao.com/h5",
            ajaxData: {requeryType: "get", referer: "https://h5.m.taobao.com"},
        }, "requestH5", (response) => {
            console.log(response);
        });

    };

    testDL = () => {

        ThousandsOfCall.acoustic({
            url: "http://alisec.taobao.com/checkcodev3.php?v=4&ip=120.35.149.217&sign=44e8a95b3888a654f42685639f1cd430&app=beehive-publish&how=default&http_referer=https://we.taobao.com",
            id: 3,
            // url: "http://we.taobao.com", id: 3
        }, 'switchAccount', (json) => {
            console.log(json);
        });

    }

    render() {
        return (
            <div>
                <div style={{border: "1px solid", margin: "5px"}}>
                    <EditBox onChange={(con) => {
                    }}/>
                </div>
                <Button onClick={this.click}>diaji</Button>
                <Button onClick={this.testDL}>测试代理</Button>
                <Button onClick={this.clickaa}>无限发请求</Button>

                <DialogBundle ref={e => this.dt = e} bundleProps={{load: testDialog}} dialogFooter={<div><Button
                    onClick={() => this.dt.setState({dialogVisible: false})}>取消</Button>
                    <Button type="primary" onClick={() => this.dt.setState({dialogVisible: false})}>确定</Button>
                </div>}> </DialogBundle>
            </div>
        );
    }
}


export default Test;
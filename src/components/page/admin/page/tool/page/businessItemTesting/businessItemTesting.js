/**
 * Created by linhui on 17-10-1.商家店铺全名检测
 */
require('../../../../../../../styles/tool/businessItemTesting.css');
import React from 'react';
import ReactChild from "../../../../../../lib/util/ReactChild";
import $ from 'jquery';
import '../../../../../../lib/util/ajaxfileupload';
import noty from 'noty';
import {ajax} from '../../../../../../lib/util/ajax';
import {ThousandsOfCall} from '../../../../../../lib/util/ThousandsOfCall';
import  {
    Button,
    FieldGroup,
    Alert,
    FormGroup,
    FormControl,
    Col,
    Panel,
    InputGroup,
    Row,
    Form,
    ProgressBar,
    ControlLabel,
} from 'react-bootstrap';

class Testing extends React.Component {
    qChange = (env) => {
        let value = env.target.value;
        this.props.setPaState({q: value});
    };
    testIngButton = () => {
        let zujian = this;
        let n = new noty({
            text: '<h4>检测一次将扣除720的点数(10元)，您确定要进行检测吗</h4>',
            theme: 'bootstrap-v4',
            modal: true,
            layout: 'center',
            type: 'warning',
            buttons: [
                noty.button('检测', 'btn btn-success', function () {
                    ajax.ajax({
                        type: 'post',
                        url: '/user/admin/businessPayment.io',
                        data: {},
                        callback:  ()=> {
                            let esteemn = zujian.props.getState.userInfo.esteemn;
                            if(esteemn&&esteemn>720){
                                new noty({
                                    text: '点数扣除成功',
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
                                zujian.props.setPaState({modsItemlist: [], itemLog: [], progressBar: 0, isClose: true}, () => {
                                    zujian.props.queryByCheenlByPage();
                                });
                            }
                        }
                    });
                    n.close();
                }, {id: 'button1', 'data-status': 'ok'}),
                noty.button('取消', 'btn btn-error', function () {
                    n.close();
                })
            ]
        }).show();
    };

    componentDidUpdate = () => {
        let div = $("#jclog")[0];
        div.scrollTop = div.scrollHeight;
    };

    render() {
        let state = this.props.getState;
        let progressBar = state.progressBar;
        return (
            <div>
                <Alert bsStyle="info"><strong>商家店铺全名检测</strong></Alert>
                <Form horizontal>
                    <FormGroup>
                        <Col sm={12}>
                            <InputGroup>
                                <FormControl placeholder="请输入要检测的店铺全名" type="text" onChange={this.qChange}/>
                                <InputGroup.Button>
                                    <Button bsStyle="info"
                                            disabled={state.isClose ? true : false}
                                            onClick={this.testIngButton}>{state.isClose ? '检测中' : '检测'}</Button>
                                </InputGroup.Button>
                            </InputGroup>
                        </Col>
                    </FormGroup>
                </Form>
                <Row >
                    <Col componentClass={ControlLabel} sm={1}>
                        检测进度
                    </Col>
                    <Col sm={11}>
                        <ProgressBar now={progressBar} active label={progressBar + '%'}/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={7}>
                        {state.modsItemlist.map((item, i) => {
                            if (item.data.auctions.length > 0) {
                                return (
                                    <div key={ '商品'+ i}>{/*item.channelId*/}
                                        <Panel header={item.channelName}>
                                            <p>该主题有您店铺的商品<Button bsStyle='info' target="_blank"
                                                                 href={item.search}>点击查看</Button></p>
                                        </Panel>
                                    </div>
                                )
                            }
                        })}
                    </Col>
                    <Col sm={5}>
                        <Panel header='检测日志'>
                            <div style={{width: "100%", height: "52%", border: "1px"}}>
                                <div id="jclog"
                                     style={{overflow: "auto", width: "100%", height: "500px", border: "1px"}}>
                                    {state.itemLog.map((item, i) => {

                                        return (
                                            <p key={'日志'+i} style={{color: item.t}}>{item.log}</p>
                                        )

                                    })}
                                </div>
                            </div>
                        </Panel>
                    </Col>
                </Row>
            </div>
        )
    }
}
class BusinessItemTesting extends ReactChild {
    componentDidMount() {
        //this.queryTitleAndMainChannel();
        //  this.goPage(1);
        let flag = '';
        let tool = '';
        let zujian = this;

        ThousandsOfCall.acoustic('', 'testbb', (data) => {
            flag = data;
            tool = 'ThousandsOfCall';
            h();
        });
        function h() {
            if (flag) {
                zujian.setState({flag: flag, tool: tool}, () => {
                    zujian.getMain();
                    // zujian.getItemTestingData();
                });
            } else {
                zujian.setState({flag: flag});
            }
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            pageNow: 1,
            pageSize: 100,
            count: 0,
            flag: '',//检测是否安装插件
            tool: '',//是否发布版或选品
            q: '',//搜索参数
            modsItemlist: [],//查询出后的数据
            channelName: '',//渠道名字
            channelId: '',//渠道Id
            itemLog: [],//商品日志
            itemListIds: [],//新增内容id
            isClose: false,//检测按钮
            promotionType: '',//活动Id
            MainChannel: [],//渠道１
            progressBar: 0,//进度条
            userInfo:{},//用户信息
            repeatId: '',//去重Id
        }
    }

    addLog = (log, t, callback) => {
        let itemLog = this.state.itemLog;
        let end = {log: log, t: t};
        itemLog.push(end);
        this.setState({itemLog: itemLog}, callback);
    };
    goPage = (pageNow) => {/*点击分页*/
        let zujian = this;
        pageNow = pageNow ? pageNow : zujian.state.pageNow;
        zujian.queryByCheenlByPage({
            pageNow: pageNow,
            pageSize: zujian.state.pageSize,
        });
    };
    setThisState = (state, callback) => {
        this.setState(state, function () {
            if (callback && (typeof callback) == 'function') {
                callback();
            }
        });
    };
    getMain = () => {//拿取用户信息,拿点数
        let zujian = this;
        ajax.ajax({
            type: "post",
            url: "/user/admin/getIndexHeader.io",//要访问的后台地址
            data: {},
            callback: (data)=> {
                this.setState({userInfo:data});
            }
        });
    };
    queryByCheenlByPage = () => {
        let zujian = this;
        let tool = this.state.tool;
        let modsItemlist = zujian.state.modsItemlist;
        //  let itemListIds = this.state.itemListIds;
        let itemLength = '';
        let repeatId = this.state.repeatId;
        let data = {
            pageSize: this.state.pageSize,
            promotionType: this.state.promotionType == undefined || this.state.promotionType == 'undefined' || this.state.promotionType == '' ? '' : this.state.promotionType,
            orderType: 1,
            q: '',
            count: this.state.count,
            pageNow: 1,
        };
      if (tool == 'ThousandsOfCall') {
            fortotal(ThousandsOfCall);
        }
        let itemList = [];

        function fortotal(T, current) {
            data.pageNow = current;
            zujian.addLog("抓取活动列表第" + current + "页");
            ajax.ajax(//拿取所有渠道
                {
                    url: '/user/admin/superManage/queryByCheenlByPage.io', data: data,
                    callback: (json) => {
                        itemList = itemList.concat(json.channel);//拿取id传值
                        if (json.count > json.pageNow * json.pageSize) {
                            fortotal(T, json.pageNow + 1);
                        } else {
                            zujian.addLog("列表采集结束开始匹配");
                            itemLength = itemList.length;
                            xh(T, itemList);
                        }
                    }
                });
        }

        function xh(T, itemList) {
            let num = parseFloat(itemList.length);
            let total = parseFloat(itemLength);
            let progressBar = 100 - (Math.round(num / total * 10000) / 100.00 );
            zujian.setState({progressBar: progressBar}, () => {
                if (itemList.length == 0) {
                    zujian.setState({isClose: false});
                    zujian.addLog("检查结束", "green");
                    return;
                }

                let item = itemList.shift();
                T.acoustic({//https://contents.taobao.com/api2/activity/activity_info.json?id=412&__version__=3.0
                        url: 'https://contents.taobao.com/api2/channel/channel_info.json',
                        data: {id: item.id, __version__: '3.0',}
                    },//获取所有id
                    "request", (jsonurl) => {
                        let url = jsonurl.data && jsonurl.data.selectItemData ? jsonurl.data.selectItemData.url : '';//https://we.taobao.com/material/square/detail?kxuanParam={"nested":"we","id":"2037"}
                        zujian.addLog('开始检测' + item.title + "-" + item.columnName + "(" + itemList.length + ")", "green");
                        if (url) {

                            let kxuanParam = url.split('?')[1];
                            let obj = kxuanParam.split('=')[1];
                            let object = JSON.parse(obj);
                            let selectItemData = {
                                spm: 'a2114o.8709285.20.' + object.id,
                                nested: object.nested,
                                id: object.id,
                            };
                            let search = 'https://kxuan.taobao.com/search.htm?spm=a2114o.8709285.20.' + object.id + '&nested=' + object.nested + '&id=' + object.id + '&q=' + zujian.state.q;
                            T.acoustic(//根据id获取页面
                                {
                                    url: 'https://kxuan.taobao.com/search.htm', dataType: 'text',
                                    data: selectItemData
                                },
                                "request", (text) => {
                                    let index = text.indexOf("var params = ");
                                    let parem = text.substring(index);
                                    let index2 = parem.indexOf(';');
                                    let str = parem.substring(12, index2);
                                    let str2 = str.replace('"', '');
                                    let str3 = str2.replace('"', '');
                                    let array = str3.trim().split('&');
                                    let dataobj = {};
                                    for (let i = 0; i < array.length; i++) {
                                        dataobj[array[i].split('=')[0]] = unescape(array[i].split('=')[1]) == 'undefined' || unescape(array[i].split('=')[1]) == '' ? '' : unescape(array[i].split('=')[1]);
                                    }
                                    dataobj.q = zujian.state.q;
                                    let itemListIds = zujian.state.itemListIds;
                                    // dataobj.q = itemListIds[z].q;
                                    ThousandsOfCall.acoustic(
                                        {
                                            url: 'https://kxuan.taobao.com/searchSp.htm',
                                            dataType: 'jsonp',
                                            data: dataobj
                                        },//获取所有数据
                                        "request", (json484) => {
                                            if(repeatId.indexOf(object.id)<0){
                                                let itemListData = json484.mods.itemlist;
                                                itemListData.channelName = item.title + "-" + item.columnName;
                                                itemListData.channelId = item.id;
                                                itemListData.search = search;
                                                modsItemlist.push(itemListData);

                                                repeatId+=object.id+',';
                                                zujian.setState({repeatId: repeatId});
                                            }
                                            zujian.addLog('结束检测' + item.title + "-" + item.columnName, "red", () => {
                                                xh(T, itemList);
                                            });
                                        });
                                });

                        } else {
                            zujian.addLog('该渠道没有选品池');
                            xh(T, itemList);
                        }
                    });
            });

        }


    };

    render() {
        return (
            <div>
                <Testing queryByCheenlByPage={this.queryByCheenlByPage} getState={this.state}
                         setPaState={this.setThisState}/>
            </div>
        )
    }
}

export default BusinessItemTesting;
/**
 * Created by linhui on 17-9-28.达人用店铺全名检测
 */
require('../../../../../../../styles/tool/itemTesting.css');
import React from 'react';
import ReactChild from "../../../../../../lib/util/ReactChild";
import $ from 'jquery';
import '../../../../../../lib/util/ajaxfileupload';
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
    ControlLabel,
    ProgressBar,
} from 'react-bootstrap';

class Testing extends React.Component {
    qChange = (env) => {
        let value = env.target.value;
        this.props.setPaState({q: value});
    };
    testIngButton = () => {
        this.props.setPaState({modsItemlist: [], itemLog: [], progressBar: 0, isClose: true}, () => {
            this.props.getItemTestingData();
        });
    };
    activityChange = (env) => {//需要检测的活动件事
        let value = env.target.value;
        this.props.setPaState({promotionType: value});
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
                <Alert bsStyle="info"><strong>店铺全名检测</strong></Alert>
                <Form horizontal>
                    <FormGroup >
                        <Col componentClass={ControlLabel} sm={1}>
                            需要检测的活动
                        </Col>
                        <Col sm={11}>
                            <FormControl componentClass='select' onChange={this.activityChange}
                                         value={state.promotionType}>
                                <option value=''>邀请我的活动</option>
                                <option value='1'>双11专区</option>
                            </FormControl>
                        </Col>
                    </FormGroup>
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
                        {console.log(state.modsItemlist)}
                        {state.modsItemlist.map((item, i) => {
                            if (item.data.auctions.length > 0) {
                                return (
                                    <div key={item.channelId}>
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
                                            <p key={i} style={{color: item.t}}>{item.log}</p>
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
class ItemTesting extends ReactChild {
    componentDidMount() {
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
            progressBar: 0,//进度条
            repeatId: '',//去重Id
        }
    }

    addLog = (log, t, callback) => {
        let itemLog = this.state.itemLog;
        let end = {log: log, t: t};
        itemLog.push(end);
        this.setState({itemLog: itemLog}, callback);
    };

    setThisState = (state, callback) => {
        this.setState(state, function () {
            if (callback && (typeof callback) == 'function') {
                callback();
            }
        });
    };
    getItemTestingData = () => {
        let zujian = this;
        let tool = this.state.tool;
        let modsItemlist = zujian.state.modsItemlist;
        //  let itemListIds = this.state.itemListIds;
        let itemLength = '';
        let repeatId = this.state.repeatId;
        let data = {
            pageSize: 100,
            promotionType: this.state.promotionType == undefined || this.state.promotionType == 'undefined' || this.state.promotionType == '' ? '' : this.state.promotionType,
            orderType: 1,
            q: '',
            current: 1,
        };
       if (tool == 'ThousandsOfCall') {
            fortotal(ThousandsOfCall);
        }
        let itemList = [];

        function fortotal(T, current) {
            data.current = current;
            zujian.addLog("抓取活动列表第" + current + "页");
            T.acoustic(
                {url: 'https://contents.taobao.com/api2/activity/activity_list.json', data: data},//获取所有数据
                "request", (json) => {
                    itemList = itemList.concat(json.data.itemList);//拿取id传值
                    if (json.data.total > json.data.pageSize * json.data.current) {
                        fortotal(T, json.data.current + 1);
                    } else {
                        zujian.addLog("列表采集结束开始匹配");
                        itemLength = itemList.length;
                        xh(T, itemList);
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
                T.acoustic({
                        url: 'https://contents.taobao.com/api2/activity/activity_info.json?',
                        data: {id: item.id, __version__: '3.0',}
                    },//获取所有id
                    "request", (jsonurl) => {
                        let url = jsonurl.data.selectItemData ? jsonurl.data.selectItemData.url : '';//https://we.taobao.com/material/square/detail?kxuanParam={"nested":"we","id":"2037"}
                        if (url) {
                            zujian.addLog('开始检测' + item.name + "(" + itemList.length + ")", "green", () => {
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
                                                    itemListData.channelName = item.name;
                                                    itemListData.channelId = item.id;
                                                    itemListData.search = search;
                                                    modsItemlist.push(itemListData);

                                                    repeatId+=object.id+',';
                                                    zujian.setState({repeatId: repeatId});
                                                }
                                                zujian.addLog('结束检测' + item.name, "red", () => {
                                                    xh(T, itemList);
                                                });
                                            });
                                    });


                            });
                        } else {
                            xh(T, itemList);
                        }
                    });
            });

        }


    };

    render() {
        return (
            <div>
                <Testing getItemTestingData={this.getItemTestingData} getState={this.state}
                         setPaState={this.setThisState}/>
            </div>
        )
    }
}

export default ItemTesting;
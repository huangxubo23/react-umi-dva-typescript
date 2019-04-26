/**
 * Created by 林辉 on 2018/10/22 18:52.手动同步审核状态
 */
import ReactChild from "../../../../../../lib/util/ReactChild";
import {
    getIdContent, daren_list,
} from '../release/components/take';
import $ from 'jquery';
import {Pagination, Message, MessageBox, Layout, Card, Checkbox, Dropdown, Dialog, Button, Tabs, Notification, Select, Input, Alert, Cascader} from 'element-react';
import {ThousandsOfCall} from "../../../../../../lib/util/ThousandsOfCall";
import {clone} from "../../../../../../lib/util/global";
import AJAX from "../../../../../../lib/newUtil/AJAX";

class Synchronization extends ReactChild {
    constructor(props) {
        super(props);
        let {contentType, ids, direction} = this.props.match.params;
        this.state = {
            addressData: {//链接地址数据
                contentType, direction, ids: ids,
            },
            AuthorizationMap: [],
            noAuthorizationMap: [],
            log: [],
            putBottom: true,
        }
    }

    componentDidMount() {

        let {ids} = this.state.addressData;
        this.getToAudit(ids, (data) => {//依据ids拿取内容
            daren_list((talent) => {
                this.synchronizationContent(data, talent);
                this.scrollParent();
            })
        });
    };

    scrollParent = () => {
        let scrollParent = $('.dom_id');
        scrollParent.scroll(() => {
            let cl = $('.dom_id');
            let viewH = cl.height();//可见高度
            let contentH = cl.get(0).scrollHeight;//内容高度
            let scrollTop = cl.scrollTop();//滚动高度
            if (viewH + scrollTop == contentH) {
                this.setState({putBottom: true});
            } else {
                this.setState({putBottom: false});
            }
        });
    };


    getToAudit = (ids, callback) => {
        this.synchronizationAJAX.ajax({
            url: '/content/admin/effectAnalyse/getToAudit.io',
            data: {ids: ids},
            type: "get",
            dataType: 'json',
            jsonp: 'callback',
            callback: (json) => {
                if (callback) {
                    callback(json.feedId);
                }
            }
        });
    };

    synchronizationContent = (showContent, list) => {//同步筛选内容
        let [arrar1, array2] = [[], []];
        for (let s = 0; s < showContent.length; s++) {
            for (let l = 0; l < list.length; l++) {
                if (showContent[s].darenId == list[l].accountId && showContent[s].feedId) {
                    list[l].releaseResults = 1;
                    if (list[l].cookieIsFailure) {
                        showContent[s].talent = list[l];
                        arrar1.push(showContent[s]);
                    } else {
                        showContent[s].talent = list[l];
                        array2.push(showContent[s]);
                    }
                }
            }
        }
        this.setState({AuthorizationMap: arrar1, noAuthorizationMap: array2});
    };
    getSynchronization = () => {//开始同步
        let {AuthorizationMap} = this.state;
        let array = clone(AuthorizationMap);
        this.forSynchronization(array, 0, () => {

        });
    };

    forSynchronization = (array, i = 0, callback) => {
        let {putBottom, AuthorizationMap} = this.state;
        if (array.length > 0) {
            let object = array.shift();

            ThousandsOfCall.acoustic(object, "manualSynchronizationState", (msg) => {
                    AuthorizationMap[i].releaseResults = 3;
                    if (msg) {
                        this.setState({AuthorizationMap: AuthorizationMap}, () => {
                            this.forSynchronization(array, i + 1, callback);
                        });
                    } else {
                        Message({
                            message: '获取失败',
                            type: 'warning'
                        });
                        this.setState({AuthorizationMap: AuthorizationMap}, () => {
                            this.forSynchronization(array, i + 1, callback);
                        });
                    }
                }, (message) => {
                    let log = this.state.log;
                    log.push(message);
                    AuthorizationMap[i].releaseResults = 2;
                    this.setState({log: log, AuthorizationMap: AuthorizationMap}, () => {
                        if (putBottom) {
                            $('.dom_id').scrollTop(999999999)
                        }
                    });
                }
            )
        } else {
            if (callback) {
                callback();
            }
        }
    };


    render() {
        let {AuthorizationMap, noAuthorizationMap, log} = this.state;
        return (
            <div>
                <Tabs type="border-card" activeName="1">
                    <Tabs.Pane label='手动同步审核状态' name="1">
                        <Layout.Row gutter="10" style={{marginTop: "8px"}}>
                            <Layout.Col span="24">
                                <Button type='info' block onClick={() => {
                                    this.getSynchronization();
                                }} style={{width: '100%'}}>开始同步审核状态</Button>
                            </Layout.Col>
                        </Layout.Row>
                        <Layout.Row gutter="10" style={{marginTop: "8px"}}>
                            <Layout.Col span="12">
                                <AJAX ref={e => this.synchronizationAJAX = e}>
                                    <NewPanel header="同步审核状态详情">
                                        <div style={{
                                            height: "500px",
                                            overflowY: "scroll",
                                            overflow: "auto",
                                            overflowX: 'hidden'
                                        }}>
                                            {AuthorizationMap.map((map, m) => {
                                                return (
                                                    <Layout.Row gutter="10" style={{marginTop: "8px"}} key={map.id}>
                                                        <Layout.Col span="12" style={{fontWeight: 'bold'}}>
                                                            <div>{map.title}</div>
                                                        </Layout.Col>
                                                        <Layout.Col span="9">
                                                            <div>{map.talent.title}</div>
                                                        </Layout.Col>
                                                        <Layout.Col span='3'>
                                                            <Button
                                                                type={map.releaseResults === 1 ? 'warning' : map.releaseResults === 2 ? 'info' : map.releaseResults === 3 ? 'success' : 'warning'}
                                                                icon={map.releaseResults === 1 ? 'information' : map.releaseResults === 2 ? 'loading' :map.releaseResults === 3?  'check':'information'}
                                                                size="small">
                                                                { map.releaseResults === 1 ? '未同步' : map.releaseResults === 2 ? '同步中' :map.releaseResults === 3 ?'已同步':'未同步' }
                                                            </Button>
                                                        </Layout.Col>
                                                    </Layout.Row>
                                                )
                                            })}
                                            {noAuthorizationMap.map((map, m) => {
                                                return (
                                                    <Layout.Row gutter="10" style={{marginTop: "8px"}} key={map.id}>
                                                        <Layout.Col span="16" style={{fontWeight: 'bold'}}>
                                                            <div>{map.title}</div>
                                                        </Layout.Col>
                                                        <Layout.Col span="8">
                                                            <div>{map.talent.title}(未授权)</div>
                                                        </Layout.Col>
                                                    </Layout.Row>
                                                )
                                            })}
                                        </div>
                                    </NewPanel>
                                </AJAX>
                            </Layout.Col>
                            <Layout.Col span="12">
                                <NewPanel header="审核同步提示">
                                    <div style={{
                                        textAlign: 'left',
                                        height: "500px",
                                        overflowY: "scroll",
                                        overflow: "auto",
                                        overflowX: 'hidden'
                                    }}
                                         className="dom_id">
                                        {log.map((lo, l) => {
                                            if (lo.color == 'info') {
                                                return (
                                                    <div key={l} style={{
                                                        marginTop: "2px",
                                                        maxHeight: "120px",
                                                        overflowY: "scroll",
                                                        overflow: "auto",
                                                        wordBreak: 'break-all',
                                                        whiteSpace: 'normal'
                                                    }}>
                                                        <Alert title={lo.text} type={lo.color}/>
                                                    </div>
                                                )
                                            } else {
                                                return (
                                                    <div>{lo.text}</div>
                                                )
                                            }

                                        })}
                                    </div>

                                </NewPanel>
                            </Layout.Col>
                        </Layout.Row>
                    </Tabs.Pane>
                </Tabs>
            </div>
        )
    }
}

class NewPanel extends React.Component {
    render() {
        let {header} = this.props;
        return (
            <div style={{
                marginTop: "10px",
                marginBottom: '12px',
                backgroundColor: '#fff',
                border: '1px solid transparent',
                borderRadius: '4px',
                boxShadow: '0 1px 1px rgba(0, 0, 0, .05)',
                borderColor: '#bce8f1'
            }}>
                <div style={{
                    padding: '3px 10px',
                    borderBottom: '1px solid transparent',
                    borderTopLeftRadius: '3px',
                    borderTopRightRadius: '3px',
                    color: '#31708f',
                    backgroundColor: '#d9edf7',
                    borderColor: '#bce8f1',
                }}>
                    <h4>{header}</h4>
                </div>
                <div style={{
                    padding: '10px',
                }}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}


export default Synchronization;
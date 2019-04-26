/**
 * Created by shiying on 17-10-28.
 */

import React from 'react';
import {acoustic} from '../../util/global'
import {Notification, Pagination, Dialog,Table,Layout,Button,Select,Input,Radio} from 'element-react';
import 'element-theme-default';
import {daren_list} from "../../../page/admin/page/content/page/release/components/take";
import {talentNick} from "../../../page/admin/page/content/page/release/components/darenData";

class UpShop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            model: {
                list: [],
                pageNo: 1,
                total: 1,
            },
            keywords: "",
            radioId: "",
            radioIdItem: "",
            daren_name: '',//登录达人名称
            daren_list: [],//选择达人列表
            daren_release: "0",//选择发布达人
            columns:[{
                label: '店铺 id',
                prop: 'radioId',
                width: 150,
                render:(item)=>{
                    return(
                        <Radio value={item.id} checked={this.state.radioId === item.id} onChange={()=>this.selectTypeTab({item,value:item.id})}>{item.id}</Radio>
                    )
                }
            },{
                label: '店铺名称',
                prop: 'shopName',
            },{
                label: '特色类型',
                prop: 'category1',
            },{
                label: '图文内容数',
                prop: 'contentCount',
                width: 90,
            },{
                label: '视频内容数',
                prop: 'videoCount',
                width: 90,
            },{
                label: '主营宝贝',
                prop: 'baby',
                width: 320,
                render:(item)=>{
                    return (
                        <tr>
                            <td>
                                <img src={"http://gw.alicdn.com/imgextra/" + item.item1} width="100" height="100" style={{marginLeft: "3px"}}/>
                            </td>
                            <td>
                                <img src={"http://gw.alicdn.com/imgextra/" + item.item2} width="100" height="100" style={{marginLeft: "3px"}}/>
                            </td>
                            <td>
                                <img src={"http://gw.alicdn.com/imgextra/" + item.item3} width="100" height="100" style={{marginLeft: "3px"}}/>
                            </td>
                        </tr>
                    );
                }
            }],
        }

    }

    open = () => {
        this.setState({showModal: true}, () => {
            this.shopList(1);
        });
    };
    close = () => {
        this.setState({showModal: false});
    };
    keywordsChange = (value) => {
        this.setState({keywords: value});
    };
    shopList = (page) => {
        let {keywords,daren_release}=this.state;
        let data = {
            pageNo: page,
            keywords: keywords,
        };
        if (daren_release == '0') {
            acoustic({
                agreement: "https",
                hostname: 'we.taobao.com',
                path: "/shop/shopList.json",
                data: data,
                method: "get",
                referer: "https://we.taobao.com/shop/shopList.htm",
            }, "requestRelyTB", (msg) => {
                let json = typeof msg == 'string' ? JSON.parse(msg) : msg;
                if (json) {
                    let model = json.model ? json.model : {list: [], pageNo: 1, total: 1};
                    this.setState({model: model});
                } else {
                    Notification({
                        title: '警告',
                        message: '未获取到数据!请重新登录或确定是否是达人账号！(不是达人账号请使用授权账号获取店铺)',
                        type: 'warning'
                    });
                }
            })
        } else {
            acoustic({
                agreement: "https",
                hostname: 'we.taobao.com',
                path: "/shop/shopList.json",
                data: data,
                method: "get",
                referer: "https://we.taobao.com/shop/shopList.htm",
                talentId: daren_release
            }, "requestRelyAgentTB", (msg) => {
                if(msg){
                    let json = typeof msg == 'string' ? JSON.parse(msg) : msg;
                    if (json) {
                        let model = json.model ? json.model : {list: [], pageNo: 1, total: 1};
                        this.setState({model: model});
                    } else {
                        Notification({
                            title: '警告',
                            message: '未获取到数据!请重新授权！',
                            type: 'warning'
                        });
                    }
                }else {
                    Notification({
                        title: '警告',
                        message: '数据为空',
                        type: 'warning'
                    });
                }
            })
        }
    };
    setKey = () => {
        this.shopList(this.state.model.pageNo);
    };
    goPage = (e) => {
        this.shopList(e);
    };

    selectTypeTab = ({item,value}) => {
        this.setState({radioId: value, radioIdItem: item});
    };

    submit = () => {
        let {radioIdItem} = this.state;
        if (radioIdItem) {
            let obj = {
                title: radioIdItem.shopName,
                coverUrl: "https://gw.alicdn.com/bao/uploaded/TB1RIsiPpXXXXXpXVXXXXXXXXXX-300-300.jpg",
                id: radioIdItem.shopId,
            };
            this.props.callback(obj);
            this.close();
        } else {
            Notification({
                title: '警告',
                message: '请选择一个店铺！',
                type: 'warning'
            });
        }
    };

    componentDidMount() {
        talentNick((us) => {
            if (us) {
                this.setState({daren_name: us.name}, () => {
                    daren_list((list) => {
                        this.setState({daren_list: this.repeatNumber(list, us.accountId)});
                    });
                });
            } else {
                daren_list((list) => {
                    this.setState({daren_list: list});
                });
            }
        })
    }

    repeatNumber = (list, accountId, arr = []) => {//剔除登录达人
        for (let l in list) {
            if (list[l].accountId != accountId) {
                arr.push(list[l]);
            }
        }
        return arr;
    };

    daren_releaseChange = ({id}) => {
        this.setState({daren_release: id}, () => {
            this.shopList(1);
        });
    };

    render() {
        let {model, daren_release, daren_name, daren_list,columns,showModal,keywords} = this.state;
        let list = model.list ? model.list : [];
        return (
            <div>
                <Dialog title="选择店铺" size="small" visible={showModal} onCancel={this.close} lockScroll={false} style={{width: '1000px'}}>
                    <Dialog.Body>
                        <Layout.Row gutter="10" style={{margin: "15px 0"}}>
                            <Layout.Col span="8">
                                <Select value={daren_release ? daren_release : '0'}
                                        onChange={(id) => this.daren_releaseChange({id})} style={{width: '100%'}}>
                                    <Select.Option label={daren_name ? daren_name + '(当前登录号)' : "当前账号未注册达人(不可用)"} value='0'/>
                                    {(daren_list ? daren_list : []).map((item, i) => {
                                        return (
                                            <Select.Option label={`${item.title}${item.cookieUpDate ? (item.cookieIsFailure ? '(已授权)' : "(授权失效)") : "(未授权)"}`}
                                                value={item.id} key={i} disabled={!item.cookieIsFailure}/>
                                        )
                                    })}
                                </Select>
                            </Layout.Col>
                            <Layout.Col span="16">
                                <Input placeholder="请输入关键字搜索店铺..." value={keywords} onChange={this.keywordsChange}
                                       append={<Button type="primary" icon="search" onClick={this.setKey}>搜索</Button>}/>
                            </Layout.Col>
                        </Layout.Row>
                        <Table columns={columns} data={list} border={true}/>
                        <div style={{textAlign: "center",margin:'10px 0'}}>
                            <Pagination layout="total, prev, pager, next, jumper" total={model.total}
                                        pageSize={10} currentPage={model.pageNo} onCurrentChange={this.goPage}/>
                        </div>
                    </Dialog.Body>
                    <Dialog.Footer className="dialog-footer">
                        <Button onClick={this.close} size="small">取消</Button>
                        <Button type="primary" onClick={this.submit} size="small">提交</Button>
                    </Dialog.Footer>
                </Dialog>
            </div>
        )
    }
}

export default UpShop;

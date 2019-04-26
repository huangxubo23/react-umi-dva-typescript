/**
 * Created by shiying on 17-10-9.官方精选
 */

import React from 'react';
import {Layout, Input, Alert, Button, Select,Pagination,Notification,Tooltip} from 'element-react';
import 'element-theme-default';
import '../../../../styles/component/react_assembly/UpItem.js.css';
import {ThousandsOfCall} from '../../../../components/lib/util/ThousandsOfCall';
import {clone} from '../../../../components/lib/util/global';

class SelectionOfPool extends React.Component {
    constructor(props) {
        super(props);
        let data = clone(props.data);
        let da = clone(props.da);
        this.state = {
            data: data ? data : {
                q: "",
                total: 100,
                pageSize: 20,
                orderBy: 'score-',//排序
                price: [],//价格
                priced: '',//最低价格
                priceg: '',//最高价格
                recentSellCount: [],//月销量
                taoKe: false,//是否淘客商品
                userType: '',//商品类型
                goodRate: [],//好评率
                saleConsignmentScore: [],//物流
                orderMerchandiseScore: [],//描述
                serviceQualityScore: [],//服务
            },
            da: da ? da : {},
            flag: false,
        };
    }

    componentWillReceiveProps(newProps) {
        if (newProps.selectionChange == 1) {
            this.czchange();
            this.props.noChange();
        }
    }

    componentDidMount() {

    }

    goPage = (e) => {
        let {data} = this.state,{categoryListApiQuery,activityId}=this.props;
        this.gainCommodity({
            poolId: categoryListApiQuery ? categoryListApiQuery.poolId : undefined,
            activityId:activityId,
            pageSize: 20,//当前页条数
            q: data.q,//关键词
            current: e,//当前页
            orderBy: data.orderBy,
            price: data.price,
            recentSellCount: data.recentSellCount,
            taoKe: data.taoKe,
            userType: data.userType,
            goodRate: data.goodRate,
            saleConsignmentScore: data.saleConsignmentScore,
            orderMerchandiseScore: data.orderMerchandiseScore,
            serviceQualityScore: data.serviceQualityScore,
        });
    };

    gainCommodity = (data) => {
        ThousandsOfCall.acoustic({
            agreement: "https",
            hostname: "resource.taobao.com",
            path: '/poolresource/query',
            method: "POST",
            data: data,
            referer: "https://we.taobao.com/",
        }, "requestRelyTB", (json20) => {
            if (json20) {
                let json = JSON.parse(json20.data);
                if (json.status == "SUCCESS") {
                    let d = json.data;
                    let data = this.state.data;
                    data.current = d.current;
                    data.pageSize = d.pageSize;
                    data.total = d.total;
                    data.itemList = d.itemList;
                    this.setState({data: data});
                } else {
                    Notification({
                        title: '警告',
                        message: `淘宝:${json.message}`,
                        type: 'warning'
                    });
                }
            } else {
                Notification.error({
                    title: '错误',
                    message: '未获取到官方精选数据'
                });
            }
        });
    };

    orderByVearch = ({value}) => {//排序搜索
        let {data} = this.state;
        data.orderBy = value;
        this.setState({data}, this.searchPage);
    };

    searchTitleChange = ({value}) => {
        let {data} = this.state;
        data.q = value;
        this.setState({data});
    };

    priceChange = ({name,value}) => {//价格事件
        let {data} = this.state;
        data[name] = value;
        this.setState({data});
    };

    searchClick = () => {
        let {data} = this.state;
        let {priced,priceg} = data;
        Object.assign(data,{
            price:(priced || priceg)?`[${priced},${priceg}]`:''
        });
        this.setState({data}, this.searchPage);
    };

    itemListChange = ({name, value}) => {//改变事件
        let {data, da} = this.state;
        let string = '';
        if (name == 'q') {
            data[name] = value;
            this.setState({data: data});
        } else if (name == 'taoKe') {
            data[name] = value;
            this.setState({data: data}, this.searchPage);
        } else if (name == 'recentSellCount') {
            data[name] = value;
            this.setState({data: data});
        } else {
            if (value == "N") {
                string = '';
                data[name] = string;
                da[name] = value;
                this.setState({data: data, da: da}, this.searchPage);
            } else {
                if (value) {
                    string = '[' + value + ',]';
                    data[name] = string;
                    da[name] = value;
                    this.setState({data: data, da: da}, this.searchPage);
                }
            }
        }
    };
    searchPage = () => {
        this.props.selectionOfPool(this.state.data, this.state.da);
        this.goPage(1);
    };
    czchange = () => {
        this.setState({
            data: {
                q: "",
                total: 100,
                pageSize: 20,
                orderBy: 'score-',//排序
                price: [],//价格
                priced: '',//最低价格
                priceg: '',//最高价格
                recentSellCount: [],//月销量
                taoKe: false,//是否淘客商品
                userType: '',//商品类型
                goodRate: [],//好评率
                saleConsignmentScore: [],//物流
                orderMerchandiseScore: [],//描述
                serviceQualityScore: [],//服务
            },
            da: {
                userType: "N",
                goodRate: "N",
                saleConsignmentScore: "N",
                orderMerchandiseScore: "N",
                serviceQualityScore: "N",
            },
        }, () => {
            this.goPage(1);
        });
    };

    render() {
        let {data,da} = this.state,{categoryListApiQuery}=this.props;
        let {orderBy}=data;
        return (
            <div>{/*官方精选*/}
                {JSON.stringify(categoryListApiQuery) == "{}" ?
                    <Alert type="info" title="通知!该渠道不支持选品池" description={<a target="_blank" href="https://pan.baidu.com/s/1kV21Bs7">确定这个渠道有选品池？视频说明</a>} closable={false}/>
                    : <div>
                        <Layout.Row>
                            <Layout.Col sm={24} style={{textAlign: 'center', width: '100%'}}>
                                <Button.Group>
                                    <Button type="warning" onClick={this.czchange}>重置</Button>
                                    <Button onClick={() => {
                                        this.orderByVearch({value: "score-"})
                                    }} disabled={orderBy === 'score-'}>默认</Button>
                                    <Button onClick={() => {
                                        this.orderByVearch({value: "popularScore"})
                                    }} disabled={orderBy === 'popularScore'}>人气</Button>
                                    <Button onClick={() => {
                                        this.orderByVearch({value: "recentSellCount-"})
                                    }} disabled={orderBy === 'recentSellCount-'}>销量</Button>
                                    <Button onClick={() => {
                                        this.orderByVearch({value: "price+"})
                                    }} disabled={orderBy === 'price+'}>价格低</Button>
                                    <Button onClick={() => {
                                        this.orderByVearch({value: "price-"})
                                    }} disabled={orderBy === 'price-'}>价格高</Button>
                                </Button.Group>
                            </Layout.Col>
                        </Layout.Row>
                        <br/>
                        <Layout.Row gutter="20">
                            <Layout.Col sm={12}>
                                <Input placeholder="请输入标题搜索" onChange={(value) => {
                                    this.searchTitleChange({value: value})
                                }} value={data.q}
                                       onKeyDown={(event) => {
                                           if (event.keyCode == "13") {
                                               this.searchClick()
                                           }
                                       }}
                                       append={<Button type="primary" icon="search" onClick={this.searchClick}>搜索</Button>}/>
                            </Layout.Col>

                            <Layout.Col sm={12}>
                                <Layout.Row gutter='20'>
                                    <Layout.Col sm={10}>
                                        <Input onChange={(value) => {
                                            this.priceChange({value: value, name: 'priced'})
                                        }} value={data.priced} placeholder="请输入最小价格" prepend="￥"/>
                                    </Layout.Col>

                                    <Layout.Col sm={14}>
                                        <Input onChange={(value) => {
                                            this.priceChange({value: value, name: 'priceg'})
                                        }} value={data.priceg} placeholder="请输入最大价格" prepend="￥" append={<Button type="primary" icon="search" onKeyDown={(event) => {
                                            if (event.keyCode == "13") {
                                                this.searchClick()
                                            }
                                        }} onClick={this.searchClick}>搜索</Button>}/>
                                    </Layout.Col>
                                </Layout.Row>
                            </Layout.Col>
                        </Layout.Row>

                        <Layout.Row gutter='20' style={{marginTop: '20px'}}>
                            <Layout.Col sm={6}>
                                <Select value={data.taoKe} onChange={(value) => {
                                    this.itemListChange({value: value, name: 'taoKe'})
                                }} placeholder="淘客商品">
                                    <Select.Option label='否' value={false}/>
                                    <Select.Option label='是' value={true}/>
                                </Select>
                            </Layout.Col>

                            <Layout.Col sm={6}>
                                <Select value={da.userType} onChange={(value) => {
                                    this.itemListChange({value: value, name: 'userType'})
                                }} placeholder="商品类型">
                                    <Select.Option label='不限' value='N'/>
                                    <Select.Option label='淘宝商品' value='0'/>
                                    <Select.Option label='天猫商品' value='1'/>
                                </Select>
                            </Layout.Col>
                            <Layout.Col sm={12}>
                                <Input onChange={(value) => {
                                    this.priceChange({value: value, name: 'recentSellCount'})
                                }} value={data.recentSellCount} placeholder="请输入月销量" prepend="月销量" append={<Button type="primary" icon="search" onKeyDown={(event) => {
                                    if (event.keyCode == "13") {
                                        this.searchClick()
                                    }
                                }} onClick={this.searchClick}>搜索</Button>}/>
                            </Layout.Col>
                        </Layout.Row>

                        <Layout.Row gutter='20'  style={{marginTop: '20px'}}>
                            <Layout.Col sm={6}>
                                <Select value={da.goodRate} placeholder="请选择好评率" onChange={(value)=>{this.itemListChange({value:value,name:'goodRate'})}}>
                                    <Select.Option label='不限' value='N'/>
                                    <Select.Option label='99' value='0.99'/>
                                    <Select.Option label='98' value='0.98'/>
                                    <Select.Option label='97' value='0.97'/>
                                    <Select.Option label='96' value='0.96'/>
                                </Select>
                            </Layout.Col>

                            <Layout.Col sm={6}>
                                <Select value={da.saleConsignmentScore} placeholder="请选择物流" onChange={(value)=>{this.itemListChange({value:value,name:'saleConsignmentScore'})}}>
                                    <Select.Option label='不限' value='N'/>
                                    <Select.Option label='4.9' value='4.9'/>
                                    <Select.Option label='4.8' value='4.8'/>
                                    <Select.Option label='4.7' value='4.7'/>
                                    <Select.Option label='4.6' value='4.6'/>
                                </Select>
                            </Layout.Col>

                            <Layout.Col sm={6}>
                                <Select value={da.orderMerchandiseScore} placeholder="请选择描述" onChange={(value)=>{this.itemListChange({value:value,name:'orderMerchandiseScore'})}}>
                                    <Select.Option label='不限' value='N'/>
                                    <Select.Option label='4.9' value='4.9'/>
                                    <Select.Option label='4.8' value='4.8'/>
                                    <Select.Option label='4.7' value='4.7'/>
                                    <Select.Option label='4.6' value='4.6'/>
                                </Select>
                            </Layout.Col>
                            <Layout.Col sm={6}>
                                <Select value={da.serviceQualityScore} placeholder="请选择服务" onChange={(value)=>{this.itemListChange({value:value,name:'serviceQualityScore'})}}>
                                    <Select.Option label='不限' value='N'/>
                                    <Select.Option label='4.9' value='4.9'/>
                                    <Select.Option label='4.8' value='4.8'/>
                                    <Select.Option label='4.7' value='4.7'/>
                                    <Select.Option label='4.6' value='4.6'/>
                                </Select>
                            </Layout.Col>
                        </Layout.Row>

                        <Layout.Row gutter='10' style={{marginTop:'20px'}}>
                            {(data.itemList ? data.itemList : []).map((item, i) => {
                                return (
                                    <Layout.Col sm={6} key={+new Date() + i}>
                                        <div className="thumbnail">
                                            <a href={item.item.itemUrl} target="_blank">
                                                <img src={item.coverUrl}/>
                                            </a>
                                            <Tooltip className="item" effect="dark"
                                                     content={item.title}
                                                     placement="bottom-start">
                                                <p style={{marginTop: "10px", textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                    overflow: "hidden", display: "block", cursor: "pointer"}}>
                                                    <a href={item.item.itemUrl} target="_blank">{item.title}</a>
                                                </p>
                                            </Tooltip>
                                            <div style={{textAlign:'left',position:'relative'}}>
                                                <span style={{color:'#F40'}}>￥{item.item.finalPrice}</span>
                                                <span style={{position:'absolute',color:'rgb(58, 56, 56)',right:0}}>佣金{item.item.taoKePay}</span>
                                            </div>
                                            <Button  type="primary" onClick={() => {
                                                let it = "https:" + item.item.itemUrl;
                                                this.props.itemUrlChange(it);
                                            }} size="small" style={{width:'100%'}}>添加该商品</Button>
                                        </div>
                                    </Layout.Col>
                                )
                            })}
                        </Layout.Row>
                        <div style={{textAlign: "center"}}>
                            <Pagination layout="total, prev, pager, next, jumper" total={data.total}
                                        pageSize={data.pageSize} currentPage={data.current} onCurrentChange={this.goPage}/>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default SelectionOfPool;

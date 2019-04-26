/**
 * Created by linhui on 17-9-19.超级选品池
 */

require('../../../../styles/selectItemsPond/selectItemsPond.css');
import React from 'react';
import {ajax} from '../../../../components/lib/util/ajax';
import AJAX from '../../../../components/lib/newUtil/AJAX';
import {clone} from '../../util/global'
import {Layout, Input, Breadcrumb, Checkbox, Select, Button, Collapse, Tabs, Tag, Card, Menu, Alert, Form,MessageBox,Pagination,Notification,Tooltip} from 'element-react';
import 'element-theme-default';
import {ThousandsOfCall} from '../../util/ThousandsOfCall';

class Itembank extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',//所有分类
            screen: false,//是否展示筛选
            seniorScreen: false,//是否展示高级筛选
        }
    }

    openClose = (env) => {//展开收起事件

        let value = env.text;
        let text = this.state.text;
        let x = '';
        if (text.indexOf(value) > -1) {
            let t = text.split(',');
            for (let i = 0; i < t.length; i++) {
                if (t[i] == value) {
                    delete t[i];
                }
                if (t[i]) {
                    x += t[i] + ',';
                }
            }
            text = x;
        } else {
            text += value + ',';
        }
        this.setState({text: text});
    };
    deletePpath = (env) => {//删除分类
        let {key, alue} = env;
        let state = this.props.getState;
        let ppath = state.ppath;
        let ph = ppath.split(';');
        let p = '';
        for (let i = 0; i < ph.length; i++) {
            if (ph[i] == value) {
                delete ph[i];
            }
            if (ph[i]) {
                p += ph[i] + ';';
            }
        }
        state.ppath = p;
        this.props.setPaState(state, () => {
            this.props.goPage(1);
        });
    };
    itemBankChange = (env) => {//商品库更改事件
        let {key, value, type} = env;
        let state = this.props.getState;
        if (key == 'q' || (type && type == 'multi') || (type && type == 'text')) {
            value = env.value;
        }
        if (key == 'ppath') {
            let ppath = state.ppath;
            ppath += value + ';';
            value = ppath;
        }

        if (type && type == 'single') {
            let checked = env.checked;
            if (key == 'auction_tag[]' || key == 'oetag-filter' || key == 'swyt-filter') {
                let auction_tag = state[key];
                if (!auction_tag) {
                    value = env.value + ';';
                } else {
                    let value2 = env.value;
                    if (checked) {
                        auction_tag += value2 + ';';
                        value = auction_tag;
                    } else {
                        let tag = auction_tag.split(';');
                        let a = '';
                        for (let i = 0; i < tag.length; i++) {
                            if (tag[i] == value2) {
                                delete tag[i];
                            }
                            if (tag[i]) {
                                a += tag[i] + ';';
                            }
                        }
                        value = a;
                    }
                }
            } else {
                if (checked) {
                    value = env.value;
                } else {
                    value = null;
                }
            }
        }
        state[key] = value;


        this.props.setPaState(state, () => {
            this.props.selectItemsState(this.props.getState);
            if (key == 'ppath' || key == 'cat' || key == 'sort' || (type && type == 'single') || (type && type == 'multi') || key == 'uniq') {
                this.props.goPage(1);

            }
        });
    };
    priceChange = (env) => {//价格事件
        let name = env.key;
        let value = env.value;
        let state = this.props.getState;
        state[name] = value;
        this.props.setPaState(state, () => {
            this.props.selectItemsState(this.props.getState);
        });
    };
    searchClick = (env) => {
        let price_esc = this.props.getState.price_esc;//价格低
        let price_desc = this.props.getState.price_desc;//价格高;
        let filter = 'reserve_price[,]';
        if (price_esc || price_desc) {
            filter = 'reserve_price[' + price_esc + ',' + price_desc + ']';
        }
        this.props.setPaState({filter: filter}, () => {
            this.props.selectItemsState(this.props.getState);
            this.props.goPage(1);
        });
    };
    isScreen = (env) => {//是否显示筛选&&高级筛选事件
        let key = env.key;
        let state = this.state;
        let value = this.state[key];
        state[key] = value;
        if (value) {
            state[key] = false;

        } else {
            state[key] = true;
        }
        this.setState(state);
    };

    render() {
        let state = this.props.getState;
        let [dropdownList, isInPondisRelease, elimination] = ['', true, ''];
        return (
            <div>
                <AJAX ref={e => this.itembankAjax = e}>

                    <Breadcrumb separator='>' style={{marginTop: '15px'}}>
                        <Breadcrumb.Item>所有分类</Breadcrumb.Item>
                        {(state.mods.nav ? state.mods.nav.data.breadcrumbs.propSelected : []).map((item, i) => {
                            return (
                                item.sub.map((sub, y) => {
                                    return (
                                        <Breadcrumb.Item key={+new Date + i + y + item.pid}>
                                            <Tag type="gray" closable={true} closeTransition={false}
                                                 onClose={() => {
                                                     this.deletePpath({value: item.pid + ':' + sub.vid, key: item.key})
                                                 }}>{item.text + ':' + sub.text}</Tag>
                                        </Breadcrumb.Item>
                                    )
                                }))
                        })}
                    </Breadcrumb>
                    {/*   <Panel collapsible defaultExpanded={this.state.screen ? true : false} data-key="screen"
                           header={this.state.screen ? '收起筛选' : '显示筛选'} onClick={this.isScreen}>
                    </Panel>*/}
                    <Card className="box-card" style={{marginTop: '15px'}} header={this.state.screen ? '收起筛选' : '显示筛选'} onClick={() => {
                        this.isScreen({key: true})
                    }}>
                        {(state.mods.nav ? state.mods.nav.data.common : []).map((sub, i) => {
                            let number = 3;
                            return (
                                <div className="text item" key={i}>
                                    <Layout.Row>
                                        <Layout.Col sm={4}>
                                            <Tag type="gray">{sub.text}:</Tag>
                                        </Layout.Col>
                                        <Layout.Col sm={18}>
                                            <Layout.Row>
                                                {this.state.text.indexOf(sub.text) > -1 ?
                                                    <div style={{width: "100%", height: "20%", border: "1px"}}>
                                                        <div style={{
                                                            overflow: "auto",
                                                            width: "100%",
                                                            height: "150px",
                                                            border: "1px"
                                                        }}>
                                                            {sub.sub.map((item, y) => {
                                                                return (
                                                                    <Layout.Col key={+new Date() + y} sm={8}>
                                                                        <Button type="text" onClick={() => {
                                                                            this.itemBankChange({value: item.value, key: item.key})
                                                                        }}>{item.text}</Button>
                                                                    </Layout.Col>
                                                                )
                                                            })}
                                                        </div>
                                                    </div> : sub.sub.map((item, y) => {
                                                        number = y;
                                                        if (y <= 2) {
                                                            return (
                                                                <Layout.Col key={+new Date() + y} sm={8}>
                                                                    <Button type='text' onClick={() => {
                                                                        this.itemBankChange({value: item.value, key: item.key})
                                                                    }}>{item.text}</Button>
                                                                </Layout.Col>
                                                            )
                                                        }
                                                    })}
                                            </Layout.Row>
                                        </Layout.Col>
                                        {sub.sub.length > 0 && number > 2 ? <Layout.Col sm={2}>
                                            <Button type='text' onClick={() => {
                                                this.openClose({text: sub.text})
                                            }}>{this.state.text.indexOf(sub.text) > -1 ? '收起' : '更多'}</Button>
                                        </Layout.Col> : ''}
                                    </Layout.Row>
                                </div>
                            )
                        })}
                        <div className="text item">
                            <Layout.Row>
                                <Layout.Col sm={4}>
                                    <Tag type="gray">筛选条件:</Tag>
                                </Layout.Col>
                            </Layout.Row>
                            <Layout.Col sm={20}>
                                {(state.mods.nav && state.mods.nav.data.adv.length > 0) && <Tabs activeName='1' id="uncontrolled-tab-examples">
                                    {state.mods.nav.data.adv.map((item, i) => {
                                        return (
                                            <Tabs.Pane label={item.text} name={(i + 1) + ''} key={i}>
                                                <Layout.Row>
                                                    {item.sub.map((sub, y) => {
                                                        return (
                                                            <Layout.Col sm={8} key={+new Date() + y + i}>
                                                                <Button type='text' onClick={() => {
                                                                    this.itemBankChange({value: sub.value, key: sub.key})
                                                                }}>{sub.text}</Button>
                                                            </Layout.Col>
                                                        )
                                                    })}
                                                </Layout.Row>
                                            </Tabs.Pane>
                                        )
                                    })}
                                </Tabs>}
                            </Layout.Col>
                        </div>
                    </Card>
                    <Layout.Row style={{marginTop: '15px'}}>
                        <Layout.Col sm={24}>
                            <Button.Group>
                                {(state.mods.sortbar ? state.mods.sortbar.data.sortList : []).map((item, i) => {
                                    if (item.trace == 'sortPrice') {
                                        dropdownList = item.dropdownList.map((dropdown, y) => {
                                            return (
                                                <Button key={+new Date + y} disabled={state.sort == dropdown.value ? true : false} onClick={() => {
                                                    this.itemBankChange({value: dropdown.value, key: item.key})
                                                }}>{dropdown.tip}</Button>
                                            )
                                        });
                                    } else {
                                        return (
                                            <Button key={+new Date + i} disabled={state.sort == item.value ? true : false} onClick={() => {
                                                this.itemBankChange({value: item.value, key: item.key})
                                            }}>{state.sort == item.value ? item.tip : item.name}</Button>
                                        )
                                    }
                                    return (
                                        dropdownList
                                    )
                                })}
                            </Button.Group>
                        </Layout.Col>
                    </Layout.Row>

                    <Layout.Row gutter='10' style={{marginTop: '15px'}}>
                        <Layout.Col sm={12}>
                            <Input placeholder="请输入要搜索的关键字或商品链接" value={this.props.getState.q} onChange={(value) => {
                                this.itemBankChange({value: value, key: 'q'})
                            }} onKeyDown={(event) => {
                                if (event.keyCode == "13") {
                                    this.searchClick()
                                }
                            }} append={<Button type="primary" icon="search" onClick={this.searchClick}>搜索</Button>}/>
                        </Layout.Col>

                        <Layout.Col sm={12}>
                            <Layout.Row gutter='10'>
                                <Layout.Col sm={12}>
                                    <Input placeholder="最小价格" prepend="￥" value={state.price_esc} onChange={(value) => {
                                        this.priceChange({value: value, key: 'price_esc'})
                                    }}/>
                                </Layout.Col>
                                <Layout.Col sm={12}>
                                    <Input placeholder="最大价格" prepend="￥" value={state.price_desc} onChange={(value) => {
                                        this.priceChange({value: value, key: 'price_desc'})
                                    }} onKeyDown={(event) => {
                                        if (event.keyCode == "13") {
                                            this.searchClick()
                                        }
                                    }} append={<Button type="primary" icon="search" onClick={this.searchClick}>搜索</Button>}/>
                                </Layout.Col>
                            </Layout.Row>
                        </Layout.Col>
                    </Layout.Row>
                    <Card style={{marginTop: '15px'}} className="box-card" header={<span>好货批量排重</span>}>
                        <Button type="primary" size='small' style={{marginBottom: '10px'}} onClick={() => {
                            this.props.batchElimination()
                        }}>点击进行好货批量排重</Button>
                        {state.elimination.length <= 0 ?
                            <Alert type="info" title='您还未进行检测或暂未检测到该页面商品好货入库信息' closable={false}/>
                            : state.elimination.map((item, i) => {
                                if (item.isInPond) {
                                    isInPondisRelease = false;
                                    /* return (
                                     <Alert bsStyle="danger">检测到<a>{item.title}</a>已经被好货收录，不建议添加</Alert>
                                     )*/
                                } else if (item.isRelease) {
                                    isInPondisRelease = false;
                                    /* return (
                                     <Alert
                                     bsStyle="warning">未检测到<a>{item.title}</a>被好货收录，但是已经被其他达人抢先发布到达人后台</Alert>
                                     )*/
                                } else if (isInPondisRelease) {
                                    return (
                                        <Alert type="info" title='暂未检测到该页面商品好货入库信息' closable={false}/>
                                    )
                                }
                            })
                        }
                    </Card>
                    {/* <Panel collapsible defaultExpanded={this.state.seniorScreen ? true : false} data-key="seniorScreen"
                           header={this.state.seniorScreen ? "收起高级筛选" : "展示高级筛选"} onClick={this.isScreen}>

                    </Panel>*/}
                    <Card style={{marginTop: '15px'}} className="box-card" header={
                        <div className="clearfix">
                            <span style={{"lineHeight": "36px"}}>高级筛选</span><span style={{"float": "right"}}>
                            <Button type="primary" size='small' onClick={() => {
                                this.itemBankChange({value: state.uniq ? '' : 'pid', key: 'uniq'})
                            }}>{state.uniq ? '取消合并同款' : '合并同款宝贝'}</Button></span>
                        </div>}>
                        <div className="text item">
                            <Tabs activeName='1'>
                                {(state.mods.sortbar ? state.mods.sortbar.data.highFilter : []).map((item, i) => {
                                    return (
                                        <Tabs.Pane name={(i + 1) + ''} label={item.filterName} key={+new Date + i}>
                                            <Layout.Row>
                                                {(item.filterList ? item.filterList : []).map((list, y) => {
                                                    if (list.type == 'single') {
                                                        if (list.key == 'auction_tag[]' || list.key == 'oetag-filter' || list.key == 'swyt-filter') {
                                                            return (
                                                                <Layout.Col sm={6} key={+new Date() + y}>
                                                                    <Checkbox onChange={(checked) => {
                                                                        this.itemBankChange({checked: checked, value: list.value, key: list.key, type: list.type})
                                                                    }}
                                                                              checked={state[list.key] && state[list.key].indexOf(list.value) > -1}>
                                                                        {list.name}
                                                                    </Checkbox>
                                                                </Layout.Col>
                                                            )
                                                        } else {
                                                            return (
                                                                <Layout.Col sm={6} key={+new Date() + y}>
                                                                    <Checkbox checked={state[list.key] == list.value}
                                                                              onChange={(checked) => {
                                                                                  this.itemBankChange({checked: checked, value: list.value, type: list.type, key: list.key})
                                                                              }}>
                                                                        {list.name}
                                                                    </Checkbox>
                                                                </Layout.Col>
                                                            )
                                                        }

                                                    }
                                                })}
                                            </Layout.Row>
                                            <Layout.Row>
                                                {(item.filterList ? item.filterList : []).map((list, y) => {
                                                    if (list.type == 'multi') {
                                                        return (
                                                            <Layout.Col sm={8} key={+new Date() + y}>
                                                                <Form>
                                                                    <Form.Item>
                                                                        <Layout.Col span='8' style={{textAlign: 'right'}}>
                                                                            <Form.Item labelWidth="0px">
                                                                                {list.name}
                                                                            </Form.Item>
                                                                        </Layout.Col>
                                                                        <Layout.Col span="8">
                                                                            <Select value={state[list.key]} onChange={(value) => {
                                                                                this.itemBankChange({value: value, key: list.key, type: list.type})
                                                                            }} placeholder="请选择">
                                                                                {(list.dropdownList ? list.dropdownList : []).map((dropdown, z) => {
                                                                                    return (
                                                                                        <Select.Option value={dropdown.value} label={dropdown.tip} key={+new Date + z}>
                                                                                        </Select.Option>
                                                                                    )
                                                                                })}
                                                                            </Select>
                                                                        </Layout.Col>
                                                                        <Layout.Col span='8'>
                                                                            <Form.Item labelWidth="0px">
                                                                                {list.extra}
                                                                            </Form.Item>
                                                                        </Layout.Col>
                                                                    </Form.Item>
                                                                </Form>
                                                            </Layout.Col>
                                                        )
                                                    } else if (list.type == 'text') {
                                                        return (
                                                            <Layout.Col span={8} key={+new Date() + y}>
                                                                <Form>
                                                                    <Form.Item>
                                                                        <Input placeholder="请输入内容" id={list.key} value={state[list.key]} onChange={(value) => {
                                                                            this.itemBankChange({type: list.type, key: list.key, value: value})
                                                                        }} onKeyDown={(event) => {
                                                                            if (event.keyCode == "13") {
                                                                                this.searchClick()
                                                                            }
                                                                        }}
                                                                               prepend={list.name} append={<div>{list.extra}<Button type="primary" icon="search" onClick={this.searchClick}>
                                                                            搜
                                                                        </Button></div>}/>
                                                                    </Form.Item>
                                                                </Form>

                                                            </Layout.Col>
                                                        )
                                                    }
                                                })}
                                            </Layout.Row>
                                        </Tabs.Pane>
                                    )
                                })}
                            </Tabs>
                        </div>
                    </Card>
                    <Layout.Row>
                        {(state.mods.itemlist ? state.mods.itemlist.data.auctions : state.mods.spulist ? state.mods.spulist.data.auctions : []).map((item, i) => {
                            return (
                                <Layout.Col sm={6} key={+new Date() + i}>
                                    <div className="thumbnail">
                                        <a href={item.detail_url} target="_blank" className="itemImg">
                                            <img src={item.pic_url}/>
                                        </a>
                                        <Tooltip className="item" effect="dark"
                                                 content={item.raw_title} placement="bottom-start">
                                            <p style={{marginTop: "10px",textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                overflow: "hidden", display: "block", cursor: "pointer"}}>
                                                <a href={item.detail_url} target="_blank" dangerouslySetInnerHTML={{__html: item.raw_title}}/>
                                            </p>
                                        </Tooltip>
                                        <p>￥{item.view_price}&nbsp;&nbsp;|&nbsp;&nbsp;
                                            预估佣金{item.view_fee}</p>
                                        <p>{item.q_score}&nbsp;&nbsp;|&nbsp;&nbsp;
                                            {item.view_sales}</p>
                                        <Layout.Row gutter="10">
                                            <Layout.Col sm={12}>
                                                <Button type="primary" size='small' onClick={() => {
                                                    this.props.setItemState({key: '1'}, () => {
                                                        let it = "https:" + item.detail_url;
                                                        this.props.itemUrlChange(undefined, it);
                                                    })
                                                }} style={{width:'100%'}}>添加该商品</Button>
                                            </Layout.Col>
                                            <Layout.Col sm={12}>
                                                {state.elimination.map((en, y) => {
                                                    if (en.numIid == item.nid) {
                                                        if (en.isInPond) {
                                                            return(
                                                                <Tooltip className="item" effect="dark" content='检测到该商品已经被好货收录，不建议添加' placement="bottom-start">
                                                                    <Button type="warning" style={{width:'100%'}} size='small'>已被好货收录</Button>
                                                                </Tooltip>
                                                            )
                                                        } else if (en.isRelease) {
                                                            return(
                                                                <Tooltip className="item" effect="dark" content='未检测到该被好货收录，但是已经被其他达人抢先发布到达人后台' placement="bottom-start">
                                                                    <Button type="warning" style={{width:'100%'}} size='small'>被抢先发布</Button>
                                                                </Tooltip>
                                                            )
                                                        }
                                                    }
                                                })}
                                            </Layout.Col>
                                        </Layout.Row>
                                    </div>
                                </Layout.Col>
                            )
                        })}
                    </Layout.Row>
                </AJAX>
            </div>
        )
    }
}

class SelectItemsPond extends React.Component {
    componentWillReceiveProps(newProps) {
        if (newProps.selectionChange == 1) {
            this.czchange();
            this.props.noChange();
        }
    }

    czchange = () => {
        this.setState({
            /*   navigator: undefined,//需要的固定参数
             id: undefined,//需要的固定参数
             kxuan_swyt_c2c: undefined,//需要的固定参数*/

            sort: 'default',//default:综合排序（默认）,renqi-desc:人气从高到低,sale-desc:销量从高到低,credit-desc:信用从高到低,price-desc:价格从高到低,price-asc:价格从低到高
            q: undefined,//标题搜索
            filter: 'reserve_price[,]',//价格搜索reserve_price[低,高]
            price_desc: '',//价格高
            price_esc: '',//价格低
            cat: '',//相关分类
            ppath: '',//所有分类字段　xxxx:xxxx;xxxx:xxxx
            uniq: 'pid',//是否合并同款宝贝
            'auction_tag[]': '',//新品,天猫国际,海外商品,ifashion,极有家,全球购,赠送退货运费险
            is_cp_rules_c2c: '',//新七条,
            quality_hangye_score_c2c: '',//品质
            seller_goodrat: '',//好评率
            'dsr-wl': '',//物流
            'dsr-ms': '',//描述
            'dsr-fw': '',//服务
            biz30day: '',//月销量
            quantity: '',//库存
            baoyou: '',//包邮
            talent_choice_mlrdata_c2c: '',//有优质评价
            is_taobao: '',//淘宝商品
            user_type: '',//天猫商品
            istk: '',//淘客商品
            'oetag-filter': '',//女生最爱逛;高逼格爱买;好评如潮;必买好货;行业精选
        })
    };

    constructor(props) {
        super(props);
        let state = clone(props.pond);
        this.state = state.id ? state : {
            message: '',//登录消息

            navigator: undefined,//需要的固定参数
            id: undefined,//需要的固定参数
            kxuan_swyt_c2c: undefined,//需要的固定参数

            sort: 'default',//default:综合排序（默认）,renqi-desc:人气从高到低,sale-desc:销量从高到低,credit-desc:信用从高到低,price-desc:价格从高到低,price-asc:价格从低到高
            q: undefined,//标题搜索
            filter: 'reserve_price[,]',//价格搜索reserve_price[低,高]
            price_desc: '',//价格高
            price_esc: '',//价格低
            cat: '',//相关分类
            ppath: '',//所有分类字段　xxxx:xxxx;xxxx:xxxx
            uniq: 'pid',//是否合并同款宝贝
            'auction_tag[]': '',//新品,天猫国际,海外商品,ifashion,极有家,全球购,赠送退货运费险
            'swyt-filter': '',
            is_cp_rules_c2c: '',//新七条,
            quality_hangye_score_c2c: '',//品质
            seller_goodrat: '',//好评率
            'dsr-wl': '',//物流
            'dsr-ms': '',//描述
            'dsr-fw': '',//服务
            biz30day: '',//月销量
            quantity: '',//库存
            baoyou: '',//包邮
            talent_choice_mlrdata_c2c: '',//有优质评价
            is_taobao: '',//淘宝商品
            user_type: '',//天猫商品
            istk: '',//淘客商品
            'oetag-filter': '',//女生最爱逛;高逼格爱买;好评如潮;必买好货;行业精选

            pageName: undefined,//拿回来的数据
            mainInfo: undefined,//拿回来的数据
            mods: {
                pager: {
                    data: {
                        currentPage: 1,//当前页
                        totalCount: 0,//总记录数
                        pageSize: 25,//每页记录数
                        totalPage: 1,//总页数
                    }
                }
            },//拿回来的数据
            elimination: [],//好货批量排重回来数据,isInPond:''//好货是否入库     isRelease:''// 是否被发布到达人主页     numIid     title名字
        }
    }

    componentWillMount() {

    }

    setThisState = (state, callback) => {
        this.setState(state, function () {
            if (callback && (typeof callback) == 'function') {
                callback();
            }
        });
    };

    getImemData = (data, callback) => {//拿取商品数据
        data.callback = "json20";
        ThousandsOfCall.acoustic({
            agreement: "https",
            hostname: "kxuan.taobao.com",
            path: '/searchSp.htm',
            method: 'get',
            data: data,
            referer: "https://we.taobao.com/",
        },"request", (json20) => {
            if (json20.success) {
                let json = JSON.parse(json20.data.slice(7, -1));
                if (callback) {
                    callback(json);
                }
            } else {
                Notification.error({
                    title: '错误',
                    message: '未获取到商品数据'
                });
                return false;
            }

        });
    };
    getactivityIdAndPoolId = (callback) => {
        let {poolId,activityId} = this.props;
        if (poolId || activityId) {
            let data = {'poolId': poolId, 'activityId': activityId, 'resourceType': 'Item'};
            let poolUrl = '';
            ThousandsOfCall.acoustic({
                agreement: "https",
                hostname: "resource.taobao.com",
                path: '/category/query',
                method: "POST",
                data: data,
                referer: "https://we.taobao.com/",
            },"requestRelyTB", (json20) => {
                let json = '';
                if (!json20) {
                    Notification.error({
                        title: '错误',
                        message: '超级选品池未获取到任何信息'
                    });
                    return false;
                } else {
                    json = JSON.parse(json20.data);
                    if (!json || json.data == null || json.data == undefined || json.data == '') {
                        Notification({
                            title: '警告',
                            message: `淘宝:${json.message}`,
                            type: 'warning'
                        });
                        this.setState({message: '淘宝' + json.message});
                        return false;
                    }
                }
                let itemList = json.data.itemList;
                for (let i = 0; i < itemList.length; i++) {
                    poolUrl = (itemList[0].poolUrl ? itemList[0].poolUrl : itemList[0].url);
                }
                let url = poolUrl.split('?');
                let kxuanParam = url[1];
                let array = kxuanParam.split('=');
                let decode = decodeURIComponent(array[1]);
                let obj = JSON.parse(decode);
                let da = {'uniq': 'pid', 'navigator': 'all', 'id': obj.id};
                ThousandsOfCall.acoustic({
                    agreement: "https",
                    hostname: "kxuan.taobao.com",
                    path: '/search.htm',
                    method: "get",
                    data: da,
                    referer: "https://we.taobao.com/",
                }, "request", (text20) => {
                    if (text20.success) {
                        let text = text20.data;
                        let index = text.indexOf("var params = ");
                        let parem = text.substring(index);
                        let index2 = parem.indexOf(';');
                        let str = parem.substring(12, index2);
                        let str2 = str.replace('"', '');
                        let str3 = str2.replace('"', '');
                        let array = str3.trim().split('&');
                        let obj = {};
                        for (let i = 0; i < array.length; i++) {
                            obj[array[i].split('=')[0]] = unescape(array[i].split('=')[1]);
                        }
                        let dt = {
                            uniq: obj.uniq,
                            navigator: obj.navigator,
                            id: obj.id,
                            kxuan_swyt_item: obj.kxuan_swyt_item,
                            ruletype: obj.ruletype,
                        };
                        this.setState(dt, () => {
                            this.goPage(1)
                        });
                    }
                });
            });
        }else {
            this.goPage(1);
        }
    };

    batchElimination = () => {//好货批量排重
        let {itemlist} = this.state.mods,numIid = [];
        (itemlist ? itemlist.data.auctions : []).map((item) => {
            if (item.nid) {
                numIid.push(item.nid);
            }
        });
        MessageBox.confirm('您确定要进行排重吗，将会扣除15点数(约等于0.2元)','提示', {
            type: 'warning'
        }).then(() => {
            ajax.ajax({
                type: 'post',
                url: '/message/admin/cheesy/domain.item.cheesylibraryList.io',
                data: {numIid: numIid.join()},
                callback:  (json)=> {
                    this.setState({elimination: json.item});
                }
            });
        }).catch(() => {
            Notification.info({
                title: '消息',
                message: '取消排重'
            });
        });
    };

    goPage = (currentPage, callback) => {
        if (!this.state.id) {

        } else {
            currentPage = currentPage - 1;
            this.setState({currentPage: currentPage}, () => {
                let zujian = this.state;
                let ping = zujian.mods.pager.data;
                currentPage = currentPage ? currentPage : 0;
                let s = currentPage * ping.pageSize;
                this.getImemData({
                    navigator: zujian.navigator,
                    id: zujian.id,
                    kxuan_swyt_item: zujian.kxuan_swyt_item,
                    ruletype: zujian.ruletype,
                    s: (currentPage - 1) * ping.pageSize,
                    "data-key": "s",
                    "data-value": s,
                    'swyt-filter': zujian['swyt-filter'],
                    sort: zujian.sort,//排序
                    q: zujian.q, //标题搜索
                    filter: zujian.filter,//价格搜索
                    cat: zujian.cat,//相关分类
                    ppath: zujian.ppath,//所有分类字段　xxxx:xxxx;xxxx:xxxx
                    uniq: zujian.uniq,//是否合并同款宝贝
                    'auction_tag[]': zujian['auction_tag[]'],//新品,天猫国际,海外商品,ifashion,极有家,全球购,赠送退货运费险
                    is_cp_rules_c2c: zujian.is_cp_rules_c2c,//新七条
                    quality_hangye_score_c2c: zujian.quality_hangye_score_c2c,//品质
                    seller_goodrat: zujian.seller_goodrat,//好评率
                    'dsr-wl': zujian['dsr-wl'],//物流
                    'dsr-ms': zujian['dsr-ms'],//描述
                    'dsr-fw': zujian['dsr-fw'],//服务
                    biz30day: zujian.biz30day,//月销量
                    quantity: zujian.quantity,//库存
                    baoyou: zujian.baoyou,//包邮
                    talent_choice_mlrdata_c2c: zujian.talent_choice_mlrdata_c2c,//有优质评价
                    is_taobao: zujian.is_taobao,//淘宝商品
                    user_type: zujian.user_type,//天猫商品
                    istk: zujian.istk,//淘客商品
                    'oetag-filter': zujian['oetag-filter'],//女生最爱逛;高逼格爱买;好评如潮;必买好货;行业精选
                }, (json20) => {
                    this.setState(json20, () => {
                        let actions = json20.mods.itemlist?json20.mods.itemlist.data.auctions:[];
                        let arr = [];
                        for (let a in actions) {
                            arr.push(actions[a].nick);
                        }
                        // Ajax({
                        //     type: 'post',/cheesy/addShop.io
                        //     url: '/message/admin/cheesy/addShop.io',
                        //     data: {'nick': arr.join()},
                        //     isCloseMask:true,
                        //     callback: () => {
                        //         if (callback) {
                        //             callback({itemList: json20, success: true});
                        //         }
                        //     }
                        // });
                    });
                });
            });
        }
    };


    so = (q, callback) => {
        let {id,message,kxuan_swyt_item,ruletype}=this.state;
        if (!id) {
            Notification({
                title: '警告',
                message: message,
                type: 'warning'
            });
            callback({success: false, message: this.state.message});
        } else {
            this.getImemData({id, kxuan_swyt_item, ruletype, q,}, (json) => {
                if (callback) {
                    callback({itemList: json, success: true});
                }
            });
        }
    };

    render() {
        let {id,mods}=this.state,{selectItemsState,setItemState,itemUrlChange}=this.props;
        let ping = mods ? mods.pager.data : {};
        return (
            <div>
                <Button type="primary" onClick={()=>{window.open(`https://kxuan.taobao.com/search.htm?nested=we&id=${id}`)}} style={{width:'100%'}}>放大打开选品池</Button>
                <Itembank getState={this.state} setPaState={this.setThisState} goPage={this.goPage} selectItemsState={selectItemsState}
                          itemUrlChange={itemUrlChange} batchElimination={this.batchElimination} setItemState={setItemState}/>
                <div style={{textAlign: "center"}}>
                    <Pagination layout="total, prev, pager, next, jumper" total={ping.totalCount}
                                pageSize={ping.pageSize} currentPage={ping.current} onCurrentChange={this.goPage}/>
                </div>
            </div>
        )
    }
}

export default SelectItemsPond;
/**
 * Created by linhui on 18-5-17.
 */

import React from 'react';
import ReactChild from "../../../../../../lib/util/ReactChild";
import {Pagination,Layout} from 'element-react';
import 'element-theme-default';
import {ajax} from '../../../../../../lib/util/ajax';
import '../../../../../../../styles/tool/newShop.css';
import wz from '../../../../../../../images/tool/zw.png'

class NewShop extends ReactChild {
    constructor(props) {
        let  myDate = new Date();
        let [nian,yue,ri] =[myDate.getFullYear(),myDate.getMonth()+1,myDate.getDate()];
        let stringToday = nian+"-"+yue+"-"+ri;
        let today  =  new Date(Date.parse(stringToday.replace(/-/g,  "/"))).getTime();
        super(props);
        this.state = {
            pageNow: 1,
            pageSize: 18,
            count: 0,
            today:today,//今天
            shopList: [],
        }
    }

    componentDidMount() {
        this.goPage(1);
    }

    goPage = (pageNow) => {/*点击分页*/
        pageNow = pageNow ? pageNow : this.state.pageNow;
        this.queryShopList({
            pageNow: pageNow,
            pageSize: this.state.pageSize,

        });
    };
    queryShopList = (data) => {//获取所有店铺数据
        ajax.ajax({
            type: 'post',
            url: '/message/admin/shop/queryShopListPage.io',
            data: data,
            callback: (json) => {
                this.setState(json);
            }
        });
    };

    render() {
        let {shopList=[],count,pageSize,pageNow}=this.state;
        return (
            <NewPanel header='好货店铺'>
                <Layout.Row gutter="10" style={{margin: "8px 0"}}>
                    {shopList.map(item=> {
                        return (
                            <Layout.Col span="8" key={item.id}>
                                <NewPanel header={item.addDate>this.state.today?"今日新添店铺":item.title}>
                                    <Layout.Row gutter="2">
                                        <Layout.Col span="10">
                                            <div style={{height:"100px"}}>
                                                {item.picPath?<img style={{maxWidth:"100%",maxHeight:"100px"}} src={"http://logo.taobao.com/shop-logo"+item.picPath}/>
                                                    :<img style={{maxWidth:"100%",maxHeight:"100px"}} src={wz}/>}
                                            </div>
                                        </Layout.Col>
                                        <Layout.Col span="14">
                                            <div style={{float: "left"}}>
                                                    <span className="shopKey">
                                                        <strong>店铺名称:</strong>
                                                    </span>
                                                <span className="shopValue">
                                                        <a href={"//shop"+item.sid+".taobao.com"} target="_blank">{item.title}</a>
                                                    </span>
                                                <br/>
                                                <span className="shopKey">
                                                        <strong>添加时间:</strong>
                                                    </span>
                                                <span className="shopValue" style={{color:"green"}}>{item.addTile}</span>
                                            </div>
                                        </Layout.Col>
                                    </Layout.Row>
                                </NewPanel>
                            </Layout.Col>
                        )
                    })}
                </Layout.Row>
                <div style={{marginTop:'10px'}}>
                    <Pagination layout="total, prev, pager, next, jumper" total={count}
                                pageSize={pageSize} currentPage={pageNow} onCurrentChange={this.goPage}/>
                </div>
            </NewPanel>
        )
    }
}

class NewPanel extends React.Component {
    render() {
        let {header,children} = this.props;
        return (
            <div style={{
                marginTop: "10px",
                marginBottom: '12px',
                backgroundColor: '#fff',
                border: '1px solid transparent',
                borderRadius: '4px',
                boxShadow: '0 1px 1px rgba(0, 0, 0, .05)',
                borderColor: '#50bfff'
            }}>
                <div style={{
                    padding: '1px 10px',
                    borderBottom: '1px solid transparent',
                    borderTopLeftRadius: '3px',
                    borderTopRightRadius: '3px',
                    color: '#fff',
                    backgroundColor: '#50bfff',
                    borderColor: '#50bfff',
                }}>
                    <h5 style={{textAlign: 'center'}}>{header}</h5>
                </div>
                <div style={{
                    padding: '10px',
                }}>
                    {children}
                </div>
            </div>
        )
    }
}

export default NewShop;

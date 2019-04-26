/**
 * Created by 薛荣晖 on 2018/9/17 0017上午 9:39.品牌库管理
 */

import React from 'react';
import ReactChild from "../../../../../../lib/util/ReactChild";
import AJAX from '../../../../../../lib/newUtil/AJAX';
import {DialogBundle} from '../../../../../../../bundle';
import brandContainere from 'bundle-loader?lazy&name=pc/trends_asset/components/user/privateBrand/app-[name]!./components/brand';
import {Layout, Card, Button, Input, Pagination, MessageBox, Message, Alert,Tooltip} from "element-react";
import 'element-theme-default';

class PrivateBrand extends ReactChild {
    constructor(props) {
        super(props);
        this.state = {
            brandContent: {    //品牌内容
                pageNow: 1,   //页
                pageSize: 20, //每页显示条目个数
                count: 10,    //计数
                privateBrandInfoList: []  //私人品牌
            },
            brandSearch: {     //品牌搜索
                pageNow: 1,
                pageSize: 20,
                name: ""
            },
            brandSearchName: "",//品牌搜索名称
            type: 1
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        let {brandSearch} = this.state;
        if (this.newPrivateBrandAjax) {
            this.newPrivateBrandAjax.ajax({
                type: 'post',
                url: '/message/admin/cheesy/queryPrivateBrandInfoByPage.io',
                data: brandSearch,
                callback: (json) => {
                    this.setState({brandContent: json})
                }
            });
        }
    };

    whole = () => {//默认展示全部
        this.setState({brandSearch: {pageNow: 1, pageSize: 20, name: ""}},this.getData)
    };


    editBrand = ({type,i}) => {//编辑新增模态
        this.setState({type}, () => {
            let {brandContent} = this.state;
            let {...privateBrandInfoLis} = brandContent.privateBrandInfoList[i];
            this.bundleLoading.open({data: privateBrandInfoLis,tips:type})
        })
    };

    brandNameChange = (value) => {//输入内容
        this.setState({brandSearchName: value});
    };

    clearButton = () => {//清空
        this.setState({brandSearchName: ""});
    };

    brandNameButton = () => {//品牌搜索
        let {brandSearch, brandSearchName} = this.state;
        brandSearch.name = brandSearchName;
        brandSearch.pageNow = 1;
        this.setState({brandSearch},this.getData);
    };

    del = (id) => {//删除
        MessageBox.confirm('此操作将永久删除该品牌信息，是否继续？', '提示', {
            type: 'warning'
        }).then(() => {
            this.newPrivateBrandAjax.ajax({
                type: 'post',
                url: '/message/admin/cheesy/deletePrivateBrandInfo.io',
                data: {'id': id},
                callback: () => {
                    Message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getData();
                }
            });
        }).catch(() => {
            Message({
                type: 'info',
                message: '已取消删除'
            });
        });
    };

    generalPage=({value,type})=>{
        let {brandSearch} = this.state;
        brandSearch[type] = value;
        this.setState({brandSearch},this.getData);
    };

    render() {
        let {brandContent, brandSearchName, type} = this.state;
        return (
            <NewPanel header='私人品牌库'>
                <div>
                    <Layout.Row gutter="6" style={{margin:'8px'}}>
                        <Layout.Col span="4">
                            <Tooltip className="item" effect="dark" content="重置为默认" placement="bottom">
                                <Button type='info' style={{width: '100%'}} onClick={this.whole}>默认全部</Button>
                            </Tooltip>
                        </Layout.Col>
                        <Layout.Col span="4">
                            <Tooltip className="item" effect="dark" content="用于添加私人品牌" placement="bottom">
                                <Button type='success' style={{width: '100%'}} onClick={() => this.editBrand({type: 1})}>添加品牌</Button>
                            </Tooltip>
                        </Layout.Col>
                        <Layout.Col span="16">
                            <Input value={brandSearchName} onChange={this.brandNameChange} onKeyDown={(event) => {
                                if (event.keyCode == "13") {
                                    this.brandNameButton();
                                }
                            }} placeholder="请输入品牌关键字进行搜索..." prepend={<Button type='danger' onClick={this.clearButton} icon="delete">清空</Button>}
                                   append={<Button type="info" onClick={this.brandNameButton} icon="search">搜索</Button>}/>
                        </Layout.Col>
                    </Layout.Row>
                    <AJAX ref={e => this.newPrivateBrandAjax = e}>
                        <Layout.Row gutter='2'>
                            {(brandContent.privateBrandInfoList ? brandContent.privateBrandInfoList : []).map((item, i) => {
                                return (
                                    <Layout.Col lg='6' md='8' key={item.id}>
                                        <Card style={{padding: 0, margin: '10px 8px 5px 8px'}}>
                                            <div style={{backgroundColor: "rgb(247, 250, 253)",width:'100%',textAlign:'center'}}>
                                                <div style={{height: "100px", display: " table-cell", verticalAlign: 'middle'}}>
                                                    <img src={item.log} style={{maxWidth: "90%", maxHeight: "80px"}}/>
                                                </div>
                                            </div>
                                            <div style={{marginTop: '5px', color: 'green'}}>
                                                <p style={{fontSize: '15px'}}>{item.name}</p>
                                            </div>
                                            <div style={{marginTop: "2px", height: "80px", overflowY: "scroll", overflow: "auto", textAlign: "left"}}>
                                                {item.introduction}
                                            </div>
                                            <Layout.Row gutter="2" style={{marginTop:'6px'}}>
                                                <Layout.Col span="12">
                                                    <Button type="primary" size='mini' onClick={() => {
                                                        this.editBrand({i, type: 2})
                                                    }} style={{width: '100%'}} icon="edit">编辑</Button>
                                                </Layout.Col>
                                                <Layout.Col span="12">
                                                    <Button type="danger" size='mini' onClick={() => {
                                                        this.del(item.id)
                                                    }} style={{width: '100%'}} icon="delete">删除</Button>
                                                </Layout.Col>
                                            </Layout.Row>
                                        </Card>
                                    </Layout.Col>
                                )
                            })}
                        </Layout.Row>
                    </AJAX>
                    <div className="block" style={{marginTop: '20px'}}>
                        <Pagination layout="total, sizes, prev, pager, next, jumper" pageSizes={[20, 40, 60]}
                                    pageSize={brandContent.pageSize} total={brandContent.count} currentPage={brandContent.pageNow}
                                    onSizeChange={pageSize => this.generalPage({value:pageSize,type:'pageSize'})}
                                    onCurrentChange={pageNow => this.generalPage({value:pageNow,type:'pageNow'})}/>
                    </div>
                    <DialogBundle ref={e => this.bundleLoading = e} dialogProps={{title: type === 1 ? '添加品牌' : '编辑品牌'}}
                                  bundleProps={{
                                      load: brandContainere, refresh: this.getData, cloneModal: () => {
                                          this.bundleLoading.setState({dialogVisible: false})
                                      }
                                  }}
                                  dialogFooter={<div>
                                      <Button onClick={() => {
                                          this.bundleLoading.setState({dialogVisible: false})
                                      }}>取消</Button>
                                      <Button type="primary" onClick={() => {
                                          this.bundleLoading.getBun((gb) => {
                                              gb.submit()
                                          });
                                      }}>确定</Button>
                                  </div>}>
                    </DialogBundle>
                </div>
            </NewPanel>
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
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default PrivateBrand;
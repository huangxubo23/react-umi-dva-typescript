/**
 * Created by 林辉 on 2018/8/9 14:50.element框架设置模板
 */
import ReactChild from "../../../../../../lib/util/ReactChild";
import React from 'react';
import $ from 'jquery';
import {Button, Layout, Switch, Input, Select, Table, Pagination, MessageBox, Message,Notification} from 'element-react';
import 'element-theme-default';
require('../../../../../../../styles/content/content_template.css');
import AJAX from "../../../../../../lib/newUtil/AJAX";
import {Link} from 'react-router-dom';
class ElementContent_template extends ReactChild {//设置模板列表
    constructor(props) {
        super(props);
        this.state = {
            pageNow: 1,
            pageSize: 16,
            count: 0,
            name: '',//搜索名字
            contentModel: [],//所有模板数据
            type: '',//模板类型
            hideSwitch: 1,//展示隐藏是否在编辑页面展示开关
            // contentMode: [],
        }
    }


    componentDidMount() {
        this.goPage(1);
    }

    goPage = (pageNow = this.state.pageNow, pageSize = this.state.pageSize) => {/*点击分页*/
        let {type, name, hideSwitch} = this.state;
        this.getChannelList({
            pageNow: pageNow, pageSize, type, name, hideSwitch,
        });
    };
    getChannelList = (data) => {//拿取所有模板数据
        this.contentTemplateAjax.ajax({
            type: 'post',
            url: '/content/admin/superManage/queryListByOrgId.io',
            data: data,
            callback: (json) => {
                this.setState(json);
            }
        });
    };

    hideSwitchChange = (state) => {//隐藏
        let {pageNow} = this.state;
        this.setState({hideSwitch: state ? 0 : 1}, () => {
            this.goPage(pageNow);
        });
    };
    searchType = (type) => {//类型搜索
        this.setState({type: type}, () => {
            this.goPage(1);
        });
    };

    mySwitch = (state, id) => {//是否在编辑页面展示开关
        let isHide = '';
        if (state) {
            isHide = 1;
        } else {
            isHide = 0;
        }
        this.contentTemplateAjax.ajax({
            type: 'post',
            url: '/content/admin/superManage/getIsHide.io',
            data: {modelId: id, isHide: isHide},
            callback: () => {
                this.goPage(this.state.pageNow);
            }
        });
    };

    deleteModel = (modelId) => {//删除模板
        MessageBox.confirm('如果该模板内有内容，请先将内容删除，删除模板后，该模板内的内容将永久删除不能参与工作统计和恢复', '提示', {
            type: 'warning'
        }).then(() => {
            this.contentTemplateAjax.ajax({
                type: 'post',
                url: '/content/admin/superManage/delContentMode.io',
                data: {'modelId': modelId},
                callback: () => {
                    Notification({
                        title:'成功',
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.goPage();
                }
            });
        }).catch(() => {
            Notification.info({
                title: '提示',
                message: '已取消删除'
            });
        });
    };

    openTemplateModel = () => {//打开模态
        this.setState({templateModelShow: true}, () => {
            let jd = this.templateModel.jd;
            if (jd) {
                jd.open();
            }
        });
    };


    getTable = () => {//组合表格
        let contentModel = this.state.contentModel;
        let columns = [//table表头
            {label: "排序", prop: "sort"},
            {label: "模板名称", prop: "name"},
            {label:"对应渠道",prop:"channelName"},
            {
                label: "是否在编辑页面展示", prop: "isHide", render: (data) => {
                    return (<span> <Switch value={data.isHide.isHide ? false : true}
                                           onChange={(v) => {
                                               this.mySwitch(v, data.isHide.id)
                                           }}
                                           onColor="#13ce66" offColor="#ff4949"/></span>)
                }
            },
            {label: "类型", prop: "type"},
            {
                label: "操作", prop: "operation", render: (data) => {
                    return (
                        <span> <Button  type="success" onClick={()=>{window.location.href=this.props.match.url+"/template/"+data.operation.id}}>编辑</Button>{" "}{/*<Link to={}></Link>*/}
                            <Button type="danger" onClick={()=>{this.deleteModel(data.operation.id)}} >删除</Button></span>
                    )
                }
            },
        ];
        let array = [];
        if (contentModel.length > 0) {//表里数据
            contentModel.map((cml, i) => {
                let {id, sort, name, isHide, type,channel} = cml;
                let channelName='';
                if(channel.mainChannelName){
                    channelName = channel.mainChannelName;
                }
                if(channel.activityName){
                    channelName+='_'+channel.activityName;
                }
                if(channel.entryName){
                    channelName+='_'+channel.entryName;
                }
                // let r = Math.floor(Math.random()*cml.id);
                // let g = Math.floor(Math.random()*255);
                // let b = Math.floor(Math.random()*255);
                // let colorAngle = 'rgba('+ r +','+ g +','+ b +',0.8)';
                let sColor=['#eceef3','#f6f6f6','rgb(247, 240, 240)','rgb(231, 241, 243)','rgb(236, 243, 238)','rgb(245, 242, 235)'];
                let t=i%(sColor.length);
                type = type == 1 ? '帖子' : type == 2 ? '清单' : type == 3 ? '单品' : type == 4 ? '搭配' : type == 8 ? '短视频' : '类型错误';
                array.push({sort: sort, name: name,channelName:channelName, isHide: {id: id, isHide: isHide}, type: type, operation: {id, i},className:{background:sColor[t]}})
            });
        }
        return {columns, array};
    };
    rowStyle=(row, index)=>{
        return row.className;
    };

    render() {
        let {hideSwitch, type, name, count, pageSize, pageNow} = this.state;
        let isHideSwitch = !hideSwitch;
        let tableData = this.getTable();//表格数据
        return (
            <div>
                <AJAX ref={e => this.contentTemplateAjax = e}>
                    <Layout.Row style={{marginBottom: '20px'}}>
                        <Layout.Col span="8">
                            隐藏是否在编辑页面展示:<Switch onChange={this.hideSwitchChange}
                                                value={isHideSwitch}
                                                onColor="#13ce66"
                                                offColor="#ff4949">
                        </Switch>
                        </Layout.Col>
                        <Layout.Col span="16">
                            <Input placeholder="请输入模板名称进行搜索" value={name} onChange={(value) => {
                                this.setState({name: value})
                            }}
                                   onKeyDown={(event) => {
                                       if (event.keyCode == "13") {
                                           this.goPage(1)
                                       }
                                   }}
                                   append={<Button type="primary" icon="search" onClick={() => {
                                       this.goPage(1)
                                   }}>搜索</Button>}/>
                        </Layout.Col>
                    </Layout.Row>

                    <Layout.Row style={{marginBottom: '20px'}}>
                        <Layout.Col span="24">
                            <Button.Group>
                                <Button type="info"><Link to={this.props.match.url+"/template"}>新建模板</Link></Button>
                                <Button href="#"  disabled={type==''}  onClick={()=>{this.searchType('')}}>全部</Button>
                                <Button href="#"  disabled={type==1} onClick={()=>{this.searchType(1)}}>帖子</Button>
                                <Button href="#"  disabled={type==2} onClick={()=>{this.searchType(2)}}>清单</Button>
                                <Button href="#"  disabled={type == 3} onClick={()=>{this.searchType(3)}}>单品</Button>
                                <Button href="#"  disabled={type == 4} onClick={()=>{this.searchType(4)}}>搭配</Button>
                                {/*<Button href="#"  disabled={type == 7} onClick={()=>{this.searchType(7)}}>结构体</Button>*/}
                                <Button href="#"  disabled={type == 8} onClick={()=>{this.searchType(8)}}>短视频</Button>
                            </Button.Group>
                        </Layout.Col>
                    </Layout.Row>
                    <div className='divTable'>
                        <Table style={{width: '100%'}} align='center' rowStyle={this.rowStyle} headerAlign='center' columns={tableData.columns} data={tableData.array}/>
                    </div>
                    <Pagination layout="total, sizes, prev, pager, next, jumper" total={count} pageSizes={[16, 20, 50, 100]} pageSize={pageSize} currentPage={pageNow}
                                onSizeChange={(pageSize) => {
                                    this.goPage(pageNow, pageSize)
                                }} onCurrentChange={(pageNow) => {
                        this.goPage(pageNow)
                    }}/>
                </AJAX>
            </div>
        )
    }
}

export default ElementContent_template;
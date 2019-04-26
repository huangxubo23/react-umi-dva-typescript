/**
 * Created by linhui on 18-1-27.赏金任务广场
 */

import ReactChild from "../../../../../../lib/util/ReactChild";
require('../../../../../../../styles/addList/content.css');
import EditBox from '../../../../../../../components/lib/sharing/editBox/EditBox';
import React from 'react';
import AJAX from '../../../../../../lib/newUtil/AJAX';
import Menu from '../../../../components/AdminMenu';
import {timePosition} from '../../../../../../../components/lib/util/global';
import {Layout,Select,Input,Button,Card,Pagination,Popover,Tag,Tooltip} from "element-react";
import 'element-theme-default';

class BountyTaskSquare extends ReactChild {//赏金任务广场
    constructor(props) {
        super(props);
        this.state = {
            pageNow: 1,
            pageSize: 20,
            count: 0,
            bountyTaskList: [],//列表数据
            typeTab: '',//行业分类
            state: '',//状态
            title: '',//赏金任务名
        }
    }

    componentDidMount() {
        this.goPage(1);
    };


    goPage = (now) => {
        let {pageNow,pageSize,typeTab,state,title}=this.state;
        this.bountyTaskListAjax.ajax({
            type: 'post',
            url: '/mission/admin/bountyTask/queryListByPage.io',
            data: {
                pageNow: now?now:pageNow, pageSize, typeTab, state, title,
            },
            callback: (json) => {
                this.setState(json);
            }
        });
    };


    generalChange = ({value,type}) => {//行业||状态||标题
        this.setState(Object.assign(this.state,{[type]:value}),()=>{
            if(type==='typeTab'||type==='state'){
                this.goPage()
            }
        });
    };

    render() {
        let {typeTab,state,title,bountyTaskList,count,pageSize,pageNow}=this.state;
        let typeTabArray = ["潮女", "潮男", "美妆", "母婴", "户外", "数码", "家居", "文体", "汽车", "美食"];
        let currentLogin = Menu.isLogin();
        let permissions;
        if (currentLogin) {
            permissions = currentLogin.loginManage.permissions;
        }
        let isPrice=currentLogin.loginManage.grade == 0 || (permissions ? permissions.indexOf('查看赏金金额') > -1 : false);
        return(
            <div>
                <NewPanel header="任务广场赏金任务">
                    <Layout.Row gutter="20">
                        <Layout.Col span="2">
                            <div style={{fontWeight:'bold',marginTop:'5px',marginLeft:'5px'}}>
                                行业分类
                            </div>
                        </Layout.Col>
                        <Layout.Col span="5">
                            <Select value={typeTab} placeholder="请选择" size='small' onChange={(value) => {
                                this.generalChange({value,type:'typeTab'})
                            }} style={{width: '100%'}}>
                                <Select.Option value='' label='全部'/>
                                {typeTabArray.map((item) => {
                                    return (
                                        <Select.Option value={item} key={item} label={item}/>
                                    )
                                })}
                            </Select>
                        </Layout.Col>
                        <Layout.Col span="2">
                            <div style={{fontWeight:'bold',marginTop:'5px',marginLeft:'5px'}}>
                                状态
                            </div>
                        </Layout.Col>
                        <Layout.Col span="5">
                            <Select value={state} placeholder="请选择" size='small' onChange={(value) => {
                                this.generalChange({value,type:'state'})
                            }} style={{width: '100%'}}>
                                <Select.Option value='' label='全部'/>
                                <Select.Option value='1' label='未开始'/>
                                <Select.Option value='2' label='进行中'/>
                                <Select.Option value='3' label='已结束'/>
                            </Select>
                        </Layout.Col>
                        <Layout.Col span="10">
                            <Input placeholder="请输入店铺名搜索..." size='small' value={title} onChange={value => this.generalChange({value,type:'title'})}
                                   onKeyDown={(event) => {if (event.keyCode == "13") {this.goPage(1)}}}
                                   prepend={<Button icon="delete" onClick={() => this.generalChange({value:'',type:'title'})}>清空</Button>}
                                   append={<Button icon="search" onClick={()=>this.goPage(1)}>搜索</Button>}/>
                        </Layout.Col>
                    </Layout.Row>
                    <AJAX ref={e => {
                        this.bountyTaskListAjax = e
                    }}>
                        <Layout.Row gutter="10" style={{marginTop:'10px'}}>
                            {bountyTaskList.map((item,index)=>{
                                let {totalCount, number,id,shopLogo} = item;
                                let total = Math.round(totalCount / number * 10000) / 100;
                                return(
                                    <Layout.Col span="6" key={id} style={{marginTop:'10px'}}>
                                        <div style={{border:'1px solid #d1dbe5',padding: '10px',borderRadius:'4px'}}>
                                            <Layout.Row gutter="2">
                                                <Layout.Col span="6">
                                                    <img src={shopLogo?shopLogo:'http://assets.alicdn.com/apps/mytaobao/3.0/profile/defaultAvatar/avatar-160.png'}/>
                                                </Layout.Col>
                                                <Layout.Col span="18" style={{textAlign:'left',padding:'0 6px'}}>
                                                    <Tooltip className="item" effect="dark"
                                                             content={item.sellerName}
                                                             placement="bottom-start">
                                                        <div style={{
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                            overflow: "hidden",
                                                            display: "block"
                                                        }}>
                                                            <span>店名:</span>
                                                            <strong>
                                                                <a href={item.sellerLink} target="_blank">{item.sellerName}</a>
                                                            </strong>
                                                        </div>
                                                    </Tooltip>
                                                    <div>
                                                        <span>分类:</span>
                                                        <strong>{item.typeTab}</strong>
                                                        <div style={{float: 'right'}}>
                                                            <span>状态:</span>
                                                            <strong>{timePosition(item.startDateTime, item.endDateTime)}</strong>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span style={{color:'#F40'}}>￥{isPrice? item.price : "**"}元{'x' + item.number}个{total >= 80?`(剩余${number - totalCount}个)`:''}</span>
                                                    </div>
                                                    <div>
                                                        渠道要求:
                                                        <Popover placement="left" title="渠道要求详情" width="360" trigger="hover" content={(
                                                            <div>
                                                                {item.channelStr.map(channel => {
                                                                    return(
                                                                        <Card className="box-card" key={`${channel.entryId}-${index}`} style={{marginTop:'5px'}}>
                                                                            <p>{channel.title + '-' + channel.columnName + '-' + channel.entryName + ':'}</p>
                                                                            <p>
                                                                                <b style={{color: 'orange'}}>要求：
                                                                                    {(channel.conditions&&channel.conditions.type)&&(channel.conditions.type == 1 ? '(需要渠道审核通过)' : channel.conditions.type == 2 ? '(不需要审核通过)' : '')}
                                                                                    {(channel.conditions&&channel.conditions.type == 3 &&channel.conditions.wTincluded)&&
                                                                                        <span>微淘需要指定渠道收录:{channel.conditions.wTincluded.map((wd, w) => {
                                                                                            return (
                                                                                                <Tag key={`${channel.entryId}-${index}-${wd}`} type={w == 0 ? '' : w == 1 ? 'primary' : w == 2 ? 'success' : w == 3 ? 'gray' : w == 4 ? 'warning' : w == 5 ? 'danger' : ''}>{wd}</Tag>
                                                                                            )
                                                                                        })}</span>}
                                                                                </b>
                                                                            </p>
                                                                        </Card>
                                                                    )
                                                                })}
                                                            </div>
                                                        )}>
                                                            <Button type="text">详情</Button>
                                                        </Popover>
                                                        <div style={{float: 'right'}}>
                                                            <span>任务要求:</span>
                                                            <Popover placement="left" title="任务要求详情" width="250" trigger="hover" content={(
                                                                <div>
                                                                    {item.talentGrade && <p><Tag type='primary'>达人等级要求:</Tag>L{item.talentGrade}
                                                                    </p>}
                                                                    {item.numberLimit && <p><Tag type='primary'>达人总共可做任务数量</Tag>:{item.numberLimit}个
                                                                    </p>}
                                                                    {item.todayNumberLimit && <p><Tag type='primary'>达人每天可做任务数量:</Tag>{item.todayNumberLimit}个
                                                                    </p>}
                                                                    <EditBox readOnly={true} imgDisabled={true} ref="editBox"
                                                                             content={item.details} data-name="details"/>
                                                                </div>
                                                            )}>
                                                                <Button type="text">详情</Button>
                                                            </Popover>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span>开始时间:</span>
                                                        <label>{item.startDate}</label>
                                                    </div>
                                                    <div>
                                                        <span>结束时间:</span>
                                                        <label>{item.endDate}</label>
                                                    </div>
                                                </Layout.Col>
                                            </Layout.Row>
                                        </div>
                                    </Layout.Col>
                                )
                            })}
                        </Layout.Row>
                        <div style={{textAlign: "center",marginTop: '16px'}}>
                            <Pagination layout="total, prev, pager, next, jumper" total={count} pageSize={pageSize} currentPage={pageNow}
                                        onCurrentChange={this.goPage}/>
                        </div>
                    </AJAX>
                </NewPanel>
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

export default BountyTaskSquare;

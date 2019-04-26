/**
 * Created by linhui on 18-1-29.赏金任务数据（创建内容里用）
 */

import ReactChild from "../../../../../lib/util/ReactChild";
require('../../../../../../styles/component/bountyTaskList.css');
import React from 'react';
import EditBox from '../../../../../../components/lib/sharing/editBox/EditBox';
import NewPanel from '../../../../../../components/lib/util/elementsPanel';
import {Layout, Card, Popover, Alert, Button,Tag,Pagination} from 'element-react';
require('../../../../../../styles/content/content_template.css');
import $ from 'jquery';
import {ajax} from '../../../../../../components/lib/util/ajax';
import {timePosition} from '../../../../../../components/lib/util/global';
import '../../../../../../components/lib/util/bootstrap-datetimepicker.min';
import '../../../../../../components/lib/util/bootstrap-datetimepicker.zh-CN'
import '../../../../../../styles/content/bootstrap-datetimepicker.min.css'

class BountyTaskList extends ReactChild {
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
            entryId: '',//第三渠道id
            channelId: '',//渠道id
        }
    }

    componentDidMount() {
        this.goPage(1);
    }

    /* componentWillReceiveProps(){
         if(this.state.channelId!=this.props.channelId){
             this.setState({channelId:this.props.channelId},()=>{
                 this.quechannelById();
             });
         }
     }*/
    quechannelById = () => {//查询渠道
        let {channelId}=this.props;
        if (channelId) {
            ajax.ajax({
                type: 'post',
                url: '/user/admin/quechannelById.io',
                data: {id: channelId},
                isCloseMask: true,
                callback: (json) => {
                    this.setState({entryId: json.entryId?json.entryId:''}, () => this.goPage(1));
                }
            });
        }
    };

    goPage = (pageNow) => {/*点击分页*/
        let {pageSize,typeTab,state,title,entryId}=this.state;
        pageNow = pageNow ? pageNow : this.state.pageNow;
        this.queryListByPage({pageNow, pageSize, typeTab, state, title, entryId});
    };

    queryListByPage = (data) => {//查询赏金任务列表数据
        ajax.ajax({
            type: 'post',
            url: '/mission/admin/talentBountyTask/queryListByPage.io',
            data: data,
            isCloseMask: true,
            callback: (json) => {//bountyTaskList
                this.setState(json);
            }
        });
    };


    typeTabOrStateChange = (env) => {//行业搜索or状态搜索
        let [value, name, state] = [env.target.value, $(env.target).data('name'), this.state];
        state[name] = value;
        this.setState(state, () => {
            this.goPage();
        });
    };
    titleChange = (title) => {//赏金名字事件
        this.setState({title});
    };
    titleSearch = () => {//赏金搜索
        this.goPage();
    };

    render() {
        let {currentLogin,channel} = this.props,{bountyTaskList=[],count,pageNow,pageSize}=this.state;
        let {permissions} = currentLogin.loginManage;
        return (
            <div style={{zIndex: '1'}}>
                <NewPanel header="赏金任务" style={{height: '750px'}}>
                    <Alert style={{marginBottom: '20px'}} type="warning"
                           title={<div><strong>史上最自由的任务</strong> 不限制坑位，不限制竞品，带上店铺的商品进渠道就好。<a
                               href="https://daren.bbs.taobao.com/detail.html?postId=8429292" target="_blank">点击查看</a>
                           </div>}>

                    </Alert>
                    <div className="allColor" style={{maxHeight: '700px'}}>
                        <Layout.Row>
                            {bountyTaskList.map(item=> {
                                let [totalCount, number, completeCount] = [item.totalCount, item.number, item.completeCount];
                                let [total, completetotal] = [Math.round(totalCount / number * 10000) / 100, Math.round(completeCount / number * 10000) / 100];
                                let newEntryId = item.newEntryId;
                                let startDate = item.startDate.substring(0, item.startDate.indexOf("00:00"));
                                let endDate = item.endDate.substring(0, item.endDate.indexOf("23:59"));
                                if (newEntryId) {
                                    if (newEntryId.indexOf(channel.entryId) > -1) {//item.isPayment && item.state == 1&&
                                        return (
                                            <div key={item.id}>
                                                <Layout.Col lg={24} md={24} sm={24} xs={24} className='layoutCol-xlg-12'>
                                                    <Card className="box-card">
                                                        <div className="text item">
                                                            <img className='btImg'
                                                                 style={{width: '80px', height: '80px', float: 'left'}}
                                                                 src={item.shopLogo ? item.shopLogo : "http://assets.alicdn.com/apps/mytaobao/3.0/profile/defaultAvatar/avatar-160.png"}/>
                                                            <div style={{marginLeft: "84px"}}>
                                                                <div><span>店铺名称:</span><strong><a href={item.sellerLink}
                                                                                                  target='_blank'>{item.sellerName}</a>-{timePosition(item.startDateTime, item.endDateTime)}
                                                                </strong></div>
                                                                <div><span>单价:</span>
                                                                    {(currentLogin.loginManage.grade == 0 || (permissions ? permissions.indexOf('查看赏金金额') > -1 : false)) ? item.price : "**"}元
                                                                    <span className="number">{'x' + item.number}个</span>
                                                                </div>
                                                                <div><span>开始时间:</span><label>{startDate}</label>
                                                                </div>
                                                                <div><span>结束时间:</span><label>{endDate}</label>
                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div className="text item">
                                                            <Popover placement="left" width='211px'
                                                                     trigger="click"
                                                                     content={<div style={{overflow: 'auto', maxHeight: '500px'}}>
                                                                         <EditBox readOnly={true} imgDisabled={true}
                                                                                  ref="editBox" content={item.details}
                                                                                  data-name="details"/>
                                                                         <p className='channelYQ'><Tag
                                                                             type='primary'>任务名:</Tag>{item.title}</p>
                                                                         <p className='channelYQ'><Tag
                                                                             type='primary'>进行中的条数:</Tag>{item.underwayCount}条
                                                                         </p>
                                                                         <p className='channelYQ'><Tag
                                                                             type='primary'>审核中和已打款总数数:</Tag>{item.examineCount}条
                                                                         </p>
                                                                         <p className='channelYQ'><Tag
                                                                             type='primary'>已打款条数:</Tag>{item.makeMoneyCount}条
                                                                         </p>
                                                                         {completetotal >= 20 && <p ><Tag type="warning" style={{fontSize:'13px'}}>已制作{completeCount}条待审核通过</Tag></p>}
                                                                         {total >= 80 && <p ><Tag style={{fontSize: '13px'}}>(剩余{number - totalCount}个)</Tag></p>}
                                                                         {item.channelStr.map((channel, c) => {
                                                                             return (
                                                                                 <Alert style={{marginBottom: '10px'}}
                                                                                        type="info"
                                                                                        key={channel.entryId + "_" + c}
                                                                                        title={<div>
                                                                                            <p>{channel.title + '-' + channel.columnName + '-' + channel.entryName + ':'}</p>
                                                                                            <p>
                                                                                                <p><b style={{
                                                                                                    color: '#04c',
                                                                                                    fontSize: '14px'
                                                                                                }}>要求：
                                                                                                    {channel.conditions ? channel.conditions.type ? '' + channel.conditions.type == 1 ? '(需要渠道审核通过)' : channel.conditions.type == 2 ? '(不需要审核通过)' : '' : '' : ''}
                                                                                                    {channel.conditions ? channel.conditions.type == 3 ? channel.conditions.wTincluded ?
                                                                                                        <span>微淘需要指定渠道收录:{channel.conditions.wTincluded.map((wd, w) => {
                                                                                                            return (<Tag
                                                                                                                key={wd + "_" + w}
                                                                                                                type={w == 0 ? '' : w == 1 ? 'primary' : w == 2 ? 'success' : w == 3 ? 'gray' : w == 4 ? 'warning' : w == 5 ? 'danger' : ''}>{wd}</Tag>)
                                                                                                        })}</span> : '' : '' : ''}
                                                                                                </b></p>
                                                                                            </p>
                                                                                        </div>}>

                                                                                 </Alert>
                                                                             )
                                                                         })}
                                                                         {item.talentGrade &&
                                                                         <p className='channelYQ'><Tag
                                                                             type='primary'>达人等级要求:</Tag>L{item.talentGrade}
                                                                         </p>}
                                                                         {item.numberLimit &&
                                                                         <p className='channelYQ'><Tag
                                                                             type='primary'>达人总共可做任务数量</Tag>:{item.numberLimit}个
                                                                         </p>}
                                                                         {item.todayNumberLimit &&
                                                                         <p className='channelYQ'><Tag
                                                                             type='primary'>达人每天可做任务数量:</Tag>{item.todayNumberLimit}个
                                                                         </p>}

                                                                     </div>}>
                                                                <Button type='info'>任务详情</Button>
                                                            </Popover>
                                                        </div>
                                                    </Card>
                                                </Layout.Col>
                                            </div>
                                        )
                                    }
                                }
                            })}
                        </Layout.Row>
                    </div>
                    <div style={{textAlign: "center"}}>
                        <Pagination layout="prev, pager, next" total={count} pageSize={pageSize}
                                    currentPage={pageNow} onCurrentChange={this.goPage} style={{marginTop: '8px'}}/>
                    </div>
                </NewPanel>
            </div>
        )
    }
}


export default BountyTaskList;

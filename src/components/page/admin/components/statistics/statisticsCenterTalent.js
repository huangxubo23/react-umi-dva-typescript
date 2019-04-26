/**
 * Created by linhui on 17-10-23.军机处每个达人
 */
import React from 'react';
import TrendChart from './statisticsCenter_TrendChart';
import {clone} from '../.././../../../components/lib/util/global';
import AJAX from '../.././../../../components/lib/newUtil/AJAX';
import NewPanel from '../.././../../../components/lib/util/elementsPanel';
import {Button, Layout, Tag, Popover, Dropdown, Select, Message, MessageBox} from 'element-react';
import 'element-theme-default';
import {ThousandsOfCall} from "../../../../lib/util/ThousandsOfCall";

class StatisticsCenterTalent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            talent: [],
            trendChartSwitch: false,
            chartData: {},//走势图数据
        }
    }

    componentDidMount() {

    }

    openTrendChart = (env) => {//打开走势图
        let data = env.data;
        let da = clone(data);
        this.trendChart.openTrendChart(da);
    };
    closeTrendChart = () => {//关闭走势图
        this.trendChart.closeTrendChart();
    };
    oneTalentRefresh = (env) => {//刷新单个达人
        let talent = this.props.talent;
        let i = env.i;
        this.props.getStatisticsCenter(talent, i, 'refresh');

    };
    deleteClick = (env) => {//假删除达人
        let id = env.id;
        MessageBox.confirm('您确定要删除吗', '提示', {
            type: 'warning'
        }).then(() => {
            this.statisticsCenterTalentAjax.ajax({
                type: 'post',
                url: '/user/admin/topManage/delTalentMessageById.io',
                data: {id: id},
                callback: (json) => {
                    Message({type: 'success', message: '删除成功!'});
                    this.props.goPage(1);
                }
            });

        }).catch(() => {
            Message({
                type: 'info',
                message: '已取消删除'
            });
        });
    };

    render() {
        let talent = this.props.talent;

        if (talent.length > 0) {
            for (let y = 0; y < talent.length; y++) {
                let countUv = 0;
                let countPublicFee = 0.00;
                if (talent[y].effectChanne) {
                    if (talent[y].effectChanne.effectChanne.length > 0) {
                        let effectChanne = talent[y].effectChanne.effectChanne;
                        for (let i = 0; i < effectChanne.length; i++) {
                            if (effectChanne[i].commissionFee || effectChanne[i].fixedIncome) {//effectChanne[i].publicFee
                                countPublicFee += effectChanne[i].commissionFee + effectChanne[i].fixedIncome;//effectChanne[i].publicFee
                            }
                            if (effectChanne[i].uv) {
                                countUv += effectChanne[i].uv;
                            }
                            /*    effectChanne[i].option =
                                    '<option >'+effectChanne[i].effectChanneName.channelName+ '(' + effectChanne[i].count + '条)</option>'+
                                    '<option>动态奖金:'+effectChanne[i].commissionFee+'</option>'+
                                    '<option>固定奖励:'+effectChanne[i].fixedIncome+'</option>';*/


                        }
                    }
                    let cf = countPublicFee.toFixed(2);
                    talent[y].effectChanne.countPublicFee = cf;
                    talent[y].effectChanne.countUv = countUv;
                }
            }
        }
        let popoverHoverFocus = (
            <Popover id="popover-trigger-hover-focus" title="如何授权">
                请进入论坛页面查看【设置模板如何选择授权达人】
            </Popover>
        );

        let {disabled} = this.state;
        return (
            <AJAX ref={e => this.statisticsCenterTalentAjax = e}>
                <div className="allColor">
                    <Layout.Row className="allColor" gutter="20">
                        {talent.length > 0 ?
                            talent.map((item, z) => {
                                let effectChanne = item.effectChanne ? item.effectChanne.effectChanne : [];
                                let s = [];

                                for (let i in effectChanne) {
                                    if (effectChanne[i].bonusType) {
                                        s.push(effectChanne[i].bonusType);
                                    }
                                    s.push("----动态奖励" + effectChanne[i].commissionFee + '(' + effectChanne[i].commissionFeec + '条)');
                                    s.push("----固定奖励" + effectChanne[i].fixedIncome + '(' + effectChanne[i].fixedIncomec + '条)');
                                }


                                return (
                                    <Layout.Col sm={8} xs={12} key={item.id}>
                                        <div className="widthHeght">
                                            <NewPanel header={<span>{item.title}----{item.cookieIsFailure ?
                                                <span><Tag type="success">已授权</Tag><Button type="success" size='mini'
                                                                                           onClick={() => {
                                                                                               ThousandsOfCall.acoustic({talentId: item.id}, "openTalentManage")
                                                                                           }}>打开后台</Button></span> :
                                                <Tag type="danger">未授权</Tag>}</span>}>
                                                <Layout.Row className="refreshPosition">
                                                    <Layout.Col sm={22}>
                                                        <div style={{width: "120px", float: "left"}}>
                                                            <img className="imgFloat"
                                                                 style={{width: '120px', height: '120px'}}
                                                                 src={item.headPortrait}/>
                                                        </div>
                                                        <div style={{
                                                            textAlign: "left",
                                                            float: "left",
                                                            "marginLeft": "10px"
                                                        }}>
                                                            <p className="talentData"><strong>{item.title}</strong></p>
                                                            <p className="talentData">好货入库量:<span
                                                                className="red">{item.effectChanne ? item.effectChanne.shu : '加载中'}</span>
                                                            </p>
                                                            <p className="talentData">指数:<span
                                                                className="green">{item.talentIndex}</span></p>
                                                            <p className="talentData">领域:<span
                                                                className="green">{item.area}</span></p>
                                                            <p className="talentData">健康分:<span
                                                                className="green">{item.healthScore}</span></p>
                                                            <p className="talentData">内容质量分:<span
                                                                className="green">{item.qualityScore}</span></p>
                                                        </div>
                                                    </Layout.Col>
                                                    <Layout.Col sm={2}>
                                                        <div className="refresh">
                                                            <Button type="info" onClick={() => {
                                                                this.oneTalentRefresh({i: z})
                                                            }}>刷新</Button>
                                                        </div>
                                                        <div className="authorization">
                                                        </div>

                                                    </Layout.Col>
                                                </Layout.Row>
                                                <hr/>
                                                {item.effectChanne ?
                                                    <Layout.Row>
                                                        <Layout.Col sm={12}>
                                                            <Dropdown trigger="click" menu={(
                                                                <Dropdown.Menu>
                                                                    {(item.maxUv ? item.maxUv : []).map((effect, v) => {
                                                                        let s = v + 1;
                                                                        return (
                                                                            <Dropdown.Item
                                                                                onClick={e => this.setState({disabled: !disabled})}>
                                                                                <Popover placement="right" title="内容详情"
                                                                                         width="400px" trigger="hover"
                                                                                         content={<div>
                                                                                             <Button target="_blank"
                                                                                                     bsStyle="info"
                                                                                                     href={"https://market.m.taobao.com/apps/market/content/index.html?contentId=" + effect.feedId}>放大内容详情</Button>
                                                                                             <p/>
                                                                                           {/*  <iframe style={{
                                                                                                 width: '400px',
                                                                                                 height: '600px'
                                                                                             }}
                                                                                                     src={"https://market.m.taobao.com/apps/market/content/index.html?contentId=" + effect.feedId}/>*/}
                                                                                         </div>}>
                                                                                    <Button>
                                                                                        <strong>top{s}:</strong><span
                                                                                        className="blue">{effect.feedTitle}</span>
                                                                                        <span
                                                                                            className="red">{'(uv:' + effect.uv + ')'}</span></Button>
                                                                                </Popover>
                                                                            </Dropdown.Item>
                                                                        )
                                                                    })}
                                                                </Dropdown.Menu>
                                                            )}>
                                                                <Button
                                                                    type="primary">{'总流量:' + item.effectChanne.count}</Button>
                                                            </Dropdown>
                                                        </Layout.Col>

                                                        <Layout.Col sm={12}>
                                                            <Select
                                                                placeholder={'总奖金:' + item.effectChanne.countPublicFee}>
                                                                <Select.Option>总奖金:{item.effectChanne.countPublicFee}</Select.Option>
                                                                {s.map((channe, x) => {
                                                                    return <Select.Option key={x} label={channe}
                                                                                          value={channe}/>
                                                                })}
                                                            </Select>
                                                        </Layout.Col>
                                                    </Layout.Row> : '加载中'}

                                                <p/>
                                                {item.effectChanne ?
                                                    <Layout.Row>
                                                        <Layout.Col sm={6}><Button onClick={() => {
                                                            this.openTrendChart({
                                                                data: {
                                                                    title: '好货入库量走势图',
                                                                    talentIds: item.accountId,
                                                                    type: 2,
                                                                    url: '/message/' + this.props.url + '/queryCheesylibrayZou.io',
                                                                    urlType:this.props.url,
                                                                    effectChanne: item.effectChanne.effectChanne
                                                                }
                                                            })
                                                        }}>好货入库量</Button></Layout.Col>
                                                        <Layout.Col sm={6}><Button onClick={() => {
                                                            this.openTrendChart({
                                                                data: {
                                                                    title: '流量走势图',
                                                                    talentIds: item.accountId,
                                                                    type: 0,
                                                                    url: '/message/' + this.props.url + '/queryFlowAttempt.io',
                                                                    urlType:this.props.url,
                                                                    effectChanne: item.effectChanne.effectChanne
                                                                }
                                                            })
                                                        }}>流量</Button></Layout.Col>
                                                        <Layout.Col sm={6}><Button onClick={() => {
                                                            this.openTrendChart({
                                                                data: {
                                                                    title: '奖金走势图',
                                                                    talentIds: item.accountId,
                                                                    type: 1,
                                                                    url: '/message/' + this.props.url + '/queryMoneyTrendChart.io',
                                                                    urlType:this.props.url,
                                                                    effectChanne: item.effectChanne.effectChanne
                                                                }
                                                            })
                                                        }}>奖金</Button></Layout.Col>
                                                        <Layout.Col sm={6}><Button type='danger' onClick={() => {
                                                            this.deleteClick({id: item.id})
                                                        }}>删除</Button></Layout.Col>
                                                    </Layout.Row> : '加载中'}
                                            </NewPanel>
                                        </div>
                                    </Layout.Col>
                                )
                            }) : ''}
                    </Layout.Row>
                    <TrendChart ref={e => this.trendChart = e}/>
                </div>
            </AJAX>
        );
    }
}

export default StatisticsCenterTalent;

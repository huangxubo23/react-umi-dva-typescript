/**
 * Created by linhui on 18-1-12.首页4.0
 */

import {Layout, Carousel, Card, Alert, Steps, MessageBox, Message, Button} from 'element-react';
import 'element-theme-default';

require('../../../../styles/user/content.css');
require('../../../../styles/index/homePage4.css');
import $ from 'jquery';
import React from 'react';
import {ajax} from '../../../lib/util/ajax';
import '../../../lib/util/jquery-ui.min';
import Workload from '../../../lib/sharing/workload/Workload';
import wzg4 from '../../../../images/index/wzg4.jpg';
import sj from '../../../../images/index/sj.png';
import sj2 from '../../../../images/index/sj2.png';
import sj3 from '../../../../images/index/sj3.png';
import sj4 from '../../../../images/index/sj4.png';
import sj5 from '../../../../images/index/sj5.png';
import ReactChild from "../../../lib/util/ReactChild";
import AJAX from "../../../lib/newUtil/AJAX";
import {BundleLoading} from '../../../../bundle';
import SpotCardExchangeModalContainer
    from 'bundle-loader?lazy&name=pc/trends_asset/admin/app-[name]!./components/SpotCardExchangeModal';
import rechargeModalContainer
    from 'bundle-loader?lazy&name=pc/trends_asset/admin/app-[name]!./components/RechargeModal';
import detailedModalContainer
    from 'bundle-loader?lazy&name=pc/trends_asset/admin/app-[name]!./components/DetailedModal';
import myRecommendationModalContainer
    from 'bundle-loader?lazy&name=pc/trends_asset/admin/app-[name]!./components/MyRecommendationModal';

const Ajax = ajax.ajax;

class HomePage4 extends ReactChild {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            data: {
                nameHomePage4: "",
                portrait: "",
                esteemn: "",
                permissionItem: [],
                subNick: "",
                grade: "",
                type: '',
                organization: {
                    ownerManages: 2,
                },
            },
            contentType: 1,//饼状图类型
            currentTime: '',//当前时间
        }
    }

    componentDidMount() {
        super.componentDidMount();
        document.title = "首页-哇掌柜";
        this.getMain();
    }

    getMain = () => {
        Ajax({
            type: "post",
            url: "/user/admin/getIndexHeader.io",//要访问的后台地址
            data: {},
            callback: (data) => {
                let colCenter = $('#centerCol').height();
                this.setState({data: data}, () => {
                    this.setState({centerCol: colCenter});
                });
            }
        });
    };

    upData = () => {
        this.getMain();
    };

    quitOrganization = () => {
        Ajax({
            type: "post",
            url: "/user/admin/visible/EscOrg.io",//要访问的后台地址
            data: {},
            callback: () => {
                this.getMain();
            }
        });
    };

    cardChange = () => {
        let spotCardExchangeModal = this.state.spotCardExchangeModal;
        if (spotCardExchangeModal) {
            let {esteemn} = this.state.data;
            this.spotCardExchange.jd.setState({total: esteemn, available: esteemn, show: true});
        } else {
            spotCardExchangeModal =
                <BundleLoading ref={e => this.spotCardExchange = e} load={SpotCardExchangeModalContainer}
                               upData={this.upData}/>
            this.setState({spotCardExchangeModal: spotCardExchangeModal}, () => {
                let upload = setInterval(() => {
                    let spotCardExchange = this.spotCardExchange;
                    if (spotCardExchange && spotCardExchange.jd) {
                        clearInterval(upload);
                        let {esteemn} = this.state.data;
                        spotCardExchange.jd.setState({total: esteemn, available: esteemn, show: true});
                    }
                });
            })
        }
    };

    rechargeChange = () => {
        let rechargeModal = this.state.rechargeModal;
        if (rechargeModal) {
            this.rechargeModal.jd.setState({show: true});
        } else {
            rechargeModal =
                <BundleLoading ref={e => this.rechargeModal = e} load={rechargeModalContainer}/>
            this.setState({rechargeModal: rechargeModal}, () => {
                let upload = setInterval(() => {
                    let rechargeModal = this.rechargeModal;
                    if (rechargeModal && rechargeModal.jd) {
                        clearInterval(upload);
                        rechargeModal.jd.setState({show: true});
                    }
                });
            })
        }
    };

    detailedChange = () => {
        let detailedModal = this.state.detailedModal;
        if (detailedModal) {
            this.detailedModal.jd.setState({show: true});
        } else {
            detailedModal =
                <BundleLoading ref={e => this.detailedModal = e} load={detailedModalContainer}/>
            this.setState({detailedModal: detailedModal}, () => {
                let upload = setInterval(() => {
                    let detailedModal = this.detailedModal;
                    if (detailedModal && detailedModal.jd) {
                        clearInterval(upload);
                        detailedModal.jd.setState({show: true});
                    }
                });
            })
        }
    };

    recommendChange = () => {
        let {myRecommendationModal} = this.state;
        if (myRecommendationModal) {
            this.myRecommendationModal.jd.setState({show: true});
        } else {
            myRecommendationModal =
                <BundleLoading ref={e => this.myRecommendationModal = e} load={myRecommendationModalContainer}/>
            this.setState({myRecommendationModal: myRecommendationModal}, () => {
                let upload = setInterval(() => {
                    let myRecommendationModal = this.myRecommendationModal;
                    if (myRecommendationModal && myRecommendationModal.jd) {
                        clearInterval(upload);
                        myRecommendationModal.jd.setState({show: true});
                    }
                });
            })
        }
    };

    workloadClick = (env) => {/*饼状图按钮*/
        let value = $(env.target).data('value');
        this.setState({contentType: value}, () => {
            this.workload.queryYesterdayWorkEfficiency();
        });
    };

    render() {
        let {data, myRecommendationModal, detailedModal, spotCardExchangeModal, rechargeModal, contentType} = this.state;
        let gradeName = data.grade == 0 ? '管理员' : data.grade == 1 ? '普通员工' : data.grade == 3 ? '组员' : data.grade == 8 ? '小组' : '权限错误';
        return (
            <div>
                <Layout.Row>
                    <Layout.Col sm={24} id="centerCol">
                        <Card>
                            <Carousel height="251px">
                                <Carousel.Item>
                                    <a href="/pc/announcement" target="_blank"> <img
                                        src="https://img.alicdn.com/imgextra/i2/772901506/O1CN01B0u82m1Mzmz2K1m0V_!!772901506.jpg"/></a>
                                </Carousel.Item>
                            </Carousel>
                            <Card>
                                <div>
                                    {data.organization && <Layout.Row>
                                        <Layout.Col sm={24} style={{textAlign: "left", marginTop: "10px"}}>
                                            <Alert title={`${data.name}(${gradeName}),您好`} type="info" showIcon={true}
                                                   description={`您当前还有${data.esteemn}分钟的点卡`} closable={false}/>
                                        </Layout.Col>
                                    </Layout.Row>}
                                    {data.grade == 0 && <Layout.Row gutter="20" style={{marginTop: "20px"}}>
                                        <Layout.Col sm={6}>
                                            <div className="divButton" onClick={this.rechargeChange}>充值</div>
                                        </Layout.Col>
                                        <Layout.Col sm={6}>
                                            <div className="divButton" onClick={this.detailedChange}>明细</div>
                                        </Layout.Col>
                                        <Layout.Col sm={6}>
                                            <div className="divButton" onClick={this.recommendChange}>我的推荐(赚点数)</div>
                                        </Layout.Col>
                                        <Layout.Col sm={6}>
                                            < div className="divButton" onClick={this.cardChange}>点卡兑换权限时间</div>
                                        </Layout.Col>
                                    </Layout.Row>}
                                </div>

                                {data.subNick === undefined ? "" :
                                    <div style={{textAlign: "left"}}>
                                        <Alert title="混淆id" type="error" description={data.subNick}
                                               showIcon={true}/>
                                        <h4>（如果您需要入职请复制以上红色混淆id字符串发给你的负责人）</h4>
                                    </div>}
                                {data.subNick === undefined ? "" :
                                    <Button typw="info" onClick={() => {
                                        window.location.href = window.location.origin + "/pc/admin/user/userRegister";
                                    }
                                    } className="dr_url">
                                        我是达人，我需要付费使用(试用)
                                    </Button>}
                                {data.organization && data.organization.trial ?
                                    (data.loginManage.isOwnerManage &&
                                    <AJAX ref={e => this.trialUpgradeAjax = e}>
                                        <div style={{position: "relative"}}>
                                            <Steps space={300} active={0} processStatus={"finish"}>
                                                <Steps.Step title="试用版" description={"不支持添加员工"}> </Steps.Step>
                                                <Steps.Step title="正式版" description={"所有的软件功能"}> </Steps.Step>
                                            </Steps>
                                            <Button type="primary"
                                                    style={{
                                                        position: 'absolute',
                                                        left: "50%",
                                                        marginLeft: "-150px",
                                                        top: 0
                                                    }}
                                                    onClick={() => {
                                                        MessageBox.confirm('确定要升级为正式版本？升级后将开始付费', '提示', {
                                                            type: 'warning'
                                                        }).then(() => {
                                                            this.trialUpgradeAjax.ajax({
                                                                url: "/user/admin/topManage/trialUpgrade.io",
                                                                callback: () => {
                                                                    Message({
                                                                        type: 'success',
                                                                        message: '升级成功'
                                                                    });
                                                                    this.getMain();
                                                                }
                                                            })
                                                        }).catch(() => {
                                                            Message({
                                                                type: 'info',
                                                                message: '取消升级'
                                                            });
                                                        });
                                                    }
                                                    }>升级</Button>
                                        </div>
                                    </AJAX>) : data.permissionItem &&
                                    <div>
                                        <Layout.Row gutter="20">
                                            {data.permissionItem.map((item, i) => {
                                                return (
                                                    <Layout.Col sm={8} key={i} style={{marginTop: "20px"}}>
                                                        <Card style={{
                                                            color: item.whetherPermissions ? "#394861" : "#eef1f6",
                                                            alignContent: "left"
                                                        }}>
                                                            <div style={{alignContent: "left", padding: "-8px"}}>
                                                                <h4 style={{"lineHeight": "16px"}}>{item.remarks}</h4>
                                                            </div>
                                                            <b>到期时间：</b>{item.endDate}</Card>
                                                    </Layout.Col>
                                                )
                                            })}
                                        </Layout.Row></div>}
                                {data.loginManage && data.loginManage.isOwnerManage &&
                                <Alert style={{textAlign: "left", marginTop: "20px"}}
                                       type="info"
                                       title="关于试用版和内容保存时间的公告和规则"
                                       description="https://www.yuque.com/li59rd/grkh9g/hbdlud"/>}
                                {data.loginManage && data.loginManage.isOwnerManage && !data.organization.trial &&
                                <AJAX ref={e => this.backVAJAX = e}>
                                    <Button type={"warning"} style={{width: "100%", marginTop: "20px"}} onClick={() => {
                                        MessageBox.confirm('确定退回试用版本？退回后，将删除你所有的员工和分组，并且内容只能保存3个月', '提示', {
                                            type: 'warning'
                                        }).then(() => {
                                            this.backVAJAX.ajax({
                                                url: "/user/admin/topManage/trialBack.io",
                                                callback: () => {
                                                    Message({
                                                        type: 'success',
                                                        message: '退回成功'
                                                    });
                                                    this.getMain();
                                                }
                                            })
                                        }).catch(() => {
                                            Message({
                                                type: 'info',
                                                message: '取消'
                                            });
                                        });
                                    }}>退回试用版</Button></AJAX>}
                            </Card>

                            {data.organization && data.organization.id &&
                            <div>
                                <Card style={{marginTop: "20px"}}>
                                    <div className="contentButton" style={{backgroundColor: '#e74f5b'}} data-value="1"
                                         onClick={this.workloadClick}>图文
                                        {contentType == 1 && <img src={sj} className="sjImg"/>}
                                    </div>
                                    <div className="contentButton" style={{backgroundColor: '#3598dc'}} data-value="2"
                                         onClick={this.workloadClick}>清单
                                        {contentType == 2 && <img src={sj2} className="sjImg1"/>}
                                    </div>
                                    <div className="contentButton" style={{backgroundColor: '#8f44ad'}} data-value="3"
                                         onClick={this.workloadClick}>好货
                                        {contentType == 3 && <img src={sj3} className="sjImg1"/>}
                                    </div>
                                    <div className="contentButton" style={{backgroundColor: '#32b16c'}} data-value="4"
                                         onClick={this.workloadClick}>搭配
                                        {contentType == 4 && <img src={sj4} className="sjImg1"/>}
                                    </div>
                                    <div className="contentButton" style={{backgroundColor: '#f9b552'}} data-value="7"
                                         onClick={this.workloadClick}>结构体
                                        {contentType == 7 && <img src={sj5} className="sjImg1"/>}
                                    </div>
                                    <div className="clearfix"/>
                                    <Workload ref={e => this.workload = e} contentType={contentType}/>
                                </Card>
                                {!data.loginManage.isOwnerManage &&
                                <div className="signOut">
                                    <Button type="danger" onClick={this.quitOrganization}
                                            style={{width: "100%"}}>退出达人组织</Button>
                                </div>}
                            </div>}
                        </Card>
                    </Layout.Col>
                </Layout.Row>
                <div>{myRecommendationModal}{detailedModal}{spotCardExchangeModal}{rechargeModal}</div>
            </div>
        )
    }
}

HomePage4.defaultProps = {};
export default HomePage4;

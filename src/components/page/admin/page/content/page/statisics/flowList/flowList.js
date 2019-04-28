/**
 * Created by shiying on 17-8-2.
 */

import React from 'react';
import ReactChild from "../../../../../../../lib/util/ReactChild";
import {ajax} from '../../../../../../../lib/util/ajax';
import {BundleLoading} from '../../../../../../../../bundle';
import effectList
    from 'bundle-loader?lazy&name=pc/trends_asset/admin/content/statisices/flowList/app-[name]!./components/effectList';//排行榜
import shortlisted
    from 'bundle-loader?lazy&name=pc/trends_asset/admin/content/statisices/flowList/app-[name]!./components/shortlisted';//入围榜
import combined
    from 'bundle-loader?lazy&name=pc/trends_asset/admin/content/statisices/flowList/app-[name]!./components/combined';//流量-奖励统计
import movements
    from 'bundle-loader?lazy&name=pc/trends_asset/admin/content/statisices/flowList/app-[name]!./components/movements';//单条统计
import listShowModelContainer
    from 'bundle-loader?lazy&name=pc/trends_asset/admin/content/app-[name]!./../../list/page/listShowModel/ListShowModel';
const Ajax = ajax.ajax;
import {Tabs} from 'element-react';
import 'element-theme-default';

class FlowList extends ReactChild {
    constructor(props) {
        super(props);
        this.state = {
            value: 1,
            effectFirst: true,
            shortFirst: false,
            combinedFirst: false,
            movementsFirst: false,
            grade: 1,
            talent: [],
            channel: [],
        }
    }

    componentDidMount() {
        this.getIsLogin();
        this.getTalent();
    }

    channel = (date) => {
        Ajax({
            url: "/message/admin/effectAnalyse/queryEffectChanne.io",
            data: {date},
            callback: (data) => {
                this.setState({channel: data.effectChanne});
            }
        })
    };

    getTalent = () => {
        Ajax({
            url: "/user/admin/content/getTalentMessageByOrgId.io",
            data: {},
            callback: (data) => {
                this.setState({talent: data});
            }
        })
    };

    getIsLogin = () => {
        Ajax({
            url: "/user/isLogin.io",
            data: {},
            callback: (data) => {
                if (data.loginManage) {
                    let {grade,id}=data.loginManage;
                    this.setState({grade:grade, currLoginId:id});
                } else {
                    window.addEventListener('message', (e) => {
                        if (e.data && e.data.loginSuccess) {
                            let {grade,id}=e.data.loginManage;
                            this.setState({grade: grade, currLoginId: id});

                        }
                    })
                }
            }
        })
    };

    selectPresent = (tab) => {//切换
        let value=tab.props.name;
        let {shortFirst, combinedFirst, effectFirst, movementsFirst} = this.state;
        this.setState({value}, () => {
            if (!effectFirst && value == 1) {
                this.setState({effectFirst: true});
            }
            if (!shortFirst && value == 2) {
                this.setState({shortFirst: true});
            }
            if (!combinedFirst && value == 3) {
                this.setState({combinedFirst: true});
            }
            if (!movementsFirst && value == 4) {
                this.setState({movementsFirst: true});
            }
        });
    };

    getGovernmentManage = (id, callback) => {
        if (id) {
            let {manages} = this.state;
            Ajax({
                url: "/user/admin/user/user.manage.info.io",
                data: {id: id, type: 1},
                callback: (data) => {
                    manages.push(data);
                    this.setState({manages: manages}, () => {
                        if (callback && typeof callback == "function") {
                            callback();
                        }
                    });
                }, error:  ()=> {
                    manages.push({id: id, name: "无法获取"});
                    this.setState({manages: manages}, () => {
                        if (callback && typeof callback == "function") {
                            callback();
                        }
                    });
                }
            });
        }
    };

    findManageName = (id) => {
        let {manages=[]}=this.state;
        if (manages.length > 0) {
            for (let i in manages) {
                if (manages[i].id == id) {
                    return manages[i].name;
                }
            }
            this.getGovernmentManage(id);
        }
    };

    toMovements = (feedId) => {//单个奖励-流量详细
        this.setState({value: 4}, () => {
            let {movementsFirst} = this.state;
            if (movementsFirst) {
                this.movements.jd.parentQueryDate(feedId);
            } else {
                this.setState({movementsFirst: true}, () => {
                     const timer = setTimeout(() => {
                        let jd = this.movements.jd;
                        if (jd) {
                          clearInterval(timer);
                            jd.parentQueryDate(feedId);
                        }
                    }, 100);
                })
            }
        });
    };

    newSeeContent = (data) => {
        this.setState(data,()=>{
            let {showContentJudge}=this.state;
            if(showContentJudge){
                this.bundleLoading.jd.open();
            }else {
                this.setState({showContentJudge:true},()=>{
                    let sss=setInterval(() => {
                        let bundleLoading = this.bundleLoading;
                        if (bundleLoading&&bundleLoading.jd&&this.state.contentMode&&this.state.showContent) {
                            clearInterval(sss);
                            bundleLoading.jd.open();
                        }
                    },100)
                });
            }
        })
    };

    rewardDetailsJump=({manageId,name})=>{
        this.setState({value: 2}, () => {
            let {shortFirst} = this.state;
            if (shortFirst) {
                this.shortlisted.jd.jump({manageId,name});
            } else {
                this.setState({shortFirst: true}, () => {
                    const timer = setInterval(() => {
                        let jd = this.shortlisted.jd;
                        if (jd) {
                          clearInterval(timer);
                            jd.jump({manageId,name});
                        }
                    }, 3000);
                })
            }
        });
    };

    render() {
        let {grade,manages,currLoginId,channel,talent,effectFirst, shortFirst, combinedFirst, movementsFirst,value} = this.state;

        return (
            <div>
                <Tabs type="border-card" activeName={value} onTabClick={this.selectPresent}>
                    <Tabs.Pane label="优质内容排行榜" name={1}>
                        {effectFirst && <BundleLoading load={effectList} manages={manages} grade={grade} currLoginId={currLoginId} newSeeContent={this.newSeeContent}
                                                       findManageName={this.findManageName} talent={talent} channel={channel} toMovements={this.toMovements}
                                                       channelChange={this.channel}/>}
                    </Tabs.Pane>
                    <Tabs.Pane label="月度创作入围榜" name={2}>
                        {shortFirst && <BundleLoading load={shortlisted} manages={manages} ref={e => this.shortlisted = e} toMovements={this.toMovements} newSeeContent={this.newSeeContent}
                                                      grade={grade} currLoginId={currLoginId} talent={talent} channel={channel} channelChange={this.channel}/>}
                    </Tabs.Pane>
                    <Tabs.Pane label="流量—奖励总计" name={3}>
                        <div className='combinedWidth'>
                            {combinedFirst && <BundleLoading load={combined} manages={manages} talent={talent} channel={channel} rewardDetails={this.rewardDetailsJump}/>}
                        </div>
                    </Tabs.Pane>
                    <Tabs.Pane label="流量奖励走势图" name={4}>
                        <div className='movementsWidth'>
                            {movementsFirst && <BundleLoading ref={e => this.movements = e} load={movements}/>}
                        </div>
                    </Tabs.Pane>
                </Tabs>
                {this.state.showContentJudge && <BundleLoading ref={e => this.bundleLoading = e} load={listShowModelContainer} contentType={'cheesy'}
                               showContent={this.state.showContent} contentMode={this.state.contentMode} flowList={true}/> }
            </div>
        );
    }
}

export default FlowList;

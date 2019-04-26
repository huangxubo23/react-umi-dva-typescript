/**
 * Created by 林辉 on 2018/7/10 15:00.采集奖金流量
 */
import React from 'react';
import $ from 'jquery';
import ReactChild from "../../../../../../../../../../components/lib/util/ReactChild";
import '../../../../../../../../../../components/lib/util/bootstrap-datetimepicker.min'
import '../../../../../../../../../../components/lib/util/bootstrap-datetimepicker.zh-CN'
import '../../../../../../../../../../styles/content/bootstrap-datetimepicker.min.css'
import {
    Row,
    Col,
    FormControl,
    Panel,
    ButtonGroup,
    Button,
} from 'react-bootstrap';
import {infoNoty} from "../../../../../../../../../../components/lib/util/global";
import TheSucker from "../../../../../../../../../../components/lib/util/theSucker";
import {ThousandsOfCall} from "../../../../../../../../../lib/util/ThousandsOfCall";
import {currencyNoty} from "../../../../../../../../../lib/util/Noty";
import {talentNick} from '../../../../../../../../../../components/lib/util/darenData'

class Cjinfo extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            info: []
        }
    }

    componentDidMount() {
        this.startCollection()
    }

    startCollection = () => {//采集
        if (this.props.type == 1) {
            this.infoCalback({text: '开始采集奖金', color: 'info'});
            TheSucker.getDynamic({//采集奖金
                callback: () => {
                    this.infoCalback({text: '开始采集流量', color: 'info'});
                    TheSucker.contentRank(() => {
                        this.infoCalback({text: '采集流量结束', color: 'info', accountId: this.props.accountId});
                    }, 1, this.props.accountId, true, this.props.date, this.infoCalback, this.props.talentId, this.props.accountId);
                },
                notHint: true,
                talentId: this.props.talentId,
                accountId: this.props.accountId,
                num: 15
            }, this.props.str, this.infoCalback);
        } else if (this.props.type == 2) {
            this.infoCalback({text: '开始同步审核状态', color: 'info'});
            TheSucker.exNewSynchronizationState({
                notHint: true,
                currDaren: {accountId: this.props.accountId, talentId: this.props.talentId}
            }, this.infoCalback, () => {

            });
        }

    };


    infoCalback = (infoObj) => {
        if(infoObj){
            let {info} = this.state;
            info.push(infoObj);
            this.setState({info: info}, () => {
                //$('.notyfo').scrollTop( $('.notyfo')[0].scrollHeight );
                $('.notyfo').scrollTop(999999999);//$('.notyfo').height()
            });
        }
    };

    render() {

        return <Panel header={<h3>{this.props.title}</h3>}>
            <div className='notyfo' style={{overflow: 'auto', overflowY: "scroll", height: '400px'}}>
                <div className='notyi'>
                    {this.state.info.map((text, t) => {
                        let color = text.color == 'success' ? 'green' : text.color == 'info' ? 'blue' : 'red';
                        return (
                            <div key={text.text + '_' + t} style={{color: color}}>{text.text}</div>
                        )
                    })}
                </div>

            </div>
        </Panel>

    }

}

class BonusFlowCollection extends ReactChild {
    constructor(props) {
        let date = new Date();
        date.setDate(date.getDate() - 2);
        super(props);
        let dates = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate());

        let params = this.props.match.params;
        this.state = {
            type: params.type,//1：奖金流量，2：同步审核状态
            info: [],//提示
            collectDate: dates,//采集时间
            daren_list: [],//授权达人
            daren_name: '',//登录达人名称
            daren_accountId: '',//达人id
            daren_title: '',//达人号
            currDaren: {},//当前达人数据
            nod: [],
            load: false,//授权列表是否加载完全
        }
    }

    componentDidMount() {
        $("#collectDate").datetimepicker({
            format: 'yyyy-mm-dd',
            minView: 'month',
            language: 'zh-CN',
            autoclose: true,
        }).on("changeDate", (env) => {
            let d = env.date;
            this.setState({collectDate: d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + (d.getDate())});
        }).data('datepicker');
        talentNick((user) => {
            if (user) {
                this.setState({daren_name: user.name, currDaren: user,}, () => {
                    this.daren_list();
                });
            } else {
                this.daren_list();
            }

        });

    }

    theCoverOfDarknessRequery = () => {
        let {currDaren, daren_accountId, daren, daren_list} = this.state;
        let [str, date] = ['', this.state.collectDate];
        if (date) {
            let arrDate = date.split("-");
            str = arrDate[0] + (arrDate[1].length < 2 ? "0" + arrDate[1] : arrDate[1]) + (arrDate[2].length < 2 ? "0" + arrDate[2] : arrDate[2]);
            date = arrDate[0] + "-" + (arrDate[1].length < 2 ? "0" + arrDate[1] : arrDate[1]) + "-" + (arrDate[2].length < 2 ? "0" + arrDate[2] : arrDate[2]);
        }
        /*if (currDaren.title == "微淘号·达人") {*/
        let talentId = undefined;
        let accountId = currDaren.accountId;
        let title = currDaren.name;
        let nod = [];
        if (daren_accountId == -1) {
            nod = daren_list.map((list, i) => {
                if (list.cookieUpDate && list.cookieIsFailure) {

                    talentId = '';
                    accountId = currDaren.accountId;
                    if (list.accountId != currDaren.accountId) {
                        talentId = list.id;
                        accountId = list.accountId;
                        title = list.title;
                        return <Cjinfo date={date} str={str} accountId={accountId} talentId={talentId} title={title}
                                       type={this.state.type}/>
                    }
                    //  this.startCollection(date, str, accountId, talentId);
                }
            });
            if (currDaren.title == '微淘号·达人') {
                nod.push(<Cjinfo date={date} str={str} accountId={currDaren.accountId} title={currDaren.name}
                                 type={this.state.type}/>)
            }
        } else {
            if (daren_accountId != currDaren.accountId) {
                talentId = daren.id;
                accountId = daren_accountId;
                title = daren.title;
            }

            nod.push(<Cjinfo date={date} str={str} accountId={accountId} talentId={talentId} title={title}
                             type={this.state.type}/>);

        }


        this.setState({nod: nod})

        /* }else{
             infoNoty('不是达人主账号');
         }*/
    };


    daren_list = (callback) => {//获取授权达人列表
        ThousandsOfCall.acoustic(
            {}, "requestTanleList", (msg) => {
                if (msg.success) {
                    this.setState({daren_list: msg.data, load: true}, callback);
                } else {
                    currencyNoty('获取失败', 'warning')
                }
            }
        )
    };
    daren_collectionChange = (env) => {//daren达人信息
        let id = env.target.value;
        if (!id) {
            infoNoty('请选择一个授权达人');
            return false;
        } else {
            this.setState({
                daren: id != 0 ? this.getId(id) : undefined,
                daren_accountId: id,
            });
        }

    };
    getId = (id = 0) => {//获取达人单个详情
        let {daren_list} = this.state;
        let obj = undefined;
        for (let t in daren_list) {
            if (daren_list[t].accountId == id) {
                obj = daren_list[t];
            }
        }
        return obj;
    };


    render() {
        let {daren_list, daren_accountId, daren_name, collectDate, info, currDaren, load} = this.state;
        return (
            <Panel header={<h3>{this.state.type == 1 ? '奖金流量采集' : '同步审核状态'}</h3>} bsStyle="success"
                   style={{marginTop: "10px"}}>
                <Row>
                    <Col sm={4}>
                        {this.state.type == 1 && <ButtonGroup justified style={{marginTop: "5px"}}>
                            <FormControl id="collectDate" type="text" value={collectDate} onChange={() => {
                            }}/>
                        </ButtonGroup>}

                    </Col>
                    <Col sm={4}>
                        <ButtonGroup justified style={{marginTop: "5px"}}>
                            <FormControl componentClass="select" placeholder="select"
                                         onChange={this.daren_collectionChange} disabled={load ? false : true}
                                         value={daren_accountId ? daren_accountId : ""}>
                                <option value=''>{!load ? '加载中请稍后' : '请选择授权达人'}</option>
                                <option value='-1'>采集全部账号</option>
                                {daren_name && <option value={currDaren.accountId}>{daren_name + '(当前登录号)'}</option>}
                                {(daren_list ? daren_list : []).map((item, i) => {
                                    if (item.accountId != currDaren.accountId) {
                                        return (
                                            <option value={item.accountId} key={i}
                                                    disabled={!item.cookieIsFailure}>{item.title + (item.cookieUpDate ? (item.cookieIsFailure ? '(已授权)' : "(授权失效)") : "(未授权)")}</option>
                                        )
                                    }
                                })}
                            </FormControl>
                        </ButtonGroup>

                    </Col>
                    <Col sm={4}><Button bsStyle='info' disabled={load ? false : true}
                                        onClick={this.theCoverOfDarknessRequery}
                                        block>{!load ? '加载中请稍后' : this.state.type == 1 ? '采集' : '同步'}</Button></Col>
                </Row>
                <Row>
                    {this.state.nod.map((list, i) => {
                        if (list) {
                            return (
                                <Col sm={4} key={i}>
                                    <div style={{marginTop: "20px"}}>{list}</div>
                                </Col>
                            )
                        }
                    })}
                </Row>
            </Panel>
        )
    }
}

export default BonusFlowCollection;
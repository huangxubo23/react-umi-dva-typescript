import ChannelCascader from "../channelCascader/channelCascader";

/**
 * Created by 林辉 on 2018/10/10 14:25.活动投稿选择
 */
import React from 'react';
import $ from 'jquery';
import {ajax} from '../../../../../../../../../../../lib/util/ajax';
import {Select, AutoComplete, Input, Message} from 'element-react';
import 'element-theme-default';
import {PersonSelection} from "../../../../../../../../../components/PersonSelection";
import {ThousandsOfCall} from "../../../../../../../../../../../lib/util/ThousandsOfCall";


class ChannelSelection extends React.Component {//新员工搜索
    constructor(props) {
        super(props);
        this.state = {
            restaurants: [],
            value: '',
            num: 1
        }
    }

    componentDidMount() {//初始化
        let {prompt} = this.props;
        this.setState({value: prompt ? prompt : ''}, () => {
            this.getGovernmentManages();
        });
    }

    getGovernmentManages = (now = 1, callback, columnName = '') => {//分页式获取活动投稿ajax
        let {prompt,talentId} = this.props;
        let dt = {
            agreement: "https",
            hostname: "contents.taobao.com",
            path: '/api2/activity/activity_list.json',
            method: "get",
            data: {q: columnName,current:now,pageSize:8},
            talentId:talentId,
            referer: "https://we.taobao.com/",
        };
        ThousandsOfCall.acoustic(dt, 'requestRelyAgentTB', (json) => {
            if (json.success) {
                let res = JSON.parse(json.data);
                if (res.status === 'SUCCESS') {
                    let data = res.data;
                    let arr = [], arr2 = [];
                    if (!prompt) {
                        arr.push({id: 0, value: '全部'});
                    }
                    if (data.current > 1) {
                        arr.push({id: -1, value: '上一页'});
                    }
                    let arr1 = data.itemList.map((item) => {
                        return {id: item.id, value: item.name}
                    });
                    if (data.current < (Math.floor((data.total - 1) / data.pageSize) + 1)) {
                        arr2.push({id: -2, value: '下一页'});
                    }
                    this.setState({
                        restaurants: [...arr, ...arr1, ...arr2], governmentManage: data
                    }, () => {
                        if (callback && typeof callback == 'function') {
                            callback();
                        }
                    });
                } else {
                    Message.error(res.message);
                }
            }
        });
    };

    activityList = (columnName = '', callback) => {//搜索获取活动投稿
        let {type, pe} = this.props;
        let data = {
            agreement: "https",
            hostname: "contents.taobao.com",
            path: '/api2/activity/activity_list.json',
            method: "get",
            data: {q: columnName,current:1,pageSize:8},
            talentId: this.state.talentId,
            referer: "https://we.taobao.com/",
        };
        ThousandsOfCall.acoustic(dt, 'requestRelyAgentTB', (json) => {
            if (json.success) {
                let res = JSON.parse(json.data);
                if (res.status === 'SUCCESS') {
                    let itemList = res.data.itemList;

                } else {
                    Message.error(res.message);
                }
            }
        });

        Ajax({
            url: '/user/admin/user/queryManageList.io',
            data: {
                q: columnName,
                current: 1,
                pageSize: 66,
            },
            isCloseMask: true,
            callback: (data) => {
                if (data.talent.length < 1) {
                    Message({
                        message: '查无此人',
                        type: 'warning'
                    });
                    callback();
                } else {
                    PersonSelection.setManages(data.talent);
                    let list = data.talent.map((item) => {
                        return {id: item.id, value: item.name}
                    });
                    this.setState({restaurants: list, governmentManage: data}, () => {
                        if (callback && typeof callback == 'function') {
                            callback();
                        }
                    });
                }
            },
            error: () => {
                callback();
            }
        });
    };

    querySearchAsync(queryString) {
        this.setState({value: queryString});
    }

    handleSelect(data) {
        let {prompt} = this.props;
        if (data.id == -1) {
            this.setState({value: prompt ? prompt : '', num: this.state.governmentManage.current - 1}, () => {
                this.getGovernmentManages(this.state.governmentManage.current - 1, () => {
                    let {classNum} = this.props;
                    $(`.my-el-autocomplete${classNum}`).find("input").focus();
                });
            });
        } else if (data.id == -2) {
            this.setState({value: prompt ? prompt : '', num: this.state.governmentManage.current + 1}, () => {
                this.getGovernmentManages(this.state.governmentManage.current + 1, () => {
                    let {classNum} = this.props;
                    $(`.my-el-autocomplete${classNum}`).find("input").focus();
                });
            });
        } else {
            this.setState({value: data.value}, () => {
                if (prompt) {
                    this.setState({value: prompt}, () => {
                        this.props.callback(data.id);
                    });
                } else {
                    this.props.callback(data.id);
                }
            });
        }
    }

    handleIconClick() {
        if (this.state.value) {
            this.getGovernmentManageSearch(this.state.value, () => {
                let {classNum} = this.props;
                $(`.my-el-autocomplete${classNum}`).find("input").focus();
            });
        } else {
            this.getGovernmentManages(1, () => {
                let {classNum} = this.props;
                $(`.my-el-autocomplete${classNum}`).find("input").focus();
            });
        }
    };

    render() {
        let {value} = this.state, {classNum, style} = this.props;

        return (
            <MyAutoComplete ref={e => this.myAutoComplete = e} data={this.state.restaurants} style={style}
                            placeholder="活动关键词" value={value} className='auto'
                            fetchSuggestions={this.querySearchAsync.bind(this)} icon="search" classNum={classNum}
                            select={this.handleSelect.bind(this)} iconClick={this.handleIconClick.bind(this)}/>

        )
    }
}



class MyAutoComplete extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            mouse: true,
        }
    }

    componentDidMount() {
        let {classNum} = this.props;
        $(`.my-el-autocomplete${classNum}`).find("input").focus(() => {
            this.setState({open: true})
        }).blur(() => {
            if (this.state.mouse) {
                this.setState({open: false})
            }
        });
        $(".el-autocomplete-suggestion").mouseover(() => {
            this.setState({mouse: false})
        }).mouseout(() => {
            this.setState({mouse: true})
        });
    }

    handleIconClick=()=>{

    };

    subValue = (env) => {
        let {data, select} = this.props;
        let id = $(env.target).data('id');
        let value = this.getId(data, id);
        this.setState({open: false}, () => {
            select(value);
        });
    };
    handleChange = (value) => {
        this.props.fetchSuggestions(value);
    };


    render() {
        let {data, icon, placeholder, value, classNum, style} = this.props;
        let {open} = this.state;
        console.log('data',data);
        return (
            <div className={`el-autocomplete my-el-autocomplete${classNum}`} style={style}>
                <Input icon={icon} placeholder={placeholder} value={value} onIconClick={this.handleIconClick}
                       onChange={this.handleChange}/>
                <div className='el-autocomplete-suggestion' style={{
                    zIndex: 1,
                    width: '100%',
                    position: 'absolute',
                    top: classNum != 1 ? ((data ? data : []).length > 6 ? '-270px' : `${((data ? data : []).length * (-36)) - 22}px`) : '36px',
                    left: '0px',
                    display: open ? 'inline' : 'none'
                }}>
                    <div className='el-scrollbar'>
                        <div className='el-autocomplete-suggestion__wrap el-scrollbar__wrap'
                             style={{marginRight: '-17px', marginBottom: '-17px'}}>
                            <div className='el-scrollbar__view el-autocomplete-suggestion__list'
                                 style={{position: 'relative'}}>
                                {/*<div className='resize-triggers'>
                                    <div className='expand-trigger'>
                                        <div style={{width: '179px', height: '1729px'}}>

                                        </div>
                                    </div>
                                    <div className='contract-trigger'>

                                    </div>
                                </div>*/}
                                {(data ? data : []).map(item => <li key={item.id} onClick={this.subValue}
                                                                    data-id={item.id}
                                                                    style={{color: (item.id == -1 || item.id == -2) ? "red" : "black"}}>{item.value}</li>)}
                                <div className='el-scrollbar__bar is-horizontal'>
                                    <div className='el-scrollbar__thumb' style={{transform: 'translateX(0%)'}}>

                                    </div>
                                </div>
                                <div className='el-scrollbar__bar is-vertical'>
                                    <div className='el-scrollbar__thumb' style={{
                                        transform: 'translateY(0%)'
                                    }}>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default ChannelSelection;
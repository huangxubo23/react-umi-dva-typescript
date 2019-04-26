/**
 * Created by shiying on 18-1-26.人员搜索
 */

//require("../../../../styles/component/react_assembly/listContent.css");
import React from 'react';
import $ from 'jquery';
import {ajax} from '../../../lib/util/ajax';
// import {
//     DropdownButton,
//     MenuItem,
//     Button,
//     InputGroup,
//     FormControl
// } from "react-bootstrap";
import {currencyNoty} from '../../../lib/util/Noty'
import {Select, AutoComplete, Input, Message} from 'element-react';
import 'element-theme-default';
import {ThousandsOfCall} from "../../../lib/util/ThousandsOfCall";

const Ajax = ajax.ajax;

class PersonSelection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            governmentManage: {
                talent: [],
                count: 100,
                pageNow: 1,
                pageSize: 20
            },
            manageId: "",//搜索id
            judge: true,//限制调用
            search: {
                go: false,//要不要搜索
                searchName: "",//搜索名
                searchArr: [],//搜索留得数组
                fuzzyArr: false,//搜索留得数组判断
            },
        }
    }

    componentDidMount() {
        this.getGovernmentManages();
    }

    componentDidUpdate() {
        if ($('.nextCss').length) {
            $('.nextCss').one("click", (e) => {//下一页,调用一次后解绑=>$('').one()
                e.stopPropagation();
                if (this.state.judge) {
                    this.setState({judge: false});
                    let n = setInterval(() => {
                        clearInterval(n);
                        this.nextPage();
                    }, 500);
                }
            });
        }
        if ($('.previousCss').length) {
            $('.previousCss').one("click", (e) => {//上一页,调用一次后解绑=>$('').one()
                e.stopPropagation();
                if (this.state.judge) {
                    this.setState({judge: false});
                    let n = setInterval(() => {
                        clearInterval(n);
                        this.previousPage();
                    }, 500);
                }
            });
        }
    }

    getGovernmentManages = (now = 1) => {//获取分页用户ajax
        Ajax({
            url: '/user/admin/user/queryManageList.io',
            data: {
                name: '',
                pageNow: now,
                pageSize: 20,
                type: this.props.type,
                pe: this.props.pe ? this.props.pe : ''
            },
            isCloseMask: true,
            callback: (data) => {
                PersonSelection.setManages(data.talent);
                this.setState({governmentManage: data, judge: true});
            }
        });
    };
    getGovernmentManageSearch = (name = '') => {//获取搜索用户ajax
        let {search, pe} = this.state;
        let {type} = this.props;
        Ajax({
            url: '/user/admin/user/queryManageList.io',
            data: {
                name: name,
                pageNow: 1,
                pageSize: 66,
                type: type,
                pe: pe ? pe : ''
            },
            isCloseMask: true,
            callback: (data) => {
                if (data.talent.length < 1) {
                    currencyNoty("查无此人", "warning");
                } else if (data.talent.length == 1) {
                    search.go = false;
                    PersonSelection.setManages(data.talent);
                    this.setState({search: search}, () => {
                        this.props.callback(data.talent[0].id);
                    });
                } else {
                    PersonSelection.setManages(data.talent);
                    search.searchArr = data.talent;
                    search.fuzzyArr = true;
                    this.setState({search: search});
                }
            }
        });
    };

    selectManage = (eventKey) => {//选中
        this.setState({manageId: eventKey}, () => {
            this.props.callback(eventKey);
        });
    };

    previousPage = () => {//上一页
        let {governmentManage} = this.state;
        this.getGovernmentManages(governmentManage.pageNow - 1);
    };

    nextPage = () => {//下一页
        let {governmentManage} = this.state;
        this.getGovernmentManages(governmentManage.pageNow + 1);
    };

    goSearch = () => {//去搜
        let {search} = this.state;
        search.go = true;
        this.setState({search: search});
    };

    searchChange = (env) => {//搜索名改变
        let [{search}, value] = [this.state, env.target.value];
        search.searchName = value;
        this.setState({search: search});
    };

    search = () => {//搜
        let {search} = this.state;
        this.getGovernmentManageSearch(search.searchName);
    };

    fuzzySelect = (eventKey) => {//搜索后数组
        let {search} = this.state;
        Object.assign(search, {
            go: false,
            fuzzyArr: false
        });
        this.setState({search: search, manageId: eventKey}, () => {
            this.props.callback(eventKey);
        });
    };

    render() {
        let {governmentManage, search, manageId} = this.state;
        let {nameDisplay, prompt, css, manageProp} = this.props;
        let manage = manageProp ? manageProp : manageId;
        let FullName = "全部";
        {
            governmentManage.talent.map((item) => {
                if (item.id == manage) {
                    FullName = item.name;
                }
            })
        }
        {
            search.searchArr.map((item) => {
                if (item.id == manage) {
                    FullName = item.name;
                }
            })
        }
        return (
            <div style={{display: "inline", margin: (css ? "0 5px" : "0")}}>
                {/*{!search.fuzzyArr && (!search.go ? <React.Fragment>
                    <DropdownButton key="qb" title={nameDisplay ? FullName : prompt} onSelect={this.selectManage}
                                    id="bg-nested-dropdown" style={{fontSize: '16px'}}>
                        {nameDisplay && <MenuItem eventKey={0}> 全部</MenuItem>}
                        {governmentManage.pageNow != 1 &&
                        <MenuItem eventKey={-1} className="previousCss" href='javascript:void(0);'><span
                            style={{color: "red"}}>上一页</span></MenuItem>}
                        {governmentManage.talent.map((item, i) => {
                            return (
                                <MenuItem eventKey={item.id} key={item.id}
                                          href='javascript:void(0);'>{item.name}</MenuItem>
                            );
                        })}
                        {governmentManage.pageNow < (Math.floor((governmentManage.count - 1) / governmentManage.pageSize) + 1) &&
                        <MenuItem eventKey={-2} className="nextCss" href='javascript:void(0);'><span
                            style={{color: "red"}}>下一页</span></MenuItem>}
                    </DropdownButton>
                    <Button key="ss" bsStyle="primary" onClick={this.goSearch} bsSize="small"
                            style={{fontSize: '16px', marginLeft: '3px'}}>搜</Button>
                </React.Fragment> : <InputGroup style={{width: "180px"}}>
                    <FormControl type="text" value={search.searchName} onChange={this.searchChange}/>
                    <InputGroup.Button>
                        <Button bsStyle="success" onClick={this.search}>搜</Button>
                        <Button bsStyle="danger" onClick={() => {
                            search.go = false;
                            this.setState({search: search});
                        }}>退</Button>
                    </InputGroup.Button>
                </InputGroup>)}
                {search.fuzzyArr && <React.Fragment>
                    <DropdownButton key="xz" title="选择一个用户" onSelect={this.fuzzySelect}
                                    id="bg-nested-dropdown">
                        {(search.searchArr ? search.searchArr : []).map((item, i) => {
                            return (
                                <MenuItem eventKey={item.id} key={item.id + "-" + i}
                                          href='javascript:void(0);'>{item.name}</MenuItem>
                            );
                        })}
                    </DropdownButton>
                    <Button key="th" bsStyle="danger" onClick={() => {
                        search.fuzzyArr = false;
                        this.setState({search: search});
                    }}>退</Button>
                </React.Fragment>}*/}
            </div>
        )
    }

    static manages = {};
    static zzjx = [];

    static setManages = (ms) => {
        for (let i in ms) {
            PersonSelection.manages[ms[i].id + ""] = ms[i];
        }
    };

    static setManage = (m) => {
        PersonSelection.manages[m.id + ""] = m;
    };

    static getManage = (id, callback) => {
        let m = PersonSelection.manages[id + ""];
        if (m) {
            return m;
        } else {
            if (PersonSelection.zzjx.indexOf(id) < 0) {
                PersonSelection.zzjx.push(id);
                Ajax({
                    type: 'post',
                    url: '/user/admin/user/user.manage.info.io',
                    data: {id: id},
                    isCloseMask: true,
                    callback: (json) => {
                        PersonSelection.setManage(json);
                        callback(json);
                    }
                });
            }
        }
    };
    static getManageList = (arr, callback) => {
        Ajax({
            type: 'post',
            url: '/user/admin/user/queryManageListByStrIds.io',
            data: {ids: arr.join()},
            isCloseMask: true,
            callback: (json) => {
                callback(json);
            }
        });
    }
}

class NewPersonSelection extends React.Component {//新员工搜索
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

    getGovernmentManages = (now = 1, callback, name = '') => {//分页式获取用户ajax
        let {type, pe, prompt,isWhole} = this.props;
        Ajax({
            url: '/user/admin/user/queryManageList.io',
            data: {
                name: name,
                pageNow: now,
                pageSize: 20,
                type: type,
                pe: pe ? pe : ''
            },
            isCloseMask: true,
            callback: (data) => {
                PersonSelection.setManages(data.talent);
                let arr = [], arr2 = [];
                if (!prompt&&!isWhole) {
                    arr.push({id: 0, value: '全部'});
                }
                if (data.pageNow > 1) {
                    arr.push({id: -1, value: '上一页'});
                }
                let arr1 = data.talent.map((item) => {
                    return {id: item.id, value: item.name}
                });
                if (data.pageNow < (Math.floor((data.count - 1) / data.pageSize) + 1)) {
                    arr2.push({id: -2, value: '下一页'});
                }
                this.setState({
                    restaurants: [...arr, ...arr1, ...arr2], governmentManage: data
                }, () => {
                    if (callback && typeof callback == 'function') {
                        callback();
                    }
                });
            }
        });
    };

    getGovernmentManageSearch = (name = '', callback) => {//搜索获取用户ajax
        let {type, pe} = this.props;
        Ajax({
            url: '/user/admin/user/queryManageList.io',
            data: {
                name: name,
                pageNow: 1,
                pageSize: 66,
                type: type,
                pe: pe ? pe : ''
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
            this.setState({value: prompt ? prompt : '', num: this.state.governmentManage.pageNow - 1}, () => {
                this.getGovernmentManages(this.state.governmentManage.pageNow - 1, () => {
                    let {classNum} = this.props;
                    $(`.my-el-autocomplete${classNum}`).find("input").focus();
                });
            });
        } else if (data.id == -2) {
            this.setState({value: prompt ? prompt : '', num: this.state.governmentManage.pageNow + 1}, () => {
                this.getGovernmentManages(this.state.governmentManage.pageNow + 1, () => {
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
                                placeholder="可输入用户搜索(默认全部)" value={value} className='auto'
                                fetchSuggestions={this.querySearchAsync.bind(this)} icon="search" classNum={classNum}
                                select={this.handleSelect.bind(this)} iconClick={this.handleIconClick.bind(this)}/>

        )
    }
}


class InvitationActivities extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            restaurants: [],
            value: '',
            q: '',
        }
    }

    darenChangeTake = () => {//初始化
        if(this.props.getInvitationActvities){
            this.props.getInvitationActvities({current: 1},(data)=>{
                this.setState(data);
            });
        }else{
            this.getInvitationActvities({current: 1});
        }

    };

    getInvitationActvities = ({current = 1, q = ''}, callback) => {
        let {darenId} = this.props, str = '';
        let dt = {
            agreement: "https",
            hostname: "contents.taobao.com",
            path: '/api2/activity/activity_list.json',
            method: "get",
            data: {
                current: current,
                pageSize: 8,
                __version__: 3.0,
                promotionType: '',
                appKey: '',
                orderType: 2,
                q: q
            },
            referer: "https://we.taobao.com/",
        };
        if (darenId) {
            Object.assign(dt, {talentId: darenId});
            str = 'requestRelyAgentTB';
        } else {
            str = 'requestRelyTB';
        }

        ThousandsOfCall.acoustic(dt, str, (json) => {
            if (json.success) {
                let res = JSON.parse(json.data);
                if (res.status === 'SUCCESS') {
                    let itemList = res.data.itemList;
                    let arr = [], arr1 = [], arr2 = [];
                    if (res.data.current > 1) {
                        arr.push({id: -1, value: '上一页'});
                    }
                    itemList.map((item) => {
                        arr1.push({id: item.id, value: item.name});
                    });
                    if (res.data.current < (Math.floor((res.data.total - 1) / res.data.pageSize) + 1)) {
                        arr2.push({id: -2, value: '下一页'});
                    }
                    this.setState({restaurants:[...arr, ...arr1, ...arr2],activitiesList: res.data}, () => {
                        if (callback && typeof callback == 'function') {
                            callback();
                        }
                    })
                }else{
                    Message.error(res.message);
                }
            }
        });
    };

    handleSelect(data) {
        let {activitiesList, q} = this.state;
        let current=activitiesList.current;
        if (data.id == -1||data.id == -2) {
            current=data.id == -1?current-1:current+1;
            let getInvitationActvities = this.props.getInvitationActvities ? this.props.getInvitationActvities : this.getInvitationActvities;
            getInvitationActvities({current:current, q}, (da) => {
                this.setState(da,()=>{
                    let {classNum} = this.props;
                    $(`.my-el-autocomplete${classNum}`).find("input").focus();
                });

            });
        } else {
            this.setState({value: data.value}, () => this.props.callback(data.id,data.value));
        }
    }

    querySearchAsync(queryString){
        this.setState({value: queryString});
    }

    handleIconClick() {
        let {value} = this.state;
        this.setState({q: value}, () => {

            let getInvitationActvities = this.props.getInvitationActvities ? this.props.getInvitationActvities : this.getInvitationActvities;
            getInvitationActvities({current: 1, q: value}, (dataList) => {
                this.setState(dataList, () => {
                    let {classNum} = this.props;
                    $(`.my-el-autocomplete${classNum}`).find("input").focus();
                });

            });
        })
    }

    render(){
        let {value,restaurants} = this.state,{style,classNum} = this.props;
        return(
            <MyAutoComplete ref={e => this.myAutoComplete = e} data={restaurants} style={style}
                            placeholder="可输入邀请渠道搜索" value={value} className='auto'
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
            this.setState({open: true},()=>{
                $('#keySearch').on('keyup',(event)=>{
                    if(event.keyCode==13){
                        this.props.iconClick();
                    }
                })
            })
        }).blur(() => {
            if (this.state.mouse) {
                this.setState({open: false});
            }
        });
        $(".el-autocomplete-suggestion").mouseover(() => {
            this.setState({mouse: false})
        }).mouseout(() => {
            this.setState({mouse: true})
        });
    }

    handleChange(value) {
        this.props.fetchSuggestions(value);
    }

    handleIconClick() {
        this.props.iconClick();
    }

    subValue(env) {
        let {data, select} = this.props;
        let id = $(env.target).data('id');
        let value = this.getId(data, id);
        this.setState({open: false}, () => {
            select(value);
        });
    }

    getId = (data, id, obj = {}) => {
        for (let d in data) {
            if (data[d].id == id) {
                obj = data[d];
            }
        }
        return obj;
    };

    render() {
        let {data, icon, placeholder, value, classNum,style} = this.props;
        let {open} = this.state;
        return (
            <div className={`el-autocomplete my-el-autocomplete${classNum}`} style={style}>
                <Input icon={icon} placeholder={placeholder} value={value} onIconClick={this.handleIconClick.bind(this)}
                       onChange={this.handleChange.bind(this)} id='keySearch'/>
                <div className='el-autocomplete-suggestion' style={{
                    zIndex: 1,
                    width: '100%',
                    position: 'absolute',
                    top: classNum!=1?((data ? data : []).length>6?'-270px':`${((data ? data : []).length*(-36))-22}px`):'36px',
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
                                {(data ? data : []).map(item => <li key={item.id} onClick={this.subValue.bind(this)}
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

export {PersonSelection, NewPersonSelection,MyAutoComplete,InvitationActivities};

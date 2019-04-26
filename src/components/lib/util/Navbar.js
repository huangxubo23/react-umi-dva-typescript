/**
 * Created by linhui on 18-1-13.左边导航栏　
 */

import wzg from '../../../images/index/wzg.png';
require('../../../styles/component/util/navbar.css');
import React from 'react';
import AJAX from '../newUtil/AJAX';
import './jquery-ui.min';
import {Link, Switch, Route} from 'react-router-dom';
import {Layout, Menu, Button} from 'element-react';
import './element-theme-wzg';

class NewNavbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            permission: [],
            currentLoggedIn: '',//当前登录人
            activeKey: '',
        }
    }

    componentDidMount() {

    }

    componentWillReceiveProps = () => {
        this.currNavbar();
    };

    currNavbar = () => {//当前导航栏所在位置
        let [permission, url, dai, xiaoy,] = [this.state.permission, this.props.state, '', ''];

        if (!url) {
            url = window.location.href;
        }
        let localhsot = url.split(this.props.matchPath)[1];
        localhsot = localhsot.split() + '.html';
        outerloop:
            for (let i = 0; i < permission.length; i++) {
                let xiao = permission[i].xiao && permission[i].xiao.length > 0 ? permission[i].xiao : [];
                for (let y = 0; y < xiao.length; y++) {
                    if (localhsot == xiao[y].page) {
                        dai = i;
                        xiaoy = y;
                        break outerloop;
                    }
                }
            }
        this.setState({activeKey: dai, url2: localhsot});

    };

    getPermissionsHead = () => {//导航栏内容
        if (this.navBarAjax) {
            this.navBarAjax.ajax({
                url: "/user/visible/permissionsHeads.io",
                data: {},
                callback: (data) => {
                    this.setState({permission: data}, () => {
                        this.currNavbar();
                    });
                }
            });
        }
    };

    onOpen = (index, indexPath) => {
        this.setState({activeKey: index});
    };
    iconChange = (title) => {//图标样式
        let icon = 'el-icon-message';
        switch (title) {
            case '首页':
                icon = 'el-icon-wzg-homepage_fill';
                break;
            case '内容列表':
                icon = 'el-icon-wzg-document_fill';
                break;
            case '创建内容':
                icon = 'el-icon-wzg-brush_fill';
                break;
            case '分组内容':
                icon = 'el-icon-wzg-group_fill';
                break;
            case '赏金任务':
                icon = 'el-icon-wzg-transaction_fill';
                break;
            case '工具':
                icon = 'el-icon-wzg-decoration_fill';
                break;
            case '统计':
                icon = 'el-icon-wzg-text';
                break;
            case '论坛':
                icon = 'el-icon-wzg-stealth_fill';
                break;
            case '用户中心':
                icon = 'el-icon-wzg-people_fill';
                break;
            case '网站设置':
                icon = 'el-icon-wzg-setup_fill';
                break;
        }
        return icon;
    };

    render() {
        let [permission, url, dai, xiaoy] = [this.state.permission, this.props.state, '', ''];

        if (!url) {
            url = window.location.href;
        }
        let localhsot = url.split(this.props.matchPath)[1];
        localhsot = localhsot.split() + '.html';
        for (let i = 0; i < permission.length; i++) {
            let xiao = permission[i].xiao && permission[i].xiao.length > 0 ? permission[i].xiao : [];
            for (let y = 0; y < xiao.length; y++) {
                if (localhsot == xiao[y].page) {
                    dai = i;
                    xiaoy = y;
                }
            }
        }
        console.log('this.state.permission',this.state.permission);
        return (
            <AJAX ref={e => this.navBarAjax = e}>
                <div className="barGradients" style={{minHeight: '98%'}}>
                    <img src={wzg} style={{width: "100px", height: '50px'}}/>
                    {this.props.loginManage.name && <div id="avatar">
                        <img src={this.props.loginManage.portrait} className="img-circle" alt="头像" width="120"
                             height="120"/>
                    </div>}
                    <div id="nick">
                        {(!this.props.loginManage.name) &&
                        <img src='http://assets.alicdn.com/apps/mytaobao/3.0/profile/defaultAvatar/avatar-160.png'
                             className="img-circle" alt="头像" width="120"
                             height="120"/>}
                        {this.props.isLogin == true ? <h5>您好!<span className="red">
                        {this.props.loginManage.name ? this.props.loginManage.name : ''}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <a className="red"
                                   href={"/user/pcManageLogout.htm?redirect=" + window.location.origin + "/pc/"}>退出</a>
                            </h5> :
                            <h5>请您先登录</h5>
                        }
                    </div>
                    <br/>
                    <div className='menuleft'>
                        <Layout.Row className="tac">
                            <Layout.Col span={24}>
                                <Menu defaultActive={this.state.activeKey + ""} uniqueOpened
                                      className={this.state.activeKey ? 'el-menu-vertical-demo nabTitle' : 'el-menu-vertical-demo titleColor'}
                                      onOpen={this.onOpen}>
                                    {this.state.permission.length > 0 ? this.state.permission.map((item, i) => {
                                        return (
                                            <Menu.SubMenu key={i + ""} index={i + ""}
                                                          className={this.state.activeKey == i ? "nabTitle" : "titleColor"}
                                                          title={<span><i
                                                              className={this.iconChange(item.title)}></i>{item.title}</span>}>
                                                {(item.xiao ? item.xiao : []).map((tem, y) => {
                                                    if (tem.supManage != 7) {
                                                        if(tem.page.indexOf('add')>-1||tem.page.indexOf('content_template')>-1){
                                                            return(
                                                                <Menu.Item key={y} index={i + "-" + y} className="xiaoTitle" data-title={tem.page}>
                                                                    <a className={this.state.url2 == tem.page ? "liXiaoTitleB" : "liXiaoTitleA"}
                                                                        onClick={()=>{
                                                                            window.open(`${window.location.origin}/pc/admin${tem.page.split(".html")[0]}`);
                                                                        }}>{tem.title}</a>
                                                                </Menu.Item>
                                                            )
                                                        }else {
                                                            return (
                                                                <Menu.Item key={y} index={i + "-" + y} className="xiaoTitle"
                                                                           data-title={tem.page}>
                                                                    <Link
                                                                        className={this.state.url2 == tem.page ? "liXiaoTitleB" : "liXiaoTitleA"}
                                                                        to={"/pc/admin" + tem.page.split(".html")[0]}>{tem.title}</Link>
                                                                </Menu.Item>
                                                            )
                                                        }
                                                    } else {
                                                        return (
                                                            <div key={y} className="hrLine"/>
                                                        )
                                                    }
                                                })}
                                            </Menu.SubMenu>
                                        )
                                    }) : <Menu.SubMenu index='1' className="titleColor" title={<span>首页</span>}>
                                        <Link className="liXiaoTitleA" to='/admin/index'>首页</Link>
                                    </Menu.SubMenu>}
                                </Menu>
                            </Layout.Col>
                        </Layout.Row>
                    </div>

                </div>
            </AJAX>

        )
    }
}

export default NewNavbar;

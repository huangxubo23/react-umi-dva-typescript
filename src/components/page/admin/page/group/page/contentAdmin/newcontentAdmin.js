/**
 * Created by 薛荣晖 on 2019/1/3 0003下午 2:33.小组内容管理
 */

import React from "react";
import AJAX from '../../../../../../lib/newUtil/AJAX';
import NewPanel from '../../../../../../lib/util/elementsPanel';
import {Button, Layout, Message, Pagination, Tag} from "element-react";
import ReactChild from "../../../../../../lib/util/ReactChild";
import 'element-theme-default';
import {getManage} from '../../../../../../../components/lib/util/global';
require('../../../../../../../styles/group/contentAdmin.css');

class ContentAdmin extends ReactChild {
    constructor(props) {
        super(props);
        this.state = {
            pageNow: 1,
            pageSize: 15,
            count: 0,
            manageList: [],//小组内容数据
            loginManage: '',
        }
    }

    componentDidMount() {
        getManage((data) => {
            this.setState({loginManage: data?data:''},this.goPageNow(1))
        });
    }

    forManageList = (index, json) => {
        let {manageList} = json;
        if (manageList.length > index) {
            if (manageList[index].process) {
                this.ContentAdminAjax.ajax({
                    type: 'post',
                    url: '/content/admin/manageGroup/queryLargeProcessByIdCount.io',//步骤总数
                    data: {groupId: manageList[index].id, contentModeId: 0},
                    isCloseMask: true,
                    callback: (json21) => {
                        let {isProcessStrCompleteCount,count}=json21[0];
                        Object.assign(manageList[index],{
                            strCompleteContent:isProcessStrCompleteCount?isProcessStrCompleteCount:0,
                            smallProcessList:count
                        });
                        this.setState({manageList},this.forManageList(++index, json));
                    }
                });
            } else {
                this.forManageList(++index, json);
            }
        } else {
            Message({
                message: '小组步骤数据获取完成',
                type: 'success'
            });
        }
    };

    queryGroupList = (data) => {//拿取小组列表数据
        this.ContentAdminAjax.ajax({
            type: 'post',
            url: '/user/admin/group/queryGroupList.io',
            data: data,
            isCloseMask: true,
            callback: (json) => {
                let i = 0;
                this.setState(json, () => {
                    this.forManageList(i, json);
                });
            }
        });
    };

    toPageSize = (size) => {//每页个数
        let {pageNow,pageSize} = this.state;
        this.queryGroupList({pageSize:size ? size : pageSize, pageNow});
    };

    goPageNow = (now) => {//跳转页
        let {pageSize,pageNow} = this.state;
        this.queryGroupList({pageSize, pageNow:now?now:pageNow});
    };

    isHideGroup = (i) => {//隐藏显示小组
        let data = this.state.manageList[i];
        let isHide = false;
        if (data.isHide) {
            isHide = false;
        } else {
            isHide = true;
        }
        this.ContentAdminAjax.ajax({
            type: 'post',
            url: '/user/admin/group/addGroupIsHide.io',
            data: {groupId: data.id, isHide: isHide},
            callback: () => {
                Message({
                    message: isHide?'隐藏成功':'显示成功',
                    type: 'success'
                });
                this.goPageNow();
            }
        });
    };

    render() {
        let {pageNow, pageSize, count, manageList, loginManage} = this.state;
        let grade = loginManage && loginManage.loginManage ? loginManage.loginManage.grade : '';
        return (
            <AJAX ref={e => this.ContentAdminAjax = e}>
                <div>
                    <NewPanel header='分组内容管理' backgroundColor='#dff0d8' color='#3c763d' bodyBorderColor='#d6e9c6' titleBorderColor='#d6e9c6'>
                        <Layout.Row gutter='20'>
                            {(manageList ? manageList : []).map((item, i) => {
                                return (
                                    <div key={item.id} style={{margin: '12px'}}>
                                        <Layout.Col lg='8' md='12'>
                                            <NewPanel header={<span style={{fontSize: '14px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden'}}>{item.name + (item.isHide ? "(小组已被隐藏，组员不可见)" : "")}</span>}
                                                      backgroundColor={item.isHide ? '#f2dede' : '#d9edf7'}
                                                      color={item.isHide ? '#a94442' : '#31708f'}
                                                      bodyBorderColor={item.isHide ? '#ebccd1' : '#bce8f1'}
                                                      titleBorderColor={item.isHide ? '#ebccd1' : '#bce8f1'}>
                                                <div>
                                                    <Layout.Row>
                                                        <Layout.Col span='10'>
                                                            <div style={{width: "120px", marginLeft: '10px', marginTop: '10px'}}>
                                                                <img className="imgFloat"
                                                                     style={{width: '120px', height: '120px'}}
                                                                     src='http://assets.alicdn.com/apps/mytaobao/3.0/profile/defaultAvatar/avatar-160.png'/>
                                                            </div>
                                                        </Layout.Col>
                                                        <Layout.Col span='14'>
                                                            <Layout.Row gutter='10'>
                                                                {(item.smallProcessList ? item.smallProcessList : []).map(smallProcess => {
                                                                    let type = undefined,sorting = smallProcess.sorting;
                                                                    if (sorting > 8) {
                                                                        sorting = sorting % 8;
                                                                    }
                                                                    switch (sorting) {
                                                                        case 0 :
                                                                            break;
                                                                        case 1 :
                                                                            type = "warning";
                                                                            break;
                                                                        case 2 :
                                                                            type = "danger";
                                                                            break;
                                                                        case 3 :
                                                                            type = "primary";
                                                                            break;
                                                                        case 4 :
                                                                            type = "success";
                                                                            break;
                                                                        case 5 :
                                                                            type = "info";
                                                                            break;
                                                                        case 7 :
                                                                            break;
                                                                        case 8 :
                                                                            type = "primary";
                                                                            break;
                                                                    }
                                                                    return (
                                                                        <Layout.Col span='8' key={smallProcess.id}>
                                                                            <div className="positionRelative">
                                                                                <Tag type={type} style={{marginTop: '15px'}}>
                                                                                    {smallProcess.name + '(' + smallProcess.count.count + ')'}
                                                                                </Tag>
                                                                            </div>
                                                                        </Layout.Col>
                                                                    )
                                                                })}
                                                            </Layout.Row>
                                                            <div style={{marginTop: '20px'}} className="positionRelative">
                                                                <Layout.Row>
                                                                    <Layout.Col span='11'>
                                                                        <Tag>
                                                                            小组已完成({item.strCompleteContent})
                                                                        </Tag>
                                                                    </Layout.Col>
                                                                </Layout.Row>
                                                            </div>
                                                        </Layout.Col>
                                                    </Layout.Row>
                                                </div>
                                                <div style={{marginTop: '20px'}}>
                                                    <Layout.Row>
                                                        <Layout.Col span='8'>
                                                            <Button onClick={() => {
                                                                let href = (window.location.origin + '/pc/adm/content/groupList/manageGroup/' + item.id);
                                                                window.open(href);
                                                            }} target="_blank" plain={true} type="info">内容列表</Button>
                                                        </Layout.Col>
                                                        <Layout.Col span='8'>
                                                            <Button onClick={() => {
                                                                let href = (window.location.origin + '/pc/adm/content/groupAdd/manageGroup/' + item.id);
                                                                window.open(href);
                                                            }} target="_blank" plain={true} type="success">创建内容</Button>
                                                        </Layout.Col>
                                                        <Layout.Col span='8'>
                                                            {grade === 0 &&
                                                            <Button onClick={() => {
                                                                this.isHideGroup(i)
                                                            }} plain={true} type="warning">{item.isHide ? '显示该小组' : '隐藏该小组'}</Button>}
                                                        </Layout.Col>
                                                    </Layout.Row>
                                                </div>
                                            </NewPanel>
                                        </Layout.Col>
                                    </div>
                                )
                            })}
                        </Layout.Row>
                    </NewPanel>
                </div>
                <div style={{marginTop: '20px'}}>
                    <Pagination layout="total, sizes, prev, pager, next, jumper" total={count} pageSizes={[15, 30]} pageSize={pageSize} currentPage={pageNow}
                                onSizeChange={this.toPageSize} onCurrentChange={this.goPageNow}/>
                </div>
            </AJAX>
        );
    }
}

export default ContentAdmin;
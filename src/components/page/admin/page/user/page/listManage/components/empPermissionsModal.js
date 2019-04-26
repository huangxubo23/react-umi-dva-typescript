/**
 * Created by shiying on 18-4-21.权限设置
 */

import React from "react";
import AJAX from '../../../../../../../lib/newUtil/AJAX';
import {Layout, Alert, Checkbox, Message} from "element-react";
import 'element-theme-default';
import '../../../../../../../../styles/user/content.css';
import '../../../../../../../../styles/component/util/minSm.js.css';
import {JurisdictionModel} from '../../../components/JurisdictionModel';
import {ThousandsOfCall} from "../../../../../../../lib/util/ThousandsOfCall";

require('../../../../../../../../styles/content/content_template.css');

class EmpPermissionsModal extends React.Component {//员工权限模态
    constructor(props) {
        super(props);
        this.state = {
            allTalent: [],
            manage: {},//员工
            allPermissions: {},//所有权限  //designationMark:[]指定权限，permissions：[]员工权限，topPermissions:[]顶级权限
        }
    }

    takePermission = () => {//获取所有权限
        this.EmpPermissionsModalAjax.ajax({
            url: "/user/admin/superManage/manage/takePermission.io",//要访问的后台地址
            data: "",//要发送的数据
            callback: (data) => {//获取数据改变属性
                this.setState({allPermissions: data});
            }
        });
    };

    componentDidMount() {
        this.daren_list();
    }


    editPermissionsClick = () => {//修改权限
        let manage = this.state.manage;
        this.EmpPermissionsModalAjax.ajax({
            type: 'post',
            url: '/user/admin/superManage/manage/editPermissions.io',
            data: {data: JSON.stringify(manage)},
            callback: () => {
                Message({
                    message: '修改成功',
                    type: 'success'
                });
                this.props.closeModal();
            }
        });
    };

    permissionsChange = ({value, checked, name}) => {
        let manage = this.state.manage;
        let {talentList, allPermissions,allTalent} = this.state;
        let Jurisdiction = allPermissions.permissions;
        if (name === 'designationMark' || name === 'permissions') {
            let permission = manage[name];
            this.setState({manage});
            if (checked) {

                permission[value] = true;
                if (value.indexOf('$') > -1) {
                    allTalent = [];
                    for (let i = 0; i < talentList.length; i++) {
                        allTalent.push(talentList[i].title);
                        if (value === talentList[i].title) {
                            permission['sqdr-' + talentList[i].id] = true;
                        }
                    }
                } else {
                    for (let i = 0; i < talentList.length; i++) {
                        if (value === talentList[i].title) {
                            permission['sqdr-' + talentList[i].id] = true;
                        }
                    }
                }
                manage[name] = permission;
                this.setState({manage, allTalent});
            } else {
                delete permission[value];
                if (value.indexOf('$') > -1) {
                    for (let i in permission) {
                        for (let t = 0; t < talentList.length; t++) {
                            if (i.indexOf('sqdr-') > -1 && i.split('sqdr-')[1] == talentList[t].id) {
                                delete permission[talentList[t].title];
                                delete permission['sqdr-' + talentList[t].id];
                            }
                        }
                    }
                    for (let j in Jurisdiction) {
                        if (Jurisdiction[j].value === '$allTalent') {
                            Jurisdiction.splice(j, 1);
                        }
                    }
                    allPermissions.permissions = Jurisdiction;
                } else {
                    for (let i = 0; i < talentList.length; i++) {
                        if (value === talentList[i].title) {
                            delete permission['sqdr-' + talentList[i].id];
                        }
                    }
                }
                manage[name] = permission;
                this.setState({manage, allPermissions});
            }
        }
    };

    daren_list = (callback) => {//获取授权达人列表
        ThousandsOfCall.acoustic(
            {}, "requestTanleList", (msg) => {
                if (msg.success) {
                    let talentList = msg.data;
                    let allTalent = [];
                    for (let i = 0; i < talentList.length; i++) {
                        //allTalent.value.push(talentList[i].title);
                        allTalent.push(talentList[i].title);

                    }
                    this.setState({talentList: talentList, allTalent: allTalent});
                } else {
                    Message.error('获取达人列表失败');
                }
            }
        )
    };


    render() {
        let {allPermissions, manage} = this.state;
        return (
            <div>
                <AJAX ref={e => {
                    this.EmpPermissionsModalAjax = e
                }}>
                    <Alert title="员工权限" type="info" closable={false}/>
                    <div style={{marginTop: '15px'}}>
                        {allPermissions.permissions &&
                        <Layout.Row gutter='10' style={{marginBottom: '5px'}} type='flex' align='middle'>
                            <div>
                                <JurisdictionModel Jurisdiction={allPermissions.permissions} talent={manage} allTalent={this.state.allTalent} onChange={this.permissionsChange}/>
                            </div>
                        </Layout.Row>}
                    </div>
                    <div style={{marginTop: '20px'}}>
                        <span style={{fontWeight: 'bold', fontSize: '15px', float: 'left', marginLeft: '18px'}}>指定权限</span>
                        <div style={{marginTop: '15px'}}>
                            {(allPermissions.designationMark ? allPermissions.designationMark : []).map((item, i) => {
                                return (
                                    <Checkbox key={+new Date() + i} label={item} checked={item in manage.designationMark}
                                              onChange={(value) => {
                                                  this.permissionsChange({value: item, checked: value, name: 'designationMark'})
                                              }}/>
                                )
                            })}
                        </div>
                    </div>
                </AJAX>
            </div>
        )
    }
}


export default EmpPermissionsModal;

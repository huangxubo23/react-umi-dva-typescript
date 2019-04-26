import React from "react";
import {Button, Dialog, Slider, Layout, Message,Alert,InputNumber,MessageBox} from 'element-react'
import 'element-theme-default';
import AJAX from "../../../../lib/newUtil/AJAX";

class SpotCardExchangeModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true,
            total: "",
            available: "",
            permissions: {
                dapPermissions: 0,//搭配
                tkPermissions: 0,//淘客
                postCheesyPermissions: 0,//帖子加单品
                collectPermissions: 0,//收藏夹
                albumPermissions: 0,//清单加好货
                postPermissions: 0,//帖子加搭配
                cheesyPermissions: 0,//好货加帖子
                allPermissions: 0,//所有权限
            }
        }
    };

    componentDidMount() {

    };

    componentDidUpdate() {

    };

    settingValue = (value, perm) => {
        let permissions = this.state.permissions;
        if (perm === "dapPermissions") {
            permissions.dapPermissions = value;
        }
        if (perm === "tkPermissions") {
            permissions.tkPermissions = value;
        }
        if (perm === "postCheesyPermissions") {
            permissions.postCheesyPermissions = value;
        }
        if (perm === "effectAnalysePermissions") {
            permissions.effectAnalysePermissions = value;
        }
        if (perm === "collectPermissions") {
            permissions.collectPermissions = value;
        }
        if (perm === "albumPermissions") {
            permissions.albumPermissions = value;
        }
        if (perm === "postPermissions") {
            permissions.postPermissions = value;
        }
        if (perm === "cheesyPermissions") {
            permissions.cheesyPermissions = value;
        }
        if (perm === "allPermissions") {
            permissions.allPermissions = value;
        }

        let available = this.state.total - this.state.permissions.dapPermissions
            - this.state.permissions.tkPermissions - this.state.permissions.postCheesyPermissions
            - this.state.permissions.effectAnalysePermissions - this.state.permissions.collectPermissions
            - this.state.permissions.albumPermissions - this.state.permissions.postPermissions
            - this.state.permissions.cheesyPermissions - this.state.permissions.allPermissions;
        this.setState({
            available: available,
            permissions: permissions
        });

    };

    change = (minute) => {
        let s = "";
        let day = parseInt(minute / (60 * 24));
        if (day > 0) s = day + "天";
        let hour = parseInt(minute % (60 * 24) / 60);
        if (hour > 0 || s != "") s += hour + "小时";
        s += minute % 60 + "分钟";
        return s;
    };
    submit = () => {
        let permissions = this.state.permissions;
        this.ajax.ajax({
            type: "post",
            url: "/user/admin/superManage/exchangeEsteemn.io",
            data: {data: JSON.stringify(permissions)},
            callback: () => {
                Message.success("兑换成功");
                this.props.upData();
                this.close();
            }
        });
    };

    wholeSubmit=()=>{
        let {permissions,total}=this.state;
        Object.assign(permissions,{allPermissions:total});
        MessageBox.confirm('此操作将兑换全部点数，请确认？', '提示', {
            type: 'info'
        }).then(() => {
            this.ajax.ajax({
                type: "post",
                url: "/user/admin/superManage/exchangeEsteemn.io",
                data: {data: JSON.stringify(permissions)},
                callback: () => {
                    Message.success("兑换成功");
                    this.props.upData();
                    this.close();
                }
            });
        }).catch(() => {
            Message({
                type: 'info',
                message: '已取消兑换'
            });
        });
    };

    sliderChange = (val) => {
        let {permissions, total} = this.state;
        permissions.allPermissions = val;
        if (total >= val) {
            this.setState({permissions: permissions, available: total - val});
        }
    };

    close = () => {
        let {permissions} = this.state;
        permissions.allPermissions = 0;
        this.setState({
            show: false,
            permissions: permissions
        });
    };

    render() {
        let {permissions, total, available, show} = this.state;
        //let step = total > 60 * 24 * 15 ? 60 * 24 * 15 : total;
        let step = 60 * 24 * 15;
        return (
            <Dialog size="small"
                    title="兑换权限"
                    visible={show}
                    onCancel={() => this.setState({show: false})}>
                <Dialog.Body>
                    <AJAX ref={e => this.ajax = e}>
                        <div className="Modelbackground">
                            <h4 className="rechargeTitle">一个点数兑换一分钟权限时间</h4>
                            <div className="segmentingLine"/>
                            {(total < 60 * 24 * 15)&&<Alert title="当前点数不够兑换十五天权限,请进行充值后兑换" type="warning" />}
                            <h5>
                                您当前共拥有<b style={{color: "orange"}}>{total}</b>个点数,还可分配<b
                                style={{color: "orange"}}>{available}</b>个点数
                            </h5>
                            <div className="block">
                                <Layout.Row>
                                    <Layout.Col span="4" style={{marginTop:'8px'}}>
                                        <span className="demonstration" style={{fontSize: '14px', fontWeight: 700}}>兑换所有权限</span>
                                    </Layout.Col>
                                    <Layout.Col span="8" style={{padding:'0 5px'}}>
                                        <Slider value={permissions.allPermissions} step={step}
                                                min={0} max={total} onChange={this.sliderChange} showStops/>
                                    </Layout.Col>
                                    <Layout.Col span="4">
                                        <InputNumber value={permissions.allPermissions} disabled={true}> </InputNumber>
                                    </Layout.Col>
                                    <Layout.Col span="8" style={{marginTop:'8px'}}>
                                        <span className="demonstration">分配{this.change(permissions.allPermissions)}</span>
                                    </Layout.Col>
                                </Layout.Row>
                            </div>
                        </div>
                    </AJAX>
                </Dialog.Body>
                <Dialog.Footer className="dialog-footer">
                    <Button onClick={() => this.setState({show: false})}>取消</Button>
                    <Button type="primary" onClick={this.submit} disabled={!permissions.allPermissions}>确认兑换</Button>
                    <Button type="primary" onClick={this.wholeSubmit}>兑换全部点数</Button>
                </Dialog.Footer>
            </Dialog>
        )
    }
}

export default SpotCardExchangeModal;
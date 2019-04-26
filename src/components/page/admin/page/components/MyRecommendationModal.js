import React from "react";
import {Button, Dialog, Table, Tabs, Pagination} from 'element-react'
import 'element-theme-default';
import AJAX from "../../../../lib/newUtil/AJAX";

class MyRecommendationModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            inviteCode: "",
            type: "talent",
            talent: {data: [], pageNow: 1, pageSize: 1, count: 1},
            seller: {data: [], pageNow: 1, pageSize: 1, count: 1},
            columns: [
                {
                    label: "注册时间",
                    prop: "date"
                },
                {
                    label: "名称",
                    prop: "name"
                }]
        }
    }

    getData = (pageNow, type) => {
        this.ajax.ajax({
            type: "post",
            url: "/user/admin/superManage/listIOffline.io",//要访问的后台地址
            data: {pageNow: pageNow, pageSize: 16, type: type},
            callback: (msg) => {
                if (msg.type === "talent") {
                    this.setState({
                        talent: {
                            data: msg.data,
                            pageNow: msg.pageNow,
                            pageSize: msg.pageSize,
                            count: msg.count,
                        },
                        inviteCode: msg.inviteCode, type: type
                    });
                } else {
                    this.setState({
                        seller: {
                            data: msg.data,
                            pageNow: msg.pageNow,
                            pageSize: msg.pageSize,
                            count: msg.count,
                        },
                        inviteCode: msg.inviteCode,
                        type: type
                    });
                }
            }
        });
    };

    componentDidMount() {
        this.getTalentData();
    }

    getTalentData = (pageNow) => {
        pageNow = pageNow ? pageNow : this.state.talent.pageNow;
        this.getData(pageNow, "talent");
    };
    getSellerData = (pageNow) => {
        pageNow = pageNow ? pageNow : this.state.seller.pageNow;
        this.getData(pageNow, "seller");
    };

    tabClick = (e) => {
        let name = e.props.name;
        if (name == "talent") {
            this.getTalentData();
        } else if (name == "seller") {
            this.getSellerData();
        }
    };


    render() {
        let {show,inviteCode,type,columns,talent,seller}=this.state;
        return (
            <AJAX ref={e => this.ajax = e}>
                <Dialog visible={show} size="small" title="我的推荐"
                        onCancel={() => this.setState({show: false})} style={{textAlign: "left"}}>
                    <Dialog.Body>
                        <h4 className="rechargeTitle">我的推荐码:{inviteCode}</h4>
                        <div className="segmentingLine"/>
                        <Tabs type="card" value={type} onTabClick={this.tabClick}>
                            <Tabs.Pane label="推荐的达人" name="talent">
                                <Table style={{width: '100%'}} columns={columns} data={talent.data}/>
                                <div style={{textAlign:'center',marginTop:'10px'}}>
                                    <Pagination onCurrentChange={this.getTalentData} pageSize={talent.pageSize}
                                                currentPage={talent.pageNow} layout="prev, pager, next" total={talent.count}/>
                                </div>
                            </Tabs.Pane>
                            <Tabs.Pane label="推荐的商家" name="seller">
                                <Table style={{width: '100%'}} columns={columns} data={seller.data}/>
                                <div style={{textAlign:'center',marginTop:'10px'}}>
                                    <Pagination onCurrentChange={this.getSellerData} pageSize={seller.pageSize}
                                                currentPage={seller.pageNow} layout="prev, pager, next" total={seller.count}/>
                                </div>
                            </Tabs.Pane>
                        </Tabs>
                    </Dialog.Body>
                </Dialog>
            </AJAX>
        )
    }
}

export default MyRecommendationModal;
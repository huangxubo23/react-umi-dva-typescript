import ReactChild from "../../../../lib/util/ReactChild";
import {Button, Dialog, Table, Layout, Message, Select, Form, Alert} from 'element-react'
import 'element-theme-default';
import AJAX from "../../../../lib/newUtil/AJAX";


class RechargeModal extends ReactChild {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            packageType: 4,
            stayPayOrders: [],
            columns: [
                {
                    label: "时间",
                    prop: "createDate"
                }, {
                    label: "人员",
                    prop: "manageNick"
                },
                {
                    label: "套餐",
                    prop: "packageType",
                    render: (data) => {
                        if (data.packageType === 4) return " 43200点数";
                        else if (data.packageType === 5) return "86400点数";
                        else if (data.packageType === 6) return "129600点数";
                    }
                },
                {
                    label: "价格",
                    prop: "amount"
                },
                {
                    label: "操作",
                    prop: "id",
                    width: 180,
                    render: (data) => {
                        return (
                            <Button.Group>
                                <Button type="primary" size={"mini"}
                                        onClick={() => {
                                            window.open(window.location.origin + "/user/admin/superManage/alipayApi.io?orderId=" + data.id);
                                        }}>去付款</Button>
                                <Button type="primary" size={"mini"} style={"danger"} onClick={() => {
                                    this.canceled(data.id)
                                }}>取消订单</Button>
                            </Button.Group>)
                    }
                }
            ],
            options: [{
                value: 4,
                label: '43200点(可以使用软件所有功能一个月)---600.00元'
            }, {
                value: 5,
                label: '43200x2）点(8.3折)---1000.00元'
            }, {
                value: 6,
                label: '43200x3）点(6.6折)---1200.00元'
            }, {
                value: -1,
                label: '充值测试'
            }]
        }
    }

    componentDidMount() {
        this.obtainStayPay();
    }

    obtainStayPay = () => {
        this.ajax.ajax({
            url: "/user/admin/superManage/obtainStayPay.io",
            callback: (data) => {
                this.setState({stayPayOrders: data});
            }
        })
    };
    canceled = (id) => {
        this.ajax.ajax({
            url: "/user/admin/superManage/cancelOrder.io",
            data: {orderid: id},
            callback: () => {
                this.obtainStayPay();
            }
        });

    };
    sellPackage = (value) => {
        this.setState({packageType: value});
    };

    render() {
        let close = () => this.setState({show: false});
        let {show,stayPayOrders,columns,packageType,options}=this.state;
        return (
            <AJAX ref={e => this.ajax = e}>
                <Dialog visible={show} size="small" title="点卡购买"
                        onCancel={() => this.setState({show: false})} style={{textAlign: "left"}}>
                    <Dialog.Body>
                        <div className="Modelbackground">
                            {stayPayOrders.length > 0 ?
                                <Table style={{width: '100%'}} columns={columns} maxHeight={200} data={stayPayOrders}/>
                                : <div>
                                    <Alert title="一个点数可以兑换一分钟权限,充值结束后,请手动兑换" type="info" style={{marginBottom:'10px'}}/>
                                    <Form model={{}} labelWidth="80" onSubmit={() => {}}>
                                        <Form.Item label="选择套餐">
                                            <Select value={packageType} onChange={this.sellPackage} style={{width: "100%"}}>
                                                {options.map(el => <Select.Option key={el.value} label={el.label} value={el.value}/>)}
                                            </Select>
                                        </Form.Item>
                                    </Form>
                                    <Layout.Row gutter="20" style={{marginTop: "30px"}}>
                                        <Layout.Col span={6} offset={6}>
                                            <Button type="info" size="large" onClick={() => {
                                                if (packageType) {
                                                    window.open(window.location.origin + "/user/admin/superManage/createOrder.io?v=2&packageId=" + packageType);
                                                } else {
                                                    Message.warning("请选择一个套餐");
                                                }
                                            }}>
                                                前往支付宝付款
                                            </Button>
                                        </Layout.Col>
                                        <Layout.Col span={6}>
                                            <Button size="large" onClick={close}>关闭</Button>
                                        </Layout.Col>
                                    </Layout.Row>
                                </div>}
                        </div>
                    </Dialog.Body>
                </Dialog>
            </AJAX>
        )
    }
}

export default RechargeModal;
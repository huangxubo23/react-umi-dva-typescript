/**
 * Created by linhui on 17-10-28.奖励设置
 */
import React from 'react';
import AJAX from '../../../../../../../../../lib/newUtil/AJAX';
import NewPanel from '../../../../../../../../../lib/util/elementsPanel';
import {Layout, Dialog, Input, Message, Button} from 'element-react';
import 'element-theme-default';

class Capture extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true,
            data: [],
        };
        this.open = this._open.bind(this);
        this.close = this._close.bind(this);
    }

    componentDidMount() {
        this.set();
    }

    _open() {
        this.setState({show: true}, () => {
            this.set();
        });
    }

    _close() {
        this.setState({show: false});
    }

    set = () => {
        this.captureAjax.ajax({
            url: "/message/admin/topManage/getIncomeSetting.io",
            data: {},
            callback: (data) => {
                this.setState({data: data});
            }
        })
    };
    dynamic = (env) => {//动态奖励事件
        let {value, i} = env;
        let data = this.state.data;
        data[i].commissionFeeShowProportion = value;
        this.setState({data: data});
    };
    fixed = (env) => {//固定奖励事件
        let {value, i} = env;
        let data = this.state.data;
        data[i].fixedIncomeShowProportion = value;
        this.setState({data: data});
    };
    submit = () => {
        let data = this.state.data;
        this.captureAjax.ajax({
            type: 'post',
            url: "/message/admin/topManage/setIncomeSetting.io",
            data: {data: JSON.stringify(data)},
            callback: () => {
                Message({message: '操作成功', type: 'success'});
                this.close();
            }
        })
    };

    render() {
        return (
            <div>
                <AJAX ref={e => this.captureAjax = e}>
                    {this.state.data.map((item, i) => {
                        return (
                            <NewPanel>
                                <Layout.Row>
                                    <Layout.Col sm={8} style={{marginTop: "7px"}}>
                                        动态奖励显示比例
                                    </Layout.Col>
                                    <Layout.Col sm={16}>
                                        <Input placeholder="设置比例为百分值" value={item.commissionFeeShowProportion} onChange={(value) => {
                                            this.dynamic({value: value, i: i})
                                        }} append="%"/>
                                    </Layout.Col>
                                </Layout.Row>
                                <Layout.Row>
                                    <Layout.Col sm={8} style={{marginTop: "7px"}}>
                                        固定奖励显示比例
                                    </Layout.Col>
                                    <Layout.Col sm={16}>
                                        <Input placeholder="设置比例为百分值" value={item.fixedIncomeShowProportion} onChange={(value) => {
                                            this.fixed({value: value, i: i})
                                        }} append="%"/>
                                    </Layout.Col>
                                </Layout.Row>
                            </NewPanel>
                        )
                    })}
                </AJAX>
            </div>
        )
    }
}

export default Capture;
/**
 * Created by muqingzhong on 2017/12/8.一士之智
 */

import AJAX from '../../../../../../lib/newUtil/AJAX';
import {Card, Alert, Button, Input, Layout, Table} from "element-react";
import React from "react";
import ReactChild from "../../../../../../lib/util/ReactChild";

require('../../../../../../../styles/content/content_template.css');

class BachelorWisdom extends ReactChild {
    constructor(props) {
        super(props);
        this.state = {
            pageNow: 1,
            pageSize: 20,
            count: 0,
            text: '',//搜索字段
            bachelorWisdom: [],
            bachelorWisdom2: [],
            columns: [],
            array: [],
            columns1: [],
            array1: [],
        }
    }

    bachelorWisdom = () => {//搜
        let text = this.state.text;
        this.BachelorWisdomAjax.ajax({
            type: 'post',
            url: '/message/admin/bachelorWisdom/findText.io',
            data: {text: text},
            callback: (json) => {
                if (text.length >= 5) {
                    this.setState({bachelorWisdom2: json});
                } else {
                    this.setState({bachelorWisdom: json});
                }
            }
        });
    };


    bachelorWisdom2 = (text) => {//表二数据
        this.BachelorWisdomAjax.ajax({
            type: 'post',
            url: '/message/admin/bachelorWisdom/findText.io',
            data: {text: text},
            callback: (json) => {
                let columns1 = [
                    {label: '名字', prop: 'text'}
                ];
                let array1 = [];
                if (json.length > 0) {
                    json.map((items, x) => {
                        array1.push({text: items.text});

                    })
                }
                json.columns1 = columns1;
                json.array1 = array1;
                this.setState(json);
            }
        });
    };

    render() {
        let {text, array, columns, array1, columns1, bachelorWisdom} = this.state;
        columns = [
            {label: '名字', prop: 'text'},
            {
                label: '匹配步骤2', prop: 'id', render: (data) => {
                    return (
                        <div>
                            <Button size='small' type='success' onClick={() => {
                                this.bachelorWisdom2(data.text)
                            }}>匹配</Button>
                        </div>
                    )
                }
            }
        ];
        array = [];//表一数据
        if (bachelorWisdom.length > 0) {
            bachelorWisdom.map((item, i) => {
                let {text, id} = item;
                array.push({text: text, id: id})
            })
        }

        return (
            <AJAX ref={e => {
                this.BachelorWisdomAjax = e
            }}>
                <div>
                    <Card className='box-Card'>
                        <Alert title="一士之智" type="info" closable={false}/>
                        <div style={{marginTop: '15px'}}>
                            <Input placeholder="请输入搜索字段,如卫衣" value={text} onChange={(value) => {
                                this.setState({text: value})
                            }} onKeyDown={(event) => {
                                if (event.keyCode == "13") {
                                    this.bachelorWisdom();
                                }
                            }} append={<Button type="primary" icon="search" onClick={this.bachelorWisdom}>搜索</Button>}/>
                            <div style={{marginTop: '15px'}} className='divTable'>
                                <Layout.Row gutter='20'>
                                    <Layout.Col span='12'>
                                        <Table style={{width: '100%'}} columns={columns} data={array}/>
                                    </Layout.Col>
                                    <Layout.Col span='12'>
                                        <Table style={{width: '100%'}} columns={columns1} data={array1}/>
                                    </Layout.Col>
                                </Layout.Row>
                            </div>
                        </div>
                    </Card>
                </div>
            </AJAX>
        );
    }
}

export default BachelorWisdom;



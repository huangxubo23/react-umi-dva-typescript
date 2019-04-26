import React from 'react';
import UpImages from '../../../../../../../lib/sharing/upload/UpImages';
import {Form, Input, Card, Layout, Message, Notification} from "element-react";
import AJAX from '../../../../../../../lib/newUtil/AJAX';

require('../../../../../../../../styles/addList/content.css');

class Brand extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false, //显示模态
            title: "添加品牌",
            data: {}
        };
    }

    nameChange = (value) => {//请输入品牌名
        let {data} = this.state;
        data.name = value;
        this.setState({data: data})
    };

    introductionChange = (value) => {//请输入品牌描述
        let {data} = this.state;
        data.introduction = value;
        this.setState({data: data})
    };

    submit = () => {
        let {data} = this.state;
        if (data.name && data.log && data.introduction) {
            this.setData({
                id: data.id ? data.id : 0,
                name: data.name,
                pBIlog: data.log,
                introduction: data.introduction
            })
        } else {
            Message({
                message: '品牌数据添加不完整',
                type: 'warning'
            });
        }
    };

    setData = (data = {}) => {
        let tips = this.state.tips;
        tips = tips === 2 ? '编辑品牌成功' : '新增品牌成功';
        if (this.brandAjax) {
            this.brandAjax.ajax({
                type: 'post',
                url: '/message/admin/cheesy/addOrUpPrivateBrandInfo.io',
                data: data,
                callback: () => {
                    Notification({
                        title: '成功',
                        message: JSON.stringify(tips),
                        type: 'success'
                    });
                    this.props.cloneModal();
                    this.props.refresh();
                }
            })
        }
    };

    render() {
        let {data} = this.state;
        return (
            <div>
                <AJAX ref={e => this.brandAjax = e}>
                    <div>
                        <Card className='box-Card'>
                            <Form model={this.state} labelWidth='80'>
                                <Form.Item label='品牌名称'>
                                    <Input type='text' placeholder="请输入品牌名"
                                           value={data.name} onChange={(value) => {
                                        this.nameChange(value)
                                    }}/>
                                </Form.Item>
                                <Form.Item label='品牌描述'>
                                    <Input type='textarea' placeholder="请输入品牌描述" rows="5"
                                           value={data.introduction} onChange={(value) => {
                                        this.introductionChange(value)
                                    }}/>
                                </Form.Item>
                                <Form.Item label='品牌logo'>
                                    {!data.log ?
                                        <Layout.Row>
                                            <Layout.Col span="8" className="itemM_pic">
                                                <div>
                                                    <img
                                                        src="https://img.alicdn.com/imgextra/i1/772901506/TB2oeLpihhmpuFjSZFyXXcLdFXa_!!772901506.jpg"
                                                        onClick={() => {
                                                            const imgCallback = (img) => {
                                                                data.log = img;
                                                                this.setState({data: data});
                                                            };
                                                            this.setState({imgCallback: imgCallback}, () => {
                                                                this.upImages.open();
                                                            });
                                                        }}/>
                                                </div>
                                            </Layout.Col>
                                        </Layout.Row> :
                                        <Layout.Row>
                                            <Layout.Col span="8">
                                                <div>
                                                    <img src={data.log} width="100%"/>
                                                    <div style={{
                                                        textAlign: 'center',
                                                        bottom: 0,
                                                        left: "15px",
                                                        right: "15px",
                                                        color: "white",
                                                        backgroundColor: "rgba(0, 0, 0, 0.59)",
                                                        cursor: "pointer"
                                                    }}
                                                         onClick={() => {
                                                             data.log = undefined;
                                                             this.setState({data: data});
                                                         }}>
                                                        删除
                                                    </div>
                                                </div>
                                            </Layout.Col>
                                        </Layout.Row>
                                    }
                                </Form.Item>
                            </Form>
                        </Card>
                    </div>
                </AJAX>
                <UpImages ref={e => this.upImages = e} callback={this.state.imgCallback} size={'full'}/>
            </div>
        )
    }
}

export default Brand;
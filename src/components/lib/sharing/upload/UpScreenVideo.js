/**
 * Created by 石英 on 2018/10/24 0024下午 2:14.
 */


import React from 'react';
import {
    Pagination,
    Message,
    MessageBox,
    Layout,
    Card,
    Checkbox,
    Dropdown,
    Dialog,
    Button,
    Tabs,
    Notification,
    Select,
    Input,
    Alert,
    Cascader
} from 'element-react';
import '../../../../styles/addList/content.css';
import 'element-theme-default';

class UpScreenVideo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogVisible:false,
            rules: {//规则
                name: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' }
                ],
                region: [
                    { required: true, message: '请选择活动区域', trigger: 'change' }
                ],
                date1: [
                    { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                ],
                date2: [
                    { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
                ],
                type: [
                    { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
                ],
                resource: [
                    { required: true, message: '请选择活动资源', trigger: 'change' }
                ],
                desc: [
                    { required: true, message: '请填写活动形式', trigger: 'blur' }
                ]
            }
        }
    }

    open=()=>{
        this.setState({dialogVisible:true});
    };

    render(){
        let {dialogVisible,rules}=this.state;
        return(
            <div  className='imageList'>
                <Dialog title='互动视频-全屏页' size="small" visible={dialogVisible}
                        onCancel={() =>this.setState({dialogVisible: false})}
                        lockScroll={false} closeOnClickModal={false}>
                    <Dialog.Body>
                        <Layout.Row gutter="10">
                            <Layout.Col span='4'>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <div className="mm-menu-list">
                                        <div className='mm-menu-item'>
                                            <span>互动抽奖</span>
                                        </div>
                                        <div className='mm-menu-item'>
                                            <span>搭配宝贝</span>
                                        </div>
                                    </div>
                                </div>
                            </Layout.Col>
                            <Layout.Col span='9'>
                                <div className='mm-video-view'>
                                    <div className='mm-video-wrapper'>
                                        <div className='lib-video'>
                                            <video id='active' className='lib-video' controls={true}
                                                   poster='https://img.alicdn.com/imgextra/i3/6000000007565/TB2zx37f8fH8KJjy1XbXXbLdXXa_!!0-0-tbvideo.jpg'>
                                                <source src='http://cloud.video.taobao.com/play/u/1765153321/p/2/e/6/t/1/50052326925.mp4' type='video/mp4'/>
                                            </video>
                                        </div>
                                    </div>
                                </div>
                            </Layout.Col>
                            <Layout.Col span='11'>
                                {/*<Card className="box-card" header={
                                    <div className="clearfix">
                                        <span style={{ "lineHeight": "36px" }}>搭配宝贝</span>
                                    </div>
                                }>
                                    <div className="screen-item">
                                        <div>搭配{'1'}</div>
                                        <div>{'00:00'}开始展现，可以添加2~3个宝贝</div>
                                        <div className='add-item'>
                                            <img src='https://gw.alicdn.com/tfs/TB1is_cb4naK1RjSZFtXXbC2VXa-24-23.png' className='add-pic'/>
                                            <span className='add-text'>添加宝贝</span>
                                        </div>
                                    </div>
                                    <div className="screen-item">
                                        <div>搭配{'2'}</div>
                                        <div>{'10:00'}开始展现，可以添加2~3个宝贝</div>
                                        <div className='add-item'>
                                            <img src='https://gw.alicdn.com/tfs/TB1is_cb4naK1RjSZFtXXbC2VXa-24-23.png' className='add-pic'/>
                                            <span className='add-text'>添加宝贝</span>
                                        </div>
                                    </div>
                                    <div className="screen-item">
                                        <div>搭配{'3'}</div>
                                        <div>{'20:00'}开始展现，可以添加2~3个宝贝</div>
                                        <div className='add-item'>
                                            <img src='https://gw.alicdn.com/tfs/TB1is_cb4naK1RjSZFtXXbC2VXa-24-23.png' className='add-pic'/>
                                            <span className='add-text'>添加宝贝</span>
                                        </div>
                                    </div>
                                </Card>*/}
                                <Card className="box-card" header={
                                    <div className="clearfix">
                                        <span style={{"lineHeight":"36px"}}>答题互动</span>
                                    </div>
                                }>
                                    <h5>题目设置(必选)</h5>
                                    <Form labelPosition='right' labelWidth="100" model={this.state.form} className="demo-form-stacked" rules={this.state.rules}>
                                        <Form.Item label="答题类型">
                                            <Radio value="1" checked={this.state.value === 1} onChange={this.onChange.bind(this)}>选择题</Radio>
                                            <Radio value="2" checked={this.state.value === 2} onChange={this.onChange.bind(this)}>态度题</Radio>
                                        </Form.Item>
                                        <Form.Item label="题目：">
                                            <Input value={this.state.form.region} onChange={this.onChange.bind(this, 'region')}>

                                            </Input>
                                        </Form.Item>
                                        <Form.Item label="选项1">
                                            <Input value={this.state.form.type} onChange={this.onChange.bind(this, 'type')}>

                                            </Input>
                                        </Form.Item>
                                        <Form.Item label="选项2">
                                            <Input value={this.state.form.type} onChange={this.onChange.bind(this, 'type')}>

                                            </Input>
                                        </Form.Item>
                                        <Form.Item label="选项3">
                                            <Input value={this.state.form.type} onChange={this.onChange.bind(this, 'type')}>

                                            </Input>
                                        </Form.Item>
                                        <Form.Item label="正确答案">
                                            <Radio value="1" checked={this.state.value === 1} onChange={this.onChange.bind(this)}>选项1</Radio>
                                            <Radio value="2" checked={this.state.value === 2} onChange={this.onChange.bind(this)}>选项2</Radio>
                                            <Radio value="3" checked={this.state.value === 3} onChange={this.onChange.bind(this)}>选项3</Radio>
                                        </Form.Item>
                                    </Form>
                                    <h5>奖励胜者(必选)</h5>
                                    <Form labelPosition='right' labelWidth="100" model={this.state.form} className="demo-form-stacked" rules={this.state.rules}>
                                        <Form.Item label="答题类型">
                                            <Radio value="1" checked={this.state.value === 1} onChange={this.onChange.bind(this)}>选择题</Radio>
                                            <Radio value="2" checked={this.state.value === 2} onChange={this.onChange.bind(this)}>态度题</Radio>
                                        </Form.Item>
                                    </Form>
                                </Card>
                            </Layout.Col>
                        </Layout.Row>
                    </Dialog.Body>
                </Dialog>
            </div>
        )
    }
}

export default UpScreenVideo;
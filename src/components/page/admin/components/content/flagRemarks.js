/**
 * Created by linhui on 17-10-31. 标记备注
 */

require("../../../../../styles/component/react_assembly/listContent.css");
import '../../../../../styles/component/react_assembly/editBox.css';
import React from 'react';
import {ajax} from '../../../../lib/util/ajax';
import {Notification,Dialog,Layout,Button,Input,Message,Radio} from 'element-react';
import 'element-theme-default';

class FlagRemarks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',//内容id
            remarks: '',//备注内容
            flag: '',//标记
        }
    }

    componentDidMount(){
        let data = this.props.data;
        if(data){
            data.submitButton=data.submitButton?data.submitButton:false;
            data.flag=data.flag?data.flag:'';
            data.remarks=data.remarks?data.remarks:'';
            this.setState(data);
        }
    }
    componentWillReceiveProps(newProps){
        let data = newProps.data;
        if(data){
            data.submitButton=data.submitButton?data.submitButton:false;
            data.flag=data.flag?data.flag:'';
            data.remarks=data.remarks?data.remarks:'';
            this.setState(data);
        }
    }



    updateFlagAndRemarks = (callback) => {//提交
        let {id,remarks,flag} = this.state;
        let {goPage,pageNow}=this.props;
        if (!flag) {
            Message({
                message: '请选择一面旗帜',
                type: 'warning'
            });
            return false;
        }
        ajax.ajax({
            type: 'post',
            url: '/content/admin/content/updateFlagAndRemarks.io',
            data: {id, remarks, flag},
            callback: () => {
                Message({
                    message: '标记备注提交成功',
                    type: 'success'
                });
                goPage(pageNow);
                if(callback&&typeof(callback) =='function' ){
                    callback();
                }
            }
        });
    };

    render() {
        let {flag,remarks}=this.state;
        let flagArray=[
            {value:1,className:'red'}, {value:2,className:'orange'},
            {value:3,className:'yellow'}, {value:4,className:'green'},
            {value:5,className:'cyan'}, {value:6,className:'blue'},
            {value:7,className:'violet'}, {value:8,className:'white'},
            {value:9,className:'black'}, {value:10,className:'deeppink'},
            {value:11,className:'brown'}
        ];
        return (
            <div>
                <Layout.Row gutter="5" style={{margin:"5px 0"}}>
                    <Layout.Col span={6} style={{margin:'20px 0'}}>
                        标记：
                    </Layout.Col>
                    <Layout.Col span={18}>
                        <Layout.Row gutter="5" style={{margin:"5px"}}>
                            {flagArray.map((item,index)=>{
                                return(
                                    <Layout.Col span={6} key={index}>
                                        <Radio value={`${item.value}`} checked={flag === item.value} onChange={(value)=>{
                                            this.setState({flag: parseInt(value)});
                                        }}>
                                            <i className={`${item.className} iconfont`}>&#xe624;</i>
                                        </Radio>
                                    </Layout.Col>
                                )
                            })}
                        </Layout.Row>
                    </Layout.Col>
                </Layout.Row>
                <Layout.Row gutter="5" style={{margin:"5px 0"}}>
                    <Layout.Col span={6}>
                        备注：
                    </Layout.Col>
                    <Layout.Col span={18}>
                        <Input type="textarea"
                            autosize={{ minRows: 3, maxRows: 5}} value={remarks}
                            placeholder="请输入备注" onChange={(value)=>this.setState({remarks: value})}
                        />
                    </Layout.Col>
                </Layout.Row>
                <Layout.Row gutter="5" >
                    <Layout.Col span={24}>
                        {this.state.submitButton?<Button type="info" style={{float:'right'}} onClick={this.updateFlagAndRemarks}>提交</Button>:''}
                    </Layout.Col>
                </Layout.Row>
            </div>
        )
    }
}

export default FlagRemarks;


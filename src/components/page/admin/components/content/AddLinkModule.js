/**
 * Created by shiying on 17-7-28.
 */

import React from 'react';
import {Layout,Input,Button,Message,Tag} from 'element-react';
import 'element-theme-default';

class AddLinkModule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text:'',
            link:'',
        }
    }

    change=({value,type})=>{
        this.setState({[type]: value});
    };

    submission = () => {
        let {text,link} = this.state;
        if (!text) {
            Message.error('链接名称不能为空');
            return false;
        }
        if (!link) {
            Message.error('链接地址不能为空');
            return false;
        }
        let {value=[],constraint,onChange} = this.props;
        value.push({text, link});
        this.setState({text:"", link:""},()=>onChange(constraint, value));
    };

    handleClose(index){
        let {value,onChange,constraint}=this.props;
        value.splice(index,1);
        onChange(constraint, value);
    };

    render(){
        let {constraint,value=[]}=this.props;
        let {text,link}=this.state;
        return(
            <Layout.Row gutter="20" style={{margin:"8px 0"}}>
                <Layout.Col span="2" style={{fontWeight: 'bold'}}>
                    {this.props.modelSet && <Button type="primary" size='mini' onClick={this.props.modelOnChenge}>设置</Button>}
                    {constraint.title?constraint.title:<br/>}
                </Layout.Col>
                <Layout.Col span="22">
                    <Layout.Row gutter="20">
                        <Layout.Col span="10">
                            <Input placeholder='请输入链接名称...' value={text} onChange={value=>this.change({value,type:'text'})}/>
                        </Layout.Col>
                        <Layout.Col span="10">
                            <Input placeholder='请输入链接路径...' value={link} onChange={value=>this.change({value,type:'link'})}/>
                        </Layout.Col>
                        <Layout.Col span="4">
                            <Button onClick={this.submission} type='info'>确定提交</Button>
                        </Layout.Col>
                    </Layout.Row>
                    <Layout.Row gutter="20" style={{margin:'10px 0 0',cursor:'pointer'}}>
                        <Layout.Col span="24">
                            {value.map((item, index) => {
                                return(
                                    <Tag key={Math.random()} closable={true} closeTransition={false} type='primary'
                                         onClose={this.handleClose.bind(this, index)} style={{margin:"0 10px 0 0",fontSize: '14px'}}>
                                        <span onClick={()=>{
                                            ipcRenderer.send("addTab", item.link);
                                        }}>{item.text}</span>
                                    </Tag>
                                )
                            })}
                        </Layout.Col>
                    </Layout.Row>
                </Layout.Col>

            </Layout.Row>
        )
    }
}

export default AddLinkModule;
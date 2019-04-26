/**
 * Created by 石英 on 2018/9/1 0001下午 4:38.
 */
import '../../../../../styles/component/react_assembly/editBox.css';
import React from 'react';
import {Layout,Radio,Input} from 'element-react';
import 'element-theme-default';

class SignModule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    selectFlag(value){
        this.props.flagChange(value);
    };

    remarksChange(value){
        this.props.remarksChange(value);
    }

    render(){
        let sign=[
            {value:"1",style:"red"}, {value:"2",style:"orange"},
            {value:"3",style:"yellow"}, {value:"4",style:"green"},
            {value:"5",style:"cyan"}, {value:"6",style:"blue"},
            {value:"7",style:"violet"}, {value:"8",style:"white"},
            {value:"9",style:"black"}, {value:"10",style:"deeppink"},
            {value:"11",style:"brown"}
        ];
        let {flag,remarks}=this.props;
        return(
            <div>
                <Layout.Row gutter="20" style={{margin:"10px 0"}}>
                    <Layout.Col span="2" style={{fontWeight: 'bold'}}>
                        标记
                    </Layout.Col>
                    <Layout.Col span="22">
                        <Radio.Group value={flag} onChange={this.selectFlag.bind(this)}>
                            {sign.map((item, i)=> {
                                return (
                                    <Radio key={`type${i}`} value={item.value} style={{margin:'0 30px 0 0'}}>
                                        <i className={`${item.style} iconfont`}>&#xe624;</i>
                                    </Radio>
                                );
                            })}
                        </Radio.Group>
                    </Layout.Col>
                </Layout.Row>
                <Layout.Row gutter="20" style={{margin:"10px 0"}}>
                    <Layout.Col span="2" style={{fontWeight: 'bold'}}>
                        备注
                    </Layout.Col>
                    <Layout.Col span="22">
                        <Input type="textarea" placeholder='请输入备注信息...' value={remarks}
                               onChange={this.remarksChange.bind(this)} rows='3'/>
                    </Layout.Col>
                </Layout.Row>
            </div>
        )
    }
}

export default SignModule;
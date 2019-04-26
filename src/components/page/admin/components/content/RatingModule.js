/**
 * Created by 石英 on 2018/11/14 0014下午 3:00.
 */

import React from 'react';
import {Layout,Rate,Button} from 'element-react';
import 'element-theme-default';


class RatingModule extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            rateValue:0,
            is:true,
        }
    }

    ratingChange = (value) => {
        let {constraint,onChange}=this.props;
        this.setState({rateValue:value,is:false},()=>onChange(constraint, value));
    };

    render() {
        let {rateValue,is}=this.state,{constraint,value=0,modelSet,modelOnChenge} = this.props,obj={};
        if(rateValue!=value&&is){
            Object.assign(obj,{value:value});
        }
        return (
            <Layout.Row gutter="20" style={{margin:"5px 0 15px"}}>
                <Layout.Col span="2" style={{fontWeight: 'bold'}}>
                    {modelSet && <Button type="primary" size='mini' onClick={modelOnChenge}>设置</Button>}
                    {constraint.title}
                </Layout.Col>
                <Layout.Col span="22">
                    <Rate max={10} {...obj} onChange={(value)=>this.ratingChange(value)} showText={true}
                          texts={['1分','2分','3分','4分','5分','6分','7分','8分','9分','10分']}/>
                    <div style={{marginTop: '6px', fontSize: '12px', color: '#999'}}>
                        <a href='https://img.alicdn.com/tfs/TB1nRS5OVXXXXayapXXXXXXXXXX-926-236.jpg' target="_blank">打分标准</a>
                    </div>
                </Layout.Col>
            </Layout.Row>
        );
    }
}

export default RatingModule;
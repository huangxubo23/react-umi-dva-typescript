/**
 * Created by shiying on 17-7-28.
 */

import React from 'react';
import {Layout,Radio} from 'element-react';
import 'element-theme-default';

class TypeTabModule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    selectTypeTab(value){
        this.props.typeTabChange(value);
    };

    render(){
        let typeTabRadioArr = ["潮女", "潮男", "美妆", "母婴", "户外", "数码", "家居", "文体", "汽车", "美食"];
        let {typeTab}=this.props;
        return(
            <Layout.Row gutter="20" style={{margin:"8px 0"}}>
                <Layout.Col span="2" style={{fontWeight: 'bold'}}>
                    类别
                </Layout.Col>
                <Layout.Col span="22">
                    <Radio.Group value={typeTab} onChange={this.selectTypeTab.bind(this)}>
                        {typeTabRadioArr.map((item, i)=> {
                            return (
                                <Radio key={`type${i}`} value={item}>
                                    {item}
                                </Radio>
                            );
                        })}
                    </Radio.Group>
                </Layout.Col>
            </Layout.Row>
        )
    }
}

export default TypeTabModule;
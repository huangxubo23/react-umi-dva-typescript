/**
 * Created by 石英 on 2018/11/2 0002上午 9:43.
 */

import React from 'react';
import {Layout,Radio} from 'element-react';
import 'element-theme-default';

class OriginalStatementModule extends React.Component {
    render() {
        let {originalStatement=2,originalStatementChange}=this.props;
        return (
            <Layout.Row gutter="20" style={{margin:"8px 0"}}>
                <Layout.Col span="2" style={{fontWeight: 'bold'}}>
                    是否原创声明
                </Layout.Col>
                <Layout.Col span="22">
                    <Radio.Group value={originalStatement} onChange={(value)=>{
                        originalStatementChange(value)
                    }}>
                        <Radio value={1}>
                            是
                        </Radio>
                        <Radio value={2}>
                            否
                        </Radio>
                    </Radio.Group>
                </Layout.Col>
            </Layout.Row>
        );

    }
}

export default OriginalStatementModule;
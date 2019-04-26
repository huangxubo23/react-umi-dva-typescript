/**
 * Created by 石英 on 2018/11/2 0002上午 9:11.
 */

import React from 'react';
import {Layout,Button} from 'element-react';
import 'element-theme-default';

const TextModule=(props)=>{
    return(
        <Layout.Row gutter="20" style={{margin:"8px 0"}}>
            <Layout.Col span="2" style={{fontWeight: 'bold'}}>
                {props.modelSet && <Button type="primary" size='mini' onClick={props.modelOnChenge}>设置</Button>}
                {props.constraint.title}
            </Layout.Col>
            <Layout.Col span="22">
                <div style={{
                    fontWeight:'bold',
                    padding:'2px',
                }}>
                    {props.constraint.props.value}
                </div>
            </Layout.Col>
        </Layout.Row>
    )
};

export default TextModule;
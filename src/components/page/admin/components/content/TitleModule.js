/**
 * Created by muqingzhong on 2017/7/30.
 */
import React from 'react';
import {Layout} from 'element-react';
import 'element-theme-default';

const TitleModule=(props)=>{
    return(
        <Layout.Row gutter="20" style={{margin:"8px 0"}}>
            <Layout.Col span="2" style={{fontWeight: 'bold'}}>
                <br/>
            </Layout.Col>
            <Layout.Col span="22">
                <div style={{
                    minHeight: '20px',
                    padding: '9px',
                    marginBottom: '20px',
                    backgroundColor: '#f5f5f5',
                    border: '1px solid #e3e3e3',
                    borderRadius: '6px',
                    WebkitBoxShadow: 'inset 0 1px 1px rgba(0, 0, 0, .05)',
                    boxShadow: 'inset 0 1px 1px rgba(0, 0, 0, .05)'
                }}>
                    <h4>{props.constraint.props.text}</h4>
                </div>
            </Layout.Col>
        </Layout.Row>
    )
};

export default TitleModule;
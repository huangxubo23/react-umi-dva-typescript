/**
 * Created by 石英 on 2018/10/16 0016下午 2:24.
 */

import React from 'react';
import $ from 'jquery';
import {ThousandsOfCall} from "../../../../../components/lib/util/ThousandsOfCall";
import StringModule from "./StringModule";
import HintShow from './Hint';
import {MyAutoComplete} from '../../components/PersonSelection';
import {Layout,Input,Button,Dialog} from 'element-react';
import 'element-theme-default';

class CreatorAddTagModule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render(){
        let {constraint}=this.props;
        console.log(constraint);
        return(
            <Layout.Row gutter="20" style={{margin:"8px 0"}}>
                <Layout.Col span="2" style={{fontWeight: 'bold'}}>
                    {constraint.title?constraint.title:"添加标签"}
                </Layout.Col>
                <Layout.Col span="22">
                    <div style={{fontSize:'12px',fontWeight:400}}>
                        根据您写的内容进行标签推荐，点击下方按钮获取标签
                    </div>
                </Layout.Col>
            </Layout.Row>
        )
    }
}

export default CreatorAddTagModule;
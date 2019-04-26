/**
 * Created by shiying on 17-7-28.
 */

import React from 'react';
import {Layout,Radio,Button} from 'element-react';
import 'element-theme-default';
import '../../../../../styles/addList/content.css';

class RadioGroupModule extends React.Component {
    static hint = (data, props) => {

    };

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        let {constraint,onChange,value} = this.props;
        if(constraint&&!value){
            onChange(constraint, constraint.props.value);
        }
    }

    selectTypeTab = (value) => {
        let {onChange,constraint}=this.props;
        onChange(constraint, value);
    };

    render() {
        let {constraint,value} = this.props;
        return (
            <Layout.Row gutter="20" className="addContentComponent">
                <Layout.Col span="2">
                    {this.props.modelSet && <Button type="primary" size='mini' onClick={this.props.modelOnChenge}>设置</Button>}
                    {constraint.title?constraint.title:'商品||spu'}
                </Layout.Col>
                <Layout.Col span="22">
                    <Radio.Group value={value} onChange={this.selectTypeTab}>
                        {(constraint.props.dataSource ? constraint.props.dataSource : []).map(item=> {
                            return (
                                <Radio key={item.value} value={item.value}>
                                    {item.label}
                                </Radio>
                            );
                        })}
                    </Radio.Group>
                </Layout.Col>
            </Layout.Row>
        );
    }
}


export default RadioGroupModule;
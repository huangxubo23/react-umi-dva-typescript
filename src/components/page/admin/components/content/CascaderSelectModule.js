/**
 * Created by shiying on 17-7-28.
 */

import React from 'react';
import { Cascader,Layout,Button} from 'element-react';
import 'element-theme-default';

class CascaderSelectModule extends React.Component{
    constructor(props) {
        super(props);
        let [...option]=this.props.constraint.props.dataSource;
        this.state = {
            options:option,
            selectedOptions:[]
        }
    }

    static  hint() {
        return [];
    }

    componentDidUpdate() {
        let v = this.props.value,defaultClass=true;
        let {selectedOptions}=this.state;
        let {dataSource,dataSourceValue,childrenvalue} = this.props.constraint.props;
        if(selectedOptions.length<1||v!==selectedOptions[1]){
            for (let s in dataSource) {//切换模板默认
                let children = dataSource[s].children;
                for (let d in children) {
                    let value = children[d].value;
                    if (value == v) {
                        defaultClass=false;
                        this.setState({selectedOptions: [dataSource[s].value,children[d].value]});
                    }
                }
            }
            if(defaultClass&&!v){//空默认
                if(dataSourceValue&&childrenvalue){
                    this.setState({selectedOptions: [dataSourceValue,childrenvalue]},()=>{
                        let hint = CascaderSelectModule.hint(childrenvalue, this.props.constraint.props);
                        this.props.onChange(this.props.constraint, childrenvalue, hint);
                    });
                }
            }
        }
    }
    componentWillMount(){//空默认
        let {value}=this.props;
        let {dataSourceValue,childrenvalue,dataSource}=this.props.constraint.props;
        if(!value){
            if(dataSourceValue&&childrenvalue){
                this.setState({selectedOptions: [dataSourceValue,childrenvalue]},()=>{
                    let hint = CascaderSelectModule.hint(childrenvalue, this.props.constraint.props);
                    this.props.onChange(this.props.constraint, childrenvalue, hint);
                });
            }
        }else {
            this.setState({selectedOptions:this.matching(dataSource,value)});
        }
    }

    matching=(data,value,arr=[])=>{
        data.forEach(item=>{
            item.children.forEach(sonItem=>{
                if(sonItem.value==value){
                    arr.push(item.value,sonItem.value);
                }
            })
        });
        return arr;
    };

    cascaderChange=(data)=>{//改变
        let hint = CascaderSelectModule.hint(data[1], this.props.constraint.props);
        this.props.onChange(this.props.constraint, data[1], hint);
    };


    render() {
        let {constraint} = this.props;
        let {options,selectedOptions}=this.state;
        return (
            <Layout.Row gutter="20" style={{margin:"5px 0 15px"}}>
                <Layout.Col span="2" style={{fontWeight: 'bold'}}>
                    {this.props.modelSet && <Button type="primary" size='mini' onClick={this.props.modelOnChenge}>设置</Button>}
                    {constraint.title}
                </Layout.Col>
                <Layout.Col span="22">
                    <Cascader options={options} value={selectedOptions} onChange={this.cascaderChange}/>
                </Layout.Col>

            </Layout.Row>
        );
    }
}

export default CascaderSelectModule;
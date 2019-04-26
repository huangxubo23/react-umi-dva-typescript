/**
 * Created by shiying on 17-7-28.
 */

import React from 'react';
import HintShow from './Hint';
import {Layout,Tag,Tabs,Checkbox,Button} from 'element-react';
import 'element-theme-default';

class TagPickerModule extends React.Component {//标签选择器

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    selectClassification = (item) => {
        let isChecked = item.v;
        let value = item.value;
        let data = this.props.value;
        data = data ? data : [];
        let o = data.indexOf(value);
        if (isChecked) {
            if (o < 0) {
                data.push(value);
            }
        } else {
            if (o >= 0) {
                data.splice(o, 1);
            }
        }
        let hint = TagPickerModule.hint(data, this.props.constraint.props);
        this.props.onChange(this.props.constraint, data, hint);
    };

    static hint = (data, props) => {
        let hint = undefined;
        let meet = true;
        let min = props.min;
        let max = props.max;
        data = data ? data : [];
        if (min && min > data.length) {
            meet = false;
            hint = "不能少于" + min + "个分类";
        } else if (max && max < data.length) {
            meet = false;
            hint = "不能大于" + max + "个分类";
        }
        return [{meet: meet, text: hint, value: data.length, title: "标签数量"}];
    };
    chosen = (allValue) => {
        let chosen = [];
        let classification = this.props.value;
        classification = classification ? classification : [];
        for (let i in allValue) {
            let nc = allValue[i];
            for (let z = 0; z < nc.length; z++) {
                for (let j in classification) {
                    if (classification[j] == nc[z].value) {
                        chosen.push({label:nc[z].label,value:nc[z].value});
                    }
                }
            }
        }
        return chosen;
    };

    handleClose=(i)=>{
        let {value} = this.props;
        let o = value.indexOf(i);
        if (o < 0) {
            value.push(value);
        }else {
            value.splice(o, 1);
        }
        let hint = TagPickerModule.hint(value, this.props.constraint.props);
        this.props.onChange(this.props.constraint, value, hint);
    };

    render() {
        let {constraint} = this.props;
        let data = this.props.value;
        let pas = [];
        let dataSource = {};
        for (let i in constraint.props.dataSource) {
            if(constraint.props.dataSource[i].constructor===Array){
                pas.push(i);
                dataSource[i] = (constraint.props.dataSource[i]);
            }

        }


        return (
            <Layout.Row gutter="20" style={{margin:"8px 0"}}>
                <Layout.Col span="2" style={{fontWeight: 'bold'}}>
                    {this.props.modelSet && <Button type="primary" size='mini' onClick={this.props.modelOnChenge}>设置</Button>}
                    {constraint.title}
                </Layout.Col>
                <Layout.Col span="22">
                    <Tabs type="border-card" activeName={0}>
                        {pas.map((item, i) => {
                            return (
                                <Tabs.Pane label={item} name={i} key={"TagPicker-" + i}>
                                    {(dataSource[item]).map(value => {
                                        return (
                                            <Checkbox key={value.value}
                                                      checked={(data ? data : []).indexOf(value.value) >= 0}
                                                      onChange={v=>this.selectClassification({v,value:value.value})}
                                                      value={value.value} inline>
                                                :{value.label?value.label:value.title}
                                            </Checkbox>
                                        );
                                    })}
                                </Tabs.Pane>
                            )
                        })}
                    </Tabs>
                    <div style={{margin:'5px 0 15px'}}>
                        <span style={{padding:'3px',fontSize: '18px'}}>
                        已选择:
                        </span>
                        {this.chosen(dataSource).map(item => {
                            return (
                                <Tag
                                key={item.value}
                                closable={true}
                                type='primary'
                                closeTransition={false}
                                onClose={()=>{this.handleClose(item.value)}} style={{margin:'0 3px'}}>{item.label}</Tag>
                            )
                        })}
                    </div>
                    <HintShow hint={this.props.hint}/>
                </Layout.Col>
            </Layout.Row>
        );

    }
}

export default TagPickerModule;

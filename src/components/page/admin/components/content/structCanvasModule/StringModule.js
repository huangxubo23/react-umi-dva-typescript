/**
 * Created by shiying on 17-7-28.
 */

import React from 'react';
import {Select,Input} from 'element-react';
import 'element-theme-default';
import HintShow from './../../content/Hint';
import '../../../../../../styles/addList/content.css';

class NewPanel extends React.Component{
    render(){
        let {header}=this.props;
        return(
            <div style={{
                marginTop: "10px",
                marginBottom: '12px',
                backgroundColor: '#fff',
                border: '1px solid transparent',
                borderRadius: '4px',
                boxShadow: '0 1px 1px rgba(0, 0, 0, .05)',
                borderColor: '#ddd'
            }}>
                <div style={{
                    padding: '1px 10px',
                    borderBottom: '1px solid transparent',
                    borderTopLeftRadius: '3px',
                    borderTopRightRadius: '3px',
                    color: '#333',
                    backgroundColor: '#f5f5f5',
                    borderColor: '#ddd',
                }}>
                    <h5>{header}</h5>
                </div>
                <div style={{
                    padding: '10px',
                }}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

class StringModule extends React.Component {
    constructor(props) {
        super(props);
        let {value}=this.props;
        this.state = {
            value: value ? value : "",
            hint: [],
        }
    }

    change = ({value})=> {
        let {constraint,name,i,onChange}=this.props;
        this.setState({value});
        if (!constraint.enum) {
            let hint = StringModule.hint(value, constraint,i + 1,name);
            this.setState({hint,value},()=>onChange(value,name));
        }else {
            this.setState({value},()=>onChange(value,name));
        }
    };
    static hint = (data, props, i, n) => {
        data = data ? data : "";
        let titleHint = undefined;
        let meet = true;
        let minTitle = props.minLength;
        let maxTitle = props.maxLength;
        if (minTitle && minTitle > data.length) {
            meet = false;
            titleHint = "不能少于" + minTitle + "个字";
        } else if (maxTitle && maxTitle < data.length) {
            meet = false;
            titleHint = "不能大于" + maxTitle + "个字";
        }
        return [{
            meet: meet,
            value: data.length,
            title: "第" + i + "段落:" + props.title,
            text: titleHint,
            num: i,
            type: n
        }];
    };

    render() {
        let {constraint}=this.props,{value,hint}=this.state;
        return(
            <NewPanel header={constraint.title}>
                {constraint.enum ?<Select value={value} onChange={(value)=>this.change({value})} style={{width: "100%"}}>
                    {constraint.enum.map(el => {
                        return <Select.Option key={el.value} label={el} value={el}/>
                    })}
                </Select>:(constraint.maxLength>30?
                    <div>
                        <Input value={value} onChange={(value)=>this.change({value})} type="textarea"
                                   autosize={{ minRows: 4, maxRows: 5}} placeholder={constraint['ui:placeholder']}/>
                        <span> {`${(value ? value.length : 0)}/${(constraint.minLength ? constraint.minLength : 0)}/${constraint.maxLength}`}</span>
                    </div>:
                        <Input placeholder={constraint['ui:placeholder']} value={value} onChange={(value)=>this.change({value})}
                                   prepend={`${(value ? value.length : 0)}/${(constraint.minLength ? constraint.minLength : 0)}/${constraint.maxLength}`}/>
                )}
                <HintShow hint={hint}/>
            </NewPanel>
        )
    }
}

export default StringModule;

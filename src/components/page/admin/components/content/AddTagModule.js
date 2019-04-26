/**
 * Created by shiying on 17-7-28.
 */

import React from 'react';
import {Layout, Input, Tag, Button} from 'element-react';
import 'element-theme-default';
import HintShow from './Hint';

class AddTagModule extends React.Component {//新标签模块
    constructor(props) {
        super(props);
        this.state = {
            dynamicTags: [],
            inputVisible: false,
            inputValue: '',
            width: 66,
            editIndex: -1,
            editValue: '',
            editWidth: 0,
        }
    }

    componentDidUpdate() {
        let {value} = this.props;
        if (value && !Object.is(value, this.state.dynamicTags) && value.length > 0 && typeof value[0] == 'string') {
            this.setState({dynamicTags: value ? value : []});
        }
    }

    onKeyUp(e) {
        if (e.keyCode === 13) {
            this.handleInputConfirm();
        }
    }

    strLen = (str) => {//字节长度
        if (str == null) {
            return 0;
        }
        if (typeof str != "string") {
            str += "";
        }
        let len = str.replace(/[^\x00-\xff]/g, "01").length;
        return len * 6 > 66 ? len * 6 : 66;
    };

    onChange(value) {
        this.setState({inputValue: value, width: this.strLen(value)});
    }

    handleClose(index) {
        let {dynamicTags} = this.state;
        dynamicTags.splice(index, 1);
        this.setState({dynamicTags: dynamicTags}, () => {
            this.forceUpdate(dynamicTags);
        });
    }

    showInput() {
        this.setState({inputVisible: true}, () => {
            this.saveTagInput.focus();
        });
    }

    handleInputConfirm() {
        let {inputValue, dynamicTags} = this.state;
        if (inputValue) {
            dynamicTags.push(inputValue);
        }
        this.setState({inputVisible: false, inputValue: '', width: 66, dynamicTags: dynamicTags}, () => {
            this.forceUpdate(dynamicTags);
        })
    }

    forceUpdate = (dynamicTags) => {
        let {constraint, onChange} = this.props;
        let hint = AddTagModule.hint(dynamicTags, constraint.props);
        onChange(constraint, dynamicTags, hint);
    };

    handleInputConfirmEdit = (index) => {
        let {editValue, dynamicTags} = this.state;
        if (editValue) {
            dynamicTags.splice(index, 1, editValue);
        }
        this.setState({editIndex: -1, editValue: '', dynamicTags: dynamicTags}, () => {
            this.forceUpdate(dynamicTags);
        })
    };

    static hint = (data = [], props) => {
        let hints = [], hint = undefined, meet = true;
        let {min, max} = props;
        if (min && min > data.length) {
            meet = false;
            hint = "不能少于" + min + "个标签";
        } else if (max && max < data.length) {
            meet = false;
            hint = "不能大于" + max + "个标签";
        }
        for (let i in data) {
            let hintLength = undefined, meetLength = true;
            let {minLength, maxLength} = props;
            let j = parseInt(i) + 1;
            if (minLength && minLength > data[i].length) {
                meetLength = false;
                hintLength = "第" + j + "个标签不能少于" + minLength + "个字";
            } else if (maxLength && maxLength < data[i].length) {
                meetLength = false;
                hintLength = "第" + j + "个标签不能大于" + maxLength + "个字";
            }
            hints.push({meet: meetLength, text: hintLength, value: data[i].length, title: "标签字数"});
        }
        hints.push({meet: meet, text: hint, value: data.length, title: "标签数量"});
        return hints;
    };

    edit = (index, value) => {
        this.setState({editIndex: index, editValue: value, editWidth: this.strLen(value) + 28}, () => {
            this.dynamicTagInput.focus();
        });
    };

    render() {
        let {constraint, hint} = this.props;
        let {dynamicTags, inputVisible, inputValue, width, editValue, editWidth} = this.state;
        return (
            <Layout.Row gutter="20" style={{margin: "8px 0"}}>
                <Layout.Col span="2" style={{fontWeight: 'bold'}}>
                    {this.props.modelSet && <Button type="primary" size='mini' onClick={this.props.modelOnChenge}>设置</Button>}
                    {constraint.title}
                </Layout.Col>
                <Layout.Col span="22">
                    <div>
                        {dynamicTags.map((tag, index) => {
                            if (index === this.state.editIndex) {
                                return (
                                    <Input key={index}
                                           style={{width: `${editWidth}px`, margin: '0 6px'}}
                                           value={editValue}
                                           ref={e => this.dynamicTagInput = e}
                                           size="mini"
                                           onChange={(value) => {
                                               this.setState({
                                                   editValue: value,
                                                   editWidth: this.strLen(value) + 28
                                               }, () => {
                                                   this.dynamicTagInput.focus();
                                               })
                                           }}
                                           onKeyUp={(e) => {
                                               if (e.keyCode === 13) {
                                                   this.handleInputConfirmEdit(index);
                                               }
                                           }}
                                           onBlur={() => this.handleInputConfirmEdit(index)}
                                    />
                                )
                            } else {
                                return (
                                    <React.Fragment key={index}>
                                        <Button size="mini" icon="edit" type="info"
                                                onClick={() => this.edit(index, tag)}> </Button>
                                        <Tag
                                            closable={true}
                                            closeTransition={false}
                                            type='gray'
                                            onClose={this.handleClose.bind(this, index)}
                                            style={{margin: "0 10px 0 0", fontSize: '14px'}}>{tag}</Tag>
                                    </React.Fragment>
                                )
                            }
                        })}
                        {inputVisible ? (
                            <Input key={"add"}
                                   style={{width: `${width + 28}px`}}
                                   className="input-new-tag"
                                   value={inputValue}
                                   ref={e => this.saveTagInput = e}
                                   size="mini"
                                   onChange={this.onChange.bind(this)}
                                   onKeyUp={this.onKeyUp.bind(this)}
                                   onBlur={this.handleInputConfirm.bind(this)}
                            />
                        ) : <Button className="button-new-tag" size="mini"
                                    onClick={this.showInput.bind(this)}>添加标签</Button>}
                    </div>
                </Layout.Col>
                <Layout.Col span="24">
                    <HintShow hint={hint}/>
                </Layout.Col>
            </Layout.Row>
        );

    }
}

export default AddTagModule;

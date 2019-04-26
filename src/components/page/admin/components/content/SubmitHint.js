/**
 * Created by shiying on 17-7-31.
 */

import React from 'react';
import HintShow from "./Hint";
import {Dialog,Button, Layout, Alert, Checkbox} from "element-react";
import 'element-theme-default';
import  StringModule from "./StringModule"
import  ItemModule from "./ItemModule"
import AnchorImageListModule from './AnchorImageListModule'
import ImgModule from './ImgModule'
import AddTagModule from './AddTagModule'
import TagPickerModule from './TagPickerModule'
import EditModule from './EditModule'
import '../../../../../styles/addList/content.css';
import {ajax} from '../../../../lib/util/ajax';
import {getUrlPat} from  '../../../../lib/util/global';
const Ajax = ajax.ajax;

class SubmitHint extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            contentId: '',//根据contentId判断有没有下一步按钮
        };
        this.open = this._open.bind(this);
        this.close = this._close.bind(this);
    }

    sy = ()=> {
        Ajax({
            url: "/content/admin/content/domain.content.count.by.org.day.io", callback: (data)=> {
                this.setState({sy: data.sy, jurisdiction: data.jurisdiction});
            }
        })
    };

    _open = (submitData, contentId) => {
        let {constraint,contentData,onChange,nameList}=this.props;
        this.setState({show: true, submit: submitData, contentId: contentId ? contentId : ''}, ()=> {
            this.sy();
        });
        (nameList?nameList:constraint).forEach(content => {
            let item=nameList?constraint.constraint[content.name]:content;
            let {type,name} = item;
            let data = contentData[name] ? contentData[name].value : undefined;
            let hint;
            if (type == "Input") {
                hint = StringModule.hint(data, item.props);
            } else if (type == "CreatorAddItem") {
                hint = ItemModule.hint(data, item.props);
            } else if (type == "AnchorImageList") {
                hint = AnchorImageListModule.hint(data, item.props);
            } else if (type == "CreatorAddImage") {
                hint = ImgModule.hint(data, item.props);
            } else if (type == "AddTag") {
                hint = AddTagModule.hint(data, item.props);
            } else if (type == "TagPicker") {
                hint = TagPickerModule.hint(data, item.props);
            } else if (type == "Editor") {
                hint = EditModule.hint(data, item.props);
            }
            onChange(item, data, hint);
        });

    };

    _close = () => {
        this.setState({show: false});
    };

    submit = ()=> {
        this.state.submit();
    };

    submitAndRevolution = ()=> {
        let contentId = this.state.contentId;
        if (contentId) {
            this.state.submit(contentId);
        }
    };

    timeCardAddChange = (value)=> {
        this.props.timeCardAddChange(value);
    };

    render() {
        let {show,sy,jurisdiction,contentId}=this.state;
        let {constraint,hint,timeCardAdd,nameList} = this.props;
        let url = window.location.href;
        let id = getUrlPat(url, 'id');
        let alert=sy>10?{type:'success',title:`你的组织当天还有${sy}条免费创建额度`}:(sy>0?{type:'warning',title:`你的组织当天还有${sy}条免费创建额度`}:
            (sy===0?{type:'error',title:`您的组织今天已经没有免费创建额度了，请勾选点卡创建`}:{type:'error',title:`暂未获取到免费创建额度条数，请确认账号登录是否失效`}));
        return(
            <div style={{textAlign:'left'}}>
                <Dialog title="提交校验" size="small" visible={show} onCancel={this.close} closeOnClickModal={false}>
                    <Dialog.Body>
                        <Layout.Row gutter="10">
                            {(nameList?nameList:(constraint ? constraint : [])).map((content, t)=> {
                                let con=nameList?constraint.constraint[content.name]:content;
                                let name = con.name;
                                if (hint[name] && hint[name].length > 0) {
                                    return (
                                        <Layout.Col span="12" key={name}>
                                            <NewPanel header={con.title}>
                                                <HintShow hint={hint[name]} meetIsShow={true}/>
                                            </NewPanel>
                                        </Layout.Col>
                                    );
                                }
                            })}
                        </Layout.Row>
                        <div className="clearfix"> </div>
                        <Alert title={alert.title} type={alert.type} style={{marginBottom:'18px'}}/>
                        {jurisdiction && <Checkbox checked={timeCardAdd} onChange={this.timeCardAddChange}>
                            如果没有额度自动使用点卡创建内容(每次扣除7个点卡)
                        </Checkbox>}
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Button onClick={this.close}>取消</Button>
                        {(contentId && id)&&<Button type="success" onClick={this.submitAndRevolution}>提交并转到下一步骤</Button>}
                        <Button type="primary" onClick={this.submit}>确定</Button>
                    </Dialog.Footer>
                </Dialog>
            </div>
        )
    }
}

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
                borderColor: '#bce8f1'
            }}>
                <div style={{
                    padding: '1px 10px',
                    borderBottom: '1px solid transparent',
                    borderTopLeftRadius: '3px',
                    borderTopRightRadius: '3px',
                    color: '#4E7B8F',
                    backgroundColor: '#d9edf7',
                    borderColor: '#bce8f1',
                }}>
                    <h4>{header}</h4>
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

export default SubmitHint;
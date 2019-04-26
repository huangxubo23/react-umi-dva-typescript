/**
 * Created by 石英 on 2018/12/22 0022上午 11:16.
 */

import React from 'react';
import {Layout,Button} from 'element-react';
import ReactDOM from 'react-dom';
//import { DragSource } from 'react-dnd';
import 'element-theme-default';
import $ from 'jquery';
import AtlasImageListDialog from './AtlasImageListDialog/AtlasImageListDialog'

class AtlasImageListModule extends React.Component{
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    static hint = (data=[], props) => {
        return []
    };

    componentDidMount(){
        this.sort();
    }

    sort=()=>{
        $(ReactDOM.findDOMNode(this)).find("#atlasSortable").sortable().disableSelection().unbind("sortstop").on("sortstop", (event, ui) => {
            let items = ui.item;
            let index = items.data("i");
            let w = items.width()+10;
            let h = items.height()+20;
            let top = ui.position.top;//当前的位置
            let left = ui.position.left;
            let originalTop = ui.originalPosition.top;//元素的原始位置
            let originalLeft = ui.originalPosition.left;
            let paW = $("#atlasSortable").width();
            let lineNum = Math.round(paW / w);
            let sl = Math.round((left - originalLeft) / w);
            sl += Math.round((top - originalTop) / h) * lineNum;

            let {value,constraint,onChange} = this.props;
            let albIt = value[index];
            value.splice(index, 1);
            value.splice(index + sl, 0, albIt);
            onChange(constraint, value, []);
        });
    };

    addAtlasImage=()=>{
        this.setState({callback:this.addCallback},()=>{
            this.atlasImageListDialog.open({type:'add'});
        })
    };

    addCallback=(data)=>{
        let {value=[],constraint,onChange} = this.props;
        value.push(data);
        let hint = AtlasImageListModule.hint(value, constraint.props);
        onChange(constraint, value, hint);
    };

    componentDidUpdate(){
        this.sort();
        let {value}=this.props;
        if(value) {
            value.forEach((item,index)=>{
                $(`.data-${index}`).hover(()=>{
                    $(`.value-${index}`).css({"display":"inline"});
                },()=>{
                    $(`.value-${index}`).css("display","none");
                });
            })
        }
    }

    editAtlasImage=({index})=>{
        let editCallback=(data)=>{
            let {value=[],constraint,onChange} = this.props;
            value.splice(index,1,data);
            let hint = AtlasImageListModule.hint(value, constraint.props);
            onChange(constraint, value, hint);
        };
        this.setState({callback:editCallback},()=>{
            this.atlasImageListDialog.open({type:'edit',data:this.props.value[index]});
        })
    };

    delAtlasImage=({index})=>{
        let {value=[],constraint,onChange} = this.props;
        value.splice(index,1);
        let hint = AtlasImageListModule.hint(value, constraint.props);
        onChange(constraint, value, hint);
    };

    render() {
        let {constraint,value=[]} = this.props,{callback}=this.state;
        let {maxAdd}=constraint.props.addImageProps;
        return (
            <div>
                <Layout.Row gutter="20" style={{margin:"5px 0 15px"}}>
                    <Layout.Col span="2" style={{fontWeight: 'bold'}}>
                        {this.props.modelSet && <Button type="primary" size='mini' onClick={this.props.modelOnChenge}>设置</Button>}
                        {constraint.title}
                    </Layout.Col>
                    <Layout.Col span="22">
                        <Layout.Row gutter="10">
                            {((value ? value.length : 0) < maxAdd) &&
                            <Layout.Col span="8" className="itemM_pic">
                                <img src="https://img.alicdn.com/imgextra/i1/772901506/TB2oeLpihhmpuFjSZFyXXcLdFXa_!!772901506.jpg" onClick={this.addAtlasImage}/>
                            </Layout.Col>}
                            <div id="atlasSortable">
                                {value.map((item,index)=>{
                                    if(item){
                                        return(
                                            <div style={{position:'relative',paddingLeft: '5px', paddingRight: '5px'}}
                                                 className={`el-col el-col-8 listItem data-${index}`} key={item.desc} data-i={index}>
                                                <img src={item.url[0]} width="100%"/>
                                                <div style={{margin:'0 10px'}}>
                                                    <span style={{fontWeight: 'bold',fontSize: '14px',color:'black'}}>{item.resourceFeatures.picTab}</span>
                                                    <div style={{
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        overflow: "hidden",
                                                        display: "block",
                                                        color:"rgb(162, 162, 162)",
                                                        fontSize: '12px'
                                                    }}>{item.desc}</div>
                                                </div>
                                                <div style={{position:'absolute',bottom:0,width:'100%',display:'none',marginRight:'10px'}}
                                                     className={`value-${index}`}>
                                                    <Layout.Row>
                                                        <Layout.Col span="12">
                                                            <Button className="el-icon-edit" style={{width: '100%'}} type="primary" size="mini"
                                                                    onClick={()=>this.editAtlasImage({index})}>编辑</Button>
                                                        </Layout.Col>
                                                        <Layout.Col span="12">
                                                            <Button className="el-icon-delete" style={{width: '100%'}} type="danger" size="mini"
                                                                    onClick={()=>this.delAtlasImage({index})}>删除</Button>
                                                        </Layout.Col>
                                                    </Layout.Row>
                                                </div>
                                            </div>
                                        )
                                    }
                                })}
                            </div>
                            {/*{value.map((item,index)=>{
                                return(
                                    <Layout.Col span="8" style={{position:'relative'}} className={`data-${index}`} key={index}>
                                        <img src={item.url[0]} width="100%"/>
                                        <div style={{margin:'0 10px'}}>
                                            <span style={{fontWeight: 'bold',fontSize: '14px'}}>{item.resourceFeatures.picTab}</span>
                                            <div style={{
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                overflow: "hidden",
                                                display: "block",
                                                color:"rgb(162, 162, 162)",
                                                fontSize: '12px'
                                            }}>{item.desc}</div>
                                        </div>
                                        <div style={{position:'absolute',bottom:0,width:'100%',display:'none',marginRight:'10px'}}
                                             className={`value-${index}`}>
                                            <Layout.Row>
                                                <Layout.Col span="12">
                                                    <Button className="el-icon-edit" style={{width: '100%'}} type="primary" size="mini"
                                                            onClick={()=>this.editAtlasImage({index})}>编辑</Button>
                                                </Layout.Col>
                                                <Layout.Col span="12">
                                                    <Button className="el-icon-delete" style={{width: '100%'}} type="danger" size="mini"
                                                            onClick={()=>this.delAtlasImage({index})}>删除</Button>
                                                </Layout.Col>
                                            </Layout.Row>
                                        </div>
                                    </Layout.Col>
                                )
                            })}*/}
                        </Layout.Row>
                    </Layout.Col>
                </Layout.Row>
                <AtlasImageListDialog ref={e=>this.atlasImageListDialog=e} callback={callback} constraint={constraint}/>
            </div>
        );
    }
}

export default AtlasImageListModule;
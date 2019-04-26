/**
 * Created by shiying on 17-7-28.
 */

import React from 'react';
import {Layout} from 'element-react';
import 'element-theme-default';
import '../../../../../../styles/addList/content.css';
import {BundleLoading} from '../../../../../../bundle';
import UpIitem from 'bundle-loader?lazy&name=pc/trends_asset/components/lib/sharing/upload/upItem/app-[name]!../../../../../../components/lib/sharing/upload/UpItem';
import HintShow from '../../../components/content/Hint';

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

class ArrarModule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hint:[],
        }
    }

    showAddItem = () => {
        let callback = (item) => {
            let {constraint,pc,gb,onChange,name,value=[],i}=this.props;
            if(constraint.titleName){
                for(let p in pc){
                    if(pc[p].title==constraint.titleName){
                        onChange(item.title,p);
                        gb(item.title,p);
                    }
                }
            }
            value.push({
                coverUrl:item.coverUrl,
                title:item.title,
                itemId:item.itemId,
                detailUrl:item.detailUrl,
                item_pic:item.coverUrl,
                item_numiid:item.itemId,
                item_title:item.title,
                itemImages:item.images.map(item=>{
                    return {picUrl:item}
                }),
                nick:item.nick,
                materialId:item.materialId,
                itemPriceDTO:{
                    price:{
                        item_current_price: item.price,
                        item_price: item.price,
                    }
                }
            });
            let hint = ArrarModule.hint(value, constraint,i+1,name);
            this.setState({hint},()=>onChange(value,name));
        };
        this.setState({callback},this.upItemBundleLoading);

    };

    delAddItem = ({index}) => {
        let {value,constraint,i,name,onChange} = this.props;
        value.splice(index, 1);
        let hint = ArrarModule.hint(value,constraint,i+1,name);
        this.setState({hint},()=>onChange(value,name));
    };

    editItem = ({index}) => {
        let {value}=this.props;
        const callback = (item) => {
            let {constraint,i,name,onChange}=this.props;
            Object.assign(item,{
                item_pic:item.coverUrl,
                item_numiid:item.itemId,
                item_title:item.title,
                itemImages:item.images.map(item=>{
                    return {picUrl:item}
                }),
                itemPriceDTO:{
                    price:{
                        item_current_price: item.price,
                        item_price: item.price,
                    }
                }
            });
            value.splice(index, 1, item);
            let hint = ArrarModule.hint(value, constraint,i+1,name);
            this.setState({hint},()=>onChange(value,name));
        };
        this.setState({callback},()=>this.upItemBundleLoading(value[index]));
    };
    upItemBundleLoading=(data)=>{//添加商品热加载
        if (this.state.upItemFlag && this.addItemModal&&this.addItemModal.jd) {
            this.addItemModal.jd.open(data);
        } else {
            this.setState({upItemFlag: true}, () => {
                let upload = setInterval(() => {
                    let addItemModal = this.addItemModal;
                    if (addItemModal && addItemModal.jd) {
                        clearInterval(upload);
                        this.addItemModal.jd.open(data);
                    }
                }, 100);
            });
        }
    };
    static hint = (data, props,i,n) => {
        let hint = undefined;
        let meet = true;
        let min = props.maxItems;
        let max = props.minItems;
        data = data ? data : [];
        if (min && min > data.length) {
            meet = false;
            hint = "不能少于" + min + "个商品";
        } else if (max && max < data.length) {
            meet = false;
            hint = "不能大于" + max + "个商品";
        }
        return [{meet: meet, text: hint, value: data.length, title: "第" + i + "段落:商品数量",num:i,type:n}];
    };

    render() {
        let {constraint,value} = this.props,{hint,upItemFlag}=this.state;
        return(
            <NewPanel header={constraint.title}>
                <Layout.Row gutter="2">
                    {(value ? value.length : 0) < 1&&<Layout.Col span="6" className="itemM_pic">
                        <img src="https://img.alicdn.com/imgextra/i1/772901506/TB2oeLpihhmpuFjSZFyXXcLdFXa_!!772901506.jpg"
                             onClick={()=>this.showAddItem()}/>
                    </Layout.Col>}
                    {(value ? value : []).map((item,index)=>{
                        return(
                            <Layout.Col span="6" className="listItem" key={item.item_pic}>
                                <img src={item.item_pic} onClick={()=>this.editItem({index})} width="100%"/>
                                <div className="del" onClick={()=>this.delAddItem({index})}>
                                    删除
                                </div>
                            </Layout.Col>
                        )
                    })}
                </Layout.Row>
                {upItemFlag&&<BundleLoading load={UpIitem} size='full' ref={e=>this.addItemModal=e} choiceItemPool={this.props.choiceItemPool} categoryListApiQuery={this.props.categoryListApiQuery} activityId={this.props.categoryListApiQuery.activityId} callback={this.state.callback}/>}
                <HintShow hint={hint}/>
            </NewPanel>
        )
    }
}

export default ArrarModule;

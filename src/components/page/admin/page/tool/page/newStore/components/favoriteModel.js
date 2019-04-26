/**
 * Created by 薛荣晖 on 2018/12/14 0014上午 8:45.店铺新品排重收藏夹
 */

import React from "react";
import AJAX from '../../../../../../../lib/newUtil/AJAX';
import {Button, Card, Layout, Alert, Radio, Pagination, Input, Tag, Message} from "element-react";
import 'element-theme-default';

class Favorite extends React.Component {

    stateValue = () => {
        return {
            showModal: false,
            name: "",
            searchName: "",
            typeTab: "",
            typeTabList: "",
            itemList: {
                pageNow: 1,
                pageSize: 30,
                count: 20,
                collectionFolderList: [],
            },
            Choice: [],
            del: false,
        }
    };

    constructor(props) {
        super(props);
        this.state = this.stateValue();
    }


    selectType = (value) => {//单选框
        this.setState({typeTab: value});
    };

    selectTypeList = (value) => {//单选框
        this.setState({typeTabList: value});
    };

    clearButton = ({type}) => {//清空
        if (type == "add") {
            this.setState({name: ""});
        } else if (type == "list") {
            this.setState({searchName: ""});
        }
    };

    nameChange = (value) => {//输入框
        let v = value.replace("，", ",");
        this.setState({name: v});
    };

    searchNameChange = (value) => {//输入框搜索
        this.setState({searchName: value});
    };

    nameButton = () => {//添加店铺
        let {name, typeTab} = this.state;
        let na = name.split(",");
        this.FavoriteAjax.ajax({
            url: "/message/admin/content/addCollectionFolder.io",//要访问的后台地址
            data: {name: JSON.stringify(na), type: typeTab},//要发送的数据
            callback: () => {
                Message({
                    message: '添加成功',
                    type: 'success'
                });
            }
        })
    };

    searchNameButton = () => {
        this.getList();
    };

    getList = (num) => {//搜索店铺
        num = num ? num : 1;
        let {searchName, typeTabList} = this.state;
        this.FavoriteAjax.ajax({
            url: "/message/admin/content/queryCollectionFolderList.io",//要访问的后台地址
            data: {name: searchName, type: typeTabList, pageNow: num, pageSzie: 30},//要发送的数据
            callback: (data) => {
                this.setState({itemList: data});
            }
        })
    };

    delList = () => {//切换按钮 取消删除或店铺删除
        let del = !this.state.del;
        this.setState({del: del});
    };

    delShop = (id) => {//删除店铺
        this.FavoriteAjax.ajax({
            url: "/message/admin/content/delCollectionFolder.io",//要访问的后台地址
            data: {id: id},//要发送的数据
            callback: () => {
                Message({
                    message: '删除成功',
                    type: 'success'
                });
                this.getList(this.state.itemList.pageNow);
            }
        })
    };

    listChoice = (name) => {//添加店铺
        let {Choice} = this.state;
        if (Choice.indexOf(name) < 0) {
            Choice.push(name);
        } else {
            Message('已添加');
        }
        this.setState({Choice: Choice});
    };

    goPage = (num) => {
        this.getList(num);
    };


    delChoice = (i) => {//删除Alert店铺
        let {Choice} = this.state;
        Choice.splice(i, 1);
        this.setState({Choice: Choice});
    };

    submit = () => {//提交
        let {Choice} = this.state;
        let str = Choice.join(",");
        this.props.closeModal();
        this.props.callback(str);
    };

    render() {
        let {typeTab, typeTabList, name, searchName, itemList, Choice, del} = this.state;
        let {pageSize, count} = itemList;
        let typeTabRadioarr = ["潮女", "潮男", "美妆", "母婴", "户外", "数码", "家居", "文体", "汽车", "美食"];
        return (
            <AJAX ref={e => {
                this.FavoriteAjax = e
            }}>
                <div>
                    <Card className='box-card'>
                        <Alert title='增加店铺' type='success' closable={false}/>
                        <div style={{marginTop: '10px'}}>
                            <Layout.Row>
                                <Layout.Col span='5'>
                                    <span> 请选择一项(必选)：</span>
                                </Layout.Col>
                                <Layout.Col span='19'>
                                    {typeTabRadioarr.map((item) => {
                                        return (
                                            <div style={{float: 'left', marginRight: '2px'}}>
                                                <Radio key={item} value={item} size='small' onChange={(value) => {
                                                    this.selectType(value)
                                                }} checked={item == typeTab}>{item}</Radio>
                                            </div>
                                        );
                                    })}
                                </Layout.Col>
                            </Layout.Row>
                            <div style={{marginTop: '10px'}}>
                                <Input placeholder="请添加店铺掌柜旺旺名，多个请用逗号隔开" size='small' value={name} onChange={(value) => {
                                    this.nameChange(value)
                                }} onKeyDown={(event) => {
                                    if (event.keyCode == "13") {
                                        this.nameButton();
                                    }
                                }}
                                       prepend={<Button type="danger" icon="delete" onClick={() => {
                                           this.clearButton({type: 'add'})
                                       }}>清空</Button>}
                                       append={<Button type="info" icon="view" onClick={this.nameButton} disabled={(typeTab && name) ? false : true}>添加店铺</Button>}/>
                            </div>
                        </div>
                    </Card>

                    <div style={{marginTop: '30px'}}>
                        <Card className='box-card'>
                            <Alert title='收藏店铺列表' type='info' closable={false}/>
                            <div style={{marginTop: '10px'}}>
                                <Layout.Row>
                                    <Layout.Col span='5'>
                                        <span> 请选择一项(必选)：</span>
                                    </Layout.Col>
                                    <Layout.Col span='19'>
                                        {typeTabRadioarr.map((item) => {
                                            return (
                                                <div style={{float: 'left', marginRight: '2px'}}>
                                                    <Radio key={item} value={item} size='small' onChange={(value) => {
                                                        this.selectTypeList(value)
                                                    }} checked={item == typeTabList}>{item}</Radio>
                                                </div>
                                            );
                                        })}
                                    </Layout.Col>
                                </Layout.Row>
                                <div style={{marginTop: '10px'}}>
                                    <Layout.Row>
                                        <Layout.Col span='21'>
                                            <Input placeholder="请添加店铺掌柜旺旺名，多个请用逗号隔开" size='small' value={searchName} onChange={(value) => {
                                                this.searchNameChange(value)
                                            }} onKeyDown={(event) => {
                                                if (event.keyCode == "13") {
                                                    this.searchNameButton();
                                                }
                                            }}
                                                   prepend={<Button type="danger" icon="delete" onClick={() => {
                                                       this.clearButton({type: 'list'})
                                                   }}>清空</Button>}
                                                   append={<Button type="info" icon="view" onClick={this.searchNameButton} disabled={typeTabList ? false : true}>搜索</Button>}/>
                                        </Layout.Col>
                                        <Layout.Col span='3'>
                                            <Button size="small" type='danger' onClick={this.delList} disabled={itemList.collectionFolderList.length > 0 ? false : true}>{del ? "取消删除" : "店铺删除"}</Button>
                                        </Layout.Col>
                                    </Layout.Row>
                                </div>
                            </div>
                            <div style={{marginTop: "10px", float: 'left'}}>
                                {itemList.collectionFolderList.map((item, i) => {
                                    return (
                                        <div>
                                            <Button type="info" size="small" key={i} style={del ? {marginBottom: "10px"} : {marginRight: "20px", marginBottom: "10px"}}
                                                    onClick={() => {
                                                        this.listChoice(item.name)
                                                    }} disabled={Choice.indexOf(item.name) < 0 ? false : true}>{item.name}</Button>
                                            {del && <Button type="danger" size="small" style={{marginRight: "16px", marginBottom: "10px"}} onClick={() => {
                                                this.delShop(item.id)
                                            }} key={"i" + i}>删</Button>}
                                        </div>
                                    )
                                })}
                            </div>
                            {itemList.collectionFolderList.length > 0 &&
                            <div style={{textAlign: "center", marginTop: '50px'}}>
                                <Pagination layout="prev, pager, next" total={count} pageSize={pageSize} small={true} onCurrentChange={this.goPage}/>
                            </div>}
                            {itemList.collectionFolderList.length > 0 && <div style={{textAlign: "left", marginTop: '30px'}}>
                                <Alert type="info" closable={false} title='已选择(点击添加)：' description={
                                    Choice.map((item, i) => {
                                        return (
                                            <div>
                                                <Tag type="gray">{item}</Tag>
                                                <Button type="danger" size="mini" style={{marginLeft: "5px"}} onClick={() => {
                                                    this.delChoice(i)
                                                }}>删</Button>
                                            </div>
                                        )
                                    })
                                }>
                                </Alert>
                            </div>}
                        </Card>
                    </div>
                </div>
            </AJAX>
        );
    }
}

export default Favorite;
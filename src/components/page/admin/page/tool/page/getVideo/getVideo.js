
import React from 'react';
import $ from 'jquery';
import ReactChild from "../../../../../../lib/util/ReactChild";
import {Layout,Select,Button,Progress,Tag,Pagination,Loading} from 'element-react';
import 'element-theme-default';
import getSelectionOfPool from './components/getSelectionOfPool'

class GetVideo extends ReactChild {
    constructor(props) {
        super(props);
        this.state = {
            analysisContent:[{nested:'we', id:3734,poolName:'有好货增量商品池——B+C'}],
            analysis:'',
            nested:'',
            itemList:[],
            mods:undefined,
            Analysis:{},
            pager:{
                currentPage: 1,
                pageSize: 25,
                totalCount: 10000,
                totalPage: 100
            },
            speedNum:undefined,
            loading:false,
        }
    }

    componentDidMount() {

    }

    search=()=>{
        let {analysis,nested}=this.state;
        this.setState({loading:true},()=>{
            this.SelectionOfPool({nested,id:analysis});
        })
    };

    SelectionOfPool=(obj)=>{
        getSelectionOfPool.SelectionOfPool_html(obj,(msg)=>{
            this.setState({Analysis:msg},()=>{
                this.getDataPool(msg);
            });
        });
    };

    getDataPool=(msg)=>{
        getSelectionOfPool.SelectionOfPool_content(msg,(m)=>{
            let autions=m.mods.itemlist.data.auctions;
            this.setState({itemList:autions,pager:m.mods.pager.data,mods:m.mods,loading:false});
        })
    };

    fixedChange=(value)=>{
        let {analysisContent}=this.state,nested='';
        analysisContent.map((item)=>{
            if(item.id==value){
                nested=item.nested;
            }
        });
        this.setState({analysis:value,nested});
    };

    fixed=()=>{
        let {itemList}=this.state;
        getSelectionOfPool.item_htm(itemList,(list)=>{
            this.setState({itemList:list,speedNum:undefined});
        },(speedNum)=>{
            this.setState({speedNum:speedNum+1});
        });
    };

    goPage=(e)=>{
        let {pager,Analysis} = this.state;
        pager.currentPage = e;
        this.setState({pager: pager}, () => {
            if(Analysis['data-action']){
                delete Analysis['data-action'];
                Object.assign(Analysis,{"data-key":'s', "data-value": (e-1)*25,[Analysis['data-key']]:Analysis['data-value']});
            }else {
                Object.assign(Analysis,{"data-key":'s', "data-value": (e-1)*25});
            }
            this.getDataPool(Analysis);
        });
    };

    subClick=(env)=>{
        let value=$(env.target).data("value");
        let {Analysis} = this.state;
        Object.assign(Analysis,{
            'data-key': 'cat',
            'data-value': value,
            'data-action': 'add',
        });
        this.setState({Analysis:Analysis},()=>{
            this.getDataPool(Analysis);
        });
    };

    render() {
        let {analysisContent,analysis,itemList,pager,speedNum,mods,loading}=this.state;
        return (
            <NewPanel header='检测宝贝有无视频'>
                <Layout.Row gutter="6" style={{margin: "10px 0"}}>
                    <Layout.Col span="4">
                        <br/>
                    </Layout.Col>
                    <Layout.Col span="6">
                        <Select value={analysis} onChange={this.fixedChange} style={{width:'100%'}}>
                            <Select.Option label='请选择一个渠道' value={''}/>
                            {(analysisContent?analysisContent:[]).map((item) => {
                                return (
                                    <Select.Option label={item.poolName} value={item.id} key={item.id}/>
                                )
                            })}
                        </Select>
                    </Layout.Col>
                    <Layout.Col span="5">
                        <Button type="primary" onClick={this.search} style={{width:'100%'}}>搜索内容</Button>
                    </Layout.Col>
                    <Layout.Col span="5">
                        <Button type="info" onClick={this.fixed} disabled={!itemList.length>0} style={{width:'100%'}}>视频检测</Button>
                    </Layout.Col>
                    <Layout.Col span="4">
                        {''}
                    </Layout.Col>
                </Layout.Row>
                {loading&&<Loading text="拼命加载中">

                </Loading>}
                {speedNum&& <Layout.Row gutter="6">
                    <Layout.Col span="4">
                        <Tag type="success">检测进度</Tag>
                    </Layout.Col>
                    <Layout.Col span="4">
                        <Progress percentage={Math.floor(speedNum/itemList.length*100)} status={Math.floor(speedNum/itemList.length*100)>99?'success':''} />
                    </Layout.Col>
                </Layout.Row>}
                {itemList&&itemList.length>0&&<Layout.Row gutter="6" style={{marginTop:"6px"}}>
                    <Layout.Col span="24">
                        <NewPanel header=''>
                            <div style={{textAlign: "left",wordBreak: 'break-all',whiteSpace: 'normal'}}>
                                <span>
                                    相关分类：
                                </span>
                                {mods.nav.data.common.length>0&&mods.nav.data.common[0].sub.map((item)=>{
                                    return(
                                        <span key={item.value} style={{margin:'0 10px',cursor:"pointer"}} onClick={this.subClick} data-value={item.value}>
                                            {item.text}
                                        </span>
                                    )
                                })}
                            </div>
                        </NewPanel>
                    </Layout.Col>
                    {(itemList ? itemList : []).map((item, i) => {
                        return (
                            <Layout.Col span="4" key={i}>
                                <div className="thumbnail">
                                    <a href={item.detail_url.indexOf('http')>-0?item.detail_url:"https:"+item.detail_url} target="_blank">
                                        <img src={item.pic_url}/>
                                    </a>
                                    <div title={item.title} style={{overflow:'hidden', textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',color:"rgba(0, 78, 255, 0.66)",cursor:"pointer",margin: "10px 0"}} onClick={()=>{
                                        let url=item.detail_url.indexOf('http')>-0?item.detail_url:"https:"+item.detail_url;
                                        window.open(url)
                                    }}>
                                        {item.title}
                                    </div>
                                    <p style={{overflow:'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={item.nick}>￥{item.view_price}&emsp;{item.nick}</p>
                                    {item.video==1?<Tag type="success" style={{marginTop:"3px"}}>有视频</Tag>:
                                        (item.video==2?<Tag type="warning" style={{marginTop:"3px"}}>没有视频</Tag>:<Tag type="info" style={{marginTop:"3px"}}>未检测</Tag>)}
                                </div>
                            </Layout.Col>
                        )
                    })}
                    <Layout.Col span="24">
                        <div style={{textAlign: "center"}}>
                            <Pagination layout="total, prev, pager, next, jumper" total={pager.totalCount>2500?2500:pager.totalCount}
                                        pageSize={pager.pageSize} currentPage={pager.currentPage} onCurrentChange={this.goPage}/>
                        </div>
                    </Layout.Col>
                </Layout.Row>}
            </NewPanel>
        )
    }
}

class NewPanel extends React.Component {
    render() {
        let {header,children} = this.props;
        return (
            <div style={{
                marginTop: "10px",
                marginBottom: '12px',
                backgroundColor: '#fff',
                border: '1px solid transparent',
                borderRadius: '4px',
                boxShadow: '0 1px 1px rgba(0, 0, 0, .05)',
                borderColor: '#50bfff'
            }}>
                <div style={{
                    padding: '1px 10px',
                    borderBottom: '1px solid transparent',
                    borderTopLeftRadius: '3px',
                    borderTopRightRadius: '3px',
                    color: '#fff',
                    backgroundColor: '#50bfff',
                    borderColor: '#50bfff',
                }}>
                    <h5 style={{textAlign: 'center'}}>{header}</h5>
                </div>
                <div style={{
                    padding: '10px',
                }}>
                    {children}
                </div>
            </div>
        )
    }
}

export default GetVideo;
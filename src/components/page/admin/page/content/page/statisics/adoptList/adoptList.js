/**
 * Created by shiying on 18-3-2.
 */

import React from 'react';
import ReactChild from "../../../../../../../lib/util/ReactChild";
import {PersonSelection,NewPersonSelection} from '../../../../../components/PersonSelection';
import AJAX from '../../../../../../../lib/newUtil/AJAX.js';
import {BundleLoading} from '../../../../../../../../bundle';
import contentDetails from 'bundle-loader?lazy&name=pc/trends_asset/admin/content/statisices/adoptList/app-[name]!./components/contentDetails';//详细
import { Pagination,Loading ,Layout,DateRangePicker,Select,Button,Table} from 'element-react';
import 'element-theme-default';

class AdoptList extends ReactChild{
    constructor(props) {
        super(props);
        let typeL={1:"帖子", 2:"清单", 3:"单品", 4:"搭配", 7:"结构体"};
        let date = new Date();
        let dateEnd = new Date();
        date.setDate(date.getDate() - 7);
        this.state = {
            start: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
            end: dateEnd.getFullYear() + "-" + (dateEnd.getMonth() + 1) + "-" + dateEnd.getDate(),
            type:"",
            userId:0,
            adoptList:{
                count: 20,
                pageNow: 1,
                pageSize: 16,
                userPassingReteList:[]
            },
            columns:[{
                label: '人员',
                prop: 'manageId',
                render:(data)=>{
                    let m=PersonSelection.getManage(data['manageId'],()=>{
                        this.forceUpdate();
                    });
                    return <div>{m&&m.name}</div>
                }
            },{
                label: '类型',
                prop: 'contentType',
                render:(data)=>data.contentType?typeL[data.contentType]:"暂无"
            },{
                label: '审核次数',
                prop: 'auditNumber',
            },{
                label: '通过次数',
                prop: 'throughNumber',
            },{
                label: '通过率',
                prop: 'creator',
                render: (data)=>(((data.throughNumber*100)/data.auditNumber).toFixed(0))+"%"
            },{
                label: '操作',
                prop: 'count',
                render:(data)=>{
                    return <Button type="info" size="small" onClick={()=>this.details(data)}>每日详情</Button>;
                }
            }],
        }
    }

    componentDidMount() {
        this.getAdopt();
    }

    getAdopt=()=>{
        let {start,end,type,userId,adoptList}=this.state;
        this.adoptListAJAX.ajax({
            type: 'post',
            url: '/message/admin/passingRate/queryUserPassingRateList.io',
            data: {
                startDateTime: start,
                endDateTime: end,
                contentType:type,
                manageId:userId,
                pageNow: adoptList.pageNow,
                pageSize: 16,
            },
            callback: (adoptList) => {
                this.setState({adoptList})
            },
        })
    };

    selectType = (type) => {//type搜索
        this.setState({type},this.getAdopt)
    };

    selectManage=(userId)=>{
        this.setState({userId},this.getAdopt)
    };

    getList=(e)=>{
        let {adoptList}=this.state;
        adoptList.pageNow=e;
        this.setState({adoptList},this.getAdopt);
    };

    details=(item)=>{
        let {details}=this.state;
        if(details){
            this.contentDetails.jd.open(item);
        }else {
            this.setState({details:true},()=>{
                const timer = setInterval(()=>{
                    let jd = this.contentDetails.jd;
                    if(jd){
                      clearInterval(timer);
                        jd.open(item);
                    }
                },100);
            })
        }
    };

    bz_time=(arr,F,arr1=[])=>{//时间转换器
        if(F){
            for(let a in arr){
                let str=arr[a].split('-');
                arr1.push(new Date(str[0], str[1] - 1, str[2]));
            }
            return arr1;
        }else {
            for(let a in arr){
                let str=arr[a].getFullYear()+ "-" +(arr[a].getMonth() + 1) + "-" + arr[a].getDate();
                arr1.push(str);
            }
            return arr1;
        }
    };

    dateRangePickerChange=({newDate})=>{//时间改变步骤简写
        this.setState({
            start: newDate[0],
            end: newDate[1]
        },()=>{
            this.getAdopt();
        });
    };

    render(){
        let {adoptList,start,end,type,details,columns}=this.state;
        let timeValue=this.bz_time([start,end],true);
        return(
            <div>
                <NewPanel header="通过率统计">
                    <Layout.Row gutter="10" style={{margin: "8px 0"}}>
                        <Layout.Col span="2">
                            <br/>
                        </Layout.Col>
                        <Layout.Col span="7">
                            日期范围:
                            <DateRangePicker
                                value={timeValue}
                                placeholder="选择日期范围"
                                align="left"
                                ref={e=>this.dateRangePicker = e}
                                onChange={date=>{
                                    let newDate=this.bz_time(date);
                                    this.dateRangePickerChange({newDate});
                                }}
                                shortcuts={[{
                                    text: '最近7天',
                                    onClick: ()=> {
                                        const end = new Date();
                                        const start = new Date();
                                        end.setTime(end.getTime() + 3600 * 1000 * 24 );
                                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
                                        let newDate=this.bz_time([start,end]);
                                        this.dateRangePickerChange({newDate});
                                        this.dateRangePicker.togglePickerVisible();
                                    }
                                },{
                                    text: '最近15天',
                                    onClick: ()=> {
                                        const end = new Date();
                                        const start = new Date();
                                        end.setTime(end.getTime() + 3600 * 1000 * 24 );
                                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 14);
                                        let newDate=this.bz_time([start,end]);
                                        this.dateRangePickerChange({newDate});
                                        this.dateRangePicker.togglePickerVisible();
                                    }
                                }, {
                                    text: '最近一个月',
                                    onClick: ()=> {
                                        const end = new Date();
                                        const start = new Date();
                                        end.setTime(end.getTime() + 3600 * 1000 * 24 );
                                        start.setTime(start.getTime() + 3600 * 1000 * 24);
                                        start.setMonth(start.getMonth()-1);
                                        let newDate=this.bz_time([start,end]);
                                        this.dateRangePickerChange({newDate});
                                        this.dateRangePicker.togglePickerVisible();
                                    }
                                }, {
                                    text: '最近三个月',
                                    onClick: ()=> {
                                        const end = new Date();
                                        const start = new Date();
                                        end.setTime(end.getTime() + 3600 * 1000 * 24 );
                                        start.setTime(start.getTime() + 3600 * 1000 * 24);
                                        start.setMonth(start.getMonth()-3);
                                        let newDate=this.bz_time([start,end]);
                                        this.dateRangePickerChange({newDate});
                                        this.dateRangePicker.togglePickerVisible();
                                    }
                                }]}
                            />
                        </Layout.Col>
                        <Layout.Col span="6">
                            类型:{' '}
                            <Select value={type} onChange={this.selectType}>
                                <Select.Option label='全部' value={''}/>
                                <Select.Option label='帖子' value={1}/>
                                <Select.Option label='清单' value={2}/>
                                <Select.Option label='单品' value={3}/>
                                <Select.Option label='搭配' value={4}/>
                                <Select.Option label='结构体' value={7}/>
                                <Select.Option label='短视频' value={8}/>
                            </Select>
                        </Layout.Col>
                        <Layout.Col span="6">
                            人员:{' '}
                            <NewPersonSelection callback={this.selectManage} type={1} classNum={1}/>
                        </Layout.Col>
                    </Layout.Row>
                    <AJAX ref={e => this.adoptListAJAX = e}>
                        <Table
                            style={{width: '90%',left:'5%',margin:'10px 0 0'}}
                            columns={columns} data={adoptList.userPassingReteList}
                            border={true}
                        />
                    </AJAX>
                    <div style={{marginTop:'10px'}}>
                        <Pagination layout="total, prev, pager, next, jumper" total={adoptList.count}
                                    pageSize={adoptList.pageSize} currentPage={adoptList.pageNow} onCurrentChange={this.getList}/>
                    </div>
                </NewPanel>
                {details&&<BundleLoading ref={e=>this.contentDetails=e} load={contentDetails}/>}
            </div>
        )
    }
}

class NewPanel extends React.Component {
    render() {
        let {header} = this.props;
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
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default AdoptList;

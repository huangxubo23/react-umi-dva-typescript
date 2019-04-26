/**
 * Created by linhui on 17-12-28.所有奖金饼状图
 */
import React from 'react';
import AJAX from '../../../../../../../../../lib/newUtil/AJAX';
import NewPanel from '../../../../../../../../../lib/util/elementsPanel';
import echarts from 'echarts';
import {DatePicker, Layout, DateRangePicker, Table, Pagination,MessageBox,Message} from 'element-react';
import 'element-theme-default';

class AllBonusChart extends React.Component {
    constructor(props) {
        super(props);
        let [shopDate, rankingDate, date, dateEnd] = [new Date(), new Date(), new Date(), new Date()];
        date.setDate(date.getDate() - 2);
        dateEnd.setDate(dateEnd.getDate() - 2);
        shopDate.setDate(shopDate.getDate() - 3);
        rankingDate.setDate(rankingDate.getDate() - 3);

        // let shopStart = shopDate.getFullYear() + "-" + (shopDate.getMonth() + 1) + "-" + shopDate.getDate();
        //let rankingStart = rankingDate.getFullYear() + "-" + (rankingDate.getMonth() + 1) + "-" + rankingDate.getDate();
        this.state = {
            endDate: dateEnd,//饼状图结束时间
            startDate: date,//饼状图开始时间
            shopStart: shopDate,//店铺查询时间
            rankingStart: rankingDate,//排行榜查询时间
            effectChanne: [],//所有奖金饼状图数据
            barGraphList: [],//店铺柱状图数据
            manageList: [],//列表数据
            pageNow: 1,
            pageSize: 20,
            count: 0,
        }
    }

    componentDidMount() {
        this.getFlatFigureList();
    }


    getFlatFigureList = () => {//获取饼状图奖金数据
        let {endDate, startDate} = this.state;
        endDate = endDate.getFullYear() + "-" + (endDate.getMonth() + 1) + "-" + endDate.getDate();
        startDate = startDate.getFullYear() + "-" + (startDate.getMonth() + 1) + "-" + startDate.getDate();
        this.allBonusChartAjax.ajax({
            type: 'post',
            url: '/message/admin/topManage/getFlatFigureList.io',
            data: {startDate: startDate, endDate: endDate},
            callback: (json) => {
                let effectChanne = json.effectChanne;
                let commissionFeeAndfixedIncomeNumber = 0;//动态奖金和固定奖金数量总数
                let commissionFeeAndfixedIncomeCount = 0;//动态讲和固定奖金总量
                if (effectChanne.length > 0) {
                    for (let i = 0; i < effectChanne.length; i++) {
                        effectChanne[i].commissionFeeAndfixedIncomeNumber = effectChanne[i].commissionFeec + effectChanne[i].fixedIncomec;
                        effectChanne[i].commissionFeeAndfixedIncomeCount = Math.floor(effectChanne[i].commissionFee) + Math.floor(effectChanne[i].fixedIncome);
                    }
                }

                this.setState({effectChanne: effectChanne}, () => {
                    this.uplineChart();
                });
            }
        });
    };
    uplineChart = () => {//创建饼状图
        let effectChanne = this.state.effectChanne;
        if (effectChanne.length > 0) {
            for (let i = 0; i < effectChanne.length; i++) {
                let lineChart = echarts.init(document.getElementById('allBonusPieChart' + i));
                let data = [
                    //    {value: effectChanne[i].commissionFeeAndfixedIncomeCount, name: '奖金总数' + '(' + effectChanne[i].commissionFeeAndfixedIncomeNumber + '条)'},
                    {
                        value: Math.floor(effectChanne[i].commissionFee),
                        name: '动态奖金(' + Math.floor(effectChanne[i].commissionFee) + '元)'
                    }, //commissionFeec
                    {
                        value: Math.floor(effectChanne[i].fixedIncome),
                        name: '固定奖励(' + Math.floor(effectChanne[i].fixedIncome) + '元)'
                    }, //fixedIncomec
                ];
                let option = {
                    title: {
                        text: effectChanne[i].bonusType,
                        //  subtext: '纯属虚构',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} "
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['奖金总数', '动态奖金', '固定奖励']
                    },
                    series: [
                        {
                            name: '奖金来源',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: data,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
                if (lineChart) {
                    lineChart.clear();
                    lineChart.setOption(option);
                }
            }
        }
        this.showEffectColumnarImage();
    };

    showEffectColumnarImage = () => {//店铺效果数据
        let {userId, shopStart} = this.state;
        let date = shopStart.getFullYear() + "-" + (shopStart.getMonth() + 1) + "-" + shopStart.getDate();
        this.allBonusChartAjax.ajax({
            type: 'post',
            url: '/message/admin/topManage/showEffectColumnarImage.io',
            data: {userId: userId, shopStart: date},
            callback: (json) => {
                this.setState({barGraphList: json}, () => {
                    this.SpliceShowEffectChart();
                });
            }
        });
    };

    SpliceShowEffectChart = () => {//组建店铺效果柱状图
        let {barGraphList} = this.state;
        let [xAxisData, seriesData] = [[], []];
        for (let i = 0; i < barGraphList.length; i++) {
            let barGraph = barGraphList[i];
            xAxisData.push(barGraph.nick);
            seriesData.push(barGraph.commissionFee ? barGraph.commissionFee.toFixed(2) : 0);

        }
        let lineChart = echarts.init(document.getElementById('barGraph'));
        let option = {
            color: ['#675aa0', '#f05f5a', '#f16122', '#ffb701', '#6dc066', '#63c8d0'],

            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: xAxisData
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                name: '奖励',
                barWidth: '60%',
                data: seriesData,
                type: 'bar'
            }]

        };
        if (lineChart) {
            lineChart.clear();
            lineChart.setOption(option);
        }


        this.goPage(1);
    };


    goPage = (pageNow) => {
        pageNow = pageNow ? pageNow : this.state.pageNow;
        let date = this.state.rankingStart.getFullYear() + "-" + (this.state.rankingStart.getMonth() + 1) + "-" + this.state.rankingStart.getDate();
        this.queryListSkyeyeItme({
            pageNow: pageNow,
            pageSize: this.state.pageSize,
            date: date,
        });
    };

    queryListSkyeyeItme = (data) => {//列表数据
        this.allBonusChartAjax.ajax({
            type: 'post',
            url: '/message/admin/topManage/queryListSkyeyeItme.io',//manageList　列表数据
            data: data,
            callback: (json) => {
                let manageList = json.manageList;
                let columns = [
                    {label: "id", prop: "id",},
                    {label: "达人名", prop: "name",},
                    {label: "奖金(元)", prop: "bonus"},
                    {label: "店铺名称", prop: "nick"},
                    {label: "行业分类", prop: "typeTab"},
                    {label: "查询时间", prop: "date"},

                ];
                let manageArray = [];
                for (let i = 0; i < manageList.length; i++) {
                    let manage = manageList[i];
                    manageArray.push({id: manage.id, name: manage.name, bonus: manage.bonus ? manage.bonus.toFixed(2) : 0, nick: manage.nick, typeTab: manage.typeTab, date: manage.date});
                }
                json.columns = columns;
                json.manageArray = manageArray;
                this.setState(json);
            }
        });
    };

    getExcel = () => {//excel表格扣点下载
        MessageBox.confirm('下载一次将扣除3000的点数，您确定要进行下载吗', '提示', {
            type: 'warning'
        }).then(() => {
            window.location.href = '/message/admin/topManage/getExcel.io?startDate=' + this.state.startDate;
            Message({
                type: 'success',
                message: '删除成功!'
            });
        }).catch(() => {
            Message({
                type: 'info',
                message: '已取消下载'
            });
        });

    };

    dateChange = (env) => {//时间范围选择事件
        this.setState({startDate: env[0], endDate: env[1]}, () => {
            this.getFlatFigureList();
        });
    };

    render() {
        let {startDate, endDate, rankingStart, shopStart, columns, manageArray, count, pageSize, pageNow} = this.state;
        let date = [startDate, endDate];
        return (
            <div>
                <AJAX ref={e => this.allBonusChartAjax = e}>
                    <NewPanel bsStyle="info" header="奖金总览">
                        <DateRangePicker placeholder="选择日期范围" value={date} onChange={this.dateChange}/>
                        <Layout.Row>
                            {this.state.effectChanne.map((item, i) => {
                                return (
                                    <Layout.Col sm={8} key={i}>
                                        <div id={"allBonusPieChart" + i} style={{height: 400, marginTop: '50px'}}/>
                                    </Layout.Col>
                                )
                            })}
                        </Layout.Row>
                    </NewPanel>

                    <NewPanel bsStyle="info" header="店铺效果图">
                        <DatePicker placeholder="查询时间" isDisabled={true} value={shopStart} />
                        <div id="barGraph" style={{height: 400, marginTop: '50px'}}/>
                    </NewPanel>

                    <NewPanel bsStyle="info" header="奖金排行榜">
                        <DatePicker placeholder="查询时间" isDisabled={true} value={rankingStart} />
                     {/*   <Button bsStyle="success" download="filename" href={'/message/admin/topManage/getExcel.io?startDate=' + this.state.rankingStart}>下载为excel表格</Button>*/}
                        <Table columns={columns}   data={manageArray} style={{width: '100%',marginBottom:'20px',marginTop:'20px'}}/>


                        <Pagination onCurrentChange={this.goPage} onSizeChange={(pageSize)=>{this.setState({pageSize:pageSize},()=>{this.goPage(1)})}}
                                    layout="total, sizes, prev, pager, next, jumper" total={count} pageSizes={[16, 20, 30, 40]} pageSize={pageSize} currentPage={pageNow}/>
                    </NewPanel>
                </AJAX>
            </div>

        )
    }

}

export default AllBonusChart;
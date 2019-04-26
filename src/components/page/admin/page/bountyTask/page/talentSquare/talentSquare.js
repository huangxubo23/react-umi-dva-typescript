/**
 * Created by 薛荣晖 on 2018/11/7 0007下午 2:11. //达人广场
 */

import React from "react";
import ReactChild from "../../../../../../lib/util/ReactChild";
import AJAX from '../../../../../../lib/newUtil/AJAX';
import {Button, Input, InputNumber, Dropdown,Layout, Icon, Popover, Form, Notification, Select, Table, Tooltip, Pagination, Message} from "element-react";
import 'element-theme-default';
import {DialogBundle,BundleLoading} from '../../../../../../../bundle';
import TalentSquareDialogContainere from 'bundle-loader?lazy&name=pc/trends_asset/components/user/head/app-[name]!./components/TalentSquareDialog';
import AddBountyTaskModal from 'bundle-loader?lazy&name=pc/trends_asset/admin/bountyTask/app-[name]!../../components/addBountyTaskModal';
require('../../../../../../../styles/content/content_template.css');

class TalentSquare extends ReactChild {
    constructor(props) {
        super(props);
        this.state = {
            releaseModal: false, //发布任务模态
            // releaseTalentId:0, //发布用达人Id
            minssion: {           //发布任务用
                talentId: 0,
                taskTitle: '',    //标题
                demand: '',       //任务要求
                price: '',        //价格
                id: 0,            //0新增，其他修改
                state: 0,         //状态 -1:拒绝接收任务0:待达人接收任务1：接收任务2:需要审核3:已发布（未打款）4:打款成功5:任务失败
                needAudit: '',    //是否需要审稿
                latestSubmitTime: '',    //时间
                paternaMissionId: '',    //父任务id
            },
            isLogin: false,       //是否登录
            isPerission: false,   //是否权限
            isRegister: false,    //是否注册
            channel: [],           //渠道数据
            branchClass: [],       //收藏分类数据
            areaList: [],          //达人领域数据
            talent: [],            //达人列表
            vMission: [],          //父任务数据
            pageNow: 1,
            pageSize: 20,
            count: 0,
            title: "",             //达人名称
            mainChannel: "",       //渠道
            minFansNum: "",        //最小粉丝数量
            maxFansNum: "",        //最大粉丝数量
            minOffer: "",          //最小渠道报价
            maxOffer: "",          //最大渠道报价
            branchId: "",          //达人分类id
            branchName: "",        //达人分类名称
            area: '',              //达人领域
            disabled: false,//编辑||新建
            dialogVisible: false
        }
    }

    componentDidMount = () => {
        this.channelData(() => {//拿取渠道数据
            this.branchList(() => {//拿取收藏分类数据
                this.getArea(() => {//拿取达人领域数据
                    this.goPage();
                });
            })
        });
    };

    channelData = (callback) => {//拿取渠道数据
        this.TalentSquareContainereAjax.ajax({
            type: 'post',
            url: "/user/admin/org/getChannelByMainChannel.io",
            data: {'registerType': 2},
            callback: (json) => {
                this.setState({channel: json}, callback);
            }
        });
    };

    branchList = (callback) => {//拿取收藏分类数据
        this.TalentSquareContainereAjax.ajax({
            url: "/user/admin/mechanism/branchList.io",
            data: {},
            callback: (json) => {
                this.setState(json, callback);
            },
        });
    };

    getArea = (callback) => {//拿取达人领域数据
        this.TalentSquareContainereAjax.ajax({
            url: "/user/admin/org/getArea.io",
            data: {'registerType': 2},
            callback: (json) => {
                this.setState({areaList: json.area}, callback);
            }
        });
    };

    goPage = (newPageNow) => {//点击分页
        let {pageNow,pageSize,title,mainChannel,minFansNum,maxFansNum,minOffer,maxOffer,branchId,area}=this.state;
        this.getTableData({
            pageNow: newPageNow?newPageNow:pageNow, pageSize,
            title, mainChannel, minFansNum, maxFansNum, minOffer, maxOffer, branchId, area, registerType: 2
        });
    };

    getTableData = (data) => {//拿取达人列表数据
        this.TalentSquareContainereAjax.ajax({
            type: 'post',
            url: '/user/admin/org/talentList.io',
            data: data,
            callback: (json) => {
                this.setState(json);
            }
        });
    };

    entryNameClick = (data) => {//渠道链接点击
        let mainChannel = data.channel.mainChannel;
        this.setState({mainChannel},()=>this.goPage(1));
    };

    titleClick = (data) => {//达人名称链接点击
        let title = data.talentMessage.title;
        this.setState({title}, () => this.goPage(1))
    };

    collection = (branchClass) => {//管理达人收藏夹模态
        this.TalentSquareDialog.open({branchClass: branchClass})
    };

    addCollection = ({talentId, branchId, branchName2}) => {//收藏
        this.TalentSquareContainereAjax.ajax({
            url: "/user/admin/mechanism/addCollection.io",
            data: {"talentId": talentId, "branchName": branchName2, "branchId": branchId},
            callback: () => {
                Message({
                    type: 'success',
                    message: '收藏成功'
                });
                this.branchList();
                this.goPage(1);
            }
        })
    };

    newCollection = ({talentId, branchId}) => {//提交
        let branchName = this.state.branchClass.branchName;
        if (!branchName) {
            Notification.error({
                title: '错误',
                message: '分类名称不能为空',
            });
            return false;
        }
        this.TalentSquareContainereAjax.ajax({
            url: "/user/admin/mechanism/addCollection.io",
            data: {"talentId": talentId, "branchName": branchName, "branchId": branchId},
            callback: () => {
                Notification({
                    title: '成功',
                    message: '新建分类成功',
                    type: 'success'
                });
                this.branchList();
                this.goPage(1);
            }
        })
    };

    CollectionChang = (value) => {//编辑
        let branchClass = this.state.branchClass;
        branchClass.branchName = value;
        this.setState({branchClass: branchClass});
    };

    delCollection = (talentId) => {//取消
        this.TalentSquareContainereAjax.ajax({
            url: "/user/admin/mechanism/delCollection.io",
            data: {"talentId": talentId.talentId},
            callback: () => {
                Message({
                    type: 'success',
                    message: '取消收藏成功!'
                });
                this.goPage(1);
            }
        })
    };

    getData = () => {//表格数据
        let {talent,branchClass} = this.state;
        let columns = [
            {
                label: "头像", prop: "headPortrait", width: 130, render: (data) => {
                    return (
                        <div>
                            <img src={data['headPortrait']}
                                 style={{width: '100%', padding: '4px', borderRadius: '50%'}}/>
                        </div>
                    )
                }
            },//talentMessage
            {
                label: "达人名称", prop: "title", width: 150, render: (data) => {
                    return (
                        <div>
                            <a href="javascript:void(0);" onClick={() => {
                                this.titleClick(data)
                            }}>{data.title}</a>
                            {data.isCon === false ?
                                <Popover placement="right" title="收藏达人" width="150" trigger="click" content={(
                                    <div>
                                        {branchClass.map((item, i) => {
                                            return (
                                                <p key={item.id}><a href="#" onClick={() => {
                                                    this.addCollection({
                                                        talentId: data.talentMessage.id,
                                                        branchId: item.id,
                                                        branchName2: item.branchName
                                                    })
                                                }}>{item.branchName}</a></p>
                                            )
                                        })}
                                        <Popover placement="right" title="新建分类" width="250" trigger="click" content={(
                                            <div>
                                                <Form model={this.state} labelWidth='80'>
                                                    <Form.Item label='分类名称'>
                                                        <Input size='small' placeholder='请输入分类名称'
                                                               value={branchClass.branchName} onChange={(value) => {
                                                            this.CollectionChang(value)
                                                        }}/>
                                                    </Form.Item>
                                                    <div style={{textAlign: 'right'}}>
                                                        <Button size="small" plain={true} type="info" onClick={() => {
                                                            this.newCollection({
                                                                talentId: data.talentMessage.id,
                                                                branchId: 0
                                                            })
                                                        }}>确定</Button>
                                                    </div>
                                                </Form>
                                            </div>
                                        )}>
                                            <Button size="small" plain={true} type="success">新建分类</Button>
                                        </Popover>
                                    </div>
                                )}>
                                    <span><Icon name='star-off'/></span>
                                </Popover> : <span onClick={() => {
                                    this.delCollection({talentId: data.talentMessage.id})
                                }}><Icon name='star-on' style={{color: 'rgb(247, 186, 42)'}}/></span>}
                        </div>

                    )
                }
            },
            {label: "粉丝数量", prop: "fansNum", width: 95},
            {label: "达人指数", prop: "talentIndex", width: 95},
            {label: "等级", prop: "rankInfo", width: 95},
            {label: "达人领域", prop: "focusContentCate"},
            {label: "达人健康分", prop: "healthScore"},
            {label: "内容质量分", prop: "qualityScore"},
            {
                label: "渠道", prop: "mainChannel", width: 200, render: (data) => {
                    return (
                        <a href="javascript:void(0);" onClick={() => {
                            this.entryNameClick(data)
                        }}>{data.mainChannel}</a>
                    )
                }
            },//channel
            {
                label: "任务模式", prop: "needAudit", render: (data) => {
                    return (
                        <Tooltip className="item" effect="dark"
                                 content={data.needAudit === '机构审稿模式' ? '机构审稿 达人不保证通过（机构审稿 模式)' :
                                     data.needAudit === '达人全责模式' ? '达人包通过，不需要机构审稿（达人全责模式）' :
                                         data.needAudit === '全力而为模式' ? '机构不审稿，达人至少修改三次或者渠道通过（全力而为模式）' :
                                             data.needAudit === '有功必禄模式' ? '不审稿也不包通过（有功必禄模式）' : ''
                                 } placement="bottom">{data.needAudit}</Tooltip>
                    )
                }
            },
            {label: "渠道报价", prop: "offer"},
            {
                label: "操作", prop: "id", render: () => {//talentMessage
                    return (
                        <div>
                            <Button size="small" type='success' onClick={this.releaseTask}>发布任务</Button>
                        </div>
                    )
                }
            },
        ];

        let array = [];
        if (talent&&talent.length > 0) {
            talent.map((item, i) => {
                let {needAudit, offer, isCon,talentMessage} = item;
                let {headPortrait, title, fansNum, talentIndex, focusContentCate, healthScore, qualityScore, id, rankInfo} = talentMessage;
                let mainChannel = item.channel.title + '_' + item.channel.columnName + "_" + item.channel.entryName;
                headPortrait = !headPortrait ? "头像" : headPortrait;
                title = !title ? "没有名称" : title;
                fansNum = !fansNum ? "粉丝数量" : fansNum;
                focusContentCate = !focusContentCate ? "" : focusContentCate;
                needAudit = needAudit === 1 ? "机构审稿模式" : needAudit === 2 ? "达人全责模式" : needAudit === 3 ? "全力而为模式" : needAudit === 4 ? "有功必禄模式" : '暂无';
                offer = !offer ? "暂无报价" : offer;
                rankInfo = !rankInfo ? "L0" : ("L" + rankInfo);
                array.push({
                    headPortrait: headPortrait,
                    title: title,
                    fansNum: fansNum,
                    talentIndex: talentIndex,
                    focusContentCate: focusContentCate,
                    healthScore: healthScore,
                    qualityScore: qualityScore,
                    id: {id, i},
                    mainChannel: mainChannel,
                    channel: item.channel,
                    talentMessage: item.talentMessage,
                    needAudit: needAudit,
                    offer: offer,
                    isCon: isCon,
                    rankInfo: rankInfo
                })
            })
        }
        return {columns, array}
    };
    releaseTask=()=>{//发布任务
        let upload = setInterval(() => {
            let addBountyTaskModal = this.addBountyTaskModal;
            if (addBountyTaskModal && addBountyTaskModal.jd) {
                clearInterval(upload);
                addBountyTaskModal.jd.initial();
            }
        }, 100);
    };



    changeEvent = ({value, name}) => {//达人分类 - 达人领域 - 全部渠道选择事件
        let state = this.state;
        state[name] = value;
        if (name === 'mainChannel' || name === 'area' || name === 'branchId') {
            this.setState(state, () => {
                this.goPage(1);
            })
        } else {
            this.setState(state);
        }
    };

    goPageChange = ({type,value}) => {//每页个数||跳转页
        this.setState({[type]: value},this.goPage);
    };

    render() {
        let {count, pageNow, pageSize, title, minFansNum, maxFansNum, minOffer, maxOffer, branchId, area, mainChannel, branchClass, areaList, channel} = this.state;
        let tableData = this.getData();
        let fansNumArray=[
            {min:1,max:999},
            {min:1000,max:4999},
            {min:5000,max:29999},
            {min:30000,max:199999},
            {min:200000,max:9999999}
        ],offerArray=[
            {min:1,max:99},
            {min:100,max:499},
            {min:500,max:999},
            {min:1000,max:1999},
            {min:2000,max:99999}
        ];
        return (
            <NewPanel header='达人广场'>
                <div style={{margin:'10px'}}>
                    <Layout.Row type='flex' align='middle'>
                        <Layout.Col span='2'>
                            <span>达人名称</span>
                        </Layout.Col>
                        <Layout.Col span='4'>
                            <Input size='small' placeholder='请输入达人名称...' value={title} onChange={(value) => {
                                this.setState({title: value})
                            }}/>
                        </Layout.Col>
                        <Layout.Col span='2'>
                            <Dropdown trigger="click" menu={(
                                <Dropdown.Menu>
                                    <Dropdown.Item command='0'>{'<999'}</Dropdown.Item>
                                    <Dropdown.Item command='1'>1000~4999</Dropdown.Item>
                                    <Dropdown.Item command='2'>5000~29999</Dropdown.Item>
                                    <Dropdown.Item command='3'>30000~199999</Dropdown.Item>
                                    <Dropdown.Item command='4'>{'>200000'}</Dropdown.Item>
                                </Dropdown.Menu>
                            )} onCommand={(value)=>{
                                let {min,max}=fansNumArray[value];
                                this.setState({minFansNum:min,maxFansNum:max});
                            }}>
                                <span className="el-dropdown-link">粉丝数量<i className="el-icon-caret-bottom el-icon--right"> </i></span>
                            </Dropdown>
                        </Layout.Col>
                        <Layout.Col span='6'>
                            <InputNumber size='small' min='1' value={minFansNum} onChange={(value) => {
                                this.setState({minFansNum: value})
                            }}/>
                            <span style={{margin:'0 5px'}}>-</span>
                            <InputNumber size='small' min='1' value={maxFansNum} onChange={(value) => {
                                this.setState({maxFansNum: value})
                            }}/>
                        </Layout.Col>
                        <Layout.Col span='2'>
                            <Dropdown trigger="click" menu={(
                                <Dropdown.Menu>
                                    <Dropdown.Item command='0'>{'<100'}</Dropdown.Item>
                                    <Dropdown.Item command='1'>100~499</Dropdown.Item>
                                    <Dropdown.Item command='2'>500~999</Dropdown.Item>
                                    <Dropdown.Item command='3'>1000~1999</Dropdown.Item>
                                    <Dropdown.Item command='4'>{'>2000'}</Dropdown.Item>
                                </Dropdown.Menu>
                            )} onCommand={(value)=>{
                                let {min,max}=offerArray[value];
                                this.setState({minOffer:min,maxOffer:max});
                            }}>
                                <span className="el-dropdown-link">渠道报价<i className="el-icon-caret-bottom el-icon--right"> </i></span>
                            </Dropdown>
                        </Layout.Col>
                        <Layout.Col span='6'>
                            <InputNumber size='small' min='1' value={minOffer} onChange={(value) => {
                                this.setState({minOffer: value})
                            }}/>
                            <span style={{margin:'0 5px'}}>-</span>
                            <InputNumber size='small' min='1' value={maxOffer} onChange={(value) => {
                                this.setState({maxOffer: value})
                            }}/>
                        </Layout.Col>
                        <Layout.Col span='2'>
                            <Button size='small' type='info' style={{width: '80%'}} onClick={() => {
                                this.goPage(1)
                            }}>搜索</Button>
                        </Layout.Col>
                    </Layout.Row>
                    <Layout.Row type='flex' align='middle' style={{marginTop:"10px"}}>
                        <Layout.Col span='2'>
                            <span>收藏分类</span>
                        </Layout.Col>
                        <Layout.Col span='4'>
                            <Select value={branchId} placeholder="请选择" size='small'
                                    onChange={(value) => {
                                        this.changeEvent({value: value, name: 'branchId'})
                                    }}>
                                <Select.Option value='' label='所有达人'/>
                                <Select.Option value={0} label='全部收藏'/>
                                {branchClass.map((item, i) => {
                                    return (
                                        <Select.Option key={item.id} value={item.id} label={item.branchName}/>
                                    )
                                })}
                            </Select>
                        </Layout.Col>
                        <Layout.Col span='2'>
                            <span>达人领域</span>
                        </Layout.Col>
                        <Layout.Col span='4'>
                            <Select value={area} placeholder="请选择" size='small'
                                    onChange={(value) => {
                                        this.changeEvent({value: value, name: 'area'})
                                    }}>
                                <Select.Option value='' label='所有领域'/>
                                {areaList.map((item, i) => {
                                    if (item.focusContentCate) {
                                        return (
                                            <Select.Option key={item.focusContentCate + i} value={item.focusContentCate}
                                                           label={item.focusContentCate}/>
                                        )
                                    }
                                })}
                            </Select>
                        </Layout.Col>
                        <Layout.Col span='2'>
                            <span>全部渠道</span>
                        </Layout.Col>
                        <Layout.Col span='4'>
                            <Select value={mainChannel} placeholder="请选择" size='small'
                                    onChange={(value) => {
                                        this.changeEvent({value: value, name: 'mainChannel'})
                                    }}>
                                <Select.Option value='' label='全部渠道'/>
                                {channel.map((item, i) => {
                                    return (
                                        <Select.Option key={i} value={item.mainChannel} label={item.title}/>
                                    )
                                })}
                            </Select>
                        </Layout.Col>
                        <Layout.Col span='4'>
                            <Button size='small' type='warning' onClick={() => {
                                this.collection(branchClass)
                            }}>管理达人收藏夹</Button>
                        </Layout.Col>
                    </Layout.Row>
                </div>
                <AJAX ref={e => this.TalentSquareContainereAjax = e}>
                    <div style={{margin: '10px'}} className='divTable'>
                        <Table style={{width: '100%'}} columns={tableData.columns} data={tableData.array} border={true}/>
                    </div>
                    <div style={{margin: '15px 0'}}>
                        <Pagination layout="total, sizes, prev, pager, next, jumper" total={count}
                                    pageSizes={[20, 40, 80, 160]} pageSize={pageSize} currentPage={pageNow}
                                    onSizeChange={(pageSize) => this.goPageChange({type:'pageSize',value:pageSize})}
                                    onCurrentChange={(pageNow) => this.goPageChange({type:'pageNow',value:pageNow})}/>
                    </div>
                    <DialogBundle ref={e => this.TalentSquareDialog = e} dialogProps={{title: '管理达人收藏夹', size: "tiny"}}
                                  bundleProps={{
                                      load: TalentSquareDialogContainere, branchList: ()=>this.branchList(()=>this.TalentSquareDialog.open({branchClass:this.state.branchClass})), goPage: this.goPage, closeModal: () => {
                                          this.TalentSquareDialog.setState({dialogVisible: false})
                                      }
                                  }}
                                  dialogFooter={<div>
                                      <Button onClick={() => {
                                          this.TalentSquareDialog.setState({dialogVisible: false})
                                      }}>取消</Button>
                                      <Button type="primary" onClick={() => {
                                          this.TalentSquareDialog.setState({dialogVisible: false})
                                      }}>确定</Button>
                                  </div>}>
                    </DialogBundle>
                    <BundleLoading load={AddBountyTaskModal} ref={e => this.addBountyTaskModal = e} bountyTask={{}} disbaled={false} goPage={this.goPage}/>
                </AJAX>
            </NewPanel>
        );
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

export default TalentSquare;
/**
 * Created by 林辉 on 2018/11/5 8:56.被点评内容列表
 */

import ReactChild from "../../../../../../lib/util/ReactChild";
import {PersonSelection} from "../../../../components/PersonSelection";
import {isLogin} from "../../../../../../lib/util/global";
import AJAX from "../../../../../../lib/newUtil/AJAX";
import {Button, Input, Layout, Pagination, Table, MessageBox, Message, Select} from "element-react";

class BeCommentTable extends ReactChild {
    constructor(props) {
        super(props);
        this.state = {
            pageNow: 1,       //页
            pageSize: 16,     //每页显示条目个数
            count: 0,        //总数
            contentCommentsList: [],
            title: '',    //标题
            reviewers: '',//
            beCommentOrganization: '',//被点评
            columns: [],
            array: []

        }
    }

    componentDidMount = () => {
        isLogin((login) => {
            if (login && login.loginManage) {
                this.setState({beCommentOrganization: login.loginManage.organization.id}, () => {
                    this.getData();
                });
            } else {
                this.getData();
            }
        });
    };

    commentSearchNameButton = () => {//搜索标题
        this.setState({pageNow: 1}, () => {
            this.getData();
        })
    };

    toPageSize = (value) => {//每页个数
        this.setState({pageSize: value}, () => {
            this.getData();
        });
    };

    goPageNow = (value) => {//跳转页
        this.setState({pageNow: value}, () => {
            this.getData();
        });
    };

    getData = () => {
        let {pageNow, pageSize, title, reviewers,beCommentOrganization} = this.state;
        if (this.beCommentTableAjax) {
            this.beCommentTableAjax.ajax({
                type: 'post',
                url: '/content/admin/contentComments/getContentBeComments.io',
                data: {pageNow, pageSize, title, reviewers,beCommentOrganization},
                callback: (json) => {
                    let contentCommentsList = json.contentCommentsList;
                    let columns = [//table表头
                        {
                            label: '封面图', prop: 'picUrl', width: 205,
                            render: (data) => {
                                return (
                                    <div style={{backgroundColor: "rgba(229, 242, 255, 0.4)"}}>
                                        <img src={data['picUrl']} style={{width: '70%', padding: '5px', maxHeight: '110px'}}/>
                                    </div>
                                )
                            }
                        },
                        {label: '标题', prop: 'title'},
                        {
                            label: '点评人', prop: 'manage', render: (data) => {
                                let manageName = PersonSelection.getManage(data.manage, () => {
                                    this.forceUpdate();
                                });
                                return manageName ? manageName.name : "无";
                            }
                        },
                        {label: '内容审核', prop: 'reviewers'},
                        {label: '点评时间', prop: 'commentsDate'},
                        {
                            label: '日志', prop: 'log', width: 190,
                            render: (data) => {
                                return (
                                    <div style={{
                                        height: "80px",
                                        overflowY: "scroll",
                                        overflow: "auto",
                                        textAlign: "left",
                                        overflowX: 'hidden'
                                    }}>{data.log}</div>
                                )
                            }
                        },
                        {
                            label: '操作', prop: 'address',
                            render: (data) => {
                                return (
                                    <div>
                                        <Button.Group>
                                            <Button size="small" onClick={() => {
                                                window.open(window.location.origin + '/pc/visible/auditOpinion/show/' + data.address.id)
                                            }}>查看</Button>
                                        </Button.Group>
                                    </div>
                                )
                            }
                        }
                    ];

                    let array = [];//表里数据
                    if (contentCommentsList.length > 0) {
                        contentCommentsList.map((item, i) => {
                            let {title, commentsDate, log, picUrl, id, manage, reviewers} = item;
                            reviewers = reviewers === 1 ? '审稿通过，直接发布' : reviewers === 2 ? '按要求修改 该完直接发布' : reviewers === 3 ? '按要求修改，改完再审稿' : '审稿出错';
                            array.push({title: title, manage: manage, reviewers: reviewers, commentsDate: commentsDate, picUrl: picUrl, log: log, address: {id, i}})
                        })
                    }
                    json.columns = columns;
                    json.array = array;
                    this.setState(json)
                }
            });
        }
    };


    render() {
        let {title, array, columns, count, pageNow, pageSize, reviewers} = this.state;
        return (
            <AJAX ref={e => this.beCommentTableAjax = e}>
                <div style={{marginLeft: '50px', marginRight: '50px'}} className='divTable'>
                    <Layout.Row>
                        <Layout.Col span='6'>
                            <div style={{marginBottom: '10px'}}>
                                <Select value={reviewers} placeholder="请选择审稿" onChange={(value) => {
                                    this.setState({reviewers: value}, () => {
                                        this.getData()
                                    })
                                }}>
                                    <Select.Option label={'全部'} value={''}/>
                                    <Select.Option label={'审稿已通过,可以直接发布'} value={1}/>
                                    <Select.Option label={'按要求修改,改完直接发布'} value={2}/>
                                    <Select.Option label={'按要求修改,改完再次审稿'} value={3}/>
                                </Select>
                            </div>
                        </Layout.Col>
                        <Layout.Col span="18">
                            <div style={{marginBottom: '10px'}}>
                                <Input value={title} placeholder="请输入标题"
                                       onChange={(value) => {
                                           this.setState({title: value})
                                       }}
                                       prepend={<Button type='danger' icon='delete2' onClick={() => {
                                           this.setState({commentSearchName: ""})
                                       }}>清空</Button>}
                                       append={<Button type="primary" icon="search" onClick={this.commentSearchNameButton}>搜索</Button>}/>
                            </div>
                        </Layout.Col>
                    </Layout.Row>
                    <Table style={{width: '100%'}} columns={columns} data={array} border={true}/>
                </div>
                <div style={{marginTop: '20px'}}>
                    <Pagination layout="total, sizes, prev, pager, next, jumper" total={count} pageSizes={[16, 20, 50, 100]}
                                pageSize={pageSize} currentPage={pageNow}
                                onSizeChange={(pageSize) => {
                                    this.toPageSize(pageSize)
                                }}
                                onCurrentChange={(pageNow) => {
                                    this.goPageNow(pageNow)
                                }}/>
                </div>
            </AJAX>
        )
    }

}

export default BeCommentTable;
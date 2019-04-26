/**
 * Created by 薛荣晖 on 2018/12/17 0017上午 10:22.被保护内容（需要修改内容）
 */

import '../../../../../styles/component/react_assembly/editBox.css';
import React from "react";
import AJAX from '../../../../../../lib/newUtil/AJAX';
import {Button, Card, Alert, Notification, Tooltip, Table} from "element-react";
import 'element-theme-default';

require('../../../../../../../styles/group/protectContent.css');
require('../../../../../../../styles/addList/content.css');
require('../../../../../../../styles/content/content_template.css');

import ReactChild from "../../../../../../lib/util/ReactChild";
import {Glyphicon} from "react-bootstrap";
import ListShowModelsContainer from 'bundle-loader?lazy&name=pc/trends_asset/admin/content/app-[name]!./components/ListShowModels';
import {BundleLoading} from '../../../../../../../bundle';


class ProtectContents extends ReactChild {
    constructor(props) {
        super(props);
        this.state = {
            contents: [],
        }
    }

    componentDidMount = () => {
        this.getProtectContentList();
    };

    getProtectContentList = () => {//获取数据
        this.ProtectContentsAjax.ajax({
            type: 'post',
            url: '/content/admin/content/getProtectContentList.io',
            data: {},
            callback: (json) => {
                this.setState({contents: json.contents}, () => {
                    this.getTable()
                });
            }
        });
    };

    protection = (id) => {//取消保护
        let contentId = id;
        this.ProtectContentsAjax.ajax({
            type: 'post',
            url: '/content/admin/manageGroup/domain.content.relieve.protection.io',
            data: {contentId: contentId},
            callback: (json) => {
                Notification({
                    title: '成功',
                    message: '取消保护成功',
                    type: 'success'
                });
                this.getProtectContentList();
            }
        });
    };

    newSelectContent = (id) => {
        /*let {showContentJudge} = this.state;
        if (showContentJudge && this.bundleLoading.jd) {
            this.bundleLoading.jd.setState({postShow: true}, () => {
                this.bundleLoading.jd.findContent(id);
            });
        } else {
            this.setState({showContentJudge: true}, () => {
                let upload = setInterval(() => {
                    let bundleLoading = this.bundleLoading;
                    if (bundleLoading && bundleLoading.jd) {
                        clearInterval(upload);
                        bundleLoading.jd.setState({postShow: true}, () => {
                            this.bundleLoading.jd.findContent(id);
                        });
                    }
                }, 100)
            });
        }*/
    };

    delOnlyString = (id) => {//删除唯一字符串
        let contentId = id;
        if (contentId) {
            this.ProtectContentsAjax.ajax({
                type: 'post',
                url: '/content/admin/content/delOnlyString.io',
                data: {contentId: contentId},
                callback: (json) => {
                    Notification({
                        title: '成功',
                        message: '取消成功',
                        type: 'success'
                    });
                    this.getProtectContentList();
                }
            });
        }
    };

    getTable = () => {
        let contents = this.state.contents;
        let columns = [
            {label: 'ID', prop: 'id',width:95},
            {label: '模式', prop: 'contentModeName', width: 150},
            {label: '类别', prop: 'typeTab',width:65},
            {
                label: '封面', prop: 'picUrl', width: 188, render: (item) => {
                    return (
                        <div style={{margin: '10px 5px'}}>
                            {item.picUrl ? <img src={item.picUrl}/> : ''}
                        </div>
                    )
                }
            },
            {label: '标题', prop: 'title', width: 310},
            {label: '更新时间', prop: 'upTime', width: 180},
            {
                label: '工作流程', prop: 'largeProcesses',width:100, render: (item) => {
                    return (
                        <div>
                            <span>{item.largeProcesses ? item.largeProcesses.name : ''}</span>
                        </div>
                    )
                }
            },
            {
                label: '当前步骤', prop: 'smallProcess',width:95, render: (item) => {
                    return (
                        <div>
                            <span>{item.smallProcess ? item.smallProcess.name : ''}</span>
                        </div>
                    )
                }
            },
            {label: '状态', prop: 'st'},
            {
                label: '操作', prop: 'id', width: 200, render: (item) => {
                    return (
                        <div>
                            <Tooltip content={'备注内容：' + item.remarks} placement="top">
                                <i style={{cursor: 'pointer'}} className="iconfont">&#xe624;</i>
                            </Tooltip>
                            <div>
                                <Button.Group>
                                    <Button type="primary" size='mini'>保护期：</Button>
                                    <Button type="primary" size='mini'>{item.ifInvalidStr.manageName}</Button>
                                    {item.relieveProtection ? <Button type="danger" size='mini' onClick={() => {
                                        this.protection(item.id)
                                    }}>取消保护</Button> : ''}
                                </Button.Group>
                                <div style={{marginTop: '2px'}}>
                                    <Button.Group>
                                        <Button type="primary" size='mini' style={{width: '80px'}} onClick={() => {
                                            this.newSelectContent(item.id)
                                        }}>看</Button>
                                        {item.edit ? <Button target="_blank" onClick={() => {
                                            let href = (window.location.origin + "/pc/adm/content/groupAdd/manageGroup/" + item.creator + "/" + item.id);
                                            window.open(href);
                                        }} type="success" size='mini' style={{width: '80px'}}>编</Button> : undefined}
                                    </Button.Group>
                                    {item.editContent &&
                                    <div style={{marginTop: '2px'}}>
                                        <Button.Group>
                                            <Button type="warning" size='mini' style={{width: '125px'}}>{item.editContent}</Button>
                                            {item.deleEditContent &&
                                            <Button type="danger" size='mini' onClick={() => {
                                                this.delOnlyString(item.id)
                                            }}>放弃</Button>}
                                        </Button.Group>
                                    </div>}
                                </div>
                            </div>
                        </div>
                    )
                }
            },
        ];
        let array = [];
        if (contents.length > 0) {
            contents.map((item, i) => {
                let {
                    id, contentModeName, typeTab, picUrl, title, upTime, largeProcesses, smallProcess,
                    remarks, ifInvalidStr, relieveProtection, creator, contentModeId, edit, editContent, deleEditContent, version
                } = item;
                array.push({
                    id: id, contentModeName: contentModeName, typeTab: typeTab, picUrl: picUrl, title: title, upTime: upTime, largeProcesses: largeProcesses, smallProcess: smallProcess,
                    remarks: remarks, ifInvalidStr: ifInvalidStr, relieveProtection: relieveProtection, creator: creator, contentModeId: contentModeId, edit: edit, editContent: editContent,
                    deleEditContent: deleEditContent, version: version
                })
            })
        }
        this.setState({columns, array})
    };

    render() {
        let {array, columns, contents} = this.state;
        return (
            <AJAX ref={e => {
                this.ProtectContentsAjax = e
            }}>
                {contents.length > 0 ? <Card className='box-card'>
                    <Alert title='修改内容列表' type="info" closable={false}/>
                    <div className='divTable' style={{marginTop: '20px'}}>
                        <Table style={{width: '100%'}} columns={columns} data={array} border={true}/>
                    </div>
                </Card> : <div>
                    <Alert title='你做的很好！无修改内容' type="info" closable={false}/>
                </div>}
            </AJAX>
        );
    }
}

export default ProtectContents;
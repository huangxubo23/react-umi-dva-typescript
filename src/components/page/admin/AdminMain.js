import {Link, Switch, Route, BrowserRouter} from 'react-router-dom';
import React from "react";
import adminMenuContainer from 'bundle-loader?lazy&name=pc/trends_asset/admin/app-[name]!./components/AdminMenu';
import {loading, BundleLoading} from '../../../bundle';
import contentContainer from 'bundle-loader?lazy&name=pc/trends_asset/admin/app-[name]!./page/content/content.js';
import TestContainer from 'bundle-loader?lazy&name=pc/trends_asset/admin/app-[name]!./page/test/testIndex.js';
import IndexContainer from 'bundle-loader?lazy&name=pc/trends_asset/admin/app-[name]!./page/Index.js';
import elementContent_templateContainer
    from 'bundle-loader?lazy&name=pc/trends_asset/admin/app-[name]!./page/content/page/elementContent_template/elementContent_template.js';
import template
    from 'bundle-loader?lazy&name=pc/trends_asset/admin/app-[name]!./page/content/page/elementContent_template/components/page/templatePage.js';
import groupAdminContainer
    from 'bundle-loader?lazy&name=pc/trends_asset/admin/app-[name]!./page/group/page/groupAdmin/groupAdmin.js';
import newcontentAdminContainer
    from 'bundle-loader?lazy&name=pc/trends_asset/admin/app-[name]!./page/group/page/contentAdmin/newcontentAdmin.js';
import groupWorkListContainer
    from 'bundle-loader?lazy&name=pc/trends_asset/admin/app-[name]!./page/group/page/groupWorkList/groupWorkList.js';
import protectContent
    from 'bundle-loader?lazy&name=pc/trends_asset/admin/app-[name]!./page/group/page/protectContent/protectContent.js';
import addBountyTaskContainer
    from 'bundle-loader?lazy&name=pc/trends_asset/admin/app-[name]!./page/bountyTask/page/addBountyTask/addBountyTask.js';
import bountyStatisticsContainer
    from 'bundle-loader?lazy&name=pc/trends_asset/admin/app-[name]!./page/bountyTask/page/bountyStatistics/bountyStatistics.js';
import bountyTaskSquarContainere
    from 'bundle-loader?lazy&name=pc/trends_asset/admin/app-[name]!./page/bountyTask/page/bountyTaskSquare/bountyTaskSquare.js';
import talentBountyTaskContainere
    from 'bundle-loader?lazy&name=pc/trends_asset/admin/app-[name]!./page/bountyTask/page/talentBountyTask/talentBountyTask.js';
import talentSquareContainere
    from 'bundle-loader?lazy&name=pc/trends_asset/admin/app-[name]!./page/bountyTask/page/talentSquare/talentSquare.js';
import businessRegisterTaskContainere
    from 'bundle-loader?lazy&name=pc/trends_asset/admin/app-[name]!./page/business/page/businessRegister/businessRegister.js';
import statisticsAllTalentContainere
    from 'bundle-loader?lazy&name=pc/trends_asset/admin/app-[name]!./page/superManage/statisticsAllTalent';
import sendMissionContainer
    from 'bundle-loader?lazy&name=pc/trends_asset/admin/app-[name]!./page/sendMission/sendMission.js';
import userContainer from 'bundle-loader?lazy&name=pc/trends_asset/admin/app-[name]!./page/user/user.js';
import toolContainer from 'bundle-loader?lazy&name=pc/trends_asset/admin/app-[name]!./page/tool/tool.js';
import forumContainer from 'bundle-loader?lazy&name=pc/trends_asset/admin/app-[name]!./page/forum/forum.js';
import test from 'bundle-loader?lazy&name=pc/trends_asset/admin/app-[name]!./page/test/test.js';
import ReactChild from "../../lib/util/ReactChild";
import businessRegisterContainer
    from 'bundle-loader?lazy&name=pc/trends_asset/admin/app-[name]!./page/business/page/businessRegister/businessRegister.js';
import commentTable from "bundle-loader?lazy&name=pc/trends_asset/admin/content/app-[name]!./page/content/page/commentTable/commentTable";
import beCommentTable from "bundle-loader?lazy&name=pc/trends_asset/admin/content/app-[name]!./page/content/page/beCommentTable/beCommentTable";
import commentAdminContainer from 'bundle-loader?lazy&name=pc/trends_asset/admin/InteractionCenter/app-[name]!./page/InteractionCenter/page/commentAdmin/commentAdmin';
import ReactDOM from "react-dom";
import {Dialog,Button} from 'element-react';
import 'element-theme-default';

class AdminMain extends ReactChild {
    render() {
      console.info('==AdminMain==', this.props);
        let {url,path}=this.props.match;
        let child = <Switch>
            <Route path={url + "/test"} exact component={loading(TestContainer)}/>
            <Route path={url + "/index"} component={loading(IndexContainer)}/>
            <Route path={url + "/index/homePage"} component={loading(IndexContainer)}/>{/*首页*/}
            <Route path={url + "/business/businessRegister"} component={loading(businessRegisterContainer)}/>{/*注册*/}
            {/*          <Route path={url + "/content/content_template"} component={loading(content_templateContainer)}/>*/}{/*设置模板*/}
            <Route path={url + "/content/content_template/template/:id/:url"} component={loading(template)}/>{/*跳转重复模板*/}
            <Route path={url + "/content/content_template/template/:id"} component={loading(template)}/>{/*编辑模板*/}
            <Route path={url + "/content/content_template/template"} component={loading(template)}/>{/*新建模板*/}
            <Route path={url + "/content/content_template"}
                   component={loading(elementContent_templateContainer)}/>{/*设置模板*/}
            <Route path={url + "/content/beCommentTable"} component={loading(beCommentTable)}/>{/*被点评列表*/}
            <Route path={url + "/content/commentTable"} component={loading(commentTable)}/>{/*点评列表*/}
            <Route path={url + "/content"} component={loading(contentContainer)}/>{/*内容*/}

            <Route path={url + "/group/contentAdmin"}
                   component={loading(newcontentAdminContainer)}/>{/*小组设置管理*/}

            <Route path={url + "/group/groupAdmin"}
                   component={loading(groupAdminContainer)}/>{/*小组内容管理*/}
            <Route path={url + "/group/protectContent"}
                   component={loading(protectContent)}/>{/*小组我需要修改的*/}
            <Route path={url + "/group/groupWorkList"}
                   component={loading(groupWorkListContainer)}/>{/*小组工作统计*/}

            <Route path={url + "/interactionCenter/commentAdmin"} component={loading(commentAdminContainer)}/>{/*互动中心*/}

            <Route path={url + "/business/businessRegisterTask"}
                   component={loading(businessRegisterTaskContainere)}/>{/*商家注册*/}

            <Route path={url + "/superManage/statisticsAllTalent"}
                   component={loading(statisticsAllTalentContainere)}/>{/*组织管理员军机处*/}

            <Route path={url + "/bountyTask/addBountyTask"}
                   component={loading(addBountyTaskContainer)}/>{/*赏金任务管理*/}
            <Route path={url + "/bountyTask/bountyStatistics"}
                   component={loading(bountyStatisticsContainer)}/>{/*赏金任务流量总表*/}
            <Route path={url + "/bountyTask/bountyTaskSquare"}
                   component={loading(bountyTaskSquarContainere)}/>{/*赏金任务广场*/}

            <Route path={url + "/bountyTask/talentBountyTask"}
                   component={loading(talentBountyTaskContainere)}/>{/*达人赏金任务*/}
            <Route path={url + "/bountyTask/talentSquare"}
                   component={loading(talentSquareContainere)}/>/*达人广场*!/


            <Route path={url + "/sendMission"}
                   component={loading(sendMissionContainer)}/>{/*sendMission*/}
            <Route path={url + "/user"} component={loading(userContainer)}/>{/*user*/}
            <Route path={url + "/tool"} component={loading(toolContainer)}/>{/*工具*/}
            <Route path={url + "/forum"} component={loading(forumContainer)}/>{/*论坛*/}
            <Route path={url + "/test"} component={loading(test)}/>{/*测试页面*/}
        </Switch>;
        let Men = (props) => {
            if (path == "/pc/ad") {
                return (
                    <div>
                        {props.children}
                    </div>
                )
            } else {
                return <div>
                    <BundleLoading load={adminMenuContainer} {...this.props}>
                        {props.children}
                    </BundleLoading>
                </div>
            }
        };

        const getConfirmation = (message,callback) => {
            class ConFirmComponent extends ReactChild{
                constructor(props) {
                    super(props);
                    this.state = {
                        dialogVisible: true
                    };
                }

                render() {
                    let arr=message.split('||');
                    let {dialogVisible}=this.state;
                    return (
                        <Dialog title="操作提示" size="tiny" visible={dialogVisible} lockScroll={false}
                                onCancel={ () =>{
                                    callback(false);ReactDOM.unmountComponentAtNode(document.getElementById('tips'))
                                }}>
                            <Dialog.Body>
                                <span>{arr[0]}</span>
                            </Dialog.Body>
                            <Dialog.Footer className="dialog-footer">
                                <Button onClick={() => {callback(false);ReactDOM.unmountComponentAtNode(document.getElementById('tips'))}}>取消</Button>
                                <Button onClick={() => {
                                    callback(false);
                                    ReactDOM.unmountComponentAtNode(document.getElementById('tips'));
                                    window.open(`${window.location.origin}${arr[1]}`);
                                }} type="info">从新窗口打开</Button>
                                <Button type="primary" onClick={() => {callback(true);ReactDOM.unmountComponentAtNode(document.getElementById('tips'))}}>当前窗口打开</Button>
                            </Dialog.Footer>
                        </Dialog>
                    )
                }
            }
            ReactDOM.render(
                <ConFirmComponent />,
                document.getElementById('tips')
            )
        };

        // return (
        //     <BrowserRouter getUserConfirmation={getConfirmation}>
        //         <Men>
        //             {child}
        //         </Men>
        //     </BrowserRouter>
        // )
        if (this.props.location && this.props.location.pathname && this.props.location.pathname.indexOf('/pc/index/homePage') > -1) {
          return (
            <div>
                {this.props.children}
            </div>
          )
        } else {
          return (
            <div>
                <BundleLoading load={adminMenuContainer} {...this.props}>
                    {this.props.children}
                </BundleLoading>
            </div>
          )
      }
    }

}


AdminMain.defaultProps = {};

export default AdminMain;

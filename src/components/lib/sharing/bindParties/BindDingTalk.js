import React from "react";
import {Dialog} from "element-react";
import AJAX from '../../newUtil/AJAX';
// import "../../../lib/util/jquery-ui.min";
import QRCode from 'qrcode';

class BindDingTalk extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show: true
        }
    }

    getToken = () => {
        this.ajax.ajax({
            url: "/user/admin/user/getDingTalkToken.io", callback: (data) => {
                QRCode.toDataURL("dingtalk://dingtalkclient/action/open_mini_app?miniAppId=2018102461806569&source=trial&version=84552&query=" + encodeURIComponent("dingTalkToken=" + data.dingTalkToken), {width: 200}).then(url => {
                    this.setState({codeUrl: url});
                }).catch(err => {
                    console.error(err)
                })
            }
        })
    }

    componentDidMount() {
        this.getToken();
    }

    open = () => {
        this.setState({show: true});
    }

    componentDidUpdate() {

    }

    render() {
        return <Dialog
            title="使用钉钉扫描"
            visible={this.state.show}
            onCancel={() => this.setState({show: false})}>
            <Dialog.Body>
                <AJAX ref={e => this.ajax = e}>
                    {this.state.codeUrl &&
                    <div><img src={this.state.codeUrl} style={{width: "200px", height: "200px"}}/></div>}
                </AJAX>
            </Dialog.Body>
        </Dialog>
    }
}

export default BindDingTalk;
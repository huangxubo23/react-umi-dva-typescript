/**
 * Created by 薛荣晖 on 2018/11/3 0003下午 4:03. //日常任务模态
 */

import React from "react";
import 'element-theme-default';
import AJAX from '../../../../../../../lib/newUtil/AJAX';

class DailyTaskDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogVisible: false,
        }
    }

    render() {
        return (
            <AJAX ref={e => this.DailyTaskDialogAjax = e}>
                <div>
                    <span>这是一段信息</span>
                </div>
            </AJAX>
        )
    }
}

export default DailyTaskDialog;
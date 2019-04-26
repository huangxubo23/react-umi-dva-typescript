/**
 * Created by shiying on 17-7-24.
 */

import React from 'react';
import {Form, Input, Button, Layout, Tooltip, Tabs} from 'element-react';
import 'element-theme-default';

class ListMode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: [],
        }
    }

    selectContentMode = (item) => {
        this.props.setPaState({
            contentModeId: item.props.name,
            pageNow: 1,
            state: undefined,
            manage: 0,
            typeTab: undefined,
        }, () => {
            this.props.getContentStatePreview(1);
        });
    };
    nameChange = (value) => {
        let {modePaging} = this.props;
        modePaging.name = value;
        this.props.setPaState({modePaging: modePaging})
    };

    render() {
        let {item} = this.state;
        let {modePaging, contentModeId, contentMode} = this.props;
        return (
            <div className="listMode">
                {/*<Input placeholder="请输入搜索内容" value={modePaging.name} onChange={this.nameChange} append={<Button type="primary" icon="search" onClick={()=>{
                    this.props.modegoPage(1);
                }}>搜索</Button>} />*/}
                <Tabs type="card" value={contentModeId + ""} onTabClick={this.selectContentMode} className="listMode">
                    <Tabs.Pane label="全部" name="0">
                    </Tabs.Pane>
                    {contentMode.map((item, i) => {
                        return (
                            <Tabs.Pane label={item.name} name={item.id + ""}>
                            </Tabs.Pane>
                        )
                    })}
                    {item.map((item, i) => {
                        return (
                            <Tabs.Pane label={item.name} name={`item-${item.id}`}>

                            </Tabs.Pane>
                        )
                    })}
                </Tabs>
            </div>
        )
    }
}

export default ListMode;

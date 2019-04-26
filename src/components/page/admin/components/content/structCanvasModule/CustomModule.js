/**
 * Created by shiying on 17-9-28.自定义段落
 */

import React from 'react';
import {Dialog,Layout,Pagination} from 'element-react';
import 'element-theme-default';
import {ThousandsOfCall} from '../../../../../../components/lib/util/ThousandsOfCall';

class CustomModule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            data: {
                pageSize: 10,
                current: 1,
                total: 10,
            },
        };
        this.open = this._open.bind(this);
        this.close = this._close.bind(this);
        this.gainCommodity = this._gainCommodity.bind(this);
        this.goPage = this._goPage.bind(this);
        this.parameter = this._parameter.bind(this);
    }

    _gainCommodity(data) {
        ThousandsOfCall.acoustic({
                agreement: "https",
                hostname: "resource.taobao.com",
                path: '/comresource/query',
                method: "POST",
                data: data,
                referer: "https://we.taobao.com/",
            }, "requestRelyTB", (json20) => {
                if (json20) {
                    let json = JSON.parse(json20.data);
                    if (json.status == 'SUCCESS') {
                        this.setState({data: json.data});
                    }
                }

            }
        );
    }

    _goPage(num) {
        let {data} = this.state;
        data.current = num;
        this.setState({data},this.parameter);
    }

    _parameter() {
        let {data,collectionId,blockName}=this.state;
        this.gainCommodity({
            pageSize:data.pageSize ? data.pageSize : 10,
            current: data.current ? data.current : 1,
            collectionId:collectionId,
            blockName:blockName,
        });
    }

    _open(api) {
        this.setState({showModal: true}, () => {
            let arr = (api.split("?")[1]).split("&"),item = {};
            for (let i in arr) {
                item[((arr[i].split("="))[0])] = (arr[i].split("="))[1];
            }
            this.setState({collectionId: item.collectionId, blockName: item.blockName},this.parameter);
        })
    }

    _close(callback) {
        this.setState({
            showModal: false,
            data: {
                pageSize: 10,
                current: 1,
                total: 10,
            },
        },()=>{
            if(callback&&typeof callback=='function'){
                callback()
            }
        })
    }

    render() {
        let {data,showModal}=this.state;
        let {itemList=[]} = data;
        return (
            <div>
                <Dialog title="添加自定义段落" size="small" visible={showModal} onCancel={this.close} lockScroll={false}>
                    <Dialog.Body>
                        <Layout.Row gutter="6">
                            {itemList.map((item, index) => {
                                return(
                                    <Layout.Col span="6" key={index}>
                                        <div style={{border: "1px solid #6af",cursor:'pointer'}} onClick={() => {
                                            this.close(()=>this.props.callback(item));
                                        }}>
                                            <img src={item.coverUrl}/>
                                            <div style={{textAlign: "center"}}>{item.title}</div>
                                        </div>
                                    </Layout.Col>
                                )
                            })}
                        </Layout.Row>
                        <div style={{textAlign: "center",marginTop:'20px'}}>
                            <Pagination layout="prev, pager, next" total={data.total} small={true} currentPage={data.pageSize} onCurrentChange={this.goPage}/>
                        </div>
                    </Dialog.Body>
                </Dialog>
            </div>
        )
    }
}

export default CustomModule;

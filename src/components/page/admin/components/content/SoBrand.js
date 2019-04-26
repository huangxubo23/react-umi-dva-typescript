/**
 * Created by muqingzhong on 2017/7/18.搜品牌模态
 */
import React from 'react';
import {Layout, Input, Dialog,Tabs,Button,Tag} from 'element-react';
import 'element-theme-default';
import NewPanel from '../../../../../components/lib/util/elementsPanel';
import {ajax} from '../../../../../components/lib/util/ajax';
import '../../../../../styles/component/react_assembly/UpItem.js.css';

class SoBrand extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            brandName: undefined,
            allBrand: [],
            sellectBrand: undefined,
            nowBrandLog: "",
            nowBrandIntroduction: "",
            privateAllBrand: [],
            privateNowBrandLog: "",
            privateNowBrandIntroduction: "",
            key: '1',
            select: true,
            position: {
                one: 0,
                two: 0,
            }
        };
    }

    open = (brandName) => {
        this.setState({showModal: true, brandName: brandName}, () => {
            this.privateBrandByTitle();
        });
    };

    close = () => {
        this.setState({showModal: false, key: '1'});
    };
    brandNameChange = (env) => {
        let value = env.value;
        this.setState({brandName: value});
    };
    soBrandByTitle = () => {
        let key = this.state.key;
        if (key === '1') {
            this.privateBrandByTitle();
        } else if (key === '2') {
            const url = "/message/admin/cheesy/domain.findBrand.find.io";
            ajax.ajax({
                url: url,
                data: {brandName: this.state.brandName},
                callback: (data) => {
                    let sellectBrand = data.length > 0 ? data[0] : undefined;
                    let nowBrandLog = undefined;
                    if (sellectBrand) {
                        if (sellectBrand.brandLog.length > 0) {
                            let img = sellectBrand.brandLog[0];
                            if (img.indexOf("http") != 0) {
                                img = "https://img.alicdn.com/tps/" + img;
                            }
                            nowBrandLog = img;
                        }
                    }
                    this.setState({allBrand: data, sellectBrand: sellectBrand, nowBrandLog: nowBrandLog});
                }
            })
        }
    };

    sellectBrand = (env) => {
        let {i,type} = env;
        let {position} = this.state;
        if (type === 1) {
            position.one = i;
            let brand = this.state.privateAllBrand[i];
            let nowBrandLog = undefined;
            let log = brand.log;
            if (typeof log == "string") {
                nowBrandLog = log;
            } else {
                if (brand.log.length > 0) {
                    let img = brand.log[0];
                    if (img.indexOf("http") != 0) {
                        img = "https://img.alicdn.com/tps/" + img;
                    }
                    nowBrandLog = img;
                }
            }
            this.setState({
                position: position,
                privateSellectBrand: brand,
                privateNowBrandLog: nowBrandLog,
                privateNowBrandIntroduction: brand.introduction,
            });
        } else if (type === 2) {
            position.two = i;
            let brand = this.state.allBrand[i];
            let nowBrandLog = undefined;
            if (brand.brandLog.length > 0) {
                let img = brand.brandLog[0];
                if (img.indexOf("http") != 0) {
                    img = "https://img.alicdn.com/tps/" + img;
                }
                nowBrandLog = img;
            }
            this.setState({position: position, sellectBrand: brand, nowBrandLog: nowBrandLog});
        }
    };

    sellectnowBrandLog = (env) => {
        let {img,type} = env;
        if (type === 1) {
            this.setState({privateNowBrandLog: img});
        } else if (type === 2) {
            this.setState({nowBrandLog: img});
        }
    };

    nowBrandIntroductionChange = (env) => {
        let {value,type} = env;
        if (type === 1) {
            this.setState({privateNowBrandIntroduction: value});
        } else if (type === 2) {
            this.setState({nowBrandIntroduction: value});
        }
    };
    selectnowBrandIntroduction = (env) => {
        let {c,type} = env;
        let nowBrandIntroduction = this.state.nowBrandIntroduction;
        let privateNowBrandIntroduction = this.state.privateNowBrandIntroduction;
        if (type === 1) {
            this.setState({privateNowBrandIntroduction: privateNowBrandIntroduction.length > 0 ? (privateNowBrandIntroduction + "," + c) : c});
        } else if (type === 2) {
            this.setState({nowBrandIntroduction: nowBrandIntroduction.length > 0 ? (nowBrandIntroduction + "," + c) : c});
        }
    };
    submit = (env) => {
        let type = env.type;
        let {privateAllBrand, position, allBrand} = this.state;
        if (type === 1) {
            this.props.callback(this.state.privateNowBrandLog, this.state.privateNowBrandIntroduction, privateAllBrand[position.one].brandName);
        } else if (type === 2) {
            this.props.callback(this.state.nowBrandLog, this.state.nowBrandIntroduction, allBrand[position.two].brandName);
        }
        this.setState({
            brandName: undefined,
            allBrand: [],
            sellectBrand: undefined,
            nowBrandLog: "",
            nowBrandIntroduction: "",
            showModal: false
        });
    };


    handleSelect = (p) => {
        let name = p.props.name;
        this.setState({key: name}, () => {
            if (name === '2' && this.state.select) {
                this.soBrandByTitle();
                this.setState({select: false});
            }
        });
    };
    privateBrandByTitle = () => {
        if (this.state.brandName) {
            ajax.ajax({
                url: "/message/admin/cheesy/queryPrivateBrand.io",
                data: {brandName: this.state.brandName},
                callback: (data) => {
                    let sellectBrand = data[0];
                    let nowBrandLog = undefined;
                    if (data.length > 0) {
                        let introduction = sellectBrand.introduction;
                        if (sellectBrand.log != undefined) {
                            let img = sellectBrand.log;
                            if (img.indexOf("http") != 0) {
                                img = "https://img.alicdn.com/tps/" + img;
                            }
                            nowBrandLog = img;
                        }
                        this.setState({
                            privateAllBrand: data,
                            privateNowBrandIntroduction: introduction,
                            privateNowBrandLog: nowBrandLog
                        });
                    } else {
                        this.setState({key: '2'}, () => {
                            this.soBrandByTitle();
                            this.setState({
                                select: false,
                                privateAllBrand: [],
                                privateNowBrandLog: "",
                                privateNowBrandIntroduction: ""
                            });
                        })
                    }
                }
            });
        }
    };

    render() {
        return (
            <div >
                <Dialog title="搜品牌"  size="small" visible={this.state.showModal}
                        onCancel={this.close} lockScroll={false}>
                    <Dialog.Body>
                        <Input placeholder="请输入内容" value={this.state.brandName} onChange={(value) => {this.brandNameChange({value: value})}}
                               onKeyDown={(event) => {if (event.keyCode == "13") {this.soBrandByTitle()}}}
                               append={<Button type="primary" icon="search" onClick={this.soBrandByTitle}>搜索</Button>}/>
                        <br/>
                        <Tabs type="card" value={this.state.key}  onTabClick={this.handleSelect}>

                            <Tabs.Pane name='1' label="私人品牌库">
                                <div>
                                    {this.state.privateAllBrand.map((item, i) => {
                                        return (
                                            <span  className="ma" key={item.name}  onClick={()=>{this.sellectBrand({i:i,type:1})}}>
                                                <Tag type="primary" style={{lineHeight: 2, whiteSpace: "normal",cursor:'pointer'}}
                                                >{item.name}</Tag>
                                            </span>

                                        )
                                    })}
                                </div>
                                <br/>
                                {this.state.privateNowBrandLog ?
                                    <div>
                                        <NewPanel header="选择logo">
                                            <Layout.Row className="listBrandLogo">
                                                <Layout.Col sm={12}>
                                                    <img src={this.state.privateNowBrandLog}/>
                                                </Layout.Col>
                                                <Layout.Col sm={12}>

                                                </Layout.Col>
                                            </Layout.Row>
                                        </NewPanel>
                                        <NewPanel header="拼接品牌介绍">
                                            <Layout.Row className="listBrandIntroduction">
                                                <Layout.Col sm={12}>
                                                    <Input type="textarea" rows="7"  autosize={{ maxRows: 7}} placeholder="请输入内容"
                                                           value={this.state.privateNowBrandIntroduction}
                                                           onChange={(value)=>{this.nowBrandIntroductionChange({value:value,type:1})}}/>
                                                </Layout.Col>
                                                <Layout.Col sm={12} className="sellectBrand">

                                                </Layout.Col>
                                            </Layout.Row>
                                        </NewPanel>

                                        <Button type="success" onClick={()=>{this.submit({type:1})}}>提交</Button>
                                    </div> : undefined
                                }
                            </Tabs.Pane>
                            <Tabs.Pane name='2' label="公共品牌库">
                                <div className="text-justify">
                                    {this.state.allBrand.map((item, i) => {
                                        return (
                                            <span className="ma" key={item.brandName} onClick={()=>{this.sellectBrand({type:2,i:i})}}>
                                                <Tag type="primary" style={{lineHeight: 2, whiteSpace: "normal",cursor:'pointer'}} >{item.brandName}</Tag>
                                            </span>
                                        )
                                    })}
                                </div>
                                <br/>
                                {this.state.sellectBrand ?
                                    <div>
                                        <NewPanel header="选择logo">
                                            <Layout.Row className="listBrandLogo">
                                                <Layout.Col sm={12}><img src={this.state.nowBrandLog}/></Layout.Col>
                                                <Layout.Col sm={12}>
                                                    {this.state.sellectBrand.brandLog.map((item, i) => {
                                                        if (item.indexOf("http") != 0) {
                                                            item = "https://img.alicdn.com/tps/" + item;
                                                        }
                                                        return (
                                                            <Layout.Col sm={8} className="sellectnowBrandLog" key={item}>
                                                                <img src={item} onClick={()=>{this.sellectnowBrandLog({type:2,img:item})}}/>
                                                            </Layout.Col>
                                                        );
                                                    })}
                                                </Layout.Col>
                                            </Layout.Row>
                                        </NewPanel>
                                        <NewPanel header="拼接品牌介绍">
                                            <Layout.Row className="listBrandIntroduction">
                                                <Layout.Col sm={12}>
                                                    <Input type="textarea" autosize={{ minRows: 7}} placeholder="请输入内容"
                                                           value={this.state.nowBrandIntroduction}
                                                           onChange={(value)=>{this.nowBrandIntroductionChange({value:value,type:2})}}/>
                                                </Layout.Col>

                                                <Layout.Col sm={12} className="sellectBrand">
                                                    {this.state.sellectBrand.brandIntroduction.map((item, i) => {
                                                        return (
                                                            <span key={this.state.sellectBrand.brandName + i} onClick={()=>{this.selectnowBrandIntroduction({type:2,c:item})}}>
                                                            <Tag className="ma"
                                                                   data-v={item} data-type="2">{item}</Tag>
                                                            </span>

                                                        );
                                                    })}
                                                </Layout.Col>
                                            </Layout.Row>
                                        </NewPanel>

                                        <Button type="success" onClick={()=>{this.submit({type:2})}} >提交</Button>
                                    </div> : undefined
                                }
                            </Tabs.Pane>
                        </Tabs>
                    </Dialog.Body>
                </Dialog>
               {/*   <Modal show={this.state.showModal} onHide={this.close} bsSize="large">
                    <Modal.Header closeButton>
                        <Modal.Title>搜品牌</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                    </Modal.Body>
                </Modal>*/}
            </div>);
    }
}


export default SoBrand;

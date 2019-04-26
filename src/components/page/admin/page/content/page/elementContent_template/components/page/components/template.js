/**
 * Created by linhui on 17-7-26.模板内容
 */
import React from 'react';
import ReactChild from "../../../../../../../../../lib/util/ReactChild";
import {clone} from "../../../../../../../../../lib/util/global";
import {Form, Input, Switch, Select, InputNumber, Layout, Tabs, Card} from 'element-react';

require('../../../../../../../../../../styles/content/content_template.css');


let thisProps = {};

const myNumberChange = (data, onChen) => {//myProps数字类型显示
    return <Form.Item label={data.title}>
        <Layout.Col span="11">
            <InputNumber defaultValue={data.myValue ? data.myValue : data.value}
                         value={data.myValue ? data.myValue : data.value} placeholder="不输入则不限制" onChange={(value) => {
                onChen({value: value, label: data.label, name: data.name})
            }}/>
        </Layout.Col>
        <Layout.Col span="2">原始值</Layout.Col>
        <Layout.Col span="11">
            <InputNumber defaultValue={data.value} value={data.value ? data.value : ''} disabled={true}
                         placeholder="暂无"/>
        </Layout.Col>
    </Form.Item>
};

const myInputChange = (data, onChen) => {
    return <Form.Item label={data.title}>
        <Layout.Col span="11">
            <Input value={data.myValue ? data.myValue : data.value} placeholder="不输入则不限制" onChange={(value) => {
                onChen({value: value, label: data.label})
            }}/>
        </Layout.Col>
        <Layout.Col className="line" span="2">原始值</Layout.Col>
        <Layout.Col span="11">
            <Input value={data.value} placeholder="暂无" disabled={true} onChange={(value) => {
                onChen({value: value, label: data.label})
            }}/>
        </Layout.Col>
    </Form.Item>
};

class TextInput extends ReactChild {//文本输入框
    constructor(props) {
        super(props);
        this.state = {
            brandTitle: false,//搜品牌开关
        }
    }

    onChen = (env) => {
        let {onChange, index} = this.props;
        let value = env.value;
        let label = env.label;
        onChange(index, label, value);
    };

    componentWillUpdate(props) {
        thisProps = props;
    }

    componentDidMount() {
        if (this.props.data.myProps && this.props.data.myProps.brandTitle) {
            this.setState({brandTitle: true});

        }
    }

    onBrandTitleChange = (env) => {//是否搜品牌
        let {onChange, index} = this.props;
        let value = env;
        this.setState({brandTitle: value}, () => {
            onChange(index, 'brandTitle', value);
        });
    };

    render() {
        let {data, arrayCreatorAddImage, arrayInput} = this.props;
        data.myProps = data.myProps ? data.myProps : {};
        let {brandTitle} = this.state;
        return (
            <div>
                <Form labelWidth="100">
                    {data.isTitle &&
                    <Form.Item label='是否标题'><Switch value={data.isTitle} onText="" offText=""/></Form.Item>}
                    <Form.Item label='是否搜品牌'>
                        <Switch value={data.myProps.brandTitle || brandTitle} onText="" offText=""
                                onChange={this.onBrandTitleChange}/>
                    </Form.Item>

                    {brandTitle && <Form.Item label='品牌logo'>
                        <Select value={data.myProps.brandLogoName} onChange={(value) => {
                            this.onChen({value: value, label: 'brandLogoName'})
                        }}>
                            <Select.Option disabled value='' label='请选择品牌logo'/>
                            {(arrayCreatorAddImage || []).map((item, i) => {
                                return (<Select.Option key={i} value={item.name} label={item.title}/>)
                            })}
                        </Select>
                    </Form.Item>}
                    {brandTitle && <Form.Item label='品牌介绍'>
                        <Select value={data.myProps.brandIntroductionName} onChange={(value) => {
                            this.onChen({value: value, label: 'brandIntroductionName'})
                        }}>
                            <Select.Option value=''>请选择品牌介绍</Select.Option>
                            {(arrayInput ? arrayInput : []).map((item, i) => {
                                return (<Select.Option key={i} value={item.name} label={item.title}/>)
                            })}
                        </Select>
                    </Form.Item>}

                    {myNumberChange({
                        title: "最多显示几行",
                        value: data.props.rows,
                        myValue: data.myProps.rows,
                        label: 'rows'
                    }, this.onChen)}

                    {myNumberChange({
                        title: "字符最多字数",
                        value: data.props.maxLength,
                        myValue: data.myProps.maxLength,
                        label: 'maxLength'
                    }, this.onChen)}

                    {myNumberChange({
                        title: "字符最少字数",
                        value: data.props.minLength,
                        myValue: data.myProps.minLength,
                        label: 'minLength'
                    }, this.onChen)}

                    {myInputChange({
                        title: "输入框提示语",
                        value: data.props.placeholder,
                        myValue: data.myProps.placeholder,
                        label: 'placeholder'
                    }, this.onChen)}

                    {myInputChange({
                        title: "内容单位",
                        value: data.props.addonAfter,
                        myValue: data.myProps.addonAfter,
                        label: 'addonAfter'
                    }, this.onChen)}
                </Form>
            </div>
        )
    }
}

class CreatorAddItem extends ReactChild {//添加宝贝
    componentDidMount() {
        thisProps = this.props;
        this.props.data.myProps = this.props.data.myProps ? this.props.data.myProps : {};
        let selectedImgPoint = '', editDescMaxLength = '';

        if (this.props.data.myProps.selectedImgPoint) {
            selectedImgPoint = this.props.data.myProps.selectedImgPoint;
        } else if (this.props.data.myProps.selectedImgPoint) {
            selectedImgPoint = this.props.data.myProps.selectedImgPoint;
        }

        if (this.props.data.myProps.editDescMaxLength) {
            editDescMaxLength = this.props.data.myProps.editDescMaxLength;
        } else if (this.props.data.props.editDescMaxLength) {
            editDescMaxLength = this.props.data.props.editDescMaxLength;
        }

        this.setState({selectedImgPoint: selectedImgPoint}, () => {
            if (editDescMaxLength) {
                this.setState({isDesc: true}, () => {
                    this.props.onChange(this.props.index, 'isDesc', true);
                });
            }
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            selectedImgPoint: '',//备选图1
            selectedImgPoint2: '',//备选图2
            isDesc: false,//是否添加商品描述
        }
    }

    onChen = (env) => {
        let {onChange, index} = this.props;
        let value = env.value;
        let label = env.label;
        onChange(index, label, value);
    };
    selectedImgonChen = (env) => {
        let {onChange, index} = this.props;
        let value = env.value;

        this.setState({selectedImgPoint: value}, () => {
            if (!value) {
                onChange(index, 'selectedImgNumber', '');
            }
            onChange(index, 'selectedImgPoint', value);
        });
    };

    selectedImgonChen2 = (env) => {
        let value = env.value;
        let {onChange, index} = this.props;
        this.setState({selectedImgPoint2: value}, () => {
            if (!value) {
                onChange(index, 'selectedImgNumber', '');
            }
            onChange(index, 'selectedImgPoint2', value);
        });
    };

    isDescChange = (env) => {//是否添加商品描述
        let value = env.value;
        let {onChange, index} = this.props;
        if (!value) {
            onChange(index, 'editDescMaxLength', '',);
            onChange(index, 'editDescMinLength', '',);
        }
        this.setState({isDesc: value}, () => {
            onChange(index, 'isDesc', value);
        });
    };

    render() {
        let {data, arrayCreatorAddImage, arrayInput, heayWarehouse} = this.props;
        data.myProps = data.myProps ? data.myProps : {};
        return (
            <div>
                <Form labelWidth="100">
                    {data.isCoverImg &&
                    <Form.Item label='是否封面图' disabled><Switch value={true} onText="" offText=""/></Form.Item>}

                    <Form.Item label="备选图指向①">
                        <Select value={data.myProps.selectedImgPoint} onChange={(value) => {
                            this.selectedImgonChen({value: value, label: 'selectedImgPoint'})
                        }}>
                            <Select.Option value='' label='请选择备选图指向①'/>{/*label={item.name} */}
                            {(arrayCreatorAddImage ? arrayCreatorAddImage : []).map((item, i) => {
                                return <Select.Option key={i} value={item.title} label={item.title}/>
                            })}
                        </Select>
                    </Form.Item>

                    <Form.Item label='备选图指向②'>
                        <Select value={data.myProps.selectedImgPoint2} onChange={(value) => {
                            this.selectedImgonChen2({value: value, label: 'selectedImgPoint2'})
                        }}>
                            <Select.Option value='' label='请选择备选图指向②'/>{/*label={item.name}*/}
                            {(arrayCreatorAddImage ? arrayCreatorAddImage : []).map((item, i) => {
                                return <Select.Option key={i} value={item.title} label={item.title}/>
                            })}
                        </Select>
                    </Form.Item>

                    <Form.Item label="选择排重库">
                        <Select value={data.myProps.isRowHeay} onChange={(value) => {
                            this.onChen({value: value, label: 'isRowHeay'})
                        }}>
                            <Select.Option value='' label='请选择排重库'/>
                            {(heayWarehouse ? heayWarehouse : []).map((item, i) => {
                                return <Select.Option key={item.id} value={item.id} label={item.name}/>
                            })}
                        </Select>
                    </Form.Item>

                    <Form.Item label="标题指向">
                        <Select value={data.myProps.titlePoint} onChange={(value) => {
                            this.onChen({value: value, label: 'titlePoint'})
                        }}>
                            <Select.Option value='' label='请选择标题指向'/>
                            {(arrayInput ? arrayInput : []).map((item, i) => {
                                return <Select.Option key={i} value={item.name} label={item.title}/>
                            })}
                        </Select>
                    </Form.Item>

                    <Form.Item label='是否添加商品描述'>
                        <Switch value={data.myProps.isDesc || this.state.isDesc} onText="" offText=""
                                onChange={(value) => {
                                    this.isDescChange({value: value})
                                }}/>
                    </Form.Item>

                    {this.state.isDesc && myNumberChange({
                        title: "商品描述最多字数",
                        value: data.props.editDescMaxLength,
                        myValue: data.myProps.editDescMaxLength,
                        label: 'editDescMaxLength'
                    }, this.onChen)}

                    {this.state.isDesc && myNumberChange({
                        title: "商品描述最少字数",
                        value: data.props.editDescMinLength,
                        myValue: data.myProps.editDescMinLength,
                        label: 'editDescMinLength'
                    }, this.onChen)}

                    {myNumberChange({
                        title: "最多几个商品",
                        value: data.props.max,
                        myValue: data.myProps.max,
                        label: 'max'
                    }, this.onChen)}

                    {myNumberChange({
                        title: "最少几个商品",
                        value: data.props.min,
                        myValue: data.myProps.min,
                        label: 'min'
                    }, this.onChen)}

                    {myNumberChange({
                        title: "标题最多字数",
                        value: data.props.editTitleMaxLength,
                        myValue: data.myProps.editTitleMaxLength,
                        label: 'editTitleMaxLength'
                    }, this.onChen)}

                    {myNumberChange({
                        title: "标题最少字数",
                        value: data.props.editTitleMinLength,
                        myValue: data.myProps.editTitleMinLength,
                        label: 'editTitleMinLength'
                    }, this.onChen)}

                    {myNumberChange({
                        title: "店铺最小数量",
                        value: data.props.minShop,
                        myValue: data.myProps.minShop,
                        label: 'minShop'
                    }, this.onChen)}

                    {myNumberChange({
                        title: "每个店铺最多商品",
                        value: data.props.shopMaxItem,
                        myValue: data.myProps.shopMaxItem,
                        label: 'shopMaxItem'
                    }, this.onChen)}

                    {myInputChange({
                        title: "商品提示语",
                        value: data.props.tips,
                        myValue: data.myProps.tips,
                        label: 'tips'
                    }, this.onChen)}

                    {(this.state.selectedImgPoint && this.state.selectedImgPoint2) &&
                    myNumberChange({
                        title: "备选图数量",
                        value: data.props.selectedImgNumber,
                        myValue: data.myProps.selectedImgNumber,
                        label: 'selectedImgNumber'
                    }, this.onChen)}

                    <Form.Item label="activityId"><Input disabled value={data.props.activityId}/></Form.Item>

                    <Form.Item label="poolId"><Input
                        value={data.props.categoryListApiQuery ? data.props.categoryListApiQuery.poolId : ''} disabled/></Form.Item>
                </Form>
            </div>
        )
    }
}

class CreatorAddImage extends ReactChild {//添加图片
    onChen = (env) => {
        let {onChange, index} = this.props;
        let value = env.value;
        let label = env.label;
        onChange(index, label, value);
    };

    componentDidMount() {
        this.props.data.myProps = this.props.data.myProps ? this.props.data.myProps : {};
        let pixFilter = '';

        if (this.props.data.myProps.pixFilter) {
            pixFilter = this.props.data.myProps.pixFilter;
        } else if (this.props.data.props.pixFilter) {
            pixFilter = this.props.data.props.pixFilter;
        }

        if (pixFilter) {
            let pf = pixFilter.split('x');
            let w = pf[0];
            let h = pf[1];
            this.setState({w: w, h: h});
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            w: '',
            h: '',
        }
    }

    widthChange = (env) => {//宽事件
        let {onChange, index, data} = this.props;
        data.myProps = data.myProps ? data.myProps : {};
        let width = env.value;
        let value = width + 'x' + data.myProps.creatorAddImageH;
        onChange(index, 'pixFilter', value, 'creatorAddImageW');
    };
    heightChange = (env) => {//高事件
        let {onChange, index, data} = this.props;
        data.myProps = data.myProps ? data.myProps : {};
        let height = env.value;
        let value = data.myProps.creatorAddImageW + 'x' + height;
        onChange(index, 'pixFilter', value, 'creatorAddImageH');
    };

    render() {
        let {data} = this.props;
        data.myProps = data.myProps ? data.myProps : {};
        return (
            <div>
                <Form labelWidth="100">
                    {data.isCoverImg &&
                    <Form.Item label='是否封面图' disabled><Switch value={true} onText="" offText=""/></Form.Item>}

                    {myNumberChange({
                        title: "最多几张图片",
                        value: data.props.max,
                        myValue: data.myProps.max,
                        label: 'max'
                    }, this.onChen)}

                    {myNumberChange({
                        title: "最少几张图片",
                        value: data.props.min,
                        myValue: data.myProps.min,
                        label: 'min'
                    }, this.onChen)}

                    {myNumberChange({
                        title: "图片宽度",
                        value: data.props.pixFilter.split("x")[0],
                        myValue: data.myProps.creatorAddImageW,
                        label: 'creatorAddImageW'
                    }, this.widthChange)}

                    {myNumberChange({
                        title: "图片高度",
                        value: data.props.pixFilter.split("x")[1],
                        myValue: data.myProps.creatorAddImageH,
                        label: 'creatorAddImageH'
                    }, this.heightChange)}

                    {myInputChange({
                        title: "图片提示框",
                        value: data.props.tips,
                        myValue: data.myProps.tips,
                        label: 'tips'
                    }, this.onChen)}
                </Form>
            </div>
        )
    }
}

class AddLink extends ReactChild {//添加文本链接
    onChen = (env) => {
        let {onChange, index} = this.props;
        let value = env.value;
        let label = env.label;
        onChange(index, label, value);
    };

    render() {
        let {data} = this.props;
        data.myProps = data.myProps ? data.myProps : {};
        return (
            <div>
                <Form labelWidth="100">
                    {myInputChange({
                        title: "文本链接提示语",
                        value: data.props.tips,
                        myValue: data.myProps.tips,
                        label: 'tips'
                    }, this.onChen)}
                </Form>
            </div>
        )
    }
}

class TagPicker extends ReactChild {//分类
    onChen = (env) => {
        let {onChange, index} = this.props;
        let value = env.value;
        let label = env.label;
        onChange(index, label, value);
    };

    constructor(props) {
        super(props);
        this.state = {
            arrays: [],
        }
    }

    componentWillMount() {
        this.props.data.myProps = this.props.data.myProps ? this.props.data.myProps : {};
        let obj = this.props.data.myProps.dataSource ? this.props.data.myProps.dataSource : this.props.data.props.dataSource;
        let arrays = [];
        for (let x in obj) {
            arrays.push({name: x, value: obj[x]});
        }
        this.setState({arrays: arrays});
    }

    render() {
        let {data} = this.props;
        data.myProps = data.myProps ? data.myProps : {};
        return (
            <div>
                <Form labelWidth="100">
                    {myNumberChange({
                        title: "最少几个分类",
                        value: data.props.min,
                        myValue: data.myProps.min,
                        label: 'min'
                    }, this.onChen)}

                    {myNumberChange({
                        title: "最多几个分类",
                        value: data.props.max,
                        myValue: data.myProps.max,
                        label: 'max'
                    }, this.onChen)}
                </Form>
                {this.state.arrays.map((item, i) => {
                    return (
                        <Card key={i}
                              title={<div className="clearfix"><span style={{"lineHeight": "36px"}}>{item.name}</span>
                              </div>}>
                            {item.value.map((items, i) => {
                                return (
                                    <div className="text item" key={i}>{items.label}</div>
                                )
                            })}
                        </Card>
                    )
                })}
            </div>
        )
    }
}

class Activity extends ReactChild {//互动
    render() {
        return (
            <div>
                {/*<Panel header={this.props.data.title}></Panel>*/}
            </div>
        )
    }
}

class AddTag extends ReactChild {//添加标签
    onChen = (env) => {
        let {onChange, index} = this.props;
        let value = env.value;
        let label = env.label;
        onChange(index, label, value);
    };

    render() {
        let {data} = this.props;
        data.myProps = data.myProps ? data.myProps : {};
        return (
            <div>
                <Form labelWidth="100">
                    {myNumberChange({
                        title: "最少几个标签",
                        value: data.props.min,
                        myValue: data.myProps.min,
                        label: 'min'
                    }, this.onChen)}

                    {myNumberChange({
                        title: "最多几个标签",
                        value: data.props.max,
                        myValue: data.myProps.min,
                        label: 'max'
                    }, this.onChen)}

                    {myNumberChange({
                        title: "标签最少字数",
                        value: data.props.minLength,
                        myValue: data.myProps.minLength,
                        label: 'minLength'
                    }, this.onChen)}

                    {myNumberChange({
                        title: "标签最多字数",
                        value: data.props.maxLength,
                        myValue: data.myProps.maxLength,
                        label: 'maxLength'
                    }, this.onChen)}
                </Form>
            </div>
        )
    }
}

class RadioGroup extends ReactChild {//模特尺码
    onChen = (env) => {
        let {onChange, index, data} = this.props;
        let value = env.target.checked;
        let dataSource = data.props.dataSource;
        let i = $(env.target).data('i');
        for (let y = 0; y < dataSource.length; y++) {
            dataSource[i].disabled = value;
        }
        onChange(index, 'dataSource', dataSource);
    };

    render() {
        let {data} = this.props;
        return (
            <div>
                {(data.props.dataSource ? data.props.dataSource : []).map((item, i) => {
                    return (
                        <div key={i}>
                            <p>{data.props.value==item.value&&'当前选中:'}{item.label}</p>
                            {/*    <Col componentClass={ControlLabel} sm={6}>

                                    </Col>
                                    <Col componentClass={ControlLabel} sm={4}>
                                        是否禁用
                                    </Col>
                                    <Col sm={2}>
                                        <Checkbox data-i={i} checked={item.disabled == true ? 'checked' : ''}
                                                  onChange={this.onChen}/>
                                    </Col>*/}
                        </div>
                    )
                })}
            </div>
        )
    }
}

class AnchorImageList extends ReactChild {//搭配/图集
    onChen = (env) => {
        let {onChange, index} = this.props;
        let value = env.value;
        let label = env.label;
        onChange(index, label, value);
    };

    constructor(props) {
        super(props);
        this.state = {
            w: '',
            h: '',
            choiceItemPool: true,//强制选品池，默认强制
        }
    }

    widthChange = (env) => {//宽度事件
        let {onChange, index, data} = this.props;
        data.myProps = data.myProps ? data.myProps : {};
        let width = env.value;
        let value = width + 'x' + data.myProps.anchorImageListH;
        onChange(index, 'pixFilter', value, 'anchorImageListW');

    };
    heightChange = (env) => {//高度事件
        let {onChange, index, data} = this.props;
        data.myProps = data.myProps ? data.myProps : {};
        let height = env.value;
        let value = data.myProps.anchorImageListW + 'x' + height;
        onChange(index, 'pixFilter', value, 'anchorImageListH');
    };

    render() {
        let {data} = this.props;
        data.myProps = data.myProps ? data.myProps : {};
        return (
            <div>
                <Form labelWidth="100">
                    {myNumberChange({
                        title: "最多几个锚点",
                        value: data.props.maxAnchors,
                        myValue: data.myProps.maxAnchors,
                        label: 'maxAnchors'
                    }, this.onChen)}

                    {myNumberChange({
                        title: "最少几个锚点",
                        value: data.props.minAnchors,
                        myValue: data.myProps.minAnchors,
                        label: 'minAnchors'
                    }, this.onChen)}

                    {myNumberChange({
                        title: "最长锚点标题长度",
                        value: data.props.titleMaxLength,
                        myValue: data.myProps.titleMaxLength,
                        label: 'titleMaxLength'
                    }, this.onChen)}

                    {myNumberChange({
                        title: "最短锚点标题长度",
                        value: data.props.titleMinLength,
                        myValue: data.myProps.titleMinLength,
                        label: 'titleMinLength'
                    }, this.onChen)}

                    {myNumberChange({
                        title: "最多几张图片",
                        value: data.props.max,
                        myValue: data.myProps.max,
                        label: 'max'
                    }, this.onChen)}

                    {myNumberChange({
                        title: "最少几张图片",
                        value: data.props.min,
                        myValue: data.myProps.min,
                        label: 'min'
                    }, this.onChen)}

                    {myNumberChange({
                        title: "图片宽度",
                        value: data.props.anchorImageListW,
                        myValue: data.myProps.anchorImageListW,
                        label: 'titleMaxLength'
                    }, this.widthChange)}

                    {myNumberChange({
                        title: "图片高度",
                        value: data.props.anchorImageListH,
                        myValue: data.myProps.anchorImageListH,
                        label: 'anchorImageListH'
                    }, this.heightChange)}
                </Form>
            </div>
        )
    }
}

class Editor extends ReactChild {//富文本编辑框
    componentDidMount() {
        this.props.data.myProps = this.props.data.myProps ? this.props.data.myProps : {};
        let [isAddShop, itemDescribe] = [false, false];
        if (this.props.data.myProps.isAddShop) {
            isAddShop = this.props.data.myProps.isAddShop;
        } else if (this.props.data.props.isAddShop) {
            isAddShop = this.props.data.props.isAddShop;
        }
        if (this.props.data.myProps.itemDescribe) {
            itemDescribe = this.props.data.myProps.itemDescribe;
        } else if (this.props.data.props.itemDescribe) {
            itemDescribe = this.props.data.props.itemDescribe;
        }
        if (isAddShop) {
            this.setState({isAddShop: true});
        }
        if (itemDescribe) {
            this.setState({itemDescribe: true});
        }
    }

    constructor(props) {
        super(props);
        let plugins = this.props.data.props.plugins;
        this.state = {
            isAddItem: true,//是否添加商品
            isAddShop: false,//是否添加店铺
            itemDescribe: false,//添加商品是否需要描述
            commodityPool: false,//是否显示右侧商品池
            choiceItemPool: true,//强制选品池,默认强制
        }
    }


    isEditorChange = (env) => {//plugins　array事件
        let {onChange, index, data, newProps} = this.props;
        let {value, label} = env;
        data.myProps = data.myProps ? data.myProps : {};
        let plugins = data.myProps.plugins ? data.myProps.plugins : clone(data.props.plugins);
        let newPropsPlugins = newProps.plugins;
        let array = [];
        if (value) {
            array = plugins;
            for (let i = 0; i < newPropsPlugins.length; i++) {
                if (newPropsPlugins[i].name === label) {
                    array.push(newPropsPlugins[i]);
                }
            }
        } else {
            for (let i = 0; i < plugins.length; i++) {
                if (label !== plugins[i].name) {
                    array.push(plugins[i]);
                }
            }
        }
        onChange(index, 'plugins', array);
    };
    checkboxChange = (env) => {//plugins props内部事件
        let {onChange, index, data} = this.props;
        let value = env.value;
        let label = env.label;
        let name = env.name;
        data.myProps = data.myProps ? clone(data.myProps) : {};
        let plugins = data.myProps.plugins ? data.myProps.plugins : clone(this.props.data.props.plugins);
        for (let i = 0; i < plugins.length; i++) {
            if (plugins[i].name === name) {
                plugins[i].props[label] = parseInt(value);
            }
        }
        onChange(index, 'plugins', plugins);
    };

    isaddfor = (string) => {//循环旧名字
        let plugins = this.props.data.props.plugins;
        let flag = false;
        for (let i = 0; i < plugins.length; i++) {
            if (plugins[i].name && plugins[i].name === string) {
                flag = true;
                return flag;
            }
        }
        return flag;
    };

    isMyAddFor = (string) => {//循环MyProps旧名字
        this.props.data.myProps = this.props.data.myProps ? clone(this.props.data.myProps) : {};
        let plugins = this.props.data.myProps.plugins ? this.props.data.myProps.plugins : this.props.data.props.plugins;
        let flag = false;
        for (let i = 0; i < plugins.length; i++) {
            if (plugins[i].name && plugins[i].name === string) {
                flag = true;
                return flag;
            }
        }
        return flag;
    };

    isPropsfor = (string) => {//循环旧props数据
        let plugins = this.props.data.props.plugins;
        for (let i = 0; i < plugins.length; i++) {
            if (plugins[i].name && plugins[i].name === string) {
                return plugins[i].props;
            }
        }
    };
    isMyPropsFor = (string) => {//循环久myProps数据
        this.props.data.myProps = this.props.data.myProps ? this.props.data.myProps : {};
        let plugins = this.props.data.myProps.plugins ? this.props.data.myProps.plugins : this.props.data.props.plugins;
        for (let i = 0; i < plugins.length; i++) {
            if (plugins[i].name && plugins[i].name === string) {
                return plugins[i].props;
            }
        }
    };

    render() {
        let plugins = this.props.newProps.plugins;
        let isitem = this.isPropsfor('SIDEBARSEARCHITEM');
        let hotImage = this.isPropsfor('SIDEBARHOTSPACEIMAGE');
        let isMyItem = this.isMyPropsFor('SIDEBARSEARCHITEM');
        let myHotImage = this.isMyPropsFor('SIDEBARHOTSPACEIMAGE');
        let {data} = this.props;
        return (
            <div>
                <Form labelWidth="100">
                    {data.isCoverImg &&
                    <Form.Item label='是否封面图' disabled><Switch value={true} onText="" offText=""/></Form.Item>}

                    {(plugins ? plugins : []).map((item, i) => {
                        if (item.name === 'SIDEBARIMAGE') {
                            return <Form.Item key={item.name + i} label='是否添加图片'>
                                <Layout.Col span="11">
                                    <Switch value={this.isMyAddFor('SIDEBARIMAGE')} onChange={(value) => {
                                        this.isEditorChange({value: value, label: 'SIDEBARIMAGE'})
                                    }}/>

                                </Layout.Col>
                                <Layout.Col span="2">原始值</Layout.Col>
                                <Layout.Col span="11">
                                    <Switch value={this.isaddfor('SIDEBARIMAGE')} disabled={true}/>
                                </Layout.Col>
                            </Form.Item>;
                        }
                        if (item.name === 'SIDEBARADDSPU') {//标准品牌库选择
                            return <div key={item.name + i}>
                                <Form.Item label="标准品牌库">
                                    <Switch value={this.isaddfor('SIDEBARADDSPU')} onText="" offText=""
                                            onChange={(value) => {
                                                this.isEditorChange({value: value, label: 'SIDEBARADDSPU'})
                                            }}/>
                                </Form.Item>
                            </div>
                        }
                        if (item.name === 'SIDEBARADDSHOP') {
                            return <Form.Item key={item.name + i} label='是否添加店铺'>
                                <Layout.Col span="11">
                                    <Switch value={this.isMyAddFor('SIDEBARADDSHOP')} onChange={(value) => {
                                        this.isEditorChange({value: value, label: 'SIDEBARADDSHOP'})
                                    }}/>
                                </Layout.Col>
                                <Layout.Col span="2">原始值</Layout.Col>
                                <Layout.Col span="11">
                                    <Switch value={this.isaddfor('SIDEBARADDSHOP')} disabled={true}/>
                                </Layout.Col>
                            </Form.Item>;
                        }
                        if (item.name === 'SIDEBARSEARCHITEM') {
                            return <div key={item.name + i}>
                                <Form.Item key={item.name + i} label='是否添加商品'>
                                    <Layout.Col span="11">
                                        <Switch value={this.isMyAddFor('SIDEBARSEARCHITEM')} onChange={(value) => {
                                            this.isEditorChange({value: value, label: 'SIDEBARSEARCHITEM'})
                                        }}/>
                                    </Layout.Col>
                                    <Layout.Col span="2">原始值</Layout.Col>
                                    <Layout.Col span="11">
                                        <Switch value={this.isaddfor('SIDEBARSEARCHITEM')} disabled={true}/>
                                    </Layout.Col>
                                </Form.Item>

                                {this.isMyAddFor('SIDEBARSEARCHITEM') && <div>
                                    {myNumberChange(
                                        {
                                            title: "商品描述最多字数",
                                            value: isitem.editDescMaxLength,
                                            myValue: isMyItem.editDescMaxLength,
                                            label: 'editDescMaxLength',
                                            name: 'SIDEBARSEARCHITEM'
                                        }, this.checkboxChange)
                                    }

                                    {myNumberChange(
                                        {
                                            title: "商品描述最少字数",
                                            value: isitem.editDescMinLength,
                                            myValue: isMyItem.editDescMinLength,
                                            label: 'editDescMinLength',
                                            name: 'SIDEBARSEARCHITEM'
                                        }, this.checkboxChange)
                                    }

                                    {myNumberChange(
                                        {
                                            title: "商品标题最多数",
                                            value: isitem.editTitleMaxLength,
                                            myValue: isMyItem.editTitleMaxLength,
                                            label: 'editTitleMaxLength',
                                            name: 'SIDEBARSEARCHITEM'
                                        }, this.checkboxChange)
                                    }

                                    {myNumberChange(
                                        {
                                            title: "商品标题最少数",
                                            value: isitem.editTitleMinLength,
                                            myValue: isMyItem.editTitleMinLength,
                                            label: 'editTitleMinLength',
                                            name: 'SIDEBARSEARCHITEM'
                                        }, this.checkboxChange)
                                    }

                                    {myNumberChange(
                                        {
                                            title: "最多几家店铺的商品",
                                            value: isitem.maxShopItem,
                                            myValue: isMyItem.maxShopItem,
                                            label: 'maxShopItem',
                                            name: 'SIDEBARSEARCHITEM'
                                        }, this.checkboxChange)
                                    }

                                    {myNumberChange(
                                        {
                                            title: "最少几家店铺的商品",
                                            value: isitem.minShopItem,
                                            myValue: isMyItem.minShopItem,
                                            label: 'minShopItem',
                                            name: 'SIDEBARSEARCHITEM'
                                        }, this.checkboxChange)
                                    }

                                    {myNumberChange(
                                        {
                                            title: "每个店铺最多几个商品",
                                            value: isitem.shopMaxItem,
                                            myValue: isMyItem.shopMaxItem,
                                            label: 'shopMaxItem',
                                            name: 'SIDEBARSEARCHITEM'
                                        }, this.checkboxChange)
                                    }

                                    {myNumberChange({
                                        title: "最少几个商品",
                                        value: isitem.min,
                                        myValue: isMyItem.min,
                                        label: 'min',
                                        name: 'SIDEBARSEARCHITEM'
                                    }, this.checkboxChange)}

                                    {myNumberChange({
                                        title: "最多几个商品",
                                        value: isitem.max,
                                        myValue: isMyItem.max,
                                        label: 'max',
                                        name: 'SIDEBARSEARCHITEM'
                                    }, this.checkboxChange)}
                                </div>}
                            </div>;
                        }
                        if (item.name === 'SIDEBARHOTSPACEIMAGE') {
                            return <div key={item.name + i}>
                                <Form.Item key={item.name + i} label='是否添加热区图'>
                                    <Layout.Col span="11">
                                        <Switch value={this.isMyAddFor('SIDEBARHOTSPACEIMAGE')} onChange={(value) => {
                                            this.isEditorChange({value: value, label: 'SIDEBARHOTSPACEIMAGE'})
                                        }}/>
                                    </Layout.Col>
                                    <Layout.Col span="2">原始值</Layout.Col>
                                    <Layout.Col span="11">
                                        <Switch value={this.isaddfor('SIDEBARHOTSPACEIMAGE')} disabled={true}/>
                                    </Layout.Col>
                                </Form.Item>

                                {this.isaddfor('SIDEBARHOTSPACEIMAGE') && <div>
                                    {myNumberChange(
                                        {
                                            title: "最大热区图标题长度",
                                            value: hotImage.titleMaxLength,
                                            myValue: myHotImage.titleMaxLength,
                                            label: 'titleMaxLength',
                                            name: 'SIDEBARHOTSPACEIMAGE'
                                        }, this.checkboxChange)
                                    }

                                    {myNumberChange(
                                        {
                                            title: "最大几个热区图",
                                            value: hotImage.maxHotSpaces,
                                            myValue: myHotImage.maxHotSpaces,
                                            label: 'maxHotSpaces',
                                            name: 'SIDEBARHOTSPACEIMAGE'
                                        }, this.checkboxChange)
                                    }

                                    {myNumberChange({
                                        title: "最小几个热区图",
                                        value: hotImage.minSpaces,
                                        myValue: myHotImage.minSpaces,
                                        label: 'minSpaces',
                                        name: 'SIDEBARHOTSPACEIMAGE'
                                    }, this.checkboxChange)}
                                </div>}
                            </div>
                        }
                        if (item.name === 'NUMBER') {
                            return <Form.Item key={item.name + i} label='是否添加编号'>
                                <Layout.Col span="11">
                                    <Switch value={this.isMyAddFor('NUMBER')} onChange={(value) => {
                                        this.isEditorChange({value: value, label: 'NUMBER'})
                                    }}/>
                                </Layout.Col>
                                <Layout.Col span="2">原始值</Layout.Col>
                                <Layout.Col span="11">
                                    <Switch value={this.isaddfor('NUMBER')} disabled={true}/>
                                </Layout.Col>
                            </Form.Item>;
                        }
                    })}
                </Form>
            </div>
        )
    }
}

class Struct7 extends ReactChild {

    constructor(props) {
        super(props);
        this.state = {
            brandTitle: false,
        }
    }

    onChen = (env) => {
        let {onChange, kn, myData} = this.props;
        myData = myData ? myData : {};
        let value = env.value;
        let label = env.label;
        if (value) {
            myData[label] = value;
        } else {
            delete myData[label];
        }
        onChange(myData, kn);
    };

    onItemsChange = (newData) => {//array事件

        let myData = this.props.myData;
        myData = myData ? myData : {};
        if (Object.keys(newData).length) {
            myData.items = newData;
        } else {
            delete myData.items
        }
        this.props.onChange(myData, this.props.kn);


    };

    onObjectChange = (newData, key) => {//object事件
        let myData = this.props.myData;
        myData = myData ? myData : {};
        let properties = myData.properties ? myData.properties : {};
        if (Object.keys(newData).length) {
            properties[key] = newData;
            myData.properties = properties;
        } else {
            delete properties[key];
        }
        if (myData.properties && Object.keys(myData.properties).length <= 0) {
            //myData.properties = properties;
            delete myData.properties;
        }
        this.props.onChange(myData, this.props.kn);
    };

    widthChange = (env) => {//宽
        let [width, label, myData] = [env.value, env.label, this.props.myData];
        myData = myData ? myData : {};
        if (width) {
            myData[label] = width;
            myData.pixFilter = width + 'x';
            if (myData.creatorAddImageH) {
                myData.pixFilter = (width + 'x') + myData.creatorAddImageH;
            }


        } else {
            delete myData[label];
            delete myData.pixFilter;
        }

        this.props.onChange(myData, this.props.kn);

    };

    heightChange = (env) => {//高
        let [height, label, myData] = [env.value, env.label, this.props.myData];
        myData = myData ? myData : {};
        if (height) {
            myData[label] = height;
            myData.pixFilter = 'x' + height;
            if (myData.creatorAddImageW) {
                myData.pixFilter = myData.creatorAddImageW + 'x' + height;
            }

        } else {
            delete myData[label];
            delete myData['pixFilter'];
        }
        this.props.onChange(myData, this.props.kn);
    };

    searchBrandChange = (env) => {//搜品牌事件，给logo和接受默认值
        let [value, label, myData] = [env.value, env.label, this.props.myData];
        myData =  myData?myData:{};
        if (value) {
            let properties = myData.properties;
            for (let i in properties) {
                if (properties[i].type === 'string') {//介绍赋值
                    if (properties[i]['ui:widget'] === 'textarea') {
                        myData['brandIntroductionName'] = properties[i].title;
                    }
                } else if (properties[i].type === 'array') {//logo赋值
                    if (properties[i]['ui:field'] === 'CoverImageField') {
                        myData['brandLogoName'] = properties[i].title;
                    }
                }
            }
        }
        myData[label] = value;
        this.props.onChange(myData, this.props.kn);

    };

    render() {
        let [data, arrCoverImageField, textarea, myData] = [this.props.data, [], [], this.props.myData];
        let con;
        if (data) {
            if (data.type === "object") {
                let [properties, cs, v] = [data.properties, [], ''];
                for (let x in properties) {
                    v = properties[x];
                    if (v['ui:field'] === 'CoverImageField') {
                        arrCoverImageField.push(v);
                    } else if (v['ui:widget'] === 'textarea') {
                        textarea.push(v);
                    }
                    cs.push(<Struct7 data={v} myData={myData && myData.properties && myData.properties[x]} key={x}
                                     kn={x} previousData={properties} onChange={this.onObjectChange}
                                     index={this.props.index}/>)
                }
                con = <Card className="box-card" header={<div className="clearfix"><span
                    style={{"lineHeight": "36px"}}>{data.title ? data.title : ''}</span></div>}>
                    <div className="text item">
                        <Form labelWidth="100">
                            <Form.Item label="是否搜品牌">
                                <Switch value={myData && myData.brandTitle ? myData.brandTitle : false} onText=""
                                        offText="" onChange={(value) => {
                                    this.searchBrandChange({value: value, label: 'brandTitle'})
                                }}/>
                            </Form.Item>
                            {myData && myData.brandTitle && <Form>
                                <Form.Item label="品牌logo">
                                    <Select value={myData && myData.brandLogoName} onChange={(value) => {
                                        this.onChen({value: value, label: 'brandLogoName'})
                                    }}>
                                        <Select.Option label='请选择品牌logo' value=''/>
                                        {(arrCoverImageField ? arrCoverImageField : []).map((item, i) => {
                                            return <Select.Option key={i} value={item.title} label={item.title}/>
                                        })}
                                    </Select>
                                </Form.Item>

                                <Form.Item label="品牌介绍">
                                    <Select value={data.brandIntroductionName ? data.brandIntroductionName : ''}
                                            onChange={(value) => {
                                                this.onChen({value: value, label: 'brandIntroductionName'})
                                            }}>
                                        <Select.Option label='请选择品牌介绍' value=''/>
                                        {(textarea ? textarea : []).map((item, i) => {
                                            return <Select.Option key={i} value={item.title} label={item.title}/>
                                        })}
                                    </Select>
                                </Form.Item></Form>}
                            <p/>
                            <div className="clearfix"/>
                            {cs.map((item, i) => {
                                return item
                            })}
                        </Form>
                    </div>
                </Card>
            } else if (data.type === "array") {
                let [properties, array, previousData] = [data.properties, [], this.props.previousData];
                if (previousData) {
                    for (let p in previousData) {
                        if (previousData[p]['ui:bridge'] !== 'getConfig:commonItemProps') {
                            array.push(previousData[p]);
                        }
                    }
                }
                let [items, uiField] = [data.items, data['ui:field']];
                let img = <Form labelWidth="100">
                    {myNumberChange({
                        title: '图片宽度',
                        value: data.creatorAddImageW,
                        myValue: myData && myData.creatorAddImageW,
                        label: 'creatorAddImageW'
                    }, this.widthChange)}

                    {myNumberChange({
                        title: '图片高度',
                        value: data.creatorAddImageH,
                        myValue: myData && myData.creatorAddImageH,
                        label: 'creatorAddImageH'
                    }, this.heightChange)}
                </Form>;

                con = <Card className="box-card"
                            header={<div className="clearfix"><span
                                style={{"lineHeight": "36px"}}>{data.title ? data.title : ''}</span></div>}
                            style={{marginTop: '5px'}}>
                    <div className="text item">
                        <Form labelWidth="100">
                            {uiField === 'CoverImageField' && img}
                            {myNumberChange({
                                title: '最多几个',
                                value: data.maxItems,
                                myValue: myData && myData.maxItems,
                                label: 'maxItems'
                            }, this.onChen)}

                            {myNumberChange({
                                title: '最少几个',
                                value: data.minItems,
                                myValue: myData && myData.minItems,
                                label: 'minItems'
                            }, this.onChen)}


                            <Form.Item label="宝贝标题">
                                <Select value={myData && myData.titleName} onChange={(value) => {
                                    this.onChen({value: value, label: 'titleName'})
                                }}>
                                    <Select.Option label='请选择宝贝标题指向' value=''/>
                                    {(array ? array : []).map((item, i) => {
                                        return <Select.Option key={i} value={item.title} label={item.title}/>
                                    })}
                                </Select>
                            </Form.Item>
                        </Form>
                    </div>
                    <div className="clearfix"/>
                    {data.items.title !== 'bmqd-item' &&
                    <Struct7 data={items} myData={myData && myData} onChange={this.onItemsChange}
                             index={this.props.index}/>}
                </Card>
            } else if (data.type === "string") {
                con = <Card className="box-card"
                            header={<div className="clearfix"><span
                                style={{"lineHeight": "36px"}}>{data.title ? data.title : ''}</span></div>}
                            style={{marginTop: '5px'}}>
                    <Form labelWidth="100">
                        {myNumberChange({
                            title: "最多字数",
                            value: data.maxLength,
                            myValue: myData && myData.maxLength,
                            label: 'maxLength'
                        }, this.onChen)}

                        {myNumberChange({
                            title: "最少字数",
                            value: data.minLength,
                            myValue: myData && myData.minLength,
                            label: 'minLength'
                        }, this.onChen)}
                    </Form>
                    <div className="clearfix"/>
                </Card>
            }
        }
        return (
            <div className="text item">{con}</div>

        );
    }
}

class StructCanvas extends ReactChild {//结构体
    constructor(props) {
        super(props);
        this.state = {
            choiceItemPool: true,//强制选品池,默认强制
        }
    }

    onChen = (env) => {
        let value = env.value;
        let label = env.label;
        this.props.onChange(this.props.index, label, value);
    };
    onInfosChange = (newData, keyName) => {//预加载
//        this.props.data.myProps = this.props.data.myProps ? this.props.data.myProps : clone(this.props.data.props);
        let moduleInfos = this.props.data.myProps.moduleInfos ? this.props.data.myProps.moduleInfos : {};
        let value = this.props.data.props.value;
        if (newData) {

            for (let i = 0; i < value.length; i++) {
                if (value[i].materialId === keyName) {
                    value[i].moduleInfo.dataSchema = newData;
                }
            }
            moduleInfos[keyName]=moduleInfos[keyName]?moduleInfos[keyName]:{};
            moduleInfos[keyName].dataSchema = newData;
        } else {
            delete moduleInfos[keyName];
        }

        this.props.onChange(this.props.index, 'moduleInfos', moduleInfos);
        this.props.onChange(this.props.index, 'value', value);

    };

    onBlockListChange = (newData, i) => {//按钮
        let sidebarBlock = this.props.data.props.sidebarBlockList[i];
        let blockName = sidebarBlock.blockName;
        this.props.data.myProps = this.props.data.myProps?this.props.data.myProps:{};
        let sidebarBlockList = this.props.data.myProps.sidebarBlockList ? this.props.data.myProps.sidebarBlockList : {};
        let key = "if blockName=" + blockName + "";
        if (newData) {
            sidebarBlockList[key] = {moduleInfo: {dataSchema: newData}};
        } else {
            delete sidebarBlockList[key];
        }
        this.props.onChange(this.props.index, 'sidebarBlockList', sidebarBlockList);
    };


    render() {
        let [propsData, bl, data,] = [this.props.data, [], []];
        let [myProps, props] = [propsData.myProps, propsData.props];
        let {moduleInfos, sidebarBlockList} = props;
        myProps = myProps ? myProps : {}
        let [myModuleInfos, mySidebarBlockList] = [myProps.moduleInfos, myProps.sidebarBlockList];
        sidebarBlockList.map((sbl, s) => {
            //  if (sbl.display && sbl.moduleInfo) {
            bl.push(sbl);
            // }
        });
        for (let x in moduleInfos) {
            data.push(moduleInfos[x]);
        }
        return (
            <div>
                <Form labelWidth="100">
                    {myNumberChange({
                        title: "最少几个段落",
                        value: props.min,
                        myValue: myProps.min,
                        label: 'min'
                    }, this.onChen)}

                    {myNumberChange({
                        title: "最多几个段落",
                        value: props.max,
                        myValue: myProps.max,
                        label: 'max'
                    }, this.onChen)}

                    {myNumberChange({
                        title: "单店铺最多几个商品",
                        value: props.itemMaxNum,
                        myValue: myProps.itemMaxNum,
                        label: 'itemMaxNum'
                    }, this.onChen)}

                    {myNumberChange({
                        title: "至少几家店铺",
                        value: props.shopMinNum,
                        myValue: myProps.shopMinNum,
                        label: 'shopMinNum'
                    }, this.onChen)}

                    {myNumberChange({
                        title: "固定前几个",
                        value: props.topLockIndex,
                        myValue: myProps.topLockIndex,
                        label: 'topLockIndex'
                    }, this.onChen)}
                </Form>


                <Tabs activeName='1'>
                    <Tabs.Pane label='预加载' name='1'>
                        {(data && data.length > 0) && data.map((item, i) => {
                            let myData = undefined;
                            if (myModuleInfos) {
                                myData = myModuleInfos[item.materialId];
                            }
                            return (
                                <Struct7 data={item.dataSchema} key={item.materialId}
                                         myData={myData && myData.dataSchema} kn={item.materialId}
                                         onChange={this.onInfosChange}
                                         index={this.props.index}
                                         arrayCreatorAddImage={this.props.arrayCreatorAddImage}/>
                            )
                        })}
                    </Tabs.Pane>
                    <Tabs.Pane label='添加按钮' name='2'>
                        {bl.map((item, i) => {
                            let myData = undefined;
                            let key = "if blockName=" + item.blockName + "";
                            if (mySidebarBlockList) {
                                myData = mySidebarBlockList[key];
                            }
                            return (
                                <Card className="box-card" key={item.blockName}
                                      header={<div className="clearfix"><span
                                          style={{"lineHeight": "36px"}}>{item.title}</span></div>}>
                                    <div className="text item">
                                        {item.moduleInfo && <Struct7 data={item.moduleInfo.dataSchema}
                                                                     myData={myData && myData.moduleInfo.dataSchema}
                                                                     key={item.moduleInfo.materialId} kn={i}
                                                                     arrayCreatorAddImage={this.props.arrayCreatorAddImage}
                                                                     onChange={this.onBlockListChange}
                                                                     index={this.props.index}/>}

                                    </div>
                                </Card>
                            )
                        })}
                    </Tabs.Pane>
                </Tabs>
            </div>
        )
    }
}

class CascaderSelect extends ReactChild {//本文目标人群
    constructor(props) {
        super(props);
        this.state = {
            children: [],
        }
    }

    onChen = (env) => {
        let value = env.value;
        let label = env.label;
        this.props.onChange(this.props.index, label, value);
    };


    dataSourceChange = (env) => {//第一个默认目标人群
        let value = env.value;
        if (value) {
            let item = JSON.parse(value);
            let children = item.children;
            this.setState({children: children}, () => {
                this.props.onChange(this.props.index, 'dataSourceValue', item.value);
                this.props.onChange(this.props.index, 'children', children);
            });
        } else {
            this.props.onChange(this.props.index, 'children', '');
        }
    }

    render() {
        let {data} = this.props;
        data.myProps = data.myProps ? data.myProps : {};
        let children = [];
        if (this.state.children.length > 0) {
            children = this.state.children;
        } else if (this.props.data.props.children) {
            let c = this.props.data.props.children;
            for (let i in c) {
                children.push(c[i]);
            }
        }
        return (
            <Form inline={true}>
                <Form.Item label="默认目标人群">
                    <Select onChange={(value) => {
                        this.dataSourceChange({value: value})
                    }}>
                        <Select.Option value={''} label='请选择默认目标人群'/>
                        {(data.props.dataSource ? data.props.dataSource : []).map((item, i) => {
                            return (
                                <Select.Option key={i} value={JSON.stringify(item)} label={item.label}/>
                            )
                        })}
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Select value={data.myProps.childrenvalue} onChange={(value) => {
                        this.onChen({value: value, label: 'childrenvalue'})
                    }}>
                        <Select.Option value='' label='请选择默认目标人群'/>
                        {children.map((item, i) => {
                            return (
                                <Select.Option key={i} value={item.value} label={item.label}/>
                            )
                        })}
                    </Select>
                </Form.Item>
            </Form>

        )
    }
}

class Forward extends ReactChild {
    constructor(props) {
        super(props);
        this.state = {}
    }

    onChen = (env) => {
        let value = env.value;
        let label = env.label;
        this.props.onChange(this.props.index, label, value);
    };

    render() {
        let {data} = this.props;
        data.props = data.props ? data.props : {};
        data.myProps = data.myProps ? data.myProps : {};
        return (
            <Form labelWidth="100">
                {myNumberChange({
                    title: "最少字数",
                    value: data.props.minLength,
                    myValue: data.myProps.minLength,
                    label: 'minLength'
                }, this.onChen)}

                {myNumberChange({
                    title: "最多字数",
                    value: data.props.maxLength,
                    myValue: data.myProps.maxLength,
                    label: 'maxLength'
                }, this.onChen)}
            </Form>
        )
    }
}

export {
    TextInput,
    CreatorAddItem,
    CreatorAddImage,
    AddLink,
    TagPicker,
    Activity,
    AddTag,
    RadioGroup,
    AnchorImageList,
    Editor,
    StructCanvas,
    CascaderSelect,
    Forward
};

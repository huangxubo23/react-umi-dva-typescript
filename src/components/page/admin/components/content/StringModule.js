/**
 * Created by shiying on 17-7-27.input框
 */
import React from 'react';
import {BundleLoading} from '../../../../../bundle';
import SoBrand from 'bundle-loader?lazy&name=pc/trends_asset/admin/content/soBrand/app-[name]!./SoBrand';
import HintShow from './Hint';
import {Layout, Input, Button} from 'element-react';
import 'element-theme-default';

class StringModule extends React.Component {

    summaryChange = (value) => {
        let {constraint, onChange} = this.props;
        let titleHint = StringModule.hint(value, constraint.props);
        onChange(constraint, value, titleHint);
    };

    static hint = (data, props) => {
        data = data ? data : "";
        let titleHint = undefined;
        let meet = true;
        let minTitle = props.minLength;
        let maxTitle = props.maxLength;
        if (minTitle && minTitle > data.length) {
            meet = false;
            titleHint = "不能少于" + minTitle + "个字";
        } else if (maxTitle && maxTitle < data.length) {
            meet = false;
            titleHint = "不能大于" + maxTitle + "个字";
        }
        return [{meet: meet, value: data.length, title: "字数", text: titleHint}];
    };

    render() {
        let {constraint, value, dataAdditionalChange, hint} = this.props;
        let {minLength, maxLength, brandIntroductionName, brandLogoName} = constraint.props;
        let num = `${value ? value.length : 0}/${minLength ? minLength : 0}/${maxLength ? maxLength : 0}`;
        return (
            <Layout.Row gutter="20" style={{margin: "8px 0"}}>
                <Layout.Col span="2" style={{fontWeight: 'bold'}}>
                    {this.props.modelSet && <Button type="primary" size='mini' onClick={this.props.modelOnChenge}>设置</Button>}
                    {constraint.title ? constraint.title : <br/>}
                </Layout.Col>
                <Layout.Col span="22">
                    {constraint.props.rows ? <div>
                        <Input type="textarea" placeholder={constraint.props.placeholder} value={value}
                               onChange={this.summaryChange} rows={constraint.props.rows}/>
                        <span style={{float: 'right', marginRight: '6px', color: '#e04444'}}> {num} </span>
                    </div> : <Input placeholder={constraint.props.placeholder} prepend={num} value={value}
                                    onChange={this.summaryChange} append={constraint.props.addonAfter ?
                        constraint.props.addonAfter :
                        constraint.props.brandTitle ?
                            <Button type="primary" icon="search"
                                    onClick={() => {
                                        let upload = setInterval(() => {
                                            let soBrandModel = this.soBrandModel;
                                            if (soBrandModel && soBrandModel.jd) {
                                                clearInterval(upload);
                                                this.soBrandModel.jd.open(value);
                                            }
                                        }, 100);
                                    }
                                    }>搜品牌</Button> : undefined}/>}
                    {constraint.props.brandTitle &&
                    <BundleLoading ref={e => this.soBrandModel = e} load={SoBrand} callback={(brandLog, brandIntroduction) => {
                        dataAdditionalChange(brandLogoName, brandLog);
                        dataAdditionalChange(brandIntroductionName, brandIntroduction);
                    }}/>}
                    <HintShow hint={hint}/>
                </Layout.Col>
            </Layout.Row>
        )
    }
}

export default StringModule;
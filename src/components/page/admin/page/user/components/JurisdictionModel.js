/**
 * Created by 林辉 on 2019/2/23 15:07.权限勾选
 */
import React from 'react';
import {Checkbox,} from 'element-react';
import 'element-theme-default';

class JurisdictionModel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        let {Jurisdiction, talent, onChange, indexProps = 'index',disabled} = this.props;
        if (Jurisdiction == "$allTalent") {Jurisdiction = this.props.allTalent?this.props.allTalent:[];}
        return (
            <div style={{margin: "5px 0"}}>
                {Jurisdiction.map((item, index) => {
                    if (item == "$allTalent") item = this.props.allTalent?this.props.allTalent:[];

                    if (typeof item === 'string') {
                        return (
                            <Checkbox key={`${indexProps}-${index}`} label={item} checked={item in talent.permissions}  disabled={disabled}
                                      onChange={(value) => onChange({value: item, checked: value, name: 'permissions'})}
                                      style={index === 0 ? {marginLeft: '15px'} : {}}/>
                        )

                    } else {
                        let title = item.title;
                        if (title.indexOf("$") != 0 || title in talent.permissions) {

                            return (
                                <div key={`${indexProps}-${index}`}>
                                    <div style={{fontWeight: 'bold', fontSize: '16px'}}>{item.title}</div>
                                    <div style={{marginLeft: '50px'}}>
                                        <JurisdictionModel Jurisdiction={item.value} talent={talent} onChange={onChange} allTalent={this.props.allTalent}  disabled={disabled}
                                                           indexProps={`${indexProps}-${index}`}/>
                                    </div>
                                </div>
                            )
                        }
                    }
                })}
                <hr/>
            </div>
        )
    }
}
export {JurisdictionModel};
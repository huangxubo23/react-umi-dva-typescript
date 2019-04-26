
import React from 'react';
import {Alert,Tag} from 'element-react';
import 'element-theme-default';

let HintShow=(props)=>{
    let {hint=[]}=props;
    return(
        <div>
            {hint.map((item, i) => {
                if (!item.meet) {
                    return <Alert key={i} title={<div>
                        <b>{item.title}!</b>{' '}<Tag>{item.value}</Tag>{' '}<i className="el-icon-close"> </i>{item.text}
                        </div>} type="error" style={{marginTop:'3px'}} closable={false}/>;
                } else if (props.meetIsShow) {
                    return <Alert key={i} title={<div>
                        <b>{item.title}!</b>{' '}<Tag>{item.value}</Tag>{' '}<i className="el-icon-check"> </i>{item.text}
                        </div>} type="success" style={{marginTop:'3px'}} closable={false}/>;
                }
            })}
        </div>
    )
};


export default HintShow;
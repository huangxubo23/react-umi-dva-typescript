/**
 * Created by shiying on 17-11-22.
 */


import React from 'react';
import noty from 'noty';

//第一个参数为内容，第二个参数为类型,第三个参数为提示位置，第四个参数为持续展示时间
const currencyNoty=(text,type,layout,timeout)=>{
    new noty({
        text: text?text:"暂无内容",
        type: type?type:"success",
        layout: layout?layout:'topCenter',
        modal: false,
        timeout: timeout?timeout:3000,
        theme: 'bootstrap-v4',
        animation: {
            open: 'noty_effects_open',
            close: 'noty_effects_close'
        }
    }).show();
};
//特殊情况请在下面添加自定义函数


export {currencyNoty};
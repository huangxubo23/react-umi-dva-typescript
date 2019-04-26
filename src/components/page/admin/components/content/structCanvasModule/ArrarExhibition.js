/**
 * Created by shiying on 17-9-25.
 */
import React from 'react';

const ArrarExhibition = (props) => {
    let ImgComment=props.ImgComment?props.ImgComment:'';
    let {index,ContentComments} = props;
    return (
        <div>
            {(props.value?props.value:(props.spare?props.spare:[])).map((item, i)=> {
                let {structInventoryItems} = item;
                return <div key={"a"+i}>
                    {ContentComments?<ImgComment commentChange={value => {
                        props.commentChange(value,i);
                    }} commentValue={structInventoryItems}>
                        <a href={"https://detail.tmall.com/item.htm?id=" + item.item_numiid} target="_blank"><img
                            src={item.item_pic}/></a>
                    </ImgComment>:<a href={"https://detail.tmall.com/item.htm?id=" + item.item_numiid} target="_blank"><img
                        src={item.item_pic}/></a>}

                </div>
            })}
        </div>
    )
};

export default ArrarExhibition;
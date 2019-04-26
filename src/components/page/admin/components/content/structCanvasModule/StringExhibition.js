/**
 * Created by shiying on 17-9-25.
 */
import React from 'react';

const StringExhibition =(props)=>{
    let ContentCommentsEditBox = props.ContentCommentsEditBox?props.ContentCommentsEditBox:'';
    let {ContentComments,newData,data}= props;
    if (props.type=="topNum"){
        return(
            <div>
                <div style={{textAlign: "center", textSize: "18px"}}>
                    top{props.value}</div>
                <div style={{textAlign: "center"}}>————</div>
            </div>
        )
    }else if(props.type=="title"){
        return(
            <div>
                {ContentComments?<ContentCommentsEditBox
                        data={newData?{oldData:data,newData:newData}:{oldData:data}}
                        onChange={(value) => props.commentChange(value)}/>:
                    <div style={{textAlign: "center", textStyle: "18px"}}>{props.value?props.value:props.spare}</div>}

            </div>
        )
    }else {
        return(
            <div>
                <div>{props.value?props.value:props.spare}</div>
            </div>
        )
    }
};

export default StringExhibition;
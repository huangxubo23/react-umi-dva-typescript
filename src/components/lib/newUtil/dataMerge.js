/**
 * Created by 石英 on 2018/12/25 0025上午 8:43.
 */


class DataMerge {
    mergeProps=({contentMode},callback)=>{
        if(contentMode.v===2){
            let {nameList,constraint}=contentMode;
            newDataMerge.fetchMerge({list:nameList,constraint},(constraint)=>{
                contentMode.constraint=constraint;
                callback(contentMode)
            })
        }
    };

    fetchMerge=({list,constraint,index=0},callback)=>{
        if(index<list.length){
            newDataMerge.analysis({value:constraint[list[index].name],callback:(newValue)=>{
                    constraint[list[index].name]=newValue;
                    newDataMerge.fetchMerge({list,constraint,index:index+1},callback)
                }})

            /*if(list[index].show){//部分不整合
                newDataMerge.analysis({value:constraint[list[index].name],callback:(newValue)=>{
                        constraint[list[index].name]=newValue;
                        newDataMerge.fetchMerge({list,constraint,index:index+1},callback)
                    }})
            }else {
                delete constraint[list[index].name];
                newDataMerge.fetchMerge({list,constraint,index:index+1},callback)
            }*/
        }else {
            callback(constraint);
        }
    };

    analysis=({value,callback})=>{
        let {myProps,props}=value;
        if(myProps){
            value.props=newDataMerge.matching({myProps,props});
            callback(value);
        }else {
            callback(value);
        }
    };

    matching=({myProps,props})=>{
        for(let m in myProps){
            if(typeof myProps[m]==='object'){
                if(props[m]===undefined){
                    props[m]={};
                }
                props[m]=newDataMerge.matching({myProps:myProps[m],props:props[m]})
            }else {
                props[m]=myProps[m];
            }
        }
        return props;
    };
}

let newDataMerge = new DataMerge();

export {
    newDataMerge
}
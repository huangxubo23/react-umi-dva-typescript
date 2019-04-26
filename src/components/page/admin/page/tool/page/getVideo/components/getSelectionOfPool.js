
import {ThousandsOfCall} from '../../../../../../../lib/util/ThousandsOfCall';
import {Message} from 'element-react';
import 'element-theme-default';


let getSelectionOfPool=new class SelectionOfPool{
    UrlAnalysis=(url,item = {})=>{//解析拿取数据参数
        let arr =url.split("&");
        for (let i in arr) {
            item[((arr[i].split("="))[0])] = (arr[i].split("="))[1];
        }
        return item;
    };
    url_Analysis=(url,callback)=>{//链接解析为淘宝提交数据
        let data = {};
        let Arr=url.split("?");
        let agreement=Arr[0].split('//')[0]||'https';
        let host=Arr[0].split('//')[1];
        let hostname=host.split('/')[0];
        let path=host.slice(host.indexOf('/'));
        let arr = Arr[1].split("&");
        for (let i in arr) {
            data[((arr[i].split("="))[0])] = (arr[i].split("="))[1];
        }
        if(callback){
            callback({agreement:agreement,hostname:hostname,path:path,data:data});
        }else {
            return {agreement:agreement,hostname:hostname,path:path,data:data};
        }
    };
    SelectionOfPool_html=(data,callback)=>{//选品池框架
        ThousandsOfCall.acoustic({
            agreement: "https",
            hostname: 'kxuan.taobao.com',
            path: "/search.htm",
            data: data,
            method: "get",
            referer: "https://we.taobao.com/"
        }, 'requestRelyTB', (msg)=>{
            if(msg.success){
                let str=msg.data.split('params = "')[1];
                let json=getSelectionOfPool.UrlAnalysis(str.split('"')[0]);
                json.callback='jsonp20';
                callback(json);
            }else {
                Message({
                    message: '获取失败',
                    type: 'warning'
                });
            }
        });
    };
    SelectionOfPool_content=(data,callback)=>{//选品池商品列表
        ThousandsOfCall.acoustic({
            agreement: "https",
            hostname: 'kxuan.taobao.com',
            path: "/searchSp.htm",
            data: data,
            method: "get",
            referer: "https://we.taobao.com/"
        }, 'requestRelyTB', (msg)=>{
            if(msg.success){
                if(msg.data.indexOf('jsonp20')>-1){
                    let msgs=msg.data.slice(8,-1);
                    let json=JSON.parse(msgs);
                    callback(json);
                }
            }else {
                Message({
                    message: '获取失败',
                    type: 'warning'
                });
            }
        });
    };
    item_htm=(itemList,callback,callback_speed,i=0)=>{//商品详情
        if(itemList.length>i){
            let obj=getSelectionOfPool.url_Analysis(itemList[i].detail_url);
            Object.assign(obj,{method: "get", referer: "https://taobao.com/"});
            ThousandsOfCall.acoustic(obj, 'requestRelyTB', (msg)=>{
                if(msg.success){
                    if(msg.data.indexOf("'video'")>-1||msg.data.indexOf('"imgVedioPic"')>-1){
                        itemList[i].video=1;
                        callback_speed(i);
                        getSelectionOfPool.delay(()=>getSelectionOfPool.item_htm(itemList,callback,callback_speed,i+1),500);
                    }else {
                        itemList[i].video=2;
                        callback_speed(i);
                        getSelectionOfPool.delay(()=>getSelectionOfPool.item_htm(itemList,callback,callback_speed,i+1),500);
                    }
                }else {
                    Message({
                        message: '获取失败',
                        type: 'warning'
                    });
                }
            });
        }else {
            Message({
                message: '获取结束',
                type: 'success'
            });
            callback(itemList);
        }
    };
    delay=(callback,time)=>{//延迟
        let set=setInterval(()=>{
            clearInterval(set);
            callback();
        },time);
    };
};


export default getSelectionOfPool;
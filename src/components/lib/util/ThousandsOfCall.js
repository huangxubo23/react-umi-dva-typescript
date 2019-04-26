/**
 * Created by muqingzhong on 2017/8/12.千里传音
 */
//千里传音
import React from 'react';
import { generateUUID } from './global'
import $ from "jquery";
import { Notification } from 'element-react'

class ThousandsOfCall {

  static rank = [];
  static waitFor = {};
  static isLog = false;
  static acousticExecute = () => {

    if (ThousandsOfCall.rank.length) {
      let s = ThousandsOfCall.rank.shift();
      if (s) {
        let uid = generateUUID();
        ThousandsOfCall.waitFor[uid] = s;
        let value = { data: s.data, type: s.type, source: window.ipcRenderer ? "" : "web", uid: uid };
        ThousandsOfCall.ws.send(JSON.stringify(value));

      }
    }
  };


  static thousandsOfCallResponse = (message) => {

    let uid = message.uid;
    if (ThousandsOfCall.isLog) {
      console.log("千里传音收到");
      console.log(message);
      console.log(uid);
      console.log(ThousandsOfCall.waitFor[uid]);
    }

    if (ThousandsOfCall.waitFor[uid]) {
      ThousandsOfCall.waitFor[uid].callback(message.data);
      delete ThousandsOfCall.waitFor[uid];
      ThousandsOfCall.acousticExecute();
    }
  };

  static thousandsOfCallEvent = (message) => {
    let uid = message.uid;
    if (ThousandsOfCall.isLog) {
      console.log("千里传音收到事件消息");
      console.log(uid);
      console.log(message.cs);
      console.log(message.event);
      console.log(ThousandsOfCall.waitFor[uid]);
    }

    if (ThousandsOfCall.waitFor[uid] && ThousandsOfCall.waitFor[uid].event) {
      ThousandsOfCall.waitFor[uid].event(message.cs);
    } else {
      console.log(message.cs);
    }

  }


  static ws;
  static acoustic = (val, type, callback, event) => {

    function pushRank() {
      ThousandsOfCall.rank.push({ data: val, type: type, callback: callback, event: event });
      ThousandsOfCall.acousticExecute();
    }

    if (ThousandsOfCall.ws && ThousandsOfCall.ws.readyState === 1) {
      pushRank();
    } else {
      ThousandsOfCall.ws = new WebSocket('ws://127.0.0.1:8802');
      ThousandsOfCall.ws.onopen = function (e) {
        pushRank();
      }

      ThousandsOfCall.ws.onerror = function (e) {

        //旧版的插件会走这个口
        $.ajax({
          type: "post",//使用get方法访问后台
          dataType: "json",//返回json格式的数据
          url: "http://127.0.0.1:8801",//要访问的后台地址
          data: { data: JSON.stringify(val), type: type, source: "web" },//要发送的数据
          success: (msg) => {
            callback(msg.data);
          }, error: () => {
            Notification.error({
              title: '未检测到客户端',
              message: '请下载安装并启动客户端'
            });
          }
        });
      }

      ThousandsOfCall.ws.onmessage = (e) => {
        let mes = JSON.parse(e.data);
        if (mes.type == "thousandsOfCallReply") {
          ThousandsOfCall.thousandsOfCallResponse(mes);
        } else if (mes.type == "thousandsOfCallEvent") {
          ThousandsOfCall.thousandsOfCallEvent(mes);
        }
      }
    }
  }
}


export { ThousandsOfCall };


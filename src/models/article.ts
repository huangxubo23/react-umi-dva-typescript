
export default {
  namespace: 'article',

  state: {
    "components": [
      "CreatorAddTopic",
      "RadioGroup",
      "Activity",
      "Text",
      "Editor",
      "CreatorPush",
      "DateTime",
      "Input",
      "Toast",
      "InteractContainer",
      "Checkbox",
      "Forward",
      "CreatorAddImage",
      "CascaderSelect",
      "AddLink",
      "CreatorAddTag"
    ],
    "config": {
      "actions": [
        {
          "size": "large",
          "span": "2",
          "style": {
            "display": "none"
          },
          "name": "draft",
          "text": "保存草稿",
          "url": "//cpub.taobao.com/submit.json?draft=1&_draft_id=0&_tb_token_=e35e8341dfe56"
        },
        {
          "size": "large",
          "span": 2,
          "offset": 5,
          "type": "primary",
          "needValidate": true,
          "disabled": false,
          "style": {
            "display": "none"
          },
          "name": "submit",
          "text": "发布(今日还可发布：3篇)",
          "url": "//cpub.taobao.com/submit.json?_tb_token_=e35e8341dfe56"
        },
        {
          "size": "large",
          "span": "2",
          "style": {
            "display": "none"
          },
          "name": "preview",
          "text": "预览",
          "url": "//cpub.taobao.com/submit.json?preview=1&draft=1&_draft_id=0&_tb_token_=e35e8341dfe56"
        }
      ],
      "children": [
        {
          "component": "Forward",
          "label": "",
          "name": "forward",
          "props": {
            "enableExpression": false,
            "enableTopic": false,
            "style": {
              "paddingBottom": "5",
              "background": "#C4DEFF",
              "width": "100%"
            },
            "label": "",
            "placeholder": "请输入想要对粉丝说的话，优质生动的内容有利于提升曝光和粉丝关注。该内容将被展示在微淘关注卡片。",
            "title": "这篇文章想对粉丝说什么",
            "value": ""
          },
          "rules": [
            {
              "type": "string",
              "message": "必填，内容不能为空",
              "required": true
            },
            {
              "min": 1,
              "type": "string",
              "message": "文字长度太短, 要求长度最少为1"
            },
            {
              "max": 100,
              "type": "string",
              "message": "文字长度太长, 要求长度最多为100"
            }
          ]
        },
        {
          "className": "creator-input-no-border creator-input-title",
          "component": "Input",
          "label": "标题",
          "name": "title",
          "props": {
            "className": "creator-input-no-border creator-input-title",
            "label": "标题",
            "placeholder": "请在这里输入4-19字标题",
            "tips": "<a target='_blank' href='https://docs.alipay.com/alibaba_we_guide/guide/derz4g'>优质标题写作指引</a>按照创作指引添加标题，将大大提高内容被更大渠道采纳的概率哦～",
            "cutString": false,
            "maxLength": 19,
            "hasLimitHint": true,
            "value": ""
          },
          "rules": [
            {
              "type": "string",
              "message": "标题不能为空",
              "required": true
            },
            {
              "min": 4,
              "type": "string",
              "message": "文字长度太短, 要求长度最少为4"
            },
            {
              "max": 19,
              "type": "string",
              "message": "文字长度太长, 要求长度最多为19"
            }
          ],
          "tips": "<a target='_blank' href='https://docs.alipay.com/alibaba_we_guide/guide/derz4g'>优质标题写作指引</a>按照创作指引添加标题，将大大提高内容被更大渠道采纳的概率哦～"
        },
        {
          "className": "creator-editor",
          "component": "Editor",
          "label": "",
          "name": "body",
          "props": {
            "plugins": [
              "UNDO",
              "REDO",
              "TOOLSPLITLINE",
              "BOLD",
              "ITALIC",
              "UNDERLINE",
              "TOOLSPLITLINE",
              "ALIGNLEFT",
              "ALIGNCENTER",
              "ALIGNRIGHT",
              "ALIGNJUSTIFY",
              "TOOLSPLITLINE",
              {
                "name": "SIDEBARADDVIDEO",
                "props": {
                  "addImageProps": {},
                  "api": "//resource.taobao.com/video/getMaterial?pageSize=20&vf=p&producerSource=1",
                  "videoCenterUrl": "/material/mine/video"
                }
              },
              "EXTRATOOLSPLITLINE",
              {
                "name": "SIDEBARIMAGE",
                "props": {
                  "type": "addImage"
                }
              },
              "EXTRATOOLSPLITLINE",
              {
                "name": "SIDEBARHOTSPACEIMAGE",
                "props": {
                  "maxHotSpaces": 20,
                  "activityId": 0,
                  "titleMaxLength": 10,
                  "addImageProps": {},
                  "addItemProps": {},
                  "minSpaces": 1
                }
              },
              "EXTRATOOLSPLITLINE",
              {
                "name": "SIDEBARSEARCHITEM",
                "props": {
                  "activityId": 0,
                  "editDescMaxLength": 0,
                  "addImageProps": {},
                  "editTitleMaxLength": 30,
                  "type": "creatorAddItem"
                }
              },
              "EXTRATOOLSPLITLINE",
              {
                "name": "SIDEBARADDSPU",
                "props": {
                  "api": "//global.taobao.com/bpu/buyer_bpulist/index.html",
                  "title": "标准商品品牌信息 查找",
                  "type": "product"
                }
              }
            ],
            "className": "creator-editor",
            "label": "",
            "placeholder": "请在这里开始写正文",
            "value": {
              "blocks": [
                {
                  "depth": 0,
                  "entityRanges": [],
                  "inlineStyleRanges": [],
                  "text": "",
                  "type": "unstyled"
                }
              ],
              "entityMap": {}
            }
          },
          "rules": []
        },
        {
          "component": "Input",
          "label": "内容摘要",
          "name": "summary",
          "props": {
            "multiple": true,
            "label": "内容摘要",
            "placeholder": "请在这里输入10-100个字的引文",
            "rows": 3,
            "cutString": false,
            "maxLength": 100,
            "hasLimitHint": true,
            "value": ""
          },
          "rules": [
            {
              "min": 10,
              "type": "string",
              "message": "文字长度太短, 要求长度最少为10"
            },
            {
              "max": 100,
              "type": "string",
              "message": "文字长度太长, 要求长度最多为100"
            }
          ]
        },
        {
          "component": "AddLink",
          "label": "文末链接",
          "labelExtra": "自定义文末链接将出现在文章底部",
          "name": "link",
          "props": {
            "single": true,
            "label": "文末链接",
            "hasText": true,
            "tips": "仅支持淘宝、天猫等阿里巴巴旗下网站链接（支付宝除外)",
            "labelExtra": "自定义文末链接将出现在文章底部",
            "value": []
          },
          "rules": [
            {
              "max": 1,
              "type": "array",
              "message": "最多允许1个"
            }
          ],
          "tips": "仅支持淘宝、天猫等阿里巴巴旗下网站链接（支付宝除外)"
        },
        {
          "component": "RadioGroup",
          "label": "添加封面",
          "name": "coverCount",
          "props": {
            "label": "添加封面",
            "dataSource": [
              {
                "disabled": false,
                "label": "单图",
                "value": "1",
                "labelExtra": "上传750*422px图片，该封面将会在前台展示卡片上应用"
              },
              {
                "disabled": false,
                "label": "三图",
                "value": "3",
                "labelExtra": "上传三张750*422px图片，增加更多场景的流通可能性。若选择三图模式，三张图需填满，建议第三张封面图为浅色底"
              }
            ],
            "value": "1"
          },
          "rules": [
            {
              "type": "string",
              "message": "必选",
              "required": true
            }
          ],
          "updateOnChange": "true"
        },
        {
          "component": "CreatorAddImage",
          "label": "",
          "name": "standardCoverUrl",
          "props": {
            "max": 1,
            "pixFilter": "750x422",
            "min": 1,
            "label": "",
            "uploadTips": "上传封面",
            "tips": "请上传尺寸不小于750*422px的封面图<br /><a target='_blank' href='https://docs.alipay.com/alibaba_we_guide/guide/rlc1pl'>优质封面图创作指引</a>按照创作指引添加封面图，将大大提高内容被更大渠道采纳的概率哦～",
            "ShowPlaceholderTrigger": true,
            "value": []
          },
          "rules": [
            {
              "min": 1,
              "type": "array",
              "message": "至少要有1个"
            },
            {
              "max": 1,
              "type": "array",
              "message": "最多允许1个"
            }
          ],
          "tips": "请上传尺寸不小于750*422px的封面图<br /><a target='_blank' href='https://docs.alipay.com/alibaba_we_guide/guide/rlc1pl'>优质封面图创作指引</a>按照创作指引添加封面图，将大大提高内容被更大渠道采纳的概率哦～"
        },
        {
          "component": "CreatorAddImage",
          "label": "补充封面图",
          "name": "1x1cover",
          "props": {
            "max": 1,
            "activityId": 0,
            "pixFilter": "513x513",
            "min": 1,
            "aspectRatio": "1:1",
            "label": "补充封面图",
            "uploadTips": "1:1补充封面图",
            "tips": "图片比例1:1,尺寸513*513;上传优质封面将有机会被推荐",
            "value": []
          },
          "rules": [
            {
              "type": "array",
              "message": "至少要有1个",
              "required": true
            },
            {
              "min": 1,
              "type": "array",
              "message": "至少要有1个"
            },
            {
              "max": 1,
              "type": "array",
              "message": "最多允许1个"
            }
          ],
          "tips": "图片比例1:1,尺寸513*513;上传优质封面将有机会被推荐"
        },
        {
          "component": "InteractContainer",
          "label": "",
          "name": "activity",
          "props": {
            "label": "",
            "value": [
              {
                "checked": false,
                "key": "3",
                "title": ""
              },
              {
                "checked": false,
                "key": "5",
                "title": ""
              }
            ]
          },
          "rules": []
        },
        {
          "component": "CascaderSelect",
          "label": "本文目标人群",
          "name": "crowdId",
          "props": {
            "canOnlyCheckLeaf": true,
            "hasClear": true,
            "disabled": false,
            "label": "本文目标人群",
            "dataSource": [
              {
                "children": [
                  {
                    "label": "轻熟肌星人",
                    "value": "2619"
                  },
                  {
                    "label": "学生党",
                    "value": "2618"
                  },
                  {
                    "label": "爱美男子",
                    "value": "2617"
                  },
                  {
                    "label": "染发爱好者",
                    "value": "2616"
                  },
                  {
                    "label": "发型师",
                    "value": "2615"
                  },
                  {
                    "label": "中性肌肤星人",
                    "value": "2614"
                  },
                  {
                    "label": "护肤达人",
                    "value": "2613"
                  },
                  {
                    "label": "经济适用女",
                    "value": "2109"
                  },
                  {
                    "label": "品质女郎",
                    "value": "2108"
                  },
                  {
                    "label": "时尚潮女",
                    "value": "2107"
                  },
                  {
                    "label": "经济得体男",
                    "value": "2106"
                  },
                  {
                    "label": "品质型男",
                    "value": "2105"
                  },
                  {
                    "label": "时尚潮男",
                    "value": "2104"
                  },
                  {
                    "label": "品位绅士",
                    "value": "2103"
                  },
                  {
                    "label": "小资主义派",
                    "value": "2089"
                  },
                  {
                    "label": "重奢一族",
                    "value": "2088"
                  },
                  {
                    "label": "彩妆达人",
                    "value": "2087"
                  },
                  {
                    "label": "眼妆控",
                    "value": "2086"
                  },
                  {
                    "label": "祛斑小能手",
                    "value": "2085"
                  },
                  {
                    "label": "抗皱星人",
                    "value": "2084"
                  },
                  {
                    "label": "美甲控",
                    "value": "2083"
                  },
                  {
                    "label": "黑鼻星人",
                    "value": "2082"
                  },
                  {
                    "label": "干燥肌",
                    "value": "2080"
                  },
                  {
                    "label": "混合肌星人",
                    "value": "2075"
                  },
                  {
                    "label": "美体师",
                    "value": "1968"
                  },
                  {
                    "label": "黑皮星人",
                    "value": "1307"
                  },
                  {
                    "label": "熊猫眼星人",
                    "value": "1304"
                  },
                  {
                    "label": "美容师",
                    "value": "1299"
                  },
                  {
                    "label": "口红控",
                    "value": "1295"
                  },
                  {
                    "label": "抗痘战士",
                    "value": "1284"
                  },
                  {
                    "label": "干皮星人",
                    "value": "1266"
                  },
                  {
                    "label": "素颜女神",
                    "value": "1265"
                  },
                  {
                    "label": "油皮星人",
                    "value": "1264"
                  },
                  {
                    "label": "美发达人",
                    "value": "1263"
                  },
                  {
                    "label": "欧美妆容控",
                    "value": "1242"
                  },
                  {
                    "label": "轻奢族",
                    "value": "1230"
                  },
                  {
                    "label": "医美一族",
                    "value": "1209"
                  },
                  {
                    "label": "国货党",
                    "value": "1201"
                  },
                  {
                    "label": "日系美妆控",
                    "value": "1160"
                  },
                  {
                    "label": "敏感肌宝宝",
                    "value": "899"
                  },
                  {
                    "label": "香氛控",
                    "value": "27"
                  },
                  {
                    "label": "美妆达人",
                    "value": "377"
                  }
                ],
                "label": "时尚生活",
                "value": "时尚生活"
              },
              {
                "children": [
                  {
                    "label": "电竞玩家",
                    "value": "2141"
                  },
                  {
                    "label": "手机壳控",
                    "value": "2135"
                  },
                  {
                    "label": "智能设备控",
                    "value": "2096"
                  },
                  {
                    "label": "手机发烧友",
                    "value": "2095"
                  },
                  {
                    "label": "电脑控",
                    "value": "1308"
                  },
                  {
                    "label": "趣玩先锋",
                    "value": "1013"
                  },
                  {
                    "label": "手机重患者",
                    "value": "898"
                  },
                  {
                    "label": "炫酷极客控",
                    "value": "6"
                  },
                  {
                    "label": "游戏外设迷",
                    "value": "22"
                  },
                  {
                    "label": "摄影发烧友",
                    "value": "33"
                  },
                  {
                    "label": "耳机发烧友",
                    "value": "76"
                  }
                ],
                "label": "科技兴趣",
                "value": "科技兴趣"
              },
              {
                "children": [
                  {
                    "label": "健康食族",
                    "value": "2134"
                  },
                  {
                    "label": "能量超人",
                    "value": "2133"
                  },
                  {
                    "label": "地道食客",
                    "value": "2132"
                  },
                  {
                    "label": "美食尝鲜族",
                    "value": "2131"
                  },
                  {
                    "label": "懒人主厨",
                    "value": "2129"
                  },
                  {
                    "label": "米其林控",
                    "value": "2128"
                  },
                  {
                    "label": "下午茶控",
                    "value": "2127"
                  },
                  {
                    "label": "烧烤达人",
                    "value": "2126"
                  },
                  {
                    "label": "夜宵党",
                    "value": "2125"
                  },
                  {
                    "label": "糖果控",
                    "value": "2124"
                  },
                  {
                    "label": "零食控",
                    "value": "2123"
                  },
                  {
                    "label": "调味控",
                    "value": "2122"
                  },
                  {
                    "label": "五谷达人",
                    "value": "2121"
                  },
                  {
                    "label": "水产控",
                    "value": "2120"
                  },
                  {
                    "label": "素食主义者",
                    "value": "2119"
                  },
                  {
                    "label": "糕点控",
                    "value": "2118"
                  },
                  {
                    "label": "甜品控",
                    "value": "2117"
                  },
                  {
                    "label": "芒果星人",
                    "value": "2116"
                  },
                  {
                    "label": "榴莲星人",
                    "value": "2115"
                  },
                  {
                    "label": "卤味达人",
                    "value": "2114"
                  },
                  {
                    "label": "奶味控",
                    "value": "2113"
                  },
                  {
                    "label": "芝麻控",
                    "value": "2112"
                  },
                  {
                    "label": "果干爱好者",
                    "value": "2043"
                  },
                  {
                    "label": "畅饮一族",
                    "value": "2042"
                  },
                  {
                    "label": "坚果控",
                    "value": "2041"
                  },
                  {
                    "label": "当家主厨",
                    "value": "2040"
                  },
                  {
                    "label": "巧克力控",
                    "value": "2039"
                  },
                  {
                    "label": "抹茶控",
                    "value": "2038"
                  },
                  {
                    "label": "蛋黄控",
                    "value": "2037"
                  },
                  {
                    "label": "懒人速食族",
                    "value": "2036"
                  },
                  {
                    "label": "饮茶客",
                    "value": "2035"
                  },
                  {
                    "label": "火锅控",
                    "value": "2034"
                  },
                  {
                    "label": "烘焙一族",
                    "value": "2033"
                  },
                  {
                    "label": "品酒迷",
                    "value": "2032"
                  },
                  {
                    "label": "水果迷",
                    "value": "2031"
                  },
                  {
                    "label": "咖啡党",
                    "value": "2030"
                  },
                  {
                    "label": "奶茶控",
                    "value": "2028"
                  },
                  {
                    "label": "养生一族",
                    "value": "2027"
                  },
                  {
                    "label": "美食家",
                    "value": "1319"
                  },
                  {
                    "label": "奶茶妹妹",
                    "value": "1309"
                  },
                  {
                    "label": "甜食党",
                    "value": "1261"
                  },
                  {
                    "label": "轻食人士",
                    "value": "1260"
                  },
                  {
                    "label": "早餐君",
                    "value": "1182"
                  },
                  {
                    "label": "吃货的后裔",
                    "value": "1019"
                  },
                  {
                    "label": "咖啡控",
                    "value": "900"
                  },
                  {
                    "label": "水果大咖",
                    "value": "636"
                  },
                  {
                    "label": "品酒大师",
                    "value": "635"
                  },
                  {
                    "label": "烘焙爱好者",
                    "value": "634"
                  },
                  {
                    "label": "火锅爱好者",
                    "value": "632"
                  },
                  {
                    "label": "养生达人",
                    "value": "518"
                  },
                  {
                    "label": "红酒达人",
                    "value": "517"
                  },
                  {
                    "label": "吃不胖星人",
                    "value": "494"
                  },
                  {
                    "label": "茶道中人",
                    "value": "493"
                  },
                  {
                    "label": "肉食党",
                    "value": "492"
                  },
                  {
                    "label": "酸味控",
                    "value": "491"
                  },
                  {
                    "label": "重口味星人",
                    "value": "490"
                  },
                  {
                    "label": "无辣不欢者",
                    "value": "489"
                  },
                  {
                    "label": "芝士脑残粉",
                    "value": "399"
                  }
                ],
                "label": "美食兴趣",
                "value": "美食兴趣"
              },
              {
                "children": [
                  {
                    "label": "潜水迷",
                    "value": "2137"
                  },
                  {
                    "label": "街舞达人",
                    "value": "2136"
                  },
                  {
                    "label": "跳舞控",
                    "value": "2111"
                  },
                  {
                    "label": "功夫派",
                    "value": "2110"
                  },
                  {
                    "label": "出游族",
                    "value": "2093"
                  },
                  {
                    "label": "增肌狂人",
                    "value": "2092"
                  },
                  {
                    "label": "极限挑战控",
                    "value": "1259"
                  },
                  {
                    "label": "高尔夫大师",
                    "value": "1251"
                  },
                  {
                    "label": "飞盘控",
                    "value": "1250"
                  },
                  {
                    "label": "轮滑爱好者",
                    "value": "1241"
                  },
                  {
                    "label": "滑板少年",
                    "value": "1240"
                  },
                  {
                    "label": "棒球小子",
                    "value": "1227"
                  },
                  {
                    "label": "网球小子",
                    "value": "1214"
                  },
                  {
                    "label": "乒乓小将",
                    "value": "1176"
                  },
                  {
                    "label": "滑雪族",
                    "value": "1174"
                  },
                  {
                    "label": "灵魂冲浪手",
                    "value": "1173"
                  },
                  {
                    "label": "攀岩主义",
                    "value": "1172"
                  },
                  {
                    "label": "瑜伽修炼者",
                    "value": "1171"
                  },
                  {
                    "label": "羽球小子",
                    "value": "1170"
                  },
                  {
                    "label": "户外运动控",
                    "value": "1164"
                  },
                  {
                    "label": "水中飞鱼",
                    "value": "1163"
                  },
                  {
                    "label": "健身狂人",
                    "value": "13"
                  },
                  {
                    "label": "酷跑一族",
                    "value": "31"
                  },
                  {
                    "label": "超强灌篮手",
                    "value": "35"
                  },
                  {
                    "label": "足球爱好者",
                    "value": "36"
                  },
                  {
                    "label": "登山爱好者",
                    "value": "38"
                  },
                  {
                    "label": "骑行控",
                    "value": "39"
                  },
                  {
                    "label": "瘦身星人",
                    "value": "393"
                  }
                ],
                "label": "运动兴趣",
                "value": "运动兴趣"
              },
              {
                "children": [
                  {
                    "label": "国潮女子",
                    "value": "2069"
                  },
                  {
                    "label": "简约女神",
                    "value": "2068"
                  },
                  {
                    "label": "通勤女王",
                    "value": "2063"
                  },
                  {
                    "label": "原宿少女",
                    "value": "2059"
                  },
                  {
                    "label": "摇滚女孩",
                    "value": "2058"
                  },
                  {
                    "label": "嘻哈女孩",
                    "value": "2057"
                  },
                  {
                    "label": "英伦女王",
                    "value": "2055"
                  },
                  {
                    "label": "国风名媛",
                    "value": "2049"
                  },
                  {
                    "label": "ins达人",
                    "value": "1290"
                  },
                  {
                    "label": "ulzzang韩风迷",
                    "value": "1289"
                  },
                  {
                    "label": "chic少女",
                    "value": "1288"
                  },
                  {
                    "label": "港风男女",
                    "value": "1275"
                  },
                  {
                    "label": "维秘天使",
                    "value": "1267"
                  },
                  {
                    "label": "洛丽塔少女",
                    "value": "1248"
                  },
                  {
                    "label": "国潮达人",
                    "value": "1247"
                  },
                  {
                    "label": "腔调文青",
                    "value": "1198"
                  },
                  {
                    "label": "160cm女生",
                    "value": "1197"
                  },
                  {
                    "label": "民族风",
                    "value": "1157"
                  },
                  {
                    "label": "欧美御姐",
                    "value": "47"
                  },
                  {
                    "label": "韩范小妖精",
                    "value": "48"
                  },
                  {
                    "label": "日系软妹",
                    "value": "49"
                  },
                  {
                    "label": "气质名媛",
                    "value": "51"
                  },
                  {
                    "label": "性感女神",
                    "value": "52"
                  },
                  {
                    "label": "清纯学妹",
                    "value": "55"
                  },
                  {
                    "label": "清新少女",
                    "value": "56"
                  },
                  {
                    "label": "设计爱好者",
                    "value": "57"
                  },
                  {
                    "label": "BF风穿搭控",
                    "value": "61"
                  },
                  {
                    "label": "街头潮女",
                    "value": "63"
                  },
                  {
                    "label": "包包控",
                    "value": "66"
                  },
                  {
                    "label": "复古女郎",
                    "value": "394"
                  }
                ],
                "label": "女性风格",
                "value": "女性风格"
              },
              {
                "children": [
                  {
                    "label": "有范青年",
                    "value": "1215"
                  },
                  {
                    "label": "超级大学生",
                    "value": "1166"
                  },
                  {
                    "label": "孝顺爸妈党",
                    "value": "1145"
                  },
                  {
                    "label": "女神范",
                    "value": "1142"
                  },
                  {
                    "label": "品质男神",
                    "value": "8"
                  },
                  {
                    "label": "豆蔻少女",
                    "value": "9"
                  },
                  {
                    "label": "有范大叔",
                    "value": "16"
                  }
                ],
                "label": "成长周期",
                "value": "成长周期"
              },
              {
                "children": [
                  {
                    "label": "家务党",
                    "value": "2609"
                  },
                  {
                    "label": "沐浴家",
                    "value": "2608"
                  },
                  {
                    "label": "餐厅控",
                    "value": "2607"
                  },
                  {
                    "label": "原产地党",
                    "value": "2606"
                  },
                  {
                    "label": "复古星人",
                    "value": "2143"
                  },
                  {
                    "label": "朋克星人",
                    "value": "2142"
                  },
                  {
                    "label": "兔儿官",
                    "value": "2138"
                  },
                  {
                    "label": "小众萌宠官",
                    "value": "2097"
                  },
                  {
                    "label": "文艺家",
                    "value": "2079"
                  },
                  {
                    "label": "日式家",
                    "value": "2078"
                  },
                  {
                    "label": "软装控",
                    "value": "2077"
                  },
                  {
                    "label": "硬装家",
                    "value": "2076"
                  },
                  {
                    "label": "园艺控",
                    "value": "2003"
                  },
                  {
                    "label": "智慧家",
                    "value": "1320"
                  },
                  {
                    "label": "毛驴党",
                    "value": "1314"
                  },
                  {
                    "label": "机车骑士",
                    "value": "1313"
                  },
                  {
                    "label": "古典匠人",
                    "value": "1302"
                  },
                  {
                    "label": "工业家装控",
                    "value": "1262"
                  },
                  {
                    "label": "品味家",
                    "value": "1217"
                  },
                  {
                    "label": "美式家",
                    "value": "1211"
                  },
                  {
                    "label": "中式家装控",
                    "value": "1210"
                  },
                  {
                    "label": "北欧家装控",
                    "value": "1208"
                  },
                  {
                    "label": "喵星人",
                    "value": "1168"
                  },
                  {
                    "label": "爱车一族",
                    "value": "1161"
                  },
                  {
                    "label": "改装发烧友",
                    "value": "1144"
                  },
                  {
                    "label": "水族爱好者",
                    "value": "1141"
                  },
                  {
                    "label": "汪星人",
                    "value": "1140"
                  },
                  {
                    "label": "清洁收纳控",
                    "value": "1020"
                  },
                  {
                    "label": "手工匠人",
                    "value": "1000"
                  },
                  {
                    "label": "装修家",
                    "value": "930"
                  },
                  {
                    "label": "囤货小当家",
                    "value": "4"
                  },
                  {
                    "label": "理想家",
                    "value": "5"
                  },
                  {
                    "label": "萌宠控",
                    "value": "17"
                  },
                  {
                    "label": "旅行家",
                    "value": "19"
                  },
                  {
                    "label": "钓鱼达人",
                    "value": "20"
                  },
                  {
                    "label": "绿植控",
                    "value": "25"
                  },
                  {
                    "label": "DIY达人",
                    "value": "28"
                  },
                  {
                    "label": "雅致居家控",
                    "value": "29"
                  },
                  {
                    "label": "萌物控",
                    "value": "70"
                  },
                  {
                    "label": "木作匠人",
                    "value": "380"
                  },
                  {
                    "label": "杯子控",
                    "value": "381"
                  },
                  {
                    "label": "盘子控",
                    "value": "387"
                  },
                  {
                    "label": "多肉控",
                    "value": "398"
                  }
                ],
                "label": "生活兴趣",
                "value": "生活兴趣"
              },
              {
                "children": [
                  {
                    "label": "森女风",
                    "value": "2604"
                  },
                  {
                    "label": "摩登一族",
                    "value": "2603"
                  },
                  {
                    "label": "生肖迷",
                    "value": "2602"
                  },
                  {
                    "label": "极简主义",
                    "value": "2601"
                  },
                  {
                    "label": "抽象派",
                    "value": "2599"
                  },
                  {
                    "label": "手绘大师",
                    "value": "2596"
                  },
                  {
                    "label": "长腿一族",
                    "value": "2571"
                  },
                  {
                    "label": "魔术师",
                    "value": "2555"
                  },
                  {
                    "label": "动漫迷",
                    "value": "2551"
                  },
                  {
                    "label": "美甲师",
                    "value": "2540"
                  },
                  {
                    "label": "美妆达人",
                    "value": "2530"
                  },
                  {
                    "label": "风水迷",
                    "value": "2460"
                  },
                  {
                    "label": "实用主义",
                    "value": "2461"
                  },
                  {
                    "label": "白领小资",
                    "value": "2462"
                  },
                  {
                    "label": "重奢一族",
                    "value": "2464"
                  },
                  {
                    "label": "轻奢族",
                    "value": "2466"
                  },
                  {
                    "label": "舞蹈家",
                    "value": "2452"
                  },
                  {
                    "label": "露营爱好者",
                    "value": "2454"
                  },
                  {
                    "label": "马拉松联盟",
                    "value": "2455"
                  },
                  {
                    "label": "登山爱好者",
                    "value": "2456"
                  },
                  {
                    "label": "码农们的世界",
                    "value": "2458"
                  },
                  {
                    "label": "怕冷星人",
                    "value": "2459"
                  },
                  {
                    "label": "史学爱好者",
                    "value": "2446"
                  },
                  {
                    "label": "阅读控",
                    "value": "2447"
                  },
                  {
                    "label": "干皮星人",
                    "value": "2448"
                  },
                  {
                    "label": "瑜伽达人",
                    "value": "2449"
                  },
                  {
                    "label": "孝顺爸妈党",
                    "value": "2450"
                  },
                  {
                    "label": "酷跑一族",
                    "value": "2451"
                  },
                  {
                    "label": "休闲风",
                    "value": "2435"
                  },
                  {
                    "label": "公主风",
                    "value": "2436"
                  },
                  {
                    "label": "家有初中生",
                    "value": "2437"
                  },
                  {
                    "label": "家有小学生",
                    "value": "2438"
                  },
                  {
                    "label": "玉石控",
                    "value": "2439"
                  },
                  {
                    "label": "家有高中生",
                    "value": "2440"
                  },
                  {
                    "label": "星座迷",
                    "value": "2441"
                  },
                  {
                    "label": "迪士尼控",
                    "value": "2443"
                  },
                  {
                    "label": "窈窕淑女",
                    "value": "2427"
                  },
                  {
                    "label": "法式家装控",
                    "value": "2428"
                  },
                  {
                    "label": "日韩范儿",
                    "value": "2430"
                  },
                  {
                    "label": "禅道中人",
                    "value": "2431"
                  },
                  {
                    "label": "哥特风",
                    "value": "2434"
                  },
                  {
                    "label": "拼接范儿",
                    "value": "2417"
                  },
                  {
                    "label": "资深MUJI控",
                    "value": "2418"
                  },
                  {
                    "label": "热恋情侣",
                    "value": "2419"
                  },
                  {
                    "label": "通勤女王",
                    "value": "2422"
                  },
                  {
                    "label": "蕾丝控",
                    "value": "2423"
                  },
                  {
                    "label": "英伦风",
                    "value": "2424"
                  },
                  {
                    "label": "毛球穿搭控",
                    "value": "2425"
                  },
                  {
                    "label": "牛仔控",
                    "value": "2409"
                  },
                  {
                    "label": "格子控",
                    "value": "2412"
                  },
                  {
                    "label": "摇滚主义",
                    "value": "2415"
                  },
                  {
                    "label": "民族风",
                    "value": "2416"
                  },
                  {
                    "label": "华丽穿搭控",
                    "value": "2392"
                  },
                  {
                    "label": "朋克星人",
                    "value": "2395"
                  },
                  {
                    "label": "波西米亚风",
                    "value": "2396"
                  },
                  {
                    "label": "洛可可风",
                    "value": "2399"
                  },
                  {
                    "label": "设计爱好者",
                    "value": "2385"
                  },
                  {
                    "label": "东南亚风",
                    "value": "2389"
                  },
                  {
                    "label": "成熟风",
                    "value": "2390"
                  },
                  {
                    "label": "文艺青年",
                    "value": "2391"
                  },
                  {
                    "label": "萝莉风",
                    "value": "2375"
                  },
                  {
                    "label": "职场精英",
                    "value": "2377"
                  },
                  {
                    "label": "网红一族",
                    "value": "2378"
                  },
                  {
                    "label": "街头潮人",
                    "value": "2379"
                  },
                  {
                    "label": "雅痞绅士",
                    "value": "2380"
                  },
                  {
                    "label": "复古中式风",
                    "value": "2381"
                  },
                  {
                    "label": "原创死忠粉",
                    "value": "2382"
                  },
                  {
                    "label": "瑞丽风穿搭控",
                    "value": "2366"
                  },
                  {
                    "label": "美式风",
                    "value": "2367"
                  },
                  {
                    "label": "百搭教主",
                    "value": "2369"
                  },
                  {
                    "label": "田园家装控",
                    "value": "2370"
                  },
                  {
                    "label": "名媛风",
                    "value": "2372"
                  },
                  {
                    "label": "嘻哈派",
                    "value": "2373"
                  },
                  {
                    "label": "北欧家装控",
                    "value": "2374"
                  },
                  {
                    "label": "流苏控",
                    "value": "2360"
                  },
                  {
                    "label": "甜美风控",
                    "value": "2362"
                  },
                  {
                    "label": "自然主义",
                    "value": "2363"
                  },
                  {
                    "label": "破洞党",
                    "value": "2365"
                  },
                  {
                    "label": "梦幻风",
                    "value": "2349"
                  },
                  {
                    "label": "正装控",
                    "value": "2350"
                  },
                  {
                    "label": "国货党",
                    "value": "2351"
                  },
                  {
                    "label": "学院风",
                    "value": "2353"
                  },
                  {
                    "label": "清新穿搭控",
                    "value": "2355"
                  },
                  {
                    "label": "潮牌死忠粉",
                    "value": "2344"
                  },
                  {
                    "label": "洛丽塔少女",
                    "value": "2345"
                  },
                  {
                    "label": "商务精英",
                    "value": "2346"
                  },
                  {
                    "label": "怀旧风",
                    "value": "2347"
                  },
                  {
                    "label": "浪漫主义",
                    "value": "2348"
                  },
                  {
                    "label": "宜家控",
                    "value": "2334"
                  },
                  {
                    "label": "中式家装控",
                    "value": "2335"
                  },
                  {
                    "label": "沙滩一族",
                    "value": "2336"
                  },
                  {
                    "label": "日系风",
                    "value": "2337"
                  },
                  {
                    "label": "后现代家装控",
                    "value": "2339"
                  },
                  {
                    "label": "宫廷风",
                    "value": "2325"
                  },
                  {
                    "label": "卡通迷",
                    "value": "2326"
                  },
                  {
                    "label": "夜店潮人",
                    "value": "2327"
                  },
                  {
                    "label": "军装控",
                    "value": "2328"
                  },
                  {
                    "label": "尼泊尔风",
                    "value": "2330"
                  },
                  {
                    "label": "复古范儿",
                    "value": "2331"
                  },
                  {
                    "label": "甜心教主",
                    "value": "2315"
                  },
                  {
                    "label": "新古典派",
                    "value": "2316"
                  },
                  {
                    "label": "欧美范儿",
                    "value": "2317"
                  },
                  {
                    "label": "就爱宽松感",
                    "value": "2319"
                  },
                  {
                    "label": "性感达人",
                    "value": "2320"
                  },
                  {
                    "label": "蝴蝶结控",
                    "value": "2322"
                  },
                  {
                    "label": "桃心控",
                    "value": "2309"
                  },
                  {
                    "label": "地中海家装控",
                    "value": "2311"
                  },
                  {
                    "label": "家居达人",
                    "value": "2312"
                  },
                  {
                    "label": "和风控",
                    "value": "2313"
                  },
                  {
                    "label": "前卫星人",
                    "value": "2314"
                  },
                  {
                    "label": "国风迷",
                    "value": "2304"
                  },
                  {
                    "label": "简约风",
                    "value": "2306"
                  },
                  {
                    "label": "cosplay部落",
                    "value": "2298"
                  },
                  {
                    "label": "欧式风",
                    "value": "2299"
                  },
                  {
                    "label": "民国风",
                    "value": "2301"
                  },
                  {
                    "label": "港风达人",
                    "value": "2302"
                  },
                  {
                    "label": "文具控",
                    "value": "2297"
                  },
                  {
                    "label": "手表控",
                    "value": "2296"
                  },
                  {
                    "label": "轰趴党",
                    "value": "2295"
                  },
                  {
                    "label": "冲浪手",
                    "value": "2294"
                  },
                  {
                    "label": "包包控",
                    "value": "2292"
                  },
                  {
                    "label": "汪星人",
                    "value": "2291"
                  },
                  {
                    "label": "饰品控",
                    "value": "2289"
                  },
                  {
                    "label": "就爱这口酸",
                    "value": "2288"
                  },
                  {
                    "label": "吉他手",
                    "value": "2287"
                  },
                  {
                    "label": "喵星人",
                    "value": "2286"
                  },
                  {
                    "label": "美帽达人",
                    "value": "2285"
                  },
                  {
                    "label": "杯子控",
                    "value": "2283"
                  },
                  {
                    "label": "机车骑士",
                    "value": "2282"
                  },
                  {
                    "label": "咖啡控",
                    "value": "2281"
                  },
                  {
                    "label": "卫衣控",
                    "value": "2280"
                  },
                  {
                    "label": "手机重患者",
                    "value": "2279"
                  },
                  {
                    "label": "绘画一族",
                    "value": "2278"
                  },
                  {
                    "label": "品酒大师",
                    "value": "2277"
                  },
                  {
                    "label": "滑板少年",
                    "value": "2276"
                  },
                  {
                    "label": "结婚一族",
                    "value": "2275"
                  },
                  {
                    "label": "盘子控",
                    "value": "2274"
                  },
                  {
                    "label": "攀岩勇士",
                    "value": "2272"
                  },
                  {
                    "label": "天文爱好者",
                    "value": "2271"
                  },
                  {
                    "label": "高尔夫俱乐部",
                    "value": "2270"
                  },
                  {
                    "label": "骨灰级AJ迷",
                    "value": "2269"
                  },
                  {
                    "label": "红酒达人",
                    "value": "2268"
                  },
                  {
                    "label": "轮滑控",
                    "value": "2267"
                  },
                  {
                    "label": "漫画君",
                    "value": "2266"
                  },
                  {
                    "label": "水果大咖",
                    "value": "2265"
                  },
                  {
                    "label": "极限挑战控",
                    "value": "2264"
                  },
                  {
                    "label": "网球控",
                    "value": "2263"
                  },
                  {
                    "label": "美体师",
                    "value": "2262"
                  },
                  {
                    "label": "火锅爱好者",
                    "value": "2261"
                  },
                  {
                    "label": "游泳健将",
                    "value": "2260"
                  },
                  {
                    "label": "棒球小将",
                    "value": "2259"
                  },
                  {
                    "label": "甜食党",
                    "value": "2257"
                  },
                  {
                    "label": "口红控",
                    "value": "2255"
                  },
                  {
                    "label": "羽球达人",
                    "value": "2256"
                  },
                  {
                    "label": "家有小公主",
                    "value": "2246"
                  },
                  {
                    "label": "加班一族",
                    "value": "2247"
                  },
                  {
                    "label": "单身狗联盟",
                    "value": "2248"
                  },
                  {
                    "label": "新生儿",
                    "value": "2249"
                  },
                  {
                    "label": "元气少女",
                    "value": "2250"
                  },
                  {
                    "label": "乒乓健将",
                    "value": "2251"
                  },
                  {
                    "label": "厨艺大师",
                    "value": "2252"
                  },
                  {
                    "label": "上班族",
                    "value": "2235"
                  },
                  {
                    "label": "备孕妈咪",
                    "value": "2236"
                  },
                  {
                    "label": "早教那些事",
                    "value": "2237"
                  },
                  {
                    "label": "超级大学生",
                    "value": "2238"
                  },
                  {
                    "label": "恋爱ing",
                    "value": "2239"
                  },
                  {
                    "label": "装修家",
                    "value": "2240"
                  },
                  {
                    "label": "月子女王",
                    "value": "2241"
                  },
                  {
                    "label": "好孕妈咪",
                    "value": "2242"
                  },
                  {
                    "label": "滑雪族",
                    "value": "2243"
                  },
                  {
                    "label": "香氛控",
                    "value": "2226"
                  },
                  {
                    "label": "足球迷",
                    "value": "2227"
                  },
                  {
                    "label": "萌系萌物控",
                    "value": "2228"
                  },
                  {
                    "label": "文人墨客",
                    "value": "2230"
                  },
                  {
                    "label": "骑行控",
                    "value": "2231"
                  },
                  {
                    "label": "模型控",
                    "value": "2232"
                  },
                  {
                    "label": "超强灌篮手",
                    "value": "2233"
                  },
                  {
                    "label": "大叔范儿",
                    "value": "2234"
                  },
                  {
                    "label": "爱车一族",
                    "value": "2218"
                  },
                  {
                    "label": "户外运动控",
                    "value": "2219"
                  },
                  {
                    "label": "游戏外设迷",
                    "value": "2220"
                  },
                  {
                    "label": "摄影发烧友",
                    "value": "2221"
                  },
                  {
                    "label": "绿植控",
                    "value": "2223"
                  },
                  {
                    "label": "耳机发烧友",
                    "value": "2224"
                  },
                  {
                    "label": "原宿潮人",
                    "value": "2213"
                  },
                  {
                    "label": "豹纹女王",
                    "value": "2214"
                  },
                  {
                    "label": "萌宠养成记",
                    "value": "2217"
                  },
                  {
                    "label": "条纹控",
                    "value": "2206"
                  },
                  {
                    "label": "粉色少女",
                    "value": "2207"
                  },
                  {
                    "label": "气质小仙女",
                    "value": "2208"
                  },
                  {
                    "label": "波点控",
                    "value": "2199"
                  },
                  {
                    "label": "帅气BF风",
                    "value": "2196"
                  },
                  {
                    "label": "国潮达人",
                    "value": "2195"
                  },
                  {
                    "label": "ins达人",
                    "value": "2194"
                  },
                  {
                    "label": "chic少女",
                    "value": "2193"
                  },
                  {
                    "label": "中国风",
                    "value": "2192"
                  },
                  {
                    "label": "Blingbling控",
                    "value": "2183"
                  },
                  {
                    "label": "ulzzang风",
                    "value": "2184"
                  },
                  {
                    "label": "撞色控",
                    "value": "2186"
                  },
                  {
                    "label": "大码星人",
                    "value": "2187"
                  },
                  {
                    "label": "黑白配",
                    "value": "2188"
                  },
                  {
                    "label": "嘻哈一族",
                    "value": "2189"
                  },
                  {
                    "label": "水族爱好者",
                    "value": "2175"
                  },
                  {
                    "label": "健身狂人",
                    "value": "2176"
                  },
                  {
                    "label": "重口味星人",
                    "value": "2177"
                  },
                  {
                    "label": "茶道中人",
                    "value": "2178"
                  },
                  {
                    "label": "音乐发烧友",
                    "value": "2179"
                  },
                  {
                    "label": "芝士脑残粉",
                    "value": "2180"
                  },
                  {
                    "label": "多肉君",
                    "value": "2181"
                  },
                  {
                    "label": "炫酷极客控",
                    "value": "2167"
                  },
                  {
                    "label": "手工爱好者",
                    "value": "2168"
                  },
                  {
                    "label": "旅行家",
                    "value": "2169"
                  },
                  {
                    "label": "烘焙达人",
                    "value": "2170"
                  },
                  {
                    "label": "囤货小当家",
                    "value": "2171"
                  },
                  {
                    "label": "汽车改装党",
                    "value": "2172"
                  },
                  {
                    "label": "无辣不欢者",
                    "value": "2173"
                  },
                  {
                    "label": "资深吃货",
                    "value": "2174"
                  },
                  {
                    "label": "二次元达人",
                    "value": "2160"
                  },
                  {
                    "label": "养生达人",
                    "value": "2161"
                  },
                  {
                    "label": "追星族",
                    "value": "2162"
                  },
                  {
                    "label": "文玩控",
                    "value": "2163"
                  },
                  {
                    "label": "清洁收纳控",
                    "value": "2164"
                  },
                  {
                    "label": "钓鱼达人",
                    "value": "2165"
                  },
                  {
                    "label": "无肉不欢",
                    "value": "2166"
                  }
                ],
                "label": "其他",
                "value": "其他"
              },
              {
                "children": [
                  {
                    "label": "家有小正太",
                    "value": "2244"
                  },
                  {
                    "label": "小学生男宝家长",
                    "value": "2091"
                  },
                  {
                    "label": "小学生女宝家长",
                    "value": "2090"
                  },
                  {
                    "label": "幼儿家长",
                    "value": "2072"
                  },
                  {
                    "label": "1岁宝宝爸妈",
                    "value": "2071"
                  },
                  {
                    "label": "新生儿父母",
                    "value": "2070"
                  },
                  {
                    "label": "学前女宝家长",
                    "value": "2024"
                  },
                  {
                    "label": "学前男宝家长",
                    "value": "2023"
                  },
                  {
                    "label": "幼儿女宝家长",
                    "value": "2022"
                  },
                  {
                    "label": "幼儿男宝爸妈",
                    "value": "2021"
                  },
                  {
                    "label": "1岁女宝家长",
                    "value": "2020"
                  },
                  {
                    "label": "1岁男宝家长",
                    "value": "2019"
                  },
                  {
                    "label": "半岁女宝",
                    "value": "2018"
                  },
                  {
                    "label": "半岁男宝",
                    "value": "2017"
                  },
                  {
                    "label": "初生男宝家长",
                    "value": "2016"
                  },
                  {
                    "label": "初生男宝家长",
                    "value": "2015"
                  },
                  {
                    "label": "小小摄影师",
                    "value": "1294"
                  },
                  {
                    "label": "备孕妈咪",
                    "value": "1293"
                  },
                  {
                    "label": "早教专家",
                    "value": "1292"
                  },
                  {
                    "label": "宝宝游乐控",
                    "value": "1291"
                  },
                  {
                    "label": "宝宝医生族",
                    "value": "1283"
                  },
                  {
                    "label": "小小钢琴家",
                    "value": "1282"
                  },
                  {
                    "label": "新生萌宝",
                    "value": "1281"
                  },
                  {
                    "label": "亲子控",
                    "value": "1280"
                  },
                  {
                    "label": "独立小萌宝",
                    "value": "1279"
                  },
                  {
                    "label": "宝宝护理师",
                    "value": "1257"
                  },
                  {
                    "label": "小小工程师",
                    "value": "1246"
                  },
                  {
                    "label": "小小画家",
                    "value": "1244"
                  },
                  {
                    "label": "小小舞者",
                    "value": "1239"
                  },
                  {
                    "label": "宝宝出游控",
                    "value": "1238"
                  },
                  {
                    "label": "小小赛车手",
                    "value": "1237"
                  },
                  {
                    "label": "天才科学家",
                    "value": "1236"
                  },
                  {
                    "label": "小小运动员",
                    "value": "1235"
                  },
                  {
                    "label": "小小二次元",
                    "value": "1233"
                  },
                  {
                    "label": "小小军事迷",
                    "value": "1225"
                  },
                  {
                    "label": "迪士尼控",
                    "value": "1223"
                  },
                  {
                    "label": "芭比收藏家",
                    "value": "1222"
                  },
                  {
                    "label": "二胎父母",
                    "value": "1221"
                  },
                  {
                    "label": "职场辣妈",
                    "value": "1220"
                  },
                  {
                    "label": "月子女王",
                    "value": "1218"
                  },
                  {
                    "label": "宝宝营养师",
                    "value": "1216"
                  },
                  {
                    "label": "小学生家长",
                    "value": "1207"
                  },
                  {
                    "label": "学前男宝",
                    "value": "1206"
                  },
                  {
                    "label": "小小厨师",
                    "value": "1205"
                  },
                  {
                    "label": "海派妈咪",
                    "value": "1203"
                  },
                  {
                    "label": "宝宝公主控",
                    "value": "1200"
                  },
                  {
                    "label": "小正太",
                    "value": "1199"
                  },
                  {
                    "label": "宝宝贵族控",
                    "value": "1196"
                  },
                  {
                    "label": "好孕妈咪",
                    "value": "873"
                  },
                  {
                    "label": "宝爸宝妈",
                    "value": "871"
                  }
                ],
                "label": "母婴",
                "value": "母婴"
              },
              {
                "children": [
                  {
                    "label": "红火团圆年",
                    "value": "1322"
                  },
                  {
                    "label": "囤精品年货",
                    "value": "1321"
                  },
                  {
                    "label": "超级买手",
                    "value": "1204"
                  },
                  {
                    "label": "抗霾卫士",
                    "value": "1181"
                  },
                  {
                    "label": "月光族",
                    "value": "1180"
                  },
                  {
                    "label": "温暖小贴士",
                    "value": "1155"
                  }
                ],
                "label": "营销",
                "value": "营销"
              },
              {
                "children": [
                  {
                    "label": "办公室午休党",
                    "value": "2445"
                  },
                  {
                    "label": "中医爱好者",
                    "value": "2254"
                  },
                  {
                    "label": "送礼星人",
                    "value": "2130"
                  },
                  {
                    "label": "冻龄女神",
                    "value": "2008"
                  },
                  {
                    "label": "网红一族",
                    "value": "2005"
                  },
                  {
                    "label": "彩虹糖Pride",
                    "value": "1984"
                  },
                  {
                    "label": "医护天使",
                    "value": "1311"
                  },
                  {
                    "label": "占卜师",
                    "value": "1310"
                  },
                  {
                    "label": "陶艺大师",
                    "value": "1306"
                  },
                  {
                    "label": "彩绘师",
                    "value": "1305"
                  },
                  {
                    "label": "速记师",
                    "value": "1303"
                  },
                  {
                    "label": "家庭煮妇",
                    "value": "1272"
                  },
                  {
                    "label": "厨艺达人",
                    "value": "1256"
                  },
                  {
                    "label": "办公白领",
                    "value": "1255"
                  },
                  {
                    "label": "大脸星人",
                    "value": "1245"
                  },
                  {
                    "label": "职场白骨精",
                    "value": "1229"
                  },
                  {
                    "label": "华尔街精英",
                    "value": "1228"
                  },
                  {
                    "label": "时髦阿姨",
                    "value": "1212"
                  },
                  {
                    "label": "华丽上班族",
                    "value": "1185"
                  },
                  {
                    "label": "怕冷星人",
                    "value": "1184"
                  },
                  {
                    "label": "结婚新人",
                    "value": "1165"
                  },
                  {
                    "label": "好想谈恋爱",
                    "value": "1151"
                  },
                  {
                    "label": "高富帅",
                    "value": "1150"
                  },
                  {
                    "label": "白富美",
                    "value": "1149"
                  },
                  {
                    "label": "SVIP壕",
                    "value": "1147"
                  },
                  {
                    "label": "租房一族",
                    "value": "1022"
                  },
                  {
                    "label": "追星族",
                    "value": "908"
                  },
                  {
                    "label": "太平公主",
                    "value": "897"
                  },
                  {
                    "label": "我就是大",
                    "value": "895"
                  },
                  {
                    "label": "痛经忍者",
                    "value": "877"
                  },
                  {
                    "label": "晚睡强迫症",
                    "value": "876"
                  },
                  {
                    "label": "宅男宅女",
                    "value": "875"
                  },
                  {
                    "label": "拼命十三郎",
                    "value": "874"
                  },
                  {
                    "label": "新时代主妇",
                    "value": "1"
                  },
                  {
                    "label": "IT人士",
                    "value": "391"
                  }
                ],
                "label": "趣味身份",
                "value": "趣味身份"
              },
              {
                "children": [
                  {
                    "label": "摆件控",
                    "value": "1301"
                  },
                  {
                    "label": "黏土人",
                    "value": "1300"
                  },
                  {
                    "label": "制服党",
                    "value": "1258"
                  },
                  {
                    "label": "模型控",
                    "value": "24"
                  },
                  {
                    "label": "赖床专业户",
                    "value": "378"
                  }
                ],
                "label": "其它兴趣",
                "value": "其它兴趣"
              },
              {
                "children": [
                  {
                    "label": "小众冷门控",
                    "value": "2420"
                  },
                  {
                    "label": "奢华主义派",
                    "value": "2102"
                  },
                  {
                    "label": "简约主义派",
                    "value": "2067"
                  },
                  {
                    "label": "国潮型男",
                    "value": "2066"
                  },
                  {
                    "label": "商务型男",
                    "value": "2064"
                  },
                  {
                    "label": "嘻哈潮男",
                    "value": "2056"
                  },
                  {
                    "label": "街头少年",
                    "value": "2052"
                  },
                  {
                    "label": "复古男神",
                    "value": "2046"
                  },
                  {
                    "label": "嘻哈一族",
                    "value": "1286"
                  },
                  {
                    "label": "硬汉军旅风",
                    "value": "1285"
                  },
                  {
                    "label": "原宿少年",
                    "value": "1278"
                  },
                  {
                    "label": "英伦潮男",
                    "value": "1277"
                  },
                  {
                    "label": "不撞衫星人",
                    "value": "1276"
                  },
                  {
                    "label": "摇滚青年",
                    "value": "1271"
                  },
                  {
                    "label": "历史狂享家",
                    "value": "1224"
                  },
                  {
                    "label": "大码界男神",
                    "value": "1183"
                  },
                  {
                    "label": "潮鞋宠儿",
                    "value": "1159"
                  },
                  {
                    "label": "单身小汪",
                    "value": "12"
                  },
                  {
                    "label": "欧美型男",
                    "value": "72"
                  },
                  {
                    "label": "时尚潮男",
                    "value": "80"
                  },
                  {
                    "label": "国风男子",
                    "value": "395"
                  },
                  {
                    "label": "清新暖男",
                    "value": "396"
                  },
                  {
                    "label": "韩范欧巴",
                    "value": "397"
                  }
                ],
                "label": "男性风格",
                "value": "男性风格"
              },
              {
                "children": [
                  {
                    "label": "手账控",
                    "value": "2140"
                  },
                  {
                    "label": "女装大佬",
                    "value": "2139"
                  },
                  {
                    "label": "二次元硬核玩家",
                    "value": "2101"
                  },
                  {
                    "label": "仙气古风",
                    "value": "2100"
                  },
                  {
                    "label": "美美Lolita",
                    "value": "2099"
                  },
                  {
                    "label": "御宅族",
                    "value": "2098"
                  },
                  {
                    "label": "中医世家",
                    "value": "1316"
                  },
                  {
                    "label": "整蛊王",
                    "value": "1315"
                  },
                  {
                    "label": "ps大师",
                    "value": "1312"
                  },
                  {
                    "label": "漫画迷",
                    "value": "1226"
                  },
                  {
                    "label": "哲学家",
                    "value": "1219"
                  },
                  {
                    "label": "意气书生",
                    "value": "1179"
                  },
                  {
                    "label": "棋牌爱好者",
                    "value": "1175"
                  },
                  {
                    "label": "天文爱好者",
                    "value": "1169"
                  },
                  {
                    "label": "爱乐迷",
                    "value": "1017"
                  },
                  {
                    "label": "COS巨巨",
                    "value": "896"
                  },
                  {
                    "label": "Party党",
                    "value": "775"
                  },
                  {
                    "label": "二次元达人",
                    "value": "14"
                  },
                  {
                    "label": "绘画一族",
                    "value": "21"
                  },
                  {
                    "label": "挥毫泼墨派",
                    "value": "34"
                  },
                  {
                    "label": "集邮达人",
                    "value": "37"
                  },
                  {
                    "label": "吉他控",
                    "value": "40"
                  },
                  {
                    "label": "文具控",
                    "value": "78"
                  },
                  {
                    "label": "文玩控",
                    "value": "385"
                  }
                ],
                "label": "文娱兴趣",
                "value": "文娱兴趣"
              },
              {
                "children": [
                  {
                    "label": "铆钉控",
                    "value": "2062"
                  },
                  {
                    "label": "破洞控",
                    "value": "2061"
                  },
                  {
                    "label": "海派甜心",
                    "value": "1317"
                  },
                  {
                    "label": "Bling控",
                    "value": "1296"
                  },
                  {
                    "label": "波点控",
                    "value": "1287"
                  },
                  {
                    "label": "黑白控",
                    "value": "1274"
                  },
                  {
                    "label": "粉红少女",
                    "value": "1273"
                  },
                  {
                    "label": "牛仔迷",
                    "value": "1270"
                  },
                  {
                    "label": "撞色控",
                    "value": "1269"
                  },
                  {
                    "label": "极简控",
                    "value": "1268"
                  },
                  {
                    "label": "格子控",
                    "value": "1254"
                  },
                  {
                    "label": "条纹控",
                    "value": "1253"
                  },
                  {
                    "label": "流苏控",
                    "value": "1252"
                  },
                  {
                    "label": "卫衣控",
                    "value": "1249"
                  },
                  {
                    "label": "宽松女神",
                    "value": "1162"
                  },
                  {
                    "label": "美鞋控",
                    "value": "1158"
                  },
                  {
                    "label": "豹纹女王",
                    "value": "927"
                  },
                  {
                    "label": "蕾丝控",
                    "value": "914"
                  },
                  {
                    "label": "限量版星人",
                    "value": "776"
                  },
                  {
                    "label": "美帽达人",
                    "value": "67"
                  },
                  {
                    "label": "手表控",
                    "value": "75"
                  },
                  {
                    "label": "旗袍女子",
                    "value": "384"
                  },
                  {
                    "label": "饰品控",
                    "value": "388"
                  },
                  {
                    "label": "裙控MM",
                    "value": "389"
                  }
                ],
                "label": "元素偏好",
                "value": "元素偏好"
              }
            ],
            "tips": "围绕匹配的人群进行创作，可得到更多曝光~, 点击<a target=\"_blank\" href=\"https://we.taobao.com/creative/group\">#查看人群说明与热点#</a>",
            "value": ""
          },
          "rules": [
            {
              "type": "string"
            }
          ],
          "tips": "围绕匹配的人群进行创作，可得到更多曝光~, 点击<a target=\"_blank\" href=\"https://we.taobao.com/creative/group\">#查看人群说明与热点#</a>"
        },
        {
          "component": "Activity",
          "label": "推送至群聊（默认不推送）",
          "name": "pushToGroup",
          "props": {
            "label": "推送至群聊（默认不推送）",
            "messageChannel": "chattingPopIframe",
            "value": [
              {
                "checked": false,
                "description": "",
                "key": "pushToGroup",
                "query": "",
                "title": "推送至群",
                "url": "//chatting.taobao.com/admin/tool/chooseGroup.html"
              }
            ]
          },
          "rules": []
        },
        {
          "component": "CreatorAddTag",
          "label": "添加标签",
          "labelExtra": "根据您写的内容进行匹配标签添加,准确优质的标签将有助于内容全网曝光",
          "name": "contentTags",
          "props": {
            "label": "添加标签",
            "placeholder": "输入你想添加的标签，回车添加",
            "tips": "",
            "labelExtra": "根据您写的内容进行匹配标签添加,准确优质的标签将有助于内容全网曝光",
            "value": []
          },
          "rules": [],
          "tips": ""
        },
        {
          "className": "creator-none",
          "component": "CreatorPush",
          "label": "",
          "name": "pushDaren",
          "props": {
            "html2": "选中后推送到个人主页",
            "className": "creator-none",
            "html": "推送到达人主页",
            "label": "",
            "iconUrl": "//img.alicdn.com/tfs/TB1w2CBSpXXXXaZXFXXXXXXXXXX-64-64.png",
            "iconActiveUrl": "//img.alicdn.com/tfs/TB1d7t.SpXXXXaXaFXXXXXXXXXX-60-60.png",
            "value": true
          },
          "rules": []
        },
        {
          "className": "creator-none",
          "component": "DateTime",
          "label": "定时发布",
          "name": "scheduledPublishTime",
          "props": {
            "className": "creator-none",
            "until": 1556008400744,
            "label": "定时发布",
            "value": ""
          },
          "rules": []
        },
        {
          "className": "creator-none",
          "component": "Checkbox",
          "label": "参加“微淘优质内容奖励”",
          "name": "publicInvent",
          "props": {
            "style": {
              "display": "none"
            },
            "className": "creator-none",
            "label": "参加“微淘优质内容奖励”",
            "value": true
          },
          "rules": []
        }
      ],
      "dynamicFormVersion": "0.1.16",
      "formData": {
        "template": "post",
        "owner": "undefined",
        "formName": "",
        "activityName": "",
        "source": "creator",
        "userRole": "daren",
        "publishToolbar": "[{\"text\":\"发布新微淘\"},{\"text\":\"长文章\"}]",
        "serverData": "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"
      },
      "labelCol": 3,
      "name": "PUBLISH_FORM__PC",
      "updateUrl": "//cpub.taobao.com/async.json?_tb_token_=e35e8341dfe56"
    },
    "status": "success"
  },

  effects: {
    *getProductDetail(action, { call, put }) {
    },
  },

  reducers: {
    init(state) {
    },
    update(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    }
  },
};

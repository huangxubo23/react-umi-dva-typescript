let tt = {
    "components": ["CreatorAddTopic", "RadioGroup", "Activity", "Text", "CreatorPush", "TagPicker", "DateTime", "CreatorAddItem", "Input", "Toast", "InteractContainer", "Checkbox", "IceAddVideo", "Forward", "CreatorAddImage", "CascaderSelect"],
    "config": {
        "actions": [{
            "size": "large",
            "span": "2",
            "style": {"display": "none"},
            "name": "draft",
            "text": "保存草稿",
            "url": "//cpub.taobao.com/submit.json?draft=1&_draft_id=220559722270&_tb_token_=5566e4bdbb1e3"
        }, {
            "size": "large",
            "span": 2,
            "offset": 5,
            "type": "primary",
            "needValidate": true,
            "disabled": false,
            "style": {"display": "none"},
            "name": "submit",
            "text": "发布(今日还可发布：10篇)",
            "url": "//cpub.taobao.com/submit.json?_tb_token_=5566e4bdbb1e3"
        }, {
            "size": "large",
            "span": "2",
            "style": {"display": "none"},
            "name": "preview",
            "text": "预览",
            "url": "//cpub.taobao.com/submit.json?preview=1&draft=1&_draft_id=220559722270&_tb_token_=5566e4bdbb1e3"
        }],
        "children": [{
            "component": "Forward",
            "label": "",
            "name": "forward",
            "props": {
                "enableExpression": false,
                "enableTopic": false,
                "style": {"paddingBottom": "5", "background": "#C4DEFF", "width": "100%"},
                "label": "",
                "placeholder": "请输入想要对粉丝说的话，优质生动的内容有利于提升曝光和粉丝关注。该内容将被展示在微淘关注卡片。",
                "title": "这篇文章想对粉丝说什么",
                "value": "#粗跟鞋穿搭技巧#"
            },
            "rules": [{"type": "string", "message": "必填，内容不能为空", "required": true}, {
                "min": 1,
                "type": "string",
                "message": "文字长度太短, 要求长度最少为1"
            }, {"max": 100, "type": "string", "message": "文字长度太长, 要求长度最多为100"}]
        }, {
            "className": "creator-input-no-border creator-input-title",
            "component": "Input",
            "label": "标题",
            "name": "title",
            "props": {
                "className": "creator-input-no-border creator-input-title",
                "label": "标题",
                "placeholder": "请在这里输入4-19字的标题",
                "tips": "<a target='_blank' href='https://docs.alipay.com/alibaba_we_guide/guide/derz4g'>优质标题写作指引</a>按照创作指引添加标题，将大大提高内容被更大渠道采纳的概率哦～",
                "cutString": false,
                "maxLength": 19,
                "hasLimitHint": true,
                "value": "粗跟鞋穿搭技巧，小个子女生的秘密"
            },
            "rules": [{"type": "string", "message": "标题不能为空", "required": true}, {
                "min": 4,
                "type": "string",
                "message": "文字长度太短, 要求长度最少为4"
            }, {"max": 19, "type": "string", "message": "文字长度太长, 要求长度最多为19"}],
            "tips": "<a target='_blank' href='https://docs.alipay.com/alibaba_we_guide/guide/derz4g'>优质标题写作指引</a>按照创作指引添加标题，将大大提高内容被更大渠道采纳的概率哦～"
        }, {
            "className": "creator-input-no-border",
            "component": "Input",
            "label": "",
            "name": "summary",
            "props": {
                "multiple": true,
                "className": "creator-input-no-border",
                "label": "",
                "placeholder": "请在这里输入50到140字摘要，要求：\n(1)单品请填写推荐理由；\n(2)剧情、广告类型请描述主要剧情或情节；\n(3)评测、清单、盘点类型请描述清单盘点的主题，涉及主要商品；",
                "rows": 4,
                "cutString": false,
                "maxLength": 140,
                "hasLimitHint": true,
                "value": " 作为一名158cm的小个子，今天就要来跟大家聊聊身高的问题，俗话说的好“身高不够，鞋子来凑”；如果真的要选一双鞋子的话，那一定是粗跟鞋莫属了；我们来看看粗跟鞋都可以怎么穿搭吧！"
            },
            "rules": [{"min": 50, "type": "string", "message": "请输入50-140个字的摘要"}, {
                "max": 140,
                "type": "string",
                "message": "请输入50-140个字的摘要"
            }]
        }, {
            "component": "IceAddVideo",
            "errMsg": "图片尺寸不符合要求",
            "label": "上传视频",
            "name": "body",
            "props": {
                "filterRatioEqual": ["16:9", "9:16"],
                "filterDurLess": 601,
                "editVideoUrl": "/material/mine/video",
                "addImageProps": {"pixFilter": "750x422", "appkey": "tu"},
                "filterDurGreater": 8,
                "label": "上传视频",
                "api": "//resource.taobao.com/video/getMaterial?pageSize=20&vf=p&producerSource=1",
                "videoCenterUrl": "/material/mine/video",
                "tips": "请上传比例为16:9横版或9:16竖版主视频素材，大小不超过200M，时长9s-10m",
                "enableNormalVideo": true,
                "enableInteractVideo": true,
                "value": [{
                    "coverUrl": "https://img.alicdn.com/imgextra/i1/6000000004962/O1CN01UFk9TF1mWdmUuZ98u_!!6000000004962-0-tbvideo.jpg",
                    "description": "序列 01.mp4..mp4",
                    "duration": 58,
                    "playUrl": "//cloud.video.taobao.com/play/u/3536372976/p/2/e/6/t/1/220559722270.mp4",
                    "title": "序列 01.mp4..mp4",
                    "uploadTime": 1551779969000,
                    "videoCoverUrl": "//img.alicdn.com/imgextra/i3/781916294/O1CN01yBwNco1wMhLBKhGmf_!!781916294-0-beehive-scenes.jpg",
                    "videoId": 220559722270
                }]
            },
            "rules": [{"min": 1, "type": "array", "message": "至少要有1个"}, {
                "max": 1,
                "type": "array",
                "message": "最多允许1个"
            }],
            "tips": "请上传比例为16:9横版或9:16竖版主视频素材，大小不超过200M，时长9s-10m",
            "updateOnChange": "true"
        }, {
            "component": "CreatorAddItem",
            "label": "添加商品",
            "name": "bodyItems",
            "props": {
                "activityId": 0,
                "max": 20,
                "addImageProps": {},
                "categoryListApiQuery": {},
                "label": "添加商品",
                "editTitleMaxLength": 20,
                "value": []
            },
            "rules": [{"max": 20, "type": "array", "message": "最多允许20个"}]
        }, {
            "component": "CreatorAddImage",
            "label": "上传1:1封面图",
            "name": "video_1x1_cover",
            "props": {
                "max": 1,
                "activityId": 0,
                "pixFilter": "750x750",
                "min": 1,
                "label": "上传1:1封面图",
                "tips": "请上传尺寸不小于750*750px的封面图，优质清晰的封面图有利于推荐",
                "value": [{
                    "anchors": [],
                    "height": 750,
                    "hotSpaces": [],
                    "resourceFeatures": {},
                    "url": "//img.alicdn.com/imgextra/i4/781916294/O1CN019TcZag1wMhLAcey9s_!!781916294-0-beehive-scenes.jpg",
                    "width": 750
                }]
            },
            "rules": [{"min": 1, "type": "array", "message": "至少要有1个"}, {
                "max": 1,
                "type": "array",
                "message": "最多允许1个"
            }],
            "tips": "请上传尺寸不小于750*750px的封面图，优质清晰的封面图有利于推荐"
        }, {
            "component": "CreatorAddImage",
            "errMsg": "至少要有1个",
            "label": "上传9:16封面图",
            "name": "video_9x16_cover",
            "props": {
                "max": 1,
                "activityId": 0,
                "pixFilter": "422x750",
                "min": 1,
                "label": "上传9:16封面图",
                "tips": "请上传尺寸不小于422*750px的封面图，优质清晰的封面图有利于推荐",
                "value": []
            },
            "rules": [{"min": 1, "type": "array", "message": "至少要有1个"}, {
                "max": 1,
                "type": "array",
                "message": "最多允许1个"
            }],
            "tips": "请上传尺寸不小于422*750px的封面图，优质清晰的封面图有利于推荐"
        }, {
            "component": "IceAddVideo",
            "label": "请上传最高800K码率，720P清晰度，与主视频比例一致的5s视频贴片",
            "name": "homePageIntroVideo",
            "props": {
                "filterRatioEqual": ["9:16"],
                "filterDurLess": 6,
                "editVideoUrl": "/material/mine/video",
                "addImageProps": {"pixFilter": "422x750", "appkey": "tu"},
                "label": "请上传最高800K码率，720P清晰度，与主视频比例一致的5s视频贴片",
                "api": "//resource.taobao.com/video/getMaterial?pageSize=20&vf=p&producerSource=1",
                "videoCenterUrl": "/material/mine/video",
                "tips": "请上传最高800K码率、720P清晰度、与主视频比例一致的5s视频贴片",
                "enableNormalVideo": true,
                "enableInteractVideo": true,
                "value": []
            },
            "rules": [{"max": 1, "type": "array", "message": "最多允许1个"}],
            "tips": "请上传最高800K码率、720P清晰度、与主视频比例一致的5s视频贴片"
        }, {
            "component": "InteractContainer",
            "label": "",
            "name": "activity",
            "props": {
                "label": "",
                "value": [{"checked": false, "key": "3", "title": ""}, {"checked": false, "key": "5", "title": ""}]
            },
            "rules": []
        }, {
            "component": "CascaderSelect",
            "label": "本文目标人群",
            "name": "crowdId",
            "props": {
                "canOnlyCheckLeaf": true,
                "hasClear": true,
                "disabled": false,
                "label": "本文目标人群",
                "dataSource": [{
                    "children": [{"label": "中性小分队", "value": "2614"}, {
                        "label": "护肤达人",
                        "value": "2613"
                    }, {"label": "经济适用女", "value": "2109"}, {"label": "品质女郎", "value": "2108"}, {
                        "label": "时尚潮女",
                        "value": "2107"
                    }, {"label": "经济得体男", "value": "2106"}, {"label": "品质型男", "value": "2105"}, {
                        "label": "时尚潮男",
                        "value": "2104"
                    }, {"label": "品位绅士", "value": "2103"}, {"label": "小资主义派", "value": "2089"}, {
                        "label": "重奢一族",
                        "value": "2088"
                    }, {"label": "彩妆达人", "value": "2087"}, {"label": "眼妆控", "value": "2086"}, {
                        "label": "祛斑小能手",
                        "value": "2085"
                    }, {"label": "抗皱星人", "value": "2084"}, {"label": "美甲控", "value": "2083"}, {
                        "label": "黑鼻星人",
                        "value": "2082"
                    }, {"label": "干燥肌", "value": "2080"}, {"label": "混合肌星人", "value": "2075"}, {
                        "label": "美体师",
                        "value": "1968"
                    }, {"label": "黑皮星人", "value": "1307"}, {"label": "熊猫眼星人", "value": "1304"}, {
                        "label": "美容师",
                        "value": "1299"
                    }, {"label": "口红控", "value": "1295"}, {"label": "抗痘战士", "value": "1284"}, {
                        "label": "干皮星人",
                        "value": "1266"
                    }, {"label": "素颜女神", "value": "1265"}, {"label": "油皮星人", "value": "1264"}, {
                        "label": "美发达人",
                        "value": "1263"
                    }, {"label": "欧美妆容控", "value": "1242"}, {"label": "轻奢族", "value": "1230"}, {
                        "label": "医美一族",
                        "value": "1209"
                    }, {"label": "国货党", "value": "1201"}, {"label": "日系美妆控", "value": "1160"}, {
                        "label": "香氛控",
                        "value": "27"
                    }, {"label": "美妆达人", "value": "377"}], "label": "时尚生活", "value": "时尚生活"
                }, {
                    "children": [{"label": "电竞玩家", "value": "2141"}, {
                        "label": "手机壳控",
                        "value": "2135"
                    }, {"label": "智能设备控", "value": "2096"}, {"label": "手机发烧友", "value": "2095"}, {
                        "label": "电脑控",
                        "value": "1308"
                    }, {"label": "趣玩先锋", "value": "1013"}, {"label": "手机重患者", "value": "898"}, {
                        "label": "炫酷极客控",
                        "value": "6"
                    }, {"label": "游戏外设迷", "value": "22"}, {"label": "摄影发烧友", "value": "33"}, {
                        "label": "耳机发烧友",
                        "value": "76"
                    }], "label": "科技兴趣", "value": "科技兴趣"
                }, {
                    "children": [{"label": "健康食族", "value": "2134"}, {
                        "label": "能量超人",
                        "value": "2133"
                    }, {"label": "地道食客", "value": "2132"}, {"label": "美食尝鲜族", "value": "2131"}, {
                        "label": "懒人主厨",
                        "value": "2129"
                    }, {"label": "米其林控", "value": "2128"}, {"label": "下午茶控", "value": "2127"}, {
                        "label": "烧烤达人",
                        "value": "2126"
                    }, {"label": "夜宵党", "value": "2125"}, {"label": "糖果控", "value": "2124"}, {
                        "label": "零食控",
                        "value": "2123"
                    }, {"label": "调味控", "value": "2122"}, {"label": "五谷达人", "value": "2121"}, {
                        "label": "水产控",
                        "value": "2120"
                    }, {"label": "素食主义者", "value": "2119"}, {"label": "糕点控", "value": "2118"}, {
                        "label": "甜品控",
                        "value": "2117"
                    }, {"label": "芒果星人", "value": "2116"}, {"label": "榴莲星人", "value": "2115"}, {
                        "label": "卤味达人",
                        "value": "2114"
                    }, {"label": "奶味控", "value": "2113"}, {"label": "芝麻控", "value": "2112"}, {
                        "label": "果干爱好者",
                        "value": "2043"
                    }, {"label": "畅饮一族", "value": "2042"}, {"label": "坚果控", "value": "2041"}, {
                        "label": "当家主厨",
                        "value": "2040"
                    }, {"label": "巧克力控", "value": "2039"}, {"label": "抹茶控", "value": "2038"}, {
                        "label": "蛋黄控",
                        "value": "2037"
                    }, {"label": "懒人速食族", "value": "2036"}, {"label": "饮茶客", "value": "2035"}, {
                        "label": "火锅控",
                        "value": "2034"
                    }, {"label": "烘焙一族", "value": "2033"}, {"label": "品酒迷", "value": "2032"}, {
                        "label": "水果迷",
                        "value": "2031"
                    }, {"label": "咖啡党", "value": "2030"}, {"label": "奶茶控", "value": "2028"}, {
                        "label": "养生一族",
                        "value": "2027"
                    }, {"label": "美食家", "value": "1319"}, {"label": "奶茶妹妹", "value": "1309"}, {
                        "label": "甜食党",
                        "value": "1261"
                    }, {"label": "轻食人士", "value": "1260"}, {"label": "早餐君", "value": "1182"}, {
                        "label": "吃货的后裔",
                        "value": "1019"
                    }, {"label": "咖啡控", "value": "900"}, {"label": "水果大咖", "value": "636"}, {
                        "label": "品酒大师",
                        "value": "635"
                    }, {"label": "烘焙爱好者", "value": "634"}, {"label": "火锅爱好者", "value": "632"}, {
                        "label": "养生达人",
                        "value": "518"
                    }, {"label": "红酒达人", "value": "517"}, {"label": "吃不胖星人", "value": "494"}, {
                        "label": "茶道中人",
                        "value": "493"
                    }, {"label": "肉食党", "value": "492"}, {"label": "酸味控", "value": "491"}, {
                        "label": "重口味星人",
                        "value": "490"
                    }, {"label": "无辣不欢者", "value": "489"}, {"label": "芝士脑残粉", "value": "399"}],
                    "label": "美食兴趣",
                    "value": "美食兴趣"
                }, {
                    "children": [{"label": "潜水迷", "value": "2137"}, {"label": "街舞达人", "value": "2136"}, {
                        "label": "跳舞控",
                        "value": "2111"
                    }, {"label": "功夫派", "value": "2110"}, {"label": "出游族", "value": "2093"}, {
                        "label": "增肌狂人",
                        "value": "2092"
                    }, {"label": "极限挑战控", "value": "1259"}, {"label": "高尔夫大师", "value": "1251"}, {
                        "label": "飞盘控",
                        "value": "1250"
                    }, {"label": "轮滑爱好者", "value": "1241"}, {"label": "滑板少年", "value": "1240"}, {
                        "label": "棒球小子",
                        "value": "1227"
                    }, {"label": "网球小子", "value": "1214"}, {"label": "乒乓小将", "value": "1176"}, {
                        "label": "滑雪族",
                        "value": "1174"
                    }, {"label": "灵魂冲浪手", "value": "1173"}, {"label": "攀岩主义", "value": "1172"}, {
                        "label": "瑜伽修炼者",
                        "value": "1171"
                    }, {"label": "羽球小子", "value": "1170"}, {"label": "户外运动控", "value": "1164"}, {
                        "label": "水中飞鱼",
                        "value": "1163"
                    }, {"label": "健身狂人", "value": "13"}, {"label": "酷跑一族", "value": "31"}, {
                        "label": "超强灌篮手",
                        "value": "35"
                    }, {"label": "足球爱好者", "value": "36"}, {"label": "登山爱好者", "value": "38"}, {
                        "label": "骑行控",
                        "value": "39"
                    }, {"label": "瘦身星人", "value": "393"}], "label": "运动兴趣", "value": "运动兴趣"
                }, {
                    "children": [{"label": "国潮女子", "value": "2069"}, {
                        "label": "简约女神",
                        "value": "2068"
                    }, {"label": "通勤女王", "value": "2063"}, {"label": "原宿少女", "value": "2059"}, {
                        "label": "摇滚女孩",
                        "value": "2058"
                    }, {"label": "嘻哈女孩", "value": "2057"}, {"label": "英伦女王", "value": "2055"}, {
                        "label": "国风名媛",
                        "value": "2049"
                    }, {"label": "ins达人", "value": "1290"}, {
                        "label": "ulzzang韩风迷",
                        "value": "1289"
                    }, {"label": "chic少女", "value": "1288"}, {"label": "港风男女", "value": "1275"}, {
                        "label": "维秘天使",
                        "value": "1267"
                    }, {"label": "洛丽塔少女", "value": "1248"}, {"label": "国潮达人", "value": "1247"}, {
                        "label": "腔调文青",
                        "value": "1198"
                    }, {"label": "160cm女生", "value": "1197"}, {"label": "民族风", "value": "1157"}, {
                        "label": "欧美御姐",
                        "value": "47"
                    }, {"label": "韩范小妖精", "value": "48"}, {"label": "日系软妹", "value": "49"}, {
                        "label": "气质名媛",
                        "value": "51"
                    }, {"label": "性感女神", "value": "52"}, {"label": "清纯学妹", "value": "55"}, {
                        "label": "清新少女",
                        "value": "56"
                    }, {"label": "设计爱好者", "value": "57"}, {"label": "BF风穿搭控", "value": "61"}, {
                        "label": "街头潮女",
                        "value": "63"
                    }, {"label": "包包控", "value": "66"}, {"label": "复古女郎", "value": "394"}],
                    "label": "女性风格",
                    "value": "女性风格"
                }, {
                    "children": [{"label": "有范青年", "value": "1215"}, {
                        "label": "超级大学生",
                        "value": "1166"
                    }, {"label": "孝顺爸妈党", "value": "1145"}, {"label": "女神范", "value": "1142"}, {
                        "label": "品质男神",
                        "value": "8"
                    }, {"label": "豆蔻少女", "value": "9"}, {"label": "有范大叔", "value": "16"}],
                    "label": "成长周期",
                    "value": "成长周期"
                }, {
                    "children": [{"label": "家务党", "value": "2609"}, {"label": "沐浴家", "value": "2608"}, {
                        "label": "餐厅控",
                        "value": "2607"
                    }, {"label": "原产地党", "value": "2606"}, {"label": "复古星人", "value": "2143"}, {
                        "label": "朋克星人",
                        "value": "2142"
                    }, {"label": "兔儿官", "value": "2138"}, {"label": "小众萌宠官", "value": "2097"}, {
                        "label": "文艺家",
                        "value": "2079"
                    }, {"label": "日式家", "value": "2078"}, {"label": "软装控", "value": "2077"}, {
                        "label": "硬装家",
                        "value": "2076"
                    }, {"label": "园艺控", "value": "2003"}, {"label": "智慧家", "value": "1320"}, {
                        "label": "毛驴党",
                        "value": "1314"
                    }, {"label": "机车骑士", "value": "1313"}, {"label": "古典匠人", "value": "1302"}, {
                        "label": "工业家装控",
                        "value": "1262"
                    }, {"label": "品味家", "value": "1217"}, {"label": "美式家", "value": "1211"}, {
                        "label": "中式家装控",
                        "value": "1210"
                    }, {"label": "北欧家装控", "value": "1208"}, {"label": "喵星人", "value": "1168"}, {
                        "label": "爱车一族",
                        "value": "1161"
                    }, {"label": "改装发烧友", "value": "1144"}, {"label": "水族爱好者", "value": "1141"}, {
                        "label": "汪星人",
                        "value": "1140"
                    }, {"label": "清洁收纳控", "value": "1020"}, {"label": "手工匠人", "value": "1000"}, {
                        "label": "装修家",
                        "value": "930"
                    }, {"label": "囤货小当家", "value": "4"}, {"label": "理想家", "value": "5"}, {
                        "label": "萌宠控",
                        "value": "17"
                    }, {"label": "旅行家", "value": "19"}, {"label": "钓鱼达人", "value": "20"}, {
                        "label": "绿植控",
                        "value": "25"
                    }, {"label": "DIY达人", "value": "28"}, {"label": "雅致居家控", "value": "29"}, {
                        "label": "萌物控",
                        "value": "70"
                    }, {"label": "木作匠人", "value": "380"}, {"label": "杯子控", "value": "381"}, {
                        "label": "盘子控",
                        "value": "387"
                    }, {"label": "多肉控", "value": "398"}], "label": "生活兴趣", "value": "生活兴趣"
                }, {
                    "children": [{"label": "森女风", "value": "2604"}, {"label": "摩登一族", "value": "2603"}, {
                        "label": "生肖迷",
                        "value": "2602"
                    }, {"label": "极简主义", "value": "2601"}, {"label": "抽象派", "value": "2599"}, {
                        "label": "手绘大师",
                        "value": "2596"
                    }, {"label": "长腿一族", "value": "2571"}, {"label": "魔术师", "value": "2555"}, {
                        "label": "动漫迷",
                        "value": "2551"
                    }, {"label": "美甲师", "value": "2540"}, {"label": "美妆达人", "value": "2530"}, {
                        "label": "风水迷",
                        "value": "2460"
                    }, {"label": "实用主义", "value": "2461"}, {"label": "白领小资", "value": "2462"}, {
                        "label": "重奢一族",
                        "value": "2464"
                    }, {"label": "轻奢族", "value": "2466"}, {"label": "舞蹈家", "value": "2452"}, {
                        "label": "露营爱好者",
                        "value": "2454"
                    }, {"label": "马拉松联盟", "value": "2455"}, {"label": "登山爱好者", "value": "2456"}, {
                        "label": "码农们的世界",
                        "value": "2458"
                    }, {"label": "怕冷星人", "value": "2459"}, {"label": "史学爱好者", "value": "2446"}, {
                        "label": "阅读控",
                        "value": "2447"
                    }, {"label": "干皮星人", "value": "2448"}, {"label": "瑜伽达人", "value": "2449"}, {
                        "label": "孝顺爸妈党",
                        "value": "2450"
                    }, {"label": "酷跑一族", "value": "2451"}, {"label": "休闲风", "value": "2435"}, {
                        "label": "公主风",
                        "value": "2436"
                    }, {"label": "家有初中生", "value": "2437"}, {"label": "家有小学生", "value": "2438"}, {
                        "label": "玉石控",
                        "value": "2439"
                    }, {"label": "家有高中生", "value": "2440"}, {"label": "星座迷", "value": "2441"}, {
                        "label": "迪士尼控",
                        "value": "2443"
                    }, {"label": "窈窕淑女", "value": "2427"}, {"label": "法式家装控", "value": "2428"}, {
                        "label": "日韩范儿",
                        "value": "2430"
                    }, {"label": "禅道中人", "value": "2431"}, {"label": "哥特风", "value": "2434"}, {
                        "label": "拼接范儿",
                        "value": "2417"
                    }, {"label": "资深MUJI控", "value": "2418"}, {"label": "热恋情侣", "value": "2419"}, {
                        "label": "通勤女王",
                        "value": "2422"
                    }, {"label": "蕾丝控", "value": "2423"}, {"label": "英伦风", "value": "2424"}, {
                        "label": "毛球穿搭控",
                        "value": "2425"
                    }, {"label": "牛仔控", "value": "2409"}, {"label": "格子控", "value": "2412"}, {
                        "label": "摇滚主义",
                        "value": "2415"
                    }, {"label": "民族风", "value": "2416"}, {"label": "华丽穿搭控", "value": "2392"}, {
                        "label": "朋克星人",
                        "value": "2395"
                    }, {"label": "波西米亚风", "value": "2396"}, {"label": "洛可可风", "value": "2399"}, {
                        "label": "设计爱好者",
                        "value": "2385"
                    }, {"label": "东南亚风", "value": "2389"}, {"label": "成熟风", "value": "2390"}, {
                        "label": "文艺青年",
                        "value": "2391"
                    }, {"label": "萝莉风", "value": "2375"}, {"label": "职场精英", "value": "2377"}, {
                        "label": "网红一族",
                        "value": "2378"
                    }, {"label": "街头潮人", "value": "2379"}, {"label": "雅痞绅士", "value": "2380"}, {
                        "label": "复古中式风",
                        "value": "2381"
                    }, {"label": "原创死忠粉", "value": "2382"}, {"label": "瑞丽风穿搭控", "value": "2366"}, {
                        "label": "美式风",
                        "value": "2367"
                    }, {"label": "百搭教主", "value": "2369"}, {"label": "田园家装控", "value": "2370"}, {
                        "label": "名媛风",
                        "value": "2372"
                    }, {"label": "嘻哈派", "value": "2373"}, {"label": "北欧家装控", "value": "2374"}, {
                        "label": "流苏控",
                        "value": "2360"
                    }, {"label": "甜美风控", "value": "2362"}, {"label": "自然主义", "value": "2363"}, {
                        "label": "破洞党",
                        "value": "2365"
                    }, {"label": "梦幻风", "value": "2349"}, {"label": "正装控", "value": "2350"}, {
                        "label": "国货党",
                        "value": "2351"
                    }, {"label": "学院风", "value": "2353"}, {"label": "清新穿搭控", "value": "2355"}, {
                        "label": "潮牌死忠粉",
                        "value": "2344"
                    }, {"label": "洛丽塔少女", "value": "2345"}, {"label": "商务精英", "value": "2346"}, {
                        "label": "怀旧风",
                        "value": "2347"
                    }, {"label": "浪漫主义", "value": "2348"}, {"label": "宜家控", "value": "2334"}, {
                        "label": "中式家装控",
                        "value": "2335"
                    }, {"label": "沙滩一族", "value": "2336"}, {"label": "日系风", "value": "2337"}, {
                        "label": "后现代家装控",
                        "value": "2339"
                    }, {"label": "宫廷风", "value": "2325"}, {"label": "卡通迷", "value": "2326"}, {
                        "label": "夜店潮人",
                        "value": "2327"
                    }, {"label": "军装控", "value": "2328"}, {"label": "尼泊尔风", "value": "2330"}, {
                        "label": "复古范儿",
                        "value": "2331"
                    }, {"label": "甜心教主", "value": "2315"}, {"label": "新古典派", "value": "2316"}, {
                        "label": "欧美范儿",
                        "value": "2317"
                    }, {"label": "就爱宽松感", "value": "2319"}, {"label": "性感达人", "value": "2320"}, {
                        "label": "蝴蝶结控",
                        "value": "2322"
                    }, {"label": "桃心控", "value": "2309"}, {"label": "地中海家装控", "value": "2311"}, {
                        "label": "家居达人",
                        "value": "2312"
                    }, {"label": "和风控", "value": "2313"}, {"label": "前卫星人", "value": "2314"}, {
                        "label": "国风迷",
                        "value": "2304"
                    }, {"label": "简约风", "value": "2306"}, {"label": "cosplay部落", "value": "2298"}, {
                        "label": "欧式风",
                        "value": "2299"
                    }, {"label": "民国风", "value": "2301"}, {"label": "港风达人", "value": "2302"}, {
                        "label": "文具控",
                        "value": "2297"
                    }, {"label": "手表控", "value": "2296"}, {"label": "轰趴党", "value": "2295"}, {
                        "label": "冲浪手",
                        "value": "2294"
                    }, {"label": "包包控", "value": "2292"}, {"label": "汪星人", "value": "2291"}, {
                        "label": "饰品控",
                        "value": "2289"
                    }, {"label": "就爱这口酸", "value": "2288"}, {"label": "吉他手", "value": "2287"}, {
                        "label": "喵星人",
                        "value": "2286"
                    }, {"label": "美帽达人", "value": "2285"}, {"label": "杯子控", "value": "2283"}, {
                        "label": "机车骑士",
                        "value": "2282"
                    }, {"label": "咖啡控", "value": "2281"}, {"label": "卫衣控", "value": "2280"}, {
                        "label": "手机重患者",
                        "value": "2279"
                    }, {"label": "绘画一族", "value": "2278"}, {"label": "品酒大师", "value": "2277"}, {
                        "label": "滑板少年",
                        "value": "2276"
                    }, {"label": "结婚一族", "value": "2275"}, {"label": "盘子控", "value": "2274"}, {
                        "label": "攀岩勇士",
                        "value": "2272"
                    }, {"label": "天文爱好者", "value": "2271"}, {"label": "高尔夫俱乐部", "value": "2270"}, {
                        "label": "骨灰级AJ迷",
                        "value": "2269"
                    }, {"label": "红酒达人", "value": "2268"}, {"label": "轮滑控", "value": "2267"}, {
                        "label": "漫画君",
                        "value": "2266"
                    }, {"label": "水果大咖", "value": "2265"}, {"label": "极限挑战控", "value": "2264"}, {
                        "label": "网球控",
                        "value": "2263"
                    }, {"label": "美体师", "value": "2262"}, {"label": "火锅爱好者", "value": "2261"}, {
                        "label": "游泳健将",
                        "value": "2260"
                    }, {"label": "棒球小将", "value": "2259"}, {"label": "甜食党", "value": "2257"}, {
                        "label": "口红控",
                        "value": "2255"
                    }, {"label": "羽球达人", "value": "2256"}, {"label": "家有小公主", "value": "2246"}, {
                        "label": "加班一族",
                        "value": "2247"
                    }, {"label": "单身狗联盟", "value": "2248"}, {"label": "新生儿", "value": "2249"}, {
                        "label": "元气少女",
                        "value": "2250"
                    }, {"label": "乒乓健将", "value": "2251"}, {"label": "厨艺大师", "value": "2252"}, {
                        "label": "上班族",
                        "value": "2235"
                    }, {"label": "备孕妈咪", "value": "2236"}, {"label": "早教那些事", "value": "2237"}, {
                        "label": "超级大学生",
                        "value": "2238"
                    }, {"label": "恋爱ing", "value": "2239"}, {"label": "装修家", "value": "2240"}, {
                        "label": "月子女王",
                        "value": "2241"
                    }, {"label": "好孕妈咪", "value": "2242"}, {"label": "滑雪族", "value": "2243"}, {
                        "label": "香氛控",
                        "value": "2226"
                    }, {"label": "足球迷", "value": "2227"}, {"label": "萌系萌物控", "value": "2228"}, {
                        "label": "文人墨客",
                        "value": "2230"
                    }, {"label": "骑行控", "value": "2231"}, {"label": "模型控", "value": "2232"}, {
                        "label": "超强灌篮手",
                        "value": "2233"
                    }, {"label": "大叔范儿", "value": "2234"}, {"label": "爱车一族", "value": "2218"}, {
                        "label": "户外运动控",
                        "value": "2219"
                    }, {"label": "游戏外设迷", "value": "2220"}, {"label": "摄影发烧友", "value": "2221"}, {
                        "label": "绿植控",
                        "value": "2223"
                    }, {"label": "耳机发烧友", "value": "2224"}, {"label": "原宿潮人", "value": "2213"}, {
                        "label": "豹纹女王",
                        "value": "2214"
                    }, {"label": "萌宠养成记", "value": "2217"}, {"label": "条纹控", "value": "2206"}, {
                        "label": "粉色少女",
                        "value": "2207"
                    }, {"label": "气质小仙女", "value": "2208"}, {"label": "波点控", "value": "2199"}, {
                        "label": "帅气BF风",
                        "value": "2196"
                    }, {"label": "国潮达人", "value": "2195"}, {"label": "ins达人", "value": "2194"}, {
                        "label": "chic少女",
                        "value": "2193"
                    }, {"label": "中国风", "value": "2192"}, {
                        "label": "Blingbling控",
                        "value": "2183"
                    }, {"label": "ulzzang风", "value": "2184"}, {"label": "撞色控", "value": "2186"}, {
                        "label": "大码星人",
                        "value": "2187"
                    }, {"label": "黑白配", "value": "2188"}, {"label": "嘻哈一族", "value": "2189"}, {
                        "label": "水族爱好者",
                        "value": "2175"
                    }, {"label": "健身狂人", "value": "2176"}, {"label": "重口味星人", "value": "2177"}, {
                        "label": "茶道中人",
                        "value": "2178"
                    }, {"label": "音乐发烧友", "value": "2179"}, {"label": "芝士脑残粉", "value": "2180"}, {
                        "label": "多肉君",
                        "value": "2181"
                    }, {"label": "炫酷极客控", "value": "2167"}, {"label": "手工爱好者", "value": "2168"}, {
                        "label": "旅行家",
                        "value": "2169"
                    }, {"label": "烘焙达人", "value": "2170"}, {"label": "囤货小当家", "value": "2171"}, {
                        "label": "汽车改装党",
                        "value": "2172"
                    }, {"label": "无辣不欢者", "value": "2173"}, {"label": "资深吃货", "value": "2174"}, {
                        "label": "二次元达人",
                        "value": "2160"
                    }, {"label": "养生达人", "value": "2161"}, {"label": "追星族", "value": "2162"}, {
                        "label": "文玩控",
                        "value": "2163"
                    }, {"label": "清洁收纳控", "value": "2164"}, {"label": "钓鱼达人", "value": "2165"}, {
                        "label": "无肉不欢",
                        "value": "2166"
                    }], "label": "其他", "value": "其他"
                }, {
                    "children": [{"label": "家有小正太", "value": "2244"}, {
                        "label": "小学生男宝家长",
                        "value": "2091"
                    }, {"label": "小学生女宝家长", "value": "2090"}, {"label": "幼儿家长", "value": "2072"}, {
                        "label": "1岁宝宝爸妈",
                        "value": "2071"
                    }, {"label": "新生儿父母", "value": "2070"}, {"label": "学前女宝家长", "value": "2024"}, {
                        "label": "学前男宝家长",
                        "value": "2023"
                    }, {"label": "幼儿女宝家长", "value": "2022"}, {"label": "幼儿男宝爸妈", "value": "2021"}, {
                        "label": "1岁女宝家长",
                        "value": "2020"
                    }, {"label": "1岁男宝家长", "value": "2019"}, {"label": "半岁女宝", "value": "2018"}, {
                        "label": "半岁男宝",
                        "value": "2017"
                    }, {"label": "初生男宝家长", "value": "2016"}, {"label": "初生男宝家长", "value": "2015"}, {
                        "label": "小小摄影师",
                        "value": "1294"
                    }, {"label": "备孕妈咪", "value": "1293"}, {"label": "早教专家", "value": "1292"}, {
                        "label": "宝宝医生族",
                        "value": "1283"
                    }, {"label": "小小钢琴家", "value": "1282"}, {"label": "新生萌宝", "value": "1281"}, {
                        "label": "亲子控",
                        "value": "1280"
                    }, {"label": "独立小萌宝", "value": "1279"}, {"label": "宝宝护理师", "value": "1257"}, {
                        "label": "小小工程师",
                        "value": "1246"
                    }, {"label": "小小画家", "value": "1244"}, {"label": "小小舞者", "value": "1239"}, {
                        "label": "宝宝出游控",
                        "value": "1238"
                    }, {"label": "小小赛车手", "value": "1237"}, {"label": "天才科学家", "value": "1236"}, {
                        "label": "小小运动员",
                        "value": "1235"
                    }, {"label": "小小二次元", "value": "1233"}, {"label": "小小军事迷", "value": "1225"}, {
                        "label": "迪士尼控",
                        "value": "1223"
                    }, {"label": "芭比收藏家", "value": "1222"}, {"label": "二胎父母", "value": "1221"}, {
                        "label": "职场辣妈",
                        "value": "1220"
                    }, {"label": "月子女王", "value": "1218"}, {"label": "宝宝营养师", "value": "1216"}, {
                        "label": "小学生家长",
                        "value": "1207"
                    }, {"label": "学前男宝", "value": "1206"}, {"label": "小小厨师", "value": "1205"}, {
                        "label": "海派妈咪",
                        "value": "1203"
                    }, {"label": "宝宝公主控", "value": "1200"}, {"label": "小正太", "value": "1199"}, {
                        "label": "宝宝贵族控",
                        "value": "1196"
                    }, {"label": "好孕妈咪", "value": "873"}, {"label": "宝爸宝妈", "value": "871"}],
                    "label": "母婴",
                    "value": "母婴"
                }, {
                    "children": [{"label": "红火团圆年", "value": "1322"}, {
                        "label": "囤精品年货",
                        "value": "1321"
                    }, {"label": "超级买手", "value": "1204"}, {"label": "抗霾卫士", "value": "1181"}, {
                        "label": "月光族",
                        "value": "1180"
                    }, {"label": "温暖小贴士", "value": "1155"}], "label": "营销", "value": "营销"
                }, {
                    "children": [{"label": "办公室午休党", "value": "2445"}, {
                        "label": "中医爱好者",
                        "value": "2254"
                    }, {"label": "送礼星人", "value": "2130"}, {"label": "冻龄女神", "value": "2008"}, {
                        "label": "网红一族",
                        "value": "2005"
                    }, {"label": "彩虹糖Pride", "value": "1984"}, {"label": "医护天使", "value": "1311"}, {
                        "label": "占卜师",
                        "value": "1310"
                    }, {"label": "陶艺大师", "value": "1306"}, {"label": "彩绘师", "value": "1305"}, {
                        "label": "速记师",
                        "value": "1303"
                    }, {"label": "家庭煮妇", "value": "1272"}, {"label": "厨艺达人", "value": "1256"}, {
                        "label": "办公白领",
                        "value": "1255"
                    }, {"label": "大脸星人", "value": "1245"}, {"label": "职场白骨精", "value": "1229"}, {
                        "label": "华尔街精英",
                        "value": "1228"
                    }, {"label": "时髦阿姨", "value": "1212"}, {"label": "华丽上班族", "value": "1185"}, {
                        "label": "怕冷星人",
                        "value": "1184"
                    }, {"label": "结婚新人", "value": "1165"}, {"label": "好想谈恋爱", "value": "1151"}, {
                        "label": "高富帅",
                        "value": "1150"
                    }, {"label": "白富美", "value": "1149"}, {"label": "SVIP壕", "value": "1147"}, {
                        "label": "租房一族",
                        "value": "1022"
                    }, {"label": "追星族", "value": "908"}, {"label": "太平公主", "value": "897"}, {
                        "label": "我就是大",
                        "value": "895"
                    }, {"label": "痛经忍者", "value": "877"}, {"label": "晚睡强迫症", "value": "876"}, {
                        "label": "宅男宅女",
                        "value": "875"
                    }, {"label": "拼命十三郎", "value": "874"}, {"label": "新时代主妇", "value": "1"}, {
                        "label": "IT人士",
                        "value": "391"
                    }], "label": "趣味身份", "value": "趣味身份"
                }, {
                    "children": [{"label": "摆件控", "value": "1301"}, {"label": "黏土人", "value": "1300"}, {
                        "label": "制服党",
                        "value": "1258"
                    }, {"label": "模型控", "value": "24"}, {"label": "赖床专业户", "value": "378"}],
                    "label": "其它兴趣",
                    "value": "其它兴趣"
                }, {
                    "children": [{"label": "小众冷门控", "value": "2420"}, {
                        "label": "奢华主义派",
                        "value": "2102"
                    }, {"label": "简约主义派", "value": "2067"}, {"label": "国潮型男", "value": "2066"}, {
                        "label": "商务型男",
                        "value": "2064"
                    }, {"label": "嘻哈潮男", "value": "2056"}, {"label": "街头少年", "value": "2052"}, {
                        "label": "复古男神",
                        "value": "2046"
                    }, {"label": "宝宝游乐控", "value": "1291"}, {"label": "波点控", "value": "1287"}, {
                        "label": "嘻哈一族",
                        "value": "1286"
                    }, {"label": "硬汉军旅风", "value": "1285"}, {"label": "原宿少年", "value": "1278"}, {
                        "label": "英伦潮男",
                        "value": "1277"
                    }, {"label": "不撞衫星人", "value": "1276"}, {"label": "摇滚青年", "value": "1271"}, {
                        "label": "历史狂享家",
                        "value": "1224"
                    }, {"label": "大码界男神", "value": "1183"}, {"label": "潮鞋宠儿", "value": "1159"}, {
                        "label": "敏感肌宝宝",
                        "value": "899"
                    }, {"label": "单身小汪", "value": "12"}, {"label": "欧美型男", "value": "72"}, {
                        "label": "时尚潮男",
                        "value": "80"
                    }, {"label": "国风男子", "value": "395"}, {"label": "清新暖男", "value": "396"}, {
                        "label": "韩范欧巴",
                        "value": "397"
                    }], "label": "男性风格", "value": "男性风格"
                }, {
                    "children": [{"label": "手账控", "value": "2140"}, {
                        "label": "女装大佬",
                        "value": "2139"
                    }, {"label": "二次元硬核玩家", "value": "2101"}, {"label": "仙气古风", "value": "2100"}, {
                        "label": "美美Lolita",
                        "value": "2099"
                    }, {"label": "御宅族", "value": "2098"}, {"label": "中医世家", "value": "1316"}, {
                        "label": "整蛊王",
                        "value": "1315"
                    }, {"label": "ps大师", "value": "1312"}, {"label": "漫画迷", "value": "1226"}, {
                        "label": "哲学家",
                        "value": "1219"
                    }, {"label": "意气书生", "value": "1179"}, {"label": "棋牌爱好者", "value": "1175"}, {
                        "label": "天文爱好者",
                        "value": "1169"
                    }, {"label": "爱乐迷", "value": "1017"}, {"label": "COS巨巨", "value": "896"}, {
                        "label": "Party党",
                        "value": "775"
                    }, {"label": "二次元达人", "value": "14"}, {"label": "绘画一族", "value": "21"}, {
                        "label": "挥毫泼墨派",
                        "value": "34"
                    }, {"label": "集邮达人", "value": "37"}, {"label": "吉他控", "value": "40"}, {
                        "label": "文具控",
                        "value": "78"
                    }, {"label": "文玩控", "value": "385"}], "label": "文娱兴趣", "value": "文娱兴趣"
                }, {
                    "children": [{"label": "铆钉控", "value": "2062"}, {"label": "破洞控", "value": "2061"}, {
                        "label": "海派甜心",
                        "value": "1317"
                    }, {"label": "Bling控", "value": "1296"}, {"label": "黑白控", "value": "1274"}, {
                        "label": "粉红少女",
                        "value": "1273"
                    }, {"label": "牛仔迷", "value": "1270"}, {"label": "撞色控", "value": "1269"}, {
                        "label": "极简控",
                        "value": "1268"
                    }, {"label": "格子控", "value": "1254"}, {"label": "条纹控", "value": "1253"}, {
                        "label": "流苏控",
                        "value": "1252"
                    }, {"label": "卫衣控", "value": "1249"}, {"label": "宽松女神", "value": "1162"}, {
                        "label": "美鞋控",
                        "value": "1158"
                    }, {"label": "豹纹女王", "value": "927"}, {"label": "蕾丝控", "value": "914"}, {
                        "label": "限量版星人",
                        "value": "776"
                    }, {"label": "美帽达人", "value": "67"}, {"label": "手表控", "value": "75"}, {
                        "label": "旗袍女子",
                        "value": "384"
                    }, {"label": "饰品控", "value": "388"}, {"label": "裙控MM", "value": "389"}],
                    "label": "元素偏好",
                    "value": "元素偏好"
                }],
                "tips": "围绕匹配的人群进行创作，可得到更多曝光~, 点击<a target=\"_blank\" href=\"https://we.taobao.com/creative/group\">#查看人群说明与热点#</a>",
                "value": "1288"
            },
            "rules": [{"type": "string"}],
            "tips": "围绕匹配的人群进行创作，可得到更多曝光~, 点击<a target=\"_blank\" href=\"https://we.taobao.com/creative/group\">#查看人群说明与热点#</a>"
        }, {
            "component": "TagPicker",
            "label": "视频分类",
            "name": "classification",
            "props": {
                "showTabs": true,
                "label": "视频分类",
                "dataSource": {
                    "匹配时间": [{"parent": "匹配时间", "label": "春", "value": "102005:23009"}, {
                        "parent": "匹配时间",
                        "label": "夏",
                        "value": "102005:12009"
                    }, {"parent": "匹配时间", "label": "秋", "value": "102005:12010"}, {
                        "parent": "匹配时间",
                        "label": "冬",
                        "value": "102005:12011"
                    }, {"parent": "匹配时间", "label": "特殊节假日", "value": "102005:270003"}, {
                        "parent": "匹配时间",
                        "label": "长期",
                        "value": "102005:321005"
                    }],
                    "领域(必选1个）": [{"parent": "领域(必选1个）", "label": "美食", "value": "31041:31028"}, {
                        "parent": "领域(必选1个）",
                        "label": "服饰",
                        "value": "31041:42024"
                    }, {"parent": "领域(必选1个）", "label": "旅行", "value": "31041:23013"}, {
                        "parent": "领域(必选1个）",
                        "label": "彩妆",
                        "value": "31041:73036"
                    }, {"parent": "领域(必选1个）", "label": "烘培", "value": "31041:266019"}, {
                        "parent": "领域(必选1个）",
                        "label": "试吃",
                        "value": "31041:81131"
                    }, {"parent": "领域(必选1个）", "label": "萌宠", "value": "31041:31031"}, {
                        "parent": "领域(必选1个）",
                        "label": "二次元",
                        "value": "31041:31025"
                    }, {"parent": "领域(必选1个）", "label": "汽车", "value": "31041:37016"}, {
                        "parent": "领域(必选1个）",
                        "label": "护肤",
                        "value": "31041:77031"
                    }, {"parent": "领域(必选1个）", "label": "美甲", "value": "31041:315017"}, {
                        "parent": "领域(必选1个）",
                        "label": "美发",
                        "value": "31041:315018"
                    }, {"parent": "领域(必选1个）", "label": "运动", "value": "31041:31029"}, {
                        "parent": "领域(必选1个）",
                        "label": "生活",
                        "value": "31041:31030"
                    }, {"parent": "领域(必选1个）", "label": "栽培", "value": "31041:315020"}, {
                        "parent": "领域(必选1个）",
                        "label": "数码",
                        "value": "31041:23001"
                    }, {"parent": "领域(必选1个）", "label": "电器", "value": "31041:81001"}, {
                        "parent": "领域(必选1个）",
                        "label": "健康",
                        "value": "31041:41019"
                    }, {"parent": "领域(必选1个）", "label": "家居", "value": "31041:48023"}, {
                        "parent": "领域(必选1个）",
                        "label": "游戏",
                        "value": "31041:41015"
                    }, {"parent": "领域(必选1个）", "label": "母婴", "value": "31041:23010"}, {
                        "parent": "领域(必选1个）",
                        "label": "玩具模玩",
                        "value": "31041:266025"
                    }, {"parent": "领域(必选1个）", "label": "3C配件", "value": "31041:315023"}],
                    "类型(必选1个)": [{"parent": "类型(必选1个)", "label": "纪实", "value": "31039:42017"}, {
                        "parent": "类型(必选1个)",
                        "label": "单品测评",
                        "value": "31039:321001"
                    }, {"parent": "类型(必选1个)", "label": "多品测评", "value": "31039:274004"}, {
                        "parent": "类型(必选1个)",
                        "label": "开箱体验",
                        "value": "31039:274003"
                    }, {"parent": "类型(必选1个)", "label": "广告", "value": "31039:42016"}, {
                        "parent": "类型(必选1个)",
                        "label": "达人故事",
                        "value": "31039:121006"
                    }, {"parent": "类型(必选1个)", "label": "情景剧场", "value": "31039:319003"}, {
                        "parent": "类型(必选1个)",
                        "label": "影视片段",
                        "value": "31039:321002"
                    }, {"parent": "类型(必选1个)", "label": "主题清单", "value": "31039:319004"}, {
                        "parent": "类型(必选1个)",
                        "label": "街头采访",
                        "value": "31039:321003"
                    }, {"parent": "类型(必选1个)", "label": "知识百科", "value": "31039:42013"}, {
                        "parent": "类型(必选1个)",
                        "label": "秀场展示",
                        "value": "31039:311038"
                    }, {"parent": "类型(必选1个)", "label": "资讯", "value": "31039:17001"}, {
                        "parent": "类型(必选1个)",
                        "label": "教程",
                        "value": "31039:48038"
                    }, {"parent": "类型(必选1个)", "label": "明星", "value": "31039:31026"}, {
                        "parent": "类型(必选1个)",
                        "label": "店铺",
                        "value": "31039:145001"
                    }, {"parent": "类型(必选1个)", "label": "多品混剪", "value": "31039:313037"}, {
                        "parent": "类型(必选1个)",
                        "label": "单品展示",
                        "value": "31039:58001"
                    }, {"parent": "类型(必选1个)", "label": "探店", "value": "31039:331010"}],
                    "人群(必选1个)": [{"parent": "人群(必选1个)", "label": "女性", "value": "42030:42028"}, {
                        "parent": "人群(必选1个)",
                        "label": "男性",
                        "value": "42030:31036"
                    }, {"parent": "人群(必选1个)", "label": "宠物党", "value": "42030:319007"}, {
                        "parent": "人群(必选1个)",
                        "label": "育儿党",
                        "value": "42030:321006"
                    }, {"parent": "人群(必选1个)", "label": "装修党", "value": "42030:270004"}, {
                        "parent": "人群(必选1个)",
                        "label": "有车党",
                        "value": "42030:321007"
                    }, {"parent": "人群(必选1个)", "label": "通用", "value": "42030:270005"}]
                },
                "tips": "视频分类规则",
                "value": ["42030:42028", "31041:42024", "102005:321005", "31039:319004"]
            },
            "rules": [],
            "tips": "视频分类规则"
        }, {
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
                "value": false
            },
            "rules": []
        }, {
            "className": "creator-none",
            "component": "DateTime",
            "label": "定时发布",
            "name": "scheduledPublishTime",
            "props": {"className": "creator-none", "until": 1554449335228, "label": "定时发布", "value": ""},
            "rules": []
        }, {
            "component": "Toast",
            "label": "",
            "name": "__draftToast_220559722270",
            "props": {
                "timestamp": "1551857335233",
                "label": "",
                "type": "error",
                "value": "部分字段校验不通过，请检查当前发布页面的提示后再进行操作"
            },
            "rules": []
        }, {
            "className": "creator-none",
            "component": "Checkbox",
            "label": "参加“微淘优质内容奖励”",
            "name": "publicInvent",
            "props": {
                "style": {"display": "none"},
                "className": "creator-none",
                "label": "参加“微淘优质内容奖励”",
                "value": true
            },
            "rules": []
        }],
        "dynamicFormVersion": "0.1.16",
        "formData": {
            "template": "video2",
            "owner": "undefined",
            "formName": "",
            "activityName": "",
            "source": "creator",
            "userRole": "daren",
            "publishToolbar": "[{\"text\":\"发布新微淘\"},{\"text\":\"短视频(新)\"}]",
            "serverData": "CJwfFxcXFxcXF8pqbmRM0IL4QGY+JF7r3YVnFmdEmoSlojONT6E1xglwtQMcMzYedIV3F8eF9eU8eTcWOTc+ZjCv+LMflSwfB/NgjlbI8jhokmCtOF9G/0hUA4Reg/BFCw7g467KsFiI6uPq9l1Cwvioqer3GBg8CMvq5SBCNnhqdIow86pl9N3gqU24yG7yhBWfd3QqKuMvIrojZ7ox9+KTa+mRvBrJcMD9KqmRfE3+oiUgKmOCwOv5vvAo6PsCH3kpa2ew5bzIyumFkYGDg4FtysKiwsKNwDKJKeEQ/XhuCOwNawsAluvn/50w77W28aRRyLQ8IP+ojRVi44BQQLlIuH57vakB5e+8Kul8Iunt/BX5zWgS6hqouR1CQJLryG4MvSlq/AqYuevv3rQ8wlq2h6g2X3/p38aIdbkY7gz6wCutxcdDULju0+nmqTD3vvD3KOuP6PIMeDdf5GwMQyqkd0RiqjhzWLoh924L7UPsboLvXIK44USwxEZFRUbxYy3cCyg4KeTQqZfgWdfIB+Uhw2n0vuTCHYWcoCnhwxKqdQkaiW24716rVuvDD+cgbRQ2iCB/OCIPbUbwouhN/BzFIaingPV4t0ho83gdboiQ03iuhF6hJn3hUZqCBJb8bEjHQEpwqDYDf/UUKW5YJSmt5TgW+HQW5jjA5azmUNCIuQaZfPA26BHzqSMq+rKKMLCaAcWEn/82jcPFaJ5q7/OqX9vtEU+9+oCuW4AppX+Jm6WpWuywiJnRIpCmzu7mKDb2DBTJ+GrJcNP+aFCZ2KjjuPJufLnKS5m/n+kw7Y5BzF8UDFVwRZMciGTMSOTDQEAM5+WO6YYYb1vFpj73KhQYK95Y3AwfyxwpBu/6Aog6MajLxECJ6lkl5Y4wRxwA/nr3a2/sLgY1j8iuxA7OmD3qmqkN27Gaic1NSNSE2OrTAeL1WjL1CsKJjfiJE+taGqL10IjKY8itavCZb+PbQAxtPWnCC5loovAIf70sTHH/UnTp+5MVk02bHm/oy1OM3YZmlWVZtK5tic+X+zPbccBoLf12CnaBL9uybdqhezmCIUHEbmlQL/xqa7JNFjlqr4R6m09UMDuq0wHBm/6aWCklgE3jukHsICrJ24UUk0s8kc3ki7RhL500sKjf3wDRLmWQNKiUYol9eEppsO7Jwm59q1jqYqLJl+/GyysnmEim57XJoVSPz/G2pgrasjHa2kp0q8rLizO985lR2soCdGeNYrrHmCGG42+DUkFk/o/JwNhtLOKeXgGZpYAq4WcBycZgQemwrsLLS6P2TqXUi0xwTFTRVY3SQM9mVSgPotZP+LsG+jN3JtSHOINwauRzm/MHus5PiLb+iohMOcSLLJvPbGhR1yxIKu+Y2AnLPT2g6WkwMagZZ0l9/SvW94CwZ9WR5hC57Q0NjFVADOtAvOoWzYqYyenqGqGomcLijll8eeOqL8tqThlgqIzUPDna9wIFaMxcRGYu5gvmhMLOdKSs7L1BVng1YSkgO/N8Gx3vaORrA7Wq4JEp6lJCYoqw9qxIa+ODY8+wqG8NHSIReEuoSfy4Hkm0mnjjq6fa1y1IorDNROLbTOKznhvA/OGo/upoZiju0rj7BHOonmKb8qVmqrCEChrqzGLYuOOJvwZJcYaepEjilBv8jaa2rkddYaeScu1UMNpNCKKYBIoyanWA6I+Npk1JToqKUW2QuHG+wp9ipUBcKHKw0419jVUY5HMo9G016QDJkTBVnZ06b/0eafY0Ou1MSFQ/2CB4irusSMnoreUULkDWse1tWPcSK07iWmKjkHVtbsmox06sx66lGFRetl8pBLcymbyNzIZcuvLOfXeDD+DKMNfqyR84McIc76rT1jVeVVCve1PTT+HWNWz4xrSRSH0IpMk24b2SGIpKMDHCdDxxeKjGyHYbeepjI9Z2iwik/6XJAemI8QFhb9URrZu6G4z9sTZtSIhuhduyJUuQHw8qJVvoIaxN5HRKCIyM+u1JIJrCRHZtAOrSjw8iTRgch89Y5JjRzB6wahvj6j/8/N2odb+Usd0mnIrkKBzx8sMsrkqH7HjR+bBbYR55cATQs+NPJdohRDOZmsBcuyh1+N8SGFWiqAGIldCprYcg55cMuqDoy/P2a+VQJYFdeEMf550MTf60PHWJFedBRPcc9SiVPWJnfNFM/Bxq1Ir4uFh6+W1tbNfwvqxZcNdsSi/xFQTOeWD8nnj4xBPl+HnjKqg0p52GcjKZ8HmwxBF5e+vZfIyotrFELCzo6cjnZD7Rg7xZtTAH56s/dWCOiiyzYi8W9EaaGVr23iwgySlvko1QfwEBeSYEvuvvoBhNOcKCLI0mgCy7rpbrlWtugJOhzcgDv+aJYFwTgrmEHa6AMMm4DP5CGGpo5mn9Y+vr7NCIIemL4bqhvtEMbz8RaL3yLpnRyjM0yAxvMOrY4wIKCWxt7fF3+a+M/FDNempy2p9R/zflCiDBkP4o7+YGPCdhcOPeablKX6Iz7K9WpwghWC2KGdAqac9R4V72QRO4fZlt5j3Mh+jFCL/gw2p0WPeD7PpQYO6bKiK25BjILUOIwsFpZCHkaKsN9rDwed/cClhnk382qfhqtgBgrg7yL3QNsBRmKmhIGqr1nijn9RxIJ1Pp5/iMq0tSztjJ0th4R7wPxf5XC37MHqE7oyCeWXkyIAP4igRuWdBMzGfEQZajDGviCN9xH4G5xYl8QiLp+OTt74pMNZwN7Ui2ky8s/AilR8Z5fzvOdVrZhkVHC/skUtYYfC1RPOoo46jR8MsILApt8b2GHcLQhfAIqubBk0E4Z4vZ5lOqj+3oOUQ3vUmPXj2JfLKA8AVFUeijS9Wy72ylHjrgiIBaOd8BWOriyewjCkVXFugMGmQmtL+fOuOgopPZJAmnkzmzNcmMeMmPEuZx5QvcCpnIDiQ68wgFHIMuCuB6ETegjaRTPWFxC4tNBtpxMJgVghP6iNrKSiVOKEvMsHeG83erol/t+OBM8+hgIVgn836/4hN9eGXmPj8bGd3oGTypOq+NDfzric3dxDorgkoLs/cyaOSHW7e5UXy7LBrei1r8a+uyT0PxqwPqPBUk+DJA5C6QqCCgi73F9UtFD5pvzIbZCIeM6ZGHkNl49xQuHzaJh69ijYeu7+Xj73wJmdmrNUjKf8wnTRj6Em79jauY2bUmcCvcMWGa2wf8LqPVqtMV4R9q74fiGI8wBPF7mNpIi4LtIc7mH5wzEvibZGkGFuIVbUHJ6UGZXOuUz7QtV9XzNuY6GWU8P3+au6fjX9alKSzYfgjdxflu/LwCUTGa5s+dPOglh50q0CM0JPO3DkalrdHO138W0ItIdUYj8GbrYwOmjbRt4H05bHUbuafpz07l3ctLxczVwfsJgFlhofLLVzTEidz76GMDOo/Srjv00lnhFFi62OiMl6i+5lTOo9Gx98TdZESt/4aZuk/aOnPVDNAccVwAsHtxw1s7hxp6KAXT7bfOojH3aEFsAPBxfCsaSCLDqq/uw0zkygBJ2PQgMdtEWOdxisAEb+Qcd6i1VubVZ5M6CzAF7VtwOYoxbZ0OXpDy697PcN5mdGdNyNoDJ7Pj/yvqaW/MLs3HjG4bnFItu8b+FSvZRfojGmL5qkoccfyVbmtbxIP2SgWrhv7E4HVBZDwofJwsklQjUJIjk1DFYC6nwgGE9tzyPp7i/c4T00ixjwX+m0vhgiZvNxg+Qlp+vQzVgL+wE/ZyvQXpS6HA35PO660bOESCodvL9Obqy3ZDyCo5C/U/gL59YuGl0i6lzuKGKQ5JsT3cuaWyGavGmWVXwu8G1vymcg5PsbCmL7YYGOdCo3Lif6ArE4ejfNMPyMVQsPZrc4UN0CZ0ZwzZULGwgg6nmSU981mOL5DMUfC1zs00FCzzjggL5+tTfJgVaI6rT40rJjBcUh2Xop1FbrB/5dFvFTXAS5/oLK2biWLNOMIHX1tJkDfY0E4W2XjIq4aJhD5Y129MUFHi37/b7o0Eezywq32m2UXXfqwkwUuLM5SmLzLUlO57CAHWmD7EIBeYHtbci7GoSfFUgS1vCh83hkxxISSMtoQ8CEza/oWOmuJzL+S3dLkuhqeK342s3DsrORR8V7s6DSwObOl35U2+Kwh8fltYWZd0H+9F95KzY4Jm5ygCGU8Jx6yNTm/Ay4g4DzcqRf1XdGfYT4gldbw7pjieSSC3VqNMmLDO6xlPhPEVGyKBMTZwMZnOVTCFUQIl2PFIxiB3ozqkKU4tlXRTvCfMENeJr5fVM43n4pE0wXc2ZdoWY68qCEU3bfyrzgs5D0VJNqjWf0qg1RDtQxxcF1YXQYtd/oYpoSdbYyVYM4I+iB5qt4pyoEMzZd58J4xgncejuwOmwGbbjYjR+0LvX95Ju3KGshgfD79K2jLcBPUCvKTYyxgUWraWYqZvhZBdfyWeLg5JMUtp8d5efCwZsBMvqeQyWpGbGgFMhveKpV8moWFPb0iIDVYw0z4kXDnC2m00cdgpkxBltXrOf0SPtzNkcgU60051WAFmExsZxdmnKQKQJIYg3I3P8CyclxYQMczPF4MNl6hk/lYkbrdNNM+083k5qhuG3CWO/NPufsxtg9ikRMTXifkb5u8c17iWxCgPMJQBFdysfmGq8xOQsYaxFkamo3zRoULn5ZGlyRI1rJWF19Z2nOydehWFxvuNo8UOHxtzwUOLTDiGOqGPEnNgr5bgIwOhAQQdtAqPHXtlC2S4FH8lUQFxdQiIfJAMjwEQczBjpDmz2go5jnDjuVRrvwo5t4QxrbpbLBOBbtGBX0HkI4G8GYDbIVNRjRsHhRm3pJqBYnwnGzAUO9ehRrRqW6ZQX3WofabVOJaBZBdmWvCNIQMVlBpqLtuRcZa3ZDdUZmZIpixXU6Rn0Q+LQbsGjGVVMgJNQ7NJlx49cdWBGf6Ye6kXTiMPAN1AIU5cco2H5ttySi2a6xx3uP00vMFVKPyIh5tM8xHhoIbm26TX6iZkaUehstd10gnec7hnl66f2vBuhYDUkjEDd2aMpi+v87CCNTEAa7wFULKfxNKmR5gXEwVrFJJ4HkUL/i5pIyev23JTaUaaKhuilqwVT0Aq7HM68kUMHwuf4ME/8yNgkqtDPIuVbdRKNiQymNLj2mRnK2bTgSTx5isYu6mJhF74EeYJRVrT5cs+X2MMzJJWfIDnzBw6SeSziGK6V5xAbbOjb+J7iw8AnzsaX2VkYdObWz6jJPdm5HeQ97bVEuWnfI06u5Tvj7EWbs+O8Ukfh3iXJs/Lg87NdGOgtW8Zdxnlk7umaapwV5ibNbioE9P8wVBOZYfxGBgjGhZ7IihyW3fr5W3ae1XYG78ZJE6s19/bG/+EMDsu1xlgcm/Xo+Q4mukhCUnJ/4D3hsHfGb/2lr6BLGuOLGvS9oQKha85FLF0cdeNTxSWBrobHqwqfLSCYnv8bHxln4WRFyhup456uM1hohsYa6aWb/k/jCxeD7pQdxyjJW4cm/S7hVNNDs+V3xbgvdL2kgYMB/YwQDWiVqtzegre5/c7ozuN/mJvAZfSe5IY25QWf14XnJHrd2GDIU1tm9qTqx5Xvo7sLFMIAkAUlnWbcs/BgWUXn6G5Go+kKiU6lhZ7mzkGcrebYB62RT9ozvWZyat72tDjjlXFXJjDBpCeu4ochk7T/j8SpFsjDP4yDzYyb1eX8WbBqtf2dGV/HeZQmxtWNiLz45sUHylqt0TYm5zuuN3n1yEK2qdABgIrRy7KTK60MtLrXJcULoYypaTpSaFBfwOFjDPYyMAHQ5OUlkl4vezcSCsaWLv+Qm2QuyQiMMf7o+Qih4sTGqV0vlpVehsJN2+Dbd/7Ddy0e5bw0HKUDu91rASuQ4HaGT2x8xEsMS9DVjMgz6bnt457xJAsut6AhVMVxlC6w0ZE2CBvpyeyXvd3Et4WBVFTMx4PZ1gpaWgr3IEcWACPLvq8zjTT4sWnpkp/kBfFzwZhJKw+7FWXwuPzN1hcNcET8RbeGKpqDQnjBXels9VRbYR6O94kFpCTQB0ZMDYcgxc8OWZ7MXFCVQBH6uQsi5BAWOPpGgdZEW10YZM6+9WDJ4VHKnbtFAe0TzVO+RwnIPoF6VG2X8A06qvqZXdSmAAltONfekXQtNNR0+rf5xUmOEWMUY1AwMbhtlSXAaEmftqxml+dOlKXfLqulncDi1MEhJaWMD8l/zORc/EU1re6GWQnFK4eCxVWC6nPKd4UkHZqRg+W1O2SmMNdIabYrUe/sgMTO+P6aWp4APOAXVZlkVAIdT/hQx1FrrNMZKPG5jOLnp1qAtZEB2jD9Mo7y7qVUOnpN3wodp7VXTrl8pcNX+HymVHb6QmBjxZUC19DGGCNxiO3s7Qbh2pzhgriVnfXZc5aZAmR692XtCXsjZc2cVfknhqNJNUbHSzjpqMJSVGWJAfQwCAwu8JKZ01Kv2cwiSGkXHOqlVePHA/9S9uSRLtwEYEfl7ooT9uy0X7xh5tzLVeO1xFh13WKN8/UojnNWhWB8iguJyGndSXf6PgONsq5CRWZPQzJ1JIVDSeMXswG6mZ1SRQ9Wwgr8yuxX0+Fm5KJDDZAreMnjKqisU8V5fBe3vih/5TsUQ0TrSMQdcZ/ICYR8TUQH27Fhd4IgWCuFVKnMAFv/hUOQDWGRn853izHyNa41Yc3lukDJR47Bl+zhic4UYHOBVNjSak1gE1GRhL75wRqtgCfGm6toPnpFnQSzXI1e2H5pTo5qxd5B1H7+Ca1vCU/nSLTQGXOL8t8AD2cjTP8pQgvxfI3+yYmvZcSLWZ2y3uaNRCqC67L9upLsSetaflQoloh2Jpcznw3qhxZ8de9JoHW7oRFtxFvx6tiD9NHXJbzwrBN35CQdjCVEHCpPHx52pWnfx4/8bUUe3NRdhuF91aJev/TG4j3goGXl4GiJr/QIAZl851guv9Q/Jc7MtfKphwXBnE3zZ3DCS5cl/v2lg8P82GUiwVcWw6UPG+Uy1fjDHROfLnUueaD9lb9tl9+sAxT70MSchMba6Lfg24PFqGZDC+aQWvM+0hDsa/KMreRdeKiyQrCMJjagVZ0Vb1WYRQhPwmktDY32yDE1S31rtt8ZjrRpybDNJgVyW/kB/wv1/G4DJO5T8gh4K+DBGSU5CUNISBGEpYMkwSdAygFK6cuU5cOZKIM0wSdLJajc2cHw+ZLlRCBzsaXIqUa07EMU2RO7yKo1BMWFCyMIw341ooz9FhhbX4ft7Aqk1DElohbVBdedEZ0DYKQr1YXz9F4upg9sZN7u8Z+gUlRlRJPePHeDU7kO24T7hC/gqKfpiGzCLdHuwwzc+OKtjVxIxqWFrtrx7yqJ2tfMxWVYD673d8FK9/+qk0jtZCHMpfN+jHdOz0xlH2G4c3ilLpsSOjsSqNNg6d5zMdMreKhZ/mvJ4FX59cTOwUsYJQlJ2T/L4CNk7MQzn0Gz1GzFrJ88yzlU541s1FUl8+aWfMllB8P0itxmbfSUXNWwosr87hHhzepsp3PBSeHHKqmSz28S74csnyckypLv59qcNlLKyahYWX+Zic8AL3myooHwJF5VW93kAAaji1Kt3Q1gJ2kyQbSg1dJVpjjDArEZylXWZ5fGxteBSsHQuqEcTudh5QLk87F1PV+dOyPT02R0J70o9UXZbZ32H5vD/o4nzOGwHObW/bhC/PNz3YhLB8WnhjzTXuNUjHjmhssjobcIn8fXQhYBnQAHpssSr82VdNGx7tXZdAPLPGPkNH/e93nvyM83jEhgx3UEqtRLGwWDhRTm1O5GK85OYeZOAnGtjZXPfmij8pqh4VXYhrRUopMG9UUdsmucaP4dD7wFX4edHFAyIoVYY8c4rrbOqZUcz2uR8l/dElWBHf2vi1THw+n5tGFIiGQsUYVlYo1frPxSYNw3TGbf5jtj7e/T8YTMhoWYfBHEPyNQt8Id9P82jNugTbmlkaioFFZu5UaR6EjBtDWDQCnb50QKX4f/W8NxCS8HfYe+3ssUp4BnDv76Y8GXPEl5FKxk/vxYoEuV7gXcR78ijKkHU/bOVI4V21TNu6WEtstMQPEUUKlc5/4Y6bzNzOZXVp35MMSe0hJQGjFsYfR31sNWc1GazMnRn6q33o88ZT9OITVHlhz3mzAzDLgEcLtzS5/+4a1A5AurnxZ+QyOQGccl/IhzNFeE5dG+Ewr3iy34BnD2569HQTsezy7TxUnec7cCZKZV06Afzj80jJUWYPCppxEB+S0OVlG/pSPBLMdfOv1nRi8etL72AEZZ5W9HLl8tnaWbVPelaCwOVgSEztSHpyV9T83Lcve1RCX9VmDRZthjKS3IZmXVic7jCPgVtHank1MQqKUExshRUaUV9d3lp27GhaUH/x1BWD0t8017F+MMHS7eMkdsPM2V/3iUGSOdqNbA4tAs9sfD4y9PlLv3Z5N0wIOEhVRvnpyKYP3xibRkuwTG3NT+K0uLBiWdpm7X2yyxB4LBTQkfRs95R5Z9+cDfho3b2c/w4KpExhhPeSdupm88RRVHp1rGRYUFFmDwqX5WaNE315PT/KAfr9LcjDdVYsBTPBZoWWQ6jPj80Y34a6hdaMzmuPlcOiZjUGGaLN5ZzdvQ4LXnKMGikcyycYtJpLLrfVTauZSbVyLpzipfxKsBKHRnGV5HxuLCtKaEFlDL0erBtKe7ZdveujZGfjRgn3SiqcY/7thCteUx6i9Pp6XlgNDy4dX1/85H0nluvcOh/1vBMMBxmR+H+dIT8CbxqC2L6k/GMYsM12pUGfZEcJrZVB4Zw0PgVmDkB+g/l6SqJFtDuWaF29khoANTPZyU08LlaNBOcJS41bTVl6cklmhJtMkPzjAc2/zWLqFXnii2fDFBK6ju1JGwFvG7SkNFf/IxVrw8uMV6qCXVqdGRpL2k0oJ5h/eZQvEUUozY3HC4xYicr25GhUR+hK9/DGL1w6jjBKH/xGJNziTz96/3TZ/H/VuaY4EjEwWerD/+RlCfBYWFJahJdyxrTYnHyoC+rS3NtcEBhKCzw5jtfFXYmqExB5FMNIsRH8fZw3JZlwTvSg9bVgTGhZJob3n0Z5lOVK4grc218UA6gcvE/ZTKvFMkFHtR2apl1yPOL8bcONfqI5f3VSX8icuXLhXXBGZtqYKIrTMHfYbfUPkUv3eqUtxGxkWq6YksK96F0oggx3EPFOSrxuZ3SaC2hATOJxkQiwQFtyjQKFxB6OrpCtPEIp3Gu9riMCG57nx6FVjFhnZfnweVxj5QsVIWca5VcM/naF726M/3ZWWwNB4vw3cTfZJDk/C2JQSnpHFQVK8CZ7Klp1BoLsuRvR35mlKDRXDkq3Ej/dWdsnjGS4JXVa1FjCnb5A4xh1SC256C2cGI0NjQOMFCLCRSwdG+b7JHPf1vx0/Hg9PzrVwSmYJRmW+f56/BGJP/UxOxXTu/UxncBtnL5wgcCxGvL9KfnfICDfUlK9prVBoKlxhpnX6v/1bymz4UxLQ8V6BzwwKLfeWZhAskfs3wzZNq3nPno1HnMLdfd8qsjp/ms1MN9S0IQdqpIC6AREg2epPu+LU4bjjmm6hF1tPt+VYPJtvDEl1hSdPVIVG8hemrKSWq6pGKgd76faGf9OX55eSIqHKNUknfkBo3nTXXi5i/pvfKQZZCRWxoqbTNMvSAZQ7MSa9P/qXfoEwVsZgtowK7j/sSh1FF4xGh7j/jHNN5yZSwJN5GP76LWyEGxhjvpegyDXUFNApJe45OVICIQAPEoMnmLrj8hpjY6QzdxOifFrnV+cfwC2AFaVIVGZi7BPnPAMQljfDRw/OSZLiZdn/EApJDZ0zzPBRj/6SjLW2d2U5qhqUsg0dMQzKuJrieUksm+YULNVJosmid+Ng14wxR/GYuI287YJ5IxPSj9MHCbcTQ0XfW01Scx1KWRZk0XX4+0wrF7pnFI0/pYn3HUip9RZSSW97jlPG5ReAXnc2vznCaZxqaJ1jkK4RVF91347ZgJC/74di5wcF/TQQnuQ1wrQN42KsIePaVkX08R/71JXAz+KPeia/CCPzbMySSHNb3mVAlPmqLeGztreU2jNx6DUOUJ94hmcsRNZfpX7f9Cq4uHNvApCnzx2NBa1KbfhXyCpBn1ZjTKNqI1MvD6GhFlK6J3gj/5bMQ8rKNI6eOQ5WSa8tH0+ZXa57clv4hu+1S08xxVpR6pzBd2QW/64IwsDWsfCbgWIhJtD1CrfMDcILh4R2ewjkcdHUSs6LsDbnSQQ0qossWzWmlO2QrVG77yb8ShDajN9i9PA1C1KKkT/oj03C0JCum83KUu9SWVU15yngkN6c2XIdvBSzUH1ErXydr4UyAU94M2Ajl00ZV2IBGIyHnUFxaEeEXmScppf4rGF9vyWwNHQKoDz5UxYWvHUSvxlnlU5hwgssI2GR+BBroslVnUC3bLhsJbO25qILp12yYJHi0ZZXZpbJQHx7SIIYxkd6H1qIIJI2d266QeSjjl9Vd2PH4E5t1B8wz0Wwe6yXpDAlLp28U0dlW2eLyncy1LRz2aXOiUVLEBlvJEiuW+/AQfMcKF+QNowp0YWU8fsfuyDDd3V2c8hNSKVRWM9ldrWNYw+3hT+WQHKmXz8XCrR5asVH68e5FzfEAaFUtNw0pW3MmY6bz54+Tv/3M+pxGFxe8bcRRZWjEhN7C9yArZdr9NR4+clw5FQlP7+fSYnBNK+oRlTpsz29RZbt3gDBz/YZW8yBtN2y3xdcef60jNOzBS/fNJhbD44pYcUcuedRMjd09NHzOyxdjDD80V/2djtQAAoz1dXxHtz2+GUHk8KsmM9XgeKh80VG7iGCZUMfJYsz2dhy8e6KoqVrh/f4QdVsKPrhE8cf2wV6500H/oatPm+3NIAWoq0NPXykfyD17xwbVzSGGgr4UoCJtalSQnkHc5zhkU6tnEvzS31LmAPtGmHkk2uU3Zb9jSX+hk3gnMwoX9FPND/o8BHBKUyLBIVb5sIEGoMVzTKY/Riylw9h6ekj77oAEK0uUAOcvPeWMaBsD/egdgv/pTPGu5V8pgu3T9a5PZEg+od+npm6Z+hEvss2GyWXp7M9KLDWhShiKVCUQmikuOK6P26l7V8PS92SHejJSyYQ+VBV6ii1RBl5lpHd9m9L7vKDLpwcZCJDBnCgoz65exXWQwH8d2rMNTKiGYp8Axr0Ti90vxD5opFllaNzfL2MsJCysyl+RodMDP308s26KiGEX00RTiSrI5+smEyleD30oHhEVHAQ8U6DSEJVrjmGTfINXq0QBuHnnnEDZZNz879o2Hll8iLYEJLs/L1XCDz2Ut48TEeoX5jD7TLNevk5tgsdrbhqZpDwpwGBZM7ApcQ0eMpOq56I146D9YQ/V4byJXSrS7x4FvKNljn0ICQL0KnnwO5VCV5VNoktiTK8FUnanKkx1qrUS30PySkZGf3HuS7GEvVQv7S1Jr9nhQd4nGVbD5xUYGB4PDWdvxmxqpj/iiyTYKy2nKfxrJp/mO1JN4M2OE1UvNbLe5OA2ZXitVPU2rgJpZQC7TSeA44h4CqWxxzO5T4UxDmJMRLSJdIdvpbJ/E7DIMDiijQhoDVMBLc/3Y3/p01mph57gQWC4+UC9afqAaEvF3KwXcLNOtSlDstx+9mngSnNb94bOW+zA0TBvBn8Mq+VkPs2d7WeIVAfG2FXkyn6UT/uB5WcNGbWm5GNLPs9AhObuZDJmQ3+LtKKsDeVfiDYNH6XeUVFA/R/v7HLqekQFRRxR6PyfD99sT0cNHd3TT9NcCJDR7z9mMd3Iqd/J9SIZ1SiHqs+AG4oc/a3vDGCwmICvx1DZjZUEoc6wU+ows5wUzTHfTtUegP9kQBLexQsgIe4KiV12eLVLLZKN4+0fQ5llmU6ZGmbF/jKhFf6GBvn+Iu9Kf17aP6j7/CL+ngu6MhYKTWQlGJxyWvd68a0UED7uI7kqM4II/BoLOqx7iT4oofQSPrmnDiNwOf4k+yp4EloNSllXGeo7Y4pqn/TrOSEz8vCUN6im84IjekO6JkuSP3uWJpslSKJTXj3tqDZTASlgOwY6A1gWoowD+Mq4cLH/esadUUA62+4rst22hqnX5CmchCMye3P+xgr9dugnpANUGFyVGNjRplpLgsyIIs5EPij8+Tnx4VU4amokl0lIlc3mrT1nr7gVHI73MikLFLS1Mn4JLyZVYzuCz366nECKsMESnFAPHz+w1BDYzxkn+xXyBS4ImM1SD2LUPD1kWDeLMdmkbfKMOD8gPszeyJQokt9+nR+uJrjDVwDXUmA8WdCy2fMQjN4qBK2g6pTOXfhrdra1QzZe9N16QWOOJVudqsvcUXxGYl2bGjbUNpRdTyAanK64r8mXExvBtuQMHu3XF73xVy3o2KfKQOBLF170+sZQ9ByJ/x6dmp7hFKATkslfvq6xD05XpH7AR4yNM2+MOHDW/arE3Fpns/LP27v02D9LkiRPvv3i8LOfjEdFD3w8WsOfQ/EnPFxkCZhezsYP070RZ+AjH78+/jMPJ+2njijqigm4c3a0zFxoKXcCnBqf9tP1gv7OajLO17Y/MWg2VhA+WdJ8Vun45/iHQREZIDrQpX795dSHBR+sIRinnj0SkXvAXaXheVceUF7mT+WMFzoMHx3n4R8Msw/PL2C+xi1A23d60Rg63MvMtlXP3ZJFLXzvIcv9BU/TnXRn7mVOJ/ypoXPhqHnFX/awXpJzL1VHHLsUsfNamgdo9VThpPzEsflDO2kXFJwbA41T9r00Xd2F/7LQzLkEPXz+9F4TIqJKeD3sLS/exGeeA3dy/rBk8uHDxk0gl/EXNkBU/2hfLY4lEOjQ1ez62kaXn5LHz7cuaWy1Y0eDH6OHAuZHDYizVHOY/bwUuUkOjoCAseA1315Gabp1eeHmqJLBEgvqRtFxkGwzelcNUKCb6l2PJ6eONEWtZ4SNDoUAfLSh2E6j7ocjxTdOVwW7IFx0uVcl2BmRru7GI9asE84YE/6DUnyQUqZTvp4mT/uXcWOAMy9jrv9S+biLDieYj9+26O/8517JUtn6mx7GwSiC+6XAARB9bz8T7t9gAI84dJYD36u/1euG1pSWKRlsYAr6b+g/poVr8v55Gt371dIjrKoPzLhMvKC/LEC+dpyHaRI8C/htcPqhJ/OihEL2BCu2/JhAQ4Ef5VY6tg9KsILkZD6yR3kQm2JE3htVckw6decGDPf4Nv8HG7rgulRSBqb55Kr2FRgCMi5eBuqp6DoN9StcWW+D/wfpNM2HPiPOpS7pNSPWg/0+vHxMy7Uu3gkgE4jBLyu+xvol6aXI3QQ+28zCG/KfKYt7M+8soilYftQBlCjSHE0onBA8L7mKeLAwm0U4QkLqHX2Um2ayaF0FIhaVdeIekF2q4KQe+qW2H18yLvr60kf1ejqILSmPu/jgVD3EUzmI0NI8NtMsEaJnfmY/qYCvK6SUoXTtHOW5U/TuwrIB9bMONhVruFtuCHvDKv1JtCC4LzlD/u/2S4bnSoG2Gsi6ZG4FOEYwLjs/YhLtALCwyGfb2//Zudt8vDNJPDa2AghaVzob+nkzCzIiepkosNaaLki8bgc9r8pvPbm5GA2uzocStw068HkAVUQ6qYGtUqpWEPqV1lMp/G+oIH/TWyovq3ZAGtN/rzg1app0OEiIpNri09NXp7M+rlnrl2L2WXiiabTL7h4/gx3vqEVDcrtu+Vh8spsoCgHFUJCwhErmFSCaVgnQ/LzyNu7P2TNAHMWPQJ0xqQCxTPrlhX2eKK6h/dxDDRtdViIjqLBbWW+SWbEcPBYUCrx8ZYpyLtYOOXZ+X+4WiAtAcHzC54AqrjIT1/E9nQKqmFpXmjCjNzRHB9M7sJwGDwoB70hZXm8rsznqkdnl4fWx5yta32xwTD5cQP0e2ns5sr1U9JgarozheisLtmZBO3Wf/l/g8jBdjyZ0nbBouLI2oSScOG+oPGs2OrYQoP0ODeCY9zU3Gx56+d0FrbJTeHquCjo9fnUyEHK7v3Wqr297CDWxe7vd0RiqjjjTrTYMVfEjg+9Nq2KWOPOl8DpPP9472JCv6098+jZzEfifl5efr7ASkpMSrpuShLc9jjq5t0w08AYqOnrycrd3bhpYOzcPCC5Q288CSyLTdpCMOiAzEZNbML0PmBKYio5PjpggIFCrKN9JvvgSMhp55CQghj5ae6MvdAWaCqaAjCTCRGrIpYxSP+ZKEfYYJGJx5ipzb2HoKmG6fTr/gYYe5e9vRCgqKti7FbCeDz4alYoHuGs5fToFFLinA7lohcX"
        },
        "formError": "",
        "labelCol": 3,
        "name": "PUBLISH_FORM__PC",
        "updateUrl": "//cpub.taobao.com/async.json?_tb_token_=5566e4bdbb1e3"
    },
    "status": "success"
};

let ts = {
    "components": ["CreatorAddTopic", "RadioGroup", "Activity", "Text", "CreatorPush", "TagPicker", "CreatorAddItem", "Input", "Toast", "InteractContainer", "IceAddVideo", "Forward", "CreatorAddImage", "AddTag"],
    "config": {
        "actions": [{
            "size": "large",
            "span": "2",
            "style": {"display": "none"},
            "name": "draft",
            "text": "保存草稿",
            "url": "//cpub.taobao.com/submit.json?draft=1&_draft_id=220640564458&_tb_token_=3d77e436b4be3"
        }, {
            "size": "large",
            "span": 2,
            "offset": 5,
            "type": "primary",
            "needValidate": true,
            "disabled": false,
            "style": {"display": "none"},
            "name": "submit",
            "text": "发布",
            "url": "//cpub.taobao.com/submit.json?_tb_token_=3d77e436b4be3"
        }, {
            "size": "large",
            "span": "2",
            "style": {"display": "none"},
            "name": "preview",
            "text": "预览",
            "url": "//cpub.taobao.com/submit.json?preview=1&draft=1&_draft_id=220640564458&_tb_token_=3d77e436b4be3"
        }],
        "children": [{
            "component": "IceAddVideo",
            "errMsg": "互动视频中的商品不在商品池: [575663488399]",
            "label": "上传视频",
            "name": "body",
            "props": {
                "editVideoUrl": "/material/mine/video",
                "addImageProps": {"pixFilter": "750x422", "appkey": "tu"},
                "aspectRatio": "750x422",
                "label": "上传视频",
                "api": "//resource.taobao.com/video/getMaterial?pageSize=20&vf=p&producerSource=1",
                "videoCenterUrl": "/material/mine/video",
                "tips": "视频比例16:9，720p以上；视频封面尺寸为750x422，无文字、清晰、有质感图片，不超过 500k",
                "enableNormalVideo": false,
                "enableInteractVideo": true,
                "value": [{
                    "coverUrl": "https://img.alicdn.com/imgextra/i1/6000000001407/O1CN01eLqdjP1MGRlcmOucc_!!6000000001407-0-tbvideo.jpg",
                    "description": "高跟鞋.mp4",
                    "duration": 150,
                    "interactId": 338557128,
                    "playUrl": "//cloud.video.taobao.com/play/u/1765153321/p/2/e/6/t/1/220589944816.mp4",
                    "title": "高跟鞋.mp4",
                    "uploadTime": 1551954108000,
                    "videoCoverUrl": "//img.alicdn.com/imgextra/i2/1765153321/O1CN01ST0Tao1aP3q0ghMBo_!!1765153321-0-beehive-scenes.jpg",
                    "videoId": 220589944816
                }]
            },
            "rules": [{"min": 1, "type": "array", "message": "至少要有1个"}, {
                "max": 1,
                "type": "array",
                "message": "最多允许1个"
            }],
            "tips": "视频比例16:9，720p以上；视频封面尺寸为750x422，无文字、清晰、有质感图片，不超过 500k",
            "updateOnChange": "true"
        }, {
            "className": "creator-input-no-border creator-input-title",
            "component": "Input",
            "label": "标题",
            "name": "title",
            "props": {
                "className": "creator-input-no-border creator-input-title",
                "label": "标题",
                "placeholder": "请在这里输入标题",
                "tips": "<a target='_blank' href='https://docs.alipay.com/alibaba_we_guide/guide/derz4g'>优质标题写作指引</a>按照创作指引添加标题，将大大提高内容被更大渠道采纳的概率哦～",
                "cutString": false,
                "maxLength": 16,
                "hasLimitHint": true,
                "value": "我们是中国人"
            },
            "rules": [{"type": "string", "message": "标题不能为空", "required": true}, {
                "max": 16,
                "type": "string",
                "message": "文字长度太长, 要求长度最多为16"
            }],
            "tips": "<a target='_blank' href='https://docs.alipay.com/alibaba_we_guide/guide/derz4g'>优质标题写作指引</a>按照创作指引添加标题，将大大提高内容被更大渠道采纳的概率哦～"
        }, {
            "className": "creator-input-no-border",
            "component": "Input",
            "label": "视频描述",
            "name": "summary",
            "props": {
                "multiple": true,
                "className": "creator-input-no-border",
                "label": "视频描述",
                "placeholder": "请输入125个字以内的描述：（1）单品请填写推荐理由；(2)剧情、广告类型请描述主要剧情或情节；(3)评测、清单、盘点类型请描述清单盘点的主题，涉及主要商品；",
                "rows": 4,
                "cutString": false,
                "maxLength": 140,
                "hasLimitHint": true,
                "value": "视频比例16:9，720p以上；视频封面尺寸为750x422，无文字、清晰、有质感图片，不超过 500k视频比例16:9，720p以上；视频封面尺寸为750x422，无文字、清晰、有质感图片，不超过 500k"
            },
            "rules": [{"min": 0, "type": "string", "message": "请输入50-140个字的视频描述"}, {
                "max": 140,
                "type": "string",
                "message": "视频描述字数不能多于125个字"
            }]
        }, {
            "component": "InteractContainer",
            "label": "",
            "name": "activity",
            "props": {
                "label": "",
                "value": [{"checked": false, "key": "3", "title": ""}, {"checked": false, "key": "5", "title": ""}]
            },
            "rules": []
        }, {
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
                "value": false
            },
            "rules": []
        }, {
            "component": "Toast",
            "label": "",
            "name": "__draftToast_220640564458",
            "props": {
                "timestamp": "1552015654698",
                "label": "",
                "type": "error",
                "value": "部分字段校验不通过，请检查当前发布页面的提示后再进行操作"
            },
            "rules": []
        }, {
            "component": "AddTag",
            "label": "添加标签",
            "name": "tags",
            "props": {
                "minLength": 1,
                "label": "添加标签",
                "tips": "点击「回车」添加标签, 最多可添加8个标签, 每个标签不超过12个字",
                "maxLength": 12,
                "value": ["性格", "性感"]
            },
            "rules": [{"max": 8, "type": "array", "message": "最多允许8个"}],
            "tips": "点击「回车」添加标签, 最多可添加8个标签, 每个标签不超过12个字"
        }, {
            "component": "IceAddVideo",
            "label": "添加首页5s视频",
            "name": "homePageIntroVideo",
            "props": {
                "filterDurLess": 6,
                "editVideoUrl": "/material/mine/video",
                "addImageProps": {"pixFilter": "600x600", "appkey": "tu"},
                "aspectRatio": "600x600",
                "label": "添加首页5s视频",
                "api": "//resource.taobao.com/video/getMaterial?pageSize=20&vf=p&producerSource=1",
                "videoCenterUrl": "/material/mine/video",
                "tips": "请上传5秒的普通视频，无任何字幕水印，无边框，720p以上，大小4M以内",
                "resourceType": true,
                "enableNormalVideo": true,
                "value": [{
                    "coverUrl": "https://img.alicdn.com/imgextra/i3/6000000002981/O1CN0166Dlf51XtLAvGqpy1_!!6000000002981-0-tbvideo.jpg",
                    "description": "未命名.mp4",
                    "duration": 5,
                    "playUrl": "//cloud.video.taobao.com/play/u/2365975412/p/2/e/6/t/1/220634612174.mp4",
                    "title": "未命名.mp4",
                    "uploadTime": 1552007382000,
                    "videoCoverUrl": "//img.alicdn.com/imgextra/i3/2365975412/O1CN01JZvHkd1pqk0l2Gyws_!!2365975412-0-beehive-scenes.jpg",
                    "videoId": 220634612174
                }]
            },
            "rules": [{"min": 1, "type": "array", "message": "至少要有1个"}, {
                "max": 1,
                "type": "array",
                "message": "最多允许1个"
            }],
            "tips": "请上传5秒的普通视频，无任何字幕水印，无边框，720p以上，大小4M以内"
        }, {
            "component": "TagPicker",
            "label": "分类",
            "name": "classification",
            "props": {
                "showTabs": true,
                "label": "分类",
                "dataSource": {
                    "匹配时间": [{"parent": "匹配时间", "label": "春", "value": "102005:23009"}, {
                        "parent": "匹配时间",
                        "label": "夏",
                        "value": "102005:12009"
                    }, {"parent": "匹配时间", "label": "秋", "value": "102005:12010"}, {
                        "parent": "匹配时间",
                        "label": "冬",
                        "value": "102005:12011"
                    }, {"parent": "匹配时间", "label": "特殊节假日", "value": "102005:270003"}, {
                        "parent": "匹配时间",
                        "label": "长期",
                        "value": "102005:321005"
                    }],
                    "领域(必选1个)": [{"parent": "领域(必选1个)", "label": "美食", "value": "31041:31028"}, {
                        "parent": "领域(必选1个)",
                        "label": "服饰",
                        "value": "31041:42024"
                    }, {"parent": "领域(必选1个)", "label": "旅行", "value": "31041:23013"}, {
                        "parent": "领域(必选1个)",
                        "label": "彩妆",
                        "value": "31041:73036"
                    }, {"parent": "领域(必选1个)", "label": "烘培", "value": "31041:266019"}, {
                        "parent": "领域(必选1个)",
                        "label": "试吃",
                        "value": "31041:81131"
                    }, {"parent": "领域(必选1个)", "label": "萌宠", "value": "31041:31031"}, {
                        "parent": "领域(必选1个)",
                        "label": "二次元",
                        "value": "31041:31025"
                    }, {"parent": "领域(必选1个)", "label": "汽车", "value": "31041:37016"}, {
                        "parent": "领域(必选1个)",
                        "label": "护肤",
                        "value": "31041:77031"
                    }, {"parent": "领域(必选1个)", "label": "美甲", "value": "31041:315017"}, {
                        "parent": "领域(必选1个)",
                        "label": "美发",
                        "value": "31041:315018"
                    }, {"parent": "领域(必选1个)", "label": "运动", "value": "31041:31029"}, {
                        "parent": "领域(必选1个)",
                        "label": "生活",
                        "value": "31041:31030"
                    }, {"parent": "领域(必选1个)", "label": "栽培", "value": "31041:315020"}, {
                        "parent": "领域(必选1个)",
                        "label": "数码",
                        "value": "31041:23001"
                    }, {"parent": "领域(必选1个)", "label": "电器", "value": "31041:81001"}, {
                        "parent": "领域(必选1个)",
                        "label": "健康",
                        "value": "31041:41019"
                    }, {"parent": "领域(必选1个)", "label": "家居", "value": "31041:48023"}, {
                        "parent": "领域(必选1个)",
                        "label": "游戏",
                        "value": "31041:41015"
                    }, {"parent": "领域(必选1个)", "label": "母婴", "value": "31041:23010"}, {
                        "parent": "领域(必选1个)",
                        "label": "玩具模玩",
                        "value": "31041:266025"
                    }, {"parent": "领域(必选1个)", "label": "3C配件", "value": "31041:315023"}],
                    "类型(招投稿)": [{"parent": "类型(招投稿)", "label": "单品展示", "value": "315031:58001"}],
                    "人群(必选1个)": [{"parent": "人群(必选1个)", "label": "女性", "value": "42030:42028"}, {
                        "parent": "人群(必选1个)",
                        "label": "男性",
                        "value": "42030:31036"
                    }, {"parent": "人群(必选1个)", "label": "宠物党", "value": "42030:319007"}, {
                        "parent": "人群(必选1个)",
                        "label": "育儿党",
                        "value": "42030:321006"
                    }, {"parent": "人群(必选1个)", "label": "装修党", "value": "42030:270004"}, {
                        "parent": "人群(必选1个)",
                        "label": "有车党",
                        "value": "42030:321007"
                    }, {"parent": "人群(必选1个)", "label": "通用", "value": "42030:270005"}]
                },
                "value": ["42030:42028", "31041:42024"]
            },
            "rules": []
        }],
        "dynamicFormVersion": "0.1.16",
        "formData": {
            "template": "video",
            "owner": "yingxtb",
            "activityId": 68,
            "formName": "c_yingxtb",
            "activityName": "横版视频招稿",
            "source": "creator",
            "userRole": "daren",
            "publishToolbar": "[{\"text\":\"频道投稿\"},{\"text\":\"横版视频招稿\"},{\"text\":\"短视频\"}]",
            "serverData": "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"
        },
        "formError": "",
        "labelCol": 3,
        "name": "PUBLISH_FORM__PC",
        "updateUrl": "//cpub.taobao.com/async.json?_tb_token_=3d77e436b4be3"
    },
    "status": "success"
}
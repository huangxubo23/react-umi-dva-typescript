/**
 * Created by 石英 on 2019/3/14 0014上午 9:33.
 */
import React from 'react';
import ReactChild from "../../../../../../lib/util/ReactChild";
import {Tabs,Layout,Card,Button,Dialog,Pagination} from 'element-react';
import 'element-theme-default';
import $ from "jquery";
import {BundleLoading} from '../../../../../../../bundle';
import Interaction from 'bundle-loader?lazy&name=pc/trends_asset/components/content/add/IceAddVideoModule/app-[name]!../../../../../../lib/sharing/upload/components/InteractiveVideo';

class VideoManagement extends ReactChild {
    constructor(props) {
        super(props);
        this.state = {
            presentValue:1,
            itemList: [
                {
                "title": "序列 01.mp4",
                "coverUrl": "https://img.alicdn.com/imgextra/i1/6000000005233/O1CN01DLRk5P1oWl7LF5ICv_!!6000000005233-0-tbvideo.jpg",
                "description": "序列 01.mp4",
                "videoId": 221172762177,
                "duration": 51,
                "uploadTime": "2019-03-14 08:24:29",
                "state": 6,
                "playUrl": "//cloud.video.taobao.com/play/u/2365975412/p/2/e/6/t/1/221172762177.mp4",
                "interactId": null,
                "width": 9,
                "height": 16,
                "ratio": "9:16",
                "interactPage": "//duomeiti.taobao.com/interactiveAccess.htm?interactId=null&bizCode=DAREN&videoId=221172762177&videoUrl=%2F%2Fcloud.video.taobao.com%2Fplay%2Fu%2F2365975412%2Fp%2F2%2Fe%2F6%2Ft%2F1%2F221172762177.mp4&duration=51&coverUrl=https%3A%2F%2Fimg.alicdn.com%2Fimgextra%2Fi1%2F6000000005233%2FO1CN01DLRk5P1oWl7LF5ICv_%21%216000000005233-0-tbvideo.jpg",
                "displayState": "通过审核"
            }, {
                "title": "未命名.mp4",
                "coverUrl": "https://img.alicdn.com/imgextra/i3/6000000002981/O1CN0166Dlf51XtLAvGqpy1_!!6000000002981-0-tbvideo.jpg",
                "description": "未命名.mp4",
                "videoId": 220634612174,
                "duration": 5,
                "uploadTime": "2019-03-08 09:09:42",
                "state": 6,
                "playUrl": "//cloud.video.taobao.com/play/u/2365975412/p/2/e/6/t/1/220634612174.mp4",
                "interactId": null,
                "width": 16,
                "height": 9,
                "ratio": "16:9",
                "interactPage": "//duomeiti.taobao.com/interactiveAccess.htm?interactId=null&bizCode=DAREN&videoId=220634612174&videoUrl=%2F%2Fcloud.video.taobao.com%2Fplay%2Fu%2F2365975412%2Fp%2F2%2Fe%2F6%2Ft%2F1%2F220634612174.mp4&duration=5&coverUrl=https%3A%2F%2Fimg.alicdn.com%2Fimgextra%2Fi3%2F6000000002981%2FO1CN0166Dlf51XtLAvGqpy1_%21%216000000002981-0-tbvideo.jpg",
                "displayState": "通过审核"
            }, {
                "title": "肿泡眼这样画眼影也有春天啦！.mp4",
                "coverUrl": "https://img.alicdn.com/imgextra/i3/6000000000669/O1CN01VN1o4w1GoRT3NYh60_!!6000000000669-0-tbvideo.jpg",
                "description": "肿泡眼这样画眼影也有春天啦！.mp4",
                "videoId": 219974370425,
                "duration": 58,
                "uploadTime": "2019-02-25 09:49:57",
                "state": 6,
                "playUrl": "//cloud.video.taobao.com/play/u/2365975412/p/2/e/6/t/1/219974370425.mp4",
                "interactId": null,
                "width": 9,
                "height": 16,
                "ratio": "9:16",
                "interactPage": "//duomeiti.taobao.com/interactiveAccess.htm?interactId=null&bizCode=DAREN&videoId=219974370425&videoUrl=%2F%2Fcloud.video.taobao.com%2Fplay%2Fu%2F2365975412%2Fp%2F2%2Fe%2F6%2Ft%2F1%2F219974370425.mp4&duration=58&coverUrl=https%3A%2F%2Fimg.alicdn.com%2Fimgextra%2Fi3%2F6000000000669%2FO1CN01VN1o4w1GoRT3NYh60_%21%216000000000669-0-tbvideo.jpg",
                "displayState": "通过审核"
            }, {
                "title": "LkGU63IShlVXuXPyUxc@@sd.mp4..mp4",
                "coverUrl": "https://img.alicdn.com/imgextra/i4/6000000000703/O1CN011H40u2X6q3oopk7_!!6000000000703-0-tbvideo.jpg",
                "description": "LkGU63IShlVXuXPyUxc@@sd.mp4..mp4",
                "videoId": 211629123165,
                "duration": 80,
                "uploadTime": "2018-10-22 14:08:12",
                "state": 6,
                "playUrl": "//cloud.video.taobao.com/play/u/2365975412/p/2/e/6/t/1/211629123165.mp4",
                "interactId": null,
                "width": 16,
                "height": 9,
                "ratio": "16:9",
                "interactPage": "//duomeiti.taobao.com/interactiveAccess.htm?interactId=null&bizCode=DAREN&videoId=211629123165&videoUrl=%2F%2Fcloud.video.taobao.com%2Fplay%2Fu%2F2365975412%2Fp%2F2%2Fe%2F6%2Ft%2F1%2F211629123165.mp4&duration=80&coverUrl=https%3A%2F%2Fimg.alicdn.com%2Fimgextra%2Fi4%2F6000000000703%2FO1CN011H40u2X6q3oopk7_%21%216000000000703-0-tbvideo.jpg",
                "displayState": "通过审核"
            }
            ]
        }
    }

    componentDidMount() {

    }

    selectPresent=(tab)=>{//切换
        let value=tab.props.name;
        this.setState({presentValue:value},()=>{

        })
    };

    addUpVideo=({item})=>{
        if(this.state.interaction&&this.interaction&&this.interaction.jd){
            this.interaction.jd.open({item,type:'add',disabled:true});
        }else {
            this.setState({interaction:true},()=>{
                let upload=setInterval(()=>{
                    let jd = this.interaction.jd;
                    if(jd){
                        clearInterval(upload);
                        jd.open({item,type:'add',disabled:true});
                    }
                },100);
            })
        }
    };

    render() {
        let {presentValue,itemList,interaction}=this.state;
        return (
            <div>
                <Tabs type="border-card" activeName={presentValue} onTabClick={this.selectPresent}>
                    <Tabs.Pane label="普通视频" name={1}>
                        <Layout.Row gutter="12">
                            {(itemList?itemList:[]).map(item=>{
                                let {videoId, coverUrl, title, uploadTime,playUrl} = item;
                                return(
                                    <Layout.Col span="6" key={videoId}>
                                        <Card className="box-card" header={<div className="clearfix">
                                            <div style={{lineHeight: "22px",fontSize: '16px',color:'#0073bd',textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap', overflow: "hidden", display: "block"}}>
                                                {title}
                                            </div>
                                            <span style={{lineHeight: "28px",fontSize: '14px',color:'#999'}}>
                                                {uploadTime}
                                            </span>
                                            <span style={{float: 'right'}}>
                                                <Button type="primary" size="small" onClick={()=>this.addUpVideo({item})}>创建互动视频</Button>
                                            </span>
                                        </div>} style={{textAlign:'left'}}>
                                            <div style={{position: 'relative'}}>
                                                <div style={{textAlign:'center'}}>
                                                    <img src={coverUrl} style={{height:'200px'}}/>
                                                </div>
                                                <div style={{
                                                    display: 'block', position: 'absolute', top: 0, left: 0, height: '100%', width: '100%',
                                                    cursor: 'pointer', backgroundImage: 'url(//img.alicdn.com/tfs/TB1LiOXNpXXXXbEaXXXXXXXXXXX-53-43.png)',
                                                    backgroundRepeat: 'no-repeat', backgroundPosition: 'center center'
                                                }} onClick={()=>{
                                                    this.watchVideo.open(playUrl);
                                                }}>

                                                </div>
                                            </div>
                                        </Card>
                                    </Layout.Col>
                                )
                            })}
                        </Layout.Row>
                        <div style={{margin:'16px 0'}}>
                            <Pagination layout="prev, pager, next" total={1000}/>
                        </div>
                    </Tabs.Pane>
                    <Tabs.Pane label="互动视频" name={2}>
                        <Layout.Row gutter="12">
                            {(itemList?itemList:[]).map(item=>{
                                let {videoId, coverUrl, title, uploadTime,playUrl} = item;
                                return(
                                    <Layout.Col span="6" key={videoId}>
                                        <Card className="box-card" header={<div className="clearfix">
                                            <div style={{lineHeight: "22px",fontSize: '16px',color:'#0073bd',textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap', overflow: "hidden", display: "block"}}>
                                                {title}
                                            </div>
                                            <span style={{lineHeight: "28px",fontSize: '14px',color:'#999'}}>
                                                {uploadTime}
                                            </span>
                                            <span style={{float: 'right'}}>
                                                <Button type="primary" size="small" onClick={()=>this.addUpVideo({item})}>编辑互动视频</Button>
                                            </span>
                                        </div>} style={{textAlign:'left'}}>
                                            <div style={{position: 'relative'}}>
                                                <div style={{textAlign:'center'}}>
                                                    <img src={coverUrl} style={{height:'200px'}}/>
                                                </div>
                                                <div style={{
                                                    display: 'block', position: 'absolute', top: 0, left: 0, height: '100%', width: '100%',
                                                    cursor: 'pointer', backgroundImage: 'url(//img.alicdn.com/tfs/TB1LiOXNpXXXXbEaXXXXXXXXXXX-53-43.png)',
                                                    backgroundRepeat: 'no-repeat', backgroundPosition: 'center center'
                                                }} onClick={()=>{
                                                    this.watchVideo.open(playUrl);
                                                }}>

                                                </div>
                                            </div>
                                        </Card>
                                    </Layout.Col>
                                )
                            })}
                        </Layout.Row>
                        <div style={{margin:'16px 0'}}>
                            <Pagination layout="prev, pager, next" total={1000}/>
                        </div>
                    </Tabs.Pane>
                </Tabs>
                <WatchVideo ref={e => this.watchVideo = e}/>
                {interaction&&<BundleLoading ref={e=>this.interaction=e} load={Interaction} videoData={this.videoData}/>}
            </div>
        )
    }
}

class WatchVideo extends React.Component{
    constructor(props){
        super(props);
        this.state= {
            dialogVisible: false
        };
        this.open=(url)=>{
            this.setState({dialogVisible:true},()=>{
                let i=url.lastIndexOf('.');
                let type = url.substring(i + 1);
                let t=`video/${type}`;
                $(".videoClass").prepend(`<video width="560" height="380" controls><source src=${url} type=${t}/></video>`);
            })
        };
        this.close=()=>{
            this.setState({dialogVisible:false},()=>{
                $(".videoClass").empty();
            })
        };
    }

    render(){
        let {dialogVisible}=this.state;
        return(
            <div style={{textAlign:'left'}}>
                <Dialog title="视频播放" size="large" visible={dialogVisible } onCancel={this.close} lockScroll={false} style={{width:'660px'}}>
                    <Dialog.Body>
                        <div style={{textAlign:'center'}} className='videoClass'>

                        </div>
                    </Dialog.Body>
                    <Dialog.Footer className="dialog-footer">
                        <Button onClick={this.close}>关闭</Button>
                    </Dialog.Footer>
                </Dialog>
            </div>
        )
    }
}

export default VideoManagement;
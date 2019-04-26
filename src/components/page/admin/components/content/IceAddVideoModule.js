/**
 * Created by 石英 on 2018/7/19 0019上午 10:21.
 */

import React from 'react';
import {Layout,Button,MessageBox,Message,Dialog} from 'element-react';
import 'element-theme-default';
import '../../../../../styles/addList/content.css';
import {BundleLoading} from '../../../../../bundle';
import video from 'bundle-loader?lazy&name=pc/trends_asset/components/content/add/IceAddVideoModule/app-[name]!../../../../lib/sharing/upload/NewUpVideo';
import HintShow from './Hint';


class IceAddVideoModule extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            openVideo:false,
        }
    }

    addVideo=()=>{
        let {value=[],constraint,onChange} = this.props;
        let callback=(item)=>{
            value.push(item);
            onChange(constraint, value);
        };
        this.setState({callback},()=>{
            if(this.state.openVideo&&this.upVideo&&this.upVideo.jd){
                this.upVideo.jd.open();
            }else {
                this.setState({openVideo:true},()=>{
                    let upload=setInterval(()=>{
                        let upVideo = this.upVideo;
                        if(upVideo&&upVideo.jd){
                            clearInterval(upload);
                            upVideo.jd.open();
                        }
                    },100);
                })
            }
        })
    };

    delVideo=({i})=>{
        let {value,constraint,onChange} = this.props;
        value.splice(i, 1);
        onChange(constraint, value);
    };

    editVideo=({i})=>{
        let {value=[],constraint,onChange} = this.props;
        let callback=(item)=>{
            value.splice(i,1,item);
            onChange(constraint, value);
        };
        this.setState({callback},()=>{
            if(this.state.openVideo&&this.upVideo&&this.upVideo.jd){
                this.upVideo.jd.open(value[i]);
            }else {
                this.setState({openVideo:true},()=>{
                    let upload=setInterval(()=>{
                        let jd = this.upVideo.jd;
                        if(jd){
                            clearInterval(upload);
                            jd.open(value[i]);
                        }
                    },100);
                })
            }
        });
    };

    check=(item)=>{
        if(item.ivideoData){
            this.upVideo.jd.ivideoEdit(item);
        }else {
            this.watchVideo.open(item.playUrl);
        }
    };

    render(){
        let {constraint,value=[],hint,modelSet,modelOnChenge} = this.props,{openVideo,callback}=this.state;
        let {max,tips}=constraint.props;
        return(
            <Layout.Row gutter="10" style={{margin: "8px 0"}}>
                <Layout.Col span="2" style={{fontWeight: 'bold'}}>
                    {modelSet && <Button type="primary" size='mini' onClick={modelOnChenge}>设置</Button>}
                    {constraint.title}
                </Layout.Col>
                <Layout.Col span="22">
                    <Layout.Row gutter="5">
                        {value.length< (max ? max :1)&&<Layout.Col span="8" className="itemM_pic">
                            <img src="https://img.alicdn.com/imgextra/i1/772901506/TB2oeLpihhmpuFjSZFyXXcLdFXa_!!772901506.jpg"
                                 onClick={this.addVideo}/>
                        </Layout.Col>}
                        {value.map((item,index)=>{
                            return(
                                <Layout.Col span="8" key={`video${index}`} className="listItem">
                                    <div style={{position: 'relative'}}>
                                        <img src={item.videoCoverUrl} width="100%"/>
                                        <div style={{display: 'block',position: 'absolute',top: 0,left: 0,height: '100%',width: '100%',cursor: 'pointer',
                                            backgroundImage: 'url(//img.alicdn.com/tfs/TB1LiOXNpXXXXbEaXXXXXXXXXXX-53-43.png)',
                                            backgroundRepeat: 'no-repeat', backgroundPosition: 'center center'}} onClick={()=>this.check(item)}/>
                                    </div>
                                    <Layout.Row gutter="0">
                                        <Layout.Col span="12">
                                            <Button onClick={()=>this.editVideo({i:index})} type="info" style={{width:'100%'}} size='mini' icon="edit">编辑</Button>
                                        </Layout.Col>
                                        <Layout.Col span="12">
                                            <Button onClick={()=>this.delVideo({i:index})} type="danger" style={{width:'100%'}} size='mini' icon="delete">删除</Button>
                                        </Layout.Col>
                                    </Layout.Row>
                                </Layout.Col>
                            )
                        })}
                    </Layout.Row>
                    <WatchVideo ref={e=>this.watchVideo=e}/>
                    {tips&&<span className="imgHint">{tips}</span>}
                    <HintShow hint={hint}/>
                    {modelSet && <Button type="primary" onClick={modelOnChenge}>{constraint.title}</Button>}
                    {openVideo&&<BundleLoading ref={e=>this.upVideo=e} load={video} constraint={constraint} callback={callback}/>}
                </Layout.Col>
            </Layout.Row>
        )
    }
}

class WatchVideo extends React.Component{
    constructor(props){
        super(props);
        this.state= {
            dialogVisible: false,
            playUrl: ''
        };
        this.open=(url)=>{
            this.setState({playUrl:url,dialogVisible:true})
        };
        this.close=()=>{
            this.setState({dialogVisible:false})
        };
    }

    render(){
        let {dialogVisible,playUrl}=this.state;
        let i=playUrl.lastIndexOf('.');
        let type = playUrl.substring(i + 1);
        return(
            <Dialog title="视频播放" size="small"
                visible={dialogVisible }
                onCancel={()=> this.setState({ dialogVisible: false })}
                lockScroll={false}>
                <Dialog.Body>
                    {playUrl&&<div style={{textAlign:'center'}}>
                        <video width="560" height="380" controls>
                            <source src={playUrl} type={"video/"+type}/>
                        </video>
                    </div>}
                </Dialog.Body>
                <Dialog.Footer className="dialog-footer">
                    <Button onClick={() =>this.setState({ dialogVisible: false})}>关闭</Button>
                </Dialog.Footer>
            </Dialog>
        )
    }
}

export default IceAddVideoModule;
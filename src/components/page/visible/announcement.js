import ReactChild from "../../lib/util/ReactChild";
import {Button} from 'element-react';

class Announcement extends ReactChild {
    render() {
        let {url} = this.props.match;
        return <div style={{
            padding: "0 auto",
            background: "rgb(117, 9, 183)",
            minHeight: "100%"
        }}>
            <div style={{width: 1180, margin: "0 auto", background: "#c89ce3"}}>
                <a href={"http://www.molimediagroup.com/index.html"}><img
                    src="https://img.alicdn.com/imgextra/i2/772901506/O1CN01Kyvhi81Mzmyzo3izB_!!772901506.jpg"/></a>
                <div style={{color: "#39094a", padding: "30px"}}>
                    <span style={{fontSize: "32px", fontWeight: 300, lineHeight: 2}}>
                                           【好消息】哇掌柜正式和茉莉传媒达成合作，后期将会加大研发的投入，推出更多实用的功能和更好的产品体验给到大家，我们新的技术团队也配套了更多岗位人员，大家可以踊跃地给我们提供建议和想法。阑意本人再次感谢各位的多年支持，愿我们在内容的这条道路上可以继续相伴，共同成长，也希望与茉莉在日后给大家创造更多的惊喜。
                    </span>
                    <div>
                        <img
                            src={"https://img.alicdn.com/imgextra/i2/772901506/O1CN012QbiYz1Mzmz3AT3Nf_!!772901506.jpg_620x10000.jpg"}
                            width={"49%"}/>
                        <img
                            src={"https://img.alicdn.com/imgextra/i4/772901506/O1CN01tBmqgS1Mzmz1zuM59_!!772901506.jpg_620x10000.jpg"}
                            width={"49%"} style={{marginLeft: "1%"}}/></div>
                    <img src={"https://img.alicdn.com/imgextra/i1/772901506/O1CN01SFxbvB1MzmyvLxKRR_!!772901506.jpg"}
                         width={"100%"}/>
                </div>


                <Button.Group style={{width: "100%"}}>
                    <Button style={{width: "50%"}} type="primary" icon="arrow-left" onClick={() => {
                        window.location.href = "http://www.molimediagroup.com/index.html";
                    }
                    }>前往茉莉</Button>
                    <Button style={{width: "50%"}} type="primary" onClick={() => {
                        window.location.href = "http://www.52wzg.com";
                    }}>前往哇掌柜 <i
                        className="el-icon-arrow-right el-icon-right"></i></Button>
                </Button.Group>
            </div>
        </div>
    }
}

export default Announcement;
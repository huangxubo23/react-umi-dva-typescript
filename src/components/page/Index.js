/**
 * Created by muqingzhong on 2018/5/6.
 */
import React from 'react'
import {Link} from 'react-router-dom';
import {ThousandsOfCall} from "../lib/util/ThousandsOfCall";

class Index extends React.Component {

    componentDidMount() {

        if (window.ipcRenderer) {
            window.ipcRenderer.send("RefreshWindow");
        } else {
            ThousandsOfCall.acoustic("", "RefreshWindow", () => {
                window.close();
            })
        }
    }

    render() {
        return <div>
            <div style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#3fa2f7",
                textAlign: "center",
                position: "relative"
            }}>
                <div style={{marginLeft: "-960px", width: "920px", position: "absolute", top: 0, left: "50%"}}>
                    <div className="img">
                        <Link to="/pc/admin/index/homePage"><img
                            src="https://img.alicdn.com/imgextra/i3/772901506/TB2stX1bBjTBKNjSZFNXXasFXXa_!!772901506.jpg"/></Link>
                    </div>
                    <div className="img">
                        <img
                            src="https://img.alicdn.com/imgextra/i1/772901506/TB2aE1gfStYBeNjSspkXXbU8VXa_!!772901506.jpg"/>
                    </div>
                    <div className="img">
                        <img
                            src="https://img.alicdn.com/imgextra/i1/772901506/TB2cX0UbCcqBKNjSZFgXXX_kXXa_!!772901506.jpg"/>
                    </div>
                    <div className="img">
                        <img
                            src="https://img.alicdn.com/imgextra/i2/772901506/TB2.q.HfqSWBuNjSsrbXXa0mVXa_!!772901506.jpg"/>
                    </div>
                    <div className="img">
                        <img
                            src="https://img.alicdn.com/imgextra/i3/772901506/TB2cuhTbwKTBuNkSne1XXaJoXXa_!!772901506.jpg"/>
                    </div>
                    <div className="img">
                        <img
                            src="https://img.alicdn.com/imgextra/i4/772901506/TB2WPU_fACWBuNjy0FaXXXUlXXa_!!772901506.jpg"/>
                    </div>
                    <div className="img">
                        <img
                            src="https://img.alicdn.com/imgextra/i1/772901506/TB2qTkGfr1YBuNjSszeXXablFXa_!!772901506.jpg"/>
                    </div>
                    <div className="img">
                        <img
                            src="https://img.alicdn.com/imgextra/i1/772901506/TB2K2WnbDdYBeNkSmLyXXXfnVXa_!!772901506.jpg"/>
                    </div>
                    <div className="img">
                        <img
                            src="https://img.alicdn.com/imgextra/i1/772901506/TB2TDQGfr1YBuNjSszeXXablFXa_!!772901506.jpg"/>
                    </div>
                    <div className="img">
                        <img
                            src="https://img.alicdn.com/imgextra/i4/772901506/O1CN01JOkpSt1Mzmxdt94zB_!!772901506.jpg"/>
                    </div>
                    <div className="img">
                        <img
                            src="https://img.alicdn.com/imgextra/i1/772901506/TB2J8NafH9YBuNjy0FgXXcxcXXa_!!772901506.jpg"/>
                    </div>
                    <div className="img">
                        <img
                            src="https://img.alicdn.com/imgextra/i2/772901506/TB2YpFdbrwrBKNjSZPcXXXpapXa_!!772901506.jpg"/>
                    </div>
                    <div className="img">
                        <img
                            src="https://img.alicdn.com/imgextra/i3/772901506/O1CN01t7jZnV1MzmxgqdV6m_!!772901506.jpg"/>
                    </div>
                </div>
                <div style={{clear: "none"}}></div>
            </div>
        </div>
    }
}

Index.defaultProps = {};

export default Index;

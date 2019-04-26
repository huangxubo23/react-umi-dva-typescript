/**
 * Created by linhui on 17-7-24.广告
 */


import React from 'react';
import  {Carousel} from 'react-bootstrap'
import piaoliu from '../../../images/forum/20170818.jpg';
import che from '../../../images/forum/3.jpg';
import liu from '../../../images/forum/13.jpg';
import wzg4 from '../../../images/index/wzg4.jpg';
//广告
class Advertisement extends  React.Component{
    render(){
        return(
            <div>
                <Carousel>
                    <Carousel.Item>
                        <img style={{height:'250px',width:'1633px'}}  src={wzg4} />
                        {/*<Carousel.Caption>
                         <h3>标题</h3>
                         <p>说明`````````````````</p>
                         </Carousel.Caption>*/}
                    </Carousel.Item>
                    {/*<Carousel.Item>
                        <img  style={{height:'200px',width:'1587px'}}  alt="900x200" src={liu} />
                         <Carousel.Caption>
                         <h3>标题</h3>
                         <p>说明`````````````````</p>
                         </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img style={{height:'200px',width:'1587px'}}  src={che} />
                        <Carousel.Caption>
                         <h3>标题</h3>
                         <p>说明`````````````````</p>
                         </Carousel.Caption>
                    </Carousel.Item>*/}
                </Carousel>
                <br/>
            </div>
        )
    }
}
export default Advertisement;
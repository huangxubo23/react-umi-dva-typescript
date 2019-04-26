/**
 * Created by Administrator on 2017/6/30.分页
 */
import React from 'react';
const jQuery = require('jquery');
const $ = jQuery;
require("../../../styles/component/react_assembly/paging.css");

import  {Pagination,Button} from "react-bootstrap";
//分页
class Paging extends React.Component{
  goPage =(env)=> {
    let l = $(env.target);
    let gopage = l.data('gopage');
    this.props.goPage(gopage);
  };
  render () {
    let lis = [];
    let pageNow = this.props.pageNow;
    let pageSize = this.props.pageSize;
    let count = this.props.count;
    let pageCount = 1;
    if (count != 0) {
      pageCount = Math.floor((count - 1) / pageSize) + 1;
    }
    if (pageNow == 1) {
      lis.push({num: '<<', className: 'unavailable'});
    } else {
      lis.push({num: '<<', className: '', go: pageNow - 1});
    }

    if (pageNow < 4) {
      for (let i = 1; i <= pageNow; i++) {
        if (i == pageNow) {
          lis.push({num: i, className: 'current'});
        } else {
          lis.push({num: i, className: '', go: i});
        }
      }

    } else {
      lis.push({num: 1, className: '', go: 1});
      lis.push({num: '.....', className: 'unavailable'});
      lis.push({num: pageNow - 1, className: '', go: pageNow - 1});
      lis.push({num: pageNow, className: 'current'});
    }

    if (pageNow == pageCount) {
      lis.push({num: '>>', className: 'unavailable'});
    } else {

      if (pageCount - pageNow > 3) {
        lis.push({num: pageNow + 1, className: '', go: pageNow + 1});
        lis.push({num: '.....', className: 'unavailable'});
        lis.push({num: pageCount, className: '', go: pageCount});
      } else {
        for (let i = pageNow + 1; i <= pageCount; i++) {
          lis.push({num: i, className: '', go: i});
        }
      }
      if (pageCount == pageNow) {
        lis.push({num: '>>', className: 'unavailable'});
      } else {
        lis.push({num: '>>', className: '', go: pageNow + 1});
      }

    }

    return ( <ul className='pagination'>
      {lis.map(function (item, i) {
        return (
          <li key={'paging' + item.num + '-' + pageNow} className={item.className}>
            <a data-gopage={item.go}
               onClick={this.goPage}
               href='#'>{item.num}</a>
          </li>
        );
      }, this)}
    </ul>);
  }
}

class Paging2 extends React.Component{
    constructor(props) {
        super(props);
        this.state = {jump: ''};
    }
    jumpChange=(env)=> {
        let jump = env.target.value;
        this.setState({jump: jump});
    };
    goJump = ()=> {
        let jump = this.state.jump;
        this.props.goPage(jump);
    };
    goPage =(env)=> {
        let l = $(env.target);
        let gopage = l.data('gopage');
        this.props.goPage(gopage);
    };
    render () {
        let lis = [];
        let pageNow = this.props.pageNow;
        let pageSize = this.props.pageSize;
        let count = this.props.count;
        let currentLayer = this.props.currentLayer;
        let pageCount = 1;
        if (count != 0) {
            pageCount = Math.floor((count - 1) / pageSize) + 1;
        }
        if (pageNow == 1) {
            lis.push({num: '<<', className: 'unavailable'});
        } else {
            lis.push({num: '<<', className: '', go: pageNow - 1});
        }

        if (pageNow < 4) {
            for (let i = 1; i <= pageNow; i++) {
                if (i == pageNow) {
                    lis.push({num: i, className: 'current'});
                } else {
                    lis.push({num: i, className: '', go: i});
                }
            }

        } else {
            lis.push({num: 1, className: '', go: 1});
            lis.push({num: '.....', className: 'unavailable'});
            lis.push({num: pageNow - 1, className: '', go: pageNow - 1});
            lis.push({num: pageNow, className: 'current'});
        }

        if (pageNow == pageCount) {
            lis.push({num: '>>', className: 'unavailable'});
        } else {

            if (pageCount - pageNow > 3) {
                lis.push({num: pageNow + 1, className: '', go: pageNow + 1});
                lis.push({num: '.....', className: 'unavailable'});
                lis.push({num: pageCount, className: '', go: pageCount});
            } else {
                for (let i = pageNow + 1; i <= pageCount; i++) {
                    lis.push({num: i, className: '', go: i});
                }
            }
            if (pageCount == pageNow) {
                lis.push({num: '>>', className: 'unavailable'});
            } else {
                lis.push({num: '>>', className: '', go: pageNow + 1});
            }

        }

        return ( <ul className='pagination' key={currentLayer}>
            {lis.map(function (item, i) {
                return (
                    <li key={'paging' + item.num + '-' + pageNow} className={item.className}>
                      <a data-gopage={item.go}
                         onClick={this.goPage}
                         href='#'>{item.num}</a>
                    </li>
                );
            }, this)}
          <li className="pageJumpHead">
            <span className="pageJumpHead_text">跳到</span>
            <input type="text" className="pageJump" value={this.state.jump} onChange={this.jumpChange}/>
            <span className="pageJumpHead_text">页</span>&nbsp;&nbsp;
            <button className="pageJumpButton" onClick={this.goJump}>确定</button>
          </li>
        </ul>);
    }
}

class Paging3 extends React.Component{

    constructor (props) {
        super(props);
        this.state = {
            pageNow: 1,
        }
    }
    handleSelect=(eventKey)=> {
        this.setState({
            pageNow: eventKey
        });
        this.props.goPage(eventKey);
    };

    render() {
        let pageSize = this.props.pageSize;
        let count = this.props.count;
        let pageCount = 1;
        if (count != 0) {
            pageCount = Math.floor((count - 1) / pageSize) + 1;
        }
        return (
            <Pagination
                prev
                next
                first
                last
                ellipsis
                boundaryLinks
                items={pageCount}
                maxButtons={5}
                activePage={this.state.pageNow}
                onSelect={this.handleSelect} />
        );
    }
}
class PagingReply extends React.Component{

    constructor (props) {
        super(props);
        this.state = {
            pageNow: 1,
        }
    }
    handleSelect=(eventKey)=> {
        this.setState({
            pageNow: eventKey
        });
        this.props.goPage(eventKey);
    };

    render() {
        let pageSize = this.props.pageSize;
        let count = this.props.count;
        let pageCount = 1;
        if (count != 0) {
            pageCount = Math.floor((count - 1) / pageSize) + 1;
        }
        return (
            <Pagination
                bsSize="small"
                prev
                next
                first
                last
                ellipsis
                boundaryLinks
                items={pageCount}
                maxButtons={5}
                activePage={this.state.pageNow}
                onSelect={this.handleSelect} />
        );
    }
}
class Paging4 extends React.Component{

    constructor (props) {
        super(props);
        this.state = {
            pageNow: 1,
            jumpPage:undefined,
        }
    }
    jumpChange=(env)=> {
        let page = env.target.value;
        let jumpPage=parseInt(page);
        this.setState({jumpPage: jumpPage});
    };
    goJump=()=> {
        let pageNow = this.state.jumpPage;
        this.setState({pageNow: pageNow});
        this.props.goPage(pageNow);
    };
    handleSelect=(eventKey)=> {
        this.setState({
            pageNow: eventKey
        });
        this.props.goPage(eventKey);
    };
    render() {
        let pageSize = this.props.pageSize;
        let count = this.props.count;
        let pageCount = 1;
        if (count != 0) {
            pageCount = Math.floor((count - 1) / pageSize) + 1;
        }
        return (
            <div>
                <Pagination
                    prev
                    next
                    first
                    last
                    ellipsis
                    boundaryLinks
                    items={pageCount}
                    maxButtons={5}
                    activePage={this.state.pageNow}
                    onSelect={this.handleSelect}/>
                <div className="pageJumpHead">
                    <span className="pageJumpHead_text">跳到</span>
                    <input type="number" className="pageJump" value={this.state.jump} onChange={this.jumpChange}/>
                    <span className="pageJumpHead_text">页</span>&nbsp;&nbsp;
                    <Button type="button" bsSize="small" className="jumpButton" onClick={this.goJump}>确定</Button>
                </div>
            </div>
        );
    }
}
class CommodityPaging extends React.Component{

    constructor (props) {
        super(props);
        this.state = {
            pageNow: 1,
        }
    }
    handleSelect=(eventKey)=> {
        this.setState({
            pageNow: eventKey
        });
        this.props.goPage(eventKey);
    };
    changePageNow=(e)=>{
        this.setState({
            pageNow: e
        });
    };
    jumpChange=(env)=> {
        let page = env.target.value;
        let jumpPage=parseInt(page);
        this.setState({jumpPage: jumpPage});
    };
    goJump=()=> {
        let pageNow = this.state.jumpPage;
        this.setState({pageNow: pageNow});
        this.props.goPage(pageNow);
    };
    render() {
        let pageSize = this.props.pageSize;
        let count = this.props.count;
        let pageCount = 1;
        if (count != 0) {
            pageCount = Math.floor((count - 1) / pageSize) + 1;
        }
        return (
            <div>
                <Pagination
                    prev
                    next
                    ellipsis
                    boundaryLinks
                    items={pageCount}
                    maxButtons={5}
                    activePage={this.state.pageNow}
                    onSelect={this.handleSelect} className="commodity"/>
                <div style={{width:"200px",float:"right",marginRight:"66px"}}>
                    <span className="pageJumpHead_text">跳到</span>
                    <input type="number" className="pageJump" value={this.state.jump} onChange={this.jumpChange}/>
                    <span className="pageJumpHead_text">页</span>&nbsp;&nbsp;
                    <Button type="button" bsSize="small" className="jumpButton" onClick={this.goJump}>确定</Button>
                </div>
            </div>
        );
    }
}


export {Paging,Paging2,Paging3,PagingReply,Paging4,CommodityPaging};

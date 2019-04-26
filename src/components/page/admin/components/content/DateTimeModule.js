
import React from 'react';
import  {
    Col,
    FormGroup,
    ControlLabel,
    Alert,
    Row,
    FormControl
} from "react-bootstrap";
import $ from 'jquery';

class DateTimeModule extends React.Component{
    constructor(props) {
        super(props);
        let date = new Date();
        let {constraint,value}=this.props;
        let name=constraint.title=="开始时间"?"start":"end";
        this.state = {
            [name]: value?value:date.getFullYear() + "-" + ((date.getMonth() + 1)<10?"0"+(date.getMonth() + 1):(date.getMonth() + 1)) + "-" + ((date.getDate()+(name=="start"?0:1))<10?"0"+(date.getDate()+(name=="start"?0:1)):(date.getDate()+(name=="start"?0:1)))+" "+(date.getHours()<10?"0"+date.getHours():date.getHours())+":"+(date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes())+":00",
            //[name+"1"]:date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
        }
    }
    componentDidMount(){
        let {constraint,onChange}=this.props;
        let checkIn = $("#chooseInput"+(constraint.title=="开始时间"?"Start":"End")).datetimepicker({
            format: 'yyyy-mm-dd hh:ii:ss',
            minView: 0,
            language: 'zh-CN',
            autoclose: true,
        }).on("changeDate", (ev) => {
            let type = $(ev.target).data("type");
            let d = ev.date;
            this.setState({start: d.getFullYear() + "-" + ((d.getMonth() + 1)<10?"0"+(d.getMonth() + 1):(d.getMonth() + 1)) + "-" + (d.getDate()<10?"0"+d.getDate():d.getDate())+" "+(d.getHours()<10?"0"+d.getHours():d.getHours())+":"+(d.getMinutes()<10?"0"+d.getMinutes():d.getMinutes())+":00"},()=>{
                if(constraint.title=="开始时间"){
                    onChange(constraint,this.state.start);
                }else {
                    onChange(constraint,this.state.end);
                }
            });
        }).data('datepicker');
        /*let checkIn1 = $("#chooseInput"+(constraint.title=="开始时间"?"Start1":"End1")).datetimepicker({
            timeFormat: 'hh:ii:ss',
            minView: 'minute',
            language: 'zh-CN',
            autoclose: true,
        }).on("changeDate", (ev) => {
            let type = $(ev.target).data("type");
            let d = ev.date;
            this.setState({start: d.getHours() + "-" + d.getMinutes() + "-" + (d.getSeconds())});
        }).data('datepicker');*/
    }

    render(){
        let {constraint,value}=this.props;
        return(
            <Row>
                <FormGroup>
                    <Col sm={1}>
                        {constraint.title}
                    </Col>
                    <Col sm={11}>
                        <FormControl type="text" id={"chooseInput"+(constraint.title=="开始时间"?"Start":"End")} placeholder={constraint.props.label}
                                     onChange={() => {}} value={this.state.start||this.state.end} className="chooseInput"
                                     data-type={constraint.title=="开始时间"?"Start":"End"} style={{maxWidth:"300px",marginBottom:'10px'}}/>
                        {/*<FormControl type="text" id={"chooseInput"+(constraint.title=="开始时间"?"Start1":"End1")} placeholder={constraint.props.label}
                                     onChange={() => {}} value={this.state.start1||this.state.end1} className="chooseInput"
                                     data-type={constraint.title=="开始时间"?"Start1":"End1"} style={{maxWidth:"300px",marginBottom:'10px',marginLeft:"10px"}}/>*/}
                    </Col>
                </FormGroup>
            </Row>
        )
    }
}

export default DateTimeModule;

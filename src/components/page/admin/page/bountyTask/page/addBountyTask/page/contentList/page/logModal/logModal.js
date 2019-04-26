/**
 * Created by linhui on 18-07-05.赏金任务内容列表拒绝理由模态
 */
import ReactChild from "../../../../../../../../../../lib/util/ReactChild";
import {infoNoty} from "../../../../../../../../../../lib/util/global";
import {ajax} from "../../../../../../../../../../lib/util/ajax";
import {
    Button,
    Col,
    Form,
    FormGroup,
    ControlLabel,
    FormControl,
    Modal,
} from "react-bootstrap";

class AdoptModal extends ReactChild {

    constructor(props){
        super(props);
        this.state={
            logModal:true,
        }
    }

    openModal = (env) => {//打开拒绝模态
        let logContents = this.props.logContents;
        this.setState({contents:logContents,logModal: true});
    };


    closeModal = () => {//关闭拒绝模态
        this.setState({logModal: false});
    };

    refuseLogChange = (env) => {//拒绝理由改变事件
        let log = env.target.value;
        this.setState({log: log});
    };

    refuseClick = () => {//拒绝按钮
        let [contents, log] = [this.state.contents, this.state.log];
        let [id, conState] = [contents.id, contents.conState];
        ajax.ajax({
            type: 'post',
            url: '/mission/admin/supOrgTask/upContentsBytaskState.io',
            data: {conlog: log, taskState: -1, id: id, conState: conState},
            callback: (json) => {
                infoNoty('操作成功', 'success');
                this.closeModal();
                this.props.examineGoPage();
            }
        });
    };
    render(){
        return(
            <Modal show={this.state.logModal} bsSize="large" onHide={this.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>拒绝理由</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form horizontal>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={3}>
                                拒绝理由
                            </Col>
                            <Col sm={9}>
                                <FormControl componentClass='textarea' data-name="typeTab" value={this.state.log} onChange={this.refuseLogChange}/>
                            </Col>
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle='primary' onClick={this.refuseClick}>拒绝</Button>
                    <Button bsStyle='danger' onClick={this.closeModal}>关闭</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default AdoptModal;
/**
 * Created by muqingzhong on 2018/5/9.
 */
import React from "react";
import {
    Dialog, Loading, Button
} from 'element-react';
import adminMenuContainer from "./components/page/admin/components/AdminMenu";

class BundleLoading extends React.Component { // 给没有路由然后需要动态加载用的

    constructor(props) {
        super(props);
        this.state = {
            jd: undefined
        }
    }

    componentWillMount() {
    }

    getJd = () => {
        return this.jd;
    };

    render() {
        let thisCon = this;
        return (
            <Bundle load={this.props.load}>
                {(JD) => <JD ref={e => thisCon.jd = e} {...this.props}/>}
            </Bundle>
        )
    }

}

const loading = (container, pr) => { //给路由用的
    return (props) => {
        return (
            <Bundle load={container}>
                {(List) => <List {...props} {...pr} />}
            </Bundle>
        )
    }
};


class Bundle extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            // short for "module" but that's a keyword in js, so "mod"
            mod: null
        }
    }

    componentWillMount() {
        this.load(this.props)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.load !== this.props.load) {
            this.load(nextProps)
        }
    }

    load(props) {
        this.setState({
            mod: null
        })
        props.load((mod) => {
            this.setState({
                // handle both es imports and cjs
                mod: mod.default ? mod.default : mod
            })
        })
    }

    render() {
        if (!this.state.mod)
            return <Loading>
                <div style={{width: "100%", height: "100%"}}>加载中。。</div>
            </Loading>

        let Mod = this.state.mod;
        return this.props.children(this.state.mod);
    }
}


class DialogBundle extends React.Component {

    constructor(props) {
        super(props);
        this.state = {dialogVisible: false}
    }

    open = (start,callback) => {
        this.setState({dialogVisible: true}, () => {
            this.setBunState(start,()=>{if(callback){callback()}});
        })
    }

    setBunState = (state,callback) => {
        this.getBun((bun) => {
            bun.setState(state,()=>{if(callback){callback()}});
        })
    }

    getBun = (callback) => {

        let upload = setInterval(() => {
            let bun = this.bun;
            if (bun && bun.jd) {
                clearInterval(upload);
                callback(bun.jd);
            }
        }, 100);
    }

    render() {
        return <Dialog   {...this.props.dialogProps}
                         visible={this.state.dialogVisible}
                         onCancel={() => this.setState({dialogVisible: false})}>
            <Dialog.Body>
                {this.state.dialogVisible && <BundleLoading ref={e => this.bun = e}  {...this.props.bundleProps}/>}
            </Dialog.Body>
            <Dialog.Footer className="dialog-footer">
                {this.props.dialogFooter}
            </Dialog.Footer>
        </Dialog>


    }

}

export {BundleLoading, loading, Bundle, DialogBundle};

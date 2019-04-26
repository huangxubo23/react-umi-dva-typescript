import React from "react";

/**
 * Created by 林辉 on 2018/11/26 9:52.面板
 */

class NewPanel extends React.Component {
    render() {
        let {header} = this.props;
        return (
            <div style={{
                marginTop: "10px",
                marginBottom: '12px',
                backgroundColor: '#fff',
                border: '1px solid transparent',
                borderRadius: '4px',
                boxShadow: '0 1px 1px rgba(0, 0, 0, .05)',
                borderColor: this.props.bodyBorderColor ? this.props.bodyBorderColor:'#bce8f1'
            }}>
                <div style={{
                    padding: '1px 10px',
                    borderBottom: '1px solid transparent',
                    borderTopLeftRadius: '3px',
                    borderTopRightRadius: '3px',
                    color: this.props.color ? this.props.color : '#4E7B8F',
                    backgroundColor: this.props.backgroundColor ? this.props.backgroundColor : '#d9edf7',
                    borderColor: this.props.titleBorderColor ? this.props.titleBorderColor : '#bce8f1',
                }}>
                    <h4>{header}</h4>
                </div>
                <div style={{
                    padding: '10px',
                }}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default NewPanel;
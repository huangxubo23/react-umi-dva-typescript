import React from "react";

class ReactChild extends React.Component {

    componentDidMount() {
        let location = this.props.location;
        if (location) {
            window.postMessage({"urlChange": location.pathname + location.search + location.hash,"type":"urlChange"}, document.URL);
        }
    }



    componentWillReceiveProps(newProps) {
        let location = newProps.location;
        if (location) {
            window.postMessage({"urlChange": location.pathname + location.search + location.hash,"type":"urlChange"}, document.URL);
        }
    }
}

export default ReactChild
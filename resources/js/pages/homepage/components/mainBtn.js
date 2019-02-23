import React, { Component } from "react";

class MainBtn extends Component {
    render() {
        const { text } = this.props;
        return (
            <a className="mainBtn" href="/albums">
                {text}
            </a>
        );
    }
}

export default MainBtn;

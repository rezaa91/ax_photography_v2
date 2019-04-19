import React, { Component } from "react";

/**
 * props:
 * 1: text - to display
 * 2: btnClasses - styling class names
 * 3: onClick - method to run when button clicked
 */
class Btn extends Component {
    onClick = () => {
        this.props.onClick();    
    }

    render() {
        const { text, classes } = this.props;
        const btnClasses = `${classes} btn-component`;

        return <button onClick={this.onClick} className={btnClasses}>{text}</button>;
    }
}

export default Btn;

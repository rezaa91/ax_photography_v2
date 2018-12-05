import React, { Component } from 'react';

class Btn extends Component {
    render() {
        const {text, classes} = this.props;
        const btnClasses = `${classes} btn-component`;
        
        return(
            <button className={btnClasses}>
                {text}
            </button>
        );
    }
}

export default Btn;

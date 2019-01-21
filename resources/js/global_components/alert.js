import React, { Component } from 'react';

/**
 * This class takes 2 props:
 * message - the message to display in the alert
 * resetState - to reset any state, this is fired when the alert is closed
 */
class Alert extends Component {
    constructor() {
        super();

        this.state = {
            displayAlert: true
        }
    }

    closeAlert = () => {
        const {resetState} = this.props;
        this.setState({displayAlert: false});
        resetState();
    }
    
    render() {
        const {displayAlert} = this.state;
        const {message} = this.props;

        return(
            <div>
                {displayAlert &&
                
                <div className="outer-modal-wrapper">
                    <div className="middle-modal-wrapper">

                        <div className='modal-wrapper'>
                            <div className='modal-head'>
                                <span className='close-btn' onClick={this.closeAlert}>&times;</span>
                            </div>

                            <div className='modal-content'>
                                <p>{message}</p>
                            </div>
                        </div>

                    </div>
                </div>

                }
            </div>
        );
    }
}

export default Alert;

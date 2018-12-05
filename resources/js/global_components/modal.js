import React, { Component } from 'react';
import Btn from './btn';

class Modal extends Component {
    constructor() {
        super();

        this.state = {
            displayModal: true
        }

        this.closeModal = this.closeModal.bind(this);
        this.action = this.action.bind(this);
    }

    closeModal() {
        const {resetState} = this.props;
        this.setState({displayModal: false});
        resetState(); //passed from parent and should reset any state passed when <Modal /> used
    }

    action() {
        const {action} = this.props;
        action(); //this method is passed from parent and should action what happens when user clicks 'yes'
    }

    render() {
        const {message, action} = this.props;
        const {displayModal} = this.state;

        return(
            <div>
                {displayModal &&
                <div className="outer-modal-wrapper">
                    <div className="middle-modal-wrapper">

                        <div className='modal-wrapper'>
                            <div className='modal-head'>
                                <span className='close-btn' onClick={this.closeModal}>&times;</span>
                            </div>

                            <div className='modal-content'>
                                <p>{message}</p>
                                <div className="modal-buttons">
                                    <div className='btn-wrapper'>
                                        <span onClick={this.action}>
                                            <Btn text="Yes" classes="btn-default" />                                        
                                        </span>
                                    </div>
                                    <div className='btn-wrapper'>
                                        <span onClick={this.closeModal}>
                                            <Btn text="No" classes="btn-green" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                }
            </div>
        );
    }
}

export default Modal;

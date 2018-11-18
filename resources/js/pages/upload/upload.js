import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Form from './components/form';

class Upload extends Component {
    render() {
        return(
            <div className = 'upload-wrapper'>
                <div className = 'title'>
                    <h1>Upload Images</h1>
                </div>
                <Form />
            </div>
        );
    }
}

if (document.getElementById('upload')) {
    ReactDOM.render(<Upload />, document.getElementById('upload'));
}

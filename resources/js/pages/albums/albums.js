import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Albums extends Component {
    render() {
        return(
            <div>
                
            </div>
        )
    }
}

if (document.getElementById('albums')) {
    ReactDOM.render(<Albums />, document.getElementById('albums'));
}

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Contact extends Component {
    render() {
        return(
            <div>
                
            </div>
        )
    }
}

if (document.getElementById('contact')) {
    ReactDOM.render(<Contact />, document.getElementById('contact'));
}

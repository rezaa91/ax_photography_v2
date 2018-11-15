import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class About extends Component {
    render() {
        return(
            <div>
                
            </div>
        )
    }
}

if (document.getElementById('about')) {
    ReactDOM.render(<About />, document.getElementById('about'));
}

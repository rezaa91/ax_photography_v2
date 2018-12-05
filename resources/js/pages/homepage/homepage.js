import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import MainBtn from './components/mainBtn';

class Homepage extends Component {
    render() {
        return(
            <div className='homepage-wrapper'>
                <div>
                    <div className = 'homepage-header'>
                        <h1>AX PHOTOGRAPHY</h1>
                        <h3>- THE BEST OF THE BEST -</h3>
                        <MainBtn text="View Gallery" />
                    </div>
                </div>
            </div>
        )
    }
}

if (document.getElementById('homepage')) {
    ReactDOM.render(<Homepage />, document.getElementById('homepage'));
}

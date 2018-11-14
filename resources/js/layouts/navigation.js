import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Navigation extends Component {
    render() {
        return(
            <div>
                <ul>
                    <li><a href='/'>AX PHOTOGRAPHY</a></li>
                    <li><a href='/albums'>Albums</a></li>
                    <li><a href='/about'>About</a></li>
                    <li><a href='/contact'>Contact</a></li>
                </ul>

                <ul>
                    <li><a href='/login'>Login</a></li>
                </ul>
            </div>
        );
    }
}

ReactDOM.render(<Navigation />, document.getElementById('nav'));

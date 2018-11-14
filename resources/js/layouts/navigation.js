import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Navigation extends Component {
    constructor() {
        super();

        //check if user is in session
        const user = this.getUser();

        this.state = {
            isLoggedIn: false,
            user_id: null,
            name: null,
            email: null,
            created_at: null
        }
        
        //bind methods
        this.getUser = this.getUser.bind(this);
        this.displayLoginOrUser = this.displayLoginOrUser.bind(this);
    }

    async getUser() {
        //find user in session through api
        await fetch('/user')
        .then(response => response.json())
        .then(data => {
            data = data.data;
            
            if (data.length === 0) {
                return;
            }

            this.setState({
                isLoggedIn: true,
                user_id: data.id,
                name: data.name,
                email: data.email,
                created_at: data.created_at
            })            
        })
    }

    displayLoginOrUser() {
        const {isLoggedIn, name} = this.state;

        if (!isLoggedIn) {
            return(
                <li><a href='/login'>Login</a></li>
            );
        } else {
            return(
                <li><a href='/dashboard'>{name}</a></li>
            );
        }
    }

    render() {
        const {user_id, name, email, created_at} = this.state;
        return(
            <div className="navigation-wrapper">
                <ul className="navigation navigation-left">
                    <li className="nav-title"><a href='/'>AX PHOTOGRAPHY</a></li>
                    <li><a href='/albums'>Albums</a></li>
                    <li><a href='/about'>About</a></li>
                    <li><a href='/contact'>Contact</a></li>
                </ul>

                <ul className="navigation navigation-right">
                    {this.displayLoginOrUser()}
                </ul>
            </div>
        );
    }
}

ReactDOM.render(<Navigation />, document.getElementById('nav'));

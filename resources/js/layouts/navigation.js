import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Navigation extends Component {
    constructor() {
        super();

        //check if user is in session
        this.getUser();

        this.state = {
            isLoggedIn: true,
            user_id: null,
            name: null,
            email: null,
            created_at: null
        }
        
        //bind methods
        this.getUser = this.getUser.bind(this);
        this.displayLoginOrUser = this.displayLoginOrUser.bind(this);
    }

    componentDidMount() {
        this.getUser();
    }

    componentDidUpdate() {
        this.getUser(); 
    }

    async getUser() {
        //find user in session through api
        await fetch('/api/user')
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
        .catch(() => {
            this.setState({
                isLoggedIn: false,
                user_id: null,
                name: null,
                email: null,
                created_at: null
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
                    <li><a href='/albums' className = 'main-link'>Albums</a></li>
                    <li><a href='/about' className = 'main-link'>About</a></li>
                    <li><a href='/contact' className = 'main-link'>Contact</a></li>
                </ul>

                <ul className="navigation navigation-right">
                    {this.displayLoginOrUser()}
                </ul>
            </div>
        );
    }
}

if (document.getElementById('nav')) {
    ReactDOM.render(<Navigation />, document.getElementById('nav'));
}

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Navigation extends Component {
    constructor() {
        super();

        //check if user is in session
        this.getUser();

        this.state = {
            isLoggedIn: false,
            user_id: null,
            name: null,
            email: null,
            created_at: null,
            isDropdownPresent: false
        }
        
        //bind methods
        this.getUser = this.getUser.bind(this);
        this.displayLoginOrUser = this.displayLoginOrUser.bind(this);
        this.toggleUserDropdownMenu = this.toggleUserDropdownMenu.bind(this);
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
                <li><a href='#' onClick = {(e) => this.toggleUserDropdownMenu(e)}>{name}</a></li>
            );
        }
    }

    toggleUserDropdownMenu(e) {
        const {isDropdownPresent} = this.state;

        // prevent duplicates of dropdown menu being shown
        if (isDropdownPresent) {
            e.target.nextElementSibling.remove();
            this.setState({isDropdownPresent: false});
        } else {
            const dropDownMenu = `
                <ul className='user-dropdown-menu'>
                    <li><a href="/dashboard">Dashboard</a></li>
                    <li><a href="/upload">Upload</a></li>
                    <li><a href="/logout">Logout</a></li>
                </ul>
            `;

            e.target.insertAdjacentHTML('afterend', dropDownMenu);

            this.setState({isDropdownPresent: true});
        }
    }

    render() {
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

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Navigation extends Component {
    constructor() {
        super();

        //check if user is in session
        this.getUser();

        this.state = {
            isLoggedIn: false,
            user: null,
            isDropdownPresent: false,
            rotateArrowClass: null
        }
        
        //bind methods
        this.getUser = this.getUser.bind(this);
        this.displayLoginOrUser = this.displayLoginOrUser.bind(this);
        this.toggleUserDropdownMenu = this.toggleUserDropdownMenu.bind(this);
        this.hideUserDropdownMenu = this.hideUserDropdownMenu.bind(this);
    }

    /**
     * Get logged in user through API call
     */
    async getUser() {
        //find user in session through api
        await fetch('/api/user')
        .then(response => response.status === 200 && response.json())
        .then(data => {
            data = data.data;
            
            if (!data) {
                return;
            }

            this.setState({
                isLoggedIn: true,
                user: {
                    id: data.id,
                    username: data.username,
                    name: data.name,
                    email: data.email,
                    created_at: data.created_at,
                    isAdmin: data.isAdmin
                }
            })            
        })
        .catch((error) => {
            this.setState({
                isLoggedIn: false,
                user: null
            })
        })
    }

    /**
     * If user is logged in then display username with dropdown menu for user links
     * Otherwise display login link
     */
    displayLoginOrUser() {
        const {isLoggedIn, user, rotateArrowClass, isDropdownPresent} = this.state;
        
        if (!isLoggedIn) {
            return(
                <li><a href='/login'>Login</a></li>
            );
        } else {
            const arrowClasses = `${rotateArrowClass} fas fa-arrow-circle-down rotate-arrow`;
            const usernameClass = isDropdownPresent ? 'user-clicked' : '';
            
            let dropdownMenu;
            
            // display different dropdown menus dependent on whether user is an administrator or not
            if (isDropdownPresent) {
                if (user.isAdmin) {
                    dropdownMenu = <ul className='user-dropdown-menu'>
                        <li><a href="/user">Dashboard</a></li>
                        <li><a href="/upload">Upload</a></li>
                        <li><a href="/logout">Logout</a></li>
                    </ul>
                } else {
                    dropdownMenu = <ul className='user-dropdown-menu'>
                        <li><a href="/user">Dashboard</a></li>
                        <li><a href="/logout">Logout</a></li>
                    </ul>
                }
            }                

            return(
                <li className = {usernameClass}>
                    <i id="arrow" className={arrowClasses}></i>
                    <a href='#' onClick = {this.toggleUserDropdownMenu}>{user.username}</a>
                    {dropdownMenu}
                </li>
            );
        }
    }

    /**
     * Toggle the user dropdown menu
     */
    toggleUserDropdownMenu() {
        const {isDropdownPresent} = this.state;

        // prevent duplicates of dropdown menu being shown
        if (isDropdownPresent) {
            this.setState({isDropdownPresent: false, rotateArrowClass: 'rotate-down'});
        } else {
            this.setState({rotateArrowClass: 'rotate-up'})
            this.setState({isDropdownPresent: true});
        }
    }

    hideUserDropdownMenu() {
        this.setState({isDropdownPresent: false});
    }

    render() {
        return(
            <div className="navigation-wrapper" onMouseLeave={this.hideUserDropdownMenu}>
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

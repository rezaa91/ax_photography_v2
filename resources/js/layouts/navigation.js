import React, { Component } from "react";
import ReactDOM from "react-dom";

class Navigation extends Component {
    constructor(props) {
        super(props);

        //check if user is in session
        this.getUser();

        this.state = {
            notificationCount: props.notificationCount,
            isLoggedIn: false,
            user: null,
            isDropdownPresent: false,
            rotateArrowClass: null
        }
    }

    componentDidUpdate() {
        // Apply class to the navigation links to show which page the user is currently on
        const mainNavLinks = [...document.querySelectorAll(".main-link")];

        mainNavLinks.map(link => {
            const url = window.location.href;
            url.match(link)
                ? link.classList.add("active")
                : link.classList.remove("active");
        });
    }

    /**
     * Get logged in user through API call
     */
    getUser = async () => {
        //find user in session through api
        await fetch("/api/user")
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
                });
            })
            .catch(() => {
                this.setState({
                    isLoggedIn: false,
                    user: null
                });
            });
    }

    /**
     * If user is logged in then display username with dropdown menu for user links
     * Otherwise display login link
     */
    displayLoginOrUser = () => {
        const {isLoggedIn, user, rotateArrowClass, isDropdownPresent} = this.state;
        
        if (!isLoggedIn) {
            return (
                <li>
                    <a href="/login">Login</a>
                </li>
            );
        } else {
            const arrowClasses = `${rotateArrowClass} fas fa-arrow-circle-down rotate-arrow`;
            const usernameClass = isDropdownPresent ? "user-clicked" : "";

            let dropdownMenu;

            // display different dropdown menus dependent on whether user is an administrator or not
            if (isDropdownPresent) {
                if (user.isAdmin) {
                    dropdownMenu = (
                        <ul className="user-dropdown-menu">
                            <li>
                                <a href="/user">Dashboard {this.displayUnacknowledgedNotifications()}</a>
                            </li>
                            <li>
                                <a href="/upload">Upload</a>
                            </li>
                            <li>
                                <a href="/settings">Settings</a>
                            </li>
                            <li>
                                <a href="/logout">Logout</a>
                            </li>
                        </ul>
                    );
                } else {
                    dropdownMenu = (
                        <ul className="user-dropdown-menu">
                            <li>
                                <a href="/user">Dashboard</a>
                            </li>
                            <li>
                                <a href="/logout">Logout</a>
                            </li>
                        </ul>
                    );
                }
            }

            return (
                <li className={usernameClass}>
                    <i id="arrow" className={arrowClasses} />
                    <a onClick={this.toggleUserDropdownMenu}>{user.username}</a>
                    {this.displayUnacknowledgedNotifications()}
                    {dropdownMenu}
                </li>
            );
        }
    }

    /**
     * Toggle the user dropdown menu
     */
    toggleUserDropdownMenu = () => {
        const {isDropdownPresent} = this.state;

        // prevent duplicates of dropdown menu being shown
        if (isDropdownPresent) {
            this.setState({
                isDropdownPresent: false,
                rotateArrowClass: "rotate-down"
            });
        } else {
            this.setState({ rotateArrowClass: "rotate-up" });
            this.setState({ isDropdownPresent: true });
        }
    }

    hideUserDropdownMenu = () => {
        this.setState({isDropdownPresent: false, rotateArrowClass: 'rotate-down'});
    }

    toggleMobileDropdown = () => {
        const mobileDropdown = document.querySelector('.main-links');
        mobileDropdown.style.display === 'block' ? mobileDropdown.style.display = 'none' : mobileDropdown.style.display = 'block';
    }

    displayUnacknowledgedNotifications = () => {
        const {notificationCount} = this.props;

        // if 0 notifications - do not display
        if (!notificationCount) {
            return;
        }

        return <span className="notification-count">{notificationCount}</span>
    }

    render() {
        return (
            <div
                className="navigation-wrapper"
                onMouseLeave={this.hideUserDropdownMenu}
            >
                <ul className="navigation navigation-left">
                    <span className="nav-title">
                        <a href="/">AX52 PHOTOGRAPHY</a>
                    </span>
                    <span
                        className="mobile-menu"
                        onClick={this.toggleMobileDropdown}
                    >
                        <i className="fas fa-bars" />
                    </span>
                    <div className="main-links">
                        <li>
                            <a href="/albums" className="main-link">
                                Albums
                            </a>
                        </li>
                        <li>
                            <a href="/about" className="main-link">
                                About
                            </a>
                        </li>
                        <li>
                            <a href="/contact" className="main-link">
                                Contact
                            </a>
                        </li>
                    </div>
                </ul>

                <ul className="navigation navigation-right">
                    {this.displayLoginOrUser()}
                </ul>
            </div>
        );
    }
}

if (document.getElementById("nav")) {
    const notificationCount = document.getElementById('nav').getAttribute('data-notificationCount') ?
        parseInt(document.getElementById('nav').getAttribute('data-notificationCount')) :
        0;
    

    ReactDOM.render(<Navigation notificationCount={notificationCount} />, document.getElementById("nav"));
}

import React, { Component } from 'react';
import dateFormat from 'dateformat';

class Card extends Component {
    constructor(props) {
        super(props);

        this.state = {
            shouldDeleteAccount: false
        }
    }
    
    formatDate(dateObj) {
        const date = new Date(dateObj);
        return dateFormat(date, 'dS mmmm, yyyy');
    }

    render() {
        const {user, displayWarning} = this.props;

        let name, email, created_at;
        if (user) {
            name = user[0];
            email = user[1];
            created_at = this.formatDate(user[2]);
        }
        
        return(
            <div className='card-wrapper'>
                <div className='card-head'>
                    <span>Dashboard</span>
                </div>
                <div className='card-body'>
                    <div className='left-side'>
                        <div className='avatar-wrapper'>
                            <img src="/images/avatar.png" />
                        </div>

                        <span className='card-label'>Name: </span><span className='card-content'>{name}</span><br />
                        <span className='card-label'>Email: </span><span className='card-content'>{email}</span><br />
                        <span className='card-label'>Member Since: </span><span className='card-content'>{created_at}</span><br />
                        <div className='account-actions'>
                            <span><a href="#" className='edit'>Edit Profile</a></span>
                            <span><a href="#" className='delete' onClick={displayWarning}>Delete Account</a></span>
                        </div>
                    </div>

                    <div className='right-side'>
                        <span className='title'>Notifications</span>
                    </div>
                    
                </div>
            </div>
        );
    }
}

export default Card;

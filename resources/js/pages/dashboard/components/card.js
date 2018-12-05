import React, { Component } from 'react';
import dateFormat from 'dateformat';

class Card extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: this.props.user
        }
    }
    
    formatDate(dateObj) {
        if (dateObj === null) {
            return;
        }

        const date = new Date(dateObj);
        return dateFormat(date, 'dS mmmm, yyyy');
    }

    render() {
        const {user, displayWarning} = this.props;

        let username, name, email, created_at;
        if (user.user_id) {
            username = user.username,
            name = user.name;
            email = user.email;
            created_at = this.formatDate(user.created_at.date);
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

                        <span className='card-label'>Username: </span><span className='card-content'>{username}</span><br />
                        <span className='card-label'>Name: </span><span className='card-content'>{name}</span><br />
                        <span className='card-label'>Email: </span><span className='card-content'>{email}</span><br />
                        <span className='card-label'>Member Since: </span><span className='card-content'>{created_at}</span><br />
                        <div className='account-actions'>
                            <span><a href={`/user/${user.user_id}/edit`} className='edit'>Edit Profile</a></span>
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

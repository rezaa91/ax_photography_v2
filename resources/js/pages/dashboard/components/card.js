import React, { Component } from 'react';
import dateFormat from 'dateformat';

class Card extends Component {
    constructor(props) {
        super(props);

        this.state = {
            changeImageLink: false,
            uploadError: false
        }

        this.displayChangeImage = this.displayChangeImage.bind(this);
        this.hideChangeImage = this.hideChangeImage.bind(this);
        this.changeImage = this.changeImage.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }
    
    /**
     * Format the 'member since' date
     * @param {Object} dateObj 
     */
    formatDate(dateObj) {
        if (dateObj === null) {
            return;
        }

        const date = new Date(dateObj);
        return dateFormat(date, 'dS mmmm, yyyy');
    }

    /**
     * Display the link 'change image' when image hovered over
     */
    displayChangeImage() {
        this.setState({changeImageLink: true});
    }

    /**
     * Hide the 'change image' link on image mouseout
     */
    hideChangeImage() {
        this.setState({changeImageLink: false});
    }

    /**
     * Open file dialog box
     */
    changeImage() {
        const form = document.forms[0];
        const fileUpload = form.elements.file;
        fileUpload.click();
    }

    /**
     * Submit form if file selected for upload
     */
    async submitForm(e) {
        const {user} = this.props;

        // if user not signed in, return
        if (!user.user_id) {
            return;
        }

        const data = new FormData();
        data.append('file', e.target.files[0]);

        const token = document.querySelector('meta[name="csrf-token"]').content;

        await fetch(`/api/user/${user.user_id}`, {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': token,
                'Authorization': 'Bearer ' + document.querySelector('meta[name="api_token"]').content
            },
            body: data
        })
        .then(() => {
            this.setState({uploadError: false});
        })
        .catch(() => {
            this.setState({uploadError: true});
        })

        // refresh state in order to get the new avatar
        this.props.refresh();
    }

    render() {
        const {changeImageLink, uploadError} = this.state;
        const {displayWarning, user} = this.props;

        let username, name, email, created_at, avatar_filepath;
        if (user.user_id) {
            username = user.username,
            name = user.name;
            email = user.email;
            created_at = this.formatDate(user.created_at.date);
            avatar_filepath = user.avatar_filepath;
        }
        
        return(
            <div className='card-wrapper'>
                <div className='card-head'>
                    <span>Dashboard</span>
                </div>
                <div className='card-body'>
                    <div className='left-side'>
                        <div 
                            className='avatar-wrapper' 
                            onMouseOver={this.displayChangeImage} 
                            onMouseLeave={this.hideChangeImage}
                            onClick={this.changeImage}
                        >
                            {avatar_filepath ? <img src={`/storage/avatars/${avatar_filepath}`} /> : <img src="/images/avatar.png" />}

                            {changeImageLink && 
                                <div className='change-image-form'>
                                    <span className='change-image-link'>Change Image</span>
                                    <form style={{display: 'none'}}>
                                        <input name="_token" value="{{ csrf_token() }}" type="hidden" />
                                        <input name="file" type="file" name="file" onChange={this.submitForm} />
                                        <input type="submit" value="Save" />
                                    </form>
                                </div>
                            }
                        </div>

                        {
                            uploadError &&
                            <div className="error">The image could not be uploaded, please try again!</div>    
                        }

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

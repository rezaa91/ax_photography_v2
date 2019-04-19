import React, { Component } from "react";
import dateFormat from "dateformat";
import LoadingWidget from "../../../global_components/loadingWidget";

class Card extends Component {
    constructor(props) {
        super(props);

        this.state = {
            changeImageLink: false,
            uploadError: false,
            isLoading: false,
            notifications: props.notifications
        }
    }

    /**
     * Format the 'member since' date
     * @param {Object} dateObj
     */
    formatDate = (dateObj) => {
        if (dateObj === null) {
            return;
        }

        const date = new Date(dateObj);
        return dateFormat(date, "dS mmmm, yyyy");
    }

    /**
     * Display the link 'change image' when image hovered over
     */
    displayChangeImage = () => {
        this.setState({changeImageLink: true});
    }

    /**
     * Hide the 'change image' link on image mouseout
     */
    hideChangeImage = () => {
        this.setState({changeImageLink: false});
    }

    /**
     * Open file dialog box
     */
    changeImage = () => {
        const form = document.forms[0];
        const fileUpload = form.elements.file;
        fileUpload.click();
    }

    /**
     * Submit form if file selected for upload
     */
    submitForm = async (e) => {
        const {user} = this.props;

        // if user not signed in, return
        if (!user.user_id) {
            return;
        }

        // display loading widget
        this.toggleLoading();

        const data = new FormData();
        data.append("file", e.target.files[0]);

        const token = document.querySelector('meta[name="csrf-token"]').content;

        await fetch(`/api/user/${user.user_id}`, {
            method: "POST",
            headers: {
                "X-CSRF-TOKEN": token,
                Authorization:
                    "Bearer " +
                    document.querySelector('meta[name="api_token"]').content
            },
            body: data
        })
        .then(() => {
            this.setState({ uploadError: false });
        })
        .catch(() => {
            this.setState({ uploadError: true });
        })
        .finally(() => {
            this.toggleLoading(); // remove loading spinner
        });

        // refresh state in order to get the new avatar
        this.props.refresh();
    }

    toggleLoading = () => {
        const {isLoading} = this.state;
        this.setState({isLoading: !isLoading});
    }

    /**
     * Navigate to the album page where the image with the notification is displayed
     * Put the image id in the url to be referenced on page
     * @param object photo information from the notification
     */
    goToNotifiedImage = photo => {
        const {id, album_id} = photo;

        if (!id || !album_id) {
            return;
        }

        window.location.href = `/albums/${album_id}?photo=${id}`;
    }

    /**
     * Return the JSX with the content you wish to display the notification to
     * @param {object} notification - notification details such as user, id, photo that the notification relates to etc...
     * 
     * @return {object} JSX displaying the outputted notification string
     */
    postNotificationString = notification => {
        const {user} = this.props;
        
        const username = user.user_id === notification.notification.user_id ? 'You' : notification.user;

        return (
            <div onClick={() => this.goToNotifiedImage(notification.photo)} className="notification-msg" key={notification.id}>
                <span className="notification-img"><img src={`/storage/uploads/${notification.photo && notification.photo.filepath}`} /></span>
                {username} commented on your photo: &nbsp;
                <i>{notification.notification.post_text}</i>
            </div>
        );
    }

    /**
     * Same as postNotificationString but in reference to photo likes notifications
     */
    likeNotificationString = notification => {
        const {user} = this.props;
        
        const username = user.user_id === notification.notification.user_id ? 'You' : notification.user;

        return (
            <div onClick={() => this.goToNotifiedImage(notification.photo)} className="notification-msg" key={notification.id}>
                <span className="notification-img"><img src={`/storage/uploads/${notification.photo && notification.photo.filepath}`} /></span>
                {username} liked your photo
            </div>
        );
    }

    /**
     * @return {object} JSX output which relates to the notification
     */
    displayNotifications = () => {
        const {notifications} = this.state;

        if (!notifications) {
            return;
        }

        const notificationString = notifications.map(notification => {
            switch (notification.type) {
                case 'post':
                    return this.postNotificationString(notification);

                case 'like':
                    return this.likeNotificationString(notification);
            }
        })

        return <div>{notificationString}</div>
    }

    render() {
        const { changeImageLink, uploadError, isLoading } = this.state;
        const { displayWarning, user } = this.props;

        let username, name, email, created_at, avatar_filepath;
        if (user.user_id) {
            (username = user.username), (name = user.name);
            email = user.email;
            created_at = this.formatDate(user.created_at.date);
            avatar_filepath = user.avatar_filepath;
        }

        return (
            <div className="card-wrapper">
                <div className="card-head">
                    <span>Dashboard</span>
                </div>

                <div className="card-body">
                    <div className="left-side">
                        <div
                            className="avatar-wrapper"
                            onMouseOver={this.displayChangeImage}
                            onMouseLeave={this.hideChangeImage}
                            onClick={this.changeImage}
                        >
                            {isLoading && <LoadingWidget />}

                            {avatar_filepath ? (
                                <img
                                    src={`/storage/avatars/${avatar_filepath}`}
                                />
                            ) : (
                                <img src="/storage/defaults/avatar.png" />
                            )}

                            {changeImageLink && (
                                <div className="change-image-form">
                                    <span className="change-image-link">
                                        Change Image
                                    </span>
                                    <form style={{ display: "none" }}>
                                        <input
                                            name="_token"
                                            value="{{ csrf_token() }}"
                                            type="hidden"
                                        />
                                        <input
                                            name="file"
                                            type="file"
                                            name="file"
                                            onChange={this.submitForm}
                                        />
                                        <input type="submit" value="Save" />
                                    </form>
                                </div>
                            )}
                        </div>

                        {uploadError && (
                            <div className="error">
                                The image could not be uploaded, please try
                                again!
                            </div>
                        )}

                        <span className="card-label">Username: </span>
                        <span className="card-content">{username}</span>
                        <br />
                        <span className="card-label">Name: </span>
                        <span className="card-content">{name}</span>
                        <br />
                        <span className="card-label">Email: </span>
                        <span className="card-content">{email}</span>
                        <br />
                        <span className="card-label">Member Since: </span>
                        <span className="card-content">{created_at}</span>
                        <br />
                        <div className="account-actions">
                            <span>
                                <a
                                    href={`/user/${user.user_id}/edit`}
                                    className="edit"
                                >
                                    Edit Profile
                                </a>
                            </span>
                            <span>
                                <a
                                    href="#"
                                    className="delete"
                                    onClick={displayWarning}
                                >
                                    Delete Account
                                </a>
                            </span>
                        </div>
                    </div>

                    <div className="right-side">
                        <span className="title">Notifications</span>
                        {this.displayNotifications()}
                    </div>
                </div>
            </div>
        );
    }
}

export default Card;

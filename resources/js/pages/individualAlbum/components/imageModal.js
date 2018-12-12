import React, { Component } from 'react';
import imageModalInit from '../modalSettings'; // modal specific javascript
import User from '../../../classes/User';
import Settings from './settings';
import Modal from '../../../global_components/modal';

// get the logged in user details
const loggedInUser = new User();

class ImageModal extends Component {
    constructor(props) {
        super(props);

       this.getImageData();

        this.state = {
            user_id: loggedInUser.getUserId(),
            imageDetails: {
                album_id: null,
                created_at: null,
                filepath: null,
                photo_id: null,
                title: null,
                description: null,
                updated_at: null,
                users_which_like: null,
                displayModal: false
            },
            hasUserLiked: false,
            displaySettings: false
        }

        this.getImageData = this.getImageData.bind(this);
        this.likePhoto = this.likePhoto.bind(this);
        this.doesUserLikePhoto = this.doesUserLikePhoto.bind(this);
        this.toggleDisplaySettings = this.toggleDisplaySettings.bind(this);
        this.toggleDisplayModal = this.toggleDisplayModal.bind(this);
        this.actionDelete = this.actionDelete.bind(this);
    }

    componentDidMount() {
        // function imported at the top of this file
        imageModalInit();
    }

    /**
     * Check whether the user likes the photo
     */
    doesUserLikePhoto() {
        const {users_which_like} = this.state.imageDetails;
        const {user_id} = this.state;

        if (!users_which_like || !user_id) {
            return;
        }

        const doesUserLike = users_which_like.find(like => user_id === like);
        this.setState({hasUserLiked: doesUserLike});
    }

    /**
     * fetch the individual photo data via an API
     */
    async getImageData() {
        const {imageId} = this.props;

        await fetch(`/api/photos/${imageId}`)
        .then(response => response.status === 200 && response.json())
        .then(data => {
            const imageDetails = data.data;
            this.setState({imageDetails});
        })
        .catch(error => console.log(error));

        // After collecting the data, check whether the current user has liked the photo
        this.doesUserLikePhoto();

        console.log(this.state);
    }

    /**
     * Store photo like in database
     */
    likePhoto() {
        const {imageId} = this.props;
        const {user_id} = this.state;

        // if user is not logged in, return
        if (!user_id) {
            // TODO - inform user to log in
            return;
        }

        const token = document.querySelector('meta[name="csrf-token"]').content;

        // Post like/un-like to database
        fetch(`/api/reaction`, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token
            },
            body: JSON.stringify({
                'user_id': user_id,
                'photo_id': imageId
            })
        })
        .then(response => console.log(response))
        .catch(error => console.log(error));

        // get updated image data in order to immediately refresh the view and update the state
        this.getImageData();
    }

    toggleDisplaySettings() {
        const {displaySettings} = this.state;
        this.setState({displaySettings: !displaySettings});
    }

    /**
     * Display the modal confirming whether the user wishes to delete the photo
     */
    toggleDisplayModal() {
        const {displayModal} = this.state;
        this.setState({displayModal: !displayModal});
    }

    /**
     * Delete the photo from the DB via REST API
     */
    async actionDelete() {
        const {imageId} = this.props;
        const token = document.querySelector('meta[name="csrf-token"]').content;

        await fetch(`/api/delete_photo/${imageId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'token': token
            }
        })
        .then(res => console.log(res))
        .catch(err => console.log(err));

        // reset state
        this.toggleDisplayModal();
    }
    
    render() {
        const {closeModal} = this.props;
        const {user_id, imageDetails, hasUserLiked, displaySettings, displayModal} = this.state;

        let style = null;
        if (hasUserLiked) {
            style = {color: 'green'};
        }

        return(
            <div>
                {
                    displayModal &&

                    <Modal 
                    message='Are you sure you want to delete this photo?' 
                    action={this.actionDelete} 
                    resetState={this.toggleDisplayModal}
                    />
                }


                <div className='imageModal-wrapper'>

                    <div className='imageModal-content'>        
                        <div className='imageModal-header'>
                            <a onClick = {closeModal}>&times;</a>
                        </div>

                        <div className='image-information'>
                            <h2>{imageDetails.title && imageDetails.title.toUpperCase()}</h2>
                            <p>{imageDetails.description}</p>
                        </div>

                        <div className='image-wrapper'>
                            <img className='imageModal-img' src={imageDetails.filepath && `/storage/uploads/${imageDetails.filepath}`} />
                        </div>

                        <div className='imageModal-footer'>
                            <span>
                                <span onClick={this.toggleDisplaySettings}><i className = "fas fa-cog"></i></span>
                                {
                                    displaySettings &&
                                    <Settings 
                                    imageDetails={imageDetails} 
                                    user_id={user_id} 
                                    toggleDisplayModal={this.toggleDisplayModal} /> 
                                }
                            </span>
                            <span>
                                <span className='like-counter'>{imageDetails.total_likes}</span>
                                <i className = "fas fa-thumbs-up" onClick={this.likePhoto} style={style}></i>
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default ImageModal;

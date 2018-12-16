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

       this.getImageData(this.props.imageId);

        this.state = {
            user_id: loggedInUser.getUserId(),
            imageDetails: {
                album_id: null,
                created_at: null,
                filepath: null,
                id: null,
                title: null,
                description: null,
                updated_at: null,
                users_which_like: null,
                displayModal: false
            },
            hasUserLiked: false,
            displaySettings: false,
            editPhoto: false,
            photoZoomed: false
        }

        this.getImageData = this.getImageData.bind(this);
        this.likePhoto = this.likePhoto.bind(this);
        this.doesUserLikePhoto = this.doesUserLikePhoto.bind(this);
        this.toggleDisplaySettings = this.toggleDisplaySettings.bind(this);
        this.toggleDisplayModal = this.toggleDisplayModal.bind(this);
        this.actionDelete = this.actionDelete.bind(this);
        this.toggleEditPhoto = this.toggleEditPhoto.bind(this);
        this.stopEditPhoto = this.stopEditPhoto.bind(this);
        this.changeInput = this.changeInput.bind(this);
        this.saveOnEnter = this.saveOnEnter.bind(this);
        this.updateImageDetails = this.updateImageDetails.bind(this);
        this.setDirection = this.setDirection.bind(this);
        this.navigate = this.navigate.bind(this);
        this.toggleZoom = this.toggleZoom.bind(this);
    }

    componentDidMount() {
        // function imported at the top of this file
        imageModalInit();

        // set up event listeners for photo traversing using arrow keys
        document.addEventListener('keydown', this.setDirection);
    }

    componentWillUnmount() {
        // remove event listeners
        document.removeEventListener('keydown', this.setDirection);
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
    async getImageData(imageId) {
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
        this.getImageData(imageId);
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
        const {imageId, closeModal, refreshAlbum} = this.props;
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
        closeModal();
        refreshAlbum();
    }

    toggleEditPhoto() {
        const {editPhoto} = this.state;
        this.setState({editPhoto: !editPhoto});
    }

    /**
     * Set editPhoto state value to false when user clicks outside of text input boxes
     * Save any changes
     * @param {event} e 
     */
    stopEditPhoto(e) {
        const {editPhoto} = this.state;

        if (!editPhoto) {
            return;
        }

        if (e.target.nodeName === "INPUT" || e.target.nodeName === 'TEXTAREA') {
            return;
        }

        editPhoto && this.setState({editPhoto: false});

        // update image details in database via API call
        this.updateImageDetails();
    }

    changeInput(e) {
        const {title, description} = this.state.imageDetails;
        const {imageDetails} = this.state;
        let titleValue = title;
        let descriptionValue = description;
        const elementChanging = e.target.nodeName;
        const value = e.target.value;

        switch (elementChanging) {
            case 'INPUT':
                titleValue = value;
                break;

            case 'TEXTAREA':
                descriptionValue = value;
                break;
        }

        this.setState({
            imageDetails: {
                ...imageDetails,
                title: titleValue,
                description: descriptionValue
            }
        })
    }

    saveOnEnter(e) {
        const enterKeyCharCode = 13;

        if (e.charCode !== enterKeyCharCode) {
            return;
        }

        this.updateImageDetails();
        this.toggleEditPhoto();
    }

    /**
     * Update image details via API
     */
    updateImageDetails() {
        const {title, description} = this.state.imageDetails;
        const {imageId} = this.props;
        const token = document.querySelector('meta[name="csrf-token"]').content;

        fetch(`/api/update_photo/${imageId}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': token
            },
            body: JSON.stringify({
                title: title,
                description: description
            })
        })
    }

    setDirection(e) {
        const leftArrowCode = 37;
        const rightArrowCode = 39;

        if (e.keyCode === leftArrowCode) {
            this.navigate('left');
        } else if (e.keyCode === rightArrowCode) {
            this.navigate('right');
        } else {
            return;
        }
    }

    /**
     * Navigate between images in album
     * @param {string} direction 
     */
    navigate(direction) {
        const {previousImageId, nextImageId, changeImage, closeModal} = this.props;

        if (direction === 'left' && previousImageId) {
            closeModal();
            changeImage(previousImageId);
        } else if (direction === 'right' && nextImageId) {
            closeModal();        
            changeImage(nextImageId);
        }
    }

    // toggle zoom on image click
    toggleZoom() {
        const {photoZoomed} = this.state;
        this.setState({photoZoomed: !photoZoomed});
    }
    
    render() {
        const {closeModal, previousImageId, nextImageId} = this.props;
        const {user_id, imageDetails, hasUserLiked, displaySettings, displayModal, editPhoto, photoZoomed} = this.state;

        let thumbsUpStyle = null, imageStyle = null;
        if (hasUserLiked) {
            thumbsUpStyle = {color: 'green'};
        }

        if (photoZoomed) {
            imageStyle = {transform: 'scale(1.5)', cursor:'zoom-out'};
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


                <div 
                className='imageModal-wrapper' 
                onClick={(e) => {this.stopEditPhoto(e)}}
                >

                    <div className='imageModal-content'>        
                        <div className='imageModal-header'>
                            <a onClick = {closeModal}>&times;</a>
                        </div>

                        <div className='image-information'>
                            { editPhoto ?
                                <div className='image-input'>
                                    <input 
                                    type="text"
                                    placeholder="Title..."
                                    value={imageDetails.title.toUpperCase()}
                                    onChange={(e) => {this.changeInput(e)}}
                                    onKeyDown={(e) => {this.saveOnEnter(e)}}
                                    />
                                    <textarea 
                                    placeholder="Description..." 
                                    value={imageDetails.description ? imageDetails.description : ''}
                                    onChange={(e) => {this.changeInput(e)}}
                                    onKeyDown={(e) => {this.saveOnEnter(e)}}
                                    >
                                    </textarea>
                                </div>

                                :
                                
                                <div>
                                    <h2 onDoubleClick={this.toggleEditPhoto}>{imageDetails.title && imageDetails.title.toUpperCase()}</h2>
                                    <p onDoubleClick={this.toggleEditPhoto}>{imageDetails.description}</p>
                                </div>
                            }
                        </div>

                        <div className='image-wrapper'>
                            {previousImageId && 
                                <div 
                                className="arrow left-arrow"
                                onClick={() => this.navigate('left')}
                                >
                                    <i className="fas fa-chevron-left"></i>
                                </div>
                            }

                            <img 
                            className='imageModal-img' 
                            src={imageDetails.filepath && `/storage/uploads/${imageDetails.filepath}`} 
                            onClick={this.toggleZoom}
                            style={imageStyle}
                            />
                            
                            {nextImageId &&
                                <div 
                                className="arrow right-arrow"
                                onClick={() => this.navigate('right')}
                                >
                                    <i className="fas fa-chevron-right"></i>
                                </div>
                            }
                        </div>

                        <div className='imageModal-footer'>
                            <span>
                                <span onClick={this.toggleDisplaySettings}><i className = "fas fa-cog"></i></span>
                                {
                                    displaySettings &&
                                    <Settings 
                                    imageDetails={imageDetails} 
                                    user_id={user_id} 
                                    toggleDisplayModal={this.toggleDisplayModal} 
                                    toggleEditPhoto={this.toggleEditPhoto}
                                    /> 
                                }
                            </span>
                            <span>
                                <span className='like-counter'>{imageDetails.total_likes}</span>
                                <i className = "fas fa-thumbs-up" onClick={this.likePhoto} style={thumbsUpStyle}></i>
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default ImageModal;

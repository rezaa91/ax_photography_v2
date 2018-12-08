import React, { Component } from 'react';
import imageModalInit from '../modalSettings'; // modal specific javascript
import User from '../../../classes/User';

// get the logged in user details
const loggedInUser = new User();

class ImageModal extends Component {
    constructor(props) {
        super(props);

        this.getImageData();

        this.state = {
            imageDetails: {
                album_id: null,
                created_at: null,
                filepath: null,
                id: null,
                title: null,
                description: null,
                updated_at: null
            }
        }

        this.getImageData = this.getImageData.bind(this);
        this.likePhoto = this.likePhoto.bind(this);
    }

    componentDidMount() {
        // Run the imageModalInit function imported at the top of this file
        imageModalInit();
    }

    /**
     * fetch the individual photo data via an API
     */
    getImageData() {
        const {imageId} = this.props;

        fetch(`/api/photos/${imageId}`)
        .then(response => response.status === 200 && response.json())
        .then(data => {
            const imageDetails = data.data;
            this.setState({imageDetails});
        })
        .catch(error => console.log(error));
    }

    /**
     * Store photo like in database
     */
    likePhoto() {
        const {imageId} = this.props;
        const user_id = loggedInUser.getUserId();

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
    
    render() {
        const {closeModal} = this.props;
        const {imageDetails} = this.state;
        let style = null;
        if (imageDetails && imageDetails.user_liked) {
            style = {color: 'green'};
        }

        return(
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
                        <span><i className = "fas fa-cog"></i></span>
                            <span><span className='like-counter'>{imageDetails.total_likes}</span>
                            <i className = "fas fa-thumbs-up" onClick={this.likePhoto} style={style}></i>
                        </span>
                    </div>
                </div>

            </div>
        );
    }
}

export default ImageModal;

import React, { Component } from 'react';
import Validate from '../../../classes/Validate';

class AlbumContainer extends Component {
    constructor(props) {
        super(props);

        this.getCoverPhoto();

        this.state = {
            cover_photo: null
        }
    }

    /**
     * Get the cover photo filepath and set it in the state
     */
    getCoverPhoto = async () => {
        const {cover_photo_id} = this.props.album;

        await fetch(`/api/photos/${cover_photo_id}`)
        .then(response => response.status === 200 && response.json())
        .then(data => {
            const filepath = data.data.filepath.split(' ').join('%20');
            this.setState({cover_photo: filepath});
        })
    }

    render() {
        const {album} = this.props;
        const {cover_photo} = this.state;

        // get the cover photo file path in order to set it in the render method
        const divStyle = cover_photo && { backgroundImage: `url(storage/uploads/${cover_photo})`}

        return(
            <a href={`/albums/${album.album_id}`}className='albumContainer'>
                <div className='image-wrapper' style={divStyle}></div>
                <div className='album-details'>
                    <div><span className='title'>{album.album_name}</span></div>
                    <div className='timestamp-wrapper'>
                        <span className='timestamp'>Created at: {Validate.validateDate(album.created_at)}</span>

                        {/* Only display updated at if it does not share the same date as created at */}
                        {album.updated_at !== album.created_at && 
                            <span className='timestamp'>Updated at: {Validate.validateDate(album.updated_at)}</span>
                        }     
                    </div>
                </div>
            </a>
        );
    }
}

export default AlbumContainer;

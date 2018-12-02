import React, { Component } from 'react';
import Validate from '../../../classes/Validate';

class AlbumContainer extends Component {
    render() {
        const {album} = this.props;
        const divStyle = {
            backgroundImage: 'url(/images/avatar.png)'
        }

        return(
            <div className='albumContainer'>
                <div className='image-wrapper' style={divStyle}></div>
                <div className='album-details'>
                    <div><span>{album.album_name}</span></div>
                    <div><span>Created at: {Validate.validateDate(album.created_at)}</span></div>

                    {/* Only display updated at if it does not share the same date as created at */}
                    {album.updated_at !== album.created_at && 
                        <div><span>Updated at: {Validate.validateDate(album.updated_at)}</span></div>
                    }
                </div>
            </div>
        );
    }
}

export default AlbumContainer;

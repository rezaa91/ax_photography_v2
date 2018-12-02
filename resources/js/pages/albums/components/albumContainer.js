import React, { Component } from 'react';
import Validate from '../../../classes/Validate';

class AlbumContainer extends Component {
    render() {
        const {album} = this.props;
        const divStyle = {
            backgroundImage: 'url(/images/avatar.png)'
        }

        return(
            <a href={`/albums/${album.album_id}`}className='albumContainer'>
                <div className='image-wrapper' style={divStyle}></div>
                <div className='album-details'>
                    <div><span className='title'>{album.album_name}</span></div>
                    <div>
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

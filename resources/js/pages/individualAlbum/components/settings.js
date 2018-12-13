import React, {Component} from 'react';

class Settings extends Component {
    constructor() {
        super();

        this.state={
            displaySettings: true,
            editPhoto: false,
            displaySettings: true
        }

        this.hideSettings = this.hideSettings.bind(this);
        this.setAlbumCover = this.setAlbumCover.bind(this);
        this.setHomepageCover = this.setHomepageCover.bind(this);
        this.editPhoto = this.editPhoto.bind(this);
    }


    hideSettings() {
        this.setState({displaySettings: false});
    }

    /**
     * Set the album cover to the currently selected photo
     */
    setAlbumCover() {
        const {id} = this.props.imageDetails;
        const token = document.querySelector('meta[name="csrf-token"]').content;

        fetch(`/api/update_cover_photo/${id}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': token
            }
        })
        .then(res => res.status === 200 && console.log('success'))
        .catch(err => console.log('could not update album cover: ' + err));

        // hide settings
        this.hideSettings();
    }

    setHomepageCover() {

    }

    editPhoto() {
        this.setState({editPhoto: true});
    }

    render() {
        const {displaySettings} = this.state;
        const {toggleDisplayModal} = this.props;

        return(
            <div>
                {
                    displaySettings &&
                
                    <div className='image-settings-wrapper'>
                        <ul className='image-settings' onMouseLeave={this.hideSettings}>
                            <li className='settings-link' onClick={this.setAlbumCover}>Set as album cover</li>
                            <li className='settings-link' onClick={this.setHomepageCover}>Set as homepage background</li>
                            <li className='settings-link' onClick={this.editPhoto}>Edit photo</li>
                            <li className='settings-link' onClick={toggleDisplayModal}>Delete photo</li>
                        </ul>
                    </div>
                }
            </div>
        );
    }
}

export default Settings;

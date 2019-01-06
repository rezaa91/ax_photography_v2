import React, {Component} from 'react';

class Settings extends Component {
    constructor() {
        super();

        this.state = {
            displaySettings: true,
            editPhoto: false,
            displaySettings: true,
            token: document.querySelector('meta[name="csrf-token"]').content
        }

        this.hideSettings = this.hideSettings.bind(this);
        this.setAlbumCover = this.setAlbumCover.bind(this);
        this.setHomepageCover = this.setHomepageCover.bind(this);
    }


    hideSettings() {
        this.setState({displaySettings: false});
    }

    /**
     * Set the album cover to the currently selected photo
     */
    setAlbumCover() {
        const {id} = this.props.imageDetails;
        const {token} = this.state;

        fetch(`/api/update_cover_photo/${id}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': token,
                'Authorization': 'Bearer ' + document.querySelector('meta[name="api_token"]').content
            }
        })
        .then(res => res.status === 200 && console.log('success'))
        .catch(err => console.log('could not update album cover: ' + err));

        this.hideSettings();
    }

    setHomepageCover() {
        const {id} = this.props.imageDetails;
        const {token} = this.state;

        fetch(`/api/background_image/${id}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': "XMLHttpRequest",
                'X-CSRF-TOKEN': token,
                'Authorization': 'Bearer ' + document.querySelector('meta[name="api_token"]').content
            }
        })
        .then(res => console.log(res))
        .catch(error => console.log(error));
    }

    render() {
        const {displaySettings} = this.state;
        const {toggleDisplayModal, toggleEditPhoto} = this.props;

        return(
            <div>
                {
                    displaySettings &&
                
                    <div className='image-settings-wrapper'>
                        <ul className='image-settings' onMouseLeave={this.hideSettings}>
                            <li className='settings-link' onClick={this.setAlbumCover}>Set as album cover</li>
                            <li className='settings-link' onClick={this.setHomepageCover}>Set as homepage background</li>
                            <li className='settings-link' onClick={toggleEditPhoto}>Edit photo</li>
                            <li className='settings-link' onClick={toggleDisplayModal}>Delete photo</li>
                        </ul>
                    </div>
                }
            </div>
        );
    }
}

export default Settings;

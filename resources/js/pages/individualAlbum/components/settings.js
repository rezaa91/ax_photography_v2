import React, { Component } from "react";

class Settings extends Component {
    constructor() {
        super();

        this.displayAlbums();

        this.state = {
            displaySettings: true,
            editPhoto: false,
            displaySettings: true,
            token: document.querySelector('meta[name="csrf-token"]').content,
            displayAlbumListMenu: false
        }
    }


    hideSettings = () => {
        this.setState({displaySettings: false});
    }

    /**
     * Set the album cover to the currently selected photo
     */
    setAlbumCover = () => {
        const {id} = this.props.imageDetails;
        const {token} = this.state;

        fetch(`/api/update_cover_photo/${id}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                token: token,
                Authorization:
                    "Bearer " +
                    document.querySelector('meta[name="api_token"]').content
            }
        })
            .then(() => {
                const alertMsg = "The album cover has been changed successfully.";
                this.props.alertChange(alertMsg);
            })
            .catch(() => {
                const alertMsg = "Sorry, something went wrong, please try again.";
                this.props.alertChange(alertMsg);
            });

        this.hideSettings();
    }

    setHomepageCover = () => {
        const {id} = this.props.imageDetails;
        const {token} = this.state;

        fetch(`/api/background_image/${id}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-TOKEN": token,
                Authorization:
                    "Bearer " +
                    document.querySelector('meta[name="api_token"]').content
            }
        })
            .then(() => {
                const alertMsg =
                    "The homepage background has been changed successfully.";
                this.props.alertChange(alertMsg);
            })
            .catch(() => {
                const alertMsg =
                    "Sorry, something went wrong, please try again.";
                this.props.alertChange(alertMsg);
            });
    }

    displayAllAlbumsMenu = () => {
        this.setState({displayAlbumListMenu: true});
    }

    hideAllAlbumsMenu = () => {
        this.setState({displayAlbumListMenu: false});
    }

    displayAlbums = async () => {
        await fetch('/api/albums')
        .then((res) => res.json())
        .then(albums => {
            this.setState({
                listAlbums: albums.data.map((album, index) => (
                    <li className="settings-link album-select" key={index} onClick={() => this.moveToAlbum(album.album_id)}>{album.album_name}</li>
                ))
            })
        })
        .catch(error => console.log(error));
    }

    moveToAlbum = async albumId => {
        const {id} = this.props.imageDetails;

        const token = document.querySelector('meta[name="csrf-token"]').content;
        
        await fetch(`/api/album/${albumId}/image/${id}`, {
            method: 'post',
            headers: {
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-TOKEN": token,
                Authorization: `Bearer ${document.querySelector('meta[name="api_token"]').content}`
            }
        })
        .then((response) => response.json())
        .then(message => {
            this.props.alertChange(message.response);
        })
        .catch(() => {
            const alertMsg = "The image could not be moved. Please contact support.";
            this.props.alertChange(alertMsg);
        })
    }

    render() {
        const { displaySettings, displayAlbumListMenu, listAlbums } = this.state;
        const { toggleDisplayModal, toggleEditPhoto } = this.props;

        return (
            <div>
                {displaySettings && (
                    <div className="image-settings-wrapper">
                        <ul
                            className="image-settings"
                            onMouseLeave={this.hideSettings}
                        >
                            <li
                                className="settings-link"
                                onMouseOver={this.displayAllAlbumsMenu}
                                onMouseLeave={this.hideAllAlbumsMenu}
                            >
                                {
                                    displayAlbumListMenu &&
                                    <ul className="albums-menu">
                                        {listAlbums}
                                    </ul>
                                }
                                
                                Move >
                            </li>

                            <li
                                className="settings-link"
                                onClick={this.setAlbumCover}
                            >
                                Set as album cover
                            </li>
                            <li
                                className="settings-link"
                                onClick={this.setHomepageCover}
                            >
                                Set as homepage background
                            </li>
                            <li
                                className="settings-link"
                                onClick={toggleEditPhoto}
                            >
                                Edit photo
                            </li>
                            <li
                                className="settings-link"
                                onClick={toggleDisplayModal}
                            >
                                Delete photo
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        );
    }
}

export default Settings;

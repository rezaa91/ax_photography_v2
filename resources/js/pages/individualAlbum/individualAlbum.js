import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ImageModal from './components/imageModal';
import Modal from '../../global_components/modal';
import Alert from '../../global_components/alert';
import individualAlbumInit from './individualAbumSettings';
import LoadingWidget from '../../global_components/loadingWidget';
import {openImageModalIfImageInURL} from './utilities/openImageIfImageInURL';

class IndividualAlbum extends Component {
    constructor() {
        super();

        this.state = {
            user: null,
            albumId: null,
            albumTitle: '',
            albumImages: null,
            containsBackgroundImage: null,
            editAlbumTitle: false,
            enlargedImage: null,
            previousImageId: null,
            nextImageId: null,
            deleteAlbum: false,
            displayAlert: false,
            alertMsg: null,
            isLoading: false,
            uploadError: ''
        }
    }

    componentWillMount() {
        this.getAlbum();
        this.getUser();
    }

    componentDidMount() {
        individualAlbumInit();
    }

    componentDidUpdate() {
        // focus on edit title input field when in DOM
        if (document.querySelector('input[name="editAlbum"]')) {
            document.querySelector('input[name="editAlbum"]').focus();
        }
    }

    /**
     * Get individual album data
     */
    getAlbum = async () => {
        const url = window.location.href;

        //display loading spinner
        this.toggleLoading();

        // find the album id from the url by getting the last digit in the url (note that the url must finish with this digit)
        let id = url.match(/albums\/(\d+)/gi);
        id = id[0].match(/\d+/)[0];

        await fetch(`/api/albums/${id}`)
        .then(response => response.status === 200 && response.json())
        .then(data => {
            const albumImages = data.data.images;
            const albumTitle = data.data.title;
            const albumId = data.data.albumId;
            const containsBackgroundImage = data.data.containsBackgroundImage;

            this.setState({albumImages, albumTitle, albumId, containsBackgroundImage});
        })
        .finally(() => {
            this.toggleLoading();
        })
    }

    /**
     * Get logged in user through API call
     */
    getUser = async () => {
        //find user in session through api
        await fetch('/api/user')
        .then(response => response.status === 200 && response.json())
        .then(data => {
            data = data.data;
            
            if (!data) {
                return;
            }

            this.setState({
                user: {
                    id: data.id,
                    username: data.username,
                    name: data.name,
                    email: data.email,
                    created_at: data.created_at,
                    isAdmin: data.isAdmin
                }
            })            
        })
    }

    /**
     * Set the previous and next image ids in the state
     * These values are used to traverse images
     * @param int imageId 
     */
    nextAndPreviousImageIds = (imageId) => {
        const {albumImages} = this.state;

        if (!albumImages) {
            return;
        }

        const currentImageKey = albumImages.findIndex(image => image.id === imageId);
        const previousImageId = albumImages[currentImageKey - 1] && albumImages[currentImageKey - 1].id;
        const nextImageId = albumImages[currentImageKey + 1] && albumImages[currentImageKey + 1].id;
        
        this.setState({previousImageId, nextImageId});
    }

    /**
     * Render images on the page once the api call has returned
     */
    displayImages = () => {
        const {albumImages} = this.state;

        if (!albumImages) {
            return;
        }
        
        return albumImages.map((image) => (
            <div className='image' key={image.id}>
                <img onClick={() => this.enlargeImage(image.id)} src={`/storage/uploads/${image.filepath}`} />
            </div>
        ))
    }

    /**
     * Enlarge image when clicked
     * 
     * @param {integer} imageId 
     */
    enlargeImage = async (imageId) => {
        await this.nextAndPreviousImageIds(imageId);
        const {user, nextImageId, previousImageId} = this.state;

        const enlargedImage = <ImageModal 
            imageId = {imageId} 
            closeModal = {this.closeEnlargedImage} 
            previousImageId={previousImageId} 
            nextImageId={nextImageId} 
            changeImage={this.enlargeImage}
            refreshAlbum={this.getAlbum}
            user = {user}
            />
            
        this.setState({enlargedImage});
    }

    toggleAlbumEdit = () => {
        const {user, editAlbumTitle} = this.state;

        if (!user || !user.isAdmin) {
            return;
        }

        this.setState({editAlbumTitle: !editAlbumTitle});
    }

    updateAlbumTitle = (e) => {
        const value = e.target.value;
        this.setState({albumTitle: value});
    }

    updateAlbumOnEnter = (e) => {
        const returnKey = 13;

        if (e.charCode !== returnKey) {
            return;
        }

        this.updateAlbum();
    }

    saveAlbumTitle = () => {
        const {user, albumTitle} = this.state;

        if (!user.isAdmin) {
            return;
        }

        // User cannot save album title if empty, style input box to display error colouring
        if (!albumTitle) {
            const editAlbumInput = document.querySelector('input[name="editAlbum"]');
            editAlbumInput.style.border = "1px solid #9e0401";
            editAlbumInput.style.boxShadow = "0 0 7px #9e0401";
            return;
        }

        this.toggleAlbumEdit();
    }

    toggleDeleteAlbum = () => {
        const {user, deleteAlbum} = this.state;

        if (!user.isAdmin) {
            return;
        }

        this.setState({deleteAlbum: !deleteAlbum});
    }

    actionDeleteAlbum = () => {
        const {user, albumId, containsBackgroundImage} = this.state;

        if (!user.isAdmin) {
            return;
        }

        if (containsBackgroundImage) {
            const alertMsg = "You cannot delete this album as one of the images is the homepage background";
            this.setState({displayAlert: true, alertMsg});
            return;
        }

        this.toggleLoading();

        this.setState({deleteAlbum: false});
        const token = document.querySelector('meta[name="csrf-token"]').content;

        fetch(`/api/delete_album/${albumId}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': token,
                'Authorization': 'Bearer ' + document.querySelector('meta[name="api_token"]').content
            },
            redirect: 'follow'
        })
        .then(() => {
            window.location.replace("/albums");
        })
        .catch(() => {
            const alertMsg = "Sorry, something went wrong and the album could not be deleted. Please try again";
            this.setState({displayAlert: true, alertMsg});
        })
        .finally(() => {
            this.toggleLoading();
        })
    }

    /**
     * Close the enlarged image
     */
    closeEnlargedImage = () => {
        this.setState({enlargedImage: null});
    }

    updateAlbum = () => {
        const {user, albumTitle, editAlbumTitle, albumId} = this.state;

        if (!user.isAdmin) {
            return;
        }

        if (!editAlbumTitle) {
            return;
        }

        if (!albumTitle) {
            const editAlbumTitleInput = document.querySelector('input[name="editAlbum"]');
            editAlbumTitleInput.focus();
            return;
        }

        this.setState({editAlbumTitle: false});

        const token = document.querySelector('meta[name="csrf-token"]').content;
        
        fetch(`/api/update_album/${albumId}`, {
            method: 'POST',
            headers: {
                'Content': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': token,
                'Authorization': 'Bearer ' + document.querySelector('meta[name="api_token"]').content
            },
            body: JSON.stringify({
                'album_name': albumTitle
            }),
            redirect: 'follow'
        })

        this.getAlbum();
    }

    closeAlertBox = () => {
        this.setState({displayAlert: false});
    }

    toggleLoading = () => {
        const {isLoading} = this.state;
        this.setState({isLoading: !isLoading});
    }

    renderAlbumTitleState = () => {
        const {user, editAlbumTitle, albumTitle} = this.state;

        if (editAlbumTitle) {
            return (
                <div className="inline"> 
                <input 
                    name="editAlbum" 
                    value={albumTitle} 
                    onChange={this.updateAlbumTitle}
                    onBlur={this.updateAlbum}
                    onKeyPress={this.updateAlbumOnEnter}
                />
                <span className='icon' onClick={this.saveAlbumTitle}><i className="fas fa-check"></i></span>
                </div>
            )
            
        } else {
            return (
                <div className="inline">
                    <h1 className="inline" onDoubleClick={this.toggleAlbumEdit}>{albumTitle}</h1>
                    
                    {
                        !!user && !!user.isAdmin &&
                        <span className="icon" onClick={this.toggleAlbumEdit}><i className="fas fa-pencil-alt"></i></span>
                    }
                </div>
            )
        }
    }

    openImageUploadWindow = () => {
        const form = document.getElementById('uploadImageForm');
        const file = form.elements.file;
        file.click();
    }

    uploadImage = async(e) => {
        const {albumId} = this.state;

        // reset previous upload error
        this.setState({uploadError: ''});

        const fileData = new FormData();
        fileData.append('file', e.target.files[0]);

        const token = document.querySelector('meta[name="csrf-token"]').content;

        await fetch(`/api/photo/${albumId}`, {
            method: "post",
            headers: {
                    "X-CSRF-TOKEN": token,
                    Authorization: `Bearer ${document.querySelector('meta[name="api_token"]').content}`
            },
            body: fileData
        })
        .then(() => this.getAlbum())
        .catch(() => this.setState({uploadError: 'There was an error uploading the image.'}));
    }

    render() {
        const {user, enlargedImage, deleteAlbum, displayAlert, alertMsg, isLoading, uploadError} = this.state;

        return(
            <div className='individualAlbum'>
                {
                    deleteAlbum &&
                    <Modal 
                        message='Are you sure you want to delete this album?'
                        resetState={this.toggleDeleteAlbum}
                        action={this.actionDeleteAlbum}
                    />
                }

                {
                    displayAlert &&
                    <Alert 
                        message={alertMsg}
                        resetState={this.closeAlertBox}
                    />
                }

                <div className="album-information">
                    {this.renderAlbumTitleState()}

                    {
                        !!user && !!user.isAdmin &&                    
                        <span>
                            <span className="icon delete" onClick={this.toggleDeleteAlbum}><i className="fas fa-trash-alt"></i></span>
                            <span className="icon" title="add image" onClick={this.openImageUploadWindow}><i className="fas fa-plus"></i>
                                {/* Hide the below form - it is used to upload file from clicking the 'plus button' */}
                                <form id="uploadImageForm" style={{display: "none"}}>
                                    <input type="file" name="file" onChange={this.uploadImage} />
                                    <input type="submit" />
                                </form>
                                {uploadError && <span>{uploadError}</span>}
                            </span>
                        </span>
                    }
                </div>
                <div className="images">
                    {
                        isLoading &&
                        <LoadingWidget />
                    }

                    {this.displayImages()}
                </div>
                {enlargedImage}
            </div>
        );
    }
}

if (document.getElementById('individualAlbum')) {
    // display image modal if user has followed through from notifications link
    openImageModalIfImageInURL();

    ReactDOM.render(<IndividualAlbum />, document.getElementById('individualAlbum'));
}

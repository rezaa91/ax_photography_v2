import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ImageModal from './components/imageModal';
import Modal from '../../global_components/modal';
import Alert from '../../global_components/alert';
import individualAlbumInit from './individualAbumSettings';
import LoadingWidget from '../../global_components/loadingWidget';

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
            isLoading: false
        }

        this.getAlbum = this.getAlbum.bind(this);
        this.getUser = this.getUser.bind(this);
        this.displayImages = this.displayImages.bind(this);
        this.enlargeImage = this.enlargeImage.bind(this);
        this.closeEnlargedImage = this.closeEnlargedImage.bind(this);
        this.nextAndPreviousImageIds = this.nextAndPreviousImageIds.bind(this);
        this.toggleAlbumEdit = this.toggleAlbumEdit.bind(this);
        this.saveAlbumTitle = this.saveAlbumTitle.bind(this);
        this.updateAlbumTitle = this.updateAlbumTitle.bind(this);
        this.toggleDeleteAlbum = this.toggleDeleteAlbum.bind(this);
        this.actionDeleteAlbum = this.actionDeleteAlbum.bind(this);
        this.updateAlbum = this.updateAlbum.bind(this);
        this.updateAlbumOnEnter = this.updateAlbumOnEnter.bind(this);
        this.closeAlertBox = this.closeAlertBox.bind(this);
        this.toggleLoading = this.toggleLoading.bind(this);
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
    async getAlbum() {
        const url = window.location.href;

        //display loading spinner
        this.toggleLoading();

        // find the id from the url by getting the last digit in the url (note that the url must finish with this digit)
        const id = url.match(/\d+$/)[0];

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
    async getUser() {
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
    nextAndPreviousImageIds(imageId) {
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
    displayImages() {
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
    async enlargeImage(imageId) {
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

    toggleAlbumEdit() {
        const {user, editAlbumTitle} = this.state;

        if (!user || !user.isAdmin) {
            return;
        }

        this.setState({editAlbumTitle: !editAlbumTitle});
    }

    updateAlbumTitle(e) {
        const value = e.target.value;
        this.setState({albumTitle: value});
    }

    updateAlbumOnEnter(e) {
        const returnKey = 13;

        if (e.charCode !== returnKey) {
            return;
        }

        this.updateAlbum();
    }

    saveAlbumTitle() {
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

    toggleDeleteAlbum() {
        const {user, deleteAlbum} = this.state;

        if (!user.isAdmin) {
            return;
        }

        this.setState({deleteAlbum: !deleteAlbum});
    }

    actionDeleteAlbum() {
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
    closeEnlargedImage() {
        this.setState({enlargedImage: null});
    }

    updateAlbum() {
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

    closeAlertBox() {
        this.setState({displayAlert: false});
    }

    toggleLoading() {
        const {isLoading} = this.state;
        this.setState({isLoading: !isLoading});
    }

    render() {
        const {user, albumTitle, enlargedImage, editAlbumTitle, deleteAlbum, displayAlert, alertMsg, isLoading} = this.state;
        let albumTitleState;

        if (editAlbumTitle) {
            albumTitleState = <div className="inline"> 
            <input 
                name="editAlbum" 
                value={albumTitle} 
                onChange={this.updateAlbumTitle}
                onBlur={this.updateAlbum}
                onKeyPress={this.updateAlbumOnEnter}
            />
            <span className='icon' onClick={this.saveAlbumTitle}><i className="fas fa-check"></i></span>
            </div>
        } else {
            albumTitleState = <div className="inline">
                <h1 className="inline" onDoubleClick={this.toggleAlbumEdit}>{albumTitle}</h1>
                
                {
                    !!user && !!user.isAdmin &&
                    <span className="icon" onClick={this.toggleAlbumEdit}><i className="fas fa-pencil-alt"></i></span>
                }
                </div>
        }

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
                    {albumTitleState}

                    {
                        !!user && !!user.isAdmin &&                    
                        <span className="icon delete" onClick={this.toggleDeleteAlbum}><i className="fas fa-trash-alt"></i></span>
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
    ReactDOM.render(<IndividualAlbum />, document.getElementById('individualAlbum'));
}

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ImageModal from './components/imageModal';

class IndividualAlbum extends Component {
    constructor() {
        super();

        this.getAlbum();

        this.state = {
            albumData: null,
            enlargedImage: null,
            previousImageId: null,
            nextImageId: null
        }

        this.getAlbum = this.getAlbum.bind(this);
        this.displayImages = this.displayImages.bind(this);
        this.enlargeImage = this.enlargeImage.bind(this);
        this.closeEnlargedImage = this.closeEnlargedImage.bind(this);
        this.nextAndPreviousImageIds = this.nextAndPreviousImageIds.bind(this);
    }

    /**
     * Get individual album data
     */
    async getAlbum() {
        const url = window.location.href;

        // find the id from the url by getting the last digit in the url (note that the url must finish with this digit)
        const id = url.match(/\d$/)[0];

        await fetch(`/api/albums/${id}`)
        .then(response => response.status === 200 && response.json())
        .then(data => {
            const albumData = data;
            this.setState({albumData});
        })
        .catch(error => {
            // redirect user back to albums page if album does not exist (e.g. user puts a different id in url)
            if (error) {
                // TODO - window.location.replace('/albums');
            }
        });
    }

    /**
     * Set the previous and next image ids in the state
     * These values are used to traverse images
     * @param int imageId 
     */
    nextAndPreviousImageIds(imageId) {
        const {albumData} = this.state;

        if (!albumData) {
            return;
        }

        const currentImageKey = albumData.findIndex(image => image.id === imageId);
        const previousImageId = albumData[currentImageKey - 1] && albumData[currentImageKey - 1].id;
        const nextImageId = albumData[currentImageKey + 1] && albumData[currentImageKey + 1].id;
        
        this.setState({previousImageId, nextImageId});
    }

    /**
     * Render images on the page once the api call has returned
     */
    displayImages() {
        const {albumData} = this.state;

        if (!albumData) {
            return;
        }
        
        return albumData.map((image) => (
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
        const {nextImageId, previousImageId} = this.state;

        const enlargedImage = <ImageModal 
            imageId = {imageId} 
            closeModal = {this.closeEnlargedImage} 
            previousImageId={previousImageId} 
            nextImageId={nextImageId} 
            changeImage={this.enlargeImage}
            refreshAlbum={this.getAlbum}
            />
            
        this.setState({enlargedImage});
    }

    /**
     * Close the enlarged image
     */
    closeEnlargedImage() {
        this.setState({enlargedImage: null});
    }

    render() {
        const {enlargedImage} = this.state;

        return(
            <div className='individualAlbum'>
                {this.displayImages()}
                {enlargedImage}
            </div>
        );
    }
}

if (document.getElementById('individualAlbum')) {
    ReactDOM.render(<IndividualAlbum />, document.getElementById('individualAlbum'));
}

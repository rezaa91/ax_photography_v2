import React, { Component } from 'react';
import imageModalInit from '../modalSettings'; // modal specific javascript

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
                updated_at: null
            }
        }

        this.getImageData = this.getImageData.bind(this);
    }

    componentDidMount() {
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
    
    render() {
        const {closeModal} = this.props;
        const {imageDetails} = this.state;

        return(
            <div className='imageModal-wrapper'>

                <div className='imageModal-content'>        
                    <div className='imageModal-header'>
                        <a onClick = {closeModal}>&times;</a>
                    </div>

                    <div className='image-wrapper'>
                        <img className='imageModal-img' src={`/storage/uploads/${imageDetails.filepath}`} />
                    </div>

                    <div className='imageModal-footer'>
                        <span><i className = "fas fa-cog"></i></span>
                        <span><i className = "fas fa-thumbs-up"></i></span>
                    </div>
                </div>

            </div>
        );
    }
}

export default ImageModal;

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import AlbumContainer from './components/albumContainer';

class Albums extends Component {

    constructor() {
        super();

        this.getAlbums();

        this.state = {
            albums: null
        }
    }

    /**
     * Get all albums from the database using a GET API and store in the state
     */
    getAlbums = async () => {
        await fetch('/api/albums')
        .then(response => response.json())
        .then(data => {
            this.setState({albums:data.data});
        })
    }

    /**
     * Return JSX album container passing along individual album details as props
     * @return JSX containing album container
     */
    displayAlbums() {
        const {albums} = this.state;

        if (!albums) {
            return;
        }

        return albums.map(album => 
            <AlbumContainer album = {album} key={album.album_id} />
        );
    }

    render() {
        const albumElements = this.displayAlbums();

        return(
            <div className='albums-wrapper'>
                {albumElements}        
            </div>
        )
    }
}

if (document.getElementById('albums')) {
    ReactDOM.render(<Albums />, document.getElementById('albums'));
}

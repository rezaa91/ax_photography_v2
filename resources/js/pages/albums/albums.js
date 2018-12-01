import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Albums extends Component {

    constructor() {
        super();

        this.getAlbums();

        this.state = {
            albums: null
        }

        this.getAlbums = this.getAlbums.bind(this);
    }

    async getAlbums() {
        await fetch('/api/albums')
        .then()
    }

    render() {
        return(
            <div className='albums-wrapper'>
                
            </div>
        )
    }
}

if (document.getElementById('albums')) {
    ReactDOM.render(<Albums />, document.getElementById('albums'));
}

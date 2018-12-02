import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class IndividualAlbum extends Component {
    constructor() {
        super();

        this.getAlbum();

        this.state = {
            albumData: null
        }

        this.getAlbum = this.getAlbum.bind(this);
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
            const albumData = data[0];
            this.setState({albumData});
        })
        .catch(error => {
            // redirect user back to albums page if album does not exist (e.g. user puts a different id in url)
            if (error) {
                window.location.replace('/albums');
            }
        });
    }

    render() {
        return(
            <div className='individualAlbum'>

            </div>
        );
    }
}

if (document.getElementById('individualAlbum')) {
    ReactDOM.render(<IndividualAlbum />, document.getElementById('individualAlbum'));
}

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import MainBtn from './components/mainBtn';

class Homepage extends Component {
    constructor() {
        super();

        this.getBackgroundImage();

        this.state = {
            filepath: null
        }

        this.getBackgroundImage = this.getBackgroundImage.bind(this);
    }

    getBackgroundImage() {
        fetch('/api/background_image')
        .then(res => res.json())
        .then(data => {
            const filepath = data.data.filepath;

            this.setState({filepath});
        })
        .catch(error => console.log(error));
    }

    render() {
        const {filepath} = this.state;
        const style = filepath && {
            'backgroundImage': `url(storage/uploads/${filepath})`
        }

        return(
            <div className='homepage-wrapper' style={style}>
                <div>
                    <div className = 'homepage-header'>
                        <h1>AX PHOTOGRAPHY</h1>
                        <h3>- THE BEST OF THE BEST -</h3>
                        <MainBtn text="View Gallery" />
                    </div>
                </div>
            </div>
        )
    }
}

if (document.getElementById('homepage')) {
    ReactDOM.render(<Homepage />, document.getElementById('homepage'));
}

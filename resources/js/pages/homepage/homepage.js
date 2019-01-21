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
    }

    getBackgroundImage = () => {
        fetch('/api/background_image')
        .then(res => res.json())
        .then(data => {
            const filepath = `uploads/${data.data.filepath}`.split(' ').join('%20');

            this.setState({filepath});
        })
        .catch(() => {
            // if error fetching background image, use a default image
            const filepath = 'defaults/homepage-default.jpg';
            
            this.setState({filepath});
        });
    }

    render() {
        const {filepath} = this.state;
        const style = filepath && {
            'backgroundImage': `url(storage/${filepath})`
        }

        return(
            <div className='homepage-wrapper' style={style}>
                <div>
                    <div className = 'homepage-header'>
                        <h1>AX52 PHOTOGRAPHY</h1>
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

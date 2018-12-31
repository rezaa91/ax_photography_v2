import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Contact extends Component {
    render() {
        return(
            <div className='contact-wrapper'>
                <div className='contact-section'>

                    <div className='contact-header'>
                        <h1>CONTACT</h1>
                        <h3>Get in touch for a quote</h3>                    
                    </div>

                    <div className='contact-body'>
                        <div className='body-1'>
                            <form>
                                <div className="form-section">
                                    <input type="text" placeholder="Name..." autoFocus />
                                </div>
                                <div className='form-section'>
                                    <input type="text" placeholder="Email@example.co.uk" />
                                </div>
                                <div className="form-section">
                                    <textarea placeholder="Enter a message..."></textarea>
                                </div>
                                <div className="form-section">
                                    <input type="submit" value="SEND" /> 
                                </div>
                            </form>
                        </div>

                        <div className='body-2'>

                        </div>
                    </div>

                    <div className='contact-footer'>
                        <div className='social-media-wrapper'>
                            <span className='icon'><a href="https://www.flickr.com/photos/68234194@N05/" target="_blank"><span className="fab fa-flickr"></span></a></span>
                            <span className='icon inactive'><a title="unavailable" target="_blank"><span className="fab fa-twitter-square"></span></a></span>
                            <span className='icon inactive'><a title="unavailable" target="_blank"><span className="fab fa-instagram"></span></a></span>
                            <span className='icon inactive'><a title="unavailable" target="_blank"><span className="fab fa-facebook"></span></a></span>
                        </div>
                    </div>
                    
                </div>                
            </div>
        )
    }
}

if (document.getElementById('contact')) {
    ReactDOM.render(<Contact />, document.getElementById('contact'));
}

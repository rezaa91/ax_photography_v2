import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Contact extends Component {
    constructor() {
        super();

        this.state = {
            formIsValid: true, //REMEMBER TO SET TO FALSE
            formData: {
                name: '',
                email: '',
                body: ''
            }
        }

        this.updateValueOnChange = this.updateValueOnChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    updateValueOnChange(e) {
        const property = e.target.name;
        const value = e.target.value;
        const formData = {...this.state.formData};
        formData[property] = value;

        this.setState({formData});
    }

    submitForm(e) {
        e.preventDefault();
        const {formIsValid} = this.state;

        if (!formIsValid) {
            return;
        }
        
        const {name, email, body} = this.state.formData;
        const token = document.querySelector('meta[name="csrf-token"]').content;

        fetch('/api/email', {
            method: 'POST',
            headers: {
                'x-csrf-token': token,
                'Authorization': 'Bearer ' + document.querySelector('meta[name="api_token"]').content
            },
            body: JSON.stringify({name, email, body})
        })
        .then(response => console.log(response))
        .catch(error => console.log(error));
    }

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
                            <form onSubmit={this.submitForm}>
                                
                                <input name="_token" value="{{ csrf_token() }}" type="hidden" />

                                <div className="form-section">
                                    <input type="text" name="name" placeholder="Name..." onChange={this.updateValueOnChange} required autoFocus />
                                </div>
                                <div className='form-section'>
                                    <input type="text" name="email" placeholder="Email@example.co.uk" onChange={this.updateValueOnChange} required />
                                </div>
                                <div className="form-section">
                                    <textarea name="body" placeholder="Enter a message..." onChange={this.updateValueOnChange} required></textarea>
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

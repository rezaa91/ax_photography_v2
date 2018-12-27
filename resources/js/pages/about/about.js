import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class About extends Component {
    render() {
        return(
            <div className='about-wrapper'>

                <div className='about-section'>
                    <div className='about-header'>
                        <h1>ABOUT</h1>
                        <h3>Landscape Photographer.</h3>
                    </div> 
                
                    <div className='about-body'>
                        <div className='body-1'>
                             <p>
                                Hello and welcome to my website. My name is Hamid and I am a hobbyist 
                                photographer with over 30 years experience. I like taking pictures of anything and everything,
                                from landscape shots to wedding ceremonies and everything else in between. This website
                                displays a short portfolio of my most recent work and can be found <u><a href="/albums">here.</a></u> 
                            </p>
                            <p>
                                I would love to hear your feedback so please <u><a href="/register">register</a></u> and get commenting! 
                                If you like my style of work and you believe that my style of photography can help you with any upcoming events,
                                whether that be a wedding, a fundraiser, or anything along those lines, then please get in touch by filling in the
                                form found on the <u><a href="/contact">contacts</a></u> page. I will respond to any queries as soon as possible. 
                            </p>
                            <p>
                                This website gets regular updates so make sure to check back regularly for new content and features!
                            </p>
                        </div>

                        <div className='body-2'>
                            {/* Profile image */}
                            <img src="" />
                        </div>
                       
                    </div>

                    <div className='about-footer'>
                        - Hamid Issaee
                    </div>

                </div> 
                
                <div className='carousel-wrapper'>
                    <div className='carousel'>
                        {/* Display carousel images here */}
                    </div>
                </div>

            </div>
        )
    }
}

if (document.getElementById('about')) {
    ReactDOM.render(<About />, document.getElementById('about'));
}

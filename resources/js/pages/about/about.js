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
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis et pharetra sem, eget fringilla libero. 
                                Maecenas lobortis dapibus pellentesque. In convallis, ipsum et accumsan lobortis, ipsum lorem gravida 
                                dolor, eu commodo ipsum justo quis ante. Vestibulum luctus, lorem venenatis dignissim tristique, ante 
                                ante tristique neque, non maximus risus eros ut massa. Nulla dictum arcu eget elit malesuada aliquam. 
                            </p>
                            <p>
                                Mauris pellentesque porta tristique. Suspendisse bibendum, libero vitae scelerisque laoreet, eros mauris 
                                molestie orci, vitae consectetur lorem magna eget nibh. Pellentesque bibendum nibh enim, sit amet
                                lacinia odio placerat eu. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere 
                                cubilia Curae; Nullam mattis libero eu risus faucibus tempor. Nulla turpis enim, cursus in quam sed, 
                                sodales gravida elit. Praesent vestibulum odio erat, vitae fermentum tortor semper nec.
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

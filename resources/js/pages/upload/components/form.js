import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Form extends Component {
    render() {
        return(
            <div className = 'form-wrapper'>

                <form action="" method="POST">
                    <div className='form-section'>
                        <label>Title: </label>
                        <input type="text" />
                    </div>
                    
                    <div className='form-section'>
                        <label>Description: </label>
                        <textarea></textarea>
                    </div>

                    <div className='form-section'>
                        <input type="file" />
                    </div>

                    <div className='form-section'>
                        <input type="submit" value="upload" />
                    </div>
                </form>

            </div>
        );
    }
}

export default Form;

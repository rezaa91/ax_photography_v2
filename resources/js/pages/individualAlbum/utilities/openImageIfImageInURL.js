import ImageModal from '../components/imageModal';
import ReactDOM from 'react-dom';
import React from 'react';
import getUser from '../../../classes/User';

/**
 * If the URL has the 'photo' GET parameter, this must mean the page was accessed by clicking
 * on a notification from the dashboard page
 */
function checkImageInURL() {
    const imageInRegEx = new RegExp('photo=');

    return imageInRegEx.test(window.location.href);
}

/**
 * @return {int|string} imageId
 */
function getImageId() {
    const url = window.location.href;
    const splitURL = url.split(/photo=/gi);

    if (!splitURL || splitURL.length < 2) {
        return;
    }

    // where splitURL[0] is the first part of the url
    // splitURL[1] e.g. "562"
    return splitURL[1].match(/\d+/)[0];
}

/**
 * Get album id from URL
 * @return {int|string} albumId
 */
function getAlbumId() {
    const url = window.location.href;
    let id = url.match(/albums\/(\d+)/gi);
    
    return id[0].match(/\d+/)[0];
}

function closeImageModal(e) {
    const imageModal = document.getElementById('imageModal');

    if (imageModal.length === 0) {
        return;
    }

    history.pushState({}, 'albums', getAlbumId());
    imageModal.remove();
}

// if the user has come to the album page through following a notification
// and therefore having an image id in the url, then continue with this code
// otherwise, terminate this code to display the album only until an image is clicked on
export async function openImageModalIfImageInURL() {
    if (!checkImageInURL()) {
        return;
    }

    const user = await getUser();
    
    ReactDOM.render(<ImageModal closeModal={closeImageModal} imageId={getImageId()} user={user} />, document.getElementById('imageModal'));
}
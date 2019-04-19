/**
 * Initialisation function called on componentDidMount in ./individualAlbum.js
 */
export default function individualAlbumInit() {
    setHeightOfAlbumPage();
}

/**
 * Get DOM elements
 */
function getDOMElements() {
    return {
        navBar: document.querySelector("nav"),
        albumInformation: document.querySelector(".album-information"),
        albumImagesWrapper: document.querySelector(".images")
    };
}

function getWindowHeight() {
    return window.innerHeight;
}

function setHeightOfAlbumPage() {
    const { navBar, albumInformation, albumImagesWrapper } = getDOMElements();

    const windowHeight = getWindowHeight();
    const navBarHeight = navBar.clientHeight;
    const albumInformationHeight = albumInformation.clientHeight;
    const offsetBottom = 40;
    const imagesWrapperHeight =
        windowHeight - navBarHeight - albumInformationHeight - offsetBottom;

    albumImagesWrapper.style.height = `${imagesWrapperHeight}px`;
}

/**
 * Initialisation function which is the only function on the page which is invoked
 */
export default function imageModalInit() {
    setImageHeight();
    setImageWrapperHeight();
}

/**
 * get DOM Elements
 */
function getDOMElements() {
    return {
        modal: document.querySelector(".imageModal-wrapper"),
        modalHeader: document.querySelector(".imageModal-header"),
        modalImageWrapper: document.querySelector(".image-wrapper"),
        modalImage: document.querySelector(".imageModal-img"),
        modalFooter: document.querySelector(".imageModal-footer")
    };
}

/**
 * Get the height of each individual aspect of the image modal, i.e. header, content, footer
 */
function getModalHeightProperties() {
    const {
        modal,
        modalHeader,
        modalImageWrapper,
        modalFooter,
        modalImage
    } = getDOMElements();

    // get the height of each modal section
    return {
        modalHeight: modal.clientHeight,
        modalHeaderHeight: modalHeader.clientHeight,
        modalImageWrapperHeight: modalImageWrapper.clientHeight,
        modalFooterHeight: modalFooter.clientHeight,
        modalImageHeight: modalImage.clientHeight
    };
}

/**
 * Set the height property of the image wrapper
 */
function setImageWrapperHeight() {
    const { modalImageWrapper } = getDOMElements();
    const {
        modalHeight,
        modalHeaderHeight,
        modalFooterHeight
    } = getModalHeightProperties();
    modalImageWrapper.style.height =
        modalHeight - (modalHeaderHeight + modalFooterHeight) + "px";
}

/**
 * Set the height property of the image to the height of the image wrapper
 */
function setImageHeight() {
    const { modalImage } = getDOMElements();
    const { modalHeight, modalHeaderHeight } = getModalHeightProperties();
    modalImage.style.maxHeight = modalHeight - modalHeaderHeight + "px";
}

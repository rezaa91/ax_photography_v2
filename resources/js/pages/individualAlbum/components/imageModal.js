import React, { Component } from "react";
import imageModalInit from "../modalSettings"; // modal specific javascript
import Settings from "./settings";
import Modal from "../../../global_components/modal";
import Alert from "../../../global_components/alert";
import Comments from "./commentsModal";
import LoadingWidget from "../../../global_components/loadingWidget";

class ImageModal extends Component {
    constructor(props) {
        super(props);

        this.getImageData(this.props.imageId);

        this.state = {
            user: this.props.user,
            imageDetails: {
                album_id: null,
                created_at: null,
                filepath: null,
                id: null,
                title: null,
                description: null,
                updated_at: null,
                album_cover_photo: null,
                homepage_background: null,
                users_which_like: null,
                displayModal: false,
                displayAlert: false,
                alertMsg: "",
                total_likes: 0,
                total_comments: 0,
                comments: null
            },
            hasUserLiked: false,
            displaySettings: false,
            editPhoto: false,
            photoZoomed: false,
            displayCommentsModal: false,
            isLoading: false
        }
    }

    componentDidMount() {
        // function imported at the top of this file
        imageModalInit();

        // set up event listeners for photo traversing using arrow keys
        document.addEventListener("keydown", this.setDirection);

        // fade out image header with title and description
        setTimeout(() => this.fadeOutHeader(), 1000);
    }

    componentWillUnmount() {
        // remove event listeners
        document.removeEventListener("keydown", this.setDirection);
    }

    fadeOutHeader = () => {
        const imageHeader = document.querySelector('.image-information');
        imageHeader.style.opacity = 0;
        imageHeader.style.transition = "opacity 2s";
    }

    fadeInHeader = () => {
        const imageHeader = document.querySelector('.image-information');
        imageHeader.style.opacity = 1;
        imageHeader.style.transition = "opacity 0.2s";
    }

    /**
     * Check whether the user likes the photo
     */
    doesUserLikePhoto = () => {
        const {users_which_like} = this.state.imageDetails;
        const {user} = this.state;

        if (!users_which_like || !user) {
            return;
        }

        const doesUserLike = users_which_like.find(like => user.id === like);
        this.setState({ hasUserLiked: doesUserLike });
    }

    /**
     * fetch the individual photo data via an API
     */
    getImageData = async (imageId) => {
        await fetch(`/api/photos/${imageId}`)
            .then(response => response.status === 200 && response.json())
            .then(data => {
                const imageDetails = data.data;
                this.setState({ imageDetails });

                // After collecting the data, check whether the current user has liked the photo
                this.doesUserLikePhoto();
            });
    }

    /**
     * Store photo like in database
     */
    likePhoto = () => {
        const {imageId} = this.props;
        const {user} = this.state;

        // if user is not logged in, return
        if (!user) {
            // TODO - inform user to log in
            return;
        }

        this.toggleLoading();

        const token = document.querySelector('meta[name="csrf-token"]').content;

        // Post like/un-like to database
        fetch(`/api/reaction`, {
            method: "POST",
            credentials: "same-origin",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": token,
                Authorization:
                    "Bearer " +
                    document.querySelector('meta[name="api_token"]').content
            },
            body: JSON.stringify({
                user_id: user.id || user.user_id,
                photo_id: imageId
            })
        }).finally(() => {
            this.toggleLoading();
        });

        // get updated image data in order to immediately refresh the view and update the state
        this.getImageData(imageId);
    }

    toggleDisplaySettings = () => {
        const {user, displaySettings} = this.state;

        if (!user || !user.isAdmin) {
            return;
        }

        this.setState({ displaySettings: !displaySettings });
    }

    /**
     * Display the modal confirming whether the user wishes to delete the photo
     */
    toggleDisplayModal = () => {
        const {displayModal} = this.state;
        this.setState({displayModal: !displayModal});
    }

    /**
     * Delete the photo from the DB and storage
     */
    actionDelete = async () => {
        const {user} = this.state;

        if (!user || !user.isAdmin) {
            return;
        }

        const {
            album_cover_photo,
            homepage_background
        } = this.state.imageDetails;
        const { imageId, closeModal, refreshAlbum } = this.props;
        const token = document.querySelector('meta[name="csrf-token"]').content;
        let alertMsg = null;

        if (album_cover_photo) {
            alertMsg = "You cannot delete this photo as it is the album cover";
            this.setState({ displayAlert: true, alertMsg });
            return;
        }

        if (homepage_background) {
            alertMsg =
                "You cannot delete this photo as it is the homepage background image";
            this.setState({ displayAlert: true, alertMsg });
            return;
        }

        this.toggleLoading();

        await fetch(`/api/delete_photo/${imageId}`, {
            method: "DELETE",
            redirect: "follow",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                token: token,
                Authorization:
                    "Bearer " +
                    document.querySelector('meta[name="api_token"]').content
            }
        })
            .then(() => {
                // reset state
                this.setState({ displayAlert: false });
                this.toggleDisplayModal();
                closeModal();
                refreshAlbum();
            })
            .catch(() => {
                alertMsg =
                    "There was an error deleting the image. Please try again";
                this.setState({ displayAlert: true, alertMsg });
                this.toggleLoading();
            });
    }

    toggleEditPhoto = () => {
        const {user, editPhoto} = this.state;

        if (!user || !user.isAdmin) {
            return;
        }

        if (!editPhoto) {
            this.fadeInHeader();
        }

        this.setState({editPhoto: !editPhoto});
    }

    /**
     * Set editPhoto state value to false when user clicks outside of text input boxes
     * Save any changes
     * @param {event} e
     */
    stopEditPhoto = (e) => {
        const {editPhoto} = this.state;

        if (!editPhoto) {
            return;
        }

        if (e.target.nodeName === "INPUT" || e.target.nodeName === "TEXTAREA") {
            return;
        }

        editPhoto && this.setState({ editPhoto: false });

        // update image details in database via API call
        this.updateImageDetails();
    }

    changeInput = (e) => {
        const {title, description} = this.state.imageDetails;
        const {imageDetails} = this.state;
        let titleValue = title;
        let descriptionValue = description;
        const elementChanging = e.target.nodeName;
        const value = e.target.value;

        switch (elementChanging) {
            case "INPUT":
                titleValue = value;
                break;

            case "TEXTAREA":
                descriptionValue = value;
                break;
        }

        this.setState({
            imageDetails: {
                ...imageDetails,
                title: titleValue,
                description: descriptionValue
            }
        });
    }

    saveOnEnter = (e) => {
        const enterKeyCharCode = 13;

        if (e.keyCode !== enterKeyCharCode) {
            return;
        }

        this.updateImageDetails();
        this.toggleEditPhoto();
    }

    /**
     * Update image details via API
     */
    updateImageDetails = () => {
        const {user} = this.state;

        if (!user || !user.isAdmin) {
            return;
        }

        const { title, description } = this.state.imageDetails;
        const { imageId } = this.props;
        const token = document.querySelector('meta[name="csrf-token"]').content;

        this.toggleLoading();

        fetch(`/api/update_photo/${imageId}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                token: token,
                Authorization:
                    "Bearer " +
                    document.querySelector('meta[name="api_token"]').content
            },
            body: JSON.stringify({
                title: title,
                description: description
            })
        }).finally(() => {
            this.toggleLoading();
        });
    }

    setDirection = (e) => {
        const leftArrowCode = 37;
        const rightArrowCode = 39;

        if (e.keyCode === leftArrowCode) {
            this.navigate("left");
        } else if (e.keyCode === rightArrowCode) {
            this.navigate("right");
        } else {
            return;
        }
    }

    /**
     * Navigate between images in album
     * @param {string} direction
     */
    navigate = (direction) => {
        const {previousImageId, nextImageId, changeImage, closeModal} = this.props;

        if (direction === 'left' && previousImageId) {
            closeModal();
            changeImage(previousImageId);
        } else if (direction === "right" && nextImageId) {
            closeModal();
            changeImage(nextImageId);
        }
    }

    // toggle zoom on image click
    toggleZoom = () => {
        const {photoZoomed} = this.state;
        this.setState({photoZoomed: !photoZoomed});
    }

    hideAlert = () => {
        this.setState({displayAlert: false});
    }

    displayCommentsModal = () => {
        this.setState({displayCommentsModal: true});
    }

    hideCommentsModal = () => {
        this.setState({displayCommentsModal: false});
    }

    alertChange = (alertMsg) => {
        this.setState({displayAlert: true, alertMsg});
    }

    toggleLoading = () => {
        const {isLoading} = this.state;
        this.setState({isLoading: !isLoading});
    }

    render() {
        const { closeModal, previousImageId, nextImageId } = this.props;
        const {
            user,
            imageDetails,
            hasUserLiked,
            displaySettings,
            displayModal,
            editPhoto,
            photoZoomed,
            displayAlert,
            alertMsg,
            displayCommentsModal,
            isLoading
        } = this.state;

        let thumbsUpStyle = null,
            imageStyle = null;
        if (hasUserLiked) {
            thumbsUpStyle = { color: "green" };
        }

        if (photoZoomed) {
            imageStyle = { transform: "scale(1.5)", cursor: "zoom-out" };
        }

        return (
            <div>
                {displayModal && (
                    <Modal
                        message="Are you sure you want to delete this photo?"
                        action={this.actionDelete}
                        resetState={this.toggleDisplayModal}
                    />
                )}

                {displayAlert && (
                    <Alert message={alertMsg} resetState={this.hideAlert} />
                )}

                {displayCommentsModal && (
                    <Comments
                        close={this.hideCommentsModal}
                        imageDetails={imageDetails}
                        user={user}
                        refresh={this.getImageData}
                    />
                )}

                <div
                    className="imageModal-wrapper"
                    onClick={e => {
                        this.stopEditPhoto(e);
                    }}
                >
                    {isLoading && <LoadingWidget />}

                    <div className="imageModal-content">
                        <div className="imageModal-header">
                            <a onClick={closeModal}>&times;</a>
                        </div>

                        <div
                            className="image-information"
                            onMouseOver={this.fadeInHeader}
                            onMouseOut={this.fadeOutHeader}
                        >
                            { editPhoto ? (
                                <div className='image-input'>
                                    <input 
                                    name="title"
                                    type="text"
                                    placeholder="Title..."
                                    value={imageDetails.title ? imageDetails.title.toUpperCase() : ''}
                                    onChange={(e) => {this.changeInput(e)}}
                                    onKeyDown={(e) => {this.saveOnEnter(e)}}
                                    />
                                </div>
                            ) : (
                                <div>
                                    <h2 onDoubleClick={this.toggleEditPhoto}>
                                        {imageDetails.title &&
                                            imageDetails.title.toUpperCase()}
                                    </h2>
                                    <p onDoubleClick={this.toggleEditPhoto}>
                                        {imageDetails.description}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="image-wrapper">
                            {previousImageId && (
                                <div
                                    className="arrow left-arrow"
                                    onClick={() => this.navigate("left")}
                                >
                                    <i className="fas fa-chevron-left" />
                                </div>
                            )}

                            <img
                                className="imageModal-img"
                                src={
                                    imageDetails.filepath &&
                                    `/storage/uploads/${imageDetails.filepath}`
                                }
                                onClick={this.toggleZoom}
                                style={imageStyle}
                            />

                            {nextImageId && (
                                <div
                                    className="arrow right-arrow"
                                    onClick={() => this.navigate("right")}
                                >
                                    <i className="fas fa-chevron-right" />
                                </div>
                            )}
                        </div>

                        <div className="imageModal-footer">
                            <span>
                                {!!user && user.isAdmin && (
                                    <span onClick={this.toggleDisplaySettings}>
                                        <i className="fas fa-cog" />
                                    </span>
                                )}

                                {displaySettings && (
                                    <Settings
                                        imageDetails={imageDetails}
                                        user_id={user.id || user.user_id}
                                        toggleDisplayModal={this.toggleDisplayModal}
                                        toggleEditPhoto={this.toggleEditPhoto}
                                        alertChange={this.alertChange}
                                    />
                                )}
                            </span>
                            <span>
                                <span className="like-counter">
                                    {imageDetails.total_comments}
                                </span>
                                <i
                                    className="fas fa-comment comments-icon"
                                    onClick={this.displayCommentsModal}
                                />

                                <span className="like-counter">
                                    {imageDetails.total_likes}
                                </span>
                                <i
                                    className="fas fa-thumbs-up"
                                    onClick={this.likePhoto}
                                    style={thumbsUpStyle}
                                />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ImageModal;

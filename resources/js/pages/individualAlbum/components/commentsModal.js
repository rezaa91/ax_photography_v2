import React, { Component } from "react";
import Validate from "../../../classes/Validate";
import LoadingWidget from "../../../global_components/loadingWidget";

class Comments extends Component {
    constructor() {
        super();

        this.state = {
            commentMessage: "",
            characterLimit: 250,
            charactersRemaining: 250,
            isLoading: false
        };

        this.onChangeMessage = this.onChangeMessage.bind(this);
        this.postMessage = this.postMessage.bind(this);
        this.postMessageOnEnter = this.postMessageOnEnter.bind(this);
        this.renderComments = this.renderComments.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
        this.toggleLoading = this.toggleLoading.bind(this);
    }

    /**
     * Update comments message and character counter on change
     * @param {event} e
     */
    onChangeMessage(e) {
        const { charactersRemaining, characterLimit } = this.state;
        const value = e.target.value;
        const charactersLeft = characterLimit - value.length;

        if (charactersRemaining < 0) {
            return;
        }

        this.setState({
            commentMessage: value,
            charactersRemaining: charactersLeft
        });
    }

    /**
     * Post message when user presses the enter key
     * @param {event} e
     */
    postMessageOnEnter(e) {
        const enterKeyCode = 13;

        if (e.keyCode !== enterKeyCode) {
            return;
        }

        this.postMessage();
    }

    postMessage() {
        const { user, imageDetails } = this.props;

        if (!user) {
            return;
        }

        const token = document.querySelector('meta[name="csrf-token"]').content;
        const { commentMessage } = this.state;

        // return if comment is empty string
        if (!commentMessage) {
            return;
        }

        this.toggleLoading();

        fetch(`/api/post_comment/${imageDetails.id}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": token,
                Authorization:
                    "Bearer " +
                    document.querySelector('meta[name="api_token"]').content
            },
            body: JSON.stringify({
                user_id: user.id,
                post: commentMessage
            })
        })
            .then(() => {
                const { characterLimit } = this.state;
                this.setState({
                    commentMessage: "",
                    charactersRemaining: characterLimit
                });

                // Refresh details to display most up to date comments
                this.props.refresh(imageDetails.id);
            })
            .finally(() => {
                this.toggleLoading();
            });
    }

    /**
     * loops through and styles each comment in appropriate jsx in order to display in render function
     * @return JSX which is used to render each comment in render function
     */
    renderComments() {
        const { imageDetails } = this.props;

        return imageDetails.comments.map((comment, index) => {
            if (imageDetails.id !== comment.photo_id) {
                return;
            }

            return (
                <div className="comment" key={index}>
                    <div className="flex">
                        <div className="user-info">
                            <div className="avatar">
                                <img
                                    src={`/storage/${
                                        comment.avatar_filepath
                                            ? `avatars/${
                                                  comment.avatar_filepath
                                              }`
                                            : "defaults/avatar.png"
                                    }`}
                                />
                            </div>
                            <span className="username">
                                {comment.username && comment.username}
                            </span>
                        </div>

                        <div className="comment-message">
                            <div className="timestamp">
                                {Validate.validateDate(comment.created_at)}
                            </div>
                            {comment.post_text}
                        </div>

                        {/* Only allow users to delete their own comments */}
                        {this.props.user &&
                            this.props.user.id === comment.user_id && (
                                <div className="delete-comment">
                                    <i
                                        className="fas fa-trash-alt"
                                        onClick={() =>
                                            this.deleteComment(comment.id)
                                        }
                                    />
                                </div>
                            )}
                    </div>
                </div>
            );
        }, this);
    }

    /**
     * @param int postId
     */
    deleteComment(postId) {
        const token = document.querySelector('meta[name="csrf-token"]').content;

        this.toggleLoading();

        fetch(`/api/delete_comment/${postId}`, {
            method: "Delete",
            headers: {
                "X-CSRF-TOKEN": token,
                Authorization:
                    "Bearer " +
                    document.querySelector('meta[name="api_token"]').content
            }
        }).finally(() => {
            this.toggleLoading();
        });

        // Refresh details to display most up to date comments
        const { id } = this.props.imageDetails;
        this.props.refresh(id);
    }

    toggleLoading() {
        const { isLoading } = this.state;
        this.setState({ isLoading: !isLoading });
    }

    render() {
        const {
            commentMessage,
            charactersRemaining,
            characterLimit,
            isLoading
        } = this.state;
        const { user, close } = this.props;
        const comments = this.renderComments();

        return (
            <div className="comments-wrapper">
                <div className="comments-box">
                    {isLoading && <LoadingWidget />}

                    <div className="comments-header">
                        <span onClick={close}>&times;</span>
                    </div>

                    <div className="comments-body">{comments}</div>

                    {user ? (
                        <div className="comments-footer">
                            <div className="character-counter">
                                <span>
                                    {charactersRemaining} characters remaining
                                </span>
                            </div>
                            <div className="flex">
                                <div className="textbox">
                                    <textarea
                                        placeholder="write a comment..."
                                        value={commentMessage}
                                        onChange={this.onChangeMessage}
                                        maxLength={characterLimit}
                                        onKeyUp={this.postMessageOnEnter}
                                        autoFocus
                                    />
                                </div>

                                <div className="post">
                                    <button onClick={this.postMessage}>
                                        POST
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="comments-footer">
                            Please{" "}
                            <a href="/login" className="login">
                                login
                            </a>{" "}
                            to comment.
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default Comments;

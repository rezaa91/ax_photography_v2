import React, {Component} from 'react';

class Comments extends Component {
    constructor() {
        super();

        this.state = {
            commentMessage: '',
            characterLimit: 250,
            charactersRemaining: 250
        }

        this.onChangeMessage = this.onChangeMessage.bind(this);
        this.postMessage = this.postMessage.bind(this);
        this.postMessageOnEnter = this.postMessageOnEnter.bind(this);
        this.renderComments = this.renderComments.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
    }

    /**
     * Update comments message and character counter on change
     * @param {event} e 
     */
    onChangeMessage(e) {
        const {charactersRemaining, characterLimit} = this.state;
        const value = e.target.value;        
        const charactersLeft = characterLimit - value.length;
        
        if (charactersRemaining < 0) {
            return;
        }

        this.setState({commentMessage: value, charactersRemaining: charactersLeft});
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
        const {user, imageDetails} = this.props;

        if (!user || !user.isAdmin) {
            return;
        }

        const token = document.querySelector('meta[name="csrf-token"]').content;
        const {commentMessage} = this.state;

        // return if comment is empty string
        if (!commentMessage) {
            return;
        }

        fetch(`/api/post_comment/${imageDetails.id}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token
            },
            body: JSON.stringify({
                'user_id': user.id,
                'post': commentMessage
            })
        })
        .then(response => console.log(response))
        .catch(error => console.log(error));

        this.setState({commentMessage: ''});
    }

    /**
     * loops through and styles each comment in appropriate jsx in order to display in render function
     * @return JSX which is used to render each comment in render function
     */
    renderComments() {
        const {comments} = this.props.imageDetails;

        return comments.map((comment, index) => (
            <div className="comment" key={index}>
                <div className="flex">
                    <div className="user-info">
                        <div className='avatar'>
                            <img src={`/storage/avatars/${comment.avatar_filepath}`} />
                        </div>
                        <span>{comments.username}</span>
                    </div>

                    <div className="comment-message">
                        {comment.post_text}
                    </div>

                    <div className="delete-comment">
                        <i className="fas fa-trash-alt" onClick={this.deleteComment}></i>
                    </div>
                </div>

                <div className="timestamp">
                    {comment.created_at}
                </div>
            </div>
        ));
    }

    deleteComment() {
        console.log('comment deleted');
    }

    render() {
        const {commentMessage, charactersRemaining, characterLimit} = this.state;
        const {user, close} = this.props;
        const comments = this.renderComments();

        return(
            <div className="comments-wrapper">

                <div className="comments-box">
                    <div className="comments-header">
                        <span onClick={close}>&times;</span>
                    </div>

                    <div className="comments-body">
                        {comments}
                    </div>

                    { user && user.isAdmin ? (
                        <div className="comments-footer">
                            <div className="character-counter">
                                <span>{charactersRemaining} characters remaining</span>
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
                                    >
                                    </textarea>
                                </div>

                                <div className="post">
                                    <button onClick={this.postMessage}>POST</button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="comments-footer">Please <a href="/login">login</a> to comment.</div> 
                    )}

                </div>

            </div>
        );
    }
}

export default Comments;

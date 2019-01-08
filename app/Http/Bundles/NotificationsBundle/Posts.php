<?php

namespace App\Http\Bundles\NotificationsBundle;

use App\Posts as PostsModel;

class Posts
{
    /**
     * Post photo comment
     * @param Array $postData
     * @param int $photoId
     */
    public function postComment(Array $postData, int $photoId)
    {
        $post = new PostsModel();
        $post->photo_id = $photoId;
        $post->user_id = $postData['user_id'];
        $post->post_text = $postData['post'];
        $post->save();
    }

    /**
     * Delete the post which is associated with the post id passed to the function
     * @param Request $request
     * @param int $postId
     */
    public function deleteComment(Request $request, $postId)
    {
        $post = PostsModel::find($postId);
        $post->delete();
    }
}

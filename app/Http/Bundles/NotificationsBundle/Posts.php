<?php

namespace App\Http\Bundles\NotificationsBundle;

use App\Posts as PostsModel;
use Illuminate\Support\Facades\Log;
use App\Exceptions\DatabaseException;

class Posts extends Notifications
{
    /**
     * Post photo comment
     * @param Array $postData
     * @param int $photoId
     */
    public function postComment(Array $postData, int $photoId)
    {
        try{
            $post = new PostsModel();
            $post->photo_id = $photoId;
            $post->user_id = $postData['user_id'];
            $post->post_text = $postData['post'];

            if (!$post->save()) {
                $errorMsg = 'Could not save comment "' . $postData['post'] . '" from ' . $postData['user_id'] . '\n
                to database, to image: ' . $photoId;

                Log::warning($errorMsg);

                throw new DatabaseException($errorMsg);
            }

            $this->addNotification($post->user_id, $post->id, self::POST);

            Log::info('Comment from user: ' . $postData['user_id'] . ': "' . $postData['post'] . '" saved to image: ' . $photoId);

        } catch (DatabaseException $e) {
            return $e->getMessage();
        }
    }

    /**
     * Delete the post which is associated with the post id passed to the function
     * 
     * @param int $postId
     */
    public function deleteComment($postId)
    {
        try {
            $post = PostsModel::find($postId);
            
            if (!$post->delete()) {
                $errorMsg = 'Unable to delete comment: ' . $postId;
                Log::warning($errorMsg);

                throw new DatabaseException($errorMsg);
            }

            $this->removeNotification($post->user_id, $post->id, self::POST);

            Log::info('Deleted post: ' . $postId);

        } catch (DatabaseException $e) {
            return $e->getMessage();
        }
    }
}

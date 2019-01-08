<?php

namespace App\Http\Controllers\Api;

use App\Posts as PostsModel;
use Illuminate\Http\Request;
use App\Http\Bundles\NotificationsBundle\Posts;

class PostsController extends ApiController
{
    private $moduleClass;

    /**
     * @param Posts $moduleClass
     */
    public function __construct(Posts $moduleClass)
    {
        $this->moduleClass = $moduleClass;
    }

    /**
     * Post photo comment 
     * {/api/post_comment/{id}}
     * 
     * @param Request $request
     * @param int $photoId
     */
    public function postComment(Request $request, int $photoId)
    {
        $postData = $request->json()->all();

        $this->moduleClass->postComment($postData, $photoId);
    }

    /**
     * Delete photo comment 
     * {/api/delete_comment/{id}}
     * 
     * @param int $postId
     */
    public function deleteComment(int $postId)
    {
        $post = PostsModel::find($postId);
        $post->delete();
    }
}

<?php

namespace App\Http\Controllers\Photos;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Posts;
use App\Photos;

class PostsController extends Controller
{
    /**
     * Post photo comment
     * @param Request $request
     * @param int $photoId
     */
    public function postComment(Request $request, $photoId)
    {
        $postData = $request->json()->all();

        $post = new Posts();
        $post->photo_id = $photoId;
        $post->user_id = $postData['user_id'];
        $post->post_text = $postData['post'];
        $post->save();
    }
}

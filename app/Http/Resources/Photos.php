<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;

class Photos extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'filepath' => $this->filepath,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'user_id' => $this->user_id,
            'album_id' => $this->album_id,
            'total_likes' => DB::table('photos_users_likes')->where('photo_id', $this->id)->count(),
            'total_comments' => DB::table('posts')->where('photo_id', $this->id)->count(),
            'users_which_like' => DB::table('photos_users_likes')->where('photo_id', $this->id)->pluck('user_id'),
            'album_cover_photo' => DB::table('albums')->where('cover_photo_id', $this->id)->count() === 1 ? true : false,
            'homepage_background' => DB::table('homepage_backgrounds')->where('photo_id', $this->id)->count() === 1 ? true : false,
            'comments' => $this->getCommentInformation($this->id)
        ];
    }

    /**
     * Get all the comment information associated to the individual photo identified by the photoId arg
     *
     * @param int $photoId
     * @return array consisting of comment information
     */
    private function getCommentInformation($photoId)
    {
        return DB::table('posts')
            ->leftJoin('users', 'posts.user_id', '=', 'users.id')
            ->select('posts.id', 'posts.photo_id', 'posts.post_text', 'posts.created_at', 'users.id AS user_id', 'users.username', 'users.avatar_filepath')
            ->orderBy('posts.created_at', 'desc')
            ->get();
    }
}

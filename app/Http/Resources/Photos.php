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

            // TODO - BUG - $this->user_id is the id of the user who uploaded the image, not the currently logged in user
            'user_liked' => DB::table('photos_users_likes')->where(['photo_id' => $this->id, 'user_id' => $this->user_id])->count()
        ];
    }
}

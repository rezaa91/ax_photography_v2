<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Photos;
use App\HomepageBackground;

class InidividualAlbum extends JsonResource
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
            'title' => $this->album_name,
            'albumId' => $this->album_id,
            'images' => Photos::where('album_id', $this->album_id)->orderBy('created_at', 'desc')->get(),
            'containsBackgroundImage' => Photos::where('id', $this->backgroundImageId())->where('album_id', $this->album_id)->count() === 1 ? true : false,
        ];
    }

    private function backgroundImageId()
    {
        return HomepageBackground::find(1)->photo_id;
    }
}

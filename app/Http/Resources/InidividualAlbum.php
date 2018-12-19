<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Photos;

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
            'images' => Photos::where('album_id', $this->album_id)->get(),
        ];
    }
}

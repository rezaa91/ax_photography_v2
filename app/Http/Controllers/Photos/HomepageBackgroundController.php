<?php

namespace App\Http\Controllers\Photos;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\HomepageBackground as Image;

class HomepageBackgroundController extends PhotosController
{

    /**
     * Update background image {/api/background_image/{id}}
     *
     * @param int $photoId
     */
    public function updateBackgroundImage(int $photoId)
    {
        if (Image::count() !== 1) {
            return;
        }
        
        $image = Image::find(1); // only one row in table
        $image->photo_id = $photoId;
        $image->save();
    }
}

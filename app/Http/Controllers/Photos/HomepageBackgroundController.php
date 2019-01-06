<?php

namespace App\Http\Controllers\Photos;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\HomepageBackground as Image;

class HomepageBackgroundController extends PhotosController
{

    private $backgroundImage = null;

    public function __construct()
    {
        if (Image::count() !== 1) {
            return;
        }

        $this->backgroundImage = Image::first();
    }

    /**
     * Get backgroundImage property
     *
     * @return Array $backgroundImage
     */
    public function getBackgroundImage()
    {
        return $this->backgroundImage;
    }

    /**
     * Update background image {/api/background_image/{id}}
     *
     * @param int $photoId
     */
    public function updateBackgroundImage(int $photoId)
    {        
        if (!auth()->user()->isAdmin) {
            return;
        }

        if (Image::count() !== 1) {
            return;
        }
        
        $image = Image::find(1); // only one row in table
        $image->photo_id = $photoId;
        $image->save();
    }
}

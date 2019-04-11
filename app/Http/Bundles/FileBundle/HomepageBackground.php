<?php

namespace App\Http\Bundles\FileBundle;

use App\HomepageBackground as Image;
use App\Http\Bundles\FileBundle\Photos;
use Illuminate\Support\Facades\Log;
use Exception;

class HomepageBackground extends Photos
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
     * @param int $photoId
     */
    public function changeBackgroundImage(int $photoId)
    {
        if (Image::count() !== 1) {
            $errorMessage = 'homepage background image table should have one record stored at all times.';
            Log::warning($errorMessage);
            throw new Exception($errorMessage);

            return;
        }
        
        $image = Image::find(1); // only one row in table
        $image->photo_id = $photoId;
        $image->save();
    }
}

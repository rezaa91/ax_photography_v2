<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Bundles\FileBundle\HomepageBackground;

class HomepageBackgroundController extends ApiController
{
    private $moduleClass;

    /**
     * @param HomepageBackground $class
     */
    public function __construct(HomepageBackground $class)
    {
        $this->moduleClass = $class;
    }

    /**
     * Update background image 
     * {/api/background_image/{id}}
     *
     * @param int $photoId
     */
    public function postUpdateBackgroundImage(int $photoId)
    {
        Log::info('Attempting to update homepage background to image: ' .$photoId);

        if (!auth()->user()->isAdmin) {
            Log::warning('Unable to change background image to ' . $photoId . ' as user not authenticated');
            
            return;
        }

        $this->moduleClass->changeBackgroundImage($photoId);
    }
}

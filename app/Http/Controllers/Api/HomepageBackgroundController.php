<?php

namespace App\Http\Controllers\Api;

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
        if (!auth()->user()->isAdmin) {
            return;
        }

        $this->moduleClass->changeBackgroundImage($photoId);
    }
}

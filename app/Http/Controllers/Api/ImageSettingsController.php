<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Bundles\SettingsBundle\ImageSettings;

class ImageSettingsController extends ApiController
{
    private $moduleClass;

    /**
     * @param ImageSettings $class
     */
    public function __construct(ImageSettings $class)
    {
        $this->moduleClass = $class;
    }

    /**
     * {/api/reaction}
     * 
     * @param Request $request
     */
    public function postToggleLikeImage(Request $request)
    {
        $data = $request->json()->all();

        $this->moduleClass->toggleLikeImage($data);
    }
}

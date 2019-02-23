<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Bundles\FileBundle\Photos;

class PhotosController extends ApiController
{

    private $moduleClass;

    /**
     * @param Photos $moduleClass
     */
    public function __construct(Photos $moduleClass)
    {
        $this->moduleClass = $moduleClass;
    }

    /**
     * Update image details 
     * {api/update_photo/{id}}
     * 
     * @param integer $photo_id
     * @param Request $request
     * 
     * @return boolean
     */
    public function postUpdateImageDetails(int $photoId, Request $request)
    {
        if (!auth()->user()->isAdmin) {
            return;
        }
        
        $this->validate($request, [
            'title' => 'nullable',
            'description' => 'nullable'
        ]);

        $imageDetails = [
            'title' => $request->input('title'),
            'description' => $request->input('description'),
        ];

        $this->moduleClass->changeImageDetails($photoId, $imageDetails);
    }    

    /**
     * Delete image from DB
     * Route = {/api/delete_photo/{id}}
     * 
     * @param int $photoId
     * @param bool $deletingAlbum - if set to true, the photo will be deleted regardless of whether it is the album cover
     */
    public function deleteImage(int $photoId)
    {
        if (!auth()->user()->isAdmin) {
            return;
        }

        $this->moduleClass->deleteImage($photoId);
    }

    /**
     * Upload image directly to album
     * Route = {/api/photo/{album_id}}
     *
     * @param integer $albumId
     */
    public function uploadImage(Request $request, int $albumId)
    {
        $fileInfo = [];

        if ($request->file('file')) {
            $fileInfo['file'] = $this->moduleClass->init($request->file('file'));
        }

        $this->moduleClass->storeImageInDatabase($fileInfo, $albumId);
    }
}   

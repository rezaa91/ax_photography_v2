<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Bundles\FileBundle\Albums;

class AlbumsController extends ApiController
{

    private $moduleClass;

    /**
     * @param Albums $moduleClass
     */
    public function __construct(Albums $moduleClass)
    {
        $this->moduleClass = $moduleClass;
    }

    /**
     * {/api/update_cover_photo/{id}}
     * @param int $photoId
     */
    public function postUpdateCoverImage(int $photoId)
    {
        if (!auth()->user()->isAdmin) {
            return;
        }

        $this->moduleClass->updateCoverImage($photoId);
    }

    /**
     * {/api/update_album/{id}}
     * 
     * @param Request $request
     * @param int $albumId
     */
    public function postUpdateAlbumTitle(Request $request, int $albumId)
    {
        if (!auth()->user()->isAdmin) {
            return;
        }

        $albumData = $request->json()->all();
        $this->moduleClass->updateAlbumTitle($albumId, $albumData['album_name']);
    }

    /**
     * {/api/delete_album/{id}}
     * @param integer $albumId
     */
    public function deleteAlbum(int $albumId)
    {
        if (!auth()->user()->isAdmin) {
            return;
        }

        $this->moduleClass->deleteAlbum($albumId);
    }
}

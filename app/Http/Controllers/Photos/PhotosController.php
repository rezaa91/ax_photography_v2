<?php

namespace App\Http\Controllers\Photos;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Photos;

class PhotosController extends FileController 
{

    /**
     * @inheritDoc
     */
    protected $directoryToStore = 'uploads';

    /**
     * Store image in database
     * @param Request $request
     * @param Array $album
     * 
     * @return integer - photo id of newly inserted record
     */
    public function storeImageInDatabase(Request $request, Array $album)
    {

        $this->validate($request, [
            'title' => 'required',
            'description' => 'nullable'
        ]);

        $photo = new Photos();
        $photo->title = $request->input('title');
        $photo->description = $request->input('description');
        $photo->album_id = $album['id'];
        $photo->filepath = $this->getFilenameToStore();
        $photo->created_at = Now();
        $photo->user_id = auth()->user()->id;
        
        // Upload file to storage once inserted in to database
        if ($photo->save()) {
            $this->uploadFile();
            return $photo->id;
        }
    }

    /**
     * Update image details
     * @param integer $photo_id
     * @param Request $request
     * 
     * @return boolean
     */
    public function updateImage(int $photo_id, Request $request)
    {
        $this->validate($request, [
            'title' => 'required',
            'description' => 'nullable'
        ]);

        $photo = Photos::find($photo_id);
        $photo->title = $request->input('title');
        $photo->description = $request->input('description');
        $photo->save();
    }

    /**
     * Delete image from DB
     * Route = {/api/delete_photo/{id}}
     * @param int $photoId
     */
    public function deleteImage(int $photoId)
    {
        $photo = Photos::find($photoId);
        
        // If deleted successfully from DB, delete file
        if ($photo->delete()) {
            $this->deleteFile($photo->filepath);
        }
    }

    /**
     * Return the album id from the photoId passed as an arg
     *
     * @param int $photoId
     * @return int $albumId
     */
    protected function getAlbumIdFromPhotoId($photoId)
    {
        $photo = Photos::find($photoId);
        return $photo->album_id;
    }
}   

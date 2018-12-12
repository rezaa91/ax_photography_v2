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
     * Delete image from DB
     * Route = {/api/delete_photo/{id}}
     * @param int $photoId
     */
    public function deleteImage(int $photoId) {
        $photo = Photos::find($photoId);
        
        // If deleted successfully from DB, delete file
        if ($photo->delete()) {
            $this->deleteFile($photo->filepath);
        }
    }
}   

<?php

namespace App\Http\Controllers\Photos;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Photos;

class PhotosController extends FileController 
{
    /**
     * Store image in database
     *
     * @return void
     */
    public function storeImageInDatabase(Request $request, $album)
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
}   

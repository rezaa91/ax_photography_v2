<?php

namespace App\Http\Controllers\Photos;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Photos;
use App\Albums;
use App\Http\Controllers\Photos\HomepageBackgroundController as HomepageBackground;

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
        $albumId = $photo->album_id;

        // Do not allow user to delete photo if it is currently the homepage or album cover
        if ($this->isAlbumCover($albumId, $photoId) || $this->isHomepageBackground($photoId)) {
            return;
        }
        
        // If deleted successfully from DB, delete file
        if ($photo->delete()) {
            $this->deleteFile($photo->filepath);
            $this->removeImageLikes($photoId);
        }
    }

    /**
     * Check if photo found through $photoId is the current album cover image
     *
     * @param int $photoId
     * @return boolean
     */
    private function isAlbumCover(int $albumId, int $photoId)
    {
        $album = Albums::find($albumId);
        
        if ($album->cover_photo_id !== $photoId) {
            return false;
        }

        return true;
    }

    /**
     * Check if photo found through $photoId is the current homepage background image
     *
     * @param int $photoId
     * @return boolean
     */
    private function isHomepageBackground(int $photoId)
    {
        $currentBackgroundImage = new HomepageBackground();
        if ($currentBackgroundImage->getBackgroundImage()->photo_id !== $photoId) {
            return false;
        }

        return true;
    }

    /**
     * Remove all the user likes from the image associated to the imageId passed in as arg
     *
     * @param integer $photoId
     */
    public function removeImageLikes(int $photoId)
    {
        DB::table('photos_users_likes')->where('photo_id', $photoId)->delete();
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

<?php

namespace App\Http\Bundles\FileBundle;

use Illuminate\Support\Facades\DB;
use App\Photos as PhotosModel;
use App\Albums;
use App\Posts;
use App\Http\Bundles\FileBundle\File;
use App\Http\Controllers\Photos\HomepageBackgroundController;
use App\Http\Bundles\FileBundle\HomepageBackground;
use Validator;

class Photos extends File 
{
    /**
     * @inheritDoc
     */
    protected $directoryToStore = 'uploads';

    /**
     * @param string $uploadsDir
     */
    public function __construct($file = null)
    {
        if ($file) {
            parent::__construct($file);
        }
    }

    /**
     * Store image in database
     * @param Array $fileInfo
     * @param int $albumId
     * 
     * @return integer - photo id of newly inserted record
     */
    public function storeImageInDatabase(Array $fileInfo = [], int $albumId)
    {
        $validate = Validator::make($fileInfo, [
            'title' => 'nullable',
            'description' => 'nullable'
        ]);

        if ($validate->fails()) {
            return false;
        }

        $photo = new PhotosModel();
        $photo->title = isset($fileInfo['title']) ? $fileInfo['title'] : null;
        $photo->description = isset($fileInfo['description']) ? $fileInfo['description'] : null;
        $photo->album_id = $albumId;
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
     * Change image details
     * @param integer $photo_id
     * @param Array $imageDetails
     * 
     * @return boolean
     */
    public function changeImageDetails(int $photoId, Array $imageDetails)
    {
        $photo = PhotosModel::find($photoId);
        $photo->title = $imageDetails['title'];
        $photo->description = $imageDetails['description'];
        $photo->save();
    }

    /**
     * Delete image from DB
     * @param int $photoId
     * @param bool $deletingAlbum - if set to true, the photo will be deleted regardless of whether it is the album cover
     */
    public function deleteImage(int $photoId, bool $deletingAlbum = false)
    {
        $photo = PhotosModel::find($photoId);
        $albumId = $photo->album_id;

        // Do not allow user to delete photo if it is currently the homepage
        if ($this->isHomepageBackground($photoId)) {
            return;
        }

        // Do not allow user to delete photo if it is the album cover, unless deleting the full album
        if ($this->isAlbumCover($albumId, $photoId) && !$deletingAlbum) {
            return;
        }
        
        // If deleted successfully from DB, delete file
        if ($photo->delete()) {
            $this->deleteFile($photo->filepath);
            $this->removeImageLikes($photoId);
            $this->removePhotoComments($photoId);
        }
    }

    /**
     * Check if photo found through $photoId is the current album cover image
     *
     * @param int $photoId
     * @return boolean
     */
    protected function isAlbumCover(int $albumId, int $photoId)
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
    protected function isHomepageBackground(int $photoId)
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
     * Delete all photo comments related to $photoId
     * @param int $photoId
     */
    private function removePhotoComments(int $photoId)
    {
        $posts = Posts::where('photo_id', $photoId);
        $posts->delete();
    }
}   

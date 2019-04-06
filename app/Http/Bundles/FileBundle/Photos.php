<?php

namespace App\Http\Bundles\FileBundle;

use Illuminate\Support\Facades\Log;
use App\Photos as PhotosModel;
use App\Albums;
use App\Posts;
use App\Http\Bundles\FileBundle\File;
use App\Http\Bundles\FileBundle\HomepageBackground;
use Validator;
use App\Http\Bundles\NotificationsBundle\Notifications;
use App\PhotosUsersLikes;


class Photos extends File 
{
    /**
     * @inheritDoc
     */
    protected $directoryToStore = 'uploads';

    /**
     * @inheritDoc
     */
    protected $notifications = null;

    /**
     * @param Notifications $notifications
     * @param string $uploadsDir
     */
    public function __construct(Notifications $notifications, $file = null)
    {
        $this->notifications = $notifications;

        if ($file) {
            parent::__construct($file);
        }
    }

    /**
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
            Log::warning('Image validation failed whilst uploading to album: ' .$albumId);

            return false;
        }

        try {
            $photo = new PhotosModel();
            $photo->title = isset($fileInfo['title']) ? $fileInfo['title'] : null;
            $photo->description = isset($fileInfo['description']) ? $fileInfo['description'] : null;
            $photo->album_id = $albumId;
            $photo->filepath = $this->getFilenameToStore();
            $photo->created_at = Now();
            $photo->user_id = auth()->user()->id;
        
            // Upload file to storage once inserted in to database
            if (!$photo->save()) {
                $errorMsg = 'Could not store image: ' . $photo->id . ' to database';
                Log::warning($errorMsg);

                throw new DatabaseException($errorMsg);
            }

            $this->uploadFile();
            Log::info('image ' . $photo->id . ' stored to database. album: ' . $photo->album_id);
        
            return $photo->id;
            
        } catch (DatabaseException $e) {
            return $e->getMessage();
        }
    }

    /**
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
     * @param int $photoId
     * @param bool $deletingAlbum - if set to true, the photo will be deleted regardless of whether it is the album cover
     */
    public function deleteImage(int $photoId, bool $deletingAlbum = false)
    {
        $photo = PhotosModel::find($photoId);
        $albumId = $photo->album_id;

        // Do not allow user to delete photo if it is currently the homepage background
        if ($this->isHomepageBackground($photoId)) {
            Log::warning('Attempting to delete image: ' . $photoId . ' which is the current homepage background');

            return;
        }

        // Do not allow user to delete photo if it is the album cover, unless deleting the full album
        if ($this->isAlbumCover($albumId, $photoId) && !$deletingAlbum) {
            Log::warning('Attempting to delete image: ' . $photoId . ' which is currently album: ' . $albumId . ' cover image');

            return;
        }
        
        // If deleted successfully from DB, delete file
        if ($photo->delete()) {
            Log::info('Image: ' . $photoId . ' deleted');

            $this->deleteFile($photo->filepath);
            $this->removeImageLikes($photoId);
            $this->removePhotoComments($photoId);
        }
    }

    /**
     * Check if photo found through $photoId is the current album cover image
     * @param int $photoId
     * 
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
     * @param int $photoId
     * 
     * @return boolean
     */
    protected function isHomepageBackground(int $photoId)
    {
        $currentBackgroundImage = new HomepageBackground();
        
        if (!$currentBackgroundImage->getBackgroundImage() ||
            !$currentBackgroundImage->getBackgroundImage()->photo_id ||
            $currentBackgroundImage->getBackgroundImage()->photo_id !== $photoId) {
            return false;
        }

        return true;
    }

    /**
     * Remove all the user likes from the image associated to the imageId passed in as arg
     * Also, remove notifications associated to image likes
     * @param integer $photoId
     */
    public function removeImageLikes(int $photoId)
    {
        $imageLikes = PhotosUsersLikes::where('photo_id', $photoId)->get();

        foreach($imageLikes as $like) {
            $this->notifications->removeNotification($like->user_id, $like->id, Notifications::LIKE);
            $like->delete();
        }
    }

    /**
     * Delete all photo comments related to $photoId
     * Also, remove notifications associated to post
     * @param int $photoId
     */
    private function removePhotoComments(int $photoId)
    {
        $posts = Posts::where('photo_id', $photoId)->get();

        foreach ($posts as $post) {
            $this->notifications->removeNotification($post->user_id, $post->id, Notifications::POST);
            $post->delete();
        }
    }
}   

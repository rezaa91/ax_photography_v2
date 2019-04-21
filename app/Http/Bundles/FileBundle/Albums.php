<?php

namespace App\Http\Bundles\FileBundle;

use Exception;
use App\Exceptions\AlbumException;
use App\Exceptions\DatabaseException;
use App\Exceptions\FileUploadException;
use App\Photos as PhotosModel;
use App\Albums as AlbumsModel;
use Carbon\Carbon;
use App\Http\Bundles\FileBundle\Photos;
use Illuminate\Support\Facades\Log;
 

class Albums extends Photos
{
    /**
     * Album data
     *
     * @var array
     */
    private $album = [];

    /**
     * @inheritDoc
     */
    public function __construct($file = null)
    {
        if ($file) {
            parent::__construct($file);
        }
    }

    /**
     * Set album id
     *
     * @param int $id
     */
    public function setAlbumId(int $id)
    {
        $this->album['id'] = $id;
    }

    /**
     * Get album data property 
     */
    public function getAlbum()
    {
        return $this->album;
    }

    /**
     * Retrieve all albums in DB
     */
    public function getAllAlbums()
    {
        return AlbumsModel::all();
    }

    /**
     * @param Array $fileInfo
     * 
     * @throws AlbumException
     * @return bool
     */
    public function storeImage(Array $fileInfo)
    {
        if (!isset($fileInfo['file'])) {
            throw new FileUploadException('No file or incorrect array format supplied to function');
        }

        $this->init($fileInfo['file']);

        // If no album type selected, return and inform user
        if (!isset($fileInfo['create_album']) && $fileInfo['album'] === 'default') {
            Log::warning('No album selected to store image');

            throw new AlbumException('Please select an album to store your image in.');
        }

        // If new album created, store in database
        if ($fileInfo['create_album']) {
            if (!$this->createAlbum($fileInfo['create_album'])) {
                throw new AlbumException("The album could not be created as the album name already exists.");
            }
        }

        // If existing album selected, set the album id
        if ($fileInfo['album'] !== 'default') {
            $this->setAlbumId($fileInfo['album']);
            $this->updateAlbumTimestamp($fileInfo['album']);
        }

        // store image in database
        $photoId = $this->storeImageInDatabase($fileInfo, $this->album['id']);
        
        if ($fileInfo['create_album']) {
            $this->setDefaultAlbumCoverPhoto($photoId);
        }

        Log::info('Image: ' . $photoId . ' stored in album: ' . $this->getAlbum()['id']);

        return true;
    }

    /**
     * Store Album details in database
     *
     * @param string $albumName
     * 
     * @return bool - if album created successfully
     */
    public function createAlbum(string $albumName)
    {
        foreach ($this->getAllAlbums() as $album) {
            $currentAlbumName = $album->album_name;

            if (strtolower($currentAlbumName) === strtolower($albumName)) {
                Log::warning('Cannot create album ' . $albumName . ' as an album with this name already exists');

                return false;
            }
        }

        try {
            $album = new AlbumsModel();
            $album->album_name = $albumName;

            if (!$album->save()) {
                $errorMsg = 'Unable to save new album ' .$albumName. ' to database';
                Log::warning($errorMsg);

                throw new DatabaseException($errorMsg);
            }

            $this->setAlbumId($album->album_id);

            return true;

        } catch (DatabaseException $e) {
            return $e->getMessage();
        }

        Log::info('New album ' .$album->album_id . ' created');
    }

    /**
     * Set default album cover to newly uploaded photo
     * 
     * @param Int $photoId of newly uploaded image
     */
    private function setDefaultAlbumCoverPhoto($photoId)
    {
        try {
            $album = AlbumsModel::find($this->getAlbum()['id']);
            $album->cover_photo_id = $photoId;

            if (!$album->save()) {
                $errorMsg = 'Unable to set album: ' . $album->album_id . ' default cover photo to image: ' . $photoId;
                Log::warning($errorMsg);

                throw new DatabaseException($errorMsg);
            }

        } catch (DatabaseException $e) {
            return $e->getMessage();
        }

        Log::info('Album ' . $album->album_id . ' . default cover photo set to image: ' . $photoId);
    }

    /**
     * @param Integer $albumId
     * @param String $albumName
     */
    public function updateAlbumTitle(int $albumId, string $albumName)
    {
        try {
            $album = AlbumsModel::find($albumId);
            $album->album_name = $albumName;
            
            if (!$album->save()) {
                $errorMsg = 'Unable to update album: ' . $albumId . ' title.';

                Log::warning($errorMsg);
                throw new DatabaseException($errorMsg);
            }
            
            Log::info('Album ' . $albumId . ' title updated to ' .$albumName);

            return true;
            
        } catch (DatabaseException $e) {
            return $e->getMessage();
        }
    }

    /**
     * Update the updated_at field in album
     *
     * @param integer $albumId
     */
    private function updateAlbumTimestamp(int $albumId)
    {
        $album = AlbumsModel::find($albumId);
        $album->updated_at = Carbon::now();
        
        if ($album->save()) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @param integer $photoId
     */
    public function updateCoverImage(int $photoId)
    {
        try {
            $albumId = PhotosModel::select('album_id')->where('id', $photoId)->first();
            $album = AlbumsModel::find($albumId->album_id);
            $album->cover_photo_id = $photoId;
            
            if (!$album->save()) {
                $errorMsg = 'Unable to update album: ' . $albumId . ' cover image to image: ' . $photoId;
                Log::error($errorMsg);
                throw new DatabaseException($errorMsg);
            }

            Log::info('album: ' . $albumId . ' cover image updated with image: ' . $photoId);

        } catch(DatabaseException $e) {
            return $e->getMessage();
        }
    }

    /**
     * @param int $albumId
     */
    public function deleteAlbum(int $albumId)
    {
        $photosInAlbum = PhotosModel::where('album_id', $albumId)->get();

        // Do not allow admin to delete album if one of the photos is the homepage background
        foreach ($photosInAlbum as $photo) {
            if ($this->isHomepageBackground($photo->id)) {
                Log::warning('Attempting to delete album: ' . $albumId . ' with image: ' .$photo->id . ' homepage background');

                return;
            }
        }

        foreach ($photosInAlbum as $photo) {
            $this->deleteImage($photo->id, true);
        }

        AlbumsModel::find($albumId)->delete();

        Log::info('Album: ' .$albumId .' deleted');
    }

    /**
     * Move the image to the album related to $albumId
     *
     * @param integer $albumId
     * @param integer $imageId
     */
    public function moveImageToAlbum(int $albumId, int $imageId)
    {
        try {
            $photo = PhotosModel::find($imageId);
            $currentAlbumId = $photo->album_id;

            if ($this->isAlbumCover($currentAlbumId, $imageId)) {
                return ['response' => 'You cannot move this album as it is the album cover.'];
            }

            $photo->album_id = $albumId;
            $photo->save();

            return ['response' => 'The image has been moved successfully. Refresh the page to see your changes.'];

        } catch (Exception $e) {
            return $e->getMessage();
        }
    }
}

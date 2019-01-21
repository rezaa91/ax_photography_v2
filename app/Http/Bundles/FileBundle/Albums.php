<?php

namespace App\Http\Bundles\FileBundle;

use Validator;
use Exception;
use App\Photos as PhotosModel;
use App\Albums as AlbumsModel;
use Carbon\Carbon;
use App\Http\Bundles\FileBundle\Photos;

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
            Parent::__construct($file);
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
     * @return bool
     */
    public function storeImage(Array $fileInfo)
    {
        $this->init($fileInfo['file']);

        // If no album type selected, return and inform user
        if (!$fileInfo['create_album'] && $fileInfo['album'] === 'default') {
            throw new Exception('Please select an album to store your image in.');
        }

        // If new album created, store in database
        if ($fileInfo['create_album']) {
            if (!$this->createAlbum($fileInfo['create_album'])) {
                throw new Exception("The album could not be created as the album name already exists.");
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

            if ($currentAlbumName === $albumName) {
                return false;
            }
        }

        $album = new AlbumsModel();
        $album->album_name = $albumName;
        $album->save();

        $this->setAlbumId($album->album_id);

        return true;
    }

    /**
     * Set default album cover to newly uploaded photo
     * 
     * @param Int $photoId of newly uploaded image
     */
    private function setDefaultAlbumCoverPhoto($photoId)
    {
        $album = AlbumsModel::find($this->getAlbum()['id']);
        $album->cover_photo_id = $photoId;
        $album->save();
    }

    /**
     * @param Integer $albumId
     * @param String $albumName
     */
    public function updateAlbumTitle(int $albumId, string $albumName)
    {
        $album = AlbumsModel::find($albumId);
        $album->album_name = $albumName;
        $album->save();
        return true;
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
        $albumId = PhotosModel::select('album_id')->where('id', $photoId)->first();
        $album = AlbumsModel::find($albumId->album_id);
        $album->cover_photo_id = $photoId;
        $album->save();
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
                return;
            }
        }

        foreach ($photosInAlbum as $photo) {
            $this->deleteImage($photo->id, true);
        }

        AlbumsModel::find($albumId)->delete();
    }
}

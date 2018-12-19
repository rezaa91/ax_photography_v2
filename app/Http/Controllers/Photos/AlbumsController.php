<?php

namespace App\Http\Controllers\Photos;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Validator;
use App\Photos;
use App\Albums;
use Carbon\Carbon;

class AlbumsController extends PhotosController
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
    public function __construct(Request $request)
    {
        if ($request->file('file')) {
            Parent::__construct($request->file('file'));
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
     * Display Albums
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $albums = Albums::all();
        return view('pages.photos.albums')->with('albums', $albums);
    }
    
    /**
     * Display uploads form for uploading images
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        $albums = Albums::all();
        return view('pages.photos.upload')->with('albums', $albums);
    }
    
    /**
     * Store a newly created image in storage and database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return redirect back to uploads page with session message
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'title' => 'required',
            'file' => 'required | max:1999',
            'description' => 'nullable'
        ]);

        // If no album type selected, return and inform user
        if (!$request->input('create_album') && $request->input('album') === 'default') {
            return redirect('/upload')->with('failure', 'Please select an album to store the image in.');
        }

        // If new album created, store in database
        if ($request->input('create_album')) {
            $this->createAlbum($request->input('create_album'));
        }

        // If existing album selected, set the album id
        if ($request->input('album') !== 'default') {
            $this->setAlbumId($request->input('album'));
            $this->updateAlbumTimestamp($request->input('album'));
        }

        // store image in database
        $photoId = $this->storeImageInDatabase($request, $this->album);
        
        if ($request->input('create_album')) {
            $this->setDefaultAlbumCoverPhoto($photoId);
        }

        return redirect('/upload')->with('success', 'Image uploaded');
    }

    /**
     * Store Album details in database
     *
     * @param string $albumName
     */
    public function createAlbum(string $albumName)
    {
        $album = new Albums();
        $album->album_name = $albumName;
        $album->save();

        $this->setAlbumId($album->album_id);
    }

    /**
     * Set default album cover to newly uploaded photo
     * 
     * @param int $photoId of newly uploaded image
     */
    private function setDefaultAlbumCoverPhoto($photoId)
    {
        $album = Albums::find($this->getAlbum()['id']);
        $album->cover_photo_id = $photoId;
        $album->save();
    }

    /**
     * Upate the updated_at field in album
     *
     * @param integer $albumId
     */
    private function updateAlbumTimestamp(int $albumId)
    {
        $album = Albums::find($albumId);
        $album->updated_at = Carbon::now();
        
        if ($album->save()) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @param int $photoId
     */
    public function updateCoverImage(int $photoId)
    {
        $albumId = $this->getAlbumIdFromPhotoId($photoId);
        $album = Albums::find($albumId);
        $album->cover_photo_id = $photoId;
        $album->save();
    }
    
    /**
     * Display the specified resource.
     * @param int $albumId
     *
     * @return \Illuminate\Http\Response
     */
    public function show($albumId)
    {
        if (!Albums::find($albumId)) {
            return redirect('/albums');
        }
        
        return view('pages.photos.singleAlbum');
    }

    /**
     * /api/update_album/{albumId}
     * @param Request $request
     * @param int $albumId
     */
    public function updateAlbumTitle(Request $request, int $albumId)
    {
        $albumData = $request->json()->all();
        $validator = Validator::make($albumData, [
            'album_name' => 'required'
        ]);
        
        if ($validator->fails()) {
            return;
        }

        $album = Albums::find($albumId);
        $album->album_name = $albumData['album_name'];
        $album->save();
        return 'true';
    }

    /**
     * @param integer $albumId
     */
    public function deleteAlbum(int $albumId)
    {
        $photosInAlbum = Photos::where('album_id', $albumId)->get();

        // Do not allow admin to delete album if one of the photos is the homepage background
        foreach ($photosInAlbum as $photo) {
            if ($this->isHomepageBackground($photo->id)) {
                return;
            }
        }

        foreach ($photosInAlbum as $photo) {
            $this->deleteImage($photo->id, true);
        }

        Albums::find($albumId)->delete();
    }

}

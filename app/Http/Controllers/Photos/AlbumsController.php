<?php

namespace App\Http\Controllers\Photos;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Albums;
use Carbon\Carbon;

class AlbumsController extends PhotosController
{
    /**
     *@inheritDoc
     */
    protected $directoryToStore = 'uploads';

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
     * Display the specified resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function show()
    {
        return view('pages.photos.singleAlbum');
    }
    
    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }
    
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }
    
    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

}

<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Photos;
use App\Albums as AlbumsModel;
use Carbon\Carbon;
use App\Http\Bundles\FileBundle\Albums;
use Exception;
use App\Http\Bundles\SettingsBundle\Settings;

class AlbumsController extends Controller
{
    
    private $moduleClass;
    
    /**
     * @param Albums $moduleClass
     * @param Settings $settings
     * 
     * @return void
     */
    public function __construct(Albums $moduleClass, Settings $settings)
    {
        $this->moduleClass = $moduleClass;
        parent::__construct($settings);
    }

    /**
     * Display Albums
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return $this->displayPage('pages.photos.albums');
    }
    
    /**
     * Display uploads form for uploading images
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $albums = AlbumsModel::all();
        return $this->displayPage('pages.photos.upload', ['albums' => $albums]);
    }
    
    /**
     * Store a newly created image in storage and database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'title' => 'nullable',
            'description' => 'nullable',
            'file' => 'required | max:2999'
        ]);

        $fileInfo = [
            'file' =>$request->file('file'),
            'title' => $request->input('title'),
            'description' => $request->input('description'),
            'album_type' => $request->input('album_type'),
            'album' => $request->input('album'),
            'create_album' => $request->input('create_album'),
        ];

        try {
            $response = $this->moduleClass->storeImage($fileInfo);

            return redirect('/upload')->with('success', 'Image uploaded');
        } catch (Exception $e) {
            return redirect('/upload')->with('failure', $e->getMessage());
        }
    }
    
    /**
     * Display the specified resource.
     * @param int $albumId
     *
     * @return \Illuminate\Http\Response
     */
    public function show(int $albumId)
    {
        if (!AlbumsModel::find($albumId)) {
            return redirect('/albums');
        }
        
        return $this->displayPage('pages.photos.singleAlbum');
    }
}

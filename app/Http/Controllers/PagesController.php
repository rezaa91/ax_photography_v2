<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PagesController extends Controller
{

    public function __construct() {
        $this->middleware('auth', ['except' => ['homepage', 'albums', 'about', 'contact']]);
    }

    public function homepage()
    {
        return view('pages.homepage');
    }

    public function albums()
    {
        return view('pages.albums');
    }

    public function about()
    {
        return view('pages.about');
    }

    public function contact()
    {
        return view('pages.contact');
    }

    public function upload()
    {
        return view('pages.upload');
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PagesController extends Controller
{

    public function __construct() {
        $this->middleware('auth', ['except' => ['homepage', 'albums', 'about', 'contact']]);
    }

    // Global pages
    
    public function homepage()
    {
        return view('pages.homepage');
    }

    public function about()
    {
        return view('pages.about');
    }

    public function contact()
    {
        return view('pages.contact');
    }
}

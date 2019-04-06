<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AboutController extends Controller
{
    /**
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return $this->displayPage('pages.about');
    }
}

<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    /**
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return $this->displayPage('pages.contact');
    }
}

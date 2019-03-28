<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PagesController extends Controller
{
    /**
     * @return \Illuminate\Http\Response
     */
    public function homepage()
    {
        return $this->displayPage('pages.homepage');
    }

    /**
     * @return \Illuminate\Http\Response
     */
    public function about()
    {
        return $this->displayPage('pages.about');
    }

    /**
     * @return \Illuminate\Http\Response
     */
    public function contact()
    {
        return $this->displayPage('pages.contact');
    }
}

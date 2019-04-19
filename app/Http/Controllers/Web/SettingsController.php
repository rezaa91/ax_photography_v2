<?php

namespace App\Http\Controllers\Web;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Bundles\SettingsBundle\Settings;


class SettingsController extends Controller
{
    /**
     * @param Settings $settings
     * 
     * @return void
     */
    public function __construct(Settings $settings)
    {
        $this->middleware('isAdmin');
        parent::__construct($settings);
    }

    /**
     * @return view
     */
    public function index()
    {
        return $this->displayPage('pages.settings.showSettings');
    }
}

<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Bundles\SettingsBundle\Settings;
use App\Exceptions\DatabaseException;

class SettingsController extends ApiController
{
    /**
     * @var Settings
     */
    private $settings;

    public function __construct(Settings $settings)
    {
        $this->settings = $settings;
    }

    /**
     * @post {api/updatesettings}
     * @param Request $request

     * @return void
     */
    public function updateSettings(Request $request)
    {
        try {
            $settings = $request->json()->all();
            $this->settings->updateSettings($settings);

        } catch (DatabaseException $e) {
            return $e->getMessage();
        }
    }
}

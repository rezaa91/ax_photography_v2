<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

use App\Notifications as NotificationsModel;
use App\Http\Bundles\SettingsBundle\Settings;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    /**
     * Number of unacked notifications
     *
     * @var integer
     */
    private $notificationCount;

    /**
     * @var Settings
     */
    private $settings;

    public function __construct(Settings $settings)
    {
        $this->settings = $settings;
    }

    /**
     * Display page
     *
     * @param string $template - i.e. layout.homepage
     * @param array $pageSpecificVariables - variables specific to an individuals page in order to send to view
     * @return void
     */
    public function displayPage(string $template, array $pageSpecificVariables = [])
    {
        // pass administrator related data to view if user is admin
        if (auth()->user() && auth()->user()->isAdmin) {
            $this->notificationCount = NotificationsModel::where('ack', 0)->count();
        }

        return view($template)->with([
            'settings' => $this->settings->getAllSettings(),
            'notificationCount' => $this->notificationCount,
            'pageSpecific' => $pageSpecificVariables,
        ]);
    }
}

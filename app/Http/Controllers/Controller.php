<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

use App\Notifications as NotificationsModel;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    /**
     * Application settings
     *
     * @var array
     */
    private $settings = [];

    /**
     * Number of unacked notifications
     *
     * @var integer
     */
    private $notificationCount = null;

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
        if (auth()->user()->isAdmin) {
            $this->notificationCount = NotificationsModel::where('ack', 0)->count();
        }

        return view($template)->with([
            'settings' => $this->settings,
            'notificationCount' => $this->notificationCount,
            'pageSpecific' => $pageSpecificVariables,
        ]);
    }
}

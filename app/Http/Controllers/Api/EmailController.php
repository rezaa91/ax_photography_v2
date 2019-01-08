<?php

namespace App\Http\Controllers\Api;

use App\Http\Bundles\ContactBundle\Email;
use Illuminate\Http\Request;

class EmailController extends ApiController
{

    private $moduleClass;

    /**
     * @param Email $moduleClass
     */
    public function __construct(Email $moduleClass)
    {
        $this->moduleClass = $moduleClass;
    }

    /**
     * {/api/email}
     * @param Request $request
     */
    public function sendEmail (Request $request)
    {
        $formData = $request->json()->all();

        $this->moduleClass->sendEmail($formData);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Mail\ContactForm;
use Illuminate\Support\Facades\Mail;
use App\Http\Controllers\Controller;

class ContactController extends Controller
{

    public function sendEmail (Request $request)
    {
        $formData = $request->json()->all();

        Mail::to('info@axphotography.co.uk')
            ->send(new ContactForm($formData));
    }
}

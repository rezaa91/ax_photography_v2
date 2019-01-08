<?php

namespace App\Http\Bundles\ContactBundle;

use App\Mail\ContactForm;
use Illuminate\Support\Facades\Mail;

class Email
{
    public function sendEmail ($formData)
    {
        Mail::to('info@axphotography.co.uk')
            ->send(new ContactForm($formData));
    }
}

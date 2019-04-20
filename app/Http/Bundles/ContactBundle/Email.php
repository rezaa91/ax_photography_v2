<?php

namespace App\Http\Bundles\ContactBundle;

use App\Mail\ContactForm;
use Illuminate\Support\Facades\Mail;

class Email
{
    /**
     * @param array $formData - name, email, body
     * 
     * @return void 
     */
    public function sendEmail(array $formData)
    {
        Mail::to('info@axphotography.co.uk')
            ->send(new ContactForm($formData));
    }
}

<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class ContactForm extends Mailable
{
    use Queueable, SerializesModels;

    public $name = null;
    public $body = null;
    public $email = null;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(Array $emailData)
    {
        $this->name = $emailData['name'];
        $this->body = $emailData['body'];
        $this->email = $emailData['email'];
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('emails.contact');
    }
}

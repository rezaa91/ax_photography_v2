<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Photos;

class Posts extends Model
{
    public function photo()
    {
        return $this->hasOne(Photos::class);
    }
}

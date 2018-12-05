<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Albums;

class Photos extends Model
{
    public function album()
    {
        return $this->hasOne(Albums::class);
    }
}

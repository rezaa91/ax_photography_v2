<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Albums;
use App\Posts;

class Photos extends Model
{
    public function album()
    {
        return $this->hasOne(Albums::class);
    }

    public function posts()
    {
        return $this->hasMany(Posts::class);
    }
}

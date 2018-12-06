<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Photos;

class Albums extends Model
{

    protected $primaryKey = 'album_id';

    public function photos()
    {
        return $this->hasMany(Photos::class);
    }
}

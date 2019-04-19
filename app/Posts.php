<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Photos;

class Posts extends Model
{
    public function photo()
    {
        return $this->belongsTo(Photos::class, 'photo_id', 'id');
    }

    public function notifications()
    {
        return $this->hasMany('App\Notifications', 'id', 'notification_id');
    }

    public function user()
    {
        return $this->belongsTo('App\User');
    }
}

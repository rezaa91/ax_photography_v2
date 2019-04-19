<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Photos;

class PhotosUsersLikes extends Model
{
    public function notifications()
    {
        return $this->hasMany('App\Notifications', 'id', 'notification_id');
    }

    public function photo()
    {
        return $this->belongsTo(Photos::class, 'photo_id', 'id');
    }
}

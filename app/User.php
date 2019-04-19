<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'username', 'name', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token', 'api_token'
    ];

    public static function boot()
    {
        parent::boot();
        self::creating(function($user) {
            $user->api_token = \Hash::make(\Carbon\Carbon::now()->toRfc2822String());
        });
    }

    public function notifications()
    {
        return $this->hasMany('App\Notifications');
    }

    public function posts()
    {
        return $this->hasMany('App\Posts', 'user_id');
    }
}

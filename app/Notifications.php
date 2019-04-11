<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class Notifications extends Model
{
    /**
     * The notification type id of a post
     * @var int
     */
    const POST = 1;

    /**
     * The notification type id of a like
     * @var int
     */
    const LIKE = 2;

    public function user()
    {
        return $this->belongsTo('App\User', 'user_id');
    }

    public function notificationType()
    {
        return $this->belongsTo('App\NotificationTypes', 'type_id');
    }

    public function posts()
    {
        return $this->belongsTo('App\Posts', 'notification_id');
    }

    public function likes()
    {
        return $this->belongsTo('App\PhotosUsersLikes', 'notification_id');
    }

    static public function getNotifications($notification)
    {
        switch ($notification->notificationType->id) {
            case self::POST:
                return $notification->posts;
                break;

            case self::LIKE:
                return $notification->likes;
                break;
            
            default:
                Log::info('Unexpected notification type');

                return null;
        }
    }
}

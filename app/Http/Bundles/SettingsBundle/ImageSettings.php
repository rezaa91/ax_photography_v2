<?php

namespace App\Http\Bundles\SettingsBundle;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Bundles\NotificationsBundle\Notifications;
use App\Exceptions\DatabaseException;

class ImageSettings
{
    private $notification = null;

    public function __construct(Notifications $notification)
    {
        $this->notification = $notification;
    }

    /**
     * Toggle like/un-like on image
     * @param Array $data - consisting of userid and photoid
     */
    public function toggleLikeImage(Array $data)
    {

        try {
            $photoId = $data['photo_id'];
            $userId = $data['user_id'];

            // Dislike image if user has previously liked it, like image if user has not yet liked it
            if ($this->hasUserPreviouslyLiked($data)) {
                $row = DB::table('photos_users_likes')->where(['photo_id' => $photoId, 'user_id' => $userId]);

                $this->notification->removeNotification($userId, $row->first()->id, $this->notification::LIKE);

                $row->delete();

                Log::info('User: ' . $data['user_id'] . ' disliking image: ' . $data['photo_id']);
            } else {
                DB::table('photos_users_likes')->insert(['photo_id' => $photoId, 'user_id' => $userId]);

                $likedId = DB::table('photos_users_likes')->orderBy('id', 'desc')->pluck('id')->first();
                $this->notification->addNotification($userId, $likedId, $this->notification::LIKE);
                
                Log::info('User: ' . $data['user_id'] . ' liking image: ' . $data['photo_id']);
            }

        } catch (DatabaseException $e) {
            return $e->getMessage();
        }
    }

    /**
     * Check whether the user has already liked the picture
     */
    private function hasUserPreviouslyLiked($data)
    {
        return DB::table('photos_users_likes')
            ->where('photo_id', $data['photo_id'])
            ->where('user_id', $data['user_id'])
            ->count();
    }
}

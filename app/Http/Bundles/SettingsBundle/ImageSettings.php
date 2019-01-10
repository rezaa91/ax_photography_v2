<?php

namespace App\Http\Bundles\SettingsBundle;

use Illuminate\Support\Facades\DB;

class ImageSettings
{
    /**
     * Toggle like/un-like on image
     * @param Array $data - consisting of userid and photoid
     */
    public function toggleLikeImage(Array $data)
    {
        $photoId = $data['photo_id'];
        $userId = $data['user_id'];

        if ($this->hasUserPreviouslyLiked($data)) {
            DB::table('photos_users_likes')->where(['photo_id' => $photoId, 'user_id' => $userId])->delete();
        } else {
            DB::table('photos_users_likes')->insert(['photo_id' => $photoId, 'user_id' => $userId]);
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

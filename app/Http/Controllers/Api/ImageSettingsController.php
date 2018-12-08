<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class ImageSettingsController extends Controller
{
    /**
     * Toggle like/un-like on image
     * @param Request $request
     */
    public function toggleLikeImage(Request $request)
    {
        $data = $request->json()->all();

        if ($this->hasUserPreviouslyLiked($data)) {
            DB::table('photos_users_likes')->where(['photo_id' => $data['photo_id'], 'user_id' => $data['user_id']])->delete();
        } else {
            DB::table('photos_users_likes')->insert(['photo_id' => $data['photo_id'], 'user_id' => $data['user_id']]);
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

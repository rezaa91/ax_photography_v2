<?php

use Illuminate\Http\Request;
use App\User;
use App\Albums;
use App\Photos;
use App\Http\Resources\Albums as AlbumsResource;
use App\Http\Resources\Photos as PhotosResource;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user(User::find(auth()));
});

/**
 * API resource showing all album data
 */
Route::get('albums', function() {
    return new AlbumsResource(Albums::all());
});

/**
 * API resource showing individual album data with photos associated to each album
 */
Route::get('albums/{id}', function($id) {
    // return if album does not exist
    if (!Albums::find($id)) {
        return redirect('/');
    }
    return DB::table('photos')->where('album_id', $id)->get();
});

/**
 * API showing individual photos
 */
Route::get('photos/{id}', function($id) {
    return new PhotosResource(Photos::find($id));
});

/**
 * Toggle like/dislike image
 */
Route::post('/reaction', 'Api\ImageSettingsController@toggleLikeImage');

/**
 * Upload profile avatar image
 */
Route::post('/user/{id}', 'Photos\UserAvatar@storeAvatarFilepath');

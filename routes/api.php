<?php

use Illuminate\Http\Request;
use App\User;
use App\Albums;
use App\Photos;
use App\HomepageBackground;
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
 * Get homepage background image information
 */
Route::get('/background_image', function() {
    $photo = HomepageBackground::find(1); // only one row
    $photoId = $photo->photo_id;

    if (!Photos::find($photoId)) {
        return;
    }

    return new PhotosResource(Photos::find($photoId));
});

/**
 * Update homepage background image
 */
Route::post('/background_image/{id}', 'Photos\HomepageBackgroundController@updateBackgroundImage');

/**
 * Toggle like/dislike image
 */
Route::post('/reaction', 'Api\ImageSettingsController@toggleLikeImage');

/**
 * Update image title and description
 */
Route::post('/update_photo/{id}', 'Photos\PhotosController@updateImage');

/**
 * Delete image
 */
Route::delete('/delete_photo/{id}', 'Photos\PhotosController@deleteImage');

/**
 * Update album cover photo
 */
Route::post('/update_cover_photo/{photoId}', 'Photos\AlbumsController@updateCoverImage');

/**
 * Upload profile avatar image
 */
Route::post('/user/{id}', 'Photos\UserAvatar@storeAvatarFilepath');

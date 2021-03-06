<?php

use Illuminate\Http\Request;
use App\User;
use App\Albums;
use App\Photos;
use App\HomepageBackground;
use App\Http\Resources\Albums as AlbumsResource;
use App\Http\Resources\Photos as PhotosResource;
use App\Http\Resources\InidividualAlbum as IndividualAlbumResource;

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
    return new AlbumsResource(Albums::orderBy('created_at', 'desc')->get());
});

/**
 * API resource showing individual album data with photos associated to each album
 * @param int $albumId
 */
Route::get('albums/{id}', function(int $albumId) {
    // return if album does not exist
    if (!Albums::find($albumId)) {
        return redirect('/albums');
    }

    return new IndividualAlbumResource(Albums::find($albumId));
});

/**
 * Move image to different album
 */
Route::post('album/{albumId}/image/{imageId}', 'Api\AlbumsController@moveImage')->middleware('auth:api');

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

    if (!isset($photo->photo_id) || !Photos::find($photo->photo_id)) {
        return;
    }

    return new PhotosResource(Photos::find($photo->photo_id));
});

/**
 * Update homepage background image
 */
Route::post('/background_image/{id}', 'Api\HomepageBackgroundController@postUpdateBackgroundImage')->middleware('auth:api');

/**
 * Toggle like/dislike image
 */
Route::post('/reaction', 'Api\ImageSettingsController@postToggleLikeImage')->middleware('auth:api');

/**
 * Update image title and description
 */
Route::post('/update_photo/{id}', 'Api\PhotosController@postUpdateImageDetails')->middleware('auth:api');

/**
 * Delete image
 */
Route::delete('/delete_photo/{id}', 'Api\PhotosController@deleteImage')->middleware('auth:api');

/**
 * Update album cover photo
 */
Route::post('/update_cover_photo/{photoId}', 'Api\AlbumsController@postUpdateCoverImage')->middleware('auth:api');

/**
 * Update album title
 */
Route::post('/update_album/{albumId}', 'Api\AlbumsController@postUpdateAlbumTitle')->middleware('auth:api');

/**
 * Delete album along with its contents
 */
Route::delete('/delete_album/{albumId}', 'Api\AlbumsController@deleteAlbum')->middleware('auth:api');

/**
 * Upload profile avatar image
 */
Route::post('/user/{id}', 'Api\UserController@postStoreAvatarFilepath')->middleware('auth:api');

/**
 * Post photo comment
 */
Route::post('/post_comment/{photo_id}', 'Api\PostsController@postComment')->middleware('auth:api');

/**
 * Delete photo comment
 */
Route::delete('/delete_comment/{post_id}', 'Api\PostsController@deleteComment')->middleware('auth:api');

/**
 * Post email from contact form
 */
Route::post('/email', 'Api\EmailController@sendEmail');

/**
 * Upload photo to album
 */
Route::post('/photo/{album_id}', 'Api\PhotosController@uploadImage')->middleware('auth:api');

/**
 * Update settings
 */
Route::post('/updatesettings', 'Api\SettingsController@updateSettings')->middleware('auth:api');

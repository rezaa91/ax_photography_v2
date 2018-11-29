<?php

use Illuminate\Http\Request;
use App\User;
use App\Albums;
use App\Http\Resources\Albums as AlbumsResource;

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


Route::get('albums', function() {
    return new AlbumsResource(Albums::all());
});

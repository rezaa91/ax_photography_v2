<?php

use App\User;
use App\Http\Resources\User as UserResource;

Auth::routes();

/** Logout */
Route::get('/logout', '\App\Http\Controllers\Auth\LoginController@logout');

/** Apis */
Route::get('/api/user', function() {
    if (!(auth()->user())) {
        return;
    }
    return new UserResource(User::find(auth()->user()->id));
});

/** Profile Resource */
Route::resource('/user', 'DashboardController');

/** Photos/Albums Resource */
Route::resource('/photos', 'Photos\AlbumsController');
Route::get('/upload', 'Photos\AlbumsController@create');
Route::get('/albums', 'Photos\AlbumsController@index');

/** Display Homepage */
Route::get('/', 'PagesController@homepage');

/** Display About page */
Route::get('/about', 'PagesController@about');

/** Display Contact page */
Route::get('/contact', 'PagesController@contact');

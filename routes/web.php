<?php

use App\User;
use App\Http\Resources\User as UserResource;

Auth::routes();

/** User API */
Route::get('/api/user', function() {
    return new UserResource(User::find(auth()->user()->id));
});

/** Logout */
Route::get('/logout', '\App\Http\Controllers\Auth\LoginController@logout');

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

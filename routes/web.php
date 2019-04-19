<?php

Auth::routes();

/** User API */
Route::get('/api/user', 'Api\UserController@getUser');

/** Logout */
Route::get('/logout', '\App\Http\Controllers\Auth\LoginController@logout')->middleware('auth');

/** Profile Resource */
Route::resource('/user', 'Web\UserController')->middleware('auth');

/** Photos/Albums Resource */
Route::resource('/photos', 'Web\AlbumsController');
Route::get('/upload', 'Web\AlbumsController@create')->middleware('isAdmin');
Route::get('/albums', 'Web\AlbumsController@index');
Route::get('/albums/{id}', 'Web\AlbumsController@show');

/** Display Homepage */
Route::get('/', 'Web\HomepageController@index');

/** Display About page */
Route::get('/about', 'Web\AboutController@index');

/** Display Contact page */
Route::get('/contact', 'Web\ContactController@index');

/** Display Settings page */
Route::get('/settings', 'Web\SettingsController@index')->middleware('isAdmin');

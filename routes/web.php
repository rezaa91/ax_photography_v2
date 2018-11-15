<?php

use App\User;
use App\Http\Resources\User as UserResource;

Auth::routes();

/** Apis */
Route::get('/api/user', function() {
    return new UserResource(User::find(1));
});

/** Display Dashboard */
Route::get('/dashboard', 'DashboardController@index')->name('dashboard');

/** Display Homepage */
Route::get('/', 'PagesController@homepage');

/** Display Albums */
Route::get('/albums', 'PagesController@albums');

/** Display About page */
Route::get('/about', 'PagesController@about');

/** Display Contact page */
Route::get('/contact', 'PagesController@contact');

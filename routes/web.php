<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Auth::routes();

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

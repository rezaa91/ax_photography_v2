<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\Http\Controllers\Photos\UserAvatar;

class DashboardController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application user dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('pages.profile.dashboard');
    }

    /**
     * Edit user profile
     * 
     * @param integer $id
     */
    public function edit(int $id) 
    {
        $user = User::find($id);
        if (auth()->user()->id !== $id) {
            return redirect('/')->with('failure', 'Unauthorised access');
        }

        return view('pages.profile.edit')->with('user', $user);
    }

    /**
     * Update the user edited data
     *
     * @param Request $request
     */
    public function update(Request $request, $id)
    {
        $this->validate($request, [
            'username' => 'required',
            'email' => 'required'
        ]);

        $user = User::find($id);
        $user->username = $request->input('username');
        $user->email = $request->input('email');
        $user->save();

        return redirect('/user')->with('success', 'Profile updated');
    }

    /**
     * Delete the users profile along with avatar image
     * 
     * @param Request $request
     * @param integer $id
     */
    public function destroy(Request $request, int $id)
    {
        if (auth()->user()->id !== $id) {
            return redirect('/')->with('failure', 'Unauthorised access');
        }

        $user = User::find($id);
        $avatarImage = new UserAvatar($request);
        $avatarImage->removeCurrentImage($user);
        $user->delete();
        
        return redirect('/')->with('success', 'Your account has been deleted.');
    }
}

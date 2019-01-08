<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\User;
use App\Http\Bundles\UserBundle\User as UserClass;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{

    private $moduleClass;

    /**
     * @param UserClass $moduleClass
     * 
     * @return void
     */
    public function __construct(UserClass $moduleClass)
    {
        $this->moduleClass = $moduleClass;
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
     * @param integer $userId
     * 
     * @return \Illuminate\Http\Response
     */
    public function edit(int $userId) 
    {
        $user = User::find($userId);

        if (auth()->user()->id !== $userId) {
            return redirect('/')->with('failure', 'Unauthorised access');
        }

        return view('pages.profile.edit')->with('user', $user);
    }

    /**
     * Update users details
     *
     * @param Request $request
     * @param int $userId
     * 
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, int $userId)
    {
        $this->validate($request, [
            'username' => 'required',
            'email' => 'required'
        ]);

        $user = User::find($userId);

        if ($request->current_password) {

            if (!Hash::check($request->current_password, $user->password)) {
                return redirect("/user/$userId/edit")->with('failure', 'Password incorrect.');
            }

            $this->validate($request, [
                'new_password' => 'required',
                'confirm_password' => 'required'
            ]);

            if ($request->input('new_password') !== $request->confirm_password) {
                return redirect("/user/$userId/edit")->with('failure', 'New password and password confirmation do not match.');
            }

            $user->password = Hash::make($request->new_password);
        }

        $user->username = $request->username;
        $user->email = $request->email;
        $user->save();

        return redirect('/user')->with('success', 'Profile updated');
    }

    /**
     * Delete the users profile along with avatar image
     * 
     * @param Request $request
     * @param integer $id
     * 
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, int $id)
    {
        if (auth()->user()->id !== $id) {
            return redirect('/')->with('failure', 'Unauthorised access');
        }

        $user = User::find($id);
        $this->moduleClass->removeCurrentImage($user);
        $user->delete();
        
        return redirect('/')->with('success', 'Your account has been deleted.');
    }
}

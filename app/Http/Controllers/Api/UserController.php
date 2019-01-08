<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Bundles\UserBundle\User;
use App\User as UserModel;
use App\Http\Resources\User as UserResource;

class UserController extends ApiController
{
    private $moduleClass;

    /**
     * @param User $moduleClass
     */
    public function __construct(User $moduleClass)
    {
        $this->moduleClass = $moduleClass;
    }

    /**
     * {/api/user}
     */
    public function getUser()
    {
        if (!auth()->user()) {
            return;
        }

        return new UserResource(UserModel::find(auth()->user()->id));
    }


    /**
     * {/api/user/{id}}
     * 
     * @param Request $request
     * @param int $userId
     */
    public function postStoreAvatarFilepath(Request $request, int $userId)
    {
        if (!auth()->user()) {
            return;
        }

        $user = UserModel::find($userId);
        $file = null;

        if ($request->file) {
            $file = $request->file;
        }
        
        $this->moduleClass->storeAvatarFilepath($user, $file);
    }


}

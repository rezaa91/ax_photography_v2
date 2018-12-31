<?php

namespace App\Http\Controllers\Photos;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\User;

class UserAvatar extends FileController
{

    /**
     * @inheritDoc
     */
    protected $directoryToStore = 'avatars';

    /**
     * @inheritDoc
     */
    public function __construct(Request $request)
    {        
        if ($request->file) {
            Parent::__construct($request->file);
        }
    }

    /**
     * Store the filepath in the database
     * 
     * @param integer $userId
     */
    public function storeAvatarFilepath($userId)
    {
        $user = User::find($userId);
        $this->removeCurrentImage($user);
        $user->avatar_filepath = $this->filenameToStore;
        
        // upload the image if successful storing in DB
        if ($user->save()) {
            $this->uploadFile();
        }
    }

    /**
     * Delete the users current image from the avatars directory
     *
     * @param object $user
     */
    public function removeCurrentImage($user)
    {
        // Return if user has no avatar set
        if (!isset($user->avatar_filepath)) {
            return;
        }

        if (file_exists("storage/avatars/$user->avatar_filepath")) {
            unlink("storage/avatars/$user->avatar_filepath");
        }
    }
}

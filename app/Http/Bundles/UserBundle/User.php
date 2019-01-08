<?php

namespace App\Http\Bundles\UserBundle;

use App\User as UserModel;
use App\Http\Bundles\FileBundle\Photos as PhotosClass;


class User
{
    private $avatar_dir = 'avatars';
    private $fileClass;

    /**
     * @param PhotosClass $fileClass
     */
    public function __construct(PhotosClass $fileClass)
    {
        $this->fileClass = $fileClass;
        $this->fileClass->setDirectoryToStore($this->avatar_dir);
    }

    /**
     * Store the filepath in the database
     * 
     * @param UserModel $userId
     * @param $file
     */
    public function storeAvatarFilepath(UserModel $user, $file)
    {
        $this->removeCurrentImage($user);
        
        $this->fileClass->init($file);
        $this->fileClass->setFileNameToStore($this->fileClass->getFilenameToStore());
        
        $user->avatar_filepath = $this->fileClass->getFilenameToStore();

        // upload the image if successful storing in DB
        if ($user->save()) {
            $this->fileClass->setFile($file);
            $this->fileClass->uploadFile();
        }
    }

    /**
     * Delete the users current image from the avatars directory
     *
     * @param object $user
     */
    public function removeCurrentImage(UserModel $user)
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

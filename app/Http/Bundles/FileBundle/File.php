<?php

namespace App\Http\Bundles\FileBundle;

use App\Exceptions\FileUploadException;
use App\Http\Bundles\NotificationsBundle\Notifications;
use Illuminate\Http\UploadedFile;

class File
{
     /**
      * The file object uploaded in the constructor
      *
      * @var object
      */
     protected $file = null;

    /**
     * @var string
     */
    protected $filename = null;

    /**
     * @var string
     */
    private $filenameWithExt;

    /**
     * The file extension of uploaded image
     *
     * @var string
     */
    protected $extension = null;

    /**
     * The filename to store in database table
     *
     * @var string
     */
    protected $filenameToStore = null;

    /**
     * The name of the directory to store images
     *
     * @var string
     */
    protected $directoryToStore = null;

    /**
     * Notifications
     *
     * @var Notifications
     */
    protected $notifications = null;

    /**
     * Set file data to relevent properties
     *
     * @param Notifications $notifications 
     * @param $file
     */
   public function __construct(Notifications $notifications, $file = null)
   {
        $this->notifications = $notifications;

        if (!isset($file)) {
            return;
        }

        $this->init($file);
   }

   public function init($file)
   {
        $this->file = $file;
        $this->filenameWithExt = $file->getClientOriginalName();
        $this->filename = pathinfo($this->filenameWithExt, PATHINFO_FILENAME);
        $this->extension = $file->getClientOriginalExtension();
        $this->filenameToStore = $this->filename . '_' . time() . '.' . $this->extension;

        return $this;
   }

   /**
    * @param UploadedFile $file
    */
   public function setFile(UploadedFile $file)
   {
        $this->file = $file;
   }

   public function getFile()
   {
        return $this->file;
   }

   /**
    * @param string $dir
    * 
    * @return void
    * @throws \InvalidArgumentException
    */
   public function setDirectoryToStore($dir)
   {
        if (!is_string($dir)) {
            throw new \InvalidArgumentException('Directory must be a string');
        }

        $this->directoryToStore = $dir;
   }

   public function getDirectoryToStore()
   {
       return $this->directoryToStore;
   }

   /**
    * @param string $filename
    * 
    * @return void
    * @throws \InvalidArgumentException
    */
   public function setFilenameToStore($filename)
   {
        if (!is_string($filename)) {
            throw new \InvalidArgumentException('Filename must be a string');
        }

        $this->filenameToStore = $filename;
   }

    public function getFilenameToStore()
    {
        return $this->filenameToStore;
    }

   public function uploadFile()
   {
        $this->file->storeAs("public/$this->directoryToStore", $this->filenameToStore);
   }

   /**
    * Delete file from storage folder
    * @param string $filepath
    *
    * @throws FileUploadException
    */
   public function deleteFile(string $filepath)
   {
        try{
            if (!file_exists("storage/$this->directoryToStore/$filepath")) {
                throw new FileUploadException('File does not exist in storage directory');
            }

            unlink("storage/$this->directoryToStore/$filepath");

        } catch (FileUploadException $e) {
            return $e->getMessage();
        }
   }

}

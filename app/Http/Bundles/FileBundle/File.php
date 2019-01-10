<?php

namespace App\Http\Bundles\FileBundle;

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
     * Set file data to relevent properties
     *
     * @param $file
     */
   public function __construct($file = null)
   {

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
   }

   public function setFile($file)
   {
        $this->file = $file;
   }

   public function getFile()
   {
        return $this->file;
   }

   /**
    * @param string $dir
    */
   public function setDirectoryToStore(string $dir)
   {
        $this->directoryToStore = $dir;
   }

   public function getDirectoryToStore()
   {
        return $this->directoryToStore;
   }

   /**
    * @param string $filename
    */
   public function setFilenameToStore(string $filename)
   {
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
    */
   public function deleteFile(string $filepath)
   {
        if (file_exists("storage/$this->directoryToStore/$filepath")) {
            unlink("storage/$this->directoryToStore/$filepath");
        }
   }

}

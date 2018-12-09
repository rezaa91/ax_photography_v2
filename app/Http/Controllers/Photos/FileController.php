<?php

namespace App\Http\Controllers\Photos;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class FileController extends Controller
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
     * @param object $file
     */
   public function __construct(object $file)
   {
        $this->file = $file;
        $filenameWithExt = $file->getClientOriginalName();
        $this->filename = pathinfo($filenameWithExt, PATHINFO_FILENAME);
        $this->extension = $file->getClientOriginalExtension();
        $this->filenameToStore = $this->filename . '_' . time() . '.' . $this->extension;
   }

    protected function getFilenameToStore()
    {
        return $this->filenameToStore;
    }

    /**
     * Upload file to the directory passed as arg
     */
   protected function uploadFile()
   {
        $this->file->storeAs("public/$this->directoryToStore", $this->filenameToStore);
   }

}

<?php

namespace App\Http\Controllers\Photos;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class FileController extends Controller
{
    private $file = null;
    private $filename = null;
    private $ext = null;
    private $filenameToStore = null;

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

   protected function uploadFile()
   {
        $this->file->storeAs('public/uploads', $this->filenameToStore);
   }

}

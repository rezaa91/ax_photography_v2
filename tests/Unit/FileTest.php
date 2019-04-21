<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Http\Bundles\FileBundle\File;
use App\Http\Bundles\NotificationsBundle\Notifications;
use Illuminate\Http\UploadedFile;
use Mockery;

class FileTest extends TestCase
{
    /**
     * @var File
     */
    private $file;

    /**
     * @var UploadedFile
     */
    private $mockUploadedFile;

    /**
     * @var Notifications
     */
    private $mockNotifications;

    public function setup()
    {
        $this->mockNotifications = Mockery::mock(Notifications::class);
        $this->mockUploadedFile = Mockery::mock(UploadedFile::class);

        parent::setup();
    }

    private function getFileClassWithoutFileArg()
    {
        $this->file = new File($this->mockNotifications);
    }

    private function getFileClassWithFileArg()
    {
        $this->file = new File($this->mockNotifications, $this->mockUploadedFile);
    }

    private function setupExpectations()
    {
        $this->mockUploadedFile->shouldReceive([
            'getClientOriginalName' => 'testing.jpg',
            'getClientOriginalExtension' => 'jpg',
        ]);
    } 

    public function testGetDirectoryToStoreReturnsNull()
    {
        $this->getFileClassWithoutFileArg();

        $this->assertEquals($this->file->getDirectoryToStore(), null);

        // reset file class
        $this->file = null;
    }

    public function testSetDirectoryToStoreThrowsExceptionBool()
    {
        $this->getFileClassWithoutFileArg();

        $this->expectException(\InvalidArgumentException::class);
        $this->file->setDirectoryToStore(false);


        // reset file class
        $this->file = null;
    }

    public function testSetDirectoryToStoreThrowsExceptionInt()
    {
        $this->getFileClassWithoutFileArg();

        $this->expectException(\InvalidArgumentException::class);
        $this->file->setDirectoryToStore(125);


        // reset file class
        $this->file = null;
    }

    public function testSetDirectoryToStoreThrowsExceptionFloat()
    {
        $this->getFileClassWithoutFileArg();

        $this->expectException(\InvalidArgumentException::class);
        $this->file->setDirectoryToStore(1257.12);


        // reset file class
        $this->file = null;
    }

    public function testSetDirectoryToStoreThrowsExceptionArray()
    {
        $this->getFileClassWithoutFileArg();

        $this->expectException(\InvalidArgumentException::class);
        $this->file->setDirectoryToStore([
            'test' => 'should throw exception',
        ]);


        // reset file class
        $this->file = null;
    }

    public function testCorrectFileNameToStore()
    {
        $this->setupExpectations();
        $this->getFileClassWithFileArg();

        $expect = 'testing_'.time().'.jpg';
        $this->assertEquals($this->file->getFilenameToStore(), $expect);
    }

    public function testSetFileThrowsExceptionInvalidArg()
    {
        $this->getFileClassWithoutFileArg();

        $this->expectException(\TypeError::class);
        $this->file->setFile('string');
    }
}

<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Http\Bundles\FileBundle\Albums;
use App\Exceptions\AlbumException;
use App\Exceptions\FileUploadException;
use Illuminate\Http\UploadedFile;
use Mockery;

class AlbumsTest extends TestCase
{
    /**
     * @var Albums
     */
    private $albumsClass;

    /**
     * @var FileUpload
     */
    private $mockFileUpload;

    public function setup()
    {
        $this->mockFileUpload = Mockery::mock(UploadedFile::class);
        $this->mockFileUpload->shouldReceive([
            'getClientOriginalName' => 'testing.jpg',
            'getClientOriginalExtension' => 'jpg',
        ]);

        $this->albumsClass = new Albums();

        parent::setup();
    }

    public function testGetAlbumReturnsEmptyArrayIfNotSet()
    {
        $this->assertEquals([], $this->albumsClass->getAlbum());
    }

    public function testStoreImageThrowsExceptionIfIncorrectArrayProperties()
    {
        $dummyFile = [
            'file' => $this->mockFileUpload,
            'album' => 'default',
        ];

        $this->expectException(AlbumException::class);
        $this->albumsClass->storeImage($dummyFile);
    }

    public function testStoreImageThrowExceptionIfEmptyArray()
    {
        $this->expectException(FileUploadException::class);
        $this->albumsClass->storeImage([]);
    }
}

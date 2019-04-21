<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Http\Bundles\UserBundle\User;
use App\Http\Bundles\NotificationsBundle\Notifications;
use App\Http\Bundles\FileBundle\Photos as PhotosClass;
use App\User as UserModel;
use Mockery;

class UserTest extends TestCase
{
    /**
     * @var User
     */
    private $userClass;

    /**
     * @var Notifications
     */
    private $mockNotifications;

    /**
     * @var UserModel
     */
    private $mockUser;

    /**
     * @var PhotosClass
     */
    private $mockPhotos;

    public function setup()
    {
        $this->mockNotifications = Mockery::mock(Notifications::class);
        $this->mockPhotos = Mockery::mock(PhotosClass::class);
        $this->mockUser = Mockery::mock(UserModel::class);

        $this->mockPhotos
            ->shouldReceive('setDirectoryToStore')
            ->with('avatars')
            ->once()
            ->andReturn(null);

        $this->mockUser
            ->shouldReceive('offsetExists')
            ->once();

        $this->userClass = new User($this->mockPhotos, $this->mockNotifications);

        parent::setup();
    }

    public function testRemoveCurrentImage()
    {
        $this->markTestIncomplete('test incomplete');
    }
}

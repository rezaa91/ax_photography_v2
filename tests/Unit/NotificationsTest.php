<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Http\Bundles\NotificationsBundle\Notifications;
use App\Notifications as NotificationsModel;
use Mockery;

class NotificationsTest extends TestCase
{
    /**
     * @var Notifications
     */
    private $notifications;

    /**
     * @var NotificationsModel
     */
    private $mockNotifications;

    public function setup()
    {
        $this->notifications = new Notifications();
        $this->mockNotifications = Mockery::mock(NotificationsModel::class);

        parent::setup();
    }

    public function testAcknowledgingNotificationReturnBool()
    {
        $this->assertIsBool($this->notifications->acknowledgeNotifications());
    }

}

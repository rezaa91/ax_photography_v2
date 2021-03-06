<?php

namespace App\Http\Bundles\NotificationsBundle;

use App\Notifications as NotificationsModel;
use Illuminate\Support\Facades\Log;
use App\Exceptions\DatabaseException;
 

class Notifications {

    /**
     * The notication type id of a post
     * @var int
     */
    const POST = 1;

    /**
     * The notification type id of a like
     * @var int
     */
    const LIKE = 2;

    /**
     * When user administrator views notifications, acknowledge them in the database
     *
     * @return bool
     */
    public function acknowledgeNotifications() 
    {
        $unacknowledgedNotifications = NotificationsModel::where('ack', 0)->get();

        forEach($unacknowledgedNotifications as $notification) {
            $notification->ack = true;
            $notification->save();
        }

        return true;
    }

    /**
     * Add notification to table
     * @param integer $userId
     * @param integer $notificationsId - i.e. the post id in the posts table, or the likes id in the likes table...
     * @param integer $typeId - notification type id, i.e. for post, like...
     * 
     * @return void
     */
    public function addNotification(int $userId, int $notificationId, int $typeId)
    {
        try {
            Log::info('adding notification id: ' . $notificationId . 
                'of notification type: ' . $typeId . ', by user: ' .$userId);
            
            $notification = new NotificationsModel();
            $notification->user_id = $userId;
            $notification->type_id = $typeId;
            $notification->notification_id = $notificationId;

            if (!$notification->save()) {
                throw new DatabaseException('Unable to save notification in database');
            }

        } catch (DatebaseException $e) {
            Log::warning('error adding notification: ' . $e->getMessage());

            return $e->getMessage();
        }
    }

    /**
     * Get all notifications
     */
    public function getNotifications()
    {
        $notifications = NotificationsModel::orderBy('created_at', 'desc')->paginate(15);

        $data = [];

        foreach($notifications as $notification) {
            $data[] = [
                'id' => $notification->id,
                'type' => $notification->notificationType->name, // e.g. like or post
                'user' => $notification->user && $notification->user->username,
                'notification' => $notification->getNotifications($notification),
                'photo' => $notification->getNotifications($notification)->photo,
            ];
        }

        return $data;
    }

    /**
     * Count unacknnowledged notifications
     * 
     * @return integer
     */
    public function countUnackedNotifications()
    {
        return DB::table('notifications')
            ->where('ack', 0)
            ->count();
    }

    /**
     * Remove notification, i.e. if the user has removed their like or post
     */
    public function removeNotification(int $userId, int $notificationId, int $typeId)
    {
        try {
            $notification = NotificationsModel::where([
                'user_id' => $userId, 
                'type_id' => $typeId, 
                'notification_id' => $notificationId
            ]);
    
            if (!$notification->count()) {
                return;
            }
    
            if (!$notification->delete()) {
                throw new DatabaseException('Unable to delete notification: ' . $notification->id);
            }
        } catch (DatabaseException $e) {
            return $e->getMessage();
        }
    }

}


"use client"

import { updatePushNotificationIsRead } from "@/app/server-actions/notifications"
import { useUserAuthCtx } from "@/context-reducers/userAuthCtx"
import { useUserNotificationsCtx } from "@/context-reducers/userNotificationsCtx"
import { useToFetchNotifications } from "@/hooks/useToFetchNotifications"
import { useState, useEffect } from "react"

interface NotificationTrayItemProps {
    id: Number
    title: string
    description: string
    isRead: boolean
    createdAt: Date
}

export const NotificationsTray = () => {
    const { state: authState } = useUserAuthCtx()

    const { state: { notifications }, dispatch } = useUserNotificationsCtx()

    const [isOpen, setIsOpen] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)

    const [showAllNotifications, setShowAllNotifications] = useState(false)

    useToFetchNotifications()

    useEffect(() => {
        setUnreadCount(notifications?.filter((n: NotificationTrayItemProps) => !n.isRead).length)
    }, [notifications])

    const filteredNotifications = showAllNotifications ? notifications : notifications?.filter((n: NotificationTrayItemProps) => !n.isRead)

    const sortedNotifications = filteredNotifications?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return (
        <div className="relative">
            {/* Bell Icon Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition"
            >
                🔔
                <span className={`absolute ${isOpen ? '-top-7 -right-3 w-10 h-10' : 'top-0 right-0 w-4 h-4'} bg-red-500 text-white text-xs flex items-center justify-center rounded-full`}>
                    {isOpen ? `${unreadCount}/${notifications?.length}` : ` ${unreadCount}`}
                </span>
            </button>

            {/* Tray Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 font-semibold text-sm">
                        Notifications
                    </div>

                    {/* two radio buttons for to see all or only unread notifications */}
                    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center space-x-2">
                            <input
                                type="radio"
                                id="unread"
                                name="notificationFilter"
                                value="unread"
                                checked={!showAllNotifications}
                                onChange={() => setShowAllNotifications(false)}
                            />
                            <label htmlFor="unread" className="text-sm text-gray-700 dark:text-gray-300">Unread</label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="radio"
                                id="all"
                                name="notificationFilter"
                                value="all"
                                checked={showAllNotifications}
                                onChange={() => setShowAllNotifications(true)}
                            />
                            <label htmlFor="all" className="text-sm text-gray-700 dark:text-gray-300">All</label>
                        </div>
                    </div>

                    <div className="max-h-64 overflow-y-auto">
                        {notifications?.length === 0 ? (
                            <p className="text-center text-xs text-gray-500 py-4">No notifications yet.</p>
                        ) : (
                            sortedNotifications?.map((notif) => (
                                <div
                                    key={notif.id as number}
                                    className={`px-4 py-3 border-b border-gray-100 dark:border-gray-800 text-xs ${!notif.isRead ? 'bg-blue-50 dark:bg-gray-800/50' : ''} hover: cursor-pointer`}
                                    onClick={() => {
                                        // Update the notification in the database
                                        if (authState.user?.token) {
                                            updatePushNotificationIsRead(authState.user.token, notif.id as number)
                                                .then(() => {
                                                    // console.log(`Notification ${notif.id} marked as read in the database.`);
                                                    // Mark as read logic here
                                                    dispatch({ type: "MARK_NOTIFICATION_AS_READ", payload: notif.id });
                                                    setUnreadCount(prevCount => prevCount - 1);
                                                })
                                                .catch(err => {
                                                    console.error(`Failed to mark notification ${notif.id} as read:`, err);
                                                });
                                        }
                                    }
                                    }
                                >
                                    <p className="font-bold text-gray-800 dark:text-gray-200">{notif.title}</p>
                                    <p className="text-gray-600 dark:text-gray-400 mt-0.5">{notif.description}</p>
                                    <span className="text-[10px] text-gray-400 mt-1 block">
                                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
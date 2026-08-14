"use client";

import { Bell, Info, MailOpen } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NotificationType, useNotifications } from "@/hooks/useNotifications";
import { markNotificationAsRead, clearReadNotifications } from "@/app/actions/notifications";
import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { joinRoomAction } from "@/app/actions/rooms";
import { toast } from "react-toastify";
import { LoadingSwap } from "@/components/ui/loading-swap";

export const NotificationSidebar = () => {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [selectedInvite, setSelectedInvite] = useState<NotificationType | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const router = useRouter();

  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.is_read === b.is_read) {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    return a.is_read ? 1 : -1;
  });

  const handleNotificationClick = async (notif: NotificationType) => {
    if (!notif.is_read) {
      markAsRead(notif.id);
      await markNotificationAsRead(notif.id);
    }

    if (notif.type === "invite") {
      setSelectedInvite(notif);
      setIsSidebarOpen(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!selectedInvite?.metadata?.roomId) return;
    setIsJoining(true);
    const result = await joinRoomAction(selectedInvite.metadata.roomId);
    setIsJoining(false);

    if (result.error) {
      toast.error(result.message);
    } else {
      toast.success("Joined room successfully!");
      setSelectedInvite(null);
      router.push(`/rooms/${selectedInvite.metadata.roomId}`);
    }
  };

  const handleClearRead = async () => {
    setIsClearing(true);
    const result = await clearReadNotifications();
    setIsClearing(false);
    if (result.error) {
      toast.error(result.message);
    } else {
      toast.success("Read notifications cleared!");
    }
  };

  return (
    <>
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetTrigger asChild>
          <button className="relative text-xl dark:text-[#e6eef7] text-[#1e293b] hover:scale-125 transition-transform">
            <Bell />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto bg-white dark:bg-[#1e293b]">
          <SheetHeader className="flex flex-row items-center justify-between mt-4">
            <SheetTitle>Notifications</SheetTitle>
            {sortedNotifications.some((n) => n.is_read) && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-red-500 h-8" disabled={isClearing}>
                    {isClearing ? "Clearing..." : "Clear Read"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all your read notifications.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearRead} className="bg-red-500 hover:bg-red-600 text-white">
                      Yes, clear them
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </SheetHeader>
          <div className="mt-6 flex flex-col gap-4">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                <Bell className="h-12 w-12 mb-4 opacity-20" />
                <p>No notifications yet</p>
              </div>
            ) : (
              sortedNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-gray-100 dark:hover:bg-white/10 ${
                    notif.is_read ? "opacity-70" : "bg-blue-50/50 dark:bg-blue-900/20"
                  }`}
                >
                  <div className="flex-shrink-0 pt-1">
                    {notif.type === "invite" && notif.sender ? (
                      <Image
                        src={notif.sender.image_url || "/default-avatar.png"}
                        alt={notif.sender.name || "User"}
                        width={40}
                        height={40}
                        className="rounded-full aspect-square object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-500 dark:bg-blue-900/50">
                        <Info className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">
                      {notif.type === "invite" ? "Room Invitation" : "System Notification"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {notif.message}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(notif.created_at).toLocaleString()}
                    </p>
                  </div>
                  {!notif.is_read && (
                    <div className="h-2 w-2 mt-2 rounded-full bg-blue-500"></div>
                  )}
                </div>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={!!selectedInvite} onOpenChange={(open) => !open && setSelectedInvite(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MailOpen className="h-5 w-5 text-blue-500" />
              Room Invitation
            </DialogTitle>
            <DialogDescription>
              You have been invited to join a chat room.
            </DialogDescription>
          </DialogHeader>
          {selectedInvite && selectedInvite.metadata && (
            <div className="flex flex-col items-center gap-4 py-4">
              {selectedInvite.sender && (
                <div className="flex flex-col items-center gap-2">
                  <Image
                    src={selectedInvite.sender.image_url}
                    alt={selectedInvite.sender.name}
                    width={64}
                    height={64}
                    className="rounded-full aspect-square object-cover border"
                  />
                  <p className="text-sm text-center">
                    <span className="font-semibold">{selectedInvite.sender.name}</span> invited you
                  </p>
                </div>
              )}
              <div className="w-full rounded-md border p-4 bg-gray-50 dark:bg-gray-800/50">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500">Room Name:</div>
                  <div className="font-medium text-right truncate" title={selectedInvite.metadata.roomName}>
                    {selectedInvite.metadata.roomName || "Unknown"}
                  </div>
                  <div className="text-gray-500">Type:</div>
                  <div className="font-medium text-right">
                    {selectedInvite.metadata.isPublic ? "Public" : "Private"}
                  </div>
                  <div className="text-gray-500">Members:</div>
                  <div className="font-medium text-right">
                    {selectedInvite.metadata.memberCount || 0}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setSelectedInvite(null)}>
              Decline / Later
            </Button>
            <Button onClick={handleJoinRoom} disabled={isJoining}>
              <LoadingSwap isLoading={isJoining}>Accept & Join</LoadingSwap>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { UserPlus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingSwap } from "../ui/loading-swap";
import { useDebounce } from "@/hooks";
import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import Image from "next/image";
import { toast } from "react-toastify";
import { sendInviteEmail } from "@/app/actions/email";
import { getInviteEmailHtml } from "@/lib/utils/emailTemplate";

const inviteUserSchema = z.object({
  email: z.string().email("Invalid email"),
});

const InviteUserModal = ({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) => {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
    mode: "onTouched",
    resolver: zodResolver(inviteUserSchema),
  });

  const [userInfo, setUserInfo] = useState<{
    id: string;
    name: string;
    email: string;
    image_url: string;
  } | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const supabase = createBrowserSupabaseClient;

  const handleInvite = async () => {
    if (!userInfo) {
      toast.error("Please select a valid user to invite");
      return;
    }

    if (userInfo.id === userId) {
      toast.error("You cannot invite yourself");
      return;
    }

    const { data: existingMember } = await supabase
      .from("chat_room_member")
      .select("*")
      .eq("chat_room_id", roomId)
      .eq("member_id", userInfo.id)
      .maybeSingle();

    if (existingMember) {
      toast.error("User is already a member of this chat room");
      return;
    }

    const { data: roomData, error } = await supabase
      .from("chat_room_member")
      .insert({
        chat_room_id: roomId,
        member_id: userInfo.id,
      })
      .select("*")
      .maybeSingle();

    if (error) {
      toast.error("An error occurred while inviting user");
      return;
    }

    if (roomData?.member_id) {
      toast.success("User invited successfully");
      reset();
    }

    const { data: senderData } = await supabase
      .from("user_profiles")
      .select("name, image_url")
      .eq("id", userId)
      .maybeSingle();

    const senderName = senderData?.name || "A user";
    const senderImage =
      senderData?.image_url ||
      "https://ui-avatars.com/api/?name=" + encodeURIComponent(senderName);
    const roomLink =
      typeof window !== "undefined"
        ? window.location.origin + "/rooms/" + roomId
        : "";

    const emailHtml = getInviteEmailHtml({
      senderName,
      senderImage,
      receiverName: userInfo.name,
      receiverImage: userInfo.image_url,
      roomLink,
    });

    try {
      await sendInviteEmail({
        to: userInfo.email,
        subject: `You have been invited to a RapidChat room by ${senderName}`,
        text: `${senderName} has invited you to join a chat room on RapidChat. Join here: ${roomLink}`,
        html: emailHtml,
      });

      setOpen(false);
      setUserInfo(null);
      reset();
    } catch (error) {
      toast.error("An error occurred while sending invitation email");
    }
  };

  const email = watch("email");

  const debouncedEmail = useDebounce(email, 700);

  useEffect(() => {
    if (debouncedEmail && !errors.email) {
      setLoading(true);
      setErrorMessage("");
      setUserInfo(null);

      const fetchUser = async () => {
        const { data, error } = await supabase
          .from("user_profiles")
          .select("id, name, email, image_url")
          .eq("email", debouncedEmail)
          .maybeSingle();

        setLoading(false);

        if (error) {
          setErrorMessage("An error occurred while fetching user");
          console.log(error);
          return;
        }

        if (data) {
          setUserInfo({
            id: data.id,
            name: data.name,
            email: data.email,
            image_url: data.image_url,
          });
        } else {
          setErrorMessage("User not found");
        }
      };
      fetchUser();
    }
  }, [debouncedEmail]);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setUserInfo(null);
          setErrorMessage("");
          setLoading(false);
          reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-transparent border-[1px] border-black/10 text-black dark:border-white/20 dark:text-white hover:bg-gray-100/50 hover:dark:bg-white/10"
          onClick={() => setOpen(true)}
        >
          <UserPlus />
          Invite User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm w-[calc(100%-3rem)]">
        <form
          onSubmit={handleSubmit(handleInvite)}
          className="flex flex-col gap-4"
        >
          <DialogHeader className="gap-2">
            <DialogTitle>Enter you&apos;re friend&apos;s email</DialogTitle>
            <DialogDescription>
              You&apos;re friend will get an email with a link to join the chat.
            </DialogDescription>
          </DialogHeader>
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  {...field}
                  id={field.name}
                  type="email"
                  placeholder="m@example.com"
                  required
                  className={`${fieldState.invalid ? "ring-1 ring-red-500 focus:ring-red-500 focus-visible:ring-red-500" : ""}`}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          {loading && <p>Loading...</p>}
          {!errors?.email && !userInfo && errorMessage && (
            <p className="w-full bg-red-500/10 p-2 rounded-md text-center text-red-500 text-sm">
              {errorMessage}
            </p>
          )}
          {userInfo && !errors?.email && (
            <div className="flex items-center gap-2 mt-2">
              <Image
                src={userInfo.image_url}
                alt={userInfo.name}
                width={30}
                height={30}
                className="rounded-full"
              />
              <span>{userInfo.name}</span>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setOpen(false);
                  setUserInfo(null);
                  setErrorMessage("");
                  setLoading(false);
                  reset();
                }}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isSubmitting || !userInfo || !email.trim().length}
            >
              <LoadingSwap isLoading={isSubmitting}>Invite</LoadingSwap>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteUserModal;

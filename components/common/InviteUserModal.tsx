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

const inviteUserSchema = z.object({
  email: z.string().email("Invalid email"),
});

const InviteUserModal = () => {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting },
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
    image_url: string;
  } | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleInvite = (data: z.infer<typeof inviteUserSchema>) => {
    console.log(data);
  };

  const supabase = createBrowserSupabaseClient;

  const email = watch("email");

  const debouncedEmail = useDebounce(email, 1500);

  useEffect(() => {
    if (debouncedEmail) {
      setLoading(true);
      setErrorMessage("");
      setUserInfo(null);

      const fetchUser = async () => {
        const { data, error } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("email", debouncedEmail)
          .maybeSingle();

        if (error) {
          setErrorMessage("User not found");
          setLoading(false);
          console.log(error);
          return;
        }

        if (data) {
          setLoading(false);
          setUserInfo({
            id: data.id,
            name: data.name,
            image_url: data.image_url,
          });
        }
      };
      fetchUser();
    }
  }, [debouncedEmail]);

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setUserInfo(null);
          setErrorMessage("");
          setLoading(false);
          reset();
        }
      }}
    >
      <form onSubmit={handleSubmit(handleInvite)}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-transparent border-[1px] border-black/10 text-black dark:border-white/20 dark:text-white hover:bg-gray-100/50 hover:dark:bg-white/10"
          >
            <UserPlus />
            Invite User
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm w-[calc(100%-3rem)]">
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
          {!userInfo && errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
          {userInfo && (
            <div className="flex items-center gap-2">
              <div>
                <Image
                  src={userInfo.image_url}
                  alt={userInfo.name}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
                <span>{userInfo.name}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              <LoadingSwap isLoading={isSubmitting}>Invite</LoadingSwap>
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default InviteUserModal;

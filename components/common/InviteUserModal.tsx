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

const inviteUserSchema = z.object({
  email: z.string().email("Invalid email"),
});

const InviteUserModal = () => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
    },
    mode: "onTouched",
    resolver: zodResolver(inviteUserSchema),
  });

  const handleInvite = (data: z.infer<typeof inviteUserSchema>) => {
    console.log(data);
  };

  return (
    <Dialog>
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
            <DialogTitle>Enter you're friend's email</DialogTitle>
            <DialogDescription>
              You're friend will get an email with a link to join the chat.
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

"use client";

import { createRoom } from "@/app/actions/rooms";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { createRoomSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

export default function NewRoomPage() {
  type FormData = z.infer<typeof createRoomSchema>;

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      isPublic: false,
    },
    resolver: zodResolver(createRoomSchema),
  });

  const handleFormData = async (data: FormData) => {
    const { error, message } = await createRoom(data);

    if (error) {
      toast.error(message);
      return;
    }

    toast.success("Room created successfully");
  };

  return (
    <div className="flex-1">
      <Card className="mt-4 w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Create New Room</CardTitle>
          <CardDescription>
            Fill in the details below to create a new chat room
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleFormData)}>
            <FieldGroup>
              <Controller
                control={control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Room Name</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      className={`${fieldState.invalid ? "ring-1 ring-red-500 focus:ring-red-500 focus-visible:ring-red-500" : ""}`}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={control}
                name="isPublic"
                render={({
                  field: { value, onChange, ...field },
                  fieldState,
                }) => (
                  <Field
                    orientation={"horizontal"}
                    data-invalid={fieldState.invalid}
                  >
                    <Checkbox
                      {...field}
                      checked={value}
                      onCheckedChange={onChange}
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldContent>
                      <FieldLabel
                        className="font-normal"
                        htmlFor={field.name}
                      >
                        Public Room
                      </FieldLabel>
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldContent>
                  </Field>
                )}
              />

              <Field orientation="horizontal">
                <Button
                  type="submit"
                  className="w-full"
                >
                  <LoadingSwap isLoading={isSubmitting}>
                    Create Room
                  </LoadingSwap>
                </Button>
                <Button
                  asChild
                  variant="outline"
                >
                  <Link href="/">Cancel</Link>
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

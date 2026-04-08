import { cache } from "react";
import { createServerSupabaseClient } from "../supabase/server";

export const getCurrentUser = cache(async () => {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
});

export const getRandomUserProfileImg = () => {
  const profileImages = [
    "/profile/user-1.jpg",
    "/profile/user-2.webp",
    "/profile/user-3.jpg",
  ];
  const randomIndex = Math.floor(Math.random() * profileImages.length);

  return profileImages[randomIndex];
};

export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

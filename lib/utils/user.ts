import { createServerSupabaseClient } from "../supabase/server";

export const getCurrentUser = async () => {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
};

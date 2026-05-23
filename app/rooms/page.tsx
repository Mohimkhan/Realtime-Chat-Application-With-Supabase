import { getCurrentUser } from "@/lib/utils/user";
import { redirect } from "next/navigation";
import RoomsClient from "@/components/RoomsClient";

export default async function RoomPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return <RoomsClient userId={user.id} />;
}

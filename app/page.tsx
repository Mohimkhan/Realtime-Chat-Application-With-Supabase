import Hero from "@/components/home/Hero";
import { getCurrentUser } from "@/lib/utils/user";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="flex-1 flex flex-col">
      <Hero user={user}/>
    </div>
  );
}

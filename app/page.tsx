import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { MessageSquareIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-1">
      <Empty className="border-[1px] border-white/50 border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <MessageSquareIcon className="size-10" />
          </EmptyMedia>
          <EmptyTitle>No Chat Rooms Yet</EmptyTitle>
          <EmptyDescription>
            Create a new chat room to get started
          </EmptyDescription>
          <EmptyContent>
            <Button asChild>
              <Link href="rooms/new">Create Room</Link>
            </Button>
          </EmptyContent>
        </EmptyHeader>
      </Empty>
    </div>
  );
}

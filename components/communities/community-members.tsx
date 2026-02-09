"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useCommunityMembers } from "@/hooks/use-communities";
import { client } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";
import { Loader2, MessageCircleIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CommunityMembers({
  selectedCommunityId,
  showLockIcon,
}: {
  selectedCommunityId: string;
  showLockIcon: boolean;
}) {
  const router = useRouter();
  const { data: members, isLoading } = useCommunityMembers(selectedCommunityId);

  const startChatMutation = useMutation({
    mutationFn: async (partnerId: string) => {
      const res = await client.api.matches[":communityId"].direct.$post({
        param: { communityId: selectedCommunityId },
        json: { partnerId },
      } as any);
      if (!res.ok) throw new Error("Failed to start chat");
      return res.json();
    },
    onSuccess: (data) => {
      toast.success("Chat started!");
      router.push(`/chat/${data.match.id}`);
    },
    onError: () => {
      toast.error("Failed to start chat");
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <UsersIcon className="size-5 text-primary" />
        <h3 className="font-semibold text-lg">Community Members</h3>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : members && members.length > 0 ? (
        <div className="grid gap-4">
          {members.map((member: any) => (
            <Card key={member.user.id} className="overflow-hidden hover:bg-muted/5 transition-colors">
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Link href={`/user/${member.user.id}`} className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                    <UserAvatar 
                      name={member.user.name} 
                      imageUrl={member.user.imageUrl || undefined} 
                      size="md" 
                    />
                    <div>
                      <p className="font-semibold text-lg">{member.user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Joined {new Date(member.member.joinedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                </div>
                <Button
                  onClick={() => startChatMutation.mutate(member.user.id)}
                  disabled={startChatMutation.isPending || showLockIcon}
                  size="sm"
                  variant="outline"
                  className="gap-2"
                >
                  {startChatMutation.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <MessageCircleIcon className="size-4" />
                  )}
                  Message
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground bg-muted/10 rounded-xl border-dashed border-2">
          <UsersIcon className="size-12 mx-auto mb-4 opacity-50" />
          <h3 className="font-medium text-lg">No other members yet</h3>
          <p className="max-w-xs mx-auto mt-2">
            Invite friends to join this community!
          </p>
        </div>
      )}
    </div>
  );
}

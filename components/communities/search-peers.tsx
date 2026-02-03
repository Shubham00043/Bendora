
"use client";

import { client } from "@/lib/api-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, MessageCircleIcon, SearchIcon, UserPlus2 } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SearchPeers({
  selectedCommunityId,
  showLockIcon,
}: {
  selectedCommunityId: string;
  showLockIcon: boolean;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const router = useRouter();

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["search-peers", debouncedSearch],
    queryFn: async () => {
      if (debouncedSearch.length < 2) return [];
      const res = await client.api.user.search.$get({
        query: { q: debouncedSearch },
      });
      if (!res.ok) throw new Error("Search failed");
      return res.json();
    },
    enabled: debouncedSearch.length >= 2,
  });

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
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search for people by name..."
          className="pl-9 h-12 bg-card text-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : searchResults && searchResults.length > 0 ? (
          <div className="grid gap-4">
            {searchResults.map((user) => (
              <Card key={user.id} className="overflow-hidden">
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <UserAvatar name={user.name} imageUrl={user.imageUrl ?? undefined} size="md" />
                    <div>
                      <p className="font-semibold text-lg">{user.name}</p>
                      <p className="text-sm text-muted-foreground">Ready to connect</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => startChatMutation.mutate(user.id)}
                    disabled={startChatMutation.isPending || showLockIcon}
                    size="sm"
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
        ) : debouncedSearch.length >= 2 ? (
          <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-xl border-dashed border-2">
            <p>No users found matching &quot;{debouncedSearch}&quot;</p>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground bg-muted/10 rounded-xl">
            <UserPlus2 className="size-12 mx-auto mb-4 opacity-50" />
            <h3 className="font-medium text-lg">Find & Connect</h3>
            <p className="max-w-xs mx-auto mt-2">
              Search for friends or colleagues to start a direct chat and share learning goals.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

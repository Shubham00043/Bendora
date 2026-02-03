"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ArrowLeftIcon, CheckIcon, LockIcon, SearchXIcon } from "lucide-react";
import Link from "next/link";
import {
  useAllCommunities,
  useCommunities,
  useJoinCommunity,
} from "@/hooks/use-communities";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/use-users";

export default function AllCommunitiesPage() {
  const {
    data: allCommunities,
    isLoading: isLoadingAllCommunities,
    error: errorAllCommunities,
  } = useAllCommunities();

  const { data: user } = useCurrentUser();
  const isPro = user?.isPro;

  const { data: userCommunities } = useCommunities();
  const numberOfCommunities = userCommunities?.length || 0;

  const isJoined = (communityId: string) => {
    return userCommunities?.some(
      (community) => community.community.id === communityId
    );
  };

  const showLockIcon = numberOfCommunities >= 3 && !isPro;

  const joinCommunityMutation = useJoinCommunity();

  const handleJoinCommunity = async (communityId: string) => {
    await joinCommunityMutation.mutateAsync(communityId);
    toast.success("Joined community successfully");
  };

  if (isLoadingAllCommunities) {
    return (
      <div className="flex items-center justify-center p-12 min-h-[400px]">
        <div className="text-muted-foreground animate-pulse">Loading communities...</div>
      </div>
    );
  }

  if (errorAllCommunities)
    return <div className="p-8 text-center text-destructive">Error: {errorAllCommunities.message}</div>;

  return (
    <div>
      <Link href="/communities">
        <Button variant={"outline"}>
          <ArrowLeftIcon className="size-4" />
          Back to My Communities
        </Button>
      </Link>
      <div className="space-y-4 mt-4">
        <h2 className="text-2xl font-bold">Browse Communities</h2>
        {allCommunities && allCommunities.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allCommunities.map((community) => (
              <Card key={community.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{community.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{community.description}</CardDescription>
                </CardHeader>
                <CardFooter className="px-6 pb-6 mt-auto">
                  <Button
                    className="w-full"
                    disabled={isJoined(community.id) || showLockIcon}
                    onClick={() => handleJoinCommunity(community.id)}
                  >
                    {showLockIcon && (
                      <LockIcon className="size-4 text-muted-foreground mr-2" />
                    )}
                    {isJoined(community.id) ? (
                      <>
                        <CheckIcon className="size-4 mr-2" /> Joined
                      </>
                    ) : (
                      "Join Community"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 mt-8 border rounded-lg bg-muted/20 text-center min-h-[300px]">
            <div className="bg-muted p-4 rounded-full mb-4">
              <SearchXIcon className="size-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg">No communities found</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">
              We couldn't find any public communities at the moment. Please check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

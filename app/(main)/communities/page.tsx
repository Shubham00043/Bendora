"use client";

import AddLearningGoal from "@/components/communities/add-learning-goal";
import AIMatching from "@/components/communities/ai-matching";
import SearchPeers from "@/components/communities/search-peers";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCommunities, useCommunityGoals } from "@/hooks/use-communities";
import { useCurrentUser } from "@/hooks/use-users";
import { LockIcon, SparklesIcon, TargetIcon } from "lucide-react";
import Link from "next/link";
import { startTransition, useEffect, useState } from "react";

export default function CommunitiesPage() {
  const [activeTab, setActiveTab] = useState<"goals" | "matches" | "search">("goals");
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(
    null
  );
  const {
    data: communities,
    isLoading: isLoadingCommunities,
    error: errorCommunities,
  } = useCommunities();

  const {
    data: communityGoals,
    isLoading: isLoadingCommunityGoals,
    error: errorCommunityGoals,
  } = useCommunityGoals(selectedCommunity);

  useEffect(() => {
    if (communities && communities.length > 0 && !selectedCommunity) {
      startTransition(() => {
        setSelectedCommunity(communities[0].community.id);
      });
    }
  }, [communities?.length]);

  const numberOfCommunities = communities?.length || 0;

  const { data: user } = useCurrentUser();
  const isPro = user?.isPro;

  const showLockIcon = numberOfCommunities >= 3 && !isPro;

  if (!isLoadingCommunities && communities?.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 min-h-[500px] text-center space-y-6">
        <div className="bg-primary/10 p-6 rounded-full">
          <SparklesIcon className="size-12 text-primary" />
        </div>
        <div className="space-y-2 max-w-md">
          <CardTitle className="text-3xl">Welcome to Your Communities</CardTitle>
          <CardDescription className="text-lg">
            You haven&apos;t joined any communities yet. Connect with others, set goals, and accelerate your learning journey.
          </CardDescription>
        </div>
        <Link href="/communities/all">
          <Button size="lg" className="rounded-full px-8">
            Explore Communities
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1 border-none shadow-none bg-transparent lg:bg-card lg:border lg:shadow-sm">
        <CardHeader className="px-0 lg:px-6">
          <CardTitle className="flex items-center gap-2">
            {showLockIcon && (
              <LockIcon className="size-4 text-muted-foreground" />
            )}{" "}
            Your Communities
          </CardTitle>
          <CardDescription>{communities?.length} joined</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 px-0 lg:px-6">
          {communities?.map((c) => (
            <Button
              key={c.community.id}
              className="w-full justify-start h-auto py-3 relative overflow-hidden group"
              onClick={() => {
                setSelectedCommunity(c.community.id);
              }}
              variant={
                selectedCommunity === c.community.id ? "default" : "outline"
              }
            >
               <span className="truncate">{c.community.name}</span>
               {selectedCommunity === c.community.id && (
                 <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary-foreground/20" />
               )}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 min-h-[500px] flex flex-col">
        <CardHeader>
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 sm:pb-0">
            <Button
              onClick={() => setActiveTab("goals")}
              variant={activeTab === "goals" ? "default" : "outline"}
              size="sm"
            >
              My Goals
            </Button>
            <Button
              onClick={() => setActiveTab("matches")}
              variant={activeTab === "matches" ? "default" : "outline"}
              size="sm"
            >
              Find Partners with AI
            </Button>
            <Button
              onClick={() => setActiveTab("search")}
              variant={activeTab === "search" ? "default" : "outline"}
              size="sm"
              className="gap-2"
            >
               <SparklesIcon className="size-3" /> Direct Connect
            </Button>
          </div>
          <CardTitle>
            {activeTab === "goals"
              ? "Learning Goals"
              : activeTab === "matches" 
              ? "Potential Learning Partners"
              : "Search Peers"}
          </CardTitle>
          <CardDescription>
            {activeTab === "goals"
              ? `${communityGoals?.length || 0} ${
                  (communityGoals?.length || 0) === 1 ? "goal" : "goals"
                } in selected community`
              : activeTab === "matches"
              ? "Members with similar learning goals"
              : "Find specific people to chat with"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          {activeTab === "goals" ? (
            <div className="space-y-4 h-full flex flex-col">
              {communityGoals && communityGoals.length > 0 ? (
                 communityGoals.map((c) => (
                  <Card key={c.id} className="shadow-sm border-l-4 border-l-primary/50 hover:bg-muted/20 transition-colors">
                    <CardHeader className="py-4">
                      <CardTitle className="text-base font-medium">{c.title}</CardTitle>
                      <CardDescription>{c.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg bg-muted/10 mx-auto w-full max-w-lg mb-6">
                   <div className="bg-muted p-3 rounded-full mb-3">
                     <TargetIcon className="size-6 text-muted-foreground" />
                   </div>
                   <h3 className="font-semibold text-lg">No goals set yet</h3>
                   <p className="text-muted-foreground text-sm mb-4">Set clear learning goals to track your progress and get better matches.</p>
                </div>
              )}
              <div className="pt-4 mt-auto border-t">
                  <AddLearningGoal
                    selectedCommunityId={selectedCommunity!}
                    showLockIcon={showLockIcon}
                  />
              </div>
            </div>
          ) : activeTab === "matches" ? (
            <AIMatching
              totalGoals={communityGoals?.length || 0}
              selectedCommunityId={selectedCommunity!}
              showLockIcon={showLockIcon}
            />
          ) : (
            <SearchPeers selectedCommunityId={selectedCommunity!} showLockIcon={showLockIcon} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { useAiPartners, useMatches, useAcceptMatch } from "@/hooks/use-ai-partner";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { LockIcon, Loader2, MessageCircleIcon, Sparkles, UserPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AIMatching({
  totalGoals,
  selectedCommunityId,
  showLockIcon,
}: {
  totalGoals: number;
  selectedCommunityId: string;
  showLockIcon: boolean;
}) {
  const aiPartnerMutation = useAiPartners();
  const { data: matches, isLoading } = useMatches();
  const acceptMatchMutation = useAcceptMatch();
  const router = useRouter();

  const handleFindAIPartners = async () => {
    try {
      const result = await aiPartnerMutation.mutateAsync(selectedCommunityId);
      if (result.matched > 0) {
          toast.success(`Found ${result.matched} new AI partner(s)!`);
      } else {
          toast.info("No new compatible partners found at this time.");
      }
    } catch (error) {
      console.error("Error finding ai partners", error);
      toast.error("Failed to find ai partners");
    }
  };

  const communityMatches = matches?.filter(
    (match: any) => match.communityId === selectedCommunityId
  );

  return (
    <div className="space-y-8 py-8 px-4">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold flex items-center justify-center gap-2">
            <Sparkles className="size-6 text-primary fill-primary/20" />
            AI-Powered Matching
          </h3>
          <p className="text-muted-foreground text-lg">
            Our AI analyzes your learning goals to find the most compatible partners in this community.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <Button
            size="lg"
            disabled={totalGoals === 0 || showLockIcon || aiPartnerMutation.isPending}
            onClick={handleFindAIPartners}
            className="w-full sm:w-auto min-w-[200px] h-12 text-base shadow-lg hover:shadow-xl transition-all"
          >
            {aiPartnerMutation.isPending ? (
              <>
                <Loader2 className="size-5 animate-spin mr-2" />
                Finding Partners...
              </>
            ) : showLockIcon ? (
              <>
                <LockIcon className="size-5 mr-2" />
                Unlock to Find Partners
              </>
            ) : (
              <>
                <span className="mr-2 text-xl">🤖</span>
                Find Partners with AI
              </>
            )}
          </Button>

          {totalGoals === 0 && (
            <p className="text-sm text-amber-500 font-medium bg-amber-500/10 px-4 py-2 rounded-full">
              ⚠️ Add learning goals first to enable AI matching
            </p>
          )} 
           {totalGoals > 0 && !aiPartnerMutation.isPending && (
            <p className="text-sm text-muted-foreground">
              Based on your {totalGoals} active learning goal{totalGoals !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 className="size-10 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">Loading your matches...</p>
          </div>
        ) : communityMatches && communityMatches.length > 0 ? (
          <div className="grid gap-4 max-w-3xl mx-auto">
             <h4 className="font-semibold text-lg px-2">Your Recommended Partners</h4>
             {communityMatches.map((match: any) => (
              <Card key={match.id} className="overflow-hidden border-l-4 border-l-primary hover:border-l-primary/80 transition-all hover:shadow-md">
                <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="w-full">
                    <Link href={`/user/${match.partner.id}`} className="flex items-start sm:items-center gap-4 w-full group">
                      <UserAvatar
                        name={match.partner.name}
                        imageUrl={match.partner.imageUrl || undefined}
                        size="lg"
                        className="border-2 border-primary/10 group-hover:border-primary/40 transition-colors"
                      />
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-lg truncate group-hover:underline decoration-primary/50 underline-offset-4">{match.partner.name}</p>
                          {match.status === "accepted" && (
                            <span className="text-xs bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full font-medium">Connected</span>
                          )}
                        </div>
                        
                        {match.partnerGoals && match.partnerGoals.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {match.partnerGoals.map((goal: any) => (
                              <span key={goal.id} className="inline-flex items-center text-xs bg-secondary/50 px-2.5 py-1 rounded-md text-secondary-foreground max-w-[200px] truncate">
                                <span className="size-1.5 rounded-full bg-primary/50 mr-1.5" />
                                {goal.title}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">No public goals listed</p>
                        )}
                      </div>
                    </Link>
                  </div>

                  <div className="flex sm:flex-col gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                    {match.status === "accepted" ? (
                      <Button
                        onClick={() => router.push(`/chat/${match.id}`)}
                        className="w-full sm:w-auto gap-2"
                        variant="default"
                      >
                        <MessageCircleIcon className="size-4" />
                        Chat
                      </Button>
                    ) : (
                       <Button
                        onClick={() => acceptMatchMutation.mutate(match.id)}
                        disabled={acceptMatchMutation.isPending}
                        className="w-full sm:w-auto gap-2"
                        variant={match.status === "pending" ? "default" : "secondary"}
                      >
                        {acceptMatchMutation.isPending ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <>
                            <UserPlus className="size-4" />
                            Connect
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !isLoading && matches ? (
           <div className="text-center py-16 px-4 text-muted-foreground bg-muted/5 rounded-2xl border-2 border-dashed mx-auto max-w-2xl">
              <div className="bg-muted/20 p-4 rounded-full inline-block mb-4">
                 <UserPlus className="size-8 text-muted-foreground/50" />
              </div>
              <h4 className="font-semibold text-lg text-foreground mb-1">No matches found yet</h4>
              <p className="max-w-xs mx-auto">
                {totalGoals > 0 
                  ? "Try running the AI matcher to find people with similar goals." 
                  : "Add some learning goals to help us find the right people for you."}
              </p>
           </div>
        ) : null}
      </div>
    </div>
  );
}

"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useAcceptMatch, useMatches } from "@/hooks/use-ai-partner";
import { useCurrentUser } from "@/hooks/use-users";
import { CheckCircle2, MessageSquareDashed, UserPlus2, UsersRound } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChatPage() {
  const {
    data: matches,
    isLoading: isLoadingMatches,
    error: errorMatches,
  } = useMatches();

  const { data: user } = useCurrentUser();
  const isPro = user?.isPro;

  const router = useRouter();

  const acceptMatchMutation = useAcceptMatch();

  if (isLoadingMatches) return <div className="p-12 text-center text-muted-foreground">Loading matches...</div>;
  if (errorMatches) return <div className="p-12 text-center text-destructive">Error loading matches: {errorMatches.message}</div>;

  const acceptedMatches = matches?.filter(
    (match) => match.status === "accepted"
  );
  const pendingMatches = matches?.filter((match) => match.status === "pending");

  let pendingMatchesToShow = [];
  if (!isPro) {
    pendingMatchesToShow = pendingMatches?.slice(0, 1) || [];
  } else {
    pendingMatchesToShow = pendingMatches || [];
  }

  return (
    <div className="section-container py-8 max-w-5xl mx-auto space-y-12">
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Pending Matches</h2>
            <p className="text-muted-foreground mt-1">
              Review your suggested learning partners.
            </p>
          </div>
          {pendingMatchesToShow && pendingMatchesToShow.length > 0 && (
            <Badge variant="secondary" className="px-3 py-1 text-sm">
              {pendingMatchesToShow.length} New
            </Badge>
          )}
        </div>

        <div className="flex gap-6 overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide">
          {pendingMatchesToShow && pendingMatchesToShow.length > 0 ? (
            pendingMatchesToShow.map((match) => {
              const partner = {
                id: match.partner.id || "",
                name: match.partner.name || "Partner",
                imageUrl: match.partner.imageUrl ?? undefined,
              };
              return (
                <Card
                  key={match.id}
                  className="flex flex-col w-[320px] shrink-0 border-2 border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/40" />
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <UserAvatar name={partner.name} imageUrl={partner.imageUrl} size="lg" className="ring-2 ring-background shadow-sm" />
                        <div>
                          <CardTitle className="text-lg font-bold">
                            {partner.name}
                          </CardTitle>
                          {match.community && (
                             <Badge variant="outline" className="mt-1 font-normal text-xs bg-primary/5 border-primary/20 text-primary">
                                {match.community.name}
                             </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4">
                    {match.partnerGoals && match.partnerGoals.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Goal
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {match.partnerGoals.slice(0, 2).map((g) => (
                            <Badge
                              key={g.id}
                              variant="secondary"
                              className="px-2 py-0.5 text-xs font-normal"
                            >
                              {g.title}
                            </Badge>
                          ))}
                          {match.partnerGoals.length > 2 && (
                             <span className="text-xs text-muted-foreground self-center">+{match.partnerGoals.length - 2} more</span>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-2 bg-muted/20 mt-auto">
                    <Button
                      className="w-full gap-2 shadow-sm font-semibold"
                      onClick={() => acceptMatchMutation.mutate(match.id)}
                      disabled={acceptMatchMutation.isPending}
                      size="lg"
                    >
                      {acceptMatchMutation.isPending ? (
                        "Accepting..."
                      ) : (
                        <>
                          <UserPlus2 className="size-4" /> Accept Match
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })
          ) : (
             <div className="w-full border-2 border-dashed border-muted rounded-xl p-12 flex flex-col items-center justify-center text-center bg-muted/5 max-w-2xl mx-auto">
               <div className="bg-muted p-4 rounded-full mb-4">
                 <UsersRound className="size-8 text-muted-foreground" />
               </div>
               <h3 className="text-lg font-medium">No new matches yet</h3>
               <p className="text-muted-foreground max-w-sm mt-2">
                 Join more communities or add detailed learning goals to your profile to get matched with peers!
               </p>
               <Button variant="outline" className="mt-6" onClick={() => router.push('/communities')}>
                 Browse Communities
               </Button>
             </div>
          )}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Active Chats</h2>
            <p className="text-muted-foreground mt-1">
              Continue your conversations.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {acceptedMatches && acceptedMatches.length > 0 ? (
            acceptedMatches.map((match) => {
              const partner = {
                id: match.partner.id || "",
                name: match.partner.name || "Partner",
                imageUrl: match.partner.imageUrl ?? undefined,
              };
              return (
                <div
                  key={match.id}
                  className="group relative bg-card hover:bg-muted/30 border rounded-xl p-4 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:border-primary/20"
                  onClick={() => router.push(`/chat/${match.id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <UserAvatar name={partner.name} imageUrl={partner.imageUrl} size="md" />
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                         <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">{partner.name}</h3>
                         <span className="text-[10px] uppercase text-muted-foreground font-medium tracking-wide">Active</span>
                      </div>
                      
                      {match.community ? (
                         <p className="text-xs text-muted-foreground truncate">{match.community.name}</p>
                      ) : (
                         <p className="text-xs text-muted-foreground truncate">Direct Message</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="size-3 text-primary" /> Matched</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200 font-medium text-primary">Open Chat &rarr;</span>
                  </div>
                </div>
              );
            })
          ) : (
             <div className="col-span-full border-2 border-dashed border-muted rounded-xl p-12 flex flex-col items-center justify-center text-center bg-muted/5">
                <div className="bg-muted p-4 rounded-full mb-4">
                  <MessageSquareDashed className="size-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No active connections</h3>
                <p className="text-muted-foreground max-w-sm mt-2">
                  Once you accept a match, they will appear here. Start by checking your pending matches above!
                </p>
             </div>
          )}
        </div>
      </section>

      <section className="pt-8 border-t">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Explore Communities</h2>
            <p className="text-muted-foreground mt-1">
              Find your tribe and start collaborating.
            </p>
          </div>
          <Button variant="ghost" className="hidden sm:flex" onClick={() => router.push('/communities')}>
            View All <UsersRound className="ml-2 size-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
             { title: "Frontend Development", desc: "Master React, Next.js and modern UI.", icon: "🎨", color: "bg-blue-500/10 text-blue-600" },
             { title: "Backend Engineering", desc: "Scale systems with Node, Go and Rust.", icon: "⚙️", color: "bg-orange-500/10 text-orange-600" },
             { title: "AI & Machine Learning", desc: "Build the future with LLMs and Python.", icon: "🤖", color: "bg-purple-500/10 text-purple-600" }
           ].map((item, i) => (
             <div key={i} className="group border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-md cursor-pointer bg-card" onClick={() => router.push('/communities')}>
                <div className={`p-3 rounded-lg w-fit mb-4 ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                   <span className="text-2xl">{item.icon}</span>
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  {item.desc}
                </p>
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground border-primary/20">
                  Join Community
                </Button>
             </div>
           ))}
        </div>
      </section>
    </div>
  );
}

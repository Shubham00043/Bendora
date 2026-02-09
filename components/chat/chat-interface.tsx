"use client";

import { useRef, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs"; 
import { client } from "@/lib/api-client";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";  
import { UserAvatar } from "../ui/user-avatar"; 
import { 
  Loader2, 
  SendIcon, 
  Sparkles, 
  ListChecks, 
  Lightbulb, 
  ArrowRight, 
  FileText 
} from "lucide-react";
import { useSocket } from "../providers/socket-provider";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";

export default function ChatInterface({ matchId }: { matchId: string }) {
  const { user: clerkUser } = useUser();
  const [message, setMessage] = useState("");

  //fetch the conversation for the match
  const { data: conversation } = useQuery({
    queryKey: ["conversation", matchId],
    queryFn: async () => {
      const res = await client.api.matches[":matchId"].conversation.$get({
        param: { matchId },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch conversation");
      }
      return res.json();
    },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const { socket, isConnected } = useSocket();

  useEffect(() => {
     if (socket && isConnected && matchId) {
         socket.emit("join_room", matchId);
         
         const handleReceiveMessage = () => {
             // Invalidate queries to fetch new messages
             queryClient.invalidateQueries({
                 queryKey: ["messages", conversation?.id],
             });
         };

         socket.on("receive_message", handleReceiveMessage);

         return () => {
             socket.off("receive_message", handleReceiveMessage);
         };
     }
  }, [socket, isConnected, matchId, conversation?.id]);

  //fetch the messages for the conversation
  const { data: messages } = useQuery({
    queryKey: ["messages", conversation?.id],
    queryFn: async () => {
      const res = await client.api.conversations[
        ":conversationId"
      ].messages.$get({
        param: { conversationId: conversation?.id ?? "" },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch messages");
      }
      return res.json();
    },
    refetchInterval: 5000, // poll every 5 seconds
  });

  useEffect(() => {
    if (messages) {
      scrollToBottom();
    }
  }, [messages]);

  const queryClient = useQueryClient();

  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      const res = await client.api.conversations[
        ":conversationId"
      ].messages.$post({
        param: { conversationId: conversation?.id ?? "" },
        // @ts-expect-error - content is not defined in the API client
        json: { content: message },
      });
      if (!res.ok) {
        throw new Error("Failed to send message");
      }
      return res.json();
    },
    onSuccess: (data) => {
      setMessage("");
      // Emit socket event for real-time update
      if (socket && matchId) {
          socket.emit("send_message", {
              matchId,
              content: message, // Optimistic, but data actually has the saved message
              senderId: conversation?.currentUserId 
          });
      }
      queryClient.invalidateQueries({
        queryKey: ["messages", conversation?.id],
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const generateSummaryMutation = useMutation({
    mutationFn: async () => {
      const res = await client.api.conversations[
        ":conversationId"
      ].summarize.$post({
        param: { conversationId: conversation?.id ?? "" },
      });
      if (!res.ok) {
        throw new Error("Failed to generate summary");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["summary", conversation?.id],
      });
    },
    onError: (error) => {
      console.error("Error generating summary", error);
    },
  });

  const { data: summary } = useQuery({
    queryKey: ["summary", conversation?.id],
    queryFn: async () => {
      const res = await client.api.conversations[
        ":conversationId"
      ].summary.$get({
        param: { conversationId: conversation?.id ?? "" },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch summary");
      }
      return res.json();
    },
    enabled: !!conversation?.id,
  });

  if (!conversation) {
    return <div>Loading...</div>;
  }

  const otherUser = {
    id: conversation.otherUser.id,
    name: conversation.otherUser.name,
    imageUrl: conversation.otherUser.imageUrl,
  };

  const currentUser = {
    name: (clerkUser?.firstName + " " + clerkUser?.lastName).trim() ?? "You",
    imageUrl: clerkUser?.imageUrl ?? undefined,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="col-span-2">
        <Card className="h-[calc(100vh-12rem)] min-h-[500px] flex flex-col shadow-md border-border/50">
          <CardHeader className="border-b bg-muted/30 py-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <UserAvatar
                  name={otherUser.name}
                  imageUrl={otherUser.imageUrl ?? undefined}
                  className="ring-2 ring-background"
                />
                {isConnected && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-background rounded-full" />
                )}
              </div>
              <div>
                <CardTitle className="text-base font-medium leading-none">{otherUser.name}</CardTitle>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    {isConnected ? (
                        <>
                           <span className="size-1.5 bg-green-500 rounded-full animate-pulse" />
                           Online
                        </>
                    ) : (
                        "Offline"
                    )}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/5">
            {messages?.map((message) => {
              const isCurrentUser =
                message.senderId === conversation.currentUserId;
              const user = isCurrentUser ? currentUser : otherUser;
              return (
                <div key={message.id} className={cn("flex w-full gap-2 mb-4", isCurrentUser ? "justify-end" : "justify-start")}>
                  {!isCurrentUser && (
                      <UserAvatar
                        name={user.name}
                        imageUrl={user.imageUrl ?? undefined}
                        size="sm"
                        className="mt-1"
                      />
                  )}
                  <div
                    className={cn(
                      "px-4 py-2.5 max-w-[75%] shadow-sm",
                      isCurrentUser
                        ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm"
                        : "bg-background border rounded-2xl rounded-tl-sm"
                    )}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <p className={cn("text-[10px] mt-1 text-right opacity-70", isCurrentUser ? "text-primary-foreground/80" : "text-muted-foreground")}>
                      {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </CardContent>
          <CardFooter className="p-3 bg-background border-t">
            <form 
              className="flex w-full gap-2 items-end"
              onSubmit={(e) => {
                e.preventDefault();
                sendMessageMutation.mutate();
              }}
            >
              <Textarea
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="resize-none min-h-[2.5rem] max-h-32 py-3 bg-muted/30 focus-visible:ring-1"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessageMutation.mutate();
                  }
                }}
              />
              <Button type="submit" size="icon" className="shrink-0 h-10 w-10 rounded-full" disabled={!message.trim() || sendMessageMutation.isPending}>
                <SendIcon className="size-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
      <div className="col-span-1">
        <Card className="w-full h-[calc(100vh-12rem)] min-h-[500px] flex flex-col shadow-md border-border/50">
          <CardHeader className="border-b bg-muted/10 py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="size-4 text-primary" />
                  AI Check-in
              </CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() => generateSummaryMutation.mutate()}
                disabled={generateSummaryMutation.isPending}
                className="h-8 gap-2"
              >
                {generateSummaryMutation.isPending ? (
                    <Loader2 className="size-3 animate-spin" />
                ) : (
                    <Sparkles className="size-3" />
                )}
                Summarize
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Current conversation insights</p>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-6">
            {summary ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm flex items-center gap-2 text-primary">
                      <FileText className="size-4" />
                      Executive Summary
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed bg-muted/20 p-3 rounded-lg border">
                    {summary.summary}
                  </p>
                </div>

                {summary.keyPoints && summary.keyPoints.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm flex items-center gap-2 text-blue-500">
                        <Lightbulb className="size-4" />
                        Key Insights
                    </h4>
                    <ul className="space-y-2">
                      {summary.keyPoints.map((point: string, index: number) => (
                        <li
                          key={index}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <span className="mt-1.5 size-1.5 rounded-full bg-blue-500 shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {summary.actionItems && summary.actionItems.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm flex items-center gap-2 text-green-500">
                        <ListChecks className="size-4" />
                        Action Items
                    </h4>
                    <div className="space-y-2 bg-green-500/5 p-3 rounded-lg border border-green-500/10">
                      {summary.actionItems.map((item: string, index: number) => (
                        <div key={index} className="flex items-start gap-2">
                           <div className="mt-1 size-4 border-2 border-green-500/50 rounded flex items-center justify-center shrink-0">
                               <div className="size-2 bg-green-500 rounded-[1px]" />
                           </div>
                           <span className="text-sm text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {summary.nextSteps && summary.nextSteps.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm flex items-center gap-2 text-purple-500">
                        <ArrowRight className="size-4" />
                        Next Steps
                    </h4>
                    <ul className="space-y-2">
                      {summary.nextSteps.map((step: string, index: number) => (
                        <li
                          key={index}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                           <ArrowRight className="size-3 mt-1 text-purple-500 shrink-0" />
                           {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <p className="text-[10px] text-muted-foreground text-center pt-4 border-t">
                    Generated on {new Date(summary.generatedAt).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 text-muted-foreground opacity-50">
                <Sparkles className="size-12" />
                <p className="text-sm">
                  Click &quot;Summarize&quot; to generate an AI breakdown of your conversation.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

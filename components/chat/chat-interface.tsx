"use client";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { UserAvatar } from "../ui/user-avatar";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/api-client";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { SendIcon } from "lucide-react";

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
    onSuccess: () => {
      setMessage("");
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
              <UserAvatar
                name={otherUser.name}
                imageUrl={otherUser.imageUrl ?? undefined}
                className="ring-2 ring-background"
              />
              <div>
                <CardTitle className="text-base font-medium leading-none">{otherUser.name}</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Online</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/5">
            {messages?.map((message) => {
              const isCurrentUser =
                message.senderId === conversation.currentUserId;
              const user = isCurrentUser ? currentUser ?? "" : otherUser ?? "";
              return (
                <div key={message.id} className="w-full">
                  <div
                    className={cn(
                      "flex items-end gap-2 max-w-[80%]",
                      isCurrentUser ? "ml-auto flex-row-reverse" : "mr-auto"
                    )}
                  >
                    {!isCurrentUser && (
                      <UserAvatar
                        name={user?.name ?? "U"}
                        imageUrl={user?.imageUrl ?? undefined}
                        size="sm"
                        className="mb-1"
                      />
                    )}
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-2 shadow-sm text-sm",
                        isCurrentUser
                          ? "bg-primary text-primary-foreground rounded-br-none"
                          : "bg-card border text-card-foreground rounded-bl-none"
                      )}
                    >
                      <p className="leading-relaxed">
                        {message.content}
                      </p>
                      <p className={cn("text-[10px] mt-1 opacity-70", isCurrentUser ? "text-primary-foreground/80" : "text-muted-foreground")}>
                        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
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
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Conversation Summary</CardTitle>
              <Button
                size="sm"
                onClick={() => generateSummaryMutation.mutate()}
              >
                Generate
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {summary ? (
              <>
                <div>
                  <h4 className="font-medium mb-2">Summary</h4>
                  <p className="text-sm text-muted-foreground">
                    {summary.summary}
                  </p>
                </div>
                {summary.keyPoints && summary.keyPoints.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Key Points</h4>
                    <ul className="space-y-1">
                      {summary.keyPoints.map((point: string, index: number) => (
                        <li
                          key={index}
                          className="text-sm text-muted-foreground"
                        >
                          • {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {summary.actionItems && summary.actionItems.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Action Items</h4>
                    <div className="space-y-2">
                      {summary.actionItems.map((item, index: number) => (
                        <div key={index} className="flex items-start gap-2">
                          <ul className="flex-1 list-disc list-inside">
                            <li className="text-sm">{item}</li>
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {summary.nextSteps && summary.nextSteps.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Next Steps</h4>
                    <ul className="space-y-1">
                      {summary.nextSteps.map((step: string, index: number) => (
                        <li
                          key={index}
                          className="text-sm text-muted-foreground"
                        >
                          • {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                No summary generated yet. Click &quot;Generate&quot; to create
                one.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

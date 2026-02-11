
"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2, PlayCircleIcon, RotateCwIcon } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

async function getVideos(topic: string) {
  const res = await fetch(`/api/youtube?topic=${encodeURIComponent(topic)}`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error?.message || "Failed to fetch videos");
  }
  const data = await res.json();
  return data.items || [];
}

interface VideoListProps {
  topic: string;
}

interface YoutubeVideo {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
    channelTitle: string;
    publishedAt: string;
  };
}

export function VideoList({ topic }: VideoListProps) {
  const {
    data: videos,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery<YoutubeVideo[]>({
    queryKey: ["videos", topic],
    queryFn: () => getVideos(topic),
    enabled: !!topic,
    refetchOnWindowFocus: false, // Prevents aggressive refetching
  });

  let content;

  if (isLoading) {
    content = (
      <div className="flex h-40 w-full items-center justify-center">
        <Loader2 className="animate-spin text-primary size-8" />
      </div>
    );
  } else if (error) {
    content = (
      <div className="text-center py-12 border rounded-lg bg-red-50 text-red-600">
        <p>{error instanceof Error ? error.message : "Failed to load videos. Please try again later."}</p>
      </div>
    );
  } else if (!videos || videos.length === 0) {
    content = (
      <div className="text-center py-12 border rounded-lg bg-muted/20">
        <p className="text-muted-foreground">No videos found for this course.</p>
      </div>
    );
  } else {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Card
            key={video.id.videoId}
            className="overflow-hidden flex flex-col h-full bg-card border-none shadow-sm"
          >
            <div className="aspect-video w-full rounded-t-lg overflow-hidden bg-black">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${video.id.videoId}`}
                title={video.snippet.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base line-clamp-2 leading-tight">
                {video.snippet.title}
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                {video.snippet.channelTitle} •{" "}
                {new Date(video.snippet.publishedAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <PlayCircleIcon className="size-6 text-primary" />
          Recommended Videos
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isLoading || isRefetching}
          className="gap-2"
        >
          <RotateCwIcon
            className={`size-4 ${isRefetching ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>
      {content}
    </div>
  );
}

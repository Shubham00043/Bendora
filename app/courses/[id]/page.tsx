
import { courses } from "@/lib/courses";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { VideoList } from "@/components/video-list";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = courses.find((c) => c.id === Number(id));

  if (!course) {
    notFound();
  }

  const Icon = course.icon;

  return (
    <div className="section-container py-12 space-y-8">
      <div>
        <Link href="/courses">
          <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-primary mb-4">
            <ArrowLeftIcon className="mr-2 size-4" />
            Back to Courses
          </Button>
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Icon className="size-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight">{course.title}</h1>
            </div>
            <p className="text-xl text-muted-foreground">{course.description}</p>
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="text-sm">
                {course.difficulty}
              </Badge>
              <Badge variant="outline" className="text-sm">
                {course.category}
              </Badge>
              <span className="text-sm text-muted-foreground flex items-center bg-secondary/50 px-3 py-1 rounded-full">
                {course.duration}
              </span>
            </div>
          </div>
        </div>
      </div>

        <VideoList topic={course.query} />
    </div>
  );
}

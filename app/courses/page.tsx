"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Link from "next/link";

import { courses } from "@/lib/courses";

export default function CoursesPage() {
  return (
    <div className="section-container py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-4">
          Explore Our Courses
        </h1>
        <p className="text-muted-foreground text-lg">
          Advance your career with our curated courses on software engineering,
          programming languages, and system design.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const Icon = course.icon;
          return (
            <Card key={course.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="size-6 text-primary" />
                  </div>
                  <Badge variant="secondary">{course.difficulty}</Badge>
                </div>
                <CardTitle className="text-xl mb-2">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline">{course.category}</Badge>
                  <span className="text-xs text-muted-foreground flex items-center bg-secondary/50 px-2 py-1 rounded">
                    {course.duration}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                 {/* Linking to sign-in or communities for now as a "Start" action */}
                <Link href={`/courses/${course.id}`} className="w-full">
                  <Button className="w-full">Start Learning</Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

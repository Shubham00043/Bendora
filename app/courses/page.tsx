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
import {
  BookIcon,
  CodeIcon,
  CpuIcon,
  DatabaseIcon,
  GlobeIcon,
  LayersIcon,
  RocketIcon,
  TerminalIcon,
} from "lucide-react";
import Link from "next/link";

const courses = [
  {
    id: 1,
    title: "Full Stack Web Development",
    description:
      "Master modern web development with Next.js 14, React, TypeScript, and Postgres. Build real-world applications from scratch.",
    category: "Web Development",
    difficulty: "Intermediate",
    duration: "12 Weeks",
    icon: GlobeIcon,
  },
  {
    id: 2,
    title: "System Design Fundamentals",
    description:
      "Learn how to design scalable, reliable, and maintainable software systems. Essential for senior engineering roles.",
    category: "Software Engineering",
    difficulty: "Advanced",
    duration: "8 Weeks",
    icon: LayersIcon,
  },
  {
    id: 3,
    title: "Python for Data Science",
    description:
      "Dive into data analysis, visualization, and machine learning using Python, Pandas, and Scikit-learn.",
    category: "Data Science",
    difficulty: "Beginner",
    duration: "10 Weeks",
    icon: DatabaseIcon,
  },
  {
    id: 4,
    title: "The Art of Clean Code",
    description:
      "Write cleaner, more maintainable code. Covers SOLID principles, design patterns, and refactoring techniques.",
    category: "Software Engineering",
    difficulty: "Intermediate",
    duration: "6 Weeks",
    icon: BookIcon,
  },
  {
    id: 5,
    title: "Rust Programming: Zero to Hero",
    description:
      "Unlock the power of memory safety and performance with Rust. Build fast and reliable systems software.",
    category: "Programming Languages",
    difficulty: "Intermediate",
    duration: "10 Weeks",
    icon: RocketIcon,
  },
  {
    id: 6,
    title: "Algorithms & Data Structures",
    description:
      "Ace your coding interviews and improve your problem-solving skills with a deep dive into DSA.",
    category: "Computer Science",
    difficulty: "Intermediate",
    duration: "12 Weeks",
    icon: CpuIcon,
  },
  {
    id: 7,
    title: "Advanced JavaScript Patterns",
    description:
      "Deep dive into JS closures, prototypes, async programming, and modern ES6+ features.",
    category: "Programming Languages",
    difficulty: "Advanced",
    duration: "5 Weeks",
    icon: CodeIcon,
  },
  {
    id: 8,
    title: "DevOps & CI/CD Pipelines",
    description:
      "Learn to automate deployment, manage infrastructure as code, and master Docker & Kubernetes.",
    category: "DevOps",
    difficulty: "Intermediate",
    duration: "8 Weeks",
    icon: TerminalIcon,
  },
];

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
                <Link href="/communities" className="w-full">
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

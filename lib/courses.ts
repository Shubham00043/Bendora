
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

export const courses = [
  {
    id: 1,
    title: "Full Stack Web Development",
    description:
      "Master modern web development with Next.js 14, React, TypeScript, and Postgres. Build real-world applications from scratch.",
    category: "Web Development",
    difficulty: "Intermediate",
    duration: "12 Weeks",
    icon: GlobeIcon,
    query: "full stack web development nextjs react course",
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
    query: "system design interview preparation course",
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
    query: "python for data science course",
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
    query: "clean code solid principles design patterns",
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
    query: "rust programming language course",
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
    query: "algorithms and data structures course",
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
    query: "advanced javascript patterns course",
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
    query: "devops ci cd pipeline docker kubernetes",
  },
];

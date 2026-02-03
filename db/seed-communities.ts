
import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "./index";
import { communities, users } from "./schema";
import { eq } from "drizzle-orm";

const communitiesData = [
  {
    name: "Modern Full Stack Next.js Course",
    description:
      "Build production-ready full-stack applications with Next.js, React, TypeScript, and modern tools",
  },
  {
    name: "Developer to Leader",
    description:
      "Transition from senior developer to tech lead and engineering manager",
  },
  {
    name: "Tech Creators Community",
    description:
      "Community for tech creators and developers - learn web development, coding tips, and career advice",
  },
  {
    name: "Python for Data Science",
    description: "Master Python, pandas, NumPy, and machine learning basics",
  },
  {
    name: "AI & Machine Learning",
    description:
      "Deep learning, neural networks, and practical AI applications",
  },
  {
    name: "Cloud & DevOps",
    description: "AWS, Azure, Docker, Kubernetes, and CI/CD pipelines",
  },
];

async function seedCommunities() {
  console.log("🌱 Seeding communities only...");

  // Get a user to be the creator
  const allUsers = await db.select().from(users).limit(1);
  if (allUsers.length === 0) {
    console.error("❌ No users found in database. Please ensure users exist before seeding communities.");
    // Fallback: Create a temp user if none exist? No, better to warn.
    process.exit(1);
  }
  const creatorId = allUsers[0].id;
  console.log(`Using user ${allUsers[0].name} (${creatorId}) as community creator.`);

  for (const community of communitiesData) {
    // Check if exists
    const existing = await db.query.communities.findFirst({
        where: eq(communities.name, community.name)
    });

    if (existing) {
        console.log(`- Community "${community.name}" already exists. Skipping.`);
    } else {
        await db.insert(communities).values({
            ...community,
            createdById: creatorId,
        });
        console.log(`+ Created community "${community.name}"`);
    }
  }

  console.log("✅ Communities seeding complete.");
  process.exit(0);
}

seedCommunities().catch((err) => {
    console.error("Failed to seed communities:", err);
    process.exit(1);
});

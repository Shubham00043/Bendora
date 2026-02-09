
import { db } from "@/db";
import { users, communities, communityMembers, learningGoals } from "@/db/schema";
import { eq, and } from "drizzle-orm"; // Make sure 'and' is imported

const newUsers = [
  {
    name: "Anjali Sharma",
    email: "anjalisharma06@example.com",
    username: "anjalisharma06",
    clerkId: "user_anjalisharma06",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=anjalisharma06",
    goals: ["Machine Learning", "Python"],
  },
  {
    name: "Riddhi Patel",
    email: "riddhi05@example.com",
    username: "riddhi05",
    clerkId: "user_riddhi05",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=riddhi05",
    goals: ["React Native", "TypeScript"],
  },
  {
    name: "Advika Singh",
    email: "advika19@example.com",
    username: "advika19",
    clerkId: "user_advika19",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=advika19",
    goals: ["UI/UX", "Figma"],
  },
  {
    name: "Dipesh Kumar",
    email: "dipesh05@example.com",
    username: "dipesh05",
    clerkId: "user_dipesh05",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=dipesh05",
    goals: ["Node.js", "Backend"],
  },
];

async function seedUsers() {
  console.log("Seeding users...");

  // Get the first community
  const community = await db.query.communities.findFirst();

  if (!community) {
      console.log("No community found. Aborting.");
      return;
  }

  console.log(`Using community: ${community.name} (${community.id})`);

  for (const userData of newUsers) {
    console.log(`Processing ${userData.username}...`);

    let user = await db.query.users.findFirst({
      where: eq(users.username, userData.username),
    });

    if (!user) {
        console.log(`Creating user ${userData.username}...`);
        // Just a placeholder ID for clerkId as we are seeding without auth
       const [newUser] = await db.insert(users).values({
            clerkId: userData.clerkId, 
            email: userData.email,
            name: userData.name,
            username: userData.username,
            imageUrl: userData.imageUrl,
            subscriptionTier: "free"
       }).returning();
       user = newUser;
    } else {
        console.log(`User ${userData.username} already exists.`);
    }

    // Check membership
    const existingMember = await db.query.communityMembers.findFirst({
        where: and(
            eq(communityMembers.userId, user!.id),
            eq(communityMembers.communityId, community.id)
        )
    });

    if (!existingMember) {
        console.log(`Adding ${userData.username} to community...`);
        await db.insert(communityMembers).values({
            userId: user!.id,
            communityId: community.id,
        });
    }

    // Add goals if none exist
    const existingGoals = await db.query.learningGoals.findMany({
        where: and(
             eq(learningGoals.userId, user!.id),
             eq(learningGoals.communityId, community.id)
        )
    });

    if (existingGoals.length === 0) {
        console.log(`Adding goals for ${userData.username}...`);
        for (const goalTitle of userData.goals) {
            await db.insert(learningGoals).values({
                userId: user!.id,
                communityId: community.id,
                title: goalTitle,
                description: `Complete ${goalTitle} course`,
                tags: [goalTitle.toLowerCase().replace(" ", "-")]
            });
        }
    }
  }

  console.log("Users added successfully!");
}

seedUsers()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  });

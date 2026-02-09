
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const updates = [
  {
    username: "anjalisharma06",
    imageUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Anjali&hair=long&top=longHair", // Force long hair
  },
  {
    username: "riddhi05",
    imageUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Riddhi&hair=long&top=longHair",
  },
  {
    username: "advika19",
    imageUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Advika&hair=long&top=longHair",
  },
  {
    username: "dipesh05",
    imageUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Dipesh&hair=short&facialHair=beard&top=shortHair", // Force short hair + beard
  },
];

async function updateAvatars() {
  console.log("Updating avatars...");

  for (const update of updates) {
    console.log(`Updating ${update.username}...`);
    
    await db.update(users)
        .set({ imageUrl: update.imageUrl })
        .where(eq(users.username, update.username));
        
    console.log(`Updated ${update.username}`);
  }

  console.log("Avatar update complete!");
  process.exit(0);
}

updateAvatars().catch((err) => {
  console.error("Update failed:", err);
  process.exit(1);
});

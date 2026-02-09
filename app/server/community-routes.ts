import { db } from "@/db";
import { communities, communityMembers } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { authMiddleware } from "./middleware/auth-middleware";
import { getMembersInCommunity } from "@/lib/db-helpers";

type Variables = {
  userId: string;
};

const communitiesApp = new Hono<{ Variables: Variables }>()
  .use("/*", authMiddleware)
  .get("/all", async (c) => {
    const allCommunities = await db.select().from(communities);
    return c.json(allCommunities);
  })
  .get("/", async (c) => {
    const user = c.get("user");

    const userCommunities = await db
      .select({
        id: communityMembers.id,
        userId: communityMembers.userId,
        communityId: communityMembers.communityId,
        joinedAt: communityMembers.joinedAt,
        community: communities,
      })
      .from(communityMembers)
      .innerJoin(communities, eq(communityMembers.communityId, communities.id))
      .where(eq(communityMembers.userId, user.id));

    return c.json(userCommunities);
  })
  .post("/:communityId/join", async (c) => {
    const user = c.get("user");
    const communityId = c.req.param("communityId");

    const [existing] = await db
      .select()
      .from(communityMembers)
      .where(
        and(
          eq(communityMembers.userId, user.id),
          eq(communityMembers.communityId, communityId)
        )
      );

    if (existing) {
      throw new HTTPException(400, {
        message: "User already joined community",
      });
    }

    await db.insert(communityMembers).values({
      userId: user.id,
      communityId: communityId,
    });
    return c.json({
      message: "Joined community successfully",
      communityId: communityId,
    });
  })
  .get("/:communityId/members", async (c) => {
    const user = c.get("user");
    const communityId = c.req.param("communityId");

    const members = await getMembersInCommunity(communityId, user.id);
    return c.json(members);
  });


export { communitiesApp };

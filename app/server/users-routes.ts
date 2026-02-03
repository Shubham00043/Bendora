import { auth } from "@clerk/nextjs/server";
import { authMiddleware } from "./middleware/auth-middleware";
import { Hono } from "hono";

type Variables = {
  userId: string;
};

export const userApp = new Hono<{ Variables: Variables }>()
  .use("/*", authMiddleware)
  .get("/", async (c) => {
    const user = c.get("user");
    const { has } = await auth();
    const isPro = has({ plan: "pro_plan" });
    return c.json({
      ...user,
      isPro,
    });
  })
  .get("/search", async (c) => {
    const user = c.get("user");
    const query = c.req.query("q");

    if (!query || query.length < 2) {
      return c.json([]);
    }

    const { db } = await import("@/db");
    const { users } = await import("@/db/schema");
    const { ilike, and, ne } = await import("drizzle-orm");

    const foundUsers = await db
      .select({
        id: users.id,
        name: users.name,
        imageUrl: users.imageUrl,
      })
      .from(users)
      .where(and(ne(users.id, user.id), ilike(users.name, `%${query}%`)))
      .limit(10);

    return c.json(foundUsers);
  });

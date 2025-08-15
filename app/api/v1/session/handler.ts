import { createFactory } from "hono/factory";
import { getCookie } from "hono/cookie";
import { db } from "@/db";
import { sessions, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import authMiddleWare from "@/middleware/auth";
const { createHandlers } = createFactory();

type ContextWithUser = {
    get(key: "user" | "session"): any;
    json: (body: any) => Response;
};

const getUserSession = createHandlers(authMiddleWare, async (c: ContextWithUser) => {
    const user = c.get("user");
    return c.json({
        data: user,
    });
})

const getAllUserSession = createHandlers(authMiddleWare, async (c: ContextWithUser) => {
    const session = c.get("session");
    const allSessions = await db.select()
        .from(sessions)
        .where(eq(sessions.userId, session.userId));
        
    return c.json({
        data: allSessions,
    });
})

export { getUserSession, getAllUserSession }

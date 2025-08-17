// src/middleware/auth.ts

import { createFactory } from "hono/factory";
import { getCookie } from "hono/cookie";
import { db } from "@/db";
import { sessions, users } from "@/db/schema";
import { eq } from "drizzle-orm";


const { createMiddleware } = createFactory<any>();

const authMiddleWare = createMiddleware(async (c, next) => {
    const cookie = getCookie(c, "hb.session");
    if (!cookie) {
        c.json({
            message: "user not authenticated",
        }, 401)
        return;
    }
    const activeSessions = await db.select()
        .from(sessions)
        .where(eq(sessions.sessionToken, cookie as string));

    const session = activeSessions[0];
    const userResult = await db.select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        profilePic: users.profilePic
    })
        .from(users)
        .where(eq(users.id, session.userId));

    if (userResult.length <= 0) {
        return c.json({
            message: "user not found"
        })
        return;
    }
    c.set("user", userResult[0]);
    c.set("session", session);
    await next();

})

export default authMiddleWare;
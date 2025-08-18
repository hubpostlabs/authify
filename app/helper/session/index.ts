import { db } from "@/db";
import { sessions } from "@/db/schema";
import { randomUUIDv7 } from "bun";
import { Context } from "hono";
import { getConnInfo } from "hono/bun";
import { setCookie } from "hono/cookie";


const SESSION_DURATION = 2 * 24 * 60 * 60 * 1000
const {HUBPOST_DOMAIN = "", NODE_ENV = ""} = process.env;
const createUserSession = async (c: Context, id: string) => {
    try {
        const userAgent = c.req.header('User-Agent') ?? "";
        const ipAddress = getConnInfo(c)?.remote?.address ?? "";
        const sessionId = randomUUIDv7();
        const now = new Date();
        const expiry = new Date(now.getTime() + SESSION_DURATION)
       
        const serv = await db.insert(sessions).values({
            sessionToken: sessionId,
            expiresAt: expiry,
            ipAddress,
            userAgent,
            userId: id,
        })

        console.log("service dowm", serv)

        return setCookie(c, "hb.session", sessionId, {
            path: "/",
            domain: `.${HUBPOST_DOMAIN}`,
            secure: true,
            httpOnly: true,
            expires: new Date(expiry),
            sameSite: "None"
        })
    } catch (error) {
        console.log("inside cookie", error)
        return c.json({
            success: false,
            error: error 
        })
    }
}

export { createUserSession }
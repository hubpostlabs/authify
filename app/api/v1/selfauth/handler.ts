import { db } from "@/db";
import { sessions, users } from "@/db/schema";
import { randomUUIDv7 } from "bun";
import { eq } from "drizzle-orm";
import { createFactory } from "hono/factory";
import { setCookie } from "hono/cookie";
import { getConnInfo } from 'hono/bun'
import { Context } from "hono";

const { createHandlers } = createFactory();
const SESSION_DURATION = 2 * 24 * 60 * 60 * 1000
const {HUBPOST_DOMAIN = "", NODE_ENV = ""} = process.env;

const createUserSession = async (c: Context, id: string) => {
    try {
        const userAgent = c.req.header('User-Agent')
        const ipAddress = getConnInfo(c);
        const sessionId = randomUUIDv7();
        const now = new Date();
        const expiry = new Date(now.getTime() + SESSION_DURATION)

        await db.insert(sessions).values({
            sessionToken: sessionId,
            expiresAt: expiry,
            ipAddress: ipAddress.remote.address ?? "",
            userAgent,
            userId: id,
        })
        return setCookie(c, "hb.session", sessionId, {
            path: "/",
            domain: NODE_ENV === "development" ? "" : `.${HUBPOST_DOMAIN}`,
            secure: true,
            httpOnly: true,
            expires: new Date(expiry),
        })


    } catch (error) {
        
    }
}

const findUserByEmail = async (email: string) => {
    const user = await db.select({ email: users.email, password: users.password, id: users.id }).from(users).where(eq(users.email, email)).limit(1);
    return user[0];
}

const register = createHandlers(async (c) => {
    try {
        const { firstName, lastName, email, password } = await c.req.json();

        if ((await findUserByEmail(email)).email) {
            return c.json({
                success: false,
                message: 'User with this email already exists',
                error: 'DUPLICATE_EMAIL'
            }, 409);
        }

        const hashedPassword = await Bun.password.hash(password);

        await db.insert(users).values({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        return c.json({ message: "User registered successfully" }, 201);
    } catch (error) {
        return c.json({
            success: false,
            message: "Registration failed",
            error: error instanceof Error ? error.message : "Unknown error"
        }, 500);
    }
});

const login = createHandlers(async (c) => {
    try {
        const { email, password } = await c.req.json();
        const user = await findUserByEmail(email);
        if (!user) {
            return c.json({
                success: false,
                message: 'Invalid email or password',
            }, 401);
        }

        const isValidPassword = await Bun.password.verify(password, user.password);
        if (!isValidPassword) {
            return c.json({
                success: false,
                message: 'Invalid email or password',
            }, 401);
        }
        const user_id = user.id;
        const startSession = await createUserSession(c, user_id)
        return c.json({
            message: "Login successful",
        });
    } catch (error) {
        return c.json({
            success: false,
            message: "Login failed",
            error: error instanceof Error ? error.message : "Unknown error"
        }, 500);
    }
});

export { register, login };
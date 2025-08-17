import { db } from "@/db";
import { users } from "@/db/schema";
import { createUserSession } from "@/helper/session";

import { eq } from "drizzle-orm";
import { createFactory } from "hono/factory";


const { createHandlers } = createFactory();




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

        const isValidPassword = await Bun.password.verify(password, user.password as string);
        if (!isValidPassword) {
            return c.json({
                success: false,
                message: 'Invalid email or password',
            }, 401);
        }
        const user_id = user.id;
        await createUserSession(c, user_id)
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
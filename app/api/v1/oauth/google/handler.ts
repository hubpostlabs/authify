// google/handler.ts

import { getOAuth } from "@/config/oauth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createUserSession } from "@/helper/session";
import { createFactory } from "hono/factory";

const { createHandlers } = createFactory();

const handleGoogle = createHandlers(async (c) => {
    try {
        const { req } = c;
        const ui_redirect = req.query("returnTo");
        const oauth = await getOAuth("google", `${process.env.AUTHIFY_MAIN_URL}/api/v1/account/oauth/google/callback`)
        if (req.path.includes("callback")) {
            const code = req.query("code") ?? "";
            const state = req.query("state");
            const tokens = await oauth?.getToken(code);
            const ticket = await oauth?.verifyIdToken({
                idToken: tokens?.tokens.id_token ?? "",
            });
            const userP = ticket?.getPayload();
            const { email = "", family_name: lastName = "", given_name: firstName = "", picture: profilePic = "" } = userP as any;
            if (email && firstName) {
                const user = await db.insert(users).values({
                    firstName,
                    lastName,
                    email,
                    profilePic
                }).onConflictDoUpdate({
                    target: users.email,
                    set: {
                        firstName,
                        lastName,
                        profilePic
                    },
                }).returning({
                    id: users.id,
                });


                if (state) {
                    const url = JSON.parse(state)?.url;
                    console.log(user);
                    await createUserSession(c, user[0].id);
                    return c.redirect(url);
                }
            }

        }
        const state = JSON.stringify({
            url: ui_redirect
        })
        const googleAuthUrl = oauth?.generateAuthUrl({ scope: ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"], state, });
        if (googleAuthUrl) {
            return c.redirect(googleAuthUrl)
        }

    } catch (error) {
        return c.json({ message: "An error occurred", error }, 500);
    }
});

export default handleGoogle;
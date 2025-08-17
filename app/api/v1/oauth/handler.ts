// handleUserRequest.ts
import { createFactory } from "hono/factory";
import handleGoogle from "./google/handler";

const { createHandlers } = createFactory();

const handleUserRequest = createHandlers(async (c) => {
    try {
        const { provider = "" } = c.req.param() as any;
        console.log(provider);

        if (provider === "google") {
            const googleResponse = await (handleGoogle[0] as any)(c) ;
           return googleResponse;
        }
        
        return c.json({ message: `Provider '${provider}' not supported.` }, 400);
        
    } catch (error) {
        console.error(error);
        return c.json({ message: 'An internal server error occurred' }, 500);
    }
});

export default handleUserRequest;
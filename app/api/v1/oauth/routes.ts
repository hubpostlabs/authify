import { Hono } from "hono";
import handleUserRequest from "./handler";

const oauthRoutes = new Hono();

oauthRoutes.get("/oauth/:provider/*", ...handleUserRequest)

export default oauthRoutes;
import { Hono } from "hono";
import { getAllUserSession, getUserSession } from "./handler";

const sessionRoutes = new Hono();

sessionRoutes.get("/session", ...getUserSession);
sessionRoutes.get("/session/active", ...getAllUserSession);
export default sessionRoutes;
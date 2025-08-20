import { Hono } from "hono";
import { login, register } from "./handler";

const authRoutes = new Hono();

authRoutes.post("/login", ...login),
authRoutes.post("/register", ...register)

export default authRoutes 
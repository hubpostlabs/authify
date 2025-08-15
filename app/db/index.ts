import { sessions, users } from "@/db/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.AUTHIFY_POSTGRES_URL!,
});
const db = drizzle({ client: pool, schema: {users, sessions} });

export {db}

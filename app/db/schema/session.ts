import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

export const sessions = pgTable("sessions", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", {
        withTimezone: true,
    }).notNull(),
    sessionToken: text("session_token").notNull(),


    ipAddress: text("ip_address").notNull(),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", {
        withTimezone: true,
    })
        .defaultNow()
        .notNull(),

    lastActiveAt: timestamp("last_active_at", {
        withTimezone: true,
    })
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
});
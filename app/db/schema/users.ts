import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name"),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    profilePic: text("profile_pic"),
    createdAt: timestamp("created_at", {withTimezone: true}).defaultNow(),
    updatedAt:  timestamp("updated_at", {withTimezone: true}).$onUpdate(() => new Date()),
});
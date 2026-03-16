import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const userTypeEnum = pgEnum("user_type", ["customer", "ops"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  type: userTypeEnum("type").notNull().default("customer"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});

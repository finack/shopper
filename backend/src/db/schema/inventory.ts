import { integer, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const inventory = pgTable("inventory", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  quantityAvailable: integer("quantity_available").notNull().default(0),
  unit: text("unit"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});

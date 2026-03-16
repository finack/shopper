import { integer, numeric, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { inventory } from "./inventory";
import { orders } from "./orders";

export const lineItems = pgTable("line_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id),
  inventoryId: uuid("inventory_id")
    .notNull()
    .references(() => inventory.id),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

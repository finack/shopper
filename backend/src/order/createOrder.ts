import { db } from "../db";
import { orders } from "../db/schema";

export async function createOrder(userId: string) {
  const [order] = await db
    .insert(orders)
    .values({ userId, status: "pending" })
    .returning();
  return order;
}

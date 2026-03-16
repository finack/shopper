import { eq } from "drizzle-orm";
import { db } from "../db";
import { inventory, lineItems, orders } from "../db/schema";
import { OrderError } from "./errors";

export async function addItemToOrder({
  orderId,
  inventoryId,
  quantity,
}: {
  orderId: string;
  inventoryId: string;
  quantity: number;
}) {
  const item = await db.query.inventory.findFirst({
    where: eq(inventory.id, inventoryId),
  });

  if (!item) {
    throw new OrderError(`Inventory item ${inventoryId} not found`, "INVENTORY_NOT_FOUND");
  }

  if (item.quantityAvailable < quantity) {
    throw new OrderError(
      `Only ${item.quantityAvailable} units available, requested ${quantity}`,
      "INSUFFICIENT_STOCK"
    );
  }

  await db.insert(lineItems).values({ orderId, inventoryId, quantity, unitPrice: item.price });

  const items = await db.query.lineItems.findMany({
    where: eq(lineItems.orderId, orderId),
  });

  const total = items
    .reduce((sum, li) => sum + parseFloat(li.unitPrice) * li.quantity, 0)
    .toFixed(2);

  await db
    .update(orders)
    .set({ totalAmount: total, updatedAt: new Date() })
    .where(eq(orders.id, orderId));

  const updatedOrder = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
  });

  return { order: updatedOrder!, lineItems: items };
}

import { beforeEach, describe, expect, it, vi } from "vitest";
import { appRouter } from "./router";

vi.mock("../order", async (importActual) => {
  const actual = await importActual<typeof import("../order")>();
  return {
    ...actual,
    createOrder: vi.fn(),
    addItemToOrder: vi.fn(),
  };
});

import { OrderError } from "../order";
import * as order from "../order";

const caller = appRouter.createCaller({});

const mockOrder = {
  id: "00000000-0000-0000-0000-000000000001",
  userId: "00000000-0000-0000-0000-000000000002",
  status: "pending" as const,
  totalAmount: null,
  deliveryAddress: null,
  createdAt: new Date(),
  updatedAt: null,
};

const mockOrderWithItems = {
  order: { ...mockOrder, totalAmount: "9.99" },
  lineItems: [
    {
      id: "00000000-0000-0000-0000-000000000003",
      orderId: mockOrder.id,
      inventoryId: "00000000-0000-0000-0000-000000000004",
      quantity: 1,
      unitPrice: "9.99",
      createdAt: new Date(),
    },
  ],
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe("orders.createOrder", () => {
  it("returns a pending order", async () => {
    vi.mocked(order.createOrder).mockResolvedValue(mockOrder);

    const result = await caller.orders.createOrder({ userId: mockOrder.userId });

    expect(result.status).toBe("pending");
    expect(result.id).toBe(mockOrder.id);
    expect(order.createOrder).toHaveBeenCalledWith(mockOrder.userId);
  });

  it("throws INTERNAL_SERVER_ERROR when order layer fails", async () => {
    vi.mocked(order.createOrder).mockRejectedValue(new Error("db error"));

    await expect(
      caller.orders.createOrder({ userId: mockOrder.userId })
    ).rejects.toMatchObject({ code: "INTERNAL_SERVER_ERROR" });
  });
});

describe("orders.addItem", () => {
  const input = {
    orderId: mockOrder.id,
    inventoryId: "00000000-0000-0000-0000-000000000004",
    quantity: 1,
  };

  it("returns updated order with line items", async () => {
    vi.mocked(order.addItemToOrder).mockResolvedValue(mockOrderWithItems);

    const result = await caller.orders.addItem(input);

    expect(result.lineItems).toHaveLength(1);
    expect(result.order.totalAmount).toBe("9.99");
    expect(order.addItemToOrder).toHaveBeenCalledWith(input);
  });

  it("throws BAD_REQUEST on insufficient stock", async () => {
    vi.mocked(order.addItemToOrder).mockRejectedValue(
      new OrderError("Only 0 units available, requested 1", "INSUFFICIENT_STOCK")
    );

    await expect(caller.orders.addItem(input)).rejects.toMatchObject({
      code: "BAD_REQUEST",
    });
  });

  it("throws BAD_REQUEST when inventory not found", async () => {
    vi.mocked(order.addItemToOrder).mockRejectedValue(
      new OrderError(`Inventory item ${input.inventoryId} not found`, "INVENTORY_NOT_FOUND")
    );

    await expect(caller.orders.addItem(input)).rejects.toMatchObject({
      code: "BAD_REQUEST",
    });
  });
});

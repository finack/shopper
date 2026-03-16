export class OrderError extends Error {
  constructor(
    message: string,
    public readonly code: "INVENTORY_NOT_FOUND" | "INSUFFICIENT_STOCK"
  ) {
    super(message);
    this.name = "OrderError";
  }
}

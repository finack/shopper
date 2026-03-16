import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { OrderError, addItemToOrder, createOrder } from "../order";
import { publicProcedure, router } from "./index";

export const ordersRouter = router({
  createOrder: publicProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      try {
        return await createOrder(input.userId);
      } catch (err) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", cause: err });
      }
    }),

  addItem: publicProcedure
    .input(
      z.object({
        orderId: z.string().uuid(),
        inventoryId: z.string().uuid(),
        quantity: z.number().int().positive(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        return await addItemToOrder(input);
      } catch (err) {
        if (err instanceof OrderError) {
          throw new TRPCError({ code: "BAD_REQUEST", message: err.message, cause: err });
        }
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", cause: err });
      }
    }),
});

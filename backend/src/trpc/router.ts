import { publicProcedure, router } from "./index";
import { ordersRouter } from "./orders";

const usersRouter = router({
  list: publicProcedure.query(() => {
    return [];
  }),
});

const inventoryRouter = router({
  list: publicProcedure.query(() => {
    return [];
  }),
});

export const appRouter = router({
  users: usersRouter,
  inventory: inventoryRouter,
  orders: ordersRouter,
});

export type AppRouter = typeof appRouter;

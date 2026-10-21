import { setupServer } from "msw/node";

/** Handlers are added per test with `server.use(...)`. None by default. */
export const server = setupServer();

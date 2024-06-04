import fastify from "fastify";
import { productsRoutes } from "./routes/products.js";

const app = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
    },
  },
});

app.register(productsRoutes);

app.listen({
  host: "0.0.0.0",
  port: 4000,
});

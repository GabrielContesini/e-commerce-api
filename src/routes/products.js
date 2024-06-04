import { isAuth } from "../middlewares/is-auth.js";

const products = [];

export async function productsRoutes(app) {
  app.get("/products", { onRequest: [isAuth] }, (request, reply) => {
    return reply.status(200).send(products);
  });

  app.post("/products", { onRequest: [isAuth] }, (request, reply) => {
    const { username, productName, description, amount } = request.body;

    const product = {
      id: products.length + 1,
      owner: username,
      productName,
      description,
      amount,
      date: new Date().toISOString(),
    };

    products.push(product);

    return reply.status(201).send(product);
  });

  app.patch(
    "/products/:id/amount",
    { onRequest: [isAuth] },
    (request, reply) => {
      const { id } = request.params;
      const { amount } = request.body;

      if (amount === undefined) {
        return reply.status(400).send({ message: "Amount is required." });
      }

      const productIndex = products.findIndex((product) => product.id === +id);

      if (productIndex === -1) {
        return reply.status(404).send({ message: "Product Not Found." });
      }

      products[productIndex].amount = amount;

      return reply.status(200).send(products[productIndex]);
    }
  );

  app.delete("/products/:id", { onRequest: [isAuth] }, (request, reply) => {

    const { id } = request.params;

    const productIndex = products.findIndex((product) => product.id === +id);

    if (productIndex === -1) {
      return reply.status(404).send({ mesaage: "Product Not Found. " });
    }

    const { username } = request.body;

    if (username !== products[productIndex].owner) {  
      return reply
        .status(400)
        .send({ mesaage: "User is not the product owner" });
    }

    products.splice(productIndex, 1);

    return reply.status(204).send();
  });
}

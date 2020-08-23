import App from "./app";

const port = process.env.PORT ? parseInt(process.env.PORT) : 3333;

new App(port)
  .start()
  .then(() => console.log(`Local GraphQL Playground running on port ${port}`));

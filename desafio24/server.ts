import { Application } from "./deps/deps.ts";

import { router } from "./routes/routes.ts";
import { logger } from "./loggers.ts";

const PORT = 8080;
const app = new Application();

app.use(logger);
app.use(router.routes());

console.log(`Iniciando en el puerto: ${PORT}`);

await app.listen({ port: Number(PORT) });
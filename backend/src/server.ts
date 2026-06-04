import express from "express";
import cors from "cors";
import { handler } from "./handler";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/procesar", async (req, res) => {
  const event = { body: JSON.stringify(req.body) };
  const result = await handler(event);
  res.status(result.statusCode).json(JSON.parse(result.body));
});

const PORT = Number(process.env.PORT) || 3001;

const server = app.listen(PORT, "127.0.0.1", () => {
  console.log(`🚀 API Gateway local corriendo en http://127.0.0.1:${PORT}`);
});

server.on("error", (err: NodeJS.ErrnoException) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `Puerto ${PORT} en uso (¿Grafana/Docker?). Libera el puerto o ejecuta: set PORT=3002 && npx ts-node src/server.ts`
    );
  } else {
    console.error(err);
  }
  process.exit(1);
});

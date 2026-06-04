/**
 * API Gateway local — Express en 127.0.0.1 para desarrollo.
 *
 * Expone POST /procesar delegando en el mismo handler que Lambda (handler.ts).
 * Puerto por defecto: 3001 (variable PORT).
 */
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
  console.log(`API Gateway local: http://127.0.0.1:${PORT}/procesar`);
});

server.on("error", (err: NodeJS.ErrnoException) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `Puerto ${PORT} en uso. Libera el puerto o ejecuta: $env:PORT=3002; npm run dev`
    );
  } else {
    console.error(err);
  }
  process.exit(1);
});

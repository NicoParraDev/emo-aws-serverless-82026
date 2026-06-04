/**
 * Prueba el handler Lambda sin HTTP (util para depurar logica y S3 local).
 *
 * Uso: npm run test:handler
 */
import { handler } from "./handler";

const event = {
  body: JSON.stringify({ texto: "Factura proveedor ABC demo 82026" }),
};

handler(event).then((res) => {
  console.log("Status:", res.statusCode);
  console.log("Body:", res.body);
});

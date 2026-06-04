import { handler } from "./handler";

const event = {
  body: JSON.stringify({ texto: "Factura proveedor ABC demo 82026" }),
};

handler(event).then((res) => {
  console.log("Respuesta:", JSON.stringify(res, null, 2));
});

import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Nimbus demo title", () => {
  render(<App />);
  expect(screen.getByText(/Nimbus/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Procesar/i })).toBeInTheDocument();
});

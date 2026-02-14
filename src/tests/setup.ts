import "@testing-library/jest-dom";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Optional: run cleanup after each test suite
afterEach(() => {
  console.log("afterEach test Global");
  cleanup();
});

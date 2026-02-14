import { render, screen } from "./tests/test-utils";
import { mockAuthState } from "./tests/mocks";
import App from "./App"; // Import your component
import { describe, it, expect, vi } from "vitest";

// Mock the entire module
vi.mock("@aws-amplify/ui-react", async () => {
  const actual = await vi.importActual("@aws-amplify/ui-react");
  return {
    ...actual,
    useAuthenticator: vi.fn(),
  };
});

describe("App", () => {
  it("renders the main text", () => {
    // Force the hook to return a "signed in" state
    mockAuthState("authenticated");

    render(<App />);
    // Use a custom matcher from jest-dom

    screen.debug(undefined, Infinity);
    expect(screen.getByText(/This is an App/i)).toBeInTheDocument();
  });

  // it("should show login button when signed out", () => {
  //   // vi.mocked(AmplifyUI.useAuthenticator).mockReturnValue({
  //   //   user: null,
  //   //   route: "signIn",
  //   //   signOut: vi.fn(),
  //   // } as any);

  //   vi.mocked(AmplifyUI.useAuthenticator).mockReturnValue({
  //     user: null,
  //     route: "signIn",
  //     authStatus: "unauthenticated", // Add this
  //     signOut: vi.fn(),
  //   } as any);
  //   screen.debug(undefined, Infinity);
  //   render(<App />);
  //   expect(screen.getByRole("button", { name: /nope/i })).toBeInTheDocument();
  // });
});

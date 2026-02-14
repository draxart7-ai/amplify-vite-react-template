import { vi, describe, it, expect } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import App from "./App";
import { mockAuthState } from "./tests/mocks";

// ALAN: these test maybe overkill for unit test and should make E2E tests

// 1. Move ALL mock definitions into the hoisted block
const { mocks } = vi.hoisted(() => {
  return {
    mocks: {
      create: vi.fn(),
      delete: vi.fn(),
      observeQuery: vi.fn(() => ({
        subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })),
      })),
    },
  };
});

// 2. Use the hoisted 'mocks' object inside the factory
vi.mock("aws-amplify/data", () => ({
  generateClient: vi.fn(() => ({
    models: {
      Todo: {
        observeQuery: mocks.observeQuery,
        create: mocks.create,
        delete: mocks.delete,
      },
    },
  })),
}));

// Mock the UI library separately
vi.mock("@aws-amplify/ui-react", () => ({
  useAuthenticator: vi.fn(() => ({
    user: { signInDetails: { loginId: "test-user" } },
    signOut: vi.fn(),
  })),
}));

describe("App", () => {
  it("should display logged in users name when logged in", () => {
    screen.debug(undefined, Infinity);
    // Force the hook to return a "signed in" state
    mockAuthState("authenticated");

    render(<App />);

    screen.debug(undefined, Infinity);
    expect(screen.getByText(/test-user/i)).toBeInTheDocument();
  });

  it("should not display logged in users name not logged in", () => {
    screen.debug(undefined, Infinity);
    // Force the hook to return a "signed in" state
    mockAuthState("unauthenticated");

    render(<App />);

    expect(screen.queryByText(/test-user/i)).not.toBeInTheDocument();
  });

  it("should add a todo and update the screen", async () => {
    let triggerNext: any;
    mockAuthState("authenticated");
    // Setup the subscription capture
    mocks.observeQuery.mockReturnValue({
      subscribe: vi.fn(({ next }) => {
        triggerNext = next;
        next({ items: [] }); // Start empty
        return { unsubscribe: vi.fn() };
      }),
    } as any);

    const enteredValue = "New Todo";

    const promptMock = vi.spyOn(window, "prompt").mockReturnValue(enteredValue);
    render(<App />);

    const newButton = screen.getByText("+ new");
    // Click add
    fireEvent.click(newButton);

    // Simulate the background sync from AWS
    act(() => {
      triggerNext({ items: [{ id: "1", content: enteredValue }] });
    });

    expect(await screen.findByText(enteredValue)).toBeDefined();
    promptMock.mockRestore();
  });

  it("should call client.models.Todo.delete and remove the item from UI", async () => {
    let triggerSubscriptionNext: any;

    // 1. Setup mock to start with one existing Todo
    mocks.observeQuery.mockReturnValue({
      subscribe: vi.fn(({ next }) => {
        triggerSubscriptionNext = next;
        next({ items: [{ id: "todo-123", content: "Delete Me" }] });
        return { unsubscribe: vi.fn() };
      }),
    } as any);

    render(<App />);

    // 2. Verify the todo is initially there
    const todoItem = await screen.findByText("Delete Me");
    expect(todoItem).toBeDefined();

    // 3. Click the todo (which triggers deleteTodo)
    fireEvent.click(todoItem);

    // 4. Assert the API was called with the correct ID
    expect(mocks.delete).toHaveBeenCalledWith({ id: "todo-123" });

    // 5. Manually trigger subscription update with an EMPTY list
    act(() => {
      triggerSubscriptionNext({ items: [] });
    });

    // 6. Assert the item is GONE from the screen
    // Use queryByText here so it returns null instead of throwing an error
    expect(screen.queryByText("Delete Me")).not.toBeInTheDocument();
  });
});

import * as AmplifyUI from "@aws-amplify/ui-react";
import { vi } from "vitest";

export const mockAuthState = (state: "authenticated" | "unauthenticated") => {
  const isAuth = state === "authenticated";
  return vi.mocked(AmplifyUI.useAuthenticator).mockReturnValue({
    authStatus: state,
    route: isAuth ? "authenticated" : "signIn",
    user: isAuth
      ? {
          username: "test-user",
          email: "test-user-email@test.com",
          signInDetails: { loginId: "test-user-loginId" },
        }
      : null,
    signOut: vi.fn(),
  } as any);
};

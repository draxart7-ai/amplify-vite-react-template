import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { Authenticator } from "@aws-amplify/ui-react";

// Define a wrapper component that includes the Authenticator Provider
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <Authenticator.Provider>
      {/* Add other providers here, like ThemeProvider or Redux, if needed */}
      {children}
    </Authenticator.Provider>
  );
};

// Create the custom render function
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything from RTL
export * from "@testing-library/react";

// Override the standard render with our custom one
// export { customRender as render };

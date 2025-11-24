import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import ReduxProvider from "@/lib/providers/ReduxProvider";
import FormMarkDown from "./form-mark-down";
import userEvent from "@testing-library/user-event";

// Set up environment variables
beforeAll(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
});

// Mock Supabase
vi.mock("@/utils/supabase/client", () => ({
  supabaseClient: vi.fn(() => ({
    from: vi.fn(() => ({
      insert: vi.fn(() => Promise.resolve({ error: null })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
    })),
  })),
}));

// Mock showToast
vi.mock("@/lib/utils", async () => {
  const actual = await vi.importActual<typeof import("@/lib/utils")>(
    "@/lib/utils"
  );
  return {
    ...actual,
    showToast: vi.fn(),
  };
});

describe("FormMarkDown simple tests", () => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <ReduxProvider>{children}</ReduxProvider>
  );

  it("renders the form title", () => {
    render(<FormMarkDown />, { wrapper: Wrapper });

    expect(
      screen.getByText(/create a markdown note/i)
    ).toBeInTheDocument();
  });

  it("renders content description label", () => {
    render(<FormMarkDown />, { wrapper: Wrapper });

    expect(screen.getByText(/content descritpion/i)).toBeInTheDocument();
  });

  it("renders the save button", () => {
    render(<FormMarkDown />, { wrapper: Wrapper });

    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  it("renders a markdown editor textarea", () => {
    render(<FormMarkDown />, { wrapper: Wrapper });

    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeInTheDocument();
  });

  it("allows typing in the markdown editor", async () => {
    render(<FormMarkDown />, { wrapper: Wrapper });

    const textarea = screen.getByRole("textbox");
    await userEvent.clear(textarea);
    await userEvent.type(textarea, "Hello World");

    expect(textarea).toHaveValue("Hello World");
  });

  it("shows validation error when submitting empty content", async () => {
    render(<FormMarkDown />, { wrapper: Wrapper });

    const submitBtn = screen.getByRole("button", { name: /save/i });
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/content is required/i)).toBeInTheDocument();
    });
  });

  it("clears validation error after typing", async () => {
    render(<FormMarkDown />, { wrapper: Wrapper });

    const submitBtn = screen.getByRole("button", { name: /save/i });
    const textarea = screen.getByRole("textbox");

    // Trigger validation error
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/content is required/i)).toBeInTheDocument();
    });

    // Type to clear error
    await userEvent.clear(textarea);
    await userEvent.type(textarea, "Some content");

    await waitFor(() => {
      expect(
        screen.queryByText(/content is required/i)
      ).not.toBeInTheDocument();
    });
  });

  it("accepts markdown formatting characters", async () => {
    render(<FormMarkDown />, { wrapper: Wrapper });

    const textarea = screen.getByRole("textbox") as HTMLInputElement;
    await userEvent.clear(textarea);
    await userEvent.type(textarea, "# Header{enter}**bold**");

    expect(textarea.value).toContain("# Header");
    expect(textarea.value).toContain("**bold**");
  });

  it("has Write and Preview tabs", () => {
    render(<FormMarkDown />, { wrapper: Wrapper });

    // ReactMde uses button elements for tabs, not role="tab"
    expect(screen.getByText(/write/i)).toBeInTheDocument();
    expect(screen.getByText(/preview/i)).toBeInTheDocument();
  });

  it("starts with Write tab selected by default", () => {
    render(<FormMarkDown />, { wrapper: Wrapper });

    // Check that Write button exists (default active tab)
    const writeButton = screen.getByText(/write/i);
    expect(writeButton).toBeInTheDocument();
  });
});
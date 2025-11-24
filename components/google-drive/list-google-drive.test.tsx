import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
import ListGoogleDrive from "./list-google-drive";
import ReduxProvider from "@/lib/providers/ReduxProvider";

// Set up environment variables before tests
beforeAll(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
});

// Mock Supabase client - just return empty mock
vi.mock("@/utils/supabase/client", () => ({
  supabaseClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: [], error: null })),
        })),
      })),
    })),
    channel: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnThis(),
      unsubscribe: vi.fn(),
    })),
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
    },
  })),
}));

describe("ListGoogleDrive", () => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <ReduxProvider>{children}</ReduxProvider>
  );

  it("renders the page title", () => {
    render(<ListGoogleDrive />, { wrapper: Wrapper });
    
    expect(screen.getByText(/google drive uploads/i)).toBeInTheDocument();
  });

  // it("renders search input field", () => {
  //   render(<ListGoogleDrive />, { wrapper: Wrapper });
    
  //   const searchInput = screen.getByPlaceholderText(/search by photo name/i);
  //   expect(searchInput).toBeInTheDocument();
  // });

  // it("renders photo name sort button", () => {
  //   render(<ListGoogleDrive />, { wrapper: Wrapper });
    
  //   expect(screen.getByText(/photo name/i)).toBeInTheDocument();
  // });

  it("renders upload date sort button", () => {
    render(<ListGoogleDrive />, { wrapper: Wrapper });
    
    expect(screen.getByText(/upload date/i)).toBeInTheDocument();
  });

  // it("search input starts empty", () => {
  //   render(<ListGoogleDrive />, { wrapper: Wrapper });
    
  //   const searchInput = screen.getByPlaceholderText(/search by photo name/i);
  //   expect(searchInput).toHaveValue("");
  // });
});
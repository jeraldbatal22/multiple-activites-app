import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormTodo from "./form-todo";
import ReduxProvider from "@/lib/providers/ReduxProvider";

describe("FormTodo", () => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    // You may need to import your store from the relevant location
    <ReduxProvider>{children}</ReduxProvider>
  );

  it("renders all required form fields", () => {
    render(<FormTodo />, { wrapper: Wrapper });
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /save/i })
    ).toBeInTheDocument();
  });

  it("allows typing into title and description fields", async () => {
    render(<FormTodo />, { wrapper: Wrapper });
    const titleInput = screen.getByLabelText(/title/i);
    const descInput = screen.getByLabelText(/description/i);
    await userEvent.type(titleInput, "My Task");
    await userEvent.type(descInput, "Some description");
    expect(titleInput).toHaveValue("My Task");
    expect(descInput).toHaveValue("Some description");
  });

  it("shows validation error if title is left blank", async () => {
    render(<FormTodo />, { wrapper: Wrapper });
    const submitButton = screen.getByRole("button", { name: /save/i });
    await userEvent.click(submitButton);

    // Wait for any error to appear (update selector if error message is different)
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
  });

  it("allows form submission with valid inputs", async () => {
    render(<FormTodo />, { wrapper: Wrapper });
    const titleInput = screen.getByLabelText(/title/i);
    const descInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole("button", { name: /save/i });

    await userEvent.type(titleInput, "Task 123");
    await userEvent.type(descInput, "Finish vitest migration");
    await userEvent.click(submitButton);

    // Add your specific success assertion here;
    // For example, if a success message is shown:
    // await waitFor(() => {
    //   expect(screen.getByText(/todo added/i)).toBeInTheDocument();
    // });
  });

  it("clears validation error when user provides valid title", async () => {
    render(<FormTodo />, { wrapper: Wrapper });
    const titleInput = screen.getByLabelText(/title/i);
    const submitButton = screen.getByRole("button", { name: /save/i });

    // Submit empty to trigger error
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });

    // Enter a valid title
    await userEvent.type(titleInput, "something");

    // Wait for the error to disappear
    await waitFor(() => {
      expect(screen.queryByText(/title is required/i)).not.toBeInTheDocument();
    });
  });
});

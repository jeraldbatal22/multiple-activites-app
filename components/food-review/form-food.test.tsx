import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReduxProvider from "@/lib/providers/ReduxProvider";
import FormFood from "./form-food";

describe("FormFood", () => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    // You may need to import your store from the relevant location
    <ReduxProvider>{children}</ReduxProvider>
  );

  it("renders all required form fields", () => {
    render(<FormFood />, { wrapper: Wrapper });
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /upload/i })).toBeInTheDocument();
  });

  it("allows typing into title and description fields", async () => {
    render(<FormFood />, { wrapper: Wrapper });
    const titleInput = screen.getByLabelText(/title/i);
    const descInput = screen.getByLabelText(/description/i);
    await userEvent.type(titleInput, "My Task");
    await userEvent.type(descInput, "Some description");
    expect(titleInput).toHaveValue("My Task");
    expect(descInput).toHaveValue("Some description");
  });

  it("shows validation error if title is left blank", async () => {
    render(<FormFood />, { wrapper: Wrapper });
    const submitButton = screen.getByRole("button", { name: /upload/i });
    await userEvent.click(submitButton);

    // Wait for any error to appear (update selector if error message is different)
    await waitFor(() => {
      expect(
        screen.getByText(/Food title is required/i)
      ).toBeInTheDocument();
    });
  });

  it("allows typing in name and uploading file", async () => {
    render(<FormFood />, { wrapper: Wrapper });
    const nameInput = screen.getByLabelText(/title/i);
    const fileInput = screen.getByLabelText(/photo/i) as HTMLInputElement;
    await userEvent.type(nameInput, "A test photo");
    const file = new File(["sample"], "pic.jpg", { type: "image/jpeg" });
    await userEvent.upload(fileInput, file);
    expect(nameInput).toHaveValue("A test photo");
    // There's no value assertion for file, but we can check input.files[0]:
    expect(fileInput.files?.[0]).toBe(file);
    expect(fileInput.files).toHaveLength(1);
  });

  it("shows preview image after file upload", async () => {
    render(<FormFood />, { wrapper: Wrapper });
    const fileInput = screen.getByLabelText(/photo/i) as HTMLInputElement;
    const file = new File(["img"], "z.jpg", { type: "image/jpeg" });
    await userEvent.upload(fileInput, file);
    expect(screen.getByAltText(/preview/i)).toBeInTheDocument();
  });
});

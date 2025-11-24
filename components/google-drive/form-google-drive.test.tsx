import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormGoogleDrive from "./form-google-drive";
import ReduxProvider from "@/lib/providers/ReduxProvider";

describe("FormGoogleDrive", () => {

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    // You may need to import your store from the relevant location
    <ReduxProvider>{children}</ReduxProvider>
  );
  it("renders upload form fields", () => {
    // Mock a Redux Provider wrapper if needed

    render(<FormGoogleDrive />, { wrapper: Wrapper });
    expect(
      screen.getByText(/upload photo to google drive/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/photo file/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /upload/i })).toBeInTheDocument();
  });

  it("allows typing in name and uploading file", async () => {
    render(<FormGoogleDrive />, { wrapper: Wrapper });
    const nameInput = screen.getByLabelText(/title/i);
    const fileInput = screen.getByLabelText(/photo file/i) as HTMLInputElement;
    await userEvent.type(nameInput, "A test photo");
    const file = new File(["sample"], "pic.jpg", { type: "image/jpeg" });
    await userEvent.upload(fileInput, file);
    expect(nameInput).toHaveValue("A test photo");
    // There's no value assertion for file, but we can check input.files[0]:
    expect(fileInput.files?.[0]).toBe(file);
    expect(fileInput.files).toHaveLength(1);
  });

  it("shows preview image after file upload", async () => {
    render(<FormGoogleDrive />, { wrapper: Wrapper });
    const fileInput = screen.getByLabelText(/photo file/i) as HTMLInputElement;
    const file = new File(["img"], "z.jpg", { type: "image/jpeg" });
    await userEvent.upload(fileInput, file);
    expect(screen.getByAltText(/preview/i)).toBeInTheDocument();
  });
});

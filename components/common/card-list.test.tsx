import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CardList from "./card-list";
import { Puzzle } from "lucide-react";
import Image from "next/image";

// Sample test data
interface TestItem {
  id: string;
  title: string;
  description: string;
  user_id: string;
  created_at: string;
}

const mockItems: TestItem[] = [
  {
    id: "1",
    title: "First Item",
    description: "First description",
    user_id: "user-1",
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Second Item",
    description: "Second description",
    user_id: "user-2",
    created_at: "2024-01-20T15:30:00Z",
  },
];

const emptyState = {
  icon: Puzzle,
  title: "No items yet",
  description: "Create your first item to get started.",
};

describe("CardList simple tests", () => {
  it("renders loading spinner when isLoading is true", () => {
    render(
      <CardList
        items={[]}
        isLoading={true}
        emptyState={emptyState}
        renderTitle={(item: any) => <div>{item.title}</div>}
      />
    );

    // Spinner should be present
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders empty state when no items", () => {
    render(
      <CardList
        items={[]}
        isLoading={false}
        emptyState={emptyState}
        renderTitle={(item: any) => <div>{item.title}</div>}
      />
    );

    expect(screen.getByText(/no items yet/i)).toBeInTheDocument();
    expect(
      screen.getByText(/create your first item to get started/i)
    ).toBeInTheDocument();
  });

  it("renders all items when provided", () => {
    render(
      <CardList
        items={mockItems}
        isLoading={false}
        emptyState={emptyState}
        renderTitle={(item) => <div>{item.title}</div>}
      />
    );

    expect(screen.getByText("First Item")).toBeInTheDocument();
    expect(screen.getByText("Second Item")).toBeInTheDocument();
  });

  it("renders item titles using renderTitle prop", () => {
    render(
      <CardList
        items={mockItems}
        isLoading={false}
        emptyState={emptyState}
        renderTitle={(item) => <h2 className="font-bold">{item.title}</h2>}
      />
    );

    const firstTitle = screen.getByText("First Item");
    expect(firstTitle).toBeInTheDocument();
    expect(firstTitle.tagName).toBe("H2");
  });

  it("renders subtitles when renderSubtitle is provided", () => {
    render(
      <CardList
        items={mockItems}
        isLoading={false}
        emptyState={emptyState}
        renderTitle={(item) => <div>{item.title}</div>}
        renderSubtitle={(item) => <p>{item.description}</p>}
      />
    );

    expect(screen.getByText("First description")).toBeInTheDocument();
    expect(screen.getByText("Second description")).toBeInTheDocument();
  });

  it("renders action buttons when renderActions is provided", () => {
    render(
      <CardList
        items={mockItems}
        isLoading={false}
        emptyState={emptyState}
        currentUserId="user-1"
        renderTitle={(item) => <div>{item.title}</div>}
        renderActions={() => (
          <>
            <button>Edit</button>
            <button>Delete</button>
          </>
        )}
      />
    );

    // Should have 2 items × 2 buttons each = 4 buttons total
    const editButtons = screen.getAllByText("Edit");
    const deleteButtons = screen.getAllByText("Delete");

    expect(editButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);
  });

  it("renders images when renderImage is provided", () => {
    render(
      <CardList
        items={mockItems}
        isLoading={false}
        emptyState={emptyState}
        renderTitle={(item) => <div>{item.title}</div>}
        renderImage={(item) => (
          <Image src={`/image-${item.id}.jpg`} alt={item.title} />
        )}
      />
    );

    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute("src", "/image-1.jpg");
    expect(images[1]).toHaveAttribute("src", "/image-2.jpg");
  });

  it("renders additional content when renderAdditionalContent is provided", () => {
    render(
      <CardList
        items={mockItems}
        isLoading={false}
        emptyState={emptyState}
        renderTitle={(item) => <div>{item.title}</div>}
        renderAdditionalContent={(item) => (
          <div className="extra-info">Extra info for {item.id}</div>
        )}
      />
    );

    expect(screen.getByText(/extra info for 1/i)).toBeInTheDocument();
    expect(screen.getByText(/extra info for 2/i)).toBeInTheDocument();
  });

  it("applies custom className when provided", () => {
    const { container } = render(
      <CardList
        items={mockItems}
        isLoading={false}
        emptyState={emptyState}
        renderTitle={(item) => <div>{item.title}</div>}
        className="custom-class"
      />
    );

    const wrapper = container.querySelector(".custom-class");
    expect(wrapper).toBeInTheDocument();
  });

  it("renders correct number of article elements for items", () => {
    const { container } = render(
      <CardList
        items={mockItems}
        isLoading={false}
        emptyState={emptyState}
        renderTitle={(item) => <div>{item.title}</div>}
      />
    );

    const articles = container.querySelectorAll("article");
    expect(articles).toHaveLength(mockItems.length);
  });
});

import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export interface I_QUERY_PARAMS {
  sort_field: "title" | "created_at";
  sort_order: "asc" | "desc";
  search: string;
}

interface I_FILTERING_PROPS {
  onHandleSearchChange: (value: string) => void;
  onToggleSort: (description: any) => void | any;
  queryParams: I_QUERY_PARAMS;
}

const Fitlering = ({
  onHandleSearchChange,
  onToggleSort,
  queryParams,
}: I_FILTERING_PROPS) => {
  const { sort_field, sort_order, search } = queryParams;
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center justify-between mt-3">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search by title"
          value={search}
          onChange={(e) => onHandleSearchChange(e.target.value)}
          className="w-60 text-base"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant={sort_field === "title" ? "secondary" : "ghost"}
          type="button"
          onClick={() => onToggleSort("title")}
          className="flex items-center gap-1 px-3 py-2"
        >
          Title
          <ArrowUpDown
            className={`ml-1 size-4 ${
              sort_field === "title" ? "text-violet-700" : "text-slate-400"
            } ${
              sort_field === "title" && sort_order === "asc" && "rotate-180"
            }`}
            aria-label="Sort by food title"
          />
        </Button>
        <Button
          variant={sort_field === "created_at" ? "secondary" : "ghost"}
          type="button"
          onClick={() => onToggleSort("created_at")}
          className="flex items-center gap-1 px-3 py-2"
        >
          Upload Date
          <ArrowUpDown
            className={`ml-1 size-4 ${
              sort_field === "created_at" ? "text-violet-700" : "text-slate-400"
            } ${
              sort_field === "created_at" &&
              sort_order === "asc" &&
              "rotate-180"
            }`}
            aria-label="Sort by upload date"
          />
        </Button>
      </div>
    </div>
  );
};

export default Fitlering;

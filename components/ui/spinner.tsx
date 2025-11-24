import { Loader2Icon } from "lucide-react";

import { cn } from "@/lib/utils";

interface SpinnerProps extends React.ComponentProps<"svg"> {
  message?: string;
}

function Spinner({ className, message, ...props }: SpinnerProps) {
  return (
    <div className="absolute flex flex-col items-center gap-1 justify-center w-full inset-0 z-1 bg-[#0a0a0a25] rounded-xl">
      <Loader2Icon
        role="status"
        aria-label="Loading"
        className={cn("size-3 animate-spin", className)}
        {...props}
      />
      <span className="text-sm text-gray-500">{message || "Loading..."}</span>
    </div>
  );
}

export { Spinner };

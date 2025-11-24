import { ReactNode } from "react";
import { Button } from "../ui/button";

// Action Buttons Component
interface I_ACTION_BUTTON_PROPS {
  onClick: () => void;
  disabled?: boolean;
  variant?: "ghost" | "danger" | "secondary";
  children: ReactNode;
  className?: string;
  isLoading?: boolean;
  ariaLabel?: string;
  title?: string;
  size?: "default" | "sm" | "lg" | "icon";
}

const ActionButton: React.FC<I_ACTION_BUTTON_PROPS> = ({
  onClick,
  disabled = false,
  variant = "ghost",
  children,
  className = "",
  isLoading = false,
  ariaLabel,
  title,
  size,
}) => {
  return (
    <Button
      onClick={onClick}
      variant={variant as "default"}
      disabled={disabled || isLoading}
      className={`${className} disabled:opacity-50`}
      aria-label={ariaLabel}
      title={title}
      size={size}
    >
      {isLoading ? (
        <div className="size-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </Button>
  );
};

export default ActionButton;

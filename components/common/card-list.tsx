import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { EmptyPlaceholder } from "../ui/empty-placeholder";
import { Spinner } from "../ui/spinner";

// Types
interface BaseItem {
  id: string | number;
  created_at?: string;
  user_id?: string;
}

interface EmptyState {
  icon?: LucideIcon;
  title: string;
  description: string;
}

interface CardListProps<T extends BaseItem> {
  items: T[];
  isLoading?: boolean;
  emptyState: EmptyState;
  renderImage?: (item: T) => ReactNode;
  renderTitle: (item: T) => ReactNode;
  renderSubtitle?: (item: T) => ReactNode;
  renderActions?: (item: T, currentUserId?: string) => ReactNode;
  renderAdditionalContent?: (item: T) => ReactNode;
  currentUserId?: string;
  className?: string;
}

// Base Card List Component
function CardList<T extends BaseItem>({
  items = [],
  isLoading = false,
  emptyState,
  renderImage,
  renderTitle,
  renderSubtitle,
  renderActions,
  renderAdditionalContent,
  currentUserId,
  className = "",
}: CardListProps<T>) {
  if (isLoading) {
    return (
      <div className="flex relative justify-center py-10 mt-5 h-50">
        <Spinner className="size-6 text-violet-600" />
      </div>
    );
  }

  if (items.length === 0) {
    const IconComponent = emptyState.icon;
    return (
      IconComponent && (
        <EmptyPlaceholder
          icon={emptyState.icon}
          title={emptyState.title}
          description={emptyState.description}
        />
      )
    );
  }

  return (
    <div
      className={`flex max-h-[900px] flex-col gap-4 overflow-y-auto pr-1 mt-5 ${className}`}
    >
      {items.map((item) => (
        <article
          key={item.id}
          className="rounded-3xl border border-slate-100 bg-white/90 p-5 shadow-[0_15px_45px_-35px_rgba(15,23,42,0.65)] transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-200/70 hover:shadow-[0_18px_55px_-35px_rgba(109,40,217,0.6)] flex flex-col"
        >
          <div className="flex w-full flex-col justify-between">
            <div className="flex items-center gap-3 flex-1">
              {renderImage && renderImage(item)}
              <div className="flex-1">
                {renderTitle(item)}
                {renderSubtitle && renderSubtitle(item)}
              </div>
            </div>

            {renderActions && (
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-5 items-center justify-around ml-3 mt-5">
                {renderActions(item, currentUserId)}
              </div>
            )}

            {/* Additional content like reviews */}
            {renderAdditionalContent && renderAdditionalContent(item)}
          </div>
        </article>
      ))}
    </div>
  );
}

export default CardList;

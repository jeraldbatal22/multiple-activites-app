import { Save, X, Edit, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import React from "react";

// Type definitions
interface ReviewType {
  id: string;
  user_id: string;
  comment: string;
  created_at: string;
}

interface ReviewsEditorType {
  open: boolean;
  food_id: string | null; // Renamed from foodId
  id?: string | null;
  comment?: string;
  created_at: string;
}

interface PhotoType {
  id: string;
}

interface ListReviewProps {
  reviewsEditor: ReviewsEditorType;
  photo: PhotoType;
  currentUserId: string | null;
  reviews: Record<string, ReviewType[]>;
  loadingReviewsFoodId: string | null;
  hasUserReview: (food_id: string, userId: string) => boolean; // Renamed param
  openNewReview: (food_id: string) => void; // Renamed param
  cancelReviewEditing: () => void;
  Spinner: React.ComponentType<{ className?: string }>;
  handleSaveReview: (
    food_id: string, // Renamed param
    reviewId: string | null,
    reviewText: string
  ) => void;
  savingReview: boolean;
  setReviewsEditor: React.Dispatch<React.SetStateAction<ReviewsEditorType>>;
  openEditReview: (food_id: string, review: ReviewType) => void; // Renamed param
  deletingReviewId: string | null;
  handleDeleteReview: (food_id: string, reviewId: string) => void; // Renamed param
}

const ListReview: React.FC<ListReviewProps> = ({
  reviewsEditor,
  photo,
  currentUserId,
  reviews,
  loadingReviewsFoodId,
  hasUserReview,
  cancelReviewEditing,
  Spinner,
  handleSaveReview,
  savingReview,
  setReviewsEditor,
  openEditReview,
  deletingReviewId,
  handleDeleteReview,
}) => {
  // Don't render if review panel is not open for this photo
  if (!reviewsEditor.open || reviewsEditor.food_id !== photo.id) {
    return null;
  }

  const photoReviews = reviews[photo.id] || [];
  const isAddingNewReview =
    reviewsEditor.id === null &&
    reviewsEditor.open &&
    currentUserId &&
    !hasUserReview(photo.id, currentUserId);

  return (
    <div className="w-full border-t mt-5 pt-4">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="font-semibold text-slate-700">
          Reviews ({photoReviews.length})
        </div>
        <div className="flex items-center gap-2 ml-auto">
          {/* Add Review button - only show if not editing and user hasn't reviewed */}
          {/* {!reviewsEditor.id &&
            currentUserId &&
            !hasUserReview(photo.id, currentUserId) && (
              <Button
                size="sm"
                variant="outline"
                className="text-xs gap-1 h-8 px-3"
                onClick={() => openNewReview(photo.id)}
              >
                <Plus className="size-4" />
                Add Review
              </Button>
            )} */}
          {/* Close button */}
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-slate-500 hover:bg-slate-50"
            onClick={cancelReviewEditing}
            aria-label="Close reviews"
            title="Close reviews"
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>

      {/* Loading state */}
      {loadingReviewsFoodId === photo.id ? (
        <div className="flex justify-center py-8">
          <Spinner className="size-5 text-violet-700" />
        </div>
      ) : (
        <>
          {/* Reviews list */}
          <div className="flex flex-col gap-3 mb-3">
            {photoReviews.length === 0 && !isAddingNewReview && (
              <div className="text-sm text-slate-400 italic py-4 text-center">
                No reviews yet. Be the first to review!
              </div>
            )}

            {photoReviews.map((rev) => (
              <div
                key={rev.id}
                className={`flex gap-2 items-start group border rounded-lg px-4 py-3 transition-colors ${
                  rev.user_id === currentUserId
                    ? "border-violet-200 bg-violet-50/30"
                    : "border-slate-100 bg-white"
                }`}
              >
                {/* Review content */}
                <div className="flex-1">
                  {reviewsEditor.id === rev.id ? (
                    // Edit form
                    <form
                      className="flex flex-col gap-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSaveReview(
                          photo.id,
                          rev.id,
                          reviewsEditor?.comment as string
                        );
                      }}
                    >
                      <Input
                        autoFocus
                        value={reviewsEditor.comment}
                        disabled={savingReview}
                        className="text-sm"
                        maxLength={2048}
                        placeholder="Write your review..."
                        onChange={(e) =>
                          setReviewsEditor((ed) => ({
                            ...ed,
                            comment: e.target.value,
                          }))
                        }
                        required
                      />
                      <div className="flex gap-2">
                        <Button
                          type="submit"
                          size="sm"
                          className="h-8"
                          disabled={
                            savingReview || !reviewsEditor?.comment?.trim()
                          }
                        >
                          {savingReview ? (
                            <Spinner className="size-4" />
                          ) : (
                            <>
                              <Save className="size-4 mr-1" />
                              Save
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="h-8"
                          disabled={savingReview}
                          onClick={cancelReviewEditing}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    // Display review
                    <>
                      <p className="text-sm text-slate-800 whitespace-pre-wrap wrap-break-word">
                        {rev.comment}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-slate-400">
                          {new Date(rev.created_at).toLocaleString()}
                        </span>
                        {/* Action buttons for own review */}
                        {rev.user_id === currentUserId && (
                          <div className="flex gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-violet-600 hover:bg-violet-50"
                              onClick={() => openEditReview(photo.id, rev)}
                              disabled={savingReview}
                              title="Edit review"
                            >
                              <Edit className="size-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-rose-600 hover:bg-rose-50"
                              disabled={deletingReviewId === rev.id}
                              onClick={() =>
                                handleDeleteReview(photo.id, rev.id)
                              }
                              title="Delete review"
                            >
                              {deletingReviewId === rev.id ? (
                                <Spinner className="size-4" />
                              ) : (
                                <Trash2 className="size-4" />
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add new review form */}
          {isAddingNewReview && (
            <form
              className="flex flex-col gap-2 border border-violet-200 rounded-lg p-3 bg-violet-50/20"
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveReview(photo.id, null, reviewsEditor?.comment as any);
              }}
            >
              <Input
                placeholder="Write your review..."
                value={reviewsEditor.comment}
                onChange={(e) =>
                  setReviewsEditor((ed) => ({
                    ...ed,
                    comment: e.target.value,
                  }))
                }
                maxLength={2048}
                className="text-sm"
                disabled={savingReview}
                required
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  type="submit"
                  size="sm"
                  className="h-8"
                  disabled={savingReview || !reviewsEditor?.comment?.trim()}
                >
                  {savingReview ? (
                    <Spinner className="size-4" />
                  ) : (
                    <>
                      <Save className="size-4 mr-1" />
                      Submit Review
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-8"
                  disabled={savingReview}
                  onClick={cancelReviewEditing}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default ListReview;

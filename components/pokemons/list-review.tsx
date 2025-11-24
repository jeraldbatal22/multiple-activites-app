import { Save, X, Edit, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import React from "react";

// -----------------
// Pokemon Review Adaptation
// -----------------

// Type definitions
interface PokemonReview {
  id: string;
  user_id: string;
  comment: string;
  created_at: string;
}

interface PokemonReviewsEditor {
  open: boolean;
  pokemon_id: string | null;
  id?: string | null; // review id (if editing)name
  comment?: string;
  created_at: string;
}

interface PokemonType {
  id: string;
}

interface PokemonListReviewProps {
  reviewsEditor: PokemonReviewsEditor;
  pokemon: PokemonType;
  currentUserId: string | null;
  reviews: Record<string, PokemonReview[]>;
  loadingReviewsPokemonId: string | null;
  hasUserReview: (pokemon_id: string, userId: string) => boolean;
  openNewReview: (pokemon_id: string) => void;
  cancelReviewEditing: () => void;
  Spinner: React.ComponentType<{ className?: string }>;
  handleSaveReview: (
    pokemon_id: string,
    reviewId: string | null,
    reviewText: string
  ) => void;
  savingReview: boolean;
  setReviewsEditor: React.Dispatch<React.SetStateAction<PokemonReviewsEditor>>;
  openEditReview: (pokemon_id: string, review: PokemonReview) => void;
  deletingReviewId: string | null;
  handleDeleteReview: (pokemon_id: string, reviewId: string) => void;
}

const PokemonListReview: React.FC<PokemonListReviewProps> = ({
  reviewsEditor,
  pokemon,
  currentUserId,
  reviews,
  loadingReviewsPokemonId,
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
  // Don't render if review panel is not open for this pokemon
  if (!reviewsEditor.open || reviewsEditor.pokemon_id !== pokemon.id) {
    return null;
  }

  const pokemonReviews = reviews[pokemon.id] || [];
  const isAddingNewReview =
    reviewsEditor.id === null &&
    reviewsEditor.open &&
    currentUserId &&
    !hasUserReview(pokemon.id, currentUserId);

  return (
    <div className="w-full border-t mt-5 pt-4">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="font-semibold text-slate-700">
          Reviews ({pokemonReviews.length})
        </div>
        <div className="flex items-center gap-2 ml-auto">
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
      {loadingReviewsPokemonId === pokemon.id ? (
        <div className="flex justify-center py-8">
          <Spinner className="size-5 text-violet-700" />
        </div>
      ) : (
        <>
          {/* Reviews list */}
          <div className="flex flex-col gap-3 mb-3">
            {pokemonReviews.length === 0 && !isAddingNewReview && (
              <div className="text-sm text-slate-400 italic py-4 text-center">
                No reviews yet. Be the first to review!
              </div>
            )}

            {pokemonReviews.map((rev) => (
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
                          pokemon.id,
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
                              onClick={() => openEditReview(pokemon.id, rev)}
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
                                handleDeleteReview(pokemon.id, rev.id)
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
                handleSaveReview(
                  pokemon.id,
                  null,
                  reviewsEditor?.comment as string
                );
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

export default PokemonListReview;

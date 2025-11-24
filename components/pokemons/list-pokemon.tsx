"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "../ui/spinner";
import { Puzzle, Trash2, Edit } from "lucide-react";
import { showToast } from "@/lib/utils";
import { supabaseClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import ListReview from "./list-review";
import {
  setPokemons,
  setSelectedPokemon,
} from "@/lib/slices/pokemon-review-slice";
import ActionButton from "../common/action-button";
import CardList from "../common/card-list";
import Fitlering, { I_QUERY_PARAMS } from "../common/filtering";

type Review = {
  id: string;
  user_id: string;
  comment: string;
  created_at: string;
};

type ReviewsEditor = {
  open: boolean;
  pokemon_id: string | null;
  id?: string | null;
  comment?: string;
};

const ListPokemon = () => {
  const dispatch = useAppDispatch();
  const { pokemons, selectedPokemon } = useAppSelector(
    (state) => state.pokemon
  );
  const { user } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingPokemonId, setDeletingPokemonId] = useState<string | null>(
    null
  );
  const [queryParams, setQueryParams] = useState<I_QUERY_PARAMS>({
    search: "",
    sort_order: "desc",
    sort_field: "created_at",
  });

  const currentUserId = user?.id;
  const [reviews, setReviews] = useState<Record<string, Review[]>>({});
  const [reviewsEditor, setReviewsEditor] = useState<ReviewsEditor>({
    open: false,
    pokemon_id: null,
    id: null,
    comment: "",
  });
  const [loadingReviewsPokemonId, setLoadingReviewsPokemonId] = useState<
    string | null
  >(null);
  const [savingReview, setSavingReview] = useState<boolean>(false);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);

  // FETCH: Pokemons with server-side filtering
  const fetchPokemons = async () => {
    setIsLoading(true);
    try {
      const supabase = supabaseClient();
      let query = supabase
        .from("pokemons_with_review_count")
        .select("*")
        .order(queryParams.sort_field, { ascending: queryParams.sort_order === "asc" });

      if (queryParams.search.trim()) {
        query = query.ilike("description", `%${queryParams.search.trim()}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      dispatch(setPokemons(data || []));
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to fetch pokemons.";
      showToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // FETCH: Reviews for a single pokemon
  const fetchReviews = async (pokemonId: string) => {
    setLoadingReviewsPokemonId(pokemonId);
    try {
      const supabase = supabaseClient();
      const { data, error } = await supabase
        .from("pokemon_reviews")
        .select("*")
        .eq("pokemon_id", pokemonId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews((prev) => ({ ...prev, [pokemonId]: data || [] }));
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to fetch reviews.";
      showToast(message, "error");
    } finally {
      setLoadingReviewsPokemonId(null);
    }
  };

  // Realtime subscription for reviews
  useEffect(() => {
    const supabase = supabaseClient();
    const channel = supabase
      .channel("pokemon-reviews-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pokemon_reviews" },
        (payload) => {
          const pokemonId =
            (payload.new &&
              (payload.new as { [key: string]: any }).pokemon_id) ??
            (payload.old && (payload.old as { [key: string]: any }).pokemon_id);
          if (pokemonId && reviews[pokemonId]) {
            // Only refetch if we're already viewing this pokemon's reviews
            fetchReviews(pokemonId);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [reviews]);

  // Refetch pokemons when search/sort changes
  useEffect(() => {
    fetchPokemons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);

  // Realtime subscription for pokemons
  useEffect(() => {
    const supabase = supabaseClient();
    const channel = supabase
      .channel("pokemons-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pokemons" },
        () => {
          fetchPokemons();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sort field toggle logic
  const toggleSort = (field: "title" | "asc") => {
    setQueryParams((prev: any) => {
      if (prev.sort_field === field) {
        return {
          ...prev,
          sort_order: prev.sort_order === "asc" ? "desc" : "asc",
        };
      } else {
        return {
          ...prev,
          sort_field: field,
          sort_order: field === "title" ? "asc" : "desc",
        };
      }
    });
  };

  const handleSearchChange = (searchValue: string) => {
    setQueryParams((prevState) => ({ ...prevState, search: searchValue }));
  };

  // Create or Update Review
  const handleSaveReview = async (
    pokemon_id: string,
    reviewId: string | null,
    text: string
  ) => {
    if (!currentUserId || !text.trim()) return;
    setSavingReview(true);
    const supabase = supabaseClient();
    try {
      if (reviewId) {
        // Update existing review
        const { error } = await supabase
          .from("pokemon_reviews")
          .update({ comment: text.trim() })
          .eq("id", reviewId)
          .eq("user_id", currentUserId);

        if (error) throw error;
        showToast("Review updated!", "success");
      } else {
        // Create new review
        const { error } = await supabase.from("pokemon_reviews").insert({
          pokemon_id: pokemon_id,
          user_id: currentUserId,
          comment: text.trim(),
        });

        if (error) throw error;
        showToast("Review added!", "success");
      }

      // Refetch reviews and close editor
      await fetchReviews(pokemon_id);
      setReviewsEditor({
        open: true,
        pokemon_id,
        id: null,
        comment: "",
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to save review.";
      showToast(message, "error");
    } finally {
      setSavingReview(false);
    }
  };

  // DELETE review
  const handleDeleteReview = async (pokemonId: string, reviewId: string) => {
    if (!reviewId || !currentUserId) return;
    if (!window.confirm("Delete this review?")) return;

    setDeletingReviewId(reviewId);
    const supabase = supabaseClient();

    try {
      const { error } = await supabase
        .from("pokemon_reviews")
        .delete()
        .eq("id", reviewId)
        .eq("user_id", currentUserId);

      if (error) throw error;
      showToast("Review deleted", "success");
      await fetchReviews(pokemonId);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to delete review.";
      showToast(message, "error");
    } finally {
      setDeletingReviewId(null);
    }
  };

  // DELETE pokemon
  const handleDeletePokemon = async (pokemonId: string) => {
    const proceed = window.confirm(
      "Are you sure you want to delete this Pokémon entry? This will also delete all associated reviews."
    );
    if (!proceed) return;

    setDeletingPokemonId(pokemonId);
    try {
      const supabase = supabaseClient();
      const { error } = await supabase
        .from("pokemons")
        .delete()
        .eq("id", pokemonId);

      if (error) throw error;
      showToast("Pokémon entry deleted.", "success");

      // Clean up reviews cache
      setReviews((prev) => {
        const updated = { ...prev };
        delete updated[pokemonId];
        return updated;
      });
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to delete Pokémon.";
      showToast(message, "error");
    } finally {
      setDeletingPokemonId(null);
    }
  };

  // Edit review handler
  const openEditReview = (pokemon_id: string, review: Review) => {
    setReviewsEditor({
      open: true,
      pokemon_id,
      id: review.id,
      comment: review.comment,
    });
  };

  // New review handler
  const openNewReview = (pokemon_id: string) => {
    setReviewsEditor({
      open: true,
      pokemon_id,
      id: null,
      comment: "",
    });
  };

  // Cancel review editing
  const cancelReviewEditing = () => {
    setReviewsEditor({
      open: false,
      pokemon_id: null,
      id: null,
      comment: "",
    });
  };

  // Check if user already has a review for this pokemon
  const hasUserReview = (
    pokemonId: string | null,
    userId: string | null
  ): boolean => {
    if (!pokemonId || !userId) return false;
    return !!reviews[pokemonId]?.some((r) => r.user_id === userId);
  };

  // Auto-load reviews when panel opens
  useEffect(() => {
    if (
      reviewsEditor.open &&
      reviewsEditor.pokemon_id &&
      !reviews[reviewsEditor.pokemon_id]
    ) {
      fetchReviews(reviewsEditor.pokemon_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewsEditor.open, reviewsEditor.pokemon_id]);

  return (
    <section className="w-full px-4 py-6">
      <Card className="mx-auto w-full max-w-5xl bg-white">
        <CardHeader>
          <CardTitle>Pokémon List & Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <Fitlering
            onHandleSearchChange={handleSearchChange}
            onToggleSort={toggleSort}
            queryParams={queryParams}
          />

          <CardList<any>
            items={pokemons}
            isLoading={isLoading}
            currentUserId={user?.id}
            emptyState={{
              icon: Puzzle,
              title: "No todos yet",
              description: "Create your first todo to get started.",
            }}
            renderTitle={(item) => (
              <div className="text-2xl font-semibold text-slate-800 mb-3">
                {item.title}
              </div>
            )}
            renderSubtitle={(item) => (
              <div className="flex flex-col gap-2">
                {item?.pokemon_image_url && (
                  <Image
                    src={item.pokemon_image_url}
                    alt={item.name || "Photo"}
                    width={100}
                    height={100}
                    className=" object-cover rounded border border-slate-200"
                  />
                )}
                <div className="text-sm text-slate-600 mt-1">
                  {item.description}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Created:{" "}
                  {item.created_at
                    ? new Date(item.created_at).toLocaleString()
                    : "—"}
                </div>
              </div>
            )}
            renderActions={(item, currentUserId) => (
              <>
                {item.user_id === currentUserId && (
                  <>
                    <ActionButton
                      onClick={() => dispatch(setSelectedPokemon(item))}
                      disabled={deletingPokemonId === item.id}
                      className="h-8 px-3 text-xs font-semibold text-violet-700 hover:bg-violet-50 ml-2"
                    >
                      <Edit className="size-5 mr-1 inline" />
                      {selectedPokemon?.id === item.id ? "Editing…" : "Edit"}
                    </ActionButton>
                    <ActionButton
                      size="sm"
                      className="h-8  text-rose-600 hover:bg-rose-50 transition ml-1"
                      variant="danger"
                      onClick={() => handleDeletePokemon(item.id)}
                      ariaLabel="Delete todo"
                      title="Delete todo"
                    >
                      Delete
                      <Trash2 className="size-5 mr-1 inline" />
                    </ActionButton>
                  </>
                )}

                <ActionButton
                  className="h-8  text-xs font-semibold text-violet-700"
                  variant="secondary"
                  ariaLabel="Delete todo"
                  title="Delete todo"
                  onClick={() => {
                    setReviewsEditor({
                      open: true,
                      pokemon_id: item.id,
                      id: null,
                      comment: "",
                    });
                    if (!reviews[item.id]) fetchReviews(item.id);
                  }}
                >
                  Reviews ({item.reviewcount || 0})
                </ActionButton>
              </>
            )}
            renderAdditionalContent={(item) => {
              return (
                <ListReview
                  reviewsEditor={reviewsEditor as any}
                  pokemon={item}
                  currentUserId={currentUserId as string}
                  reviews={reviews as any}
                  loadingReviewsPokemonId={loadingReviewsPokemonId}
                  hasUserReview={hasUserReview}
                  openNewReview={openNewReview}
                  cancelReviewEditing={cancelReviewEditing}
                  Spinner={Spinner}
                  handleSaveReview={handleSaveReview}
                  savingReview={savingReview}
                  setReviewsEditor={setReviewsEditor as any}
                  openEditReview={openEditReview as any}
                  deletingReviewId={deletingReviewId}
                  handleDeleteReview={handleDeleteReview}
                />
              );
            }}
          />
        </CardContent>
      </Card>
    </section>
  );
};

export default ListPokemon;

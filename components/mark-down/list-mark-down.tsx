"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setNotes, setSelectedNote } from "@/lib/slices/mark-down-note-slice";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/utils/supabase/client";
import { Spinner } from "../ui/spinner";
import { EmptyPlaceholder } from "../ui/empty-placeholder";
import { Edit, Puzzle, Trash2 } from "lucide-react";
import { converter, showToast } from "@/lib/utils";
import ReactMde from "react-mde";

const ListMarkDown = () => {
  const dispatch = useAppDispatch();
  const { notes, selectedNote } = useAppSelector((state) => state.markDownNote);
  const { user } = useAppSelector((state) => state.auth);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

  const handleEdit = (note: any) => {
    dispatch(setSelectedNote(note));
  };

  const handleDelete = async (note: any) => {
    if (!note?.id) return;
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    setDeletingNoteId(note.id);
    try {
      const supabase = supabaseClient();
      const { error } = await supabase
        .from("markdown_notes")
        .delete()
        .eq("id", note.id);

      if (error) throw error;

      showToast("Note deleted successfully", "success");
      // fetchMarkdownNotes will be triggered by realtime changes below
      if (selectedNote?.id === note.id) {
        dispatch(setSelectedNote(null));
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete note.";
      showToast(errorMessage, "error");
    } finally {
      setDeletingNoteId(null);
    }
  };

  const fetchMarkdownNotes = async () => {
    console.log(user);
    if (user?.id) {
      setIsLoadingNotes(true);
      try {
        const supabase = supabaseClient();
        const { data: fetchedNotes, error } = await supabase
          .from("markdown_notes")
          .select("*")
          .eq("user_id", user?.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        dispatch(setNotes(fetchedNotes ?? []));
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch notes.";
        showToast(errorMessage, "error");
      } finally {
        setIsLoadingNotes(false);
      }
    }
  };

  useEffect(() => {
    fetchMarkdownNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    const supabase = supabaseClient();

    const channel = supabase
      .channel("markdown_notes-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "markdown_notes",
        },
        () => {
          fetchMarkdownNotes();
        }
      )
      .subscribe((status) => {
        console.log(status);
      });

    return () => {
      channel.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return (
    <section className="w-full px-4 py-6">
      <Card className="mx-auto w-full max-w-5xl bg-white">
        <CardHeader>
          <CardTitle>Markdown Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex max-h-[900px] flex-col gap-4 overflow-y-auto pr-1 mt-5">
            {isLoadingNotes && (
              <div className="flex relative justify-center py-10">
                <Spinner className="size-6 text-violet-600" />
              </div>
            )}

            {!isLoadingNotes && notes.length === 0 && (
              <EmptyPlaceholder
                icon={Puzzle}
                title="No notes yet"
                description="Once you add a note, it will appear here."
              />
            )}

            {!isLoadingNotes &&
              notes.map((note: any, index: number) => (
                <article
                  key={index}
                  className="rounded-3xl flex justify-between flex-col items-center gap-3 border border-slate-100 bg-white/90 p-5 shadow-[0_15px_45px_-35px_rgba(15,23,42,0.65)] transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-200/70 hover:shadow-[0_18px_55px_-35px_rgba(109,40,217,0.6)] "
                >
                  <div className="w-full">
                    <ReactMde
                      value={note.description}
                      selectedTab={"preview"}
                      generateMarkdownPreview={(markdown) =>
                        Promise.resolve(converter.makeHtml(markdown))
                      }
                      readOnly={true}
                      toolbarCommands={[]}
                    />
                  </div>
                  {note.user_id === user?.id && (
                    <div className="flex items-center gap-10">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-8 px-3 text-xs font-semibold text-violet-700 hover:bg-violet-50 cursor-pointer"
                        onClick={() => handleEdit(note)}
                        disabled={deletingNoteId === note.id}
                      >
                        {selectedNote?.id === note.id ? (
                          "Editing…"
                        ) : (
                          <>
                            Edit
                            <Edit className="size-4" />
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-8 text-rose-600 hover:bg-rose-50 transition"
                        onClick={() => handleDelete(note)}
                        disabled={deletingNoteId === note.id}
                        aria-label="Delete note"
                        title="Delete note"
                      >
                        {deletingNoteId === note.id ? (
                          <Spinner className="size-5 text-rose-600" />
                        ) : (
                          <>
                            Delete <Trash2 className="size-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </article>
              ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default ListMarkDown;

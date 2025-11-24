"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Puzzle, Trash2, Edit } from "lucide-react";
import { showToast } from "@/lib/utils";
import { supabaseClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setSelectedFile, setFiles } from "@/lib/slices/google-drive-slice";
import CardList from "../common/card-list";
import ActionButton from "../common/action-button";
import Fitlering, { I_QUERY_PARAMS } from "../common/filtering";

// Google Drive file table interface
type DrivePhoto = {
  id: string;
  user_id: string;
  name: string;
  google_drive_photo_url: string | null;
  created_at: string;
};

const ListGoogleDrive = () => {
  const dispatch = useAppDispatch();
  const { files, selectedFile } = useAppSelector((state) => state.googleDrive);
  const { user } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  const [queryParams, setQueryParams] = useState<I_QUERY_PARAMS>({
    search: "",
    sort_order: "desc",
    sort_field: "created_at",
  });

  // Fetch Google Drive uploads and save in Redux with setFiles
  const fetchPhotos = async () => {
    if (user?.id) {
      setIsLoading(true);
      try {
        const supabase = supabaseClient();
        let query = supabase
          .from("google_drives")
          .select("*")
          .eq("user_id", user?.id)
          .order(queryParams.sort_field, {
            ascending: queryParams.sort_order === "asc",
          });

        if (queryParams.search.trim()) {
          query = query.ilike("title", `%${queryParams.search.trim()}%`);
        }

        const { data, error } = await query;
        if (error) throw error;
        dispatch(setFiles(data || []));
      } catch (e: any) {
        showToast(
          e instanceof Error
            ? e.message
            : "Failed to fetch Google Drive uploads.",
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Refetch on load or query change
  useEffect(() => {
    fetchPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, queryParams]);

  // Subscriptions for realtime updates
  useEffect(() => {
    if (user?.id) {
      const supabase = supabaseClient();
      const channel = supabase
        .channel("google-drive-uploads-channel")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "google_drives",
          },
          () => {
            // Reload on any change
            fetchPhotos();
          }
        )
        .subscribe();

      return () => {
        channel.unsubscribe();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleEdit = (googleDrive: any) => {
    dispatch(setSelectedFile(googleDrive));
  };

  // DELETE
  const handleDelete = async (photo: DrivePhoto) => {
    if (!photo?.id) return;
    const proceed = window.confirm(
      "Are you sure you want to delete this photo from the list? (You will not delete the file on Google Drive, only the record.)"
    );
    if (!proceed) return;
    setDeletingFileId(photo.id);
    try {
      const supabase = supabaseClient();
      const { error } = await supabase
        .from("google_drives")
        .delete()
        .eq("id", photo.id);

      if (error) throw error;
      showToast("Photo upload record deleted.", "success");
      // Will refetch due to realtime subscription
    } catch (e: any) {
      showToast(
        e instanceof Error ? e.message : "Failed to delete photo.",
        "error"
      );
    } finally {
      setDeletingFileId(null);
    }
  };

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

  return (
    <section className="w-full px-4 py-6">
      <Card className="mx-auto w-full max-w-5xl bg-white">
        <CardHeader>
          <CardTitle>Google Drive Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          <Fitlering
            onHandleSearchChange={handleSearchChange}
            onToggleSort={toggleSort}
            queryParams={queryParams}
          />

          <CardList<any>
            items={files}
            isLoading={isLoading}
            currentUserId={user?.id}
            emptyState={{
              icon: Puzzle,
              title: "No todos yet",
              description: "Create your first todo to get started.",
            }}
            renderTitle={(item) => (
              <div className="text-lg font-semibold text-slate-800">
                {item.title}
              </div>
            )}
            renderSubtitle={(item) => (
              <div className="flex flex-col gap-3">
                <div className="text-sm text-slate-600 mt-1">{item.name}</div>
                {item?.google_drive_photo_url && (
                  <Image
                    src={item.google_drive_photo_url}
                    alt={item.name || "Photo"}
                    width={100}
                    height={100}
                    className=" object-cover rounded border border-slate-200"
                  />
                )}
                <div className="text-xs text-slate-500 mt-1">
                  Created:{" "}
                  {item.created_at
                    ? new Date(item.created_at).toLocaleString()
                    : "—"}
                </div>
              </div>
            )}
            renderActions={(item, currentUserId) =>
              item.user_id === currentUserId && (
                <>
                  <ActionButton
                    onClick={() => handleEdit(item)}
                    disabled={deletingFileId === item.id}
                    className="h-8 px-3 text-xs font-semibold text-violet-700 hover:bg-violet-50 ml-2"
                  >
                    <Edit
                      className="size-5 mr-1 inline"
                      onClick={() => handleEdit(item)}
                    />
                    {selectedFile?.id === item.id ? "Editing…" : "Edit"}
                  </ActionButton>

                  <ActionButton
                    className="h-8 w-8 text-rose-600 hover:bg-rose-50 transition ml-1"
                    variant="danger"
                    onClick={() => handleDelete(item)}
                    ariaLabel="Delete todo"
                    title="Delete todo"
                  >
                    Delete
                    <Trash2 className="size-5 mr-1 inline" />
                  </ActionButton>
                </>
              )
            }
          />
        </CardContent>
      </Card>
    </section>
  );
};

export default ListGoogleDrive;

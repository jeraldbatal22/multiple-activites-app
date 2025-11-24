"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setTodos, setSelectedTodo } from "@/lib/slices/todo-slice";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/utils/supabase/client";
import { Edit, Puzzle, Trash2 } from "lucide-react";
import { showToast } from "@/lib/utils";
import CardList from "../common/card-list";
import ActionButton from "../common/action-button";

const ListTodo = () => {
  const dispatch = useAppDispatch();
  const { todos, selectedTodo } = useAppSelector((state) => state.todo);
  const { user } = useAppSelector((state) => state.auth);
  const [isLoadingTodos, setIsLoadingTodos] = useState(true);
  const [deletingTodoId, setDeletingTodoId] = useState<string | null>(null);

  const handleEdit = (todo: any) => {
    dispatch(setSelectedTodo(todo));
  };

  const handleDelete = async (todo: any) => {
    if (!todo?.id) return;
    if (!window.confirm("Are you sure you want to delete this todo?")) return;
    setDeletingTodoId(todo.id);
    try {
      const supabase = supabaseClient();
      const { error } = await supabase.from("todos").delete().eq("id", todo.id);

      if (error) throw error;

      showToast("Todo deleted successfully", "success");
      // fetchAllTodos will be triggered by realtime changes below
      if (selectedTodo?.id === todo.id) {
        dispatch(setSelectedTodo(null));
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete todo.";
      showToast(errorMessage, "error");
    } finally {
      setDeletingTodoId(null);
    }
  };

  const fetchAllTodos = async () => {
    if (user?.id) {
      setIsLoadingTodos(true);
      try {
        const supabase = supabaseClient();
        const { data: fetchedTodos, error } = await supabase
          .from("todos")
          .select("*")
          .eq("user_id", user?.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        dispatch(setTodos(fetchedTodos ?? []));
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch todos.";
        showToast(errorMessage, "error");
      } finally {
        setIsLoadingTodos(false);
      }
    }
  };

  useEffect(() => {
    fetchAllTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    const channel = supabaseClient()
      .channel("todos-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "todos",
        },
        () => {
          fetchAllTodos();
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
          <CardTitle>Todo List</CardTitle>
        </CardHeader>
        <CardContent>
          <CardList<any>
            items={todos}
            isLoading={isLoadingTodos}
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
              <>
                <div className="text-sm text-slate-600 mt-1">
                  {item.description}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Created:{" "}
                  {item.created_at
                    ? new Date(item.created_at).toLocaleString()
                    : "—"}
                </div>
              </>
            )}
            renderActions={(item, currentUserId) =>
              item.user_id === currentUserId && (
                <>
                  <ActionButton
                    onClick={() => handleEdit(item)}
                    disabled={deletingTodoId === item.id}
                    className="h-8 px-3 text-xs font-semibold text-violet-700 hover:bg-violet-50 ml-2"
                    ariaLabel="Edit todo"
                    title="Edit todo"
                  >
                    <Edit
                      className="size-5 mr-1 inline"
                      onClick={() => handleEdit(item)}
                    />
                    {selectedTodo?.id === item.id ? "Editing…" : "Edit"}
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

export default ListTodo;

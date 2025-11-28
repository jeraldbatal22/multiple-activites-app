"use client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { supabaseClient } from "@/utils/supabase/client";
import { showToast } from "@/lib/utils";
import { Spinner } from "../ui/spinner";
import { setSelectedTodo } from "@/lib/slices/todo-slice";

// react-hook-form + resolver
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// shadcn
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Validation schema
const todoSchema = z.object({
  title: z.string().min(1, "Title is required").max(128, "Max 128 characters"),
  priorityLevel: z.enum(["low", "medium", "high"]).optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(800, "Max 800 characters"),
});

type TodoValues = z.infer<typeof todoSchema>;

const FormTodo = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { selectedTodo } = useAppSelector((state) => state.todo);

  const [isLoading, setIsLoading] = useState(false);

  // react-hook-form instance
  const form = useForm<TodoValues>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: selectedTodo?.title || "",
      description: selectedTodo?.description || "",
      priorityLevel: selectedTodo?.priorityLevel || "",
    },
  });

  // Update form fields when selectedTodo changes (edit mode)
  useEffect(() => {
    if (selectedTodo) {
      form.reset({
        title: selectedTodo.title || "",
        description: selectedTodo.description || "",
      });
    } else {
      form.reset({
        title: "",
        description: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTodo]);

  const handleCancelEdit = () => {
    form.reset({ title: "", description: "" });
    dispatch(setSelectedTodo(null));
  };

  const onSubmit = async (values: TodoValues) => {
    setIsLoading(true);

    try {
      const supabase = supabaseClient();

      if (selectedTodo?.id) {
        // Update existing todo
        const { error } = await supabase
          .from("todos")
          .update({
            title: values.title.trim(),
            description: values.description.trim(),
            priority_levels: values.priorityLevel,
          })
          .eq("id", selectedTodo.id);

        if (error) throw new Error(error.message);

        dispatch(setSelectedTodo(null));
        showToast("Successfully updated todo!", "success");
      } else {
        // Insert new todo
        const { error } = await supabase.from("todos").insert({
          title: values.title.trim(),
          description: values.description.trim(),
          user_id: user?.id,
          priority_levels: values.priorityLevel,
        });

        if (error) throw new Error(error.message);
        showToast("Successfully added todo!", "success");
      }
      form.reset({ title: "", description: "" });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save todo";
      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full px-4 py-8">
      <Card className="mx-auto w-full max-w-3xl border-none bg-white/80 shadow-xl backdrop-blur">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">
            {selectedTodo?.id ? "Edit your todo" : "Create a new todo"}
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-linear-to-b from-slate-50 to-white/80 p-5 shadow-[0_18px_55px_-45px_rgba(15,23,42,0.6)]"
            >
              <FormField
                control={form.control}
                name="title"
                render={() => (
                  <FormItem>
                    <FormLabel htmlFor="todo-title">Priority Level</FormLabel>
                    <FormControl>
                      <select
                        // {...field}
                        onChange={(e) =>
                          form.setValue("priorityLevel", e.target.value as any)
                        }
                      >
                        <option value="low">Low</option>
                        <option value="medium">Meidum</option>
                        <option value="high">High</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Title Field */}

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="todo-title">Title</FormLabel>
                    <FormControl>
                      <Input
                        id="todo-title"
                        {...field}
                        placeholder="Enter todo title"
                        className="resize-none"
                        maxLength={128}
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description Field */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="todo-description">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        id="todo-description"
                        {...field}
                        placeholder="Describe your todo..."
                        className="min-h-[80px] resize-none"
                        maxLength={800}
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <Button
                  disabled={isLoading}
                  type="submit"
                  className="flex-1 rounded-full py-5 text-base font-semibold relative"
                >
                  {isLoading ? (
                    <Spinner />
                  ) : (
                    <>
                      {selectedTodo?.id ? "Update" : "Save"}
                      <Send className="ml-2 size-4" />
                    </>
                  )}
                </Button>

                {selectedTodo?.id && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 rounded-full py-5 text-base font-semibold"
                    onClick={handleCancelEdit}
                  >
                    Cancel edit
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
};

export default FormTodo;

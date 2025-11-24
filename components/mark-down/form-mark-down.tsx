"use client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { supabaseClient } from "@/utils/supabase/client";
import { showToast } from "@/lib/utils";
import { Spinner } from "../ui/spinner";
import { setSelectedNote } from "@/lib/slices/mark-down-note-slice";

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
  FormMessage,
  FormLabel,
} from "@/components/ui/form";

import "react-mde/lib/styles/css/react-mde-all.css";
import ReactMde from "react-mde";
import * as Showdown from "showdown";

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
});

// Validation schema for markdown note (only content required)
const markDownSchema = z.object({
  content: z
    .string()
    .min(1, "Content is required")
    .max(8000, "Max 8000 characters"),
});

type MarkDownValues = z.infer<typeof markDownSchema>;

const FormMarkDown = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { selectedNote } = useAppSelector((state) => state.markDownNote);
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");
  const [isLoading, setIsLoading] = useState(false);

  // react-hook-form instance
  const form = useForm<MarkDownValues>({
    resolver: zodResolver(markDownSchema),
    defaultValues: {
      content: selectedNote?.description || "",
    },
  });

  // Update form fields when selectedNote changes (edit mode)
  useEffect(() => {
    if (selectedNote) {
      form.reset({
        content: selectedNote.description || "",
      });
    } else {
      form.reset({
        content: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNote]);

  const handleCancelEdit = () => {
    form.reset({ content: "" });
    dispatch(setSelectedNote(null));
  };

  const onSubmit = async (values: MarkDownValues) => {
    setIsLoading(true);
    try {
      const supabase = supabaseClient();

      if (selectedNote?.id) {
        // Update existing markdown note
        const { error } = await supabase
          .from("markdown_notes")
          .update({
            description: values.content,
          })
          .eq("id", selectedNote.id);

        if (error) throw new Error(error.message);

        dispatch(setSelectedNote(null));
        showToast("Successfully updated note!", "success");
      } else {
        // Insert new markdown note
        const { error } = await supabase.from("markdown_notes").insert({
          description: values.content,
          user_id: user?.id,
        });

        if (error) throw new Error(error.message);
        showToast("Successfully added note!", "success");
      }
      form.reset({ content: "" });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save note";
      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };
  console.log(selectedNote)
  return (
    <section className="">
      <Card className="border-none bg-white/80 shadow-xl backdrop-blur">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">
            {selectedNote?.id
              ? "Edit your markdown note"
              : "Create a markdown note"}
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
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Descritpion</FormLabel>
                    <FormControl>
                      <ReactMde
                        selectedTab={selectedTab as "write" | "preview"}
                        onTabChange={setSelectedTab}
                        generateMarkdownPreview={(markdown) =>
                          Promise.resolve(converter.makeHtml(markdown))
                        }
                        childProps={{
                          writeButton: {
                            tabIndex: -1,
                            style: {
                              padding: "10px 20px",
                            },
                          },
                          previewButton: {
                            style: {
                              padding: "10px 20px",
                            },
                          },
                        }}
                        initialEditorHeight={500}
                        maxEditorHeight={500}
                        toolbarCommands={[
                          ["bold", "italic", "strikethrough"],
                          ["link", "quote"],
                          ["unordered-list", "ordered-list", "checked-list"],
                        ]}
                        {...field}
                        onChange={(value) => {
                          field.onChange(value);
                          form.setValue("content", value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <Button
                  data-testid="submit-button"
                  disabled={isLoading}
                  type="submit"
                  className="flex-1 rounded-full py-5 text-base font-semibold relative"
                >
                  {isLoading ? (
                    <Spinner />
                  ) : (
                    <>
                      {selectedNote?.id ? "Update" : "Save"}
                      <Send className="ml-2 size-4" />
                    </>
                  )}
                </Button>

                {selectedNote?.id && (
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

export default FormMarkDown;

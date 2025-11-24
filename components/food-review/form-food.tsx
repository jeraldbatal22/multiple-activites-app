"use client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { useRef, useState, ChangeEvent, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "../ui/spinner";
import { showToast } from "@/lib/utils";
import { supabaseClient } from "@/utils/supabase/client";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setSelectedFood } from "@/lib/slices/food-review-slice";
import { SupabaseClient } from "@supabase/supabase-js";
import Image from "next/image";
import { Textarea } from "../ui/textarea";

// Validation schema for food review
const foodReviewSchema = z.object({
  title: z.string().min(1, "Food title is required"),
  description: z
    .string()
    .min(1, "Food description is required")
    .max(128, "Max 128 characters"),
  photoFile: z.any().refine((file) => !!file, "Photo file is required"),
});

type FoodValues = z.infer<typeof foodReviewSchema>;

const FormFood = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();
  const { selectedFood } = useAppSelector((state) => state.foodReview);
  const { user } = useAppSelector((state) => state.auth);

  // At edit time, initial 'photoFile' is a string (photo url), not File
  const form = useForm<FoodValues>({
    resolver: zodResolver(foodReviewSchema),
    defaultValues: {
      title: selectedFood?.title || "",
      description: selectedFood?.description || "",
      photoFile: selectedFood?.food_image_url || undefined,
    },
  });

  // Set initial preview url from selectedFood, if present
  useEffect(() => {
    if (selectedFood && selectedFood.food_image_url) {
      setPreviewUrl(selectedFood.food_image_url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFood]);

  // Reset form values and preview url when selectedFood changes
  useEffect(() => {
    if (selectedFood) {
      form.reset({
        title: selectedFood?.title || "",
        description: selectedFood.description || "",
        photoFile: selectedFood.food_image_url,
      });
      setPreviewUrl(selectedFood.food_image_url || null);
    } else {
      form.reset({
        title: "",
        description: "",
        photoFile: undefined,
      });
      setPreviewUrl(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFood]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  console.log(form.getValues());
  const onSubmit = async (values: FoodValues) => {
    setIsLoading(true);
    try {
      const supabase = supabaseClient();

      let imageUrl: string | null = null;

      // If we're editing (selectedFood exists),
      // photoFile may still be the old photoUrl, or it may be a File.
      if (selectedFood?.id) {
        const updateObject: Record<string, any> = {
          title: values?.title?.trim(),
          description: values?.description?.trim(),
        };

        // If the photo file is a File (changed), upload and set new url.
        if (values.photoFile instanceof File) {
          imageUrl = await uploadImage(supabase, values.photoFile);
          updateObject.food_image_url = imageUrl;
        }
        // If photoFile is not a File (string), just keep the url (unchanged), do not set food_image_url.

        const { error } = await supabase
          .from("foods")
          .update(updateObject)
          .eq("id", selectedFood.id);

        if (error) throw new Error(error.message);

        dispatch(setSelectedFood(null));
        showToast("Successfully updated food review!", "success");
      } else {
        // In create mode, photoFile must be File
        if (values.photoFile instanceof File) {
          imageUrl = await uploadImage(supabase, values.photoFile);
        }
        const { error } = await supabase.from("foods").insert({
          title: values?.title?.trim(),
          description: values?.description?.trim(),
          food_image_url: imageUrl,
          user_id: user?.id,
        });
        if (error) throw new Error(error.message);
        showToast("Successfully added food review!", "success");
      }

      // Clear the file input and preview after successful upload
      form.reset({ title: "", description: "", photoFile: undefined });
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save food review";
      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to upload image
  const uploadImage = async (
    supabase: SupabaseClient,
    file: File
  ): Promise<string | null> => {
    const filePath = `${crypto.randomUUID()}-${file.name.replace(/\s/g, "_")}`;

    const { error } = await supabase.storage
      .from("food-images")
      .upload(filePath, file);
    if (error) showToast(error.message, "error");

    const { data } = supabase.storage
      .from("food-images")
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  return (
    <section className="w-full px-4 py-8">
      <Card className="mx-auto w-full max-w-3xl border-none bg-white/80 shadow-xl backdrop-blur">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Add food to review</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-linear-to-b from-slate-50 to-white/80 p-5 shadow-[0_18px_55px_-45px_rgba(15,23,42,0.6)]"
            >
              {/* Food Name Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="food-name">Food Title</FormLabel>
                    <FormControl>
                      <Input
                        id="food-name"
                        {...field}
                        placeholder="Enter food name"
                        className="resize-none"
                        maxLength={128}
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="description">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        id="description"
                        {...field}
                        placeholder="Describe your pokemon..."
                        className="min-h-[80px] resize-none"
                        maxLength={800}
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Photo File Input */}
              <FormField
                control={form.control}
                name="photoFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="photo-file">Food Photo</FormLabel>
                    <FormControl>
                      <Input
                        id="photo-file"
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        // Manually handle file selection for preview and react-hook-form
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const file = e.target.files && e.target.files[0];
                          field.onChange(
                            file || selectedFood?.food_image_url || undefined
                          );

                          // Cleanup previous previewUrl if it was a blob
                          if (previewUrl && previewUrl.startsWith("blob:")) {
                            URL.revokeObjectURL(previewUrl);
                          }
                          if (file) {
                            setPreviewUrl(URL.createObjectURL(file));
                          } else if (selectedFood?.food_image_url) {
                            setPreviewUrl(selectedFood.food_image_url);
                          } else {
                            setPreviewUrl(null);
                          }
                        }}
                      />
                    </FormControl>
                    {previewUrl && (
                      <div className="mt-2">
                        <Image
                          src={previewUrl}
                          alt="Preview"
                          height={200}
                          width={200}
                          className="max-h-40 rounded-lg border border-slate-200"
                          style={{ maxWidth: "100%", objectFit: "contain" }}
                        />
                      </div>
                    )}
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
                      {selectedFood ? "Update" : "Upload"}
                      <Send className="ml-2 size-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
};

export default FormFood;

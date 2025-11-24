"use client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { useRef, useState, ChangeEvent, useEffect, Fragment } from "react";
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
import { setSelectedFile } from "@/lib/slices/google-drive-slice";
import { SupabaseClient } from "@supabase/supabase-js";
import Image from "next/image";

// Validation schema
const photoSchema = z.object({
  photoName: z
    .string()
    .min(1, "Photo name is required")
    .max(128, "Max 128 characters"),
  photoFile: z.any().refine((file) => !!file, "Photo file is required"),
});

type PhotoValues = z.infer<typeof photoSchema>;

const FormGoogleDrive = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();
  const { selectedFile } = useAppSelector((state) => state.googleDrive);
  const { user } = useAppSelector((state) => state.auth);

  // At edit time, initial 'photoFile' is a string (photo url), not File
  const form = useForm<PhotoValues>({
    resolver: zodResolver(photoSchema),
    defaultValues: {
      photoName: selectedFile?.title || "",
      photoFile: selectedFile?.google_drive_photo_url || undefined,
    },
  });

  // Set initial preview url from selectedFile, if present
  useEffect(() => {
    if (selectedFile && selectedFile.google_drive_photo_url) {
      setPreviewUrl(selectedFile.google_drive_photo_url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  // Reset form values and preview url when selectedFile changes
  useEffect(() => {
    if (selectedFile) {
      form.reset({
        photoName: selectedFile.title || "",
        photoFile: selectedFile.google_drive_photo_url,
      });
      setPreviewUrl(selectedFile.google_drive_photo_url || null);
    } else {
      form.reset({
        photoName: "",
        photoFile: undefined,
      });
      setPreviewUrl(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const onSubmit = async (values: PhotoValues) => {
    setIsLoading(true);
    try {
      const supabase = supabaseClient();

      let imageUrl: string | null = null;

      // If we're editing (selectedFile exists),
      // photoFile may still be the old photoUrl, or it may be a File.
      if (selectedFile?.id) {
        const updateObject: Record<string, any> = {
          title: values.photoName.trim(),
        };

        // If the photo file is a File (changed), upload and set new url.
        if (values.photoFile instanceof File) {
          imageUrl = await uploadImage(supabase, values.photoFile);
          updateObject.google_drive_photo_url = imageUrl;
        }
        // If photoFile is not a File (string), just keep the url (unchanged), do not set google_drive_photo_url.

        const { error } = await supabase
          .from("google_drives")
          .update(updateObject)
          .eq("id", selectedFile.id);

        if (error) throw new Error(error.message);

        dispatch(setSelectedFile(null));
        showToast("Successfully updated secret message!", "success");
      } else {
        // In create mode, photoFile must be File
        if (values.photoFile instanceof File) {
          imageUrl = await uploadImage(supabase, values.photoFile);
        }
        const { error } = await supabase.from("google_drives").insert({
          title: values.photoName.trim(),
          google_drive_photo_url: imageUrl,
          user_id: user?.id,
        });
        if (error) throw new Error(error.message);
        showToast("Successfully added secret message!", "success");
      }

      // Clear the file input and preview after successful upload
      form.reset({ photoName: "", photoFile: undefined });
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save message";
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
      .from("google-drive-images")
      .upload(filePath, file);
    if (error) showToast(error.message, "error");

    const { data } = supabase.storage
      .from("google-drive-images")
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleCancelEdit = () => {
    form.reset({ photoName: "", photoFile: "" });
    dispatch(setSelectedFile(null));
  };

  return (
    <section className="w-full px-4 py-8">
      <Card className="mx-auto w-full max-w-3xl border-none bg-white/80 shadow-xl backdrop-blur">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">
            Upload Photo to Google Drive
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-linear-to-b from-slate-50 to-white/80 p-5 shadow-[0_18px_55px_-45px_rgba(15,23,42,0.6)]"
            >
              {/* Photo Title Field */}
              <FormField
                control={form.control}
                name="photoName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="photo-title">Title</FormLabel>
                    <FormControl>
                      <Input
                        id="photo-title"
                        {...field}
                        placeholder="Enter photo name"
                        className="resize-none"
                        maxLength={128}
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
                    <FormLabel htmlFor="photo-file">Photo File</FormLabel>
                    <FormControl>
                      <Input
                        id="photo-file"
                        type="file"
                        accept="image/png,image/jpg,image/jpeg"
                        ref={fileInputRef}
                        // Manually handle file selection for preview and react-hook-form
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const file = e.target.files && e.target.files[0];
                          field.onChange(
                            file ||
                              selectedFile?.google_drive_photo_url ||
                              undefined
                          );

                          // Cleanup previous previewUrl if it was a blob
                          if (previewUrl && previewUrl.startsWith("blob:")) {
                            URL.revokeObjectURL(previewUrl);
                          }
                          if (file) {
                            setPreviewUrl(URL.createObjectURL(file));
                          } else if (selectedFile?.google_drive_photo_url) {
                            setPreviewUrl(selectedFile.google_drive_photo_url);
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
                      {selectedFile?.id ? "Update" : "Upload"}
                      <Send className="ml-2 size-4" />
                    </>
                  )}
                </Button>
                {selectedFile?.id && (
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

export default FormGoogleDrive;

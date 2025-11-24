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
import {
  setSelectedPokemon,
  addPokemon,
} from "@/lib/slices/pokemon-review-slice";
import { SupabaseClient } from "@supabase/supabase-js";
import Image from "next/image";
import { Textarea } from "../ui/textarea";

// Validation schema for pokemon
const pokemonSchema = z.object({
  title: z.string().min(1, "Pokemon title is required"),
  description: z
    .string()
    .min(1, "Pokemon description is required")
    .max(128, "Max 128 characters"),
  photoFile: z.any().refine((file) => !!file, "Photo file is required"),
});

type PokemonValues = z.infer<typeof pokemonSchema>;

const FormPokemon = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();
  const { selectedPokemon } = useAppSelector((state) => state.pokemon);
  const { user } = useAppSelector((state) => state.auth);

  // At edit time, initial 'photoFile' is a string (photo url), not File
  const form = useForm<PokemonValues>({
    resolver: zodResolver(pokemonSchema),
    defaultValues: {
      title: selectedPokemon?.title || "",
      description: selectedPokemon?.description || "",
      photoFile: selectedPokemon?.pokemon_image_url || undefined,
    },
  });

  // Set initial preview url from selectedPokemon, if present
  useEffect(() => {
    if (selectedPokemon && selectedPokemon.pokemon_image_url) {
      setPreviewUrl(selectedPokemon.pokemon_image_url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedPokemon]);

  // Reset form values and preview url when selectedPokemon changes
  useEffect(() => {
    if (selectedPokemon) {
      form.reset({
        title: selectedPokemon.title || "",
        description: selectedPokemon.description || "",
        photoFile: selectedPokemon.pokemon_image_url,
      });
      setPreviewUrl(selectedPokemon.pokemon_image_url || null);
    } else {
      form.reset({
        title: "",
        description: "",
        photoFile: undefined,
      });
      setPreviewUrl(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPokemon]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const onSubmit = async (values: PokemonValues) => {
    setIsLoading(true);
    try {
      const supabase = supabaseClient();

      let imageUrl: string | null = null;

      // If we're editing (selectedPokemon exists),
      // photoFile may still be the old photoUrl, or it may be a File.
      if (selectedPokemon?.id) {
        const updateObject: Record<string, any> = {
          title: values?.title?.trim(),
          description: values?.description?.trim(),
        };

        // If the photo file is a File (changed), upload and set new url.
        if (values.photoFile instanceof File) {
          imageUrl = await uploadImage(supabase, values.photoFile);
          updateObject.pokemon_image_url = imageUrl;
        }
        // If photoFile is not a File (string), just keep the url (unchanged), do not set pokemon_image_url.

        const { error } = await supabase
          .from("pokemons")
          .update(updateObject)
          .eq("id", selectedPokemon.id);

        if (error) throw new Error(error.message);

        dispatch(setSelectedPokemon(null));
        showToast("Successfully updated pokemon!", "success");
      } else {
        // In create mode, photoFile must be File
        if (values.photoFile instanceof File) {
          imageUrl = await uploadImage(supabase, values.photoFile);
        }
        const { data, error } = await supabase
          .from("pokemons")
          .insert({
            title: values?.title?.trim(),
            description: values?.description?.trim(),
            pokemon_image_url: imageUrl,
            user_id: user?.id,
          })
          .select()
          .single();
        if (error) throw new Error(error.message);

        if (data) {
          dispatch(addPokemon(data));
        }
        showToast("Successfully added pokemon!", "success");
      }

      // Clear the file input and preview after successful upload
      form.reset({ title: "", photoFile: undefined });
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save pokemon";
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
      .from("pokemon-images")
      .upload(filePath, file);
    if (error) showToast(error.message, "error");

    const { data } = supabase.storage
      .from("pokemon-images")
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  return (
    <section className="w-full px-4 py-8">
      <Card className="mx-auto w-full max-w-3xl border-none bg-white/80 shadow-xl backdrop-blur">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Add Pokémon</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-linear-to-b from-slate-50 to-white/80 p-5 shadow-[0_18px_55px_-45px_rgba(15,23,42,0.6)]"
            >
              {/* Pokemon Name Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="pokemon-name">Title</FormLabel>
                    <FormControl>
                      <Input
                        id="pokemon-name"
                        {...field}
                        placeholder="Enter title"
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
                    <FormLabel htmlFor="photo">Photo</FormLabel>
                    <FormControl>
                      <Input
                        id="photo"
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        // Manually handle file selection for preview and react-hook-form
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const file = e.target.files && e.target.files[0];
                          field.onChange(
                            file ||
                              selectedPokemon?.pokemon_image_url ||
                              undefined
                          );

                          // Cleanup previous previewUrl if it was a blob
                          if (previewUrl && previewUrl.startsWith("blob:")) {
                            URL.revokeObjectURL(previewUrl);
                          }
                          if (file) {
                            setPreviewUrl(URL.createObjectURL(file));
                          } else if (selectedPokemon?.pokemon_image_url) {
                            setPreviewUrl(selectedPokemon.pokemon_image_url);
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
                      {selectedPokemon ? "Update" : "Upload"}
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

export default FormPokemon;

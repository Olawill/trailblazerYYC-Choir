"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useGoogleFonts } from "@/hooks/use-google-fonts";
import { cn } from "@/lib/utils";
import { useFontStore } from "@/store/font-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BeatLoader } from "react-spinners";
import { toast } from "sonner";
import { z } from "zod";

const appearanceFormSchema = z.object({
  theme: z.enum(["light", "dark"], {
    message: "Please select a theme.",
  }),
  // font: z.enum(["Inter", "Manrope", "System"], {
  font: z.string().min(1, {
    message: "Please select a font.",
  }),
});

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<AppearanceFormValues> = {
  theme: "light",
};

export function AppearanceForm() {
  const { setTheme } = useTheme();
  const { setMode, setFont, font, hydrated } = useFontStore();

  const [open, setOpen] = useState(false);

  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues,
  });

  const { data } = useGoogleFonts();

  useEffect(() => {
    if (hydrated) {
      form.reset({
        theme: useFontStore.getState().mode,
        font: font,
      });
    }
  }, [hydrated]);

  function onSubmit(data: AppearanceFormValues) {
    setMode(data.theme);
    setFont(data.font);

    toast.success("Font and Theme updated successfully");
  }

  if (!hydrated) {
    return (
      <Card className="h-full p-40 flex flex-col items-center justify-center my-auto bg-transparent border-none shadow-none">
        <BeatLoader size={20} />
        <span>Fonts Loading...</span>
      </Card>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="font"
          render={({ field }) => (
            <FormItem className="space-y-1 flex flex-col">
              <FormLabel>Font</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      role="combobox"
                      aria-expanded={open}
                      className="w-[280px] justify-between"
                      variant="outline"
                    >
                      {(field.value || font) ?? "Select a font"}
                      <ChevronsUpDownIcon className="ml-auto size-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Command value={field.value || font}>
                    <CommandInput
                      placeholder="Search font family"
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No fonts found.</CommandEmpty>
                      <CommandGroup>
                        {(data ? ["Default", ...data] : ["Default"])?.map(
                          (font, i) => (
                            <CommandItem
                              key={i}
                              value={font}
                              onSelect={(currentValue) => {
                                field.onChange(currentValue);
                                setFont(currentValue);
                                setOpen(false);
                              }}
                            >
                              <span
                                style={{
                                  fontFamily: `${font}, ui-serif`,
                                }}
                              >
                                {font}
                              </span>
                              <CheckCheckIcon
                                className={cn(
                                  "ml-auto size-4",
                                  field.value === font
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          ),
                        )}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription className="text-gray-300">
                Set the font you want to use in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="font"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Font</FormLabel>
              <div className="relative w-40">
                <Select
                  value={field.value ?? font}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger
                      className={cn(
                        buttonVariants({
                          variant: "outline",
                          className:
                            "flex items-center justify-between bg-muted text-primary",
                        }),
                        "w-[280px] appearance-none font-normal",
                      )}
                    >
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Default">Default</SelectItem>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Manrope">Manrope</SelectItem>
                    <SelectItem value="System">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <FormDescription className="text-gray-300">
                Set the font you want to use in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Theme</FormLabel>
              <FormDescription className="text-gray-300">
                Select the theme for the dashboard.
              </FormDescription>
              <FormMessage />
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid max-w-md grid-cols-2 gap-8 pt-2"
              >
                <FormItem onClick={() => setTheme("light")}>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                    <FormControl>
                      <RadioGroupItem value="light" className="sr-only" />
                    </FormControl>
                    <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                      <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                        <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                          <div className="h-2 w-20 rounded-lg bg-[#ecedef]" />
                          <div className="h-2 w-25 rounded-lg bg-[#ecedef]" />
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                          <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                          <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                        </div>
                      </div>
                    </div>
                    <span className="block w-full p-2 text-center font-normal">
                      Light
                    </span>
                  </FormLabel>
                </FormItem>

                <FormItem onClick={() => setTheme("dark")}>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                    <FormControl>
                      <RadioGroupItem value="dark" className="sr-only" />
                    </FormControl>
                    <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
                      <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                        <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                          <div className="h-2 w-20 rounded-lg bg-slate-400" />
                          <div className="h-2 w-25 rounded-lg bg-slate-400" />
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-slate-400" />
                          <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-slate-400" />
                          <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                        </div>
                      </div>
                    </div>
                    <span className="block w-full p-2 text-center font-normal">
                      Dark
                    </span>
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormItem>
          )}
        />

        <div className="justify-self-end">
          <Button type="submit" className="cursor-pointer">
            Update preferences
          </Button>
        </div>
      </form>
    </Form>
  );
}

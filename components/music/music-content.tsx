"use client";

import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { FormControl } from "../ui/form";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

interface ContentProps {
  type: "Verse" | "Chorus" | "Bridge";
  content: string;
}

interface MusicContentProps {
  contents?: ContentProps[];
}

export const MusicContent = ({
  contents: initialContents = [{ type: "Verse", content: "" }],
}: MusicContentProps) => {
  const { control } = useFormContext();
  const { append } = useFieldArray({
    control,
    name: "contents",
  });

  const [contentState, setContentState] = useState(initialContents);
  // useEffect(() => {
  //   if (initialContents.length > 0) {
  //     initialContents.forEach((content) => {
  //       append(content);
  //     });
  //   }
  // }, [initialContents, append]);

  // Function to add a new empty content item
  // const handleAddField = () => {
  //   initialContents.push({ type: "Verse", content: "" }); // Default values
  // };
  const handleAddField = () => {
    setContentState((prev) => [...prev, { type: "Verse", content: "" }]); // Default values
  };

  return (
    <ScrollArea className="h-[300px] px-1">
      {contentState.map((field, index) => (
        <div key={index} className="space-y-4">
          <Label htmlFor={`content[${index}].type`} className="text-xs">
            Type
          </Label>
          <Controller
            name={`content[${index}].type`}
            control={control}
            defaultValue={field.type || "Verse"}
            render={({ field: controllerField }) => (
              <Select
                onValueChange={controllerField.onChange}
                defaultValue={controllerField.value}
              >
                <FormControl>
                  <SelectTrigger className="focus:ring-px">
                    <SelectValue>
                      {controllerField.value || "Select a type"}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Verse">Verse</SelectItem>
                  <SelectItem value="Chorus">Chorus</SelectItem>
                  <SelectItem value="Bridge">Bridge</SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          <Label htmlFor={`content[${index}].content`} className="text-xs mt-2">
            Content
          </Label>
          <Controller
            name={`content[${index}].content`}
            control={control}
            defaultValue={field.content}
            render={({ field: controllerField }) => (
              <Textarea
                placeholder="Enter content here..."
                rows={5}
                className="resize-none focus-visible:ring-px"
                {...controllerField}
              />
            )}
          />
        </div>
      ))}
      <div className="flex justify-end">
        <Button
          type="button"
          size="icon"
          aria-label="Add verse, chorus or bridge"
          className="bg-background dark:text-gray-300 focus-visible:ring-px hover:bg-transparent"
          onClick={handleAddField}
        >
          <PlusCircle className="w-4 h-4" />
        </Button>
      </div>
    </ScrollArea>
  );
};

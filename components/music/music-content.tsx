"use client";

import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormControl } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MinusCircle, MoveDown, MoveUp, PlusCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "../ui/input";

interface ContentProps {
  id?: string;
  type: "Verse" | "Chorus" | "Bridge";
  content: string;
}

interface MusicContentProps {
  contents?: ContentProps[];
  reload: boolean;
}

export const MusicContent = ({
  contents: initialContents = [{ type: "Verse", content: "" }],
  reload,
}: MusicContentProps) => {
  const { control } = useFormContext();
  const { append, replace } = useFieldArray({
    control,
    name: "contents",
  });

  const [contentState, setContentState] = useState(initialContents);

  const handleAddField = () => {
    setContentState((prev) => [...prev, { type: "Verse", content: "" }]); // Default values
  };

  const handleRemoveField = () => {
    setContentState((prev) => prev.slice(0, -1)); // Default values
  };

  // const handleContentMove = (index: number, direction: "up" | "down") => {
  //   const newContentState = [...contentState];
  //   if (
  //     (index < 0 && direction === "up") ||
  //     (index === contentState.length - 1 && direction === "down")
  //   )
  //     return;

  //   const [elementAtIndex] = newContentState.splice(index, 1);

  //   // Insert the element at the new position
  //   const newIndex = direction === "up" ? index - 1 : index + 1;
  //   newContentState.splice(newIndex, 0, elementAtIndex);

  //   // setContentState(newContentState);
  //   // Update the field array with the new order
  //   replace(newContentState);
  // };

  useEffect(() => {
    if (reload) {
      setContentState(initialContents);
      replace(initialContents);
    }
  }, [reload]);

  return (
    <ScrollArea className="h-[300px] px-1">
      {contentState.map((field, index) => (
        <div key={index} className="space-y-4">
          {field.id && (
            <Controller
              name={`content[${index}].id`}
              control={control}
              defaultValue={field.id}
              render={({ field: controllerField }) => (
                <Input type="hidden" {...controllerField} />
              )}
            />
          )}
          <Label
            htmlFor={`content[${index}].type`}
            className="text-xs flex items-center justify-between"
          >
            <span>Type</span>
            {/* <div className="flex justify-end items-center gap-x-2">
              {index !== 0 && (
                <Button
                  type="button"
                  size="icon"
                  aria-label="move up"
                  className="bg-background border rounded-full text-gray-500 dark:text-gray-300 focus-visible:ring-px hover:bg-transparent"
                  onClick={() => handleContentMove(index, "up")}
                >
                  <MoveUp className="h-4 w-4" />
                </Button>
              )}

              {index !== contentState.length - 1 && (
                <Button
                  type="button"
                  size="icon"
                  aria-label="move down"
                  className="bg-background border rounded-full text-gray-500 dark:text-gray-300 focus-visible:ring-px hover:bg-transparent"
                  onClick={() => handleContentMove(index, "down")}
                >
                  <MoveDown className="h-4 w-4" />
                </Button>
              )}
            </div> */}
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
      <div className="flex justify-end items-center">
        {contentState.length > 1 && (
          <Button
            type="button"
            size="icon"
            aria-label="remove verse, chorus or bridge"
            className="bg-background text-gray-500 dark:text-gray-300 focus-visible:ring-px hover:bg-transparent"
            onClick={handleRemoveField}
          >
            <MinusCircle className="w-4 h-4" />
          </Button>
        )}
        <Button
          type="button"
          size="icon"
          aria-label="Add verse, chorus or bridge"
          className="bg-background text-gray-500 dark:text-gray-300 focus-visible:ring-px hover:bg-transparent"
          onClick={handleAddField}
        >
          <PlusCircle className="w-4 h-4" />
        </Button>
      </div>
    </ScrollArea>
  );
};

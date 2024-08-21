"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export const BrowseSearch = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="flex items-center">
      <Input
        className="w-[250px] md:w-[300px] bg-transparent rounded-r-none focus-visible:ring-px placeholder:text-gray-300"
        placeholder="Filter music list..."
        defaultValue={searchParams.get("query"?.toString()) || ""}
        onChange={(e) => handleSearch(e.target.value)}
      />

      <div className="relative h-10 w-8 border border-l-transparent text-white bg-slate-300 rounded-e-md">
        <Search className="w-6 h-6 absolute inset-0 m-auto" />
      </div>
    </div>
  );
};

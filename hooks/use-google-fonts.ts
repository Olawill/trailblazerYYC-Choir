import { PAGE_SIZE_DEFAULT } from "@/app/api/fonts/[category]/route";
import { useInfiniteQuery } from "@tanstack/react-query";

type FontsResponse = {
  items: string[];
  nextCursor: number | null;
};

export const useGoogleFonts = (category: string) => {
  return useInfiniteQuery<FontsResponse>({
    queryKey: ["google-fonts", category],
    queryFn: async ({ pageParam }): Promise<FontsResponse> => {
      const cursor = pageParam as number;

      const res = await fetch(
        `/api/fonts/${category}?limit=${PAGE_SIZE_DEFAULT}&cursor=${cursor}`,
      );

      if (!res.ok) throw new Error("Failed to load fonts");
      return res.json();
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
    // ✅ 30 days
    staleTime: 1000 * 60 * 60 * 24 * 30,

    // ❌ do NOT refetch on focus / reconnect
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: Boolean(category),
  });
};

import { useQuery } from "@tanstack/react-query";

export const useGoogleFonts = () => {
  return useQuery({
    queryKey: ["google-fonts"],
    queryFn: async (): Promise<string[]> => {
      const res = await fetch("/api/fonts");

      if (!res.ok) throw new Error("Failed to load fonts");
      return res.json();
    },
    // ✅ 30 days
    staleTime: 1000 * 60 * 60 * 24 * 30,

    // ❌ do NOT refetch on focus / reconnect
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

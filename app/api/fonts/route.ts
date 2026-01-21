import { NextResponse } from "next/server";

export const GET = async () => {
  const res = await fetch(
    `https://www.googleapis.com/webfonts/v1/webfonts?key=${process.env.GOOGLE_FONTS_API_KEY}`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch fonts" },
      { status: 500 },
    );
  }

  const data = await res.json();

  const fonts = data.items
    .filter((f: any) => f.category === "sans-serif")
    .map((f: any) => f.family);

  return NextResponse.json(fonts);
};

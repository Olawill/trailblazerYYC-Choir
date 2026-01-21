import { NextResponse } from "next/server";

export const PAGE_SIZE_DEFAULT = 50;

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ category: string }> },
) => {
  const { category } = await params;
  const { searchParams } = new URL(request.url);

  const limit =
    category === "all"
      ? 100
      : Number(searchParams.get("limit")) || PAGE_SIZE_DEFAULT;
  const cursor = Number(searchParams.get("cursor")) || 0;

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
    .filter((f: any) => category === "all" || f.category === category)
    .map((f: any) => f.family);

  const page = fonts.slice(cursor, cursor + limit);

  return NextResponse.json({
    items: page,
    nextCursor: cursor + limit < fonts.length ? cursor + limit : null,
  });
};

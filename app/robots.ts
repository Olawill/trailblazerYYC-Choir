import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/members", "/finance", "/admin/*"],
      disallow: "/api",
    },
    sitemap: "https://trailblazer-yyc.vercel.app/sitemap.xml",
  };
}

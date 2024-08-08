import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://trailblazer-yyc.vercel.app",
      lastModified: new Date(),
    },
    {
      url: "https://trailblazer-yyc.vercel.app/members",
      lastModified: new Date(),
    },
    {
      url: "https://trailblazer-yyc.vercel.app/finance",
      lastModified: new Date(),
    },
    {
      url: "https://trailblazer-yyc.vercel.app/admin",
      lastModified: new Date(),
    },
    {
      url: "https://trailblazer-yyc.vercel.app/admin/manage-finance",
      lastModified: new Date(),
    },
    {
      url: "https://trailblazer-yyc.vercel.app/admin/manage-users",
      lastModified: new Date(),
    },
  ];
}

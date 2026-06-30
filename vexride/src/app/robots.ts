import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://vexride.app";
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/pricing", "/sign-in", "/sign-up"],
      disallow: ["/dashboard", "/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}

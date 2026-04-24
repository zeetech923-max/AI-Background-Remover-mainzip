import { Router, type IRouter } from "express";
import { db, postsTable, settingsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

function getSiteUrl(req: Express.Request & { headers?: Record<string, string | string[] | undefined> }): string {
  const headers = (req as unknown as { headers: Record<string, string | string[] | undefined> }).headers;
  const proto = (headers["x-forwarded-proto"] as string) || "https";
  const host = (headers["x-forwarded-host"] as string) || (headers.host as string) || "localhost";
  return `${proto}://${host}`;
}

router.get("/sitemap.xml", async (req, res) => {
  const posts = await db
    .select()
    .from(postsTable)
    .where(eq(postsTable.published, true))
    .orderBy(desc(postsTable.updatedAt));

  const base = getSiteUrl(req as never);
  const staticPaths = ["/", "/remove", "/features", "/how-it-works", "/articles", "/about", "/contact", "/security", "/terms"];

  const urls = [
    ...staticPaths.map(
      (p) => `<url><loc>${base}${p}</loc><changefreq>weekly</changefreq></url>`,
    ),
    ...posts
      .filter((p) => !p.noindex)
      .map(
        (p) =>
          `<url><loc>${base}/articles/${p.slug}</loc><lastmod>${p.updatedAt.toISOString()}</lastmod><changefreq>monthly</changefreq></url>`,
      ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;
  res.type("application/xml").send(xml);
});

router.get("/robots.txt", async (req, res) => {
  const rows = await db.select().from(settingsTable).where(eq(settingsTable.key, "robots_disallow_all"));
  const blockAll = rows[0]?.value === "true";
  const base = getSiteUrl(req as never);
  const body = blockAll
    ? `User-agent: *\nDisallow: /\n`
    : `User-agent: *\nDisallow: /admin\n\nSitemap: ${base}/api/sitemap.xml\n`;
  res.type("text/plain").send(body);
});

export default router;

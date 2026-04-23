import { Router, type IRouter } from "express";
import { z } from "zod";
import { db, postsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { isAuthed, requireAdmin } from "../lib/auth";

const router: IRouter = Router();

const PostBody = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "lowercase letters, numbers, hyphens only"),
  title: z.string().min(1),
  excerpt: z.string().default(""),
  content: z.string().default(""),
  coverImageUrl: z.string().optional().nullable(),
  published: z.boolean().default(false),
});

router.get("/posts", async (req, res) => {
  const all = await db.select().from(postsTable).orderBy(desc(postsTable.createdAt));
  const visible = isAuthed(req) ? all : all.filter((p) => p.published);
  res.json({ posts: visible });
});

router.get("/posts/:slug", async (req, res) => {
  const rows = await db.select().from(postsTable).where(eq(postsTable.slug, req.params.slug)).limit(1);
  const post = rows[0];
  if (!post || (!post.published && !isAuthed(req))) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({ post });
});

router.post("/admin/posts", requireAdmin, async (req, res) => {
  const parsed = PostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  try {
    const [created] = await db.insert(postsTable).values(parsed.data).returning();
    res.json({ post: created });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

router.put("/admin/posts/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const parsed = PostBody.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  try {
    const [updated] = await db
      .update(postsTable)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(postsTable.id, id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json({ post: updated });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

router.delete("/admin/posts/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(postsTable).where(eq(postsTable.id, id));
  res.json({ ok: true });
});

export default router;

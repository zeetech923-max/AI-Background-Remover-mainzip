import { Router, type IRouter } from "express";
import { z } from "zod";
import { db, galleryImagesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "../lib/auth";

const router: IRouter = Router();

router.get("/gallery", async (_req, res) => {
  const images = await db.select().from(galleryImagesTable).orderBy(desc(galleryImagesTable.createdAt));
  res.json({ images });
});

const UploadBody = z.object({
  filename: z.string().min(1),
  dataUrl: z.string().regex(/^data:image\//, "Must be a data:image/* URL"),
});

router.post("/admin/gallery", requireAdmin, async (req, res) => {
  const parsed = UploadBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const size = Math.floor(parsed.data.dataUrl.length * 0.75);
  if (size > 8 * 1024 * 1024) {
    res.status(413).json({ error: "Image too large (max ~8MB)" });
    return;
  }
  const [created] = await db
    .insert(galleryImagesTable)
    .values({ filename: parsed.data.filename, dataUrl: parsed.data.dataUrl, size })
    .returning();
  res.json({ image: created });
});

router.delete("/admin/gallery/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(galleryImagesTable).where(eq(galleryImagesTable.id, id));
  res.json({ ok: true });
});

export default router;

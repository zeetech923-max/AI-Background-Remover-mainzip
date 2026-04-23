import { Router, type IRouter } from "express";
import { z } from "zod";
import { db, settingsTable } from "@workspace/db";
import { sql } from "drizzle-orm";
import { requireAdmin } from "../lib/auth";

const router: IRouter = Router();

router.get("/settings", async (_req, res) => {
  const rows = await db.select().from(settingsTable);
  const map: Record<string, string> = {};
  for (const r of rows) map[r.key] = r.value;
  res.json({ settings: map });
});

const SettingsBody = z.object({ settings: z.record(z.string(), z.string()) });

router.put("/admin/settings", requireAdmin, async (req, res) => {
  const parsed = SettingsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const entries = Object.entries(parsed.data.settings);
  for (const [key, value] of entries) {
    await db
      .insert(settingsTable)
      .values({ key, value, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: settingsTable.key,
        set: { value, updatedAt: new Date() },
      });
  }
  res.json({ ok: true });
});

export default router;

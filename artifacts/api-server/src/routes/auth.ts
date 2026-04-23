import { Router, type IRouter } from "express";
import { z } from "zod";
import { issueAdminCookie, clearAdminCookie, isAuthed, ADMIN_PASSWORD } from "../lib/auth";

const router: IRouter = Router();

const LoginBody = z.object({ password: z.string().min(1) });

router.post("/admin/login", (req, res) => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  if (parsed.data.password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Wrong password" });
    return;
  }
  issueAdminCookie(res);
  res.json({ ok: true });
});

router.post("/admin/logout", (_req, res) => {
  clearAdminCookie(res);
  res.json({ ok: true });
});

router.get("/admin/me", (req, res) => {
  res.json({ authenticated: isAuthed(req) });
});

export default router;

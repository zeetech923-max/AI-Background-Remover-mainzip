import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import postsRouter from "./posts";
import settingsRouter from "./settings";
import galleryRouter from "./gallery";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(postsRouter);
router.use(settingsRouter);
router.use(galleryRouter);

export default router;

import { Router, Response, Request } from "express";
import "passport";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  if (req.isAuthenticated) {
    res.redirect("/user/dashboard");
  } else if (!req.isAuthenticated) {
    res.redirect("/login");
  }
});

export default router;
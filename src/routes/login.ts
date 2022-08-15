import { Router, Request, Response } from "express";
import passport from "passport";
import UserValidators from "../middleware/validators/userValidators";
import DatabaseHelpers from "../utils/databaseHelpers";

const router = Router();

router.post(
  "/",
  UserValidators.loginUserValidator,
  UserValidators.validate,
  passport.authenticate("local"),
  async (req: Request, res: Response) => {
    try {
      const response = await DatabaseHelpers.getAllData({
        username: req.body.username,
      });

      return res.json(response);
    } catch (err) {
      return res.status(401).json({ error: err });
    }
  }
);

export default router;
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const verifyJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // this needs to moved to middleware
  // extract token from the req header
  console.log("Token:\n" + req.header("Authorization"));
  const token = req.header("Authorization").split(" ")[1];

  if (!token || token == "undefined") {
    res.status(401).send("No token found");
  } else {
    try {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded: JwtPayload) => {
        if (err) {
          res.status(401).send(err);
        } else {
          console.log(decoded);
          req.body.userID = decoded.userID;
          next();
        }
      });
    } catch (err) {
      res.send("Error");
    }
  }
};

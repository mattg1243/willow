import { Request, Response, NextFunction} from "express";
// forces https
export default function forceHttps(req: Request, res: Response, next: NextFunction) {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    return res.redirect('https://' + req.headers.host + req.url);
  }

  next();
}
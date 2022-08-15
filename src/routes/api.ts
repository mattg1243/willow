import { Router, Response, Request } from "express";
import ApiHandlers from "../handlers/apiHandlers";

const router = Router();
// get all clients that belong to a user
router.get("/clientslist", (req: Request, res: Response) => {
  ApiHandlers.getClientsList(req, res);
});

// get all events that belong to a client
router.get("/eventslist", (req: Request, res: Response) => {
  ApiHandlers.getEventsList(req, res);
});

// get a single client
router.get("/client", (req: Request, res: Response) => {
  ApiHandlers.getClient(req, res);
});

// get a single event
router.get("/event", (req: Request, res: Response) => {
  ApiHandlers.getEvent(req, res);
});

export default router;
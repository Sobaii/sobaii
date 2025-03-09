import { Router } from "express";
import {
  createSupportTicket,
  getAllSupportTickets,
  getSupportTicketById,
  updateSupportTicket,
  deleteSupportTicket,
  addSupportTicketMessage,
  updateSupportTicketMessage,
  deleteSupportTicketMessage,
} from "../controllers/supportControllers.js";

const router = Router();

router.post("/", createSupportTicket);
router.get("/", getAllSupportTickets);
router.get("/:id", getSupportTicketById);
router.put("/:id", updateSupportTicket);
router.delete("/:id", deleteSupportTicket);
router.post("/:id/messages", addSupportTicketMessage);
router.put("/messages/:messageId", updateSupportTicketMessage);
router.delete("/messages/:messageId", deleteSupportTicketMessage);

export default router;
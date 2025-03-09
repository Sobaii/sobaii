import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createSupportTicket = async (req: Request, res: Response) => {
  try {
    const { userId, name, severity, status } = req.body;
    const ticket = await prisma.supportTicket.create({
      data: {
        userId,
        name,
        severity: severity || 0,
        status: status || "open",
      },
    });
    res.status(201).json(ticket);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllSupportTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await prisma.supportTicket.findMany({
      include: { messages: true },
    });
    res.json(tickets);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getSupportTicketById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
      include: { messages: true },
    });
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    res.json(ticket);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSupportTicket = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, severity, status } = req.body;
    const ticket = await prisma.supportTicket.update({
      where: { id },
      data: { name, severity, status },
    });
    res.json(ticket);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteSupportTicket = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    // Delete attached messages first
    await prisma.supportTicketMessage.deleteMany({
      where: { ticketId: id },
    });
    const ticket = await prisma.supportTicket.delete({
      where: { id },
    });
    res.json(ticket);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const addSupportTicketMessage = async (req: Request, res: Response) => {
  try {
    const ticketId = parseInt(req.params.id, 10);
    const { content, sender } = req.body;
    const message = await prisma.supportTicketMessage.create({
      data: {
        ticketId,
        content,
        sender,
      },
    });
    res.status(201).json(message);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSupportTicketMessage = async (req: Request, res: Response) => {
  try {
    const messageId = parseInt(req.params.messageId, 10);
    const { content } = req.body;
    const message = await prisma.supportTicketMessage.update({
      where: { id: messageId },
      data: { content },
    });
    res.json(message);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteSupportTicketMessage = async (req: Request, res: Response) => {
  try {
    const messageId = parseInt(req.params.messageId, 10);
    const message = await prisma.supportTicketMessage.delete({
      where: { id: messageId },
    });
    res.json(message);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
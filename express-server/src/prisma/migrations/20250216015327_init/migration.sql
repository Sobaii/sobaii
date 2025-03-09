/*
  Warnings:

  - Added the required column `sender` to the `SupportTicketMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SupportTicketMessage" ADD COLUMN     "sender" TEXT NOT NULL;

import { IAggregateInboxFormData } from "@/types/api";
import fetchWrapper from "./fetchWrapper";

const baseUrl = `${import.meta.env.VITE_SERVER_URL}/expenses`;

export const getS3FileUrl = async (fileName: string) => {
  const url = `${baseUrl}/fileUrl/${fileName}`;
  const options = {
    method: "GET",
  };

  try {
    const response = await fetchWrapper(url, options);
    return response.url;
  } catch (error) {
    console.error("Failed to read S3 file:", error);
    throw error;
  }
};

export const downloadExpensesXLSX = async (
  spreadsheetId: string,
  selectedFields: string[]
) => {
  const url = `${baseUrl}/download/${spreadsheetId}`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ selectedFields }),
  };

  try {
    const response = await fetchWrapper(url, options, false);
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", "Expenses.xlsx");
    document.body.appendChild(link);
    link.click();
    link?.parentNode?.removeChild(link);
  } catch (error) {
    console.error("Failed to download XLSX:", error);
    throw error;
  }
};

export const uploadMultiPageExpenses = async (
  file: File,
  spreadsheetId: string
) => {
  const formData = new FormData();
  formData.append("file", file);
  if (spreadsheetId) {
    formData.append("spreadsheetId", spreadsheetId);
  }

  const options = {
    method: "POST",
    body: formData,
  };

  return await fetchWrapper(`${baseUrl}/uploadMultiPageExpenses`, options);
};

export const uploadExpenses = async (
  files: File[],
  spreadsheetId: string | null
) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  if (spreadsheetId) {
    formData.append("spreadsheetId", spreadsheetId);
  }

  const options = {
    method: "POST",
    body: formData,
  };

  return await fetchWrapper(`${baseUrl}/upload`, options);
};

export const createSpreadsheet = async (spreadsheetName: string) => {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ spreadsheetName }),
  };
  return await fetchWrapper(`${baseUrl}/create-spreadsheet`, options);
};

export const deleteSpreadsheet = async (spreadsheetId: string) => {
  const options = {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ spreadsheetId }),
  };
  return await fetchWrapper(`${baseUrl}/delete-spreadsheet`, options);
};

export const aggregateInbox = async (formData: IAggregateInboxFormData) => {
  const { emailCredentials, searchCriteria, targetSpreadsheetId } = formData;
  const { emailAddress, appPassword } = emailCredentials[0];
  const { dateRange, filters } = searchCriteria;
  const { subject, body, senderAddress } = filters;

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: emailAddress,
      appPassword,
      spreadsheetId: targetSpreadsheetId,
      startDate: dateRange.start,
      endDate: dateRange.end,
      subject,
      body,
      sender: senderAddress,
    }),
  };
  return await fetchWrapper(`${baseUrl}/aggregate-inbox`, options);
};

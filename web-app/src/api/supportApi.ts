import fetchWrapper from "./fetchWrapper";

const baseUrl = `${import.meta.env.VITE_SERVER_URL}`; 

// Create a new support ticket
export const createSupportTicket = async (ticketData: object) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ticketData),
  };
  return await fetchWrapper(`${baseUrl}/support`, options);
};

// Get all support tickets
export const getAllSupportTickets = async () => {
  const options = {
    method: "GET",
  };
  return await fetchWrapper(`${baseUrl}/support`, options);
};

// Get a support ticket by ID
export const getSupportTicketById = async (id: string) => {
  const options = {
    method: "GET",
  };
  return await fetchWrapper(`${baseUrl}/support/${id}`, options);
};

// Update a support ticket by ID
export const updateSupportTicket = async (id: string, updates: object) => {
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  };
  return await fetchWrapper(`${baseUrl}/support/${id}`, options);
};

// Delete a support ticket by ID
export const deleteSupportTicket = async (id: string) => {
  const options = {
    method: "DELETE",
  };
  return await fetchWrapper(`${baseUrl}/support/${id}`, options);
};

// Add a message to a support ticket
export const addSupportTicketMessage = async (ticketId: string, message: object) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  };
  return await fetchWrapper(`${baseUrl}/support/${ticketId}/messages`, options);
};

// Update a support ticket message by messageId
export const updateSupportTicketMessage = async (messageId: string, updates: object) => {
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  };
  return await fetchWrapper(`${baseUrl}/support/messages/${messageId}`, options);
};

// Delete a support ticket message by messageId
export const deleteSupportTicketMessage = async (messageId: string) => {
  const options = {
    method: "DELETE",
  };
  return await fetchWrapper(`${baseUrl}/support/messages/${messageId}`, options);
};
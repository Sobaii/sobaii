export type IUser = {
  id: number;
  email: string;
  picture?: string;
};

export type ISpreadsheet = {
  createdAt: string;
  id: string;
  imageUrl: string;
  lastOpened: string;
  name: string;
  numberOfExpenses: number;
};

export type IExpenseItem = {
  id: string;
  spreadsheetId: string;
  fileKey: string;
  transactionDate?: string;
  category?: string;
  city?: string;
  company?: string;
  country?: string;
  currency?: string | null;
  discount?: string;
  gratuity?: string;
  state?: string;
  street?: string;
  subtotal?: string;
  total?: string;
  totalTax?: string;
  vendorPhone?: string;
  zipCode?: string;
};

export type ISupportTicket = {
  id: string;
  userId: string;
  severity: number;
  name: string;
  status: "open" | "closed";
  createdAt: string;
  messages?: ISupportMessage[];
};

export type ISupportMessage = {
  id: string;
  ticketId: string;
  sender: "user" | "support";
  content: string;
  createdAt: string;
};

export type IAggregateInboxFormData = {
  emailCredentials: {
    emailAddress: string;
    appPassword: string;
  }[];
  searchCriteria: {
    dateRange: {
      start: string;
      end: string;
    };
    filters: {
      subject: string;
      body: string;
      senderAddress: string;
    };
  };
  targetSpreadsheetId: string;
};

import { useState, useEffect } from "react";
import {
  getUserExpenses,
  updateUserExpenses,
  updateUserSpreadsheetScreenshot,
  updateUserSpreadsheetName,
  deleteUserExpenses,
} from "../api/userApi";
import { downloadExpensesXLSX, getS3FileUrl } from "../api/expenseApi";
import { sortNestedExpenseObject } from "../util/expenseUtils";
import { toast } from "sonner";
import { IExpenseItem } from "../types/api";

export type SortDirection = "ascending" | "descending" | "default";

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

const useDataTable = (spreadsheetId: string) => {
  const [expenses, setExpenses] = useState<IExpenseItem[]>([]);
  const [spreadsheetName, setSpreadsheetName] = useState<string>("");
  const [selectedFields, setSelectedFields] = useState<
    Array<keyof IExpenseItem>
  >([
    "category",
    "company",
    "subtotal",
    "totalTax",
    "total",
    "transactionDate",
  ]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "transactionDate",
    direction: "ascending",
  });
  const [viewingFileUrl, setViewingFileUrl] = useState<string | null>(null);
  const [activeExpense, setActiveExpense] = useState<string | null>(null);
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const data = await getUserExpenses(spreadsheetId);
        setSpreadsheetName(data.name);
        setExpenses(data.expenses);
      } catch {
        toast.error("Failed to fetch expenses");
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, [spreadsheetId]);

  const requestSort = (key: keyof IExpenseItem) => {
    const direction: SortDirection =
      sortConfig.key === key
        ? sortConfig.direction === "ascending"
          ? "descending"
          : sortConfig.direction === "descending"
          ? "default"
          : "ascending"
        : "ascending";
    setSortConfig({ key, direction });
    setExpenses(sortNestedExpenseObject([...expenses], key, direction));
  };

  const viewPDF = async (filename: string, expenseId: string) => {
    try {
      const fileUrl = await getS3FileUrl(filename);
      setViewingFileUrl(fileUrl);
      setActiveExpense(expenseId);
      toast.success("PDF loaded successfully");
    } catch {
      toast.error("Failed to View Receipt");
    }
  };

  const handleSave = async (tableRef: HTMLElement) => {
    try {
      await Promise.all([
        updateUserSpreadsheetScreenshot(tableRef, spreadsheetId),
        updateUserExpenses(expenses, spreadsheetId),
        updateUserSpreadsheetName(spreadsheetName, spreadsheetId),
      ]);
      toast.success("Changes saved successfully");
    } catch (error) {
      toast.error(`Failed to save changes: ${error}`);
    }
  };

  const handleExpenseChange = (
    index: number,
    key: keyof IExpenseItem,
    value: string
  ) => {
    const newExpenses = [...expenses];
    newExpenses[index][key] = value;
    setExpenses(newExpenses);
  };

  const handleCheckboxChange = (expenseId: string) => {
    setSelectedExpenses((prev) =>
      prev.includes(expenseId)
        ? prev.filter((id) => id !== expenseId)
        : [...prev, expenseId]
    );
  };

  const handleSelectAll = () => {
    setSelectedExpenses((prev) =>
      prev.length === expenses.length
        ? []
        : expenses.map((expense) => expense.id)
    );
  };

  const deleteSelectedExpenses = async () => {
    await deleteUserExpenses(selectedExpenses, spreadsheetId);
    setExpenses((prev) =>
      prev.filter((expense) => !selectedExpenses.includes(expense.id))
    );
    setSelectedExpenses([]);
    toast.success("Expenses deleted successfully");
  };

  const generateCSV = async () => {
    try {
      await downloadExpensesXLSX(spreadsheetId, selectedFields);
      toast.success("CSV file generated successfully");
    } catch {
      toast.error("Failed to generate CSV file");
    }
  };

  return {
    expenses,
    setExpenses,
    spreadsheetName,
    selectedFields,
    sortConfig,
    viewingFileUrl,
    activeExpense,
    selectedExpenses,
    loading,
    setActiveExpense,
    setSpreadsheetName,
    setSelectedFields,
    setViewingFileUrl,
    requestSort,
    viewPDF,
    handleSave,
    handleExpenseChange,
    handleCheckboxChange,
    handleSelectAll,
    deleteSelectedExpenses,
    generateCSV,
  };
};

export default useDataTable;

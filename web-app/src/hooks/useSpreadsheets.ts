import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSpreadsheet as createSpreadsheetService,
  deleteSpreadsheet as deleteSpreadsheetService,
} from "../api/expenseApi";
import { getUserSpreadsheetsShallowInfo } from "../api/userApi";
import { ISpreadsheet } from "@/types/api";

export function useSpreadsheets() {
  const queryClient = useQueryClient();

  // Fetch spreadsheets
  const { data: spreadsheets = [], isLoading } = useQuery<ISpreadsheet[]>({
    queryKey: ["shallowSpreadsheets"],
    queryFn: getUserSpreadsheetsShallowInfo,
  });

  // Create spreadsheet mutation
  const createSpreadsheetMutation = useMutation({
    mutationFn: createSpreadsheetService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shallowSpreadsheets"] });
    },
    onError: (error) => {
      console.error("Error creating spreadsheet", error);
    },
  });

  // Delete spreadsheet mutation
  const deleteSpreadsheetMutation = useMutation({
    mutationFn: deleteSpreadsheetService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shallowSpreadsheets"] });
    },
    onError: (error) => {
      console.error("Error deleting spreadsheet", error);
    },
  });

  const createSpreadsheet = async (name: string) => {
    return createSpreadsheetMutation.mutateAsync(name);
  };

  const deleteSpreadsheet = async (id: string) => {
    return deleteSpreadsheetMutation.mutateAsync(id);
  };

  return {
    spreadsheets,
    isLoading,
    createSpreadsheet,
    deleteSpreadsheet,
  };
}

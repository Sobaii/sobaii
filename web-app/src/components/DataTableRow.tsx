// src/components/DataTable/DataTableRow.js
import React from "react";
import { getBackgroundColor } from "../util/expenseUtils";
import { IExpenseItem } from "../types/api";
import { Button } from "./ui/Button";
import { Checkbox } from "./ui/Checkbox";

export interface DataTableRowProps {
  expense: IExpenseItem;
  index: number;
  selectedFields: string[];
  numericKeys: string[];
  isActive: boolean;
  isSelected: boolean;
  onCheckboxChange: (id: string) => void;
  onExpenseChange: (
    index: number,
    key: keyof IExpenseItem,
    value: string
  ) => void;
  onViewPDF: (fileKey: string, expense: string) => void;
}

const DataTableRow: React.FC<DataTableRowProps> = ({
  expense,
  index,
  selectedFields,
  numericKeys,
  isActive,
  isSelected,
  onCheckboxChange,
  onExpenseChange,
  onViewPDF,
}) => (
  <tr
    className={`relative outline-1 outline outline-transparent hover:z-30 hover:outline-black ${
      isActive && "!outline-red-500 !outline-4 z-30"
    }`}
  >
    <td className="flex items-center justify-center pl-3 h-8 w-full">
      <Checkbox
        checked={isSelected}
        onChange={() => onCheckboxChange(expense.id)}
      />
    </td>
    <td className="text-center px-2">{index + 1}</td>
    {selectedFields.map((key) => {
      const confidence = numericKeys.includes(key)
        ? Math.abs(
            numericKeys.reduce(
              (acc, k) =>
                acc +
                (parseFloat(expense[k as keyof IExpenseItem] as string) || 0),
              0
            ) -
              parseFloat(expense["total"] ?? "0") * 2
          ) < 0.003
          ? 100
          : 0
        : expense[key as keyof IExpenseItem] === ""
        ? 0
        : 100;
      const backgroundColor = getBackgroundColor(confidence);

      return (
        <td key={`${expense.id}-${key}`}>
          <input
            value={expense[key as keyof IExpenseItem] ?? ""}
            onChange={(e) => {
              if (
                numericKeys.includes(key) &&
                !/^-?\d*\.?\d*$/.test(e.target.value)
              )
                return;
              onExpenseChange(index, key as keyof IExpenseItem, e.target.value);
            }}
            style={{ backgroundColor }}
            className="text-neutral-950 relative h-8 px-2 w-full min-w-[150px] border-none font-medium text-base"
          />
        </td>
      );
    })}
    <td>
      <Button
        className="min-h-8 rounded-none w-full hover:outline outline-2 hover:outline-black"
        size="sm"
        onClick={() => onViewPDF(expense.fileKey, expense.id)}
      >
        View Receipt
      </Button>
    </td>
  </tr>
);

export default DataTableRow;

import React from "react";
import { Checkbox } from "./ui/Checkbox";
import { UpArrowIcon, DownArrowIcon } from "../assets/icons";
import formatCamelCase from "../util/formatCamelCase";
import { SortConfig } from "../hooks/useDataTable";
import { IExpenseItem } from "../types/api";

export interface DataTableHeaderProps {
  selectedFields: Array<keyof IExpenseItem>;
  sortConfig: SortConfig;
  requestSort: (key: keyof IExpenseItem) => void;
  handleSelectAll: (checked: boolean) => void;
  allSelected: boolean;
}
const DataTableHeader: React.FC<DataTableHeaderProps> = ({
  selectedFields,
  sortConfig,
  requestSort,
  handleSelectAll,
  allSelected,
}) => (
  <tr className="sticky top-0 left-0 z-40 bg-neutral-50">
    <th className="flex items-center pl-3 justify-center h-10 cursor-default">
      <Checkbox checked={allSelected} onCheckedChange={handleSelectAll} />
    </th>
    <th className="w-9">#</th>
    {selectedFields.map((key) => (
      <th
        key={key}
        onClick={() => requestSort(key)}
        className="cursor-pointer hover:bg-neutral-200 border border-neutral-300 p-2 whitespace-nowrap text-sm font-medium"
      >
        <span className="inline-block align-middle">{formatCamelCase(key)}</span>
        {sortConfig.key === key && (
          <img
            className="inline-block mx-2 h-3"
            src={sortConfig.direction === "ascending" ? UpArrowIcon : DownArrowIcon}
            alt={`${sortConfig.direction === "ascending" ? "Up" : "Down"} arrow`}
          />
        )}
      </th>
    ))}
    <th className="font-medium text-sm">View Receipt</th>
  </tr>
);

export default DataTableHeader;
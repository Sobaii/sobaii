import { useRef } from "react";
import "./styles/DataTable.css";
import { useParams } from "react-router-dom";
import useDataTable from "../hooks/useDataTable";
import { numericKeys } from "../util/expenseUtils";
import { getAllKeysInObjectArray } from "../util";

import ReceiptRender from "./ReceiptRender";
import ReceiptUploadModal from "./ReceiptUploadModal";

import { Button } from "./ui/Button";
import MultiSelect from "./ui/MultiSelect";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";
import DataTableHeader from "./DataTableHeader";
import DataTableRow from "./DataTableRow";

import { DownloadFileIcon, SaveFileIcon } from "../assets/icons";
import SkeletonCard from "./ui/SkeletonCard";
import { IExpenseItem } from "@/types/api";

function DataTable() {
  const { spreadsheetId } = useParams<{ spreadsheetId: string }>();
  const {
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
  } = useDataTable(spreadsheetId as string);
  const tableRef = useRef<HTMLTableElement | null>(null);

  if (loading)
    return (
      <div className="flex flex-col gap-3">
        <SkeletonCard className="h-10" />
        <SkeletonCard className="h-14" />
        <SkeletonCard className="h-80" />
      </div>
    );

  const allKeys = getAllKeysInObjectArray(expenses, [
    "fileKey",
    "id",
  ]) as (keyof IExpenseItem)[];

  return (
    <div className="flex flex-col gap-3 data-table">
      <Input
        value={spreadsheetName}
        onChange={(e) => setSpreadsheetName(e.target.value)}
      />
      <Card className="p-2 flex-row z-50 gap-3">
        {expenses.length > 0 && (
          <MultiSelect
            selected={selectedFields}
            setSelected={setSelectedFields}
            queries={allKeys}
            placeholder="Select Categories"
          />
        )}
        <ReceiptUploadModal
          setExpenses={setExpenses}
          spreadsheetId={spreadsheetId ?? null}
        />
        {expenses.length > 0 && (
          <>
            <Button onClick={() => handleSave(tableRef.current!)}>
              <img src={SaveFileIcon} /> Save
            </Button>
            <Button onClick={generateCSV}>
              <img src={DownloadFileIcon} /> Generate CSV File
            </Button>
          </>
        )}
        {viewingFileUrl && (
          <ReceiptRender
            fileUrl={viewingFileUrl}
            handleClose={() => {
              setActiveExpense(null);
              setViewingFileUrl(null);
            }}
          />
        )}
        {selectedExpenses.length > 0 && (
          <Button
            onClick={() => deleteSelectedExpenses()}
            variant="destructive"
          >
            {`Delete ${selectedExpenses.length} item${
              selectedExpenses.length > 1 ? "s" : ""
            }`}
          </Button>
        )}
      </Card>
      {expenses.length === 0 ? (
        <div className="flex justify-center items-center h-full">
          <h2 className="text-2xl font-medium text-neutral-950">
            No expenses found
          </h2>
        </div>
      ) : (
        <table
          ref={tableRef}
          className="border-separate border-spacing-px border bg-neutral-50 border-neutral-300 shadow-lg rounded-lg"
        >
          <thead>
            <DataTableHeader
              selectedFields={selectedFields}
              sortConfig={sortConfig}
              requestSort={requestSort}
              handleSelectAll={handleSelectAll}
              allSelected={selectedExpenses.length === expenses.length}
            />
          </thead>
          <tbody>
            {expenses.map((expense, index) => (
              <DataTableRow
                key={index}
                expense={expense}
                index={index}
                selectedFields={selectedFields}
                numericKeys={numericKeys}
                isActive={expense.id === activeExpense}
                isSelected={selectedExpenses.includes(expense.id)}
                onCheckboxChange={handleCheckboxChange}
                onExpenseChange={handleExpenseChange}
                onViewPDF={viewPDF}
              />
            ))}
          </tbody>
        </table>
      )}
      <div style={{ height: "80dvh", visibility: "hidden" }}></div>
    </div>
  );
}

export default DataTable;

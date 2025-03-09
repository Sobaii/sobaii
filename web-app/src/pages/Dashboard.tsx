import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/Popover";
import { useNavigate } from "react-router-dom";
import { EllipsisIcon } from "../assets/icons";
import { convertToReadableDate } from "../util/dateUtils";
import { useSpreadsheets } from "../hooks/useSpreadsheets";
import SkeletonCard from "../components/ui/SkeletonCard";
import { AlertDialog, AlertDialogContent } from "@/components/ui/AlertDialog";
import { ISpreadsheet } from "@/types/api";

function Dashboard() {
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [
    spreadsheetToDelete,
    setSpreadsheetToDelete,
  ] = useState<ISpreadsheet | null>(null);
  const [spreadsheetName, setSpreadsheetName] = useState("");

  const navigate = useNavigate();

  const {
    createSpreadsheet,
    deleteSpreadsheet,
    spreadsheets,
    isLoading,
  } = useSpreadsheets();

  const handleCreateSpreadsheet = async () => {
    if (!spreadsheetName) return;
    try {
      const response = await createSpreadsheet(spreadsheetName);
      navigate(`/app/dashboard/${response.id}`);
    } catch (error) {
      console.error("Error creating spreadsheet", error);
    }
  };

  const handleDeleteSpreadsheet = async () => {
    if (!spreadsheetToDelete) return;
    try {
      await deleteSpreadsheet(spreadsheetToDelete.id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting spreadsheet", error);
    }
  };

  const filteredSpreadsheets = spreadsheets.filter((spreadsheet) =>
    spreadsheet.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="flex flex-col gap-4 p-6">
        <div className="flex w-full gap-4">
          <Input
            placeholder="Search spreadsheets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={() => setShowCreateModal(true)}>
            Create new spreadsheet
          </Button>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
          {isLoading ? (
            <div className="flex gap-4">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : filteredSpreadsheets.length === 0 && !isLoading ? (
            <Card className="py-20">
              <p className="text-center text-slate-500">No collections found</p>
            </Card>
          ) : (
            filteredSpreadsheets.map((spreadsheet, index: number) => (
              <Card
                key={index}
                className="p-0 gap-0 border-2 overflow-hidden col-span-1 max-h-[600px] hover:border-blue-500 cursor-pointer flex"
                onClick={() => navigate(`/app/dashboard/${spreadsheet.id}`)}
              >
                <div className="p-5 gap-1 flex flex-col w-full">
                  <div className="flex gap-3 justify-between items-center">
                    <h4 className="whitespace-nowrap truncate">
                      {spreadsheet.name}
                    </h4>
                    <Popover>
                      <PopoverTrigger asChild>
                        <div onClick={(e) => e.stopPropagation()}>
                          <Icon image={EllipsisIcon} />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-fit p-2">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteModal(true);
                            setSpreadsheetToDelete(spreadsheet);
                          }}
                          variant="destructive"
                        >
                          Delete
                        </Button>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <h5 className="text-slate-600">
                    {spreadsheet.numberOfExpenses} items
                  </h5>
                  <h6 className="text-slate-500">
                    Opened {convertToReadableDate(spreadsheet.lastOpened)}
                  </h6>
                </div>
                {spreadsheet.imageUrl && (
                  <img
                    src={spreadsheet.imageUrl}
                    className="w-full"
                    alt="Spreadsheet"
                  />
                )}
              </Card>
            ))
          )}
        </div>
      </div>
      <AlertDialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <AlertDialogContent className="p-6">
          <h2>Create new spreadsheet</h2>
          <div className="flex flex-col gap-2">
            <h5>Spreadsheet name</h5>
            <Input
              placeholder="Personal expenses 2025"
              value={spreadsheetName}
              onChange={(e) => setSpreadsheetName(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <Button
              className="w-full"
              variant="outline"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="w-full"
              disabled={!spreadsheetName}
              onClick={handleCreateSpreadsheet}
            >
              Create
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <AlertDialogContent className="p-6">
          <h2>Are you sure you want to delete {spreadsheetToDelete?.name}?</h2>
          <div className="mt-4 flex gap-2">
            <Button
              className="w-full"
              onClick={() => setShowDeleteModal(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              className="w-full"
              onClick={handleDeleteSpreadsheet}
              variant="destructive"
            >
              Delete
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default Dashboard;

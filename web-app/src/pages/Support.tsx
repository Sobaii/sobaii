import { useState } from "react";
import AppPage from "../layouts/AppPage";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/Select";

function Support() {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedSort, setSelectedSort] = useState("Last Updated");

  const status = ["All", "Open", "Closed", "Pending"];
  const sortFilters = ["Last Updated", "Date Created", "Severity"];

  return (
    <AppPage title="Support Center">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {status.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedSort} onValueChange={setSelectedSort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortFilters.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Card className="items-center gap-2 py-20">
          <h5>No cases found</h5>
          {search ? (
            <h5>Try searching for something else</h5>
          ) : (
            <h6 className="text-slate-500">Create a new case to get started</h6>
          )}
          <Button className="mt-2">Create Case</Button>
        </Card>
      </div>
    </AppPage>
  );
}

export default Support;

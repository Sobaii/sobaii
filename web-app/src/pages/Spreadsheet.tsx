import DataTable from "../components/DataTable";
import ConfidenceGradient from "../components/ConfidenceGradient";

function Spreadsheet() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <ConfidenceGradient />
      <DataTable />
    </div>
  );
}

export default Spreadsheet;

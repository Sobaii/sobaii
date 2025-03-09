import { Card } from "@/components/ui/Card";
import AppPage from "../layouts/AppPage";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";

export default function Integrations() {
  const navigate = useNavigate();

  const handleBrowseIntegrations = () => {
    navigate("/app/integrations/marketplace");
  };
  return (
    <AppPage title="Integrations">
      <Card className="items-center py-20">
        <h5>No integrations installed</h5>
        <h6 className="text-slate-500">
          You don't have any integrations installed
        </h6>
        <Button className="mt-2 w-fit" onClick={handleBrowseIntegrations}>Browse Integrations</Button>
      </Card>
    </AppPage>
  );
}

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import AppPage from "../layouts/AppPage";
import {
  QuickBooksLogo,
  XeroLogo,
  SageLogo,
  ZohoBooksLogo,
  FreshBooksLogo,
  SAPBusinessOneLogo,
} from "@/assets/logos";

export default function IntegrationsMarketPlace() {
  const [search, setSearch] = useState("");
  const [integrations] = useState([
    "QuickBooks",
    "Xero",
    "Sage",
    "Zoho Books",
    "FreshBooks",
    "SAP Business One",
  ]);

  const logos: { [key: string]: string } = {
    QuickBooks: QuickBooksLogo,
    Xero: XeroLogo,
    Sage: SageLogo,
    "Zoho Books": ZohoBooksLogo,
    FreshBooks: FreshBooksLogo,
    "SAP Business One": SAPBusinessOneLogo,
  };

  const descriptions: { [key: string]: string } = {
    QuickBooks: "Cloud-based accounting software for small businesses.",
    Xero: "Online accounting tailored for small to medium-sized enterprises.",
    Sage: "Robust business management and accounting solutions.",
    "Zoho Books": "Comprehensive online accounting for small businesses.",
    FreshBooks: "User-friendly invoicing and expense tracking tool.",
    "SAP Business One": "Enterprise ERP solution for SMBs.",
  };

  const filteredIntegrations = useMemo(() => {
    return integrations.filter((integration) =>
      integration.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, integrations]);

  return (
    <AppPage title="Integrations Marketplace">
      <div className="flex flex-col gap-4">
        <Input
          placeholder="Search integration..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
          {filteredIntegrations.map((integration) => (
            <Card
              key={integration}
              className="flex relative flex-col p-0 gap-0 bg-white rounded-lg shadow-md"
            >
              <div className="h-44 border-4">
                <img
                  src={logos[integration]}
                  className="bg-gray-300 h-full w-full object-cover block"
                  alt={`${integration} logo`}
                />
              </div>
              <div className="flex flex-col gap-2 p-4">
                <h5 className="text-lg font-semibold">{integration}</h5>
                <p className="text-sm text-gray-600">{descriptions[integration]}</p>
              </div>
              <Button size="sm" className="absolute top-4 right-4">
                Install
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </AppPage>
  );
}
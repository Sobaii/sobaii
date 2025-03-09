import React, { ReactElement } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  SettingsBilling,
  SettingsGeneral,
  SettingsInvoices,
  SettingsSecurity,
} from "../features/settings/components";
import AppPage from "../layouts/AppPage";
import { twMerge } from "tailwind-merge";

const sectionPages: Record<string, ReactElement> = {
  general: <SettingsGeneral />,
  billing: <SettingsBilling />,
  invoices: <SettingsInvoices />,
  security: <SettingsSecurity />,
};

const sections = [
  { key: "general", label: "General" },
  { key: "billing", label: "Billing" },
  { key: "invoices", label: "Invoices" },
  { key: "security", label: "Security & Privacy" },
];

const Settings: React.FC = () => {
  const { search } = useLocation();
  
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const section = params.get("section") || "general";

  return (
    <AppPage title="Settings">
        <div className="flex gap-10">
          <div className="flex flex-col border border-gray-300 rounded-lg p-3 bg-white h-fit">
            {sections.map(({ key, label }) => (
              <h5
                key={key}
                onClick={() => navigate(`/app/settings?section=${key}`)}
                className={twMerge(
                  "whitespace-nowrap rounded-md px-3 py-2 hover:bg-neutral-100 cursor-pointer",
                  section === key ? "font-bold" : ""
                )}
              >
                {label}
              </h5>
            ))}
          </div>
          <div className="flex w-full flex-col gap-6">
            {sectionPages[section] || <h2>Page Not Found</h2>}
          </div>
        </div>
    </AppPage>
  );
};

export default Settings;

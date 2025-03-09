import React from "react";
import { LogoIcon } from "../assets/logos";
import { useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../api/userApi";
import { useAuthStore } from "../stores";
import { BellIcon } from "../assets/icons";
import { Button } from "@/components/ui/Button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/Popover";
import Breadcrumb from "@/components/ui/Breadcrumb";

interface SideNavLinkProps {
  label: string;
  href: string;
}

const SideNavLink: React.FC<SideNavLinkProps> = ({ label, href }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive =
    href.split("/")[2].split("?")[0] ===
    location.pathname.split("/")[2].split("?")[0];

  return (
    <button
      onClick={() => navigate(href)}
      className={`whitespace-nowrap flex items-center border-b-2 gap-2 py-2 px-4 ${
        isActive
          ? "bg-gray-100 border-b-green-500"
          : "border-b-transparent hover:bg-gray-100"
      }`}
    >
      <p className="text-sm font-light">{label}</p>
    </button>
  );
};

const AppTopNav: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async (): Promise<void> => {
    try {
      await logoutUser();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const { user } = useAuthStore();

  return (
    <main className="border-b z-40 bg-white border-neutral-200 relative w-full pt-4 px-6 gap-4 flex flex-col">
      <div className="w-full flex justify-between">
        <div className="flex items-center gap-4">
          <img
            onClick={() => navigate("/app/dashboard")}
            className="cursor-pointer h-6 w-fit"
            src={LogoIcon}
            alt="LogoIcon"
          />
          <Breadcrumb />
        </div>
        <div className="flex gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <img
                src={BellIcon}
                alt="Notifications"
                className="cursor-pointer p-2 border border-gray-300 hover:bg-gray-200 h-10 w-10 rounded-full"
              />
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="p-14 w-fit gap-3 whitespace-nowrap"
            >
              No new notifications
            </PopoverContent>
          </Popover>

          {user &&
            (user.picture ? (
              <Popover>
                <PopoverTrigger asChild>
                  <img
                    src={user.picture}
                    alt="User"
                    className="cursor-pointer h-10 w-10 rounded-full"
                  />
                </PopoverTrigger>
                <PopoverContent align="end" className="p-3 w-fit gap-3">
                  <p className="text-neutral-600">{user.email}</p>
                  <hr />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/app/dashboard")}
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/app/inbox")}
                  >
                    Inbox Aggregation
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                  <hr />
                  <Button size="sm">Upgrade to Pro</Button>
                </PopoverContent>
              </Popover>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <div className="cursor-pointer h-10 w-10 rounded-full bg-neutral-500"></div>
                </PopoverTrigger>
                <PopoverContent align="end" className="p-3 w-fit gap-3">
                  <p className="text-neutral-600">{user.email}</p>
                  <hr className="border-neutral-300" />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </PopoverContent>
              </Popover>
            ))}
        </div>
      </div>
      <div className="flex">
        <SideNavLink href="/app/dashboard" label="Dashboard" />
        <SideNavLink href="/app/inbox" label="Inbox Aggregation" />
        <SideNavLink href="/app/integrations" label="Integrations" />
        <SideNavLink href="/app/data" label="Data Analytics" />
        <SideNavLink href="/app/support" label="Support" />
        <SideNavLink href="/app/settings?section=general" label="Settings" />
      </div>
    </main>
  );
};

export default AppTopNav;

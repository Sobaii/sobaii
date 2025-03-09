import "./App.css";
import { useEffect, useState } from "react";
import { Routes, Route, Outlet, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import AppTopNav from "./layouts/AppTopNav";
import Settings from "./pages/Settings";
import { useAuthStore } from "./stores/index";
import Spreadsheet from "./pages/Spreadsheet";
import Login from "./features/auth/Login";
import Signup from "./features/auth/Signup";
import Loader from "./components/ui/Loader";
import Dashboard from "./pages/Dashboard";
import { authenticateUser } from "./api/userApi";
import NotFound from "./pages/NotFound";
import InboxAggregation from "./pages/InboxAggregation";
import Integrations from "./pages/Integrations";
import DataAnalytics from "./pages/DataAnalytics";
import Support from "./pages/Support";
import IntegrationsMarketPlace from "./pages/IntegrationsMarketPlace";

function AppLayout() {
  const { setUser } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const runUserAuthCheck = async () => {
      setIsLoading(true);
      try {
        const data = await authenticateUser();
        if (data) {
          setUser(data);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Failed to authenticate user:", error);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };
    runUserAuthCheck();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col">
        <AppTopNav />
        <div className="flex flex-col gap-3 w-full">
          <Outlet />
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <div className="min-h-screen w-fit min-w-full">
      <Toaster
        richColors
        toastOptions={{
          className: "sonnerToast",
        }}
      />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/app" element={<AppLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dashboard/:spreadsheetId" element={<Spreadsheet />} />
          <Route path="inbox" element={<InboxAggregation />} />
          <Route path="integrations" element={<Integrations />} />
          <Route path="integrations/marketplace" element={<IntegrationsMarketPlace />} />
          <Route path="data" element={<DataAnalytics />} />
          <Route path="support" element={<Support />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;

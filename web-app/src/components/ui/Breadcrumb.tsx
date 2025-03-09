import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const breadcrumbList = location.pathname.split("/").splice(2);

  return (
    <div className="flex items-center gap-1">
      {breadcrumbList.map((subPath, index) => (
        <>
          <h4>/</h4>
          <h4
            onClick={() => navigate(`/app/${breadcrumbList.slice(0, index + 1).join('/')}`)}
            className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-lg"
          >
            {subPath}
          </h4>
        </>
      ))}
    </div>
  );
};

export default Breadcrumb;

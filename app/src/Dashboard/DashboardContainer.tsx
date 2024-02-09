import Sidebar from "./Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

const DashboardContainer = () => {
  return (
    <div className="flex h-full bg-gray-50">
      <Sidebar />
      <div className="w-full h-full p-5 relative">
        <div className=" w-full h-full  bg-white rounded-xl bshadow">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardContainer;

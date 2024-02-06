import React, { useEffect } from "react";
import Sidebar from "./Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { dataActions } from "@/redux/data";

const DashboardContainer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(dataActions.initializeTemplates());
  }, []);

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

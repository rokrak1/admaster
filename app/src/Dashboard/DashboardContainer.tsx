import React from "react";
import Sidebar from "./Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { modals } from "./Modals/modals";
import { useSelector } from "react-redux";
import { StoreState } from "@/redux/store";

const DashboardContainer = () => {
  const modal = useSelector((state: StoreState) => state.modals.modal);

  const getModal = (modal: string) => {
    if (modal) {
      const Modal = modals[modal];
      return <Modal />;
    }
    return null;
  };
  return (
    <div className="flex h-full bg-gray-50">
      <Sidebar />
      <div className="w-full h-full p-5 relative">
        <div className=" w-full h-full  bg-white rounded-xl bshadow">
          <Outlet />
        </div>

        {getModal(modal)}
      </div>
    </div>
  );
};

export default DashboardContainer;

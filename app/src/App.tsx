import { Route, RouteObject, Routes } from "react-router-dom";
import { dashboardRouter, mainRouter } from "./routes/routesConfiguration";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import DashboardContainer from "./Dashboard/DashboardContainer";
import { modals } from "@/Dashboard/Modals/modals";
import { useSelector } from "react-redux";
import { StoreState } from "@/redux/store";

const App = () => {
  const modal = useSelector((state: StoreState) => state.modals.modal);

  const getModal = (modal: string) => {
    if (modal) {
      const Modal = modals[modal];
      return <Modal />;
    }
    return null;
  };

  const renderRoutes = ({ routes }: { routes?: RouteObject[] }) =>
    routes?.length ? (
      <>
        {routes.map(({ path, element, children }, i) => (
          <React.Fragment key={"route" + i + path}>
            <Route key={path} path={path} element={element}>
              {children && renderRoutes({ routes: children })}
            </Route>
          </React.Fragment>
        ))}
      </>
    ) : (
      <React.Fragment></React.Fragment>
    );

  return (
    <div className="w-full h-full relative">
      <Routes>
        <Route path="/" element={<DashboardContainer />}>
          {renderRoutes({ routes: dashboardRouter })}
        </Route>
        {renderRoutes({ routes: mainRouter })}
      </Routes>
      {getModal(modal)}

      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default App;

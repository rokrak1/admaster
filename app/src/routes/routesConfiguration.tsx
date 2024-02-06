import {
  createBrowserRouter,
  Link,
  Navigate,
  RouteObject,
} from "react-router-dom";
import DashboardContainer from "../Dashboard/DashboardContainer";
import {
  PaintBrushIcon,
  Cog6ToothIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import CatalogsContainer from "../Dashboard/Catalogs/CatalogsContainer";
import SettingsContainer from "../Dashboard/Settings/SettingsContainer";
import { ForwardRefExoticComponent, SVGProps } from "react";
import TemplatesContainer from "../Dashboard/Template/TemplatesContainer";
import AppWrapper from "../Builder/AppWrapper";
import ProtectedRoute from "./ProtectedRoute";
import Login from "@/Authentication/Login";
import Registration from "@/Authentication/Registration";

interface IRouteConfiguration {
  name: string;
  path: string;
  element: JSX.Element;
  protected: boolean;
  children?: IRouteConfiguration[];
  showOnSidebar: boolean;
  Icon?: any;
}

const dashboardRoutes: IRouteConfiguration[] = [
  {
    name: "Catalogs",
    path: "/",
    protected: true,
    element: <Navigate to="/catalogs" />,
    showOnSidebar: false,
    Icon: Squares2X2Icon,
  },
  {
    name: "Catalogs",
    path: "catalogs",
    protected: true,
    element: <CatalogsContainer />,
    showOnSidebar: true,
    Icon: Squares2X2Icon,
  },
  {
    name: "Templates",
    path: "templates",
    protected: true,
    element: <TemplatesContainer />,
    showOnSidebar: true,
    Icon: PaintBrushIcon,
  },
  {
    name: "Settings",
    path: "settings",
    protected: true,
    element: <SettingsContainer />,
    showOnSidebar: true,
    Icon: Cog6ToothIcon,
  },
];

const mainRoutes: IRouteConfiguration[] = [
  {
    name: "Builder",
    path: "builder",
    protected: true,
    element: (
      <ProtectedRoute>
        <AppWrapper />
      </ProtectedRoute>
    ),
    showOnSidebar: false,
  },
  {
    name: "Login",
    path: "login",
    protected: false,
    element: <Login />,
    showOnSidebar: false,
  },
  {
    name: "Register",
    path: "register",
    protected: false,
    element: <Registration />,
    showOnSidebar: false,
  },
  {
    name: "404",
    path: "*",
    protected: false,
    element: <Login />,
    showOnSidebar: false,
  },
];

const getRouteProps = (route: IRouteConfiguration): RouteObject => ({
  path: route.path,
  element: route.protected ? (
    <ProtectedRoute>{route.element}</ProtectedRoute>
  ) : (
    route.element
  ),
  children: route.children?.map((child) => getRouteProps(child)) || [],
});

export const dashboardRouter = dashboardRoutes.map((config) =>
  getRouteProps(config)
);
export const mainRouter = mainRoutes.map((config) => getRouteProps(config));

interface IRouteConfigurationProps {
  name: string;
  path: string;
  children?: IRouteConfigurationProps[];
  showOnSidebar: boolean;
  Icon?: ForwardRefExoticComponent<SVGProps<SVGSVGElement>>;
}

const getRoutesConfigProps = (
  route: IRouteConfiguration
): IRouteConfigurationProps => ({
  name: route.name,
  path: route.path,
  showOnSidebar: route.showOnSidebar,
  Icon: route.Icon,
  children: route.children
    ?.map((child) => getRoutesConfigProps(child))
    .filter((child) => child.showOnSidebar === true),
});

export const routes = dashboardRoutes
  .map((config) => getRoutesConfigProps(config))
  .filter((child) => child.showOnSidebar === true);

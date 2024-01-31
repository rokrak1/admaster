import { createBrowserRouter, Link, RouteObject } from "react-router-dom";
import DashboardContainer from "./Dashboard/DashboardContainer";
import {
  PaintBrushIcon,
  Cog6ToothIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import CatalogsContainer from "./Dashboard/Catalogs/CatalogsContainer";
import SettingsContainer from "./Dashboard/Settings/SettingsContainer";
import { ForwardRefExoticComponent, SVGProps } from "react";
import TemplatesContainer from "./Dashboard/Template/TemplatesContainer";
import AppWrapper from "./Builder/AppWrapper";

interface IRouteConfiguration {
  name: string;
  path: string;
  element: JSX.Element;
  children?: IRouteConfiguration[];
  showOnSidebar: boolean;
  Icon?: any;
}

const routesConfiguration: IRouteConfiguration[] = [
  {
    name: "Dashboard",
    path: "/",
    element: <DashboardContainer />,
    showOnSidebar: false,
    children: [
      {
        name: "Catalogs",
        path: "catalogs",
        element: <CatalogsContainer />,
        showOnSidebar: true,
        Icon: Squares2X2Icon,
      },
      {
        name: "Templates",
        path: "templates",
        element: <TemplatesContainer />,
        showOnSidebar: true,
        Icon: PaintBrushIcon,
      },
      {
        name: "Settings",
        path: "settings",
        element: <SettingsContainer />,
        showOnSidebar: true,
        Icon: Cog6ToothIcon,
      },
    ],
  },
  {
    name: "Builder",
    path: "builder",
    element: <AppWrapper />,
    showOnSidebar: false,
  },
];

const getRouteProps = (route: IRouteConfiguration): RouteObject => ({
  path: route.path,
  element: route.element,
  children: route.children?.map((child) => getRouteProps(child)) || [],
});

export const router = createBrowserRouter(
  routesConfiguration.map((config) => getRouteProps(config))
);

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

export const routes = routesConfiguration[0]
  .children!.map((config) => getRoutesConfigProps(config))
  .filter((child) => child.showOnSidebar === true);

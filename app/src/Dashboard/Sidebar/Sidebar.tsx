import { Disclosure } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { routes } from "@/routes/routesConfiguration";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Sidebar = () => {
  const navigate = useNavigate();
  const [openNav, setOpenNav] = useState(false);
  const { pathname } = useLocation();
  return (
    <div className="flex grow w-[250px] flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
      <div className="flex h-16 shrink-0 items-center">
        <img
          className="h-8 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7 pl-0">
          <li>
            <ul role="list" className="-mx-2 space-y-1 pl-0">
              {routes.map((item) => {
                let samePath = "/" + item.path === pathname;
                return (
                  <li key={item.name}>
                    {!item.children ||
                    !item?.children?.some((a) => a.showOnSidebar) ? (
                      <Link
                        to={item.path}
                        className={classNames(
                          samePath
                            ? "bg-gray-50 hover:text-cprimary-500 text-cprimary-500"
                            : "hover:bg-gray-50 text-gray-700 hover:text-cprimary-500",
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold no-underline"
                        )}
                      >
                        <item.Icon
                          className={`
                        ${
                          samePath
                            ? "text-cprimary-500"
                            : "text-gray-400 hover:text-cprimary-500"
                        }
                        h-6 w-6 shrink-0
                        `}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    ) : (
                      <div>
                        <>
                          <button
                            onClick={() => {
                              navigate(item.path);
                            }}
                            className={classNames(
                              samePath
                                ? "bg-gray-50 hover:text-cprimary-500 text-cprimary-500"
                                : "hover:bg-gray-50 text-gray-700 hover:text-cprimary-500",
                              "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full no-underline"
                            )}
                          >
                            <item.Icon
                              className="h-6 w-6 shrink-0 text-gray-400"
                              aria-hidden="true"
                            />
                            {item.name}
                            <ChevronRightIcon
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenNav(!openNav);
                              }}
                              className={classNames(
                                openNav
                                  ? "rotate-90 text-gray-500"
                                  : "text-gray-400",
                                "ml-auto h-5 w-5 shrink-0"
                              )}
                              aria-hidden="true"
                            />
                          </button>
                          {openNav && (
                            <ul className="mt-1 px-2">
                              {item.children?.map((subItem) => (
                                <li key={subItem.name}>
                                  {/* 44px */}
                                  <Link
                                    to={subItem.path}
                                    className={classNames(
                                      subItem.path === pathname
                                        ? "bg-gray-50"
                                        : "hover:bg-gray-50",
                                      "block rounded-md py-2 pr-2 pl-9 text-sm leading-6 text-gray-700"
                                    )}
                                  >
                                    {subItem.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </li>
          <li className="-mx-6 mt-auto">
            <a
              href="#"
              className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
            >
              <img
                className="h-8 w-8 rounded-full bg-gray-50"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
              <span className="sr-only">Your profile</span>
              <span aria-hidden="true">Tom Cook</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

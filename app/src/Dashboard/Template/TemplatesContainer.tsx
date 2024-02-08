import {
  MagnifyingGlassIcon,
  PlusIcon,
  FolderPlusIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import TemplatesList from "./TemplatesList";
import Header from "../common/Header";
import { useDispatch, useSelector } from "react-redux";
import { modalsAction } from "@/redux/modals";
import { Modals } from "../Modals/modals";
import { StoreState } from "@/redux/store";

const TemplatesContainer = () => {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const templates = useSelector((state: StoreState) => state.data.templates);

  const openModal = () => {
    dispatch(modalsAction.setModal(Modals.TEMPLATE_PICKER));
  };

  const searchedTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-col w-full h-full relative">
      <Header label="Templates">
        <>
          <div className="relative flex items-center flex-1 max-w-[300px] h-12">
            <label htmlFor="search-field" className="sr-only">
              Search
            </label>
            <MagnifyingGlassIcon
              className="pointer-events-none absolute inset-y-0 ml-2 left-0 h-full w-5 text-gray-400"
              aria-hidden="true"
            />
            <input
              id="search-field"
              className="block h-10 w-full border rounded-lg py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bshadow text-md"
              placeholder="Search template..."
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              name="search"
            />
          </div>
          <div className="flex ">
            <div className="flex flex-shrink-0">
              <button
                type="button"
                className="flex ml-3 items-center h-11 rounded-md gap-x-2 bg-neutral-400 px-2 py-1 text-md font-semibold text-white shadow-sm hover:bg-neutral-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400"
              >
                <FolderPlusIcon className="left-0 w-6 " aria-hidden="true" />
                New Folder
              </button>
              <button
                type="button"
                onClick={openModal}
                className="flex ml-3 items-center h-11 rounded-md gap-x-2 bg-indigo-500 px-2 py-1 text-md font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                <PlusIcon className="left-0 w-6 " aria-hidden="true" />
                New template
              </button>
            </div>
          </div>
        </>
      </Header>

      <TemplatesList
        templates={searchedTemplates}
        showFirstOption={!templates.length}
      />
    </div>
  );
};

export default TemplatesContainer;

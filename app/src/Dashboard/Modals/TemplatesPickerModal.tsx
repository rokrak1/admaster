import { PlusIcon } from "@heroicons/react/20/solid";
import ModalWrapper from "./ModalWrapper";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { modalsAction } from "@/redux/modals";

const tabs = [
  { name: "Popular", href: "#", current: true },
  { name: "Phone Screening", href: "#", current: false },
  { name: "Interview", href: "#", current: false },
  { name: "Offer", href: "#", current: false },
  { name: "Hired", href: "#", current: false },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const TemplatesPickerModal: React.FC = () => {
  const dispatch = useDispatch();
  const closeModal = () => {
    dispatch(modalsAction.clearModal());
  };
  return (
    <ModalWrapper>
      <div className=" pb-2 sm:pb-0">
        <h3 className="text-xl font-semibold leading-6 text-gray-900 select-none">
          New template
        </h3>
        <div className="mt-3 sm:mt-4 border-b border-gray-200">
          <div className="sm:hidden">
            <label htmlFor="current-tab" className="sr-only">
              Select a tab
            </label>
            <select
              id="current-tab"
              name="current-tab"
              className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              defaultValue={tabs.find((tab) => tab.current).name}
            >
              {tabs.map((tab) => (
                <option key={tab.name}>{tab.name}</option>
              ))}
            </select>
          </div>
          <div className="hidden sm:block">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <a
                  key={tab.name}
                  href={tab.href}
                  className={classNames(
                    tab.current
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                    "whitespace-nowrap border-b-2 px-1 pb-2 text-sm font-medium no-underline"
                  )}
                  aria-current={tab.current ? "page" : undefined}
                >
                  <span className="select-none">{tab.name}</span>
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        className=" cursor-pointer bshadow w-32 h-32 bg-gray-200 rounded-xl"
      >
        <Link
          onClick={closeModal}
          className="w-full h-full flex flex-col items-center justify-center no-underline"
          to="../builder/edit/new"
        >
          <PlusIcon className="text-gray-400 w-14" />
          <div className="text-gray-400 font-semibold text-sm select-none no-underline">
            Blank template
          </div>
        </Link>
      </motion.div>
    </ModalWrapper>
  );
};

export default TemplatesPickerModal;

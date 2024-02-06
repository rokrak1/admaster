import useItem from "@/Builder/hook/useItem";
import { fetchTemplates } from "@/api/template";
import { BrokenImageIcon } from "@/common/icons";
import { dataActions } from "@/redux/data";
import { StoreState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import { modalsAction } from "@/redux/modals";
import { Modals } from "../Modals/modals";

const TemplatesList = () => {
  const [loading, setLoading] = useState(true);
  let [showLine, setShowLine] = useState(false);
  const { prerenderItems } = useItem();
  const navigate = useNavigate();
  const templates = useSelector((state: StoreState) => state.data.templates);
  const dispatch = useDispatch();

  const handleItemClick = (id: string) => {
    let selectedTemplate = templates.find((template) => template.id === id);
    let template = selectedTemplate?.template;
    prerenderItems(template);
    navigate("../builder");
  };

  const showTemplateModal = () => {
    dispatch(modalsAction.setModal(Modals.TEMPLATE_PICKER));
  };

  // TODO: Create routing templates/builder/edit
  // TODO: Create routing templates/builder/edit/:id
  // TODO: When saving a template, replace route with new id
  // TODO: Implement cool right click (rename, delete, duplicate)
  // TODO: Add font family option on text widget
  // TODO: (not urgent) Add grouping
  // TODO: Sidebar highlight on selected route
  // TODO: Implement Spinner on loading

  // Proceed to cdn implementation

  useEffect(() => {
    if (!templates.length) {
      (async () => {
        let [results, err] = await fetchTemplates();
        if (err) {
          toast.error("Error fetching templates");
          return;
        }
        dispatch(dataActions.setTemplates(results));
        setLoading(false);
      })();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <div className="w-full h-full bg-white">
      <div className="w-full h-full mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Products</h2>

        {templates.length ? (
          <div className="w-full grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {templates.map((template) => (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleItemClick(template.id)}
                className="no-underline cursor-pointer"
              >
                <div className="aspect-h-1 h-56 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                  {(template.thumbnail && (
                    <img
                      src={template.thumbnail}
                      alt={template.name || "Template"}
                      className="h-full w-full object-cover object-center group-hover:opacity-75"
                    />
                  )) || (
                    <div className="h-full flex-col w-full bg-gray-200 font-medium flex items-center text-gray-500 justify-center">
                      <BrokenImageIcon color={"grey"} size={70} />
                      No Preview Available
                    </div>
                  )}
                </div>
                <h3 className="mt-3 text-sm text-gray-700">{template.name}</h3>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col text-gray-400 items-center justify-center w-ful h-full">
            <div>No templates found.</div>
            <a
              onMouseOver={() => setShowLine(true)}
              onMouseLeave={() => setShowLine(false)}
              onClick={showTemplateModal}
              className="text-lg font-medium cursor-pointer no-underline text-indigo-600 w-max relative"
            >
              <span>Create your first template!</span>
              <AnimatePresence>
                {showLine && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: 220 }}
                    exit={{ width: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute h-[2px] bottom-0 rounded-full bg-indigo-600 mt-2"
                  ></motion.div>
                )}
              </AnimatePresence>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatesList;

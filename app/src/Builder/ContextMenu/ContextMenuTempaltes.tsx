import { motion } from "framer-motion";
import { DeleteIcon, DuplicateIcon, EditIcon } from "@/common/icons";
import { useDispatch, useSelector } from "react-redux";
import { Modals } from "@/Dashboard/Modals/modals";
import { modalsAction } from "@/redux/modals";
import { useEffect, useState } from "react";
import { dataActions } from "@/redux/data";
import { StoreState } from "@/redux/store";
import { createTemplate } from "@/api/template";
import { toast } from "react-toastify";

export const menuData = [
  {
    id: 1,
    name: "option 1",
  },
  {
    id: 2,
    name: "option 2",
  },
  {
    id: 3,
    name: "option 3",
  },
];

const ContextMenuTemplates = ({
  top,
  left,
  selectedTemplateId,
}: {
  top: number;
  left: number;
  selectedTemplateId: string;
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const { templates } = useSelector((state: StoreState) => ({
    templates: state.data.templates,
  }));

  const dispatch = useDispatch();
  const handleRenameClick = () => {
    dispatch(
      modalsAction.setModalAndData({
        modal: Modals.TEMPLATE_RENAME,
        modalData: { selectedTemplate },
      })
    );
  };
  const handleDuplicateClick = async () => {
    if (!selectedTemplate) return;

    let newName = `${selectedTemplate.name} - Copy`;

    let [res, err] = await createTemplate(newName, selectedTemplate.template);

    if (err) {
      toast.error("Error duplicating template");
      return;
    }
    dispatch(dataActions.addTemplate(res));
  };
  const handleDeleteClick = () => {
    dispatch(
      modalsAction.setModalAndData({
        modal: Modals.TEMPLATE_DELETE,
        modalData: { selectedTemplate },
      })
    );
  };

  useEffect(() => {
    const selectedTemplate = templates.find(
      (template) => template.sequance === selectedTemplateId
    );
    setSelectedTemplate(selectedTemplate);
  }, []);

  return (
    <>
      <motion.ul
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: { type: "tween", stiffness: 200, duration: 0.1 },
        }}
        className="fixed p-2 bg-white text-gray-600 font-semibold text-sm  border border-gray-50 rounded-lg z-50 "
        style={{
          top,
          left,
        }}
      >
        <li
          onClick={handleRenameClick}
          className="flex gap-x-2 px-3 items-center p-2 cursor-pointer hover:bg-gray-100 rounded-lg duration-150 hover:text-black"
        >
          <EditIcon size={16} color={"#4b5563"} />
          Rename
        </li>
        <li
          onClick={handleDuplicateClick}
          className="flex gap-x-2 px-3 items-center p-2 cursor-pointer hover:bg-gray-100 rounded-lg duration-150 hover:text-black"
        >
          <DuplicateIcon size={16} color={"#4b5563"} />
          Duplicate
        </li>
        <li
          onClick={handleDeleteClick}
          className="flex gap-x-2 px-3 items-center p-2 cursor-pointer hover:bg-gray-100 rounded-lg duration-150 hover:text-black"
        >
          <DeleteIcon size={16} color={"#4b5563"} />
          Delete
        </li>
      </motion.ul>
    </>
  );
};
export default ContextMenuTemplates;

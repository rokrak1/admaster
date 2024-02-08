import { DeleteIcon, DuplicateIcon, EditIcon } from "@/common/icons";
import { useDispatch, useSelector } from "react-redux";
import { Modals } from "@/Dashboard/Modals/modals";
import { modalsAction } from "@/redux/modals";
import { useEffect, useState } from "react";
import { dataActions } from "@/redux/data";
import { StoreState } from "@/redux/store";
import { createTemplate } from "@/api/template";
import { toast } from "react-toastify";

export interface TemplateActionsMenuProps {
  selectedTemplateId: string;
}

const TemplateActionsMenu: React.FC<TemplateActionsMenuProps> = ({
  selectedTemplateId,
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
    </>
  );
};
export default TemplateActionsMenu;

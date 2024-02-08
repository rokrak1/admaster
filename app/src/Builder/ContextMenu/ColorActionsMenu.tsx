import { DeleteIcon, DuplicateIcon } from "@/common/icons";
import { useEffect } from "react";

export interface ColorsActionsMenuProps {
  removeColor: () => void;
}

const ColorsActionsMenu: React.FC<ColorsActionsMenuProps> = ({
  removeColor,
}) => {
  const handCopyColorCodeClick = async () => {};
  const handleDeleteClick = () => {
    removeColor();
  };

  useEffect(() => {}, []);

  return (
    <>
      <li
        onClick={handCopyColorCodeClick}
        className="flex gap-x-2 px-3 items-center p-2 cursor-pointer hover:bg-gray-100 rounded-lg duration-150 hover:text-black"
      >
        <DuplicateIcon size={16} color={"#4b5563"} />
        Copy hex code
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
export default ColorsActionsMenu;

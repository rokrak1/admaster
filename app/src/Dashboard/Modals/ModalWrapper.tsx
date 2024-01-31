import { modalsAction } from "@/redux/modals";
import { useDispatch } from "react-redux";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const ModalWrapper: React.FC<{ children: React.ReactNode; label?: string }> = ({
  children,
  label,
}) => {
  const dispatch = useDispatch();

  const closeModal = () => {
    dispatch(modalsAction.clearModal());
  };
  return (
    <div
      className="w-full h-full absolute top-0 left-0 bg-gray-100/50"
      onClick={closeModal}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bshadow flex-col rounded-xl absolute bg-white w-[700px] h-[700px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        {(label && (
          <div className="flex justify-between items-center pb-1 p-2 px-3 gap-x-2 border-b border-gray-100">
            <h3 className="">{label}</h3>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={closeModal}
              className="text-black"
            >
              <XMarkIcon className="text-black w-7" />
            </motion.button>
          </div>
        )) || (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={closeModal}
            className="text-black absolute top-3 right-3"
          >
            <XMarkIcon className="text-black w-7" />
          </motion.button>
        )}
        <div className="p-3">{children}</div>
      </div>
    </div>
  );
};

export default ModalWrapper;

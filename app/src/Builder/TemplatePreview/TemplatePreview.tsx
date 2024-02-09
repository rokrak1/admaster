import { dataActions } from "@/redux/data";
import { motion } from "framer-motion";
import { Dispatch } from "react";
import { useDispatch } from "react-redux";

const TemplatePreview: React.FC<{
  urls: string[];
}> = ({ urls }) => {
  const dispatch = useDispatch();
  return (
    <motion.div
      initial={{ opacity: 0, y: 500 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-x-3 p-5 absolute overflow-y-scroll bottom-0 h-[500px] left-0 right-0 bg-white shadow-xl fixed z-50 w-full"
    >
      <h1>Templates previews</h1>
      {urls.map((url) => (
        <img src={url} alt="template preview" />
      ))}
      <button
        onClick={() => dispatch(dataActions.setShowPreview(false))}
        className="absolute top-5 right-5"
      >
        X Close
      </button>
    </motion.div>
  );
};

export default TemplatePreview;

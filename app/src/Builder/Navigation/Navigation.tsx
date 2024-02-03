import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  ArrowsPointingOutIcon,
  ArrowsRightLeftIcon,
  ArrowsUpDownIcon,
  ChevronLeftIcon,
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
} from "@heroicons/react/20/solid";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { NavBarItemKind } from "../navBar/NavBarButton";
import useStage from "../hook/useStage";
import React from "react";
import {
  ArrowDownOnSquareStackIcon,
  ArrowUpOnSquareStackIcon,
} from "@heroicons/react/24/outline";
import { PreviewIcon, SaveIcon } from "@/common/icons";
import { ExportThumbnail } from "../settingBar/widgetList/ExportWidget";
import { Stage } from "konva/lib/Stage";
import { Node, NodeConfig } from "konva/lib/Node";
import { StageData } from "@/redux/currentStageData";

type NavBarButtonProps = {
  stage?: ReturnType<typeof useStage>;
  onClick: (id: string) => () => void;
  data: NavBarItemKind[];
  selectedItems: Node<NodeConfig>[];
  stageRef: React.MutableRefObject<Stage>;
  stageData: StageData[];
  clearSelection: () => void;
};

const Navigation: React.FC<NavBarButtonProps> = ({
  data,
  onClick,
  selectedItems,
  clearSelection,
  stageRef,
  stageData,
}) => {
  return (
    <div className="h-[60px] w-full bshadow gap-x-10 flex items-center justify-between p-3 bg-gradient-to-r from-indigo-500 from-0% to-blue-500 to-100%">
      <div className="w-full flex  items-center h-full gap-x-10">
        <span>
          <Link to="../" className="text-white no-underline">
            <motion.div
              whileHover={{
                x: [0, -5, 0],
              }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-x-1"
            >
              <ChevronLeftIcon className="h-7 w-7 text-white" />
              Templates
            </motion.div>
          </Link>
        </span>

        <div className="flex items-center gap-x-6 h-full">
          <span className="h-full flex items-center">
            <span className="h-full w-[1px] rounded-full bg-white/20 mr-3"></span>
            <motion.span
              className="cursor-pointer"
              data-tooltip-target="tooltip-undo"
              data-tooltip-placement="bottom"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onClick("")}
            >
              <ArrowUturnLeftIcon className="h-5 w-5 text-white " />
            </motion.span>
            <div
              id="tooltip-undo"
              role="tooltip"
              className="duration-300 transition-opacity absolute z-10 invisible text-[#333] inline-block px-2 py-1 text-xs font-medium bg-gray-50 bshadow rounded-lg shadow-sm opacity-0 tooltip"
            >
              Undo
            </div>
          </span>
          <span className="h-full flex items-center">
            <motion.span
              data-tooltip-target="tooltip-redo"
              data-tooltip-placement="bottom"
              className="cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowUturnRightIcon className="h-5 w-5 text-white mr-3" />
            </motion.span>
            <div
              id="tooltip-redo"
              role="tooltip"
              className="duration-300 transition-opacity absolute z-10 invisible text-[#333] inline-block px-2 py-1 text-xs font-medium bg-gray-50 bshadow rounded-lg shadow-sm opacity-0 tooltip"
            >
              Redo
            </div>
            <span className="h-full w-[1px] bg-white/20"></span>
          </span>
          <span className="h-full flex items-center gap-x-1">
            <motion.button
              data-tooltip-target="tooltip-resetzoom"
              data-tooltip-placement="bottom"
              type="button"
              className="cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onClick("reset-zoom")()}
            >
              <ArrowsPointingOutIcon className="h-5 w-5 text-white mr-3" />
            </motion.button>

            <div
              id="tooltip-resetzoom"
              role="tooltip"
              className="duration-300 transition-opacity absolute z-10 invisible text-[#333] inline-block px-2 py-1 text-xs font-medium bg-gray-50 bshadow rounded-lg shadow-sm opacity-0 tooltip"
            >
              Reset Zoom
            </div>
            <motion.button
              data-tooltip-target="tooltip-zoomin"
              data-tooltip-placement="bottom"
              type="button"
              className="cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onClick("zoom-in")()}
            >
              <MagnifyingGlassPlusIcon className="h-5 w-5 text-white mr-3" />
            </motion.button>

            <div
              id="tooltip-zoomin"
              role="tooltip"
              className="duration-300 transition-opacity absolute z-10 invisible text-[#333] inline-block px-2 py-1 text-xs font-medium bg-gray-50 bshadow rounded-lg shadow-sm opacity-0 tooltip"
            >
              Zoom In
            </div>
            <motion.span
              data-tooltip-target="tooltip-zoomout"
              data-tooltip-placement="bottom"
              className="cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onClick("zoom-out")()}
            >
              <MagnifyingGlassMinusIcon className="h-5 w-5 text-white mr-3" />
            </motion.span>
            <div
              id="tooltip-zoomout"
              role="tooltip"
              className="duration-300 transition-opacity absolute z-10 invisible text-[#333] inline-block px-2 py-1 text-xs font-medium bg-gray-50 bshadow rounded-lg shadow-sm opacity-0 tooltip"
            >
              Zoom Out
            </div>
            <motion.span
              data-tooltip-target="tooltip-flip-horizontally"
              data-tooltip-placement="bottom"
              className="cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onClick("flip-horizontally")()}
            >
              <ArrowsRightLeftIcon className="h-5 w-5 text-white mr-3" />
            </motion.span>
            <div
              id="tooltip-flip-horizontally"
              role="tooltip"
              className="duration-300 transition-opacity absolute z-10 invisible text-[#333] inline-block px-2 py-1 text-xs font-medium bg-gray-50 bshadow rounded-lg shadow-sm opacity-0 tooltip"
            >
              Flip Horizontally
            </div>
            <motion.span
              data-tooltip-target="tooltip-flip-vertically"
              data-tooltip-placement="bottom"
              className="cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onClick("flip-vertically")()}
            >
              <ArrowsUpDownIcon className="h-5 w-5 text-white mr-3" />
            </motion.span>
            <div
              id="tooltip-flip-vertically"
              role="tooltip"
              className="duration-300 transition-opacity absolute z-10 invisible text-[#333] inline-block px-2 py-1 text-xs font-medium bg-gray-50 bshadow rounded-lg shadow-sm opacity-0 tooltip"
            >
              Flip Vertically
            </div>
            <motion.span
              data-tooltip-target="tooltip-layer-up"
              data-tooltip-placement="bottom"
              className="cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onClick("layer-up")()}
            >
              <ArrowUpOnSquareStackIcon className="h-5 w-5 text-white mr-3" />
            </motion.span>
            <div
              id="tooltip-layer-up"
              role="tooltip"
              className="duration-300 transition-opacity absolute z-10 invisible text-[#333] inline-block px-2 py-1 text-xs font-medium bg-gray-50 bshadow rounded-lg shadow-sm opacity-0 tooltip"
            >
              Layer up
            </div>
            <motion.span
              data-tooltip-target="tooltip-layer-down"
              data-tooltip-placement="bottom"
              className="cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onClick("layer-down")()}
            >
              <ArrowDownOnSquareStackIcon className="h-5 w-5 text-white mr-3" />
            </motion.span>
            <div
              id="tooltip-layer-down"
              role="tooltip"
              className="duration-300 transition-opacity absolute z-10 invisible text-[#333] inline-block px-2 py-1 text-xs font-medium bg-gray-50 bshadow rounded-lg shadow-sm opacity-0 tooltip"
            >
              Layer down
            </div>
          </span>
        </div>
      </div>

      <ExportThumbnail
        data={{
          id: "export",
          name: "Export",
          "data-item-type": "export",
          selectedItems,
          clearSelection,
          stageRef,
          stageData,
        }}
      />
    </div>
  );
};

export default Navigation;

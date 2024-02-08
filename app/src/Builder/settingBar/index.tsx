import React, { useState } from "react";
import { Accordion } from "react-bootstrap";
import { Node, NodeConfig } from "konva/lib/Node";
import Widget, { WidgetKind } from "./Widget";
import widgetList from "../config/widget.json";
import FrameWidget from "./widgetList/FrameWidget";
import ImageWidget from "./widgetList/ImageWidget";
import ColorPaletteWidget from "./widgetList/ColorPaletteWidget";
import TextWidget from "./widgetList/TextWidget";
import AlignWidget from "./widgetList/AlignWidget";
import ExportWidget from "./widgetList/ExportWidget";
import useSelection from "../hook/useSelection";
import useStage from "../hook/useStage";
import ShapeWidget from "./widgetList/ShapeWidget";
import IconWidget from "./widgetList/IconWidget";
import LineWidget from "./widgetList/LineWidget";
import { ChevronLeftIcon, RectangleGroupIcon } from "@heroicons/react/20/solid";
import {
  IconsIcon,
  ImageIcon,
  ShapesIcon,
  TextIcon,
  VariableIcon,
} from "@/common/icons";
import { AnimatePresence, motion } from "framer-motion";
import VariablesWidget from "./widgetList/VariablesWidget";

export type SettingBarProps = {
  selectedItems: Node<NodeConfig>[];
  clearSelection: ReturnType<typeof useSelection>["clearSelection"];
  stageRef: ReturnType<typeof useStage>["stageRef"];
  itemType?: string;
};

export enum WidgetsEnum {
  variables = "variables",
  colorPalette = "colorPalette",
  align = "align",
  image = "image",
  frame = "frame",
  shapes = "shapes",
  text = "text",
  line = "line",
  icons = "icons",
  export = "export",
}

type IWidgets = {
  [key in WidgetsEnum]: (
    data: WidgetKind & SettingBarProps
  ) => React.ReactElement;
};

export const Widgets: IWidgets = {
  variables: (data: WidgetKind & SettingBarProps) => <VariablesWidget />,
  colorPalette: (data: WidgetKind & SettingBarProps) => (
    <ColorPaletteWidget data={data} />
  ),
  align: (data: WidgetKind & SettingBarProps) => <AlignWidget data={data} />,
  image: (data: WidgetKind & SettingBarProps) => <ImageWidget />,
  frame: (data: WidgetKind & SettingBarProps) => <FrameWidget />,
  shapes: (data: WidgetKind & SettingBarProps) => <ShapeWidget />,
  text: (data: WidgetKind & SettingBarProps) => <TextWidget />,
  line: (data: WidgetKind & SettingBarProps) => <LineWidget />,
  icons: (data: WidgetKind & SettingBarProps) => <IconWidget />,
  export: (data: WidgetKind & SettingBarProps) => <ExportWidget data={data} />,
};

interface NavItem {
  id: WidgetsEnum;
  name: string;
  Icon: any;
}

const navItems: NavItem[] = [
  {
    id: "variables",
    name: "Variables",
    Icon: VariableIcon,
  },
  {
    id: WidgetsEnum.image,
    name: "Image",
    Icon: ImageIcon,
  },
  {
    id: WidgetsEnum.shapes,
    name: "Shapes",
    Icon: ShapesIcon,
  },
  {
    id: WidgetsEnum.text,
    name: "Text",
    Icon: TextIcon,
  },
  {
    id: WidgetsEnum.icons,
    name: "Icons",
    Icon: IconsIcon,
  },
];

export type WidgetIDList = keyof typeof Widgets;

const SettingBar: React.FC<SettingBarProps> = (settingProps) => {
  const [selectedItem, setSelectedItem] = useState<WidgetsEnum | null>(null);
  const [hoveredItem, setHoveredItem] = useState<WidgetsEnum | null>(null);
  return (
    <aside className="h-full flex">
      {/*   <Accordion>
      {(widgetList as WidgetKind[]).map((data) => (
        <Widget key={`widget-${data.id}`} data={{ ...data, ...settingProps }}>
          {Widgets[data.id] && Widgets[data.id]({ ...data, ...settingProps })}
        </Widget>
      ))}
    </Accordion> */}
      <div className="flex flex-col bg-[#18191B] h-full">
        {navItems.map((item, i) => (
          <div
            key={"settbar" + i}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
            className={`flex flex-col items-center justify-center p-3 cursor-pointer relative
            `}
            onClick={() => setSelectedItem(item.id)}
          >
            <div className="flex flex-col items-center z-10 justify-center ">
              <item.Icon
                color={hoveredItem === item.id ? "white" : "#C6C6C6"}
              />
              <div
                className={`duration-300 ${
                  hoveredItem === item.id ? "text-white" : "text-[#C6C6C6]"
                } text-[12px]`}
              >
                {item.name}
              </div>
            </div>

            {selectedItem === item.id && (
              <motion.div
                layoutId="selected"
                className="absolute w-20 top-0 left-0 h-20 bg-[#252627]"
              />
            )}
          </div>
        ))}
      </div>
      <AnimatePresence>
        {selectedItem && navItems.find((n) => n.id === selectedItem) && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 300, transition: { duration: 0.3 } }}
            exit={{ width: 0, transition: { duration: 0.3 } }}
            className="flex h-full w-full"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 300, transition: { duration: 0.3 } }}
              exit={{ width: 0, transition: { duration: 0.3 } }}
              className="max-w-[300px] flex h-full bg-[#252627]"
            >
              <div className="w-full h-full p-3">
                {Widgets[selectedItem] &&
                  Widgets[selectedItem]({
                    ...navItems.find((n) => n.id === selectedItem)!,
                    ...settingProps,
                  })}
              </div>
            </motion.div>
            <div className="h-full w-[0px] relative bg-transparent flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, transition: { duration: 0.3 } }}
                exit={{ scale: 0, transition: { duration: 0.3 } }}
                onClick={() => setSelectedItem(null)}
                className="absolute bg-black h-[120px] cursor-pointer z-10 flex items-center left-0 rounded-r-full p-0"
              >
                <ChevronLeftIcon className="h-4 w-4 text-white" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
};

export default SettingBar;

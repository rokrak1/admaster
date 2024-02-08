import { Node, NodeConfig } from "konva/lib/Node";
import { Widgets, WidgetsEnum } from "../settingBar";
import { AlignIcon, ColorIcon, FontIcon } from "@/common/icons";
import { useState } from "react";
import { popupTransformers } from "./basicTransformers";

enum WidgetTypes {
  text = "text",
  shape = "shape",
  image = "image",
  icon = "icon",
}

interface PopupProps {
  selectedItems: Node<NodeConfig>[];
  onSelectItem: (item: Node<NodeConfig>) => void;
}

interface iPopupIcon {
  id: WidgetsEnum;
  name: string;
  icon: React.FC<any>;
}

const textPopupWidgets: iPopupIcon[] = [
  {
    id: WidgetsEnum.textPopup,
    name: "Font family",
    icon: FontIcon,
  },

  {
    id: WidgetsEnum.colorPalette,
    name: "Color Palette",
    icon: ColorIcon,
  },
  {
    id: WidgetsEnum.align,
    name: "Align",
    icon: AlignIcon,
  },
];

const widgetsList = {
  [WidgetTypes.text]: textPopupWidgets,
  [WidgetTypes.shape]: [],
  [WidgetTypes.image]: [],
  [WidgetTypes.icon]: [],
};

// TODO: LayerUp doesn't work
// TODO: Add image background remover to image widget
// TODO: Implement Save function -> DB -> return 10 generated image for now i guess
// Builder is fine for now i guess, I'll improve it later if needed

function isAvailablePopupType(itemType: string): itemType is WidgetTypes {
  return Object.values(WidgetTypes).includes(itemType as WidgetTypes);
}

const Popup: React.FC<PopupProps> = ({ selectedItems, onSelectItem }) => {
  if (selectedItems.length !== 1) return null; // Ensure there's exactly one selected item

  const selectedItem = selectedItems[0];
  const { x, y, width, height } = selectedItem.getClientRect();

  const itemType = selectedItem.attrs["data-item-type"];
  if (!isAvailablePopupType(itemType)) return null;

  const itemTypeWidgets = widgetsList[itemType as WidgetTypes];

  const popupX = x + width / 2 - 46 - itemTypeWidgets.length * 23;
  const popupY = y - 80;

  return (
    <div
      id="popup"
      style={{
        position: "absolute",
        left: `${popupX}px`,
        top: `${popupY}px`,
        transform: "translateY(-100%)", // Ensure the popup is fully above the item
        // Additional styling to make the popup look good
      }}
      className="bg-white border-gray-100 bshadow border rounded-lg"
    >
      <div className="flex gap-x-0 justify-center p-0.5">
        {popupTransformers.map((icon) => (
          <div
            key={icon.id}
            onClick={icon.onClick}
            className="flex items-center gap-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
          >
            <icon.icon color={"#333"} size={25} />
          </div>
        ))}
        {itemTypeWidgets.map((icon) => (
          <PopupComponentRenderer
            icon={icon}
            selectedItems={[selectedItem]}
            itemType={itemType}
            onSelectItem={onSelectItem}
          />
        ))}
      </div>
      {/*   {Widgets[WidgetsEnum.colorPalette]({ selectedItems: [selectedItem] })} */}
    </div>
  );
};
export default Popup;

const PopupComponentRenderer: React.FC<{
  icon: iPopupIcon;
  selectedItems: Node<NodeConfig>[];
  itemType: string;
  onSelectItem: (items: Node<NodeConfig>) => void;
}> = ({ icon, selectedItems, itemType, onSelectItem }) => {
  const [isOpened, setIsOpened] = useState<WidgetsEnum | null>(null);
  const { id, name } = icon;
  return (
    <div
      key={icon.id}
      onClick={() => setIsOpened(isOpened ? null : id)}
      // onBlur={() => setIsOpened(false)}
      className={`flex items-center p-2 rounded-lg cursor-pointer relative hover:bg-gray-100 ${
        isOpened === id ? "bg-gray-100" : ""
      }`}
    >
      <icon.icon color={"#333"} size={25} />
      {isOpened &&
        Widgets[id]({ selectedItems, id, name, itemType, onSelectItem })}
    </div>
  );
};

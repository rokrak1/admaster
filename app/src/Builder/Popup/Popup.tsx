import { Node, NodeConfig } from "konva/lib/Node";
import { Widgets, WidgetsEnum } from "../settingBar";
import {
  AlignIcon,
  ColorIcon,
  DeleteIcon,
  DuplicateIcon,
  LayerDown,
  LayerUp,
} from "@/common/icons";
import { useState } from "react";

interface PopupProps {
  selectedItems: Node<NodeConfig>[];
}

interface iPopupIcon {
  id: WidgetsEnum;
  name: string;
  icon: React.FC<any>;
}

const popupIcons: iPopupIcon[] = [
  {
    id: WidgetsEnum.align,
    name: "Align",
    icon: AlignIcon,
  },
  {
    id: WidgetsEnum.colorPalette,
    name: "Color Palette",
    icon: ColorIcon,
  },
];

// TODO: LayerUp doesn't work
// TODO: Add image background remover to image widget
// TODO: popup to selected itemTypes
// TODO: Implement Save function -> DB -> return 10 generated image for now i guess
// Builder is fine for now i guess, I'll improve it later if needed

const Popup: React.FC<PopupProps> = ({ selectedItems }) => {
  if (selectedItems.length !== 1) return null; // Ensure there's exactly one selected item

  const selectedItem = selectedItems[0];
  const { x, y, width, height } = selectedItem.getClientRect();

  const popupX = x + width / 2 - 120;
  const popupY = y - 70;

  const itemType = selectedItem.attrs["data-item-type"];
  const availablePopupTypes = ["shape", "text", "image", "icon"];
  console.log(itemType);

  const standardIcons = [
    {
      id: "delete",
      name: "Delete",
      icon: DeleteIcon,
      onClick: () => {
        const backspaceEvent = new KeyboardEvent("keydown", {
          key: "Backspace",
          code: "Backspace",
          keyCode: 8, // Deprecated, but included for compatibility
          bubbles: true, // Make sure the event bubbles for visibility
        });
        document.dispatchEvent(backspaceEvent);
      },
    },
    {
      id: "duplicate",
      name: "Duplicate",
      icon: DuplicateIcon,
      onClick: () => {
        const dDownEvent = new KeyboardEvent("keydown", {
          key: "d",
          keyCode: 68,
          which: 68,
          ctrlKey: true,
          bubbles: true,
        });
        document.dispatchEvent(dDownEvent);
      },
    },
    {
      id: "layer-up",
      name: "Layer Up",
      icon: LayerUp,
      onClick: () => {
        const dDownEvent = new KeyboardEvent("keydown", {
          key: "k",
          keyCode: 75,
          which: 75,
          ctrlKey: true,
          bubbles: true,
        });
        document.dispatchEvent(dDownEvent);
      },
    },
    {
      id: "layer-down",
      name: "Layer Down",
      icon: LayerDown,
      onClick: () => {
        const dDownEvent = new KeyboardEvent("keydown", {
          key: "m",
          keyCode: 77,
          which: 77,
          ctrlKey: true,
          bubbles: true,
        });
        document.dispatchEvent(dDownEvent);
      },
    },
  ];

  return (
    <div
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
        {standardIcons.map((icon) => (
          <div
            key={icon.id}
            onClick={icon.onClick}
            className="flex items-center gap-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
          >
            <icon.icon color={"#333"} size={25} />
          </div>
        ))}
        {popupIcons.map((icon) => (
          <PopupComponentRenderer
            icon={icon}
            selectedItems={[selectedItem]}
            itemType={itemType}
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
}> = ({ icon, selectedItems, itemType }) => {
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
      {isOpened && Widgets[id]({ selectedItems, id, name, itemType })}
    </div>
  );
};

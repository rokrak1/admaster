import { Node, NodeConfig } from "konva/lib/Node";
import { Widgets, WidgetsEnum } from "../settingBar";
import {
  AlignIcon,
  BackgroundRemoveIcon,
  ColorIcon,
  FontIcon,
  LoadingIcon,
} from "@/common/icons";
import { useState } from "react";
import { popupTransformers } from "./basicTransformers";
import useItem from "../hook/useItem";
import useRemoveImageBackground from "../hook/useRemoveImageBackground";
import useSelection from "../hook/useSelection";
import { toast } from "react-toastify";

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
const shapePopupWidgets: iPopupIcon[] = [
  {
    id: WidgetsEnum.colorPalette,
    name: "Color Palette",
    icon: ColorIcon,
  },
];

const widgetsList = {
  [WidgetTypes.text]: textPopupWidgets,
  [WidgetTypes.shape]: shapePopupWidgets,
  [WidgetTypes.image]: [],
  [WidgetTypes.icon]: [],
};

// TODO: LayerUp doesn't work
// TODO: Implement Save function -> DB -> return 10 generated image for now i guess
// Builder is fine for now i guess, I'll improve it later if needed

function isAvailablePopupType(itemType: string): itemType is WidgetTypes {
  return Object.values(WidgetTypes).includes(itemType as WidgetTypes);
}

const Popup: React.FC<PopupProps> = ({ selectedItems, onSelectItem }) => {
  const { updateItem } = useItem();
  const { autoRemoveBackground } = useRemoveImageBackground();
  const [loading, setLoading] = useState(false);

  const removeBackground = (
    selectedItems: ReturnType<typeof useSelection>["selectedItems"]
  ) => {
    setLoading(true);
    if (
      selectedItems.length === 1 &&
      selectedItems[0].attrs["data-item-type"] === "image"
    ) {
      const originalImage = new Image();
      originalImage.onload = () => {
        originalImage.width = attrs.width;
        originalImage.height = attrs.height;
        autoRemoveBackground(originalImage)
          .then((base64: string) => {
            updateItem(selectedItems[0].id(), (attrs) => ({
              ...attrs,
              src: base64,
            }));
            setLoading(false);
          })
          .catch((e) => {
            toast.error("Failed to remove background");
            setLoading(false);
          });
      };
      const { attrs } = selectedItems[0];
      const source = attrs.image.src;
      originalImage.src = source;
    }
  };

  if (selectedItems.length !== 1) return null;

  const selectedItem = selectedItems[0];
  const { x, y, width, height } = selectedItem.getClientRect();

  const itemType = selectedItem.attrs["data-item-type"];
  if (!isAvailablePopupType(itemType)) return null;

  const itemTypeWidgets = widgetsList[itemType as WidgetTypes];

  const popupX = x + width / 2 - 46 - itemTypeWidgets.length * 23;
  const popupY = y - 80;

  const renderBgRemover = itemType === WidgetTypes.image;
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

        {renderBgRemover && (
          <div
            key={"bg-remove"}
            onClick={() => removeBackground(selectedItems)}
            className="flex items-center gap-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
          >
            {(loading && <LoadingIcon color={"#333"} size={25} />) || (
              <BackgroundRemoveIcon color={"#333"} size={25} />
            )}
          </div>
        )}
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

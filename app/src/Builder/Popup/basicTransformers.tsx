import { DeleteIcon, DuplicateIcon, LayerDown, LayerUp } from "@/common/icons";

export const standardTransformers = [
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

let popupTransformersIds = ["delete", "duplicate"];
export const popupTransformers = standardTransformers.filter((t) =>
  popupTransformersIds.includes(t.id)
);

import Konva from "konva";

export const updateTextParent = (item: Konva.Node) => {
  const parent = item.getParent();

  if (parent instanceof Konva.Layer) {
    const group = parent.children.find(
      (child) => child instanceof Konva.Group && child.name() === "label-group"
    );

    if (group) {
      item.moveTo(group); // moveTo automatically handles removal from the old parent
    }
  }

  return item;
};

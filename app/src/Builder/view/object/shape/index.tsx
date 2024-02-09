import { RegularPolygon as RegularPolygonType } from "konva/lib/shapes/RegularPolygon";
import { Rect as RectType } from "konva/lib/shapes/Rect";
import React, { RefObject, useEffect, useRef } from "react";
import { Rect, RegularPolygon } from "react-konva";
import { OverrideItemProps } from "@/Builder/hook/useItem";
import useTransformer from "@/Builder/hook/useTransformer";
import { StageData } from "@/redux/currentStageData";
import useDragAndDrop from "@/Builder/hook/useDragAndDrop";
import useStage from "@/Builder/hook/useStage";
import { updateTextParent } from "@/Builder/util/changeParentToGroup";

export type ShapeItemKind = {
  "data-item-type": string;
  id: string;
  icon: string;
  x: number;
  y: number;
  sides: number;
  radius: number;
};

export type ShapeItemProps = OverrideItemProps<{
  data: StageData;
  transformer: ReturnType<typeof useTransformer>;
  e?: DragEvent;
  setShowPopup: (val: boolean) => void;
}>;

const ShapeItem: React.FC<ShapeItemProps> = ({
  data,
  e,
  transformer,
  onSelect,
  setShowPopup,
}) => {
  const { attrs } = data;

  const shapeRef = useRef() as RefObject<RegularPolygonType | RectType>;
  const stage = useStage();
  const { onDragMoveFrame, onDragEndFrame, checkIsInFrame } = useDragAndDrop(
    stage.stageRef,
    stage.dragBackgroundOrigin
  );

  useEffect(() => {
    if (shapeRef.current) {
      stage.setStageRef(shapeRef.current.getStage()!);
      checkIsInFrame(shapeRef.current);
      updateTextParent(shapeRef.current);
    }
  }, [data]);

  useEffect(() => {
    const shapeNode = shapeRef.current;
    if (shapeNode) {
      shapeNode.on("dragstart", (e) => {
        setShowPopup(false);
      });

      shapeNode.on("dragend", (e) => {
        setShowPopup(true);
      });

      return () => {
        shapeNode.off("dragstart dragend");
      };
    }
  }, []);

  if (attrs.sides === 4) {
    return (
      <Rect
        ref={shapeRef as RefObject<RectType>}
        onClick={onSelect}
        name="label-target"
        data-item-type="shape"
        id={data.id}
        x={attrs.x}
        y={attrs.y}
        width={Math.sqrt(attrs.radius * 2)}
        height={Math.sqrt(attrs.radius * 2)}
        sides={attrs.sides}
        radius={attrs.radius}
        scaleX={attrs.scaleX}
        scaleY={attrs.scaleY}
        fill={attrs.fill ?? "#000000"}
        stroke={attrs.stroke ?? null}
        strokeWidth={attrs.stroke ? 5 : undefined}
        opacity={attrs.opacity ?? 1}
        rotation={attrs.rotation ?? 0}
        draggable
        onDragMove={onDragMoveFrame}
        onDragEnd={onDragEndFrame}
      />
    );
  }

  return (
    <RegularPolygon
      ref={shapeRef as RefObject<RegularPolygonType>}
      onClick={onSelect}
      name="label-target"
      data-item-type="shape"
      id={data.id}
      x={attrs.x}
      y={attrs.y}
      sides={attrs.sides}
      radius={attrs.radius}
      scaleX={attrs.scaleX}
      scaleY={attrs.scaleY}
      fill={attrs.fill ?? "#000000"}
      stroke={attrs.stroke ?? null}
      strokeWidth={attrs.stroke ? 5 : undefined}
      opacity={attrs.opacity ?? 1}
      rotation={attrs.rotation ?? 0}
      draggable
      onDragMove={onDragMoveFrame}
      onDragEnd={onDragEndFrame}
    />
  );
};

export default ShapeItem;

import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import React, { RefObject, useCallback, useEffect, useRef } from "react";
import { Text as KonvaText } from "react-konva";
import useItem, { OverrideItemProps } from "@/Builder/hook/useItem";
import useTransformer from "@/Builder/hook/useTransformer";
import { StageData } from "@/redux/currentStageData";
import useDragAndDrop from "@/Builder/hook/useDragAndDrop";
import useStage from "@/Builder/hook/useStage";
import { updateTextParent } from "@/Builder/util/changeParentToGroup";

export type TextItemKind = {
  "data-item-type": string;
  id: string;
  name: string;
  text: string;
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
};

export type TextItemProps = OverrideItemProps<{
  data: StageData;
  transformer: ReturnType<typeof useTransformer>;
  e?: DragEvent;
  setShowPopup: (val: boolean) => void;
}>;

export const measureTextWidth = (text, font) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = font;
  console.log(text, font, context.measureText(text));
  return context.measureText(text).width;
};

const TextItem: React.FC<TextItemProps> = ({
  data,
  e,
  transformer,
  onSelect,
  setShowPopup,
}) => {
  const { attrs } = data;

  const textRef = useRef() as RefObject<Konva.Text>;
  const { updateItem } = useItem();
  const stage = useStage();
  const { onDragMoveFrame, onDragEndFrame, checkIsInFrame } = useDragAndDrop(
    stage.stageRef,
    stage.dragBackgroundOrigin
  );

  const onEditStart = () => {
    if (textRef.current === null) {
      console.error("textRef is null");
      return;
    }

    textRef.current.hide();
    transformer.transformerRef.current!.hide();
    const textPosition = textRef.current.getAbsolutePosition();
    const stage = textRef.current.getStage();
    const container = stage!.container().getBoundingClientRect();
    const padding = 5;
    const areaPosition = {
      x: container.x + textPosition.x,
      y: container.y + textPosition.y,
    };

    const font = `${
      textRef.current.fontSize() * stage!.scaleY() * textRef.current.scaleY()
    }px ${textRef.current.fontFamily()}`;
    const textWidth = measureTextWidth(textRef.current.text(), font);

    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);

    textarea.id = "current_text_editor";
    textarea.innerHTML = textRef.current.text();
    textarea.style.zIndex = "100";
    textarea.style.position = "absolute";
    textarea.style.top = `${areaPosition.y}px`;
    textarea.style.left = `${areaPosition.x}px`;
    textarea.style.fontSize = `${
      textRef.current.fontSize() * stage!.scaleY() * textRef.current.scaleY()
    }px`;
    /*   textarea.style.width = `${textarea.value
      .split("\n")
      .sort((a, b) => b.length - a.length)[0]
      .split("")
      .reduce(
        (acc, curr) =>
          curr.charCodeAt(0) >= 32 && curr.charCodeAt(0) <= 126
            ? acc +
              textRef.current!.fontSize() *
                stage!.scaleY() *
                textRef.current!.scaleY() *
                (3 / 5)
            : acc +
              textRef.current!.fontSize() *
                stage!.scaleY() *
                textRef.current!.scaleY(),
        0
      )}px`; */

    textarea.style.width = `${textWidth + padding * 2}px`;
    textarea.style.height = `${
      textRef.current.height() + textRef.current.padding() * 2 + 5
    }px`;
    textarea.style.border = "none";
    textarea.style.padding = "0px";
    textarea.style.margin = "0px";
    textarea.style.overflow = "hidden";
    textarea.style.background = "none";
    textarea.style.outline = "none";
    textarea.style.resize = "none";
    textarea.style.lineHeight = textRef.current.lineHeight().toString();
    textarea.style.fontFamily = textRef.current.fontFamily();
    textarea.style.transformOrigin = "left top";
    textarea.style.textAlign = textRef.current.align();
    textarea.style.color = textRef.current.fill();
    const rotation = textRef.current.rotation();
    let transform = "";
    if (rotation) {
      transform += `rotateZ(${rotation}deg)`;
    }

    let px = 0;
    // also we need to slightly move textarea on firefox
    // because it jumps a bit
    const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
    if (isFirefox) {
      px += 2 + Math.round(textRef.current.fontSize() / 20);
    }
    transform += `translateY(-${px}px)`;

    textarea.style.transform = transform;

    // reset height
    textarea.style.height = "auto";
    // after browsers resized it we can set actual value
    textarea.style.height = `${textarea.scrollHeight + 3}px`;

    textarea.focus();

    function removeTextarea() {
      window.removeEventListener("click", handleOutsideClick);
      textRef!.current!.show();
      transformer.transformerRef.current!.show();
      updateItem(textRef.current!.id(), () => ({
        ...textRef.current!.attrs,
        width:
          textarea.getBoundingClientRect().width /
          stage!.scaleY() /
          textRef.current!.scaleY(),
        height:
          textarea.value.split("\n").length * textRef.current!.fontSize() * 1.2,
        updatedAt: Date.now(),
      }));
      textarea.parentNode!.removeChild(textarea);
    }

    function setTextareaWidth() {
      let newWidth = measureTextWidth(textRef.current.text(), font);
      // some extra fixes on different browsers
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      const isFirefox =
        navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
      if (isSafari || isFirefox) {
        newWidth = Math.ceil(newWidth);
      }

      textarea.style.width = `${newWidth}px`;
    }

    textarea.addEventListener("input", (e) => {
      textarea.style.width = `${textarea.value
        .split("\n")
        .sort((a, b) => b.length - a.length)[0]
        .split("")
        .reduce(
          (acc, curr) =>
            curr.charCodeAt(0) >= 32 && curr.charCodeAt(0) <= 126
              ? acc +
                textRef.current!.fontSize() *
                  stage!.scaleY() *
                  textRef.current!.scaleY() *
                  (3 / 5)
              : acc +
                textRef.current!.fontSize() *
                  stage!.scaleY() *
                  textRef.current!.scaleY(),
          0
        )}px`;
    });

    textarea.addEventListener("keydown", (e) => {
      // hide on enter
      // but don't hide on shift + enter
      if (e.keyCode === 13 && !e.shiftKey) {
        textRef!.current!.text(textarea.value);
        removeTextarea();
      }
      // on esc do not set value back to node
      if (e.keyCode === 27) {
        removeTextarea();
      }
    });

    textarea.addEventListener("keydown", (e) => {
      setTextareaWidth();
      textarea.style.height = "auto";
      textarea.style.height = `${
        textarea.scrollHeight + textRef!.current!.fontSize()
      }px`;
    });

    function handleOutsideClick(e: MouseEvent) {
      if (e.target !== textarea) {
        textRef!.current!.text(textarea.value);
        removeTextarea();
      }
    }

    setTimeout(() => {
      window.addEventListener("click", handleOutsideClick);
    });
  };

  const _onDragMoveFrame = useCallback((e: KonvaEventObject<DragEvent>) => {
    const parentNode = e.target.getParent();
    if (parentNode) {
      const parentType = parentNode.constructor.name;
      console.log("Parent type:", parentType);
      if (parentType !== "Group") {
        console.log("meh", parentType);
      }
    }
    e.target.getLayer()?.batchDraw();
  }, []);

  const _onDragEndFrame = useCallback(
    (e: KonvaEventObject<DragEvent>) => {
      e.evt.preventDefault();
      e.evt.stopPropagation();

      const parentNode = e.target.getParent();
      if (parentNode) {
        const parentType = parentNode.constructor.name;
        if (parentType === "Layer") {
          let layerChildren = e.target.getParent().children;
          let group = layerChildren.find(
            (child) => child.constructor.name === "Group"
          );
        }
      }
      updateItem(e.target.id(), () => ({
        ...e.target.attrs,
      }));
      e.target.getParent().clipFunc(e.target.getLayer().Context);
      e.target.getLayer()?.batchDraw();
    },
    [data]
  );

  const onClickText = (e: KonvaEventObject<MouseEvent>) => {
    if (e.evt.detail === 1) {
      setTimeout(() => {
        if (document.getElementById("current_text_editor")) {
          return;
        }
        onSelect(e);
      }, 200);
      return;
    }
    onEditStart();
  };

  useEffect(() => {
    const shapeNode = textRef.current;
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

  useEffect(() => {
    const shapeNode = textRef.current;
    if (!shapeNode) {
      return;
    }

    updateTextParent(shapeNode);
  }, [textRef, attrs]);

  return (
    <KonvaText
      ref={textRef}
      text={attrs.text}
      fontFamily={attrs.fontFamily}
      fontSize={attrs.fontSize}
      onClick={onClickText}
      //onDblClick={onEditStart}
      name="label-target"
      data-item-type="text"
      data-frame-type="text"
      id={data.id}
      x={attrs.x}
      y={attrs.y}
      align={attrs.align ?? "center"}
      verticalAlign={attrs.verticalAlign ?? "middel"}
      width={attrs.width}
      height={attrs.height}
      scaleX={attrs.scaleX}
      scaleY={attrs.scaleY}
      fill={attrs.fill ?? "#000000"}
      stroke={attrs.stroke ?? null}
      strokeWidth={attrs.stroke ? 1 : undefined}
      opacity={attrs.opacity ?? 1}
      rotation={attrs.rotation ?? 0}
      draggable
      onDragMove={onDragMoveFrame}
      onDragEnd={_onDragEndFrame}
    />
  );
};

export default TextItem;

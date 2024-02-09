import Konva from "konva";
import { Filter } from "konva/lib/Node";
import React, { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { Image as KonvaImage } from "react-konva";
import useDragAndDrop from "@/Builder/hook/useDragAndDrop";
import { OverrideItemProps } from "@/Builder/hook/useItem";
import useStage from "@/Builder/hook/useStage";
import { StageData } from "@/redux/currentStageData";
import { decimalUpToSeven } from "@/Builder/util/decimalUpToSeven";
import { updateTextParent } from "@/Builder/util/changeParentToGroup";

export type ImageItemKind = {
  "data-item-type": string;
  id: string;
  name: string;
  src: string;
  image: typeof Image;
};

export type ImageItemProps = OverrideItemProps<{
  data: StageData;
  e?: DragEvent;
  setShowPopup: (val: boolean) => void;
}>;

export const filterMap: { [name: string]: Filter } = {
  Brighten: Konva.Filters.Brighten,
  Grayscale: Konva.Filters.Grayscale,
};

const ImageItem: React.FC<ImageItemProps> = ({
  data,
  e,
  onSelect,
  setShowPopup,
}) => {
  const { attrs } = data;
  const imageRef = useRef() as RefObject<Konva.Image>;
  const [imageSrc, setImageSrc] = useState<CanvasImageSource>(new Image());

  const stage = useStage();
  const { onDragMoveFrame, onDragEndFrame, checkIsInFrame } = useDragAndDrop(
    stage.stageRef,
    stage.dragBackgroundOrigin
  );
  // const changeImageSrc = (base64: string) => {
  //   const newImage = new Image();
  //   newImage.onload = () => {
  //     setImageSrc(newImage);
  //   };
  //   newImage.crossOrigin = "Anonymous";
  //   newImage.src = base64;
  // };
  // const { onMouseMoveSelectColor, onMouseDownAndMoveRemoveColor } = useBrush(
  //   imageSrc as HTMLImageElement,
  //   changeImageSrc,
  //   attrs.width,
  //   attrs.height
  // );

  const filters = useMemo(() => {
    if (!data.attrs._filters) {
      return [Konva.Filters.Brighten];
    }
    return data.attrs._filters.map(
      (filterName: string) => filterMap[filterName]
    );
  }, [data.attrs]);

  useEffect(() => {
    const newImage = new Image();
    newImage.onload = () => {
      setImageSrc(newImage);
    };
    newImage.crossOrigin = "Anonymous";
    let source;
    if (attrs.src.startsWith("find:")) {
      source = attrs.src;
    } else {
      source = attrs.src;
    }
    if (source.startsWith("data:")) {
      Konva.Image.fromURL(source, (imageNode: Konva.Image) => {
        let width;
        let height;
        if (imageNode.width() > imageNode.height()) {
          width = decimalUpToSeven(512);
          height = decimalUpToSeven(
            width * (imageNode.height() / imageNode.width())
          );
        } else {
          height = decimalUpToSeven(512);
          width = decimalUpToSeven(
            height * (imageNode.width() / imageNode.height())
          );
        }
        imageNode.width(width);
        imageNode.height(height);
        const newBase64 = imageNode.toDataURL({
          x: 0,
          y: 0,
          width,
          height,
          pixelRatio: 5,
        });
        newImage.src = newBase64;
      });
      return;
    }
    newImage.src = source;
  }, [attrs.src]);

  useEffect(() => {
    if (imageRef.current) {
      stage.setStageRef(imageRef.current!.getStage()!);
      imageRef.current.brightness(data.attrs.brightness);
      checkIsInFrame(imageRef.current);
      updateTextParent(imageRef.current);
      imageRef.current.cache();
    }
  }, [imageSrc, data]);

  useEffect(() => {
    imageRef.current!.cache();
  }, []);

  useEffect(() => {
    const shapeNode = imageRef.current;
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

  return (
    <KonvaImage
      ref={imageRef}
      image={imageSrc}
      onClick={onSelect}
      name="label-target"
      data-item-type="image"
      data-frame-type="image"
      id={data.id}
      x={attrs.x}
      y={attrs.y}
      width={attrs.width}
      height={attrs.height}
      scaleX={attrs.scaleX}
      scaleY={attrs.scaleY}
      fill={attrs.fill ?? "transparent"}
      opacity={attrs.opacity ?? 1}
      rotation={attrs.rotation ?? 0}
      filters={filters ?? [Konva.Filters.Brighten]}
      draggable
      onDragMove={onDragMoveFrame}
      onDragEnd={onDragEndFrame}
    />
  );
};

export default ImageItem;

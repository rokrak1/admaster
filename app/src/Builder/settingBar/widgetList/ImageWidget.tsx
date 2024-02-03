import React, { useState } from "react";
import { Button, Col, Figure, Row } from "react-bootstrap";
import { nanoid } from "nanoid";
import presetImageList from "@/Builder/config/image.json";
import { ImageItemKind } from "@/Builder/view/object/image";
import colorStyles from "@/Builder/style/color.module.css";
import borderStyles from "@/Builder/style/border.module.css";
import sizeStyles from "@/Builder/style/size.module.css";
import spaceStyles from "@/Builder/style/space.module.css";
import displayStyles from "@/Builder/style/display.module.css";
import alignStyles from "@/Builder/style/align.module.css";
import fontStyles from "@/Builder/style/font.module.css";
import Drag from "@/Builder/util/Drag";
import TRIGGER from "@/Builder/config/trigger";
import useImageAsset from "@/Builder/hook/useImageAsset";
import useI18n from "@/Builder/hook/usei18n";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export const IMAGE_LIST_KEY = "importedImage";

const ImageWidget: React.FC = () => {
  const { setImageAsset, getAllImageAsset } = useImageAsset();
  const { getTranslation } = useI18n();
  const [imageAssetList, setImageAssetList] = useState(() => {
    if (getAllImageAsset().length) {
      return [...getAllImageAsset()!];
    }
    setImageAsset(presetImageList);
    return [...presetImageList];
  });

  const uploadImage = () => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setImageAssetList((prev) => {
        const result = [
          {
            type: "image",
            id: nanoid(),
            name: "imported image",
            src: fileReader.result as string,
          },
          ...prev,
        ];
        setImageAsset(result);
        return result;
      });
    };
    const file = document.createElement("input");
    file.type = "file";
    file.accept = "image/png, image/jpeg";
    file.onchange = (e) => {
      const event = e;
      if (event.target && (event.target as HTMLInputElement).files) {
        Object.values((event.target as HTMLInputElement).files!).forEach(
          (file) => {
            fileReader.readAsDataURL(file);
          }
        );
      }
    };
    file.click();
  };

  return (
    <div className={"flex flex-col max-h-full overflow-hidden"}>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1, transition: { duration: 0.2 } }}
        exit={{ scale: 0, transition: { duration: 0.3 } }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={uploadImage}
        className={`duration-300 text-white self-center mb-3 flex bshadow px-5
         items-center w-[200px] justify-center gap-x-2 p-2 w-max
         rounded-lg bg-gradient-to-r from-zinc-700 from-0% to-neutral-600 to-100%
         `}
      >
        <span className="font-semibold">
          {getTranslation("widget", "image", "name")}
        </span>
        <PlusCircleIcon className="w-7" />
      </motion.button>
      <div className="grid grid-cols-2 gap-4 overflow-scroll pretty-scrollbar">
        {imageAssetList.map((_data) => (
          <ImageThumbnail
            key={`image-thumbnail-${_data.id}`}
            data={{
              id: _data.id,
              src: _data.src ?? `find:${_data.id}`,
              name: _data.name,
              "data-item-type": _data.type,
            }}
            maxPx={80}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageWidget;

const ImageThumbnail: React.FC<{
  maxPx: number;
  data: Omit<ImageItemKind, "image">;
}> = ({ data: { id, ...data }, maxPx }) => {
  const { getImageAssetSrc } = useImageAsset();
  return (
    <Figure
      as={Col}
      className={[alignStyles.absoluteCenter, alignStyles.wrapTrue].join(" ")}
    >
      <Drag
        dragType="copyMove"
        dragSrc={{
          trigger: TRIGGER.INSERT.IMAGE,
          "data-item-type": data["data-item-type"],
          src: data.src.startsWith("data:")
            ? data.src
            : `/assets/image/${data.src}`,
          varId: id,
        }}
      >
        <motion.img
          initial={{ scale: 0 }}
          animate={{ scale: 1, transition: { duration: 0.3, delay: 0.2 } }}
          exit={{ scale: 0, transition: { duration: 0.3 } }}
          alt={data.name}
          src={
            data.src.startsWith("data:")
              ? data.src
              : `/assets/image/${data.src}`
          }
          className="p-1"
        />
      </Drag>
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1, transition: { duration: 0.3, delay: 0.2 } }}
        exit={{ scale: 0, transition: { duration: 0.3 } }}
      >
        <Figure.Caption
          className={[
            fontStyles.font075em,
            sizeStyles.width100,
            "text-center",
          ].join(" ")}
        >
          {data.name}
        </Figure.Caption>
      </motion.span>
    </Figure>
  );
};

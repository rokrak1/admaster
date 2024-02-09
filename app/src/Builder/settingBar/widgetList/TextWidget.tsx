import React from "react";
import { Col, Figure, Row } from "react-bootstrap";
import textList from "@/Builder/config/text.json";
import { TextItemKind, measureTextWidth } from "@/Builder/view/object/text";
import alignStyles from "@/Builder/style/align.module.css";
import sizeStyles from "@/Builder/style/size.module.css";
import Drag from "@/Builder/util/Drag";
import TRIGGER from "@/Builder/config/trigger";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { StoreState } from "@/redux/store";
import useItem from "@/Builder/hook/useItem";

export const TextPopupWidget: React.FC<{ data: any }> = ({ data }) => {
  const { updateItem } = useItem();

  let selectedItem = data.selectedItems[0];
  let text = selectedItem.attrs.text;
  let changedTextList = textList.map((item) => ({ ...item, text: text }));

  const updateFontFamily = ({ fontFamily, text, fontSize }) => {
    let scaleY = selectedItem.scaleY();
    const font = `${fontSize * scaleY * scaleY}px ${fontFamily}`;
    const width = measureTextWidth(text, font);
    selectedItem.attrs.fontFamily = fontFamily;
    selectedItem.setWidth(width);

    updateItem(selectedItem.id(), () => selectedItem.attrs);
    data.onSelectItem({ evt: null, target: selectedItem }, selectedItem);
  };

  return (
    <div
      className="absolute bottom-12  bg-white rounded-lg bshadow overflow-hidden "
      style={{
        width: 300,
        left: -100,
        height: 200,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ height: 200 }} className="overflow-y-scroll rounded-lg">
        {changedTextList.map(
          ({ type, id, width, height, fontSize, fontFamily, text }) => (
            <div
              key={`text-popup-${id}`}
              className="flex items-center gap-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
              onClick={() => updateFontFamily({ fontFamily, text, fontSize })}
            >
              <motion.h6
                initial={{ scale: 0 }}
                animate={{
                  scale: 1,
                  transition: { duration: 0.3, delay: 0.3 },
                }}
                exit={{ scale: 0 }}
                style={{
                  width: "100%",
                  fontFamily: fontFamily,
                  fontSize: fontSize - 10,
                  textAlign: "center",
                }}
                className="text-black"
              >
                {text}
              </motion.h6>
            </div>
          )
        )}
      </div>
    </div>
  );
};

const TextWidget: React.FC<{ varsOnly?: boolean }> = ({ varsOnly }) => {
  const dataFeedVariables = useSelector(
    (state: StoreState) => state.dataFeed.dataFeedVariables
  );

  const textListFiltered = !varsOnly
    ? textList
    : dataFeedVariables.map((v) => {
        let textx = { ...textList[0] };
        textx.text = `%VAR_${v}%`;
        return textx;
      });

  return (
    <Row xs={2} className={[sizeStyles["mx-h-30vh"]].join(" ")}>
      {textListFiltered.length &&
        textListFiltered.map(
          ({ type, id, width, height, fontSize, fontFamily, text }) => (
            <TextThumbnail
              key={`text-thumbnail-${id}`}
              data={{
                id,
                name: text,
                width,
                height,
                fontSize,
                fontFamily,
                text,
                "data-item-type": type,
              }}
              maxPx={80}
            />
          )
        )}
    </Row>
  );
};

export default TextWidget;

const TextThumbnail: React.FC<{ maxPx: number; data: TextItemKind }> = ({
  data,
  maxPx,
}) => (
  <Figure
    as={Col}
    className={
      [alignStyles.absoluteCenter, alignStyles.wrapTrue].join(" ") + " my-2"
    }
  >
    <Drag
      dragType="copyMove"
      dragSrc={{
        trigger: TRIGGER.INSERT.TEXT,
        ...data,
      }}
    >
      <motion.h6
        initial={{ scale: 0 }}
        animate={{ scale: 1, transition: { duration: 0.3, delay: 0.3 } }}
        exit={{ scale: 0 }}
        style={{
          width: "100%",
          fontFamily: data.fontFamily,
          fontSize: data.fontSize - 10,
          textAlign: "center",
        }}
        className="text-white"
      >
        {data.text.includes("%VAR_")
          ? data.text.split("%VAR_")[1].split("%")[0]
          : data.text}
      </motion.h6>
    </Drag>
  </Figure>
);

import React from "react";
import { Col, Figure, Row } from "react-bootstrap";
import textList from "@/Builder/config/text.json";
import { TextItemKind } from "@/Builder/view/object/text";
import alignStyles from "@/Builder/style/align.module.css";
import sizeStyles from "@/Builder/style/size.module.css";
import Drag from "@/Builder/util/Drag";
import TRIGGER from "@/Builder/config/trigger";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { StoreState } from "@/redux/store";

const TextWidget: React.FC<{ varsOnly?: boolean }> = ({ varsOnly }) => {
  const dataFeedVariables = useSelector(
    (state: StoreState) => state.dataFeed.dataFeedVariables
  );
  console.log(textList);
  const textListFiltered = !varsOnly
    ? textList
    : dataFeedVariables.map((v) => {
        let textx = { ...textList[0] };
        textx.text = `%VAR_${v}%`;
        return textx;
      });

  console.log("textListFiltered", textListFiltered);
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
    {/* <Figure.Caption
        className={[fontStyles.fontHalf1em, "text-center"].join(" ")}
      >
        {`${data.text}`}
      </Figure.Caption> */}
  </Figure>
);

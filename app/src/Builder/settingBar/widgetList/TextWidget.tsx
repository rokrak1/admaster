import React from "react";
import { Col, Figure, Row } from "react-bootstrap";
import textList from "@/Builder/config/text.json";
import { TextItemKind } from "@/Builder/view/object/text";
import alignStyles from "@/Builder/style/align.module.css";
import sizeStyles from "@/Builder/style/size.module.css";
import Drag from "@/Builder/util/Drag";
import TRIGGER from "@/Builder/config/trigger";
import { motion } from "framer-motion";

const TextWidget: React.FC = () => (
  <Row xs={2} className={[sizeStyles["mx-h-30vh"]].join(" ")}>
    {textList.map(({ type, id, width, height, fontSize, fontFamily, text }) => (
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
    ))}
  </Row>
);

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
        {data.text}
      </motion.h6>
    </Drag>
    {/* <Figure.Caption
        className={[fontStyles.fontHalf1em, "text-center"].join(" ")}
      >
        {`${data.text}`}
      </Figure.Caption> */}
  </Figure>
);

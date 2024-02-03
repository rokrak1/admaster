import React from "react";
import { Col, Figure, Row } from "react-bootstrap";
import shapeList from "@/Builder/config/shape.json";
import alignStyles from "@/Builder/style/align.module.css";
import sizeStyles from "@/Builder/style/size.module.css";
import Drag from "@/Builder/util/Drag";
import TRIGGER from "@/Builder/config/trigger";
import { ShapeItemKind } from "@/Builder/view/object/shape";
import { motion } from "framer-motion";

const ShapeWidget: React.FC = () => (
  <Row xs={2}>
    {shapeList.map(({ type, id, sides, radius, icon }) => (
      <ShapeThumbnail
        key={`shape-thumbnail-${id}`}
        data={{
          id,
          sides,
          radius,
          icon,
          "data-item-type": type,
        }}
        maxPx={80}
      />
    ))}
  </Row>
);

export default ShapeWidget;

const ShapeThumbnail: React.FC<{
  maxPx: number;
  data: Omit<Omit<ShapeItemKind, "x">, "y">;
}> = ({ data, maxPx }) => (
  <Figure
    as={Col}
    className={[
      alignStyles.absoluteCenter,
      alignStyles.wrapTrue,
      sizeStyles.width25,
    ].join(" ")}
  >
    <Drag
      dragType="copyMove"
      dragSrc={{
        trigger: TRIGGER.INSERT.SHAPE,
        ...data,
      }}
    >
      <motion.i
        initial={{ scale: 0 }}
        animate={{ scale: 1, transition: { duration: 0.3, delay: 0.3 } }}
        exit={{ scale: 0 }}
        className={[`bi-${data.icon} p-3`].join(" bg-transparent")}
        style={{
          fontSize: 40,
          color: "white",
        }}
      />
    </Drag>
    {/* <Figure.Caption
        className={[
          fontStyles.fontHalf1em,
          sizeStyles.width100,
          "text-center",
        ].join(" ")}
      >
        {`${data.id}`}
      </Figure.Caption> */}
  </Figure>
);

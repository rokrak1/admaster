import React, { useMemo, useState } from "react";
import { Col, Figure, Form, Row } from "react-bootstrap";
import iconList from "@/Builder/config/icon.json";
import alignStyles from "@/Builder/style/align.module.css";
import sizeStyles from "@/Builder/style/size.module.css";
import Drag from "@/Builder/util/Drag";
import TRIGGER from "@/Builder/config/trigger";
import { IconItemKind } from "@/Builder/view/object/icon";
import useI18n from "@/Builder/hook/usei18n";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { motion } from "framer-motion";

const IconWidget: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const { getTranslation } = useI18n();

  const icons = useMemo(() => {
    if (searchKeyword === "") {
      return iconList.slice(0, 40);
    }
    return iconList.filter((_icon) => _icon.name.indexOf(searchKeyword) !== -1);
  }, [searchKeyword]);

  const changeKeyword = (e: React.BaseSyntheticEvent) => {
    setSearchKeyword(e.currentTarget.value as string);
  };

  return (
    <div className={"flex flex-col max-h-[calc(100%-40px)] overflow-hidden"}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1, transition: { duration: 0.3, delay: 0.3 } }}
        exit={{ scale: 0 }}
      >
        <Form>
          <Form.Group className="mb-3" controlId="iconKeyword">
            <Form.Label>
              {getTranslation("widget", "icon", "search", "title")}
            </Form.Label>
            <div className="flex bg-white rounded-md p-1">
              <MagnifyingGlassIcon className="w-7 text-black" />

              <Form.Control
                onChange={changeKeyword}
                type="text"
                placeholder={getTranslation(
                  "widget",
                  "icon",
                  "search",
                  "placeholder"
                )}
                className="border-0 iconsinput"
              />
            </div>
            <Form.Text className="text-muted">
              {getTranslation("widget", "icon", "search", "desc")}
            </Form.Text>
          </Form.Group>
        </Form>
      </motion.div>
      <div className="grid grid-cols-2 gap-3 overflow-y-scroll pretty-scrollbar">
        {icons.map((_data) => (
          <IconThumbnail
            key={`icon-thumbnail-${_data.id}`}
            data={{
              id: _data.id,
              name: _data.name,
              icon: _data.icon,
              "data-item-type": _data.type,
            }}
            maxPx={80}
          />
        ))}
      </div>
    </div>
  );
};

export default IconWidget;

const IconThumbnail: React.FC<{
  maxPx: number;
  data: Omit<IconItemKind, "image">;
}> = ({ data: { id, ...data }, maxPx }) => (
  <Figure
    as={Col}
    className={[alignStyles.absoluteCenter, alignStyles.wrapTrue].join(" ")}
  >
    <Drag
      dragType="copyMove"
      dragSrc={{
        trigger: TRIGGER.INSERT.ICON,
        ...data,
      }}
    >
      <motion.img
        initial={{ scale: 0 }}
        animate={{ scale: 1, transition: { duration: 0.3, delay: 0.3 } }}
        exit={{ scale: 0 }}
        alt={data.icon}
        src={`assets/icon/bootstrap/${data.icon}`}
        style={{ filter: "invert(100%)" }}
        className="w-8 m-2"
      />
    </Drag>
    {/* <Figure.Caption
        className={[fontStyles.fontHalf1em, "text-center"].join(" ")}
      >
        {data.name}
      </Figure.Caption> */}
  </Figure>
);

import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Figure,
  Form,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { Filter, Node, NodeConfig } from "konva/lib/Node";
import RangeSlider from "react-bootstrap-range-slider";
import { ColorResult, SketchPicker } from "react-color";
import { nanoid } from "nanoid";
import Konva from "konva";
import colorPaletteList from "@/Builder/config/colorPalette.json";
import colorStyles from "@/Builder/style/color.module.css";
import borderStyles from "@/Builder/style/border.module.css";
import sizeStyles from "@/Builder/style/size.module.css";
import spaceStyles from "@/Builder/style/space.module.css";
import displayStyles from "@/Builder/style/display.module.css";
import positionStyles from "@/Builder/style/position.module.css";
import alignStyles from "@/Builder/style/align.module.css";
import { WidgetKind } from "../Widget";
import { SettingBarProps } from "..";
import useItem from "@/Builder/hook/useItem";
import useLocalStorage from "@/Builder/hook/useLocalStorage";
import useI18n from "@/Builder/hook/usei18n";
import { OpacityIcon } from "@/common/icons";
import { useContextMenu } from "@/Builder/hook/useContextMenu";
import ContextMenuTemplates from "@/Builder/ContextMenu/TemplateActionsMenu";
import { ColorsContextMenu } from "@/Builder/ContextMenu";

export type ColorPaletteKind = {
  "data-item-type": string;
  id: string;
  colorCode: string;
  selectedItems: Node<NodeConfig>[];
};

type ColorPaletteWidgetProps = {
  data: WidgetKind & SettingBarProps;
};

export const COLOR_LIST_KEY = "colorList";

const ColorPaletteWidget: React.FC<ColorPaletteWidgetProps> = ({ data }) => {
  const { getValue, setValue } = useLocalStorage();
  const { updateItem } = useItem();
  const { getTranslation } = useI18n();
  const {
    setClicked,
    setContextData,
    setCoords,
    clicked,
    coords,
    contextData,
  } = useContextMenu();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newColor, setNewColor] = useState<string>("#000000");

  const [colorList, setColorList] = useState(() => {
    if (getValue(COLOR_LIST_KEY)) {
      return [...getValue(COLOR_LIST_KEY)!];
    }
    return [...colorPaletteList];
  });

  const changeNewColor = (
    color: ColorResult,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    e.stopPropagation();
    setNewColor(color.hex);
  };

  const toggleColorPicker = (e?: React.MouseEvent<HTMLElement>) => {
    e?.stopPropagation();
    if (showColorPicker) {
      addColor();
    }
    setShowColorPicker((prev) => !prev);
  };

  const addColor = () => {
    if (!colorList.find((color) => color.colorCode === newColor)) {
      const newList = [
        ...colorList,
        {
          id: nanoid(),
          type: "color",
          colorCode: newColor,
        },
      ];
      setValue(COLOR_LIST_KEY, newList);
      setColorList(newList);
    }
  };

  const removeColor = (id: string) => {
    const newList = colorList.filter((color) => color.id !== id);
    setValue(COLOR_LIST_KEY, newList);
    setColorList(newList);
    setClicked(false);
  };

  const onClearColorClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (!data.selectedItems[0]) {
      return;
    }
    if (e.shiftKey) {
      data.selectedItems[0].attrs.stroke = undefined;
    } else {
      data.selectedItems[0].attrs.fill = "transparent";
    }
    updateItem(
      data.selectedItems[0].id(),
      (attrs) => data.selectedItems[0].attrs
    );
  };
  return (
    <div
      className="absolute bottom-12 p-2 bg-white rounded-lg bshadow"
      style={{
        width: 300,
        left: -100,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex-col">
        <h6>
          {getTranslation("widget", "colorPalette", "name")}
          <OverlayTrigger
            placement="bottom"
            overlay={
              <Tooltip id="tooltip-clear-color">
                {getTranslation("widget", "colorPalette", "addColor", "name")}
              </Tooltip>
            }
          >
            <Button
              className={[
                colorStyles.transparentDarkColorTheme,
                borderStyles.none,
                displayStyles["inline-block"],
                sizeStyles.width10,
                spaceStyles.p0,
                spaceStyles.ml1rem,
                alignStyles["text-left"],
              ].join(" ")}
              onClick={toggleColorPicker}
            >
              <i className="bi-plus text-black" />
            </Button>
          </OverlayTrigger>
        </h6>
        {showColorPicker && (
          <SketchPicker
            color={newColor}
            onChange={changeNewColor}
            onChangeComplete={changeNewColor}
            className={[
              positionStyles.absolute,
              positionStyles.left0,
              positionStyles.zIndex3,
            ].join(" ")}
          />
        )}
        <div className="grid grid-cols-6 gap-2">
          {colorList.map((_data) => (
            <ColorPaletteThumbnail
              key={`colorPalette-thumbnail-${_data.id}`}
              data={{
                id: _data.id,
                "data-item-type": "color",
                colorCode: _data.colorCode,
                selectedItems: data.selectedItems,
              }}
              setClicked={setClicked}
              clicked={clicked}
              setCoords={setCoords}
              setContextData={setContextData}
            />
          ))}
        </div>
        <ColorPaletteOpacitySlider
          data={{
            "data-item-type": "opacity",
            selectedItems: data.selectedItems,
          }}
        />
        {/*     <ColorPaletteBrightnessSlider
          data={{
            "data-item-type": "brightness",
            selectedItems: data.selectedItems,
          }}
        /> */}
        {data?.itemType === "image" && (
          <ColorPaletteGrayScaleToggle
            data={{
              "data-item-type": "grayScale",
              selectedItems: data.selectedItems,
            }}
          />
        )}
      </div>
      {clicked && (
        <ColorsContextMenu
          top={coords.y}
          left={coords.x}
          removeColor={() => removeColor(contextData!.colorId)}
        />
      )}
    </div>
  );
};

export default ColorPaletteWidget;

const ColorPaletteThumbnail: React.FC<{
  data: ColorPaletteKind;
  clicked: boolean;
  setCoords: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  setClicked: React.Dispatch<React.SetStateAction<boolean>>;
  setContextData: React.Dispatch<React.SetStateAction<any>>;
}> = ({
  data: { id, ...data },
  setClicked,
  setContextData,
  setCoords,
  clicked,
}) => {
  const { updateItem } = useItem();

  const onClickColorBlock = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    window.getSelection()?.removeAllRanges();
    data.selectedItems.forEach((item) => {
      if (e.shiftKey) {
        item.attrs.stroke = data.colorCode;
      } else {
        item.attrs.fill = data.colorCode;
      }
      updateItem(item.id(), () => item.attrs);
    });
    data.selectedItems[0].getStage()?.batchDraw();
  };

  return (
    <Figure
      as={Col}
      className={[alignStyles.absoluteCenter, alignStyles.wrapTrue].join(" ")}
    >
      <div
        data-tooltip-target="tooltip-color"
        data-tooltip-placement="bottom"
        onClick={onClickColorBlock}
        className="flex items-center justify-center rounded-lg border-2 border-gray-200  cursor-pointer transition-all duration-300"
        style={{ width: 40, height: 40 }}
        onContextMenu={(e) => {
          e.preventDefault();
          if (clicked) {
            setClicked(false);
            return;
          }
          const { clientX, clientY } = e;
          const boundingRect = e.target
            .closest("#popup")
            .getBoundingClientRect();
          const adjustedX = clientX - boundingRect.left;
          const adjustedY = clientY - boundingRect.top;
          setContextData({ colorId: id });
          setCoords({ x: adjustedX, y: adjustedY });
          setClicked(true);
        }}
      >
        <div
          style={{ backgroundColor: data.colorCode }}
          className="duration-300 hover:scale-90 w-full h-full rounded-md"
        />
      </div>
      <div
        id="tooltip-color"
        role="tooltip"
        className="duration-300 transition-opacity absolute z-10 invisible text-[#333] inline-block px-2 py-1 text-xs font-medium bg-gray-50 bshadow rounded-lg shadow-sm opacity-0 tooltip"
      >
        {`${data.colorCode}`}
      </div>
      {/*   <Figure.Caption
        className={[fontStyles.fontHalf1em, "text-center"].join(" ")}
      >
        {`${data.colorCode}`}
      </Figure.Caption> */}
    </Figure>
  );
};

const ColorPaletteOpacitySlider: React.FC<{
  data: Omit<Omit<ColorPaletteKind, "colorCode">, "id">;
}> = ({ data }) => {
  const { updateItem } = useItem();
  const { getTranslation } = useI18n();

  const [opacity, setOpacity] = useState(
    data.selectedItems[0] ? data.selectedItems[0].attrs.opacity * 100 : 100
  );

  useEffect(() => {
    setOpacity(
      data.selectedItems[0] &&
        data.selectedItems[0].attrs.opacity !== undefined &&
        data.selectedItems[0].attrs.opacity !== null
        ? data.selectedItems[0].attrs.opacity * 100
        : 100
    );
  }, [data.selectedItems]);

  const onChangeOpacity = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpacity(parseInt(e.currentTarget.value));
    if (data.selectedItems.length === 0) {
      return;
    }
    data.selectedItems.forEach((item) => {
      item.opacity(parseInt(e.currentTarget.value) * 0.01);
      item.attrs.opacity = parseInt(e.currentTarget.value) * 0.01;
      updateItem(item.id(), () => item.attrs);
    });
    data.selectedItems[0].getStage()?.batchDraw();
  };

  return (
    <div className="flex items-center mt-3">
      <span className="mr-3">
        <OpacityIcon color={"#999"} size={26} />
      </span>
      <span className="max-w-[60px]">
        <RangeSlider
          className="custom-range"
          value={opacity}
          onChange={onChangeOpacity}
        />
      </span>
    </div>
  );
};

const ColorPaletteBrightnessSlider: React.FC<{
  data: Omit<Omit<ColorPaletteKind, "colorCode">, "id">;
}> = ({ data }) => {
  const { updateItem } = useItem();
  const { getTranslation } = useI18n();

  const [brightness, setBrightNess] = useState(
    data.selectedItems[0] && data.selectedItems[0].attrs.brightness
      ? data.selectedItems[0].attrs.brightness * 100
      : 0
  );

  useEffect(() => {
    setBrightNess(
      data.selectedItems[0] &&
        data.selectedItems[0].attrs.brightness !== undefined &&
        data.selectedItems[0].attrs.brightness !== null
        ? data.selectedItems[0].attrs.brightness * 100
        : 0
    );
  }, [data.selectedItems]);

  const onChangeBrightness = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrightNess(parseInt(e.currentTarget.value));
    if (data.selectedItems.length === 0) {
      return;
    }
    data.selectedItems.forEach((item) => {
      item.brightness(parseInt(e.currentTarget.value) * 0.01);
      item.attrs.brightness = parseInt(e.currentTarget.value) * 0.01;
      updateItem(item.id(), () => item.attrs);
    });
    data.selectedItems[0].getStage()?.batchDraw();
  };

  return (
    <Col>
      <h6>{getTranslation("widget", "colorPalette", "brightness", "name")}</h6>
      <RangeSlider
        tooltipLabel={(value) => `${value}%`}
        value={brightness}
        onChange={onChangeBrightness}
      />
    </Col>
  );
};

const ColorPaletteGrayScaleToggle: React.FC<{
  data: Omit<Omit<ColorPaletteKind, "colorCode">, "id">;
}> = ({ data }) => {
  const { updateItem } = useItem();
  const { getTranslation } = useI18n();
  const [grayScale, setGrayScale] = useState<boolean>(
    !!(
      data.selectedItems[0] &&
      data.selectedItems[0].filters() &&
      data.selectedItems[0]
        .filters()
        .find((_filter) => _filter === Konva.Filters.Grayscale)
    )
  );

  const onChangeGrayScale = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGrayScale(e.currentTarget.checked);
    if (data.selectedItems.length === 0) {
      return;
    }
    let newFilters: Filter[] = [];
    if (
      data.selectedItems[0]
        .filters()
        .find((_filter) => _filter === Konva.Filters.Grayscale)
    ) {
      data.selectedItems[0].filters(
        data.selectedItems[0]
          .filters()
          .filter((_filter: Filter) => _filter !== Konva.Filters.Grayscale)
      );
      newFilters = data.selectedItems[0]
        .filters()
        .filter((_filter) => _filter !== Konva.Filters.Grayscale);
    } else {
      data.selectedItems[0].filters([
        ...data.selectedItems[0].filters(),
        Konva.Filters.Grayscale,
      ]);
      newFilters = [
        ...data.selectedItems[0].filters(),
        Konva.Filters.Grayscale,
      ];
    }
    updateItem(data.selectedItems[0].id(), () => ({
      ...data.selectedItems[0].attrs,
      _filters: newFilters.map((_filter: Filter) => _filter.name),
    }));
    data.selectedItems[0].getStage()?.batchDraw();
  };

  useEffect(() => {
    setGrayScale(
      !!(
        data.selectedItems[0] &&
        data.selectedItems[0].filters() &&
        data.selectedItems[0]
          .filters()
          .find((_filter) => _filter === Konva.Filters.Grayscale)
      )
    );
  }, [data.selectedItems]);

  return (
    <Col>
      <h6>{getTranslation("widget", "colorPalette", "grayScale", "name")}</h6>
      <Form>
        <Form.Check
          checked={grayScale}
          onChange={onChangeGrayScale}
          type="switch"
          label=""
          id="grayScaleSwitch"
        />
      </Form>
    </Col>
  );
};

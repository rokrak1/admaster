import React from "react";
import { Col, Figure, Row } from "react-bootstrap";
import { Node, NodeConfig } from "konva/lib/Node";
import { Group } from "konva/lib/Group";
import exportList from "@/Builder/config/export.json";
import alignStyles from "@/Builder/style/align.module.css";
import fontStyles from "@/Builder/style/font.module.css";
import sizeStyles from "@/Builder/style/size.module.css";
import { WidgetKind } from "../Widget";
import { SettingBarProps } from "..";
import useSelection from "@/Builder/hook/useSelection";
import useStage from "@/Builder/hook/useStage";
import useI18n from "@/Builder/hook/usei18n";
import cloneDeep from "lodash/cloneDeep";
import { useDispatch, useSelector } from "react-redux";
import { dataFeedAction } from "@/Builder/../redux/dataFeed";
import useImageAsset from "@/Builder/hook/useImageAsset";
import {
  StageData,
  stageDataSelector,
} from "@/Builder/../redux/currentStageData";
import { motion } from "framer-motion";
import { PreviewIcon, SaveIcon } from "@/common/icons";
import { createTemplate, updateTemplate } from "@/api/template";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { StoreState } from "@/redux/store";
import { dataActions } from "@/redux/data";
import axios from "axios";
import Konva from "konva";
import api from "@/api";

export type ExportKind = {
  "data-item-type": string;
  id: string;
  icon?: string;
  name: string;
  selectedItems: Node<NodeConfig>[];
  clearSelection: ReturnType<typeof useSelection>["clearSelection"];
  stageRef: ReturnType<typeof useStage>["stageRef"];
  stageData: StageData[];
  templateName: string;
};

type ExportWidgetProps = {
  data: WidgetKind & SettingBarProps;
};

const ExportWidget: React.FC<ExportWidgetProps> = ({ data }) => (
  <Col>
    <Row>
      {exportList.map((_data) => (
        <ExportThumbnail
          key={`export-thumbnail-${_data.id}`}
          data={{
            id: _data.id,
            name: _data.name,
            "data-item-type": "export",
            selectedItems: data.selectedItems,
            clearSelection: data.clearSelection,
            stageRef: data.stageRef,
          }}
        />
      ))}
    </Row>
  </Col>
);

export default ExportWidget;

function convertImageToBase64(imageElement: HTMLImageElement) {
  return new Promise((resolve, reject) => {
    // Create a canvas and use it to convert the image to Base64
    const canvas = document.createElement("canvas");
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(imageElement, 0, 0);
    const dataURL = canvas.toDataURL("image/png");

    resolve(dataURL);
  });
}

export const ExportThumbnail: React.FC<{
  data: ExportKind;
}> = ({ data }) => {
  const dispatch = useDispatch();
  const { getTranslation } = useI18n();
  const { getImageAssetSrc } = useImageAsset();
  const { pathname } = useLocation();
  const stageData = useSelector(stageDataSelector.selectAll);
  const { dataFeed, templates } = useSelector((state: StoreState) => ({
    dataFeed: state.dataFeed,
    templates: state.data.templates,
  }));

  const downloadSelected = async (children: Node<NodeConfig>[]) => {
    const frame = children?.find(
      (child) => child.attrs["data-item-type"] === "frame"
    );
    if (frame) {
      data.clearSelection();

      let { x: xFrame, y: yFrame } = frame.attrs;

      let dataItemType = ["shape", "image", "text"];

      console.log("KONVA:::", children);
      let filteredChildren = {
        text: [],
        image: [],
      };

      for (let child of children) {
        let type = child.attrs["data-item-type"];
        if (dataItemType.includes(type)) {
          let {
            x,
            y,
            width,
            height,
            scaleX,
            scaleY,
            rotation,
            fill,
            stroke,
            strokeWidth,
            opacity,
          } = child.attrs;
          let zIndex = child.getZIndex();
          let itemData = {
            x: x - xFrame,
            y: y - yFrame,
            width,
            height,
            scaleX: scaleX || 1,
            scaleY: scaleY || 1,
            rotation: rotation || 0,
            fill,
            stroke: stroke || null,
            strokeWidth: strokeWidth || 0,
            opacity,
            zIndex,
            type,
            varId: null,
          };
          if (type === "text") {
            itemData["text"] = child.text();
            itemData["fontSize"] = child.fontSize();
            itemData["color"] = child.colorKey;
            itemData["fontFamily"] = child.fontFamily();
            filteredChildren["text"].push(itemData);
          } else if (type === "image") {
            let isVar = stageData.find((d) => d.id === child.id())?.varId;
            if (isVar) {
              itemData["varId"] = isVar;
            }
            itemData["image"] = await convertImageToBase64(child!.image());
            filteredChildren["image"].push(itemData);
          } else if (type === "shape") {
            let shapeImage = child.toDataURL();
            itemData["image"] = shapeImage;
            filteredChildren["image"].push(itemData);
          }
        }
      }

      const requestData = {
        frame: {
          ...frame.attrs,
          x: 0,
          y: 0,
        },
        ...filteredChildren,
      };
      console.log("REQUEST DATA", requestData);
      /*       const uri = stage.toDataURL({
        x: frame.getClientRect().x,
        y: frame.getClientRect().y,
        width: frame.attrs.width * stage.scaleX(),
        height: frame.attrs.height * stage.scaleY(),
        pixelRatio: 1 / stage.scaleX(),

         // Save image for preview in browser
        link.download = "export.png";
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }); */
      api
        .post(
          "http://localhost:8000/api/get-preview",
          {
            ...requestData,
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => response.data)
        .then((data) => {
          console.log("RETURNED data", data);
          let { image } = data;
          if (!image) return;
          let images = "data:image/png;base64," + image;
          console.log(images);
          //dispatch(dataActions.setShowPreview(true));
          //dispatch(dataFeedAction.addPreviewImage(images));
        })
        .catch((error) => console.error("Error:", error));

      return;
    }
    toast.error("Error creating preview");
  };

  const downloadAll = () => {
    // Create copy of layer where vars are removed and settings are stored into varsSettings
    const initLayer = data.stageRef.current.getChildren()[0];

    let initGroup =
      initLayer.getChildren((child) => child instanceof Konva.Group)[0] || null;

    if (!initGroup) {
      toast.error("Error creating preview");
      return;
    }

    const group = cloneDeep(initGroup);

    downloadSelected(group.children as Group);

    return;
  };

  const onClickDownload = () => {
    downloadAll();
    // downloadSelected();
  };

  const saveTemplate = async () => {
    let name = data.templateName;

    if (!name) {
      return;
    }

    // Create new template if new
    let sequanceId = pathname.split("/").pop();
    if (sequanceId === "new") {
      let [res, err] = await createTemplate(name, data.stageData);
      if (err) {
        toast.error("Error saving template");
        return;
      }
      console.log(res);
      dispatch(dataActions.addTemplate(res));
    }

    // Update template if existing
    let selectedTemplate = templates.find(
      (template) => template.sequance === sequanceId
    );
    console.log("selectedTemplate", selectedTemplate, sequanceId, templates);
    if (selectedTemplate) {
      let [res, err] = await updateTemplate(
        selectedTemplate.sequance,
        name,
        data.stageData
      );
      if (err) {
        toast.error("Error saving template");
        return;
      }
      dispatch(dataActions.updateTemplate(res));
      toast.success(" Template saved");
    }
  };

  return (
    <Figure
      as={Col}
      className={[alignStyles.absoluteCenter, alignStyles.wrapTrue].join(" ")}
    >
      <div className="flex gap-x-2">
        <motion.button
          onClick={onClickDownload}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          className="flex gap-x-2 px-2 items-center py-1 rounded-md bshadow bg-gradient-to-r from-blue-400 from-0% to-indigo-400 to-100% text-white font-semibold"
        >
          <PreviewIcon color="white" />
          Preview
        </motion.button>
        <motion.button
          onClick={saveTemplate}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          className="flex gap-x-2 px-2 items-center py-1 rounded-md bshadow bg-gradient-to-r from-teal-400 from-0% to-emerald-400 to-100% text-white font-semibold"
        >
          <SaveIcon color="white" />
          Save
        </motion.button>
      </div>
    </Figure>
  );
};

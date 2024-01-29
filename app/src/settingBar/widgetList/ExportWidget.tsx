import React from "react";
import { Col, Figure, Row } from "react-bootstrap";
import { Node, NodeConfig } from "konva/lib/Node";
import { Group } from "konva/lib/Group";
import exportList from "../../config/export.json";
import alignStyles from "../../style/align.module.css";
import fontStyles from "../../style/font.module.css";
import sizeStyles from "../../style/size.module.css";
import { WidgetKind } from "../Widget";
import { SettingBarProps } from "..";
import useSelection from "../../hook/useSelection";
import useStage from "../../hook/useStage";
import useI18n from "../../hook/usei18n";
import cloneDeep from "lodash/cloneDeep";
import { useDispatch, useSelector } from "react-redux";
import { dataFeedAction } from "../../redux/dataFeed";
import useImageAsset from "../../hook/useImageAsset";
import { stageDataSelector } from "../../redux/currentStageData";

export type ExportKind = {
  "data-item-type": string;
  id: string;
  icon: string;
  name: string;
  selectedItems: Node<NodeConfig>[];
  clearSelection: ReturnType<typeof useSelection>["clearSelection"];
  stageRef: ReturnType<typeof useStage>["stageRef"];
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
            icon: _data.icon,
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

const ExportThumbnail: React.FC<{
  data: ExportKind;
}> = ({ data }) => {
  const dispatch = useDispatch();
  const { getTranslation } = useI18n();
  const { getImageAssetSrc } = useImageAsset();
  const stageData = useSelector(stageDataSelector.selectAll);
  const dataFeed = useSelector((state) => state.dataFeed);
  const downloadSelected = (
    targetFrame?: Node<NodeConfig> | Group,
    settings?: object
  ) => {
    const link = document.createElement("a");
    const frame =
      targetFrame ??
      data.selectedItems.find(
        (item) => item.attrs["data-item-type"] === "frame"
      );
    if (frame) {
      //console.log(frame, data);
      const stage = frame.getStage()!;
      data.clearSelection();

      const uri = stage.toDataURL({
        x: frame.getClientRect().x,
        y: frame.getClientRect().y,
        width: frame.attrs.width * stage.scaleX(),
        height: frame.attrs.height * stage.scaleY(),
        pixelRatio: 1 / stage.scaleX(),
      });
      if (uri) {
        // Save image for preview in browser
        link.download = "export.png";
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Generate form data for request
        let imagePreviewObject = {
          image: uri,
          settings,
        };
        console.log("start fetch", imagePreviewObject);
        fetch("http://localhost:8000/get-preview/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(imagePreviewObject),
        })
          .then((response) => response.json())
          .then((data) => {
            let { images } = data;
            if (!images) return;
            let transfomedImages = images.map((item) => {
              return "data:image/png;base64," + item;
            });
            dispatch(dataFeedAction.addPreviewImage(transfomedImages));
          })
          .catch((error) => console.error("Error:", error));
      }
    }
  };

  const filterOutVars = (layer) => {
    // Filter out text vars
    let layerChildren = layer.getChildren();

    // Check if there are any text vars inside group
    const vars = layerChildren.filter(
      (item) =>
        item.attrs["data-item-type"] === "text" &&
        item.attrs.text?.includes("%VAR_")
    );

    let varsSettings = [];
    // Get image var settings
    if (vars.length !== 0) {
      varsSettings = vars.map((item) => {
        const text = item.attrs.text;
        const textSplit = text.split("%VAR_");
        const varId = textSplit[1].split("%")[0];
        return {
          type: "text",
          varId: varId?.toLowerCase(),
          attrs: {
            ...item.attrs,
            color: item.colorKey,
            textHeight: item.textHeight,
            textWidth: item.textWidth,
          },
        };
      });
    }

    // Filter out vars so they do not get displayed in exported image
    layer.children = layerChildren.filter(
      (item) => !item.attrs.text?.includes("%VAR_")
    );

    // IMAGE - Filter out image vars inside group object
    const group = layer.getChildren(
      (item) => item.attrs.name === "label-group"
    );

    // Check if there are any image vars inside group
    const varsImages = group[0].children
      .map((item) => {
        console.log("item:", item);
        if (item.attrs["data-item-type"] === "image") {
          let id = item.attrs.id;
          let found = stageData.find((item) => item.id === id);
          console.log("found:", found);
          if (!found) return null;
          if (found.varId)
            return {
              ...item,
              varId: found.varId,
            };
        }
        return null;
      })
      .filter((item) => item !== null);
    let varsImageSettings = [];
    // Get image var settings
    if (varsImages.length !== 0) {
      varsImageSettings = varsImages.map((item) => {
        return {
          type: "image",
          varId: item.varId,
          attrs: item.attrs,
        };
      });

      // Filter out vars so they do not get displayed in exported image
      let groupId = group[0]._id;
      const groupChildIndex = layer.children
        .map((item, index) => {
          if (item._id === groupId) {
            return index;
          }
          return null;
        })
        .filter((item) => item !== null)[0];

      layer.children[groupChildIndex].children = layer.children[
        groupChildIndex
      ].children.filter(
        (item) => !varsImages.find((i) => i.attrs.id === item.attrs.id)
      );
    }

    return { layer, varsSettings: varsSettings.concat(varsImageSettings) };
  };

  const downloadAll = () => {
    // TODO: Image support with removed background
    // TODO: Remove export selected frame option
    // TODO: This code needs to be refactored to support only 1 frame

    // Something wrong with facebook ad frame

    // Create copy of layer where vars are removed and settings are stored into varsSettings
    const initLayer = data.stageRef.current.getChildren()[0];
    console.log("stagedata:", stageData);
    const clonedLayer = cloneDeep(initLayer);
    console.log("LAZER:", clonedLayer);
    const { layer, varsSettings } = filterOutVars(clonedLayer);
    console.log("varSettings:", varsSettings);
    const frames = layer.getChildren(
      (item) => item.attrs.name === "label-group"
    );

    // Generate original template for creative generation
    frames
      .map(
        (frame) =>
          (frame as Group).getChildren(
            (item) => item.attrs.name === "label-target"
          )[0]
      )
      .forEach((frame) => {
        downloadSelected(frame as Node<NodeConfig>, varsSettings);
      });

    // Generate some previews of different products from CSV if provided
    // Used initial layer - vars replaced with csv data
    return;
    dataFeed.data?.slice(0, 3).forEach((item, i) => {
      // If this is first iteration, we cleanup old preview images
      if (i === 0) {
        dispatch(dataFeedAction.clearPreviewImages());
      }

      const clonedLayer = cloneDeep(initLayer);
      replaceVarsWithDataFeed(clonedLayer, item);

      console.log("CONED:", clonedLayer);
      const frames = clonedLayer.getChildren(
        (item) => item.attrs.name === "label-group"
      );

      console.log("FRAMES:", frames);

      frames
        .map(
          (frame) =>
            (frame as Group).getChildren(
              (item) => item.attrs.name === "label-target"
            )[0]
        )
        .forEach((frame) => {
          // For now we will just loop through 3 rows of csv
          downloadSelected(frame as Node<NodeConfig>, true);
        });
    });
  };

  const replaceVarsWithDataFeed = (layer, dataFeedItem) => {
    let layerChildren = layer.getChildren();
    const itemsAndReplacedVars = layerChildren.map((item) => {
      if (
        item.attrs["data-item-type"] === "text" &&
        item.attrs.text?.includes("%VAR_")
      ) {
        const text = item.attrs.text;
        const textSplit = text.split("%VAR_");
        const varName = textSplit[1].split("%")[0];
        item.setText(dataFeedItem[varName?.toLowerCase()]);
        //item._partialText = dataFeedItem[varName?.toLowerCase()];
        return item;
      } else if (item.attrs["name"] === "label-group") {
        let childs = item.getChildren();
        childs.forEach(async (child) => {
          if (child.attrs["data-item-type"] === "image") {
            let id = child.attrs.id;
            let found = stageData.find((item) => item.id === id);
            if (!found) return;
            if (found.varId) {
              let src = dataFeedItem.image_link;

              console.log(src); // myBase64 is the base64 string
              await toDataUrl(src, function (myBase64) {
                child.setImage(myBase64);
              });
            }
          }
        });
      }
      return item;
    });

    layer.children = itemsAndReplacedVars;
  };

  const toDataUrl = async (url, callback) => {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  };

  const onClickDownload = (exportId: string) => () => {
    if (exportId === "export-all-frame") {
      downloadAll();
      return;
    }
    downloadSelected();
  };

  return (
    <Figure
      as={Col}
      onClick={onClickDownload(data.id)}
      className={[alignStyles.absoluteCenter, alignStyles.wrapTrue].join(" ")}
    >
      <i className={`bi-${data.icon}`} style={{ fontSize: 20, width: 25 }} />
      <Figure.Caption
        className={[
          fontStyles.font075em,
          sizeStyles.width100,
          "text-center",
        ].join(" ")}
      >
        {`${getTranslation("widget", "export", data.id, "name")}`}
      </Figure.Caption>
    </Figure>
  );
};

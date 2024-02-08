import React, { useEffect, useMemo, useState } from "react";
import { Transformer } from "react-konva";
import { Node, NodeConfig } from "konva/lib/Node";
import { useHotkeys } from "react-hotkeys-hook";
import { nanoid } from "nanoid";
import { Button, Col, Modal, Row } from "react-bootstrap";
import Header from "./header";
import Layout from "./layout";
import SettingBar from "./settingBar";
import TabGroup from "./tab";
import workModeList from "./config/workMode.json";
import NavBar from "./navBar";
import NavBarButton from "./navBar/NavBarButton";
import View from "./view";
import Frame, { FrameProps } from "./view/frame";
import { StageData } from "../redux/currentStageData";
import useItem from "./hook/useItem";
import { StageDataListItem } from "../redux/StageDataList";
import useStageDataList from "./hook/useStageDataList";
import ImageItem, { ImageItemProps } from "./view/object/image";
import useSelection from "./hook/useSelection";
import useTab from "./hook/useTab";
import useTransformer from "./hook/useTransformer";
import useStage from "./hook/useStage";
import useTool from "./hook/useTool";
import TextItem, { TextItemProps } from "./view/object/text";
import ShapeItem, { ShapeItemProps } from "./view/object/shape";
import IconItem, { IconItemProps } from "./view/object/icon";
import LineItem, { LineItemProps } from "./view/object/line";
import useModal from "./hook/useModal";
import hotkeyList from "./config/hotkey.json";
import useHotkeyFunc from "./hook/useHotkeyFunc";
import useWorkHistory from "./hook/useWorkHistory";
import useI18n from "./hook/usei18n";
import { initialStageDataList } from "../redux/initilaStageDataList";
import Navigation from "./Navigation/Navigation";
import Popup from "./Popup/Popup";
import { useDispatch, useSelector } from "react-redux";
import { popupAction } from "@/redux/popup";
import { StoreState } from "@/redux/store";
import { useLocation, useNavigate } from "react-router-dom";

export type FileKind = {
  "file-id": string;
  title: string;
  data: Record<string, any>[];
};

export type FileData = Record<string, FileKind>;

function App() {
  const [past, setPast] = useState<StageData[][]>([]);
  const [future, setFuture] = useState<StageData[][]>([]);
  const templates = useSelector((state: StoreState) => state.data.templates);
  const { goToFuture, goToPast, recordPast, clearHistory } = useWorkHistory(
    past,
    future,
    setPast,
    setFuture
  );
  const [showPopup, setShowPopup] = useState(true);
  const transformer = useTransformer();
  const { selectedItems, onSelectItem, setSelectedItems, clearSelection } =
    useSelection(transformer);
  const { tabList, onClickTab, onCreateTab, onDeleteTab } = useTab(
    transformer,
    clearHistory
  );
  const { prerenderItems, stageData } = useItem();

  const { initializeFileDataList, updateFileData } = useStageDataList();
  const stage = useStage();
  const modal = useModal();
  const {
    deleteItems,
    copyItems,
    selectAll,
    pasteItems,
    duplicateItems,
    layerDown,
    layerUp,
    flipHorizontally,
    flipVertically,
  } = useHotkeyFunc();
  const { getTranslation } = useI18n();
  const [clipboard, setClipboard] = useState<StageData[]>([]);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const createStageDataObject = (item: Node<NodeConfig>): StageData => {
    const { id } = item.attrs;
    const target =
      item.attrs["data-item-type"] === "frame" ? item.getParent() : item;
    return {
      id: nanoid(),
      attrs: {
        ...(stageData.find((_item) => (_item.attrs.id || _item.id) === id)
          ?.attrs ?? {}),
      },
      className: target.getType(),
      children: [],
    };
  };

  const { getClickCallback } = useTool(
    stage,
    modal,
    selectedItems,
    setSelectedItems,
    transformer,
    createStageDataObject,
    onSelectItem
  );

  const currentTabId = useMemo(
    () => tabList.find((tab) => tab.active)?.id ?? null,
    [tabList]
  );

  const sortedStageData = useMemo(() => {
    // Create a shallow copy of stageData before sorting
    const dataCopy = [...stageData];
    return dataCopy.sort((a, b) => {
      if (a.attrs?.zIndex === b.attrs?.zIndex) {
        if (a.attrs?.zIndex < 0) {
          return b.attrs?.updatedAt - a.attrs?.updatedAt;
        }
        return a.attrs?.updatedAt - b.attrs?.updatedAt;
      }
      return a.attrs?.zIndex - b.attrs?.zIndex;
    });
  }, [stageData]);

  const header = (
    <Header>
      <TabGroup
        onClickTab={onClickTab}
        tabList={tabList}
        onCreateTab={onCreateTab}
        onDeleteTab={onDeleteTab}
      />
    </Header>
  );

  const navBar = (
    /*    <NavBar>
      {workModeList.map((data) => (
        <NavBarButton
          key={`navbar-${data.id}`}
          data={data}
          stage={stage}
          onClick={getClickCallback(data.id)}
        />
      ))}
    </NavBar> */
    <Navigation
      data={workModeList}
      onClick={getClickCallback}
      stageRef={stage.stageRef}
      stageData={stageData}
      clearSelection={clearSelection}
      selectedItems={selectedItems}
    />
  );

  const hotkeyModal = (
    <Modal show={modal.displayModal} onHide={modal.closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Keyboard Shortcut</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: 0 }}>
        <div className="flex flex-col">
          {hotkeyList.map((hotkey, i) => (
            <div
              key={hotkey.name}
              className={`flex items-center p-3 justify-between ${
                i % 2 === 0 ? "bg-gray-100" : "bg-white"
              }`}
            >
              <h6>{getTranslation("hotkey", hotkey.id, "name")}</h6>
              <div className="flex items-center justify-content-end gap-x-3">
                {hotkey.keys.map((key, idx) => (
                  <React.Fragment key={hotkey.name + key}>
                    {idx !== 0 && "+"}
                    <Col xs="auto" className="align-items-center">
                      <Button disabled>{key}</Button>
                    </Col>
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );

  const settingBar = (
    <SettingBar
      selectedItems={selectedItems}
      clearSelection={clearSelection}
      stageRef={stage.stageRef}
    />
  );

  const renderObject = (item: StageData) => {
    switch (item.attrs["data-item-type"]) {
      case "frame":
        return (
          <Frame
            key={`frame-${item.id}`}
            data={item as FrameProps["data"]}
            onSelect={onSelectItem}
            setShowPopup={setShowPopup}
          />
        );
      case "image":
        return (
          <ImageItem
            key={`image-${item.id}`}
            data={item as ImageItemProps["data"]}
            onSelect={onSelectItem}
            setShowPopup={setShowPopup}
          />
        );
      case "text":
        return (
          <TextItem
            key={`image-${item.id}`}
            data={item as TextItemProps["data"]}
            transformer={transformer}
            onSelect={onSelectItem}
            setShowPopup={setShowPopup}
          />
        );
      case "shape":
        return (
          <ShapeItem
            key={`shape-${item.id}`}
            data={item as ShapeItemProps["data"]}
            transformer={transformer}
            onSelect={onSelectItem}
            setShowPopup={setShowPopup}
          />
        );
      case "icon":
        return (
          <IconItem
            key={`icon-${item.id}`}
            data={item as IconItemProps["data"]}
            transformer={transformer}
            onSelect={onSelectItem}
            setShowPopup={setShowPopup}
          />
        );
      case "line":
        return (
          <LineItem
            key={`line-${item.id}`}
            data={item as LineItemProps["data"]}
            transformer={transformer}
            onSelect={onSelectItem}
            setShowPopup={setShowPopup}
          />
        );
      default:
        return null;
    }
  };

  useHotkeys(
    "ctrl+k",
    (e) => {
      e.preventDefault();
      layerUp(selectedItems);
    },
    {},
    [selectedItems]
  );

  useHotkeys(
    "ctrl+m",
    (e) => {
      e.preventDefault();
      layerDown(selectedItems);
    },
    {},
    [selectedItems]
  );

  useHotkeys(
    "ctrl+d",
    (e) => {
      e.preventDefault();
      duplicateItems(selectedItems, createStageDataObject);
    },
    {},
    [selectedItems, stageData]
  );

  useHotkeys(
    "ctrl+c",
    (e) => {
      e.preventDefault();
      copyItems(selectedItems, setClipboard, createStageDataObject);
    },
    {},
    [selectedItems, stageData, clipboard]
  );

  useHotkeys(
    "ctrl+a",
    (e) => {
      e.preventDefault();
      selectAll(stage, onSelectItem);
    },
    {},
    [selectedItems]
  );

  useHotkeys(
    "ctrl+v",
    (e) => {
      e.preventDefault();
      pasteItems(clipboard);
    },
    {},
    [clipboard]
  );

  useHotkeys(
    "ctrl+z",
    (e) => {
      e.preventDefault();
      goToPast();
    },
    {},
    [goToPast]
  );

  useHotkeys(
    "ctrl+y",
    (e) => {
      e.preventDefault();
      goToFuture();
    },
    {},
    [goToFuture]
  );

  useHotkeys(
    "shift+h",
    (e) => {
      e.preventDefault();
      flipHorizontally(selectedItems);
    },
    {},
    [selectedItems]
  );

  useHotkeys(
    "shift+v",
    (e) => {
      e.preventDefault();
      flipVertically(selectedItems);
    },
    {},
    [selectedItems]
  );

  useHotkeys(
    "backspace",
    (e) => {
      e.preventDefault();
      deleteItems(selectedItems, setSelectedItems, transformer.transformerRef);
    },
    { enabled: Boolean(selectedItems.length) },
    [selectedItems, transformer.transformerRef.current]
  );

  useEffect(() => {
    window.addEventListener("beforeunload", (e) => {
      e.preventDefault();
      e.returnValue = "";
    });
    onCreateTab(undefined, initialStageDataList[0] as StageDataListItem);
    initializeFileDataList(initialStageDataList);
    stage.stageRef.current.setPosition({
      x: Math.max(Math.ceil(stage.stageRef.current.width() - 1280) / 2, 0),
      y: Math.max(Math.ceil(stage.stageRef.current.height() - 760) / 2, 0),
    });
    stage.stageRef.current.batchDraw();
  }, []);

  useEffect(() => {
    if (currentTabId) {
      updateFileData({
        id: currentTabId,
        data: stageData,
      });
    }
    recordPast(stageData);
  }, [stageData]);

  useEffect(() => {
    const transformerNode = transformer.transformerRef.current;
    if (transformerNode) {
      transformerNode.on("transformstart", (e) => {
        setShowPopup(false);
      });

      transformerNode.on("transformend", (e) => {
        setShowPopup(true);
      });

      return () => {
        // Clean up the event listener when the component unmounts or transformer changes
        transformerNode.off("transformend");
      };
    }
  }, []);

  useEffect(() => {
    // Prerender stageData
    let sequanceId = pathname.split("/").pop();
    // If new template dont render
    if (sequanceId === "new") return;

    if (sequanceId && parseInt(sequanceId!)) {
      let localTemplates = localStorage.getItem("templates");
      if (!localTemplates) localTemplates = "[]";
      let allTemplates = !templates.length
        ? JSON.parse(localTemplates)
        : templates;
      let selectedTemplate = allTemplates.find(
        (template) => template.sequance === sequanceId
      );
      if (!selectedTemplate)
        return navigate("/builder/edit/new", { replace: true });
      let template = selectedTemplate!.template;
      prerenderItems(template);
      return;
    }
    navigate("/builder/edit/new", { replace: true });
  }, []);

  return (
    <Layout header={header} navBar={navBar} settingBar={settingBar}>
      {hotkeyModal}
      <View onSelect={onSelectItem} stage={stage}>
        {stageData.length
          ? sortedStageData.map((item) => renderObject(item))
          : null}
        <Transformer
          ref={transformer.transformerRef}
          keepRatio
          shouldOverdrawWholeArea
          boundBoxFunc={(_, newBox) => newBox}
          onTransformEnd={transformer.onTransformEnd}
          borderStroke="#4d7ef7" // Customizing the border color
          borderStrokeWidth={2}
          anchorStroke="#dfdfdf"
          anchorFill="white"
          anchorSize={14}
          anchorCornerRadius={15}
          padding={5}
        />
      </View>
      {showPopup && <Popup selectedItems={selectedItems} />}
    </Layout>
  );
}

export default App;

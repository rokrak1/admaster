import { useDispatch, useSelector } from "react-redux";
import App from "./App";
import { DataFeed, dataFeedAction } from "../redux/dataFeed";
import Papa from "papaparse";
import { StoreState } from "../redux/store";
import TemplatePreview from "./TemplatePreview/TemplatePreview";
import { useEffect, useState } from "react";
import Navigation from "./Navigation/Navigation";
import { dataActions } from "@/redux/data";

const AppWrapper = () => {
  const dispatch = useDispatch();
  const { showPreview } = useSelector((state: StoreState) => state.data);
  const { dataFeed, dataFeedTemplatePreviewImages } = useSelector<
    StoreState,
    DataFeed
  >((state) => state.dataFeed);

  const parseCSV = (csv: File) => {
    Papa.parse(csv, {
      complete: (result) => {
        dispatch(dataFeedAction.parseCSV(result));
      },
      header: true,
      skipEmptyLines: true,
    });
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("csv_file", file);

    fetch("http://localhost:8000/upload-csv/", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => console.log("CSVRESPONSE:", data))
      .catch((error) => console.error("Error:", error));

    dispatch(
      dataFeedAction.setCSV({
        csv: file,
      })
    );
    parseCSV(file);

    event.target.value = "";
  };

  useEffect(() => {
    dispatch(dataActions.initializeTemplates());
  }, []);

  return (
    <div className="w-full h-full bg-[#EDF2F7]">
      {/*  <input type="file" accept=".csv" onChange={onFileChange} />
      <button
        className="p-3 bg-blue-200"
        onClick={() => setPreviewOpened(!previewOpened)}
      >
        OPEN
      </button> */}
      <App />
      {(dataFeedTemplatePreviewImages.length && showPreview && (
        <TemplatePreview urls={dataFeedTemplatePreviewImages} />
      )) ||
        null}
    </div>
  );
};

export default AppWrapper;

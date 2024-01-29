import { useDispatch, useSelector } from "react-redux";
import App from "./App";
import { DataFeed, dataFeedAction } from "./redux/dataFeed";
import Papa from "papaparse";
import { StoreState } from "./redux/store";
import TemplatePreview from "./TemplatePreview/TemplatePreview";
import { useState } from "react";

const AppWrapper = () => {
  const dispatch = useDispatch();
  const [previewOpened, setPreviewOpened] = useState(true);
  const { dataFeed, dataFeedTemplatePreviewImages } = useSelector<
    StoreState,
    DataFeed
  >((state) => state.dataFeed);
  console.log("DF:", dataFeed);

  const parseCSV = (csv: File) => {
    Papa.parse(csv, {
      complete: (result) => {
        console.log("Parsed: ", result);
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

  console.log("dataFeedTemplatePreviewImages:", dataFeedTemplatePreviewImages);
  return (
    <div className="w-full h-full">
      <input type="file" accept=".csv" onChange={onFileChange} />
      <App />
      {dataFeedTemplatePreviewImages.length && previewOpened && (
        <TemplatePreview
          urls={dataFeedTemplatePreviewImages}
          setPreviewOpened={setPreviewOpened}
        />
      )}
    </div>
  );
};

export default AppWrapper;

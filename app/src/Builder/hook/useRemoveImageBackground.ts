import { MutableRefObject, memo, useCallback, useEffect, useRef } from "react";
import * as deeplab from "@tensorflow-models/deeplab";
import { DeepLabOutput } from "@tensorflow-models/deeplab/dist/types";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-converter";
import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs-backend-cpu";
import { useDispatch, useSelector } from "react-redux";
import { StoreState } from "@/redux/store";
import { configAction } from "@/redux/config";

async function loadModel() {
  console.log("loadmodel");
  return await deeplab.load({ base: "pascal", quantizationBytes: 2 });
}

async function predict(
  model: deeplab.SemanticSegmentation,
  image: HTMLImageElement
) {
  const prediction = await model.segment(image);
  const result = renderPrediction(image, prediction);
  return result;
}

function removeColor(
  color: number[],
  originalImage: HTMLImageElement,
  mask: ImageData,
  width: number,
  height: number
) {
  const originalCanvas = document.createElement("canvas");
  const maskCanvas = document.createElement("canvas");
  const ctx = originalCanvas.getContext("2d");
  const maskCtx = maskCanvas.getContext("2d");

  originalCanvas.width = width;
  originalCanvas.height = height;
  maskCanvas.width = width;
  maskCanvas.height = height;

  ctx!.drawImage(originalImage, 0, 0, width, height);
  maskCtx!.putImageData(mask, 0, 0);

  const canvasData = ctx!.getImageData(0, 0, width, height);
  const pix = canvasData.data;
  const maskCanvasData = maskCtx!.getImageData(0, 0, width, height);
  const maskPix = maskCanvasData.data;

  for (let i = 0, n = maskPix.length; i < n; i += 4) {
    if (
      maskPix[i] === color[0] &&
      maskPix[i + 1] === color[1] &&
      maskPix[i + 2] === color[2]
    ) {
      pix[i + 3] = 0;
    }
  }

  ctx!.putImageData(canvasData, 0, 0);
  return originalCanvas.toDataURL();
}

function renderPrediction(image: HTMLImageElement, prediction: DeepLabOutput) {
  const { height, width, segmentationMap } = prediction;

  const segmentationMapData = new ImageData(segmentationMap, width, height);
  const imageWithNoBackground = removeColor(
    [0, 0, 0],
    image,
    segmentationMapData,
    width,
    height
  );
  return imageWithNoBackground;
}

const useRemoveImageBackground = () => {
  const dispatch = useDispatch();
  const config = useSelector((state: StoreState) => state.config);
  const model = useRef() as MutableRefObject<deeplab.SemanticSegmentation>;

  useEffect(() => {
    (async () => {
      if (!config.model) {
        let _model = await loadModel();
        model.current = _model;
        dispatch(configAction.setModel(_model));
      } else {
        model.current = config.model;
      }
    })();
  }, []);

  // Inside your hook
  const autoRemoveBackground = useCallback(async (image: HTMLImageElement) => {
    if (!model.current) {
      console.error("Model is not loaded yet");
      return;
    }
    return await predict(model.current, image);
  }, []);

  return {
    autoRemoveBackground,
  };
};

export default useRemoveImageBackground;

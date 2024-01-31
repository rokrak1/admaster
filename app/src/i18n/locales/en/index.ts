import widget from "./widget.json";
import hotkey from "./hotkey.json";
import workMode from "@/Builder/config/workMode.json";

export default {
  widget,
  hotkey,
  workMode: workMode.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {}),
};

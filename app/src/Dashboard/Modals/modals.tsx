import TemplateSaveModal from "./TemplateSaveModal";
import TemplatesPickerModal from "./TemplatesPickerModal";

export enum Modals {
  TEMPLATE_PICKER = "template-picker",
  TEMPLATE_SAVE = "template-save",
}

type ModalsMapping = Record<Modals, React.FC>;

export const modals: ModalsMapping = {
  [Modals.TEMPLATE_PICKER]: TemplatesPickerModal,
  [Modals.TEMPLATE_SAVE]: TemplateSaveModal,
};

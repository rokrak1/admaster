import TemplatesPickerModal from "./TemplatesPickerModal";

export enum Modals {
  TEMPLATE_PICKER = "template-picker",
}

type ModalsMapping = Record<Modals, React.FC>;

export const modals: ModalsMapping = {
  [Modals.TEMPLATE_PICKER]: TemplatesPickerModal,
};

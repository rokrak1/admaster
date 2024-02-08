import TemplateDeleteModal from "./TemplateDeleteModal";
import TemplateRenameModal from "./TemplateRenameModal";
import TemplatesPickerModal from "./TemplatesPickerModal";

export enum Modals {
  TEMPLATE_PICKER = "template-picker",
  TEMPLATE_DELETE = "template-delete",
  TEMPLATE_RENAME = "template-rename",
}

type ModalsMapping = Record<Modals, React.FC>;

export const modals: ModalsMapping = {
  [Modals.TEMPLATE_PICKER]: TemplatesPickerModal,
  [Modals.TEMPLATE_RENAME]: TemplateRenameModal,
  [Modals.TEMPLATE_DELETE]: TemplateDeleteModal,
};
